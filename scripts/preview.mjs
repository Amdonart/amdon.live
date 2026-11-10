import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, extname } from 'node:path';
import { siteFiles, root } from './site-files.mjs';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8',
};

// Only public files are served, never local metadata or source checkouts.
export function createPreviewServer(directory = fileURLToPath(root)) {
  return http.createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    let file;
    try {
      file = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
    } catch {
      response.writeHead(400).end('Invalid URL');
      return;
    }
    if (!file) file = 'index.html';
    if (!siteFiles.includes(file)) {
      response.writeHead(404).end('Not found');
      return;
    }
    try {
      const bytes = await readFile(resolve(directory, file));
      response.writeHead(200, {
        'Content-Type': types[extname(file)] ?? 'application/octet-stream',
        'Content-Length': bytes.length,
        'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Cannot read file');
    }
  });
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const directory = resolve(fileURLToPath(root), process.argv[2] ?? '.');
  const port = Number(process.env.PORT ?? 4173);
  const server = createPreviewServer(directory);
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}`));
}
