import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(root, 'dist');
let count = 0;
const failures = [];

async function verify(directory, prefix = '') {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    const original = path.join(source, relative);
    const copy = path.join(root, relative);
    if (entry.isDirectory()) {
      await verify(original, relative);
    } else if (entry.isFile()) {
      count++;
      try {
        const stat = await fs.lstat(copy);
        if (!stat.isFile() || !Buffer.from(await fs.readFile(original)).equals(await fs.readFile(copy))) {
          failures.push(`Different file: ${relative}`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') failures.push(`Missing file: ${relative}`);
        else throw error;
      }
    } else {
      failures.push(`Unsupported source entry: ${relative}`);
    }
  }
}

await verify(source);
if (count === 0) failures.push('dist contains no files');
if (failures.length) {
  console.error(failures.join('\n'));
  console.error('Update the root copies from dist before publishing.');
  process.exitCode = 1;
} else {
  console.log(`PASS: all ${count} files from dist are identical in the repository root.`);
}
