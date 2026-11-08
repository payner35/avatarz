/**
 * Head motion, in radians, three layers summed per frame:
 *  1. attention: a target the head wanders to every few seconds, followed by a critically damped spring;
 *  2. beats: impulses (speech stresses, listening nods) on a stiffer spring, so they overshoot a little;
 *  3. breath, sway and micro-noise: slow, tiny, never still.
 * Spread over the neck chain when the rig has one, so a turn bends from the shoulders up.
 */
import type { HeadState } from '../types.js';

export interface Viewer { present: boolean; x: number; y: number; near: number; facing: number; smile: number; browUp: number; talking: boolean; absentFor: number }
export type Pose = Record<string, [number, number, number]>;

const DEG = Math.PI / 180;
const spring = (x: number, v: number, target: number, omega: number, dt: number): [number, number] => {
  const a = omega * omega * (target - x) - 2 * omega * v;
  v += a * dt; x += v * dt; return [x, v];
};

export class Head {
  /** Total yaw and pitch applied last frame; the eyes subtract them for eye contact. */
  yaw = 0;
  pitch = 0;
  lastPose: Pose | null = null;
  private h = { pitch: 0, yaw: 0, roll: 0, vp: 0, vy: 0, vr: 0, tp: 0, ty: 0, tr: 0, nextShiftAt: 2 };
  private beat = { pitch: 0, yaw: 0, vp: 0, vy: 0 };
  private nodNextAt = 3;
  private lastBeatAt = -10;
  private speechLean = 0;
  private prevState: HeadState = 'idle';
  private readonly phase = Array.from({ length: 8 }, () => Math.random() * Math.PI * 2);
  /** Hook the eyes in so a glance moves them first. */
  onGlance: ((x: number, y: number, t: number) => void) | null = null;

  /** A stressed syllable: small nod with a touch of random yaw, at most one per 0.6 s. */
  speechBeat(t: number): void {
    if (t - this.lastBeatAt < 0.6) return;
    this.lastBeatAt = t;
    this.beat.vp += 0.4 + Math.random() * 0.3;
    this.beat.vy += (Math.random() - 0.5) * 0.4;
  }
  /** Small lift at the start of a reply. */
  breath(): void { this.beat.vp -= 0.9; }

  pose(bones: string[], dt: number, t: number, st: HeadState, viewer: Viewer | null, contactMix: number, speechEnv: number, _jaw: number): Pose {
    const ph = this.phase, h = this.h;
    // Posture per state: where the attention target wanders around, and how far (degrees of yaw span).
    let baseP = 0, baseY = 0, baseR = 0, spread = 5 - 2 * contactMix, shiftEvery = 5;
    if (st === 'listening') { baseP = 2.5 * DEG; baseR = 2.5 * DEG; spread = 2; shiftEvery = 6; }
    if (st === 'thinking')  { baseP = -2 * DEG; baseY = 5 * DEG; baseR = 6 * DEG; spread = 3; shiftEvery = 4; }
    if (st === 'speaking' || speechEnv > 0.5) { spread = 4; shiftEvery = 3.5; }
    if (st !== this.prevState) { this.prevState = st; h.nextShiftAt = t + 0.2; }
    if (t >= h.nextShiftAt) {
      h.tp = baseP + (Math.random() - 0.5) * spread * 0.5 * DEG;
      h.ty = baseY + (Math.random() - 0.5) * spread * DEG;
      h.tr = baseR + (Math.random() - 0.5) * spread * 0.6 * DEG;
      h.nextShiftAt = t + shiftEvery * (0.6 + Math.random() * 0.9);
      if (st === 'thinking' && Math.random() < 0.3) h.ty += 6 * DEG * (Math.random() < 0.5 ? -1 : 1);
      // Idle: every so often a proper glance to one side. The eyes go first; the head follows on its spring.
      if ((st === 'idle' || st === 'active') && Math.random() < 0.18 && contactMix < 0.5) {
        const side = Math.random() < 0.5 ? -1 : 1;
        h.ty += side * (4 + Math.random() * 3) * DEG;
        h.tr -= side * 1.5 * DEG;
        this.onGlance?.(side * 0.35, (Math.random() - 0.3) * 0.15, t);
      }
    }
    [h.pitch, h.vp] = spring(h.pitch, h.vp, h.tp, 1.5, dt);
    [h.yaw, h.vy] = spring(h.yaw, h.vy, h.ty, 1.3, dt);
    [h.roll, h.vr] = spring(h.roll, h.vr, h.tr, 1.2, dt);

    // Beats: stiff spring back to zero after each impulse; listening adds affirmative double nods.
    const b = this.beat;
    if (st === 'listening' && t >= this.nodNextAt) { b.vp += 1.6; this.nodNextAt = t + 2.5 + Math.random() * 4; setTimeout(() => { b.vp += 1.2; }, 260); }
    [b.pitch, b.vp] = spring(b.pitch, b.vp, 0, 7, dt);
    [b.yaw, b.vy] = spring(b.yaw, b.vy, 0, 6, dt);

    // Breath (14–20/min), slow weight-shift sway, micro-noise, and a speech nod that follows the jaw.
    const bpm = 14 + 6 * speechEnv;
    const breathe = (0.5 - 0.5 * Math.cos(t * 2 * Math.PI * bpm / 60 + ph[0])) * -0.5 * DEG;
    const swayY = Math.sin(t * 2 * Math.PI * 0.07 + ph[5]) * 1.6 * DEG;
    const swayR = Math.sin(t * 2 * Math.PI * 0.05 + ph[6]) * 1.1 * DEG;
    const nP = (Math.sin(t * 0.9 + ph[1]) + Math.sin(t * 1.7 + ph[2]) * 0.5) * 0.18 * DEG;
    const nY = (Math.sin(t * 0.7 + ph[3]) + Math.sin(t * 1.3 + ph[4]) * 0.5) * 0.25 * DEG;
    const nR = Math.sin(t * 0.5 + ph[5]) * 0.2 * DEG;
    // No per-syllable nod: tying pitch to the jaw bobbed the head at 9°/s on every word, which read as
    // jumping (logged 2026-11-08). Speech only lowers the head a little, slowly, through the envelope.
    this.speechLean += (speechEnv * 0.4 * DEG - this.speechLean) * (1 - Math.exp(-2 * dt));
    const speechNod = this.speechLean;
    // Follow the viewer, fading in with eye contact.
    const lim = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const vx = viewer ? lim(viewer.x * 22, 12) * DEG * contactMix : 0, vy = viewer ? lim(viewer.y * 10, 6) * DEG * contactMix : 0;

    const pitch = h.pitch + b.pitch * DEG + breathe + nP + speechNod + vy;
    const yaw = h.yaw + b.yaw * DEG + nY * (1 + speechEnv) + swayY + vx;
    const roll = h.roll + nR + swayR;
    this.yaw = yaw; this.pitch = pitch;

    // Distribute along the chain: lower bones take less, the head takes the most.
    const n = bones.length;
    const share = n === 1 ? [1] : n === 2 ? [0.4, 0.6] : n === 3 ? [0.25, 0.3, 0.45] : [0.2, 0.25, 0.25, 0.3];
    const out: Pose = {};
    bones.forEach((bone, i) => { out[bone] = [pitch * share[i], yaw * share[i], roll * share[i]]; });
    this.lastPose = out;
    return out;
  }
}
