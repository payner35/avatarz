/**
 * Eyes and upper face: blink, gaze (wander, saccades, eye contact with the viewer), brows and cheeks,
 * and the reactions to a viewer (greeting flash, mirrored smile).
 */
import { clamp01, type HeadState } from '../types.js';
import type { Viewer } from './head.js';

const DEG = Math.PI / 180;

export class Eyes {
  /** 0..1 how much the gaze is in eye-contact mode. The head reads it to settle when someone is there. */
  contactMix = 0;
  /** Current gaze target offsets (the head reads them for glances). */
  readonly gaze = { x: 0, y: 0, tx: 0, ty: 0, nextAt: 1.5 };
  /** The user's smile, mirrored softly. */
  private userSmile = 0;
  private blinkAt = 2;
  private blinkPhase = -1;
  private blinkDepth = 1;
  private blinkDouble = false;
  private greetAt = -10;
  private breathAt = -10;
  private contact = { x: 0, y: 0, tx: 0, ty: 0, nextAt: 0 };
  private readonly phase = Array.from({ length: 8 }, () => Math.random() * Math.PI * 2);

  /** Start a blink now if none is running and the last one ended more than a second ago. */
  blink(): void { if (this.blinkPhase < 0 && this.t - this.lastBlinkEnd > 1.0) this.blinkPhase = 0; }
  private t = 0;
  private lastBlinkEnd = -10;
  /** Eyebrow flash and blink: the greeting people give when someone comes back. */
  greet(t: number): void { this.greetAt = t; this.blink(); }
  /** The brows lift for half a second at the start of a reply. */
  breath(t: number): void { this.breathAt = t; }
  /** Point the eyes somewhere for a glance; the head follows on its own spring. */
  glance(x: number, y: number, t: number): void { this.gaze.tx = x; this.gaze.ty = y; this.gaze.nextAt = t + 1.2 + Math.random(); }

  apply(w: Record<string, number>, dt: number, t: number, st: HeadState, viewer: Viewer | null,
    headYaw: number, headPitch: number, speechEnv: number, modelFace: Record<string, number>, modelFaceMix: number): void {
    const ph = this.phase;
    this.t = t;
    const drift = (i: number, f: number) => Math.sin(t * f + ph[i]);

    // Blink: close over 120 ms and open over 200 ms, both eased, no hold. The rig's lid is visually shut
    // from ~0.6 up, so a faster close drew as a one-frame snap (pixel-graded 2026-11-08). One in twelve
    // is a double, one in eight a partial.
    if (this.blinkPhase < 0 && t >= this.blinkAt) {
      this.blinkPhase = 0;
      this.blinkDepth = Math.random() < 0.125 ? 0.55 + Math.random() * 0.3 : 1;
      this.blinkDouble = Math.random() < 0.08;
    }
    let b = 0;
    if (this.blinkPhase >= 0) {
      this.blinkPhase += dt;
      const p = this.blinkPhase;
      const ease = (u: number) => u * u * (3 - 2 * u);
      if (p < 0.12) b = ease(p / 0.12);
      else if (p < 0.32) b = 1 - ease((p - 0.12) / 0.20);
      else if (this.blinkDouble) { this.blinkDouble = false; this.blinkPhase = 0; this.blinkDepth = 1; }
      else {
        this.blinkPhase = -1;
        this.lastBlinkEnd = t;
        const base = st === 'thinking' ? 2.2 : st === 'listening' ? 3.5 : 3;
        this.blinkAt = t + base + Math.random() * 3.5;
      }
      b *= this.blinkDepth;
    }
    const lidFollow = Math.max(0, -this.gaze.y) * 0.15;
    w.eyeBlinkLeft = w.eyeBlinkRight = clamp01(b + lidFollow);

    // Gaze wander: a new spot every 1–4 s. Thinking looks up and away; listening stays locked.
    const g = this.gaze;
    const lim = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const aim = viewer ? { x: lim(viewer.x * 1.4, 0.6), y: lim(viewer.y * 0.9, 0.4) } : null;
    if (t >= g.nextAt) {
      const spread = st === 'thinking' ? 0.45 : st === 'listening' ? 0.08 : 0.18;
      g.tx = (aim?.x ?? 0) + (Math.random() - 0.5) * 2 * spread * (st === 'thinking' ? 1.4 : 1);
      g.ty = st === 'thinking' ? 0.25 + Math.random() * 0.25 : (aim?.y ?? 0) + (Math.random() - 0.5) * spread;
      g.nextAt = t + (st === 'thinking' ? 2 + Math.random() * 3 : 1 + Math.random() * 3);
      if (Math.abs(g.tx) + Math.abs(g.ty) > 0.3) this.blink(); // people blink on large gaze shifts
    }
    g.x += (g.tx - g.x) * (1 - Math.exp(-35 * dt));
    g.y += (g.ty - g.y) * (1 - Math.exp(-35 * dt));
    // Idle gaze with the vestibulo-ocular reflex: the eyes counter the head so the gaze holds.
    const idleX = g.x - headYaw / (25 * DEG) + drift(0, 0.37) * 0.03;
    const idleY = g.y + headPitch / (20 * DEG) + drift(1, 0.29) * 0.02;
    // Eye contact: the viewer's real angle minus the head's. A 640-wide webcam spans ~60°, so the
    // normalised offset maps to ±30° sideways, ±22° up/down. Tiny eased shifts between the viewer's eyes.
    const c = this.contact;
    if (t >= c.nextAt) { c.tx = (Math.random() - 0.5) * 0.06; c.ty = (Math.random() - 0.5) * 0.03; c.nextAt = t + 1 + Math.random() * 2; }
    c.x += (c.tx - c.x) * (1 - Math.exp(-15 * dt)); c.y += (c.ty - c.y) * (1 - Math.exp(-15 * dt));
    const cx = viewer ? (viewer.x * 30 * DEG - headYaw) / (25 * DEG) + c.x : idleX;
    const cy = viewer ? (viewer.y * 22 * DEG - headPitch) / (20 * DEG) + c.y : idleY;
    const wantContact = viewer && st !== 'thinking' ? 1 : 0;
    this.contactMix += (wantContact - this.contactMix) * (1 - Math.exp(-3 * dt));
    let gx = idleX + (cx - idleX) * this.contactMix, gy = idleY + (cy - idleY) * this.contactMix;
    gx = lim(gx, 0.8); gy = lim(gy, 0.6);
    const verge = st === 'thinking' ? 0.02 : 0.05 + (viewer ? viewer.near * 0.06 : 0);
    w.eyeLookOutLeft = Math.max(0, -gx - verge); w.eyeLookInLeft = Math.max(0, gx + verge);
    w.eyeLookInRight = Math.max(0, -gx + verge); w.eyeLookOutRight = Math.max(0, gx - verge);
    w.eyeLookUpLeft = w.eyeLookUpRight = Math.max(0, gy);
    w.eyeLookDownLeft = w.eyeLookDownRight = Math.max(0, -gy);

    // Brows and cheeks: slow drift, never still, never symmetric; the model's own upper face blended in.
    const browBase = st === 'listening' ? 0.18 : st === 'thinking' ? 0.22 : 0.06;
    const m = modelFace, mix = modelFaceMix;
    const breath = Math.max(0, 1 - (t - this.breathAt) / 0.5) * 0.15;
    w.browInnerUp = clamp01(browBase + breath + 0.06 * drift(2, 0.23) + 0.15 * speechEnv + mix * (m.browInnerUp ?? 0));
    w.browOuterUpLeft = clamp01(0.03 + breath * 0.6 + 0.05 * drift(3, 0.19) + 0.1 * speechEnv + mix * (m.browOuterUpLeft ?? 0));
    w.browOuterUpRight = clamp01(0.03 + breath * 0.6 + 0.05 * drift(4, 0.17) + 0.1 * speechEnv + mix * (m.browOuterUpRight ?? 0));
    w.browDownLeft = clamp01((st === 'thinking' ? 0.12 + 0.05 * drift(5, 0.31) : 0) + mix * (m.browDownLeft ?? 0));
    w.browDownRight = clamp01((st === 'thinking' ? 0.12 + 0.05 * drift(5, 0.31) : 0) + mix * (m.browDownRight ?? 0));
    w.eyeSquintLeft = w.eyeSquintRight = clamp01(0.03 + 0.03 * drift(6, 0.27));
    w.eyeWideLeft = w.eyeWideRight = st === 'listening' ? clamp01(0.08 + 0.04 * drift(5, 0.17)) : 0;
    w.cheekSquintLeft = clamp01(0.03 + 0.03 * drift(7, 0.21) + mix * (m.cheekSquintLeft ?? 0));
    w.cheekSquintRight = clamp01(0.03 + 0.03 * drift(7, 0.21) + mix * (m.cheekSquintRight ?? 0));

    // Reactions to the viewer: an eyebrow flash when they return, a mirrored smile, brighter when close.
    const greet = Math.max(0, 1 - (t - this.greetAt) / 0.6);
    const flash = greet < 0.5 ? greet * 2 : (1 - greet) * 2;
    w.browInnerUp = clamp01(w.browInnerUp + 0.3 * flash);
    w.browOuterUpLeft = clamp01(w.browOuterUpLeft + 0.3 * flash); w.browOuterUpRight = clamp01(w.browOuterUpRight + 0.3 * flash);
    const targetSmile = viewer ? viewer.smile * 0.6 + viewer.near * 0.1 : 0;
    this.userSmile += (targetSmile - this.userSmile) * (1 - Math.exp(-3 * dt));
    const smile = (st === 'listening' ? 0.3 : st === 'thinking' ? 0.08 : 0.2) + this.userSmile;
    w.mouthSmileLeft = Math.max(w.mouthSmileLeft, smile + 0.03 * drift(2, 0.13));
    w.mouthSmileRight = Math.max(w.mouthSmileRight, smile + 0.03 * drift(3, 0.11));
  }
}
