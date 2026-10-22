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
  const stageBounds = await page.locator('[data-stage]').boundingBox();
  assert.equal(stageBounds?.x, 0);
  assert.equal(stageBounds?.width, 1280);
  assert.equal(await page.locator('[data-debug]').count(), 1);
  assert.equal(await page.locator('[data-goto-stop]').count(), 5);

  async function goToUnits(units, index, minimumTime) {
    await page.evaluate((value) => {
      const world = document.querySelector('[data-world]');
      window.scrollTo(0, world.offsetTop + value * window.innerHeight);
    }, units);
    await page.waitForFunction(({ expectedIndex, target }) => {
      const stage = document.querySelector('[data-stage]');
      const video = document.querySelectorAll('[data-clip]')[expectedIndex];
      return stage?.dataset.segmentIndex === String(expectedIndex)
        && video?.currentTime >= target
        && video.paused;
    }, { expectedIndex: index, target: minimumTime }, { timeout: 30000 });
    return page.evaluate((i) => ({
      phase: document.querySelector('[data-stage]').dataset.phase,
      time: document.querySelectorAll('[data-clip]')[i].currentTime,
    }), index);
  }

  const forward = await goToUnits(2, 0, 1);
  const allVideos = [];
  for (let index = 1; index < 5; index += 1) {
    allVideos.push(await goToUnits(index * 5.5 + 2, index, 0.5));
  }
  const backward = await goToUnits(2, 0, 1);
  assert.equal(forward.phase, 'video');
  assert.ok(allVideos.every(({ phase }) => phase === 'video'));
  assert.ok(Math.abs(forward.time - backward.time) < 0.1);
  for (const index of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    await page.getByRole('button', { name: `Ir a la parada ${index + 1}` }).click();
    await page.waitForFunction((expected) => {
      const stage = document.querySelector('[data-stage]');
      const visibleStop = [...document.querySelectorAll('[data-stop]')].find((stop) => !stop.hidden);
      return stage?.dataset.phase === 'stop'
        && stage.dataset.segmentIndex === String(expected)
        && visibleStop?.getAttribute('data-stop-id') === `parada-${expected + 1}`;
    }, index);
    assert.equal(await page.locator('[data-stop]:visible').count(), 1);
  }
  await page.getByRole('button', { name: 'Ir a la parada 5' }).click();
  await page.waitForFunction(() => {
    const stage = document.querySelector('[data-stage]');
    return stage?.dataset.segmentIndex === '4' && stage.dataset.phase === 'stop';
  });
  assert.equal(await page.locator('[data-stop]:visible').count(), 1);
  assert.equal(await page.locator('[data-stop]:visible').getAttribute('data-stop-id'), 'parada-5');
  assert.equal(await page.locator('[data-stage]').getAttribute('data-stop-id'), 'parada-5');
  assert.equal(await page.locator('[data-goto-stop="4"]').getAttribute('aria-current'), 'step');
  await page.getByRole('button', { name: 'Ir a la parada 2' }).click();
  await page.waitForFunction(() => {
    const stage = document.querySelector('[data-stage]');
    return stage?.dataset.segmentIndex === '1' && stage.dataset.phase === 'stop';
  });
  assert.equal(await page.locator('[data-stop]:visible').getAttribute('data-stop-id'), 'parada-2');
  const stopTime = await page.locator('[data-clip][data-index="1"]').evaluate((video) => video.currentTime);
  await page.evaluate(() => {
    const world = document.querySelector('[data-world]');
    window.scrollTo(0, world.offsetTop + 10.8 * window.innerHeight);
  });
  await page.waitForFunction(() => Number(document.querySelector('[data-stage]')?.dataset.stopProgress) > 0.8);
  assert.equal(await page.locator('[data-stop]:visible').getAttribute('data-stop-id'), 'parada-2');
  assert.ok(Math.abs((await page.locator('[data-clip][data-index="1"]').evaluate((video) => video.currentTime)) - stopTime) < 0.1);
  await page.evaluate(() => {
    const world = document.querySelector('[data-world]');
    window.scrollTo(0, world.offsetTop + 27 * window.innerHeight);
    window.scrollTo(0, world.offsetTop + 2 * window.innerHeight);
  });
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.segmentIndex === '0');
  assert.equal(await page.locator('[data-stop]:visible').count(), 0);
  await page.getByRole('link', { name: 'Saltar el recorrido' }).click();
  assert.equal(new URL(page.url()).hash, '#despues-del-recorrido');
  assert.deepEqual(errors, []);

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await reduced.waitForFunction(() => document.querySelector('[data-world]')?.dataset.motion === 'off');
  assert.equal(await reduced.locator('[data-world] video.is-active').count(), 0);
  assert.equal(await reduced.locator('[data-goto-stop]:visible').count(), 0);
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await mobile.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  assert.equal((await mobile.locator('[data-stage]').boundingBox())?.width, 390);
  console.log(JSON.stringify({ forward, allVideos, backward, fullWidth: 'desktop and mobile', stopJumps: 'ok', reducedMotion: 'ok', errors }, null, 2));
} finally {
  await browser.close();
}
