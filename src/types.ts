/**
 * Shared contract between the tap, the extractors and the renderers.
 * Every extractor fills a VisemeFrame; every renderer consumes one.
 */

/** Oculus viseme order. Index into VisemeFrame.visemes. */
export const VISEMES = [
  'sil', 'PP', 'FF', 'TH', 'DD', 'kk', 'CH', 'SS', 'nn', 'RR', 'aa', 'E', 'I', 'O', 'U',
] as const;

export type VisemeName = (typeof VISEMES)[number];

export const VISEME_INDEX: Readonly<Record<VisemeName, number>> = Object.freeze(
  Object.fromEntries(VISEMES.map((n, i) => [n, i])) as Record<VisemeName, number>,
);

export const N_VISEMES = VISEMES.length;

export interface VisemeFrame {
  /** 15 Oculus viseme weights in [0, 1], in VISEMES order. */
  visemes: Float32Array;
  /** Jaw opening in [0, 1], derived from the vowel visemes and energy. */
  jawOpen: number;
  /** Short-term loudness in [0, 1] at the tap. */
  energy: number;
  /** True while the extractor believes speech is present. */
  speaking: boolean;
  /** performance.now() when this frame was read. */
  t: number;
  /** Optional: raw 52 ARKit blendshape weights in ARKIT order, when the extractor produces them. */
  arkit?: Float32Array;
}

/** The 52 ARKit blendshape names, in model output order. */
export const ARKIT = [
  'browDownLeft', 'browDownRight', 'browInnerUp', 'browOuterUpLeft', 'browOuterUpRight',
  'cheekPuff', 'cheekSquintLeft', 'cheekSquintRight', 'eyeBlinkLeft', 'eyeBlinkRight',
  'eyeLookDownLeft', 'eyeLookDownRight', 'eyeLookInLeft', 'eyeLookInRight',
  'eyeLookOutLeft', 'eyeLookOutRight', 'eyeLookUpLeft', 'eyeLookUpRight',
  'eyeSquintLeft', 'eyeSquintRight', 'eyeWideLeft', 'eyeWideRight',
  'jawForward', 'jawLeft', 'jawOpen', 'jawRight',
  'mouthClose', 'mouthDimpleLeft', 'mouthDimpleRight', 'mouthFrownLeft', 'mouthFrownRight',
  'mouthFunnel', 'mouthLeft', 'mouthLowerDownLeft', 'mouthLowerDownRight',
  'mouthPressLeft', 'mouthPressRight', 'mouthPucker', 'mouthRight',
  'mouthRollLower', 'mouthRollUpper', 'mouthShrugLower', 'mouthShrugUpper',
  'mouthSmileLeft', 'mouthSmileRight', 'mouthStretchLeft', 'mouthStretchRight',
  'mouthUpperUpLeft', 'mouthUpperUpRight', 'noseSneerLeft', 'noseSneerRight', 'tongueOut',
] as const;
export type ArkitName = (typeof ARKIT)[number];
export const ARKIT_INDEX: Readonly<Record<ArkitName, number>> = Object.freeze(
  Object.fromEntries(ARKIT.map((n, i) => [n, i])) as Record<ArkitName, number>,
);

export function createFrame(): VisemeFrame {
  const visemes = new Float32Array(N_VISEMES);
  visemes[0] = 1; // sil
  return { visemes, jawOpen: 0, energy: 0, speaking: false, t: 0 };
}

export interface Extractor {
  readonly name: string;
  /** Nominal detector lag in ms (window centring + hop + gating). */
  readonly latencyMs: number;
  /** Connect to the audio node as a side branch and begin producing frames. */
  start(node: AudioNode, context: AudioContext): Promise<void>;
  /** Disconnect and stop. Safe to call twice. */
  stop(): void;
  /** Drop all state so the next read() is silence. Used for barge-in. */
  reset(): void;
  /** Latest smoothed weights. Called once per animation frame; must not allocate or await. */
  read(): VisemeFrame;
  /**
   * Optional: extractors that stamp frames with audio time use this to show the frame being heard.
   * Called each frame with the tap's audible delay and the device output latency, in seconds.
   */
  sync?(audibleDelay: number, outputLatency: number): void;
}

export type HeadState = 'idle' | 'active' | 'listening' | 'speaking' | 'thinking';

/** Emotions a host can blend onto the face, typically emitted by the conversation per reply. */
export type Emotion = 'neutral' | 'warm' | 'amused' | 'concerned' | 'surprised' | 'thoughtful';

export interface AvatarMeta {
  name?: string;
  authors?: string[];
  licenseUrl?: string;
  commercialUsage?: string;
  version?: string;
  /** Expression names the model actually carries. The mouth needs aa, ih, ou, ee, oh; blink is wanted. */
  expressions?: string[];
}

export interface Renderer {
  readonly name: string;
  mount(canvas: HTMLCanvasElement): void;
  setAvatar(url: string): Promise<void>;
  /** Apply one frame of weights. dt in seconds. */
  frame(v: VisemeFrame, dt: number): void;
  setState(state: HeadState): void;
  /** Optional: blend an emotion onto the face at 0..1 intensity; eases in over ~0.3 s. */
  setEmotion?(emotion: Emotion, intensity?: number): void;
  /** Optional: set several emotions at once, each 0..1, as the prosody meter does continuously. */
  setEmotionMix?(mix: Partial<Record<Exclude<Emotion, 'neutral'>, number>>): void;
  /** Optional: where the viewer is and what they are doing, from the webcam. null when unknown. */
  setAttention?(a: { present: boolean; x: number; y: number; near: number; facing: number; smile: number; browUp: number; talking: boolean; absentFor: number } | null): void;
  getAvatarMeta?(): AvatarMeta | null;
  /** Optional: main-thread cost of the last frame() excluding the GPU draw, ms. */
  readonly updateMs?: number;
  dispose(): void;
}

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export function smoothstep(lo: number, hi: number, x: number): number {
  const t = clamp01((x - lo) / (hi - lo));
  return t * t * (3 - 2 * t);
}

/** Exponential approach with separate open/close rates (per second). */
export function approach(current: number, target: number, dt: number, openRate: number, closeRate: number): number {
  const rate = target > current ? openRate : closeRate;
  const k = 1 - Math.exp(-rate * dt);
  return current + (target - current) * k;
}
