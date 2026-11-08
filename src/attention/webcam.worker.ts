/**
 * Face detection off the main thread. Receives ImageBitmaps, runs MediaPipe Face Landmarker, and
 * posts back a reduced reading: position, size, facing, and a few of the viewer's blendshapes.
 */
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface Reading { x: number; y: number; near: number; facing: number; smile: number; browUp: number; mouthOpen: number }
type In = { type: 'init'; wasmUrl: string; modelUrl: string; gpu: boolean } | { type: 'frame'; bitmap: ImageBitmap; t: number };
type Out = { type: 'ready' } | { type: 'error'; message: string } | { type: 'reading'; t: number; ms: number; r: Reading | null };

let lm: FaceLandmarker | null = null;
const post = (m: Out) => (self as unknown as Worker).postMessage(m);

self.onmessage = async (e: MessageEvent<In>) => {
  const msg = e.data;
  if (msg.type === 'init') {
    try {
      // A module worker cannot importScripts, so load the ESM build of the WASM loader.
      const fileset = await FilesetResolver.forVisionTasks(msg.wasmUrl, true);
      const make = (delegate: 'GPU' | 'CPU') => FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: msg.modelUrl, delegate },
        runningMode: 'VIDEO', numFaces: 1, outputFaceBlendshapes: true, outputFacialTransformationMatrixes: true,
      });
      try { lm = await make(msg.gpu ? 'GPU' : 'CPU'); } catch { lm = await make('CPU'); }
      post({ type: 'ready' });
    } catch (err) { post({ type: 'error', message: (err as Error).message }); }
    return;
  }
  if (msg.type === 'frame') {
    const t0 = performance.now();
    let r: Reading | null = null;
    try {
      if (lm) {
        const res = lm.detectForVideo(msg.bitmap, msg.t);
        const face = res.faceLandmarks?.[0];
        if (face && face.length >= 468) {
          const nose = face[1];
          const dx = face[263].x - face[33].x, dy = face[263].y - face[33].y;
          let facing = 1;
          const m = res.facialTransformationMatrixes?.[0]?.data;
          if (m) {
            const yaw = Math.atan2(m[8], m[10]), pitch = Math.asin(Math.max(-1, Math.min(1, -m[9])));
            facing = Math.max(0, 1 - Math.abs(yaw) / 0.6) * Math.max(0, 1 - Math.abs(pitch) / 0.5);
          }
          const bs = res.faceBlendshapes?.[0]?.categories ?? [];
          const get = (n: string) => bs.find((c) => c.categoryName === n)?.score ?? 0;
          r = {
            x: nose.x, y: nose.y, near: Math.hypot(dx, dy), facing,
            smile: Math.max(get('mouthSmileLeft'), get('mouthSmileRight')),
            browUp: Math.max(get('browInnerUp'), get('browOuterUpLeft'), get('browOuterUpRight')),
            mouthOpen: get('jawOpen'),
          };
        }
      }
    } finally { msg.bitmap.close(); }
    post({ type: 'reading', t: msg.t, ms: performance.now() - t0, r });
  }
};
