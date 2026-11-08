/**
 * Fallback extractor, no worklet: loudness to jaw, EMA-smoothed first and
 * second formant estimates to the vowel visemes, spectral brightness to a
 * fricative weight. One frame of latency. Our own code (the mapping follows the
 * widely published formant ranges; thresholds are tuned by ear on 24 kHz TTS).
 */
import {
  N_VISEMES, VISEME_INDEX, approach, clamp01, createFrame, smoothstep,
  type Extractor, type VisemeFrame,
} from '../types.js';
import { EnergyMeter } from './energy.js';

export interface FormantOptions {
  fftSize?: number;          // default 1024
  /** EMA time constant for formant tracking, seconds. Default 0.08. */
  tau?: number;
  /** RMS where the mouth starts to open. Default 0.015. */
  gate?: number;
  /** RMS treated as fully loud. Default 0.2. */
  loud?: number;
  silenceMs?: number;        // default 250
}

export class FormantExtractor implements Extractor {
  readonly name = 'formant';
  readonly latencyMs = 25; // half the 43 ms window at 24 kHz + one frame

  private analyser: AnalyserNode | null = null;
  private source: AudioNode | null = null;
  private spec: Float32Array<ArrayBuffer> = new Float32Array(0);
  private energy = new EnergyMeter();
  private frame = createFrame();
  private target = new Float32Array(N_VISEMES);
  private binHz = 0;
  private f1 = 500;
  private f2 = 1500;
  private bright = 0;
  private lastT = 0;
  private lastLoudAt = 0;
  private readonly opts: Required<FormantOptions>;

  constructor(opts: FormantOptions = {}) {
    this.opts = {
      fftSize: opts.fftSize ?? 1024,
      tau: opts.tau ?? 0.08,
      gate: opts.gate ?? 0.015,
      loud: opts.loud ?? 0.2,
      silenceMs: opts.silenceMs ?? 250,
    };
  }

  async start(node: AudioNode, context: AudioContext): Promise<void> {
    this.stop();
    const a = new AnalyserNode(context, { fftSize: this.opts.fftSize, smoothingTimeConstant: 0.2 });
    this.spec = new Float32Array(a.frequencyBinCount) as Float32Array<ArrayBuffer>;
    this.binHz = context.sampleRate / this.opts.fftSize;
    node.connect(a);
    this.energy.start(node, context);
    this.analyser = a;
    this.source = node;
    this.lastT = performance.now();
  }

  stop(): void {
    if (this.analyser && this.source) {
      try { this.source.disconnect(this.analyser); } catch { /* ignore */ }
    }
    this.energy.stop();
    this.analyser = null;
    this.source = null;
    this.reset();
  }

  reset(): void {
    this.energy.reset();
    this.target.fill(0);
    this.frame.visemes.fill(0);
    this.frame.visemes[0] = 1;
    this.frame.jawOpen = 0;
    this.frame.speaking = false;
    this.lastLoudAt = 0;
  }

  get meter(): EnergyMeter { return this.energy; }

  /** Loudest bin between lo and hi Hz, returned as Hz. */
  private peak(lo: number, hi: number): { hz: number; db: number } {
    const s = this.spec;
    const i0 = Math.max(1, Math.floor(lo / this.binHz));
    const i1 = Math.min(s.length - 2, Math.ceil(hi / this.binHz));
    let best = i0, bestDb = -Infinity;
    for (let i = i0; i <= i1; i++) {
      if (s[i] > bestDb) { bestDb = s[i]; best = i; }
    }
    // Parabolic interpolation around the peak.
    const a = s[best - 1], b = s[best], c = s[best + 1];
    const denom = a - 2 * b + c;
    const off = denom !== 0 ? 0.5 * (a - c) / denom : 0;
    return { hz: (best + off) * this.binHz, db: bestDb };
  }

  private bandEnergy(lo: number, hi: number): number {
    const s = this.spec;
    const i0 = Math.max(0, Math.floor(lo / this.binHz));
    const i1 = Math.min(s.length - 1, Math.ceil(hi / this.binHz));
    let sum = 0;
    for (let i = i0; i <= i1; i++) sum += Math.pow(10, s[i] / 10);
    return sum;
  }

  read(): VisemeFrame {
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0, (now - this.lastT) / 1000));
    this.lastT = now;
    const f = this.frame;
    const a = this.analyser;
    const { gate, loud, tau, silenceMs } = this.opts;

    const rms = this.energy.read(now);
    f.energy = clamp01(rms * 3);
    const level = smoothstep(gate, loud, rms);
    const voiced = level > 0;
    if (voiced) this.lastLoudAt = now;
    const speaking = now - this.lastLoudAt < silenceMs;

    const tgt = this.target;
    tgt.fill(0);

    if (a && voiced) {
      a.getFloatFrequencyData(this.spec);
      const p1 = this.peak(250, 1000);
      const p2 = this.peak(Math.max(1000, p1.hz + 300), 3200);
      const k = 1 - Math.exp(-dt / tau);
      this.f1 += (p1.hz - this.f1) * k;
      this.f2 += (p2.hz - this.f2) * k;
      const total = this.bandEnergy(100, 8000) + 1e-9;
      const hi = this.bandEnergy(3500, 8000);
      this.bright += (hi / total - this.bright) * k;

      const F1 = this.f1, F2 = this.f2;
      const aa = smoothstep(550, 850, F1);
      const lowF2 = 1 - smoothstep(1000, 1400, F2);
      const highF2 = smoothstep(1700, 2300, F2);
      const lowF1 = 1 - smoothstep(380, 560, F1);

      const U = lowF1 * lowF2;
      const O = smoothstep(430, 650, F1) * lowF2 * (1 - aa);
      const I = lowF1 * highF2;
      const E = smoothstep(430, 650, F1) * highF2 * (1 - aa);
      const SS = smoothstep(0.25, 0.55, this.bright);
      const vowel = 1 - SS;

      tgt[VISEME_INDEX.aa] = aa * vowel * level;
      tgt[VISEME_INDEX.O] = O * vowel * level;
      tgt[VISEME_INDEX.U] = U * vowel * level;
      tgt[VISEME_INDEX.I] = I * vowel * level;
      tgt[VISEME_INDEX.E] = E * vowel * level;
      tgt[VISEME_INDEX.SS] = SS * level;
      // Whatever is left of the voiced level is a neutral open mouth (DD/nn).
      const used = aa + O + U + I + E;
      tgt[VISEME_INDEX.DD] = clamp01(1 - used) * vowel * level * 0.6;
    } else if (!speaking) {
      tgt[0] = 1;
    }

    const v = f.visemes;
    for (let i = 0; i < N_VISEMES; i++) v[i] = approach(v[i], tgt[i], dt, 18, 20);

    f.jawOpen = clamp01(Math.max(
      v[VISEME_INDEX.aa], 0.75 * v[VISEME_INDEX.O], 0.55 * v[VISEME_INDEX.E],
      0.4 * v[VISEME_INDEX.I], 0.35 * v[VISEME_INDEX.U], 0.5 * v[VISEME_INDEX.DD], 0.2 * v[VISEME_INDEX.SS],
    ) * (0.5 + 0.5 * level));
    f.speaking = speaking;
    f.t = now;
    return f;
  }
}
