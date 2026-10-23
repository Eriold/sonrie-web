import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const baseUrl = process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function checkTimeline(page, mobile) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const slider = page.getByRole('slider', { name: 'Posición del recorrido' });
  await slider.waitFor();
  assert.equal(await slider.getAttribute('aria-orientation'), 'vertical');
  assert.equal(await page.locator('[data-goto-stop]').count(), 5);
  const track = await slider.boundingBox();
  assert.ok(track && track.height > 200);

  const progress = 0.32;
  const x = track.x + track.width / 2;
  const y = track.y + track.height * progress;
  if (mobile) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
  await page.waitForFunction(() => {
    const stage = document.querySelector('[data-stage]');
    return stage?.dataset.segmentIndex === '1' && stage.dataset.phase === 'video'
      && Number(stage.dataset.videoProgress) > 0.25;
  });
  assert.ok(Math.abs(Number(await slider.getAttribute('aria-valuenow')) - 32) <= 2);
  assert.equal(await page.locator('[data-clip][data-index="1"]').evaluate((video) => video.paused), true);

  const dragTrack = await slider.boundingBox();
  assert.ok(dragTrack);
  const dragX = dragTrack.x + dragTrack.width / 2;
  const dragStart = dragTrack.y + dragTrack.height * 0.55;
  const dragEnd = dragTrack.y + dragTrack.height * 0.65;
  if (mobile) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: dragX, y: dragStart }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: dragX, y: dragEnd }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(dragX, dragStart);
    await page.mouse.down();
    await page.mouse.move(dragX, dragEnd, { steps: 5 });
    await page.mouse.up();
  }
  await page.waitForFunction(() => Number(document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')) >= 64);
  assert.equal(await page.locator('[data-stage]').getAttribute('data-segment-index'), '3');

  const marker = await page.getByRole('button', { name: 'Ir a la parada 2' }).boundingBox();
  const markerTrack = await slider.boundingBox();
  assert.ok(marker && markerTrack);
  const markerX = marker.x + marker.width / 2;
  const markerY = marker.y + marker.height / 2;
  const markerEnd = markerTrack.y + markerTrack.height * 0.62;
  if (mobile) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: markerX, y: markerY }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: markerX, y: markerEnd }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(markerX, markerY);
    await page.mouse.down();
    await page.mouse.move(markerX, markerEnd, { steps: 5 });
    await page.mouse.up();
  }
  await page.waitForFunction(() => {
    const value = Number(document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow'));
    return value >= 61 && value <= 63;
  });

  await slider.focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => Number(document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')) > 62);
  await page.keyboard.press('Home');
  await page.waitForFunction(() => Number(document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')) === 0);
  await page.keyboard.press('End');
  await page.waitForFunction(() => Number(document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')) === 100);

  await page.getByRole('button', { name: 'Ir a la parada 3' }).click();
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.stopId === 'parada-3');
  assert.equal(await page.getByRole('button', { name: 'Ir a la parada 3' }).getAttribute('aria-current'), 'step');
  await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 0.6 * (document.querySelector('[data-world]').offsetHeight - innerHeight)));
  await page.waitForFunction(() => Number(document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')) >= 59);
  assert.deepEqual(errors, []);
}

try {
  await checkTimeline(await browser.newPage({ viewport: { width: 1280, height: 720 } }), false);
  await checkTimeline(await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true }), true);
  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await reduced.waitForFunction(() => document.querySelector('[data-world]')?.dataset.motion === 'off');
  assert.equal(await reduced.getByRole('slider', { name: 'Posición del recorrido' }).count(), 0);
  console.log(JSON.stringify({ desktop: 'marcas y navegación intermedia', mobile: 'tacto y teclado', reducedMotion: 'oculto' }));
} finally {
  await browser.close();
}
