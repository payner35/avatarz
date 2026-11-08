"""Grade the rendered pixels, not the numbers: frame-to-frame change in the recorded stage video.

  uv run --with numpy python tools/score_video.py [recording.webm]

Reports, for the whole head and for the eye and mouth regions:
  - motion per frame (mean absolute pixel change, 0..255 scale)
  - spikes: frames whose motion is far above the local typical motion (a pop or a twitch)
  - stutters: near-duplicate frames followed by a double-size step (a dropped frame catching up)
and the worst moments so they can be looked at.
"""
import subprocess, sys, json, glob, os
import numpy as np

args = [a for a in sys.argv[1:] if not a.startswith('--') and (sys.argv[sys.argv.index(a) - 1] != '--ref')]
face_mode = '--face' in sys.argv  # a webcam recording of a real face: regions placed on the detected face
ref_path = sys.argv[sys.argv.index('--ref') + 1] if '--ref' in sys.argv else None  # a .video-report.json of a real face
path = args[0] if args else sorted(glob.glob('lab/recordings/*.webm'), key=os.path.getmtime)[-1]
W, H = 256, 256  # analysis resolution: enough to see a lip or a lid move, cheap to crunch
probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', path], capture_output=True, text=True)
# passthrough: one decoded frame per stored frame (a MediaRecorder webm has no fixed rate; without this
# ffmpeg pads to 1000 fps with duplicates and every real frame looks like a spike).
# A screen recording comes with a sidecar json holding the stage's crop (fractions of the frame).
crop_vf = ''
side = path.replace('.webm', '.json')
if os.path.exists(side):
    try:
        c = json.load(open(side)).get('crop')
        if c: crop_vf = f"crop=iw*{c['w']:.4f}:ih*{c['h']:.4f}:iw*{c['x']:.4f}:ih*{c['y']:.4f},"
    except Exception: pass
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-fps_mode', 'passthrough', '-vf', f'{crop_vf}scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
n = len(raw) // (W * H)
frames = np.frombuffer(raw, dtype=np.uint8)[: n * W * H].reshape(n, H, W).astype(np.float32)
if n < 10:
    print('too few frames', n); sys.exit(1)

# Regions in the stage: the bust crop puts the eyes ~40% down and the mouth ~62% down.
regions = {
    'head':  (slice(int(0.10 * H), int(0.95 * H)), slice(int(0.20 * W), int(0.80 * W))),
    'eyes':  (slice(int(0.34 * H), int(0.46 * H)), slice(int(0.30 * W), int(0.70 * W))),
    'mouth': (slice(int(0.56 * H), int(0.70 * H)), slice(int(0.38 * W), int(0.62 * W))),
} if not face_mode else None
if face_mode:
    # A real face in a webcam frame: find it (Haar cascade on a few early frames), then place the regions
    # relative to the face box the way they sit on a face: eyes ~40% down, mouth ~72% down.
    import cv2
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    boxes = []
    for i in range(0, min(n, 90), 10):
        fr = frames[i].astype(np.uint8)
        found = cascade.detectMultiScale(fr, 1.1, 4, minSize=(24, 24))
        if len(found): boxes.append(max(found, key=lambda b: b[2] * b[3]))
    if not boxes:
        print('no face found'); sys.exit(1)
    x, y, w, h = np.median(np.array(boxes), axis=0).astype(int)
    print(f'face box x{x} y{y} w{w} h{h} of {W}x{H}')
    regions = {
        'head':  (slice(y, y + h), slice(x, x + w)),
        'eyes':  (slice(y + int(0.30 * h), y + int(0.50 * h)), slice(x + int(0.12 * w), x + int(0.88 * w))),
        'mouth': (slice(y + int(0.62 * h), y + int(0.85 * h)), slice(x + int(0.25 * w), x + int(0.75 * w))),
    }
diff = np.abs(frames[1:] - frames[:-1])
report = {}
print(f'# {os.path.basename(path)}  ({n} frames at the capture rate)')
for name, (ys, xs) in regions.items():
    m = diff[:, ys, xs].mean(axis=(1, 2))
    med = np.median(m)
    # local typical motion: rolling median over ~1 s (30 frames)
    k = 15
    local = np.array([np.median(m[max(0, i - k): i + k + 1]) for i in range(len(m))])
    spikes = np.where(m > np.maximum(3.0 * local, med * 2.5 + 0.5))[0]
    dup = m < 0.08  # a near-duplicate frame: nothing moved on screen
    stutters = [i for i in range(1, len(m) - 1) if dup[i - 1] and m[i] > 2.0 * max(local[i], 0.2)]
    worst = np.argsort(m)[-5:][::-1]
    p95 = float(np.percentile(m, 95)); p99 = float(np.percentile(m, 99))
    report[name] = {
        'median': float(med), 'p95': p95, 'p99': p99, 'max': float(m.max()),
        # Burstiness: how far the biggest moves stand above the typical move. Scale-free, so it can be
        # compared between a real face and the avatar even though they differ in size and noise.
        'burst': float(p99 / max(med, 0.05)),
        'spikes': int(len(spikes)), 'stutters': int(len(stutters)), 'dupFrames': int(dup.sum()),
        'worstAt_s': [round(float(i) / 30, 2) for i in worst],
    }
    r = report[name]
    flag = ' ⚠ stutter' if r['stutters'] > n * 0.02 else ''
    print(f"{name:6} motion median {r['median']:.2f} p95 {r['p95']:.2f} p99 {r['p99']:.2f} max {r['max']:.2f} | burst {r['burst']:.1f} | spikes {r['spikes']} (noisy) stutters {r['stutters']} dup {r['dupFrames']} | worst at s {r['worstAt_s'][:3]}{flag}")
# Per-second busyness of the mouth region: how many reversals of motion direction, a proxy for twitching lips.
m = diff[:, regions['mouth'][0], regions['mouth'][1]].mean(axis=(1, 2))
sec = n // 30
rows = []
for s in range(sec):
    seg = m[s * 30:(s + 1) * 30]
    rows.append(f"{s}s:{seg.mean():.2f}/{seg.max():.2f}")
print('mouth motion mean/max per second: ' + ' '.join(rows))
if ref_path:
    ref = json.load(open(ref_path))
    print('\nvs real face (burst = p99/median; within 0.7–1.4× of the real face counts as human range):')
    for name in regions:
        a, b = report[name]['burst'], ref[name]['burst']
        ratio = a / b if b else float('nan')
        verdict = 'human range' if 0.7 <= ratio <= 1.4 else ('burstier than real' if ratio > 1.4 else 'stiller than real')
        print(f"  {name:6} avatar burst {a:.1f}  real {b:.1f}  ratio {ratio:.2f}  -> {verdict}")
json.dump(report, open(path.replace('.webm', '.video-report.json'), 'w'), indent=1)
