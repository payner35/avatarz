/**
 * Default extractor: the MIT HeadAudio AudioWorklet (met4citizen), vendored
 * under assets/headaudio. It classifies 512-sample 16 kHz frames into one of
 * 15 Oculus visemes. We keep the raw classification on the main thread and do
 * our own per-frame smoothing so every renderer sees the same VisemeFrame.
 */
import {
  N_VISEMES, VISEME_INDEX, approach, clamp01, createFrame,
  type Extractor, type VisemeFrame, type VisemeName,
} from '../types.js';
import { EnergyMeter } from './energy.js';
import { HeadAudio } from '../../assets/headaudio/headaudio.min.mjs';

export interface HeadAudioOptions {
  /** URL of headworklet.min.mjs. Default: the vendored copy next to this module. */
  workletUrl?: string | URL;
  /** URL of model-en-mixed.bin. Default: the vendored copy. */
  modelUrl?: string | URL;
  /** Opening rate, per second. Default 15. */
  openRate?: number;
  /** Closing rate, per second. Default 18. */
  closeRate?: number;
  /** Return to sil after this much silence. Default 250 ms. */
  silenceMs?: number;
  /**
   * Soft weights: blend visemes by classifier distance instead of taking the winner.
   * Temperature in Mahalanobis units; lower is sharper. 0 disables. Default 0.7
   * (measured: the runner-up is typically 0.9 units behind the winner, so it blends in at ~0.3).
   */
  softness?: number;
  /**
   * How far the lips run ahead of the sound, ms. Real lips form a shape 50–100 ms before it is heard
   * (rounding before "oo", closing before "b"). Added to the audible delay, so the mouth is shown that
   * much before the ear gets it. Default 60: with tools/lagprobe.js on 2026-11-08 the jaw onsets led
   * the sound by ~45 ms on the delay line's 100 ms floor and ~115 ms at 145 ms; the draw eats ~25 ms
   * of any lead, so 60 (a 120 ms delay) shows the lips ~60 ms ahead of the ear. The tap's 100 ms
   * floor means values under 40 change nothing.
   */
  leadMs?: number;
}

// Where the worklet and model live relative to this module. The library build
// defines __AVATARZ_ASSET_ROOT__ as './assets/' and copies the files
// into dist/assets/headaudio; in source form they sit under ../../assets.
// Built as a runtime expression on purpose so the bundler does not inline them.
declare const __AVATARZ_ASSET_ROOT__: string | undefined;
const ASSET_BASE: string = (typeof __AVATARZ_ASSET_ROOT__ === 'string' ? __AVATARZ_ASSET_ROOT__ : '../../assets/') + 'headaudio/';
const DEFAULT_WORKLET = new URL(ASSET_BASE + 'headworklet.min.mjs', import.meta.url);
const DEFAULT_MODEL = new URL(ASSET_BASE + 'model-en-mixed.bin', import.meta.url);

/** addModule twice on one context throws inside the worklet; remember per context. */
const loadedContexts = new WeakMap<BaseAudioContext, Promise<void>>();

export class HeadAudioExtractor implements Extractor {
  readonly name = 'headaudio';
  /** Half a 32 ms window + one 16 ms hop + VAD gate ≈ 50–60 ms, plus the lip lead. */
  get latencyMs(): number { return 60 + this.leadMs; }
  private readonly leadMs: number;

  private node: HeadAudio | null = null;
  private source: AudioNode | null = null;
  private energy = new EnergyMeter();
  private frame = createFrame();
  private target = new Float32Array(N_VISEMES);
  /** HeadAudio index -> Oculus index */
  private remap: Int8Array = new Int8Array(0);
  private lastT = 0;
  private lastActiveAt = 0;
  private speaking = false;
  private readonly workletUrl: string | URL;
  private readonly modelUrl: string | URL;
  private readonly openRate: number;
  private readonly closeRate: number;
  private readonly silenceMs: number;
  private readonly softness: number;
  /** Prototype index -> viseme id (HeadAudio order), from the model records. */
  private protoViseme: Int8Array = new Int8Array(0);
  /** Latest per-prototype distances from the classifier, when soft mode is on. */
  private distances: Float32Array | null = null;
  private softTarget = new Float32Array(N_VISEMES);

  constructor(opts: HeadAudioOptions = {}) {
    this.workletUrl = opts.workletUrl ?? DEFAULT_WORKLET;
    this.modelUrl = opts.modelUrl ?? DEFAULT_MODEL;
    this.openRate = opts.openRate ?? 15;
    this.closeRate = opts.closeRate ?? 18;
    this.silenceMs = opts.silenceMs ?? 250;
    this.softness = opts.softness ?? 0.7;
    this.leadMs = opts.leadMs ?? 60;
  }

  async start(node: AudioNode, context: AudioContext): Promise<void> {
    this.stop();
    let loading = loadedContexts.get(context);
    if (!loading) {
      loading = context.audioWorklet.addModule(this.workletUrl.toString());
      loadedContexts.set(context, loading);
      loading.catch(() => loadedContexts.delete(context));
    }
    await loading;

    const ha = new HeadAudio(context, { processorOptions: { visemeEventsEnabled: this.softness > 0 } });
    // Load the model ourselves so we keep each prototype's viseme id for soft weighting.
    const { model, buffer } = await ha.training.loadModel(this.modelUrl.toString());
    this.protoViseme = Int8Array.from(model.map((m) => m.viseme));
    ha.port.postMessage({ event: 'reset' });
    ha.port.postMessage({ event: 'model', model }, [buffer]);

    this.remap = new Int8Array(ha.visemeNames.length);
    ha.visemeNames.forEach((n, i) => {
      const key = n.replace(/^viseme_/, '') as VisemeName;
      this.remap[i] = VISEME_INDEX[key] ?? 0;
    });
    ha.onstarted = () => { this.speaking = true; };
    ha.onended = () => { this.speaking = false; this.distances = null; };
    if (this.softness > 0) ha.onviseme = (d) => { if (d.distances) this.distances = Float32Array.from(d.distances); };

    node.connect(ha);
    this.energy.start(node, context);
    this.node = ha;
    this.source = node;
    this.lastT = performance.now();
    ha.start();
  }

  stop(): void {
    if (this.node) {
      try { this.node.stop(); } catch { /* ignore */ }
      try { this.source?.disconnect(this.node); } catch { /* ignore */ }
      this.node.port.close();
    }
    this.energy.stop();
    this.node = null;
    this.source = null;
    this.reset();
  }

  reset(): void {
    this.node?.resetAll();
    if (this.node) this.node.visemeActive = -1;
    this.distances = null;
    this.speaking = false;
    this.energy.reset();
    this.target.fill(0);
    this.frame.visemes.fill(0);
    this.frame.visemes[0] = 1;
    this.frame.jawOpen = 0;
    this.frame.speaking = false;
  }

  /** The meter this extractor taps; the orchestrator reads onsets from it. */
  get meter(): EnergyMeter { return this.energy; }

  read(): VisemeFrame {
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0, (now - this.lastT) / 1000));
    this.lastT = now;
    const f = this.frame;
    const ha = this.node;

    f.energy = clamp01(this.energy.read(now) * 3);

    const active = ha ? ha.visemeActive : -1;
    const tgt = this.target;
    tgt.fill(0);
    if (active >= 0 && this.speaking) {
      this.lastActiveAt = now;
      const d = this.distances;
      if (d && this.softness > 0 && d.length === this.protoViseme.length) {
        // Soft weights: per viseme take its nearest prototype, then a softmax over (-distance / T).
        const best = this.softTarget; best.fill(Infinity);
        for (let i = 0; i < d.length; i++) {
          const v = this.remap[this.protoViseme[i]];
          if (d[i] < best[v]) best[v] = d[i];
        }
        let min = Infinity; for (let i = 0; i < N_VISEMES; i++) if (best[i] < min) min = best[i];
        let sum = 0;
        for (let i = 0; i < N_VISEMES; i++) { const w = best[i] === Infinity ? 0 : Math.exp(-(best[i] - min) / this.softness); tgt[i] = w; sum += w; }
        for (let i = 0; i < N_VISEMES; i++) tgt[i] /= sum;
        // sil competes too; give the spoken shapes the room they need while speech is active.
        const spoken = 1 - tgt[0]; if (spoken > 0) { for (let i = 1; i < N_VISEMES; i++) tgt[i] /= spoken; tgt[0] = 0; }
      } else {
        tgt[this.remap[active]] = 1;
      }
    } else if (now - this.lastActiveAt > this.silenceMs) {
      tgt[0] = 1; // sil
    }

    const v = f.visemes;
    for (let i = 0; i < N_VISEMES; i++) v[i] = approach(v[i], tgt[i], dt, this.openRate, this.closeRate);

    // Jaw: vowels open it, consonants close it, loudness scales it.
    const open = Math.max(v[VISEME_INDEX.aa], 0.75 * v[VISEME_INDEX.O], 0.55 * v[VISEME_INDEX.E],
      0.4 * v[VISEME_INDEX.I], 0.35 * v[VISEME_INDEX.U], 0.3 * v[VISEME_INDEX.kk], 0.25 * v[VISEME_INDEX.DD]);
    const close = Math.max(v[VISEME_INDEX.PP], v[VISEME_INDEX.FF]);
    f.jawOpen = clamp01(open * (1 - close) * (0.6 + 0.4 * f.energy));
    f.speaking = this.speaking || now - this.lastActiveAt < this.silenceMs;
    f.t = now;
    return f;
  }
}
