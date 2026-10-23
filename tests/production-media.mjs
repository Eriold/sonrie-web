import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const baseUrl = process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const expected = [
  { selector: '[data-clip]', names: [1, 2, 3, 4, 5].map((number) => `Parte_${number}.mp4`), folder: 'assets', type: 'video/mp4' },
  { selector: '[data-photo]', names: [1, 2, 3, 5, 6].map((number) => `Parte_${number}.webp`), folder: 'assets', type: 'image/webp' },
  { selector: '[data-poster]', names: [1, 2, 3, 4, 5].map((number) => `Parte_${number}.mp4`), folder: 'src/media/posters', type: 'image/webp' },
];
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-stage]').waitFor();
  assert.equal(await page.locator('[data-debug]').count(), 0);
  assert.equal(await page.locator('[data-mode-picker]').count(), 0);
  await page.waitForTimeout(750);
  assert.deepEqual(await page.locator('[data-clip]').evaluateAll((videos) => videos.slice(1).map((video) => video.currentSrc)), ['', '', '', ''], 'solo el primer video debe descargarse al abrir la página');

  for (const group of expected) {
    const elements = await page.locator(group.selector).evaluateAll((nodes) => nodes.map((node) => ({ asset: node.dataset.asset, src: node.getAttribute('src') ?? node.getAttribute('data-src') })));
    assert.deepEqual(elements.map((element) => element.asset), group.names);
    for (const element of elements) {
      assert.ok(element.src, `Falta URL de ${element.asset}`);
      const response = await page.request.get(new URL(element.src, baseUrl).href);
      assert.equal(response.status(), 200, `No se publicó ${element.asset}`);
      assert.ok(response.headers()['content-type']?.startsWith(group.type), `Tipo incorrecto para ${element.asset}`);
      const localName = group.folder === 'assets' ? element.asset : `${element.asset.replace('.mp4', '')}-poster.webp`;
      const original = await readFile(`${group.folder}/${localName}`);
      assert.equal(hash(await response.body()), hash(original), `El recurso publicado difiere de ${localName}`);
    }
  }

  for (const [index, units] of [3.5, 9, 14.5, 18.5, 24].entries()) {
    await page.evaluate((position) => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + position * innerHeight), units);
    await page.waitForFunction((expectedIndex) => {
      const stage = document.querySelector('[data-stage]');
      const clip = document.querySelectorAll('[data-clip]')[expectedIndex];
      return stage?.dataset.segmentIndex === String(expectedIndex) && stage.dataset.phase === 'video'
        && stage.dataset.visual === 'video' && clip?.classList.contains('is-active')
        && clip.currentTime > 0.5 && clip.paused;
    }, index, { timeout: 45000 });
  }
  await page.getByRole('button', { name: 'Ir a la parada 5' }).click();
  await page.waitForFunction(() => document.querySelector('[data-photo][data-asset="Parte_6.webp"]')?.classList.contains('is-active'));
  assert.deepEqual(pageErrors, []);

  const failedVideo = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await failedVideo.route((url) => url.pathname.includes('Parte_4.') && url.pathname.endsWith('.mp4'), (route) => route.abort());
  await failedVideo.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await failedVideo.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 15 * innerHeight));
  await failedVideo.waitForFunction(() => document.querySelector('[data-clip][data-index="2"]')?.classList.contains('is-active'), undefined, { timeout: 45000 });
  await failedVideo.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 18.5 * innerHeight));
  await failedVideo.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.segmentIndex === '3');
  await failedVideo.waitForFunction(() => document.querySelector('[data-status]')?.textContent?.includes('Video no disponible'));
  assert.equal(await failedVideo.locator('[data-clip][data-index="2"].is-active').count(), 1, 'el clip anterior permanece visible si falla el cuarto');

  console.log(JSON.stringify({ published: '5 MP4, 5 WebP, 5 pósters idénticos a sus fuentes', scroll: '5 videos activos', finalPhoto: 'ok', failedVideo: 'respaldo visible', pageErrors }));
} finally {
  await browser.close();
}
