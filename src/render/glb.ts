/**
 * Photoreal mesh renderer: a plain glTF/GLB head that carries the 52 ARKit blendshapes as morph
 * targets (for example a FaceNinja export). All behaviour lives in src/life, the same as the splat
 * renderer; this file loads the head, lights and frames it, writes the ARKit weights to the morph
 * targets and turns the head with Life's neck pose.
 *
 * Meshopt-compressed files are decoded with the decoder that ships inside three, so nothing is fetched
 * from another origin.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ARKIT, type AvatarMeta, type Emotion, type HeadState, type Renderer, type VisemeFrame } from '../types.js';
import { Life, type Viewer } from '../life/index.js';
import type { MouthOptions } from '../life/mouth.js';

export interface GlbRendererOptions extends MouthOptions {
  /** Vertical field of view in degrees. Default 20. */
  fov?: number;
  /** How much of the view height the head (crown to chin) fills. Default 0.55. */
  headFill?: number;
  /** Transparent background. Default true. */
  transparent?: boolean;
  background?: number;
  /** Cap on the device pixel ratio. Default 2. */
  pixelRatioCap?: number;
  /** Image-based lighting strength (a neutral studio room, generated locally). Default 0.6. */
  envIntensity?: number;
  /** Tone-mapping exposure. Default 1.0. */
  exposure?: number;
}

type MorphMesh = THREE.Mesh & { morphTargetDictionary: Record<string, number>; morphTargetInfluences: number[] };

export class GlbRenderer implements Renderer {
  readonly name = 'glb';
  updateMs = 0;
  readonly life: Life;
  private canvas: HTMLCanvasElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(20, 1, 0.01, 20);
  /** Rotates about the neck; the model hangs off it. */
  private readonly pivot = new THREE.Group();
  private model: THREE.Object3D | null = null;
  /** Per mesh, the morph index for each ARKit channel (-1 when the mesh lacks it). */
  private morphs: { mesh: MorphMesh; index: Int16Array }[] = [];
  private channels: string[] = [];
  private loader: GLTFLoader;
  private avatarUrl = '';
  private lastW = 0;
  private lastH = 0;
  private readonly opts: Required<Omit<GlbRendererOptions, keyof MouthOptions>>;

  constructor(opts: GlbRendererOptions = {}) {
    this.opts = {
      fov: opts.fov ?? 20,
      headFill: opts.headFill ?? 0.55,
      transparent: opts.transparent ?? true,
      background: opts.background ?? 0x000000,
      pixelRatioCap: opts.pixelRatioCap ?? 2,
      envIntensity: opts.envIntensity ?? 0.6,
      exposure: opts.exposure ?? 1.0,
    };
    // A mesh mouth can open further than splat lips before it looks wrong.
    this.life = new Life({ jawMax: opts.jawMax ?? 0.55, jawGain: opts.jawGain });
    this.loader = new GLTFLoader();
    this.loader.setMeshoptDecoder(MeshoptDecoder);
    this.scene.add(this.pivot);
    // Portrait light: warm key high front-left, soft cool fill right, rim from behind for the outline.
    const key = new THREE.DirectionalLight(0xfff1e2, 2.2);
    key.position.set(-1.0, 1.4, 1.6);
    const fill = new THREE.DirectionalLight(0xdde8ff, 0.6);
    fill.position.set(1.4, 0.4, 1.0);
    const rim = new THREE.DirectionalLight(0xffffff, 1.4);
    rim.position.set(0.6, 1.2, -1.6);
    this.scene.add(key, fill, rim, key.target, fill.target, rim.target);
  }

  /** Kept for the test page and the recorder. */
  get weights(): Record<string, number> { return this.life.weights; }
  get mouthScale(): number { return this.life.mouth.scale; }
  set mouthScale(k: number) { this.life.mouth.scale = k; }

  mount(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: this.opts.transparent, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.opts.pixelRatioCap));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = this.opts.exposure;
    if (!this.opts.transparent) r.setClearColor(this.opts.background, 1);
    const pmrem = new THREE.PMREMGenerator(r);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = this.opts.envIntensity;
    pmrem.dispose();
    this.renderer = r;
    this.camera.fov = this.opts.fov;
    this.resizeIfNeeded(true);
  }

  async setAvatar(url: string): Promise<void> {
    if (!this.renderer) throw new Error('avatarz: glb renderer not mounted');
    const gltf = await this.loader.loadAsync(url);
    const model = gltf.scene;
    const morphs: typeof this.morphs = [];
    const found = new Set<string>();
    model.traverse((o) => {
      const m = o as MorphMesh;
      if (!m.isMesh) return;
      m.frustumCulled = false;
      if (!m.morphTargetDictionary || !m.morphTargetInfluences) return;
      const index = new Int16Array(ARKIT.length).fill(-1);
      ARKIT.forEach((n, i) => { const k = m.morphTargetDictionary[n]; if (k !== undefined) { index[i] = k; found.add(n); } });
      morphs.push({ mesh: m, index });
    });
    if (!found.has('jawOpen')) console.warn('avatarz: glb head has no ARKit jawOpen morph; the mouth will not move', url);

    this.clearModel();
    this.morphs = morphs;
    this.channels = ARKIT.filter((n) => found.has(n));
    this.avatarUrl = url;

    // Hang the model off a pivot at the neck so head turns bend there, not at the nose.
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const neck = new THREE.Vector3((box.min.x + box.max.x) / 2, box.min.y + size.y * 0.3, box.min.z + size.z * 0.45);
    this.pivot.position.copy(neck);
    model.position.sub(neck);
    this.pivot.add(model);
    this.model = model;
    this.frameCamera(box);
  }

  /** Head and shoulders: centre a little above the middle of the box, sized by headFill. */
  private frameCamera(box: THREE.Box3): void {
    const size = box.getSize(new THREE.Vector3());
    // The crown-to-chin span is roughly the top 55% of a bust export.
    const headH = size.y * 0.55;
    const target = new THREE.Vector3((box.min.x + box.max.x) / 2, box.max.y - headH * 0.52, (box.min.z + box.max.z) / 2);
    const viewH = headH / this.opts.headFill;
    const dist = viewH / 2 / Math.tan(THREE.MathUtils.degToRad(this.opts.fov) / 2);
    this.camera.position.set(target.x, target.y + headH * 0.04, target.z + dist + size.z * 0.5);
    this.camera.near = dist * 0.05;
    this.camera.far = dist * 10;
    this.camera.lookAt(target);
    this.camera.updateProjectionMatrix();
    this.scene.children.forEach((c) => { if ((c as THREE.DirectionalLight).isDirectionalLight) (c as THREE.DirectionalLight).target.position.copy(target); });
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

  getAvatarMeta(): AvatarMeta | null {
    if (!this.model) return null;
    // The demo checks for the VRM mouth names; an ARKit head with jawOpen and blinks covers all of them.
    const has = (n: string) => this.channels.includes(n);
    const expressions = has('jawOpen') ? ['aa', 'ih', 'ou', 'ee', 'oh'] : [];
    if (has('eyeBlinkLeft') && has('eyeBlinkRight')) expressions.push('blink');
    return { name: this.avatarUrl.split('/').pop()?.replace(/\.glb$/i, ''), version: `glb · ${this.channels.length}/52 ARKit`, expressions };
  }

  snapshot(): Record<string, number> { return this.life.snapshot(); }
  setState(state: HeadState): void { this.life.setState(state); }
  setEmotion(emotion: Emotion, intensity = 1): void { this.life.setEmotion(emotion, intensity); }
  setEmotionMix(mix: Partial<Record<Exclude<Emotion, 'neutral'>, number>>): void { this.life.setEmotionMix(mix); }
  setAttention(a: Viewer | null): void { this.life.setViewer(a); }

  frame(v: VisemeFrame, dt: number): void {
    const t0 = performance.now();
    const r = this.renderer;
    if (!r) return;
    this.resizeIfNeeded();
    this.life.frame(v, dt);
    if (this.model) {
      const w = this.life.weights;
      for (const { mesh, index } of this.morphs) {
        const inf = mesh.morphTargetInfluences;
        for (let i = 0; i < index.length; i++) { const k = index[i]; if (k >= 0) inf[k] = w[ARKIT[i]] ?? 0; }
      }
      const [pitch, yaw, roll] = this.life.neckPose(['head']).head;
      this.pivot.rotation.set(pitch, yaw, roll, 'YXZ');
    }
    this.updateMs = performance.now() - t0;
    r.render(this.scene, this.camera);
  }

  private clearModel(): void {
    if (!this.model) return;
    this.pivot.remove(this.model);
    this.model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.geometry.dispose();
      for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
        for (const v of Object.values(mat)) if ((v as THREE.Texture)?.isTexture) (v as THREE.Texture).dispose();
        mat.dispose();
      }
    });
    this.model = null;
    this.morphs = [];
  }

  dispose(): void {
    this.clearModel();
    this.scene.environment?.dispose();
    this.renderer?.dispose();
    this.renderer = null;
    this.canvas = null;
  }
}
