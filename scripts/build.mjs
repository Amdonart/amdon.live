import { copyFile, mkdir, rm } from 'node:fs/promises';
import { siteFiles, root } from './site-files.mjs';

const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
for (const file of siteFiles) {
  const target = new URL(file, output);
  await mkdir(new URL('./', target), { recursive: true });
  await copyFile(new URL(file, root), target);
}
console.log(`Built dist/ with ${siteFiles.length} public files.`);
