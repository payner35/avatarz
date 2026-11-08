/**
 * Neural extractor: myned-ai/wav2arkit_cpu (Apache-2.0), a wav2vec2 speech
 * encoder plus a LAM Audio2Expression head, run in onnxruntime-web. Raw 16 kHz
 * audio in, 52 ARKit blendshape channels at 30 fps out. Continuous,
 * coarticulated mouth shapes, which is what a photoreal rig needs.
 *
 * Cost: the weights are ~400 MB (fp32) downloaded once per browser and kept in
 * Cache Storage, ~200 ms of audio per inference call plus inference time, so
 * about 300 ms of lag that the tap's audible delay covers. Opt in only.
 *
 * Every file is served from our origin: model, weights and the ONNX WASM runtime.
 */
import {
  ARKIT, ARKIT_INDEX, N_VISEMES, VISEME_INDEX, approach, clamp01, createFrame,
  type Extractor, type VisemeFrame,
} from '../types.js';
import { EnergyMeter } from './energy.js';

export interface Wav2ArkitOptions {
  /** Directory holding the model files. */
  modelBaseUrl?: string | URL;
  /** Graph file name. Default 'wav2arkit_int8.onnx' (101 MB, self-contained). 'wav2arkit_cpu.onnx' is the fp32 original with a .data file. */
  modelFile?: string;
  /** Directory holding onnxruntime-web's ort-wasm-simd-threaded.{mjs,wasm}. */
  ortWasmUrl?: string | URL;
  /** Audio per inference call. Default 150 ms: the model is not causal within a chunk, so the chunk
   * length is also the timing blur; 150 keeps inference under real time with less blur than 200. */
  chunkMs?: number;
  /**
   * Shift applied to frame timestamps, seconds. Negative shows frames early to cancel the lag of
   * everything after the model: the envelope gate, the lip low-pass, the mouth spring and the jaw ramp.
   * Measured with the page's sync test on 2026-11-08: −0.06 gave a mouth 140 ms late once the smoothing
   * stages were added, so the default is −0.16 (−0.19 opened 30 ms early and closed 120 ms early; opening and closing lag differently). Re-measure after any change to the mouth path.
   */
  frameOffset?: number;
  /** Model output rate. Default 30. */
  fps?: number;
  /** Progress 0..1 of the one-time model download. */
  onProgress?: (p: number) => void;
  /** Treat chunks whose peak is below this as silence and skip inference. */
  silencePeak?: number;
  /** ONNX execution providers in order of preference. Default ['wasm']; WebGPU hangs on the int8 model. */
  executionProviders?: ('webgpu' | 'wasm')[];
  /** WASM threads. Default 1; more needs cross-origin isolation and did not start a session in testing. */
  numThreads?: number;
  /** Run WASM inference in a proxy worker. Default true when not multi-threaded. */
  proxy?: boolean;
}

declare const __AVATARZ_ASSET_ROOT__: string | undefined;
const ASSET_ROOT: string = typeof __AVATARZ_ASSET_ROOT__ === 'string' ? __AVATARZ_ASSET_ROOT__ : '../../assets/';

const CACHE = 'avatarz-wav2arkit-v1';
/** Channels whose amplitude follows the audio envelope. Shape channels (smile, press) are left to the model. */
const MOUTH_GATED = [
  ARKIT_INDEX.jawOpen, ARKIT_INDEX.mouthFunnel, ARKIT_INDEX.mouthPucker,
  ARKIT_INDEX.mouthLowerDownLeft, ARKIT_INDEX.mouthLowerDownRight, ARKIT_INDEX.mouthUpperUpLeft, ARKIT_INDEX.mouthUpperUpRight,
  ARKIT_INDEX.mouthStretchLeft, ARKIT_INDEX.mouthStretchRight, ARKIT_INDEX.tongueOut,
];

// Captures mono PCM into fixed-size chunks on the audio thread. Zero gaps, unlike an AnalyserNode poll.
const CAPTURE_WORKLET = `
class AvatarzCapture extends AudioWorkletProcessor {
  constructor(o) { super(); this.n = o.processorOptions.chunk; this.buf = new Float32Array(this.n); this.i = 0; this.start = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0]; if (!ch) return true;
    const base = currentFrame;
    for (let k = 0; k < ch.length; k++) {
      if (this.i === 0) this.start = base + k;
      this.buf[this.i++] = ch[k];
      if (this.i === this.n) {
        this.port.postMessage({ pcm: this.buf, t: this.start / sampleRate }, [this.buf.buffer]);
        this.buf = new Float32Array(this.n); this.i = 0;
      }
    }
    return true;
  }
}
registerProcessor('avatarz-capture', AvatarzCapture);`;
const captureLoaded = new WeakSet<BaseAudioContext>();

async function fetchCached(url: string, onProgress?: (loaded: number, total: number) => void): Promise<ArrayBuffer> {
  let cache: Cache | null = null;
  // A cached copy is trusted only if its size matches what the server reports now, so a
  // truncated download (or an updated model) is never used.
  let expected = 0;
  try { expected = Number((await fetch(url, { method: 'HEAD' })).headers.get('content-length') ?? 0); } catch { /* offline: trust the cache */ }
  try {
    cache = await caches.open(CACHE);
    const hit = await cache.match(url);
    if (hit) {
      const buf = await hit.arrayBuffer();
      if (!expected || buf.byteLength === expected) return buf;
      await cache.delete(url);
    }
  } catch { /* no cache */ }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`avatarz: failed to fetch ${url} (${res.status})`);
  const total = Number(res.headers.get('content-length') ?? 0);
  if (!res.body || !onProgress) { const b = await res.arrayBuffer(); try { await cache?.put(url, new Response(b)); } catch { /* */ } return b; }
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let loaded = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; parts.push(value); loaded += value.byteLength; onProgress(loaded, total); }
  const out = new Uint8Array(loaded); let o = 0; for (const p of parts) { out.set(p, o); o += p.byteLength; }
  if (total && loaded !== total) throw new Error(`avatarz: short download of ${url}: ${loaded} of ${total} bytes`);
  try { await cache?.put(url, new Response(out.buffer)); } catch { /* */ }
  return out.buffer;
}

type Ort = typeof import('onnxruntime-web');
type Session = import('onnxruntime-web').InferenceSession;

export class Wav2ArkitExtractor implements Extractor {
  readonly name = 'wav2arkit';
  /** Chunk length plus the 90th percentile of recent inference times, plus the lead the frames are shown
   * with (so they exist when needed), plus a margin. */
  get latencyMs(): number {
    const r = this.recentInfer;
    let p90 = this.inferMs;
    if (r.length >= 5) { const sorted = [...r].sort((a, b) => a - b); p90 = sorted[Math.floor(0.9 * (sorted.length - 1))]; }
    return Math.min(900, this.opts.chunkMs + Math.max(60, p90) + Math.max(0, -this.opts.frameOffset * 1000) + 50);
  }
  private recentInfer: number[] = [];
  private readonly opts: Required<Omit<Wav2ArkitOptions, 'onProgress'>> & { onProgress?: (p: number) => void };
  private session: Session | null = null;
  private ort: Ort | null = null;
  private inputName = '';
  private outputName = '';
  private node: AudioWorkletNode | null = null;
  private source: AudioNode | null = null;
  private context: AudioContext | null = null;
  private energy = new EnergyMeter();
  private frame = createFrame();
  /** Frames stamped with the audio-clock time (seconds) they belong to, in order, with the audio's own
   * RMS over that frame. Energy is exact and causal; the model's shapes are not, so energy sets the timing. */
  private timeline: { t: number; w: Float32Array; e: number }[] = [];
  private gate = 0;
  private lastChunkFrame: Float32Array | null = null;
  /** Energy gating of the mouth: 0 = model timing only, 1 = fully follow the audio envelope. Default 0.85. */
  envelopeFollow = 0.85;
  private current: Float32Array = new Float32Array(ARKIT.length);
  private pending: { pcm: Float32Array; t: number } | null = null;
  /** Audio-clock offset the renderer should lag the tap by: audible delay + device output latency. */
  private syncOffset = 0;
  private synced = false;
  private lastShown = -1;
  /** Frames the renderer wanted that inference had not delivered yet (held the previous one). */
  lateFrames = 0;
  private busy = false;
  private silentChunks = 0;
  private lastT = 0;
  private loggedError = false;
  /** 0..1 download progress of the model weights. */
  progress = 0;
  /** Which execution provider the live session uses, and WASM thread count. */
  provider = '';
  threads = 1;
  /** Smoothed inference wall time per call, ms. */
  inferMs = 0;
  /** Chunks captured, chunks actually run through the model, chunks dropped as stale. */
  chunksIn = 0;
  chunksRun = 0;
  chunksDropped = 0;
  /** Resolves once the model is ready. */
  ready: Promise<void> = Promise.resolve();

  constructor(opts: Wav2ArkitOptions = {}) {
    this.opts = {
      modelBaseUrl: opts.modelBaseUrl ?? new URL(ASSET_ROOT + 'wav2arkit/', import.meta.url),
      modelFile: opts.modelFile ?? 'wav2arkit_int8.onnx',
      ortWasmUrl: opts.ortWasmUrl ?? new URL(ASSET_ROOT + 'ort/', import.meta.url),
      chunkMs: opts.chunkMs ?? 150,
      frameOffset: opts.frameOffset ?? -0.16,
      fps: opts.fps ?? 30,
      silencePeak: opts.silencePeak ?? 0.002,
      executionProviders: opts.executionProviders ?? ['wasm'],
      numThreads: opts.numThreads ?? 1,
      proxy: opts.proxy ?? true,
      onProgress: opts.onProgress,
    };
    this.frame.arkit = this.current;
  }

  get meter(): EnergyMeter { return this.energy; }

  private async loadModel(): Promise<void> {
    if (this.session) return;
    const ort = (this.ort ??= await import('onnxruntime-web'));
    const wasmDir = this.opts.ortWasmUrl.toString().replace(/\/?$/, '/');
    ort.env.wasm.wasmPaths = wasmDir;
    ort.env.wasm.numThreads = this.opts.numThreads;
    // WebGPU runs on the main thread with the GPU doing the work; the WASM path is moved to a worker so
    // a slow CPU inference never stalls the render loop.
    const wantGpu = this.opts.executionProviders[0] === 'webgpu' && 'gpu' in navigator;
    ort.env.wasm.proxy = !wantGpu && this.opts.proxy;
    const base = this.opts.modelBaseUrl.toString().replace(/\/?$/, '/');
    const report = (l: number, t: number) => { this.progress = t ? l / t : 0; this.opts.onProgress?.(this.progress); };
    const file = this.opts.modelFile;
    // External weights live in <file>.data when the server has one; a quantized file is self-contained.
    let hasData = false;
    try { hasData = (await fetch(base + file + '.data', { method: 'HEAD' })).ok; } catch { /* no data file */ }
    const [model, data] = await Promise.all([
      fetchCached(base + file, hasData ? undefined : report),
      hasData ? fetchCached(base + file + '.data', report) : Promise.resolve<ArrayBuffer | null>(null),
    ]);
    this.progress = 1; this.opts.onProgress?.(1);
    const externalData = data ? [{ path: file + '.data', data }] : undefined;
    const providers = wantGpu ? this.opts.executionProviders : this.opts.executionProviders.filter((p) => p !== 'webgpu');
    try {
      this.session = await ort.InferenceSession.create(model, { executionProviders: providers, externalData });
      this.provider = providers[0];
      this.threads = this.opts.numThreads;
    } catch (err) {
      if (!wantGpu) throw err;
      console.warn('avatarz: WebGPU session failed, using WASM', err);
      ort.env.wasm.proxy = true;
      this.session = await ort.InferenceSession.create(model.slice(0), {
        executionProviders: ['wasm'],
        externalData: data ? [{ path: file + '.data', data: data.slice(0) }] : undefined,
      });
      this.provider = 'wasm';
    }
    this.inputName = this.session.inputNames[0];
    this.outputName = this.session.outputNames[0];
    // Pay the JIT cost now on one chunk of silence, then forget its timing: it is not representative.
    try { await this.infer(new Float32Array(Math.round(16 * this.opts.chunkMs))); } catch { /* surfaced by the first real run */ }
    this.inferMs = 0; this.recentInfer.length = 0;
  }

  async start(node: AudioNode, context: AudioContext): Promise<void> {
    this.stop();
    this.context = context;
    this.ready = this.loadModel();
    if (!captureLoaded.has(context)) {
      const url = URL.createObjectURL(new Blob([CAPTURE_WORKLET], { type: 'text/javascript' }));
      try { await context.audioWorklet.addModule(url); } finally { URL.revokeObjectURL(url); }
      captureLoaded.add(context);
    }
    const chunk = Math.round((this.opts.chunkMs / 1000) * context.sampleRate);
    const w = new AudioWorkletNode(context, 'avatarz-capture', {
      numberOfInputs: 1, numberOfOutputs: 0, channelCount: 1, channelCountMode: 'explicit',
      processorOptions: { chunk },
    });
    w.port.onmessage = (e: MessageEvent<{ pcm: Float32Array; t: number }>) => this.onChunk(e.data.pcm, e.data.t);
    node.connect(w);
    this.energy.start(node, context);
    this.node = w; this.source = node;
    this.lastT = performance.now();
    await this.ready;
  }

  stop(): void {
    if (this.node) { try { this.source?.disconnect(this.node); } catch { /* */ } this.node.port.close(); }
    this.energy.stop();
    this.node = null; this.source = null;
    this.reset();
  }

  /** Called by the orchestrator each frame with the tap's audible delay and the device output latency, seconds. */
  sync(audibleDelay: number, outputLatency: number): void {
    this.syncOffset = audibleDelay + outputLatency;
    this.synced = true;
  }

  reset(): void {
    this.timeline.length = 0; this.pending = null; this.silentChunks = 0; this.lastShown = -1; this.gate = 0; this.lastChunkFrame = null;
    this.current.fill(0);
    this.frame.visemes.fill(0); this.frame.visemes[0] = 1;
    this.frame.jawOpen = 0; this.frame.speaking = false;
    this.energy.reset();
  }

  private onChunk(pcm: Float32Array, t: number): void {
    let peak = 0;
    for (let i = 0; i < pcm.length; i++) { const a = Math.abs(pcm[i]); if (a > peak) peak = a; }
    if (peak < this.opts.silencePeak) {
      // Confirmed silence after two chunks: neutral frames for this chunk's time span, no inference.
      if (++this.silentChunks >= 2) {
        this.pending = null;
        const n = Math.round((this.opts.chunkMs / 1000) * this.opts.fps);
        for (let k = 0; k < n; k++) this.push(t + this.opts.frameOffset + (k + 0.5) / this.opts.fps, new Float32Array(ARKIT.length), 0);
        return;
      }
    } else this.silentChunks = 0;
    // Keep only the freshest unprocessed chunk; stale audio is worse than skipped audio.
    this.chunksIn++;
    if (this.pending) this.chunksDropped++;
    this.pending = { pcm, t };
    void this.drain();
  }

  /** RMS of the pcm slice that frame k of a chunk covers. */
  private frameEnergy(pcm: Float32Array, k: number, n: number): number {
    const per = pcm.length / n, a = Math.floor(k * per), b = Math.min(pcm.length, Math.floor((k + 1) * per));
    let sum = 0; for (let i = a; i < b; i++) sum += pcm[i] * pcm[i];
    return Math.sqrt(sum / Math.max(1, b - a));
  }

  private push(t: number, w: Float32Array, e: number): void {
    const tl = this.timeline;
    // Chunks arrive in order; a late chunk after a drop still lands in order. Guard anyway.
    if (tl.length && t <= tl[tl.length - 1].t) { let i = tl.length - 1; while (i > 0 && tl[i - 1].t > t) i--; tl.splice(i, 0, { t, w, e }); }
    else tl.push({ t, w, e });
    if (tl.length > this.opts.fps * 4) tl.splice(0, tl.length - this.opts.fps * 4);
  }

  private async drain(): Promise<void> {
    if (this.busy || !this.pending || !this.session) return;
    const { pcm, t } = this.pending; this.pending = null;
    this.busy = true;
    try {
      const audio16k = await this.resample(pcm);
      const frames = await this.infer(audio16k);
      this.chunksRun++;
      // Each chunk is an independent inference, so its first frames need not continue from the last
      // chunk's. Blend them toward the previous chunk's final frame so boundaries never pop.
      const prev = this.lastChunkFrame;
      if (prev && frames.length >= 2) {
        for (let i = 0; i < frames[0].length; i++) { frames[0][i] = 0.5 * prev[i] + 0.5 * frames[0][i]; frames[1][i] = 0.25 * prev[i] + 0.75 * frames[1][i]; }
      }
      this.lastChunkFrame = frames[frames.length - 1].slice();
      // Frame k of this chunk describes audio time t + (k + ½) / fps, shifted by the model's measured lead.
      frames.forEach((f, k) => this.push(t + this.opts.frameOffset + (k + 0.5) / this.opts.fps, f, this.frameEnergy(pcm, k, frames.length)));
    } catch (err) {
      if (!this.loggedError) { this.loggedError = true; console.warn('avatarz: wav2arkit inference failed', err); }
    } finally {
      this.busy = false;
      if (this.pending) void this.drain();
    }
  }

  private async resample(input: Float32Array): Promise<Float32Array> {
    const sr = this.context?.sampleRate ?? 24000;
    if (sr === 16000) return input;
    const len = Math.max(1, Math.ceil((input.length / sr) * 16000));
    const off = new OfflineAudioContext(1, len, 16000);
    const buf = off.createBuffer(1, input.length, sr);
    buf.copyToChannel(input as Float32Array<ArrayBuffer>, 0);
    const s = off.createBufferSource(); s.buffer = buf; s.connect(off.destination); s.start(0);
    return (await off.startRendering()).getChannelData(0).slice();
  }

  private async infer(audio16k: Float32Array): Promise<Float32Array[]> {
    const ort = this.ort!, session = this.session!;
    const t0 = performance.now();
    const out = await session.run({ [this.inputName]: new ort.Tensor('float32', audio16k, [1, audio16k.length]) });
    const ms = performance.now() - t0;
    this.inferMs = this.inferMs ? this.inferMs + (ms - this.inferMs) * 0.2 : ms;
    this.recentInfer.push(ms); if (this.recentInfer.length > 20) this.recentInfer.shift();
    const t = out[this.outputName];
    const n = t.dims[t.dims.length - 1], seq = t.dims[t.dims.length - 2];
    const data = t.data as Float32Array;
    const expected = Math.round((audio16k.length / 16000) * this.opts.fps);
    const count = Math.min(seq, expected || seq);
    const frames: Float32Array[] = [];
    for (let i = 0; i < count; i++) frames.push(data.slice(i * n, (i + 1) * n));
    return frames;
  }

  read(): VisemeFrame {
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0, (now - this.lastT) / 1000));
    this.lastT = now;
    const f = this.frame;
    f.energy = clamp01(this.energy.read(now) * 3);

    // Show the frame whose audio is being heard right now: the tap's audio clock minus the audible
    // delay and the device's output latency. Interpolate between the two nearest frames.
    const tl = this.timeline;
    if (tl.length) {
      const ctxNow = this.context?.currentTime ?? 0;
      const target = this.synced ? ctxNow - this.syncOffset : tl[tl.length - 1].t;
      let i = tl.length - 1;
      while (i > 0 && tl[i].t > target) i--;
      const a0 = tl[i];
      let eNow = a0.e;
      if (a0.t > target && i === 0) {
        this.current.set(a0.w); // before the first frame we have
      } else if (i === tl.length - 1) {
        this.current.set(a0.w);
        if (target - a0.t > 1 / this.opts.fps && i !== this.lastShown) this.lateFrames++; // inference behind
      } else {
        const a1 = tl[i + 1];
        const u = clamp01((target - a0.t) / (a1.t - a0.t));
        const c = this.current;
        for (let k = 0; k < c.length; k++) c[k] = a0.w[k] + (a1.w[k] - a0.w[k]) * u;
        eNow = a0.e + (a1.e - a0.e) * u;
      }
      // Envelope gate: fast attack, short release, from the audio that is being heard right now.
      const gTarget = clamp01((eNow - 0.008) / 0.05);
      this.gate += (gTarget - this.gate) * (1 - Math.exp(-(gTarget > this.gate ? 30 : 18) * dt));
      const g = 1 - this.envelopeFollow * (1 - this.gate);
      const c = this.current;
      for (const n of MOUTH_GATED) c[n] *= g;
      this.lastShown = i;
      // Drop frames a second behind the playhead.
      if (i > this.opts.fps) tl.splice(0, i - this.opts.fps);
    }
    const a = this.current;

    // Approximate Oculus visemes from the ARKit channels so VRM and sprite renderers still work.
    // The model's mouth values are small (jawOpen peaks ~0.13 in speech); scale up here.
    const jaw = clamp01(a[ARKIT_INDEX.jawOpen] * 6);
    const round = clamp01(Math.max(a[ARKIT_INDEX.mouthPucker], a[ARKIT_INDEX.mouthFunnel]) * 3);
    const wide = clamp01(Math.max(a[ARKIT_INDEX.mouthStretchLeft], a[ARKIT_INDEX.mouthStretchRight], a[ARKIT_INDEX.mouthSmileLeft] - 0.2, a[ARKIT_INDEX.mouthSmileRight] - 0.2) * 3);
    const press = clamp01(Math.max(a[ARKIT_INDEX.mouthPressLeft], a[ARKIT_INDEX.mouthPressRight], a[ARKIT_INDEX.mouthClose]) * 3);
    const tgt = new Float32Array(N_VISEMES);
    tgt[VISEME_INDEX.aa] = jaw * (1 - round) * (1 - wide * 0.5);
    tgt[VISEME_INDEX.O] = jaw * round;
    tgt[VISEME_INDEX.U] = round * (1 - jaw);
    tgt[VISEME_INDEX.E] = jaw * wide;
    tgt[VISEME_INDEX.I] = wide * (1 - jaw);
    tgt[VISEME_INDEX.PP] = press * (1 - jaw);
    tgt[VISEME_INDEX.FF] = clamp01(a[ARKIT_INDEX.mouthRollLower] * 3);
    let sum = 0; for (let i = 1; i < N_VISEMES; i++) sum += tgt[i];
    tgt[0] = clamp01(1 - sum);
    const v = f.visemes;
    for (let i = 0; i < N_VISEMES; i++) v[i] = approach(v[i], tgt[i], dt, 30, 30);

    f.jawOpen = jaw;
    f.speaking = this.silentChunks < 4 && f.energy > 0.02;
    f.t = now;
    return f;
  }
}
