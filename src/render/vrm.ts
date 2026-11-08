/**
 * Default renderer: a VRM head on three-vrm. Mouth from the five VRM vowel
 * expressions via the Oculus-to-VRM blend table, blink and gaze from the
 * expression manager and lookAt, idle sway on the head bone.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { VISEME_INDEX as V, clamp01, type AvatarMeta, type Emotion, type HeadState, type Renderer, type VisemeFrame } from '../types.js';

export interface VRMRendererOptions {
  /** Overall mouth amplitude. Default 0.9. */
  mouthGain?: number;
  /** Camera distance from the head in metres. Default 0.85. */
  distance?: number;
  /** Vertical field of view in degrees. Default 22. */
  fov?: number;
  /** Transparent background. Default true. */
  transparent?: boolean;
  background?: number;
  pixelRatioCap?: number;
}

export class VRMRenderer implements Renderer {
  readonly name = 'vrm';
  private canvas: HTMLCanvasElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(22, 1, 0.05, 20);
  private lookTarget = new THREE.Object3D();
  private vrm: VRM | null = null;
  private state: HeadState = 'idle';
  private elapsed = 0;
  private blinkAt = 2;
  private blinkPhase = -1; // -1 idle, otherwise 0..1 progress
  private headBase = new THREE.Euler();
  private loader: GLTFLoader;
  private lastW = 0;
  private lastH = 0;
  private readonly opts: Required<VRMRendererOptions>;
  private cur = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };

  constructor(opts: VRMRendererOptions = {}) {
    this.opts = {
      mouthGain: opts.mouthGain ?? 0.9,
      distance: opts.distance ?? 0.85,
      fov: opts.fov ?? 22,
      transparent: opts.transparent ?? true,
      background: opts.background ?? 0x000000,
      pixelRatioCap: opts.pixelRatioCap ?? 2,
    };
    this.loader = new GLTFLoader();
    this.loader.register((parser) => new VRMLoaderPlugin(parser));
    this.scene.add(this.lookTarget);
    // Soft three-point rig: warm key from front-left, cool fill from the right, rim from behind.
    const hemi = new THREE.HemisphereLight(0xfff4e8, 0x6c7a92, 1.1);
    const key = new THREE.DirectionalLight(0xfff1e0, 1.6);
    key.position.set(-0.8, 1.6, 1.8);
    const fill = new THREE.DirectionalLight(0xdfe9ff, 0.7);
    fill.position.set(1.2, 0.8, 1.2);
    const rim = new THREE.DirectionalLight(0xffffff, 0.9);
    rim.position.set(0.3, 1.2, -1.5);
    this.scene.add(hemi, key, fill, rim);
  }

  mount(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: this.opts.transparent, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.opts.pixelRatioCap));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    if (!this.opts.transparent) this.renderer.setClearColor(this.opts.background, 1);
    this.camera.fov = this.opts.fov;
    this.resizeIfNeeded(true);
  }

  async setAvatar(url: string): Promise<void> {
    const gltf = await this.loader.loadAsync(url);
    const vrm = gltf.userData.vrm as VRM | undefined;
    if (!vrm) throw new Error('avatarz: file is not a VRM: ' + url);
    VRMUtils.removeUnnecessaryVertices(gltf.scene);
    VRMUtils.combineSkeletons(gltf.scene);
    VRMUtils.combineMorphs(vrm);
    VRMUtils.rotateVRM0(vrm);
    vrm.scene.traverse((o) => { o.frustumCulled = false; });

    if (this.vrm) {
      this.scene.remove(this.vrm.scene);
      VRMUtils.deepDispose(this.vrm.scene);
    }
    this.vrm = vrm;
    this.scene.add(vrm.scene);
    if (vrm.lookAt) {
      vrm.lookAt.target = this.lookTarget;
      vrm.lookAt.autoUpdate = true;
    }
    const head = vrm.humanoid.getNormalizedBoneNode('head');
    if (head) this.headBase.copy(head.rotation);
    this.frameCamera();
  }

  getAvatarMeta(): AvatarMeta | null {
    const m = this.vrm?.meta as Record<string, unknown> | undefined;
    if (!m) return null;
    const expressions = this.vrm?.expressionManager?.expressions.map((e) => e.expressionName) ?? [];
    if (m.metaVersion === '1') {
      return {
        version: '1',
        name: m.name as string,
        authors: m.authors as string[],
        licenseUrl: m.licenseUrl as string,
        commercialUsage: m.commercialUsage as string,
        expressions,
      };
    }
    return {
      version: '0',
      name: m.title as string,
      authors: m.author ? [m.author as string] : undefined,
      licenseUrl: (m.otherLicenseUrl as string) || (m.licenseName as string),
      commercialUsage: m.commercialUssageName as string,
      expressions,
    };
  }

  private frameCamera(): void {
    const vrm = this.vrm;
    if (!vrm) return;
    vrm.scene.updateMatrixWorld(true);
    const head = vrm.humanoid.getRawBoneNode('head');
    const p = new THREE.Vector3();
    if (head) head.getWorldPosition(p); else p.set(0, 1.5, 0);
    p.y += 0.02; // centre between eyes and mouth
    this.camera.position.set(p.x, p.y + 0.02, p.z + this.opts.distance);
    this.camera.lookAt(p);
    this.lookTarget.position.copy(this.camera.position);
  }

  private resizeIfNeeded(force = false): void {
    const c = this.canvas, r = this.renderer;
    if (!c || !r) return;
    const w = c.clientWidth || c.width, h = c.clientHeight || c.height;
    if (!force && w === this.lastW && h === this.lastH) return;
    this.lastW = w; this.lastH = h;
    r.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  }

  setState(state: HeadState): void { this.state = state; }

  private emotion: { happy: number; sad: number; surprised: number; angry: number; relaxed: number } = { happy: 0, sad: 0, surprised: 0, angry: 0, relaxed: 0 };
  private emotionTarget = { ...this.emotion };
  setEmotion(emotion: Emotion, intensity = 1): void {
    const k = clamp01(intensity);
    const t = { happy: 0, sad: 0, surprised: 0, angry: 0, relaxed: 0 };
    if (emotion === 'warm') { t.happy = 0.35 * k; t.relaxed = 0.2 * k; }
    if (emotion === 'amused') t.happy = 0.6 * k;
    if (emotion === 'concerned') t.sad = 0.4 * k;
    if (emotion === 'surprised') t.surprised = 0.5 * k;
    if (emotion === 'thoughtful') { t.angry = 0.15 * k; t.relaxed = 0.1 * k; }
    this.emotionTarget = t;
  }
  setEmotionMix(mix: Partial<Record<Exclude<Emotion, 'neutral'>, number>>): void {
    const t = { happy: 0, sad: 0, surprised: 0, angry: 0, relaxed: 0 };
    t.happy = 0.35 * (mix.warm ?? 0) + 0.6 * (mix.amused ?? 0);
    t.relaxed = 0.2 * (mix.warm ?? 0) + 0.1 * (mix.thoughtful ?? 0);
    t.sad = 0.4 * (mix.concerned ?? 0);
    t.surprised = 0.5 * (mix.surprised ?? 0);
    t.angry = 0.15 * (mix.thoughtful ?? 0);
    this.emotionTarget = t;
  }

  /** Main-thread cost of the last frame() excluding the GPU draw call. */
  updateMs = 0;

  frame(v: VisemeFrame, dt: number): void {
    const t0 = performance.now();
    const r = this.renderer, vrm = this.vrm;
    if (!r) return;
    this.resizeIfNeeded();
    this.elapsed += dt;
    if (!vrm) { r.render(this.scene, this.camera); return; }

    const em = vrm.expressionManager;
    const w = v.visemes;
    const g = this.opts.mouthGain;
    if (em) {
      // Oculus -> VRM blend table (Inworld, tuned on VRoid models), each capped at 1.
      let aa = w[V.aa];
      let ih = w[V.I] * 0.8 + w[V.aa] * 0.25;
      let ou = w[V.U] * 0.9 + w[V.O] * 0.3;
      let ee = w[V.E] * 0.9 + w[V.I] * 0.2;
      let oh = w[V.O] * 0.9 + w[V.aa] * 0.35;
      // Consonants narrow the mouth; PP and FF pull it shut.
      const cons = Math.max(w[V.TH], w[V.DD], w[V.kk], w[V.CH], w[V.SS], w[V.nn], w[V.RR]);
      const shut = Math.max(w[V.PP], w[V.FF]);
      const k = (1 - 0.6 * cons) * (1 - shut) * g;
      aa *= k; ih *= k; ou *= k; ee *= k; oh *= k;
      // Fricatives/plosives still part the lips a little (teeth showing) via 'ih'.
      ih = Math.max(ih, 0.35 * Math.max(w[V.SS], w[V.CH], w[V.TH], w[V.DD], w[V.nn]) * g);
      const c = this.cur;
      c.aa = clamp01(aa); c.ih = clamp01(ih); c.ou = clamp01(ou); c.ee = clamp01(ee); c.oh = clamp01(oh);
      em.setValue('aa', c.aa);
      em.setValue('ih', c.ih);
      em.setValue('ou', c.ou);
      em.setValue('ee', c.ee);
      em.setValue('oh', c.oh);

      // Blink: 3–6 s with jitter, 80 ms close, 120 ms open.
      if (this.blinkPhase < 0 && this.elapsed >= this.blinkAt) this.blinkPhase = 0;
      if (this.blinkPhase >= 0) {
        this.blinkPhase += dt / 0.2;
        const p = this.blinkPhase;
        const b = p < 0.4 ? p / 0.4 : p < 1 ? 1 - (p - 0.4) / 0.6 : 0;
        em.setValue('blink', clamp01(b));
        if (p >= 1) { this.blinkPhase = -1; this.blinkAt = this.elapsed + 3 + Math.random() * 3; }
      }
      // A faint smile when idle so the neutral face is not blank.
      const ek = 1 - Math.exp(-8 * dt);
      for (const n of Object.keys(this.emotion) as (keyof typeof this.emotion)[]) this.emotion[n] += (this.emotionTarget[n] - this.emotion[n]) * ek;
      const happy = (this.state === 'idle' || this.state === 'active' ? 0.12 : 0.05) + this.emotion.happy;
      em.setValue('happy', clamp01(happy * (1 - v.jawOpen)));
      em.setValue('sad', this.emotion.sad);
      em.setValue('surprised', this.emotion.surprised);
      em.setValue('angry', this.emotion.angry);
      em.setValue('relaxed', this.emotion.relaxed);
    }

    // Idle motion: slow sway of 1–2°, driven by elapsed time, paused when the loop pauses.
    const head = vrm.humanoid.getNormalizedBoneNode('head');
    if (head) {
      const t = this.elapsed;
      const sway = THREE.MathUtils.degToRad(1.5);
      let nod = 0, tilt = 0, turn = 0;
      if (this.state === 'thinking') { tilt = THREE.MathUtils.degToRad(4); nod = -THREE.MathUtils.degToRad(2); }
      if (this.state === 'listening') { nod = THREE.MathUtils.degToRad(2); }
      head.rotation.set(
        this.headBase.x + nod + Math.sin(t * 0.7) * sway * 0.5 + v.jawOpen * 0.03,
        this.headBase.y + turn + Math.sin(t * 0.43) * sway,
        this.headBase.z + tilt + Math.sin(t * 0.31 + 1) * sway * 0.6,
      );
    }
    // Gaze toward the camera with small drifts; look up and away when thinking.
    const cam = this.camera.position;
    const drift = 0.04;
    const up = this.state === 'thinking' ? 0.25 : 0;
    const side = this.state === 'thinking' ? 0.2 : 0;
    this.lookTarget.position.set(
      cam.x + side + Math.sin(this.elapsed * 0.37) * drift,
      cam.y + up + Math.sin(this.elapsed * 0.53 + 2) * drift * 0.5,
      cam.z,
    );

    vrm.update(dt);
    this.updateMs = performance.now() - t0;
    r.render(this.scene, this.camera);
  }

  dispose(): void {
    if (this.vrm) {
      this.scene.remove(this.vrm.scene);
      VRMUtils.deepDispose(this.vrm.scene);
      this.vrm = null;
    }
    this.renderer?.dispose();
    this.renderer = null;
    this.canvas = null;
  }
}
