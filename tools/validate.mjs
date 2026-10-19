import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import MarkdownIt from 'markdown-it';
import YAML from 'yaml';
import { root, slug } from './preview.mjs';

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const md = new MarkdownIt({ html: true });
const tokens = md.parse(readme, {});
const headings = tokens.filter(t => t.type === 'heading_open');
assert(headings.filter(t => t.tag === 'h1').length <= 1, 'At most one H1');
assert.equal(headings[0].tag, 'h2', 'Profile sections start at H2 below the profile identity');
assert(readme.includes('alt="Akash Dhanwate'), 'The hero must provide a readable identity');
let previous = 1;
for (const heading of headings) {
  const depth = Number(heading.tag.slice(1));
  assert(depth <= previous + 1, 'Heading hierarchy must not skip levels');
  previous = depth;
}
const ids = new Set(tokens.flatMap((t, i) => t.type === 'heading_open' ? [slug(tokens[i + 1].content)] : []));
const references = [...readme.matchAll(/(?:src|srcset|href)="([^"]+)"/g)].map(m => m[1]);
for (const token of tokens) for (const child of token.children ?? []) {
  if (child.type === 'link_open') references.push(child.attrGet('href'));
  if (child.type === 'image') references.push(child.attrGet('src'));
}
for (const reference of references) {
  if (reference.startsWith('./')) assert(fs.existsSync(path.resolve(root, reference.split('?')[0])), `Missing local path: ${reference}`);
  else if (reference.startsWith('#')) assert(ids.has(reference.slice(1)), `Missing section: ${reference}`);
  else assert(/^(https:\/\/|mailto:)/.test(reference), `Unexpected URL: ${reference}`);
  assert(!reference.includes(' '), `Unencoded URL: ${reference}`);
}
for (const match of readme.matchAll(/<img\b[^>]*>/g)) assert(/alt="[^"]{12,}"/.test(match[0]), 'Images require descriptive alternative text');
assert(!/<(?:script|style|iframe|canvas|svg)\b|\son\w+=/i.test(readme), 'Unsupported README features');
assert(!/https?:[^"\s]+(?:shields\.io|komarev|typing-svg|readme-stats|herokuapp)/.test(readme), 'Critical images must be local');
assert(!/github\.com\/akash-dhanwate/.test(readme), 'Use consistent username capitalization');
const svgs = ['assets', 'output'].flatMap(dir => fs.readdirSync(path.join(root, dir), { recursive: true }).filter(f => f.endsWith('.svg')).map(f => path.join(root, dir, f)));
const xml = spawnSync('xmllint', ['--noout', ...svgs], { encoding: 'utf8' });
if (xml.error?.code === 'ENOENT') throw new Error('Install libxml2/xmllint to validate SVG XML.');
assert.equal(xml.status, 0, xml.stderr);
for (const filename of svgs) {
  const svg = fs.readFileSync(filename, 'utf8');
  assert(/viewBox=/.test(svg), `${filename}: missing viewBox`);
  assert(/<title[ >]/.test(svg), `${filename}: missing title`);
  const content = svg.replace(/<!--[\s\S]*?-->/g, '');
  assert(!/<script|<foreignObject|@import|(?:href|src)="https?:|url\(\s*https?:/i.test(content), `${filename}: external or unsafe SVG content`);
  assert(svg.includes('prefers-reduced-motion'), `${filename}: missing reduced-motion rule`);
  assert(fs.statSync(filename).size < 150_000, `${filename}: exceeds SVG size budget`);
  const defined = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const match of svg.matchAll(/url\(#([^\)]+)\)/g)) assert(defined.has(match[1]), `${filename}: undefined SVG reference ${match[1]}`);
  for (const animation of svg.matchAll(/<animate\b([^>]+)>/g)) {
    const values = /\bvalues="([^"]+)"/.exec(animation[1]);
    const times = /\bkeyTimes="([^"]+)"/.exec(animation[1]);
    if (values && times) assert.equal(values[1].split(';').length, times[1].split(';').length, 'Animation values and keyTimes must match');
  }
}
const workflow = YAML.parse(fs.readFileSync(path.join(root, '.github/workflows/github-snake.yml'), 'utf8'));
assert.deepEqual(workflow.on.push.branches, ['main']);
assert(workflow.on.workflow_dispatch === null, 'Manual trigger must exist');
const job = Object.values(workflow.jobs).find(j => j.steps?.some(step => step.uses?.startsWith('Platane/snk/')));
assert(job, 'Contribution generator job must exist');
assert.equal(job.permissions.contents, 'write');
const generator = job.steps.find(step => step.uses?.startsWith('Platane/snk/'));
assert(['Akash-Dhanwate', '${{ github.repository_owner }}'].includes(generator.with.github_user_name), 'Correct contribution owner');
for (const output of ['output/github-snake.svg', 'output/github-snake-dark.svg']) {
  assert(generator.with.outputs.includes(path.basename(output)), `Missing generated filename ${output}`);
  assert(readme.includes(`./${output}`), `README does not point to generated output ${output}`);
}
assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'output/snapshot.json'), 'utf8')).username, 'Akash-Dhanwate');
const licenses = fs.readFileSync(path.join(root, 'tools/fonts/OFL.txt'), 'utf8');
assert(licenses.includes('SIL OPEN FONT LICENSE'));
console.log(`PASS: headings, ${references.length} paths/links, alternative text, ${svgs.length} valid local SVGs, SVG references and budgets, motion declarations, font license, and workflow outputs/permissions.`);
console.log('External HTTP availability and actual browser behavior are recorded separately in docs/VALIDATION.md.');
