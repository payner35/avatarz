"""Grade presented frames from tools/screencast.mjs: like score_video.py, but on real screen frames with
their presentation timestamps, so stutter (duplicate presented frames, uneven intervals) is visible too.

  uv run --with numpy --with pillow python tools/score_frames.py [lab/screencast/<dir>] [--ref reference.video-report.json]
"""
import sys, os, json, glob
import numpy as np
from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith('--') and sys.argv[sys.argv.index(a) - 1] != '--ref']
ref_path = sys.argv[sys.argv.index('--ref') + 1] if '--ref' in sys.argv else None
d = args[0] if args else sorted(glob.glob('lab/screencast/*'))[-1]
meta = json.load(open(os.path.join(d, 'frames.json')))
crop = meta['crop']
W = H = 256
frames, ts = [], []
for f in meta['frames']:
    im = Image.open(os.path.join(d, f'f{f["i"]:04d}.jpg')).convert('L')
    w, h = im.size
    box = (int(crop['x'] * w), int(crop['y'] * h), int((crop['x'] + crop['w']) * w), int((crop['y'] + crop['h']) * h))
    frames.append(np.asarray(im.crop(box).resize((W, H)), dtype=np.float32)); ts.append(f['t'])
frames = np.stack(frames); ts = np.array(ts); n = len(frames)
dt = np.diff(ts) * 1000
print(f'# {d}: {n} presented frames, interval median {np.median(dt):.1f} ms, p95 {np.percentile(dt,95):.1f}, max {dt.max():.0f}, >1.5x median: {(dt > 1.5*np.median(dt)).sum()}')
regions = {
    'head':  (slice(int(0.10 * H), int(0.95 * H)), slice(int(0.20 * W), int(0.80 * W))),
    'eyes':  (slice(int(0.34 * H), int(0.46 * H)), slice(int(0.30 * W), int(0.70 * W))),
    'mouth': (slice(int(0.56 * H), int(0.70 * H)), slice(int(0.38 * W), int(0.62 * W))),
}
diff = np.abs(frames[1:] - frames[:-1])
report = {}
for name, (ys, xs) in regions.items():
    m = diff[:, ys, xs].mean(axis=(1, 2))
    # motion per 33 ms so uneven presentation intervals do not masquerade as motion
    m33 = m * (33.3 / np.maximum(dt, 1))
    med = float(np.median(m33)); p99 = float(np.percentile(m33, 99))
    dup = int((m < 0.08).sum())
    report[name] = {'median': med, 'p95': float(np.percentile(m33, 95)), 'p99': p99, 'max': float(m33.max()), 'burst': p99 / max(med, 0.05), 'dupFrames': dup}
    r = report[name]
    print(f"{name:6} motion/33ms median {r['median']:.2f} p95 {r['p95']:.2f} p99 {r['p99']:.2f} max {r['max']:.2f} | burst {r['burst']:.1f} | duplicate presented frames {dup}")
if ref_path:
    ref = json.load(open(ref_path))
    print('vs real face (burst = p99/median; 0.7–1.4x of real = human range):')
    for name in regions:
        a, b = report[name]['burst'], ref[name]['burst']; ratio = a / b
        print(f"  {name:6} screen burst {a:.1f}  real {b:.1f}  ratio {ratio:.2f}  -> {'human range' if 0.7 <= ratio <= 1.4 else ('burstier than real' if ratio > 1.4 else 'stiller than real')}")
json.dump(report, open(os.path.join(d, 'report.json'), 'w'), indent=1)
