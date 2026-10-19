import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { root } from './preview.mjs';

const text = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const response = await fetch('https://api.github.com/markdown', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/vnd.github+json', 'User-Agent': 'Akash-Profile-Validation' },
  body: JSON.stringify({ text, mode: 'gfm', context: 'Akash-Dhanwate/AKASH-DHANWATE' }),
  signal: AbortSignal.timeout(25000),
});
const html = await response.text();
assert.equal(response.status, 200, `GitHub Markdown renderer returned ${response.status}: ${html.slice(0, 200)}`);
const count = (source, re) => [...source.matchAll(re)].length;
assert.equal(count(html, /<picture>/g), count(text, /<picture>/g), 'GitHub must preserve picture elements');
assert.equal(count(html, /<source\b/g), count(text, /<source\b/g), 'GitHub must preserve responsive and reduced-motion sources');
assert.equal(count(html, /<img\b/g), count(text, /<img\b/g), 'GitHub must preserve image elements');
assert.equal(count(html, /<table\b/g), 0, 'The minimal profile has no layout tables');
assert.equal(count(html, /<details>/g), 1, 'Contribution trail must remain collapsible');
assert.equal(count(html, /href="https:\/\/github.com\/Akash-Dhanwate\/(github-metrics|HousePrice-Prediction-Model|Smart-Notes-App)"/g), 3, 'All project cards must remain clickable');
assert(html.includes('prefers-reduced-motion') && html.includes('max-width: 600px'));
const directory = path.join(root, 'preview-artifacts');
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, 'github-render.html'), html);
const report = { checked_at: new Date().toISOString(), status: response.status, source_sha256: createHash('sha256').update(text).digest('hex'), pictures: count(html, /<picture>/g), sources: count(html, /<source\b/g), tables: count(html, /<table\b/g), images: count(html, /<img\b/g), note: 'Actual GitHub Markdown API rendering. This read-only transformation does not publish a branch or profile.' };
fs.writeFileSync(path.join(directory, 'github-render-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
