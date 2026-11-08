/**
 * Cheap loudness meter on an AnalyserNode. Shared by both extractors for the
 * `energy` field and used by the orchestrator to time speech onsets.
 */
export class EnergyMeter {
  private analyser: AnalyserNode | null = null;
  private buf: Float32Array<ArrayBuffer> = new Float32Array(0);
  private source: AudioNode | null = null;
  /** performance.now() of the most recent silence-to-sound transition. */
  onsetAt = 0;
  /** Monotonic counter, bumps on each onset. */
  onsetId = 0;
  private lastLoudAt = 0;
  private quiet = true;

  constructor(
    private readonly threshold = 0.02,
    private readonly silenceMs = 250,
    private readonly fftSize = 512,
  ) {}

  start(node: AudioNode, context: AudioContext): void {
    this.stop();
    this.analyser = new AnalyserNode(context, { fftSize: this.fftSize, smoothingTimeConstant: 0 });
    this.buf = new Float32Array(this.fftSize) as Float32Array<ArrayBuffer>;
    node.connect(this.analyser);
    this.source = node;
  }

  stop(): void {
    if (this.source && this.analyser) {
      try {
        this.source.disconnect(this.analyser);
      } catch {
        /* ignore */
      }
    }
    this.analyser = null;
    this.source = null;
  }

  reset(): void {
    this.quiet = true;
    this.lastLoudAt = 0;
  }

  /** RMS in [0, 1] (0.3 is loud speech). Also tracks onsets. */
  read(now: number): number {
    const a = this.analyser;
    if (!a) return 0;
    a.getFloatTimeDomainData(this.buf);
    let sum = 0;
    const b = this.buf;
    for (let i = 0; i < b.length; i++) sum += b[i] * b[i];
    const rms = Math.sqrt(sum / b.length);
    if (rms > this.threshold) {
      if (this.quiet) {
        this.quiet = false;
        this.onsetAt = now;
        this.onsetId++;
      }
      this.lastLoudAt = now;
    } else if (!this.quiet && now - this.lastLoudAt > this.silenceMs) {
      this.quiet = true;
    }
    return rms;
  }
}
