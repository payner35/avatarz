import { A as e, B as t, G as n, H as r, L as i, M as a, N as o, O as s, R as c, S as l, T as u, U as d, V as f, W as p, X as m, Y as h, _ as g, at as _, c as v, ct as y, d as b, ft as x, gt as S, ht as C, i as w, j as T, k as E, l as D, lt as O, n as k, o as A, ot as j, p as M, q as ee, r as te, st as ne, t as re, u as N, v as ie, w as ae, x as oe, y as se, z as P } from "./GLTFLoader-CPqKwYJ9.js";
// src/tap.ts
var ce = 1;
function le(e) {
	let { context: t, source: n } = e, r = e.audibleDelay ?? .1, i = e.destination === void 0 ? t.destination : e.destination, a = null, o = !1;
	if (i && r > 0) {
		try {
			n.disconnect(i);
		} catch {}
		a = new DelayNode(t, {
			maxDelayTime: ce,
			delayTime: Math.min(r, ce)
		}), n.connect(a).connect(i), o = !0;
	}
	return {
		context: t,
		source: n,
		delayNode: a,
		getDelay: () => a?.delayTime.value ?? 0,
		setDelay(e) {
			if (!a) return;
			let n = Math.max(0, Math.min(ce, e));
			a.delayTime.setTargetAtTime(n, t.currentTime, .02);
		},
		outputLatency: () => t.outputLatency ?? 0,
		outputTimestamp: () => t.getOutputTimestamp(),
		dispose() {
			if (o && a && i) {
				try {
					n.disconnect(a), a.disconnect();
				} catch {}
				try {
					n.connect(i);
				} catch {}
			}
			a = null, o = !1;
		}
	};
}
// src/types.ts
var F = [
	"sil",
	"PP",
	"FF",
	"TH",
	"DD",
	"kk",
	"CH",
	"SS",
	"nn",
	"RR",
	"aa",
	"E",
	"I",
	"O",
	"U"
], I = Object.freeze(Object.fromEntries(F.map((e, t) => [e, t]))), L = F.length, R = /* @__PURE__ */ "browDownLeft.browDownRight.browInnerUp.browOuterUpLeft.browOuterUpRight.cheekPuff.cheekSquintLeft.cheekSquintRight.eyeBlinkLeft.eyeBlinkRight.eyeLookDownLeft.eyeLookDownRight.eyeLookInLeft.eyeLookInRight.eyeLookOutLeft.eyeLookOutRight.eyeLookUpLeft.eyeLookUpRight.eyeSquintLeft.eyeSquintRight.eyeWideLeft.eyeWideRight.jawForward.jawLeft.jawOpen.jawRight.mouthClose.mouthDimpleLeft.mouthDimpleRight.mouthFrownLeft.mouthFrownRight.mouthFunnel.mouthLeft.mouthLowerDownLeft.mouthLowerDownRight.mouthPressLeft.mouthPressRight.mouthPucker.mouthRight.mouthRollLower.mouthRollUpper.mouthShrugLower.mouthShrugUpper.mouthSmileLeft.mouthSmileRight.mouthStretchLeft.mouthStretchRight.mouthUpperUpLeft.mouthUpperUpRight.noseSneerLeft.noseSneerRight.tongueOut".split("."), z = Object.freeze(Object.fromEntries(R.map((e, t) => [e, t])));
function ue() {
	let e = new Float32Array(L);
	return e[0] = 1, {
		visemes: e,
		jawOpen: 0,
		energy: 0,
		speaking: !1,
		t: 0
	};
}
var B = (e) => e < 0 ? 0 : e > 1 ? 1 : e;
function V(e, t, n) {
	let r = B((n - e) / (t - e));
	return r * r * (3 - 2 * r);
}
function de(e, t, n, r, i) {
	let a = 1 - Math.exp(-(t > e ? r : i) * n);
	return e + (t - e) * a;
}
// src/extract/energy.ts
var fe = class {
	threshold;
	silenceMs;
	fftSize;
	analyser = null;
	buf = /* @__PURE__ */ new Float32Array();
	source = null;
	onsetAt = 0;
	onsetId = 0;
	lastLoudAt = 0;
	quiet = !0;
	constructor(e = .02, t = 250, n = 512) {
		this.threshold = e, this.silenceMs = t, this.fftSize = n;
	}
	start(e, t) {
		this.stop(), this.analyser = new AnalyserNode(t, {
			fftSize: this.fftSize,
			smoothingTimeConstant: 0
		}), this.buf = new Float32Array(this.fftSize), e.connect(this.analyser), this.source = e;
	}
	stop() {
		if (this.source && this.analyser) try {
			this.source.disconnect(this.analyser);
		} catch {}
		this.analyser = null, this.source = null;
	}
	reset() {
		this.quiet = !0, this.lastLoudAt = 0;
	}
	read(e) {
		let t = this.analyser;
		if (!t) return 0;
		t.getFloatTimeDomainData(this.buf);
		let n = 0, r = this.buf;
		for (let e = 0; e < r.length; e++) n += r[e] * r[e];
		let i = Math.sqrt(n / r.length);
		return i > this.threshold ? (this.quiet && (this.quiet = !1, this.onsetAt = e, this.onsetId++), this.lastLoudAt = e) : !this.quiet && e - this.lastLoudAt > this.silenceMs && (this.quiet = !0), i;
	}
}, pe = class {
	constructor(e) {
		Object.assign({}, e || {}), this.vectorDiff = /* @__PURE__ */ new Float32Array(12), this.matrixL = Array.from({ length: 12 }, () => /* @__PURE__ */ new Float32Array(12)), this.matrixLInv = Array.from({ length: 12 }, () => /* @__PURE__ */ new Float32Array(12)), this.matrixSigma = Array.from({ length: 12 }, () => /* @__PURE__ */ new Float32Array(12)), this.indexSigmaInvLower = this._buildSigmaInvLowerLookup();
	}
	_buildSigmaInvLowerLookup() {
		let e = Array.from({ length: 12 }, () => /* @__PURE__ */ new Uint16Array(12)), t = 0;
		for (let n = 0; n < 12; n++) for (let r = 0; r <= n; r++) e[n][r] = t, e[r][n] = t, t++;
		return e;
	}
	computePrototype(e, t, n, r) {
		let i = r.length;
		if (i < 12) throw Error(`Not enough samples (${i}) to compute full covariance.`);
		let a = /* @__PURE__ */ new Float32Array(92), o = new DataView(a.buffer, 0, 8), s = (e?.codePointAt(0) || 0) << 16 | (e?.codePointAt(1) || 0);
		o.setUint32(0, s), o.setUint8(5, t), o.setUint8(7, n);
		let c = new Float32Array(a.buffer, 8, 12), l = new Float32Array(a.buffer, 56, 78);
		for (let e = 0; e < i; e++) {
			let t = r[e];
			for (let e = 0; e < 12; e++) c[e] += t[e];
		}
		let u = 1 / i;
		for (let e = 0; e < 12; e++) c[e] *= u;
		let d = this.matrixSigma;
		d.forEach((e) => e.fill(0));
		let f = 1 / (i - 1);
		for (let e = 0; e < i; e++) {
			let t = r[e];
			for (let e = 0; e < 12; e++) {
				let n = t[e] - c[e];
				for (let r = e; r < 12; r++) d[e][r] += n * (t[r] - c[r]);
			}
		}
		for (let e = 0; e < 12; e++) for (let t = e; t < 12; t++) {
			let n = d[e][t] * f;
			d[e][t] = n, e !== t && (d[t][e] = n);
		}
		let p = 0;
		for (let e = 0; e < 12; e++) p += d[e][e];
		let m = p / 12 * 1e-5;
		for (let e = 0; e < 12; e++) d[e][e] += m;
		let h = this.matrixL;
		h.forEach((e) => e.fill(0));
		for (let e = 0; e < 12; e++) for (let t = 0; t <= e; t++) {
			let n = d[e][t];
			for (let r = 0; r < t; r++) n -= h[e][r] * h[t][r];
			if (e === t) {
				if (n <= 0) throw Error("Matrix is not positive definite.");
				h[e][t] = Math.sqrt(n);
			} else h[e][t] = n / h[t][t];
		}
		let g = this.matrixLInv;
		g.forEach((e) => e.fill(0));
		for (let e = 0; e < 12; e++) {
			g[e][e] = 1 / h[e][e];
			for (let t = 0; t < e; t++) {
				let n = 0;
				for (let r = t; r < e; r++) n -= h[e][r] * g[r][t];
				g[e][t] = n / h[e][e];
			}
		}
		let _ = Array.from({ length: 12 }, () => /* @__PURE__ */ new Float32Array(12)), v = 0;
		for (let e = 0; e < 12; e++) for (let t = 0; t <= e; t++) {
			let n = 0;
			for (let r = Math.max(e, t); r < 12; r++) r >= e && r >= t && (n += g[r][e] * g[r][t]);
			_[e][t] = n, _[t][e] = n, l[v] = n, v++;
		}
		return {
			mu: c,
			sigmaInv: _,
			sigmaInvLower: l,
			bin: a.buffer
		};
	}
	decodeBinaryRecord(e) {
		let t = new DataView(e.buffer, e.byteOffset, 8), n = t.getUint32(0), r = n >>> 16, i = 65535 & n;
		return {
			phoneme: i === 0 ? String.fromCodePoint(r) : String.fromCodePoint(r, i),
			group: t.getUint8(5),
			viseme: t.getUint8(7),
			mu: new Float32Array(e.buffer, e.byteOffset + 8, 12),
			sigmaInvLower: new Float32Array(e.buffer, e.byteOffset + 56, 78)
		};
	}
	async loadModel(e, t = null) {
		let n = await fetch(e);
		if (!n.ok) throw Error(`Failed to fetch model: ${n.status} ${n.statusText}`);
		let r = await n.arrayBuffer(), i = [], a = r.byteLength, o = 0;
		for (; o + 368 <= a;) {
			let e = new Float32Array(r, o, 92), n = this.decodeBinaryRecord(e);
			t !== null && (n.group = t), i.push(n), o += 368;
		}
		if (i.length === 0) throw Error("Fetched model is empty");
		return {
			model: i,
			buffer: r
		};
	}
	update(e) {
		for (let t in e);
	}
}, me = class extends AudioWorkletNode {
	constructor(e, t = null) {
		let n = Object.assign({}, t || {});
		super(e, "headworklet", {
			numberOfInputs: 1,
			numberOfOutputs: 0,
			channelCount: 1,
			channelCountMode: "explicit",
			channelInterpretation: "speakers",
			outputChannelCount: [],
			processorOptions: n?.processorOptions || {},
			parameterData: n?.parameterData || {}
		}), this.frameEventsEnabled = !!n.processorOptions?.frameEventsEnabled, this.vadEventsEnabled = !!n.processorOptions?.vadEventsEnabled, this.featureEventsEnabled = !!n.processorOptions?.featureEventsEnabled, this.visemeEventsEnabled = !!n.processorOptions?.visemeEventsEnabled, this.visemeNames = [
			"viseme_aa",
			"viseme_E",
			"viseme_I",
			"viseme_O",
			"viseme_U",
			"viseme_PP",
			"viseme_SS",
			"viseme_TH",
			"viseme_DD",
			"viseme_FF",
			"viseme_kk",
			"viseme_nn",
			"viseme_RR",
			"viseme_CH",
			"viseme_sil"
		], this.nVisemes = this.visemeNames.length, this.visemeMaxs = [
			.65,
			.65,
			.65,
			.65,
			.65,
			.75,
			.65,
			.65,
			.65,
			.75,
			.65,
			.65,
			.65,
			.65,
			.65
		], this.visemeAlphas = Array(this.nVisemes).fill(0), this.visemeActive = -1, this.easing = this.sigmoidFactory(5), this.onvalue = null, this.onframe = null, this.onsentence = null, this.onstarted = null, this.onended = null, this.onfeature = null, this.onviseme = null, this.training = new pe(), this.timerCounter = 0, this.isRunning = !0, this.port.onmessage = this._onmessage.bind(this);
	}
	sigmoidFactory(e) {
		function t(t) {
			return 1 / (1 + Math.exp(-e * t)) - .5;
		}
		var n = .5 / t(1);
		return function(e) {
			return n * t(2 * Math.max(Math.min(e, 1), 0) - 1) + .5;
		};
	}
	_onmessage(e) {
		let t = e.data;
		switch (t.event) {
			case "frame":
				this.frameEventsEnabled && this.onframe && typeof this.onframe == "function" && this.onframe(t);
				break;
			case "vad":
				this.vadEventsEnabled && this.onvad && typeof this.onvad == "function" && this.onvad(t);
				break;
			case "feature":
				this.featureEventsEnabled && this.onfeature && typeof this.onfeature == "function" && this.onfeature(t);
				break;
			case "viseme":
				let e = t.viseme;
				Number.isInteger(e) && (this.visemeActive = e === 14 ? -1 : e), this.visemeEventsEnabled && this.onviseme && typeof this.onviseme == "function" && this.onviseme(t);
				break;
			case "started":
				this.onstarted && typeof this.onstarted == "function" && this.onstarted(t);
				break;
			case "ended":
				this.visemeActive = -1, this.lastEndEvent = performance.now(), this.onended && typeof this.onended == "function" && this.onended(t);
				break;
			case "calibrated":
				try {
					let { mu: e, sigmaInvLower: n, bin: r } = this.training.computePrototype("sc", 255, 14, t.vs);
					this.port.postMessage({
						event: "model",
						model: [{
							phoneme: "sc",
							group: 255,
							viseme: 14,
							mu: e,
							sigmaInvLower: n
						}]
					}, [r]);
				} catch (e) {
					t.error = e, console.error(e);
				}
				this.oncalibrated && typeof this.oncalibrated == "function" && this.oncalibrated(t);
		}
	}
	async loadModel(e, t = !0) {
		let { model: n, buffer: r } = await this.training.loadModel(e);
		t && this.port.postMessage({ event: "reset" }), this.port.postMessage({
			event: "model",
			model: n
		}, [r]);
	}
	update(e) {
		let t = e / 100;
		for (let e = 0; e < this.nVisemes; e++) {
			let n = this.visemeAlphas[e], r = !1;
			if (e === this.visemeActive ? (r = !0, n < 1 && (n += t, n > .99 && (n = 1))) : n > 0 && (r = !0, n -= t, n < .01 && (n = 0)), r) {
				let t = this.visemeMaxs[e] * this.easing(n);
				this.onvalue && typeof this.onvalue == "function" && this.onvalue(this.visemeNames[e], t), this.visemeAlphas[e] = n;
			}
		}
	}
	start() {
		this.isRunning = !0, this.port.postMessage({ event: "start" });
	}
	stop() {
		this.isRunning = !1, this.port.postMessage({ event: "stop" });
	}
	calibrate() {
		this.port.postMessage({ event: "calibrate" });
	}
	resetAll() {
		this.port.postMessage({ event: "reset" });
	}
	resetTimer() {
		this.timerCounter++, this.parameters.get("timerReset").value = this.timerCounter;
	}
}, he = "./assets/headaudio/", ge = new URL(he + "headworklet.min.mjs", import.meta.url), _e = new URL(he + "model-en-mixed.bin", import.meta.url), ve = /* @__PURE__ */ new WeakMap(), ye = class {
	name = "headaudio";
	get latencyMs() {
		return 60 + this.leadMs;
	}
	leadMs;
	node = null;
	source = null;
	energy = new fe();
	frame = ue();
	target = new Float32Array(L);
	remap = /* @__PURE__ */ new Int8Array();
	lastT = 0;
	lastActiveAt = 0;
	speaking = !1;
	workletUrl;
	modelUrl;
	openRate;
	closeRate;
	silenceMs;
	softness;
	protoViseme = /* @__PURE__ */ new Int8Array();
	distances = null;
	softTarget = new Float32Array(L);
	constructor(e = {}) {
		this.workletUrl = e.workletUrl ?? ge, this.modelUrl = e.modelUrl ?? _e, this.openRate = e.openRate ?? 15, this.closeRate = e.closeRate ?? 18, this.silenceMs = e.silenceMs ?? 250, this.softness = e.softness ?? .7, this.leadMs = e.leadMs ?? 60;
	}
	async start(e, t) {
		this.stop();
		let n = ve.get(t);
		n || (n = t.audioWorklet.addModule(this.workletUrl.toString()), ve.set(t, n), n.catch(() => ve.delete(t))), await n;
		let r = new me(t, { processorOptions: { visemeEventsEnabled: this.softness > 0 } }), { model: i, buffer: a } = await r.training.loadModel(this.modelUrl.toString());
		this.protoViseme = Int8Array.from(i.map((e) => e.viseme)), r.port.postMessage({ event: "reset" }), r.port.postMessage({
			event: "model",
			model: i
		}, [a]), this.remap = new Int8Array(r.visemeNames.length), r.visemeNames.forEach((e, t) => {
			let n = e.replace(/^viseme_/, "");
			this.remap[t] = I[n] ?? 0;
		}), r.onstarted = () => {
			this.speaking = !0;
		}, r.onended = () => {
			this.speaking = !1, this.distances = null;
		}, this.softness > 0 && (r.onviseme = (e) => {
			e.distances && (this.distances = Float32Array.from(e.distances));
		}), e.connect(r), this.energy.start(e, t), this.node = r, this.source = e, this.lastT = performance.now(), r.start();
	}
	stop() {
		if (this.node) {
			try {
				this.node.stop();
			} catch {}
			try {
				this.source?.disconnect(this.node);
			} catch {}
			this.node.port.close();
		}
		this.energy.stop(), this.node = null, this.source = null, this.reset();
	}
	reset() {
		this.node?.resetAll(), this.node && (this.node.visemeActive = -1), this.distances = null, this.speaking = !1, this.energy.reset(), this.target.fill(0), this.frame.visemes.fill(0), this.frame.visemes[0] = 1, this.frame.jawOpen = 0, this.frame.speaking = !1;
	}
	get meter() {
		return this.energy;
	}
	read() {
		let e = performance.now(), t = Math.min(.1, Math.max(0, (e - this.lastT) / 1e3));
		this.lastT = e;
		let n = this.frame, r = this.node;
		n.energy = B(this.energy.read(e) * 3);
		let i = r ? r.visemeActive : -1, a = this.target;
		if (a.fill(0), i >= 0 && this.speaking) {
			this.lastActiveAt = e;
			let t = this.distances;
			if (t && this.softness > 0 && t.length === this.protoViseme.length) {
				let e = this.softTarget;
				e.fill(Infinity);
				for (let n = 0; n < t.length; n++) {
					let r = this.remap[this.protoViseme[n]];
					t[n] < e[r] && (e[r] = t[n]);
				}
				let n = Infinity;
				for (let t = 0; t < L; t++) e[t] < n && (n = e[t]);
				let r = 0;
				for (let t = 0; t < L; t++) {
					let i = e[t] === Infinity ? 0 : Math.exp(-(e[t] - n) / this.softness);
					a[t] = i, r += i;
				}
				for (let e = 0; e < L; e++) a[e] /= r;
				let i = 1 - a[0];
				if (i > 0) {
					for (let e = 1; e < L; e++) a[e] /= i;
					a[0] = 0;
				}
			} else a[this.remap[i]] = 1;
		} else e - this.lastActiveAt > this.silenceMs && (a[0] = 1);
		let o = n.visemes;
		for (let e = 0; e < L; e++) o[e] = de(o[e], a[e], t, this.openRate, this.closeRate);
		return n.jawOpen = B(Math.max(o[I.aa], .75 * o[I.O], .55 * o[I.E], .4 * o[I.I], .35 * o[I.U], .3 * o[I.kk], .25 * o[I.DD]) * (1 - Math.max(o[I.PP], o[I.FF])) * (.6 + .4 * n.energy)), n.speaking = this.speaking || e - this.lastActiveAt < this.silenceMs, n.t = e, n;
	}
}, be = class {
	name = "formant";
	latencyMs = 25;
	analyser = null;
	source = null;
	spec = /* @__PURE__ */ new Float32Array();
	energy = new fe();
	frame = ue();
	target = new Float32Array(L);
	binHz = 0;
	f1 = 500;
	f2 = 1500;
	bright = 0;
	lastT = 0;
	lastLoudAt = 0;
	opts;
	constructor(e = {}) {
		this.opts = {
			fftSize: e.fftSize ?? 1024,
			tau: e.tau ?? .08,
			gate: e.gate ?? .015,
			loud: e.loud ?? .2,
			silenceMs: e.silenceMs ?? 250
		};
	}
	async start(e, t) {
		this.stop();
		let n = new AnalyserNode(t, {
			fftSize: this.opts.fftSize,
			smoothingTimeConstant: .2
		});
		this.spec = new Float32Array(n.frequencyBinCount), this.binHz = t.sampleRate / this.opts.fftSize, e.connect(n), this.energy.start(e, t), this.analyser = n, this.source = e, this.lastT = performance.now();
	}
	stop() {
		if (this.analyser && this.source) try {
			this.source.disconnect(this.analyser);
		} catch {}
		this.energy.stop(), this.analyser = null, this.source = null, this.reset();
	}
	reset() {
		this.energy.reset(), this.target.fill(0), this.frame.visemes.fill(0), this.frame.visemes[0] = 1, this.frame.jawOpen = 0, this.frame.speaking = !1, this.lastLoudAt = 0;
	}
	get meter() {
		return this.energy;
	}
	peak(e, t) {
		let n = this.spec, r = Math.max(1, Math.floor(e / this.binHz)), i = Math.min(n.length - 2, Math.ceil(t / this.binHz)), a = r, o = -Infinity;
		for (let e = r; e <= i; e++) n[e] > o && (o = n[e], a = e);
		let s = n[a - 1], c = n[a], l = n[a + 1], u = s - 2 * c + l, d = u === 0 ? 0 : .5 * (s - l) / u;
		return {
			hz: (a + d) * this.binHz,
			db: o
		};
	}
	bandEnergy(e, t) {
		let n = this.spec, r = Math.max(0, Math.floor(e / this.binHz)), i = Math.min(n.length - 1, Math.ceil(t / this.binHz)), a = 0;
		for (let e = r; e <= i; e++) a += 10 ** (n[e] / 10);
		return a;
	}
	read() {
		let e = performance.now(), t = Math.min(.1, Math.max(0, (e - this.lastT) / 1e3));
		this.lastT = e;
		let n = this.frame, r = this.analyser, { gate: i, loud: a, tau: o, silenceMs: s } = this.opts, c = this.energy.read(e);
		n.energy = B(c * 3);
		let l = V(i, a, c), u = l > 0;
		u && (this.lastLoudAt = e);
		let d = e - this.lastLoudAt < s, f = this.target;
		if (f.fill(0), r && u) {
			r.getFloatFrequencyData(this.spec);
			let e = this.peak(250, 1e3), n = this.peak(Math.max(1e3, e.hz + 300), 3200), i = 1 - Math.exp(-t / o);
			this.f1 += (e.hz - this.f1) * i, this.f2 += (n.hz - this.f2) * i;
			let a = this.bandEnergy(100, 8e3) + 1e-9, s = this.bandEnergy(3500, 8e3);
			this.bright += (s / a - this.bright) * i;
			let c = this.f1, u = this.f2, d = V(550, 850, c), p = 1 - V(1e3, 1400, u), m = V(1700, 2300, u), h = 1 - V(380, 560, c), g = h * p, _ = V(430, 650, c) * p * (1 - d), v = h * m, y = V(430, 650, c) * m * (1 - d), b = V(.25, .55, this.bright), x = 1 - b;
			f[I.aa] = d * x * l, f[I.O] = _ * x * l, f[I.U] = g * x * l, f[I.I] = v * x * l, f[I.E] = y * x * l, f[I.SS] = b * l;
			let S = d + _ + g + v + y;
			f[I.DD] = B(1 - S) * x * l * .6;
		} else d || (f[0] = 1);
		let p = n.visemes;
		for (let e = 0; e < L; e++) p[e] = de(p[e], f[e], t, 18, 20);
		return n.jawOpen = B(Math.max(p[I.aa], .75 * p[I.O], .55 * p[I.E], .4 * p[I.I], .35 * p[I.U], .5 * p[I.DD], .2 * p[I.SS]) * (.5 + .5 * l)), n.speaking = d, n.t = e, n;
	}
}, xe = "avatarz-wav2arkit-v1", Se = [
	z.jawOpen,
	z.mouthFunnel,
	z.mouthPucker,
	z.mouthLowerDownLeft,
	z.mouthLowerDownRight,
	z.mouthUpperUpLeft,
	z.mouthUpperUpRight,
	z.mouthStretchLeft,
	z.mouthStretchRight,
	z.tongueOut
], Ce = "\nclass AvatarzCapture extends AudioWorkletProcessor {\n  constructor(o) { super(); this.n = o.processorOptions.chunk; this.buf = new Float32Array(this.n); this.i = 0; this.start = 0; }\n  process(inputs) {\n    const ch = inputs[0] && inputs[0][0]; if (!ch) return true;\n    const base = currentFrame;\n    for (let k = 0; k < ch.length; k++) {\n      if (this.i === 0) this.start = base + k;\n      this.buf[this.i++] = ch[k];\n      if (this.i === this.n) {\n        this.port.postMessage({ pcm: this.buf, t: this.start / sampleRate }, [this.buf.buffer]);\n        this.buf = new Float32Array(this.n); this.i = 0;\n      }\n    }\n    return true;\n  }\n}\nregisterProcessor('avatarz-capture', AvatarzCapture);", we = /* @__PURE__ */ new WeakSet();
async function Te(e, t) {
	let n = null, r = 0;
	try {
		r = Number((await fetch(e, { method: "HEAD" })).headers.get("content-length") ?? 0);
	} catch {}
	try {
		n = await caches.open(xe);
		let t = await n.match(e);
		if (t) {
			let i = await t.arrayBuffer();
			if (!r || i.byteLength === r) return i;
			await n.delete(e);
		}
	} catch {}
	let i = await fetch(e);
	if (!i.ok) throw Error(`avatarz: failed to fetch ${e} (${i.status})`);
	let a = Number(i.headers.get("content-length") ?? 0);
	if (!i.body || !t) {
		let t = await i.arrayBuffer();
		try {
			await n?.put(e, new Response(t));
		} catch {}
		return t;
	}
	let o = i.body.getReader(), s = [], c = 0;
	for (;;) {
		let { done: e, value: n } = await o.read();
		if (e) break;
		s.push(n), c += n.byteLength, t(c, a);
	}
	let l = new Uint8Array(c), u = 0;
	for (let e of s) l.set(e, u), u += e.byteLength;
	if (a && c !== a) throw Error(`avatarz: short download of ${e}: ${c} of ${a} bytes`);
	try {
		await n?.put(e, new Response(l.buffer));
	} catch {}
	return l.buffer;
}
var Ee = class {
	name = "wav2arkit";
	get latencyMs() {
		let e = this.recentInfer, t = this.inferMs;
		if (e.length >= 5) {
			let n = [...e].sort((e, t) => e - t);
			t = n[Math.floor(.9 * (n.length - 1))];
		}
		return Math.min(900, this.opts.chunkMs + Math.max(60, t) + Math.max(0, -this.opts.frameOffset * 1e3) + 50);
	}
	recentInfer = [];
	opts;
	session = null;
	ort = null;
	inputName = "";
	outputName = "";
	node = null;
	source = null;
	context = null;
	energy = new fe();
	frame = ue();
	timeline = [];
	gate = 0;
	lastChunkFrame = null;
	envelopeFollow = .85;
	current = new Float32Array(R.length);
	pending = null;
	syncOffset = 0;
	synced = !1;
	lastShown = -1;
	lateFrames = 0;
	busy = !1;
	silentChunks = 0;
	lastT = 0;
	loggedError = !1;
	progress = 0;
	provider = "";
	threads = 1;
	inferMs = 0;
	chunksIn = 0;
	chunksRun = 0;
	chunksDropped = 0;
	ready = Promise.resolve();
	constructor(e = {}) {
		this.opts = {
			modelBaseUrl: e.modelBaseUrl ?? new URL("./assets/wav2arkit/", import.meta.url),
			modelFile: e.modelFile ?? "wav2arkit_int8.onnx",
			ortWasmUrl: e.ortWasmUrl ?? new URL("./assets/ort/", import.meta.url),
			chunkMs: e.chunkMs ?? 150,
			frameOffset: e.frameOffset ?? -.16,
			fps: e.fps ?? 30,
			silencePeak: e.silencePeak ?? .002,
			executionProviders: e.executionProviders ?? ["wasm"],
			numThreads: e.numThreads ?? 1,
			proxy: e.proxy ?? !0,
			onProgress: e.onProgress
		}, this.frame.arkit = this.current;
	}
	get meter() {
		return this.energy;
	}
	async loadModel() {
		if (this.session) return;
		let e = this.ort ??= await import("./ort.min-qJcny31L.js"), t = this.opts.ortWasmUrl.toString().replace(/\/?$/, "/");
		e.env.wasm.wasmPaths = t, e.env.wasm.numThreads = this.opts.numThreads;
		let n = this.opts.executionProviders[0] === "webgpu" && "gpu" in navigator;
		e.env.wasm.proxy = !n && this.opts.proxy;
		let r = this.opts.modelBaseUrl.toString().replace(/\/?$/, "/"), i = (e, t) => {
			this.progress = t ? e / t : 0, this.opts.onProgress?.(this.progress);
		}, a = this.opts.modelFile, o = !1;
		try {
			o = (await fetch(r + a + ".data", { method: "HEAD" })).ok;
		} catch {}
		let [s, c] = await Promise.all([Te(r + a, o ? void 0 : i), o ? Te(r + a + ".data", i) : Promise.resolve(null)]);
		this.progress = 1, this.opts.onProgress?.(1);
		let l = c ? [{
			path: a + ".data",
			data: c
		}] : void 0, u = n ? this.opts.executionProviders : this.opts.executionProviders.filter((e) => e !== "webgpu");
		try {
			this.session = await e.InferenceSession.create(s, {
				executionProviders: u,
				externalData: l
			}), this.provider = u[0], this.threads = this.opts.numThreads;
		} catch (t) {
			if (!n) throw t;
			console.warn("avatarz: WebGPU session failed, using WASM", t), e.env.wasm.proxy = !0, this.session = await e.InferenceSession.create(s.slice(0), {
				executionProviders: ["wasm"],
				externalData: c ? [{
					path: a + ".data",
					data: c.slice(0)
				}] : void 0
			}), this.provider = "wasm";
		}
		this.inputName = this.session.inputNames[0], this.outputName = this.session.outputNames[0];
		try {
			await this.infer(new Float32Array(Math.round(16 * this.opts.chunkMs)));
		} catch {}
		this.inferMs = 0, this.recentInfer.length = 0;
	}
	async start(e, t) {
		if (this.stop(), this.context = t, this.ready = this.loadModel(), !we.has(t)) {
			let e = URL.createObjectURL(new Blob([Ce], { type: "text/javascript" }));
			try {
				await t.audioWorklet.addModule(e);
			} finally {
				URL.revokeObjectURL(e);
			}
			we.add(t);
		}
		let n = Math.round(this.opts.chunkMs / 1e3 * t.sampleRate), r = new AudioWorkletNode(t, "avatarz-capture", {
			numberOfInputs: 1,
			numberOfOutputs: 0,
			channelCount: 1,
			channelCountMode: "explicit",
			processorOptions: { chunk: n }
		});
		r.port.onmessage = (e) => this.onChunk(e.data.pcm, e.data.t), e.connect(r), this.energy.start(e, t), this.node = r, this.source = e, this.lastT = performance.now(), await this.ready;
	}
	stop() {
		if (this.node) {
			try {
				this.source?.disconnect(this.node);
			} catch {}
			this.node.port.close();
		}
		this.energy.stop(), this.node = null, this.source = null, this.reset();
	}
	sync(e, t) {
		this.syncOffset = e + t, this.synced = !0;
	}
	reset() {
		this.timeline.length = 0, this.pending = null, this.silentChunks = 0, this.lastShown = -1, this.gate = 0, this.lastChunkFrame = null, this.current.fill(0), this.frame.visemes.fill(0), this.frame.visemes[0] = 1, this.frame.jawOpen = 0, this.frame.speaking = !1, this.energy.reset();
	}
	onChunk(e, t) {
		let n = 0;
		for (let t = 0; t < e.length; t++) {
			let r = Math.abs(e[t]);
			r > n && (n = r);
		}
		if (n < this.opts.silencePeak) {
			if (++this.silentChunks >= 2) {
				this.pending = null;
				let e = Math.round(this.opts.chunkMs / 1e3 * this.opts.fps);
				for (let n = 0; n < e; n++) this.push(t + this.opts.frameOffset + (n + .5) / this.opts.fps, new Float32Array(R.length), 0);
				return;
			}
		} else this.silentChunks = 0;
		this.chunksIn++, this.pending && this.chunksDropped++, this.pending = {
			pcm: e,
			t
		}, this.drain();
	}
	frameEnergy(e, t, n) {
		let r = e.length / n, i = Math.floor(t * r), a = Math.min(e.length, Math.floor((t + 1) * r)), o = 0;
		for (let t = i; t < a; t++) o += e[t] * e[t];
		return Math.sqrt(o / Math.max(1, a - i));
	}
	push(e, t, n) {
		let r = this.timeline;
		if (r.length && e <= r[r.length - 1].t) {
			let i = r.length - 1;
			for (; i > 0 && r[i - 1].t > e;) i--;
			r.splice(i, 0, {
				t: e,
				w: t,
				e: n
			});
		} else r.push({
			t: e,
			w: t,
			e: n
		});
		r.length > this.opts.fps * 4 && r.splice(0, r.length - this.opts.fps * 4);
	}
	async drain() {
		if (this.busy || !this.pending || !this.session) return;
		let { pcm: e, t } = this.pending;
		this.pending = null, this.busy = !0;
		try {
			let n = await this.resample(e), r = await this.infer(n);
			this.chunksRun++;
			let i = this.lastChunkFrame;
			if (i && r.length >= 2) for (let e = 0; e < r[0].length; e++) r[0][e] = .5 * i[e] + .5 * r[0][e], r[1][e] = .25 * i[e] + .75 * r[1][e];
			this.lastChunkFrame = r[r.length - 1].slice(), r.forEach((n, i) => this.push(t + this.opts.frameOffset + (i + .5) / this.opts.fps, n, this.frameEnergy(e, i, r.length)));
		} catch (e) {
			this.loggedError || (this.loggedError = !0, console.warn("avatarz: wav2arkit inference failed", e));
		} finally {
			this.busy = !1, this.pending && this.drain();
		}
	}
	async resample(e) {
		let t = this.context?.sampleRate ?? 24e3;
		if (t === 16e3) return e;
		let n = Math.max(1, Math.ceil(e.length / t * 16e3)), r = new OfflineAudioContext(1, n, 16e3), i = r.createBuffer(1, e.length, t);
		i.copyToChannel(e, 0);
		let a = r.createBufferSource();
		return a.buffer = i, a.connect(r.destination), a.start(0), (await r.startRendering()).getChannelData(0).slice();
	}
	async infer(e) {
		let t = this.ort, n = this.session, r = performance.now(), i = await n.run({ [this.inputName]: new t.Tensor("float32", e, [1, e.length]) }), a = performance.now() - r;
		this.inferMs = this.inferMs ? this.inferMs + (a - this.inferMs) * .2 : a, this.recentInfer.push(a), this.recentInfer.length > 20 && this.recentInfer.shift();
		let o = i[this.outputName], s = o.dims[o.dims.length - 1], c = o.dims[o.dims.length - 2], l = o.data, u = Math.round(e.length / 16e3 * this.opts.fps), d = Math.min(c, u || c), f = [];
		for (let e = 0; e < d; e++) f.push(l.slice(e * s, (e + 1) * s));
		return f;
	}
	read() {
		let e = performance.now(), t = Math.min(.1, Math.max(0, (e - this.lastT) / 1e3));
		this.lastT = e;
		let n = this.frame;
		n.energy = B(this.energy.read(e) * 3);
		let r = this.timeline;
		if (r.length) {
			let e = this.context?.currentTime ?? 0, n = this.synced ? e - this.syncOffset : r[r.length - 1].t, i = r.length - 1;
			for (; i > 0 && r[i].t > n;) i--;
			let a = r[i], o = a.e;
			if (a.t > n && i === 0) this.current.set(a.w);
			else if (i === r.length - 1) this.current.set(a.w), n - a.t > 1 / this.opts.fps && i !== this.lastShown && this.lateFrames++;
			else {
				let e = r[i + 1], t = B((n - a.t) / (e.t - a.t)), s = this.current;
				for (let n = 0; n < s.length; n++) s[n] = a.w[n] + (e.w[n] - a.w[n]) * t;
				o = a.e + (e.e - a.e) * t;
			}
			let s = B((o - .008) / .05);
			this.gate += (s - this.gate) * (1 - Math.exp(-(s > this.gate ? 30 : 18) * t));
			let c = 1 - this.envelopeFollow * (1 - this.gate), l = this.current;
			for (let e of Se) l[e] *= c;
			this.lastShown = i, i > this.opts.fps && r.splice(0, i - this.opts.fps);
		}
		let i = this.current, a = B(i[z.jawOpen] * 6), o = B(Math.max(i[z.mouthPucker], i[z.mouthFunnel]) * 3), s = B(Math.max(i[z.mouthStretchLeft], i[z.mouthStretchRight], i[z.mouthSmileLeft] - .2, i[z.mouthSmileRight] - .2) * 3), c = B(Math.max(i[z.mouthPressLeft], i[z.mouthPressRight], i[z.mouthClose]) * 3), l = new Float32Array(L);
		l[I.aa] = a * (1 - o) * (1 - s * .5), l[I.O] = a * o, l[I.U] = o * (1 - a), l[I.E] = a * s, l[I.I] = s * (1 - a), l[I.PP] = c * (1 - a), l[I.FF] = B(i[z.mouthRollLower] * 3);
		let u = 0;
		for (let e = 1; e < L; e++) u += l[e];
		l[0] = B(1 - u);
		let d = n.visemes;
		for (let e = 0; e < L; e++) d[e] = de(d[e], l[e], t, 30, 30);
		return n.jawOpen = a, n.speaking = this.silentChunks < 4 && n.energy > .02, n.t = e, n;
	}
}, De = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
}), H = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
}), Oe = class extends n {
	constructor(e) {
		super(), this.weight = 0, this.isBinary = !1, this.overrideBlink = "none", this.overrideLookAt = "none", this.overrideMouth = "none", this._binds = [], this.name = `VRMExpression_${e}`, this.expressionName = e, this.type = "VRMExpression", this.visible = !1;
	}
	get binds() {
		return this._binds;
	}
	get overrideBlinkAmount() {
		return this.overrideBlink === "block" ? +(0 < this.outputWeight) : this.overrideBlink === "blend" ? this.outputWeight : 0;
	}
	get overrideLookAtAmount() {
		return this.overrideLookAt === "block" ? +(0 < this.outputWeight) : this.overrideLookAt === "blend" ? this.outputWeight : 0;
	}
	get overrideMouthAmount() {
		return this.overrideMouth === "block" ? +(0 < this.outputWeight) : this.overrideMouth === "blend" ? this.outputWeight : 0;
	}
	get outputWeight() {
		return this.isBinary ? +(this.weight > .5) : this.weight;
	}
	addBind(e) {
		this._binds.push(e);
	}
	deleteBind(e) {
		let t = this._binds.indexOf(e);
		t >= 0 && this._binds.splice(t, 1);
	}
	applyWeight(e) {
		let t = this.outputWeight;
		t *= e?.multiplier ?? 1, this.isBinary && t < 1 && (t = 0), this._binds.forEach((e) => e.applyWeight(t));
	}
	clearAppliedWeight() {
		this._binds.forEach((e) => e.clearAppliedWeight());
	}
};
function ke(e, t, n) {
	let r = e.parser.json, i = r.nodes?.[t];
	if (i == null) return console.warn(`extractPrimitivesInternal: Attempt to use nodes[${t}] of glTF but the node doesn't exist`), null;
	let a = i.mesh;
	if (a == null) return null;
	let o = r.meshes?.[a];
	if (o == null) return console.warn(`extractPrimitivesInternal: Attempt to use meshes[${a}] of glTF but the mesh doesn't exist`), null;
	let s = o.primitives.length, c = [];
	return n.traverse((e) => {
		c.length < s && e.isMesh && c.push(e);
	}), c;
}
function Ae(e, t) {
	return H(this, null, function* () {
		return ke(e, t, yield e.parser.getDependency("node", t));
	});
}
function je(e) {
	return H(this, null, function* () {
		let t = yield e.parser.getDependencies("node"), n = /* @__PURE__ */ new Map();
		return t.forEach((t, r) => {
			let i = ke(e, r, t);
			i != null && n.set(r, i);
		}), n;
	});
}
var Me = {
	Aa: "aa",
	Ih: "ih",
	Ou: "ou",
	Ee: "ee",
	Oh: "oh",
	Blink: "blink",
	Happy: "happy",
	Angry: "angry",
	Sad: "sad",
	Relaxed: "relaxed",
	LookUp: "lookUp",
	Surprised: "surprised",
	LookDown: "lookDown",
	LookLeft: "lookLeft",
	LookRight: "lookRight",
	BlinkLeft: "blinkLeft",
	BlinkRight: "blinkRight",
	Neutral: "neutral"
};
function Ne(e) {
	return Math.max(Math.min(e, 1), 0);
}
var Pe = class e {
	constructor() {
		this.blinkExpressionNames = [
			"blink",
			"blinkLeft",
			"blinkRight"
		], this.lookAtExpressionNames = [
			"lookLeft",
			"lookRight",
			"lookUp",
			"lookDown"
		], this.mouthExpressionNames = [
			"aa",
			"ee",
			"ih",
			"oh",
			"ou"
		], this._expressions = [], this._expressionMap = {};
	}
	get expressions() {
		return this._expressions.concat();
	}
	get expressionMap() {
		return Object.assign({}, this._expressionMap);
	}
	get presetExpressionMap() {
		let e = {}, t = new Set(Object.values(Me));
		return Object.entries(this._expressionMap).forEach(([n, r]) => {
			t.has(n) && (e[n] = r);
		}), e;
	}
	get customExpressionMap() {
		let e = {}, t = new Set(Object.values(Me));
		return Object.entries(this._expressionMap).forEach(([n, r]) => {
			t.has(n) || (e[n] = r);
		}), e;
	}
	copy(e) {
		return this._expressions.concat().forEach((e) => {
			this.unregisterExpression(e);
		}), e._expressions.forEach((e) => {
			this.registerExpression(e);
		}), this.blinkExpressionNames = e.blinkExpressionNames.concat(), this.lookAtExpressionNames = e.lookAtExpressionNames.concat(), this.mouthExpressionNames = e.mouthExpressionNames.concat(), this;
	}
	clone() {
		return new e().copy(this);
	}
	getExpression(e) {
		return this._expressionMap[e] ?? null;
	}
	registerExpression(e) {
		this._expressions.push(e), this._expressionMap[e.expressionName] = e;
	}
	unregisterExpression(e) {
		let t = this._expressions.indexOf(e);
		t === -1 && console.warn("VRMExpressionManager: The specified expressions is not registered"), this._expressions.splice(t, 1), delete this._expressionMap[e.expressionName];
	}
	getValue(e) {
		return this.getExpression(e)?.weight ?? null;
	}
	setValue(e, t) {
		let n = this.getExpression(e);
		n && (n.weight = Ne(t));
	}
	resetValues() {
		this._expressions.forEach((e) => {
			e.weight = 0;
		});
	}
	getExpressionTrackName(e) {
		let t = this.getExpression(e);
		return t ? `${t.name}.weight` : null;
	}
	update() {
		let e = this._calculateWeightMultipliers();
		this._expressions.forEach((e) => {
			e.clearAppliedWeight();
		}), this._expressions.forEach((t) => {
			let n = 1, r = t.expressionName;
			this.blinkExpressionNames.indexOf(r) !== -1 && (n *= e.blink), this.lookAtExpressionNames.indexOf(r) !== -1 && (n *= e.lookAt), this.mouthExpressionNames.indexOf(r) !== -1 && (n *= e.mouth), t.applyWeight({ multiplier: n });
		});
	}
	_calculateWeightMultipliers() {
		let e = 1, t = 1, n = 1;
		return this._expressions.forEach((r) => {
			e -= r.overrideBlinkAmount, t -= r.overrideLookAtAmount, n -= r.overrideMouthAmount;
		}), e = Math.max(0, e), t = Math.max(0, t), n = Math.max(0, n), {
			blink: e,
			lookAt: t,
			mouth: n
		};
	}
}, Fe = {
	Color: "color",
	EmissionColor: "emissionColor",
	ShadeColor: "shadeColor",
	MatcapColor: "matcapColor",
	RimColor: "rimColor",
	OutlineColor: "outlineColor"
}, Ie = {
	_Color: Fe.Color,
	_EmissionColor: Fe.EmissionColor,
	_ShadeColor: Fe.ShadeColor,
	_RimColor: Fe.RimColor,
	_OutlineColor: Fe.OutlineColor
}, Le = new M(), Re = class e {
	constructor({ material: e, type: t, targetValue: n, targetAlpha: r }) {
		this.material = e, this.type = t, this.targetValue = n, this.targetAlpha = r ?? 1;
		let i = this._initColorBindState(), a = this._initAlphaBindState();
		this._state = {
			color: i,
			alpha: a
		};
	}
	applyWeight(e) {
		let { color: t, alpha: n } = this._state;
		if (t != null) {
			let { propertyName: n, deltaValue: r } = t;
			this.material[n]?.add(Le.copy(r).multiplyScalar(e));
		}
		if (n != null) {
			let { propertyName: t, deltaValue: r } = n;
			this.material[t] != null && (this.material[t] += r * e);
		}
	}
	clearAppliedWeight() {
		let { color: e, alpha: t } = this._state;
		if (e != null) {
			let { propertyName: t, initialValue: n } = e;
			this.material[t]?.copy(n);
		}
		if (t != null) {
			let { propertyName: e, initialValue: n } = t;
			this.material[e] != null && (this.material[e] = n);
		}
	}
	_initColorBindState() {
		let { material: e, type: t, targetValue: n } = this, r = this._getPropertyNameMap()?.[t]?.[0] ?? null;
		if (r == null) return console.warn(`Tried to add a material color bind to the material ${e.name ?? "(no name)"}, the type ${t} but the material or the type is not supported.`), null;
		let i = e[r].clone();
		return {
			propertyName: r,
			initialValue: i,
			deltaValue: new M(n.r - i.r, n.g - i.g, n.b - i.b)
		};
	}
	_initAlphaBindState() {
		let { material: e, type: t, targetAlpha: n } = this, r = this._getPropertyNameMap()?.[t]?.[1] ?? null;
		if (r == null && n !== 1) return console.warn(`Tried to add a material alpha bind to the material ${e.name ?? "(no name)"}, the type ${t} but the material or the type does not support alpha.`), null;
		if (r == null) return null;
		let i = e[r];
		return {
			propertyName: r,
			initialValue: i,
			deltaValue: n - i
		};
	}
	_getPropertyNameMap() {
		return Object.entries(e._propertyNameMapMap).find(([e]) => this.material[e] === !0)?.[1] ?? null;
	}
};
Re._propertyNameMapMap = {
	isMeshStandardMaterial: {
		color: ["color", "opacity"],
		emissionColor: ["emissive", null]
	},
	isMeshBasicMaterial: { color: ["color", "opacity"] },
	isMToonMaterial: {
		color: ["color", "opacity"],
		emissionColor: ["emissive", null],
		outlineColor: ["outlineColorFactor", null],
		matcapColor: ["matcapFactor", null],
		rimColor: ["parametricRimColorFactor", null],
		shadeColor: ["shadeColorFactor", null]
	}
};
var ze = Re, Be = class {
	constructor({ primitives: e, index: t, weight: n }) {
		this.primitives = e, this.index = t, this.weight = n;
	}
	applyWeight(e) {
		this.primitives.forEach((t) => {
			t.morphTargetInfluences?.[this.index] != null && (t.morphTargetInfluences[this.index] += this.weight * e);
		});
	}
	clearAppliedWeight() {
		this.primitives.forEach((e) => {
			e.morphTargetInfluences?.[this.index] != null && (e.morphTargetInfluences[this.index] = 0);
		});
	}
}, Ve = new C(), He = class e {
	constructor({ material: t, scale: n, offset: r }) {
		this.material = t, this.scale = n, this.offset = r;
		let i = Object.entries(e._propertyNamesMap).find(([e]) => t[e] === !0)?.[1];
		i == null ? (console.warn(`Tried to add a texture transform bind to the material ${t.name ?? "(no name)"} but the material is not supported.`), this._properties = []) : (this._properties = [], i.forEach((e) => {
			let i = t[e]?.clone();
			if (!i) return null;
			t[e] = i;
			let a = i.offset.clone(), o = i.repeat.clone(), s = r.clone().sub(a), c = n.clone().sub(o);
			this._properties.push({
				name: e,
				initialOffset: a,
				deltaOffset: s,
				initialScale: o,
				deltaScale: c
			});
		}));
	}
	applyWeight(e) {
		this._properties.forEach((t) => {
			let n = this.material[t.name];
			n !== void 0 && (n.offset.add(Ve.copy(t.deltaOffset).multiplyScalar(e)), n.repeat.add(Ve.copy(t.deltaScale).multiplyScalar(e)));
		});
	}
	clearAppliedWeight() {
		this._properties.forEach((e) => {
			let t = this.material[e.name];
			t !== void 0 && (t.offset.copy(e.initialOffset), t.repeat.copy(e.initialScale));
		});
	}
};
He._propertyNamesMap = {
	isMeshStandardMaterial: [
		"map",
		"emissiveMap",
		"bumpMap",
		"normalMap",
		"displacementMap",
		"roughnessMap",
		"metalnessMap",
		"alphaMap"
	],
	isMeshBasicMaterial: [
		"map",
		"specularMap",
		"alphaMap"
	],
	isMToonMaterial: [
		"map",
		"normalMap",
		"emissiveMap",
		"shadeMultiplyTexture",
		"rimMultiplyTexture",
		"outlineWidthMultiplyTexture",
		"uvAnimationMaskTexture"
	]
};
var Ue = He, We = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), Ge = class e {
	get name() {
		return "VRMExpressionLoaderPlugin";
	}
	constructor(e) {
		this.parser = e;
	}
	afterRoot(e) {
		return H(this, null, function* () {
			e.userData.vrmExpressionManager = yield this._import(e);
		});
	}
	_import(e) {
		return H(this, null, function* () {
			return (yield this._v1Import(e)) || (yield this._v0Import(e)) || null;
		});
	}
	_v1Import(e) {
		return H(this, null, function* () {
			let t = this.parser.json;
			if (t.extensionsUsed?.indexOf("VRMC_vrm") === -1) return null;
			let n = t.extensions?.VRMC_vrm;
			if (!n) return null;
			let r = n.specVersion;
			if (!We.has(r)) return console.warn(`VRMExpressionLoaderPlugin: Unknown VRMC_vrm specVersion "${r}"`), null;
			let i = n.expressions;
			if (!i) return null;
			let a = new Set(Object.values(Me)), o = /* @__PURE__ */ new Map();
			i.preset != null && Object.entries(i.preset).forEach(([e, t]) => {
				t != null && (a.has(e) ? o.set(e, t) : console.warn(`VRMExpressionLoaderPlugin: Unknown preset name "${e}" detected. Ignoring the expression`));
			}), i.custom != null && Object.entries(i.custom).forEach(([e, t]) => {
				a.has(e) ? console.warn(`VRMExpressionLoaderPlugin: Custom expression cannot have preset name "${e}". Ignoring the expression`) : o.set(e, t);
			});
			let s = new Pe();
			return yield Promise.all(Array.from(o.entries()).map((t) => H(this, [t], function* ([t, n]) {
				var r, i, a;
				let o = new Oe(t);
				if (e.scene.add(o), o.isBinary = n.isBinary ?? !1, o.overrideBlink = n.overrideBlink ?? "none", o.overrideLookAt = n.overrideLookAt ?? "none", o.overrideMouth = n.overrideMouth ?? "none", (r = n.morphTargetBinds) == null || r.forEach((t) => H(this, null, function* () {
					if (t.node === void 0 || t.index === void 0) return;
					let r = yield Ae(e, t.node), i = t.index;
					r.every((e) => Array.isArray(e.morphTargetInfluences) && i < e.morphTargetInfluences.length) ? o.addBind(new Be({
						primitives: r,
						index: i,
						weight: t.weight ?? 1
					})) : console.warn(`VRMExpressionLoaderPlugin: ${n.name} attempts to index morph #${i} but not found.`);
				})), n.materialColorBinds || n.textureTransformBinds) {
					let t = [];
					e.scene.traverse((e) => {
						let n = e.material;
						n && (Array.isArray(n) ? t.push(...n) : t.push(n));
					}), (i = n.materialColorBinds) == null || i.forEach((e) => H(this, null, function* () {
						t.filter((t) => {
							let n = this.parser.associations.get(t)?.materials;
							return e.material === n;
						}).forEach((t) => {
							o.addBind(new ze({
								material: t,
								type: e.type,
								targetValue: new M().fromArray(e.targetValue),
								targetAlpha: e.targetValue[3]
							}));
						});
					})), (a = n.textureTransformBinds) == null || a.forEach((e) => H(this, null, function* () {
						t.filter((t) => {
							let n = this.parser.associations.get(t)?.materials;
							return e.material === n;
						}).forEach((t) => {
							o.addBind(new Ue({
								material: t,
								offset: new C().fromArray(e.offset ?? [0, 0]),
								scale: new C().fromArray(e.scale ?? [1, 1])
							}));
						});
					}));
				}
				s.registerExpression(o);
			}))), s;
		});
	}
	_v0Import(t) {
		return H(this, null, function* () {
			let n = this.parser.json, r = n.extensions?.VRM;
			if (!r) return null;
			let i = r.blendShapeMaster;
			if (!i) return null;
			let a = new Pe(), o = i.blendShapeGroups;
			if (!o) return a;
			let s = /* @__PURE__ */ new Set();
			return yield Promise.all(o.map((r) => H(this, null, function* () {
				let i = r.presetName, o = (i != null && e.v0v1PresetNameMap[i] || null) ?? r.name;
				if (o == null) {
					console.warn("VRMExpressionLoaderPlugin: One of custom expressions has no name. Ignoring the expression");
					return;
				}
				if (s.has(o)) {
					console.warn(`VRMExpressionLoaderPlugin: An expression preset ${i} has duplicated entries. Ignoring the expression`);
					return;
				}
				s.add(o);
				let c = new Oe(o);
				t.scene.add(c), c.isBinary = r.isBinary ?? !1, r.binds && r.binds.forEach((e) => H(this, null, function* () {
					var i;
					if (e.mesh === void 0 || e.index === void 0) return;
					let a = [];
					if ((i = n.nodes) == null || i.forEach((t, n) => {
						t.mesh === e.mesh && a.push(n);
					}), a.length === 0) {
						console.warn(`VRMExpressionLoaderPlugin: ${r.name} attempts to bind a morph target to the mesh #${e.mesh} but the mesh is not found or not used in the scene. Ignoring the bind.`);
						return;
					}
					let o = e.index;
					yield Promise.all(a.map((n) => H(this, null, function* () {
						let i = yield Ae(t, n);
						i.every((e) => Array.isArray(e.morphTargetInfluences) && o < e.morphTargetInfluences.length) ? c.addBind(new Be({
							primitives: i,
							index: o,
							weight: .01 * (e.weight ?? 100)
						})) : console.warn(`VRMExpressionLoaderPlugin: ${r.name} attempts to index ${o}th morph but not found.`);
					})));
				}));
				let l = r.materialValues;
				l && l.length !== 0 && l.forEach((e) => {
					if (e.materialName === void 0 || e.propertyName === void 0 || e.targetValue === void 0) return;
					let n = [];
					t.scene.traverse((t) => {
						if (t.material) {
							let r = t.material;
							Array.isArray(r) ? n.push(...r.filter((t) => (t.name === e.materialName || t.name === e.materialName + " (Outline)") && n.indexOf(t) === -1)) : r.name === e.materialName && n.indexOf(r) === -1 && n.push(r);
						}
					});
					let r = e.propertyName;
					n.forEach((t) => {
						if (r === "_MainTex_ST") {
							let n = new C(e.targetValue[0], e.targetValue[1]), r = new C(e.targetValue[2], e.targetValue[3]);
							r.y = 1 - r.y - n.y, c.addBind(new Ue({
								material: t,
								scale: n,
								offset: r
							}));
							return;
						}
						let n = Ie[r];
						n ? c.addBind(new ze({
							material: t,
							type: n,
							targetValue: new M().fromArray(e.targetValue),
							targetAlpha: e.targetValue[3]
						})) : console.warn(r + " is not supported");
					});
				}), a.registerExpression(c);
			}))), a;
		});
	}
};
Ge.v0v1PresetNameMap = {
	a: "aa",
	e: "ee",
	i: "ih",
	o: "oh",
	u: "ou",
	blink: "blink",
	joy: "happy",
	angry: "angry",
	sorrow: "sad",
	fun: "relaxed",
	lookup: "lookUp",
	lookdown: "lookDown",
	lookleft: "lookLeft",
	lookright: "lookRight",
	blink_l: "blinkLeft",
	blink_r: "blinkRight",
	neutral: "neutral"
};
var Ke = Ge, qe = class e {
	constructor(t, n) {
		this._firstPersonOnlyLayer = e.DEFAULT_FIRSTPERSON_ONLY_LAYER, this._thirdPersonOnlyLayer = e.DEFAULT_THIRDPERSON_ONLY_LAYER, this._initializedLayers = !1, this.humanoid = t, this.meshAnnotations = n;
	}
	copy(e) {
		if (this.humanoid !== e.humanoid) throw Error("VRMFirstPerson: humanoid must be same in order to copy");
		return this.meshAnnotations = e.meshAnnotations.map((e) => ({
			meshes: e.meshes.concat(),
			type: e.type
		})), this;
	}
	clone() {
		return new e(this.humanoid, this.meshAnnotations).copy(this);
	}
	get firstPersonOnlyLayer() {
		return this._firstPersonOnlyLayer;
	}
	get thirdPersonOnlyLayer() {
		return this._thirdPersonOnlyLayer;
	}
	setup({ firstPersonOnlyLayer: t = e.DEFAULT_FIRSTPERSON_ONLY_LAYER, thirdPersonOnlyLayer: n = e.DEFAULT_THIRDPERSON_ONLY_LAYER } = {}) {
		this._initializedLayers ||= (this._firstPersonOnlyLayer = t, this._thirdPersonOnlyLayer = n, this.meshAnnotations.forEach((e) => {
			e.meshes.forEach((t) => {
				e.type === "firstPersonOnly" ? (t.layers.set(this._firstPersonOnlyLayer), t.traverse((e) => e.layers.set(this._firstPersonOnlyLayer))) : e.type === "thirdPersonOnly" ? (t.layers.set(this._thirdPersonOnlyLayer), t.traverse((e) => e.layers.set(this._thirdPersonOnlyLayer))) : e.type === "auto" && this._createHeadlessModel(t);
			});
		}), !0);
	}
	_excludeTriangles(e, t, n, r) {
		let i = 0;
		if (t != null && t.length > 0) for (let a = 0; a < e.length; a += 3) {
			let o = e[a], s = e[a + 1], c = e[a + 2], l = t[o], u = n[o];
			if (l[0] > 0 && r.includes(u[0]) || l[1] > 0 && r.includes(u[1]) || l[2] > 0 && r.includes(u[2]) || l[3] > 0 && r.includes(u[3])) continue;
			let d = t[s], f = n[s];
			if (d[0] > 0 && r.includes(f[0]) || d[1] > 0 && r.includes(f[1]) || d[2] > 0 && r.includes(f[2]) || d[3] > 0 && r.includes(f[3])) continue;
			let p = t[c], m = n[c];
			p[0] > 0 && r.includes(m[0]) || p[1] > 0 && r.includes(m[1]) || p[2] > 0 && r.includes(m[2]) || p[3] > 0 && r.includes(m[3]) || (e[i++] = o, e[i++] = s, e[i++] = c);
		}
		return i;
	}
	_createErasedMesh(e, n) {
		let r = new O(e.geometry.clone(), e.material);
		r.name = `${e.name}(erase)`, r.frustumCulled = e.frustumCulled, r.layers.set(this._firstPersonOnlyLayer);
		let i = r.geometry, a = i.getAttribute("skinIndex"), o = a instanceof oe ? [] : a.array, s = [];
		for (let e = 0; e < o.length; e += 4) s.push([
			o[e],
			o[e + 1],
			o[e + 2],
			o[e + 3]
		]);
		let c = i.getAttribute("skinWeight"), l = c instanceof oe ? [] : c.array, u = [];
		for (let e = 0; e < l.length; e += 4) u.push([
			l[e],
			l[e + 1],
			l[e + 2],
			l[e + 3]
		]);
		let d = i.getIndex();
		if (!d) throw Error("The geometry doesn't have an index buffer");
		let f = Array.from(d.array), p = this._excludeTriangles(f, u, s, n), m = [];
		for (let e = 0; e < p; e++) m[e] = f[e];
		return i.setIndex(m), e.onBeforeRender && (r.onBeforeRender = e.onBeforeRender), r.bind(new y(e.skeleton.bones, e.skeleton.boneInverses), new t()), r;
	}
	_createHeadlessModelForSkinnedMesh(e, t) {
		let n = [];
		if (t.skeleton.bones.forEach((e, t) => {
			this._isEraseTarget(e) && n.push(t);
		}), !n.length) {
			t.layers.enable(this._thirdPersonOnlyLayer), t.layers.enable(this._firstPersonOnlyLayer);
			return;
		}
		t.layers.set(this._thirdPersonOnlyLayer);
		let r = this._createErasedMesh(t, n);
		e.add(r);
	}
	_createHeadlessModel(e) {
		if (e.type === "Group") {
			if (e.layers.set(this._thirdPersonOnlyLayer), this._isEraseTarget(e)) e.traverse((e) => e.layers.set(this._thirdPersonOnlyLayer));
			else {
				let t = new l();
				t.name = `_headless_${e.name}`, t.layers.set(this._firstPersonOnlyLayer), e.parent.add(t), e.children.filter((e) => e.type === "SkinnedMesh").forEach((e) => {
					let n = e;
					this._createHeadlessModelForSkinnedMesh(t, n);
				});
			}
		} else if (e.type === "SkinnedMesh") {
			let t = e;
			this._createHeadlessModelForSkinnedMesh(e.parent, t);
		} else this._isEraseTarget(e) && (e.layers.set(this._thirdPersonOnlyLayer), e.traverse((e) => e.layers.set(this._thirdPersonOnlyLayer)));
	}
	_isEraseTarget(e) {
		return e === this.humanoid.getRawBoneNode("head") ? !0 : e.parent ? this._isEraseTarget(e.parent) : !1;
	}
};
qe.DEFAULT_FIRSTPERSON_ONLY_LAYER = 9, qe.DEFAULT_THIRDPERSON_ONLY_LAYER = 10;
var Je = qe, Ye = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), Xe = class {
	get name() {
		return "VRMFirstPersonLoaderPlugin";
	}
	constructor(e) {
		this.parser = e;
	}
	afterRoot(e) {
		return H(this, null, function* () {
			let t = e.userData.vrmHumanoid;
			if (t !== null) {
				if (t === void 0) throw Error("VRMFirstPersonLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");
				e.userData.vrmFirstPerson = yield this._import(e, t);
			}
		});
	}
	_import(e, t) {
		return H(this, null, function* () {
			return t == null ? null : (yield this._v1Import(e, t)) || (yield this._v0Import(e, t)) || null;
		});
	}
	_v1Import(e, t) {
		return H(this, null, function* () {
			let n = this.parser.json;
			if (n.extensionsUsed?.indexOf("VRMC_vrm") === -1) return null;
			let r = n.extensions?.VRMC_vrm;
			if (!r) return null;
			let i = r.specVersion;
			if (!Ye.has(i)) return console.warn(`VRMFirstPersonLoaderPlugin: Unknown VRMC_vrm specVersion "${i}"`), null;
			let a = r.firstPerson, o = [], s = yield je(e);
			return Array.from(s.entries()).forEach(([e, t]) => {
				let n = (a?.meshAnnotations)?.find((t) => t.node === e);
				o.push({
					meshes: t,
					type: n?.type ?? "auto"
				});
			}), new Je(t, o);
		});
	}
	_v0Import(e, t) {
		return H(this, null, function* () {
			let n = this.parser.json, r = n.extensions?.VRM;
			if (!r) return null;
			let i = r.firstPerson;
			if (!i) return null;
			let a = [], o = yield je(e);
			return Array.from(o.entries()).forEach(([e, t]) => {
				let r = n.nodes[e], o = i.meshAnnotations ? i.meshAnnotations.find((e) => e.mesh === r.mesh) : void 0;
				a.push({
					meshes: t,
					type: this._convertV0FlagToV1Type(o?.firstPersonFlag)
				});
			}), new Je(t, a);
		});
	}
	_convertV0FlagToV1Type(e) {
		return e === "FirstPersonOnly" ? "firstPersonOnly" : e === "ThirdPersonOnly" ? "thirdPersonOnly" : e === "Both" ? "both" : "auto";
	}
}, Ze = new S(), Qe = new S(), $e = new m(), et = class extends l {
	constructor(e) {
		super(), this.vrmHumanoid = e, this._boneAxesMap = /* @__PURE__ */ new Map(), Object.values(e.humanBones).forEach((e) => {
			let t = new A(1);
			t.matrixAutoUpdate = !1, t.material.depthTest = !1, t.material.depthWrite = !1, this.add(t), this._boneAxesMap.set(e, t);
		});
	}
	dispose() {
		Array.from(this._boneAxesMap.values()).forEach((e) => {
			e.geometry.dispose(), e.material.dispose();
		});
	}
	updateMatrixWorld(e) {
		Array.from(this._boneAxesMap.entries()).forEach(([e, t]) => {
			e.node.updateWorldMatrix(!0, !1), e.node.matrixWorld.decompose(Ze, $e, Qe);
			let n = Ze.set(.1, .1, .1).divide(Qe);
			t.matrix.copy(e.node.matrixWorld).scale(n);
		}), super.updateMatrixWorld(e);
	}
}, tt = /* @__PURE__ */ "hips.spine.chest.upperChest.neck.head.leftEye.rightEye.jaw.leftUpperLeg.leftLowerLeg.leftFoot.leftToes.rightUpperLeg.rightLowerLeg.rightFoot.rightToes.leftShoulder.leftUpperArm.leftLowerArm.leftHand.rightShoulder.rightUpperArm.rightLowerArm.rightHand.leftThumbMetacarpal.leftThumbProximal.leftThumbDistal.leftIndexProximal.leftIndexIntermediate.leftIndexDistal.leftMiddleProximal.leftMiddleIntermediate.leftMiddleDistal.leftRingProximal.leftRingIntermediate.leftRingDistal.leftLittleProximal.leftLittleIntermediate.leftLittleDistal.rightThumbMetacarpal.rightThumbProximal.rightThumbDistal.rightIndexProximal.rightIndexIntermediate.rightIndexDistal.rightMiddleProximal.rightMiddleIntermediate.rightMiddleDistal.rightRingProximal.rightRingIntermediate.rightRingDistal.rightLittleProximal.rightLittleIntermediate.rightLittleDistal".split("."), nt = {
	hips: null,
	spine: "hips",
	chest: "spine",
	upperChest: "chest",
	neck: "upperChest",
	head: "neck",
	leftEye: "head",
	rightEye: "head",
	jaw: "head",
	leftUpperLeg: "hips",
	leftLowerLeg: "leftUpperLeg",
	leftFoot: "leftLowerLeg",
	leftToes: "leftFoot",
	rightUpperLeg: "hips",
	rightLowerLeg: "rightUpperLeg",
	rightFoot: "rightLowerLeg",
	rightToes: "rightFoot",
	leftShoulder: "upperChest",
	leftUpperArm: "leftShoulder",
	leftLowerArm: "leftUpperArm",
	leftHand: "leftLowerArm",
	rightShoulder: "upperChest",
	rightUpperArm: "rightShoulder",
	rightLowerArm: "rightUpperArm",
	rightHand: "rightLowerArm",
	leftThumbMetacarpal: "leftHand",
	leftThumbProximal: "leftThumbMetacarpal",
	leftThumbDistal: "leftThumbProximal",
	leftIndexProximal: "leftHand",
	leftIndexIntermediate: "leftIndexProximal",
	leftIndexDistal: "leftIndexIntermediate",
	leftMiddleProximal: "leftHand",
	leftMiddleIntermediate: "leftMiddleProximal",
	leftMiddleDistal: "leftMiddleIntermediate",
	leftRingProximal: "leftHand",
	leftRingIntermediate: "leftRingProximal",
	leftRingDistal: "leftRingIntermediate",
	leftLittleProximal: "leftHand",
	leftLittleIntermediate: "leftLittleProximal",
	leftLittleDistal: "leftLittleIntermediate",
	rightThumbMetacarpal: "rightHand",
	rightThumbProximal: "rightThumbMetacarpal",
	rightThumbDistal: "rightThumbProximal",
	rightIndexProximal: "rightHand",
	rightIndexIntermediate: "rightIndexProximal",
	rightIndexDistal: "rightIndexIntermediate",
	rightMiddleProximal: "rightHand",
	rightMiddleIntermediate: "rightMiddleProximal",
	rightMiddleDistal: "rightMiddleIntermediate",
	rightRingProximal: "rightHand",
	rightRingIntermediate: "rightRingProximal",
	rightRingDistal: "rightRingIntermediate",
	rightLittleProximal: "rightHand",
	rightLittleIntermediate: "rightLittleProximal",
	rightLittleDistal: "rightLittleIntermediate"
};
function rt(e) {
	return e.invert ? e.invert() : e.inverse(), e;
}
var U = new S(), W = new m(), it = class {
	constructor(e) {
		this.humanBones = e, this.restPose = this.getAbsolutePose();
	}
	getAbsolutePose() {
		let e = {};
		return Object.keys(this.humanBones).forEach((t) => {
			let n = t, r = this.getBoneNode(n);
			r && (U.copy(r.position), W.copy(r.quaternion), e[n] = {
				position: U.toArray(),
				rotation: W.toArray()
			});
		}), e;
	}
	getPose() {
		let e = {};
		return Object.keys(this.humanBones).forEach((t) => {
			let n = t, r = this.getBoneNode(n);
			if (!r) return;
			U.set(0, 0, 0), W.identity();
			let i = this.restPose[n];
			i?.position && U.fromArray(i.position).negate(), i?.rotation && rt(W.fromArray(i.rotation)), U.add(r.position), W.premultiply(r.quaternion), e[n] = {
				position: U.toArray(),
				rotation: W.toArray()
			};
		}), e;
	}
	setPose(e) {
		Object.entries(e).forEach(([e, t]) => {
			let n = e, r = this.getBoneNode(n);
			if (!r) return;
			let i = this.restPose[n];
			i && (t?.position && (r.position.fromArray(t.position), i.position && r.position.add(U.fromArray(i.position))), t?.rotation && (r.quaternion.fromArray(t.rotation), i.rotation && r.quaternion.multiply(W.fromArray(i.rotation))));
		});
	}
	resetPose() {
		Object.entries(this.restPose).forEach(([e, t]) => {
			let n = this.getBoneNode(e);
			n && (t?.position && n.position.fromArray(t.position), t?.rotation && n.quaternion.fromArray(t.rotation));
		});
	}
	getBone(e) {
		return this.humanBones[e] ?? void 0;
	}
	getBoneNode(e) {
		return this.humanBones[e]?.node ?? null;
	}
}, at = new S(), ot = new m(), st = new S(), ct = class e extends it {
	static _setupTransforms(e) {
		let t = new n();
		t.name = "VRMHumanoidRig";
		let r = {}, i = {}, a = {}, o = {};
		tt.forEach((t) => {
			var n;
			let s = e.getBoneNode(t);
			if (s) {
				let e = new S(), c = new m();
				s.updateWorldMatrix(!0, !1), s.matrixWorld.decompose(e, c, at), r[t] = e, i[t] = c, a[t] = s.quaternion.clone();
				let l = new m();
				(n = s.parent) == null || n.matrixWorld.decompose(at, l, at), o[t] = l;
			}
		});
		let s = {};
		return tt.forEach((i) => {
			let a = e.getBoneNode(i);
			if (a) {
				let e = r[i], o = i, c;
				for (; c == null && (o = nt[o], o != null);) c = r[o];
				let l = new n();
				l.name = "Normalized_" + a.name, (o ? s[o]?.node : t).add(l), l.position.copy(e), c && l.position.sub(c), s[i] = { node: l };
			}
		}), {
			rigBones: s,
			root: t,
			parentWorldRotations: o,
			boneRotations: a
		};
	}
	constructor(t) {
		let { rigBones: n, root: r, parentWorldRotations: i, boneRotations: a } = e._setupTransforms(t);
		super(n), this.original = t, this.root = r, this._parentWorldRotations = i, this._boneRotations = a;
	}
	update() {
		tt.forEach((e) => {
			let t = this.original.getBoneNode(e);
			if (t != null) {
				let n = this.getBoneNode(e), r = this._parentWorldRotations[e], i = ot.copy(r).invert(), a = this._boneRotations[e];
				if (t.quaternion.copy(n.quaternion).multiply(r).premultiply(i).multiply(a), e === "hips") {
					let e = n.getWorldPosition(st);
					t.parent.updateWorldMatrix(!0, !1);
					let r = t.parent.matrixWorld, i = e.applyMatrix4(r.invert());
					t.position.copy(i);
				}
			}
		});
	}
}, lt = class e {
	get restPose() {
		return console.warn("VRMHumanoid: restPose is deprecated. Use either rawRestPose or normalizedRestPose instead."), this.rawRestPose;
	}
	get rawRestPose() {
		return this._rawHumanBones.restPose;
	}
	get normalizedRestPose() {
		return this._normalizedHumanBones.restPose;
	}
	get humanBones() {
		return this._rawHumanBones.humanBones;
	}
	get rawHumanBones() {
		return this._rawHumanBones.humanBones;
	}
	get normalizedHumanBones() {
		return this._normalizedHumanBones.humanBones;
	}
	get normalizedHumanBonesRoot() {
		return this._normalizedHumanBones.root;
	}
	constructor(e, t) {
		this.autoUpdateHumanBones = t?.autoUpdateHumanBones ?? !0, this._rawHumanBones = new it(e), this._normalizedHumanBones = new ct(this._rawHumanBones);
	}
	copy(e) {
		return this.autoUpdateHumanBones = e.autoUpdateHumanBones, this._rawHumanBones = new it(e.humanBones), this._normalizedHumanBones = new ct(this._rawHumanBones), this;
	}
	clone() {
		return new e(this.humanBones, { autoUpdateHumanBones: this.autoUpdateHumanBones }).copy(this);
	}
	getAbsolutePose() {
		return console.warn("VRMHumanoid: getAbsolutePose() is deprecated. Use either getRawAbsolutePose() or getNormalizedAbsolutePose() instead."), this.getRawAbsolutePose();
	}
	getRawAbsolutePose() {
		return this._rawHumanBones.getAbsolutePose();
	}
	getNormalizedAbsolutePose() {
		return this._normalizedHumanBones.getAbsolutePose();
	}
	getPose() {
		return console.warn("VRMHumanoid: getPose() is deprecated. Use either getRawPose() or getNormalizedPose() instead."), this.getRawPose();
	}
	getRawPose() {
		return this._rawHumanBones.getPose();
	}
	getNormalizedPose() {
		return this._normalizedHumanBones.getPose();
	}
	setPose(e) {
		return console.warn("VRMHumanoid: setPose() is deprecated. Use either setRawPose() or setNormalizedPose() instead."), this.setRawPose(e);
	}
	setRawPose(e) {
		return this._rawHumanBones.setPose(e);
	}
	setNormalizedPose(e) {
		return this._normalizedHumanBones.setPose(e);
	}
	resetPose() {
		return console.warn("VRMHumanoid: resetPose() is deprecated. Use either resetRawPose() or resetNormalizedPose() instead."), this.resetRawPose();
	}
	resetRawPose() {
		return this._rawHumanBones.resetPose();
	}
	resetNormalizedPose() {
		return this._normalizedHumanBones.resetPose();
	}
	getBone(e) {
		return console.warn("VRMHumanoid: getBone() is deprecated. Use either getRawBone() or getNormalizedBone() instead."), this.getRawBone(e);
	}
	getRawBone(e) {
		return this._rawHumanBones.getBone(e);
	}
	getNormalizedBone(e) {
		return this._normalizedHumanBones.getBone(e);
	}
	getBoneNode(e) {
		return console.warn("VRMHumanoid: getBoneNode() is deprecated. Use either getRawBoneNode() or getNormalizedBoneNode() instead."), this.getRawBoneNode(e);
	}
	getRawBoneNode(e) {
		return this._rawHumanBones.getBoneNode(e);
	}
	getNormalizedBoneNode(e) {
		return this._normalizedHumanBones.getBoneNode(e);
	}
	update() {
		this.autoUpdateHumanBones && this._normalizedHumanBones.update();
	}
}, ut = {
	Hips: "hips",
	Spine: "spine",
	Head: "head",
	LeftUpperLeg: "leftUpperLeg",
	LeftLowerLeg: "leftLowerLeg",
	LeftFoot: "leftFoot",
	RightUpperLeg: "rightUpperLeg",
	RightLowerLeg: "rightLowerLeg",
	RightFoot: "rightFoot",
	LeftUpperArm: "leftUpperArm",
	LeftLowerArm: "leftLowerArm",
	LeftHand: "leftHand",
	RightUpperArm: "rightUpperArm",
	RightLowerArm: "rightLowerArm",
	RightHand: "rightHand"
}, dt = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), ft = {
	leftThumbProximal: "leftThumbMetacarpal",
	leftThumbIntermediate: "leftThumbProximal",
	rightThumbProximal: "rightThumbMetacarpal",
	rightThumbIntermediate: "rightThumbProximal"
}, pt = class {
	get name() {
		return "VRMHumanoidLoaderPlugin";
	}
	constructor(e, t) {
		this.parser = e, this.helperRoot = t?.helperRoot, this.autoUpdateHumanBones = t?.autoUpdateHumanBones;
	}
	afterRoot(e) {
		return H(this, null, function* () {
			e.userData.vrmHumanoid = yield this._import(e);
		});
	}
	_import(e) {
		return H(this, null, function* () {
			return (yield this._v1Import(e)) || (yield this._v0Import(e)) || null;
		});
	}
	_v1Import(e) {
		return H(this, null, function* () {
			let t = this.parser.json;
			if (t.extensionsUsed?.indexOf("VRMC_vrm") === -1) return null;
			let n = t.extensions?.VRMC_vrm;
			if (!n) return null;
			let r = n.specVersion;
			if (!dt.has(r)) return console.warn(`VRMHumanoidLoaderPlugin: Unknown VRMC_vrm specVersion "${r}"`), null;
			let i = n.humanoid;
			if (!i) return null;
			let a = i.humanBones.leftThumbIntermediate != null || i.humanBones.rightThumbIntermediate != null, o = {};
			i.humanBones != null && (yield Promise.all(Object.entries(i.humanBones).map((e) => H(this, [e], function* ([e, t]) {
				let n = e, r = t.node;
				if (a) {
					let e = ft[n];
					e != null && (n = e);
				}
				let i = yield this.parser.getDependency("node", r);
				i == null ? console.warn(`A glTF node bound to the humanoid bone ${n} (index = ${r}) does not exist`) : o[n] = { node: i };
			}))));
			let s = new lt(this._ensureRequiredBonesExist(o), { autoUpdateHumanBones: this.autoUpdateHumanBones });
			if (e.scene.add(s.normalizedHumanBonesRoot), this.helperRoot) {
				let e = new et(s);
				this.helperRoot.add(e), e.renderOrder = this.helperRoot.renderOrder;
			}
			return s;
		});
	}
	_v0Import(e) {
		return H(this, null, function* () {
			let t = this.parser.json.extensions?.VRM;
			if (!t) return null;
			let n = t.humanoid;
			if (!n) return null;
			let r = {};
			n.humanBones != null && (yield Promise.all(n.humanBones.map((e) => H(this, null, function* () {
				let t = e.bone, n = e.node;
				if (t == null || n == null) return;
				if (n < 0) {
					console.warn(`A glTF node index for the humanoid bone ${t} is negative (${n}), ignoring this bone.`);
					return;
				}
				let i = yield this.parser.getDependency("node", n);
				if (i == null) {
					console.warn(`A glTF node bound to the humanoid bone ${t} (index = ${n}) does not exist`);
					return;
				}
				let a = ft[t] ?? t;
				r[a] == null ? r[a] = { node: i } : console.warn(`Multiple bone entries for ${a} detected (index = ${n}), ignoring duplicated entries.`);
			}))));
			let i = new lt(this._ensureRequiredBonesExist(r), { autoUpdateHumanBones: this.autoUpdateHumanBones });
			if (e.scene.add(i.normalizedHumanBonesRoot), this.helperRoot) {
				let e = new et(i);
				this.helperRoot.add(e), e.renderOrder = this.helperRoot.renderOrder;
			}
			return i;
		});
	}
	_ensureRequiredBonesExist(e) {
		let t = Object.values(ut).filter((t) => e[t] == null);
		if (t.length > 0) throw Error(`VRMHumanoidLoaderPlugin: These humanoid bones are required but not exist: ${t.join(", ")}`);
		return e;
	}
}, mt = class extends b {
	constructor() {
		super(), this._currentTheta = 0, this._currentRadius = 0, this.theta = 0, this.radius = 0, this._currentTheta = 0, this._currentRadius = 0, this._attrPos = new N(/* @__PURE__ */ new Float32Array(195), 3), this.setAttribute("position", this._attrPos), this._attrIndex = new N(/* @__PURE__ */ new Uint16Array(189), 1), this.setIndex(this._attrIndex), this._buildIndex(), this.update();
	}
	update() {
		let e = !1;
		this._currentTheta !== this.theta && (this._currentTheta = this.theta, e = !0), this._currentRadius !== this.radius && (this._currentRadius = this.radius, e = !0), e && this._buildPosition();
	}
	_buildPosition() {
		this._attrPos.setXYZ(0, 0, 0, 0);
		for (let e = 0; e < 64; e++) {
			let t = e / 63 * this._currentTheta;
			this._attrPos.setXYZ(e + 1, this._currentRadius * Math.sin(t), 0, this._currentRadius * Math.cos(t));
		}
		this._attrPos.needsUpdate = !0;
	}
	_buildIndex() {
		for (let e = 0; e < 63; e++) this._attrIndex.setXYZ(e * 3, 0, e + 1, e + 2);
		this._attrIndex.needsUpdate = !0;
	}
}, ht = class extends b {
	constructor() {
		super(), this.radius = 0, this._currentRadius = 0, this.tail = new S(), this._currentTail = new S(), this._attrPos = new N(/* @__PURE__ */ new Float32Array(294), 3), this.setAttribute("position", this._attrPos), this._attrIndex = new N(/* @__PURE__ */ new Uint16Array(194), 1), this.setIndex(this._attrIndex), this._buildIndex(), this.update();
	}
	update() {
		let e = !1;
		this._currentRadius !== this.radius && (this._currentRadius = this.radius, e = !0), this._currentTail.equals(this.tail) || (this._currentTail.copy(this.tail), e = !0), e && this._buildPosition();
	}
	_buildPosition() {
		for (let e = 0; e < 32; e++) {
			let t = e / 16 * Math.PI;
			this._attrPos.setXYZ(e, Math.cos(t), Math.sin(t), 0), this._attrPos.setXYZ(32 + e, 0, Math.cos(t), Math.sin(t)), this._attrPos.setXYZ(64 + e, Math.sin(t), 0, Math.cos(t));
		}
		this.scale(this._currentRadius, this._currentRadius, this._currentRadius), this.translate(this._currentTail.x, this._currentTail.y, this._currentTail.z), this._attrPos.setXYZ(96, 0, 0, 0), this._attrPos.setXYZ(97, this._currentTail.x, this._currentTail.y, this._currentTail.z), this._attrPos.needsUpdate = !0;
	}
	_buildIndex() {
		for (let e = 0; e < 32; e++) {
			let t = (e + 1) % 32;
			this._attrIndex.setXY(e * 2, e, t), this._attrIndex.setXY(64 + e * 2, 32 + e, 32 + t), this._attrIndex.setXY(128 + e * 2, 64 + e, 64 + t);
		}
		this._attrIndex.setXY(192, 96, 97), this._attrIndex.needsUpdate = !0;
	}
}, gt = new m(), _t = new m(), vt = new S(), yt = new S(), bt = Math.sqrt(2) / 2, xt = new m(0, 0, -bt, bt), St = new S(0, 1, 0), Ct = class extends l {
	constructor(e) {
		super(), this.matrixAutoUpdate = !1, this.vrmLookAt = e;
		{
			let e = new mt();
			e.radius = .5;
			let t = new r({
				color: 65280,
				transparent: !0,
				opacity: .5,
				side: 2,
				depthTest: !1,
				depthWrite: !1
			});
			this._meshPitch = new f(e, t), this.add(this._meshPitch);
		}
		{
			let e = new mt();
			e.radius = .5;
			let t = new r({
				color: 16711680,
				transparent: !0,
				opacity: .5,
				side: 2,
				depthTest: !1,
				depthWrite: !1
			});
			this._meshYaw = new f(e, t), this.add(this._meshYaw);
		}
		{
			let e = new ht();
			e.radius = .1;
			let t = new a({
				color: 16777215,
				depthTest: !1,
				depthWrite: !1
			});
			this._lineTarget = new o(e, t), this._lineTarget.frustumCulled = !1, this.add(this._lineTarget);
		}
	}
	dispose() {
		this._meshYaw.geometry.dispose(), this._meshYaw.material.dispose(), this._meshPitch.geometry.dispose(), this._meshPitch.material.dispose(), this._lineTarget.geometry.dispose(), this._lineTarget.material.dispose();
	}
	updateMatrixWorld(e) {
		let t = c.DEG2RAD * this.vrmLookAt.yaw;
		this._meshYaw.geometry.theta = t, this._meshYaw.geometry.update();
		let n = c.DEG2RAD * this.vrmLookAt.pitch;
		this._meshPitch.geometry.theta = n, this._meshPitch.geometry.update(), this.vrmLookAt.getLookAtWorldPosition(vt), this.vrmLookAt.getLookAtWorldQuaternion(gt), gt.multiply(this.vrmLookAt.getFaceFrontQuaternion(_t)), this._meshYaw.position.copy(vt), this._meshYaw.quaternion.copy(gt), this._meshPitch.position.copy(vt), this._meshPitch.quaternion.copy(gt), this._meshPitch.quaternion.multiply(_t.setFromAxisAngle(St, t)), this._meshPitch.quaternion.multiply(xt);
		let { target: r, autoUpdate: i } = this.vrmLookAt;
		r != null && i && (r.getWorldPosition(yt).sub(vt), this._lineTarget.geometry.tail.copy(yt), this._lineTarget.geometry.update(), this._lineTarget.position.copy(vt)), super.updateMatrixWorld(e);
	}
}, wt = new S(), Tt = new S();
function Et(e, t) {
	return e.matrixWorld.decompose(wt, t, Tt), t;
}
function Dt(e) {
	return [Math.atan2(-e.z, e.x), Math.atan2(e.y, Math.sqrt(e.x * e.x + e.z * e.z))];
}
function Ot(e) {
	let t = Math.round(e / 2 / Math.PI);
	return e - 2 * Math.PI * t;
}
var kt = new S(0, 0, 1), At = new S(), jt = new S(), Mt = new S(), Nt = new m(), Pt = new m(), Ft = new m(), It = new m(), Lt = new se(), Rt = class e {
	constructor(e, t) {
		this.offsetFromHeadBone = new S(), this.autoUpdate = !0, this.faceFront = new S(0, 0, 1), this.humanoid = e, this.applier = t, this._yaw = 0, this._pitch = 0, this._needsUpdate = !0, this._restHeadWorldQuaternion = this.getLookAtWorldQuaternion(new m());
	}
	get yaw() {
		return this._yaw;
	}
	set yaw(e) {
		this._yaw = e, this._needsUpdate = !0;
	}
	get pitch() {
		return this._pitch;
	}
	set pitch(e) {
		this._pitch = e, this._needsUpdate = !0;
	}
	get euler() {
		return console.warn("VRMLookAt: euler is deprecated. use getEuler() instead."), this.getEuler(new se());
	}
	getEuler(e) {
		return e.set(c.DEG2RAD * this._pitch, c.DEG2RAD * this._yaw, 0, "YXZ");
	}
	copy(e) {
		if (this.humanoid !== e.humanoid) throw Error("VRMLookAt: humanoid must be same in order to copy");
		return this.offsetFromHeadBone.copy(e.offsetFromHeadBone), this.applier = e.applier, this.autoUpdate = e.autoUpdate, this.target = e.target, this.faceFront.copy(e.faceFront), this;
	}
	clone() {
		return new e(this.humanoid, this.applier).copy(this);
	}
	reset() {
		this._yaw = 0, this._pitch = 0, this._needsUpdate = !0;
	}
	getLookAtWorldPosition(e) {
		let t = this.humanoid.getRawBoneNode("head");
		return e.copy(this.offsetFromHeadBone).applyMatrix4(t.matrixWorld);
	}
	getLookAtWorldQuaternion(e) {
		return Et(this.humanoid.getRawBoneNode("head"), e);
	}
	getFaceFrontQuaternion(e) {
		if (this.faceFront.distanceToSquared(kt) < .01) return e.copy(this._restHeadWorldQuaternion).invert();
		let [t, n] = Dt(this.faceFront);
		return Lt.set(0, .5 * Math.PI + t, n, "YZX"), e.setFromEuler(Lt).premultiply(It.copy(this._restHeadWorldQuaternion).invert());
	}
	getLookAtWorldDirection(e) {
		return this.getLookAtWorldQuaternion(Pt), this.getFaceFrontQuaternion(Ft), e.copy(kt).applyQuaternion(Pt).applyQuaternion(Ft).applyEuler(this.getEuler(Lt));
	}
	lookAt(e) {
		let t = Nt.copy(this._restHeadWorldQuaternion).multiply(rt(this.getLookAtWorldQuaternion(Pt))), n = this.getLookAtWorldPosition(jt), r = Mt.copy(e).sub(n).applyQuaternion(t).normalize(), [i, a] = Dt(this.faceFront), [o, s] = Dt(r), l = Ot(o - i), u = Ot(a - s);
		this._yaw = c.RAD2DEG * l, this._pitch = c.RAD2DEG * u, this._needsUpdate = !0;
	}
	update(e) {
		this.target != null && this.autoUpdate && this.lookAt(this.target.getWorldPosition(At)), this._needsUpdate && (this._needsUpdate = !1, this.applier.applyYawPitch(this._yaw, this._pitch));
	}
};
Rt.EULER_ORDER = "YXZ";
var zt = Rt, Bt = new S(0, 0, 1), G = new m(), Vt = new m(), K = new se(0, 0, 0, "YXZ"), Ht = class {
	constructor(e, t, n, r, i) {
		this.humanoid = e, this.rangeMapHorizontalInner = t, this.rangeMapHorizontalOuter = n, this.rangeMapVerticalDown = r, this.rangeMapVerticalUp = i, this.faceFront = new S(0, 0, 1), this._restQuatLeftEye = new m(), this._restQuatRightEye = new m(), this._restLeftEyeParentWorldQuat = new m(), this._restRightEyeParentWorldQuat = new m();
		let a = this.humanoid.getRawBoneNode("leftEye"), o = this.humanoid.getRawBoneNode("rightEye");
		a && (this._restQuatLeftEye.copy(a.quaternion), Et(a.parent, this._restLeftEyeParentWorldQuat)), o && (this._restQuatRightEye.copy(o.quaternion), Et(o.parent, this._restRightEyeParentWorldQuat));
	}
	applyYawPitch(e, t) {
		let n = this.humanoid.getRawBoneNode("leftEye"), r = this.humanoid.getRawBoneNode("rightEye"), i = this.humanoid.getNormalizedBoneNode("leftEye"), a = this.humanoid.getNormalizedBoneNode("rightEye");
		n && (K.x = t < 0 ? -c.DEG2RAD * this.rangeMapVerticalDown.map(-t) : c.DEG2RAD * this.rangeMapVerticalUp.map(t), K.y = e < 0 ? -c.DEG2RAD * this.rangeMapHorizontalInner.map(-e) : c.DEG2RAD * this.rangeMapHorizontalOuter.map(e), G.setFromEuler(K), this._getWorldFaceFrontQuat(Vt), i.quaternion.copy(Vt).multiply(G).multiply(Vt.invert()), G.copy(this._restLeftEyeParentWorldQuat), n.quaternion.copy(i.quaternion).multiply(G).premultiply(G.invert()).multiply(this._restQuatLeftEye)), r && (K.x = t < 0 ? -c.DEG2RAD * this.rangeMapVerticalDown.map(-t) : c.DEG2RAD * this.rangeMapVerticalUp.map(t), K.y = e < 0 ? -c.DEG2RAD * this.rangeMapHorizontalOuter.map(-e) : c.DEG2RAD * this.rangeMapHorizontalInner.map(e), G.setFromEuler(K), this._getWorldFaceFrontQuat(Vt), a.quaternion.copy(Vt).multiply(G).multiply(Vt.invert()), G.copy(this._restRightEyeParentWorldQuat), r.quaternion.copy(a.quaternion).multiply(G).premultiply(G.invert()).multiply(this._restQuatRightEye));
	}
	lookAt(e) {
		console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");
		let t = c.RAD2DEG * e.y, n = c.RAD2DEG * e.x;
		this.applyYawPitch(t, n);
	}
	_getWorldFaceFrontQuat(e) {
		if (this.faceFront.distanceToSquared(Bt) < .01) return e.identity();
		let [t, n] = Dt(this.faceFront);
		return K.set(0, .5 * Math.PI + t, n, "YZX"), e.setFromEuler(K);
	}
};
Ht.type = "bone";
var Ut = class {
	constructor(e, t, n, r, i) {
		this.expressions = e, this.rangeMapHorizontalInner = t, this.rangeMapHorizontalOuter = n, this.rangeMapVerticalDown = r, this.rangeMapVerticalUp = i;
	}
	applyYawPitch(e, t) {
		t < 0 ? (this.expressions.setValue("lookDown", 0), this.expressions.setValue("lookUp", this.rangeMapVerticalUp.map(-t))) : (this.expressions.setValue("lookUp", 0), this.expressions.setValue("lookDown", this.rangeMapVerticalDown.map(t))), e < 0 ? (this.expressions.setValue("lookLeft", 0), this.expressions.setValue("lookRight", this.rangeMapHorizontalOuter.map(-e))) : (this.expressions.setValue("lookRight", 0), this.expressions.setValue("lookLeft", this.rangeMapHorizontalOuter.map(e)));
	}
	lookAt(e) {
		console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");
		let t = c.RAD2DEG * e.y, n = c.RAD2DEG * e.x;
		this.applyYawPitch(t, n);
	}
};
Ut.type = "expression";
var Wt = class {
	constructor(e, t) {
		this.inputMaxValue = e, this.outputScale = t;
	}
	map(e) {
		return this.outputScale * Ne(e / this.inputMaxValue);
	}
}, Gt = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), Kt = .01, qt = class {
	get name() {
		return "VRMLookAtLoaderPlugin";
	}
	constructor(e, t) {
		this.parser = e, this.helperRoot = t?.helperRoot;
	}
	afterRoot(e) {
		return H(this, null, function* () {
			let t = e.userData.vrmHumanoid;
			if (t === null) return;
			if (t === void 0) throw Error("VRMLookAtLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");
			let n = e.userData.vrmExpressionManager;
			if (n !== null) {
				if (n === void 0) throw Error("VRMLookAtLoaderPlugin: vrmExpressionManager is undefined. VRMExpressionLoaderPlugin have to be used first");
				e.userData.vrmLookAt = yield this._import(e, t, n);
			}
		});
	}
	_import(e, t, n) {
		return H(this, null, function* () {
			return t == null || n == null ? null : (yield this._v1Import(e, t, n)) || (yield this._v0Import(e, t, n)) || null;
		});
	}
	_v1Import(e, t, n) {
		return H(this, null, function* () {
			let e = this.parser.json;
			if (e.extensionsUsed?.indexOf("VRMC_vrm") === -1) return null;
			let r = e.extensions?.VRMC_vrm;
			if (!r) return null;
			let i = r.specVersion;
			if (!Gt.has(i)) return console.warn(`VRMLookAtLoaderPlugin: Unknown VRMC_vrm specVersion "${i}"`), null;
			let a = r.lookAt;
			if (!a) return null;
			let o = a.type === "expression" ? 1 : 10, s = this._v1ImportRangeMap(a.rangeMapHorizontalInner, o), c = this._v1ImportRangeMap(a.rangeMapHorizontalOuter, o), l = this._v1ImportRangeMap(a.rangeMapVerticalDown, o), u = this._v1ImportRangeMap(a.rangeMapVerticalUp, o), d;
			d = a.type === "expression" ? new Ut(n, s, c, l, u) : new Ht(t, s, c, l, u);
			let f = this._importLookAt(t, d);
			return f.offsetFromHeadBone.fromArray(a.offsetFromHeadBone ?? [
				0,
				.06,
				0
			]), f;
		});
	}
	_v1ImportRangeMap(e, t) {
		let n = e?.inputMaxValue ?? 90, r = e?.outputScale ?? t;
		return n < Kt && (console.warn("VRMLookAtLoaderPlugin: inputMaxValue of a range map is too small. Consider reviewing the range map!"), n = Kt), new Wt(n, r);
	}
	_v0Import(e, t, n) {
		return H(this, null, function* () {
			let e = this.parser.json.extensions?.VRM;
			if (!e) return null;
			let r = e.firstPerson;
			if (!r) return null;
			let i = r.lookAtTypeName === "BlendShape" ? 1 : 10, a = this._v0ImportDegreeMap(r.lookAtHorizontalInner, i), o = this._v0ImportDegreeMap(r.lookAtHorizontalOuter, i), s = this._v0ImportDegreeMap(r.lookAtVerticalDown, i), c = this._v0ImportDegreeMap(r.lookAtVerticalUp, i), l;
			l = r.lookAtTypeName === "BlendShape" ? new Ut(n, a, o, s, c) : new Ht(t, a, o, s, c);
			let u = this._importLookAt(t, l);
			return r.firstPersonBoneOffset ? u.offsetFromHeadBone.set(r.firstPersonBoneOffset.x ?? 0, r.firstPersonBoneOffset.y ?? .06, -(r.firstPersonBoneOffset.z ?? 0)) : u.offsetFromHeadBone.set(0, .06, 0), u.faceFront.set(0, 0, -1), l instanceof Ht && l.faceFront.set(0, 0, -1), u;
		});
	}
	_v0ImportDegreeMap(e, t) {
		let n = e?.curve;
		JSON.stringify(n) !== "[0,0,0,1,1,1,1,0]" && console.warn("Curves of LookAtDegreeMap defined in VRM 0.0 are not supported");
		let r = e?.xRange ?? 90, i = e?.yRange ?? t;
		return r < Kt && (console.warn("VRMLookAtLoaderPlugin: xRange of a degree map is too small. Consider reviewing the degree map!"), r = Kt), new Wt(r, i);
	}
	_importLookAt(e, t) {
		let n = new zt(e, t);
		if (this.helperRoot) {
			let e = new Ct(n);
			this.helperRoot.add(e), e.renderOrder = this.helperRoot.renderOrder;
		}
		return n;
	}
};
function Jt(e, t) {
	return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
}
var Yt = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), Xt = class {
	get name() {
		return "VRMMetaLoaderPlugin";
	}
	constructor(e, t) {
		this.parser = e, this.needThumbnailImage = t?.needThumbnailImage ?? !1, this.acceptLicenseUrls = t?.acceptLicenseUrls ?? ["https://vrm.dev/licenses/1.0/"], this.acceptV0Meta = t?.acceptV0Meta ?? !0;
	}
	afterRoot(e) {
		return H(this, null, function* () {
			e.userData.vrmMeta = yield this._import(e);
		});
	}
	_import(e) {
		return H(this, null, function* () {
			return (yield this._v1Import(e)) ?? (yield this._v0Import(e)) ?? null;
		});
	}
	_v1Import(e) {
		return H(this, null, function* () {
			let e = this.parser.json;
			if (e.extensionsUsed?.indexOf("VRMC_vrm") === -1) return null;
			let t = e.extensions?.VRMC_vrm;
			if (t == null) return null;
			let n = t.specVersion;
			if (!Yt.has(n)) return console.warn(`VRMMetaLoaderPlugin: Unknown VRMC_vrm specVersion "${n}"`), null;
			let r = t.meta;
			if (!r) return null;
			let i = r.licenseUrl;
			if (!new Set(this.acceptLicenseUrls).has(i)) throw Error(`VRMMetaLoaderPlugin: The license url "${i}" is not accepted`);
			let a;
			return this.needThumbnailImage && r.thumbnailImage != null && (a = (yield this._extractGLTFImage(r.thumbnailImage)) ?? void 0), {
				metaVersion: "1",
				name: r.name,
				version: r.version,
				authors: r.authors,
				copyrightInformation: r.copyrightInformation,
				contactInformation: r.contactInformation,
				references: r.references,
				thirdPartyLicenses: r.thirdPartyLicenses,
				thumbnailImage: a,
				licenseUrl: r.licenseUrl,
				avatarPermission: r.avatarPermission,
				allowExcessivelyViolentUsage: r.allowExcessivelyViolentUsage,
				allowExcessivelySexualUsage: r.allowExcessivelySexualUsage,
				commercialUsage: r.commercialUsage,
				allowPoliticalOrReligiousUsage: r.allowPoliticalOrReligiousUsage,
				allowAntisocialOrHateUsage: r.allowAntisocialOrHateUsage,
				creditNotation: r.creditNotation,
				allowRedistribution: r.allowRedistribution,
				modification: r.modification,
				otherLicenseUrl: r.otherLicenseUrl
			};
		});
	}
	_v0Import(e) {
		return H(this, null, function* () {
			let e = this.parser.json.extensions?.VRM;
			if (!e) return null;
			let t = e.meta;
			if (!t) return null;
			if (!this.acceptV0Meta) throw Error("VRMMetaLoaderPlugin: Attempted to load VRM0.0 meta but acceptV0Meta is false");
			let n;
			return this.needThumbnailImage && t.texture != null && t.texture !== -1 && (n = yield this.parser.getDependency("texture", t.texture)), {
				metaVersion: "0",
				allowedUserName: t.allowedUserName,
				author: t.author,
				commercialUssageName: t.commercialUssageName,
				contactInformation: t.contactInformation,
				licenseName: t.licenseName,
				otherLicenseUrl: t.otherLicenseUrl,
				otherPermissionUrl: t.otherPermissionUrl,
				reference: t.reference,
				sexualUssageName: t.sexualUssageName,
				texture: n ?? void 0,
				title: t.title,
				version: t.version,
				violentUssageName: t.violentUssageName
			};
		});
	}
	_extractGLTFImage(e) {
		return H(this, null, function* () {
			let t = this.parser.json.images?.[e];
			if (t == null) return console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${e}] of glTF as a thumbnail but the image doesn't exist`), null;
			let n = t.uri;
			if (t.bufferView != null) {
				let e = yield this.parser.getDependency("bufferView", t.bufferView), r = new Blob([e], { type: t.mimeType });
				n = URL.createObjectURL(r);
			}
			return n == null ? (console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${e}] of glTF as a thumbnail but the image couldn't load properly`), null) : yield new u().loadAsync(Jt(n, this.parser.options.path)).catch((e) => (console.error(e), console.warn("VRMMetaLoaderPlugin: Failed to load a thumbnail image"), null));
		});
	}
}, Zt = class {
	constructor(e) {
		this.scene = e.scene, this.meta = e.meta, this.humanoid = e.humanoid, this.expressionManager = e.expressionManager, this.firstPerson = e.firstPerson, this.lookAt = e.lookAt;
	}
	update(e) {
		this.humanoid.update(), this.lookAt && this.lookAt.update(e), this.expressionManager && this.expressionManager.update();
	}
}, Qt = class extends Zt {
	constructor(e) {
		super(e), this.materials = e.materials, this.springBoneManager = e.springBoneManager, this.nodeConstraintManager = e.nodeConstraintManager;
	}
	update(e) {
		super.update(e), this.nodeConstraintManager && this.nodeConstraintManager.update(), this.springBoneManager && this.springBoneManager.update(e), this.materials && this.materials.forEach((t) => {
			t.update && t.update(e);
		});
	}
}, $t = Object.defineProperty, en = Object.getOwnPropertySymbols, tn = Object.prototype.hasOwnProperty, nn = Object.prototype.propertyIsEnumerable, rn = (e, t, n) => t in e ? $t(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, an = (e, t) => {
	for (var n in t ||= {}) tn.call(t, n) && rn(e, n, t[n]);
	if (en) for (var n of en(t)) nn.call(t, n) && rn(e, n, t[n]);
	return e;
}, q = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
});
function on(e, t) {
	e.colorSpace = t;
}
var sn = class {
	get pending() {
		return Promise.all(this._pendings);
	}
	constructor(e, t) {
		this._parser = e, this._materialParams = t, this._pendings = [];
	}
	assignPrimitive(e, t) {
		t != null && (this._materialParams[e] = t);
	}
	assignColor(e, t, n) {
		if (t != null) {
			let r = new M().fromArray(t);
			n && r.convertSRGBToLinear(), this._materialParams[e] = r;
		}
	}
	assignTexture(e, t, n) {
		return q(this, null, function* () {
			let r = q(this, null, function* () {
				if (t != null) {
					let r = yield this._parser.assignTexture(this._materialParams, e, t);
					if (r == null) {
						console.warn("GLTFMToonMaterialParamsAssignHelper: Failed to load texture. The rendering result may be wrong");
						return;
					}
					n && on(r, "srgb");
				}
			});
			return this._pendings.push(r), r;
		});
	}
	assignTextureByIndex(e, t, n) {
		return q(this, null, function* () {
			return this.assignTexture(e, t == null ? void 0 : { index: t }, n);
		});
	}
}, cn = "// #define PHONG\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n  varying vec3 vNormal;\n#endif\n\n#include <common>\n\n// #include <uv_pars_vertex>\n#ifdef MTOON_USE_UV\n  varying vec2 vUv;\n\n  // COMPAT: pre-r151 uses a common uvTransform\n  #if THREE_VRM_THREE_REVISION < 151\n    uniform mat3 uvTransform;\n  #endif\n#endif\n\n// #include <uv2_pars_vertex>\n// COMAPT: pre-r151 uses uv2 for lightMap and aoMap\n#if THREE_VRM_THREE_REVISION < 151\n  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n    attribute vec2 uv2;\n    varying vec2 vUv2;\n    uniform mat3 uv2Transform;\n  #endif\n#endif\n\n// #include <displacementmap_pars_vertex>\n// #include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\n#ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE\n  uniform sampler2D outlineWidthMultiplyTexture;\n  uniform mat3 outlineWidthMultiplyTextureUvTransform;\n#endif\n\nuniform float outlineWidthFactor;\n\nvoid main() {\n\n  // #include <uv_vertex>\n  #ifdef MTOON_USE_UV\n    // COMPAT: pre-r151 uses a common uvTransform\n    #if THREE_VRM_THREE_REVISION >= 151\n      vUv = uv;\n    #else\n      vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n    #endif\n  #endif\n\n  // #include <uv2_vertex>\n  // COMAPT: pre-r151 uses uv2 for lightMap and aoMap\n  #if THREE_VRM_THREE_REVISION < 151\n    #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n      vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;\n    #endif\n  #endif\n\n  #include <color_vertex>\n\n  #include <beginnormal_vertex>\n  #include <morphnormal_vertex>\n  #include <skinbase_vertex>\n  #include <skinnormal_vertex>\n\n  // we need this to compute the outline properly\n  objectNormal = normalize( objectNormal );\n\n  #include <defaultnormal_vertex>\n\n  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n    vNormal = normalize( transformedNormal );\n  #endif\n\n  #include <begin_vertex>\n\n  #include <morphtarget_vertex>\n  #include <skinning_vertex>\n  // #include <displacementmap_vertex>\n  #include <project_vertex>\n  #include <logdepthbuf_vertex>\n  #include <clipping_planes_vertex>\n\n  vViewPosition = - mvPosition.xyz;\n\n  #ifdef OUTLINE\n    float worldNormalLength = length( transformedNormal );\n    vec3 outlineOffset = outlineWidthFactor * worldNormalLength * objectNormal;\n\n    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE\n      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;\n      float outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;\n      outlineOffset *= outlineTex;\n    #endif\n\n    #ifdef OUTLINE_WIDTH_SCREEN\n      outlineOffset *= vViewPosition.z / projectionMatrix[ 1 ].y;\n    #endif\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( outlineOffset + transformed, 1.0 );\n\n    gl_Position.z += 1E-6 * gl_Position.w; // anti-artifact magic\n  #endif\n\n  #include <worldpos_vertex>\n  // #include <envmap_vertex>\n  #include <shadowmap_vertex>\n  #include <fog_vertex>\n\n}", ln = "// #define PHONG\n\nuniform vec3 litFactor;\n\nuniform float opacity;\n\nuniform vec3 shadeColorFactor;\n#ifdef USE_SHADEMULTIPLYTEXTURE\n  uniform sampler2D shadeMultiplyTexture;\n  uniform mat3 shadeMultiplyTextureUvTransform;\n#endif\n\nuniform float shadingShiftFactor;\nuniform float shadingToonyFactor;\n\n#ifdef USE_SHADINGSHIFTTEXTURE\n  uniform sampler2D shadingShiftTexture;\n  uniform mat3 shadingShiftTextureUvTransform;\n  uniform float shadingShiftTextureScale;\n#endif\n\nuniform float giEqualizationFactor;\n\nuniform vec3 parametricRimColorFactor;\n#ifdef USE_RIMMULTIPLYTEXTURE\n  uniform sampler2D rimMultiplyTexture;\n  uniform mat3 rimMultiplyTextureUvTransform;\n#endif\nuniform float rimLightingMixFactor;\nuniform float parametricRimFresnelPowerFactor;\nuniform float parametricRimLiftFactor;\n\n#ifdef USE_MATCAPTEXTURE\n  uniform vec3 matcapFactor;\n  uniform sampler2D matcapTexture;\n  uniform mat3 matcapTextureUvTransform;\n#endif\n\nuniform vec3 emissive;\nuniform float emissiveIntensity;\n\nuniform vec3 outlineColorFactor;\nuniform float outlineLightingMixFactor;\n\n#ifdef USE_UVANIMATIONMASKTEXTURE\n  uniform sampler2D uvAnimationMaskTexture;\n  uniform mat3 uvAnimationMaskTextureUvTransform;\n#endif\n\nuniform float uvAnimationScrollXOffset;\nuniform float uvAnimationScrollYOffset;\nuniform float uvAnimationRotationPhase;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n\n// #include <uv_pars_fragment>\n#if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )\n  varying vec2 vUv;\n#endif\n\n// #include <uv2_pars_fragment>\n// COMAPT: pre-r151 uses uv2 for lightMap and aoMap\n#if THREE_VRM_THREE_REVISION < 151\n  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n    varying vec2 vUv2;\n  #endif\n#endif\n\n#include <map_pars_fragment>\n\n#ifdef USE_MAP\n  uniform mat3 mapUvTransform;\n#endif\n\n// #include <alphamap_pars_fragment>\n\n#include <alphatest_pars_fragment>\n\n#include <aomap_pars_fragment>\n// #include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n\n#ifdef USE_EMISSIVEMAP\n  uniform mat3 emissiveMapUvTransform;\n#endif\n\n// #include <envmap_common_pars_fragment>\n// #include <envmap_pars_fragment>\n// #include <cube_uv_reflection_fragment>\n#include <fog_pars_fragment>\n\n// #include <bsdfs>\n// COMPAT: pre-r151 doesn't have BRDF_Lambert in <common>\n#if THREE_VRM_THREE_REVISION < 151\n  vec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n    return RECIPROCAL_PI * diffuseColor;\n  }\n#endif\n\n#include <lights_pars_begin>\n\n#include <normal_pars_fragment>\n\n// #include <lights_phong_pars_fragment>\nvarying vec3 vViewPosition;\n\nstruct MToonMaterial {\n  vec3 diffuseColor;\n  vec3 shadeColor;\n  float shadingShift;\n};\n\nfloat linearstep( float a, float b, float t ) {\n  return clamp( ( t - a ) / ( b - a ), 0.0, 1.0 );\n}\n\n/**\n * Convert NdotL into toon shading factor using shadingShift and shadingToony\n */\nfloat getShading(\n  const in float dotNL,\n  const in float shadow,\n  const in float shadingShift\n) {\n  float shading = dotNL;\n  shading = shading + shadingShift;\n  shading = linearstep( -1.0 + shadingToonyFactor, 1.0 - shadingToonyFactor, shading );\n  shading *= shadow;\n  return shading;\n}\n\n/**\n * Mix diffuseColor and shadeColor using shading factor and light color\n */\nvec3 getDiffuse(\n  const in MToonMaterial material,\n  const in float shading,\n  in vec3 lightColor\n) {\n  #ifdef DEBUG_LITSHADERATE\n    return vec3( BRDF_Lambert( shading * lightColor ) );\n  #endif\n\n  vec3 col = lightColor * BRDF_Lambert( mix( material.shadeColor, material.diffuseColor, shading ) );\n\n  // The \"comment out if you want to PBR absolutely\" line\n  #ifdef V0_COMPAT_SHADE\n    col = min( col, material.diffuseColor );\n  #endif\n\n  return col;\n}\n\n// COMPAT: pre-r156 uses a struct GeometricContext\n#if THREE_VRM_THREE_REVISION >= 157\n  void RE_Direct_MToon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {\n    float dotNL = clamp( dot( geometryNormal, directLight.direction ), -1.0, 1.0 );\n    vec3 irradiance = directLight.color;\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n\n    irradiance *= dotNL;\n\n    float shading = getShading( dotNL, shadow, material.shadingShift );\n\n    // toon shaded diffuse\n    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );\n  }\n\n  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {\n    // indirect diffuse will use diffuseColor, no shadeColor involved\n    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n  }\n#else\n  void RE_Direct_MToon( const in IncidentLight directLight, const in GeometricContext geometry, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {\n    float dotNL = clamp( dot( geometry.normal, directLight.direction ), -1.0, 1.0 );\n    vec3 irradiance = directLight.color;\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n\n    irradiance *= dotNL;\n\n    float shading = getShading( dotNL, shadow, material.shadingShift );\n\n    // toon shaded diffuse\n    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );\n  }\n\n  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in GeometricContext geometry, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {\n    // indirect diffuse will use diffuseColor, no shadeColor involved\n    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n  }\n#endif\n\n#define RE_Direct RE_Direct_MToon\n#define RE_IndirectDiffuse RE_IndirectDiffuse_MToon\n#define Material_LightProbeLOD( material ) (0)\n\n#include <shadowmap_pars_fragment>\n// #include <bumpmap_pars_fragment>\n\n// #include <normalmap_pars_fragment>\n#ifdef USE_NORMALMAP\n\n  uniform sampler2D normalMap;\n  uniform mat3 normalMapUvTransform;\n  uniform vec2 normalScale;\n\n#endif\n\n// COMPAT: pre-r151\n// USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151\n#if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )\n\n  uniform mat3 normalMatrix;\n\n#endif\n\n// COMPAT: pre-r151\n// USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( TANGENTSPACE_NORMALMAP ) )\n\n  // Per-Pixel Tangent Space Normal Mapping\n  // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n  // three-vrm specific change: it requires `uv` as an input in order to support uv scrolls\n\n  // Temporary compat against shader change @ Three.js r126, r151\n  #if THREE_VRM_THREE_REVISION >= 151\n\n    mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n\n      vec3 q0 = dFdx( eye_pos.xyz );\n      vec3 q1 = dFdy( eye_pos.xyz );\n      vec2 st0 = dFdx( uv.st );\n      vec2 st1 = dFdy( uv.st );\n\n      vec3 N = surf_norm;\n\n      vec3 q1perp = cross( q1, N );\n      vec3 q0perp = cross( N, q0 );\n\n      vec3 T = q1perp * st0.x + q0perp * st1.x;\n      vec3 B = q1perp * st0.y + q0perp * st1.y;\n\n      float det = max( dot( T, T ), dot( B, B ) );\n      float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n\n      return mat3( T * scale, B * scale, N );\n\n    }\n\n  #else\n\n    vec3 perturbNormal2Arb( vec2 uv, vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {\n\n      vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );\n      vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );\n      vec2 st0 = dFdx( uv.st );\n      vec2 st1 = dFdy( uv.st );\n\n      vec3 N = normalize( surf_norm );\n\n      vec3 q1perp = cross( q1, N );\n      vec3 q0perp = cross( N, q0 );\n\n      vec3 T = q1perp * st0.x + q0perp * st1.x;\n      vec3 B = q1perp * st0.y + q0perp * st1.y;\n\n      // three-vrm specific change: Workaround for the issue that happens when delta of uv = 0.0\n      // TODO: Is this still required? Or shall I make a PR about it?\n      if ( length( T ) == 0.0 || length( B ) == 0.0 ) {\n        return surf_norm;\n      }\n\n      float det = max( dot( T, T ), dot( B, B ) );\n      float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );\n\n      return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );\n\n    }\n\n  #endif\n\n#endif\n\n// #include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\n// == post correction ==========================================================\nvoid postCorrection() {\n  #include <tonemapping_fragment>\n  #include <colorspace_fragment>\n  #include <fog_fragment>\n  #include <premultiplied_alpha_fragment>\n  #include <dithering_fragment>\n}\n\n// == main procedure ===========================================================\nvoid main() {\n  #include <clipping_planes_fragment>\n\n  vec2 uv = vec2(0.5, 0.5);\n\n  #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )\n    uv = vUv;\n\n    float uvAnimMask = 1.0;\n    #ifdef USE_UVANIMATIONMASKTEXTURE\n      vec2 uvAnimationMaskTextureUv = ( uvAnimationMaskTextureUvTransform * vec3( uv, 1 ) ).xy;\n      uvAnimMask = texture2D( uvAnimationMaskTexture, uvAnimationMaskTextureUv ).b;\n    #endif\n\n    float uvRotCos = cos( uvAnimationRotationPhase * uvAnimMask );\n    float uvRotSin = sin( uvAnimationRotationPhase * uvAnimMask );\n    uv = mat2( uvRotCos, -uvRotSin, uvRotSin, uvRotCos ) * ( uv - 0.5 ) + 0.5;\n    uv = uv + vec2( uvAnimationScrollXOffset, uvAnimationScrollYOffset ) * uvAnimMask;\n  #endif\n\n  #ifdef DEBUG_UV\n    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n    #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )\n      gl_FragColor = vec4( uv, 0.0, 1.0 );\n    #endif\n    return;\n  #endif\n\n  vec4 diffuseColor = vec4( litFactor, opacity );\n  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n  vec3 totalEmissiveRadiance = emissive * emissiveIntensity;\n\n  #include <logdepthbuf_fragment>\n\n  // #include <map_fragment>\n  #ifdef USE_MAP\n    vec2 mapUv = ( mapUvTransform * vec3( uv, 1 ) ).xy;\n    vec4 sampledDiffuseColor = texture2D( map, mapUv );\n    #ifdef DECODE_VIDEO_TEXTURE\n      sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );\n    #endif\n    diffuseColor *= sampledDiffuseColor;\n  #endif\n\n  // #include <color_fragment>\n  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )\n    diffuseColor.rgb *= vColor;\n  #endif\n\n  // #include <alphamap_fragment>\n\n  #include <alphatest_fragment>\n\n  // #include <specularmap_fragment>\n\n  // #include <normal_fragment_begin>\n  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;\n\n  #ifdef FLAT_SHADED\n\n    vec3 fdx = dFdx( vViewPosition );\n    vec3 fdy = dFdy( vViewPosition );\n    vec3 normal = normalize( cross( fdx, fdy ) );\n\n  #else\n\n    vec3 normal = normalize( vNormal );\n\n    #ifdef DOUBLE_SIDED\n\n      normal *= faceDirection;\n\n    #endif\n\n  #endif\n\n  #ifdef USE_NORMALMAP\n\n    vec2 normalMapUv = ( normalMapUvTransform * vec3( uv, 1 ) ).xy;\n\n  #endif\n\n  #ifdef USE_NORMALMAP_TANGENTSPACE\n\n    #ifdef USE_TANGENT\n\n      mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\n    #else\n\n      mat3 tbn = getTangentFrame( - vViewPosition, normal, normalMapUv );\n\n    #endif\n\n    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\n      tbn[0] *= faceDirection;\n      tbn[1] *= faceDirection;\n\n    #endif\n\n  #endif\n\n  #ifdef USE_CLEARCOAT_NORMALMAP\n\n    #ifdef USE_TANGENT\n\n      mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\n    #else\n\n      mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n\n    #endif\n\n    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\n      tbn2[0] *= faceDirection;\n      tbn2[1] *= faceDirection;\n\n    #endif\n\n  #endif\n\n  // non perturbed normal for clearcoat among others\n\n  vec3 nonPerturbedNormal = normal;\n\n  #ifdef OUTLINE\n    normal *= -1.0;\n  #endif\n\n  // #include <normal_fragment_maps>\n\n  // COMPAT: pre-r151\n  // USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151\n  #if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )\n\n    normal = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals\n\n    #ifdef FLIP_SIDED\n\n      normal = - normal;\n\n    #endif\n\n    #ifdef DOUBLE_SIDED\n\n      normal = normal * faceDirection;\n\n    #endif\n\n    normal = normalize( normalMatrix * normal );\n\n  // COMPAT: pre-r151\n  // USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151\n  #elif defined( USE_NORMALMAP_TANGENTSPACE ) || defined( TANGENTSPACE_NORMALMAP )\n\n    vec3 mapN = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0;\n    mapN.xy *= normalScale;\n\n    // COMPAT: pre-r151\n    #if THREE_VRM_THREE_REVISION >= 151 || defined( USE_TANGENT )\n\n      normal = normalize( tbn * mapN );\n\n    #else\n\n      normal = perturbNormal2Arb( uv, -vViewPosition, normal, mapN, faceDirection );\n\n    #endif\n\n  #endif\n\n  // #include <emissivemap_fragment>\n  #ifdef USE_EMISSIVEMAP\n    vec2 emissiveMapUv = ( emissiveMapUvTransform * vec3( uv, 1 ) ).xy;\n    totalEmissiveRadiance *= texture2D( emissiveMap, emissiveMapUv ).rgb;\n  #endif\n\n  #ifdef DEBUG_NORMAL\n    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0 );\n    return;\n  #endif\n\n  // -- MToon: lighting --------------------------------------------------------\n  // accumulation\n  // #include <lights_phong_fragment>\n  MToonMaterial material;\n\n  material.diffuseColor = diffuseColor.rgb;\n\n  material.shadeColor = shadeColorFactor;\n  #ifdef USE_SHADEMULTIPLYTEXTURE\n    vec2 shadeMultiplyTextureUv = ( shadeMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;\n    material.shadeColor *= texture2D( shadeMultiplyTexture, shadeMultiplyTextureUv ).rgb;\n  #endif\n\n  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )\n    material.shadeColor.rgb *= vColor;\n  #endif\n\n  material.shadingShift = shadingShiftFactor;\n  #ifdef USE_SHADINGSHIFTTEXTURE\n    vec2 shadingShiftTextureUv = ( shadingShiftTextureUvTransform * vec3( uv, 1 ) ).xy;\n    material.shadingShift += texture2D( shadingShiftTexture, shadingShiftTextureUv ).r * shadingShiftTextureScale;\n  #endif\n\n  // #include <lights_fragment_begin>\n\n  // MToon Specific changes:\n  // Since we want to take shadows into account of shading instead of irradiance,\n  // we had to modify the codes that multiplies the results of shadowmap into color of direct lights.\n\n  // COMPAT: pre-r156 uses a struct GeometricContext\n  #if THREE_VRM_THREE_REVISION >= 157\n    vec3 geometryPosition = - vViewPosition;\n    vec3 geometryNormal = normal;\n    vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\n\n    vec3 geometryClearcoatNormal;\n\n    #ifdef USE_CLEARCOAT\n\n      geometryClearcoatNormal = clearcoatNormal;\n\n    #endif\n  #else\n    GeometricContext geometry;\n\n    geometry.position = - vViewPosition;\n    geometry.normal = normal;\n    geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\n\n    #ifdef USE_CLEARCOAT\n\n      geometry.clearcoatNormal = clearcoatNormal;\n\n    #endif\n  #endif\n\n  IncidentLight directLight;\n\n  // since these variables will be used in unrolled loop, we have to define in prior\n  float shadow;\n\n  #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n\n    PointLight pointLight;\n    #if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n    PointLightShadow pointLightShadow;\n    #endif\n\n    #pragma unroll_loop_start\n    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\n      pointLight = pointLights[ i ];\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        getPointLightInfo( pointLight, geometryPosition, directLight );\n      #else\n        getPointLightInfo( pointLight, geometry, directLight );\n      #endif\n\n      shadow = 1.0;\n      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )\n      pointLightShadow = pointLightShadows[ i ];\n      // COMPAT: pre-r166\n      // r166 introduced shadowIntensity\n      #if THREE_VRM_THREE_REVISION >= 166\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n      #else\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n      #endif\n      #endif\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );\n      #else\n        RE_Direct( directLight, geometry, material, shadow, reflectedLight );\n      #endif\n\n    }\n    #pragma unroll_loop_end\n\n  #endif\n\n  #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n\n    SpotLight spotLight;\n    // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS, r144+ uses NUM_SPOT_LIGHT_COORDS\n    #if THREE_VRM_THREE_REVISION >= 144\n      #if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_COORDS > 0\n      SpotLightShadow spotLightShadow;\n      #endif\n    #elif defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n    SpotLightShadow spotLightShadow;\n    #endif\n\n    #pragma unroll_loop_start\n    for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\n      spotLight = spotLights[ i ];\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        getSpotLightInfo( spotLight, geometryPosition, directLight );\n      #else\n        getSpotLightInfo( spotLight, geometry, directLight );\n      #endif\n\n      shadow = 1.0;\n      // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS and vSpotShadowCoord, r144+ uses NUM_SPOT_LIGHT_COORDS and vSpotLightCoord\n      // COMPAT: pre-r166 does not have shadowIntensity, r166+ has shadowIntensity\n      #if THREE_VRM_THREE_REVISION >= 166\n        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )\n        spotLightShadow = spotLightShadows[ i ];\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n        #endif\n      #elif THREE_VRM_THREE_REVISION >= 144\n        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )\n        spotLightShadow = spotLightShadows[ i ];\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n        #endif\n      #elif defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n      spotLightShadow = spotLightShadows[ i ];\n      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n      #endif\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );\n      #else\n        RE_Direct( directLight, geometry, material, shadow, reflectedLight );\n      #endif\n\n    }\n    #pragma unroll_loop_end\n\n  #endif\n\n  #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n\n    DirectionalLight directionalLight;\n    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n    DirectionalLightShadow directionalLightShadow;\n    #endif\n\n    #pragma unroll_loop_start\n    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\n      directionalLight = directionalLights[ i ];\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        getDirectionalLightInfo( directionalLight, directLight );\n      #else\n        getDirectionalLightInfo( directionalLight, geometry, directLight );\n      #endif\n\n      shadow = 1.0;\n      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n      directionalLightShadow = directionalLightShadows[ i ];\n      // COMPAT: pre-r166\n      // r166 introduced shadowIntensity\n      #if THREE_VRM_THREE_REVISION >= 166\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n      #else\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n      #endif\n      #endif\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );\n      #else\n        RE_Direct( directLight, geometry, material, shadow, reflectedLight );\n      #endif\n\n    }\n    #pragma unroll_loop_end\n\n  #endif\n\n  // #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n\n  //   RectAreaLight rectAreaLight;\n\n  //   #pragma unroll_loop_start\n  //   for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n\n  //     rectAreaLight = rectAreaLights[ i ];\n  //     RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );\n\n  //   }\n  //   #pragma unroll_loop_end\n\n  // #endif\n\n  #if defined( RE_IndirectDiffuse )\n\n    vec3 iblIrradiance = vec3( 0.0 );\n\n    vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n\n    // COMPAT: pre-r156 uses a struct GeometricContext\n    // COMPAT: pre-r156 doesn't have a define USE_LIGHT_PROBES\n    #if THREE_VRM_THREE_REVISION >= 157\n      #if defined( USE_LIGHT_PROBES )\n        irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n      #endif\n    #else\n      irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );\n    #endif\n\n    #if ( NUM_HEMI_LIGHTS > 0 )\n\n      #pragma unroll_loop_start\n      for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\n        // COMPAT: pre-r156 uses a struct GeometricContext\n        #if THREE_VRM_THREE_REVISION >= 157\n          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n        #else\n          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );\n        #endif\n\n      }\n      #pragma unroll_loop_end\n\n    #endif\n\n  #endif\n\n  // #if defined( RE_IndirectSpecular )\n\n  //   vec3 radiance = vec3( 0.0 );\n  //   vec3 clearcoatRadiance = vec3( 0.0 );\n\n  // #endif\n\n  #include <lights_fragment_maps>\n  #include <lights_fragment_end>\n\n  // modulation\n  #include <aomap_fragment>\n\n  vec3 col = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n\n  #ifdef DEBUG_LITSHADERATE\n    gl_FragColor = vec4( col, diffuseColor.a );\n    postCorrection();\n    return;\n  #endif\n\n  // -- MToon: rim lighting -----------------------------------------\n  vec3 viewDir = normalize( vViewPosition );\n\n  #ifndef PHYSICALLY_CORRECT_LIGHTS\n    reflectedLight.directSpecular /= PI;\n  #endif\n  vec3 rimMix = mix( vec3( 1.0 ), reflectedLight.directSpecular, rimLightingMixFactor );\n\n  vec3 rim = parametricRimColorFactor * pow( saturate( 1.0 - dot( viewDir, normal ) + parametricRimLiftFactor ), parametricRimFresnelPowerFactor );\n\n  #ifdef USE_MATCAPTEXTURE\n    {\n      vec3 x = normalize( vec3( viewDir.z, 0.0, -viewDir.x ) );\n      vec3 y = cross( viewDir, x ); // guaranteed to be normalized\n      vec2 sphereUv = 0.5 + 0.5 * vec2( dot( x, normal ), -dot( y, normal ) );\n      sphereUv = ( matcapTextureUvTransform * vec3( sphereUv, 1 ) ).xy;\n      vec3 matcap = texture2D( matcapTexture, sphereUv ).rgb;\n      rim += matcapFactor * matcap;\n    }\n  #endif\n\n  #ifdef USE_RIMMULTIPLYTEXTURE\n    vec2 rimMultiplyTextureUv = ( rimMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;\n    rim *= texture2D( rimMultiplyTexture, rimMultiplyTextureUv ).rgb;\n  #endif\n\n  col += rimMix * rim;\n\n  // -- MToon: Emission --------------------------------------------------------\n  col += totalEmissiveRadiance;\n\n  // #include <envmap_fragment>\n\n  // -- Almost done! -----------------------------------------------------------\n  #if defined( OUTLINE )\n    col = outlineColorFactor.rgb * mix( vec3( 1.0 ), col, outlineLightingMixFactor );\n  #endif\n\n  #ifdef OPAQUE\n    diffuseColor.a = 1.0;\n  #endif\n\n  gl_FragColor = vec4( col, diffuseColor.a );\n  postCorrection();\n}\n", un = {
	None: "none",
	Normal: "normal",
	LitShadeRate: "litShadeRate",
	UV: "uv"
}, dn = {
	None: "none",
	WorldCoordinates: "worldCoordinates",
	ScreenCoordinates: "screenCoordinates"
};
function fn(e) {
	return e.colorSpace;
}
var pn = class extends ne {
	constructor(e = {}) {
		super({
			vertexShader: cn,
			fragmentShader: ln
		}), this.uvAnimationScrollXSpeedFactor = 0, this.uvAnimationScrollYSpeedFactor = 0, this.uvAnimationRotationSpeedFactor = 0, this.fog = !0, this.normalMapType = 0, this._ignoreVertexColor = !0, this._v0CompatShade = !1, this._debugMode = un.None, this._outlineWidthMode = dn.None, this._isOutline = !1, e.transparentWithZWrite && (e.depthWrite = !0), delete e.transparentWithZWrite, e.fog = !0, e.lights = !0, e.clipping = !0, this.uniforms = x.merge([
			te.common,
			te.normalmap,
			te.emissivemap,
			te.fog,
			te.lights,
			{
				litFactor: { value: new M(1, 1, 1) },
				mapUvTransform: { value: new P() },
				colorAlpha: { value: 1 },
				normalMapUvTransform: { value: new P() },
				shadeColorFactor: { value: new M(0, 0, 0) },
				shadeMultiplyTexture: { value: null },
				shadeMultiplyTextureUvTransform: { value: new P() },
				shadingShiftFactor: { value: 0 },
				shadingShiftTexture: { value: null },
				shadingShiftTextureUvTransform: { value: new P() },
				shadingShiftTextureScale: { value: 1 },
				shadingToonyFactor: { value: .9 },
				giEqualizationFactor: { value: .9 },
				matcapFactor: { value: new M(1, 1, 1) },
				matcapTexture: { value: null },
				matcapTextureUvTransform: { value: new P() },
				parametricRimColorFactor: { value: new M(0, 0, 0) },
				rimMultiplyTexture: { value: null },
				rimMultiplyTextureUvTransform: { value: new P() },
				rimLightingMixFactor: { value: 1 },
				parametricRimFresnelPowerFactor: { value: 5 },
				parametricRimLiftFactor: { value: 0 },
				emissive: { value: new M(0, 0, 0) },
				emissiveIntensity: { value: 1 },
				emissiveMapUvTransform: { value: new P() },
				outlineWidthMultiplyTexture: { value: null },
				outlineWidthMultiplyTextureUvTransform: { value: new P() },
				outlineWidthFactor: { value: 0 },
				outlineColorFactor: { value: new M(0, 0, 0) },
				outlineLightingMixFactor: { value: 1 },
				uvAnimationMaskTexture: { value: null },
				uvAnimationMaskTextureUvTransform: { value: new P() },
				uvAnimationScrollXOffset: { value: 0 },
				uvAnimationScrollYOffset: { value: 0 },
				uvAnimationRotationPhase: { value: 0 }
			},
			e.uniforms ?? {}
		]), this.setValues(e), this._uploadUniformsWorkaround(), this.customProgramCacheKey = () => [
			...Object.entries(this._generateDefines()).map(([e, t]) => `${e}:${t}`),
			this.matcapTexture ? `matcapTextureColorSpace:${fn(this.matcapTexture)}` : "",
			this.shadeMultiplyTexture ? `shadeMultiplyTextureColorSpace:${fn(this.shadeMultiplyTexture)}` : "",
			this.rimMultiplyTexture ? `rimMultiplyTextureColorSpace:${fn(this.rimMultiplyTexture)}` : ""
		].join(","), this.onBeforeCompile = (e) => {
			let t = Object.entries(an(an({}, this._generateDefines()), this.defines)).filter(([e, t]) => !!t).map(([e, t]) => `#define ${e} ${t}`).join("\n") + "\n";
			e.vertexShader = t + e.vertexShader, e.fragmentShader = t + e.fragmentShader;
		};
	}
	get color() {
		return this.uniforms.litFactor.value;
	}
	set color(e) {
		this.uniforms.litFactor.value = e;
	}
	get map() {
		return this.uniforms.map.value;
	}
	set map(e) {
		this.uniforms.map.value = e;
	}
	get normalMap() {
		return this.uniforms.normalMap.value;
	}
	set normalMap(e) {
		this.uniforms.normalMap.value = e;
	}
	get normalScale() {
		return this.uniforms.normalScale.value;
	}
	set normalScale(e) {
		this.uniforms.normalScale.value = e;
	}
	get emissive() {
		return this.uniforms.emissive.value;
	}
	set emissive(e) {
		this.uniforms.emissive.value = e;
	}
	get emissiveIntensity() {
		return this.uniforms.emissiveIntensity.value;
	}
	set emissiveIntensity(e) {
		this.uniforms.emissiveIntensity.value = e;
	}
	get emissiveMap() {
		return this.uniforms.emissiveMap.value;
	}
	set emissiveMap(e) {
		this.uniforms.emissiveMap.value = e;
	}
	get shadeColorFactor() {
		return this.uniforms.shadeColorFactor.value;
	}
	set shadeColorFactor(e) {
		this.uniforms.shadeColorFactor.value = e;
	}
	get shadeMultiplyTexture() {
		return this.uniforms.shadeMultiplyTexture.value;
	}
	set shadeMultiplyTexture(e) {
		this.uniforms.shadeMultiplyTexture.value = e;
	}
	get shadingShiftFactor() {
		return this.uniforms.shadingShiftFactor.value;
	}
	set shadingShiftFactor(e) {
		this.uniforms.shadingShiftFactor.value = e;
	}
	get shadingShiftTexture() {
		return this.uniforms.shadingShiftTexture.value;
	}
	set shadingShiftTexture(e) {
		this.uniforms.shadingShiftTexture.value = e;
	}
	get shadingShiftTextureScale() {
		return this.uniforms.shadingShiftTextureScale.value;
	}
	set shadingShiftTextureScale(e) {
		this.uniforms.shadingShiftTextureScale.value = e;
	}
	get shadingToonyFactor() {
		return this.uniforms.shadingToonyFactor.value;
	}
	set shadingToonyFactor(e) {
		this.uniforms.shadingToonyFactor.value = e;
	}
	get giEqualizationFactor() {
		return this.uniforms.giEqualizationFactor.value;
	}
	set giEqualizationFactor(e) {
		this.uniforms.giEqualizationFactor.value = e;
	}
	get matcapFactor() {
		return this.uniforms.matcapFactor.value;
	}
	set matcapFactor(e) {
		this.uniforms.matcapFactor.value = e;
	}
	get matcapTexture() {
		return this.uniforms.matcapTexture.value;
	}
	set matcapTexture(e) {
		this.uniforms.matcapTexture.value = e;
	}
	get parametricRimColorFactor() {
		return this.uniforms.parametricRimColorFactor.value;
	}
	set parametricRimColorFactor(e) {
		this.uniforms.parametricRimColorFactor.value = e;
	}
	get rimMultiplyTexture() {
		return this.uniforms.rimMultiplyTexture.value;
	}
	set rimMultiplyTexture(e) {
		this.uniforms.rimMultiplyTexture.value = e;
	}
	get rimLightingMixFactor() {
		return this.uniforms.rimLightingMixFactor.value;
	}
	set rimLightingMixFactor(e) {
		this.uniforms.rimLightingMixFactor.value = e;
	}
	get parametricRimFresnelPowerFactor() {
		return this.uniforms.parametricRimFresnelPowerFactor.value;
	}
	set parametricRimFresnelPowerFactor(e) {
		this.uniforms.parametricRimFresnelPowerFactor.value = e;
	}
	get parametricRimLiftFactor() {
		return this.uniforms.parametricRimLiftFactor.value;
	}
	set parametricRimLiftFactor(e) {
		this.uniforms.parametricRimLiftFactor.value = e;
	}
	get outlineWidthMultiplyTexture() {
		return this.uniforms.outlineWidthMultiplyTexture.value;
	}
	set outlineWidthMultiplyTexture(e) {
		this.uniforms.outlineWidthMultiplyTexture.value = e;
	}
	get outlineWidthFactor() {
		return this.uniforms.outlineWidthFactor.value;
	}
	set outlineWidthFactor(e) {
		this.uniforms.outlineWidthFactor.value = e;
	}
	get outlineColorFactor() {
		return this.uniforms.outlineColorFactor.value;
	}
	set outlineColorFactor(e) {
		this.uniforms.outlineColorFactor.value = e;
	}
	get outlineLightingMixFactor() {
		return this.uniforms.outlineLightingMixFactor.value;
	}
	set outlineLightingMixFactor(e) {
		this.uniforms.outlineLightingMixFactor.value = e;
	}
	get uvAnimationMaskTexture() {
		return this.uniforms.uvAnimationMaskTexture.value;
	}
	set uvAnimationMaskTexture(e) {
		this.uniforms.uvAnimationMaskTexture.value = e;
	}
	get uvAnimationScrollXOffset() {
		return this.uniforms.uvAnimationScrollXOffset.value;
	}
	set uvAnimationScrollXOffset(e) {
		this.uniforms.uvAnimationScrollXOffset.value = e;
	}
	get uvAnimationScrollYOffset() {
		return this.uniforms.uvAnimationScrollYOffset.value;
	}
	set uvAnimationScrollYOffset(e) {
		this.uniforms.uvAnimationScrollYOffset.value = e;
	}
	get uvAnimationRotationPhase() {
		return this.uniforms.uvAnimationRotationPhase.value;
	}
	set uvAnimationRotationPhase(e) {
		this.uniforms.uvAnimationRotationPhase.value = e;
	}
	get ignoreVertexColor() {
		return this._ignoreVertexColor;
	}
	set ignoreVertexColor(e) {
		this._ignoreVertexColor = e, this.needsUpdate = !0;
	}
	get v0CompatShade() {
		return this._v0CompatShade;
	}
	set v0CompatShade(e) {
		this._v0CompatShade = e, this.needsUpdate = !0;
	}
	get debugMode() {
		return this._debugMode;
	}
	set debugMode(e) {
		this._debugMode = e, this.needsUpdate = !0;
	}
	get outlineWidthMode() {
		return this._outlineWidthMode;
	}
	set outlineWidthMode(e) {
		this._outlineWidthMode = e, this.needsUpdate = !0;
	}
	get isOutline() {
		return this._isOutline;
	}
	set isOutline(e) {
		this._isOutline = e, this.needsUpdate = !0;
	}
	get isMToonMaterial() {
		return !0;
	}
	update(e) {
		this._uploadUniformsWorkaround(), this._updateUVAnimation(e);
	}
	copy(e) {
		return super.copy(e), this.map = e.map, this.normalMap = e.normalMap, this.emissiveMap = e.emissiveMap, this.shadeMultiplyTexture = e.shadeMultiplyTexture, this.shadingShiftTexture = e.shadingShiftTexture, this.matcapTexture = e.matcapTexture, this.rimMultiplyTexture = e.rimMultiplyTexture, this.outlineWidthMultiplyTexture = e.outlineWidthMultiplyTexture, this.uvAnimationMaskTexture = e.uvAnimationMaskTexture, this.normalMapType = e.normalMapType, this.uvAnimationScrollXSpeedFactor = e.uvAnimationScrollXSpeedFactor, this.uvAnimationScrollYSpeedFactor = e.uvAnimationScrollYSpeedFactor, this.uvAnimationRotationSpeedFactor = e.uvAnimationRotationSpeedFactor, this.ignoreVertexColor = e.ignoreVertexColor, this.v0CompatShade = e.v0CompatShade, this.debugMode = e.debugMode, this.outlineWidthMode = e.outlineWidthMode, this.isOutline = e.isOutline, this.needsUpdate = !0, this;
	}
	_updateUVAnimation(e) {
		this.uniforms.uvAnimationScrollXOffset.value += e * this.uvAnimationScrollXSpeedFactor, this.uniforms.uvAnimationScrollYOffset.value += e * this.uvAnimationScrollYSpeedFactor, this.uniforms.uvAnimationRotationPhase.value += e * this.uvAnimationRotationSpeedFactor, this.uniforms.alphaTest.value = this.alphaTest, this.uniformsNeedUpdate = !0;
	}
	_uploadUniformsWorkaround() {
		this.uniforms.opacity.value = this.opacity, this._updateTextureMatrix(this.uniforms.map, this.uniforms.mapUvTransform), this._updateTextureMatrix(this.uniforms.normalMap, this.uniforms.normalMapUvTransform), this._updateTextureMatrix(this.uniforms.emissiveMap, this.uniforms.emissiveMapUvTransform), this._updateTextureMatrix(this.uniforms.shadeMultiplyTexture, this.uniforms.shadeMultiplyTextureUvTransform), this._updateTextureMatrix(this.uniforms.shadingShiftTexture, this.uniforms.shadingShiftTextureUvTransform), this._updateTextureMatrix(this.uniforms.matcapTexture, this.uniforms.matcapTextureUvTransform), this._updateTextureMatrix(this.uniforms.rimMultiplyTexture, this.uniforms.rimMultiplyTextureUvTransform), this._updateTextureMatrix(this.uniforms.outlineWidthMultiplyTexture, this.uniforms.outlineWidthMultiplyTextureUvTransform), this._updateTextureMatrix(this.uniforms.uvAnimationMaskTexture, this.uniforms.uvAnimationMaskTextureUvTransform), this.uniformsNeedUpdate = !0;
	}
	_generateDefines() {
		let e = this.outlineWidthMultiplyTexture !== null, t = this.map !== null || this.normalMap !== null || this.emissiveMap !== null || this.shadeMultiplyTexture !== null || this.shadingShiftTexture !== null || this.rimMultiplyTexture !== null || this.uvAnimationMaskTexture !== null;
		return {
			THREE_VRM_THREE_REVISION: 187,
			OUTLINE: this._isOutline,
			MTOON_USE_UV: e || t,
			MTOON_UVS_VERTEX_ONLY: e && !t,
			V0_COMPAT_SHADE: this._v0CompatShade,
			USE_SHADEMULTIPLYTEXTURE: this.shadeMultiplyTexture !== null,
			USE_SHADINGSHIFTTEXTURE: this.shadingShiftTexture !== null,
			USE_MATCAPTEXTURE: this.matcapTexture !== null,
			USE_RIMMULTIPLYTEXTURE: this.rimMultiplyTexture !== null,
			USE_OUTLINEWIDTHMULTIPLYTEXTURE: this._isOutline && this.outlineWidthMultiplyTexture !== null,
			USE_UVANIMATIONMASKTEXTURE: this.uvAnimationMaskTexture !== null,
			IGNORE_VERTEX_COLOR: this._ignoreVertexColor === !0,
			DEBUG_NORMAL: this._debugMode === "normal",
			DEBUG_LITSHADERATE: this._debugMode === "litShadeRate",
			DEBUG_UV: this._debugMode === "uv",
			OUTLINE_WIDTH_SCREEN: this._isOutline && this._outlineWidthMode === dn.ScreenCoordinates
		};
	}
	_updateTextureMatrix(e, t) {
		e.value && (e.value.matrixAutoUpdate && e.value.updateMatrix(), t.value.copy(e.value.matrix));
	}
}, mn = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), hn = class e {
	get name() {
		return e.EXTENSION_NAME;
	}
	constructor(e, t = {}) {
		this.parser = e, this.materialType = t.materialType ?? pn, this.renderOrderOffset = t.renderOrderOffset ?? 0, this.v0CompatShade = t.v0CompatShade ?? !1, this.debugMode = t.debugMode ?? "none", this._mToonMaterialSet = /* @__PURE__ */ new Set();
	}
	beforeRoot() {
		return q(this, null, function* () {
			this._removeUnlitExtensionIfMToonExists();
		});
	}
	afterRoot(e) {
		return q(this, null, function* () {
			e.userData.vrmMToonMaterials = Array.from(this._mToonMaterialSet);
		});
	}
	getMaterialType(e) {
		return this._getMToonExtension(e) ? this.materialType : null;
	}
	extendMaterialParams(e, t) {
		let n = this._getMToonExtension(e);
		return n ? this._extendMaterialParams(n, t) : null;
	}
	loadMesh(e) {
		return q(this, null, function* () {
			let t = this.parser, n = t.json.meshes?.[e];
			if (n == null) throw Error(`MToonMaterialLoaderPlugin: Attempt to use meshes[${e}] of glTF but the mesh doesn't exist`);
			let r = n.primitives, i = yield t.loadMesh(e);
			if (r.length === 1) {
				let e = i, t = r[0].material;
				t != null && this._setupPrimitive(e, t);
			} else {
				let e = i;
				for (let t = 0; t < r.length; t++) {
					let n = e.children[t], i = r[t].material;
					i != null && this._setupPrimitive(n, i);
				}
			}
			return i;
		});
	}
	_removeUnlitExtensionIfMToonExists() {
		this.parser.json.materials?.map((e, t) => {
			this._getMToonExtension(t) && e.extensions?.KHR_materials_unlit && delete e.extensions.KHR_materials_unlit;
		});
	}
	_getMToonExtension(t) {
		let n = this.parser.json.materials?.[t];
		if (n == null) {
			console.warn(`MToonMaterialLoaderPlugin: Attempt to use materials[${t}] of glTF but the material doesn't exist`);
			return;
		}
		let r = n.extensions?.[e.EXTENSION_NAME];
		if (r == null) return;
		let i = r.specVersion;
		if (!mn.has(i)) console.warn(`MToonMaterialLoaderPlugin: Unknown ${e.EXTENSION_NAME} specVersion "${i}"`);
		else return r;
	}
	_extendMaterialParams(e, t) {
		return q(this, null, function* () {
			delete t.metalness, delete t.roughness;
			let n = new sn(this.parser, t);
			n.assignPrimitive("transparentWithZWrite", e.transparentWithZWrite), n.assignColor("shadeColorFactor", e.shadeColorFactor), n.assignTexture("shadeMultiplyTexture", e.shadeMultiplyTexture, !0), n.assignPrimitive("shadingShiftFactor", e.shadingShiftFactor), n.assignTexture("shadingShiftTexture", e.shadingShiftTexture, !0), n.assignPrimitive("shadingShiftTextureScale", e.shadingShiftTexture?.scale), n.assignPrimitive("shadingToonyFactor", e.shadingToonyFactor), n.assignPrimitive("giEqualizationFactor", e.giEqualizationFactor), n.assignColor("matcapFactor", e.matcapFactor), n.assignTexture("matcapTexture", e.matcapTexture, !0), n.assignColor("parametricRimColorFactor", e.parametricRimColorFactor), n.assignTexture("rimMultiplyTexture", e.rimMultiplyTexture, !0), n.assignPrimitive("rimLightingMixFactor", e.rimLightingMixFactor), n.assignPrimitive("parametricRimFresnelPowerFactor", e.parametricRimFresnelPowerFactor), n.assignPrimitive("parametricRimLiftFactor", e.parametricRimLiftFactor), n.assignPrimitive("outlineWidthMode", e.outlineWidthMode), n.assignPrimitive("outlineWidthFactor", e.outlineWidthFactor), n.assignTexture("outlineWidthMultiplyTexture", e.outlineWidthMultiplyTexture, !1), n.assignColor("outlineColorFactor", e.outlineColorFactor), n.assignPrimitive("outlineLightingMixFactor", e.outlineLightingMixFactor), n.assignTexture("uvAnimationMaskTexture", e.uvAnimationMaskTexture, !1), n.assignPrimitive("uvAnimationScrollXSpeedFactor", e.uvAnimationScrollXSpeedFactor), n.assignPrimitive("uvAnimationScrollYSpeedFactor", e.uvAnimationScrollYSpeedFactor), n.assignPrimitive("uvAnimationRotationSpeedFactor", e.uvAnimationRotationSpeedFactor), n.assignPrimitive("v0CompatShade", this.v0CompatShade), n.assignPrimitive("debugMode", this.debugMode), yield n.pending;
		});
	}
	_setupPrimitive(e, t) {
		let n = this._getMToonExtension(t);
		n && (e.renderOrder = this._parseRenderOrder(n) + this.renderOrderOffset, this._generateOutline(e), this._addToMaterialSet(e));
	}
	_shouldGenerateOutline(e) {
		return typeof e.outlineWidthMode == "string" && e.outlineWidthMode !== "none" && typeof e.outlineWidthFactor == "number" && e.outlineWidthFactor > 0;
	}
	_generateOutline(e) {
		let t = e.material;
		if (!(t instanceof i) || !this._shouldGenerateOutline(t)) return;
		e.material = [t];
		let n = t.clone();
		n.name += " (Outline)", n.isOutline = !0, n.side = 1, e.material.push(n);
		let r = e.geometry, a = r.index ? r.index.count : r.attributes.position.count / 3;
		r.addGroup(0, a, 0), r.addGroup(0, a, 1);
	}
	_addToMaterialSet(e) {
		let t = e.material, n = /* @__PURE__ */ new Set();
		Array.isArray(t) ? t.forEach((e) => n.add(e)) : n.add(t);
		for (let e of n) this._mToonMaterialSet.add(e);
	}
	_parseRenderOrder(e) {
		return (e.transparentWithZWrite ? 0 : 19) + (e.renderQueueOffsetNumber ?? 0);
	}
};
hn.EXTENSION_NAME = "VRMC_materials_mtoon";
var gn = hn, _n = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
}), vn = class e {
	get name() {
		return e.EXTENSION_NAME;
	}
	constructor(e) {
		this.parser = e;
	}
	extendMaterialParams(e, t) {
		return _n(this, null, function* () {
			let n = this._getHDREmissiveMultiplierExtension(e);
			n != null && (console.warn("VRMMaterialsHDREmissiveMultiplierLoaderPlugin: `VRMC_materials_hdr_emissiveMultiplier` is archived. Use `KHR_materials_emissive_strength` instead."), t.emissiveIntensity = n.emissiveMultiplier);
		});
	}
	_getHDREmissiveMultiplierExtension(t) {
		let n = this.parser.json.materials?.[t];
		if (n == null) {
			console.warn(`VRMMaterialsHDREmissiveMultiplierLoaderPlugin: Attempt to use materials[${t}] of glTF but the material doesn't exist`);
			return;
		}
		let r = n.extensions?.[e.EXTENSION_NAME];
		if (r != null) return r;
	}
};
vn.EXTENSION_NAME = "VRMC_materials_hdr_emissiveMultiplier";
var yn = vn, bn = Object.defineProperty, xn = Object.defineProperties, Sn = Object.getOwnPropertyDescriptors, Cn = Object.getOwnPropertySymbols, wn = Object.prototype.hasOwnProperty, Tn = Object.prototype.propertyIsEnumerable, En = (e, t, n) => t in e ? bn(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, J = (e, t) => {
	for (var n in t ||= {}) wn.call(t, n) && En(e, n, t[n]);
	if (Cn) for (var n of Cn(t)) Tn.call(t, n) && En(e, n, t[n]);
	return e;
}, Dn = (e, t) => xn(e, Sn(t)), On = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
});
function kn(e) {
	return e ** 2.2;
}
var An = class {
	get name() {
		return "VRMMaterialsV0CompatPlugin";
	}
	constructor(e) {
		this.parser = e, this._renderQueueMapTransparent = /* @__PURE__ */ new Map(), this._renderQueueMapTransparentZWrite = /* @__PURE__ */ new Map();
		let t = this.parser.json;
		t.extensionsUsed = t.extensionsUsed ?? [], t.extensionsUsed.indexOf("KHR_texture_transform") === -1 && t.extensionsUsed.push("KHR_texture_transform");
	}
	beforeRoot() {
		return On(this, null, function* () {
			let e = this.parser.json, t = e.extensions?.VRM?.materialProperties;
			t && (this._populateRenderQueueMap(t), t.forEach((t, n) => {
				let r = e.materials?.[n];
				if (r == null) console.warn(`VRMMaterialsV0CompatPlugin: Attempt to use materials[${n}] of glTF but the material doesn't exist`);
				else if (t.shader === "VRM/MToon") {
					let i = this._parseV0MToonProperties(t, r);
					e.materials[n] = i;
				} else if (t.shader?.startsWith("VRM/Unlit")) {
					let i = this._parseV0UnlitProperties(t, r);
					e.materials[n] = i;
				} else t.shader === "VRM_USE_GLTFSHADER" || console.warn(`VRMMaterialsV0CompatPlugin: Unknown shader: ${t.shader}`);
			}));
		});
	}
	_parseV0MToonProperties(e, t) {
		let n = e.keywordMap?._ALPHABLEND_ON ?? !1, r = e.floatProperties?._ZWrite === 1 && n, i = this._v0ParseRenderQueue(e), a = e.keywordMap?._ALPHATEST_ON ?? !1, o = n ? "BLEND" : a ? "MASK" : "OPAQUE", s = a ? e.floatProperties?._Cutoff ?? .5 : void 0, l = (e.floatProperties?._CullMode ?? 2) === 0, u = this._portTextureTransform(e), d = (e.vectorProperties?._Color ?? [
			1,
			1,
			1,
			1
		]).map((e, t) => t === 3 ? e : kn(e)), f = e.textureProperties?._MainTex, p = f == null ? void 0 : {
			index: f,
			extensions: J({}, u)
		}, m = e.floatProperties?._BumpScale ?? 1, h = e.textureProperties?._BumpMap, g = h == null ? void 0 : {
			index: h,
			scale: m,
			extensions: J({}, u)
		}, _ = (e.vectorProperties?._EmissionColor ?? [
			0,
			0,
			0,
			1
		]).map(kn), v = e.textureProperties?._EmissionMap, y = v == null ? void 0 : {
			index: v,
			extensions: J({}, u)
		}, b = (e.vectorProperties?._ShadeColor ?? [
			.97,
			.81,
			.86,
			1
		]).map(kn), x = e.textureProperties?._ShadeTexture, S = x == null ? void 0 : {
			index: x,
			extensions: J({}, u)
		}, C = e.floatProperties?._ShadeShift ?? 0, w = e.floatProperties?._ShadeToony ?? .9;
		w = c.lerp(w, 1, .5 + .5 * C), C = -C - (1 - w);
		let T = e.floatProperties?._IndirectLightIntensity ?? .1, E = T ? 1 - T : void 0, D = e.textureProperties?._SphereAdd, O = D == null ? void 0 : [
			1,
			1,
			1
		], k = D == null ? void 0 : { index: D }, A = e.floatProperties?._RimLightingMix ?? 0, j = e.textureProperties?._RimTexture, M = j == null ? void 0 : {
			index: j,
			extensions: J({}, u)
		}, ee = (e.vectorProperties?._RimColor ?? [
			0,
			0,
			0,
			1
		]).map(kn), te = e.floatProperties?._RimFresnelPower ?? 1, ne = e.floatProperties?._RimLift ?? 0, re = [
			"none",
			"worldCoordinates",
			"screenCoordinates"
		][e.floatProperties?._OutlineWidthMode ?? 0], N = e.floatProperties?._OutlineWidth ?? 0;
		N = .01 * N;
		let ie = e.textureProperties?._OutlineWidthTexture, ae = ie == null ? void 0 : {
			index: ie,
			extensions: J({}, u)
		}, oe = (e.vectorProperties?._OutlineColor ?? [
			0,
			0,
			0
		]).map(kn), se = (e.floatProperties?._OutlineColorMode ?? 0) === 1 ? e.floatProperties?._OutlineLightingMix ?? 1 : 0, P = e.textureProperties?._UvAnimMaskTexture, ce = P == null ? void 0 : {
			index: P,
			extensions: J({}, u)
		}, le = e.floatProperties?._UvAnimScrollX ?? 0, F = e.floatProperties?._UvAnimScrollY ?? 0;
		F != null && (F = -F);
		let I = e.floatProperties?._UvAnimRotation ?? 0, L = {
			specVersion: "1.0",
			transparentWithZWrite: r,
			renderQueueOffsetNumber: i,
			shadeColorFactor: b,
			shadeMultiplyTexture: S,
			shadingShiftFactor: C,
			shadingToonyFactor: w,
			giEqualizationFactor: E,
			matcapFactor: O,
			matcapTexture: k,
			rimLightingMixFactor: A,
			rimMultiplyTexture: M,
			parametricRimColorFactor: ee,
			parametricRimFresnelPowerFactor: te,
			parametricRimLiftFactor: ne,
			outlineWidthMode: re,
			outlineWidthFactor: N,
			outlineWidthMultiplyTexture: ae,
			outlineColorFactor: oe,
			outlineLightingMixFactor: se,
			uvAnimationMaskTexture: ce,
			uvAnimationScrollXSpeedFactor: le,
			uvAnimationScrollYSpeedFactor: F,
			uvAnimationRotationSpeedFactor: I
		};
		return Dn(J({}, t), {
			pbrMetallicRoughness: {
				baseColorFactor: d,
				baseColorTexture: p
			},
			normalTexture: g,
			emissiveTexture: y,
			emissiveFactor: _,
			alphaMode: o,
			alphaCutoff: s,
			doubleSided: l,
			extensions: { VRMC_materials_mtoon: L }
		});
	}
	_parseV0UnlitProperties(e, t) {
		let n = e.shader === "VRM/UnlitTransparentZWrite", r = e.shader === "VRM/UnlitTransparent" || n, i = this._v0ParseRenderQueue(e), a = e.shader === "VRM/UnlitCutout", o = r ? "BLEND" : a ? "MASK" : "OPAQUE", s = a ? e.floatProperties?._Cutoff ?? .5 : void 0, c = this._portTextureTransform(e), l = (e.vectorProperties?._Color ?? [
			1,
			1,
			1,
			1
		]).map(kn), u = e.textureProperties?._MainTex, d = u == null ? void 0 : {
			index: u,
			extensions: J({}, c)
		}, f = {
			specVersion: "1.0",
			transparentWithZWrite: n,
			renderQueueOffsetNumber: i,
			shadeColorFactor: l,
			shadeMultiplyTexture: d
		};
		return Dn(J({}, t), {
			pbrMetallicRoughness: {
				baseColorFactor: l,
				baseColorTexture: d
			},
			alphaMode: o,
			alphaCutoff: s,
			extensions: { VRMC_materials_mtoon: f }
		});
	}
	_portTextureTransform(e) {
		let t = e.vectorProperties?._MainTex;
		if (t == null) return {};
		let n = [t?.[0] ?? 0, t?.[1] ?? 0], r = [t?.[2] ?? 1, t?.[3] ?? 1];
		return n[1] = 1 - r[1] - n[1], { KHR_texture_transform: {
			offset: n,
			scale: r
		} };
	}
	_v0ParseRenderQueue(e) {
		let t = e.shader === "VRM/UnlitTransparentZWrite", n = e.keywordMap?._ALPHABLEND_ON != null || e.shader === "VRM/UnlitTransparent" || t, r = e.floatProperties?._ZWrite === 1 || t, i = 0;
		if (n) {
			let t = e.renderQueue;
			t != null && (i = r ? this._renderQueueMapTransparentZWrite.get(t) : this._renderQueueMapTransparent.get(t));
		}
		return i;
	}
	_populateRenderQueueMap(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		e.forEach((e) => {
			let r = e.shader === "VRM/UnlitTransparentZWrite", i = e.keywordMap?._ALPHABLEND_ON != null || e.shader === "VRM/UnlitTransparent" || r, a = e.floatProperties?._ZWrite === 1 || r;
			if (i) {
				let r = e.renderQueue;
				r != null && (a ? n.add(r) : t.add(r));
			}
		}), t.size > 10 && console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${t.size} render queues for Transparent materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`), n.size > 10 && console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${n.size} render queues for TransparentZWrite materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`), Array.from(t).sort().forEach((e, n) => {
			let r = Math.min(Math.max(n - t.size + 1, -9), 0);
			this._renderQueueMapTransparent.set(e, r);
		}), Array.from(n).sort().forEach((e, t) => {
			let n = Math.min(Math.max(t, 0), 9);
			this._renderQueueMapTransparentZWrite.set(e, n);
		});
	}
}, jn = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
}), Y = new S(), Mn = class extends l {
	constructor(e) {
		super(), this._attrPosition = new N(new Float32Array([
			0,
			0,
			0,
			0,
			0,
			0
		]), 3), this._attrPosition.setUsage(ie);
		let t = new b();
		t.setAttribute("position", this._attrPosition);
		let n = new a({
			color: 16711935,
			depthTest: !1,
			depthWrite: !1
		});
		this._line = new T(t, n), this.add(this._line), this.constraint = e;
	}
	updateMatrixWorld(e) {
		Y.setFromMatrixPosition(this.constraint.destination.matrixWorld), this._attrPosition.setXYZ(0, Y.x, Y.y, Y.z), this.constraint.source && Y.setFromMatrixPosition(this.constraint.source.matrixWorld), this._attrPosition.setXYZ(1, Y.x, Y.y, Y.z), this._attrPosition.needsUpdate = !0, super.updateMatrixWorld(e);
	}
};
function Nn(e, t) {
	return t.set(e.elements[12], e.elements[13], e.elements[14]);
}
var Pn = new S(), Fn = new S();
function In(e, t) {
	return e.decompose(Pn, t, Fn), t;
}
function Ln(e) {
	return e.invert ? e.invert() : e.inverse(), e;
}
var Rn = class {
	constructor(e, t) {
		this.destination = e, this.source = t, this.weight = 1;
	}
}, zn = new S(), Bn = new S(), Vn = new S(), Hn = new m(), Un = new m(), Wn = new m(), Gn = class extends Rn {
	get aimAxis() {
		return this._aimAxis;
	}
	set aimAxis(e) {
		this._aimAxis = e, this._v3AimAxis.set(e === "PositiveX" ? 1 : e === "NegativeX" ? -1 : 0, e === "PositiveY" ? 1 : e === "NegativeY" ? -1 : 0, e === "PositiveZ" ? 1 : e === "NegativeZ" ? -1 : 0);
	}
	get dependencies() {
		let e = /* @__PURE__ */ new Set([this.source]);
		return this.destination.parent && e.add(this.destination.parent), e;
	}
	constructor(e, t) {
		super(e, t), this._aimAxis = "PositiveX", this._v3AimAxis = new S(1, 0, 0), this._dstRestQuat = new m();
	}
	setInitState() {
		this._dstRestQuat.copy(this.destination.quaternion);
	}
	update() {
		this.destination.updateWorldMatrix(!0, !1), this.source.updateWorldMatrix(!0, !1);
		let e = Hn.identity(), t = Un.identity();
		this.destination.parent && (In(this.destination.parent.matrixWorld, e), Ln(t.copy(e)));
		let n = zn.copy(this._v3AimAxis).applyQuaternion(this._dstRestQuat).applyQuaternion(e), r = Nn(this.source.matrixWorld, Bn).sub(Nn(this.destination.matrixWorld, Vn)).normalize(), i = Wn.setFromUnitVectors(n, r).premultiply(t).multiply(e).multiply(this._dstRestQuat);
		this.destination.quaternion.copy(this._dstRestQuat).slerp(i, this.weight);
	}
};
function Kn(e, t) {
	let n = [e], r = e.parent;
	for (; r !== null;) n.unshift(r), r = r.parent;
	n.forEach((e) => {
		t(e);
	});
}
var qn = class {
	constructor() {
		this._constraints = /* @__PURE__ */ new Set(), this._objectConstraintsMap = /* @__PURE__ */ new Map();
	}
	get constraints() {
		return this._constraints;
	}
	addConstraint(e) {
		this._constraints.add(e);
		let t = this._objectConstraintsMap.get(e.destination);
		t ?? (t = /* @__PURE__ */ new Set(), this._objectConstraintsMap.set(e.destination, t)), t.add(e);
	}
	deleteConstraint(e) {
		this._constraints.delete(e), this._objectConstraintsMap.get(e.destination).delete(e);
	}
	setInitState() {
		let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
		for (let n of this._constraints) this._processConstraint(n, e, t, (e) => e.setInitState());
	}
	update() {
		let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
		for (let n of this._constraints) this._processConstraint(n, e, t, (e) => e.update());
	}
	_processConstraint(e, t, n, r) {
		if (n.has(e)) return;
		if (t.has(e)) throw Error("VRMNodeConstraintManager: Circular dependency detected while updating constraints");
		t.add(e);
		let i = e.dependencies;
		for (let e of i) Kn(e, (e) => {
			let i = this._objectConstraintsMap.get(e);
			if (i) for (let e of i) this._processConstraint(e, t, n, r);
		});
		r(e), n.add(e);
	}
}, Jn = new m(), Yn = new m(), Xn = class extends Rn {
	get dependencies() {
		return /* @__PURE__ */ new Set([this.source]);
	}
	constructor(e, t) {
		super(e, t), this._dstRestQuat = new m(), this._invSrcRestQuat = new m();
	}
	setInitState() {
		this._dstRestQuat.copy(this.destination.quaternion), Ln(this._invSrcRestQuat.copy(this.source.quaternion));
	}
	update() {
		let e = Jn.copy(this._invSrcRestQuat).multiply(this.source.quaternion), t = Yn.copy(this._dstRestQuat).multiply(e);
		this.destination.quaternion.copy(this._dstRestQuat).slerp(t, this.weight);
	}
}, Zn = new S(), Qn = new m(), $n = new m(), er = class extends Rn {
	get rollAxis() {
		return this._rollAxis;
	}
	set rollAxis(e) {
		this._rollAxis = e, this._v3RollAxis.set(+(e === "X"), +(e === "Y"), +(e === "Z"));
	}
	get dependencies() {
		return /* @__PURE__ */ new Set([this.source]);
	}
	constructor(e, t) {
		super(e, t), this._rollAxis = "X", this._v3RollAxis = new S(1, 0, 0), this._dstRestQuat = new m(), this._invDstRestQuat = new m(), this._invSrcRestQuatMulDstRestQuat = new m();
	}
	setInitState() {
		this._dstRestQuat.copy(this.destination.quaternion), Ln(this._invDstRestQuat.copy(this._dstRestQuat)), Ln(this._invSrcRestQuatMulDstRestQuat.copy(this.source.quaternion)).multiply(this._dstRestQuat);
	}
	update() {
		let e = Qn.copy(this._invDstRestQuat).multiply(this.source.quaternion).multiply(this._invSrcRestQuatMulDstRestQuat), t = Zn.copy(this._v3RollAxis).applyQuaternion(e), n = $n.setFromUnitVectors(t, this._v3RollAxis).premultiply(this._dstRestQuat).multiply(e);
		this.destination.quaternion.copy(this._dstRestQuat).slerp(n, this.weight);
	}
}, tr = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), nr = class e {
	get name() {
		return e.EXTENSION_NAME;
	}
	constructor(e, t) {
		this.parser = e, this.helperRoot = t?.helperRoot;
	}
	afterRoot(e) {
		return jn(this, null, function* () {
			e.userData.vrmNodeConstraintManager = yield this._import(e);
		});
	}
	_import(t) {
		return jn(this, null, function* () {
			let n = this.parser.json;
			if (n.extensionsUsed?.indexOf(e.EXTENSION_NAME) === -1) return null;
			let r = new qn(), i = yield this.parser.getDependencies("node");
			return i.forEach((t, a) => {
				let o = n.nodes[a]?.extensions?.[e.EXTENSION_NAME];
				if (o == null) return;
				let s = o.specVersion;
				if (!tr.has(s)) {
					console.warn(`VRMNodeConstraintLoaderPlugin: Unknown ${e.EXTENSION_NAME} specVersion "${s}"`);
					return;
				}
				let c = o.constraint;
				if (c.roll != null) {
					let e = this._importRollConstraint(t, i, c.roll);
					r.addConstraint(e);
				} else if (c.aim != null) {
					let e = this._importAimConstraint(t, i, c.aim);
					r.addConstraint(e);
				} else if (c.rotation != null) {
					let e = this._importRotationConstraint(t, i, c.rotation);
					r.addConstraint(e);
				}
			}), t.scene.updateMatrixWorld(), r.setInitState(), r;
		});
	}
	_importRollConstraint(e, t, n) {
		let { source: r, rollAxis: i, weight: a } = n, o = t[r], s = new er(e, o);
		if (i != null && (s.rollAxis = i), a != null && (s.weight = a), this.helperRoot) {
			let e = new Mn(s);
			this.helperRoot.add(e);
		}
		return s;
	}
	_importAimConstraint(e, t, n) {
		let { source: r, aimAxis: i, weight: a } = n, o = t[r], s = new Gn(e, o);
		if (i != null && (s.aimAxis = i), a != null && (s.weight = a), this.helperRoot) {
			let e = new Mn(s);
			this.helperRoot.add(e);
		}
		return s;
	}
	_importRotationConstraint(e, t, n) {
		let { source: r, weight: i } = n, a = t[r], o = new Xn(e, a);
		if (i != null && (o.weight = i), this.helperRoot) {
			let e = new Mn(o);
			this.helperRoot.add(e);
		}
		return o;
	}
};
nr.EXTENSION_NAME = "VRMC_node_constraint";
var rr = nr, ir = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
}), ar = class {}, or = new S(), sr = new S(), cr = class extends ar {
	get type() {
		return "capsule";
	}
	constructor(e) {
		super(), this.offset = e?.offset ?? new S(0, 0, 0), this.tail = e?.tail ?? new S(0, 0, 0), this.radius = e?.radius ?? 0, this.inside = e?.inside ?? !1;
	}
	calculateCollision(e, t, n, r) {
		or.setFromMatrixPosition(e), sr.subVectors(this.tail, this.offset).applyMatrix4(e), sr.sub(or);
		let i = sr.lengthSq();
		r.copy(t).sub(or);
		let a = sr.dot(r);
		a <= 0 || (i <= a || sr.multiplyScalar(a / i), r.sub(sr));
		let o = r.length(), s = this.inside ? this.radius - n - o : o - n - this.radius;
		return s < 0 && (r.multiplyScalar(1 / o), this.inside && r.negate()), s;
	}
}, lr = new S(), ur = new P(), dr = class extends ar {
	get type() {
		return "plane";
	}
	constructor(e) {
		super(), this.offset = e?.offset ?? new S(0, 0, 0), this.normal = e?.normal ?? new S(0, 0, 1);
	}
	calculateCollision(e, t, n, r) {
		r.setFromMatrixPosition(e), r.negate().add(t), ur.getNormalMatrix(e), lr.copy(this.normal).applyNormalMatrix(ur).normalize();
		let i = r.dot(lr) - n;
		return r.copy(lr), i;
	}
}, fr = new S(), pr = class extends ar {
	get type() {
		return "sphere";
	}
	constructor(e) {
		super(), this.offset = e?.offset ?? new S(0, 0, 0), this.radius = e?.radius ?? 0, this.inside = e?.inside ?? !1;
	}
	calculateCollision(e, t, n, r) {
		r.subVectors(t, fr.setFromMatrixPosition(e));
		let i = r.length(), a = this.inside ? this.radius - n - i : i - n - this.radius;
		return a < 0 && (r.multiplyScalar(1 / i), this.inside && r.negate()), a;
	}
}, X = new S(), mr = class extends b {
	constructor(e) {
		super(), this.worldScale = 1, this._currentRadius = 0, this._currentOffset = new S(), this._currentTail = new S(), this._shape = e, this._attrPos = new N(/* @__PURE__ */ new Float32Array(396), 3), this.setAttribute("position", this._attrPos), this._attrIndex = new N(/* @__PURE__ */ new Uint16Array(264), 1), this.setIndex(this._attrIndex), this._buildIndex(), this.update();
	}
	update() {
		let e = !1, t = this._shape.radius / this.worldScale;
		this._currentRadius !== t && (this._currentRadius = t, e = !0), this._currentOffset.equals(this._shape.offset) || (this._currentOffset.copy(this._shape.offset), e = !0);
		let n = X.copy(this._shape.tail).divideScalar(this.worldScale);
		this._currentTail.distanceToSquared(n) > 1e-10 && (this._currentTail.copy(n), e = !0), e && this._buildPosition();
	}
	_buildPosition() {
		X.copy(this._currentTail).sub(this._currentOffset);
		let e = X.length() / this._currentRadius;
		for (let t = 0; t <= 16; t++) {
			let n = t / 16 * Math.PI;
			this._attrPos.setXYZ(t, -Math.sin(n), -Math.cos(n), 0), this._attrPos.setXYZ(17 + t, e + Math.sin(n), Math.cos(n), 0), this._attrPos.setXYZ(34 + t, -Math.sin(n), 0, -Math.cos(n)), this._attrPos.setXYZ(51 + t, e + Math.sin(n), 0, Math.cos(n));
		}
		for (let t = 0; t < 32; t++) {
			let n = t / 16 * Math.PI;
			this._attrPos.setXYZ(68 + t, 0, Math.sin(n), Math.cos(n)), this._attrPos.setXYZ(100 + t, e, Math.sin(n), Math.cos(n));
		}
		let t = Math.atan2(X.y, Math.sqrt(X.x * X.x + X.z * X.z)), n = -Math.atan2(X.z, X.x);
		this.rotateZ(t), this.rotateY(n), this.scale(this._currentRadius, this._currentRadius, this._currentRadius), this.translate(this._currentOffset.x, this._currentOffset.y, this._currentOffset.z), this._attrPos.needsUpdate = !0;
	}
	_buildIndex() {
		for (let e = 0; e < 34; e++) {
			let t = (e + 1) % 34;
			this._attrIndex.setXY(e * 2, e, t), this._attrIndex.setXY(68 + e * 2, 34 + e, 34 + t);
		}
		for (let e = 0; e < 32; e++) {
			let t = (e + 1) % 32;
			this._attrIndex.setXY(136 + e * 2, 68 + e, 68 + t), this._attrIndex.setXY(200 + e * 2, 100 + e, 100 + t);
		}
		this._attrIndex.needsUpdate = !0;
	}
}, hr = class extends b {
	constructor(e) {
		super(), this.worldScale = 1, this._currentOffset = new S(), this._currentNormal = new S(), this._shape = e, this._attrPos = new N(/* @__PURE__ */ new Float32Array(18), 3), this.setAttribute("position", this._attrPos), this._attrIndex = new N(/* @__PURE__ */ new Uint16Array(10), 1), this.setIndex(this._attrIndex), this._buildIndex(), this.update();
	}
	update() {
		let e = !1;
		this._currentOffset.equals(this._shape.offset) || (this._currentOffset.copy(this._shape.offset), e = !0), this._currentNormal.equals(this._shape.normal) || (this._currentNormal.copy(this._shape.normal), e = !0), e && this._buildPosition();
	}
	_buildPosition() {
		this._attrPos.setXYZ(0, -.5, -.5, 0), this._attrPos.setXYZ(1, .5, -.5, 0), this._attrPos.setXYZ(2, .5, .5, 0), this._attrPos.setXYZ(3, -.5, .5, 0), this._attrPos.setXYZ(4, 0, 0, 0), this._attrPos.setXYZ(5, 0, 0, .25), this.translate(this._currentOffset.x, this._currentOffset.y, this._currentOffset.z), this.lookAt(this._currentNormal), this._attrPos.needsUpdate = !0;
	}
	_buildIndex() {
		this._attrIndex.setXY(0, 0, 1), this._attrIndex.setXY(2, 1, 2), this._attrIndex.setXY(4, 2, 3), this._attrIndex.setXY(6, 3, 0), this._attrIndex.setXY(8, 4, 5), this._attrIndex.needsUpdate = !0;
	}
}, gr = class extends b {
	constructor(e) {
		super(), this.worldScale = 1, this._currentRadius = 0, this._currentOffset = new S(), this._shape = e, this._attrPos = new N(/* @__PURE__ */ new Float32Array(288), 3), this.setAttribute("position", this._attrPos), this._attrIndex = new N(/* @__PURE__ */ new Uint16Array(192), 1), this.setIndex(this._attrIndex), this._buildIndex(), this.update();
	}
	update() {
		let e = !1, t = this._shape.radius / this.worldScale;
		this._currentRadius !== t && (this._currentRadius = t, e = !0), this._currentOffset.equals(this._shape.offset) || (this._currentOffset.copy(this._shape.offset), e = !0), e && this._buildPosition();
	}
	_buildPosition() {
		for (let e = 0; e < 32; e++) {
			let t = e / 16 * Math.PI;
			this._attrPos.setXYZ(e, Math.cos(t), Math.sin(t), 0), this._attrPos.setXYZ(32 + e, 0, Math.cos(t), Math.sin(t)), this._attrPos.setXYZ(64 + e, Math.sin(t), 0, Math.cos(t));
		}
		this.scale(this._currentRadius, this._currentRadius, this._currentRadius), this.translate(this._currentOffset.x, this._currentOffset.y, this._currentOffset.z), this._attrPos.needsUpdate = !0;
	}
	_buildIndex() {
		for (let e = 0; e < 32; e++) {
			let t = (e + 1) % 32;
			this._attrIndex.setXY(e * 2, e, t), this._attrIndex.setXY(64 + e * 2, 32 + e, 32 + t), this._attrIndex.setXY(128 + e * 2, 64 + e, 64 + t);
		}
		this._attrIndex.needsUpdate = !0;
	}
}, _r = new S(), vr = class extends l {
	constructor(e) {
		if (super(), this.matrixAutoUpdate = !1, this.collider = e, this.collider.shape instanceof pr) this._geometry = new gr(this.collider.shape);
		else if (this.collider.shape instanceof cr) this._geometry = new mr(this.collider.shape);
		else if (this.collider.shape instanceof dr) this._geometry = new hr(this.collider.shape);
		else throw Error("VRMSpringBoneColliderHelper: Unknown collider shape type detected");
		let t = new a({
			color: 16711935,
			depthTest: !1,
			depthWrite: !1
		});
		this._line = new o(this._geometry, t), this.add(this._line);
	}
	dispose() {
		this._geometry.dispose();
	}
	updateMatrixWorld(e) {
		this.collider.updateWorldMatrix(!0, !1), this.matrix.copy(this.collider.matrixWorld);
		let t = this.matrix.elements;
		this._geometry.worldScale = _r.set(t[0], t[1], t[2]).length(), this._geometry.update(), super.updateMatrixWorld(e);
	}
}, yr = class extends b {
	constructor(e) {
		super(), this.worldScale = 1, this._currentRadius = 0, this._currentTail = new S(), this._springBone = e, this._attrPos = new N(/* @__PURE__ */ new Float32Array(294), 3), this.setAttribute("position", this._attrPos), this._attrIndex = new N(/* @__PURE__ */ new Uint16Array(194), 1), this.setIndex(this._attrIndex), this._buildIndex(), this.update();
	}
	update() {
		let e = !1, t = this._springBone.settings.hitRadius / this.worldScale;
		this._currentRadius !== t && (this._currentRadius = t, e = !0), this._currentTail.equals(this._springBone.initialLocalChildPosition) || (this._currentTail.copy(this._springBone.initialLocalChildPosition), e = !0), e && this._buildPosition();
	}
	_buildPosition() {
		for (let e = 0; e < 32; e++) {
			let t = e / 16 * Math.PI;
			this._attrPos.setXYZ(e, Math.cos(t), Math.sin(t), 0), this._attrPos.setXYZ(32 + e, 0, Math.cos(t), Math.sin(t)), this._attrPos.setXYZ(64 + e, Math.sin(t), 0, Math.cos(t));
		}
		this.scale(this._currentRadius, this._currentRadius, this._currentRadius), this.translate(this._currentTail.x, this._currentTail.y, this._currentTail.z), this._attrPos.setXYZ(96, 0, 0, 0), this._attrPos.setXYZ(97, this._currentTail.x, this._currentTail.y, this._currentTail.z), this._attrPos.needsUpdate = !0;
	}
	_buildIndex() {
		for (let e = 0; e < 32; e++) {
			let t = (e + 1) % 32;
			this._attrIndex.setXY(e * 2, e, t), this._attrIndex.setXY(64 + e * 2, 32 + e, 32 + t), this._attrIndex.setXY(128 + e * 2, 64 + e, 64 + t);
		}
		this._attrIndex.setXY(192, 96, 97), this._attrIndex.needsUpdate = !0;
	}
}, br = new S(), xr = class extends l {
	constructor(e) {
		super(), this.matrixAutoUpdate = !1, this.springBone = e, this._geometry = new yr(this.springBone);
		let t = new a({
			color: 16776960,
			depthTest: !1,
			depthWrite: !1
		});
		this._line = new o(this._geometry, t), this.add(this._line);
	}
	dispose() {
		this._geometry.dispose();
	}
	updateMatrixWorld(e) {
		this.springBone.bone.updateWorldMatrix(!0, !1), this.matrix.copy(this.springBone.bone.matrixWorld);
		let t = this.matrix.elements;
		this._geometry.worldScale = br.set(t[0], t[1], t[2]).length(), this._geometry.update(), super.updateMatrixWorld(e);
	}
}, Sr = class extends n {
	constructor(e) {
		super(), this.colliderMatrix = new t(), this.shape = e;
	}
	updateWorldMatrix(e, t) {
		super.updateWorldMatrix(e, t), Cr(this.colliderMatrix, this.matrixWorld, this.shape.offset);
	}
};
function Cr(e, t, n) {
	let r = t.elements;
	e.copy(t), n && (e.elements[12] = r[0] * n.x + r[4] * n.y + r[8] * n.z + r[12], e.elements[13] = r[1] * n.x + r[5] * n.y + r[9] * n.z + r[13], e.elements[14] = r[2] * n.x + r[6] * n.y + r[10] * n.z + r[14]);
}
var wr = new t();
function Tr(e) {
	return e.invert ? e.invert() : e.getInverse(wr.copy(e)), e;
}
var Er = class {
	constructor(e) {
		this._inverseCache = new t(), this._shouldUpdateInverse = !0, this.matrix = e;
		let n = { set: (e, t, n) => (this._shouldUpdateInverse = !0, e[t] = n, !0) };
		this._originalElements = e.elements, e.elements = new Proxy(e.elements, n);
	}
	get inverse() {
		return this._shouldUpdateInverse &&= (Tr(this._inverseCache.copy(this.matrix)), !1), this._inverseCache;
	}
	revert() {
		this.matrix.elements = this._originalElements;
	}
}, Dr = new t(), Or = new S(), kr = new S(), Ar = new S(), jr = new S(), Mr = new t(), Nr = class {
	constructor(e, n, r = {}, i = []) {
		this._currentTail = new S(), this._prevTail = new S(), this._boneAxis = new S(), this._worldSpaceBoneLength = 0, this._center = null, this._initialLocalMatrix = new t(), this._initialLocalRotation = new m(), this._initialLocalChildPosition = new S(), this.bone = e, this.bone.matrixAutoUpdate = !1, this.child = n, this.settings = {
			hitRadius: r.hitRadius ?? 0,
			stiffness: r.stiffness ?? 1,
			gravityPower: r.gravityPower ?? 0,
			gravityDir: r.gravityDir?.clone() ?? new S(0, -1, 0),
			dragForce: r.dragForce ?? .4
		}, this.colliderGroups = i;
	}
	get dependencies() {
		let e = /* @__PURE__ */ new Set(), t = this.bone.parent;
		t && e.add(t);
		for (let t = 0; t < this.colliderGroups.length; t++) for (let n = 0; n < this.colliderGroups[t].colliders.length; n++) e.add(this.colliderGroups[t].colliders[n]);
		return e;
	}
	get center() {
		return this._center;
	}
	set center(e) {
		this._center?.userData.inverseCacheProxy && (this._center.userData.inverseCacheProxy.revert(), delete this._center.userData.inverseCacheProxy), this._center = e, this._center && (this._center.userData.inverseCacheProxy || (this._center.userData.inverseCacheProxy = new Er(this._center.matrixWorld)));
	}
	get initialLocalChildPosition() {
		return this._initialLocalChildPosition;
	}
	get _parentMatrixWorld() {
		return this.bone.parent ? this.bone.parent.matrixWorld : Dr;
	}
	setInitState() {
		this._initialLocalMatrix.copy(this.bone.matrix), this._initialLocalRotation.copy(this.bone.quaternion), this.child ? this._initialLocalChildPosition.copy(this.child.position) : this._initialLocalChildPosition.copy(this.bone.position).normalize().multiplyScalar(.07);
		let e = this._getMatrixWorldToCenter();
		this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(e), this._prevTail.copy(this._currentTail), this._boneAxis.copy(this._initialLocalChildPosition).normalize();
	}
	reset() {
		this.bone.quaternion.copy(this._initialLocalRotation), this.bone.updateMatrix(), this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld, this.bone.matrix);
		let e = this._getMatrixWorldToCenter();
		this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(e), this._prevTail.copy(this._currentTail);
	}
	update(e) {
		if (e <= 0) return;
		this._calcWorldSpaceBoneLength();
		let t = kr.copy(this._boneAxis).transformDirection(this._initialLocalMatrix).transformDirection(this._parentMatrixWorld);
		jr.copy(this._currentTail).add(Or.subVectors(this._currentTail, this._prevTail).multiplyScalar(1 - this.settings.dragForce)).applyMatrix4(this._getMatrixCenterToWorld()).addScaledVector(t, this.settings.stiffness * e).addScaledVector(this.settings.gravityDir, this.settings.gravityPower * e), Ar.setFromMatrixPosition(this.bone.matrixWorld), jr.sub(Ar).normalize().multiplyScalar(this._worldSpaceBoneLength).add(Ar), this._collision(jr), this._prevTail.copy(this._currentTail), this._currentTail.copy(jr).applyMatrix4(this._getMatrixWorldToCenter());
		let n = Mr.multiplyMatrices(this._parentMatrixWorld, this._initialLocalMatrix).invert();
		this.bone.quaternion.setFromUnitVectors(this._boneAxis, Or.copy(jr).applyMatrix4(n).normalize()).premultiply(this._initialLocalRotation), this.bone.updateMatrix(), this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld, this.bone.matrix);
	}
	_collision(e) {
		for (let t = 0; t < this.colliderGroups.length; t++) for (let n = 0; n < this.colliderGroups[t].colliders.length; n++) {
			let r = this.colliderGroups[t].colliders[n], i = r.shape.calculateCollision(r.colliderMatrix, e, this.settings.hitRadius, Or);
			if (i < 0) {
				e.addScaledVector(Or, -i), e.sub(Ar);
				let t = e.length();
				e.multiplyScalar(this._worldSpaceBoneLength / t).add(Ar);
			}
		}
	}
	_calcWorldSpaceBoneLength() {
		Or.setFromMatrixPosition(this.bone.matrixWorld), this.child ? kr.setFromMatrixPosition(this.child.matrixWorld) : (kr.copy(this._initialLocalChildPosition), kr.applyMatrix4(this.bone.matrixWorld)), this._worldSpaceBoneLength = Or.sub(kr).length();
	}
	_getMatrixCenterToWorld() {
		return this._center ? this._center.matrixWorld : Dr;
	}
	_getMatrixWorldToCenter() {
		return this._center ? this._center.userData.inverseCacheProxy.inverse : Dr;
	}
};
function Pr(e, t) {
	let n = [], r = e;
	for (; r !== null;) n.unshift(r), r = r.parent;
	n.forEach((e) => {
		t(e);
	});
}
function Fr(e, t) {
	e.children.forEach((e) => {
		t(e) || Fr(e, t);
	});
}
function Ir(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let r = n;
		do {
			let n = (t.get(r) ?? 0) + 1;
			if (n === e.size) return r;
			t.set(r, n), r = r.parent;
		} while (r !== null);
	}
	return null;
}
var Lr = class {
	constructor() {
		this._joints = /* @__PURE__ */ new Set(), this._sortedJoints = [], this._hasWarnedCircularDependency = !1, this._ancestors = [], this._objectSpringBonesMap = /* @__PURE__ */ new Map(), this._isSortedJointsDirty = !1, this._relevantChildrenUpdated = this._relevantChildrenUpdated.bind(this);
	}
	get joints() {
		return this._joints;
	}
	get springBones() {
		return console.warn("VRMSpringBoneManager: springBones is deprecated. use joints instead."), this._joints;
	}
	get colliderGroups() {
		let e = /* @__PURE__ */ new Set();
		return this._joints.forEach((t) => {
			t.colliderGroups.forEach((t) => {
				e.add(t);
			});
		}), Array.from(e);
	}
	get colliders() {
		let e = /* @__PURE__ */ new Set();
		return this.colliderGroups.forEach((t) => {
			t.colliders.forEach((t) => {
				e.add(t);
			});
		}), Array.from(e);
	}
	addJoint(e) {
		this._joints.add(e);
		let t = this._objectSpringBonesMap.get(e.bone);
		t ?? (t = /* @__PURE__ */ new Set(), this._objectSpringBonesMap.set(e.bone, t)), t.add(e), this._isSortedJointsDirty = !0;
	}
	addSpringBone(e) {
		console.warn("VRMSpringBoneManager: addSpringBone() is deprecated. use addJoint() instead."), this.addJoint(e);
	}
	deleteJoint(e) {
		this._joints.delete(e), this._objectSpringBonesMap.get(e.bone).delete(e), this._isSortedJointsDirty = !0;
	}
	deleteSpringBone(e) {
		console.warn("VRMSpringBoneManager: deleteSpringBone() is deprecated. use deleteJoint() instead."), this.deleteJoint(e);
	}
	setInitState() {
		this._sortJoints();
		for (let e = 0; e < this._sortedJoints.length; e++) {
			let t = this._sortedJoints[e];
			t.bone.updateMatrix(), t.bone.updateWorldMatrix(!1, !1), t.setInitState();
		}
	}
	reset() {
		this._sortJoints();
		for (let e = 0; e < this._sortedJoints.length; e++) {
			let t = this._sortedJoints[e];
			t.bone.updateMatrix(), t.bone.updateWorldMatrix(!1, !1), t.reset();
		}
	}
	update(e) {
		this._sortJoints();
		for (let e = 0; e < this._ancestors.length; e++) this._ancestors[e].updateWorldMatrix(e === 0, !1);
		for (let t = 0; t < this._sortedJoints.length; t++) {
			let n = this._sortedJoints[t];
			n.bone.updateMatrix(), n.bone.updateWorldMatrix(!1, !1), n.update(e), Fr(n.bone, this._relevantChildrenUpdated);
		}
	}
	_sortJoints() {
		if (!this._isSortedJointsDirty) return;
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
		for (let i of this._joints) this._insertJointSort(i, t, n, e, r);
		this._sortedJoints = e;
		let i = Ir(r);
		this._ancestors = [], i && (this._ancestors.push(i), Fr(i, (e) => (this._objectSpringBonesMap.get(e)?.size ?? 0) > 0 || (this._ancestors.push(e), !1))), this._isSortedJointsDirty = !1;
	}
	_insertJointSort(e, t, n, r, i) {
		if (n.has(e)) return;
		if (t.has(e)) {
			this._hasWarnedCircularDependency ||= (console.warn("VRMSpringBoneManager: Circular dependency detected"), !0);
			return;
		}
		t.add(e);
		let a = e.dependencies;
		for (let e of a) {
			let a = !1, o = null;
			Pr(e, (e) => {
				let s = this._objectSpringBonesMap.get(e);
				if (s) for (let e of s) a = !0, this._insertJointSort(e, t, n, r, i);
				else a || (o = e);
			}), o && i.add(o);
		}
		r.push(e), n.add(e);
	}
	_relevantChildrenUpdated(e) {
		return (this._objectSpringBonesMap.get(e)?.size ?? 0) > 0 || (e.updateWorldMatrix(!1, !1), !1);
	}
}, Rr = "VRMC_springBone_extended_collider", zr = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]), Br = /* @__PURE__ */ new Set(["1.0"]), Vr = class e {
	get name() {
		return e.EXTENSION_NAME;
	}
	constructor(e, t) {
		this.parser = e, this.jointHelperRoot = t?.jointHelperRoot, this.colliderHelperRoot = t?.colliderHelperRoot, this.useExtendedColliders = t?.useExtendedColliders ?? !0;
	}
	afterRoot(e) {
		return ir(this, null, function* () {
			e.userData.vrmSpringBoneManager = yield this._import(e);
		});
	}
	_import(e) {
		return ir(this, null, function* () {
			return (yield this._v1Import(e)) ?? (yield this._v0Import(e)) ?? null;
		});
	}
	_v1Import(t) {
		return ir(this, null, function* () {
			var n;
			let r = t.parser.json;
			if (r.extensionsUsed?.indexOf(e.EXTENSION_NAME) === -1) return null;
			let i = new Lr(), a = yield t.parser.getDependencies("node"), o = r.extensions?.[e.EXTENSION_NAME];
			if (!o) return null;
			let s = o.specVersion;
			if (!zr.has(s)) return console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${e.EXTENSION_NAME} specVersion "${s}"`), null;
			let c = o.colliders?.map((t, n) => {
				let r = a[t.node];
				if (r == null) return console.warn(`VRMSpringBoneLoaderPlugin: The collider #${n} attempted to reference a node #${t.node} but not found. Skipping the collider`), null;
				let i = t.shape, o = t.extensions?.[Rr];
				if (this.useExtendedColliders && o != null) {
					let t = o.specVersion;
					if (!Br.has(t)) console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${Rr} specVersion "${t}". Fallbacking to the ${e.EXTENSION_NAME} definition`);
					else {
						let e = o.shape;
						if (e.sphere) return this._importSphereCollider(r, {
							offset: new S().fromArray(e.sphere.offset ?? [
								0,
								0,
								0
							]),
							radius: e.sphere.radius ?? 0,
							inside: e.sphere.inside ?? !1
						});
						if (e.capsule) return this._importCapsuleCollider(r, {
							offset: new S().fromArray(e.capsule.offset ?? [
								0,
								0,
								0
							]),
							radius: e.capsule.radius ?? 0,
							tail: new S().fromArray(e.capsule.tail ?? [
								0,
								0,
								0
							]),
							inside: e.capsule.inside ?? !1
						});
						if (e.plane) return this._importPlaneCollider(r, {
							offset: new S().fromArray(e.plane.offset ?? [
								0,
								0,
								0
							]),
							normal: new S().fromArray(e.plane.normal ?? [
								0,
								0,
								1
							])
						});
					}
				}
				if (i.sphere) return this._importSphereCollider(r, {
					offset: new S().fromArray(i.sphere.offset ?? [
						0,
						0,
						0
					]),
					radius: i.sphere.radius ?? 0,
					inside: !1
				});
				if (i.capsule) return this._importCapsuleCollider(r, {
					offset: new S().fromArray(i.capsule.offset ?? [
						0,
						0,
						0
					]),
					radius: i.capsule.radius ?? 0,
					tail: new S().fromArray(i.capsule.tail ?? [
						0,
						0,
						0
					]),
					inside: !1
				});
				console.warn(`VRMSpringBoneLoaderPlugin: The collider #${n} has no valid shape. Skipping the collider`);
			}), l = o.colliderGroups?.map((e, t) => ({
				colliders: (e.colliders ?? []).map((e) => c?.[e] ?? (console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${t} attempted to reference a collider #${e} but not found. Skipping the collider`), null)).filter((e) => e != null),
				name: e.name
			}));
			return (n = o.springs) == null || n.forEach((e, t) => {
				let n = e.joints, r = e.colliderGroups?.map((e) => l?.[e] ?? (console.warn(`VRMSpringBoneLoaderPlugin: The spring #${t} attempted to reference a collider group #${e} but not found. Skipping the collider group`), null)).filter((e) => e != null), o = e.center == null ? void 0 : a[e.center], s;
				n.forEach((e) => {
					if (s) {
						let t = s.node, n = a[t], c = e.node, l = a[c], u = {
							hitRadius: s.hitRadius,
							dragForce: s.dragForce,
							gravityPower: s.gravityPower,
							stiffness: s.stiffness,
							gravityDir: s.gravityDir == null ? void 0 : new S().fromArray(s.gravityDir)
						}, d = this._importJoint(n, l, u, r);
						o && (d.center = o), i.addJoint(d);
					}
					s = e;
				});
			}), i.setInitState(), i;
		});
	}
	_v0Import(e) {
		return ir(this, null, function* () {
			let t = e.parser.json;
			if (t.extensionsUsed?.indexOf("VRM") === -1) return null;
			let n = t.extensions?.VRM?.secondaryAnimation;
			if (!n) return null;
			let r = n?.boneGroups;
			if (!r) return null;
			let i = new Lr(), a = yield e.parser.getDependencies("node"), o = n.colliderGroups?.map((e, t) => {
				let n = a[e.node];
				return n == null ? (console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${t} attempted to reference a node #${e.node} but not found. Skipping the collider group`), null) : { colliders: (e.colliders ?? []).map((e, t) => {
					let r = new S(0, 0, 0);
					return e.offset && r.set(e.offset.x ?? 0, e.offset.y ?? 0, e.offset.z ? -e.offset.z : 0), this._importSphereCollider(n, {
						offset: r,
						radius: e.radius ?? 0,
						inside: !1
					});
				}) };
			});
			return r?.forEach((e, t) => {
				let n = e.bones;
				n && n.forEach((n) => {
					let r = a[n];
					if (r == null) {
						console.warn(`VRMSpringBoneLoaderPlugin: The spring bone group #${t} attempted to reference a node #${n} but not found. Skipping the node`);
						return;
					}
					let s = new S();
					e.gravityDir ? s.set(e.gravityDir.x ?? 0, e.gravityDir.y ?? 0, e.gravityDir.z ?? 0) : s.set(0, -1, 0);
					let c = e.center == null ? void 0 : a[e.center], l = {
						hitRadius: e.hitRadius,
						dragForce: e.dragForce,
						gravityPower: e.gravityPower,
						stiffness: e.stiffiness,
						gravityDir: s
					}, u = e.colliderGroups?.map((e) => o?.[e] ?? (console.warn(`VRMSpringBoneLoaderPlugin: The spring #${t} attempted to reference a collider group #${e} but not found. Skipping the collider group`), null)).filter((e) => e != null);
					r.traverse((e) => {
						let t = e.children[0] ?? null, n = this._importJoint(e, t, l, u);
						c && (n.center = c), i.addJoint(n);
					});
				});
			}), e.scene.updateMatrixWorld(), i.setInitState(), i;
		});
	}
	_importJoint(e, t, n, r) {
		let i = new Nr(e, t, n, r);
		if (this.jointHelperRoot) {
			let e = new xr(i);
			this.jointHelperRoot.add(e), e.renderOrder = this.jointHelperRoot.renderOrder;
		}
		return i;
	}
	_importSphereCollider(e, t) {
		let n = new Sr(new pr(t));
		if (e.add(n), this.colliderHelperRoot) {
			let e = new vr(n);
			this.colliderHelperRoot.add(e), e.renderOrder = this.colliderHelperRoot.renderOrder;
		}
		return n;
	}
	_importCapsuleCollider(e, t) {
		let n = new Sr(new cr(t));
		if (e.add(n), this.colliderHelperRoot) {
			let e = new vr(n);
			this.colliderHelperRoot.add(e), e.renderOrder = this.colliderHelperRoot.renderOrder;
		}
		return n;
	}
	_importPlaneCollider(e, t) {
		let n = new Sr(new dr(t));
		if (e.add(n), this.colliderHelperRoot) {
			let e = new vr(n);
			this.colliderHelperRoot.add(e), e.renderOrder = this.colliderHelperRoot.renderOrder;
		}
		return n;
	}
};
Vr.EXTENSION_NAME = "VRMC_springBone";
var Hr = Vr, Ur = class {
	get name() {
		return "VRMLoaderPlugin";
	}
	constructor(e, t) {
		this.parser = e;
		let n = t?.helperRoot, r = t?.autoUpdateHumanBones;
		this.expressionPlugin = t?.expressionPlugin ?? new Ke(e), this.firstPersonPlugin = t?.firstPersonPlugin ?? new Xe(e), this.humanoidPlugin = t?.humanoidPlugin ?? new pt(e, {
			helperRoot: n,
			autoUpdateHumanBones: r
		}), this.lookAtPlugin = t?.lookAtPlugin ?? new qt(e, { helperRoot: n }), this.metaPlugin = t?.metaPlugin ?? new Xt(e), this.mtoonMaterialPlugin = t?.mtoonMaterialPlugin ?? new gn(e), this.materialsHDREmissiveMultiplierPlugin = t?.materialsHDREmissiveMultiplierPlugin ?? new yn(e), this.materialsV0CompatPlugin = t?.materialsV0CompatPlugin ?? new An(e), this.springBonePlugin = t?.springBonePlugin ?? new Hr(e, {
			colliderHelperRoot: n,
			jointHelperRoot: n
		}), this.nodeConstraintPlugin = t?.nodeConstraintPlugin ?? new rr(e, { helperRoot: n });
	}
	beforeRoot() {
		return De(this, null, function* () {
			yield this.materialsV0CompatPlugin.beforeRoot(), yield this.mtoonMaterialPlugin.beforeRoot();
		});
	}
	loadMesh(e) {
		return De(this, null, function* () {
			return yield this.mtoonMaterialPlugin.loadMesh(e);
		});
	}
	getMaterialType(e) {
		return this.mtoonMaterialPlugin.getMaterialType(e) ?? null;
	}
	extendMaterialParams(e, t) {
		return De(this, null, function* () {
			yield this.materialsHDREmissiveMultiplierPlugin.extendMaterialParams(e, t), yield this.mtoonMaterialPlugin.extendMaterialParams(e, t);
		});
	}
	afterRoot(e) {
		return De(this, null, function* () {
			yield this.metaPlugin.afterRoot(e), yield this.humanoidPlugin.afterRoot(e), yield this.expressionPlugin.afterRoot(e), yield this.lookAtPlugin.afterRoot(e), yield this.firstPersonPlugin.afterRoot(e), yield this.springBonePlugin.afterRoot(e), yield this.nodeConstraintPlugin.afterRoot(e), yield this.mtoonMaterialPlugin.afterRoot(e);
			let t = e.userData.vrmMeta, n = e.userData.vrmHumanoid;
			if (t && n) {
				let r = new Qt({
					scene: e.scene,
					expressionManager: e.userData.vrmExpressionManager,
					firstPerson: e.userData.vrmFirstPerson,
					humanoid: n,
					lookAt: e.userData.vrmLookAt,
					meta: t,
					materials: e.userData.vrmMToonMaterials,
					springBoneManager: e.userData.vrmSpringBoneManager,
					nodeConstraintManager: e.userData.vrmNodeConstraintManager
				});
				e.userData.vrm = r;
			}
		});
	}
};
function Wr(e) {
	let t = /* @__PURE__ */ new Set();
	return e.traverse((e) => {
		if (!e.isMesh) return;
		let n = e;
		t.add(n);
	}), t;
}
function Gr(e, t, n) {
	if (t.size === 1) {
		let n = t.values().next().value;
		if (n.weight === 1) return e[n.index];
	}
	let r = new Float32Array(e[0].count * 3), i = 0;
	if (n) i = 1;
	else for (let e of t) i += e.weight;
	for (let n of t) {
		let t = e[n.index], a = n.weight / i;
		for (let e = 0; e < t.count; e++) r[e * 3 + 0] += t.getX(e) * a, r[e * 3 + 1] += t.getY(e) * a, r[e * 3 + 2] += t.getZ(e) * a;
	}
	return new N(r, 3);
}
function Kr(e) {
	let t = Wr(e.scene), n = /* @__PURE__ */ new Map(), r = e.expressionManager?.expressionMap;
	if (r != null) for (let [e, t] of Object.entries(r)) {
		let r = /* @__PURE__ */ new Set();
		for (let i of t.binds) if (i instanceof Be) {
			if (i.weight !== 0) for (let t of i.primitives) {
				let r = n.get(t);
				r ?? (r = /* @__PURE__ */ new Map(), n.set(t, r));
				let a = r.get(e);
				a ?? (a = /* @__PURE__ */ new Set(), r.set(e, a)), a.add(i);
			}
			r.add(i);
		}
		for (let e of r) t.deleteBind(e);
	}
	for (let e of t) {
		let t = n.get(e);
		if (t == null) continue;
		let i = e.geometry.morphAttributes;
		e.geometry.morphAttributes = {};
		let a = e.geometry.clone();
		e.geometry = a;
		let o = a.morphTargetsRelative, s = i.position != null, c = i.normal != null, l = {}, u = {}, d = [];
		if (s || c) {
			s && (l.position = []), c && (l.normal = []);
			let n = 0;
			for (let [a, f] of t) s && (l.position[n] = Gr(i.position, f, o)), c && (l.normal[n] = Gr(i.normal, f, o)), r?.[a].addBind(new Be({
				index: n,
				weight: 1,
				primitives: [e]
			})), u[a] = n, d.push(0), n++;
		}
		a.morphAttributes = l, e.morphTargetDictionary = u, e.morphTargetInfluences = d;
	}
}
function qr(e, t, n) {
	if (e.getComponent) return e.getComponent(t, n);
	{
		let r = e.array[t * e.itemSize + n];
		return e.normalized && (r = c.denormalize(r, e.array)), r;
	}
}
function Jr(e, t, n, r) {
	e.setComponent ? e.setComponent(t, n, r) : (e.normalized && (r = c.normalize(r, e.array)), e.array[t * e.itemSize + n] = r);
}
function Yr(e) {
	let n = Xr(e), r = /* @__PURE__ */ new Set();
	for (let e of n) r.has(e.geometry) && (e.geometry = ri(e.geometry)), r.add(e.geometry);
	let i = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.getAttribute("skinIndex"), n = i.get(t) ?? /* @__PURE__ */ new Map();
		i.set(t, n);
		let r = e.getAttribute("skinWeight"), a = Zr(t, r);
		n.set(r, a);
	}
	let a = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Qr(e, i);
		a.set(e, t);
	}
	let o = [];
	for (let [e, t] of a) {
		let n = !1;
		for (let r of o) if ($r(t, r.boneInverseMap)) {
			n = !0, r.meshes.add(e);
			for (let [e, n] of t) r.boneInverseMap.set(e, n);
			break;
		}
		n || o.push({
			boneInverseMap: t,
			meshes: /* @__PURE__ */ new Set([e])
		});
	}
	let s = /* @__PURE__ */ new Map(), c = new ni(), l = new ni(), u = new ni();
	for (let e of o) {
		let { boneInverseMap: n, meshes: r } = e, i = Array.from(n.keys()), a = Array.from(n.values()), o = new y(i, a), d = l.getOrCreate(o);
		for (let e of r) {
			let t = e.geometry.getAttribute("skinIndex"), n = c.getOrCreate(t), r = e.skeleton.bones, a = `${n};${d};${r.map((e) => u.getOrCreate(e)).join(",")}`, o = s.get(a);
			o ?? (o = t.clone(), ei(o, r, i), s.set(a, o)), e.geometry.setAttribute("skinIndex", o);
		}
		for (let e of r) e.bind(o, new t());
	}
}
function Xr(e) {
	let t = /* @__PURE__ */ new Set();
	return e.traverse((e) => {
		if (!e.isSkinnedMesh) return;
		let n = e;
		t.add(n);
	}), t;
}
function Zr(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r = 0; r < e.count; r++) for (let i = 0; i < e.itemSize; i++) {
		let a = qr(e, r, i);
		qr(t, r, i) !== 0 && n.add(a);
	}
	return n;
}
function Qr(e, t) {
	let n = /* @__PURE__ */ new Map(), r = e.skeleton, i = e.geometry, a = i.getAttribute("skinIndex"), o = i.getAttribute("skinWeight"), s = t.get(a)?.get(o);
	if (!s) throw Error("Unreachable. attributeUsedIndexSetMap does not know the skin index attribute or the skin weight attribute.");
	for (let e of s) n.set(r.bones[e], r.boneInverses[e]);
	return n;
}
function $r(e, t) {
	for (let [n, r] of e.entries()) {
		let e = t.get(n);
		if (e != null && !ti(r, e)) return !1;
	}
	return !0;
}
function ei(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) r.set(e, r.size);
	let i = /* @__PURE__ */ new Map();
	for (let [e, t] of n.entries()) {
		let n = r.get(t);
		i.set(n, e);
	}
	for (let t = 0; t < e.count; t++) for (let n = 0; n < e.itemSize; n++) {
		let r = qr(e, t, n), a = i.get(r);
		Jr(e, t, n, a);
	}
	e.needsUpdate = !0;
}
function ti(e, t, n) {
	if (n ||= 1e-4, e.elements.length != t.elements.length) return !1;
	for (let r = 0, i = e.elements.length; r < i; r++) if (Math.abs(e.elements[r] - t.elements[r]) > n) return !1;
	return !0;
}
var ni = class {
	constructor() {
		this._objectIndexMap = /* @__PURE__ */ new Map(), this._index = 0;
	}
	get(e) {
		return this._objectIndexMap.get(e);
	}
	getOrCreate(e) {
		let t = this._objectIndexMap.get(e);
		return t ?? (t = this._index, this._objectIndexMap.set(e, t), this._index++), t;
	}
};
function ri(e) {
	let t = new b();
	t.name = e.name, t.setIndex(e.index);
	for (let [n, r] of Object.entries(e.attributes)) t.setAttribute(n, r);
	for (let [n, r] of Object.entries(e.morphAttributes)) {
		let e = n;
		t.morphAttributes[e] = r.concat();
	}
	t.morphTargetsRelative = e.morphTargetsRelative, t.groups = [];
	for (let n of e.groups) t.addGroup(n.start, n.count, n.materialIndex);
	return t.boundingSphere = e.boundingSphere?.clone() ?? null, t.boundingBox = e.boundingBox?.clone() ?? null, t.drawRange.start = e.drawRange.start, t.drawRange.count = e.drawRange.count, t.userData = e.userData, t;
}
function ii(e) {
	if (Object.values(e).forEach((e) => {
		e?.isTexture && e.dispose();
	}), e.isShaderMaterial) {
		let t = e.uniforms;
		t && Object.values(t).forEach((e) => {
			let t = e.value;
			t?.isTexture && t.dispose();
		});
	}
	e.dispose();
}
function ai(e) {
	let t = e.geometry;
	t && t.dispose();
	let n = e.skeleton;
	n && n.dispose();
	let r = e.material;
	r && (Array.isArray(r) ? r.forEach((e) => ii(e)) : r && ii(r));
}
function oi(e) {
	e.traverse(ai);
}
function si(e, n) {
	console.warn("VRMUtils.removeUnnecessaryJoints: removeUnnecessaryJoints is deprecated. Use combineSkeletons instead. combineSkeletons contributes more to the performance improvement. This function will be removed in the next major version.");
	let r = n?.experimentalSameBoneCounts ?? !1, i = [];
	e.traverse((e) => {
		e.type === "SkinnedMesh" && i.push(e);
	});
	let a = /* @__PURE__ */ new Map(), o = 0;
	for (let e of i) {
		let t = e.geometry.getAttribute("skinIndex");
		if (a.has(t)) continue;
		let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
		for (let e = 0; e < t.count; e++) for (let i = 0; i < t.itemSize; i++) {
			let a = qr(t, e, i), o = n.get(a);
			o ?? (o = n.size, n.set(a, o), r.set(o, a)), Jr(t, e, i, o);
		}
		t.needsUpdate = !0, a.set(t, r), o = Math.max(o, n.size);
	}
	for (let e of i) {
		let n = e.geometry.getAttribute("skinIndex"), i = a.get(n), s = [], c = [], l = r ? o : i.size;
		for (let t = 0; t < l; t++) {
			let n = i.get(t) ?? 0;
			s.push(e.skeleton.bones[n]), c.push(e.skeleton.boneInverses[n]);
		}
		let u = new y(s, c);
		e.bind(u, new t());
	}
}
function ci(e, t) {
	let n = e.position.count, r = Array(n), i = 0, a = t.array;
	for (let e = 0; e < a.length; e++) {
		let t = a[e];
		r[t] || (r[t] = !0, i++);
	}
	return {
		isVertexUsed: r,
		vertexCount: n,
		verticesUsed: i
	};
}
function li(e) {
	let t = [], n = [], r = 0;
	for (let i = 0; i < e.length; i++) if (e[i]) {
		let e = r++;
		t[i] = e, n[e] = i;
	}
	return {
		originalIndexNewIndexMap: t,
		newIndexOriginalIndexMap: n
	};
}
function ui(e, t) {
	t.name = e.name, t.morphTargetsRelative = e.morphTargetsRelative, e.groups.forEach((e) => {
		t.addGroup(e.start, e.count, e.materialIndex);
	}), t.boundingBox = e.boundingBox?.clone() ?? null, t.boundingSphere = e.boundingSphere?.clone() ?? null, t.setDrawRange(e.drawRange.start, e.drawRange.count), t.userData = e.userData;
}
function di(e, t, n) {
	let r = t.array, i = new r.constructor(r.length);
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		i[e] = n[t];
	}
	e.setIndex(new N(i, t.itemSize, t.normalized));
}
function fi(e, t, n) {
	let r = e.constructor, i = new r(t.length * n), a = !0;
	for (let r = 0; r < t.length; r++) {
		let o = t[r] * n, s = r * n;
		for (let t = 0; t < n; t++) {
			let n = e[o + t];
			i[s + t] = n, a &&= n === 0;
		}
	}
	return [i, a];
}
function pi(e) {
	let t = /* @__PURE__ */ new Map(), n = [];
	for (let [r, i] of Object.entries(e)) if (i.isInterleavedBufferAttribute) {
		let e = i, n = e.data, a = t.get(n) ?? [];
		t.set(n, a), a.push([r, e]);
	} else {
		let e = i;
		n.push([r, e]);
	}
	return [t, n];
}
function mi(t, n, r) {
	let [i, a] = pi(n);
	for (let [n, a] of i) {
		let i = n.array, { stride: o } = n, [s, c] = fi(i, r, o), l = new E(s, o);
		l.setUsage(n.usage);
		for (let [n, r] of a) {
			let { itemSize: i, offset: a, normalized: o } = r, s = new e(l, i, a, o);
			t.setAttribute(n, s);
		}
	}
	for (let [e, n] of a) {
		let i = n.array, { itemSize: a, normalized: o } = n, [s, c] = fi(i, r, a);
		t.setAttribute(e, new N(s, a, o));
	}
}
function hi(e) {
	let t = /* @__PURE__ */ new Map(), n = [];
	for (let [r, i] of Object.entries(e)) {
		let e = r;
		for (let r = 0; r < i.length; r++) {
			let a = i[r];
			if (a.isInterleavedBufferAttribute) {
				let n = a, i = n.data, o = t.get(i) ?? [];
				t.set(i, o), o.push([
					e,
					r,
					n
				]);
			} else {
				let t = a;
				n.push([
					e,
					r,
					t
				]);
			}
		}
	}
	return [t, n];
}
function gi(t, n, r) {
	let i = !0, [a, o] = hi(n), s = {};
	for (let [t, n] of a) {
		let a = t.array, { stride: o } = t, [c, l] = fi(a, r, o);
		i &&= l;
		let u = new E(c, o);
		u.setUsage(t.usage);
		for (let [t, r, i] of n) {
			let { itemSize: n, offset: a, normalized: o } = i, c = new e(u, n, a, o);
			s[t] ?? (s[t] = []), s[t][r] = c;
		}
	}
	for (let [e, t, n] of o) {
		let a = n, o = a.array, { itemSize: c, normalized: l } = a, [u, d] = fi(o, r, c);
		i &&= d, s[e] ?? (s[e] = []), s[e][t] = new N(u, c, l);
	}
	t.morphAttributes = i ? {} : s;
}
function _i(e) {
	let t = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		if (!e.isMesh) return;
		let n = e, r = n.geometry, i = r.index;
		if (i == null) return;
		let a = t.get(r);
		if (a != null) {
			n.geometry = a;
			return;
		}
		let { isVertexUsed: o, vertexCount: s, verticesUsed: c } = ci(r.attributes, i);
		if (c === s) return;
		let { originalIndexNewIndexMap: l, newIndexOriginalIndexMap: u } = li(o), d = new b();
		ui(r, d), t.set(r, d), di(d, i, l), mi(d, r.attributes, u), gi(d, r.morphAttributes, u), n.geometry = d;
	}), Array.from(t.keys()).forEach((e) => {
		e.dispose();
	});
}
function vi(e) {
	e.meta?.metaVersion === "0" && (e.scene.rotation.y = Math.PI);
}
var Z = class {
	constructor() {}
};
Z.combineMorphs = Kr, Z.combineSkeletons = Yr, Z.deepDispose = oi, Z.removeUnnecessaryJoints = si, Z.removeUnnecessaryVertices = _i, Z.rotateVRM0 = vi;
// src/render/vrm.ts
var yi = class {
	name = "vrm";
	canvas = null;
	renderer = null;
	scene = new j();
	camera = new ee(22, 1, .05, 20);
	lookTarget = new n();
	vrm = null;
	state = "idle";
	elapsed = 0;
	blinkAt = 2;
	blinkPhase = -1;
	headBase = new se();
	loader;
	lastW = 0;
	lastH = 0;
	opts;
	cur = {
		aa: 0,
		ih: 0,
		ou: 0,
		ee: 0,
		oh: 0
	};
	constructor(e = {}) {
		this.opts = {
			mouthGain: e.mouthGain ?? .9,
			distance: e.distance ?? .85,
			fov: e.fov ?? 22,
			transparent: e.transparent ?? !0,
			background: e.background ?? 0,
			pixelRatioCap: e.pixelRatioCap ?? 2
		}, this.loader = new re(), this.loader.register((e) => new Ur(e)), this.scene.add(this.lookTarget);
		let t = new ae(16774376, 7109266, 1.1), n = new g(16773600, 1.6);
		n.position.set(-.8, 1.6, 1.8);
		let r = new g(14674431, .7);
		r.position.set(1.2, .8, 1.2);
		let i = new g(16777215, .9);
		i.position.set(.3, 1.2, -1.5), this.scene.add(t, n, r, i);
	}
	mount(e) {
		this.canvas = e, this.renderer = new w({
			canvas: e,
			antialias: !0,
			alpha: this.opts.transparent,
			powerPreference: "high-performance"
		}), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.opts.pixelRatioCap)), this.renderer.outputColorSpace = _, this.renderer.toneMapping = 4, this.renderer.toneMappingExposure = 1.05, this.opts.transparent || this.renderer.setClearColor(this.opts.background, 1), this.camera.fov = this.opts.fov, this.resizeIfNeeded(!0);
	}
	async setAvatar(e) {
		let t = await this.loader.loadAsync(e), n = t.userData.vrm;
		if (!n) throw Error("avatarz: file is not a VRM: " + e);
		Z.removeUnnecessaryVertices(t.scene), Z.combineSkeletons(t.scene), Z.combineMorphs(n), Z.rotateVRM0(n), n.scene.traverse((e) => {
			e.frustumCulled = !1;
		}), this.vrm && (this.scene.remove(this.vrm.scene), Z.deepDispose(this.vrm.scene)), this.vrm = n, this.scene.add(n.scene), n.lookAt && (n.lookAt.target = this.lookTarget, n.lookAt.autoUpdate = !0);
		let r = n.humanoid.getNormalizedBoneNode("head");
		r && this.headBase.copy(r.rotation), this.frameCamera();
	}
	getAvatarMeta() {
		let e = this.vrm?.meta;
		if (!e) return null;
		let t = this.vrm?.expressionManager?.expressions.map((e) => e.expressionName) ?? [];
		return e.metaVersion === "1" ? {
			version: "1",
			name: e.name,
			authors: e.authors,
			licenseUrl: e.licenseUrl,
			commercialUsage: e.commercialUsage,
			expressions: t
		} : {
			version: "0",
			name: e.title,
			authors: e.author ? [e.author] : void 0,
			licenseUrl: e.otherLicenseUrl || e.licenseName,
			commercialUsage: e.commercialUssageName,
			expressions: t
		};
	}
	frameCamera() {
		let e = this.vrm;
		if (!e) return;
		e.scene.updateMatrixWorld(!0);
		let t = e.humanoid.getRawBoneNode("head"), n = new S();
		t ? t.getWorldPosition(n) : n.set(0, 1.5, 0), n.y += .02, this.camera.position.set(n.x, n.y + .02, n.z + this.opts.distance), this.camera.lookAt(n), this.lookTarget.position.copy(this.camera.position);
	}
	resizeIfNeeded(e = !1) {
		let t = this.canvas, n = this.renderer;
		if (!t || !n) return;
		let r = t.clientWidth || t.width, i = t.clientHeight || t.height;
		(e || r !== this.lastW || i !== this.lastH) && (this.lastW = r, this.lastH = i, n.setSize(r, i, !1), this.camera.aspect = r / Math.max(1, i), this.camera.updateProjectionMatrix());
	}
	setState(e) {
		this.state = e;
	}
	emotion = {
		happy: 0,
		sad: 0,
		surprised: 0,
		angry: 0,
		relaxed: 0
	};
	emotionTarget = { ...this.emotion };
	setEmotion(e, t = 1) {
		let n = B(t), r = {
			happy: 0,
			sad: 0,
			surprised: 0,
			angry: 0,
			relaxed: 0
		};
		e === "warm" && (r.happy = .35 * n, r.relaxed = .2 * n), e === "amused" && (r.happy = .6 * n), e === "concerned" && (r.sad = .4 * n), e === "surprised" && (r.surprised = .5 * n), e === "thoughtful" && (r.angry = .15 * n, r.relaxed = .1 * n), this.emotionTarget = r;
	}
	setEmotionMix(e) {
		let t = {
			happy: 0,
			sad: 0,
			surprised: 0,
			angry: 0,
			relaxed: 0
		};
		t.happy = .35 * (e.warm ?? 0) + .6 * (e.amused ?? 0), t.relaxed = .2 * (e.warm ?? 0) + .1 * (e.thoughtful ?? 0), t.sad = .4 * (e.concerned ?? 0), t.surprised = .5 * (e.surprised ?? 0), t.angry = .15 * (e.thoughtful ?? 0), this.emotionTarget = t;
	}
	updateMs = 0;
	frame(e, t) {
		let n = performance.now(), r = this.renderer, i = this.vrm;
		if (!r) return;
		if (this.resizeIfNeeded(), this.elapsed += t, !i) {
			r.render(this.scene, this.camera);
			return;
		}
		let a = i.expressionManager, o = e.visemes, s = this.opts.mouthGain;
		if (a) {
			let n = o[I.aa], r = o[I.I] * .8 + o[I.aa] * .25, i = o[I.U] * .9 + o[I.O] * .3, c = o[I.E] * .9 + o[I.I] * .2, l = o[I.O] * .9 + o[I.aa] * .35, u = Math.max(o[I.TH], o[I.DD], o[I.kk], o[I.CH], o[I.SS], o[I.nn], o[I.RR]), d = Math.max(o[I.PP], o[I.FF]), f = (1 - .6 * u) * (1 - d) * s;
			n *= f, r *= f, i *= f, c *= f, l *= f, r = Math.max(r, .35 * Math.max(o[I.SS], o[I.CH], o[I.TH], o[I.DD], o[I.nn]) * s);
			let p = this.cur;
			if (p.aa = B(n), p.ih = B(r), p.ou = B(i), p.ee = B(c), p.oh = B(l), a.setValue("aa", p.aa), a.setValue("ih", p.ih), a.setValue("ou", p.ou), a.setValue("ee", p.ee), a.setValue("oh", p.oh), this.blinkPhase < 0 && this.elapsed >= this.blinkAt && (this.blinkPhase = 0), this.blinkPhase >= 0) {
				this.blinkPhase += t / .2;
				let e = this.blinkPhase, n = e < .4 ? e / .4 : e < 1 ? 1 - (e - .4) / .6 : 0;
				a.setValue("blink", B(n)), e >= 1 && (this.blinkPhase = -1, this.blinkAt = this.elapsed + 3 + Math.random() * 3);
			}
			let m = 1 - Math.exp(-8 * t);
			for (let e of Object.keys(this.emotion)) this.emotion[e] += (this.emotionTarget[e] - this.emotion[e]) * m;
			let h = (this.state === "idle" || this.state === "active" ? .12 : .05) + this.emotion.happy;
			a.setValue("happy", B(h * (1 - e.jawOpen))), a.setValue("sad", this.emotion.sad), a.setValue("surprised", this.emotion.surprised), a.setValue("angry", this.emotion.angry), a.setValue("relaxed", this.emotion.relaxed);
		}
		let l = i.humanoid.getNormalizedBoneNode("head");
		if (l) {
			let t = this.elapsed, n = c.degToRad(1.5), r = 0, i = 0;
			this.state === "thinking" && (i = c.degToRad(4), r = -c.degToRad(2)), this.state === "listening" && (r = c.degToRad(2)), l.rotation.set(this.headBase.x + r + Math.sin(t * .7) * n * .5 + e.jawOpen * .03, this.headBase.y + 0 + Math.sin(t * .43) * n, this.headBase.z + i + Math.sin(t * .31 + 1) * n * .6);
		}
		let u = this.camera.position, d = .04, f = this.state === "thinking" ? .25 : 0, p = this.state === "thinking" ? .2 : 0;
		this.lookTarget.position.set(u.x + p + Math.sin(this.elapsed * .37) * d, u.y + f + Math.sin(this.elapsed * .53 + 2) * d * .5, u.z), i.update(t), this.updateMs = performance.now() - n, r.render(this.scene, this.camera);
	}
	dispose() {
		this.vrm &&= (this.scene.remove(this.vrm.scene), Z.deepDispose(this.vrm.scene), null), this.renderer?.dispose(), this.renderer = null, this.canvas = null;
	}
}, bi = {
	sil: {
		open: 0,
		width: 1,
		round: 0,
		teeth: 0,
		press: 0
	},
	PP: {
		open: 0,
		width: .9,
		round: .1,
		teeth: 0,
		press: 1
	},
	FF: {
		open: .15,
		width: 1,
		round: 0,
		teeth: 1,
		press: .3
	},
	TH: {
		open: .2,
		width: 1,
		round: 0,
		teeth: .6,
		press: 0
	},
	DD: {
		open: .3,
		width: 1,
		round: 0,
		teeth: .5,
		press: 0
	},
	kk: {
		open: .35,
		width: .95,
		round: 0,
		teeth: .2,
		press: 0
	},
	CH: {
		open: .3,
		width: .8,
		round: .4,
		teeth: .6,
		press: 0
	},
	SS: {
		open: .15,
		width: 1.1,
		round: 0,
		teeth: 1,
		press: 0
	},
	nn: {
		open: .2,
		width: 1,
		round: 0,
		teeth: .4,
		press: 0
	},
	RR: {
		open: .3,
		width: .8,
		round: .5,
		teeth: .2,
		press: 0
	},
	aa: {
		open: 1,
		width: 1,
		round: .1,
		teeth: .3,
		press: 0
	},
	E: {
		open: .5,
		width: 1.2,
		round: 0,
		teeth: .7,
		press: 0
	},
	I: {
		open: .3,
		width: 1.25,
		round: 0,
		teeth: .8,
		press: 0
	},
	O: {
		open: .8,
		width: .6,
		round: 1,
		teeth: 0,
		press: 0
	},
	U: {
		open: .4,
		width: .5,
		round: 1,
		teeth: 0,
		press: 0
	}
}, xi = class {
	name = "sprite";
	canvas = null;
	ctx = null;
	state = "idle";
	elapsed = 0;
	blinkAt = 2;
	blinkPhase = -1;
	colors;
	constructor(e = {}) {
		this.colors = {
			skin: e.skin ?? "#f1c9a5",
			lip: e.lip ?? "#b5533c",
			eye: e.eye ?? "#2b2b2b",
			background: e.background ?? null
		};
	}
	mount(e) {
		this.canvas = e, this.ctx = e.getContext("2d");
	}
	async setAvatar(e) {}
	setState(e) {
		this.state = e;
	}
	frame(e, t) {
		let n = this.canvas, r = this.ctx;
		if (!n || !r) return;
		this.elapsed += t;
		let i = Math.min(window.devicePixelRatio || 1, 2), a = n.clientWidth || n.width, o = n.clientHeight || n.height;
		(n.width !== Math.round(a * i) || n.height !== Math.round(o * i)) && (n.width = Math.round(a * i), n.height = Math.round(o * i)), r.setTransform(i, 0, 0, i, 0, 0), this.colors.background ? (r.fillStyle = this.colors.background, r.fillRect(0, 0, a, o)) : r.clearRect(0, 0, a, o);
		let s = {
			open: 0,
			width: 0,
			round: 0,
			teeth: 0,
			press: 0
		}, c = 0;
		for (let t = 0; t < F.length; t++) {
			let n = e.visemes[t];
			if (n <= 0) continue;
			let r = bi[F[t]];
			s.open += r.open * n, s.width += r.width * n, s.round += r.round * n, s.teeth += r.teeth * n, s.press += r.press * n, c += n;
		}
		c > 0 ? (s.open /= c, s.width /= c, s.round /= c, s.teeth /= c, s.press /= c) : s.width = 1;
		let l = Math.max(s.open * (.5 + .5 * e.energy), e.jawOpen * .6), u = Math.min(a, o) * .36, d = this.elapsed, f = Math.sin(d * .43) * u * .02, p = Math.sin(d * .7) * u * .015, m = (this.state === "thinking" ? .07 : 0) + Math.sin(d * .31) * .02, h = a / 2 + f, g = o / 2 + p + l * u * .03;
		r.save(), r.translate(h, g), r.rotate(m), r.fillStyle = this.colors.skin, r.beginPath(), r.ellipse(0, 0, u * .95, u * 1.05 + l * u * .06, 0, 0, Math.PI * 2), r.fill(), this.blinkPhase < 0 && d >= this.blinkAt && (this.blinkPhase = 0);
		let _ = 0;
		if (this.blinkPhase >= 0) {
			this.blinkPhase += t / .2;
			let e = this.blinkPhase;
			_ = e < .4 ? e / .4 : e < 1 ? 1 - (e - .4) / .6 : 0, e >= 1 && (this.blinkPhase = -1, this.blinkAt = d + 3 + Math.random() * 3);
		}
		let v = this.state === "thinking" ? -u * .04 : 0, y = Math.sin(d * .37) * u * .015 + (this.state === "thinking" ? u * .03 : 0);
		for (let e of [-1, 1]) {
			let t = e * u * .36, n = -u * .18, i = u * .11 * (1 - _ * .92);
			r.fillStyle = "#fff", r.beginPath(), r.ellipse(t, n, u * .13, i, 0, 0, Math.PI * 2), r.fill(), r.fillStyle = this.colors.eye, r.beginPath(), r.ellipse(t + y, n + v, u * .06, Math.min(i, u * .06), 0, 0, Math.PI * 2), r.fill(), r.strokeStyle = "#6b4a2f", r.lineWidth = u * .035, r.lineCap = "round";
			let a = this.state === "thinking" && e > 0 ? -u * .04 : 0;
			r.beginPath(), r.moveTo(t - u * .14, n - u * .2 + a), r.quadraticCurveTo(t, n - u * .27 + a, t + u * .14, n - u * .2 + a), r.stroke();
		}
		r.strokeStyle = "rgba(0,0,0,0.18)", r.lineWidth = u * .03, r.beginPath(), r.moveTo(0, -u * .02), r.lineTo(-u * .05, u * .2), r.lineTo(u * .04, u * .22), r.stroke();
		let b = u * .5, x = u * .42 * s.width * (1 - .35 * s.round), S = u * .05 + l * u * .34 * (1 + .3 * s.round), C = B(s.press);
		r.fillStyle = "#4a1d1d", r.beginPath(), r.ellipse(0, b, x, Math.max(u * .012, S * (1 - C * .9)), 0, 0, Math.PI * 2), r.fill(), s.teeth > .05 && S > u * .03 && (r.fillStyle = "#fff", r.beginPath(), r.ellipse(0, b - S * .55, x * .85, S * .35 * B(s.teeth), 0, 0, Math.PI * 2), r.fill()), r.strokeStyle = this.colors.lip, r.lineWidth = u * (.04 + C * .02), r.beginPath(), r.ellipse(0, b, x, Math.max(u * .012, S * (1 - C * .9)), 0, 0, Math.PI * 2), r.stroke(), r.restore();
	}
	dispose() {
		this.canvas = null, this.ctx = null;
	}
}, Si = {
	jawOpen: {
		floor: .03,
		range: .1,
		ceil: .5
	},
	mouthLowerDownLeft: {
		floor: .22,
		range: .3,
		ceil: .15
	},
	mouthLowerDownRight: {
		floor: .22,
		range: .3,
		ceil: .15
	},
	mouthUpperUpLeft: {
		floor: .1,
		range: .18,
		ceil: .2
	},
	mouthUpperUpRight: {
		floor: .1,
		range: .18,
		ceil: .2
	},
	mouthPucker: {
		floor: .03,
		range: .1,
		ceil: .4
	},
	mouthFunnel: {
		floor: 0,
		range: .02,
		ceil: .3
	},
	mouthStretchLeft: {
		floor: .03,
		range: .09,
		ceil: .35
	},
	mouthStretchRight: {
		floor: .03,
		range: .09,
		ceil: .35
	},
	mouthSmileLeft: {
		floor: 0,
		range: .3,
		ceil: .45
	},
	mouthSmileRight: {
		floor: 0,
		range: .3,
		ceil: .45
	},
	mouthDimpleLeft: {
		floor: .02,
		range: .1,
		ceil: .25
	},
	mouthDimpleRight: {
		floor: .02,
		range: .1,
		ceil: .25
	},
	mouthClose: {
		floor: .02,
		range: .07,
		ceil: .3
	},
	mouthPressLeft: {
		floor: .02,
		range: .07,
		ceil: .3
	},
	mouthPressRight: {
		floor: .02,
		range: .07,
		ceil: .3
	},
	mouthRollLower: {
		floor: .02,
		range: .1,
		ceil: .3
	},
	mouthRollUpper: {
		floor: .02,
		range: .1,
		ceil: .3
	},
	mouthShrugLower: {
		floor: .05,
		range: .2,
		ceil: .15
	},
	mouthShrugUpper: {
		floor: .05,
		range: .2,
		ceil: .15
	}
}, Ci = R.filter((e) => e.startsWith("eye")), wi = [
	"browInnerUp",
	"browOuterUpLeft",
	"browOuterUpRight",
	"browDownLeft",
	"browDownRight",
	"cheekSquintLeft",
	"cheekSquintRight",
	"noseSneerLeft",
	"noseSneerRight"
], Ti = R.filter((e) => e.startsWith("mouth") || e.startsWith("jaw") || e === "tongueOut"), Ei = class {
	scale = 1;
	modelFace = {};
	limiterHits = 0;
	smoothed = new Float32Array(R.length);
	jaw = 0;
	swallowAt = 12;
	swallowPhase = -1;
	jawMax;
	jawGain;
	constructor(e = {}) {
		this.jawMax = e.jawMax ?? .42, this.jawGain = e.jawGain ?? 3.5;
	}
	apply(e, t, n, r, i, a) {
		t.arkit ? this.fromNeural(e, t.arkit, n) : this.fromVisemes(e, t, n), this.swallow(e, n, r, i), a && (e.mouthPressLeft = Math.max(e.mouthPressLeft, .12), e.mouthPressRight = Math.max(e.mouthPressRight, .12), e.mouthPucker = Math.max(e.mouthPucker, .08));
	}
	limit(e, t) {
		let n = .12;
		for (let r of Ti) {
			let i = e[r] ?? 0, a = this.spring[r] ?? (this.spring[r] = {
				x: i,
				v: 0
			}), o = 1600 * (i - a.x) - 80 * a.v;
			a.v += o * t;
			let s = a.v * t;
			Math.abs(s) > n && (s = Math.sign(s) * n, a.v = s / t, this.limiterHits++), a.x += s, e[r] = a.x;
		}
	}
	spring = {};
	fromNeural(e, t, n) {
		let r = 1 - Math.exp(-22 * n);
		for (let n = 0; n < R.length; n++) {
			let i = R[n], a = Si[i], o = t[n];
			a && (o = Math.min(.6, a.ceil * this.scale) * B((o - a.floor) / a.range)), this.smoothed[n] += (o - this.smoothed[n]) * r, e[i] = this.smoothed[n];
		}
		for (let t of Ci) e[t] = 0;
		for (let t of wi) this.modelFace[t] = e[t];
		e.mouthSmileLeft = Math.max(e.mouthSmileLeft, .15), e.mouthSmileRight = Math.max(e.mouthSmileRight, .15);
	}
	vis = {
		aa: 0,
		E: 0,
		I: 0,
		O: 0,
		U: 0,
		cons: 0,
		shut: 0,
		teeth: 0,
		PP: 0,
		FF: 0,
		RR: 0,
		CH: 0,
		SS: 0,
		consTotal: 0
	};
	fromVisemes(e, t, n) {
		let r = t.visemes, i = this.scale, a = this.vis, o = 1 - Math.exp(-22 * n), s = (e, t) => (a[e] += (t - a[e]) * o, a[e]), c = s("aa", r[I.aa]), l = s("E", r[I.E]), u = s("I", r[I.I]), d = s("O", r[I.O]), f = s("U", r[I.U]), p = s("cons", Math.max(r[I.TH], r[I.DD], r[I.kk], r[I.CH], r[I.SS], r[I.nn], r[I.RR])), m = s("shut", Math.max(r[I.PP], r[I.FF])), h = s("teeth", Math.max(r[I.SS], r[I.FF], r[I.TH], r[I.DD], r[I.nn], r[I.CH])), g = s("PP", r[I.PP]), _ = s("FF", r[I.FF]), v = s("RR", r[I.RR]), y = s("CH", r[I.CH]), b = s("SS", r[I.SS]), x = s("consTotal", r[I.TH] + r[I.DD] + r[I.kk] + r[I.CH] + r[I.SS] + r[I.nn] + r[I.RR] + r[I.PP] + r[I.FF]), S = B((c + .7 * d + .5 * l + .35 * u + .25 * f + .12 * p) * (1 - m) * (1 - .6 * B(x))), C = Math.min(.6, this.jawMax * i) * (1 - Math.exp(-this.jawGain * S)) * (.5 + .5 * t.energy);
		this.jaw += (C - this.jaw) * o, e.jawOpen = this.jaw + .02;
		let w = B(1.1 * f + .9 * d + .5 * v + .4 * y);
		e.mouthFunnel = .6 * w * i, e.mouthPucker = (.7 * f + .3 * d) * i;
		let T = B(1 * u + .8 * l + .5 * b);
		e.mouthStretchLeft = e.mouthStretchRight = (.45 * T + .25 * S) * i, e.mouthSmileLeft = e.mouthSmileRight = .2 + .25 * T * (1 - w), e.mouthDimpleLeft = e.mouthDimpleRight = .2 * T, e.mouthUpperUpLeft = e.mouthUpperUpRight = .3 * h + .15 * l, e.mouthLowerDownLeft = e.mouthLowerDownRight = .15 * h + .1 * c, e.mouthPressLeft = e.mouthPressRight = .6 * m, e.mouthClose = .4 * g, e.mouthRollLower = .3 * _, e.mouthRollUpper = .15 * _;
	}
	swallow(e, t, n, r) {
		if (this.swallowPhase < 0 && n >= this.swallowAt && r && (this.swallowPhase = 0), this.swallowPhase < 0) return;
		this.swallowPhase += t;
		let i = this.swallowPhase, a = i < .25 ? i / .25 : i < .7 ? 1 - (i - .25) / .45 : 0;
		e.mouthPressLeft = Math.max(e.mouthPressLeft ?? 0, .25 * a), e.mouthPressRight = Math.max(e.mouthPressRight ?? 0, .25 * a), e.mouthRollLower = Math.max(e.mouthRollLower ?? 0, .15 * a), e.jawForward = .08 * a, i >= .7 && (this.swallowPhase = -1, this.swallowAt = n + 15 + Math.random() * 15);
	}
}, Di = Math.PI / 180, Oi = class {
	contactMix = 0;
	gaze = {
		x: 0,
		y: 0,
		tx: 0,
		ty: 0,
		nextAt: 1.5
	};
	userSmile = 0;
	blinkAt = 2;
	blinkPhase = -1;
	blinkDepth = 1;
	blinkDouble = !1;
	greetAt = -10;
	breathAt = -10;
	contact = {
		x: 0,
		y: 0,
		tx: 0,
		ty: 0,
		nextAt: 0
	};
	phase = Array.from({ length: 8 }, () => Math.random() * Math.PI * 2);
	blink() {
		this.blinkPhase < 0 && this.t - this.lastBlinkEnd > 1 && (this.blinkPhase = 0);
	}
	t = 0;
	lastBlinkEnd = -10;
	greet(e) {
		this.greetAt = e, this.blink();
	}
	breath(e) {
		this.breathAt = e;
	}
	glance(e, t, n) {
		this.gaze.tx = e, this.gaze.ty = t, this.gaze.nextAt = n + 1.2 + Math.random();
	}
	apply(e, t, n, r, i, a, o, s, c, l) {
		let u = this.phase;
		this.t = n;
		let d = (e, t) => Math.sin(n * t + u[e]);
		this.blinkPhase < 0 && n >= this.blinkAt && (this.blinkPhase = 0, this.blinkDepth = Math.random() < .125 ? .55 + Math.random() * .3 : 1, this.blinkDouble = Math.random() < .08);
		let f = 0;
		if (this.blinkPhase >= 0) {
			this.blinkPhase += t;
			let e = this.blinkPhase, i = (e) => e * e * (3 - 2 * e);
			if (e < .12) f = i(e / .12);
			else if (e < .32) f = 1 - i((e - .12) / .2);
			else if (this.blinkDouble) this.blinkDouble = !1, this.blinkPhase = 0, this.blinkDepth = 1;
			else {
				this.blinkPhase = -1, this.lastBlinkEnd = n;
				let e = r === "thinking" ? 2.2 : r === "listening" ? 3.5 : 3;
				this.blinkAt = n + e + Math.random() * 3.5;
			}
			f *= this.blinkDepth;
		}
		let p = Math.max(0, -this.gaze.y) * .15;
		e.eyeBlinkLeft = e.eyeBlinkRight = B(f + p);
		let m = this.gaze, h = (e, t) => Math.max(-t, Math.min(t, e)), g = i ? {
			x: h(i.x * 1.4, .6),
			y: h(i.y * .9, .4)
		} : null;
		if (n >= m.nextAt) {
			let e = r === "thinking" ? .45 : r === "listening" ? .08 : .18;
			m.tx = (g?.x ?? 0) + (Math.random() - .5) * 2 * e * (r === "thinking" ? 1.4 : 1), m.ty = r === "thinking" ? .25 + Math.random() * .25 : (g?.y ?? 0) + (Math.random() - .5) * e, m.nextAt = n + (r === "thinking" ? 2 + Math.random() * 3 : 1 + Math.random() * 3), Math.abs(m.tx) + Math.abs(m.ty) > .3 && this.blink();
		}
		m.x += (m.tx - m.x) * (1 - Math.exp(-35 * t)), m.y += (m.ty - m.y) * (1 - Math.exp(-35 * t));
		let _ = m.x - a / (25 * Di) + d(0, .37) * .03, v = m.y + o / (20 * Di) + d(1, .29) * .02, y = this.contact;
		n >= y.nextAt && (y.tx = (Math.random() - .5) * .06, y.ty = (Math.random() - .5) * .03, y.nextAt = n + 1 + Math.random() * 2), y.x += (y.tx - y.x) * (1 - Math.exp(-15 * t)), y.y += (y.ty - y.y) * (1 - Math.exp(-15 * t));
		let b = i ? (i.x * 30 * Di - a) / (25 * Di) + y.x : _, x = i ? (i.y * 22 * Di - o) / (20 * Di) + y.y : v, S = i && r !== "thinking" ? 1 : 0;
		this.contactMix += (S - this.contactMix) * (1 - Math.exp(-3 * t));
		let C = _ + (b - _) * this.contactMix, w = v + (x - v) * this.contactMix;
		C = h(C, .8), w = h(w, .6);
		let T = r === "thinking" ? .02 : .05 + (i ? i.near * .06 : 0);
		e.eyeLookOutLeft = Math.max(0, -C - T), e.eyeLookInLeft = Math.max(0, C + T), e.eyeLookInRight = Math.max(0, -C + T), e.eyeLookOutRight = Math.max(0, C - T), e.eyeLookUpLeft = e.eyeLookUpRight = Math.max(0, w), e.eyeLookDownLeft = e.eyeLookDownRight = Math.max(0, -w);
		let E = r === "listening" ? .18 : r === "thinking" ? .22 : .06, D = c, O = l, k = Math.max(0, 1 - (n - this.breathAt) / .5) * .15;
		e.browInnerUp = B(E + k + .06 * d(2, .23) + .15 * s + O * (D.browInnerUp ?? 0)), e.browOuterUpLeft = B(.03 + k * .6 + .05 * d(3, .19) + .1 * s + O * (D.browOuterUpLeft ?? 0)), e.browOuterUpRight = B(.03 + k * .6 + .05 * d(4, .17) + .1 * s + O * (D.browOuterUpRight ?? 0)), e.browDownLeft = B((r === "thinking" ? .12 + .05 * d(5, .31) : 0) + O * (D.browDownLeft ?? 0)), e.browDownRight = B((r === "thinking" ? .12 + .05 * d(5, .31) : 0) + O * (D.browDownRight ?? 0)), e.eyeSquintLeft = e.eyeSquintRight = B(.03 + .03 * d(6, .27)), e.eyeWideLeft = e.eyeWideRight = r === "listening" ? B(.08 + .04 * d(5, .17)) : 0, e.cheekSquintLeft = B(.03 + .03 * d(7, .21) + O * (D.cheekSquintLeft ?? 0)), e.cheekSquintRight = B(.03 + .03 * d(7, .21) + O * (D.cheekSquintRight ?? 0));
		let A = Math.max(0, 1 - (n - this.greetAt) / .6), j = A < .5 ? A * 2 : (1 - A) * 2;
		e.browInnerUp = B(e.browInnerUp + .3 * j), e.browOuterUpLeft = B(e.browOuterUpLeft + .3 * j), e.browOuterUpRight = B(e.browOuterUpRight + .3 * j);
		let M = i ? i.smile * .6 + i.near * .1 : 0;
		this.userSmile += (M - this.userSmile) * (1 - Math.exp(-3 * t));
		let ee = (r === "listening" ? .3 : r === "thinking" ? .08 : .2) + this.userSmile;
		e.mouthSmileLeft = Math.max(e.mouthSmileLeft, ee + .03 * d(2, .13)), e.mouthSmileRight = Math.max(e.mouthSmileRight, ee + .03 * d(3, .11));
	}
}, Q = Math.PI / 180, ki = (e, t, n, r, i) => {
	let a = r * r * (n - e) - 2 * r * t;
	return t += a * i, e += t * i, [e, t];
}, Ai = class {
	yaw = 0;
	pitch = 0;
	lastPose = null;
	h = {
		pitch: 0,
		yaw: 0,
		roll: 0,
		vp: 0,
		vy: 0,
		vr: 0,
		tp: 0,
		ty: 0,
		tr: 0,
		nextShiftAt: 2
	};
	beat = {
		pitch: 0,
		yaw: 0,
		vp: 0,
		vy: 0
	};
	nodNextAt = 3;
	lastBeatAt = -10;
	speechLean = 0;
	prevState = "idle";
	phase = Array.from({ length: 8 }, () => Math.random() * Math.PI * 2);
	onGlance = null;
	speechBeat(e) {
		e - this.lastBeatAt < .6 || (this.lastBeatAt = e, this.beat.vp += .4 + Math.random() * .3, this.beat.vy += (Math.random() - .5) * .4);
	}
	breath() {
		this.beat.vp -= .9;
	}
	pose(e, t, n, r, i, a, o, s) {
		let c = this.phase, l = this.h, u = 0, d = 0, f = 0, p = 5 - 2 * a, m = 5;
		if (r === "listening" && (u = 2.5 * Q, f = 2.5 * Q, p = 2, m = 6), r === "thinking" && (u = -2 * Q, d = 5 * Q, f = 6 * Q, p = 3, m = 4), (r === "speaking" || o > .5) && (p = 4, m = 3.5), r !== this.prevState && (this.prevState = r, l.nextShiftAt = n + .2), n >= l.nextShiftAt && (l.tp = u + (Math.random() - .5) * p * .5 * Q, l.ty = d + (Math.random() - .5) * p * Q, l.tr = f + (Math.random() - .5) * p * .6 * Q, l.nextShiftAt = n + m * (.6 + Math.random() * .9), r === "thinking" && Math.random() < .3 && (l.ty += 6 * Q * (Math.random() < .5 ? -1 : 1)), (r === "idle" || r === "active") && Math.random() < .18 && a < .5)) {
			let e = Math.random() < .5 ? -1 : 1;
			l.ty += e * (4 + Math.random() * 3) * Q, l.tr -= e * 1.5 * Q, this.onGlance?.(e * .35, (Math.random() - .3) * .15, n);
		}
		[l.pitch, l.vp] = ki(l.pitch, l.vp, l.tp, 1.5, t), [l.yaw, l.vy] = ki(l.yaw, l.vy, l.ty, 1.3, t), [l.roll, l.vr] = ki(l.roll, l.vr, l.tr, 1.2, t);
		let h = this.beat;
		r === "listening" && n >= this.nodNextAt && (h.vp += 1.6, this.nodNextAt = n + 2.5 + Math.random() * 4, setTimeout(() => {
			h.vp += 1.2;
		}, 260)), [h.pitch, h.vp] = ki(h.pitch, h.vp, 0, 7, t), [h.yaw, h.vy] = ki(h.yaw, h.vy, 0, 6, t);
		let g = 14 + 6 * o, _ = (.5 - .5 * Math.cos(n * 2 * Math.PI * g / 60 + c[0])) * -.5 * Q, v = Math.sin(n * 2 * Math.PI * .07 + c[5]) * 1.6 * Q, y = Math.sin(n * 2 * Math.PI * .05 + c[6]) * 1.1 * Q, b = (Math.sin(n * .9 + c[1]) + Math.sin(n * 1.7 + c[2]) * .5) * .18 * Q, x = (Math.sin(n * .7 + c[3]) + Math.sin(n * 1.3 + c[4]) * .5) * .25 * Q, S = Math.sin(n * .5 + c[5]) * .2 * Q;
		this.speechLean += (o * .4 * Q - this.speechLean) * (1 - Math.exp(-2 * t));
		let C = this.speechLean, w = (e, t) => Math.max(-t, Math.min(t, e)), T = i ? w(i.x * 22, 12) * Q * a : 0, E = i ? w(i.y * 10, 6) * Q * a : 0, D = l.pitch + h.pitch * Q + _ + b + C + E, O = l.yaw + h.yaw * Q + x * (1 + o) + v + T, k = l.roll + S + y;
		this.yaw = O, this.pitch = D;
		let A = e.length, j = A === 1 ? [1] : A === 2 ? [.4, .6] : A === 3 ? [
			.25,
			.3,
			.45
		] : [
			.2,
			.25,
			.25,
			.3
		], M = {};
		return e.forEach((e, t) => {
			M[e] = [
				D * j[t],
				O * j[t],
				k * j[t]
			];
		}), this.lastPose = M, M;
	}
}, ji = {
	neutral: {},
	warm: {
		mouthSmileLeft: .35,
		mouthSmileRight: .35,
		cheekSquintLeft: .2,
		cheekSquintRight: .2,
		eyeSquintLeft: .1,
		eyeSquintRight: .1,
		mouthDimpleLeft: .15,
		mouthDimpleRight: .15
	},
	amused: {
		mouthSmileLeft: .5,
		mouthSmileRight: .45,
		cheekSquintLeft: .3,
		cheekSquintRight: .3,
		eyeSquintLeft: .2,
		eyeSquintRight: .2,
		browOuterUpLeft: .15,
		browInnerUp: .1,
		mouthDimpleLeft: .2,
		mouthDimpleRight: .2
	},
	concerned: {
		browInnerUp: .45,
		browDownLeft: .2,
		browDownRight: .2,
		mouthFrownLeft: .15,
		mouthFrownRight: .15,
		mouthPressLeft: .1,
		mouthPressRight: .1,
		mouthSmileLeft: -.15,
		mouthSmileRight: -.15
	},
	surprised: {
		browInnerUp: .5,
		browOuterUpLeft: .45,
		browOuterUpRight: .45,
		eyeWideLeft: .35,
		eyeWideRight: .35,
		jawOpen: .06
	},
	thoughtful: {
		browDownLeft: .25,
		browDownRight: .25,
		browInnerUp: .15,
		mouthPressLeft: .08,
		mouthPressRight: .08,
		eyeSquintLeft: .08,
		eyeSquintRight: .08
	}
}, Mi = class {
	target = {};
	current = {};
	set(e, t = 1) {
		let n = B(t);
		this.target = Object.fromEntries(Object.entries(ji[e] ?? {}).map(([e, t]) => [e, t * n]));
	}
	setMix(e) {
		let t = {};
		for (let [n, r] of Object.entries(e)) if (r) for (let [e, i] of Object.entries(ji[n] ?? {})) t[e] = (t[e] ?? 0) + i * B(r);
		this.target = t;
	}
	apply(e, t) {
		let n = 1 - Math.exp(-8 * t), r = this.current, i = /* @__PURE__ */ new Set([...Object.keys(r), ...Object.keys(this.target)]);
		for (let t of i) {
			let i = this.target[t] ?? 0;
			r[t] = (r[t] ?? 0) + (i - (r[t] ?? 0)) * n, Math.abs(r[t]) < .001 && i === 0 ? delete r[t] : e[t] = B((e[t] ?? 0) + r[t]);
		}
	}
}, Ni = class {
	weights = {
		mouthSmileLeft: .2,
		mouthSmileRight: .2,
		jawOpen: .02
	};
	mouth;
	eyes = new Oi();
	head = new Ai();
	emotion = new Mi();
	modelFaceMix = .6;
	level = 4;
	state = "idle";
	elapsed = 0;
	speechEnv = 0;
	lastEnergy = 0;
	viewer = null;
	facingState = !1;
	engaged = !1;
	disengagedAt = -10;
	lastGreetAt = -10;
	lastPoseT = 0;
	constructor(e = {}) {
		this.mouth = new Ei(e), this.head.onGlance = (e, t, n) => this.eyes.glance(e, t, n);
	}
	get t() {
		return this.elapsed;
	}
	setState(e) {
		let t = this.state;
		this.state = e, t !== e && (t === "speaking" && this.eyes.blink(), e === "speaking" && (this.head.breath(), this.eyes.breath(this.elapsed)));
	}
	setEmotion(e, t = 1) {
		this.emotion.set(e, t);
	}
	setEmotionMix(e) {
		this.emotion.setMix(e);
	}
	setViewer(e) {
		let t = this.elapsed, n = !!e && (e.present || e.absentFor < .5);
		n && e ? e.facing > .6 ? this.facingState = !0 : e.facing < .3 && (this.facingState = !1) : this.facingState = !1;
		let r = n && this.facingState;
		r ? !this.engaged && t - this.disengagedAt > 1.5 && t - this.lastGreetAt > 6 && (this.lastGreetAt = t, this.eyes.greet(t)) : this.engaged && (this.disengagedAt = t), this.engaged = r, this.viewer = n ? e : null;
	}
	frame(e, t) {
		this.elapsed += t;
		let n = this.elapsed, r = this.weights, i = this.state;
		this.speechEnv += (+!!e.speaking - this.speechEnv) * (1 - Math.exp(-4 * t));
		let a = e.energy - this.lastEnergy > .28;
		if (this.lastEnergy = e.energy, e.speaking && a && Math.random() < .35 && this.head.speechBeat(n), this.mouth.apply(r, e, t, n, this.speechEnv < .3, i === "thinking"), this.level >= 1) this.eyes.apply(r, t, n, i, this.viewer, this.head.yaw, this.head.pitch, this.speechEnv, this.mouth.modelFace, this.modelFaceMix);
		else for (let e of Object.keys(r)) /^eye|^brow|^cheek|^nose/.test(e) && (r[e] = 0);
		(this.level === 3 || this.level === 4) && this.emotion.apply(r, t), this.mouth.limit(r, t);
	}
	neckPose(e) {
		let t = performance.now(), n = this.lastPoseT ? Math.min(.05, (t - this.lastPoseT) / 1e3) : .016;
		if (this.lastPoseT = t, this.level < 2 || this.level === 3) {
			let t = {};
			for (let n of e) t[n] = [
				0,
				0,
				0
			];
			return this.head.lastPose = t, t;
		}
		return this.head.pose(e, n, this.elapsed, this.state, this.viewer, this.eyes.contactMix, this.speechEnv, this.weights.jawOpen ?? 0);
	}
	snapshot() {
		let e = {};
		for (let t of R) e["bs." + t] = this.weights[t] ?? 0;
		let t = this.head.lastPose;
		if (t) for (let n in t) e["bone." + n + ".pitch"] = t[n][0], e["bone." + n + ".yaw"] = t[n][1], e["bone." + n + ".roll"] = t[n][2];
		return e["in.contactMix"] = this.eyes.contactMix, e["in.speechEnv"] = this.speechEnv, e["sys.limiterHits"] = this.mouth.limiterHits, this.viewer && (e["in.viewer.x"] = this.viewer.x, e["in.viewer.y"] = this.viewer.y, e["in.viewer.present"] = +!!this.viewer.present), e;
	}
}, Pi = {
	idle: "Idle",
	active: "Idle",
	listening: "Listening",
	speaking: "Idle",
	thinking: "Thinking"
};
async function Fi(e, t) {
	let n = HTMLCanvasElement.prototype, r = n.getContext;
	n.getContext = function(t, n) {
		if (!t.startsWith("webgl") || !e.contains(this)) return r.call(this, t, n);
		let i = r.call(this, t, {
			...n,
			alpha: !0,
			premultipliedAlpha: !0
		});
		if (i) {
			let e = i.clearColor.bind(i);
			i.clearColor = () => e(0, 0, 0, 0);
		}
		return i;
	};
	try {
		return await t();
	} finally {
		n.getContext = r;
	}
}
var Ii = class {
	name = "splat";
	updateMs = 0;
	life;
	host = null;
	light = null;
	renderer = null;
	mod = null;
	resizeObs = null;
	bones = void 0;
	avatarUrl = "";
	opts;
	constructor(e = {}) {
		this.opts = {
			backgroundColor: e.backgroundColor ?? "",
			frameBust: e.frameBust ?? !0,
			bust: e.bust ?? {
				centerY: .47,
				height: .44
			},
			finish: e.finish ?? !0,
			pixelRatioCap: e.pixelRatioCap ?? 1.5
		}, this.life = new Ni({
			jawMax: e.jawMax,
			jawGain: e.jawGain
		});
	}
	get weights() {
		return this.life.weights;
	}
	get mouthScale() {
		return this.life.mouth.scale;
	}
	set mouthScale(e) {
		this.life.mouth.scale = e;
	}
	mount(e) {
		let t = e.parentElement ?? document.body;
		getComputedStyle(t).position === "static" && (t.style.position = "relative"), e.style.display = "none";
		let n = document.createElement("div");
		n.style.cssText = "position:absolute;inset:0;overflow:hidden;", t.appendChild(n), this.host = n, this.opts.finish && this.addFinish(t, n);
	}
	addFinish(e, t) {
		if (!document.getElementById("avatarz-finish")) {
			let e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			e.id = "avatarz-finish", e.setAttribute("style", "position:absolute;width:0;height:0"), e.innerHTML = "<filter id=\"avatarz-sharpen\" color-interpolation-filters=\"sRGB\"><feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"1.2\" result=\"b\"/><feComposite in=\"SourceGraphic\" in2=\"b\" operator=\"arithmetic\" k1=\"0\" k2=\"1.55\" k3=\"-0.55\" k4=\"0\"/></filter>", document.body.appendChild(e);
		}
		t.style.filter = "url(#avatarz-sharpen) contrast(1.06) saturate(1.04)";
		let n = document.createElement("div");
		n.style.cssText = "position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;background: radial-gradient(ellipse 55% 50% at 38% 30%, rgba(255,246,230,0.55) 0%, rgba(255,246,230,0.0) 70%),radial-gradient(ellipse 80% 80% at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%);", e.appendChild(n), this.light = n;
	}
	async setAvatar(e) {
		if (!this.host) throw Error("avatarz: splat renderer not mounted");
		this.mod ??= await import("./gsplat-flame-avatar-renderer.esm.min-BjeZ5NKw.js");
		let { GaussianSplatRenderer: t } = this.mod;
		this.renderer?.dispose(), this.renderer = null, t.instance = void 0, this.avatarUrl = e, this.bones = void 0;
		let n = () => t.getInstance(this.host, e, {
			getChatState: () => Pi[this.life.state],
			getExpressionData: () => this.life.weights,
			getNeckPose: () => this.neckPose(),
			backgroundColor: this.opts.backgroundColor || void 0
		});
		this.renderer = this.opts.backgroundColor ? await n() : await Fi(this.host, n), this.opts.frameBust && this.frameBust(), this.applyPixelRatio(), this.resizeObs?.disconnect(), this.resizeObs = new ResizeObserver(() => setTimeout(() => this.applyPixelRatio(), 50)), this.resizeObs.observe(this.host);
	}
	neckPose() {
		if (this.bones === void 0) {
			let e = this.renderer?._getOverridableBones?.();
			if (!e) return null;
			let t = [
				"neckLower",
				"neckUpper",
				"neck",
				"head"
			].filter((t) => t in e);
			this.bones = t.length ? t : null;
		}
		return this.bones ? this.life.neckPose(this.bones) : null;
	}
	applyPixelRatio() {
		let e = this.renderer?.viewer?.renderer;
		if (!e) return;
		let t = Math.min(window.devicePixelRatio || 1, this.opts.pixelRatioCap);
		Math.abs(e.getPixelRatio() - t) > .01 && e.setPixelRatio(t);
	}
	frameBust() {
		let e = this.renderer?.viewer?.camera;
		if (!e?.isPerspectiveCamera) return;
		let { centerY: t, height: n } = this.opts.bust, r = 1 / n, i = e.aspect;
		e.setViewOffset(i * r, r, (i * r - i) / 2, t * r - .5, i, 1);
	}
	getAvatarMeta() {
		return {
			name: this.avatarUrl.split("/").pop()?.replace(/\.zip$/, ""),
			version: "gsplat",
			expressions: [
				"aa",
				"ih",
				"ou",
				"ee",
				"oh",
				"blink"
			]
		};
	}
	snapshot() {
		return this.life.snapshot();
	}
	setState(e) {
		this.life.setState(e);
	}
	setEmotion(e, t = 1) {
		this.life.setEmotion(e, t);
	}
	setEmotionMix(e) {
		this.life.setEmotionMix(e);
	}
	setAttention(e) {
		this.life.setViewer(e);
	}
	frame(e, t) {
		let n = performance.now();
		this.life.frame(e, t), this.updateMs = performance.now() - n;
	}
	dispose() {
		this.resizeObs?.disconnect(), this.resizeObs = null, this.renderer?.dispose(), this.renderer = null, this.mod && (this.mod.GaussianSplatRenderer.instance = void 0), this.host?.remove(), this.host = null, this.light?.remove(), this.light = null;
	}
}, Li = (function() {
	var e = "b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb", t = "b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb", n = new Uint8Array([
		0,
		97,
		115,
		109,
		1,
		0,
		0,
		0,
		1,
		4,
		1,
		96,
		0,
		0,
		3,
		3,
		2,
		0,
		0,
		5,
		3,
		1,
		0,
		1,
		12,
		1,
		0,
		10,
		22,
		2,
		12,
		0,
		65,
		0,
		65,
		0,
		65,
		0,
		252,
		10,
		0,
		0,
		11,
		7,
		0,
		65,
		0,
		253,
		15,
		26,
		11
	]), r = new Uint8Array([
		32,
		0,
		65,
		2,
		1,
		106,
		34,
		33,
		3,
		128,
		11,
		4,
		13,
		64,
		6,
		253,
		10,
		7,
		15,
		116,
		127,
		5,
		8,
		12,
		40,
		16,
		19,
		54,
		20,
		9,
		27,
		255,
		113,
		17,
		42,
		67,
		24,
		23,
		146,
		148,
		18,
		14,
		22,
		45,
		70,
		69,
		56,
		114,
		101,
		21,
		25,
		63,
		75,
		136,
		108,
		28,
		118,
		29,
		73,
		115
	]);
	if (typeof WebAssembly != "object") return { supported: !1 };
	var i = WebAssembly.validate(n) ? s(t) : s(e), a, o = WebAssembly.instantiate(i, {}).then(function(e) {
		a = e.instance, a.exports.__wasm_call_ctors();
	});
	function s(e) {
		for (var t = new Uint8Array(e.length), n = 0; n < e.length; ++n) {
			var i = e.charCodeAt(n);
			t[n] = i > 96 ? i - 97 : i > 64 ? i - 39 : i + 4;
		}
		for (var a = 0, n = 0; n < e.length; ++n) t[a++] = t[n] < 60 ? r[t[n]] : (t[n] - 60) * 64 + t[++n];
		return t.buffer.slice(0, a);
	}
	function c(e, t, n, r, i, a, o) {
		var s = e.exports.sbrk, c = r + 3 & -4, l = s(c * i), u = s(a.length), d = new Uint8Array(e.exports.memory.buffer);
		d.set(a, u);
		var f = t(l, r, i, u, a.length);
		if (f == 0 && o && o(l, c, i), n.set(d.subarray(l, l + r * i)), s(l - s(0)), f != 0) throw Error("Malformed buffer data: " + f);
	}
	var l = {
		NONE: "",
		OCTAHEDRAL: "meshopt_decodeFilterOct",
		QUATERNION: "meshopt_decodeFilterQuat",
		EXPONENTIAL: "meshopt_decodeFilterExp",
		COLOR: "meshopt_decodeFilterColor"
	}, u = {
		ATTRIBUTES: "meshopt_decodeVertexBuffer",
		TRIANGLES: "meshopt_decodeIndexBuffer",
		INDICES: "meshopt_decodeIndexSequence"
	}, d = [], f = 0;
	function p(e) {
		var t = {
			object: new Worker(e),
			pending: 0,
			requests: {}
		};
		return t.object.onmessage = function(e) {
			var n = e.data;
			t.pending -= n.count, t.requests[n.id][n.action](n.value), delete t.requests[n.id];
		}, t;
	}
	function m(e) {
		for (var t = "self.ready = WebAssembly.instantiate(new Uint8Array([" + new Uint8Array(i) + "]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = " + g.name + ";" + c.toString() + g.toString(), n = new Blob([t], { type: "text/javascript" }), r = URL.createObjectURL(n), a = d.length; a < e; ++a) d[a] = p(r);
		for (var a = e; a < d.length; ++a) d[a].object.postMessage({});
		d.length = e, URL.revokeObjectURL(r);
	}
	function h(e, t, n, r, i) {
		for (var a = d[0], o = 1; o < d.length; ++o) d[o].pending < a.pending && (a = d[o]);
		return new Promise(function(o, s) {
			var c = new Uint8Array(n), l = ++f;
			a.pending += e, a.requests[l] = {
				resolve: o,
				reject: s
			}, a.object.postMessage({
				id: l,
				count: e,
				size: t,
				source: c,
				mode: r,
				filter: i
			}, [c.buffer]);
		});
	}
	function g(e) {
		var t = e.data;
		self.ready.then(function(e) {
			if (!t.id) return self.close();
			try {
				var n = new Uint8Array(t.count * t.size);
				c(e, e.exports[t.mode], n, t.count, t.size, t.source, e.exports[t.filter]), self.postMessage({
					id: t.id,
					count: t.count,
					action: "resolve",
					value: n
				}, [n.buffer]);
			} catch (e) {
				self.postMessage({
					id: t.id,
					count: t.count,
					action: "reject",
					value: e
				});
			}
		});
	}
	return {
		ready: o,
		supported: !0,
		useWorkers: function(e) {
			m(e);
		},
		decodeVertexBuffer: function(e, t, n, r, i) {
			c(a, a.exports.meshopt_decodeVertexBuffer, e, t, n, r, a.exports[l[i]]);
		},
		decodeIndexBuffer: function(e, t, n, r) {
			c(a, a.exports.meshopt_decodeIndexBuffer, e, t, n, r);
		},
		decodeIndexSequence: function(e, t, n, r) {
			c(a, a.exports.meshopt_decodeIndexSequence, e, t, n, r);
		},
		decodeGltfBuffer: function(e, t, n, r, i, o) {
			c(a, a.exports[u[i]], e, t, n, r, a.exports[l[o]]);
		},
		decodeGltfBufferAsync: function(e, t, n, r, i) {
			return d.length > 0 ? h(e, t, n, u[r], l[i]) : o.then(function() {
				var o = new Uint8Array(e * t);
				return c(a, a.exports[u[r]], o, e, t, n, a.exports[l[i]]), o;
			});
		}
	};
})(), Ri = class extends j {
	constructor() {
		super(), this.name = "RoomEnvironment", this.position.y = -3.5;
		let e = new D();
		e.deleteAttribute("uv");
		let t = new p({ side: 1 }), r = new p(), i = new h(16777215, 900, 28, 2);
		i.position.set(.418, 16.199, .3), this.add(i);
		let a = new f(e, t);
		a.position.set(-.757, 13.219, .717), a.scale.set(31.713, 28.305, 28.591), this.add(a);
		let o = new s(e, r, 6), c = new n();
		c.position.set(-10.906, 2.009, 1.846), c.rotation.set(0, -.195, 0), c.scale.set(2.328, 7.905, 4.651), c.updateMatrix(), o.setMatrixAt(0, c.matrix), c.position.set(-5.607, -.754, -.758), c.rotation.set(0, .994, 0), c.scale.set(1.97, 1.534, 3.955), c.updateMatrix(), o.setMatrixAt(1, c.matrix), c.position.set(6.167, .857, 7.803), c.rotation.set(0, .561, 0), c.scale.set(3.927, 6.285, 3.687), c.updateMatrix(), o.setMatrixAt(2, c.matrix), c.position.set(-2.017, .018, 6.124), c.rotation.set(0, .333, 0), c.scale.set(2.002, 4.566, 2.064), c.updateMatrix(), o.setMatrixAt(3, c.matrix), c.position.set(2.291, -.756, -2.621), c.rotation.set(0, -.286, 0), c.scale.set(1.546, 1.552, 1.496), c.updateMatrix(), o.setMatrixAt(4, c.matrix), c.position.set(-2.193, -.369, -5.547), c.rotation.set(0, .516, 0), c.scale.set(3.875, 3.487, 2.986), c.updateMatrix(), o.setMatrixAt(5, c.matrix), this.add(o);
		let l = new f(e, zi(50));
		l.position.set(-16.116, 14.37, 8.208), l.scale.set(.1, 2.428, 2.739), this.add(l);
		let u = new f(e, zi(50));
		u.position.set(-16.109, 18.021, -8.207), u.scale.set(.1, 2.425, 2.751), this.add(u);
		let d = new f(e, zi(17));
		d.position.set(14.904, 12.198, -1.832), d.scale.set(.15, 4.265, 6.331), this.add(d);
		let m = new f(e, zi(43));
		m.position.set(-.462, 8.89, 14.52), m.scale.set(4.38, 5.441, .088), this.add(m);
		let g = new f(e, zi(20));
		g.position.set(3.235, 11.486, -12.541), g.scale.set(2.5, 2, .1), this.add(g);
		let _ = new f(e, zi(100));
		_.position.set(0, 20, 0), _.scale.set(1, .1, 1), this.add(_);
	}
	dispose() {
		let e = /* @__PURE__ */ new Set();
		this.traverse((t) => {
			t.isMesh && (e.add(t.geometry), e.add(t.material));
		});
		for (let t of e) t.dispose();
	}
};
function zi(e) {
	return new d({
		color: 0,
		emissive: 16777215,
		emissiveIntensity: e
	});
}
// src/render/glb.ts
var Bi = class {
	name = "glb";
	updateMs = 0;
	life;
	canvas = null;
	renderer = null;
	scene = new j();
	camera = new ee(20, 1, .01, 20);
	pivot = new l();
	model = null;
	morphs = [];
	channels = [];
	loader;
	avatarUrl = "";
	lastW = 0;
	lastH = 0;
	opts;
	constructor(e = {}) {
		this.opts = {
			fov: e.fov ?? 20,
			headFill: e.headFill ?? .55,
			transparent: e.transparent ?? !0,
			background: e.background ?? 0,
			pixelRatioCap: e.pixelRatioCap ?? 2,
			envIntensity: e.envIntensity ?? .6,
			exposure: e.exposure ?? 1
		}, this.life = new Ni({
			jawMax: e.jawMax ?? .55,
			jawGain: e.jawGain
		}), this.loader = new re(), this.loader.setMeshoptDecoder(Li), this.scene.add(this.pivot);
		let t = new g(16773602, 2.2);
		t.position.set(-1, 1.4, 1.6);
		let n = new g(14543103, .6);
		n.position.set(1.4, .4, 1);
		let r = new g(16777215, 1.4);
		r.position.set(.6, 1.2, -1.6), this.scene.add(t, n, r, t.target, n.target, r.target);
	}
	get weights() {
		return this.life.weights;
	}
	get mouthScale() {
		return this.life.mouth.scale;
	}
	set mouthScale(e) {
		this.life.mouth.scale = e;
	}
	mount(e) {
		this.canvas = e;
		let t = new w({
			canvas: e,
			antialias: !0,
			alpha: this.opts.transparent,
			powerPreference: "high-performance"
		});
		t.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.opts.pixelRatioCap)), t.outputColorSpace = _, t.toneMapping = 4, t.toneMappingExposure = this.opts.exposure, this.opts.transparent || t.setClearColor(this.opts.background, 1);
		let n = new k(t);
		this.scene.environment = n.fromScene(new Ri(), .04).texture, this.scene.environmentIntensity = this.opts.envIntensity, n.dispose(), this.renderer = t, this.camera.fov = this.opts.fov, this.resizeIfNeeded(!0);
	}
	async setAvatar(e) {
		if (!this.renderer) throw Error("avatarz: glb renderer not mounted");
		let t = (await this.loader.loadAsync(e)).scene, n = [], r = /* @__PURE__ */ new Set();
		t.traverse((e) => {
			let t = e;
			if (!t.isMesh || (t.frustumCulled = !1, !t.morphTargetDictionary || !t.morphTargetInfluences)) return;
			let i = new Int16Array(R.length).fill(-1);
			R.forEach((e, n) => {
				let a = t.morphTargetDictionary[e];
				a !== void 0 && (i[n] = a, r.add(e));
			}), n.push({
				mesh: t,
				index: i
			});
		}), r.has("jawOpen") || console.warn("avatarz: glb head has no ARKit jawOpen morph; the mouth will not move", e), this.clearModel(), this.morphs = n, this.channels = R.filter((e) => r.has(e)), this.avatarUrl = e, t.updateMatrixWorld(!0);
		let i = new v().setFromObject(t), a = i.getSize(new S()), o = new S((i.min.x + i.max.x) / 2, i.min.y + a.y * .3, i.min.z + a.z * .45);
		this.pivot.position.copy(o), t.position.sub(o), this.pivot.add(t), this.model = t, this.frameCamera(i);
	}
	frameCamera(e) {
		let t = e.getSize(new S()), n = t.y * .55, r = new S((e.min.x + e.max.x) / 2, e.max.y - n * .52, (e.min.z + e.max.z) / 2), i = n / this.opts.headFill / 2 / Math.tan(c.degToRad(this.opts.fov) / 2);
		this.camera.position.set(r.x, r.y + n * .04, r.z + i + t.z * .5), this.camera.near = i * .05, this.camera.far = i * 10, this.camera.lookAt(r), this.camera.updateProjectionMatrix(), this.scene.children.forEach((e) => {
			e.isDirectionalLight && e.target.position.copy(r);
		});
	}
	resizeIfNeeded(e = !1) {
		let t = this.canvas, n = this.renderer;
		if (!t || !n) return;
		let r = t.clientWidth || t.width, i = t.clientHeight || t.height;
		(e || r !== this.lastW || i !== this.lastH) && (this.lastW = r, this.lastH = i, n.setSize(r, i, !1), this.camera.aspect = r / Math.max(1, i), this.camera.updateProjectionMatrix());
	}
	getAvatarMeta() {
		if (!this.model) return null;
		let e = (e) => this.channels.includes(e), t = e("jawOpen") ? [
			"aa",
			"ih",
			"ou",
			"ee",
			"oh"
		] : [];
		return e("eyeBlinkLeft") && e("eyeBlinkRight") && t.push("blink"), {
			name: this.avatarUrl.split("/").pop()?.replace(/\.glb$/i, ""),
			version: `glb · ${this.channels.length}/52 ARKit`,
			expressions: t
		};
	}
	snapshot() {
		return this.life.snapshot();
	}
	setState(e) {
		this.life.setState(e);
	}
	setEmotion(e, t = 1) {
		this.life.setEmotion(e, t);
	}
	setEmotionMix(e) {
		this.life.setEmotionMix(e);
	}
	setAttention(e) {
		this.life.setViewer(e);
	}
	frame(e, t) {
		let n = performance.now(), r = this.renderer;
		if (r) {
			if (this.resizeIfNeeded(), this.life.frame(e, t), this.model) {
				let e = this.life.weights;
				for (let { mesh: t, index: n } of this.morphs) {
					let r = t.morphTargetInfluences;
					for (let t = 0; t < n.length; t++) {
						let i = n[t];
						i >= 0 && (r[i] = e[R[t]] ?? 0);
					}
				}
				let [t, n, r] = this.life.neckPose(["head"]).head;
				this.pivot.rotation.set(t, n, r, "YXZ");
			}
			this.updateMs = performance.now() - n, r.render(this.scene, this.camera);
		}
	}
	clearModel() {
		this.model && (this.pivot.remove(this.model), this.model.traverse((e) => {
			let t = e;
			if (t.isMesh) {
				t.geometry.dispose();
				for (let e of Array.isArray(t.material) ? t.material : [t.material]) {
					for (let t of Object.values(e)) t?.isTexture && t.dispose();
					e.dispose();
				}
			}
		}), this.model = null, this.morphs = []);
	}
	dispose() {
		this.clearModel(), this.scene.environment?.dispose(), this.renderer?.dispose(), this.renderer = null, this.canvas = null;
	}
}, Vi = class {
	analyser = null;
	source = null;
	buf = /* @__PURE__ */ new Float32Array();
	sampleRate = 24e3;
	lastAt = 0;
	f0Hist = [];
	baseline = 0;
	baselineN = 0;
	loudRef = .05;
	peaks = [];
	lastPeakAt = 0;
	envPrev = 0;
	env = 0;
	speakingSince = 0;
	silentSince = 0;
	features = {
		f0Hz: 0,
		f0Rel: 0,
		f0Var: 0,
		f0Slope: 0,
		level: 0,
		rate: 0,
		speaking: !1
	};
	mix = {
		warm: 0,
		amused: 0,
		concerned: 0,
		surprised: 0,
		thoughtful: 0
	};
	target = {
		warm: 0,
		amused: 0,
		concerned: 0,
		surprised: 0,
		thoughtful: 0
	};
	start(e, t) {
		this.stop(), this.analyser = new AnalyserNode(t, {
			fftSize: 2048,
			smoothingTimeConstant: 0
		}), this.buf = /* @__PURE__ */ new Float32Array(2048), this.sampleRate = t.sampleRate, e.connect(this.analyser), this.source = e;
	}
	stop() {
		if (this.source && this.analyser) try {
			this.source.disconnect(this.analyser);
		} catch {}
		this.analyser = null, this.source = null;
	}
	reset() {
		this.f0Hist.length = 0, this.peaks.length = 0;
		for (let e of Object.keys(this.target)) this.target[e] = 0;
	}
	pitch(e, t) {
		if (t < .01) return 0;
		let n = this.sampleRate, r = Math.floor(n / 400), i = Math.min(e.length - 1, Math.ceil(n / 70)), a = e.length, o = 0;
		for (let t = 0; t < a; t++) o += e[t] * e[t];
		if (o <= 0) return 0;
		let s = 0, c = 0;
		for (let t = r; t <= i; t += 2) {
			let n = 0;
			for (let r = 0; r + t < a; r += 2) n += e[r] * e[r + t];
			let r = n / o * 2;
			r > s && (s = r, c = t);
		}
		if (s < .35) return 0;
		let l = c, u = -1;
		for (let t = Math.max(r, c - 2); t <= Math.min(i, c + 2); t++) {
			let n = 0;
			for (let r = 0; r + t < a; r++) n += e[r] * e[r + t];
			n > u && (u = n, l = t);
		}
		return n / l;
	}
	update(e, t) {
		let n = this.analyser, r = this.features;
		if (n && e - this.lastAt >= 40) {
			this.lastAt = e, n.getFloatTimeDomainData(this.buf);
			let t = this.buf, i = 0;
			for (let e = 0; e < t.length; e++) i += t[e] * t[e];
			let a = Math.sqrt(i / t.length), o = a > .012;
			for (r.speaking = o, o ? (this.speakingSince ||= e, this.silentSince = 0) : (this.silentSince ||= e, this.speakingSince = 0), o && (this.loudRef += (Math.max(a, this.loudRef * .9) - this.loudRef) * .05), r.level = this.loudRef > 0 ? a / this.loudRef : 0, this.envPrev = this.env, this.env += (a - this.env) * .5, o && this.env > this.envPrev * 1.15 && e - this.lastPeakAt > 120 && this.env > this.loudRef * .35 && (this.peaks.push(e), this.lastPeakAt = e); this.peaks.length && e - this.peaks[0] > 2e3;) this.peaks.shift();
			r.rate = this.peaks.length / 2;
			let s = this.pitch(t, a);
			if (r.f0Hz = s, s > 0) {
				let t = 12 * Math.log2(s / 100);
				for (this.baselineN < 50 ? this.baseline += (t - this.baseline) / ++this.baselineN : this.baseline += (t - this.baseline) * .01, this.f0Hist.push({
					t: e,
					st: t
				}); this.f0Hist.length && e - this.f0Hist[0].t > 2e3;) this.f0Hist.shift();
			}
			let c = this.f0Hist;
			if (c.length >= 4) {
				let e = 0;
				for (let t of c) e += t.st;
				e /= c.length;
				let t = 0;
				for (let n of c) t += (n.st - e) * (n.st - e);
				t = Math.sqrt(t / c.length);
				let n = c.slice(-6), i = n.length >= 2 ? (n[n.length - 1].st - n[0].st) / Math.max(.05, (n[n.length - 1].t - n[0].t) / 1e3) : 0;
				r.f0Rel = e - this.baseline, r.f0Var = t, r.f0Slope = i;
			}
			let l = this.target, u = $((r.f0Var - 1.2) / 2.5) * .6 + $((r.rate - 3) / 3) * .4, d = $(r.f0Rel / 3), f = $(-r.f0Rel / 3), p = $((1.2 - r.f0Var) / 1.2), m = $((.6 - r.level) / .4), h = $((2.5 - r.rate) / 2.5);
			o ? (l.amused = .55 * u * (.5 + .5 * d), l.warm = .5 * $(.6 * (1 - p) + .4 * (1 - m)) * (1 - u * .5), l.concerned = .5 * f * p * (.5 + .5 * m), l.thoughtful = .3 * h * p * (1 - f * .5), l.surprised = $((r.f0Slope - 22) / 20) * $((r.level - 1.1) / .5) * .35) : this.silentSince && e - this.silentSince > 1500 && (l.amused *= .9, l.surprised = 0, l.concerned *= .95, l.thoughtful *= .95, l.warm = Math.max(l.warm * .97, .1));
		}
		for (let e of Object.keys(this.mix)) {
			let n = e === "surprised" ? this.target[e] > this.mix[e] ? 6 : 3 : 1.2;
			this.mix[e] += (this.target[e] - this.mix[e]) * (1 - Math.exp(-n * t));
		}
		return this.mix;
	}
}, $ = (e) => e < 0 ? 0 : e > 1 ? 1 : e, Hi = class {
	attention = {
		present: !1,
		x: 0,
		y: 0,
		near: 0,
		facing: 1,
		smile: 0,
		browUp: 0,
		mouthOpen: 0,
		talking: !1,
		absentFor: Infinity
	};
	worker = null;
	video = null;
	stream = null;
	timer = 0;
	inFlight = !1;
	lastSeenAt = 0;
	mouthHist = [];
	raw = {
		x: 0,
		y: 0,
		near: 0,
		facing: 1,
		smile: 0,
		browUp: 0,
		mouthOpen: 0
	};
	opts;
	detectMs = 0;
	constructor(e = {}) {
		this.opts = {
			wasmUrl: e.wasmUrl ?? new URL("./assets/mediapipe/", import.meta.url),
			modelUrl: e.modelUrl ?? new URL("./assets/mediapipe/face_landmarker.task", import.meta.url),
			fps: e.fps ?? 15,
			mirror: e.mirror ?? !0,
			mirrorY: e.mirrorY ?? !0,
			gpu: e.gpu ?? !0
		};
	}
	async start(e) {
		this.stop();
		let t = new Worker(new URL(
			/* @vite-ignore */
			"/assets/webcam.worker-BUwb4Q9D.js",
			"" + import.meta.url
		), { type: "module" });
		await new Promise((e, n) => {
			t.onmessage = (t) => {
				t.data.type === "ready" ? e() : t.data.type === "error" && n(Error(t.data.message));
			}, t.onerror = (e) => n(Error(e.message)), t.postMessage({
				type: "init",
				wasmUrl: this.opts.wasmUrl.toString().replace(/\/?$/, ""),
				modelUrl: this.opts.modelUrl.toString(),
				gpu: this.opts.gpu
			});
		}), t.onmessage = (e) => {
			e.data.type === "reading" && this.onReading(e.data.r, e.data.ms);
		}, this.worker = t, this.stream = e ?? await navigator.mediaDevices.getUserMedia({
			video: {
				width: 640,
				height: 480,
				facingMode: "user"
			},
			audio: !1
		});
		let n = document.createElement("video");
		n.muted = !0, n.playsInline = !0, n.srcObject = this.stream, await n.play(), this.video = n, this.timer = window.setInterval(() => void this.capture(), 1e3 / this.opts.fps);
	}
	stop() {
		this.timer && clearInterval(this.timer), this.timer = 0, this.stream?.getTracks().forEach((e) => e.stop()), this.stream = null, this.video &&= (this.video.pause(), this.video.srcObject = null, null), this.worker?.terminate(), this.worker = null, this.inFlight = !1, this.attention.present = !1, this.attention.absentFor = Infinity;
	}
	async capture() {
		let e = this.video, t = this.worker;
		if (!(!e || !t || e.readyState < 2 || this.inFlight)) {
			this.inFlight = !0;
			try {
				let n = await createImageBitmap(e);
				t.postMessage({
					type: "frame",
					bitmap: n,
					t: performance.now()
				}, [n]);
			} catch {
				this.inFlight = !1;
			}
		}
	}
	onReading(e, t) {
		this.inFlight = !1, this.detectMs += (t - this.detectMs) * .2;
		let n = this.attention, r = this.raw, i = performance.now();
		if (!e) {
			n.present = !1, n.absentFor = (i - this.lastSeenAt) / 1e3, n.talking = !1;
			return;
		}
		this.lastSeenAt = i, n.present = !0, n.absentFor = 0;
		let a = (this.opts.mirror ? -1 : 1) * (e.x - .5) * 2, o = (this.opts.mirrorY ? -1 : 1) * (.5 - e.y) * 2;
		Math.abs(a - r.x) > .015 && (r.x = a), Math.abs(o - r.y) > .015 && (r.y = o), r.near = Math.min(1, Math.max(0, (e.near - .08) / .22)), r.facing = e.facing, r.smile = e.smile, r.browUp = e.browUp, r.mouthOpen = e.mouthOpen, this.mouthHist.push(e.mouthOpen), this.mouthHist.length > 12 && this.mouthHist.shift(), n.talking = this.mouthHist.length >= 6 && Math.max(...this.mouthHist) - Math.min(...this.mouthHist) > .12;
	}
	update(e) {
		let t = this.attention, n = this.raw;
		if (!t.present) return t;
		let r = 1 - Math.exp(-7 * e), i = 1 - Math.exp(-8 * e);
		return t.x += (n.x - t.x) * r, t.y += (n.y - t.y) * r, t.near += (n.near - t.near) * r, t.facing += (n.facing - t.facing) * r, t.smile += (n.smile - t.smile) * i, t.browUp += (n.browUp - t.browUp) * i, t.mouthOpen += (n.mouthOpen - t.mouthOpen) * i, t;
	}
}, Ui = class {
	source;
	canvas;
	samples = [];
	channels = /* @__PURE__ */ new Set();
	t0 = 0;
	last = 0;
	media = null;
	track = null;
	frameParity = 0;
	chunks = [];
	recording = !1;
	marks = [];
	mark() {
		this.recording && this.marks.push(performance.now() - this.t0);
	}
	audioTrack = null;
	constructor(e, t) {
		this.source = e, this.canvas = t;
	}
	start(e = !0) {
		this.samples = [], this.channels.clear(), this.chunks = [], this.marks = [], this.t0 = performance.now(), this.last = this.t0, this.recording = !0;
		let t = e ? this.canvas?.() : null;
		if (t && "captureStream" in t && typeof MediaRecorder < "u") try {
			let e = t.captureStream(0);
			this.track = e.getVideoTracks()[0], this.audioTrack && e.addTrack(this.audioTrack), this.media = new MediaRecorder(e, {
				mimeType: "video/webm;codecs=vp8",
				videoBitsPerSecond: 8e6
			}), this.media.ondataavailable = (e) => {
				e.data.size && this.chunks.push(e.data);
			}, this.media.start(250);
		} catch {
			this.media = null;
		}
	}
	sample() {
		if (!this.recording) return;
		let e = performance.now(), t = {
			t: e - this.t0,
			dt: e - this.last
		};
		this.last = e;
		let n = this.source();
		for (let e in n) {
			let r = n[e];
			typeof r == "number" && Number.isFinite(r) && (t[e] = r, this.channels.add(e));
		}
		this.samples.push(t), this.track?.requestFrame && !(this.frameParity++ & 1) && (t.videoFrame = 1, this.track.requestFrame());
	}
	async stop(e = "run", t = {}) {
		this.recording = !1;
		let n = null;
		if (this.media) {
			let e = this.media;
			n = await new Promise((t) => {
				e.onstop = () => t(new Blob(this.chunks, { type: "video/webm" })), e.stop();
			}), this.media = null;
		}
		this.track = null;
		let r = this.samples.length ? this.samples[this.samples.length - 1].t / 1e3 : 0;
		return {
			recording: {
				startedAt: new Date(Date.now() - (performance.now() - this.t0)).toISOString(),
				label: e,
				fps: r ? this.samples.length / r : 0,
				channels: [...this.channels].sort(),
				samples: this.samples,
				notes: {
					...t,
					marks: this.marks
				}
			},
			video: n
		};
	}
};
async function Wi(e, t, n) {
	let r = new Blob([JSON.stringify(t)], { type: "application/json" }), i = await fetch(`/__lab/save?name=${encodeURIComponent(e)}.json`, {
		method: "POST",
		body: r
	});
	if (!i.ok) throw Error("lab save failed: " + i.status);
	return n && await fetch(`/__lab/save?name=${encodeURIComponent(e)}.webm`, {
		method: "POST",
		body: n
	}), e;
}
async function Gi(e, t) {
	let n = new MediaRecorder(e, {
		mimeType: "video/webm;codecs=vp8",
		videoBitsPerSecond: 6e6
	}), r = [];
	n.ondataavailable = (e) => {
		e.data.size && r.push(e.data);
	};
	let i = new Promise((e) => {
		n.onstop = () => e(new Blob(r, { type: "video/webm" }));
	});
	return n.start(250), await new Promise((e) => setTimeout(e, t)), n.stop(), i;
}
async function Ki(e, t) {
	let n = await navigator.mediaDevices.getDisplayMedia({
		video: { frameRate: 60 },
		audio: !1,
		preferCurrentTab: !0,
		selfBrowserSurface: "include",
		surfaceSwitching: "exclude"
	});
	try {
		let r = e.getBoundingClientRect(), i = {
			x: r.left / window.innerWidth,
			y: r.top / window.innerHeight,
			w: r.width / window.innerWidth,
			h: r.height / window.innerHeight
		};
		return {
			video: await Gi(n, t),
			crop: i
		};
	} finally {
		n.getTracks().forEach((e) => e.stop());
	}
}
// src/index.ts
function qi(e, t) {
	return e && typeof e != "string" ? e : e === "formant" ? new be(t.formant) : e === "headaudio" ? new ye({
		...t.assets,
		...t.headaudio
	}) : new Ee({ ...t.wav2arkit });
}
function Ji(e, t) {
	return e && typeof e != "string" ? e : e === "sprite" ? new xi(t.sprite) : e === "vrm" ? new yi(t.vrm) : e === "glb" ? new Bi(t.glb) : new Ii(t.splat);
}
async function Yi(e) {
	let { context: t, source: n, canvas: r } = e, i = e.delay === void 0 || e.delay === "auto", a = le({
		context: t,
		source: n,
		audibleDelay: i ? .1 : e.delay,
		destination: e.destination
	}), o = e.syncTrim ?? 0, s = e.autoEmotion ?? !0, c = s ? new Vi() : null;
	c?.start(a.source, t);
	let l = (e) => {
		i && a.setDelay(Math.max(.1, e.latencyMs / 1e3 + (e.sync ? 0 : o)));
	}, u = Ji(e.renderer, e);
	u.mount(r);
	let d = {
		extractor: "",
		renderer: u.name,
		extractorLatencyMs: 0,
		tapDelayMs: a.getDelay() * 1e3,
		outputLatencyMs: a.outputLatency() * 1e3,
		audioToMouthMs: 0,
		fps: 0,
		updateMs: 0,
		updateMsMax: 0,
		frameMs: 0,
		fellBack: !1
	}, f = qi(e.extractor, e), p = e.state ?? "idle";
	u.setState(p);
	async function m(n) {
		try {
			return await n.start(a.source, t), n;
		} catch (t) {
			if (e.fallback === !1 || n instanceof be) throw t;
			let r = n instanceof Ee ? new ye({
				...e.assets,
				...e.headaudio
			}) : new be(e.formant);
			return console.warn(`avatarz: ${n.name} failed, falling back to ${r.name}`, t), d.fellBack = !0, m(r);
		}
	}
	let h = e.avatarUrl ? u.setAvatar(e.avatarUrl) : Promise.resolve(), [g] = await Promise.all([m(f), h]);
	f = g, l(f), d.extractor = f.name, d.extractorLatencyMs = f.latencyMs;
	let _ = 0, v = 0, y = performance.now(), b = 0, x = 0, S = null, C = new Ui(() => {
		let e = { ...u.snapshot?.() ?? {} }, t = w;
		if (t && (t.visemes.forEach((t, n) => {
			e["vis." + n] = t;
		}), e["vis.jawOpen"] = t.jawOpen, e["vis.energy"] = t.energy, e["vis.speaking"] = +!!t.speaking), c) for (let t in c.mix) e["emo." + t] = c.mix[t];
		return e["sys.fps"] = d.fps, e["sys.updateMs"] = d.updateMs, e;
	}, () => [...r.parentElement?.querySelectorAll("canvas") ?? []].find((e) => e.width > 0 && getComputedStyle(e).display !== "none") ?? r), w = null;
	try {
		let e = t.createMediaStreamDestination();
		(a.delayNode ?? a.source).connect(e), C.audioTrack = e.stream.getAudioTracks()[0] ?? null;
	} catch {}
	let T = 0, E = !0, D = performance.now(), O = ue();
	function k(t) {
		if (!E) return;
		T = requestAnimationFrame(k);
		let n = Math.min(.1, Math.max(.001, (t - D) / 1e3));
		D = t;
		let r = performance.now();
		f.sync?.(a.getDelay(), a.outputLatency() + o);
		let l = f.read();
		w = l, c && s && u.setEmotionMix?.(c.update(t, n)), S && u.setAttention?.(S.update(n));
		let p = performance.now();
		u.frame(l, n);
		let m = performance.now(), h = m - r, g = p - r + (u.updateMs ?? m - p), O = 1 / n;
		if (d.fps = d.fps ? d.fps + (O - d.fps) * .05 : O, d.frameMs = d.frameMs ? d.frameMs + (h - d.frameMs) * .1 : h, d.updateMs = d.updateMs ? d.updateMs + (g - d.updateMs) * .1 : g, t - b > 1e3 ? (d.updateMsMax = g, b = t) : g > d.updateMsMax && (d.updateMsMax = g), d.tapDelayMs = a.getDelay() * 1e3, d.outputLatencyMs = a.outputLatency() * 1e3, d.extractorLatencyMs = f.latencyMs, i && t - x > 1e3) {
			x = t;
			let e = Math.max(.1, f.latencyMs / 1e3 + (f.sync ? 0 : o));
			(e > a.getDelay() + .03 || !l.speaking && e < a.getDelay() - .05) && a.setDelay(e);
		}
		let A = f.meter;
		A && (A.onsetId !== _ && (_ = A.onsetId, v = t - y > 1e3 ? A.onsetAt : 0), v && l.jawOpen > .3 && (d.audioToMouthMs = t - v, v = 0)), C.sample(), e.onFrame?.(l, d);
	}
	return T = requestAnimationFrame(k), {
		tap: a,
		get extractor() {
			return f;
		},
		renderer: u,
		metrics: d,
		getState: () => p,
		setState(e) {
			p = e, u.setState(e);
		},
		setEmotion(e, t = 1) {
			s = !1, u.setEmotion?.(e, t);
		},
		get emotion() {
			return c ? c.mix : null;
		},
		prosody: c,
		async startWebcam(e, t) {
			S?.stop(), S = new Hi(e), await S.start(t);
		},
		stopWebcam() {
			S?.stop(), S = null, u.setAttention?.(null);
		},
		get attention() {
			return S ? S.attention : null;
		},
		get webcam() {
			return S;
		},
		lab: {
			start: (e = !0) => C.start(e),
			async stop(e = "run", t = {}) {
				let { recording: n, video: r } = await C.stop(e, {
					...t,
					extractor: f.name,
					renderer: u.name,
					state: p
				});
				return Wi(`${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}_${e}`, n, r);
			},
			get recording() {
				return C.recording;
			},
			mark: () => C.mark(),
			async screen(e = 1e4) {
				let { video: t, crop: n } = await Ki(r.parentElement ?? r, e), i = `${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}_screen`;
				return await fetch(`/__lab/save?name=${encodeURIComponent(i)}.webm`, {
					method: "POST",
					body: t
				}), await fetch(`/__lab/save?name=${encodeURIComponent(i)}.json`, {
					method: "POST",
					body: new Blob([JSON.stringify({
						label: "screen",
						crop: n,
						samples: [],
						channels: [],
						fps: 0,
						startedAt: "",
						notes: {}
					})], { type: "application/json" })
				}), i;
			},
			async reference(e = 1e4) {
				let t = await navigator.mediaDevices.getUserMedia({
					video: {
						width: 640,
						height: 480,
						facingMode: "user"
					},
					audio: !1
				});
				try {
					let n = await Gi(t, e), r = `${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}_reference`;
					return await fetch(`/__lab/save?name=${encodeURIComponent(r)}.webm`, {
						method: "POST",
						body: n
					}), r;
				} finally {
					t.getTracks().forEach((e) => e.stop());
				}
			}
		},
		setAvatar: (e) => u.setAvatar(e),
		async setExtractor(t) {
			let n = await m(qi(t, e)), r = f;
			f = n, y = performance.now(), l(n), r.stop(), d.extractor = n.name, d.extractorLatencyMs = n.latencyMs;
		},
		setSyncTrim(e) {
			o = e, l(f);
		},
		getSyncTrim: () => o,
		cut() {
			f.reset(), c?.reset(), u.frame(O, .001);
		},
		pause() {
			E = !1, cancelAnimationFrame(T);
		},
		resume() {
			E || (E = !0, D = performance.now(), T = requestAnimationFrame(k));
		},
		dispose() {
			E = !1, cancelAnimationFrame(T), f.stop(), c?.stop(), S?.stop(), u.dispose(), a.dispose();
		}
	};
}
export { R as ARKIT, z as ARKIT_INDEX, be as FormantExtractor, Bi as GlbRenderer, ye as HeadAudioExtractor, L as N_VISEMES, Vi as ProsodyMeter, Ui as Recorder, Ii as SplatRenderer, xi as SpriteRenderer, F as VISEMES, I as VISEME_INDEX, yi as VRMRenderer, Ee as Wav2ArkitExtractor, Hi as WebcamAttention, de as approach, B as clamp01, ue as createFrame, Yi as createTalkingHead, le as createTap, Wi as saveToLab, V as smoothstep };
