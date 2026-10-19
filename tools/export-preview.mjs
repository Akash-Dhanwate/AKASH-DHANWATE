import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { root } from './preview.mjs';

const directory = path.join(root, 'preview-artifacts');
const report = JSON.parse(fs.readFileSync(path.join(directory, 'github-render-report.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
assert.equal(report.source_sha256, createHash('sha256').update(source).digest('hex'), 'Run npm run github-preview first: renderer response does not match this README.');
const css = fs.readFileSync(path.join(root, 'node_modules/github-markdown-css/github-markdown.css'), 'utf8');
const body = fs.readFileSync(path.join(directory, 'github-render.html'), 'utf8')
  .replace(/(src|srcset|href)="\.\//g, '$1="../')
  .replaceAll('id="user-content-', 'id="');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akash Dhanwate — GitHub README preview</title><style>${css}\nhtml{color-scheme:light dark;background:#fff}body{margin:0}.markdown-body{box-sizing:border-box;max-width:960px;margin:0 auto;padding:32px}.markdown-body img{background:transparent}.markdown-body picture{display:block}.markdown-body td{overflow-wrap:anywhere}@media(prefers-color-scheme:dark){html{background:#0d1117}}@media(max-width:600px){.markdown-body{padding:16px}.markdown-body table{font-size:14px}.markdown-body th,.markdown-body td{padding:8px 10px}}</style></head><body><article class="markdown-body">${body}</article></body></html>\n`;
fs.writeFileSync(path.join(directory, 'index.html'), html);
console.log('Exported preview-artifacts/index.html. Open it directly; no server or external image requests are needed.');
