# Motion lab

How changes to the face are judged before anyone looks at them.

1. **Record.** On the test page, press *Record 10 s* (or `avatarz.lab.start(); … await avatarz.lab.stop('label')` from the console). Every frame's values sent to the rig, the head pose, the extractor frame, the emotion read and the viewer position go to `lab/recordings/<time>_<label>.json`; the stage video goes next to it as `.webm`. Pass `start(false)` to skip the video.
2. **Score.** `node tools/score.mjs` scores the newest recording and diffs it against the previous one with the same label (`--baseline x.json` to choose, `--all` for every channel). It reports frame timing (judder), blinks, mouth closure, head ranges, and flags per channel: `pop` (a single step over the human-range limit), `twitch` (a step far above the channel's own usual step), `busy` (too many reversals per second). Limits are provisional until a reference recording of a real face replaces them.
2b. **Grade the pixels.** The yardstick is **burst** = p99 / median of per-frame motion in a region: scale-free, so a real face and the avatar compare even though they differ in size and camera noise. Within 0.7–1.4× of the real face is "human range". Spike counts are printed but noisy at 10 s (blinks are random events); use 20 s recordings and burst. Run with `--ref <reference>.video-report.json` for the verdicts.
    Original note: `uv run --with numpy python tools/score_video.py [recording.webm]` scores the rendered video itself: frame-to-frame change in the head, eye and mouth regions, with spikes (a frame that moves far more than its neighbours) and stutters. This is the grade that matters: the number scorer only sees what we send, and the renderer and the slew limiter can make that look smooth while the picture snaps. Recordings capture one video frame per animation frame on the page's clock (uniform timing was verified: 300 frames, all ~33 ms).
2c. **Reference.** *Record my face 10 s* on the page records the webcam while you talk; `score_video.py --face <file>` grades it the same way. Its spike counts are the human baseline the avatar is held to.
3. **Look.** `ffmpeg -i lab/recordings/<name>.webm -vf "fps=10,crop=iw*0.5:ih*0.45:iw*0.25:ih*0.2,scale=160:-1,tile=10x10" lab/strips/<name>.png` makes a frame strip of the mouth region at 10 fps, one second per row.

Rule: after ANY change to the mouth path (extractor, smoothing, spring, gate) run the page's *Run sync test* and keep the mouth within ±40 ms of the sound; every smoothing stage adds lag that the frame offset must cancel. Found the hard way on 2026-11-08: three smoothing stages added ~140 ms of lip lag before anyone re-measured.
Rule: one change at a time; record, score, strip; no change ships with a new flag or a worse timing line. The person judges last.

Findings so far (2026-11-08):
- The jumpiness was mostly **judder**: at device pixel ratio 2 the splat renderer dropped ~30% of frames on an M-series GPU. Capped at 1.5: 4 late frames in 598.
- The mouth's roughness was the rate limiter sliding at its cap: targets underneath jumped at every 150 ms chunk boundary (independent inferences) and the smoothing had a fast attack. Fixed at the source: chunk boundaries blended for continuity, symmetric one-pole smoothing at ~45 ms. Limiter hits fell from 17.8/s to 4.9/s; jaw, stretch and funnel reversals per second roughly halved. Mouth closed 41% of the time during speech (was 30%), which is closer to a real mouth between syllables.
- The HeadAudio (viseme) path was snapping: 52 limiter hits/s. Its intermediate shapes now get the same ~45 ms smoothing. 1.6 hits/s after, no flags.
- A latent bug: the HeadAudio path threw on start (a variable read before its declaration) since the sync trim was added. Only the neural path was being exercised. Found by testing both paths after the split.
- Webcam judder: face detection cost ~21 ms per call on the main thread, 15 times a second, dropping a quarter of frames. Detection now runs in a Web Worker (ESM WASM loader): 0 late frames in 301 with the camera on.
- The pixel grader found 20 mouth spikes and 13 eye spikes in 10 s of speech that the number grader called clean. Cause: the slew limiter moved channels at full speed then stopped dead. Replaced with a critically damped spring per channel (omega 40, ~120 ms settle): mouth spikes 20 → 4, p95 mouth motion 4.8 → 3.3, eyes 13 → 6.

## Human baseline (2026-11-08, the author talking 10 s to the webcam, graded with `--face`)

| region | real face: median / p95 / max motion, spikes | avatar after mouth spring: median / p95 / max, spikes |
|---|---|---|
| mouth | 1.63 / 3.54 / 8.96, 1 spike | 1.25 / 3.25 / 5.99, 4 spikes |
| eyes  | 2.44 / 5.68 / 16.1, 3 spikes | 1.12 / 3.90 / 7.52, 6 spikes |
| head  | 1.80 / 3.78 / 9.76, 0 spikes | 0.46 / 0.99 / 1.30, 0 spikes |

Reading it: the mouth is now in the human range (a real mouth is even burstier at its peaks). The eyes spike twice as often as a real pair, which is the next thing to fix. The head is far too still: the real head region moves about four times more per pixel while being drawn about three times smaller, so the avatar's head moves roughly ten times less than a person talking. "Robotic" has a number now.

## Status after the eye and mouth passes (2026-11-08, 20 s recordings vs a real face)

| region | real burst | avatar burst | verdict |
|---|---|---|---|
| head | 2.8 | 3.0–3.2 | human range |
| eyes | 3.8 | 3.8–4.3 | human range |
| mouth | 2.9 | 3.4–3.9 | human range (upper end) |

Changes that got here: pixel ratio cap (judder), continuous chunk boundaries and symmetric lip smoothing, spring instead of slew limiter, eased 120/200 ms blink with no hold and a 1 s refractory period (a saccade used to trigger a second blink 0.3 s after the first). Timing clean (1 late frame in 1200), limiter idle, no number-scorer flags.

Known remaining difference: amplitude, not burstiness. The real head and eyes move several times more than the avatar's between events. Burst ignores that; it is the next thing to measure and address, after the author has looked at this state.

## The jump, found by bisection (2026-11-08)

The author bisected with the Life switch: lips only and lips + eyes did not jump; anything with the head did. A pure 10° yaw sweep did not jump either, so the renderer's sort was cleared. Logging every head pose the renderer requested during speech showed yaw steps of 0.02°/frame but pitch steps of 0.155°/frame (9°/s), every one coinciding with the jaw: the "speech nod" term tied head pitch to jaw opening, so the head bobbed on every syllable. Removed; speech now only lowers the head slowly through the envelope.
Lesson for the grader: a 0.15° head step per frame was under the number scorer's bone limit (0.4°) and under the pixel grader's burst threshold, yet it was the whole complaint. Per-syllable *periodic* motion of the head is a pattern to flag, not a step size.

## Lips that lead the sound (2026-11-08, HeadAudio path)

Real lips form a shape 50–100 ms before the sound is heard. `tools/lagprobe.js` (paste into the page
console, `await lagProbe(window.avatarz, 20)`) plays the sample clip, records `jawOpen` against the audio
clock and cross-correlates the ONSETS of the heard envelope with the jaw's. Level correlation was useless
(peak ±50 ms wide); onsets give a 5 ms peak. Positive = jaw weights move before the sound; the draw
eats ~25 ms of that.

| HeadAudio `leadMs` | audible delay | probe lead | sync test |
|---|---|---|---|
| 0 (old) | 100 ms (tap floor) | +40 to +50 | never opened (350 ms bursts too short for the voice gate) |
| 85 | 145 ms | +115 to +120 | – |
| **60 (default)** | 120 ms | +100 | mouth EARLY by 58 ms (−47…−63 over 5 bursts) |

The sync test's burst is now 700 ms so HeadAudio's voice gate opens on it. The lead is a plain widening
of the delay line, so the mouth motion itself is unchanged; only its timing moved.

## The chest smear (2026-11-08)

The skin-coloured blur under the collar of the LAM heads is the end of the capture: the open neckline's
last gaussians have no neighbours below them. Three things were tried on Jane with `tools/clean_splat.py`
(it edits `offset.ply` opacities in the zip; gaussian i sits at skin.glb vertex i plus its offset, and
`vertex_order.json` is only the draw order):

| method | result |
|---|---|
| hide everything below a height, with a fade | smear gone, shoulders gone too: the jacket is the lowest part of the capture |
| hide the biggest gaussians low down | removed the neck itself; the whole capture is ~1 cm gaussians |
| **hide a 14 cm wide chest strip below y 1.50, 3 cm fade** | smear gone, shoulders untouched; the neck meets the jacket like a closed neckline |

There are no more shoulders in the bundle than the default framing shows: framed wider, the jacket's own
ragged bottom edge comes into view. `Jane-clean.zip` is built by `tools/fetch-assets.sh`.
