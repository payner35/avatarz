/**
 * Motion recorder. Samples, every animation frame, everything the face is told to do (the values
 * sent to the rig, the head pose, the extractor's frame, the emotion read, the viewer) and records
 * the stage canvas as video at the same time. The scorer in tools/score.mjs reads the result.
 */
export interface RecordingSample {
  t: number;      // ms since recording start
  dt: number;     // ms since previous sample
  [channel: string]: number;
}

export interface Recording {
  startedAt: string;
  label: string;
  fps: number;
  channels: string[];
  samples: RecordingSample[];
  notes: Record<string, unknown>;
}

export interface Snapshotable {
  /** Flat numbers describing what was applied this frame: blendshape weights, bone angles, inputs. */
  snapshot?(): Record<string, number>;
}

export class Recorder {
  private samples: RecordingSample[] = [];
  private channels = new Set<string>();
  private t0 = 0;
  private last = 0;
  private media: MediaRecorder | null = null;
  private track: (MediaStreamTrack & { requestFrame?: () => void }) | null = null;
  private frameParity = 0;
  private chunks: Blob[] = [];
  recording = false;
  /** Times (ms since start) the person pressed the mark key because they saw a jump. */
  marks: number[] = [];

  /** Mark "I saw a jump now". */
  mark(): void { if (this.recording) this.marks.push(performance.now() - this.t0); }

  /** Audio as heard (after the tap's delay line), added to the video so a recording is in sync by construction. */
  audioTrack: MediaStreamTrack | null = null;

  constructor(private readonly source: () => Record<string, number>, private readonly canvas?: () => HTMLCanvasElement | null) {}

  start(video = true): void {
    this.samples = []; this.channels.clear(); this.chunks = []; this.marks = [];
    this.t0 = performance.now(); this.last = this.t0; this.recording = true;
    const c = video ? this.canvas?.() : null;
    if (c && 'captureStream' in c && typeof MediaRecorder !== 'undefined') {
      try {
        // Manual frame capture: one video frame per animation frame we sample, so the video's timing is
        // the page's timing. (captureStream(30) emits on its own schedule and drops frames under load,
        // which made the pixel grader see jumps that were only the recording's.)
        const stream = (c as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(0);
        this.track = stream.getVideoTracks()[0] as MediaStreamTrack & { requestFrame?: () => void };
        if (this.audioTrack) stream.addTrack(this.audioTrack);
        this.media = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 8_000_000 });
        this.media.ondataavailable = (e) => { if (e.data.size) this.chunks.push(e.data); };
        this.media.start(250);
      } catch { this.media = null; }
    }
  }

  /** Call once per animation frame while recording. */
  sample(): void {
    if (!this.recording) return;
    const now = performance.now();
    const s: RecordingSample = { t: now - this.t0, dt: now - this.last };
    this.last = now;
    const v = this.source();
    for (const k in v) { const x = v[k]; if (typeof x === 'number' && Number.isFinite(x)) { s[k] = x; this.channels.add(k); } }
    this.samples.push(s);
    // Every second animation frame goes to the video (30 fps at a 60 Hz display), on our clock.
    if (this.track?.requestFrame && (this.frameParity++ & 1) === 0) { s.videoFrame = 1; this.track.requestFrame(); }
  }

  async stop(label = 'run', notes: Record<string, unknown> = {}): Promise<{ recording: Recording; video: Blob | null }> {
    this.recording = false;
    let video: Blob | null = null;
    if (this.media) {
      const m = this.media;
      video = await new Promise<Blob>((resolve) => { m.onstop = () => resolve(new Blob(this.chunks, { type: 'video/webm' })); m.stop(); });
      this.media = null;
    }
    this.track = null;
    const dur = this.samples.length ? this.samples[this.samples.length - 1].t / 1000 : 0;
    const recording: Recording = {
      startedAt: new Date(Date.now() - (performance.now() - this.t0)).toISOString(),
      label, fps: dur ? this.samples.length / dur : 0,
      channels: [...this.channels].sort(), samples: this.samples, notes: { ...notes, marks: this.marks },
    };
    return { recording, video };
  }
}

/** Posts a recording (and its video) to the dev server's lab endpoint, which writes lab/recordings/<name>.*. */
export async function saveToLab(name: string, recording: Recording, video: Blob | null): Promise<string> {
  const json = new Blob([JSON.stringify(recording)], { type: 'application/json' });
  const r1 = await fetch(`/__lab/save?name=${encodeURIComponent(name)}.json`, { method: 'POST', body: json });
  if (!r1.ok) throw new Error('lab save failed: ' + r1.status);
  if (video) await fetch(`/__lab/save?name=${encodeURIComponent(name)}.webm`, { method: 'POST', body: video });
  return name;
}

/** Records a MediaStream (e.g. the webcam) for `ms` and returns the video, for a real-face reference. */
export async function recordStream(stream: MediaStream, ms: number): Promise<Blob> {
  const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 6_000_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise<Blob>((resolve) => { rec.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' })); });
  rec.start(250);
  await new Promise((r) => setTimeout(r, ms));
  rec.stop();
  return done;
}

/**
 * Records what the browser actually presents (the tab via getDisplayMedia) for `ms`, plus the stage's
 * position in the viewport so the grader can crop to it. The person must accept the share dialog.
 */
export async function recordScreen(stage: HTMLElement, ms: number): Promise<{ video: Blob; crop: { x: number; y: number; w: number; h: number } }> {
  const md = navigator.mediaDevices as MediaDevices & { getDisplayMedia(c: unknown): Promise<MediaStream> };
  const stream = await md.getDisplayMedia({ video: { frameRate: 60 }, audio: false, preferCurrentTab: true, selfBrowserSurface: 'include', surfaceSwitching: 'exclude' });
  try {
    const r = stage.getBoundingClientRect();
    const crop = { x: r.left / window.innerWidth, y: r.top / window.innerHeight, w: r.width / window.innerWidth, h: r.height / window.innerHeight };
    const video = await recordStream(stream, ms);
    return { video, crop };
  } finally { stream.getTracks().forEach((t) => t.stop()); }
}
