/** Typing for the vendored HeadAudio main module (MIT, met4citizen/HeadAudio). */
declare module '*/headaudio.min.mjs' {
  export class HeadAudio extends AudioWorkletNode {
    constructor(context: BaseAudioContext, options?: { processorOptions?: Record<string, unknown>; parameterData?: Record<string, number> } | null);
    /** HeadAudio's own viseme order (differs from Oculus order). */
    visemeNames: string[];
    /** Index into visemeNames of the active viseme, -1 for silence. */
    visemeActive: number;
    onstarted: ((d: { t: number }) => void) | null;
    onended: ((d: { t: number }) => void) | null;
    onviseme: ((d: { viseme: number; t: number; d: number; distances?: ArrayLike<number>; vector?: ArrayLike<number> }) => void) | null;
    loadModel(url: string | URL, reset?: boolean): Promise<void>;
    /** Model loader; records carry the viseme id of each Gaussian prototype. */
    training: { loadModel(url: string | URL, group?: number | null): Promise<{ model: { viseme: number; group: number; phoneme: string }[]; buffer: ArrayBuffer }> };
    start(): void;
    stop(): void;
    calibrate(): void;
    resetAll(): void;
    resetTimer(): void;
  }
}
