import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { siteFiles, root } from './site-files.mjs';

const voidTags = new Set(['meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'wbr']);
const texts = new Map();
for (const file of siteFiles) {
  await stat(new URL(file, root));
  if (/\.(html|css)$/.test(file)) texts.set(file, await readFile(new URL(file, root), 'utf8'));
}

for (const [file, text] of texts) {
  const references = file.endsWith('.html')
    ? [...text.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1])
    : [...text.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)].map(match => match[1]);
  for (const reference of references) {
    if (/^(https?:|data:)/.test(reference)) continue;
    assert(!reference.startsWith('/'), `${file}: use relative asset paths for GitHub Pages`);
    const resolved = new URL(reference, new URL(file, root));
    assert(resolved.href.startsWith(root.href), `${file}: asset escapes project`);
    await stat(resolved);
    assert(siteFiles.some(path => new URL(path, root).href === resolved.href), `${reference} missing from build`);
  }
  if (!file.endsWith('.html')) continue;
  const stack = [];
  const ids = new Set();
  for (const match of text.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
    const [tag, rawName] = match;
    const name = rawName.toLowerCase();
    if (tag.startsWith('</')) assert.equal(stack.pop(), name, `${file}: mismatched ${tag}`);
    else if (!voidTags.has(name) && !tag.endsWith('/>')) stack.push(name);
    const id = tag.match(/\bid="([^"]+)"/);
    if (id) { assert(!ids.has(id[1]), `${file}: duplicate ID ${id[1]}`); ids.add(id[1]); }
    if (name === 'img') assert(/\balt="[^"]*"/.test(tag), `${file}: image needs alt text`);
    if (name === 'a' && /target="_blank"/.test(tag)) assert(/rel="[^"]*\bnoopener\b/.test(tag));
  }
  assert.equal(stack.length, 0, `${file}: unclosed HTML tags`);
  for (const match of text.matchAll(/href="#([^"]+)"/g)) assert(ids.has(match[1]), `${file}: broken anchor`);
  for (const match of text.matchAll(/aria-labelledby="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) assert(ids.has(id), `${file}: missing label ${id}`);
  }
  assert(text.includes('aria-hidden="true"'), `${file}: background must be decorative`);
  assert(!/<script\b|<iframe\b|\son\w+=/i.test(text), `${file}: unexpected script or player`);
}
const home = texts.get('index.html');
assert.equal([...home.matchAll(/class="link-card(?: featured)?"/g)].length, 13, 'Expected 13 channel/project links');
assert.equal([...home.matchAll(/class="code-line"/g)].length, 40, 'Expected 40 background blocks');
const css = texts.get('styles.css');
assert.equal((css.match(/{/g) ?? []).length, (css.match(/}/g) ?? []).length, 'Unbalanced CSS');
assert(css.includes('prefers-reduced-motion'), 'Reduced-motion support is required');
assert(css.includes('pointer-events:none') || css.includes('pointer-events: none'), 'Background must not intercept clicks');
console.log('Passed: HTML structure, links, local assets, build manifest and accessibility checks.');
