#!/usr/bin/env node
/**
 * For every mark the person pressed ("I saw a jump"), rank which channels moved most in the 300 ms
 * before the mark (reaction time is ~200–300 ms), and cut a frame strip around it from the video.
 *
 *   node tools/attribute.mjs [recording.json]
 */
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, basename } from 'node:path';

const DIR = 'lab/recordings';
const files = readdirSync(DIR).filter((f) => f.endsWith('.json') && !/\.(video-)?report\.json$|_screen\.json$/.test(f)).sort();
const target = process.argv[2] ?? join(DIR, files[files.length - 1]);
const rec = JSON.parse(readFileSync(target, 'utf8'));
const marks = rec.notes?.marks ?? [];
console.log(`# ${basename(target)}  marks: ${marks.length}  ${marks.map((m) => (m / 1000).toFixed(2) + 's').join(' ')}`);
if (!marks.length) { console.log('no marks in this recording'); process.exit(0); }
const s = rec.samples;
const DEG = Math.PI / 180;
const unit = (c) => (c.startsWith('bone.') ? 1 / DEG : 1); // bones reported in degrees
mkdirSync('lab/strips', { recursive: true });
const video = target.replace(/\.json$/, '.webm');
for (const [k, m] of marks.entries()) {
  const t0 = m - 450, t1 = m - 50; // the window the eye reacted to
  const win = s.filter((x) => x.t >= t0 && x.t <= t1);
  if (win.length < 3) { console.log(`mark ${k + 1} at ${(m / 1000).toFixed(2)}s: too early in the recording`); continue; }
  const rows = [];
  for (const c of rec.channels) {
    if (!/^bs\.|^bone\./.test(c)) continue;
    const vals = win.map((x) => x[c]).filter((v) => v !== undefined);
    if (vals.length < 3) continue;
    let maxStep = 0, range = Math.max(...vals) - Math.min(...vals);
    for (let i = 1; i < vals.length; i++) maxStep = Math.max(maxStep, Math.abs(vals[i] - vals[i - 1]));
    rows.push({ c, range: range * unit(c), maxStep: maxStep * unit(c) });
  }
  rows.sort((a, b) => b.range - a.range);
  console.log(`\nmark ${k + 1} at ${(m / 1000).toFixed(2)}s — what moved in the 400 ms before it (range / biggest single-frame step):`);
  for (const r of rows.slice(0, 8)) console.log(`   ${r.c.padEnd(28)} ${r.range.toFixed(3)}  /  ${r.maxStep.toFixed(3)}${r.c.startsWith('bone.') ? ' deg' : ''}`);
  if (existsSync(video)) {
    const start = Math.max(0, (m - 500) / 1000).toFixed(2);
    const out = `lab/strips/${basename(target, '.json')}_mark${k + 1}.png`;
    try {
      execSync(`ffmpeg -v error -y -ss ${start} -i "${video}" -fps_mode passthrough -frames:v 1 -vf "select='lt(n\\,18)',crop=iw*0.5:ih*0.5:iw*0.25:ih*0.2,scale=200:-1,tile=9x2" -update 1 "${out}"`);
      console.log(`   frames −0.5 s … +0.1 s: ${out}`);
    } catch { /* no video */ }
  }
}
