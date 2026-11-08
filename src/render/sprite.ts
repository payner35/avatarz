/**
 * Demo renderer: a procedural cartoon face on Canvas 2D. Mouth geometry is the
 * weighted average of a per-viseme shape table (Preston Blair style), so the
 * cross-fade comes for free. No assets, no licence questions, runs anywhere.
 */
import { VISEMES, clamp01, type HeadState, type Renderer, type VisemeFrame } from '../types.js';

interface Shape { open: number; width: number; round: number; teeth: number; press: number }

const SHAPES: Record<(typeof VISEMES)[number], Shape> = {
  sil: { open: 0.0, width: 1.0, round: 0.0, teeth: 0.0, press: 0.0 },
  PP:  { open: 0.0, width: 0.9, round: 0.1, teeth: 0.0, press: 1.0 },
  FF:  { open: 0.15, width: 1.0, round: 0.0, teeth: 1.0, press: 0.3 },
  TH:  { open: 0.2, width: 1.0, round: 0.0, teeth: 0.6, press: 0.0 },
  DD:  { open: 0.3, width: 1.0, round: 0.0, teeth: 0.5, press: 0.0 },
  kk:  { open: 0.35, width: 0.95, round: 0.0, teeth: 0.2, press: 0.0 },
  CH:  { open: 0.3, width: 0.8, round: 0.4, teeth: 0.6, press: 0.0 },
  SS:  { open: 0.15, width: 1.1, round: 0.0, teeth: 1.0, press: 0.0 },
  nn:  { open: 0.2, width: 1.0, round: 0.0, teeth: 0.4, press: 0.0 },
  RR:  { open: 0.3, width: 0.8, round: 0.5, teeth: 0.2, press: 0.0 },
  aa:  { open: 1.0, width: 1.0, round: 0.1, teeth: 0.3, press: 0.0 },
  E:   { open: 0.5, width: 1.2, round: 0.0, teeth: 0.7, press: 0.0 },
  I:   { open: 0.3, width: 1.25, round: 0.0, teeth: 0.8, press: 0.0 },
  O:   { open: 0.8, width: 0.6, round: 1.0, teeth: 0.0, press: 0.0 },
  U:   { open: 0.4, width: 0.5, round: 1.0, teeth: 0.0, press: 0.0 },
};

export interface SpriteRendererOptions {
  skin?: string; lip?: string; eye?: string; background?: string | null;
}

export class SpriteRenderer implements Renderer {
  readonly name = 'sprite';
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private state: HeadState = 'idle';
  private elapsed = 0;
  private blinkAt = 2;
  private blinkPhase = -1;
  private readonly colors: Required<SpriteRendererOptions>;

  constructor(opts: SpriteRendererOptions = {}) {
    this.colors = {
      skin: opts.skin ?? '#f1c9a5',
      lip: opts.lip ?? '#b5533c',
      eye: opts.eye ?? '#2b2b2b',
      background: opts.background ?? null,
    };
  }

  mount(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  async setAvatar(_url: string): Promise<void> { /* procedural; nothing to load */ }
  setState(state: HeadState): void { this.state = state; }

  frame(v: VisemeFrame, dt: number): void {
    const c = this.canvas, g = this.ctx;
    if (!c || !g) return;
    this.elapsed += dt;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = c.clientWidth || c.width, H = c.clientHeight || c.height;
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.colors.background) { g.fillStyle = this.colors.background; g.fillRect(0, 0, W, H); }
    else g.clearRect(0, 0, W, H);

    // Blend mouth shape.
    const s: Shape = { open: 0, width: 0, round: 0, teeth: 0, press: 0 };
    let sum = 0;
    for (let i = 0; i < VISEMES.length; i++) {
      const w = v.visemes[i]; if (w <= 0) continue;
      const sh = SHAPES[VISEMES[i]];
      s.open += sh.open * w; s.width += sh.width * w; s.round += sh.round * w; s.teeth += sh.teeth * w; s.press += sh.press * w;
      sum += w;
    }
    if (sum > 0) { s.open /= sum; s.width /= sum; s.round /= sum; s.teeth /= sum; s.press /= sum; }
    else s.width = 1;
    const open = Math.max(s.open * (0.5 + 0.5 * v.energy), v.jawOpen * 0.6);

    const R = Math.min(W, H) * 0.36;
    const t = this.elapsed;
    const swayX = Math.sin(t * 0.43) * R * 0.02, swayY = Math.sin(t * 0.7) * R * 0.015;
    const tilt = (this.state === 'thinking' ? 0.07 : 0) + Math.sin(t * 0.31) * 0.02;
    const cx = W / 2 + swayX, cy = H / 2 + swayY + open * R * 0.03;

    g.save();
    g.translate(cx, cy); g.rotate(tilt);
    // Head
    g.fillStyle = this.colors.skin;
    g.beginPath(); g.ellipse(0, 0, R * 0.95, R * 1.05 + open * R * 0.06, 0, 0, Math.PI * 2); g.fill();
    // Eyes with blink
    if (this.blinkPhase < 0 && t >= this.blinkAt) this.blinkPhase = 0;
    let blink = 0;
    if (this.blinkPhase >= 0) {
      this.blinkPhase += dt / 0.2; const p = this.blinkPhase;
      blink = p < 0.4 ? p / 0.4 : p < 1 ? 1 - (p - 0.4) / 0.6 : 0;
      if (p >= 1) { this.blinkPhase = -1; this.blinkAt = t + 3 + Math.random() * 3; }
    }
    const lookUp = this.state === 'thinking' ? -R * 0.04 : 0;
    const gazeX = Math.sin(t * 0.37) * R * 0.015 + (this.state === 'thinking' ? R * 0.03 : 0);
    for (const sx of [-1, 1]) {
      const ex = sx * R * 0.36, ey = -R * 0.18;
      const eh = R * 0.11 * (1 - blink * 0.92);
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex, ey, R * 0.13, eh, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = this.colors.eye; g.beginPath(); g.ellipse(ex + gazeX, ey + lookUp, R * 0.06, Math.min(eh, R * 0.06), 0, 0, Math.PI * 2); g.fill();
      // brow
      g.strokeStyle = '#6b4a2f'; g.lineWidth = R * 0.035; g.lineCap = 'round';
      const raise = this.state === 'thinking' && sx > 0 ? -R * 0.04 : 0;
      g.beginPath(); g.moveTo(ex - R * 0.14, ey - R * 0.2 + raise); g.quadraticCurveTo(ex, ey - R * 0.27 + raise, ex + R * 0.14, ey - R * 0.2 + raise); g.stroke();
    }
    // Nose
    g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = R * 0.03;
    g.beginPath(); g.moveTo(0, -R * 0.02); g.lineTo(-R * 0.05, R * 0.2); g.lineTo(R * 0.04, R * 0.22); g.stroke();
    // Mouth
    const my = R * 0.5;
    const mw = R * 0.42 * s.width * (1 - 0.35 * s.round);
    const mh = R * 0.05 + open * R * 0.34 * (1 + 0.3 * s.round);
    const press = clamp01(s.press);
    g.fillStyle = '#4a1d1d';
    g.beginPath(); g.ellipse(0, my, mw, Math.max(R * 0.012, mh * (1 - press * 0.9)), 0, 0, Math.PI * 2); g.fill();
    // Teeth band at the top of the opening
    if (s.teeth > 0.05 && mh > R * 0.03) {
      g.fillStyle = '#fff';
      g.beginPath(); g.ellipse(0, my - mh * 0.55, mw * 0.85, mh * 0.35 * clamp01(s.teeth), 0, 0, Math.PI * 2); g.fill();
    }
    // Lips
    g.strokeStyle = this.colors.lip; g.lineWidth = R * (0.04 + press * 0.02);
    g.beginPath(); g.ellipse(0, my, mw, Math.max(R * 0.012, mh * (1 - press * 0.9)), 0, 0, Math.PI * 2); g.stroke();
    g.restore();
  }

  dispose(): void { this.canvas = null; this.ctx = null; }
}
