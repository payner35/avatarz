/**
 * avatarz — a browser-only talking head that lip-syncs to any Web Audio node.
 *
 *   const head = await createTalkingHead({ context, source: gainNode, canvas, avatarUrl });
 *   head.setState('speaking');
 *   ...
 *   head.cut();      // barge-in
 *   head.dispose();
 */
import { createTap, type Tap, type TapOptions } from './tap.js';
import { HeadAudioExtractor, type HeadAudioOptions } from './extract/headaudio.js';
import { FormantExtractor, type FormantOptions } from './extract/formant.js';
import { Wav2ArkitExtractor, type Wav2ArkitOptions } from './extract/wav2arkit.js';
import { VRMRenderer, type VRMRendererOptions } from './render/vrm.js';
import { SpriteRenderer, type SpriteRendererOptions } from './render/sprite.js';
import { SplatRenderer, type SplatRendererOptions } from './render/splat.js';
import { GlbRenderer, type GlbRendererOptions } from './render/glb.js';
import type { EnergyMeter } from './extract/energy.js';
import { ProsodyMeter, type EmotionMix } from './extract/prosody.js';
import { WebcamAttention, type WebcamAttentionOptions, type Attention } from './attention/webcam.js';
import { Recorder, saveToLab, recordStream, recordScreen, type Recording } from './lab/recorder.js';
import { createFrame, type Emotion, type Extractor, type HeadState, type Renderer, type VisemeFrame } from './types.js';

export * from './types.js';
export { createTap, type Tap, type TapOptions } from './tap.js';
export { HeadAudioExtractor, type HeadAudioOptions } from './extract/headaudio.js';
export { FormantExtractor, type FormantOptions } from './extract/formant.js';
export { Wav2ArkitExtractor, type Wav2ArkitOptions } from './extract/wav2arkit.js';
export { VRMRenderer, type VRMRendererOptions } from './render/vrm.js';
export { ProsodyMeter, type EmotionMix } from './extract/prosody.js';
export { WebcamAttention, type WebcamAttentionOptions, type Attention } from './attention/webcam.js';
export { Recorder, saveToLab, type Recording } from './lab/recorder.js';
export { SpriteRenderer, type SpriteRendererOptions } from './render/sprite.js';
export { SplatRenderer, type SplatRendererOptions } from './render/splat.js';
export { GlbRenderer, type GlbRendererOptions } from './render/glb.js';

export interface Metrics {
  /** Which extractor is live (after any fallback). */
  extractor: string;
  renderer: string;
  /** Nominal detector lag, ms. */
  extractorLatencyMs: number;
  /** Audible delay inserted by the tap, ms. */
  tapDelayMs: number;
  /** Device output latency reported by the browser, ms. */
  outputLatencyMs: number;
  /** Most recent speech onset at the tap to the first frame with jawOpen > 0.3, ms. */
  audioToMouthMs: number;
  /** Smoothed frames per second. */
  fps: number;
  /** Main-thread cost of extractor.read() + renderer update (no GPU draw), ms, smoothed and worst in the last second. */
  updateMs: number;
  updateMsMax: number;
  /** Whole frame() including the draw call, ms, smoothed. */
  frameMs: number;
  /** Did the HeadAudio worklet fail and the formant mode take over? */
  fellBack: boolean;
}

export interface TalkingHeadOptions {
  context: AudioContext;
  source: AudioNode;
  canvas: HTMLCanvasElement;
  /** VRM url. Optional for the sprite renderer. */
  avatarUrl?: string;
  extractor?: Extractor | 'headaudio' | 'formant' | 'wav2arkit';
  renderer?: Renderer | 'vrm' | 'sprite' | 'splat' | 'glb';
  /** Audible delay in seconds (see Tap), or 'auto' to follow the live extractor's lag. Default 'auto'. */
  delay?: number | 'auto';
  /** Pass null when the source must not be heard (microphone). */
  destination?: AudioNode | null;
  /** Fall back to lighter extractors if the chosen one fails (wav2arkit -> headaudio -> formant). Default true. */
  fallback?: boolean;
  /** Where the HeadAudio worklet and model are served from. */
  assets?: Pick<HeadAudioOptions, 'workletUrl' | 'modelUrl'>;
  headaudio?: HeadAudioOptions;
  formant?: FormantOptions;
  wav2arkit?: Wav2ArkitOptions;
  vrm?: VRMRendererOptions;
  sprite?: SpriteRendererOptions;
  splat?: SplatRendererOptions;
  /** Photoreal mesh head: a GLB carrying the 52 ARKit blendshapes as morph targets. */
  glb?: GlbRendererOptions;
  state?: HeadState;
  /** Called after each rendered frame. For debugging and tests. */
  onFrame?: (v: VisemeFrame, metrics: Metrics) => void;
  /** Mouth-to-sound trim in seconds; positive shows the mouth later. Default 0. */
  syncTrim?: number;
  /** Read emotion from the voice's prosody and blend it onto the face. Default true. */
  autoEmotion?: boolean;
}

export interface TalkingHead {
  readonly tap: Tap;
  readonly extractor: Extractor;
  readonly renderer: Renderer;
  readonly metrics: Metrics;
  getState(): HeadState;
  setState(state: HeadState): void;
  /** Blend an emotion onto the face. Intensity 0..1, default 1. 'neutral' clears it. Turns auto emotion off. */
  setEmotion(emotion: Emotion, intensity?: number): void;
  /** The prosody meter's current read of the voice, when auto emotion is on. */
  readonly emotion: EmotionMix | null;
  readonly prosody: ProsodyMeter | null;
  /** Start looking at the viewer through the webcam (the browser asks permission). */
  startWebcam(opts?: WebcamAttentionOptions, stream?: MediaStream): Promise<void>;
  stopWebcam(): void;
  readonly attention: Attention | null;
  /** The webcam tracker itself (detection cost etc.), when running. */
  readonly webcam: WebcamAttention | null;
  /** Motion lab: record everything sent to the face plus the stage video, then save to lab/recordings. */
  readonly lab: {
    start(video?: boolean): void;
    stop(label?: string, notes?: Record<string, unknown>): Promise<string>;
    recording: boolean;
    /** Stamp "I saw a jump now" into the running recording. */
    mark(): void;
    /** Record the webcam itself for `ms` as a real-face reference (`lab/recordings/<time>_reference.webm`). */
    reference(ms?: number): Promise<string>;
    /** Record the presented screen (the tab) for `ms`: what the compositor shows, not just the canvas. */
    screen(ms?: number): Promise<string>;
  };
  setAvatar(url: string): Promise<void>;
  /** Swap the extractor live. */
  setExtractor(extractor: Extractor | 'headaudio' | 'formant' | 'wav2arkit'): Promise<void>;
  /** Barge-in: drop the extractor state and close the mouth now. */
  cut(): void;
  /**
   * Shift the mouth relative to the sound, in seconds. Positive shows the mouth later.
   * Use to compensate a renderer's own smoothing lag or a device whose reported output latency is off.
   */
  setSyncTrim(seconds: number): void;
  getSyncTrim(): number;
  /** Pause/resume the render loop (idle motion pauses with it). */
  pause(): void;
  resume(): void;
  dispose(): void;
}

// Defaults: the realistic face. Wav2ARKit int8 (101 MB once, cached; ~176 ms per 200 ms chunk in a WASM
// worker on an M-series Mac, 2026-11-08) on a Gaussian-splat head, with frames shown by audio timestamp.
// Falls back to HeadAudio soft visemes (14 kB, 60 ms) and then the formant mode if the model cannot load.
function makeExtractor(e: TalkingHeadOptions['extractor'], o: TalkingHeadOptions): Extractor {
  if (e && typeof e !== 'string') return e;
  if (e === 'formant') return new FormantExtractor(o.formant);
  if (e === 'headaudio') return new HeadAudioExtractor({ ...o.assets, ...o.headaudio });
  return new Wav2ArkitExtractor({ ...o.wav2arkit });
}

function makeRenderer(r: TalkingHeadOptions['renderer'], o: TalkingHeadOptions): Renderer {
  if (r && typeof r !== 'string') return r;
  if (r === 'sprite') return new SpriteRenderer(o.sprite);
  if (r === 'vrm') return new VRMRenderer(o.vrm);
  if (r === 'glb') return new GlbRenderer(o.glb);
  return new SplatRenderer(o.splat);
}

export async function createTalkingHead(o: TalkingHeadOptions): Promise<TalkingHead> {
  const { context, source, canvas } = o;
  const autoDelay = o.delay === undefined || o.delay === 'auto';
  // Create the delay line with headroom; the actual value follows the extractor once it is live.
  const tap = createTap({ context, source, audibleDelay: autoDelay ? 0.1 : o.delay as number, destination: o.destination });
  let syncTrim = o.syncTrim ?? 0;
  let autoEmotion = o.autoEmotion ?? true;
  const prosody = autoEmotion ? new ProsodyMeter() : null;
  prosody?.start(tap.source, context);
  const applyDelay = (e: Extractor) => { if (autoDelay) tap.setDelay(Math.max(0.1, e.latencyMs / 1000 + (e.sync ? 0 : syncTrim))); };
  const renderer = makeRenderer(o.renderer, o);
  renderer.mount(canvas);

  const metrics: Metrics = {
    extractor: '', renderer: renderer.name, extractorLatencyMs: 0,
    tapDelayMs: tap.getDelay() * 1000, outputLatencyMs: tap.outputLatency() * 1000,
    audioToMouthMs: 0, fps: 0, updateMs: 0, updateMsMax: 0, frameMs: 0, fellBack: false,
  };

  let extractor: Extractor = makeExtractor(o.extractor, o);
  let state: HeadState = o.state ?? 'idle';
  renderer.setState(state);

  async function startExtractor(e: Extractor): Promise<Extractor> {
    try {
      await e.start(tap.source, context);
      return e;
    } catch (err) {
      if (o.fallback === false || e instanceof FormantExtractor) throw err;
      const next = e instanceof Wav2ArkitExtractor ? new HeadAudioExtractor({ ...o.assets, ...o.headaudio }) : new FormantExtractor(o.formant);
      console.warn(`avatarz: ${e.name} failed, falling back to ${next.name}`, err);
      metrics.fellBack = true;
      return startExtractor(next);
    }
  }

  const avatarLoad = o.avatarUrl ? renderer.setAvatar(o.avatarUrl) : Promise.resolve();
  const [live] = await Promise.all([startExtractor(extractor), avatarLoad]);
  extractor = live;
  applyDelay(extractor);
  metrics.extractor = extractor.name;
  metrics.extractorLatencyMs = extractor.latencyMs;

  // Onset timing: watch the extractor's meter for a silence-to-sound edge, then the first open frame.
  let pendingOnsetId = 0;
  let pendingOnsetAt = 0;
  // Audio already playing when an extractor starts gives a false onset; ignore the first second.
  let extractorStartedAt = performance.now();
  let lastFrameMsReset = 0;
  let lastDelayCheck = 0;
  let webcam: WebcamAttention | null = null;
  const recorder = new Recorder(() => {
    const out: Record<string, number> = { ...((renderer as { snapshot?(): Record<string, number> }).snapshot?.() ?? {}) };
    const v = lastFrame;
    if (v) { v.visemes.forEach((x, i) => { out['vis.' + i] = x; }); out['vis.jawOpen'] = v.jawOpen; out['vis.energy'] = v.energy; out['vis.speaking'] = v.speaking ? 1 : 0; }
    if (prosody) for (const k in prosody.mix) out['emo.' + k] = prosody.mix[k as keyof typeof prosody.mix];
    out['sys.fps'] = metrics.fps; out['sys.updateMs'] = metrics.updateMs;
    return out;
  }, () => {
    // The visible canvas: the splat renderer makes its own inside the stage; others draw on ours.
    const all = [...(canvas.parentElement?.querySelectorAll('canvas') ?? [])] as HTMLCanvasElement[];
    return all.find((c) => c.width > 0 && getComputedStyle(c).display !== 'none') ?? canvas;
  });
  let lastFrame: VisemeFrame | null = null;
  // The audible branch, as a MediaStream, so recordings carry the sound the face is synced to.
  try {
    const heard = context.createMediaStreamDestination();
    (tap.delayNode ?? tap.source).connect(heard);
    recorder.audioTrack = heard.stream.getAudioTracks()[0] ?? null;
  } catch { /* no audio track in the recording */ }

  let raf = 0;
  let running = true;
  let last = performance.now();
  const silent = createFrame();

  function loop(now: number): void {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
    last = now;
    const t0 = performance.now();
    // Timestamped extractors show the frame for (tap time - delay - output latency - trim).
    extractor.sync?.(tap.getDelay(), tap.outputLatency() + syncTrim);
    const v = extractor.read();
    lastFrame = v;
    if (prosody && autoEmotion) renderer.setEmotionMix?.(prosody.update(now, dt));
    if (webcam) renderer.setAttention?.(webcam.update(dt));
    const t1 = performance.now();
    renderer.frame(v, dt);
    const t2 = performance.now();
    const cost = t2 - t0;
    const upd = (t1 - t0) + (renderer.updateMs ?? (t2 - t1));

    // Metrics
    const inst = 1 / dt;
    metrics.fps = metrics.fps ? metrics.fps + (inst - metrics.fps) * 0.05 : inst;
    metrics.frameMs = metrics.frameMs ? metrics.frameMs + (cost - metrics.frameMs) * 0.1 : cost;
    metrics.updateMs = metrics.updateMs ? metrics.updateMs + (upd - metrics.updateMs) * 0.1 : upd;
    if (now - lastFrameMsReset > 1000) { metrics.updateMsMax = upd; lastFrameMsReset = now; }
    else if (upd > metrics.updateMsMax) metrics.updateMsMax = upd;
    metrics.tapDelayMs = tap.getDelay() * 1000;
    metrics.outputLatencyMs = tap.outputLatency() * 1000;
    metrics.extractorLatencyMs = extractor.latencyMs;
    // If the extractor's measured lag outgrows the audible delay, widen the delay (never narrow it mid-speech).
    if (autoDelay && now - lastDelayCheck > 1000) {
      lastDelayCheck = now;
      // Untimestamped extractors are aligned by the delay line alone, so the trim goes into the delay.
      const need = Math.max(0.1, extractor.latencyMs / 1000 + (extractor.sync ? 0 : syncTrim));
      // Widen at once when behind; narrow only while nobody is speaking, so the glide is never heard.
      if (need > tap.getDelay() + 0.03) tap.setDelay(need);
      else if (!v.speaking && need < tap.getDelay() - 0.05) tap.setDelay(need);
    }

    const meter = (extractor as unknown as { meter?: EnergyMeter }).meter;
    if (meter) {
      if (meter.onsetId !== pendingOnsetId) {
        pendingOnsetId = meter.onsetId;
        pendingOnsetAt = now - extractorStartedAt > 1000 ? meter.onsetAt : 0;
      }
      if (pendingOnsetAt && v.jawOpen > 0.3) {
        metrics.audioToMouthMs = now - pendingOnsetAt;
        pendingOnsetAt = 0;
      }
    }
    recorder.sample();
    o.onFrame?.(v, metrics);
  }
  raf = requestAnimationFrame(loop);

  const head: TalkingHead = {
    tap,
    get extractor() { return extractor; },
    renderer,
    metrics,
    getState: () => state,
    setState(s) { state = s; renderer.setState(s); },
    setEmotion(e, intensity = 1) { autoEmotion = false; renderer.setEmotion?.(e, intensity); },
    get emotion() { return prosody ? prosody.mix : null; },
    prosody,
    async startWebcam(opts, stream) { webcam?.stop(); webcam = new WebcamAttention(opts); await webcam.start(stream); },
    stopWebcam() { webcam?.stop(); webcam = null; renderer.setAttention?.(null); },
    get attention() { return webcam ? webcam.attention : null; },
    get webcam() { return webcam; },
    lab: {
      start: (video = true) => recorder.start(video),
      async stop(label = 'run', notes = {}) {
        const { recording, video } = await recorder.stop(label, { ...notes, extractor: extractor.name, renderer: renderer.name, state });
        const name = `${new Date().toISOString().replace(/[:.]/g, '-')}_${label}`;
        return saveToLab(name, recording, video);
      },
      get recording() { return recorder.recording; },
      mark: () => recorder.mark(),
      async screen(ms = 10000) {
        const stage = canvas.parentElement ?? canvas;
        const { video, crop } = await recordScreen(stage, ms);
        const name = `${new Date().toISOString().replace(/[:.]/g, '-')}_screen`;
        await fetch(`/__lab/save?name=${encodeURIComponent(name)}.webm`, { method: 'POST', body: video });
        await fetch(`/__lab/save?name=${encodeURIComponent(name)}.json`, { method: 'POST', body: new Blob([JSON.stringify({ label: 'screen', crop, samples: [], channels: [], fps: 0, startedAt: '', notes: {} })], { type: 'application/json' }) });
        return name;
      },
      async reference(ms = 10000) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false });
        try {
          const video = await recordStream(stream, ms);
          const name = `${new Date().toISOString().replace(/[:.]/g, '-')}_reference`;
          await fetch(`/__lab/save?name=${encodeURIComponent(name)}.webm`, { method: 'POST', body: video });
          return name;
        } finally { stream.getTracks().forEach((t) => t.stop()); }
      },
    },
    setAvatar: (url) => renderer.setAvatar(url),
    async setExtractor(e) {
      const next = await startExtractor(makeExtractor(e, o));
      const old = extractor;
      extractor = next;
      extractorStartedAt = performance.now();
      applyDelay(next);
      old.stop();
      metrics.extractor = next.name;
      metrics.extractorLatencyMs = next.latencyMs;
    },
    setSyncTrim(seconds) { syncTrim = seconds; applyDelay(extractor); },
    getSyncTrim: () => syncTrim,
    cut() {
      extractor.reset();
      prosody?.reset();
      // Push one silent frame so the mouth starts closing on this very frame.
      renderer.frame(silent, 0.001);
    },
    pause() { running = false; cancelAnimationFrame(raf); },
    resume() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      extractor.stop();
      prosody?.stop();
      webcam?.stop();
      renderer.dispose();
      tap.dispose();
    },
  };
  return head;
}
