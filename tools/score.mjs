#!/usr/bin/env node
/**
 * Motion scorer. Reads a lab recording and reports, per channel, how fast and how often things move,
 * then classifies problems the eye reads as "jumpy":
 *   twitch   a single-frame step far larger than the channel's usual step
 *   pop      a step larger than an absolute human-range limit
 *   busy     too many direction reversals per second
 *   judder   uneven frame timing (dt spikes)
 * Thresholds are PROVISIONAL until a reference recording of a real face replaces them (see --ref).
 *
 *   node tools/score.mjs [recording.json] [--baseline other.json] [--ref reference.json] [--all]
 * Default: the newest recording in lab/recordings, diffed against the previous one with the same label.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const DIR = 'lab/recordings';
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const showAll = args.includes('--all');
const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.json') && !f.endsWith('.report.json') && !f.endsWith('.video-report.json') && !f.endsWith('_screen.json')).sort() : [];
const target = args.find((a) => a.endsWith('.json') && !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--baseline' && args[args.indexOf(a) - 1] !== '--ref') ?? (files.length ? join(DIR, files[files.length - 1]) : null);
if (!target) { console.error('no recording'); process.exit(1); }
const rec = JSON.parse(readFileSync(target, 'utf8'));
const label = rec.label;
let baselinePath = flag('--baseline');
if (!baselinePath) {
  const same = files.map((f) => join(DIR, f)).filter((f) => f !== target && JSON.parse(readFileSync(f, 'utf8')).label === label);
  baselinePath = same.length ? same[same.length - 1] : null;
}
const refPath = flag('--ref');

// Provisional human-range limits per channel family. Units: blendshapes 0..1, bones radians.
const DEG = Math.PI / 180;
const LIMITS = {
  mouth: { step: 0.06, vel: 3.0, revPerSec: 6 },     // lips: ~a quarter of range per 100 ms
  eyeLook: { step: 0.35, vel: 25, revPerSec: 4 },    // saccades are fast but rare
  eyeBlink: { step: 0.6, vel: 25, revPerSec: 2 },    // a blink closes in ~90 ms
  brow: { step: 0.08, vel: 2.0, revPerSec: 3 },
  face: { step: 0.08, vel: 2.0, revPerSec: 3 },      // cheeks, nose, other
  bone: { step: 0.4 * DEG, vel: 60 * DEG, revPerSec: 2 }, // head: ≤60°/s in conversation
};
const family = (c) => c.startsWith('bone.') ? 'bone'
  : c.startsWith('bs.eyeBlink') ? 'eyeBlink'
  : c.startsWith('bs.eyeLook') ? 'eyeLook'
  : c.startsWith('bs.mouth') || c.startsWith('bs.jaw') || c === 'bs.tongueOut' ? 'mouth'
  : c.startsWith('bs.brow') ? 'brow'
  : c.startsWith('bs.') ? 'face' : null;

function analyse(rec) {
  const s = rec.samples;
  const out = { channels: {}, frames: s.length, seconds: s.length ? s[s.length - 1].t / 1000 : 0, judder: {} };
  const dts = s.slice(1).map((x) => x.dt);
  const med = [...dts].sort((a, b) => a - b)[Math.floor(dts.length / 2)] || 16.7;
  out.judder = { medianDt: med, spikes: dts.filter((d) => d > 1.5 * med).length, maxDt: Math.max(...dts), fps: rec.fps };
  for (const c of rec.channels) {
    const fam = family(c); if (!fam) continue;
    const L = LIMITS[fam];
    let min = Infinity, max = -Infinity, prev = null, prevV = 0, steps = [], vels = [], rev = 0, twitch = 0, pop = 0;
    for (let i = 0; i < s.length; i++) {
      const x = s[i][c]; if (x === undefined) continue;
      if (x < min) min = x; if (x > max) max = x;
      if (prev !== null) {
        const d = x - prev, dt = Math.max(1, s[i].dt) / 1000, v = d / dt;
        steps.push(Math.abs(d)); vels.push(Math.abs(v));
        if (Math.abs(d) > L.step) pop++;
        if (prevV !== 0 && Math.sign(v) !== 0 && Math.sign(v) !== Math.sign(prevV) && Math.abs(d) > L.step * 0.15) rev++;
        if (v !== 0) prevV = v;
      }
      prev = x;
    }
    if (!steps.length) continue;
    const sorted = [...steps].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(0.95 * (sorted.length - 1))], p50 = sorted[Math.floor(0.5 * (sorted.length - 1))];
    // A blink is meant to be a fast move; its profile is checked separately.
    twitch = fam === 'eyeBlink' ? 0 : steps.filter((d) => d > Math.max(4 * p95, L.step * 0.5)).length;
    const vs = [...vels].sort((a, b) => a - b);
    out.channels[c] = {
      fam, range: max - min, p50Step: p50, p95Step: p95, maxStep: Math.max(...steps),
      p95Vel: vs[Math.floor(0.95 * (vs.length - 1))], maxVel: Math.max(...vels),
      revPerSec: rev / out.seconds, pops: pop, twitches: twitch,
      flags: [
        ...(pop > 0 ? ['pop'] : []), ...(twitch > 0 ? ['twitch'] : []),
        ...(rev / out.seconds > L.revPerSec && (max - min) > L.step ? ['busy'] : []),
      ],
    };
  }
  // Blinks
  const b = s.map((x) => x['bs.eyeBlinkLeft'] ?? 0);
  const blinks = []; let inB = false, start = 0, closeAt = 0;
  for (let i = 1; i < b.length; i++) {
    if (!inB && b[i] > 0.5 && b[i - 1] <= 0.5) { inB = true; start = i; closeAt = s[i].t; }
    if (inB && b[i] <= 0.5 && b[i - 1] > 0.5) { inB = false; blinks.push({ at: s[start].t / 1000, closedMs: s[i].t - closeAt }); }
  }
  const intervals = blinks.slice(1).map((x, i) => x.at - blinks[i].at);
  out.blinks = { count: blinks.length, perMin: blinks.length / Math.max(1e-6, out.seconds) * 60, intervals: intervals.map((x) => +x.toFixed(1)), closedMs: blinks.map((x) => Math.round(x.closedMs)) };
  // Mouth
  const jaw = s.map((x) => x['bs.jawOpen'] ?? 0), spk = s.map((x) => x['vis.speaking'] ?? 0);
  const speakingFrames = spk.filter((x) => x > 0).length;
  out.mouth = { closedPct: Math.round(100 * jaw.filter((x) => x < 0.05).length / jaw.length), openPct: Math.round(100 * jaw.filter((x) => x > 0.2).length / jaw.length), speakingPct: Math.round(100 * speakingFrames / jaw.length) };
  // Rhythm check: head motion locked to syllables. Correlate head pitch/yaw velocity with jaw velocity
  // over speaking frames; a real head does not bob on every syllable. |r| above 0.35 is flagged.
  const jawV = [], pV = [], yV = [];
  for (let i = 1; i < s.length; i++) {
    if (!(s[i]['vis.speaking'] > 0)) continue;
    const dt = Math.max(1, s[i].dt) / 1000;
    jawV.push(((s[i]['bs.jawOpen'] ?? 0) - (s[i - 1]['bs.jawOpen'] ?? 0)) / dt);
    pV.push(((s[i]['bone.head.pitch'] ?? 0) - (s[i - 1]['bone.head.pitch'] ?? 0)) / dt);
    yV.push(((s[i]['bone.head.yaw'] ?? 0) - (s[i - 1]['bone.head.yaw'] ?? 0)) / dt);
  }
  const corr = (a, b) => { const n = a.length; if (n < 30) return 0; const ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n; let sab = 0, saa = 0, sbb = 0; for (let i = 0; i < n; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return saa && sbb ? sab / Math.sqrt(saa * sbb) : 0; };
  out.rhythm = { headPitchVsJaw: corr(pV, jawV), headYawVsJaw: corr(yV, jawV), speakingFrames: jawV.length };
  // Safety limiter activity, from the cumulative counter the renderer exposes.
  const lh = s.map((x) => x['sys.limiterHits']).filter((x) => x !== undefined);
  out.limiterHitsPerSec = lh.length > 1 ? (lh[lh.length - 1] - lh[0]) / out.seconds : null;
  // Head ranges in degrees
  const deg = (c) => { const ch = out.channels[c]; return ch ? +(ch.range / DEG).toFixed(1) : null; };
  out.head = { yawRangeDeg: deg('bone.head.yaw'), pitchRangeDeg: deg('bone.head.pitch'), rollRangeDeg: deg('bone.head.roll'), p95VelDegPerS: out.channels['bone.head.yaw'] ? +(out.channels['bone.head.yaw'].p95Vel / DEG).toFixed(1) : null };
  return out;
}

const fmt = (x, d = 3) => (x === null || x === undefined ? '–' : typeof x === 'number' ? x.toFixed(d) : String(x));
const rep = analyse(rec);
const base = baselinePath ? analyse(JSON.parse(readFileSync(baselinePath, 'utf8'))) : null;

console.log(`# ${basename(target)}  (${rep.frames} frames, ${rep.seconds.toFixed(1)} s, ${rep.judder.fps.toFixed(0)} fps)`);
console.log(`notes: ${JSON.stringify(rec.notes)}`);
console.log(`timing: median dt ${rep.judder.medianDt.toFixed(1)} ms, spikes >1.5× ${rep.judder.spikes}, max dt ${rep.judder.maxDt.toFixed(0)} ms  ${rep.judder.spikes > rep.frames * 0.05 ? '⚠ judder' : 'ok'}`);
console.log(`blinks: ${rep.blinks.count} (${rep.blinks.perMin.toFixed(0)}/min) intervals s ${rep.blinks.intervals.join(',')} closed ms ${rep.blinks.closedMs.join(',')}`);
console.log(`mouth: closed ${rep.mouth.closedPct}% open ${rep.mouth.openPct}% speaking ${rep.mouth.speakingPct}%  limiter hits/s ${rep.limiterHitsPerSec === null ? '–' : rep.limiterHitsPerSec.toFixed(1)}${base?.limiterHitsPerSec != null ? ` (was ${base.limiterHitsPerSec.toFixed(1)})` : ''}`);
console.log(`head: yaw ${fmt(rep.head.yawRangeDeg, 1)}° pitch ${fmt(rep.head.pitchRangeDeg, 1)}° roll ${fmt(rep.head.rollRangeDeg, 1)}° range, p95 yaw speed ${fmt(rep.head.p95VelDegPerS, 1)}°/s`);
const rh = rep.rhythm;
console.log(`rhythm: head pitch vs jaw r=${rh.headPitchVsJaw.toFixed(2)}, yaw vs jaw r=${rh.headYawVsJaw.toFixed(2)} over ${rh.speakingFrames} speaking frames ${Math.abs(rh.headPitchVsJaw) > 0.35 || Math.abs(rh.headYawVsJaw) > 0.35 ? '⚠ head bobs with the syllables' : 'ok'}`);
console.log('');
const flagged = Object.entries(rep.channels).filter(([, v]) => v.flags.length);
console.log(`flags: ${flagged.length ? flagged.map(([c, v]) => `${c} [${v.flags.join(',')}] pops ${v.pops} twitches ${v.twitches} rev/s ${v.revPerSec.toFixed(1)} maxStep ${fmt(v.maxStep)}`).join('\n       ') : 'none'}`);
console.log('');
const rows = Object.entries(rep.channels).filter(([, v]) => showAll || v.range > 0.01).sort((a, b) => b[1].maxStep / LIMITS[b[1].fam].step - a[1].maxStep / LIMITS[a[1].fam].step).slice(0, showAll ? 999 : 20);
console.log('channel                         range   p50step p95step maxstep  p95vel  rev/s  vs limit');
for (const [c, v] of rows) {
  const L = LIMITS[v.fam];
  let d = '';
  if (base?.channels[c]) { const b = base.channels[c]; const r = (v.p95Step + 1e-6) / (b.p95Step + 1e-6); d = r > 1.2 ? ` ↑${((r - 1) * 100).toFixed(0)}%` : r < 0.8 ? ` ↓${((1 - r) * 100).toFixed(0)}%` : ' ='; }
  console.log(`${c.padEnd(30)} ${fmt(v.range).padStart(7)} ${fmt(v.p50Step).padStart(7)} ${fmt(v.p95Step).padStart(7)} ${fmt(v.maxStep).padStart(7)} ${fmt(v.p95Vel, 2).padStart(7)} ${v.revPerSec.toFixed(1).padStart(6)}  ${(v.maxStep / L.step).toFixed(2)}×${d}`);
}
if (base) console.log(`\n(diff vs ${basename(baselinePath)}: ↑/↓ = p95 step changed >20%)`);
writeFileSync(target.replace(/\.json$/, '.report.json'), JSON.stringify(rep, null, 1));
