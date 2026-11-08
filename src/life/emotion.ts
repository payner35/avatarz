/** Emotion blending onto ARKit channels. Targets ease in over ~0.3 s. */
import { clamp01, type Emotion } from '../types.js';

type Offsets = Record<string, number>;

// Offsets at intensity 1. Kept modest: the splat rig blurs big deformations.
export const EMOTIONS: Record<Emotion, Offsets> = {
  neutral: {},
  warm:       { mouthSmileLeft: 0.35, mouthSmileRight: 0.35, cheekSquintLeft: 0.2, cheekSquintRight: 0.2, eyeSquintLeft: 0.1, eyeSquintRight: 0.1, mouthDimpleLeft: 0.15, mouthDimpleRight: 0.15 },
  amused:     { mouthSmileLeft: 0.5, mouthSmileRight: 0.45, cheekSquintLeft: 0.3, cheekSquintRight: 0.3, eyeSquintLeft: 0.2, eyeSquintRight: 0.2, browOuterUpLeft: 0.15, browInnerUp: 0.1, mouthDimpleLeft: 0.2, mouthDimpleRight: 0.2 },
  concerned:  { browInnerUp: 0.45, browDownLeft: 0.2, browDownRight: 0.2, mouthFrownLeft: 0.15, mouthFrownRight: 0.15, mouthPressLeft: 0.1, mouthPressRight: 0.1, mouthSmileLeft: -0.15, mouthSmileRight: -0.15 },
  surprised:  { browInnerUp: 0.5, browOuterUpLeft: 0.45, browOuterUpRight: 0.45, eyeWideLeft: 0.35, eyeWideRight: 0.35, jawOpen: 0.06 },
  thoughtful: { browDownLeft: 0.25, browDownRight: 0.25, browInnerUp: 0.15, mouthPressLeft: 0.08, mouthPressRight: 0.08, eyeSquintLeft: 0.08, eyeSquintRight: 0.08 },
};

export class EmotionBlend {
  private target: Offsets = {};
  private current: Offsets = {};

  set(emotion: Emotion, intensity = 1): void {
    const k = clamp01(intensity);
    this.target = Object.fromEntries(Object.entries(EMOTIONS[emotion] ?? {}).map(([n, v]) => [n, v * k]));
  }

  setMix(mix: Partial<Record<Exclude<Emotion, 'neutral'>, number>>): void {
    const target: Offsets = {};
    for (const [name, k] of Object.entries(mix)) {
      if (!k) continue;
      for (const [ch, v] of Object.entries(EMOTIONS[name as Emotion] ?? {})) target[ch] = (target[ch] ?? 0) + v * clamp01(k);
    }
    this.target = target;
  }

  /** Adds the eased offsets onto `w`. */
  apply(w: Record<string, number>, dt: number): void {
    const k = 1 - Math.exp(-8 * dt);
    const cur = this.current;
    const names = new Set([...Object.keys(cur), ...Object.keys(this.target)]);
    for (const n of names) {
      const target = this.target[n] ?? 0;
      cur[n] = (cur[n] ?? 0) + (target - (cur[n] ?? 0)) * k;
      if (Math.abs(cur[n]) < 0.001 && target === 0) { delete cur[n]; continue; }
      w[n] = clamp01((w[n] ?? 0) + cur[n]);
    }
  }
}
