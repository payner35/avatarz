// Lip-lag probe for the test page. Paste into the console (or run via the lab) after the head is built.
// Plays the sample clip through the head's bus, records jawOpen per frame against the audio clock,
// then cross-correlates the HEARD audio envelope with the jaw over ±400 ms. Returns `leadMs`: how far
// the jaw moves BEFORE the sound is heard (positive = leads, as a real face does by 50–100 ms on
// rounding). The draw itself lands one to two frames after the weights, so the visible lead is
// ~25 ms less than this number. Correlation r is ~0.45–0.5 on the sample clip; shifts of 20 ms are
// noise, so compare runs on the same page load.
//   await lagProbe(window.avatarz, 12)
async function lagProbe(h, seconds = 12) {
  const ctx = h.tap.source.context;
  await ctx.resume();
  const res = await fetch('/@fs/Users/gavinpayne/Documents/Dev/avatarz/assets/audio/sample-24k.wav');
  // Parse the WAV by hand: the sample has a FLLR chunk that decodeAudioData refuses.
  const ab = await res.arrayBuffer(), dv = new DataView(ab);
  let p = 12, sr = 24000, pcm = null;
  while (p + 8 <= ab.byteLength) {
    const id = String.fromCharCode(dv.getUint8(p), dv.getUint8(p + 1), dv.getUint8(p + 2), dv.getUint8(p + 3)), len = dv.getUint32(p + 4, true);
    if (id === 'fmt ') sr = dv.getUint32(p + 12, true);
    if (id === 'data') { const i16 = new Int16Array(ab, p + 8, len >> 1); pcm = Float32Array.from(i16, (v) => v / 32768); break; }
    p += 8 + len + (len & 1);
  }
  const buf = ctx.createBuffer(1, pcm.length, sr); buf.copyToChannel(pcm, 0);
  h.cut?.();
  const src = new AudioBufferSourceNode(ctx, { buffer: buf });
  src.connect(h.tap.source);
  const t0 = ctx.currentTime + 0.2;
  src.start(t0);
  const ts = () => { const o = ctx.getOutputTimestamp(); return (o.contextTime ?? 0) + (performance.now() - (o.performanceTime ?? 0)) / 1000; };
  const rows = [];
  const end = performance.now() + seconds * 1000;
  while (performance.now() < end) {
    rows.push([ts(), h.renderer.weights.jawOpen ?? 0]);
    await new Promise((f) => requestAnimationFrame(f));
  }
  src.stop();
  const delay = h.tap.getDelay(), out = h.tap.outputLatency?.() ?? 0;
  // Heard envelope at each frame: RMS over 20 ms of the clip at the position being heard.
  const env = (c) => { const p = Math.round((c - t0 - delay - out) * sr); if (p < 0 || p + 480 >= pcm.length) return 0; let s = 0; for (let i = p; i < p + 480; i += 4) s += pcm[i] * pcm[i]; return Math.sqrt(s / 120); };
  const T = rows.map(([c]) => c);
  // Correlate ONSETS, not levels: the positive rate of change of each signal. Levels give a broad peak
  // (±50 ms); the rises are sharp and are what the eye locks onto.
  const rise = (arr) => arr.map((v, i) => Math.max(0, v - (arr[i - 2] ?? v)));
  const E = rise(rows.map(([c]) => env(c))), J = rise(rows.map(([, j]) => j));
  const interp = (arr, t) => { let lo = 0, hi = T.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (T[m] <= t) lo = m; else hi = m; } const f = (t - T[lo]) / Math.max(1e-6, T[hi] - T[lo]); return arr[lo] + (arr[hi] - arr[lo]) * Math.min(1, Math.max(0, f)); };
  const corr = (lag) => { let sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0, n = 0; for (let i = 0; i < T.length; i++) { const t = T[i] - lag / 1000; if (t < T[0] || t > T[T.length - 1]) continue; const x = E[i], y = interp(J, t); sx += x; sy += y; sxy += x * y; sxx += x * x; syy += y * y; n++; } const cov = sxy / n - (sx / n) * (sy / n); return cov / Math.sqrt((sxx / n - (sx / n) ** 2) * (syy / n - (sy / n) ** 2) + 1e-12); };
  let best = 0, bestR = -2; const curve = [];
  for (let lag = -300; lag <= 300; lag += 5) { const r = corr(lag); curve.push([lag, +r.toFixed(3)]); if (r > bestR) { bestR = r; best = lag; } }
  return { leadMs: best, r: +bestR.toFixed(3), frames: rows.length, delayMs: Math.round(delay * 1000), outMs: Math.round(out * 1000), extractor: h.metrics.extractor, curve };
}
window.lagProbe = lagProbe;
