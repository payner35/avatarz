/**
 * Life: the coordinator. Owns the clock, the state, the speech envelope and the viewer, and runs the
 * four behaviours in order each frame: mouth, eyes, emotion, then the mouth's safety limiter.
 * Renderers call `frame()` and `neckPose()` and write `weights` to their rig.
 */
import { ARKIT, type Emotion, type HeadState, type VisemeFrame } from '../types.js';
import { Mouth, type MouthOptions } from './mouth.js';
import { Eyes } from './eyes.js';
import { Head, type Pose, type Viewer } from './head.js';
import { EmotionBlend } from './emotion.js';

export type { Viewer, Pose };

export class Life {
  /** The 52 ARKit channels the renderer applies. */
  readonly weights: Record<string, number> = { mouthSmileLeft: 0.2, mouthSmileRight: 0.2, jawOpen: 0.02 };
  readonly mouth: Mouth;
  readonly eyes = new Eyes();
  readonly head = new Head();
  readonly emotion = new EmotionBlend();
  /** How much of the neural model's brow and cheek output to blend in. Default 0.6. */
  modelFaceMix = 0.6;
  /** For bisecting by eye: 0 lips only; 1 lips + eyes; 2 + head (no emotion); 3 + emotion (no head); 4 everything. */
  level: 0 | 1 | 2 | 3 | 4 = 4;
  state: HeadState = 'idle';
  private elapsed = 0;
  private speechEnv = 0;
  private lastEnergy = 0;
  private viewer: Viewer | null = null;
  private facingState = false;
  private engaged = false;
  private disengagedAt = -10;
  private lastGreetAt = -10;
  private lastPoseT = 0;

  constructor(opts: MouthOptions = {}) {
    this.mouth = new Mouth(opts);
    this.head.onGlance = (x, y, t) => this.eyes.glance(x, y, t);
  }

  get t(): number { return this.elapsed; }

  setState(state: HeadState): void {
    const prev = this.state;
    this.state = state;
    if (prev === state) return;
    // A blink closes a reply; a breath opens one.
    if (prev === 'speaking') this.eyes.blink();
    if (state === 'speaking') { this.head.breath(); this.eyes.breath(this.elapsed); }
  }

  setEmotion(e: Emotion, intensity = 1): void { this.emotion.set(e, intensity); }
  setEmotionMix(mix: Partial<Record<Exclude<Emotion, 'neutral'>, number>>): void { this.emotion.setMix(mix); }

  /** Viewer from the webcam. "Here" means seen within half a second; "facing" has hysteresis. */
  setViewer(a: Viewer | null): void {
    const t = this.elapsed;
    const here = !!a && (a.present || a.absentFor < 0.5);
    if (here && a) { if (a.facing > 0.6) this.facingState = true; else if (a.facing < 0.3) this.facingState = false; }
    else this.facingState = false;
    const engaged = here && this.facingState;
    if (!engaged) { if (this.engaged) this.disengagedAt = t; }
    else if (!this.engaged && t - this.disengagedAt > 1.5 && t - this.lastGreetAt > 6) { this.lastGreetAt = t; this.eyes.greet(t); }
    this.engaged = engaged;
    this.viewer = here ? a : null;
  }

  /** One animation frame: fills `weights` from the viseme frame and the behaviours. */
  frame(v: VisemeFrame, dt: number): void {
    this.elapsed += dt;
    const t = this.elapsed, w = this.weights, st = this.state;
    this.speechEnv += ((v.speaking ? 1 : 0) - this.speechEnv) * (1 - Math.exp(-4 * dt));
    const jumped = v.energy - this.lastEnergy > 0.28;
    this.lastEnergy = v.energy;
    if (v.speaking && jumped && Math.random() < 0.35) this.head.speechBeat(t);

    this.mouth.apply(w, v, dt, t, this.speechEnv < 0.3, st === 'thinking');
    if (this.level >= 1) this.eyes.apply(w, dt, t, st, this.viewer, this.head.yaw, this.head.pitch, this.speechEnv, this.mouth.modelFace, this.modelFaceMix);
    else { for (const n of Object.keys(w)) if (/^eye|^brow|^cheek|^nose/.test(n)) w[n] = 0; }
    if (this.level === 3 || this.level === 4) this.emotion.apply(w, dt);
    this.mouth.limit(w, dt);
  }

  /** Called on the renderer's own clock. `bones` is the rig's neck chain. */
  neckPose(bones: string[]): Pose {
    const now = performance.now();
    const dt = this.lastPoseT ? Math.min(0.05, (now - this.lastPoseT) / 1000) : 0.016;
    this.lastPoseT = now;
    if (this.level < 2 || this.level === 3) { const still: Pose = {}; for (const b of bones) still[b] = [0, 0, 0]; this.head.lastPose = still; return still; }
    return this.head.pose(bones, dt, this.elapsed, this.state, this.viewer, this.eyes.contactMix, this.speechEnv, this.weights.jawOpen ?? 0);
  }

  /** Everything applied this frame, flat, for the motion recorder. */
  snapshot(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const n of ARKIT) out['bs.' + n] = this.weights[n] ?? 0;
    const pose = this.head.lastPose;
    if (pose) for (const b in pose) { out['bone.' + b + '.pitch'] = pose[b][0]; out['bone.' + b + '.yaw'] = pose[b][1]; out['bone.' + b + '.roll'] = pose[b][2]; }
    out['in.contactMix'] = this.eyes.contactMix; out['in.speechEnv'] = this.speechEnv;
    out['sys.limiterHits'] = this.mouth.limiterHits;
    if (this.viewer) { out['in.viewer.x'] = this.viewer.x; out['in.viewer.y'] = this.viewer.y; out['in.viewer.present'] = this.viewer.present ? 1 : 0; }
    return out;
  }
}
