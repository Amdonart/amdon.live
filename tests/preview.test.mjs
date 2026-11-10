import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createPreviewServer } from '../scripts/preview.mjs';

test('preview serves site files and protects local source and metadata', async (t) => {
  const server = createPreviewServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [path, type] of [
    ['/', 'text/html'], ['/affiliate.html', 'text/html'],
    ['/styles.css', 'text/css'], ['/assets/white-circuit.svg', 'image/svg+xml'],
    ['/assets/fonts/Silkscreen-Regular.ttf', 'font/ttf'],
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert(response.headers.get('content-type').startsWith(type), path);
    await response.arrayBuffer();
  }
  for (const path of ['/.openai/hosting.json', '/package.json', '/.sites-checkout/index.html', '/%2e%2e%2fREADME.md']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404, path);
    await response.text();
  }
  assert.equal((await fetch(base + '/%ZZ')).status, 400);
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  const head = await fetch(base + '/styles.css', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});
