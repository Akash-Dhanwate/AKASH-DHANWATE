import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { root } from './preview.mjs';

const url = 'https://github-metrics.learnaids2025.workers.dev/';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PROFILE_CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined),
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 656 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'dark' });
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (response?.status() !== 200) throw new Error(`Demo returned ${response?.status()}; keeping any existing screenshot.`);
  await page.locator('h1').waitFor();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(root, 'assets/github-metrics.jpg'), type: 'jpeg', quality: 85 });
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/project-capture.json'), JSON.stringify({ url, captured_at: new Date().toISOString(), status: response.status(), title: await page.title(), viewport: { width: 1280, height: 656 }, note: 'An actual anonymous browser screenshot of the public homepage; no fabricated dashboard or performance claims.' }, null, 2) + '\n');
  console.log('Captured actual dashboard homepage: assets/github-metrics.jpg');
} finally {
  await browser.close();
}
