import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const repository = path.dirname(fileURLToPath(import.meta.url));
const source = repository;
const publicExtension = /\.(?:html|css|js|svg|webp|png|jpe?g|gif|ico|woff2?|ttf|otf|mp4|webm)$/i;
const output = path.resolve(process.argv[2] || path.join(repository, '..', 'hostinger-packages'));
const relativeOutput = path.relative(repository, output);
if (!relativeOutput.startsWith(`..${path.sep}`) && relativeOutput !== '..' && !path.isAbsolute(relativeOutput)) {
  throw new Error('Choose an output directory outside the repository to preserve its files.');
}

async function files(directory, prefix = '', publicOnly = true) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (publicOnly && !prefix && entry.name !== 'assets' && !publicExtension.test(entry.name)) continue;
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), relative, publicOnly));
    else if (entry.isFile()) result.push(relative);
    else throw new Error(`Unsupported entry (only regular files/directories allowed): ${relative}`);
  }
  return result.sort();
}

async function hashes(directory, names) {
  return Promise.all(names.map(async name => [name, createHash('sha256')
    .update(await fs.readFile(path.join(directory, name))).digest('hex')]));
}

// zip/unzip use their normal CRC validation; no hosting credentials are needed.
for (const command of ['zip', 'unzip']) execFileSync(command, ['-v'], { stdio: 'ignore' });
const names = await files(source);
assert(names.includes('index.html'), 'Root index.html is required');
const original = await hashes(source, names);
await fs.mkdir(output, { recursive: true });
const destination = await fs.mkdtemp(path.join(output, 'clinica-jonk-'));
const archive = path.join(destination, 'clinica-jonk-hostinger.zip');
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'clinica-hostinger-'));
try {
  const staging = path.join(temporary, 'site');
  const extracted = path.join(temporary, 'verified');
  await fs.mkdir(staging);
  for (const name of names) {
    const target = path.join(staging, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(source, name), target);
  }
  execFileSync('zip', ['-q', '-r', archive, '.'], { cwd: staging, stdio: 'inherit' });
  execFileSync('unzip', ['-t', archive], { stdio: 'pipe' });
  await fs.mkdir(extracted);
  execFileSync('unzip', ['-q', archive, '-d', extracted]);
  assert.deepEqual(await files(extracted, '', false), names, 'ZIP file list must match the public root');
  assert.deepEqual(await hashes(extracted, names), original, 'ZIP bytes must match the public root');
  assert.deepEqual(await files(source), names, 'Public file list changed during packaging');
  assert.deepEqual(await hashes(source, names), original, 'Public files changed during packaging');
  console.log(`Validated ${names.length} files: ZIP integrity and SHA-256 match the public root.`);
  console.log('index.html is directly at the ZIP root. No deployment performed.');
  console.log(`Package: ${archive}`);
} catch (error) {
  await fs.rm(archive, { force: true });
  throw error;
} finally {
  await fs.rm(temporary, { recursive: true, force: true });
}
