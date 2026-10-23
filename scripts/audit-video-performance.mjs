import { chromium } from 'playwright-core';

const baseUrl = process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const positions = [
  [1.8, 4.5],
  [7.3, 10.0],
  [12.8, 15.5],
  [16.7, 19.3],
  [22.2, 24.8],
];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const slowNetwork = process.env.SONRIE_AUDIT_SLOW === '1';
  if (slowNetwork) await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 500000,
    uploadThroughput: 500000,
  });
  await cdp.send('Performance.enable');
  const requests = new Map();
  const videoResponses = [];
  const receivedBytes = new Map();
  cdp.on('Network.responseReceived', ({ requestId, response }) => {
    if (/Parte_[1-5]\.[^/]*\.mp4(?:\?|$)/.test(response.url)) {
      requests.set(requestId, { asset: response.url.match(/Parte_[1-5]/)?.[0], status: response.status });
    }
  });
  cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
    const request = requests.get(requestId);
    if (request) videoResponses.push({ requestId, ...request, encodedBytes: encodedDataLength });
  });
  cdp.on('Network.dataReceived', ({ requestId, encodedDataLength }) => {
    if (requests.has(requestId)) receivedBytes.set(requestId, (receivedBytes.get(requestId) ?? 0) + encodedDataLength);
  });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-stage]').waitFor();
  await page.waitForTimeout(1000);
  const initialVideoEncodedBytes = [...receivedBytes.values()].reduce((sum, bytes) => sum + bytes, 0);

  const seek = async (index, units) => {
    const start = performance.now();
    await page.evaluate((position) => {
      window.scrollTo(0, document.querySelector('[data-world]').offsetTop + position * innerHeight);
    }, units);
    await page.waitForFunction((expectedIndex) => {
      const stage = document.querySelector('[data-stage]');
      const video = document.querySelectorAll('[data-clip]')[expectedIndex];
      return stage?.dataset.segmentIndex === String(expectedIndex)
        && stage.dataset.phase === 'video'
        && stage.dataset.visual === 'video'
        && video?.classList.contains('is-active')
        && video.readyState >= 2 && !video.seeking && video.paused
        && Math.abs(video.currentTime - Number(stage.dataset.videoTime)) < 0.08;
    }, index, { timeout: 45000 });
    return Math.round(performance.now() - start);
  };

  const samples = [];
  for (const [index, [early, late]] of positions.entries()) {
    samples.push({ video: index + 1, entryMs: await seek(index, early), forwardMs: await seek(index, late), reverseMs: await seek(index, early) });
  }
  await page.waitForTimeout(1000);
  const metrics = await cdp.send('Performance.getMetrics');
  const values = Object.fromEntries(metrics.metrics.map(({ name, value }) => [name, value]));
  const media = await page.locator('[data-clip]').evaluateAll((videos) => videos.map((video) => ({
    asset: video.dataset.asset,
    readyState: video.readyState,
    bufferedSeconds: [...Array(video.buffered.length)].map((_, index) => [video.buffered.start(index), video.buffered.end(index)]),
  })));
  console.log(JSON.stringify({
    browser: browser.version(),
    network: slowNetwork ? '4 Mb/s, 150 ms RTT simulado' : 'local sin límite simulado',
    samples,
    initialVideoEncodedBytes,
    videoResponses: videoResponses.map(({ requestId, ...response }) => response),
    totalVideoReceivedBytes: [...receivedBytes.values()].reduce((sum, bytes) => sum + bytes, 0),
    pendingVideoRequests: [...requests.keys()].filter((id) => !videoResponses.some((response) => response.requestId === id)).length,
    jsHeapUsedMiB: Number((values.JSHeapUsedSize / 1048576).toFixed(2)),
    jsHeapTotalMiB: Number((values.JSHeapTotalSize / 1048576).toFixed(2)),
    media,
    pageErrors,
  }, null, 2));
} finally {
  await browser.close();
}
