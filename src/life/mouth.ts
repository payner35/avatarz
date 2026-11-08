/**
 * Mouth: turns a VisemeFrame into ARKit mouth channels. Two inputs, one output shape:
 *  - neural frames (52 raw ARKit values): per-channel calibration for this rig, then smoothing;
 *  - viseme frames (15 Oculus weights): a hand mapping to jaw, lips and teeth.
 * Then a swallow now and then while quiet, and a rate limiter as a safety net.
 */
import { ARKIT, VISEME_INDEX as V, clamp01, type VisemeFrame } from '../types.js';

export interface MouthOptions {
  /** Jaw ceiling for the viseme path. Splat lips smear past ~0.45. Default 0.42. */
  jawMax?: number;
  /** Steepness of the viseme path's jaw curve. Default 3.5. */
  jawGain?: number;
}

// Calibration of the raw Wav2ARKit channels for this rig, measured on 24 kHz TTS speech:
// jawOpen peaks ~0.15 (mean 0.06); mouthLowerDown rides at ~0.27 the whole time, which is what
// smears the lower lip; funnel is near zero. Value below `floor` is closed; `floor + range` is a
// full vowel and maps to `ceil`. Unlisted channels pass through.
const CAL: Record<string, { floor: number; range: number; ceil: number }> = {
  jawOpen:            { floor: 0.03, range: 0.10, ceil: 0.50 },
  mouthLowerDownLeft: { floor: 0.22, range: 0.30, ceil: 0.15 },
  mouthLowerDownRight:{ floor: 0.22, range: 0.30, ceil: 0.15 },
  mouthUpperUpLeft:   { floor: 0.10, range: 0.18, ceil: 0.20 },
  mouthUpperUpRight:  { floor: 0.10, range: 0.18, ceil: 0.20 },
  mouthPucker:        { floor: 0.03, range: 0.10, ceil: 0.40 },
  mouthFunnel:        { floor: 0.00, range: 0.02, ceil: 0.30 },
  mouthStretchLeft:   { floor: 0.03, range: 0.09, ceil: 0.35 },
  mouthStretchRight:  { floor: 0.03, range: 0.09, ceil: 0.35 },
  mouthSmileLeft:     { floor: 0.00, range: 0.30, ceil: 0.45 },
  mouthSmileRight:    { floor: 0.00, range: 0.30, ceil: 0.45 },
  mouthDimpleLeft:    { floor: 0.02, range: 0.10, ceil: 0.25 },
  mouthDimpleRight:   { floor: 0.02, range: 0.10, ceil: 0.25 },
  mouthClose:         { floor: 0.02, range: 0.07, ceil: 0.30 },
  mouthPressLeft:     { floor: 0.02, range: 0.07, ceil: 0.30 },
  mouthPressRight:    { floor: 0.02, range: 0.07, ceil: 0.30 },
  mouthRollLower:     { floor: 0.02, range: 0.10, ceil: 0.30 },
  mouthRollUpper:     { floor: 0.02, range: 0.10, ceil: 0.30 },
  mouthShrugLower:    { floor: 0.05, range: 0.20, ceil: 0.15 },
  mouthShrugUpper:    { floor: 0.05, range: 0.20, ceil: 0.15 },
};
const EYE_CHANNELS = ARKIT.filter((n) => n.startsWith('eye'));
const UPPER_FACE = ['browInnerUp', 'browOuterUpLeft', 'browOuterUpRight', 'browDownLeft', 'browDownRight', 'cheekSquintLeft', 'cheekSquintRight', 'noseSneerLeft', 'noseSneerRight'];
const LIMITED = ARKIT.filter((n) => n.startsWith('mouth') || n.startsWith('jaw') || n === 'tongueOut');

export class Mouth {
  /** Multiplier on the mouth's range. 1 = calibrated default. */
  scale = 1;
  /** The neural model's brow and cheek output from the latest frame, for the eyes to blend in. */
  readonly modelFace: Record<string, number> = {};
  /** How many channel-frames the safety limiter had to clamp. The scorer watches this. */
  limiterHits = 0;
  private smoothed = new Float32Array(ARKIT.length);
  private jaw = 0;
  private swallowAt = 12;
  private swallowPhase = -1;
  private readonly jawMax: number;
  private readonly jawGain: number;

  constructor(opts: MouthOptions = {}) {
    this.jawMax = opts.jawMax ?? 0.42;
    this.jawGain = opts.jawGain ?? 3.5;
  }

  /** Writes mouth channels into `w`. `quiet` = speech envelope below 0.3, for the swallow. */
  apply(w: Record<string, number>, v: VisemeFrame, dt: number, t: number, quiet: boolean, thinking: boolean): void {
    if (v.arkit) this.fromNeural(w, v.arkit, dt);
    else this.fromVisemes(w, v, dt);
    this.swallow(w, dt, t, quiet);
    if (thinking) { w.mouthPressLeft = Math.max(w.mouthPressLeft, 0.12); w.mouthPressRight = Math.max(w.mouthPressRight, 0.12); w.mouthPucker = Math.max(w.mouthPucker, 0.08); }
  }

  /**
   * Applied last: every mouth channel follows its target on a critically damped spring, so each move
   * has a soft start and a soft stop (a slew limiter moved at full speed then stopped dead, which the
   * eye reads as a snap). omega 40 rad/s settles a step in ~120 ms (28 was tried: no gain on the 20 s pixel grade, less lip definition). A hard cap of
   * 0.12 per frame remains as the safety net and is what `limiterHits` counts.
   */
  limit(w: Record<string, number>, dt: number): void {
    const omega = 40, cap = 0.12;
    for (const n of LIMITED) {
      const target = w[n] ?? 0;
      const st = this.spring[n] ?? (this.spring[n] = { x: target, v: 0 });
      const a = omega * omega * (target - st.x) - 2 * omega * st.v;
      st.v += a * dt;
      let step = st.v * dt;
      if (Math.abs(step) > cap) { step = Math.sign(step) * cap; st.v = step / dt; this.limiterHits++; }
      st.x += step;
      w[n] = st.x;
    }
  }
  private spring: Record<string, { x: number; v: number }> = {};

  private fromNeural(w: Record<string, number>, a: Float32Array, dt: number): void {
    // Calibrate each channel, then a symmetric one-pole smooth at lip bandwidth (~45 ms), so the
    // limiter below is a safety net rather than the thing doing the smoothing.
    const k = 1 - Math.exp(-22 * dt);
    for (let i = 0; i < ARKIT.length; i++) {
      const n = ARKIT[i], cal = CAL[n];
      let x = a[i];
      if (cal) x = Math.min(0.6, cal.ceil * this.scale) * clamp01((x - cal.floor) / cal.range);
      this.smoothed[i] += (x - this.smoothed[i]) * k;
      w[n] = this.smoothed[i];
    }
    for (const n of EYE_CHANNELS) w[n] = 0;
    for (const n of UPPER_FACE) this.modelFace[n] = w[n];
    w.mouthSmileLeft = Math.max(w.mouthSmileLeft, 0.15); w.mouthSmileRight = Math.max(w.mouthSmileRight, 0.15);
  }

  /** The viseme path's intermediate shapes, smoothed at lip bandwidth like the neural channels. */
  private vis = { aa: 0, E: 0, I: 0, O: 0, U: 0, cons: 0, shut: 0, teeth: 0, PP: 0, FF: 0, RR: 0, CH: 0, SS: 0, consTotal: 0 };

  private fromVisemes(w: Record<string, number>, v: VisemeFrame, dt: number): void {
    const s = v.visemes, k = this.scale, sm = this.vis, f = 1 - Math.exp(-22 * dt);
    const ease = (key: keyof typeof sm, target: number) => { sm[key] += (target - sm[key]) * f; return sm[key]; };
    // Soft visemes change every 16 ms hop; ease each shape so the lips move at a human rate.
    const aa = ease('aa', s[V.aa]), E = ease('E', s[V.E]), I = ease('I', s[V.I]), O = ease('O', s[V.O]), U = ease('U', s[V.U]);
    const cons = ease('cons', Math.max(s[V.TH], s[V.DD], s[V.kk], s[V.CH], s[V.SS], s[V.nn], s[V.RR]));
    const shut = ease('shut', Math.max(s[V.PP], s[V.FF]));
    const teeth = ease('teeth', Math.max(s[V.SS], s[V.FF], s[V.TH], s[V.DD], s[V.nn], s[V.CH]));
    const PP = ease('PP', s[V.PP]), FF = ease('FF', s[V.FF]), RR = ease('RR', s[V.RR]), CH = ease('CH', s[V.CH]), SS = ease('SS', s[V.SS]);
    // Soft viseme weights sum to about 1, so combine additively; a saturating curve keeps quiet speech alive.
    const consTotal = ease('consTotal', s[V.TH] + s[V.DD] + s[V.kk] + s[V.CH] + s[V.SS] + s[V.nn] + s[V.RR] + s[V.PP] + s[V.FF]);
    const open = clamp01((aa + 0.7 * O + 0.5 * E + 0.35 * I + 0.25 * U + 0.12 * cons) * (1 - shut) * (1 - 0.6 * clamp01(consTotal)));
    const jawTarget = Math.min(0.6, this.jawMax * k) * (1 - Math.exp(-this.jawGain * open)) * (0.5 + 0.5 * v.energy);
    this.jaw += (jawTarget - this.jaw) * f;
    w.jawOpen = this.jaw + 0.02;
    const round = clamp01(1.1 * U + 0.9 * O + 0.5 * RR + 0.4 * CH);
    w.mouthFunnel = 0.6 * round * k;
    w.mouthPucker = (0.7 * U + 0.3 * O) * k;
    const wide = clamp01(1.0 * I + 0.8 * E + 0.5 * SS);
    w.mouthStretchLeft = w.mouthStretchRight = (0.45 * wide + 0.25 * open) * k;
    w.mouthSmileLeft = w.mouthSmileRight = 0.2 + 0.25 * wide * (1 - round);
    w.mouthDimpleLeft = w.mouthDimpleRight = 0.2 * wide;
    w.mouthUpperUpLeft = w.mouthUpperUpRight = 0.3 * teeth + 0.15 * E;
    w.mouthLowerDownLeft = w.mouthLowerDownRight = 0.15 * teeth + 0.1 * aa;
    w.mouthPressLeft = w.mouthPressRight = 0.6 * shut;
    w.mouthClose = 0.4 * PP;
    w.mouthRollLower = 0.3 * FF;
    w.mouthRollUpper = 0.15 * FF;
  }

  /** A swallow every 15–30 s while quiet: lips press, jaw tucks, then release. */
  private swallow(w: Record<string, number>, dt: number, t: number, quiet: boolean): void {
    if (this.swallowPhase < 0 && t >= this.swallowAt && quiet) this.swallowPhase = 0;
    if (this.swallowPhase < 0) return;
    this.swallowPhase += dt;
    const p = this.swallowPhase, env = p < 0.25 ? p / 0.25 : p < 0.7 ? 1 - (p - 0.25) / 0.45 : 0;
    w.mouthPressLeft = Math.max(w.mouthPressLeft ?? 0, 0.25 * env); w.mouthPressRight = Math.max(w.mouthPressRight ?? 0, 0.25 * env);
    w.mouthRollLower = Math.max(w.mouthRollLower ?? 0, 0.15 * env); w.jawForward = 0.08 * env;
    if (p >= 0.7) { this.swallowPhase = -1; this.swallowAt = t + 15 + Math.random() * 15; }
  }
}
