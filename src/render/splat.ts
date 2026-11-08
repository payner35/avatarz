/**
 * Photoreal renderer: a LAM Gaussian-splat head on @myned-ai/gsplat-flame-avatar-renderer (MIT).
 * The library owns its canvas and render loop and pulls ARKit weights and a neck pose from callbacks;
 * all behaviour lives in src/life. This file only mounts, loads, frames and finishes the picture.
 *
 * The preset head bundles' licence is not stated upstream (LICENSES/gsplat-Jane-NOTICE.txt): dev-only.
 */
import type { AvatarMeta, Emotion, HeadState, Renderer, VisemeFrame } from '../types.js';
import { Life, type Viewer } from '../life/index.js';
import type { MouthOptions } from '../life/mouth.js';

type SplatModule = typeof import('@myned-ai/gsplat-flame-avatar-renderer');
type GSplat = import('@myned-ai/gsplat-flame-avatar-renderer').GaussianSplatRenderer;

export interface SplatRendererOptions extends MouthOptions {
  /** Hex colour string like '0x000000'. Omit for a transparent canvas. */
  backgroundColor?: string;
  /** Crop to head and shoulders. Default true. */
  frameBust?: boolean;
  /** Where the bust sits in the bundle camera's view (fractions of view height). */
  bust?: { centerY: number; height: number };
  /** Screen-space finish: mild sharpen, contrast, and a soft key light. Default true. */
  finish?: boolean;
  /**
   * Cap on the device pixel ratio the splats are drawn at. Default 1.5: at 2 a 1460 px stage dropped
   * 30% of frames on an M-series GPU (measured 2026-11-08), which is the judder the eye reads as jumpy.
   */
  pixelRatioCap?: number;
}

const CHAT_STATE: Record<HeadState, string> = {
  idle: 'Idle', active: 'Idle', listening: 'Listening', speaking: 'Idle', thinking: 'Thinking',
};

// Any WebGL context created inside `container` while `setup` runs is made transparent: the library
// asks for an opaque context, and a canvas hands back the first context it got.
async function withTransparentCanvas<T>(container: HTMLElement, setup: () => Promise<T>): Promise<T> {
  const proto = HTMLCanvasElement.prototype;
  const original = proto.getContext;
  proto.getContext = function (this: HTMLCanvasElement, id: string, attrs?: Record<string, unknown>) {
    if (!id.startsWith('webgl') || !container.contains(this)) return original.call(this, id, attrs);
    const gl = original.call(this, id, { ...attrs, alpha: true, premultipliedAlpha: true }) as WebGL2RenderingContext | null;
    if (gl) { const clear = gl.clearColor.bind(gl); gl.clearColor = () => clear(0, 0, 0, 0); }
    return gl;
  } as typeof proto.getContext;
  try { return await setup(); } finally { proto.getContext = original; }
}

export class SplatRenderer implements Renderer {
  readonly name = 'splat';
  updateMs = 0;
  readonly life: Life;
  private host: HTMLDivElement | null = null;
  private light: HTMLDivElement | null = null;
  private renderer: GSplat | null = null;
  private mod: SplatModule | null = null;
  private resizeObs: ResizeObserver | null = null;
  private bones: string[] | null | undefined = undefined;
  private avatarUrl = '';
  private readonly opts: Required<Omit<SplatRendererOptions, keyof MouthOptions>>;

  constructor(opts: SplatRendererOptions = {}) {
    this.opts = {
      backgroundColor: opts.backgroundColor ?? '',
      frameBust: opts.frameBust ?? true,
      bust: opts.bust ?? { centerY: 0.47, height: 0.44 },
      finish: opts.finish ?? true,
      pixelRatioCap: opts.pixelRatioCap ?? 1.5,
    };
    this.life = new Life({ jawMax: opts.jawMax, jawGain: opts.jawGain });
  }

  /** Kept for the test page and the recorder. */
  get weights(): Record<string, number> { return this.life.weights; }
  get mouthScale(): number { return this.life.mouth.scale; }
  set mouthScale(k: number) { this.life.mouth.scale = k; }

  /** The library makes its own canvas, so we mount a div over the given canvas's parent. */
  mount(canvas: HTMLCanvasElement): void {
    const parent = canvas.parentElement ?? document.body;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    canvas.style.display = 'none';
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;inset:0;overflow:hidden;';
    parent.appendChild(host);
    this.host = host;
    if (this.opts.finish) this.addFinish(parent, host);
  }

  /** Unsharp mask, a little contrast and saturation, a soft key light and edge falloff. Screen-space only. */
  private addFinish(parent: HTMLElement, host: HTMLDivElement): void {
    if (!document.getElementById('avatarz-finish')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'avatarz-finish';
      svg.setAttribute('style', 'position:absolute;width:0;height:0');
      svg.innerHTML = '<filter id="avatarz-sharpen" color-interpolation-filters="sRGB">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b"/>' +
        '<feComposite in="SourceGraphic" in2="b" operator="arithmetic" k1="0" k2="1.55" k3="-0.55" k4="0"/></filter>';
      document.body.appendChild(svg);
    }
    host.style.filter = 'url(#avatarz-sharpen) contrast(1.06) saturate(1.04)';
    const light = document.createElement('div');
    light.style.cssText = 'position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;' +
      'background: radial-gradient(ellipse 55% 50% at 38% 30%, rgba(255,246,230,0.55) 0%, rgba(255,246,230,0.0) 70%),' +
      'radial-gradient(ellipse 80% 80% at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%);';
    parent.appendChild(light);
    this.light = light;
  }

  async setAvatar(url: string): Promise<void> {
    if (!this.host) throw new Error('avatarz: splat renderer not mounted');
    this.mod ??= await import('@myned-ai/gsplat-flame-avatar-renderer');
    const { GaussianSplatRenderer } = this.mod;
    // The library is a singleton; drop any previous instance first.
    this.renderer?.dispose();
    this.renderer = null;
    GaussianSplatRenderer.instance = undefined;
    this.avatarUrl = url;
    this.bones = undefined;
    const create = () => GaussianSplatRenderer.getInstance(this.host!, url, {
      getChatState: () => CHAT_STATE[this.life.state],
      getExpressionData: () => this.life.weights,
      getNeckPose: () => this.neckPose(),
      backgroundColor: this.opts.backgroundColor || undefined,
    });
    this.renderer = this.opts.backgroundColor ? await create() : await withTransparentCanvas(this.host, create);
    if (this.opts.frameBust) this.frameBust();
    this.applyPixelRatio();
    this.resizeObs?.disconnect();
    this.resizeObs = new ResizeObserver(() => setTimeout(() => this.applyPixelRatio(), 50));
    this.resizeObs.observe(this.host);
  }

  /** The rig's neck chain, resolved once the library has built its bone map. Torso bones are left to the clip. */
  private neckPose(): Record<string, [number, number, number]> | null {
    if (this.bones === undefined) {
      const map = (this.renderer as unknown as { _getOverridableBones?: () => Record<string, unknown> | null } | null)?._getOverridableBones?.();
      if (!map) return null;
      const chain = ['neckLower', 'neckUpper', 'neck', 'head'].filter((b) => b in map);
      this.bones = chain.length ? chain : null;
    }
    return this.bones ? this.life.neckPose(this.bones) : null;
  }

  private applyPixelRatio(): void {
    const three = (this.renderer?.viewer as unknown as { renderer?: { getPixelRatio(): number; setPixelRatio(r: number): void } } | undefined)?.renderer;
    if (!three) return;
    const want = Math.min(window.devicePixelRatio || 1, this.opts.pixelRatioCap);
    if (Math.abs(three.getPixelRatio() - want) > 0.01) three.setPixelRatio(want);
  }

  private frameBust(): void {
    const cam = this.renderer?.viewer?.camera as unknown as
      { isPerspectiveCamera?: boolean; aspect: number; setViewOffset: (...a: number[]) => void } | undefined;
    if (!cam?.isPerspectiveCamera) return;
    const { centerY, height } = this.opts.bust;
    const zoom = 1 / height, a = cam.aspect;
    cam.setViewOffset(a * zoom, zoom, (a * zoom - a) / 2, centerY * zoom - 0.5, a, 1);
  }

  getAvatarMeta(): AvatarMeta | null {
    return { name: this.avatarUrl.split('/').pop()?.replace(/\.zip$/, ''), version: 'gsplat', expressions: ['aa', 'ih', 'ou', 'ee', 'oh', 'blink'] };
  }

  snapshot(): Record<string, number> { return this.life.snapshot(); }
  setState(state: HeadState): void { this.life.setState(state); }
  setEmotion(emotion: Emotion, intensity = 1): void { this.life.setEmotion(emotion, intensity); }
  setEmotionMix(mix: Partial<Record<Exclude<Emotion, 'neutral'>, number>>): void { this.life.setEmotionMix(mix); }
  setAttention(a: Viewer | null): void { this.life.setViewer(a); }

  frame(v: VisemeFrame, dt: number): void {
    const t0 = performance.now();
    this.life.frame(v, dt);
    this.updateMs = performance.now() - t0;
  }

  dispose(): void {
    this.resizeObs?.disconnect(); this.resizeObs = null;
    this.renderer?.dispose();
    this.renderer = null;
    if (this.mod) this.mod.GaussianSplatRenderer.instance = undefined;
    this.host?.remove(); this.host = null;
    this.light?.remove(); this.light = null;
  }
}
