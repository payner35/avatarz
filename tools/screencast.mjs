#!/usr/bin/env node
/**
 * Records what the compositor actually presents, no dialog: a Playwright Chromium opens the test page,
 * starts the PCM clip, and captures presented frames with timestamps via CDP Page.startScreencast.
 * Frames land in lab/screencast/<time>/ as JPEGs with a frames.json (timestamp, stage crop).
 *
 *   node tools/screencast.mjs [seconds=10] [url=http://localhost:5178/]
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const seconds = Number(process.argv[2] || 10);
globalThis.seconds = seconds;
const url = process.argv[3] || 'http://localhost:5178/';
const out = join('lab', 'screencast', new Date().toISOString().replace(/[:.]/g, '-'));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  headless: false,
  args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=angle', '--use-angle=metal', '--enable-gpu-rasterization', '--window-size=1456,900'],
});
const page = await browser.newPage({ viewport: { width: 1456, height: 820 }, deviceScaleFactor: 2 });
await page.goto(url);
await page.waitForFunction(() => /^ready|^error/.test(document.getElementById('status')?.textContent ?? ''), null, { timeout: 120000 });
const status = await page.evaluate(() => document.getElementById('status')?.textContent);
console.log('page:', status);
await page.click('#src-pcm');
await page.waitForTimeout(2500);

const crop = await page.evaluate(() => {
  const r = document.querySelector('.stage').getBoundingClientRect();
  return { x: r.left / innerWidth, y: r.top / innerHeight, w: r.width / innerWidth, h: r.height / innerHeight };
});
// The page's own animation-frame clock, logged in parallel, tells capture stutter from real stutter.
await page.evaluate(() => { (window).__raf = []; let last = performance.now(); const tick = (t) => { (window).__raf.push(t - last); last = t; requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
const cdp = await page.context().newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  frames.push({ i: frames.length, t: metadata.timestamp, w: metadata.deviceWidth, h: metadata.deviceHeight });
  writeFileSync(join(out, `f${String(frames.length - 1).padStart(4, '0')}.jpg`), Buffer.from(data, 'base64'));
  await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 80, maxWidth: 728, maxHeight: 410, everyNthFrame: 1 });
await page.waitForTimeout(seconds * 1000);
await cdp.send('Page.stopScreencast');
const raf = await page.evaluate((sec) => (window).__raf.slice(-60 * sec), seconds);
const rafMed = [...raf].sort((a, b) => a - b)[Math.floor(raf.length / 2)];
console.log(`page rAF: ${raf.length} frames, median ${rafMed.toFixed(1)} ms, >25 ms: ${raf.filter((d) => d > 25).length}, max ${Math.max(...raf).toFixed(0)} ms`);
await page.click('#stop').catch(() => {});
writeFileSync(join(out, 'frames.json'), JSON.stringify({ url, status, crop, seconds, frames }, null, 1));
const dts = frames.slice(1).map((f, i) => (f.t - frames[i].t) * 1000);
const med = [...dts].sort((a, b) => a - b)[Math.floor(dts.length / 2)];
console.log(`captured ${frames.length} presented frames in ${seconds}s (${(frames.length / seconds).toFixed(1)}/s), median interval ${med?.toFixed(1)} ms, >1.5x median: ${dts.filter((d) => d > 1.5 * med).length}, max ${Math.max(...dts).toFixed(0)} ms`);
console.log('saved', out);
await browser.close();
