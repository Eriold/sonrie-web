import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await page.locator('video[data-clip]').first().waitFor({ state: 'attached' });
  assert.equal(await page.locator('video[data-clip]').count(), 5);
  assert.equal(await page.locator('[data-goto-stop]').count(), 5);
  assert.equal(await page.locator('[data-debug]').count(), 1);
  const stageBounds = await page.locator('[data-stage]').boundingBox();
  assert.equal(stageBounds?.x, 0);
  assert.equal(stageBounds?.width, 1280);

  await page.waitForFunction(() => {
    const stage = document.querySelector('[data-stage]');
    return stage?.dataset.phase === 'stop' && stage.dataset.segmentIndex === '0' && stage.dataset.visual === 'high-res-image';
  });
  assert.equal(await page.locator('[data-photo].is-active').getAttribute('data-asset'), 'Parte_1.webp');
  assert.equal(await page.locator('[data-clip][data-index="0"]').evaluate((video) => video.currentTime), 0);

  async function goToUnits(units, index, minimumTime) {
    await page.evaluate((value) => {
      const world = document.querySelector('[data-world]');
      window.scrollTo(0, world.offsetTop + value * window.innerHeight);
    }, units);
    await page.waitForFunction(({ expectedIndex, target }) => {
      const stage = document.querySelector('[data-stage]');
      const video = document.querySelectorAll('[data-clip]')[expectedIndex];
      return stage?.dataset.segmentIndex === String(expectedIndex)
        && stage.dataset.phase === 'video'
        && stage.dataset.visual === 'video'
        && video?.currentTime >= target
        && video.classList.contains('is-active')
        && video.paused;
    }, { expectedIndex: index, target: minimumTime }, { timeout: 30000 });
    return page.locator('[data-clip]').nth(index).evaluate((video) => video.currentTime);
  }

  const videoPositions = [3.5, 9, 14.5, 18.5, 24];
  const forward = [];
  for (const [index, units] of videoPositions.entries()) forward.push(await goToUnits(units, index, 0.5));
  const backward = await goToUnits(3.5, 0, 1);
  assert.ok(Math.abs(forward[0] - backward) < 0.1);
  assert.equal(await page.locator('[data-photo].is-active').count(), 0);

  const photoNames = ['Parte_1.webp', 'Parte_2.webp', 'Parte_3.webp', 'Parte_5.webp', 'Parte_6.webp'];
  for (const index of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    await page.getByRole('button', { name: `Ir a la parada ${index + 1}` }).click();
    await page.waitForFunction(({ expectedIndex, asset }) => {
      const stage = document.querySelector('[data-stage]');
      const photo = document.querySelector('[data-photo].is-active');
      return stage?.dataset.phase === 'stop'
        && stage.dataset.segmentIndex === String(expectedIndex)
        && stage.dataset.visual === 'high-res-image'
        && photo?.getAttribute('data-asset') === asset;
    }, { expectedIndex: index, asset: photoNames[index] });
    assert.equal(await page.locator('[data-stop]:visible').count(), 1);
    await page.waitForFunction(({ expectedIndex, after }) => {
      const video = document.querySelectorAll('[data-clip]')[expectedIndex];
      return video && video.paused && (after ? video.currentTime > video.duration - 0.1 : video.currentTime < 0.1);
    }, { expectedIndex: index, after: index >= 3 }, { timeout: 30000 });
  }

  const mode = page.getByRole('combobox', { name: 'Fondo de esta parada' });
  assert.equal(await mode.inputValue(), 'high-res-image');
  await mode.selectOption('poster-image');
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'poster-image');
  assert.equal(await page.locator('[data-poster].is-active').getAttribute('data-asset'), 'Parte_1.mp4');
  await mode.selectOption('video-freeze');
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'video');
  await mode.selectOption('high-res-image');
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'high-res-image');

  await page.getByRole('button', { name: 'Ir a la parada 4' }).click();
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.segmentIndex === '3');
  assert.equal(await page.locator('[data-photo].is-active').getAttribute('data-asset'), 'Parte_5.webp');
  assert.equal(await page.locator('[data-clip][data-index="4"]').getAttribute('data-asset'), 'Parte_5.mp4');
  assert.equal(await page.locator('[data-clip][data-asset="Parte_4.mp4"]').count(), 1);
  await goToUnits(18.5, 3, 0.5);
  assert.equal(await page.locator('[data-stop]:visible').count(), 0);
  assert.equal(await page.locator('[data-photo].is-active').count(), 0);
  await goToUnits(24, 4, 0.5);
  assert.equal(await page.locator('[data-photo].is-active').count(), 0);
  await goToUnits(25.9, 4, 7.3);
  await page.getByRole('button', { name: 'Ir a la parada 5' }).click();
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.stopId === 'parada-6');
  assert.equal(await page.locator('[data-photo].is-active').getAttribute('data-asset'), 'Parte_6.webp');
  assert.equal(await page.locator('[data-stop]:visible').count(), 1);
  await mode.selectOption('poster-image');
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'poster-image');
  assert.equal(await page.locator('[data-poster].is-active').getAttribute('data-asset'), 'Parte_5.mp4');
  await mode.selectOption('video-freeze');
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'video');
  await mode.selectOption('high-res-image');
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'high-res-image');

  await page.evaluate(() => {
    const world = document.querySelector('[data-world]');
    window.scrollTo(0, world.offsetTop + 6.8 * window.innerHeight);
  });
  await page.waitForFunction(() => Number(document.querySelector('[data-stage]')?.dataset.stopProgress) > 0.8);
  assert.equal(await page.locator('[data-photo].is-active').getAttribute('data-asset'), 'Parte_2.webp');
  assert.ok(await page.locator('[data-clip][data-index="1"]').evaluate((video) => video.currentTime) < 0.1);
  await page.evaluate(() => {
    const world = document.querySelector('[data-world]');
    window.scrollTo(0, world.offsetTop + 27 * window.innerHeight);
    window.scrollTo(0, world.offsetTop + 3.5 * window.innerHeight);
  });
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.segmentIndex === '0' && document.querySelector('[data-stage]')?.dataset.phase === 'video');
  assert.equal(await page.locator('[data-stop]:visible').count(), 0);
  await page.getByRole('link', { name: 'Saltar el recorrido' }).click();
  assert.equal(new URL(page.url()).hash, '#despues-del-recorrido');
  assert.deepEqual(errors, []);

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await reduced.waitForFunction(() => document.querySelector('[data-world]')?.dataset.motion === 'off');
  assert.equal(await reduced.locator('[data-world] video.is-active').count(), 0);
  assert.equal(await reduced.locator('[data-goto-stop]:visible').count(), 0);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
  await mobile.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await mobile.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'high-res-image');
  const mobilePhoto = await mobile.locator('[data-photo].is-active').evaluate((photo) => ({
    width: photo.getBoundingClientRect().width,
    height: photo.getBoundingClientRect().height,
    fit: getComputedStyle(photo).objectFit,
  }));
  assert.deepEqual(mobilePhoto, { width: 390, height: 844, fit: 'cover' });

  const delayed = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  let releaseFourth;
  const fourthReleased = new Promise((resolve) => { releaseFourth = resolve; });
  await delayed.route((url) => url.pathname.includes('Parte_4.') && url.pathname.endsWith('.mp4'), async (route) => {
    await fourthReleased;
    await route.continue();
  });
  await delayed.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await delayed.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 15 * innerHeight));
  await delayed.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'video' && document.querySelector('[data-clip][data-index="2"]')?.classList.contains('is-active'), { timeout: 30000 });
  await delayed.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 18.5 * innerHeight));
  await delayed.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.segmentIndex === '3');
  assert.equal(await delayed.locator('[data-clip][data-index="2"].is-active').count(), 1, 'el video anterior permanece visible mientras carga el siguiente');
  assert.notEqual(await delayed.locator('[data-stage]').getAttribute('data-visual'), 'fallback');
  releaseFourth();
  await delayed.waitForFunction(() => document.querySelector('[data-clip][data-index="3"]')?.classList.contains('is-active'), { timeout: 30000 });
  await delayed.evaluate(() => {
    const stage = document.querySelector('[data-stage]');
    window.visualHistory = [stage.dataset.visual];
    new MutationObserver(() => window.visualHistory.push(stage.dataset.visual)).observe(stage, { attributes: true, attributeFilter: ['data-visual'] });
    window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 15 * innerHeight);
  });
  await delayed.waitForFunction(() => document.querySelector('[data-clip][data-index="2"]')?.classList.contains('is-active') && document.querySelector('[data-stage]')?.dataset.segmentIndex === '2');
  assert.equal(await delayed.evaluate(() => window.visualHistory.includes('fallback')), false, 'el regreso conserva un fondo visible');

  const brokenPhoto = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await brokenPhoto.route((url) => url.pathname.includes('Parte_6.') && url.pathname.endsWith('.webp'), (route) => route.abort());
  await brokenPhoto.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await brokenPhoto.getByRole('button', { name: 'Ir a la parada 5' }).click();
  await brokenPhoto.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.segmentIndex === '4' && document.querySelector('[data-stage]')?.dataset.phase === 'stop');
  await brokenPhoto.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'poster-image', { timeout: 30000 });
  assert.equal(await brokenPhoto.locator('[data-poster][data-index="4"].is-active').count(), 1, 'el póster sustituye la foto fallida');
  console.log(JSON.stringify({ sequence: 'foto 1 → video 1 → foto 2 → video 2 → foto 3 → video 3 → video 4 → foto 5 → video 5 → foto 6', forward, backward, mediaModes: 'ok', responsive: 'ok', reducedMotion: 'ok', errors }, null, 2));
} finally {
  await browser.close();
}
