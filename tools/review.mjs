import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { root, createPreviewServer } from './preview.mjs';

const server = createPreviewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
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
    await page.goto(`${base}/?theme=${item.colorScheme}`);
    await page.locator('img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
    const result = await page.evaluate(() => ({
      brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
      overflow: document.documentElement.scrollWidth > innerWidth,
      hero: document.images[0].currentSrc,
      snake: [...document.images].find(i => i.src.includes('github-snake')).currentSrc,
      imageCount: document.images.length,
      invalidAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash),
    }));
    assert.equal(result.brokenImages.length, 0, `${item.name}: broken images`);
    assert.equal(result.invalidAnchors.length, 0, `${item.name}: broken anchors`);
    assert(!result.overflow, `${item.name}: horizontal overflow`);
    assert.equal(result.hero.includes('hero-mobile'), item.width <= 600, 'Responsive hero must load');
    assert.equal(result.hero.includes('static'), item.reducedMotion === 'reduce', 'Static alternative must load for reduced motion');
    assert.equal(result.snake.includes('snake-dark'), item.colorScheme === 'dark', 'Contribution theme must match');
    await page.screenshot({ path: path.join(output, `${item.name}.png`), fullPage: true });
    const hero = page.locator('img').first();
    const a = await hero.screenshot();
    await page.waitForTimeout(650);
    const b = await hero.screenshot();
    const heroChanges = !a.equals(b);
    assert.equal(heroChanges, item.reducedMotion !== 'reduce', `${item.name}: animation preference mismatch`);
    report.push({ ...item, ...result, heroChanges });
    await context.close();
  }
  const svgPage = await browser.newPage({ reducedMotion: 'reduce' });
  await svgPage.goto(`${base}/assets/focus.svg`);
  assert.equal(await svgPage.locator('.motion').evaluate(e => getComputedStyle(e).display), 'none');
  assert.notEqual(await svgPage.locator('.reduced').evaluate(e => getComputedStyle(e).display), 'none');
  await svgPage.close();
  const focusPage = await browser.newPage({ reducedMotion: 'no-preference' });
  await focusPage.goto(`${base}/assets/focus.svg`);
  const typing = await focusPage.evaluate(() => {
    const svg = document.documentElement;
    svg.pauseAnimations();
    const frames = [2, 8, 14].map(time => {
      svg.setCurrentTime(time);
      return [...document.querySelectorAll('g.motion > g')].map(e => Number(getComputedStyle(e).opacity));
    });
    svg.setCurrentTime(.1);
    const start = document.querySelector('clipPath rect').width.animVal.value;
    svg.setCurrentTime(3);
    const complete = document.querySelector('clipPath rect').width.animVal.value;
    return { frames, start, complete };
  });
  assert.deepEqual(typing.frames, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'Typing messages must cycle once each');
  assert(typing.complete > typing.start, 'Typing mask must actually reveal text');
  await focusPage.close();
  fs.writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`PASS: ${cases.length} viewport/theme/motion combinations, all images decoded, no overflow, correct responsive sources, working anchors, measured SVG animation changes, and all 3 typing states. Screenshots: preview-artifacts/.`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
