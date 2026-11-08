/**
 * Webcam attention: where the viewer is, so the head can look at them. MediaPipe Face Landmarker
 * (Apache-2.0) runs in a Web Worker from files served by our origin; no frame leaves the page and the
 * render loop never waits for it (a detection costs ~20 ms, which on the main thread was judder).
 *
 * Output, smoothed, in the avatar's own terms:
 *   present   a face is in view
 *   x, y      where the viewer is, −1..1 from the camera's centre (x positive = the avatar's right)
 *   near      0..1 how close they are (face size)
 *   facing    0..1 whether they are looking at the screen
 *   smile, browUp, mouthOpen   the viewer's own expression, 0..1, for reactions
 *   talking   the viewer's mouth is moving
 */
import type { Reading } from './webcam.worker.js';

export interface WebcamAttentionOptions {
  /** Directory with vision_wasm_internal.{js,wasm}. Default: assets/mediapipe next to the module. */
  wasmUrl?: string | URL;
  /** face_landmarker.task. Default: assets/mediapipe/face_landmarker.task. */
  modelUrl?: string | URL;
  /** Detection rate. Default 15 fps; the rest is interpolated. */
  fps?: number;
  /** Mirror x. Default true (measured 2026-11-08: the raw frame needed flipping to follow the viewer's side). */
  mirror?: boolean;
  /** Flip the vertical axis. Default true (measured 2026-11-08 on a camera above the screen). */
  mirrorY?: boolean;
  /** Use the GPU delegate when available. Default true. */
  gpu?: boolean;
}

export interface Attention {
  present: boolean;
  x: number; y: number; near: number; facing: number;
  smile: number; browUp: number; mouthOpen: number; talking: boolean;
  /** Seconds since a face was last seen, or Infinity. */
  absentFor: number;
}

declare const __AVATARZ_ASSET_ROOT__: string | undefined;
const ASSET_ROOT: string = typeof __AVATARZ_ASSET_ROOT__ === 'string' ? __AVATARZ_ASSET_ROOT__ : '../../assets/';

export class WebcamAttention {
  readonly attention: Attention = { present: false, x: 0, y: 0, near: 0, facing: 1, smile: 0, browUp: 0, mouthOpen: 0, talking: false, absentFor: Infinity };
  private worker: Worker | null = null;
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private timer = 0;
  private inFlight = false;
  private lastSeenAt = 0;
  private mouthHist: number[] = [];
  private raw = { x: 0, y: 0, near: 0, facing: 1, smile: 0, browUp: 0, mouthOpen: 0 };
  private readonly opts: Required<WebcamAttentionOptions>;
  /** Milliseconds per detection in the worker, smoothed. */
  detectMs = 0;

  constructor(opts: WebcamAttentionOptions = {}) {
    this.opts = {
      wasmUrl: opts.wasmUrl ?? new URL(ASSET_ROOT + 'mediapipe/', import.meta.url),
      modelUrl: opts.modelUrl ?? new URL(ASSET_ROOT + 'mediapipe/face_landmarker.task', import.meta.url),
      fps: opts.fps ?? 15,
      mirror: opts.mirror ?? true,
      mirrorY: opts.mirrorY ?? true,
      gpu: opts.gpu ?? true,
    };
  }

  /** Asks for the camera (the browser prompts the viewer) and starts detecting. */
  async start(stream?: MediaStream): Promise<void> {
    this.stop();
    const worker = new Worker(new URL('./webcam.worker.js', import.meta.url), { type: 'module' });
    await new Promise<void>((resolve, reject) => {
      worker.onmessage = (e: MessageEvent<{ type: string; message?: string }>) => {
        if (e.data.type === 'ready') resolve();
        else if (e.data.type === 'error') reject(new Error(e.data.message));
      };
      worker.onerror = (e) => reject(new Error(e.message));
      worker.postMessage({ type: 'init', wasmUrl: this.opts.wasmUrl.toString().replace(/\/?$/, ''), modelUrl: this.opts.modelUrl.toString(), gpu: this.opts.gpu });
    });
    worker.onmessage = (e: MessageEvent<{ type: string; t: number; ms: number; r: Reading | null }>) => { if (e.data.type === 'reading') this.onReading(e.data.r, e.data.ms); };
    this.worker = worker;

    this.stream = stream ?? await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false });
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.srcObject = this.stream;
    await v.play();
    this.video = v;
    this.timer = window.setInterval(() => void this.capture(), 1000 / this.opts.fps);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer); this.timer = 0;
    this.stream?.getTracks().forEach((t) => t.stop()); this.stream = null;
    if (this.video) { this.video.pause(); this.video.srcObject = null; this.video = null; }
    this.worker?.terminate(); this.worker = null; this.inFlight = false;
    this.attention.present = false; this.attention.absentFor = Infinity;
  }

  /** Grab a frame as a bitmap (a GPU copy, cheap) and hand it to the worker. Skips if one is still in flight. */
  private async capture(): Promise<void> {
    const v = this.video, w = this.worker;
    if (!v || !w || v.readyState < 2 || this.inFlight) return;
    this.inFlight = true;
    try {
      const bitmap = await createImageBitmap(v);
      w.postMessage({ type: 'frame', bitmap, t: performance.now() }, [bitmap]);
    } catch { this.inFlight = false; }
  }

  private onReading(r: Reading | null, ms: number): void {
    this.inFlight = false;
    this.detectMs += (ms - this.detectMs) * 0.2;
    const a = this.attention, raw = this.raw, now = performance.now();
    if (!r) { a.present = false; a.absentFor = (now - this.lastSeenAt) / 1000; a.talking = false; return; }
    this.lastSeenAt = now; a.present = true; a.absentFor = 0;
    // Position with a dead band: detection jitter of a few pixels must not move her eyes.
    const nx = (this.opts.mirror ? -1 : 1) * (r.x - 0.5) * 2, ny = (this.opts.mirrorY ? -1 : 1) * (0.5 - r.y) * 2;
    if (Math.abs(nx - raw.x) > 0.015) raw.x = nx;
    if (Math.abs(ny - raw.y) > 0.015) raw.y = ny;
    raw.near = Math.min(1, Math.max(0, (r.near - 0.08) / 0.22));
    raw.facing = r.facing; raw.smile = r.smile; raw.browUp = r.browUp; raw.mouthOpen = r.mouthOpen;
    this.mouthHist.push(r.mouthOpen); if (this.mouthHist.length > 12) this.mouthHist.shift();
    a.talking = this.mouthHist.length >= 6 && Math.max(...this.mouthHist) - Math.min(...this.mouthHist) > 0.12;
  }

  /** Call every frame: eases the smoothed attention toward the latest reading. */
  update(dt: number): Attention {
    const a = this.attention, r = this.raw;
    if (!a.present) return a;
    const k = 1 - Math.exp(-7 * dt), ke = 1 - Math.exp(-8 * dt);
    a.x += (r.x - a.x) * k; a.y += (r.y - a.y) * k; a.near += (r.near - a.near) * k; a.facing += (r.facing - a.facing) * k;
    a.smile += (r.smile - a.smile) * ke; a.browUp += (r.browUp - a.browUp) * ke; a.mouthOpen += (r.mouthOpen - a.mouthOpen) * ke;
    return a;
  }
}
