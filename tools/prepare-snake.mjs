import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'output');
fs.mkdirSync(directory, { recursive: true });
const source = process.argv[2];
if (source) {
  const original = fs.readFileSync(source, 'utf8');
  if (!original.includes('<svg') || original.includes('<html')) throw new Error('Expected a real generated snake SVG.');
  fs.writeFileSync(path.join(directory, 'github-snake-dark.svg'), original);
  fs.writeFileSync(path.join(directory, 'github-snake.svg'), original
    .replaceAll('#0b0711', '#ffffff').replaceAll('#26113a', '#EDE8FC')
    .replaceAll('#581c87', '#C9B7F5').replaceAll('#c026d3', '#9163DD')
    .replaceAll('#f5d0fe', '#633CB8').replaceAll('#ff4fd8', '#7050BB'));
}
for (const filename of ['github-snake.svg', 'github-snake-dark.svg']) {
  const target = path.join(directory, filename);
  let svg = fs.readFileSync(target, 'utf8');
  if (!svg.includes('data-profile-accessibility')) {
    svg = svg.replace(/(<svg\b[^>]*>)/, '$1<title>Akash Dhanwate — contribution trail</title><desc>A stored public GitHub contribution snapshot, animated as a snake. Visit the profile for current contribution history.</desc><style data-profile-accessibility="true">@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>');
  }
  if (filename.includes('dark')) {
    svg = svg.replaceAll('#ff4fd8', '#79E8E0').replaceAll('#0b0711', '#080B14')
      .replaceAll('#26113a', '#211A39').replaceAll('#581c87', '#513A7F')
      .replaceAll('#c026d3', '#8462C4').replaceAll('#f5d0fe', '#AE94FF');
  }
  fs.writeFileSync(target, svg);
  fs.writeFileSync(target.replace('.svg', '-static.svg'), svg.replace('</svg>', '<style>*{animation:none!important}</style></svg>'));
}
fs.writeFileSync(path.join(directory, 'snapshot.json'), JSON.stringify({
  username: 'Akash-Dhanwate',
  prepared_at: new Date().toISOString(),
  source: source ? 'Previously generated public output branch; retrieved during implementation. Original generation date is unknown.' : 'Platane/snk, generated from the public GitHub contribution graph during this workflow run.',
  source_url: source ? 'https://raw.githubusercontent.com/Akash-Dhanwate/AKASH-DHANWATE/output/github-snake-dark.svg' : 'https://github.com/Akash-Dhanwate',
  note: 'The preparation time is not a claim about when each contribution was made. This snapshot is not a live counter.'
}, null, 2) + '\n');
console.log('Prepared both real contribution snapshots with reduced-motion support.');
