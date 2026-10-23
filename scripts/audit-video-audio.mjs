import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.goto(process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const context = new AudioContext();
    const output = [];
    for (const video of document.querySelectorAll('[data-clip]')) {
      try {
        const response = await fetch(video.src);
        const decoded = await context.decodeAudioData(await response.arrayBuffer());
        let sum = 0;
        let peak = 0;
        let count = 0;
        for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
          const samples = decoded.getChannelData(channel);
          for (const sample of samples) {
            sum += sample * sample;
            peak = Math.max(peak, Math.abs(sample));
            count++;
          }
        }
        output.push({ asset: video.dataset.asset, channels: decoded.numberOfChannels, rms: Math.sqrt(sum / count), peak });
      } catch (error) {
        output.push({ asset: video.dataset.asset, error: String(error) });
      }
    }
    await context.close();
    return output;
  });
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
