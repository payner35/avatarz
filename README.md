# avatarz

A talking head that runs entirely in the browser and lip-syncs in real time to any speech audio already playing through the Web Audio API.

![avatarz demo: a photoreal head lip-syncing to speech in the browser](docs/demo.gif)

[Watch with sound (mp4, 16 s)](docs/demo.mp4). Recorded straight from the test page: the audio track is the sound as the page plays it, through the same delay line the face is synced to, so what you hear is what the face was shown. It listens to the sound, not to the voice vendor, so it sits in front of any text-to-speech or realtime voice model with no per-vendor integration.

- **Private by construction.** Nothing leaves the page at runtime: no avatar cloud, no hosted inference, no CDN. Every model, runtime and head is served from your own origin.
- **Vendor-agnostic.** The only contract with the voice source is an `AudioNode`. No word timestamps, no visemes, no transcript are assumed.
- **Browser-only compute.** Lip-sync inference in a WASM worker, rendering in WebGL.
- **Framework-free.** Plain TypeScript and the DOM. React, Vue or anything else wrap it in a few lines.

## What it does

```ts
import { createTalkingHead } from 'avatarz';

const head = await createTalkingHead({
  context,                 // the AudioContext your player uses
  source: playbackGain,    // the node that carries the speech
  canvas,                  // where the face goes
  avatarUrl: '/avatars/Jane.zip',
});

head.setState('speaking'); // idle | active | listening | speaking | thinking
head.cut();                // barge-in: the mouth closes within 100 ms
head.dispose();
```

Under the hood, four parts behind small interfaces:

| Part | What it does | Options |
|---|---|---|
| **Tap** | Connects extractors as a side branch of your audio node and inserts a delay on the audible branch so mouth and sound land together | |
| **Extractor** | Turns audio into face weights | `wav2arkit` (default): a neural model, 52 ARKit channels at 30 fps, int8, in a WASM worker · `headaudio`: a 14 kB classifier with soft-blended visemes · `formant`: loudness and formants, the floor |
| **Life** | Everything a face does besides the words: blink, gaze, brows, head motion on damped springs, breathing, swallowing, and emotion read from the voice's own prosody | `src/life/` |
| **Renderer** | Writes the numbers to a rig | `splat` (default): photoreal Gaussian-splat heads · `glb`: any mesh with ARKit morph targets · `vrm`: stylised VRM on three-vrm · `sprite`: procedural 2D |

Lip sync is timestamped: every audio chunk carries its audio-clock time, every output frame is stamped with the moment it describes, and the renderer shows the frame matching what the ear is hearing. The audible delay sets itself from measured inference time. A built-in sync test measures the mouth against the sound in milliseconds.

## Try it

```bash
npm install
npm run assets     # runtimes from npm, sample heads, and the lip-sync model (quantized to int8, 101 MB)
npm run dev        # http://localhost:5178
```

The test page has three audio sources (a file, your microphone, and a PCM stream that schedules chunks exactly like a realtime voice player), pickers for extractor, head and renderer, a state and emotion selector, a `Life` switch to bisect motion by eye, and the metrics: fps, main-thread cost, inference cadence, sync error, and what the prosody meter reads from the voice.

## The motion lab

Animation quality is graded, not eyeballed. `lab/README.md` describes the workflow:

1. **Record** 20 seconds from the page: every value sent to the rig, every frame, plus the rendered canvas as video, captured on the page's own clock.
2. **Grade the pixels** with `tools/score_video.py`: frame-to-frame motion per region, scored as *burstiness* (the biggest moves over the typical move), a scale-free measure that compares fairly against a recording of a real face made with the webcam through the same grader.
3. **Grade the numbers** with `tools/score.mjs`: timing, blink profile, mouth closure, head ranges, a check for head motion locked to syllables, and a diff against the previous run.
4. **Mark what you see**: press `J` while recording whenever the face jumps, and `tools/attribute.mjs` ranks which channels moved in the 400 ms before each press.

Findings that came out of it so far are logged in the lab notes: GPU frame drops at device pixel ratio 2, a slew limiter that read as snapping, a per-syllable head nod, and a lip lag introduced by smoothing stages added after calibration.

## Build

```bash
npm run build      # dist/avatarz.js + types + the runtime assets a host must serve
```

`three`, `@pixiv/three-vrm`, `@myned-ai/gsplat-flame-avatar-renderer`, `onnxruntime-web` and `@mediapipe/tasks-vision` are peer dependencies, the last three optional. Serve `dist/` from your origin; the model, worklet and WASM files are resolved relative to it, or point `assets`, `modelBaseUrl` and `ortWasmUrl` elsewhere.

## Licences and attributions

Code: MIT.

| Piece | Source | Licence |
|---|---|---|
| Lip-sync model | [myned-ai/wav2arkit_cpu](https://huggingface.co/myned-ai/wav2arkit_cpu): wav2vec2-base + LAM Audio2Expression, quantized here by `tools/quantize.py` | Apache-2.0 |
| Splat renderer | [@myned-ai/gsplat-flame-avatar-renderer](https://www.npmjs.com/package/@myned-ai/gsplat-flame-avatar-renderer) | MIT |
| Viseme classifier | [HeadAudio](https://github.com/met4citizen/HeadAudio), vendored in `assets/headaudio` | MIT |
| Face landmarker | [MediaPipe](https://developers.google.com/mediapipe) | Apache-2.0 |
| ONNX runtime | [onnxruntime-web](https://onnxruntime.ai) | MIT |
| Sample splat heads | [gsplat-talkinghead](https://github.com/NavodPeiris/gsplat-talkinghead) | repo MIT; the bundles' own licence is not stated upstream, so they are development samples only and are fetched, not shipped |
| Sample VRM | [Seed-san](https://github.com/vrm-c/vrm-specification/tree/master/samples/Seed-san), VirtualCast | VRM Public License 1.0, fetched |

Details and provenance notes are in `LICENSES/`. Ship a head you own or have cleared before production.

## Status and limits

- Measured on an M-series Mac in Chrome. Safari, Firefox and phones are untested.
- The neural extractor needs about 500 ms of audible delay to stay ahead of the sound; the classifier fallback needs 100 ms.
- The preset heads are low-resolution captures; the ceiling on realism is the head file, not the code.
- Webcam-driven eye contact exists in `src/attention` but is parked.
