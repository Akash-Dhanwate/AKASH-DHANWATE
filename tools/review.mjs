import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { root, createPreviewServer } from './preview.mjs';

const server = createPreviewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const output = path.join(root, 'preview-artifacts');
fs.mkdirSync(output, { recursive: true });
const executablePath = process.env.PROFILE_CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath });
  const cases = [
    { name: 'desktop-dark', width: 1440, height: 1080, colorScheme: 'dark', reducedMotion: 'no-preference' },
    { name: 'desktop-light', width: 1440, height: 1080, colorScheme: 'light', reducedMotion: 'no-preference' },
    { name: 'mobile-dark', width: 390, height: 844, colorScheme: 'dark', reducedMotion: 'no-preference' },
    { name: 'mobile-reduced', width: 390, height: 844, colorScheme: 'dark', reducedMotion: 'reduce' },
    { name: 'narrow-light', width: 320, height: 740, colorScheme: 'light', reducedMotion: 'reduce' },
  ];
  const report = [];
  for (const item of cases) {
    const context = await browser.newContext({ viewport: { width: item.width, height: item.height }, colorScheme: item.colorScheme, reducedMotion: item.reducedMotion });
    const page = await context.newPage();
    await page.goto(base + '/?theme=' + item.colorScheme);
    await page.locator('details').evaluate(e => { e.open = true; });
    await page.locator('img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
    const result = await page.evaluate(() => ({
      brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
      overflow: document.documentElement.scrollWidth > innerWidth,
      hero: document.images[0].currentSrc,
      about: document.querySelector('img[src="./assets/about.svg"]').currentSrc,
      snake: [...document.images].find(i => i.src.includes('github-snake')).currentSrc,
      cards: [...document.querySelectorAll('img[src*="/projects/"]')].map(i => ({ source: i.currentSrc, href: i.closest('a')?.href })),
      skills: [...document.querySelectorAll('img[src*="/skills/"]')].length,
      imageCount: document.images.length,
    }));
    assert.equal(result.brokenImages.length, 0, item.name + ': broken images');
    assert(!result.overflow, item.name + ': horizontal overflow');
    assert.equal(result.hero.includes('hero-mobile'), item.width <= 600, 'Responsive hero must load');
    assert.equal(result.hero.includes('static'), item.reducedMotion === 'reduce', 'Static hero must load for reduced motion');
    assert.equal(result.snake.includes('snake-dark'), item.colorScheme === 'dark', 'Contribution theme must match');
    assert.equal(result.cards.length, 3, 'Three project cards');
    assert.equal(result.skills, 20, 'All twenty original technology choices are represented');
    assert.equal(result.about.includes('about-mobile'), item.width <= 600, 'Responsive About card must load');
    const aboutContent = await (await page.request.get(result.about)).text();
    assert(aboutContent.includes('Akash Suresh Dhanwate') && aboutContent.includes('Sanjivani University'), 'About card retains the verified identity and university');
    for (const card of result.cards) {
      assert(card.href.startsWith('https://github.com/Akash-Dhanwate/'), 'Project image must be a working repository link');
      assert.equal(card.source.includes('-mobile'), item.width <= 600, 'Responsive project card');
      assert.equal(card.source.includes('-static'), item.reducedMotion === 'reduce', 'Static project alternative');
    }
    await page.locator('details').evaluate(e => { e.open = false; });
    await page.screenshot({ path: path.join(output, item.name + '.png'), fullPage: true });
    const hero = page.locator('img').first();
    const a = await hero.screenshot();
    await page.waitForTimeout(650);
    const b = await hero.screenshot();
    const heroChanges = !a.equals(b);
    assert.equal(heroChanges, item.reducedMotion !== 'reduce', item.name + ': hero motion preference mismatch');
    const card = page.locator('img[src*="/projects/"]').first();
    const first = await card.screenshot();
    await page.waitForTimeout(500);
    const second = await card.screenshot();
    const cardChanges = !first.equals(second);
    assert.equal(cardChanges, item.reducedMotion !== 'reduce', item.name + ': project motion preference mismatch');
    report.push({ ...item, ...result, heroChanges, cardChanges });
    await context.close();
  }
  fs.writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log('PASS: five viewport/theme/motion combinations; responsive About card, 20 glass logos, three linked project cards, responsive and static sources, measured hero/card motion, image decoding, and no horizontal overflow.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
