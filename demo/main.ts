import { createTalkingHead, VISEMES, type Emotion, type HeadState, type TalkingHead } from '../src/index.js';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
let canvas = $<HTMLCanvasElement>('stage');
const status = $('status');

// Every file in assets/avatars is offered in the Avatar menu; its type picks the renderer.
const AVATAR_FILES = import.meta.glob('../assets/avatars/*.{zip,glb,vrm}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
type AvatarKind = 'splat' | 'glb' | 'vrm';
const KIND_BY_EXT: Record<string, AvatarKind> = { zip: 'splat', glb: 'glb', vrm: 'vrm' };
const GROUP_LABEL: Record<AvatarKind, string> = { splat: 'Splat heads (LAM)', glb: 'Mesh heads (GLB, ARKit)', vrm: 'VRM (stylised)' };
const avatars = Object.entries(AVATAR_FILES).map(([path, url]) => {
  const file = path.split('/').pop()!, dot = file.lastIndexOf('.');
  return { name: file.slice(0, dot), kind: KIND_BY_EXT[file.slice(dot + 1).toLowerCase()], url };
}).sort((x, y) => x.name.localeCompare(y.name));
const avatarSel = () => $<HTMLSelectElement>('head');
for (const kind of ['splat', 'glb', 'vrm'] as AvatarKind[]) {
  const list = avatars.filter((a) => a.kind === kind);
  if (!list.length) continue;
  const group = document.createElement('optgroup'); group.label = GROUP_LABEL[kind];
  for (const a of list) { const o = document.createElement('option'); o.value = a.name; o.textContent = a.name; group.appendChild(o); }
  avatarSel().appendChild(group);
}
if (avatars.some((a) => a.name === 'Jane')) avatarSel().value = 'Jane';
const currentAvatar = () => avatars.find((a) => a.name === avatarSel().value) ?? avatars[0];
const CLIP_URL = new URL('../assets/audio/sample-24k.wav', import.meta.url).href;

// One context at the voice model's rate so nothing is resampled.
const context = new AudioContext({ sampleRate: 24000 });
// Every source feeds this bus; the head taps it. outGain lets us mute the mic.
const bus = new GainNode(context, { gain: 1 });
const outGain = new GainNode(context, { gain: 1 });
bus.connect(outGain).connect(context.destination);

let head: TalkingHead | null = null;
let current: { kind: string; stop: () => void } | null = null;

// Bars
const bars = $('bars'), labels = $('bar-labels');
const barEls = VISEMES.map((n) => { const d = document.createElement('div'); bars.appendChild(d); const s = document.createElement('span'); s.textContent = n; labels.appendChild(s); return d; });

async function build(): Promise<void> {
  head?.dispose();
  for (const id of ['extractor', 'renderer', 'state']) ($(id) as HTMLSelectElement).disabled = true;
  // A canvas that has handed out a WebGL context cannot hand out a 2D one, so swap in a fresh element.
  const fresh = document.createElement('canvas'); fresh.id = 'stage';
  canvas.replaceWith(fresh); canvas = fresh;
  const avatar = currentAvatar();
  const rendererKind = $<HTMLSelectElement>('renderer').value === 'sprite' || !avatar ? 'sprite' : avatar.kind;
  avatarSel().disabled = rendererKind === 'sprite';
  status.textContent = 'building…';
  head = await createTalkingHead({
    context, source: bus, canvas, destination: outGain,
    avatarUrl: rendererKind === 'sprite' ? undefined : avatar.url,
    extractor: $<HTMLSelectElement>('extractor').value as 'headaudio' | 'formant' | 'wav2arkit',
    renderer: rendererKind,
    delay: 'auto',
    // ?bg=0x14171e gives the splat renderer an opaque background (recordings then match the page).
    splat: new URLSearchParams(location.search).get('bg') ? { backgroundColor: new URLSearchParams(location.search).get('bg')! } : undefined,
    wav2arkit: {
      onProgress: (p) => { status.textContent = `downloading wav2arkit ${Math.round(p * 100)}%`; },
      // ?ep=wasm|webgpu  ?threads=4  ?chunk=400  for benchmarking
      executionProviders: (new URLSearchParams(location.search).get('ep') as 'wasm' | 'webgpu' | null) ? [new URLSearchParams(location.search).get('ep') as 'wasm' | 'webgpu'] : undefined,
      numThreads: Number(new URLSearchParams(location.search).get('threads')) || undefined,
      proxy: new URLSearchParams(location.search).get('proxy') === null ? undefined : new URLSearchParams(location.search).get('proxy') === '1',
      chunkMs: Number(new URLSearchParams(location.search).get('chunk')) || undefined,
      modelFile: new URLSearchParams(location.search).get('model') || undefined, // ?model=wav2arkit_int8.onnx
    },
    state: $<HTMLSelectElement>('state').value as HeadState,
    onFrame(v, m) {
      for (let i = 0; i < barEls.length; i++) barEls[i].style.height = `${Math.round(v.visemes[i] * 100)}%`;
      $('m-fps').textContent = m.fps.toFixed(0);
      $('m-upd').textContent = `${m.updateMs.toFixed(2)} / ${m.updateMsMax.toFixed(2)} ms`;
      $('m-frame').textContent = `${m.frameMs.toFixed(2)} ms`;
      $('m-a2m').textContent = m.audioToMouthMs ? `${m.audioToMouthMs.toFixed(0)} ms` : '–';
      $('m-ext').textContent = `${m.extractorLatencyMs} ms`;
      $('delay-v').textContent = `${m.tapDelayMs.toFixed(0)} ms`;
      $('m-out').textContent = `${m.outputLatencyMs.toFixed(0)} ms`;
      $('m-name').textContent = m.extractor + (m.fellBack ? ' (fell back)' : '');
      const nn = head?.extractor as unknown as { chunksRun?: number; chunksDropped?: number; lateFrames?: number; inferMs?: number } | undefined;
      const pf = head?.prosody?.features; const em = head?.emotion;
      $('m-pro').textContent = pf ? `${pf.f0Hz ? pf.f0Hz.toFixed(0) + ' Hz' : '–'} (${pf.f0Rel >= 0 ? '+' : ''}${pf.f0Rel.toFixed(1)} st) · ${pf.f0Var.toFixed(1)} st · ${pf.rate.toFixed(1)}/s` : '–';
      $('m-emo').textContent = em ? Object.entries(em).filter(([, v]) => v > 0.03).map(([k, v]) => `${k} ${(v as number).toFixed(2)}`).join(' · ') || 'neutral' : '–';
      const at = head?.attention;
      $('m-att').textContent = at ? (at.present ? `x ${at.x.toFixed(2)} y ${at.y.toFixed(2)} near ${at.near.toFixed(2)} facing ${at.facing.toFixed(2)} smile ${at.smile.toFixed(2)}${at.talking ? ' talking' : ''}` : `no face for ${at.absentFor === Infinity ? '–' : at.absentFor.toFixed(1) + ' s'}`) : '–';
      $('m-nn').textContent = nn?.chunksRun !== undefined ? `${nn.chunksRun} / ${nn.chunksDropped} · ${nn.lateFrames} · ${nn.inferMs?.toFixed(0)} ms/chunk` : '–';
    },
  });
  (window as unknown as { avatarz: TalkingHead }).avatarz = head; // for the console
  const meta = head.renderer.getAvatarMeta?.();
  const need = ['aa', 'ih', 'ou', 'ee', 'oh', 'blink'];
  const missing = meta ? need.filter((n) => !(meta.expressions ?? []).includes(n)) : [];
  $('meta').textContent = meta
    ? `${meta.name ?? '?'} · by ${(meta.authors ?? []).join(', ') || '?'} · VRM ${meta.version} · commercial: ${meta.commercialUsage ?? '?'} · ${meta.licenseUrl ?? ''} · mouth shapes: ${missing.length ? 'MISSING ' + missing.join(', ') : 'all present'}`
    : 'procedural sprite, no asset';
  status.textContent = `ready · ${head.metrics.extractor} + ${head.metrics.renderer}`;
  for (const id of ['extractor', 'renderer', 'state']) ($(id) as HTMLSelectElement).disabled = false;
}

function setCurrent(kind: string, stop: () => void): void {
  current?.stop();
  current = { kind, stop };
  for (const id of ['src-file', 'src-mic', 'src-pcm']) $(id).classList.toggle('on', id === `src-${kind}`);
  status.textContent = `playing · ${kind}`;
}

// 1) <audio> element through a MediaElementAudioSourceNode.
let audioEl: HTMLAudioElement | null = null;
let audioSrc: MediaElementAudioSourceNode | null = null;
$('src-file').onclick = async () => {
  await context.resume();
  if (!audioEl) {
    audioEl = new Audio(CLIP_URL); audioEl.crossOrigin = 'anonymous'; audioEl.loop = true;
    audioSrc = context.createMediaElementSource(audioEl);
  }
  audioSrc!.connect(bus); outGain.gain.value = 1;
  await audioEl.play();
  setCurrent('file', () => { audioEl?.pause(); try { audioSrc?.disconnect(bus); } catch { /* */ } });
};

// 2) Microphone. Not routed to the speakers.
$('src-mic').onclick = async () => {
  await context.resume();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const src = context.createMediaStreamSource(stream);
  outGain.gain.value = 0;
  src.connect(bus);
  setCurrent('mic', () => { try { src.disconnect(bus); } catch { /* */ } stream.getTracks().forEach((t) => t.stop()); outGain.gain.value = 1; });
};

// 3) PCM stream: the voice-stack player. Int16 24 kHz chunks scheduled ~200 ms ahead
//    as AudioBufferSourceNodes through one GainNode, with isPlaying and stopAll().
/** Locate the 'data' chunk of a RIFF WAV (afconvert inserts a FLLR padding chunk). */
function wavData(buf: ArrayBuffer): Int16Array {
  const dv = new DataView(buf);
  let pos = 12;
  while (pos + 8 <= buf.byteLength) {
    const id = String.fromCharCode(dv.getUint8(pos), dv.getUint8(pos + 1), dv.getUint8(pos + 2), dv.getUint8(pos + 3));
    const size = dv.getUint32(pos + 4, true);
    if (id === 'data') return new Int16Array(buf, pos + 8, size >> 1);
    pos += 8 + size + (size & 1);
  }
  throw new Error('no data chunk');
}

$('src-pcm').onclick = async () => {
  await context.resume();
  const res = await fetch(CLIP_URL);
  const pcm = wavData(await res.arrayBuffer()); // 16-bit mono 24 kHz
  const CHUNK = 2400; // 100 ms, like one WebSocket message
  const LOOKAHEAD = 0.3; // keep this much scheduled so a main-thread stall does not underrun
  const playerGain = new GainNode(context, { gain: 1 });
  playerGain.connect(bus);
  outGain.gain.value = 1;
  let nextTime = context.currentTime + 0.2;
  let offset = 0;
  let alive = true;
  const nodes = new Set<AudioBufferSourceNode>();
  const pump = () => {
    if (!alive) return;
    // Fell behind (tab hidden, long GC): restart the clock instead of scheduling in the past.
    if (nextTime < context.currentTime) nextTime = context.currentTime + 0.05;
    while (alive && nextTime - context.currentTime < LOOKAHEAD) {
      if (offset >= pcm.length) offset = 0; // loop
      const n = Math.min(CHUNK, pcm.length - offset);
      const buf = context.createBuffer(1, n, context.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < n; i++) ch[i] = pcm[offset + i] / 32768;
      offset += n;
      const s = new AudioBufferSourceNode(context, { buffer: buf });
      s.connect(playerGain);
      s.start(nextTime);
      nodes.add(s); s.onended = () => nodes.delete(s);
      nextTime += n / context.sampleRate;
    }
    setTimeout(pump, 30);
  };
  pump();
  const stopAll = () => { alive = false; nodes.forEach((s) => { try { s.stop(); } catch { /* */ } }); nodes.clear(); try { playerGain.disconnect(); } catch { /* */ } };
  setCurrent('pcm', stopAll);
};

let webcamOn = false;
$('webcam').onclick = async () => {
  if (!head) return;
  if (webcamOn) { head.stopWebcam(); webcamOn = false; $('webcam').classList.remove('on'); return; }
  $('webcam').textContent = 'Webcam: starting…';
  try { await head.startWebcam(); webcamOn = true; $('webcam').classList.add('on'); $('webcam').textContent = 'Webcam: on'; }
  catch (e) { $('webcam').textContent = 'Webcam: ' + (e as Error).message; }
};
$('stop').onclick = () => { current?.stop(); current = null; head?.cut(); status.textContent = 'cut'; for (const id of ['src-file', 'src-mic', 'src-pcm']) $(id).classList.remove('on'); };

$('extractor').onchange = async () => {
  status.textContent = 'switching extractor…';
  await head?.setExtractor($<HTMLSelectElement>('extractor').value as 'headaudio' | 'formant' | 'wav2arkit');
  status.textContent = `ready · ${head?.metrics.extractor}`;
};
$('renderer').onchange = () => build();
$('head').onchange = () => build();
$('emotion').onchange = () => { const v = $<HTMLSelectElement>('emotion').value; if (v === 'auto') build(); else head?.setEmotion(v as Emotion); };
$('state').onchange = () => head?.setState($<HTMLSelectElement>('state').value as HeadState);
$('trim').oninput = () => { const ms = Number($<HTMLInputElement>('trim').value); $('trim-v').textContent = `${ms} ms`; head?.setSyncTrim(ms / 1000); };

// Sync test: play short bursts of the clip at known audio-clock times and measure when the mouth opens
// relative to when that sound reaches the ear (bus time + audible delay + output latency).
$('synctest').onclick = async () => {
  if (!head) return;
  current?.stop(); current = null; head.cut();
  await context.resume();
  const res = await fetch(CLIP_URL);
  const pcm = wavData(await res.arrayBuffer());
  // Pick a loud 700 ms stretch of the clip (HeadAudio's voice gate never opens on anything shorter).
  const win = Math.round(0.7 * 24000);
  let best = 0, bestE = 0;
  for (let i = 24000; i < pcm.length - win; i += 2400) { let e = 0; for (let k = 0; k < win; k += 4) e += Math.abs(pcm[i + k]); if (e > bestE) { bestE = e; best = i; } }
  const buf = context.createBuffer(1, win, 24000);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < win; i++) ch[i] = pcm[best + i] / 32768;
  const out = $('synctest-v');
  out.textContent = 'running…';
  const errors: number[] = [];
  const ctxAt = (wall: number) => { const ts = context.getOutputTimestamp(); return (ts.contextTime ?? 0) + (wall - (ts.performanceTime ?? 0)) / 1000; };
  for (let n = 0; n < 5; n++) {
    head.cut();
    await new Promise((r) => setTimeout(r, 900));
    const t0 = context.currentTime + 0.15;
    const src = new AudioBufferSourceNode(context, { buffer: buf });
    src.connect(bus); src.start(t0);
    // getOutputTimestamp() maps to the device output position, so output latency is already in it.
    const heardAt = t0 + head.tap.getDelay();
    // Wait for the mouth: the weights the renderer is about to draw.
    const r = head.renderer as unknown as { weights?: Record<string, number> };
    const tStart = performance.now();
    let opened = 0;
    while (performance.now() - tStart < 2500) {
      if ((r.weights?.jawOpen ?? 0) > 0.12) { opened = performance.now(); break; }
      await new Promise((f) => requestAnimationFrame(f));
    }
    if (!opened) { out.textContent = `burst ${n + 1}: mouth never opened`; continue; }
    const err = (ctxAt(opened) - heardAt) * 1000;
    errors.push(err);
    out.textContent = `burst ${n + 1}: mouth ${err >= 0 ? 'late' : 'early'} by ${Math.abs(err).toFixed(0)} ms`;
  }
  if (errors.length) {
    errors.sort((a, b) => a - b);
    const med = errors[Math.floor(errors.length / 2)];
    out.textContent = `${head.metrics.extractor}: mouth ${med >= 0 ? 'LATE' : 'EARLY'} by ${Math.abs(med).toFixed(0)} ms (median of ${errors.length}; all: ${errors.map((e) => e.toFixed(0)).join(', ')}).`;
  }
};

// Press J (or the Jump button) while recording whenever she jumps; the tools show what moved then.
window.addEventListener('keydown', (e) => { if (e.key === 'j' || e.key === 'J') { head?.lab.mark(); $('synctest-v').textContent = 'marked'; } });
$('record').onclick = async () => {
  if (!head || head.lab.recording) return;
  const label = prompt('Label for this recording (e.g. idle, pcm-neural, webcam)', 'run') ?? 'run';
  $('record').textContent = 'Recording 20 s… press J when she jumps';
  head.lab.start();
  await new Promise((r) => setTimeout(r, 20000));
  const name = await head.lab.stop(label, { head: $<HTMLSelectElement>('head').value });
  $('record').textContent = 'Record 20 s';
  $('synctest-v').textContent = `saved lab/recordings/${name}.json + .webm`;
};
$('reference').onclick = async () => {
  if (!head) return;
  $('reference').textContent = 'Recording your face… talk normally';
  try { const name = await head.lab.reference(10000); $('synctest-v').textContent = `saved lab/recordings/${name}.webm`; }
  catch (e) { $('synctest-v').textContent = 'reference failed: ' + (e as Error).message; }
  $('reference').textContent = 'Record my face 10 s';
};
$('screen').onclick = async () => {
  if (!head) return;
  $('screen').textContent = 'Choose this tab in the dialog…';
  try {
    const p = head.lab.screen(10000);
    $('screen').textContent = 'Recording screen…';
    const name = await p;
    $('synctest-v').textContent = `saved lab/recordings/${name}.webm`;
  } catch (e) { $('synctest-v').textContent = 'screen failed: ' + (e as Error).message; }
  $('screen').textContent = 'Record screen 10 s';
};
$('life').onchange = () => { const r = head?.renderer as unknown as { life?: { level: number } } | undefined; if (r?.life) r.life.level = Number($<HTMLSelectElement>('life').value); };
$('mark').onclick = () => { head?.lab.mark(); $('synctest-v').textContent = 'marked'; };
$('mouth').oninput = () => { const k = Number($<HTMLInputElement>('mouth').value) / 100; $('mouth-v').textContent = `${k.toFixed(1)}×`; const r = head?.renderer as unknown as { mouthScale?: number } | undefined; if (r && 'mouthScale' in r) r.mouthScale = k; };

const q = new URLSearchParams(location.search);
if (q.get('extractor')) $<HTMLSelectElement>('extractor').value = q.get('extractor')!;
if (q.get('renderer') === 'sprite') $<HTMLSelectElement>('renderer').value = 'sprite';
const wanted = q.get('avatar') ?? q.get('head');
if (wanted && avatars.some((a) => a.name === wanted)) avatarSel().value = wanted;
build().catch((e) => { status.textContent = 'error: ' + e.message; console.error(e); });
