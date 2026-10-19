import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const slug = text => text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-');
export function renderMarkdown(markdown) {
  const md = new MarkdownIt({ html: true, linkify: false });
  md.renderer.rules.heading_open = (tokens, i) => `<${tokens[i].tag} id="${slug(tokens[i + 1].content)}">`;
  return md.render(markdown);
}

export function createPreviewServer() {
  return http.createServer((request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1');
      if (url.pathname === '/') {
        const theme = url.searchParams.get('theme') === 'light' ? 'light' : 'dark';
        const body = renderMarkdown(fs.readFileSync(path.join(root, 'README.md'), 'utf8'));
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(`<!doctype html><html lang="en" data-color-mode="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akash Dhanwate — README preview</title><link rel="stylesheet" href="/markdown-${theme}.css"><style>html{color-scheme:${theme};background:${theme === 'dark' ? '#0d1117' : '#fff'}}body{margin:0}.markdown-body{box-sizing:border-box;max-width:960px;margin:0 auto;padding:32px}.markdown-body img{background:transparent}.markdown-body picture{display:block}.markdown-body h1{font-size:26px}.markdown-body h2{margin-top:38px}.markdown-body h3{margin-top:30px}.markdown-body td{overflow-wrap:anywhere}@media(max-width:600px){.markdown-body{padding:16px}.markdown-body h1{font-size:23px}.markdown-body table{font-size:14px}.markdown-body th,.markdown-body td{padding:8px 10px}}</style></head><body><article class="markdown-body">${body}</article></body></html>`);
        return;
      }
      const css = /^\/markdown-(dark|light)\.css$/.exec(url.pathname);
      if (css) {
        response.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
        response.end(fs.readFileSync(path.join(root, `node_modules/github-markdown-css/github-markdown-${css[1]}.css`)));
        return;
      }
      const relative = decodeURIComponent(url.pathname).replace(/^\//, '');
      const filename = path.resolve(root, relative);
      if (!filename.startsWith(root + path.sep) || !/^(assets|output)\//.test(relative) || !fs.statSync(filename).isFile()) {
        response.writeHead(404).end(); return;
      }
      const type = filename.endsWith('.svg') ? 'image/svg+xml' : filename.endsWith('.jpg') ? 'image/jpeg' : filename.endsWith('.json') ? 'application/json' : 'application/octet-stream';
      response.writeHead(200, { 'Content-Type': type });
      response.end(fs.readFileSync(filename));
    } catch {
      response.writeHead(404).end();
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createPreviewServer();
  server.listen(4173, '127.0.0.1', () => console.log('Local GitHub-style preview: http://127.0.0.1:4173 (light: /?theme=light). Ctrl+C stops it.'));
}
