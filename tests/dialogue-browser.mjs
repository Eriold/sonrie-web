import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const baseUrl = process.env.SONRIE_PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const starts = [0, 5.5, 11, 20.5, 26];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('[data-dialogue]').count(), 5);
  assert.equal(await page.locator('[data-dialogue-action]').count(), 0);

  const goTo = async (units, index, visible) => {
    await page.evaluate((position) => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + position * innerHeight), units);
    await page.waitForFunction(({ stopIndex, expectedVisible }) => {
      const stage = document.querySelector('[data-stage]');
      const dialogue = document.querySelector(`[data-dialogue][data-stop-index="${stopIndex}"]`);
      return stage?.dataset.phase === 'stop' && stage.dataset.segmentIndex === String(stopIndex)
        && Boolean(dialogue && !dialogue.hidden) === expectedVisible;
    }, { stopIndex: index, expectedVisible: visible }, { timeout: 30000 });
  };

  for (const [index, start] of starts.entries()) {
    await goTo(start + 0.2, index, false);
    await goTo(start + 0.8, index, true);
    const dialogue = page.locator(`[data-dialogue][data-stop-index="${index}"]`);
    assert.equal(await page.locator(`[data-character][data-stop-index="${index}"].is-visible`).count(), 1, 'el personaje y el diálogo entran juntos');
    assert.equal(await dialogue.getByRole('link', { name: 'Saltar el recorrido' }).count(), 1);
    assert.equal(await dialogue.locator('[data-dialogue-page]:visible').count(), 1);
    assert.equal(await dialogue.locator('[data-page-indicator]').textContent(), '1 / 2');
    if (index === 0 && process.env.SONRIE_CAPTURE === '1') {
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'dist/f5-dialogue-desktop.png' });
    }
    await dialogue.getByRole('button', { name: 'Siguiente página' }).click();
    assert.equal(await dialogue.locator('[data-page-indicator]').textContent(), '2 / 2');
    await goTo(start + 1.1, index, true);
    assert.equal(await dialogue.locator('[data-page-indicator]').textContent(), '2 / 2', 'el scroll no cambia la página de diálogo');
    await dialogue.getByRole('button', { name: 'Página anterior' }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await dialogue.locator('[data-page-indicator]').textContent(), '1 / 2');
    await goTo(start + 0.2, index, false);
  }

  await goTo(0.8, 0, true);
  await page.locator('[data-dialogue][data-stop-index="0"]').getByRole('button', { name: 'Siguiente página' }).click();
  await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 3.5 * innerHeight));
  await page.waitForFunction(() => document.querySelector('[data-stage]')?.dataset.phase === 'video');
  await goTo(0.8, 0, true);
  assert.equal(await page.locator('[data-dialogue][data-stop-index="0"] [data-page-indicator]').textContent(), '2 / 2', 'la página se conserva al regresar a la parada');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await mobile.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 0.8 * innerHeight));
  await mobile.locator('[data-dialogue]:visible').waitFor();
  await mobile.locator('[data-dialogue]:visible').getByRole('button', { name: 'Siguiente página' }).tap();
  assert.equal(await mobile.locator('[data-dialogue]:visible [data-page-indicator]').textContent(), '2 / 2');
  const bounds = await mobile.locator('[data-dialogue]:visible').boundingBox();
  assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y >= 0 && bounds.y + bounds.height <= 844);
  if (process.env.SONRIE_CAPTURE === '1') {
    await mobile.waitForTimeout(300);
    await mobile.screenshot({ path: 'dist/f5-dialogue-mobile.png' });
  }

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await reduced.waitForFunction(() => document.querySelector('[data-world]')?.dataset.motion === 'off');
  assert.equal(await reduced.locator('[data-static-dialogue]:visible').count(), 5);

  const broken = await browser.newPage();
  await broken.route((url) => decodeURIComponent(url.pathname).includes('Friendly Mint Receptionist Illustration') && url.pathname.endsWith('.png'), (route) => route.abort());
  await broken.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await broken.evaluate(() => window.scrollTo(0, document.querySelector('[data-world]').offsetTop + 0.8 * innerHeight));
  await broken.locator('[data-dialogue][data-stop-index="0"]:visible').waitFor();
  assert.equal(await broken.locator('[data-character].is-visible').count(), 0);
  await broken.locator('[data-photo][data-index="0"].is-active').waitFor();
  assert.equal(await broken.locator('[data-photo][data-index="0"].is-active').count(), 1);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ stops: 5, explicitPaging: 'mouse, keyboard, touch', scrollKeepsPage: 'ok', mobile: 'ok', reducedMotion: '5 textos visibles', failedAvatar: 'texto visible', actions: 0, errors }));
} finally {
  await browser.close();
}
