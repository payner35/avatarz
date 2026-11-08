/**
 * Prosody meter: pitch, loudness and rate from the tapped audio, turned into a continuous
 * emotion blend. Nothing is sent by the workflow or the vendor; the face reads the voice.
 *
 * Features (rolling, during speech only):
 *   f0Rel   pitch relative to this speaker's running baseline (semitones)
 *   f0Var   pitch movement (semitone std over ~2 s)
 *   f0Slope recent pitch direction (semitones per second)
 *   level   loudness relative to the speaker's running loud level
 *   rate    syllable-ish rate from loudness peaks per second
 * Mapping (continuous, eased):
 *   animated / amused  <- high pitch movement, raised pitch, lively rate
 *   warm               <- moderate movement, relaxed rate, falling-to-flat contours
 *   concerned          <- low pitch, little movement, low level
 *   surprised          <- sharp pitch rise with a loudness jump
 *   thoughtful         <- slow rate, long pauses, flat pitch
 */
export interface EmotionMix { warm: number; amused: number; concerned: number; surprised: number; thoughtful: number }

export class ProsodyMeter {
  private analyser: AnalyserNode | null = null;
  private source: AudioNode | null = null;
  private buf: Float32Array<ArrayBuffer> = new Float32Array(0);
  private sampleRate = 24000;
  private lastAt = 0;
  // Pitch history (semitones vs 100 Hz) with times, speech only.
  private f0Hist: { t: number; st: number }[] = [];
  private baseline = 0; // running median-ish of semitones
  private baselineN = 0;
  private loudRef = 0.05; // running "loud speech" reference
  private peaks: number[] = [];
  private lastPeakAt = 0;
  private envPrev = 0;
  private env = 0;
  private speakingSince = 0;
  private silentSince = 0;
  /** Latest features, for the test page. */
  readonly features = { f0Hz: 0, f0Rel: 0, f0Var: 0, f0Slope: 0, level: 0, rate: 0, speaking: false };
  readonly mix: EmotionMix = { warm: 0, amused: 0, concerned: 0, surprised: 0, thoughtful: 0 };
  private target: EmotionMix = { warm: 0, amused: 0, concerned: 0, surprised: 0, thoughtful: 0 };

  start(node: AudioNode, context: AudioContext): void {
    this.stop();
    this.analyser = new AnalyserNode(context, { fftSize: 2048, smoothingTimeConstant: 0 });
    this.buf = new Float32Array(2048) as Float32Array<ArrayBuffer>;
    this.sampleRate = context.sampleRate;
    node.connect(this.analyser);
    this.source = node;
  }

  stop(): void {
    if (this.source && this.analyser) { try { this.source.disconnect(this.analyser); } catch { /* */ } }
    this.analyser = null; this.source = null;
  }

  reset(): void {
    this.f0Hist.length = 0; this.peaks.length = 0;
    for (const k of Object.keys(this.target) as (keyof EmotionMix)[]) { this.target[k] = 0; }
  }

  /** Autocorrelation pitch on the latest window; returns Hz or 0 when unvoiced. */
  private pitch(x: Float32Array, rms: number): number {
    if (rms < 0.01) return 0;
    const sr = this.sampleRate;
    const minLag = Math.floor(sr / 400), maxLag = Math.min(x.length - 1, Math.ceil(sr / 70));
    const n = x.length;
    let e0 = 0; for (let i = 0; i < n; i++) e0 += x[i] * x[i];
    if (e0 <= 0) return 0;
    let best = 0, bestLag = 0;
    // Coarse-to-fine: every 2nd lag, then refine around the best.
    for (let lag = minLag; lag <= maxLag; lag += 2) {
      let s = 0; for (let i = 0; i + lag < n; i += 2) s += x[i] * x[i + lag];
      const r = s / e0 * 2;
      if (r > best) { best = r; bestLag = lag; }
    }
    if (best < 0.35) return 0; // unvoiced or noise
    let fine = bestLag, fineBest = -1;
    for (let lag = Math.max(minLag, bestLag - 2); lag <= Math.min(maxLag, bestLag + 2); lag++) {
      let s = 0; for (let i = 0; i + lag < n; i++) s += x[i] * x[i + lag];
      if (s > fineBest) { fineBest = s; fine = lag; }
    }
    return sr / fine;
  }

  /** Call every frame; cheap except for the pitch pass, which runs at most every 40 ms. */
  update(now: number, dt: number): EmotionMix {
    const a = this.analyser;
    const f = this.features;
    if (a && now - this.lastAt >= 40) {
      this.lastAt = now;
      a.getFloatTimeDomainData(this.buf);
      const x = this.buf;
      let sum = 0; for (let i = 0; i < x.length; i++) sum += x[i] * x[i];
      const rms = Math.sqrt(sum / x.length);
      const speaking = rms > 0.012;
      f.speaking = speaking;
      if (speaking) { if (!this.speakingSince) this.speakingSince = now; this.silentSince = 0; }
      else { if (!this.silentSince) this.silentSince = now; this.speakingSince = 0; }

      // Loudness reference and envelope peaks (syllable rate).
      if (speaking) this.loudRef += (Math.max(rms, this.loudRef * 0.9) - this.loudRef) * 0.05;
      f.level = this.loudRef > 0 ? rms / this.loudRef : 0;
      this.envPrev = this.env; this.env += (rms - this.env) * 0.5;
      if (speaking && this.env > this.envPrev * 1.15 && now - this.lastPeakAt > 120 && this.env > this.loudRef * 0.35) {
        this.peaks.push(now); this.lastPeakAt = now;
      }
      while (this.peaks.length && now - this.peaks[0] > 2000) this.peaks.shift();
      f.rate = this.peaks.length / 2;

      // Pitch.
      const hz = this.pitch(x, rms);
      f.f0Hz = hz;
      if (hz > 0) {
        const st = 12 * Math.log2(hz / 100);
        if (this.baselineN < 50) { this.baseline += (st - this.baseline) / (++this.baselineN); }
        else this.baseline += (st - this.baseline) * 0.01;
        this.f0Hist.push({ t: now, st });
        while (this.f0Hist.length && now - this.f0Hist[0].t > 2000) this.f0Hist.shift();
      }
      const h = this.f0Hist;
      if (h.length >= 4) {
        let m = 0; for (const p of h) m += p.st; m /= h.length;
        let v = 0; for (const p of h) v += (p.st - m) * (p.st - m); v = Math.sqrt(v / h.length);
        const recent = h.slice(-6);
        const slope = recent.length >= 2 ? (recent[recent.length - 1].st - recent[0].st) / Math.max(0.05, (recent[recent.length - 1].t - recent[0].t) / 1000) : 0;
        f.f0Rel = m - this.baseline; f.f0Var = v; f.f0Slope = slope;
      }

      // Map features to a target blend. Continuous and gentle; a reply rarely needs more than 0.6 of anything.
      const t = this.target;
      const lively = clamp01((f.f0Var - 1.2) / 2.5) * 0.6 + clamp01((f.rate - 3) / 3) * 0.4;
      const raised = clamp01(f.f0Rel / 3);
      const lowered = clamp01(-f.f0Rel / 3);
      const flat = clamp01((1.2 - f.f0Var) / 1.2);
      const quiet = clamp01((0.6 - f.level) / 0.4);
      const slow = clamp01((2.5 - f.rate) / 2.5);
      if (speaking) {
        t.amused = 0.55 * lively * (0.5 + 0.5 * raised);
        t.warm = 0.5 * clamp01(0.6 * (1 - flat) + 0.4 * (1 - quiet)) * (1 - lively * 0.5);
        t.concerned = 0.5 * lowered * flat * (0.5 + 0.5 * quiet);
        t.thoughtful = 0.3 * slow * flat * (1 - lowered * 0.5);
        // Surprise only on a real jump: a steep sustained rise with a loudness jump, and never above 0.35.
        t.surprised = clamp01((f.f0Slope - 22) / 20) * clamp01((f.level - 1.1) / 0.5) * 0.35;
      } else if (this.silentSince && now - this.silentSince > 1500) {
        // Long silence: ease back to neutral, keeping a little of the last warmth.
        t.amused *= 0.9; t.surprised = 0; t.concerned *= 0.95; t.thoughtful *= 0.95; t.warm = Math.max(t.warm * 0.97, 0.1);
      }
    }
    // Ease the shown mix toward the target: faster up for surprise, slow everywhere else.
    for (const k of Object.keys(this.mix) as (keyof EmotionMix)[]) {
      const rate = k === 'surprised' ? (this.target[k] > this.mix[k] ? 6 : 3) : 1.2;
      this.mix[k] += (this.target[k] - this.mix[k]) * (1 - Math.exp(-rate * dt));
    }
    return this.mix;
  }
}

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
