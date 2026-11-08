"""
Clean a LAM head bundle (Jane/Jack/John/Sasha zips): hide the stray gaussians that hang below the
capture. offset.ply holds one gaussian per skin.glb vertex, index for index (vertex_order.json is the
renderer's draw order, not a mapping), positioned as an offset from that vertex. Below the neck the capture is sparse, and the few gaussians there sit
8–10 cm off their vertex at the maximum 1 cm scale: on screen they are the skin-coloured smears under
the collar. This fades gaussians out by world height (vertex y + offset y) and writes a new zip.

Run: uv run --with numpy python tools/clean_splat.py assets/avatars/Sasha.zip [--blobs-y 1.60] [--blobs-scale 0.0085]
  --blobs-y      only gaussians below this world y (m) are candidates. Default 1.60 (the collar).
  --blobs-scale  hide a candidate whose largest axis is at least this (m). Default 0.0085; the capture caps at 0.01.
  --cut / --fade hide everything below a height with a fade above it. Off by default: it removes the shoulders.
Writes <name>-clean.zip next to the input (or --out <path>). Nothing is removed, so vertex_order stays valid; hidden
gaussians get an opacity logit of -20.
"""
import json, struct, sys, zipfile, io, os
import numpy as np

args = sys.argv[1:]
src = args[0]
def flag(n, d):
    return float(args[args.index(n) + 1]) if n in args else d
cut, fade = flag('--cut', 0.0), flag('--fade', 0.04)
# Blob mode: hide only gaussians below --blobs-y whose largest axis is at least --blobs-scale (metres).
# The shoulders are kept; the oversized faint blobs that smear the chest go.
blobs_y, blobs_scale = flag('--blobs-y', 1.60), flag('--blobs-scale', 0.0)
# Chest mode: the height cut applies only within |x| < --chest-x (the open neckline), so the shoulders stay.
chest_x = flag('--chest-x', 0.0)

zin = zipfile.ZipFile(src)
names = zin.namelist()
folder = names[0].split('/')[0]
skin = zin.read(f'{folder}/skin.glb'); ply = zin.read(f'{folder}/offset.ply')

jl = struct.unpack_from('<I', skin, 12)[0]; js = json.loads(skin[20:20 + jl]); bins = skin[20 + jl + 8:]
acc = js['accessors'][js['meshes'][0]['primitives'][0]['attributes']['POSITION']]; bv = js['bufferViews'][acc['bufferView']]
pos = np.frombuffer(bins, dtype='<f4', count=acc['count'] * 3, offset=bv.get('byteOffset', 0) + acc.get('byteOffset', 0)).reshape(-1, 3)

hend = ply.index(b'end_header\n') + 11
fields = [l.split()[2] for l in ply[:hend].decode().splitlines() if l.startswith('property')]
dt = np.dtype([(n, '<f4') for n in fields])
g = np.frombuffer(ply, dtype=dt, offset=hend).copy()
wy = pos[:, 1] + g['y']
# Ramp 0..1 over [cut, cut+fade] on the opacity (in probability space), then back to a logit.
k = np.clip((wy - cut) / max(fade, 1e-6), 0, 1) if cut > 0 else np.ones(len(g))
wx = pos[:, 0] + g['x']
if chest_x > 0: k = np.where(np.abs(wx) < chest_x, k, 1.0)
scale_max = np.exp(np.stack([g['scale_0'], g['scale_1'], g['scale_2']], 1)).max(1)
blob = (wy < blobs_y) & (scale_max >= blobs_scale) if blobs_scale > 0 else np.zeros(len(g), bool)
k = np.where(blob, 0.0, k)
p = 1 / (1 + np.exp(-g['opacity'])) * k
g['opacity'] = np.where(k <= 0, -20.0, np.log(np.clip(p, 1e-9, 1 - 1e-9) / (1 - np.clip(p, 1e-9, 1 - 1e-9)))).astype('<f4')
hidden = int((k <= 0).sum()); faded = int(((k > 0) & (k < 1)).sum())

out = args[args.index('--out') + 1] if '--out' in args else os.path.splitext(src)[0] + '-clean.zip'
buf = io.BytesIO()
with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zout:
    for n in names:
        if n.endswith('offset.ply'): zout.writestr(n, ply[:hend] + g.tobytes())
        else: zout.writestr(n, zin.read(n))
open(out, 'wb').write(buf.getvalue())
print(f'{out}: {len(g)} gaussians, {hidden} hidden ({int(blob.sum())} blobs >= {blobs_scale} m below y={blobs_y}; cut {cut}), {faded} faded; world y now {wy[k > 0].min():.3f}..{wy.max():.3f}')
