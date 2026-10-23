import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const baseUrl = process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const canvas = page.locator('[data-particles]');
  assert.equal(await canvas.count(), 1);
  assert.equal(await canvas.evaluate((element) => getComputedStyle(element).pointerEvents), 'none');
  assert.equal(await canvas.getAttribute('data-active-stop'), '');

  const goTo = async (units, expectedStop, expectedType = '') => {
    await page.evaluate((position) => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + position * innerHeight), units);
    await page.waitForFunction(({ stopId, type }) => {
      const canvas = document.querySelector('[data-particles]');
      return canvas?.dataset.activeStop === stopId && (canvas.dataset.particleType ?? '') === type;
    }, { stopId: expectedStop, type: expectedType }, { timeout: 30000 });
  };

  await goTo(0.2, '');
  await goTo(0.8, 'parada-1', 'dust');
  await page.waitForFunction(() => {
    const canvas = document.querySelector('[data-particles]');
    if (!canvas?.width || !canvas.height) return false;
    const pixels = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data;
    return pixels && pixels.some((value, index) => index % 4 === 3 && value > 0);
  });
  assert.equal(await canvas.getAttribute('data-particle-count'), '12');
  if (process.env.SONRIE_CAPTURE === '1') {
    await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.dialogueVisible === 'true');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'dist/f6-dust-desktop.png' });
  }
  await goTo(6.3, '');
  await goTo(11.8, 'parada-3', 'soft-glow');
  if (process.env.SONRIE_CAPTURE === '1') {
    await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.dialogueVisible === 'true' && document.querySelector('[data-stage]')?.dataset.stopId === 'parada-3');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'dist/f6-glow-desktop.png' });
  }
  await goTo(21.3, 'parada-5', 'sparkle');
  await goTo(26.8, 'parada-6', 'dust');
  await goTo(24, '');
  await page.getByRole('button', { name: 'Ir a la parada 1' }).click();
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.stopId === 'parada-1');
  assert.equal(await canvas.getAttribute('data-active-stop'), '');
  assert.deepEqual(errors, []);

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await reduced.waitForFunction(() => document.querySelector('[data-world]')?.dataset.motion === 'off');
  assert.equal(await reduced.locator('[data-particles]').evaluate((element) => getComputedStyle(element).display), 'none');
  console.log(JSON.stringify({ enabled: ['parada-1', 'parada-3', 'parada-5', 'parada-6'], disabled: 'parada-2', photoFirst: 'ok', pointerEvents: 'none', reducedMotion: 'off', errors }));
} finally {
  await browser.close();
}
