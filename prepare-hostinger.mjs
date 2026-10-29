import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const repository = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(repository, 'dist');
const output = path.resolve(process.argv[2] || path.join(repository, '..', 'hostinger-packages'));
const relativeOutput = path.relative(repository, output);
if (!relativeOutput.startsWith(`..${path.sep}`) && relativeOutput !== '..' && !path.isAbsolute(relativeOutput)) {
  throw new Error('Choose an output directory outside the repository to preserve its files.');
}

async function files(directory, prefix = '') {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), relative));
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
assert(names.includes('index.html'), 'dist/index.html is required');
const original = await hashes(source, names);
await fs.mkdir(output, { recursive: true });
const destination = await fs.mkdtemp(path.join(output, 'clinica-jonk-'));
const archive = path.join(destination, 'clinica-jonk-hostinger.zip');
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'clinica-hostinger-'));
try {
  const staging = path.join(temporary, 'site');
  const extracted = path.join(temporary, 'verified');
  await fs.cp(source, staging, { recursive: true });
  execFileSync('zip', ['-q', '-r', archive, '.'], { cwd: staging, stdio: 'inherit' });
  execFileSync('unzip', ['-t', archive], { stdio: 'pipe' });
  await fs.mkdir(extracted);
  execFileSync('unzip', ['-q', archive, '-d', extracted]);
  assert.deepEqual(await files(extracted), names, 'ZIP file list must match dist');
  assert.deepEqual(await hashes(extracted, names), original, 'ZIP bytes must match dist');
  assert.deepEqual(await files(source), names, 'dist file list changed during packaging');
  assert.deepEqual(await hashes(source, names), original, 'dist changed during packaging');
  console.log(`Validated ${names.length} files: ZIP integrity and SHA-256 match dist.`);
  console.log('index.html is directly at the ZIP root. No deployment performed.');
  console.log(`Package: ${archive}`);
} catch (error) {
  await fs.rm(archive, { force: true });
  throw error;
} finally {
  await fs.rm(temporary, { recursive: true, force: true });
}
