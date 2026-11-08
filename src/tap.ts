/**
 * The tap. Given an AudioContext and the node that carries the speech, it
 * exposes that node for extractors to connect to as a side branch and,
 * optionally, inserts a DelayNode on the audible branch so the mouth and the
 * sound land together.
 *
 * Extractors connect straight to `tap.source`; they are pure side branches
 * (no outputs, or an AnalyserNode) and pass nothing back.
 */

export interface TapOptions {
  context: AudioContext;
  /** The node carrying speech. In the voice stack this is the playback GainNode. */
  source: AudioNode;
  /**
   * Seconds of delay to insert on the audible branch to cover the detector lag.
   * Default 0.1. Set 0 to leave the host's graph untouched.
   */
  audibleDelay?: number;
  /**
   * Where the audible branch goes. Default `context.destination`. Pass `null`
   * when the source must not be heard (a microphone), which also disables the
   * delay rewiring.
   */
  destination?: AudioNode | null;
}

export interface Tap {
  readonly context: AudioContext;
  readonly source: AudioNode;
  /** Present when the audible branch was rewired through a delay. */
  readonly delayNode: DelayNode | null;
  /** Current audible delay in seconds. */
  getDelay(): number;
  setDelay(seconds: number): void;
  /** Device output latency in seconds, if the browser reports it. */
  outputLatency(): number;
  /** Audio-clock to performance.now() mapping for frame scheduling. */
  outputTimestamp(): AudioTimestamp;
  /** Undo the rewiring. Does not touch extractors. */
  dispose(): void;
}

const MAX_DELAY = 1.0;

export function createTap(opts: TapOptions): Tap {
  const { context, source } = opts;
  const audibleDelay = opts.audibleDelay ?? 0.1;
  const destination = opts.destination === undefined ? context.destination : opts.destination;

  let delayNode: DelayNode | null = null;
  let rewired = false;

  if (destination && audibleDelay > 0) {
    // Move source -> destination to source -> delay -> destination.
    try {
      source.disconnect(destination);
    } catch {
      /* not connected directly; we still add the delayed path */
    }
    delayNode = new DelayNode(context, { maxDelayTime: MAX_DELAY, delayTime: Math.min(audibleDelay, MAX_DELAY) });
    source.connect(delayNode).connect(destination);
    rewired = true;
  }

  return {
    context,
    source,
    delayNode,
    getDelay: () => delayNode?.delayTime.value ?? 0,
    setDelay(seconds: number) {
      if (!delayNode) return;
      const s = Math.max(0, Math.min(MAX_DELAY, seconds));
      delayNode.delayTime.setTargetAtTime(s, context.currentTime, 0.02);
    },
    outputLatency: () => context.outputLatency ?? 0,
    outputTimestamp: () => context.getOutputTimestamp(),
    dispose() {
      if (rewired && delayNode && destination) {
        try {
          source.disconnect(delayNode);
          delayNode.disconnect();
        } catch {
          /* already gone */
        }
        try {
          source.connect(destination);
        } catch {
          /* context closed */
        }
      }
      delayNode = null;
      rewired = false;
    },
  };
}
