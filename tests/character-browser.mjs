import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const baseUrl = process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const stops = [
  { start: 0, asset: 'Friendly Mint Receptionist Illustration.png' },
  { start: 5.5, asset: 'Friendly Mint Receptionist Illustration.png' },
  { start: 11, asset: 'Friendly Anime Dentist with Dental Mirror.png' },
  { start: 20.5, asset: 'Friendly Anime Dentist Demonstrating Dental Model.png' },
  { start: 26, asset: 'Friendly Orthodontist Presenting Braces Model.png' },
];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('[data-character]').count(), 5);
  assert.deepEqual(await page.locator('[data-character]').evaluateAll((images) => images.map((image) => image.currentSrc)), ['', '', '', '', '']);

  const goTo = async (units, stopIndex, visible) => {
    await page.evaluate((position) => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + position * innerHeight), units);
    await page.waitForFunction(({ index, expectedVisible }) => {
      const stage = document.querySelector('[data-stage]');
      const character = document.querySelector(`[data-character][data-stop-index="${index}"]`);
      return stage?.dataset.phase === 'stop' && stage.dataset.segmentIndex === String(index)
        && character?.classList.contains('is-visible') === expectedVisible
        && (!expectedVisible || character.naturalWidth > 0);
    }, { index: stopIndex, expectedVisible: visible }, { timeout: 30000 });
  };

  for (const [index, stop] of stops.entries()) {
    await goTo(stop.start + 0.2, index, false);
    await goTo(stop.start + 0.8, index, true);
    assert.equal(await page.locator('[data-character].is-visible').count(), 1);
    assert.equal(await page.locator('[data-character].is-visible').getAttribute('data-asset'), stop.asset);
    if (index === 0 && process.env.SONRIE_CAPTURE === '1') {
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'dist/f5-character-desktop.png' });
    }
    await goTo(stop.start + 0.2, index, false);
    assert.equal(await page.locator('[data-character].is-visible').count(), 0);
  }

  await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 3.5 * innerHeight));
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.phase === 'video');
  assert.equal(await page.locator('[data-character].is-visible').count(), 0);
  assert.deepEqual(errors, []);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await mobile.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 0.8 * innerHeight));
  await mobile.locator('[data-character].is-visible').waitFor();
  await mobile.waitForFunction(() => getComputedStyle(document.querySelector('[data-character].is-visible')).transform === 'matrix(1, 0, 0, 1, 0, 0)');
  const bounds = await mobile.locator('[data-character].is-visible').boundingBox();
  const copyBounds = await mobile.locator('.copy').boundingBox();
  if (process.env.SONRIE_CAPTURE === '1') await mobile.screenshot({ path: 'dist/f5-character-mobile.png' });
  assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y >= 0 && bounds.y + bounds.height <= 844);
  assert.ok(bounds && copyBounds && bounds.y + bounds.height <= copyBounds.y, `el personaje deja libre el bloque de título y controles: ${JSON.stringify({ bounds, copyBounds })}`);
  assert.equal(await mobile.locator('[data-character].is-visible').evaluate((image) => getComputedStyle(image).pointerEvents), 'none');

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await reduced.waitForFunction(() => document.querySelector('[data-world]')?.dataset.motion === 'off');
  assert.equal(await reduced.locator('[data-character].is-visible').count(), 0);

  const broken = await browser.newPage();
  await broken.route((url) => decodeURIComponent(url.pathname).includes('Friendly Mint Receptionist Illustration') && url.pathname.endsWith('.png'), (route) => route.abort());
  await broken.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await broken.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 0.8 * innerHeight));
  await broken.waitForFunction(() => {
    const image = document.querySelector('[data-character][data-stop-index="0"]');
    return image?.complete && image.naturalWidth === 0;
  });
  assert.equal(await broken.locator('[data-character].is-visible').count(), 0);
  await broken.locator('[data-photo][data-index="0"].is-active').waitFor();
  assert.equal(await broken.locator('[data-photo][data-index="0"].is-active').count(), 1);
  console.log(JSON.stringify({ stops: 5, revealAfterScroll: 'ok', reverse: 'ok', mobile: 'ok', reducedMotion: 'ok', failedCharacter: 'photo visible', errors }));
} finally {
  await browser.close();
}
