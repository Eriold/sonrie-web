import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const baseUrl = process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await desktop.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await desktop.locator('[data-stage]').waitFor();
  assert.equal(await desktop.locator('[data-world]').evaluate((node) => node.getBoundingClientRect().height / innerHeight), 28.5);
  assert.match(await desktop.locator('[data-clip]').first().getAttribute('data-src'), /Parte_1(?:\.[^/]*)?\.mp4$/);

  const portrait = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errors = [];
  const originalVideoRequests = [];
  portrait.on('pageerror', (error) => errors.push(error.message));
  portrait.on('request', (request) => {
    if (/Parte_[1-5]\.[^/]*\.mp4$/.test(request.url())) originalVideoRequests.push(request.url());
  });
  await portrait.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await portrait.locator('[data-stage]').waitFor();
  assert.equal(await portrait.locator('[data-world]').evaluate((node) => node.getBoundingClientRect().height / innerHeight), 21);
  await portrait.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 2.5 * innerHeight));
  await portrait.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'video'
    && document.querySelector('[data-clip][data-index="0"]')?.currentTime > 0.5, undefined, { timeout: 30000 });
  const portraitVideo = await portrait.locator('[data-clip][data-index="0"]').evaluate((video) => ({
    src: video.currentSrc, width: video.videoWidth, height: video.videoHeight, paused: video.paused,
  }));
  assert.match(portraitVideo.src, /Parte_1-mobile-portrait(?:\.[^/]*)?\.mp4$/);
  assert.deepEqual([portraitVideo.width, portraitVideo.height, portraitVideo.paused], [480, 1040, true]);
  for (const [index, units] of [6.5, 10.5, 13, 17, 2.5].entries()) {
    await portrait.evaluate((value) => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + value * innerHeight), units);
    const expectedIndex = index === 4 ? 0 : index + 1;
    await portrait.waitForFunction((expected) => {
      const stage = document.querySelector('[data-stage]');
      const video = document.querySelectorAll('[data-clip]')[expected];
      return stage?.dataset.segmentIndex === String(expected) && stage.dataset.visual === 'video'
        && video?.currentTime > 0.5 && !video.seeking && video.paused;
    }, expectedIndex, { timeout: 30000 });
    assert.match(await portrait.locator('[data-clip]').nth(expectedIndex).evaluate((video) => video.currentSrc),
      new RegExp(`Parte_${expectedIndex + 1}-mobile-portrait(?:\\.[^/]*)?\\.mp4$`));
  }
  assert.ok(Math.abs(await portrait.locator('[data-clip]').first().evaluate((video) => video.currentTime) - 1.35) < 0.1);
  assert.deepEqual(originalVideoRequests, []);
  await portrait.setViewportSize({ width: 844, height: 390 });
  await portrait.waitForFunction(() => document.querySelector('[data-clip][data-index="0"]')?.videoWidth === 1280,
    undefined, { timeout: 30000 });
  assert.equal(await portrait.locator('[data-world]').evaluate((node) => node.getBoundingClientRect().height / innerHeight), 21);
  await portrait.setViewportSize({ width: 390, height: 844 });
  await portrait.waitForFunction(() => document.querySelector('[data-clip][data-index="0"]')?.videoWidth === 480,
    undefined, { timeout: 30000 });

  const landscape = await browser.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await landscape.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await landscape.locator('[data-stage]').waitFor();
  assert.equal(await landscape.locator('[data-world]').evaluate((node) => node.getBoundingClientRect().height / innerHeight), 21);
  await landscape.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 2.5 * innerHeight));
  await landscape.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.visual === 'video'
    && document.querySelector('[data-clip][data-index="0"]')?.currentTime > 0.5, undefined, { timeout: 30000 });
  const landscapeVideo = await landscape.locator('[data-clip][data-index="0"]').evaluate((video) => ({
    src: video.currentSrc, width: video.videoWidth, height: video.videoHeight,
  }));
  assert.match(landscapeVideo.src, /Parte_1-mobile-landscape(?:\.[^/]*)?\.mp4$/);
  assert.deepEqual([landscapeVideo.width, landscapeVideo.height], [1280, 720]);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ desktop: 'sin cambios', portrait: portraitVideo, landscape: landscapeVideo, errors }));
} finally {
  await browser.close();
}
