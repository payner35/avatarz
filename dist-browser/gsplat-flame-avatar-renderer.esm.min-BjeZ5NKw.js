import { n as e, r as t, t as n } from "./rolldown-runtime-DfEuXgQw.js";
import { B as r, C as i, D as a, E as o, F as s, G as c, H as l, I as u, J as d, K as f, P as p, Q as m, R as h, V as g, X as _, Z as v, _t as y, a as b, b as x, c as S, ct as C, d as w, dt as T, et as E, f as D, g as O, gt as k, h as A, ht as j, i as M, it as N, m as P, mt as F, nt as I, ot as L, p as R, pt as z, q as B, s as V, st as H, t as U, u as ee, ut as te, v as ne, y as re, z as ie } from "./GLTFLoader-CPqKwYJ9.js";
// node_modules/three/examples/jsm/controls/OrbitControls.js
var ae = /* @__PURE__ */ t((/* @__PURE__ */ n(((t, n) => {
	(function(e) {
		typeof t == "object" && n !== void 0 ? n.exports = e() : typeof define == "function" && define.amd ? define([], e) : (typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : this).JSZip = e();
	})(function() {
		return function t(n, r, i) {
			function a(s, c) {
				if (!r[s]) {
					if (!n[s]) {
						var l = typeof e == "function" && e;
						if (!c && l) return l(s, !0);
						if (o) return o(s, !0);
						var u = /* @__PURE__ */ Error("Cannot find module '" + s + "'");
						throw u.code = "MODULE_NOT_FOUND", u;
					}
					var d = r[s] = { exports: {} };
					n[s][0].call(d.exports, function(e) {
						var t = n[s][1][e];
						return a(t || e);
					}, d, d.exports, t, n, r, i);
				}
				return r[s].exports;
			}
			for (var o = typeof e == "function" && e, s = 0; s < i.length; s++) a(i[s]);
			return a;
		}({
			1: [function(e, t, n) {
				var r = e("./utils"), i = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				n.encode = function(e) {
					for (var t, n, i, o, s, c, l, u = [], d = 0, f = e.length, p = f, m = r.getTypeOf(e) !== "string"; d < e.length;) p = f - d, i = m ? (t = e[d++], n = d < f ? e[d++] : 0, d < f ? e[d++] : 0) : (t = e.charCodeAt(d++), n = d < f ? e.charCodeAt(d++) : 0, d < f ? e.charCodeAt(d++) : 0), o = t >> 2, s = (3 & t) << 4 | n >> 4, c = 1 < p ? (15 & n) << 2 | i >> 6 : 64, l = 2 < p ? 63 & i : 64, u.push(a.charAt(o) + a.charAt(s) + a.charAt(c) + a.charAt(l));
					return u.join("");
				}, n.decode = function(e) {
					var t, n, r, o, s, c, l = 0, u = 0, d = "data:";
					if (e.substr(0, d.length) === d) throw Error("Invalid base64 input, it looks like a data url.");
					var f, p = 3 * (e = e.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
					if (e.charAt(e.length - 1) === a.charAt(64) && p--, e.charAt(e.length - 2) === a.charAt(64) && p--, p % 1 != 0) throw Error("Invalid base64 input, bad content length.");
					for (f = i.uint8array ? new Uint8Array(0 | p) : Array(0 | p); l < e.length;) t = a.indexOf(e.charAt(l++)) << 2 | (o = a.indexOf(e.charAt(l++))) >> 4, n = (15 & o) << 4 | (s = a.indexOf(e.charAt(l++))) >> 2, r = (3 & s) << 6 | (c = a.indexOf(e.charAt(l++))), f[u++] = t, s !== 64 && (f[u++] = n), c !== 64 && (f[u++] = r);
					return f;
				};
			}, {
				"./support": 30,
				"./utils": 32
			}],
			2: [function(e, t, n) {
				var r = e("./external"), i = e("./stream/DataWorker"), a = e("./stream/Crc32Probe"), o = e("./stream/DataLengthProbe");
				function s(e, t, n, r, i) {
					this.compressedSize = e, this.uncompressedSize = t, this.crc32 = n, this.compression = r, this.compressedContent = i;
				}
				s.prototype = {
					getContentWorker: function() {
						var e = new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new o("data_length")), t = this;
						return e.on("end", function() {
							if (this.streamInfo.data_length !== t.uncompressedSize) throw Error("Bug : uncompressed data size mismatch");
						}), e;
					},
					getCompressedWorker: function() {
						return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
					}
				}, s.createWorkerFrom = function(e, t, n) {
					return e.pipe(new a()).pipe(new o("uncompressedSize")).pipe(t.compressWorker(n)).pipe(new o("compressedSize")).withStreamInfo("compression", t);
				}, t.exports = s;
			}, {
				"./external": 6,
				"./stream/Crc32Probe": 25,
				"./stream/DataLengthProbe": 26,
				"./stream/DataWorker": 27
			}],
			3: [function(e, t, n) {
				var r = e("./stream/GenericWorker");
				n.STORE = {
					magic: "\0\0",
					compressWorker: function() {
						return new r("STORE compression");
					},
					uncompressWorker: function() {
						return new r("STORE decompression");
					}
				}, n.DEFLATE = e("./flate");
			}, {
				"./flate": 7,
				"./stream/GenericWorker": 28
			}],
			4: [function(e, t, n) {
				var r = e("./utils"), i = function() {
					for (var e, t = [], n = 0; n < 256; n++) {
						e = n;
						for (var r = 0; r < 8; r++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
						t[n] = e;
					}
					return t;
				}();
				t.exports = function(e, t) {
					return e !== void 0 && e.length ? r.getTypeOf(e) === "string" ? function(e, t, n, r) {
						var a = i, o = r + n;
						e ^= -1;
						for (var s = r; s < o; s++) e = e >>> 8 ^ a[255 & (e ^ t.charCodeAt(s))];
						return -1 ^ e;
					}(0 | t, e, e.length, 0) : function(e, t, n, r) {
						var a = i, o = r + n;
						e ^= -1;
						for (var s = r; s < o; s++) e = e >>> 8 ^ a[255 & (e ^ t[s])];
						return -1 ^ e;
					}(0 | t, e, e.length, 0) : 0;
				};
			}, { "./utils": 32 }],
			5: [function(e, t, n) {
				n.base64 = !1, n.binary = !1, n.dir = !1, n.createFolders = !0, n.date = null, n.compression = null, n.compressionOptions = null, n.comment = null, n.unixPermissions = null, n.dosPermissions = null;
			}, {}],
			6: [function(e, t, n) {
				var r = null;
				r = typeof Promise < "u" ? Promise : e("lie"), t.exports = { Promise: r };
			}, { lie: 37 }],
			7: [function(e, t, n) {
				var r = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), a = e("./utils"), o = e("./stream/GenericWorker"), s = r ? "uint8array" : "array";
				function c(e, t) {
					o.call(this, "FlateWorker/" + e), this._pako = null, this._pakoAction = e, this._pakoOptions = t, this.meta = {};
				}
				n.magic = "\b\0", a.inherits(c, o), c.prototype.processChunk = function(e) {
					this.meta = e.meta, this._pako === null && this._createPako(), this._pako.push(a.transformTo(s, e.data), !1);
				}, c.prototype.flush = function() {
					o.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
				}, c.prototype.cleanUp = function() {
					o.prototype.cleanUp.call(this), this._pako = null;
				}, c.prototype._createPako = function() {
					this._pako = new i[this._pakoAction]({
						raw: !0,
						level: this._pakoOptions.level || -1
					});
					var e = this;
					this._pako.onData = function(t) {
						e.push({
							data: t,
							meta: e.meta
						});
					};
				}, n.compressWorker = function(e) {
					return new c("Deflate", e);
				}, n.uncompressWorker = function() {
					return new c("Inflate", {});
				};
			}, {
				"./stream/GenericWorker": 28,
				"./utils": 32,
				pako: 38
			}],
			8: [function(e, t, n) {
				function r(e, t) {
					var n, r = "";
					for (n = 0; n < t; n++) r += String.fromCharCode(255 & e), e >>>= 8;
					return r;
				}
				function i(e, t, n, i, o, u) {
					var d, f, p = e.file, m = e.compression, h = u !== s.utf8encode, g = a.transformTo("string", u(p.name)), _ = a.transformTo("string", s.utf8encode(p.name)), v = p.comment, y = a.transformTo("string", u(v)), b = a.transformTo("string", s.utf8encode(v)), x = _.length !== p.name.length, S = b.length !== v.length, C = "", w = "", T = "", E = p.dir, D = p.date, O = {
						crc32: 0,
						compressedSize: 0,
						uncompressedSize: 0
					};
					t && !n || (O.crc32 = e.crc32, O.compressedSize = e.compressedSize, O.uncompressedSize = e.uncompressedSize);
					var k = 0;
					t && (k |= 8), h || !x && !S || (k |= 2048);
					var A = 0, j = 0;
					E && (A |= 16), o === "UNIX" ? (j = 798, A |= function(e, t) {
						var n = e;
						return e || (n = t ? 16893 : 33204), (65535 & n) << 16;
					}(p.unixPermissions, E)) : (j = 20, A |= function(e) {
						return 63 & (e || 0);
					}(p.dosPermissions)), d = D.getUTCHours(), d <<= 6, d |= D.getUTCMinutes(), d <<= 5, d |= D.getUTCSeconds() / 2, f = D.getUTCFullYear() - 1980, f <<= 4, f |= D.getUTCMonth() + 1, f <<= 5, f |= D.getUTCDate(), x && (w = r(1, 1) + r(c(g), 4) + _, C += "up" + r(w.length, 2) + w), S && (T = r(1, 1) + r(c(y), 4) + b, C += "uc" + r(T.length, 2) + T);
					var M = "";
					return M += "\n\0", M += r(k, 2), M += m.magic, M += r(d, 2), M += r(f, 2), M += r(O.crc32, 4), M += r(O.compressedSize, 4), M += r(O.uncompressedSize, 4), M += r(g.length, 2), M += r(C.length, 2), {
						fileRecord: l.LOCAL_FILE_HEADER + M + g + C,
						dirRecord: l.CENTRAL_FILE_HEADER + r(j, 2) + M + r(y.length, 2) + "\0\0\0\0" + r(A, 4) + r(i, 4) + g + C + y
					};
				}
				var a = e("../utils"), o = e("../stream/GenericWorker"), s = e("../utf8"), c = e("../crc32"), l = e("../signature");
				function u(e, t, n, r) {
					o.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t, this.zipPlatform = n, this.encodeFileName = r, this.streamFiles = e, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
				}
				a.inherits(u, o), u.prototype.push = function(e) {
					var t = e.meta.percent || 0, n = this.entriesCount, r = this._sources.length;
					this.accumulate ? this.contentBuffer.push(e) : (this.bytesWritten += e.data.length, o.prototype.push.call(this, {
						data: e.data,
						meta: {
							currentFile: this.currentFile,
							percent: n ? (t + 100 * (n - r - 1)) / n : 100
						}
					}));
				}, u.prototype.openedSource = function(e) {
					this.currentSourceOffset = this.bytesWritten, this.currentFile = e.file.name;
					var t = this.streamFiles && !e.file.dir;
					if (t) {
						var n = i(e, t, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
						this.push({
							data: n.fileRecord,
							meta: { percent: 0 }
						});
					} else this.accumulate = !0;
				}, u.prototype.closedSource = function(e) {
					this.accumulate = !1;
					var t = this.streamFiles && !e.file.dir, n = i(e, t, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
					if (this.dirRecords.push(n.dirRecord), t) this.push({
						data: function(e) {
							return l.DATA_DESCRIPTOR + r(e.crc32, 4) + r(e.compressedSize, 4) + r(e.uncompressedSize, 4);
						}(e),
						meta: { percent: 100 }
					});
					else for (this.push({
						data: n.fileRecord,
						meta: { percent: 0 }
					}); this.contentBuffer.length;) this.push(this.contentBuffer.shift());
					this.currentFile = null;
				}, u.prototype.flush = function() {
					for (var e = this.bytesWritten, t = 0; t < this.dirRecords.length; t++) this.push({
						data: this.dirRecords[t],
						meta: { percent: 100 }
					});
					var n = this.bytesWritten - e, i = function(e, t, n, i, o) {
						var s = a.transformTo("string", o(i));
						return l.CENTRAL_DIRECTORY_END + "\0\0\0\0" + r(e, 2) + r(e, 2) + r(t, 4) + r(n, 4) + r(s.length, 2) + s;
					}(this.dirRecords.length, n, e, this.zipComment, this.encodeFileName);
					this.push({
						data: i,
						meta: { percent: 100 }
					});
				}, u.prototype.prepareNextSource = function() {
					this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
				}, u.prototype.registerPrevious = function(e) {
					this._sources.push(e);
					var t = this;
					return e.on("data", function(e) {
						t.processChunk(e);
					}), e.on("end", function() {
						t.closedSource(t.previous.streamInfo), t._sources.length ? t.prepareNextSource() : t.end();
					}), e.on("error", function(e) {
						t.error(e);
					}), this;
				}, u.prototype.resume = function() {
					return !!o.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
				}, u.prototype.error = function(e) {
					var t = this._sources;
					if (!o.prototype.error.call(this, e)) return !1;
					for (var n = 0; n < t.length; n++) try {
						t[n].error(e);
					} catch {}
					return !0;
				}, u.prototype.lock = function() {
					o.prototype.lock.call(this);
					for (var e = this._sources, t = 0; t < e.length; t++) e[t].lock();
				}, t.exports = u;
			}, {
				"../crc32": 4,
				"../signature": 23,
				"../stream/GenericWorker": 28,
				"../utf8": 31,
				"../utils": 32
			}],
			9: [function(e, t, n) {
				var r = e("../compressions"), i = e("./ZipFileWorker");
				n.generateWorker = function(e, t, n) {
					var a = new i(t.streamFiles, n, t.platform, t.encodeFileName), o = 0;
					try {
						e.forEach(function(e, n) {
							o++;
							var i = function(e, t) {
								var n = e || t, i = r[n];
								if (!i) throw Error(n + " is not a valid compression method !");
								return i;
							}(n.options.compression, t.compression), s = n.options.compressionOptions || t.compressionOptions || {}, c = n.dir, l = n.date;
							n._compressWorker(i, s).withStreamInfo("file", {
								name: e,
								dir: c,
								date: l,
								comment: n.comment || "",
								unixPermissions: n.unixPermissions,
								dosPermissions: n.dosPermissions
							}).pipe(a);
						}), a.entriesCount = o;
					} catch (e) {
						a.error(e);
					}
					return a;
				};
			}, {
				"../compressions": 3,
				"./ZipFileWorker": 8
			}],
			10: [function(e, t, n) {
				function r() {
					if (!(this instanceof r)) return new r();
					if (arguments.length) throw Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
					this.files = Object.create(null), this.comment = null, this.root = "", this.clone = function() {
						var e = new r();
						for (var t in this) typeof this[t] != "function" && (e[t] = this[t]);
						return e;
					};
				}
				(r.prototype = e("./object")).loadAsync = e("./load"), r.support = e("./support"), r.defaults = e("./defaults"), r.version = "3.10.2", r.loadAsync = function(e, t) {
					return new r().loadAsync(e, t);
				}, r.external = e("./external"), t.exports = r;
			}, {
				"./defaults": 5,
				"./external": 6,
				"./load": 11,
				"./object": 15,
				"./support": 30
			}],
			11: [function(e, t, n) {
				var r = e("./utils"), i = e("./external"), a = e("./utf8"), o = e("./zipEntries"), s = e("./stream/Crc32Probe"), c = e("./nodejsUtils");
				function l(e) {
					return new i.Promise(function(t, n) {
						var r = e.decompressed.getContentWorker().pipe(new s());
						r.on("error", function(e) {
							n(e);
						}).on("end", function() {
							r.streamInfo.crc32 === e.decompressed.crc32 ? t() : n(/* @__PURE__ */ Error("Corrupted zip : CRC32 mismatch"));
						}).resume();
					});
				}
				t.exports = function(e, t) {
					var n = this;
					return t = r.extend(t || {}, {
						base64: !1,
						checkCRC32: !1,
						optimizedBinaryString: !1,
						createFolders: !1,
						decodeFileName: a.utf8decode
					}), c.isNode && c.isStream(e) ? i.Promise.reject(/* @__PURE__ */ Error("JSZip can't accept a stream when loading a zip file.")) : r.prepareContent("the loaded zip file", e, !0, t.optimizedBinaryString, t.base64).then(function(e) {
						var n = new o(t);
						return n.load(e), n;
					}).then(function(e) {
						var n = [i.Promise.resolve(e)], r = e.files;
						if (t.checkCRC32) for (var a = 0; a < r.length; a++) n.push(l(r[a]));
						return i.Promise.all(n);
					}).then(function(e) {
						for (var i = e.shift(), a = i.files, o = 0; o < a.length; o++) {
							var s = a[o], c = s.fileNameStr, l = r.resolve(s.fileNameStr);
							n.file(l, s.decompressed, {
								binary: !0,
								optimizedBinaryString: !0,
								date: s.date,
								dir: s.dir,
								comment: s.fileCommentStr.length ? s.fileCommentStr : null,
								unixPermissions: s.unixPermissions,
								dosPermissions: s.dosPermissions,
								createFolders: t.createFolders
							}), s.dir || (n.file(l).unsafeOriginalName = c);
						}
						return i.zipComment.length && (n.comment = i.zipComment), n;
					});
				};
			}, {
				"./external": 6,
				"./nodejsUtils": 14,
				"./stream/Crc32Probe": 25,
				"./utf8": 31,
				"./utils": 32,
				"./zipEntries": 33
			}],
			12: [function(e, t, n) {
				var r = e("../utils"), i = e("../stream/GenericWorker");
				function a(e, t) {
					i.call(this, "Nodejs stream input adapter for " + e), this._upstreamEnded = !1, this._bindStream(t);
				}
				r.inherits(a, i), a.prototype._bindStream = function(e) {
					var t = this;
					(this._stream = e).pause(), e.on("data", function(e) {
						t.push({
							data: e,
							meta: { percent: 0 }
						});
					}).on("error", function(e) {
						t.isPaused ? this.generatedError = e : t.error(e);
					}).on("end", function() {
						t.isPaused ? t._upstreamEnded = !0 : t.end();
					});
				}, a.prototype.pause = function() {
					return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
				}, a.prototype.resume = function() {
					return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
				}, t.exports = a;
			}, {
				"../stream/GenericWorker": 28,
				"../utils": 32
			}],
			13: [function(e, t, n) {
				var r = e("readable-stream").Readable;
				function i(e, t, n) {
					r.call(this, t), this._helper = e;
					var i = this;
					e.on("data", function(e, t) {
						i.push(e) || i._helper.pause(), n && n(t);
					}).on("error", function(e) {
						i.emit("error", e);
					}).on("end", function() {
						i.push(null);
					});
				}
				e("../utils").inherits(i, r), i.prototype._read = function() {
					this._helper.resume();
				}, t.exports = i;
			}, {
				"../utils": 32,
				"readable-stream": 16
			}],
			14: [function(e, t, n) {
				t.exports = {
					isNode: typeof Buffer < "u",
					newBufferFrom: function(e, t) {
						if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e, t);
						if (typeof e == "number") throw Error("The \"data\" argument must not be a number");
						return new Buffer(e, t);
					},
					allocBuffer: function(e) {
						if (Buffer.alloc) return Buffer.alloc(e);
						var t = new Buffer(e);
						return t.fill(0), t;
					},
					isBuffer: function(e) {
						return Buffer.isBuffer(e);
					},
					isStream: function(e) {
						return e && typeof e.on == "function" && typeof e.pause == "function" && typeof e.resume == "function";
					}
				};
			}, {}],
			15: [function(e, t, n) {
				function r(e, t, n) {
					var r, i = a.getTypeOf(t), s = a.extend(n || {}, c);
					s.date = s.date || /* @__PURE__ */ new Date(), s.compression !== null && (s.compression = s.compression.toUpperCase()), typeof s.unixPermissions == "string" && (s.unixPermissions = parseInt(s.unixPermissions, 8)), s.unixPermissions && 16384 & s.unixPermissions && (s.dir = !0), s.dosPermissions && 16 & s.dosPermissions && (s.dir = !0), s.dir && (e = h(e)), s.createFolders && (r = m(e)) && g.call(this, r, !0);
					var d = i === "string" && !1 === s.binary && !1 === s.base64;
					n && n.binary !== void 0 || (s.binary = !d), (t instanceof l && t.uncompressedSize === 0 || s.dir || !t || t.length === 0) && (s.base64 = !1, s.binary = !0, t = "", s.compression = "STORE", i = "string");
					var _ = null;
					_ = t instanceof l || t instanceof o ? t : f.isNode && f.isStream(t) ? new p(e, t) : a.prepareContent(e, t, s.binary, s.optimizedBinaryString, s.base64);
					var v = new u(e, _, s);
					this.files[e] = v;
				}
				var i = e("./utf8"), a = e("./utils"), o = e("./stream/GenericWorker"), s = e("./stream/StreamHelper"), c = e("./defaults"), l = e("./compressedObject"), u = e("./zipObject"), d = e("./generate"), f = e("./nodejsUtils"), p = e("./nodejs/NodejsStreamInputAdapter"), m = function(e) {
					e.slice(-1) === "/" && (e = e.substring(0, e.length - 1));
					var t = e.lastIndexOf("/");
					return 0 < t ? e.substring(0, t) : "";
				}, h = function(e) {
					return e.slice(-1) !== "/" && (e += "/"), e;
				}, g = function(e, t) {
					return t = t === void 0 ? c.createFolders : t, e = h(e), this.files[e] || r.call(this, e, null, {
						dir: !0,
						createFolders: t
					}), this.files[e];
				};
				function _(e) {
					return Object.prototype.toString.call(e) === "[object RegExp]";
				}
				t.exports = {
					load: function() {
						throw Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
					},
					forEach: function(e) {
						var t, n, r;
						for (t in this.files) r = this.files[t], (n = t.slice(this.root.length, t.length)) && t.slice(0, this.root.length) === this.root && e(n, r);
					},
					filter: function(e) {
						var t = [];
						return this.forEach(function(n, r) {
							e(n, r) && t.push(r);
						}), t;
					},
					file: function(e, t, n) {
						if (arguments.length !== 1) return e = this.root + e, r.call(this, e, t, n), this;
						if (_(e)) {
							var i = e;
							return this.filter(function(e, t) {
								return !t.dir && i.test(e);
							});
						}
						var a = this.files[this.root + e];
						return a && !a.dir ? a : null;
					},
					folder: function(e) {
						if (!e) return this;
						if (_(e)) return this.filter(function(t, n) {
							return n.dir && e.test(t);
						});
						var t = this.root + e, n = g.call(this, t), r = this.clone();
						return r.root = n.name, r;
					},
					remove: function(e) {
						e = this.root + e;
						var t = this.files[e];
						if (t ||= (e.slice(-1) !== "/" && (e += "/"), this.files[e]), t && !t.dir) delete this.files[e];
						else for (var n = this.filter(function(t, n) {
							return n.name.slice(0, e.length) === e;
						}), r = 0; r < n.length; r++) delete this.files[n[r].name];
						return this;
					},
					generate: function() {
						throw Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
					},
					generateInternalStream: function(e) {
						var t, n = {};
						try {
							if ((n = a.extend(e || {}, {
								streamFiles: !1,
								compression: "STORE",
								compressionOptions: null,
								type: "",
								platform: "DOS",
								comment: null,
								mimeType: "application/zip",
								encodeFileName: i.utf8encode
							})).type = n.type.toLowerCase(), n.compression = n.compression.toUpperCase(), n.type === "binarystring" && (n.type = "string"), !n.type) throw Error("No output type specified.");
							a.checkSupport(n.type), n.platform !== "darwin" && n.platform !== "freebsd" && n.platform !== "linux" && n.platform !== "sunos" || (n.platform = "UNIX"), n.platform === "win32" && (n.platform = "DOS");
							var r = n.comment || this.comment || "";
							t = d.generateWorker(this, n, r);
						} catch (e) {
							(t = new o("error")).error(e);
						}
						return new s(t, n.type || "string", n.mimeType);
					},
					generateAsync: function(e, t) {
						return this.generateInternalStream(e).accumulate(t);
					},
					generateNodeStream: function(e, t) {
						return (e ||= {}).type || (e.type = "nodebuffer"), this.generateInternalStream(e).toNodejsStream(t);
					}
				};
			}, {
				"./compressedObject": 2,
				"./defaults": 5,
				"./generate": 9,
				"./nodejs/NodejsStreamInputAdapter": 12,
				"./nodejsUtils": 14,
				"./stream/GenericWorker": 28,
				"./stream/StreamHelper": 29,
				"./utf8": 31,
				"./utils": 32,
				"./zipObject": 35
			}],
			16: [function(e, t, n) {
				t.exports = e("stream");
			}, { stream: void 0 }],
			17: [function(e, t, n) {
				var r = e("./DataReader");
				function i(e) {
					r.call(this, e);
					for (var t = 0; t < this.data.length; t++) e[t] = 255 & e[t];
				}
				e("../utils").inherits(i, r), i.prototype.byteAt = function(e) {
					return this.data[this.zero + e];
				}, i.prototype.lastIndexOfSignature = function(e) {
					for (var t = e.charCodeAt(0), n = e.charCodeAt(1), r = e.charCodeAt(2), i = e.charCodeAt(3), a = this.length - 4; 0 <= a; --a) if (this.data[a] === t && this.data[a + 1] === n && this.data[a + 2] === r && this.data[a + 3] === i) return a - this.zero;
					return -1;
				}, i.prototype.readAndCheckSignature = function(e) {
					var t = e.charCodeAt(0), n = e.charCodeAt(1), r = e.charCodeAt(2), i = e.charCodeAt(3), a = this.readData(4);
					return t === a[0] && n === a[1] && r === a[2] && i === a[3];
				}, i.prototype.readData = function(e) {
					if (this.checkOffset(e), e === 0) return [];
					var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
					return this.index += e, t;
				}, t.exports = i;
			}, {
				"../utils": 32,
				"./DataReader": 18
			}],
			18: [function(e, t, n) {
				var r = e("../utils");
				function i(e) {
					this.data = e, this.length = e.length, this.index = 0, this.zero = 0;
				}
				i.prototype = {
					checkOffset: function(e) {
						this.checkIndex(this.index + e);
					},
					checkIndex: function(e) {
						if (this.length < this.zero + e || e < 0) throw Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?");
					},
					setIndex: function(e) {
						this.checkIndex(e), this.index = e;
					},
					skip: function(e) {
						this.setIndex(this.index + e);
					},
					byteAt: function() {},
					readInt: function(e) {
						var t, n = 0;
						for (this.checkOffset(e), t = this.index + e - 1; t >= this.index; t--) n = (n << 8) + this.byteAt(t);
						return this.index += e, n;
					},
					readString: function(e) {
						return r.transformTo("string", this.readData(e));
					},
					readData: function() {},
					lastIndexOfSignature: function() {},
					readAndCheckSignature: function() {},
					readDate: function() {
						var e = this.readInt(4);
						return new Date(Date.UTC(1980 + (e >> 25 & 127), (e >> 21 & 15) - 1, e >> 16 & 31, e >> 11 & 31, e >> 5 & 63, (31 & e) << 1));
					}
				}, t.exports = i;
			}, { "../utils": 32 }],
			19: [function(e, t, n) {
				var r = e("./Uint8ArrayReader");
				function i(e) {
					r.call(this, e);
				}
				e("../utils").inherits(i, r), i.prototype.readData = function(e) {
					this.checkOffset(e);
					var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
					return this.index += e, t;
				}, t.exports = i;
			}, {
				"../utils": 32,
				"./Uint8ArrayReader": 21
			}],
			20: [function(e, t, n) {
				var r = e("./DataReader");
				function i(e) {
					r.call(this, e);
				}
				e("../utils").inherits(i, r), i.prototype.byteAt = function(e) {
					return this.data.charCodeAt(this.zero + e);
				}, i.prototype.lastIndexOfSignature = function(e) {
					return this.data.lastIndexOf(e) - this.zero;
				}, i.prototype.readAndCheckSignature = function(e) {
					return e === this.readData(4);
				}, i.prototype.readData = function(e) {
					this.checkOffset(e);
					var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
					return this.index += e, t;
				}, t.exports = i;
			}, {
				"../utils": 32,
				"./DataReader": 18
			}],
			21: [function(e, t, n) {
				var r = e("./ArrayReader");
				function i(e) {
					r.call(this, e);
				}
				e("../utils").inherits(i, r), i.prototype.readData = function(e) {
					if (this.checkOffset(e), e === 0) return /* @__PURE__ */ new Uint8Array();
					var t = this.data.subarray(this.zero + this.index, this.zero + this.index + e);
					return this.index += e, t;
				}, t.exports = i;
			}, {
				"../utils": 32,
				"./ArrayReader": 17
			}],
			22: [function(e, t, n) {
				var r = e("../utils"), i = e("../support"), a = e("./ArrayReader"), o = e("./StringReader"), s = e("./NodeBufferReader"), c = e("./Uint8ArrayReader");
				t.exports = function(e) {
					var t = r.getTypeOf(e);
					return r.checkSupport(t), t !== "string" || i.uint8array ? t === "nodebuffer" ? new s(e) : i.uint8array ? new c(r.transformTo("uint8array", e)) : new a(r.transformTo("array", e)) : new o(e);
				};
			}, {
				"../support": 30,
				"../utils": 32,
				"./ArrayReader": 17,
				"./NodeBufferReader": 19,
				"./StringReader": 20,
				"./Uint8ArrayReader": 21
			}],
			23: [function(e, t, n) {
				n.LOCAL_FILE_HEADER = "PK", n.CENTRAL_FILE_HEADER = "PK", n.CENTRAL_DIRECTORY_END = "PK", n.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", n.ZIP64_CENTRAL_DIRECTORY_END = "PK", n.DATA_DESCRIPTOR = "PK\x07\b";
			}, {}],
			24: [function(e, t, n) {
				var r = e("./GenericWorker"), i = e("../utils");
				function a(e) {
					r.call(this, "ConvertWorker to " + e), this.destType = e;
				}
				i.inherits(a, r), a.prototype.processChunk = function(e) {
					this.push({
						data: i.transformTo(this.destType, e.data),
						meta: e.meta
					});
				}, t.exports = a;
			}, {
				"../utils": 32,
				"./GenericWorker": 28
			}],
			25: [function(e, t, n) {
				var r = e("./GenericWorker"), i = e("../crc32");
				function a() {
					r.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
				}
				e("../utils").inherits(a, r), a.prototype.processChunk = function(e) {
					this.streamInfo.crc32 = i(e.data, this.streamInfo.crc32 || 0), this.push(e);
				}, t.exports = a;
			}, {
				"../crc32": 4,
				"../utils": 32,
				"./GenericWorker": 28
			}],
			26: [function(e, t, n) {
				var r = e("../utils"), i = e("./GenericWorker");
				function a(e) {
					i.call(this, "DataLengthProbe for " + e), this.propName = e, this.withStreamInfo(e, 0);
				}
				r.inherits(a, i), a.prototype.processChunk = function(e) {
					if (e) {
						var t = this.streamInfo[this.propName] || 0;
						this.streamInfo[this.propName] = t + e.data.length;
					}
					i.prototype.processChunk.call(this, e);
				}, t.exports = a;
			}, {
				"../utils": 32,
				"./GenericWorker": 28
			}],
			27: [function(e, t, n) {
				var r = e("../utils"), i = e("./GenericWorker");
				function a(e) {
					i.call(this, "DataWorker");
					var t = this;
					this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, e.then(function(e) {
						t.dataIsReady = !0, t.data = e, t.max = e && e.length || 0, t.type = r.getTypeOf(e), t.isPaused || t._tickAndRepeat();
					}, function(e) {
						t.error(e);
					});
				}
				r.inherits(a, i), a.prototype.cleanUp = function() {
					i.prototype.cleanUp.call(this), this.data = null;
				}, a.prototype.resume = function() {
					return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, r.delay(this._tickAndRepeat, [], this)), !0);
				}, a.prototype._tickAndRepeat = function() {
					this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (r.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
				}, a.prototype._tick = function() {
					if (this.isPaused || this.isFinished) return !1;
					var e = null, t = Math.min(this.max, this.index + 16384);
					if (this.index >= this.max) return this.end();
					switch (this.type) {
						case "string":
							e = this.data.substring(this.index, t);
							break;
						case "uint8array":
							e = this.data.subarray(this.index, t);
							break;
						case "array":
						case "nodebuffer": e = this.data.slice(this.index, t);
					}
					return this.index = t, this.push({
						data: e,
						meta: { percent: this.max ? this.index / this.max * 100 : 0 }
					});
				}, t.exports = a;
			}, {
				"../utils": 32,
				"./GenericWorker": 28
			}],
			28: [function(e, t, n) {
				function r(e) {
					this.name = e || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
						data: [],
						end: [],
						error: []
					}, this.previous = null;
				}
				r.prototype = {
					push: function(e) {
						this.emit("data", e);
					},
					end: function() {
						if (this.isFinished) return !1;
						this.flush();
						try {
							this.emit("end"), this.cleanUp(), this.isFinished = !0;
						} catch (e) {
							this.emit("error", e);
						}
						return !0;
					},
					error: function(e) {
						return !this.isFinished && (this.isPaused ? this.generatedError = e : (this.isFinished = !0, this.emit("error", e), this.previous && this.previous.error(e), this.cleanUp()), !0);
					},
					on: function(e, t) {
						return this._listeners[e].push(t), this;
					},
					cleanUp: function() {
						this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
					},
					emit: function(e, t) {
						if (this._listeners[e]) for (var n = 0; n < this._listeners[e].length; n++) this._listeners[e][n].call(this, t);
					},
					pipe: function(e) {
						return e.registerPrevious(this);
					},
					registerPrevious: function(e) {
						if (this.isLocked) throw Error("The stream '" + this + "' has already been used.");
						this.streamInfo = e.streamInfo, this.mergeStreamInfo(), this.previous = e;
						var t = this;
						return e.on("data", function(e) {
							t.processChunk(e);
						}), e.on("end", function() {
							t.end();
						}), e.on("error", function(e) {
							t.error(e);
						}), this;
					},
					pause: function() {
						return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
					},
					resume: function() {
						if (!this.isPaused || this.isFinished) return !1;
						var e = this.isPaused = !1;
						return this.generatedError && (this.error(this.generatedError), e = !0), this.previous && this.previous.resume(), !e;
					},
					flush: function() {},
					processChunk: function(e) {
						this.push(e);
					},
					withStreamInfo: function(e, t) {
						return this.extraStreamInfo[e] = t, this.mergeStreamInfo(), this;
					},
					mergeStreamInfo: function() {
						for (var e in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e) && (this.streamInfo[e] = this.extraStreamInfo[e]);
					},
					lock: function() {
						if (this.isLocked) throw Error("The stream '" + this + "' has already been used.");
						this.isLocked = !0, this.previous && this.previous.lock();
					},
					toString: function() {
						var e = "Worker " + this.name;
						return this.previous ? this.previous + " -> " + e : e;
					}
				}, t.exports = r;
			}, {}],
			29: [function(e, t, n) {
				var r = e("../utils"), i = e("./ConvertWorker"), a = e("./GenericWorker"), o = e("../base64"), s = e("../support"), c = e("../external"), l = null;
				if (s.nodestream) try {
					l = e("../nodejs/NodejsStreamOutputAdapter");
				} catch {}
				function u(e, t) {
					return new c.Promise(function(n, i) {
						var a = [], s = e._internalType, c = e._outputType, l = e._mimeType;
						e.on("data", function(e, n) {
							a.push(e), t && t(n);
						}).on("error", function(e) {
							a = [], i(e);
						}).on("end", function() {
							try {
								n(function(e, t, n) {
									switch (e) {
										case "blob": return r.newBlob(r.transformTo("arraybuffer", t), n);
										case "base64": return o.encode(t);
										default: return r.transformTo(e, t);
									}
								}(c, function(e, t) {
									var n, r = 0, i = null, a = 0;
									for (n = 0; n < t.length; n++) a += t[n].length;
									switch (e) {
										case "string": return t.join("");
										case "array": return Array.prototype.concat.apply([], t);
										case "uint8array":
											for (i = new Uint8Array(a), n = 0; n < t.length; n++) i.set(t[n], r), r += t[n].length;
											return i;
										case "nodebuffer": return Buffer.concat(t);
										default: throw Error("concat : unsupported type '" + e + "'");
									}
								}(s, a), l));
							} catch (e) {
								i(e);
							}
							a = [];
						}).resume();
					});
				}
				function d(e, t, n) {
					var o = t;
					switch (t) {
						case "blob":
						case "arraybuffer":
							o = "uint8array";
							break;
						case "base64": o = "string";
					}
					try {
						this._internalType = o, this._outputType = t, this._mimeType = n, r.checkSupport(o), this._worker = e.pipe(new i(o)), e.lock();
					} catch (e) {
						this._worker = new a("error"), this._worker.error(e);
					}
				}
				d.prototype = {
					accumulate: function(e) {
						return u(this, e);
					},
					on: function(e, t) {
						var n = this;
						return e === "data" ? this._worker.on(e, function(e) {
							t.call(n, e.data, e.meta);
						}) : this._worker.on(e, function() {
							r.delay(t, arguments, n);
						}), this;
					},
					resume: function() {
						return r.delay(this._worker.resume, [], this._worker), this;
					},
					pause: function() {
						return this._worker.pause(), this;
					},
					toNodejsStream: function(e) {
						if (r.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw Error(this._outputType + " is not supported by this method");
						return new l(this, { objectMode: this._outputType !== "nodebuffer" }, e);
					}
				}, t.exports = d;
			}, {
				"../base64": 1,
				"../external": 6,
				"../nodejs/NodejsStreamOutputAdapter": 13,
				"../support": 30,
				"../utils": 32,
				"./ConvertWorker": 24,
				"./GenericWorker": 28
			}],
			30: [function(e, t, n) {
				if (n.base64 = !0, n.array = !0, n.string = !0, n.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", n.nodebuffer = typeof Buffer < "u", n.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") n.blob = !1;
				else {
					var r = /* @__PURE__ */ new ArrayBuffer(0);
					try {
						n.blob = new Blob([r], { type: "application/zip" }).size === 0;
					} catch {
						try {
							var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
							i.append(r), n.blob = i.getBlob("application/zip").size === 0;
						} catch {
							n.blob = !1;
						}
					}
				}
				try {
					n.nodestream = !!e("readable-stream").Readable;
				} catch {
					n.nodestream = !1;
				}
			}, { "readable-stream": 16 }],
			31: [function(e, t, n) {
				for (var r = e("./utils"), i = e("./support"), a = e("./nodejsUtils"), o = e("./stream/GenericWorker"), s = Array(256), c = 0; c < 256; c++) s[c] = 252 <= c ? 6 : 248 <= c ? 5 : 240 <= c ? 4 : 224 <= c ? 3 : 192 <= c ? 2 : 1;
				s[254] = s[254] = 1;
				function l() {
					o.call(this, "utf-8 decode"), this.leftOver = null;
				}
				function u() {
					o.call(this, "utf-8 encode");
				}
				n.utf8encode = function(e) {
					return i.nodebuffer ? a.newBufferFrom(e, "utf-8") : function(e) {
						var t, n, r, a, o, s = e.length, c = 0;
						for (a = 0; a < s; a++) (64512 & (n = e.charCodeAt(a))) == 55296 && a + 1 < s && (64512 & (r = e.charCodeAt(a + 1))) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), a++), c += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
						for (t = i.uint8array ? new Uint8Array(c) : Array(c), a = o = 0; o < c; a++) (64512 & (n = e.charCodeAt(a))) == 55296 && a + 1 < s && (64512 & (r = e.charCodeAt(a + 1))) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), a++), n < 128 ? t[o++] = n : (n < 2048 ? t[o++] = 192 | n >>> 6 : (n < 65536 ? t[o++] = 224 | n >>> 12 : (t[o++] = 240 | n >>> 18, t[o++] = 128 | n >>> 12 & 63), t[o++] = 128 | n >>> 6 & 63), t[o++] = 128 | 63 & n);
						return t;
					}(e);
				}, n.utf8decode = function(e) {
					return i.nodebuffer ? r.transformTo("nodebuffer", e).toString("utf-8") : function(e) {
						var t, n, i, a, o = e.length, c = Array(2 * o);
						for (t = n = 0; t < o;) if ((i = e[t++]) < 128) c[n++] = i;
						else if (4 < (a = s[i])) c[n++] = 65533, t += a - 1;
						else {
							for (i &= a === 2 ? 31 : a === 3 ? 15 : 7; 1 < a && t < o;) i = i << 6 | 63 & e[t++], a--;
							1 < a ? c[n++] = 65533 : i < 65536 ? c[n++] = i : (i -= 65536, c[n++] = 55296 | i >> 10 & 1023, c[n++] = 56320 | 1023 & i);
						}
						return c.length !== n && (c.subarray ? c = c.subarray(0, n) : c.length = n), r.applyFromCharCode(c);
					}(e = r.transformTo(i.uint8array ? "uint8array" : "array", e));
				}, r.inherits(l, o), l.prototype.processChunk = function(e) {
					var t = r.transformTo(i.uint8array ? "uint8array" : "array", e.data);
					if (this.leftOver && this.leftOver.length) {
						if (i.uint8array) {
							var a = t;
							(t = new Uint8Array(a.length + this.leftOver.length)).set(this.leftOver, 0), t.set(a, this.leftOver.length);
						} else t = this.leftOver.concat(t);
						this.leftOver = null;
					}
					var o = function(e, t) {
						var n;
						for ((t ||= e.length) > e.length && (t = e.length), n = t - 1; 0 <= n && (192 & e[n]) == 128;) n--;
						return n < 0 || n === 0 ? t : n + s[e[n]] > t ? n : t;
					}(t), c = t;
					o !== t.length && (i.uint8array ? (c = t.subarray(0, o), this.leftOver = t.subarray(o, t.length)) : (c = t.slice(0, o), this.leftOver = t.slice(o, t.length))), this.push({
						data: n.utf8decode(c),
						meta: e.meta
					});
				}, l.prototype.flush = function() {
					this.leftOver && this.leftOver.length && (this.push({
						data: n.utf8decode(this.leftOver),
						meta: {}
					}), this.leftOver = null);
				}, n.Utf8DecodeWorker = l, r.inherits(u, o), u.prototype.processChunk = function(e) {
					this.push({
						data: n.utf8encode(e.data),
						meta: e.meta
					});
				}, n.Utf8EncodeWorker = u;
			}, {
				"./nodejsUtils": 14,
				"./stream/GenericWorker": 28,
				"./support": 30,
				"./utils": 32
			}],
			32: [function(e, t, n) {
				var r = e("./support"), i = e("./base64"), a = e("./nodejsUtils"), o = e("./external");
				function s(e) {
					return e;
				}
				function c(e, t) {
					for (var n = 0; n < e.length; ++n) t[n] = 255 & e.charCodeAt(n);
					return t;
				}
				e("setimmediate"), n.newBlob = function(e, t) {
					n.checkSupport("blob");
					try {
						return new Blob([e], { type: t });
					} catch {
						try {
							var r = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
							return r.append(e), r.getBlob(t);
						} catch {
							throw Error("Bug : can't construct the Blob.");
						}
					}
				};
				var l = {
					stringifyByChunk: function(e, t, n) {
						var r = [], i = 0, a = e.length;
						if (a <= n) return String.fromCharCode.apply(null, e);
						for (; i < a;) t === "array" || t === "nodebuffer" ? r.push(String.fromCharCode.apply(null, e.slice(i, Math.min(i + n, a)))) : r.push(String.fromCharCode.apply(null, e.subarray(i, Math.min(i + n, a)))), i += n;
						return r.join("");
					},
					stringifyByChar: function(e) {
						for (var t = "", n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
						return t;
					},
					applyCanBeUsed: {
						uint8array: function() {
							try {
								return r.uint8array && String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1)).length === 1;
							} catch {
								return !1;
							}
						}(),
						nodebuffer: function() {
							try {
								return r.nodebuffer && String.fromCharCode.apply(null, a.allocBuffer(1)).length === 1;
							} catch {
								return !1;
							}
						}()
					}
				};
				function u(e) {
					var t = 65536, r = n.getTypeOf(e), i = !0;
					if (r === "uint8array" ? i = l.applyCanBeUsed.uint8array : r === "nodebuffer" && (i = l.applyCanBeUsed.nodebuffer), i) for (; 1 < t;) try {
						return l.stringifyByChunk(e, r, t);
					} catch {
						t = Math.floor(t / 2);
					}
					return l.stringifyByChar(e);
				}
				function d(e, t) {
					for (var n = 0; n < e.length; n++) t[n] = e[n];
					return t;
				}
				n.applyFromCharCode = u;
				var f = {};
				f.string = {
					string: s,
					array: function(e) {
						return c(e, Array(e.length));
					},
					arraybuffer: function(e) {
						return f.string.uint8array(e).buffer;
					},
					uint8array: function(e) {
						return c(e, new Uint8Array(e.length));
					},
					nodebuffer: function(e) {
						return c(e, a.allocBuffer(e.length));
					}
				}, f.array = {
					string: u,
					array: s,
					arraybuffer: function(e) {
						return new Uint8Array(e).buffer;
					},
					uint8array: function(e) {
						return new Uint8Array(e);
					},
					nodebuffer: function(e) {
						return a.newBufferFrom(e);
					}
				}, f.arraybuffer = {
					string: function(e) {
						return u(new Uint8Array(e));
					},
					array: function(e) {
						return d(new Uint8Array(e), Array(e.byteLength));
					},
					arraybuffer: s,
					uint8array: function(e) {
						return new Uint8Array(e);
					},
					nodebuffer: function(e) {
						return a.newBufferFrom(new Uint8Array(e));
					}
				}, f.uint8array = {
					string: u,
					array: function(e) {
						return d(e, Array(e.length));
					},
					arraybuffer: function(e) {
						return e.buffer;
					},
					uint8array: s,
					nodebuffer: function(e) {
						return a.newBufferFrom(e);
					}
				}, f.nodebuffer = {
					string: u,
					array: function(e) {
						return d(e, Array(e.length));
					},
					arraybuffer: function(e) {
						return f.nodebuffer.uint8array(e).buffer;
					},
					uint8array: function(e) {
						return d(e, new Uint8Array(e.length));
					},
					nodebuffer: s
				}, n.transformTo = function(e, t) {
					return t ||= "", e ? (n.checkSupport(e), f[n.getTypeOf(t)][e](t)) : t;
				}, n.resolve = function(e) {
					for (var t = e.split("/"), n = [], r = 0; r < t.length; r++) {
						var i = t[r];
						i === "." || i === "" && r !== 0 && r !== t.length - 1 || (i === ".." ? n.pop() : n.push(i));
					}
					return n.join("/");
				}, n.getTypeOf = function(e) {
					if (typeof e == "string") return "string";
					var t = Object.prototype.toString.call(e);
					return t === "[object Array]" ? "array" : r.nodebuffer && a.isBuffer(e) ? "nodebuffer" : r.uint8array && t === "[object Uint8Array]" ? "uint8array" : r.arraybuffer && t === "[object ArrayBuffer]" ? "arraybuffer" : void 0;
				}, n.checkSupport = function(e) {
					if (!r[e.toLowerCase()]) throw Error(e + " is not supported by this platform");
				}, n.MAX_VALUE_16BITS = 65535, n.MAX_VALUE_32BITS = -1, n.pretty = function(e) {
					var t, n, r = "";
					for (n = 0; n < (e || "").length; n++) r += "\\x" + ((t = e.charCodeAt(n)) < 16 ? "0" : "") + t.toString(16).toUpperCase();
					return r;
				}, n.delay = function(e, t, n) {
					setImmediate(function() {
						e.apply(n || null, t || []);
					});
				}, n.inherits = function(e, t) {
					function n() {}
					n.prototype = t.prototype, e.prototype = new n();
				}, n.extend = function() {
					var e, t, n = {};
					for (e = 0; e < arguments.length; e++) for (t in arguments[e]) Object.prototype.hasOwnProperty.call(arguments[e], t) && n[t] === void 0 && (n[t] = arguments[e][t]);
					return n;
				}, n.prepareContent = function(e, t, a, s, l) {
					return o.Promise.resolve(t).then(function(t) {
						return r.blob && (t instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(t)) !== -1) ? Blob.prototype.arrayBuffer === void 0 ? typeof FileReader < "u" ? new o.Promise(function(e, n) {
							var r = new FileReader();
							r.onload = function(t) {
								e(t.target.result);
							}, r.onerror = function(e) {
								n(e.target.error);
							}, r.readAsArrayBuffer(t);
						}) : o.Promise.reject(/* @__PURE__ */ Error(e + " is a Blob, but we have no way of reading it.")) : t.arrayBuffer() : t;
					}).then(function(t) {
						var u = n.getTypeOf(t);
						return u ? (u === "arraybuffer" ? t = n.transformTo("uint8array", t) : u === "string" && (l ? t = i.decode(t) : a && !0 !== s && (t = function(e) {
							return c(e, r.uint8array ? new Uint8Array(e.length) : Array(e.length));
						}(t))), t) : o.Promise.reject(/* @__PURE__ */ Error("Can't read the data of '" + e + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
					});
				};
			}, {
				"./base64": 1,
				"./external": 6,
				"./nodejsUtils": 14,
				"./support": 30,
				setimmediate: 54
			}],
			33: [function(e, t, n) {
				var r = e("./reader/readerFor"), i = e("./utils"), a = e("./signature"), o = e("./zipEntry"), s = e("./support");
				function c(e) {
					this.files = [], this.loadOptions = e;
				}
				c.prototype = {
					checkSignature: function(e) {
						if (!this.reader.readAndCheckSignature(e)) {
							this.reader.index -= 4;
							var t = this.reader.readString(4);
							throw Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t) + ", expected " + i.pretty(e) + ")");
						}
					},
					isSignature: function(e, t) {
						var n = this.reader.index;
						this.reader.setIndex(e);
						var r = this.reader.readString(4) === t;
						return this.reader.setIndex(n), r;
					},
					readBlockEndOfCentral: function() {
						this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
						var e = this.reader.readData(this.zipCommentLength), t = s.uint8array ? "uint8array" : "array", n = i.transformTo(t, e);
						this.zipComment = this.loadOptions.decodeFileName(n);
					},
					readBlockZip64EndOfCentral: function() {
						this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
						for (var e, t, n, r = this.zip64EndOfCentralSize - 44; 0 < r;) e = this.reader.readInt(2), t = this.reader.readInt(4), n = this.reader.readData(t), this.zip64ExtensibleData[e] = {
							id: e,
							length: t,
							value: n
						};
					},
					readBlockZip64EndOfCentralLocator: function() {
						if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw Error("Multi-volumes zip are not supported");
					},
					readLocalFiles: function() {
						for (var e = 0, t; e < this.files.length; e++) t = this.files[e], this.reader.setIndex(t.localHeaderOffset), this.checkSignature(a.LOCAL_FILE_HEADER), t.readLocalPart(this.reader), t.handleUTF8(), t.processAttributes();
					},
					readCentralDir: function() {
						var e;
						for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);) (e = new o({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e);
						if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
					},
					readEndOfCentral: function() {
						var e = this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);
						if (e < 0) throw this.isSignature(0, a.LOCAL_FILE_HEADER) ? /* @__PURE__ */ Error("Corrupted zip: can't find end of central directory") : /* @__PURE__ */ Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
						this.reader.setIndex(e);
						var t = e;
						if (this.checkSignature(a.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
							if (this.zip64 = !0, (e = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
							if (this.reader.setIndex(e), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, a.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw Error("Corrupted zip: can't find the ZIP64 end of central directory");
							this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
						}
						var n = this.centralDirOffset + this.centralDirSize;
						this.zip64 && (n += 20, n += 12 + this.zip64EndOfCentralSize);
						var r = t - n;
						if (0 < r) this.isSignature(t, a.CENTRAL_FILE_HEADER) || (this.reader.zero = r);
						else if (r < 0) throw Error("Corrupted zip: missing " + Math.abs(r) + " bytes.");
					},
					prepareReader: function(e) {
						this.reader = r(e);
					},
					load: function(e) {
						this.prepareReader(e), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
					}
				}, t.exports = c;
			}, {
				"./reader/readerFor": 22,
				"./signature": 23,
				"./support": 30,
				"./utils": 32,
				"./zipEntry": 34
			}],
			34: [function(e, t, n) {
				var r = e("./reader/readerFor"), i = e("./utils"), a = e("./compressedObject"), o = e("./crc32"), s = e("./utf8"), c = e("./compressions"), l = e("./support");
				function u(e, t) {
					this.options = e, this.loadOptions = t;
				}
				u.prototype = {
					isEncrypted: function() {
						return (1 & this.bitFlag) == 1;
					},
					useUTF8: function() {
						return (2048 & this.bitFlag) == 2048;
					},
					readLocalPart: function(e) {
						var t, n;
						if (e.skip(22), this.fileNameLength = e.readInt(2), n = e.readInt(2), this.fileName = e.readData(this.fileNameLength), e.skip(n), this.compressedSize === -1 || this.uncompressedSize === -1) throw Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
						if ((t = function(e) {
							for (var t in c) if (Object.prototype.hasOwnProperty.call(c, t) && c[t].magic === e) return c[t];
							return null;
						}(this.compressionMethod)) === null) throw Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
						this.decompressed = new a(this.compressedSize, this.uncompressedSize, this.crc32, t, e.readData(this.compressedSize));
					},
					readCentralPart: function(e) {
						this.versionMadeBy = e.readInt(2), e.skip(2), this.bitFlag = e.readInt(2), this.compressionMethod = e.readString(2), this.date = e.readDate(), this.crc32 = e.readInt(4), this.compressedSize = e.readInt(4), this.uncompressedSize = e.readInt(4);
						var t = e.readInt(2);
						if (this.extraFieldsLength = e.readInt(2), this.fileCommentLength = e.readInt(2), this.diskNumberStart = e.readInt(2), this.internalFileAttributes = e.readInt(2), this.externalFileAttributes = e.readInt(4), this.localHeaderOffset = e.readInt(4), this.isEncrypted()) throw Error("Encrypted zip are not supported");
						e.skip(t), this.readExtraFields(e), this.parseZIP64ExtraField(e), this.fileComment = e.readData(this.fileCommentLength);
					},
					processAttributes: function() {
						this.unixPermissions = null, this.dosPermissions = null;
						var e = this.versionMadeBy >> 8;
						this.dir = !!(16 & this.externalFileAttributes), e == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), e == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
					},
					parseZIP64ExtraField: function() {
						if (this.extraFields[1]) {
							var e = r(this.extraFields[1].value);
							this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4));
						}
					},
					readExtraFields: function(e) {
						var t, n, r, i = e.index + this.extraFieldsLength;
						for (this.extraFields ||= {}; e.index + 4 < i;) t = e.readInt(2), n = e.readInt(2), r = e.readData(n), this.extraFields[t] = {
							id: t,
							length: n,
							value: r
						};
						e.setIndex(i);
					},
					handleUTF8: function() {
						var e = l.uint8array ? "uint8array" : "array";
						if (this.useUTF8()) this.fileNameStr = s.utf8decode(this.fileName), this.fileCommentStr = s.utf8decode(this.fileComment);
						else {
							var t = this.findExtraFieldUnicodePath();
							if (t !== null) this.fileNameStr = t;
							else {
								var n = i.transformTo(e, this.fileName);
								this.fileNameStr = this.loadOptions.decodeFileName(n);
							}
							var r = this.findExtraFieldUnicodeComment();
							if (r !== null) this.fileCommentStr = r;
							else {
								var a = i.transformTo(e, this.fileComment);
								this.fileCommentStr = this.loadOptions.decodeFileName(a);
							}
						}
					},
					findExtraFieldUnicodePath: function() {
						var e = this.extraFields[28789];
						if (e) {
							var t = r(e.value);
							return t.readInt(1) === 1 && o(this.fileName) === t.readInt(4) ? s.utf8decode(t.readData(e.length - 5)) : null;
						}
						return null;
					},
					findExtraFieldUnicodeComment: function() {
						var e = this.extraFields[25461];
						if (e) {
							var t = r(e.value);
							return t.readInt(1) === 1 && o(this.fileComment) === t.readInt(4) ? s.utf8decode(t.readData(e.length - 5)) : null;
						}
						return null;
					}
				}, t.exports = u;
			}, {
				"./compressedObject": 2,
				"./compressions": 3,
				"./crc32": 4,
				"./reader/readerFor": 22,
				"./support": 30,
				"./utf8": 31,
				"./utils": 32
			}],
			35: [function(e, t, n) {
				function r(e, t, n) {
					this.name = e, this.dir = n.dir, this.date = n.date, this.comment = n.comment, this.unixPermissions = n.unixPermissions, this.dosPermissions = n.dosPermissions, this._data = t, this._dataBinary = n.binary, this.options = {
						compression: n.compression,
						compressionOptions: n.compressionOptions
					};
				}
				var i = e("./stream/StreamHelper"), a = e("./stream/DataWorker"), o = e("./utf8"), s = e("./compressedObject"), c = e("./stream/GenericWorker");
				r.prototype = {
					internalStream: function(e) {
						var t = null, n = "string";
						try {
							if (!e) throw Error("No output type specified.");
							var r = (n = e.toLowerCase()) === "string" || n === "text";
							n !== "binarystring" && n !== "text" || (n = "string"), t = this._decompressWorker();
							var a = !this._dataBinary;
							a && !r && (t = t.pipe(new o.Utf8EncodeWorker())), !a && r && (t = t.pipe(new o.Utf8DecodeWorker()));
						} catch (e) {
							(t = new c("error")).error(e);
						}
						return new i(t, n, "");
					},
					async: function(e, t) {
						return this.internalStream(e).accumulate(t);
					},
					nodeStream: function(e, t) {
						return this.internalStream(e || "nodebuffer").toNodejsStream(t);
					},
					_compressWorker: function(e, t) {
						if (this._data instanceof s && this._data.compression.magic === e.magic) return this._data.getCompressedWorker();
						var n = this._decompressWorker();
						return this._dataBinary || (n = n.pipe(new o.Utf8EncodeWorker())), s.createWorkerFrom(n, e, t);
					},
					_decompressWorker: function() {
						return this._data instanceof s ? this._data.getContentWorker() : this._data instanceof c ? this._data : new a(this._data);
					}
				};
				for (var l = [
					"asText",
					"asBinary",
					"asNodeBuffer",
					"asUint8Array",
					"asArrayBuffer"
				], u = function() {
					throw Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
				}, d = 0; d < l.length; d++) r.prototype[l[d]] = u;
				t.exports = r;
			}, {
				"./compressedObject": 2,
				"./stream/DataWorker": 27,
				"./stream/GenericWorker": 28,
				"./stream/StreamHelper": 29,
				"./utf8": 31
			}],
			36: [function(e, t, n) {
				(function(e) {
					var n, r, i = e.MutationObserver || e.WebKitMutationObserver;
					if (i) {
						var a = 0, o = new i(u), s = e.document.createTextNode("");
						o.observe(s, { characterData: !0 }), n = function() {
							s.data = a = ++a % 2;
						};
					} else if (e.setImmediate || e.MessageChannel === void 0) n = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function() {
						var t = e.document.createElement("script");
						t.onreadystatechange = function() {
							u(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null;
						}, e.document.documentElement.appendChild(t);
					} : function() {
						setTimeout(u, 0);
					};
					else {
						var c = new e.MessageChannel();
						c.port1.onmessage = u, n = function() {
							c.port2.postMessage(0);
						};
					}
					var l = [];
					function u() {
						var e, t;
						r = !0;
						for (var n = l.length; n;) {
							for (t = l, l = [], e = -1; ++e < n;) t[e]();
							n = l.length;
						}
						r = !1;
					}
					t.exports = function(e) {
						l.push(e) !== 1 || r || n();
					};
				}).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {});
			}, {}],
			37: [function(e, t, n) {
				var r = e("immediate");
				function i() {}
				var a = {}, o = ["REJECTED"], s = ["FULFILLED"], c = ["PENDING"];
				function l(e) {
					if (typeof e != "function") throw TypeError("resolver must be a function");
					this.state = c, this.queue = [], this.outcome = void 0, e !== i && p(this, e);
				}
				function u(e, t, n) {
					this.promise = e, typeof t == "function" && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), typeof n == "function" && (this.onRejected = n, this.callRejected = this.otherCallRejected);
				}
				function d(e, t, n) {
					r(function() {
						var r;
						try {
							r = t(n);
						} catch (t) {
							return a.reject(e, t);
						}
						r === e ? a.reject(e, /* @__PURE__ */ TypeError("Cannot resolve promise with itself")) : a.resolve(e, r);
					});
				}
				function f(e) {
					var t = e && e.then;
					if (e && (typeof e == "object" || typeof e == "function") && typeof t == "function") return function() {
						t.apply(e, arguments);
					};
				}
				function p(e, t) {
					var n = !1;
					function r(t) {
						n || (n = !0, a.reject(e, t));
					}
					function i(t) {
						n || (n = !0, a.resolve(e, t));
					}
					var o = m(function() {
						t(i, r);
					});
					o.status === "error" && r(o.value);
				}
				function m(e, t) {
					var n = {};
					try {
						n.value = e(t), n.status = "success";
					} catch (e) {
						n.status = "error", n.value = e;
					}
					return n;
				}
				(t.exports = l).prototype.finally = function(e) {
					if (typeof e != "function") return this;
					var t = this.constructor;
					return this.then(function(n) {
						return t.resolve(e()).then(function() {
							return n;
						});
					}, function(n) {
						return t.resolve(e()).then(function() {
							throw n;
						});
					});
				}, l.prototype.catch = function(e) {
					return this.then(null, e);
				}, l.prototype.then = function(e, t) {
					if (typeof e != "function" && this.state === s || typeof t != "function" && this.state === o) return this;
					var n = new this.constructor(i);
					return this.state === c ? this.queue.push(new u(n, e, t)) : d(n, this.state === s ? e : t, this.outcome), n;
				}, u.prototype.callFulfilled = function(e) {
					a.resolve(this.promise, e);
				}, u.prototype.otherCallFulfilled = function(e) {
					d(this.promise, this.onFulfilled, e);
				}, u.prototype.callRejected = function(e) {
					a.reject(this.promise, e);
				}, u.prototype.otherCallRejected = function(e) {
					d(this.promise, this.onRejected, e);
				}, a.resolve = function(e, t) {
					var n = m(f, t);
					if (n.status === "error") return a.reject(e, n.value);
					var r = n.value;
					if (r) p(e, r);
					else {
						e.state = s, e.outcome = t;
						for (var i = -1, o = e.queue.length; ++i < o;) e.queue[i].callFulfilled(t);
					}
					return e;
				}, a.reject = function(e, t) {
					e.state = o, e.outcome = t;
					for (var n = -1, r = e.queue.length; ++n < r;) e.queue[n].callRejected(t);
					return e;
				}, l.resolve = function(e) {
					return e instanceof this ? e : a.resolve(new this(i), e);
				}, l.reject = function(e) {
					var t = new this(i);
					return a.reject(t, e);
				}, l.all = function(e) {
					var t = this;
					if (Object.prototype.toString.call(e) !== "[object Array]") return this.reject(/* @__PURE__ */ TypeError("must be an array"));
					var n = e.length, r = !1;
					if (!n) return this.resolve([]);
					for (var o = Array(n), s = 0, c = -1, l = new this(i); ++c < n;) u(e[c], c);
					return l;
					function u(e, i) {
						t.resolve(e).then(function(e) {
							o[i] = e, ++s !== n || r || (r = !0, a.resolve(l, o));
						}, function(e) {
							r || (r = !0, a.reject(l, e));
						});
					}
				}, l.race = function(e) {
					var t = this;
					if (Object.prototype.toString.call(e) !== "[object Array]") return this.reject(/* @__PURE__ */ TypeError("must be an array"));
					var n = e.length, r = !1;
					if (!n) return this.resolve([]);
					for (var o = -1, s = new this(i); ++o < n;) c = e[o], t.resolve(c).then(function(e) {
						r || (r = !0, a.resolve(s, e));
					}, function(e) {
						r || (r = !0, a.reject(s, e));
					});
					var c;
					return s;
				};
			}, { immediate: 36 }],
			38: [function(e, t, n) {
				var r = {};
				(0, e("./lib/utils/common").assign)(r, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = r;
			}, {
				"./lib/deflate": 39,
				"./lib/inflate": 40,
				"./lib/utils/common": 41,
				"./lib/zlib/constants": 44
			}],
			39: [function(e, t, n) {
				var r = e("./zlib/deflate"), i = e("./utils/common"), a = e("./utils/strings"), o = e("./zlib/messages"), s = e("./zlib/zstream"), c = Object.prototype.toString, l = 0, u = -1, d = 0, f = 8;
				function p(e) {
					if (!(this instanceof p)) return new p(e);
					this.options = i.assign({
						level: u,
						method: f,
						chunkSize: 16384,
						windowBits: 15,
						memLevel: 8,
						strategy: d,
						to: ""
					}, e || {});
					var t = this.options;
					t.raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
					var n = r.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
					if (n !== l) throw Error(o[n]);
					if (t.header && r.deflateSetHeader(this.strm, t.header), t.dictionary) {
						var m = typeof t.dictionary == "string" ? a.string2buf(t.dictionary) : c.call(t.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(t.dictionary) : t.dictionary;
						if ((n = r.deflateSetDictionary(this.strm, m)) !== l) throw Error(o[n]);
						this._dict_set = !0;
					}
				}
				function m(e, t) {
					var n = new p(t);
					if (n.push(e, !0), n.err) throw n.msg || o[n.err];
					return n.result;
				}
				p.prototype.push = function(e, t) {
					var n, o, s = this.strm, u = this.options.chunkSize;
					if (this.ended) return !1;
					o = t === ~~t ? t : !0 === t ? 4 : 0, s.input = typeof e == "string" ? a.string2buf(e) : c.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, s.next_in = 0, s.avail_in = s.input.length;
					do {
						if (s.avail_out === 0 && (s.output = new i.Buf8(u), s.next_out = 0, s.avail_out = u), (n = r.deflate(s, o)) !== 1 && n !== l) return this.onEnd(n), !(this.ended = !0);
						s.avail_out !== 0 && (s.avail_in !== 0 || o !== 4 && o !== 2) || (this.options.to === "string" ? this.onData(a.buf2binstring(i.shrinkBuf(s.output, s.next_out))) : this.onData(i.shrinkBuf(s.output, s.next_out)));
					} while ((0 < s.avail_in || s.avail_out === 0) && n !== 1);
					return o === 4 ? (n = r.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === l) : o !== 2 || (this.onEnd(l), !(s.avail_out = 0));
				}, p.prototype.onData = function(e) {
					this.chunks.push(e);
				}, p.prototype.onEnd = function(e) {
					e === l && (this.result = this.options.to === "string" ? this.chunks.join("") : i.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
				}, n.Deflate = p, n.deflate = m, n.deflateRaw = function(e, t) {
					return (t ||= {}).raw = !0, m(e, t);
				}, n.gzip = function(e, t) {
					return (t ||= {}).gzip = !0, m(e, t);
				};
			}, {
				"./utils/common": 41,
				"./utils/strings": 42,
				"./zlib/deflate": 46,
				"./zlib/messages": 51,
				"./zlib/zstream": 53
			}],
			40: [function(e, t, n) {
				var r = e("./zlib/inflate"), i = e("./utils/common"), a = e("./utils/strings"), o = e("./zlib/constants"), s = e("./zlib/messages"), c = e("./zlib/zstream"), l = e("./zlib/gzheader"), u = Object.prototype.toString;
				function d(e) {
					if (!(this instanceof d)) return new d(e);
					this.options = i.assign({
						chunkSize: 16384,
						windowBits: 0,
						to: ""
					}, e || {});
					var t = this.options;
					t.raw && 0 <= t.windowBits && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), !(0 <= t.windowBits && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), 15 < t.windowBits && t.windowBits < 48 && !(15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new c(), this.strm.avail_out = 0;
					var n = r.inflateInit2(this.strm, t.windowBits);
					if (n !== o.Z_OK) throw Error(s[n]);
					this.header = new l(), r.inflateGetHeader(this.strm, this.header);
				}
				function f(e, t) {
					var n = new d(t);
					if (n.push(e, !0), n.err) throw n.msg || s[n.err];
					return n.result;
				}
				d.prototype.push = function(e, t) {
					var n, s, c, l, d, f, p = this.strm, m = this.options.chunkSize, h = this.options.dictionary, g = !1;
					if (this.ended) return !1;
					s = t === ~~t ? t : !0 === t ? o.Z_FINISH : o.Z_NO_FLUSH, p.input = typeof e == "string" ? a.binstring2buf(e) : u.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, p.next_in = 0, p.avail_in = p.input.length;
					do {
						if (p.avail_out === 0 && (p.output = new i.Buf8(m), p.next_out = 0, p.avail_out = m), (n = r.inflate(p, o.Z_NO_FLUSH)) === o.Z_NEED_DICT && h && (f = typeof h == "string" ? a.string2buf(h) : u.call(h) === "[object ArrayBuffer]" ? new Uint8Array(h) : h, n = r.inflateSetDictionary(this.strm, f)), n === o.Z_BUF_ERROR && !0 === g && (n = o.Z_OK, g = !1), n !== o.Z_STREAM_END && n !== o.Z_OK) return this.onEnd(n), !(this.ended = !0);
						p.next_out && (p.avail_out !== 0 && n !== o.Z_STREAM_END && (p.avail_in !== 0 || s !== o.Z_FINISH && s !== o.Z_SYNC_FLUSH) || (this.options.to === "string" ? (c = a.utf8border(p.output, p.next_out), l = p.next_out - c, d = a.buf2string(p.output, c), p.next_out = l, p.avail_out = m - l, l && i.arraySet(p.output, p.output, c, l, 0), this.onData(d)) : this.onData(i.shrinkBuf(p.output, p.next_out)))), p.avail_in === 0 && p.avail_out === 0 && (g = !0);
					} while ((0 < p.avail_in || p.avail_out === 0) && n !== o.Z_STREAM_END);
					return n === o.Z_STREAM_END && (s = o.Z_FINISH), s === o.Z_FINISH ? (n = r.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === o.Z_OK) : s !== o.Z_SYNC_FLUSH || (this.onEnd(o.Z_OK), !(p.avail_out = 0));
				}, d.prototype.onData = function(e) {
					this.chunks.push(e);
				}, d.prototype.onEnd = function(e) {
					e === o.Z_OK && (this.result = this.options.to === "string" ? this.chunks.join("") : i.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
				}, n.Inflate = d, n.inflate = f, n.inflateRaw = function(e, t) {
					return (t ||= {}).raw = !0, f(e, t);
				}, n.ungzip = f;
			}, {
				"./utils/common": 41,
				"./utils/strings": 42,
				"./zlib/constants": 44,
				"./zlib/gzheader": 47,
				"./zlib/inflate": 49,
				"./zlib/messages": 51,
				"./zlib/zstream": 53
			}],
			41: [function(e, t, n) {
				var r = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
				n.assign = function(e) {
					for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
						var n = t.shift();
						if (n) {
							if (typeof n != "object") throw TypeError(n + "must be non-object");
							for (var r in n) n.hasOwnProperty(r) && (e[r] = n[r]);
						}
					}
					return e;
				}, n.shrinkBuf = function(e, t) {
					return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e);
				};
				var i = {
					arraySet: function(e, t, n, r, i) {
						if (t.subarray && e.subarray) e.set(t.subarray(n, n + r), i);
						else for (var a = 0; a < r; a++) e[i + a] = t[n + a];
					},
					flattenChunks: function(e) {
						for (var t = r = 0, n = e.length, r, i, a, o; t < n; t++) r += e[t].length;
						for (o = new Uint8Array(r), t = i = 0, n = e.length; t < n; t++) a = e[t], o.set(a, i), i += a.length;
						return o;
					}
				}, a = {
					arraySet: function(e, t, n, r, i) {
						for (var a = 0; a < r; a++) e[i + a] = t[n + a];
					},
					flattenChunks: function(e) {
						return [].concat.apply([], e);
					}
				};
				n.setTyped = function(e) {
					e ? (n.Buf8 = Uint8Array, n.Buf16 = Uint16Array, n.Buf32 = Int32Array, n.assign(n, i)) : (n.Buf8 = Array, n.Buf16 = Array, n.Buf32 = Array, n.assign(n, a));
				}, n.setTyped(r);
			}, {}],
			42: [function(e, t, n) {
				var r = e("./common"), i = !0, a = !0;
				try {
					String.fromCharCode.apply(null, [0]);
				} catch {
					i = !1;
				}
				try {
					String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
				} catch {
					a = !1;
				}
				for (var o = new r.Buf8(256), s = 0; s < 256; s++) o[s] = 252 <= s ? 6 : 248 <= s ? 5 : 240 <= s ? 4 : 224 <= s ? 3 : 192 <= s ? 2 : 1;
				function c(e, t) {
					if (t < 65537 && (e.subarray && a || !e.subarray && i)) return String.fromCharCode.apply(null, r.shrinkBuf(e, t));
					for (var n = "", o = 0; o < t; o++) n += String.fromCharCode(e[o]);
					return n;
				}
				o[254] = o[254] = 1, n.string2buf = function(e) {
					var t, n, i, a, o, s = e.length, c = 0;
					for (a = 0; a < s; a++) (64512 & (n = e.charCodeAt(a))) == 55296 && a + 1 < s && (64512 & (i = e.charCodeAt(a + 1))) == 56320 && (n = 65536 + (n - 55296 << 10) + (i - 56320), a++), c += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
					for (t = new r.Buf8(c), a = o = 0; o < c; a++) (64512 & (n = e.charCodeAt(a))) == 55296 && a + 1 < s && (64512 & (i = e.charCodeAt(a + 1))) == 56320 && (n = 65536 + (n - 55296 << 10) + (i - 56320), a++), n < 128 ? t[o++] = n : (n < 2048 ? t[o++] = 192 | n >>> 6 : (n < 65536 ? t[o++] = 224 | n >>> 12 : (t[o++] = 240 | n >>> 18, t[o++] = 128 | n >>> 12 & 63), t[o++] = 128 | n >>> 6 & 63), t[o++] = 128 | 63 & n);
					return t;
				}, n.buf2binstring = function(e) {
					return c(e, e.length);
				}, n.binstring2buf = function(e) {
					for (var t = new r.Buf8(e.length), n = 0, i = t.length; n < i; n++) t[n] = e.charCodeAt(n);
					return t;
				}, n.buf2string = function(e, t) {
					var n, r, i, a, s = t || e.length, l = Array(2 * s);
					for (n = r = 0; n < s;) if ((i = e[n++]) < 128) l[r++] = i;
					else if (4 < (a = o[i])) l[r++] = 65533, n += a - 1;
					else {
						for (i &= a === 2 ? 31 : a === 3 ? 15 : 7; 1 < a && n < s;) i = i << 6 | 63 & e[n++], a--;
						1 < a ? l[r++] = 65533 : i < 65536 ? l[r++] = i : (i -= 65536, l[r++] = 55296 | i >> 10 & 1023, l[r++] = 56320 | 1023 & i);
					}
					return c(l, r);
				}, n.utf8border = function(e, t) {
					var n;
					for ((t ||= e.length) > e.length && (t = e.length), n = t - 1; 0 <= n && (192 & e[n]) == 128;) n--;
					return n < 0 || n === 0 ? t : n + o[e[n]] > t ? n : t;
				};
			}, { "./common": 41 }],
			43: [function(e, t, n) {
				t.exports = function(e, t, n, r) {
					for (var i = 65535 & e, a = e >>> 16 & 65535, o = 0; n !== 0;) {
						for (n -= o = 2e3 < n ? 2e3 : n; a = a + (i = i + t[r++] | 0) | 0, --o;);
						i %= 65521, a %= 65521;
					}
					return i | a << 16;
				};
			}, {}],
			44: [function(e, t, n) {
				t.exports = {
					Z_NO_FLUSH: 0,
					Z_PARTIAL_FLUSH: 1,
					Z_SYNC_FLUSH: 2,
					Z_FULL_FLUSH: 3,
					Z_FINISH: 4,
					Z_BLOCK: 5,
					Z_TREES: 6,
					Z_OK: 0,
					Z_STREAM_END: 1,
					Z_NEED_DICT: 2,
					Z_ERRNO: -1,
					Z_STREAM_ERROR: -2,
					Z_DATA_ERROR: -3,
					Z_BUF_ERROR: -5,
					Z_NO_COMPRESSION: 0,
					Z_BEST_SPEED: 1,
					Z_BEST_COMPRESSION: 9,
					Z_DEFAULT_COMPRESSION: -1,
					Z_FILTERED: 1,
					Z_HUFFMAN_ONLY: 2,
					Z_RLE: 3,
					Z_FIXED: 4,
					Z_DEFAULT_STRATEGY: 0,
					Z_BINARY: 0,
					Z_TEXT: 1,
					Z_UNKNOWN: 2,
					Z_DEFLATED: 8
				};
			}, {}],
			45: [function(e, t, n) {
				var r = function() {
					for (var e, t = [], n = 0; n < 256; n++) {
						e = n;
						for (var r = 0; r < 8; r++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
						t[n] = e;
					}
					return t;
				}();
				t.exports = function(e, t, n, i) {
					var a = r, o = i + n;
					e ^= -1;
					for (var s = i; s < o; s++) e = e >>> 8 ^ a[255 & (e ^ t[s])];
					return -1 ^ e;
				};
			}, {}],
			46: [function(e, t, n) {
				var r, i = e("../utils/common"), a = e("./trees"), o = e("./adler32"), s = e("./crc32"), c = e("./messages"), l = 0, u = 4, d = 0, f = -2, p = -1, m = 4, h = 2, g = 8, _ = 9, v = 286, y = 30, b = 19, x = 2 * v + 1, S = 15, C = 3, w = 258, T = w + C + 1, E = 42, D = 113, O = 1, k = 2, A = 3, j = 4;
				function M(e, t) {
					return e.msg = c[t], t;
				}
				function N(e) {
					return (e << 1) - (4 < e ? 9 : 0);
				}
				function P(e) {
					for (var t = e.length; 0 <= --t;) e[t] = 0;
				}
				function F(e) {
					var t = e.state, n = t.pending;
					n > e.avail_out && (n = e.avail_out), n !== 0 && (i.arraySet(e.output, t.pending_buf, t.pending_out, n, e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, t.pending === 0 && (t.pending_out = 0));
				}
				function I(e, t) {
					a._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, F(e.strm);
				}
				function L(e, t) {
					e.pending_buf[e.pending++] = t;
				}
				function R(e, t) {
					e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t;
				}
				function z(e, t) {
					var n, r, i = e.max_chain_length, a = e.strstart, o = e.prev_length, s = e.nice_match, c = e.strstart > e.w_size - T ? e.strstart - (e.w_size - T) : 0, l = e.window, u = e.w_mask, d = e.prev, f = e.strstart + w, p = l[a + o - 1], m = l[a + o];
					e.prev_length >= e.good_match && (i >>= 2), s > e.lookahead && (s = e.lookahead);
					do
						if (l[(n = t) + o] === m && l[n + o - 1] === p && l[n] === l[a] && l[++n] === l[a + 1]) {
							a += 2, n++;
							do;
							while (l[++a] === l[++n] && l[++a] === l[++n] && l[++a] === l[++n] && l[++a] === l[++n] && l[++a] === l[++n] && l[++a] === l[++n] && l[++a] === l[++n] && l[++a] === l[++n] && a < f);
							if (r = w - (f - a), a = f - w, o < r) {
								if (e.match_start = t, s <= (o = r)) break;
								p = l[a + o - 1], m = l[a + o];
							}
						}
					while ((t = d[t & u]) > c && --i != 0);
					return o <= e.lookahead ? o : e.lookahead;
				}
				function B(e) {
					var t, n, r, a, c, l, u, d, f, p, m = e.w_size;
					do {
						if (a = e.window_size - e.lookahead - e.strstart, e.strstart >= m + (m - T)) {
							for (i.arraySet(e.window, e.window, m, m, 0), e.match_start -= m, e.strstart -= m, e.block_start -= m, t = n = e.hash_size; r = e.head[--t], e.head[t] = m <= r ? r - m : 0, --n;);
							for (t = n = m; r = e.prev[--t], e.prev[t] = m <= r ? r - m : 0, --n;);
							a += m;
						}
						if (e.strm.avail_in === 0) break;
						if (l = e.strm, u = e.window, d = e.strstart + e.lookahead, f = a, p = void 0, p = l.avail_in, f < p && (p = f), n = p === 0 ? 0 : (l.avail_in -= p, i.arraySet(u, l.input, l.next_in, p, d), l.state.wrap === 1 ? l.adler = o(l.adler, u, p, d) : l.state.wrap === 2 && (l.adler = s(l.adler, u, p, d)), l.next_in += p, l.total_in += p, p), e.lookahead += n, e.lookahead + e.insert >= C) for (c = e.strstart - e.insert, e.ins_h = e.window[c], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[c + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[c + C - 1]) & e.hash_mask, e.prev[c & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = c, c++, e.insert--, !(e.lookahead + e.insert < C)););
					} while (e.lookahead < T && e.strm.avail_in !== 0);
				}
				function V(e, t) {
					for (var n, r;;) {
						if (e.lookahead < T) {
							if (B(e), e.lookahead < T && t === l) return O;
							if (e.lookahead === 0) break;
						}
						if (n = 0, e.lookahead >= C && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + C - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), n !== 0 && e.strstart - n <= e.w_size - T && (e.match_length = z(e, n)), e.match_length >= C) {
							if (r = a._tr_tally(e, e.strstart - e.match_start, e.match_length - C), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= C) {
								for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + C - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, --e.match_length != 0;);
								e.strstart++;
							} else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
						} else r = a._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
						if (r && (I(e, !1), e.strm.avail_out === 0)) return O;
					}
					return e.insert = e.strstart < C - 1 ? e.strstart : C - 1, t === u ? (I(e, !0), e.strm.avail_out === 0 ? A : j) : e.last_lit && (I(e, !1), e.strm.avail_out === 0) ? O : k;
				}
				function H(e, t) {
					for (var n, r, i;;) {
						if (e.lookahead < T) {
							if (B(e), e.lookahead < T && t === l) return O;
							if (e.lookahead === 0) break;
						}
						if (n = 0, e.lookahead >= C && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + C - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = C - 1, n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - T && (e.match_length = z(e, n), e.match_length <= 5 && (e.strategy === 1 || e.match_length === C && 4096 < e.strstart - e.match_start) && (e.match_length = C - 1)), e.prev_length >= C && e.match_length <= e.prev_length) {
							for (i = e.strstart + e.lookahead - C, r = a._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - C), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= i && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + C - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), --e.prev_length != 0;);
							if (e.match_available = 0, e.match_length = C - 1, e.strstart++, r && (I(e, !1), e.strm.avail_out === 0)) return O;
						} else if (e.match_available) {
							if ((r = a._tr_tally(e, 0, e.window[e.strstart - 1])) && I(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return O;
						} else e.match_available = 1, e.strstart++, e.lookahead--;
					}
					return e.match_available &&= (r = a._tr_tally(e, 0, e.window[e.strstart - 1]), 0), e.insert = e.strstart < C - 1 ? e.strstart : C - 1, t === u ? (I(e, !0), e.strm.avail_out === 0 ? A : j) : e.last_lit && (I(e, !1), e.strm.avail_out === 0) ? O : k;
				}
				function U(e, t, n, r, i) {
					this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = i;
				}
				function ee() {
					this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = g, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * x), this.dyn_dtree = new i.Buf16(2 * (2 * y + 1)), this.bl_tree = new i.Buf16(2 * (2 * b + 1)), P(this.dyn_ltree), P(this.dyn_dtree), P(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(S + 1), this.heap = new i.Buf16(2 * v + 1), P(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * v + 1), P(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
				}
				function te(e) {
					var t;
					return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = h, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? E : D, e.adler = t.wrap === 2 ? 0 : 1, t.last_flush = l, a._tr_init(t), d) : M(e, f);
				}
				function ne(e) {
					var t = te(e);
					return t === d && function(e) {
						e.window_size = 2 * e.w_size, P(e.head), e.max_lazy_match = r[e.level].max_lazy, e.good_match = r[e.level].good_length, e.nice_match = r[e.level].nice_length, e.max_chain_length = r[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = C - 1, e.match_available = 0, e.ins_h = 0;
					}(e.state), t;
				}
				function re(e, t, n, r, a, o) {
					if (!e) return f;
					var s = 1;
					if (t === p && (t = 6), r < 0 ? (s = 0, r = -r) : 15 < r && (s = 2, r -= 16), a < 1 || _ < a || n !== g || r < 8 || 15 < r || t < 0 || 9 < t || o < 0 || m < o) return M(e, f);
					r === 8 && (r = 9);
					var c = new ee();
					return (e.state = c).strm = e, c.wrap = s, c.gzhead = null, c.w_bits = r, c.w_size = 1 << c.w_bits, c.w_mask = c.w_size - 1, c.hash_bits = a + 7, c.hash_size = 1 << c.hash_bits, c.hash_mask = c.hash_size - 1, c.hash_shift = ~~((c.hash_bits + C - 1) / C), c.window = new i.Buf8(2 * c.w_size), c.head = new i.Buf16(c.hash_size), c.prev = new i.Buf16(c.w_size), c.lit_bufsize = 1 << a + 6, c.pending_buf_size = 4 * c.lit_bufsize, c.pending_buf = new i.Buf8(c.pending_buf_size), c.d_buf = 1 * c.lit_bufsize, c.l_buf = 3 * c.lit_bufsize, c.level = t, c.strategy = o, c.method = n, ne(e);
				}
				r = [
					new U(0, 0, 0, 0, function(e, t) {
						var n = 65535;
						for (n > e.pending_buf_size - 5 && (n = e.pending_buf_size - 5);;) {
							if (e.lookahead <= 1) {
								if (B(e), e.lookahead === 0 && t === l) return O;
								if (e.lookahead === 0) break;
							}
							e.strstart += e.lookahead, e.lookahead = 0;
							var r = e.block_start + n;
							if ((e.strstart === 0 || e.strstart >= r) && (e.lookahead = e.strstart - r, e.strstart = r, I(e, !1), e.strm.avail_out === 0) || e.strstart - e.block_start >= e.w_size - T && (I(e, !1), e.strm.avail_out === 0)) return O;
						}
						return e.insert = 0, t === u ? (I(e, !0), e.strm.avail_out === 0 ? A : j) : (e.strstart > e.block_start && (I(e, !1), e.strm.avail_out), O);
					}),
					new U(4, 4, 8, 4, V),
					new U(4, 5, 16, 8, V),
					new U(4, 6, 32, 32, V),
					new U(4, 4, 16, 16, H),
					new U(8, 16, 32, 32, H),
					new U(8, 16, 128, 128, H),
					new U(8, 32, 128, 256, H),
					new U(32, 128, 258, 1024, H),
					new U(32, 258, 258, 4096, H)
				], n.deflateInit = function(e, t) {
					return re(e, t, g, 15, 8, 0);
				}, n.deflateInit2 = re, n.deflateReset = ne, n.deflateResetKeep = te, n.deflateSetHeader = function(e, t) {
					return e && e.state && e.state.wrap === 2 ? (e.state.gzhead = t, d) : f;
				}, n.deflate = function(e, t) {
					var n, i, o, c;
					if (!e || !e.state || 5 < t || t < 0) return e ? M(e, f) : f;
					if (i = e.state, !e.output || !e.input && e.avail_in !== 0 || i.status === 666 && t !== u) return M(e, e.avail_out === 0 ? -5 : f);
					if (i.strm = e, n = i.last_flush, i.last_flush = t, i.status === E) {
						if (i.wrap === 2) e.adler = 0, L(i, 31), L(i, 139), L(i, 8), i.gzhead ? (L(i, +!!i.gzhead.text + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), L(i, 255 & i.gzhead.time), L(i, i.gzhead.time >> 8 & 255), L(i, i.gzhead.time >> 16 & 255), L(i, i.gzhead.time >> 24 & 255), L(i, i.level === 9 ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), L(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (L(i, 255 & i.gzhead.extra.length), L(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (e.adler = s(e.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = 69) : (L(i, 0), L(i, 0), L(i, 0), L(i, 0), L(i, 0), L(i, i.level === 9 ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), L(i, 3), i.status = D);
						else {
							var p = g + (i.w_bits - 8 << 4) << 8;
							p |= (2 <= i.strategy || i.level < 2 ? 0 : i.level < 6 ? 1 : i.level === 6 ? 2 : 3) << 6, i.strstart !== 0 && (p |= 32), p += 31 - p % 31, i.status = D, R(i, p), i.strstart !== 0 && (R(i, e.adler >>> 16), R(i, 65535 & e.adler)), e.adler = 1;
						}
					}
					if (i.status === 69) {
						if (i.gzhead.extra) {
							for (o = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > o && (e.adler = s(e.adler, i.pending_buf, i.pending - o, o)), F(e), o = i.pending, i.pending !== i.pending_buf_size));) L(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;
							i.gzhead.hcrc && i.pending > o && (e.adler = s(e.adler, i.pending_buf, i.pending - o, o)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = 73);
						} else i.status = 73;
					}
					if (i.status === 73) {
						if (i.gzhead.name) {
							o = i.pending;
							do {
								if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > o && (e.adler = s(e.adler, i.pending_buf, i.pending - o, o)), F(e), o = i.pending, i.pending === i.pending_buf_size)) {
									c = 1;
									break;
								}
								c = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, L(i, c);
							} while (c !== 0);
							i.gzhead.hcrc && i.pending > o && (e.adler = s(e.adler, i.pending_buf, i.pending - o, o)), c === 0 && (i.gzindex = 0, i.status = 91);
						} else i.status = 91;
					}
					if (i.status === 91) {
						if (i.gzhead.comment) {
							o = i.pending;
							do {
								if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > o && (e.adler = s(e.adler, i.pending_buf, i.pending - o, o)), F(e), o = i.pending, i.pending === i.pending_buf_size)) {
									c = 1;
									break;
								}
								c = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, L(i, c);
							} while (c !== 0);
							i.gzhead.hcrc && i.pending > o && (e.adler = s(e.adler, i.pending_buf, i.pending - o, o)), c === 0 && (i.status = 103);
						} else i.status = 103;
					}
					if (i.status === 103 && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && F(e), i.pending + 2 <= i.pending_buf_size && (L(i, 255 & e.adler), L(i, e.adler >> 8 & 255), e.adler = 0, i.status = D)) : i.status = D), i.pending !== 0) {
						if (F(e), e.avail_out === 0) return i.last_flush = -1, d;
					} else if (e.avail_in === 0 && N(t) <= N(n) && t !== u) return M(e, -5);
					if (i.status === 666 && e.avail_in !== 0) return M(e, -5);
					if (e.avail_in !== 0 || i.lookahead !== 0 || t !== l && i.status !== 666) {
						var m = i.strategy === 2 ? function(e, t) {
							for (var n;;) {
								if (e.lookahead === 0 && (B(e), e.lookahead === 0)) {
									if (t === l) return O;
									break;
								}
								if (e.match_length = 0, n = a._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (I(e, !1), e.strm.avail_out === 0)) return O;
							}
							return e.insert = 0, t === u ? (I(e, !0), e.strm.avail_out === 0 ? A : j) : e.last_lit && (I(e, !1), e.strm.avail_out === 0) ? O : k;
						}(i, t) : i.strategy === 3 ? function(e, t) {
							for (var n, r, i, o, s = e.window;;) {
								if (e.lookahead <= w) {
									if (B(e), e.lookahead <= w && t === l) return O;
									if (e.lookahead === 0) break;
								}
								if (e.match_length = 0, e.lookahead >= C && 0 < e.strstart && (r = s[i = e.strstart - 1]) === s[++i] && r === s[++i] && r === s[++i]) {
									o = e.strstart + w;
									do;
									while (r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && i < o);
									e.match_length = w - (o - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
								}
								if (e.match_length >= C ? (n = a._tr_tally(e, 1, e.match_length - C), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = a._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (I(e, !1), e.strm.avail_out === 0)) return O;
							}
							return e.insert = 0, t === u ? (I(e, !0), e.strm.avail_out === 0 ? A : j) : e.last_lit && (I(e, !1), e.strm.avail_out === 0) ? O : k;
						}(i, t) : r[i.level].func(i, t);
						if (m !== A && m !== j || (i.status = 666), m === O || m === A) return e.avail_out === 0 && (i.last_flush = -1), d;
						if (m === k && (t === 1 ? a._tr_align(i) : t !== 5 && (a._tr_stored_block(i, 0, 0, !1), t === 3 && (P(i.head), i.lookahead === 0 && (i.strstart = 0, i.block_start = 0, i.insert = 0))), F(e), e.avail_out === 0)) return i.last_flush = -1, d;
					}
					return t === u ? i.wrap <= 0 ? 1 : (i.wrap === 2 ? (L(i, 255 & e.adler), L(i, e.adler >> 8 & 255), L(i, e.adler >> 16 & 255), L(i, e.adler >> 24 & 255), L(i, 255 & e.total_in), L(i, e.total_in >> 8 & 255), L(i, e.total_in >> 16 & 255), L(i, e.total_in >> 24 & 255)) : (R(i, e.adler >>> 16), R(i, 65535 & e.adler)), F(e), 0 < i.wrap && (i.wrap = -i.wrap), i.pending === 0 ? 1 : d) : d;
				}, n.deflateEnd = function(e) {
					var t;
					return e && e.state ? (t = e.state.status) !== E && t !== 69 && t !== 73 && t !== 91 && t !== 103 && t !== D && t !== 666 ? M(e, f) : (e.state = null, t === D ? M(e, -3) : d) : f;
				}, n.deflateSetDictionary = function(e, t) {
					var n, r, a, s, c, l, u, p, m = t.length;
					if (!e || !e.state || (s = (n = e.state).wrap) === 2 || s === 1 && n.status !== E || n.lookahead) return f;
					for (s === 1 && (e.adler = o(e.adler, t, m, 0)), n.wrap = 0, m >= n.w_size && (s === 0 && (P(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0), p = new i.Buf8(n.w_size), i.arraySet(p, t, m - n.w_size, n.w_size, 0), t = p, m = n.w_size), c = e.avail_in, l = e.next_in, u = e.input, e.avail_in = m, e.next_in = 0, e.input = t, B(n); n.lookahead >= C;) {
						for (r = n.strstart, a = n.lookahead - (C - 1); n.ins_h = (n.ins_h << n.hash_shift ^ n.window[r + C - 1]) & n.hash_mask, n.prev[r & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = r, r++, --a;);
						n.strstart = r, n.lookahead = C - 1, B(n);
					}
					return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = C - 1, n.match_available = 0, e.next_in = l, e.input = u, e.avail_in = c, n.wrap = s, d;
				}, n.deflateInfo = "pako deflate (from Nodeca project)";
			}, {
				"../utils/common": 41,
				"./adler32": 43,
				"./crc32": 45,
				"./messages": 51,
				"./trees": 52
			}],
			47: [function(e, t, n) {
				t.exports = function() {
					this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
				};
			}, {}],
			48: [function(e, t, n) {
				t.exports = function(e, t) {
					var n = e.state, r = e.next_in, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T = e.input, E;
					i = r + (e.avail_in - 5), a = e.next_out, E = e.output, o = a - (t - e.avail_out), s = a + (e.avail_out - 257), c = n.dmax, l = n.wsize, u = n.whave, d = n.wnext, f = n.window, p = n.hold, m = n.bits, h = n.lencode, g = n.distcode, _ = (1 << n.lenbits) - 1, v = (1 << n.distbits) - 1;
					e: do {
						m < 15 && (p += T[r++] << m, m += 8, p += T[r++] << m, m += 8), y = h[p & _];
						t: for (;;) {
							if (p >>>= b = y >>> 24, m -= b, (b = y >>> 16 & 255) == 0) E[a++] = 65535 & y;
							else {
								if (!(16 & b)) {
									if (!(64 & b)) {
										y = h[(65535 & y) + (p & (1 << b) - 1)];
										continue t;
									}
									if (32 & b) {
										n.mode = 12;
										break e;
									}
									e.msg = "invalid literal/length code", n.mode = 30;
									break e;
								}
								x = 65535 & y, (b &= 15) && (m < b && (p += T[r++] << m, m += 8), x += p & (1 << b) - 1, p >>>= b, m -= b), m < 15 && (p += T[r++] << m, m += 8, p += T[r++] << m, m += 8), y = g[p & v];
								r: for (;;) {
									if (p >>>= b = y >>> 24, m -= b, !(16 & (b = y >>> 16 & 255))) {
										if (!(64 & b)) {
											y = g[(65535 & y) + (p & (1 << b) - 1)];
											continue r;
										}
										e.msg = "invalid distance code", n.mode = 30;
										break e;
									}
									if (S = 65535 & y, m < (b &= 15) && (p += T[r++] << m, (m += 8) < b && (p += T[r++] << m, m += 8)), c < (S += p & (1 << b) - 1)) {
										e.msg = "invalid distance too far back", n.mode = 30;
										break e;
									}
									if (p >>>= b, m -= b, (b = a - o) < S) {
										if (u < (b = S - b) && n.sane) {
											e.msg = "invalid distance too far back", n.mode = 30;
											break e;
										}
										if (w = f, (C = 0) === d) {
											if (C += l - b, b < x) {
												for (x -= b; E[a++] = f[C++], --b;);
												C = a - S, w = E;
											}
										} else if (d < b) {
											if (C += l + d - b, (b -= d) < x) {
												for (x -= b; E[a++] = f[C++], --b;);
												if (C = 0, d < x) {
													for (x -= b = d; E[a++] = f[C++], --b;);
													C = a - S, w = E;
												}
											}
										} else if (C += d - b, b < x) {
											for (x -= b; E[a++] = f[C++], --b;);
											C = a - S, w = E;
										}
										for (; 2 < x;) E[a++] = w[C++], E[a++] = w[C++], E[a++] = w[C++], x -= 3;
										x && (E[a++] = w[C++], 1 < x && (E[a++] = w[C++]));
									} else {
										for (C = a - S; E[a++] = E[C++], E[a++] = E[C++], E[a++] = E[C++], 2 < (x -= 3););
										x && (E[a++] = E[C++], 1 < x && (E[a++] = E[C++]));
									}
									break;
								}
							}
							break;
						}
					} while (r < i && a < s);
					r -= x = m >> 3, p &= (1 << (m -= x << 3)) - 1, e.next_in = r, e.next_out = a, e.avail_in = r < i ? i - r + 5 : 5 - (r - i), e.avail_out = a < s ? s - a + 257 : 257 - (a - s), n.hold = p, n.bits = m;
				};
			}, {}],
			49: [function(e, t, n) {
				var r = e("../utils/common"), i = e("./adler32"), a = e("./crc32"), o = e("./inffast"), s = e("./inftrees"), c = 1, l = 2, u = 0, d = -2, f = 1, p = 852, m = 592;
				function h(e) {
					return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
				}
				function g() {
					this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new r.Buf16(320), this.work = new r.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
				}
				function _(e) {
					var t;
					return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = f, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new r.Buf32(p), t.distcode = t.distdyn = new r.Buf32(m), t.sane = 1, t.back = -1, u) : d;
				}
				function v(e) {
					var t;
					return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, _(e)) : d;
				}
				function y(e, t) {
					var n, r;
					return e && e.state ? (r = e.state, t < 0 ? (n = 0, t = -t) : (n = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || 15 < t) ? d : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, v(e))) : d;
				}
				function b(e, t) {
					var n, r;
					return e ? (r = new g(), (e.state = r).window = null, (n = y(e, t)) !== u && (e.state = null), n) : d;
				}
				var x, S, C = !0;
				function w(e) {
					if (C) {
						var t;
						for (x = new r.Buf32(512), S = new r.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8;
						for (; t < 256;) e.lens[t++] = 9;
						for (; t < 280;) e.lens[t++] = 7;
						for (; t < 288;) e.lens[t++] = 8;
						for (s(c, e.lens, 0, 288, x, 0, e.work, { bits: 9 }), t = 0; t < 32;) e.lens[t++] = 5;
						s(l, e.lens, 0, 32, S, 0, e.work, { bits: 5 }), C = !1;
					}
					e.lencode = x, e.lenbits = 9, e.distcode = S, e.distbits = 5;
				}
				function T(e, t, n, i) {
					var a, o = e.state;
					return o.window === null && (o.wsize = 1 << o.wbits, o.wnext = 0, o.whave = 0, o.window = new r.Buf8(o.wsize)), i >= o.wsize ? (r.arraySet(o.window, t, n - o.wsize, o.wsize, 0), o.wnext = 0, o.whave = o.wsize) : (i < (a = o.wsize - o.wnext) && (a = i), r.arraySet(o.window, t, n - i, a, o.wnext), (i -= a) ? (r.arraySet(o.window, t, n - i, i, 0), o.wnext = i, o.whave = o.wsize) : (o.wnext += a, o.wnext === o.wsize && (o.wnext = 0), o.whave < o.wsize && (o.whave += a))), 0;
				}
				n.inflateReset = v, n.inflateReset2 = y, n.inflateResetKeep = _, n.inflateInit = function(e) {
					return b(e, 15);
				}, n.inflateInit2 = b, n.inflate = function(e, t) {
					var n, p, m, g, _, v, y, b, x, S, C, E, D, O, k, A, j, M, N, P, F, I, L, R, z = 0, B = new r.Buf8(4), V = [
						16,
						17,
						18,
						0,
						8,
						7,
						9,
						6,
						10,
						5,
						11,
						4,
						12,
						3,
						13,
						2,
						14,
						1,
						15
					];
					if (!e || !e.state || !e.output || !e.input && e.avail_in !== 0) return d;
					(n = e.state).mode === 12 && (n.mode = 13), _ = e.next_out, m = e.output, y = e.avail_out, g = e.next_in, p = e.input, v = e.avail_in, b = n.hold, x = n.bits, S = v, C = y, I = u;
					e: for (;;) switch (n.mode) {
						case f:
							if (n.wrap === 0) {
								n.mode = 13;
								break;
							}
							for (; x < 16;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							if (2 & n.wrap && b === 35615) {
								B[n.check = 0] = 255 & b, B[1] = b >>> 8 & 255, n.check = a(n.check, B, 2, 0), x = b = 0, n.mode = 2;
								break;
							}
							if (n.flags = 0, n.head && (n.head.done = !1), !(1 & n.wrap) || (((255 & b) << 8) + (b >> 8)) % 31) {
								e.msg = "incorrect header check", n.mode = 30;
								break;
							}
							if ((15 & b) != 8) {
								e.msg = "unknown compression method", n.mode = 30;
								break;
							}
							if (x -= 4, F = 8 + (15 & (b >>>= 4)), n.wbits === 0) n.wbits = F;
							else if (F > n.wbits) {
								e.msg = "invalid window size", n.mode = 30;
								break;
							}
							n.dmax = 1 << F, e.adler = n.check = 1, n.mode = 512 & b ? 10 : 12, x = b = 0;
							break;
						case 2:
							for (; x < 16;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							if (n.flags = b, (255 & n.flags) != 8) {
								e.msg = "unknown compression method", n.mode = 30;
								break;
							}
							if (57344 & n.flags) {
								e.msg = "unknown header flags set", n.mode = 30;
								break;
							}
							n.head && (n.head.text = b >> 8 & 1), 512 & n.flags && (B[0] = 255 & b, B[1] = b >>> 8 & 255, n.check = a(n.check, B, 2, 0)), x = b = 0, n.mode = 3;
						case 3:
							for (; x < 32;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							n.head && (n.head.time = b), 512 & n.flags && (B[0] = 255 & b, B[1] = b >>> 8 & 255, B[2] = b >>> 16 & 255, B[3] = b >>> 24 & 255, n.check = a(n.check, B, 4, 0)), x = b = 0, n.mode = 4;
						case 4:
							for (; x < 16;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							n.head && (n.head.xflags = 255 & b, n.head.os = b >> 8), 512 & n.flags && (B[0] = 255 & b, B[1] = b >>> 8 & 255, n.check = a(n.check, B, 2, 0)), x = b = 0, n.mode = 5;
						case 5:
							if (1024 & n.flags) {
								for (; x < 16;) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								n.length = b, n.head && (n.head.extra_len = b), 512 & n.flags && (B[0] = 255 & b, B[1] = b >>> 8 & 255, n.check = a(n.check, B, 2, 0)), x = b = 0;
							} else n.head && (n.head.extra = null);
							n.mode = 6;
						case 6:
							if (1024 & n.flags && (v < (E = n.length) && (E = v), E && (n.head && (F = n.head.extra_len - n.length, n.head.extra || (n.head.extra = Array(n.head.extra_len)), r.arraySet(n.head.extra, p, g, E, F)), 512 & n.flags && (n.check = a(n.check, p, E, g)), v -= E, g += E, n.length -= E), n.length)) break e;
							n.length = 0, n.mode = 7;
						case 7:
							if (2048 & n.flags) {
								if (v === 0) break e;
								for (E = 0; F = p[g + E++], n.head && F && n.length < 65536 && (n.head.name += String.fromCharCode(F)), F && E < v;);
								if (512 & n.flags && (n.check = a(n.check, p, E, g)), v -= E, g += E, F) break e;
							} else n.head && (n.head.name = null);
							n.length = 0, n.mode = 8;
						case 8:
							if (4096 & n.flags) {
								if (v === 0) break e;
								for (E = 0; F = p[g + E++], n.head && F && n.length < 65536 && (n.head.comment += String.fromCharCode(F)), F && E < v;);
								if (512 & n.flags && (n.check = a(n.check, p, E, g)), v -= E, g += E, F) break e;
							} else n.head && (n.head.comment = null);
							n.mode = 9;
						case 9:
							if (512 & n.flags) {
								for (; x < 16;) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								if (b !== (65535 & n.check)) {
									e.msg = "header crc mismatch", n.mode = 30;
									break;
								}
								x = b = 0;
							}
							n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = 12;
							break;
						case 10:
							for (; x < 32;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							e.adler = n.check = h(b), x = b = 0, n.mode = 11;
						case 11:
							if (n.havedict === 0) return e.next_out = _, e.avail_out = y, e.next_in = g, e.avail_in = v, n.hold = b, n.bits = x, 2;
							e.adler = n.check = 1, n.mode = 12;
						case 12: if (t === 5 || t === 6) break e;
						case 13:
							if (n.last) {
								b >>>= 7 & x, x -= 7 & x, n.mode = 27;
								break;
							}
							for (; x < 3;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							switch (n.last = 1 & b, --x, 3 & (b >>>= 1)) {
								case 0:
									n.mode = 14;
									break;
								case 1:
									if (w(n), n.mode = 20, t !== 6) break;
									b >>>= 2, x -= 2;
									break e;
								case 2:
									n.mode = 17;
									break;
								case 3: e.msg = "invalid block type", n.mode = 30;
							}
							b >>>= 2, x -= 2;
							break;
						case 14:
							for (b >>>= 7 & x, x -= 7 & x; x < 32;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							if ((65535 & b) != (b >>> 16 ^ 65535)) {
								e.msg = "invalid stored block lengths", n.mode = 30;
								break;
							}
							if (n.length = 65535 & b, x = b = 0, n.mode = 15, t === 6) break e;
						case 15: n.mode = 16;
						case 16:
							if (E = n.length) {
								if (v < E && (E = v), y < E && (E = y), E === 0) break e;
								r.arraySet(m, p, g, E, _), v -= E, g += E, y -= E, _ += E, n.length -= E;
								break;
							}
							n.mode = 12;
							break;
						case 17:
							for (; x < 14;) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							if (n.nlen = 257 + (31 & b), b >>>= 5, x -= 5, n.ndist = 1 + (31 & b), b >>>= 5, x -= 5, n.ncode = 4 + (15 & b), b >>>= 4, x -= 4, 286 < n.nlen || 30 < n.ndist) {
								e.msg = "too many length or distance symbols", n.mode = 30;
								break;
							}
							n.have = 0, n.mode = 18;
						case 18:
							for (; n.have < n.ncode;) {
								for (; x < 3;) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								n.lens[V[n.have++]] = 7 & b, b >>>= 3, x -= 3;
							}
							for (; n.have < 19;) n.lens[V[n.have++]] = 0;
							if (n.lencode = n.lendyn, n.lenbits = 7, L = { bits: n.lenbits }, I = s(0, n.lens, 0, 19, n.lencode, 0, n.work, L), n.lenbits = L.bits, I) {
								e.msg = "invalid code lengths set", n.mode = 30;
								break;
							}
							n.have = 0, n.mode = 19;
						case 19:
							for (; n.have < n.nlen + n.ndist;) {
								for (; A = (z = n.lencode[b & (1 << n.lenbits) - 1]) >>> 16 & 255, j = 65535 & z, !((k = z >>> 24) <= x);) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								if (j < 16) b >>>= k, x -= k, n.lens[n.have++] = j;
								else {
									if (j === 16) {
										for (R = k + 2; x < R;) {
											if (v === 0) break e;
											v--, b += p[g++] << x, x += 8;
										}
										if (b >>>= k, x -= k, n.have === 0) {
											e.msg = "invalid bit length repeat", n.mode = 30;
											break;
										}
										F = n.lens[n.have - 1], E = 3 + (3 & b), b >>>= 2, x -= 2;
									} else if (j === 17) {
										for (R = k + 3; x < R;) {
											if (v === 0) break e;
											v--, b += p[g++] << x, x += 8;
										}
										x -= k, F = 0, E = 3 + (7 & (b >>>= k)), b >>>= 3, x -= 3;
									} else {
										for (R = k + 7; x < R;) {
											if (v === 0) break e;
											v--, b += p[g++] << x, x += 8;
										}
										x -= k, F = 0, E = 11 + (127 & (b >>>= k)), b >>>= 7, x -= 7;
									}
									if (n.have + E > n.nlen + n.ndist) {
										e.msg = "invalid bit length repeat", n.mode = 30;
										break;
									}
									for (; E--;) n.lens[n.have++] = F;
								}
							}
							if (n.mode === 30) break;
							if (n.lens[256] === 0) {
								e.msg = "invalid code -- missing end-of-block", n.mode = 30;
								break;
							}
							if (n.lenbits = 9, L = { bits: n.lenbits }, I = s(c, n.lens, 0, n.nlen, n.lencode, 0, n.work, L), n.lenbits = L.bits, I) {
								e.msg = "invalid literal/lengths set", n.mode = 30;
								break;
							}
							if (n.distbits = 6, n.distcode = n.distdyn, L = { bits: n.distbits }, I = s(l, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, L), n.distbits = L.bits, I) {
								e.msg = "invalid distances set", n.mode = 30;
								break;
							}
							if (n.mode = 20, t === 6) break e;
						case 20: n.mode = 21;
						case 21:
							if (6 <= v && 258 <= y) {
								e.next_out = _, e.avail_out = y, e.next_in = g, e.avail_in = v, n.hold = b, n.bits = x, o(e, C), _ = e.next_out, m = e.output, y = e.avail_out, g = e.next_in, p = e.input, v = e.avail_in, b = n.hold, x = n.bits, n.mode === 12 && (n.back = -1);
								break;
							}
							for (n.back = 0; A = (z = n.lencode[b & (1 << n.lenbits) - 1]) >>> 16 & 255, j = 65535 & z, !((k = z >>> 24) <= x);) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							if (A && !(240 & A)) {
								for (M = k, N = A, P = j; A = (z = n.lencode[P + ((b & (1 << M + N) - 1) >> M)]) >>> 16 & 255, j = 65535 & z, !(M + (k = z >>> 24) <= x);) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								b >>>= M, x -= M, n.back += M;
							}
							if (b >>>= k, x -= k, n.back += k, n.length = j, A === 0) {
								n.mode = 26;
								break;
							}
							if (32 & A) {
								n.back = -1, n.mode = 12;
								break;
							}
							if (64 & A) {
								e.msg = "invalid literal/length code", n.mode = 30;
								break;
							}
							n.extra = 15 & A, n.mode = 22;
						case 22:
							if (n.extra) {
								for (R = n.extra; x < R;) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								n.length += b & (1 << n.extra) - 1, b >>>= n.extra, x -= n.extra, n.back += n.extra;
							}
							n.was = n.length, n.mode = 23;
						case 23:
							for (; A = (z = n.distcode[b & (1 << n.distbits) - 1]) >>> 16 & 255, j = 65535 & z, !((k = z >>> 24) <= x);) {
								if (v === 0) break e;
								v--, b += p[g++] << x, x += 8;
							}
							if (!(240 & A)) {
								for (M = k, N = A, P = j; A = (z = n.distcode[P + ((b & (1 << M + N) - 1) >> M)]) >>> 16 & 255, j = 65535 & z, !(M + (k = z >>> 24) <= x);) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								b >>>= M, x -= M, n.back += M;
							}
							if (b >>>= k, x -= k, n.back += k, 64 & A) {
								e.msg = "invalid distance code", n.mode = 30;
								break;
							}
							n.offset = j, n.extra = 15 & A, n.mode = 24;
						case 24:
							if (n.extra) {
								for (R = n.extra; x < R;) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								n.offset += b & (1 << n.extra) - 1, b >>>= n.extra, x -= n.extra, n.back += n.extra;
							}
							if (n.offset > n.dmax) {
								e.msg = "invalid distance too far back", n.mode = 30;
								break;
							}
							n.mode = 25;
						case 25:
							if (y === 0) break e;
							if (E = C - y, n.offset > E) {
								if ((E = n.offset - E) > n.whave && n.sane) {
									e.msg = "invalid distance too far back", n.mode = 30;
									break;
								}
								D = E > n.wnext ? (E -= n.wnext, n.wsize - E) : n.wnext - E, E > n.length && (E = n.length), O = n.window;
							} else O = m, D = _ - n.offset, E = n.length;
							for (y < E && (E = y), y -= E, n.length -= E; m[_++] = O[D++], --E;);
							n.length === 0 && (n.mode = 21);
							break;
						case 26:
							if (y === 0) break e;
							m[_++] = n.length, y--, n.mode = 21;
							break;
						case 27:
							if (n.wrap) {
								for (; x < 32;) {
									if (v === 0) break e;
									v--, b |= p[g++] << x, x += 8;
								}
								if (C -= y, e.total_out += C, n.total += C, C && (e.adler = n.check = n.flags ? a(n.check, m, C, _ - C) : i(n.check, m, C, _ - C)), C = y, (n.flags ? b : h(b)) !== n.check) {
									e.msg = "incorrect data check", n.mode = 30;
									break;
								}
								x = b = 0;
							}
							n.mode = 28;
						case 28:
							if (n.wrap && n.flags) {
								for (; x < 32;) {
									if (v === 0) break e;
									v--, b += p[g++] << x, x += 8;
								}
								if (b !== (0 | n.total)) {
									e.msg = "incorrect length check", n.mode = 30;
									break;
								}
								x = b = 0;
							}
							n.mode = 29;
						case 29:
							I = 1;
							break e;
						case 30:
							I = -3;
							break e;
						case 31: return -4;
						default: return d;
					}
					return e.next_out = _, e.avail_out = y, e.next_in = g, e.avail_in = v, n.hold = b, n.bits = x, (n.wsize || C !== e.avail_out && n.mode < 30 && (n.mode < 27 || t !== 4)) && T(e, e.output, e.next_out, C - e.avail_out) ? (n.mode = 31, -4) : (S -= e.avail_in, C -= e.avail_out, e.total_in += S, e.total_out += C, n.total += C, n.wrap && C && (e.adler = n.check = n.flags ? a(n.check, m, C, e.next_out - C) : i(n.check, m, C, e.next_out - C)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === 12 ? 128 : 0) + (n.mode === 20 || n.mode === 15 ? 256 : 0), (S == 0 && C === 0 || t === 4) && I === u && (I = -5), I);
				}, n.inflateEnd = function(e) {
					if (!e || !e.state) return d;
					var t = e.state;
					return t.window &&= null, e.state = null, u;
				}, n.inflateGetHeader = function(e, t) {
					var n;
					return e && e.state && 2 & (n = e.state).wrap ? ((n.head = t).done = !1, u) : d;
				}, n.inflateSetDictionary = function(e, t) {
					var n, r = t.length;
					return e && e.state ? (n = e.state).wrap !== 0 && n.mode !== 11 ? d : n.mode === 11 && i(1, t, r, 0) !== n.check ? -3 : T(e, t, r, r) ? (n.mode = 31, -4) : (n.havedict = 1, u) : d;
				}, n.inflateInfo = "pako inflate (from Nodeca project)";
			}, {
				"../utils/common": 41,
				"./adler32": 43,
				"./crc32": 45,
				"./inffast": 48,
				"./inftrees": 50
			}],
			50: [function(e, t, n) {
				var r = e("../utils/common"), i = [
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					13,
					15,
					17,
					19,
					23,
					27,
					31,
					35,
					43,
					51,
					59,
					67,
					83,
					99,
					115,
					131,
					163,
					195,
					227,
					258,
					0,
					0
				], a = [
					16,
					16,
					16,
					16,
					16,
					16,
					16,
					16,
					17,
					17,
					17,
					17,
					18,
					18,
					18,
					18,
					19,
					19,
					19,
					19,
					20,
					20,
					20,
					20,
					21,
					21,
					21,
					21,
					16,
					72,
					78
				], o = [
					1,
					2,
					3,
					4,
					5,
					7,
					9,
					13,
					17,
					25,
					33,
					49,
					65,
					97,
					129,
					193,
					257,
					385,
					513,
					769,
					1025,
					1537,
					2049,
					3073,
					4097,
					6145,
					8193,
					12289,
					16385,
					24577,
					0,
					0
				], s = [
					16,
					16,
					16,
					16,
					17,
					17,
					18,
					18,
					19,
					19,
					20,
					20,
					21,
					21,
					22,
					22,
					23,
					23,
					24,
					24,
					25,
					25,
					26,
					26,
					27,
					27,
					28,
					28,
					29,
					29,
					64,
					64
				];
				t.exports = function(e, t, n, c, l, u, d, f) {
					var p, m, h, g, _, v, y, b, x, S = f.bits, C = 0, w = 0, T = 0, E = 0, D = 0, O = 0, k = 0, A = 0, j = 0, M = 0, N = null, P = 0, F = new r.Buf16(16), I = new r.Buf16(16), L = null, R = 0;
					for (C = 0; C <= 15; C++) F[C] = 0;
					for (w = 0; w < c; w++) F[t[n + w]]++;
					for (D = S, E = 15; 1 <= E && F[E] === 0; E--);
					if (E < D && (D = E), E === 0) return l[u++] = 20971520, l[u++] = 20971520, f.bits = 1, 0;
					for (T = 1; T < E && F[T] === 0; T++);
					for (D < T && (D = T), C = A = 1; C <= 15; C++) if (A <<= 1, (A -= F[C]) < 0) return -1;
					if (0 < A && (e === 0 || E !== 1)) return -1;
					for (I[1] = 0, C = 1; C < 15; C++) I[C + 1] = I[C] + F[C];
					for (w = 0; w < c; w++) t[n + w] !== 0 && (d[I[t[n + w]]++] = w);
					if (v = e === 0 ? (N = L = d, 19) : e === 1 ? (N = i, P -= 257, L = a, R -= 257, 256) : (N = o, L = s, -1), C = T, _ = u, k = w = M = 0, h = -1, g = (j = 1 << (O = D)) - 1, e === 1 && 852 < j || e === 2 && 592 < j) return 1;
					for (;;) {
						for (y = C - k, x = d[w] < v ? (b = 0, d[w]) : d[w] > v ? (b = L[R + d[w]], N[P + d[w]]) : (b = 96, 0), p = 1 << C - k, T = m = 1 << O; l[_ + (M >> k) + (m -= p)] = y << 24 | b << 16 | x, m !== 0;);
						for (p = 1 << C - 1; M & p;) p >>= 1;
						if (p === 0 ? M = 0 : (M &= p - 1, M += p), w++, --F[C] == 0) {
							if (C === E) break;
							C = t[n + d[w]];
						}
						if (D < C && (M & g) !== h) {
							for (k === 0 && (k = D), _ += T, A = 1 << (O = C - k); O + k < E && !((A -= F[O + k]) <= 0);) O++, A <<= 1;
							if (j += 1 << O, e === 1 && 852 < j || e === 2 && 592 < j) return 1;
							l[h = M & g] = D << 24 | O << 16 | _ - u;
						}
					}
					return M !== 0 && (l[_ + M] = C - k << 24 | 4194304), f.bits = D, 0;
				};
			}, { "../utils/common": 41 }],
			51: [function(e, t, n) {
				t.exports = {
					2: "need dictionary",
					1: "stream end",
					0: "",
					"-1": "file error",
					"-2": "stream error",
					"-3": "data error",
					"-4": "insufficient memory",
					"-5": "buffer error",
					"-6": "incompatible version"
				};
			}, {}],
			52: [function(e, t, n) {
				var r = e("../utils/common"), i = 0, a = 1;
				function o(e) {
					for (var t = e.length; 0 <= --t;) e[t] = 0;
				}
				var s = 0, c = 29, l = 256, u = l + 1 + c, d = 30, f = 19, p = 2 * u + 1, m = 15, h = 16, g = 7, _ = 256, v = 16, y = 17, b = 18, x = [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					1,
					1,
					1,
					1,
					2,
					2,
					2,
					2,
					3,
					3,
					3,
					3,
					4,
					4,
					4,
					4,
					5,
					5,
					5,
					5,
					0
				], S = [
					0,
					0,
					0,
					0,
					1,
					1,
					2,
					2,
					3,
					3,
					4,
					4,
					5,
					5,
					6,
					6,
					7,
					7,
					8,
					8,
					9,
					9,
					10,
					10,
					11,
					11,
					12,
					12,
					13,
					13
				], C = [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					2,
					3,
					7
				], w = [
					16,
					17,
					18,
					0,
					8,
					7,
					9,
					6,
					10,
					5,
					11,
					4,
					12,
					3,
					13,
					2,
					14,
					1,
					15
				], T = Array(2 * (u + 2));
				o(T);
				var E = Array(2 * d);
				o(E);
				var D = Array(512);
				o(D);
				var O = Array(256);
				o(O);
				var k = Array(c);
				o(k);
				var A, j, M, N = Array(d);
				function P(e, t, n, r, i) {
					this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = e && e.length;
				}
				function F(e, t) {
					this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
				}
				function I(e) {
					return e < 256 ? D[e] : D[256 + (e >>> 7)];
				}
				function L(e, t) {
					e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255;
				}
				function R(e, t, n) {
					e.bi_valid > h - n ? (e.bi_buf |= t << e.bi_valid & 65535, L(e, e.bi_buf), e.bi_buf = t >> h - e.bi_valid, e.bi_valid += n - h) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
				}
				function z(e, t, n) {
					R(e, n[2 * t], n[2 * t + 1]);
				}
				function B(e, t) {
					for (var n = 0; n |= 1 & e, e >>>= 1, n <<= 1, 0 < --t;);
					return n >>> 1;
				}
				function V(e, t, n) {
					var r, i, a = Array(m + 1), o = 0;
					for (r = 1; r <= m; r++) a[r] = o = o + n[r - 1] << 1;
					for (i = 0; i <= t; i++) {
						var s = e[2 * i + 1];
						s !== 0 && (e[2 * i] = B(a[s]++, s));
					}
				}
				function H(e) {
					for (var t = 0; t < u; t++) e.dyn_ltree[2 * t] = 0;
					for (t = 0; t < d; t++) e.dyn_dtree[2 * t] = 0;
					for (t = 0; t < f; t++) e.bl_tree[2 * t] = 0;
					e.dyn_ltree[2 * _] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
				}
				function U(e) {
					8 < e.bi_valid ? L(e, e.bi_buf) : 0 < e.bi_valid && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
				}
				function ee(e, t, n, r) {
					var i = 2 * t, a = 2 * n;
					return e[i] < e[a] || e[i] === e[a] && r[t] <= r[n];
				}
				function te(e, t, n) {
					for (var r = e.heap[n], i = n << 1; i <= e.heap_len && (i < e.heap_len && ee(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !ee(t, r, e.heap[i], e.depth));) e.heap[n] = e.heap[i], n = i, i <<= 1;
					e.heap[n] = r;
				}
				function ne(e, t, n) {
					var r, i, a, o, s = 0;
					if (e.last_lit !== 0) for (; r = e.pending_buf[e.d_buf + 2 * s] << 8 | e.pending_buf[e.d_buf + 2 * s + 1], i = e.pending_buf[e.l_buf + s], s++, r === 0 ? z(e, i, t) : (z(e, (a = O[i]) + l + 1, t), (o = x[a]) !== 0 && R(e, i -= k[a], o), z(e, a = I(--r), n), (o = S[a]) !== 0 && R(e, r -= N[a], o)), s < e.last_lit;);
					z(e, _, t);
				}
				function re(e, t) {
					var n, r, i, a = t.dyn_tree, o = t.stat_desc.static_tree, s = t.stat_desc.has_stree, c = t.stat_desc.elems, l = -1;
					for (e.heap_len = 0, e.heap_max = p, n = 0; n < c; n++) a[2 * n] === 0 ? a[2 * n + 1] = 0 : (e.heap[++e.heap_len] = l = n, e.depth[n] = 0);
					for (; e.heap_len < 2;) a[2 * (i = e.heap[++e.heap_len] = l < 2 ? ++l : 0)] = 1, e.depth[i] = 0, e.opt_len--, s && (e.static_len -= o[2 * i + 1]);
					for (t.max_code = l, n = e.heap_len >> 1; 1 <= n; n--) te(e, a, n);
					for (i = c; n = e.heap[1], e.heap[1] = e.heap[e.heap_len--], te(e, a, 1), r = e.heap[1], e.heap[--e.heap_max] = n, e.heap[--e.heap_max] = r, a[2 * i] = a[2 * n] + a[2 * r], e.depth[i] = (e.depth[n] >= e.depth[r] ? e.depth[n] : e.depth[r]) + 1, a[2 * n + 1] = a[2 * r + 1] = i, e.heap[1] = i++, te(e, a, 1), 2 <= e.heap_len;);
					e.heap[--e.heap_max] = e.heap[1], function(e, t) {
						var n, r, i, a, o, s, c = t.dyn_tree, l = t.max_code, u = t.stat_desc.static_tree, d = t.stat_desc.has_stree, f = t.stat_desc.extra_bits, h = t.stat_desc.extra_base, g = t.stat_desc.max_length, _ = 0;
						for (a = 0; a <= m; a++) e.bl_count[a] = 0;
						for (c[2 * e.heap[e.heap_max] + 1] = 0, n = e.heap_max + 1; n < p; n++) g < (a = c[2 * c[2 * (r = e.heap[n]) + 1] + 1] + 1) && (a = g, _++), c[2 * r + 1] = a, l < r || (e.bl_count[a]++, o = 0, h <= r && (o = f[r - h]), s = c[2 * r], e.opt_len += s * (a + o), d && (e.static_len += s * (u[2 * r + 1] + o)));
						if (_ !== 0) {
							do {
								for (a = g - 1; e.bl_count[a] === 0;) a--;
								e.bl_count[a]--, e.bl_count[a + 1] += 2, e.bl_count[g]--, _ -= 2;
							} while (0 < _);
							for (a = g; a !== 0; a--) for (r = e.bl_count[a]; r !== 0;) l < (i = e.heap[--n]) || (c[2 * i + 1] !== a && (e.opt_len += (a - c[2 * i + 1]) * c[2 * i], c[2 * i + 1] = a), r--);
						}
					}(e, t), V(a, l, e.bl_count);
				}
				function ie(e, t, n) {
					var r, i, a = -1, o = t[1], s = 0, c = 7, l = 4;
					for (o === 0 && (c = 138, l = 3), t[2 * (n + 1) + 1] = 65535, r = 0; r <= n; r++) i = o, o = t[2 * (r + 1) + 1], ++s < c && i === o || (s < l ? e.bl_tree[2 * i] += s : i === 0 ? s <= 10 ? e.bl_tree[2 * y]++ : e.bl_tree[2 * b]++ : (i !== a && e.bl_tree[2 * i]++, e.bl_tree[2 * v]++), a = i, l = (s = 0) === o ? (c = 138, 3) : i === o ? (c = 6, 3) : (c = 7, 4));
				}
				function ae(e, t, n) {
					var r, i, a = -1, o = t[1], s = 0, c = 7, l = 4;
					for (o === 0 && (c = 138, l = 3), r = 0; r <= n; r++) if (i = o, o = t[2 * (r + 1) + 1], !(++s < c && i === o)) {
						if (s < l) for (; z(e, i, e.bl_tree), --s != 0;);
						else i === 0 ? s <= 10 ? (z(e, y, e.bl_tree), R(e, s - 3, 3)) : (z(e, b, e.bl_tree), R(e, s - 11, 7)) : (i !== a && (z(e, i, e.bl_tree), s--), z(e, v, e.bl_tree), R(e, s - 3, 2));
						a = i, l = (s = 0) === o ? (c = 138, 3) : i === o ? (c = 6, 3) : (c = 7, 4);
					}
				}
				o(N);
				var oe = !1;
				function se(e, t, n, i) {
					R(e, (s << 1) + +!!i, 3), function(e, t, n, i) {
						U(e), L(e, n), L(e, ~n), r.arraySet(e.pending_buf, e.window, t, n, e.pending), e.pending += n;
					}(e, t, n, !0);
				}
				n._tr_init = function(e) {
					oe ||= (function() {
						var e, t, n, r, i, a = Array(m + 1);
						for (r = n = 0; r < c - 1; r++) for (k[r] = n, e = 0; e < 1 << x[r]; e++) O[n++] = r;
						for (O[n - 1] = r, r = i = 0; r < 16; r++) for (N[r] = i, e = 0; e < 1 << S[r]; e++) D[i++] = r;
						for (i >>= 7; r < d; r++) for (N[r] = i << 7, e = 0; e < 1 << S[r] - 7; e++) D[256 + i++] = r;
						for (t = 0; t <= m; t++) a[t] = 0;
						for (e = 0; e <= 143;) T[2 * e + 1] = 8, e++, a[8]++;
						for (; e <= 255;) T[2 * e + 1] = 9, e++, a[9]++;
						for (; e <= 279;) T[2 * e + 1] = 7, e++, a[7]++;
						for (; e <= 287;) T[2 * e + 1] = 8, e++, a[8]++;
						for (V(T, u + 1, a), e = 0; e < d; e++) E[2 * e + 1] = 5, E[2 * e] = B(e, 5);
						A = new P(T, x, l + 1, u, m), j = new P(E, S, 0, d, m), M = new P([], C, 0, f, g);
					}(), !0), e.l_desc = new F(e.dyn_ltree, A), e.d_desc = new F(e.dyn_dtree, j), e.bl_desc = new F(e.bl_tree, M), e.bi_buf = 0, e.bi_valid = 0, H(e);
				}, n._tr_stored_block = se, n._tr_flush_block = function(e, t, n, r) {
					var o, s, c = 0;
					0 < e.level ? (e.strm.data_type === 2 && (e.strm.data_type = function(e) {
						var t, n = 4093624447;
						for (t = 0; t <= 31; t++, n >>>= 1) if (1 & n && e.dyn_ltree[2 * t] !== 0) return i;
						if (e.dyn_ltree[18] !== 0 || e.dyn_ltree[20] !== 0 || e.dyn_ltree[26] !== 0) return a;
						for (t = 32; t < l; t++) if (e.dyn_ltree[2 * t] !== 0) return a;
						return i;
					}(e)), re(e, e.l_desc), re(e, e.d_desc), c = function(e) {
						var t;
						for (ie(e, e.dyn_ltree, e.l_desc.max_code), ie(e, e.dyn_dtree, e.d_desc.max_code), re(e, e.bl_desc), t = f - 1; 3 <= t && e.bl_tree[2 * w[t] + 1] === 0; t--);
						return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
					}(e), o = e.opt_len + 3 + 7 >>> 3, (s = e.static_len + 3 + 7 >>> 3) <= o && (o = s)) : o = s = n + 5, n + 4 <= o && t !== -1 ? se(e, t, n, r) : e.strategy === 4 || s === o ? (R(e, 2 + +!!r, 3), ne(e, T, E)) : (R(e, 4 + +!!r, 3), function(e, t, n, r) {
						var i;
						for (R(e, t - 257, 5), R(e, n - 1, 5), R(e, r - 4, 4), i = 0; i < r; i++) R(e, e.bl_tree[2 * w[i] + 1], 3);
						ae(e, e.dyn_ltree, t - 1), ae(e, e.dyn_dtree, n - 1);
					}(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, c + 1), ne(e, e.dyn_ltree, e.dyn_dtree)), H(e), r && U(e);
				}, n._tr_tally = function(e, t, n) {
					return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & n, e.last_lit++, t === 0 ? e.dyn_ltree[2 * n]++ : (e.matches++, t--, e.dyn_ltree[2 * (O[n] + l + 1)]++, e.dyn_dtree[2 * I(t)]++), e.last_lit === e.lit_bufsize - 1;
				}, n._tr_align = function(e) {
					R(e, 2, 3), z(e, _, T), function(e) {
						e.bi_valid === 16 ? (L(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);
					}(e);
				};
			}, { "../utils/common": 41 }],
			53: [function(e, t, n) {
				t.exports = function() {
					this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
				};
			}, {}],
			54: [function(e, t, n) {
				(function(e) {
					(function(e, t) {
						if (!e.setImmediate) {
							var n, r, i, a, o = 1, s = {}, c = !1, l = e.document, u = Object.getPrototypeOf && Object.getPrototypeOf(e);
							u = u && u.setTimeout ? u : e, n = {}.toString.call(e.process) === "[object process]" ? function(e) {
								process.nextTick(function() {
									f(e);
								});
							} : function() {
								if (e.postMessage && !e.importScripts) {
									var t = !0, n = e.onmessage;
									return e.onmessage = function() {
										t = !1;
									}, e.postMessage("", "*"), e.onmessage = n, t;
								}
							}() ? (a = "setImmediate$" + Math.random() + "$", e.addEventListener ? e.addEventListener("message", p, !1) : e.attachEvent("onmessage", p), function(t) {
								e.postMessage(a + t, "*");
							}) : e.MessageChannel ? ((i = new MessageChannel()).port1.onmessage = function(e) {
								f(e.data);
							}, function(e) {
								i.port2.postMessage(e);
							}) : l && "onreadystatechange" in l.createElement("script") ? (r = l.documentElement, function(e) {
								var t = l.createElement("script");
								t.onreadystatechange = function() {
									f(e), t.onreadystatechange = null, r.removeChild(t), t = null;
								}, r.appendChild(t);
							}) : function(e) {
								setTimeout(f, 0, e);
							}, u.setImmediate = function(e) {
								typeof e != "function" && (e = Function("" + e));
								for (var t = Array(arguments.length - 1), r = 0; r < t.length; r++) t[r] = arguments[r + 1];
								return s[o] = {
									callback: e,
									args: t
								}, n(o), o++;
							}, u.clearImmediate = d;
						}
						function d(e) {
							delete s[e];
						}
						function f(e) {
							if (c) setTimeout(f, 0, e);
							else {
								var n = s[e];
								if (n) {
									c = !0;
									try {
										(function(e) {
											var n = e.callback, r = e.args;
											switch (r.length) {
												case 0:
													n();
													break;
												case 1:
													n(r[0]);
													break;
												case 2:
													n(r[0], r[1]);
													break;
												case 3:
													n(r[0], r[1], r[2]);
													break;
												default: n.apply(t, r);
											}
										})(n);
									} finally {
										d(e), c = !1;
									}
								}
							}
						}
						function p(t) {
							t.source === e && typeof t.data == "string" && t.data.indexOf(a) === 0 && f(+t.data.slice(a.length));
						}
					})(typeof self > "u" ? e === void 0 ? this : e : self);
				}).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {});
			}, {}]
		}, {}, [10])(10);
	});
})))(), 1), oe = { type: "change" }, se = { type: "start" }, ce = { type: "end" }, le = new I(), ue = new d(), de = Math.cos(70 * h.DEG2RAD), W = new k(), fe = 2 * Math.PI, G = {
	NONE: -1,
	ROTATE: 0,
	DOLLY: 1,
	PAN: 2,
	TOUCH_ROTATE: 3,
	TOUCH_PAN: 4,
	TOUCH_DOLLY_PAN: 5,
	TOUCH_DOLLY_ROTATE: 6
}, pe = 1e-6, me = class extends P {
	constructor(e, t = null) {
		super(e, t), this.state = G.NONE, this.target = new k(), this.cursor = new k(), this.minDistance = 0, this.maxDistance = Infinity, this.minZoom = 0, this.maxZoom = Infinity, this.minTargetRadius = 0, this.maxTargetRadius = Infinity, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -Infinity, this.maxAzimuthAngle = Infinity, this.enableDamping = !1, this.dampingFactor = .05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = {
			LEFT: "ArrowLeft",
			UP: "ArrowUp",
			RIGHT: "ArrowRight",
			BOTTOM: "ArrowDown"
		}, this.mouseButtons = {
			LEFT: u.ROTATE,
			MIDDLE: u.DOLLY,
			RIGHT: u.PAN
		}, this.touches = {
			ONE: T.ROTATE,
			TWO: T.DOLLY_PAN
		}, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._cursorStyle = "auto", this._domElementKeyEvents = null, this._lastPosition = new k(), this._lastQuaternion = new _(), this._lastTargetPosition = new k(), this._quat = new _().setFromUnitVectors(e.up, new k(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new te(), this._sphericalDelta = new te(), this._scale = 1, this._panOffset = new k(), this._rotateStart = new j(), this._rotateEnd = new j(), this._rotateDelta = new j(), this._panStart = new j(), this._panEnd = new j(), this._panDelta = new j(), this._dollyStart = new j(), this._dollyEnd = new j(), this._dollyDelta = new j(), this._dollyDirection = new k(), this._mouse = new j(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = ge.bind(this), this._onPointerDown = he.bind(this), this._onPointerUp = _e.bind(this), this._onContextMenu = we.bind(this), this._onMouseWheel = be.bind(this), this._onKeyDown = xe.bind(this), this._onTouchStart = Se.bind(this), this._onTouchMove = Ce.bind(this), this._onMouseDown = ve.bind(this), this._onMouseMove = ye.bind(this), this._interceptControlDown = Te.bind(this), this._interceptControlUp = Ee.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
	}
	set cursorStyle(e) {
		this._cursorStyle = e, e === "grab" ? this.domElement.style.cursor = "grab" : this.domElement.style.cursor = "auto";
	}
	get cursorStyle() {
		return this._cursorStyle;
	}
	connect(e) {
		super.connect(e), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.ownerDocument.addEventListener("keydown", this._interceptControlDown, {
			passive: !0,
			capture: !0
		}), this.domElement.style.touchAction = "none";
	}
	disconnect() {
		this.state = G.NONE, this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.ownerDocument.removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.ownerDocument.removeEventListener("keyup", this._interceptControlUp, { capture: !0 }), this._controlActive = !1, this._pointers.length = 0, this._pointerPositions = {}, this.domElement.style.touchAction = "", this.domElement.style.cursor = "auto";
	}
	dispose() {
		this.disconnect();
	}
	getPolarAngle() {
		return this._spherical.phi;
	}
	getAzimuthalAngle() {
		return this._spherical.theta;
	}
	getDistance() {
		return this.object.position.distanceTo(this.target);
	}
	listenToKeyEvents(e) {
		e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
	}
	stopListenToKeyEvents() {
		this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
	}
	saveState() {
		this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
	}
	reset() {
		this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(oe), this.update(), this.state = G.NONE;
	}
	pan(e, t) {
		this._pan(e, t), this.update();
	}
	dollyIn(e) {
		this._dollyIn(e), this.update();
	}
	dollyOut(e) {
		this._dollyOut(e), this.update();
	}
	rotateLeft(e) {
		this._rotateLeft(e), this.update();
	}
	rotateUp(e) {
		this._rotateUp(e), this.update();
	}
	update(e = null) {
		let t = this.object.position;
		W.copy(t).sub(this.target), W.applyQuaternion(this._quat), this._spherical.setFromVector3(W), this.autoRotate && this.state === G.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
		let n = this.minAzimuthAngle, r = this.maxAzimuthAngle;
		isFinite(n) && isFinite(r) && (n < -Math.PI ? n += fe : n > Math.PI && (n -= fe), r < -Math.PI ? r += fe : r > Math.PI && (r -= fe), n <= r ? this._spherical.theta = Math.max(n, Math.min(r, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + r) / 2 ? Math.max(n, this._spherical.theta) : Math.min(r, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
		let i = !1;
		if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera) this._spherical.radius = this._clampDistance(this._spherical.radius);
		else {
			let e = this._spherical.radius;
			this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), i = e != this._spherical.radius;
		}
		if (W.setFromSpherical(this._spherical), W.applyQuaternion(this._quatInverse), t.copy(this.target).add(W), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
			let e = null;
			if (this.object.isPerspectiveCamera) {
				let t = W.length();
				e = this._clampDistance(t * this._scale);
				let n = t - e;
				this.object.position.addScaledVector(this._dollyDirection, n), this.object.updateMatrixWorld(), i = !!n;
			} else if (this.object.isOrthographicCamera) {
				let t = new k(this._mouse.x, this._mouse.y, 0);
				t.unproject(this.object);
				let n = this.object.zoom;
				this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = n !== this.object.zoom;
				let r = new k(this._mouse.x, this._mouse.y, 0);
				r.unproject(this.object), this.object.position.sub(r).add(t), this.object.updateMatrixWorld(), e = W.length();
			} else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
			e !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position) : (le.origin.copy(this.object.position), le.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(le.direction)) < de ? this.object.lookAt(this.target) : (ue.setFromNormalAndCoplanarPoint(this.object.up, this.target), le.intersectPlane(ue, this.target))));
		} else if (this.object.isOrthographicCamera) {
			let e = this.object.zoom;
			this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), e !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
		}
		return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > pe || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > pe || this._lastTargetPosition.distanceToSquared(this.target) > pe ? (this.dispatchEvent(oe), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
	}
	_getAutoRotationAngle(e) {
		return e === null ? fe / 60 / 60 * this.autoRotateSpeed : fe / 60 * this.autoRotateSpeed * e;
	}
	_getZoomScale(e) {
		let t = Math.abs(e * .01);
		return .95 ** (this.zoomSpeed * t);
	}
	_rotateLeft(e) {
		this._sphericalDelta.theta -= e;
	}
	_rotateUp(e) {
		this._sphericalDelta.phi -= e;
	}
	_panLeft(e, t) {
		W.setFromMatrixColumn(t, 0), W.multiplyScalar(-e), this._panOffset.add(W);
	}
	_panUp(e, t) {
		this.screenSpacePanning === !0 ? W.setFromMatrixColumn(t, 1) : (W.setFromMatrixColumn(t, 0), W.crossVectors(this.object.up, W)), W.multiplyScalar(e), this._panOffset.add(W);
	}
	_pan(e, t) {
		let n = this.domElement;
		if (this.object.isPerspectiveCamera) {
			let r = this.object.position;
			W.copy(r).sub(this.target);
			let i = W.length();
			i *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * i / n.clientHeight, this.object.matrix), this._panUp(2 * t * i / n.clientHeight, this.object.matrix);
		} else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(t * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
	}
	_dollyOut(e) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
	}
	_dollyIn(e) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
	}
	_updateZoomParameters(e, t) {
		if (!this.zoomToCursor) return;
		this._performCursorZoom = !0;
		let n = this.domElement.getBoundingClientRect(), r = e - n.left, i = t - n.top, a = n.width, o = n.height;
		this._mouse.x = r / a * 2 - 1, this._mouse.y = -(i / o) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
	}
	_clampDistance(e) {
		return Math.max(this.minDistance, Math.min(this.maxDistance, e));
	}
	_handleMouseDownRotate(e) {
		this._rotateStart.set(e.clientX, e.clientY);
	}
	_handleMouseDownDolly(e) {
		this._updateZoomParameters(e.clientX, e.clientY), this._dollyStart.set(e.clientX, e.clientY);
	}
	_handleMouseDownPan(e) {
		this._panStart.set(e.clientX, e.clientY);
	}
	_handleMouseMoveRotate(e) {
		this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
		let t = this.domElement;
		this._rotateLeft(fe * this._rotateDelta.x / t.clientHeight), this._rotateUp(fe * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
	}
	_handleMouseMoveDolly(e) {
		this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.zoomToCursor && (this._performCursorZoom = !0, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize()), this.update();
	}
	_handleMouseMovePan(e) {
		this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
	}
	_handleMouseWheel(e) {
		this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
	}
	_handleKeyDown(e) {
		let t = !1;
		switch (e.code) {
			case this.keys.UP:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(fe * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), t = !0;
				break;
			case this.keys.BOTTOM:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(-fe * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), t = !0;
				break;
			case this.keys.LEFT:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(fe * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), t = !0;
				break;
			case this.keys.RIGHT: e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(-fe * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), t = !0;
		}
		t && (e.preventDefault(), this.update());
	}
	_handleTouchStartRotate(e) {
		if (this._pointers.length === 1) this._rotateStart.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._rotateStart.set(n, r);
		}
	}
	_handleTouchStartPan(e) {
		if (this._pointers.length === 1) this._panStart.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._panStart.set(n, r);
		}
	}
	_handleTouchStartDolly(e) {
		let t = this._getSecondPointerPosition(e), n = e.pageX - t.x, r = e.pageY - t.y, i = Math.sqrt(n * n + r * r);
		this._dollyStart.set(0, i);
	}
	_handleTouchStartDollyPan(e) {
		this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
	}
	_handleTouchStartDollyRotate(e) {
		this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
	}
	_handleTouchMoveRotate(e) {
		if (this._pointers.length == 1) this._rotateEnd.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._rotateEnd.set(n, r);
		}
		this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
		let t = this.domElement;
		this._rotateLeft(fe * this._rotateDelta.x / t.clientHeight), this._rotateUp(fe * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd);
	}
	_handleTouchMovePan(e) {
		if (this._pointers.length === 1) this._panEnd.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._panEnd.set(n, r);
		}
		this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
	}
	_handleTouchMoveDolly(e) {
		let t = this._getSecondPointerPosition(e), n = e.pageX - t.x, r = e.pageY - t.y, i = Math.sqrt(n * n + r * r);
		this._dollyEnd.set(0, i), this._dollyDelta.set(0, (this._dollyEnd.y / this._dollyStart.y) ** +this.zoomSpeed), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
		let a = (e.pageX + t.x) * .5, o = (e.pageY + t.y) * .5;
		this._updateZoomParameters(a, o);
	}
	_handleTouchMoveDollyPan(e) {
		this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
	}
	_handleTouchMoveDollyRotate(e) {
		this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
	}
	_addPointer(e) {
		this._pointers.push(e.pointerId);
	}
	_removePointer(e) {
		delete this._pointerPositions[e.pointerId];
		for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) {
			this._pointers.splice(t, 1);
			return;
		}
	}
	_isTrackingPointer(e) {
		for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) return !0;
		return !1;
	}
	_trackPointer(e) {
		let t = this._pointerPositions[e.pointerId];
		t === void 0 && (t = new j(), this._pointerPositions[e.pointerId] = t), t.set(e.pageX, e.pageY);
	}
	_getSecondPointerPosition(e) {
		let t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
		return this._pointerPositions[t];
	}
	_customWheelEvent(e) {
		let t = e.deltaMode, n = {
			clientX: e.clientX,
			clientY: e.clientY,
			deltaY: e.deltaY
		};
		switch (t) {
			case 1:
				n.deltaY *= 16;
				break;
			case 2: n.deltaY *= 100;
		}
		return e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
	}
};
function he(e) {
	this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(e.pointerId), this.domElement.ownerDocument.addEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.addEventListener("pointerup", this._onPointerUp)), this._isTrackingPointer(e) || (this._addPointer(e), e.pointerType === "touch" ? this._onTouchStart(e) : this._onMouseDown(e), this._cursorStyle === "grab" && (this.domElement.style.cursor = "grabbing")));
}
function ge(e) {
	this.enabled !== !1 && (e.pointerType === "touch" ? this._onTouchMove(e) : this._onMouseMove(e));
}
function _e(e) {
	switch (this._removePointer(e), this._pointers.length) {
		case 0:
			this.domElement.releasePointerCapture(e.pointerId), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(ce), this.state = G.NONE, this._cursorStyle === "grab" && (this.domElement.style.cursor = "grab");
			break;
		case 1:
			let t = this._pointers[0], n = this._pointerPositions[t];
			this._onTouchStart({
				pointerId: t,
				pageX: n.x,
				pageY: n.y
			});
	}
}
function ve(e) {
	let t;
	switch (e.button) {
		case 0:
			t = this.mouseButtons.LEFT;
			break;
		case 1:
			t = this.mouseButtons.MIDDLE;
			break;
		case 2:
			t = this.mouseButtons.RIGHT;
			break;
		default: t = -1;
	}
	switch (t) {
		case u.DOLLY:
			if (this.enableZoom === !1) return;
			this._handleMouseDownDolly(e), this.state = G.DOLLY;
			break;
		case u.ROTATE:
			if (e.ctrlKey || e.metaKey || e.shiftKey) {
				if (this.enablePan === !1) return;
				this._handleMouseDownPan(e), this.state = G.PAN;
			} else {
				if (this.enableRotate === !1) return;
				this._handleMouseDownRotate(e), this.state = G.ROTATE;
			}
			break;
		case u.PAN:
			if (e.ctrlKey || e.metaKey || e.shiftKey) {
				if (this.enableRotate === !1) return;
				this._handleMouseDownRotate(e), this.state = G.ROTATE;
			} else {
				if (this.enablePan === !1) return;
				this._handleMouseDownPan(e), this.state = G.PAN;
			}
			break;
		default: this.state = G.NONE;
	}
	this.state !== G.NONE && this.dispatchEvent(se);
}
function ye(e) {
	switch (this.state) {
		case G.ROTATE:
			if (this.enableRotate === !1) return;
			this._handleMouseMoveRotate(e);
			break;
		case G.DOLLY:
			if (this.enableZoom === !1) return;
			this._handleMouseMoveDolly(e);
			break;
		case G.PAN:
			if (this.enablePan === !1) return;
			this._handleMouseMovePan(e);
	}
}
function be(e) {
	this.enabled !== !1 && this.enableZoom !== !1 && this.state === G.NONE && (e.preventDefault(), this.dispatchEvent(se), this._handleMouseWheel(this._customWheelEvent(e)), this.dispatchEvent(ce));
}
function xe(e) {
	this.enabled !== !1 && this._handleKeyDown(e);
}
function Se(e) {
	switch (this._trackPointer(e), this._pointers.length) {
		case 1:
			switch (this.touches.ONE) {
				case T.ROTATE:
					if (this.enableRotate === !1) {
						this.state = G.NONE;
						break;
					}
					this._handleTouchStartRotate(e), this.state = G.TOUCH_ROTATE;
					break;
				case T.PAN:
					if (this.enablePan === !1) {
						this.state = G.NONE;
						break;
					}
					this._handleTouchStartPan(e), this.state = G.TOUCH_PAN;
					break;
				default: this.state = G.NONE;
			}
			break;
		case 2:
			switch (this.touches.TWO) {
				case T.DOLLY_PAN:
					if (this.enableZoom === !1 && this.enablePan === !1) return;
					this._handleTouchStartDollyPan(e), this.state = G.TOUCH_DOLLY_PAN;
					break;
				case T.DOLLY_ROTATE:
					if (this.enableZoom === !1 && this.enableRotate === !1) return;
					this._handleTouchStartDollyRotate(e), this.state = G.TOUCH_DOLLY_ROTATE;
					break;
				default: this.state = G.NONE;
			}
			break;
		default: this.state = G.NONE;
	}
	this.state !== G.NONE && this.dispatchEvent(se);
}
function Ce(e) {
	switch (this._trackPointer(e), this.state) {
		case G.TOUCH_ROTATE:
			if (this.enableRotate === !1) return;
			this._handleTouchMoveRotate(e), this.update();
			break;
		case G.TOUCH_PAN:
			if (this.enablePan === !1) return;
			this._handleTouchMovePan(e), this.update();
			break;
		case G.TOUCH_DOLLY_PAN:
			if (this.enableZoom === !1 && this.enablePan === !1) return;
			this._handleTouchMoveDollyPan(e), this.update();
			break;
		case G.TOUCH_DOLLY_ROTATE:
			if (this.enableZoom === !1 && this.enableRotate === !1) return;
			this._handleTouchMoveDollyRotate(e), this.update();
			break;
		default: this.state = G.NONE;
	}
}
function we(e) {
	this.enabled !== !1 && e.preventDefault();
}
function Te(e) {
	e.key === "Control" && (this._controlActive = !0, this.domElement.ownerDocument.addEventListener("keyup", this._interceptControlUp, {
		passive: !0,
		capture: !0
	}));
}
function Ee(e) {
	e.key === "Control" && (this._controlActive = !1, this.domElement.ownerDocument.removeEventListener("keyup", this._interceptControlUp, {
		passive: !0,
		capture: !0
	}));
}
// node_modules/@myned-ai/gsplat-flame-avatar-renderer/dist/gsplat-flame-avatar-renderer.esm.min.js
var De = {
	None: 0,
	Error: 1,
	Warning: 2,
	Info: 3,
	Debug: 4
}, Oe = {
	Always: 0,
	OnChange: 1,
	Never: 2
}, ke = { Ply: 0 }, Ae = (e) => e.endsWith(".ply") ? ke.Ply : null, je = {
	Default: 0,
	Gradual: 1,
	Instant: 2
}, Me = {
	ThreeD: 0,
	TwoD: 1
}, K = class {
	static DefaultSplatSortDistanceMapPrecision = 16;
	static MemoryPageSize = 65536;
	static BytesPerFloat = 4;
	static BytesPerInt = 4;
	static MaxScenes = 32;
	static ProgressiveLoadSectionSize = 262144;
	static ProgressiveLoadSectionDelayDuration = 15;
	static SphericalHarmonics8BitCompressionRange = 3;
}, Ne = K.SphericalHarmonics8BitCompressionRange, Pe = 6, Fe = 4, Ie = 4, Le = 4, Re = 6, ze = 8, Be = 4, Ve = 4, He = 1, Ue = .012, We = .003, Ge = 50, Ke = .5, qe = 60, Je = 15e5, Ye = .4, Xe = .12, Ze = {
	DirectToSplatBuffer: 0,
	DirectToSplatArray: 1,
	DownloadBeforeProcessing: 2
}, Qe = {
	Downloading: 0,
	Processing: 1,
	Done: 2
}, $e = class {
	static decodeText(e) {
		if (typeof TextDecoder < "u") return new TextDecoder().decode(e);
		let t = "";
		for (let n = 0, r = e.length; n < r; n++) t += String.fromCharCode(e[n]);
		try {
			return decodeURIComponent(escape(t));
		} catch {
			return t;
		}
	}
	static extractUrlBase(e) {
		let t = e.lastIndexOf("/");
		return t === -1 ? "./" : e.slice(0, t + 1);
	}
	static resolveURL(e, t) {
		return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
	}
}, et = class extends Error {
	constructor(e, t, n = null) {
		super(e), this.name = this.constructor.name, this.code = t, this.cause = n, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			stack: this.stack,
			cause: this.cause ? {
				name: this.cause.name,
				message: this.cause.message
			} : null
		};
	}
}, q = class extends et {
	constructor(e, t, n = null) {
		super(e, "VALIDATION_ERROR", n), this.field = t;
	}
}, tt = class extends et {
	constructor(e, t = 0, n = null) {
		super(e, "NETWORK_ERROR", n), this.statusCode = t;
	}
}, nt = class extends et {
	constructor(e, t, n = null) {
		super(e, "ASSET_LOAD_ERROR", n), this.assetPath = t;
	}
}, rt = class extends et {
	constructor(e) {
		super(`Cannot use ${e}: resource has been disposed`, "RESOURCE_DISPOSED_ERROR"), this.resourceName = e;
	}
}, it = class extends et {
	constructor(e, t, n = null) {
		super(e, "INITIALIZATION_ERROR", n), this.component = t;
	}
}, at = class extends et {
	constructor(e, t, n = null) {
		super(e, "PARSE_ERROR", n), this.dataType = t;
	}
}, ot = Object.freeze({
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	NONE: 4
}), st = class e {
	constructor(e, t = ot.INFO) {
		this.namespace = e, this.minLevel = t;
	}
	setLevel(e) {
		this.minLevel = e;
	}
	_format(e, t) {
		return [`[${(/* @__PURE__ */ new Date()).toISOString()}] [${e}] [${this.namespace}]`, ...t];
	}
	debug(...e) {
		this.minLevel <= ot.DEBUG && this._format("DEBUG", e);
	}
	info(...e) {
		this.minLevel <= ot.INFO && console.info(...this._format("INFO", e));
	}
	warn(...e) {
		this.minLevel <= ot.WARN && console.warn(...this._format("WARN", e));
	}
	error(...e) {
		this.minLevel <= ot.ERROR && console.error(...this._format("ERROR", e));
	}
	errorWithTrace(e, t = "") {
		if (this.minLevel <= ot.ERROR) {
			let n = t ? ` Context: ${t}` : "";
			console.error(...this._format("ERROR", [
				`${e.message}${n}`,
				"\nStack:",
				e.stack
			]));
		}
	}
	child(t) {
		return new e(`${this.namespace}:${t}`, this.minLevel);
	}
}, ct = /* @__PURE__ */ new Map(), lt = ot.INFO;
function ut(e) {
	lt = e;
	for (let t of ct.values()) t.setLevel(e);
}
function dt(e) {
	return ct.has(e) || ct.set(e, new st(e, lt)), ct.get(e);
}
function ft() {
	ut(ot.NONE);
}
function pt() {
	ut(ot.DEBUG);
}
dt("App");
var mt = dt("Util"), ht = class extends Error {
	constructor(e) {
		super(e), this.name = "AbortedPromiseError", this.code = "ABORTED";
	}
}, gt = function(e, t, n = !0, r) {
	let i = new AbortController(), a = i.signal, o = !1, s = !1, c = (e, n, r, i) => {
		if (t && !s) try {
			t(e, n, r, i), e === 100 && (s = !0);
		} catch (e) {
			mt.error("Error in progress callback:", e);
		}
	}, l = new Promise((t, i) => {
		let s = { signal: a };
		r && (s.headers = r), fetch(e, s).then(async (e) => {
			if (!e.ok) {
				let t = "";
				try {
					t = await e.text();
				} catch {}
				i(new tt(`Fetch failed: ${e.statusText}${t ? " - " + t : ""}`, e.status));
				return;
			}
			let r = e.body?.getReader();
			if (!r) return void i(new tt("Response body is not readable", 0));
			let a = 0, s = e.headers.get("Content-Length"), l = s ? parseInt(s, 10) : void 0, u = [];
			for (; !o;) try {
				let { value: e, done: i } = await r.read();
				if (i) {
					c(100, "100%", e, l), n ? t(new Blob(u).arrayBuffer()) : t();
					break;
				}
				let o, s;
				a += e.length, l !== void 0 && (o = a / l * 100, s = `${o.toFixed(2)}%`), n && u.push(e), c(o, s, e, l);
			} catch (e) {
				i(new tt(`Error reading response stream: ${e.message}`, 0, e));
				return;
			}
		}).catch((e) => {
			e instanceof tt ? i(e) : e.name === "AbortError" ? i(new tt("Fetch aborted by user", 0, e)) : i(new tt(`Fetch failed: ${e.message || "Unknown error"}`, 0, e));
		});
	});
	return l.abort = (e) => {
		o = !0, i.abort(e);
	}, l.abortController = i, l;
}, _t = function(e, t, n) {
	return Math.max(Math.min(e, n), t);
}, vt = function() {
	return performance.now() / 1e3;
}, yt = (e) => {
	if (e.geometry &&= (e.geometry.dispose(), null), e.material &&= (e.material.dispose(), null), e.children) for (let t of e.children) yt(t);
}, bt = (e, t) => new Promise((n) => {
	window.setTimeout(() => {
		n(e());
	}, t ? 1 : 50);
}), xt = (e = 0) => {
	switch (e) {
		case 1: return 9;
		case 2: return 24;
	}
	return 0;
}, St = () => {
	let e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}, Ct = (e) => {
	let t, n, r = new Promise((e, r) => {
		t = e, n = r;
	});
	return r.abort = e || (() => {}), {
		promise: r,
		resolve: t,
		reject: n
	};
}, wt = class {
	constructor(e, t, n) {
		this.major = e, this.minor = t, this.patch = n;
	}
	toString() {
		return `${this.major}_${this.minor}_${this.patch}`;
	}
};
function Tt() {
	let e = navigator.userAgent;
	return e.indexOf("iPhone") > 0 || e.indexOf("iPad") > 0;
}
function Et() {
	if (Tt()) {
		let e = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
		return new wt(parseInt(e[1] || 0, 10), parseInt(e[2] || 0, 10), parseInt(e[3] || 0, 10));
	}
	return null;
}
var Dt = O.toHalfFloat.bind(O), Ot = O.fromHalfFloat.bind(O), kt = Ne / 2, At = (e, t, n = !1, r, i) => t === 0 ? e : t === 1 || t === 2 && !n ? O.fromHalfFloat(e) : t === 2 ? Mt(e, r, i) : void 0, jt = (e, t, n) => {
	e = _t(e, t, n);
	let r = n - t;
	return _t(Math.floor((e - t) / r * 255), 0, 255);
}, Mt = (e, t, n) => e / 255 * (n - t) + t, Nt = (e, t, n) => jt(Ot(e), t, n), Pt = (e, t, n) => Dt(Mt(e, t, n)), Ft = (e, t, n, r = !1) => n === 0 ? e.getFloat32(4 * t, !0) : n === 1 || n === 2 && !r ? e.getUint16(2 * t, !0) : e.getUint8(t, !0), It = function() {
	let e = (e) => e;
	return function(t, n, r, i = !1) {
		if (n === r) return t;
		let a = e;
		return n === 2 && i ? r === 1 ? a = Pt : r === 0 && (a = Mt) : n === 2 || n === 1 ? r === 0 ? a = Ot : r === 2 && (a = i ? Nt : e) : n === 0 && (r === 1 ? a = Dt : r === 2 && (a = i ? jt : Dt)), a(t);
	};
}(), Lt = (e, t, n, r, i = 0) => {
	let a = new Uint8Array(e, t), o = new Uint8Array(n, r);
	for (let e = 0; e < i; e++) o[e] = a[e];
}, Rt = function() {
	let e = /* @__PURE__ */ new Float32Array(1), t = new Int32Array(e.buffer);
	return function(n) {
		e[0] = n;
		let r = t[0], i = r >> 16 & 32768, a = r >> 12 & 2047, o = r >> 23 & 255;
		return o < 103 ? i : o > 142 ? (i |= 31744, i |= (o == 255 ? 0 : 1) && 8388607 & r, i) : o < 113 ? (a |= 2048, i |= (a >> 114 - o) + (a >> 113 - o & 1), i) : (i |= o - 112 << 10 | a >> 1, i += 1 & a, i);
	};
}(), zt = function() {
	let e = /* @__PURE__ */ new Float32Array(1), t = new Int32Array(e.buffer);
	return function(n) {
		return e[0] = n, t[0];
	};
}(), Bt = function(e, t, n, r) {
	return e + (t << 8) + (n << 16) + (r << 24);
}, Vt = function(e, t) {
	return e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
}, Ht = 14, Ut = Object.freeze([
	"https:",
	"http:",
	"blob:",
	"data:"
]);
function Wt(e, t) {
	if (typeof e != "string" || e.length === 0) throw new q("URL must be a non-empty string", "url");
	let n;
	try {
		let r = t || (typeof window < "u" ? window.location.href : void 0);
		n = new URL(e, r);
	} catch (t) {
		throw new q(`Invalid URL format: ${e}`, "url", t);
	}
	if (!Ut.includes(n.protocol)) throw new q(`Disallowed protocol: ${n.protocol}. Allowed protocols: ${Ut.join(", ")}`, "url.protocol");
	return n.href;
}
function Gt(e) {
	if (typeof e != "string" || e.length === 0) throw new q("Asset path must be a non-empty string", "path");
	let t = [
		"../",
		"..\\",
		"%2e%2e/",
		"%2e%2e\\"
	], n = e.toLowerCase();
	for (let r of t) if (n.includes(r)) throw new q(`Path traversal detected in asset path: ${e}`, "path");
	return e;
}
function Kt(e, t) {
	if (typeof e != "string" || e.length === 0) throw new q("Filename must be a non-empty string", "filename");
	if (!Array.isArray(t) || t.length === 0) throw new q("allowedExtensions must be a non-empty array", "allowedExtensions");
	let n = e.slice(e.lastIndexOf(".")).toLowerCase();
	if (!t.map((e) => e.toLowerCase()).includes(n)) throw new q(`File extension ${n} not allowed. Allowed: ${t.join(", ")}`, "filename");
	return e;
}
function qt(e, t, n, r) {
	if (typeof e != "number" || isNaN(e)) throw new q(`${r} must be a valid number`, r);
	if (e < t || e > n) throw new q(`${r} must be between ${t} and ${n}, got ${e}`, r);
	return e;
}
function Jt(e, t) {
	if (typeof e != "number" || !Number.isInteger(e)) throw new q(`${t} must be an integer`, t);
	return e;
}
function Yt(e, t) {
	if (Jt(e, t), e <= 0) throw new q(`${t} must be positive, got ${e}`, t);
	return e;
}
function Xt(e, t, n) {
	if (typeof e != "object" || !e) throw new q(`${n} must be an object`, n);
	for (let r of t) if (!(r in e) || e[r] === void 0) throw new q(`${n} missing required property: ${r}`, `${n}.${r}`);
	return e;
}
function Zt(e, t, n = 0) {
	if (!(e instanceof ArrayBuffer)) throw new q(`${t} must be an ArrayBuffer`, t);
	if (e.byteLength < n) throw new q(`${t} must be at least ${n} bytes, got ${e.byteLength}`, t);
	return e;
}
function Qt(e, t, n) {
	if (!t.includes(e)) throw new q(`${n} must be one of: ${t.join(", ")}. Got: ${e}`, n);
	return e;
}
function $t(e, t, n = !0) {
	if (e == null) {
		if (n) throw new q(`${t} is required`, t);
		return null;
	}
	if (typeof e != "function") throw new q(`${t} must be a function`, t);
	return e;
}
function en(e, t) {
	if (typeof e != "string") throw new q(`${t} must be a string`, t);
	if (!/^(#|0x)[0-9A-Fa-f]{6}$/i.test(e)) throw new q(`${t} must be a valid hex color (e.g., #FFFFFF or 0xFFFFFF)`, t);
	return e;
}
function tn(e, t) {
	if (typeof HTMLElement < "u" && !(e instanceof HTMLElement)) throw new q(`${t} must be a valid HTML element`, t);
	return e;
}
var nn = class {
	constructor(e, t, n = 10) {
		this._factory = e, this._reset = t, this._pool = [], this._allocated = 0, this._maxSize = 10 * n;
		for (let t = 0; t < n; t++) this._pool.push(e());
	}
	acquire() {
		return this._allocated++, this._pool.length > 0 ? this._pool.pop() : this._factory();
	}
	release(e) {
		this._allocated--, this._pool.length < this._maxSize && (this._reset(e), this._pool.push(e));
	}
	releaseAll(e) {
		for (let t of e) this.release(t);
	}
	getStats() {
		return {
			available: this._pool.length,
			allocated: this._allocated,
			maxSize: this._maxSize
		};
	}
	dispose() {
		this._pool.length = 0, this._allocated = 0;
	}
}, rn = new nn(() => new k(), (e) => e.set(0, 0, 0), 50), an = new nn(() => new r(), (e) => e.identity(), 20), on = new nn(() => new _(), (e) => e.set(0, 0, 0, 1), 30), sn = new nn(() => new re(), (e) => e.set(0, 0, 0), 30), cn = class {
	constructor() {
		this._allocated = [];
	}
	vector3() {
		let e = rn.acquire();
		return this._allocated.push({
			pool: rn,
			obj: e
		}), e;
	}
	matrix4() {
		let e = an.acquire();
		return this._allocated.push({
			pool: an,
			obj: e
		}), e;
	}
	quaternion() {
		let e = on.acquire();
		return this._allocated.push({
			pool: on,
			obj: e
		}), e;
	}
	euler() {
		let e = sn.acquire();
		return this._allocated.push({
			pool: sn,
			obj: e
		}), e;
	}
	releaseAll() {
		for (let { pool: e, obj: t } of this._allocated) e.release(t);
		this._allocated.length = 0;
	}
	getAllocatedCount() {
		return this._allocated.length;
	}
}, ln = new k(), un = new k(), dn = new k(), fn = new r(), pn = new r(), mn = new _(), hn = new _(), gn = new re(0, 0, 0, "YXZ");
function _n() {
	return {
		vector3: rn.getStats(),
		matrix4: an.getStats(),
		quaternion: on.getStats(),
		euler: sn.getStats()
	};
}
function vn() {
	rn.dispose(), an.dispose(), on.dispose(), sn.dispose();
}
var yn = dt("BlobUrlManager"), bn = class {
	constructor() {
		this._urls = /* @__PURE__ */ new Map(), this._disposed = !1;
	}
	_assertNotDisposed() {
		if (this._disposed) throw Error("BlobUrlManager has been disposed");
	}
	createBlobUrl(e, t, n = "") {
		if (this._assertNotDisposed(), typeof t != "string" || t.length === 0) throw new q("mimeType must be a non-empty string", "mimeType");
		let r;
		if (e instanceof Blob) r = e;
		else {
			if (!(e instanceof ArrayBuffer || e instanceof Uint8Array)) throw new q("data must be Blob, ArrayBuffer, or Uint8Array", "data");
			r = new Blob([e], { type: t });
		}
		let i = URL.createObjectURL(r);
		return this._urls.set(i, {
			createdAt: Date.now(),
			mimeType: t,
			label: n || "unlabeled",
			size: r.size
		}), yn.debug(`Created blob URL: ${n || i.substring(0, 50)}, size: ${r.size} bytes`), i;
	}
	registerBlobUrl(e, t = "") {
		if (this._assertNotDisposed(), typeof e != "string" || !e.startsWith("blob:")) throw new q("url must be a valid blob URL", "url");
		this._urls.has(e) || (this._urls.set(e, {
			createdAt: Date.now(),
			mimeType: "unknown",
			label: t || "registered-external",
			size: 0
		}), yn.debug(`Registered external blob URL: ${t || e.substring(0, 50)}`));
	}
	revokeBlobUrl(e) {
		if (this._assertNotDisposed(), this._urls.has(e)) {
			let t = this._urls.get(e);
			return URL.revokeObjectURL(e), this._urls.delete(e), yn.debug(`Revoked blob URL: ${t.label}, age: ${Date.now() - t.createdAt}ms`), !0;
		}
		return !1;
	}
	revokeAll() {
		this._assertNotDisposed(), yn.debug(`Revoking ${this._urls.size} blob URLs`);
		for (let e of this._urls.keys()) URL.revokeObjectURL(e);
		this._urls.clear();
	}
	getMetadata(e) {
		return this._urls.get(e) || null;
	}
	getAllTrackedUrls() {
		let e = [];
		for (let [t, n] of this._urls.entries()) e.push({
			url: t,
			metadata: n
		});
		return e;
	}
	getStats() {
		let e = 0, t = 0, n = Date.now();
		for (let r of this._urls.values()) {
			e += r.size;
			let i = n - r.createdAt;
			i > t && (t = i);
		}
		return {
			count: this._urls.size,
			totalSize: e,
			oldestAge: t
		};
	}
	revokeOlderThan(e) {
		this._assertNotDisposed();
		let t = Date.now(), n = [];
		for (let [r, i] of this._urls.entries()) t - i.createdAt > e && n.push(r);
		for (let e of n) this.revokeBlobUrl(e);
		return n.length > 0 && yn.info(`Revoked ${n.length} blob URLs older than ${e}ms`), n.length;
	}
	isTracked(e) {
		return this._urls.has(e);
	}
	dispose() {
		this._disposed ||= (yn.debug("Disposing BlobUrlManager"), this.revokeAll(), !0);
	}
}, xn = new bn();
function Sn() {
	return xn;
}
function Cn(e, t, n) {
	return xn.createBlobUrl(e, t, n);
}
function wn(e) {
	return xn.revokeBlobUrl(e);
}
var Tn = dt("RenderLoop"), En = class {
	constructor(e, t, n = {}) {
		this._update = e, this._render = t, this._targetFps = n.targetFps || 60, this._maxDeltaTime = n.maxDeltaTime || .1, this._frameBudget = 1e3 / this._targetFps, this._running = !1, this._rafId = null, this._lastTime = 0, this._frameCount = 0, this._deferredTasks = [], this._fpsHistory = [], this._fpsHistorySize = 60, this._lastFpsUpdate = 0, this._currentFps = 0;
	}
	start() {
		this._running ? Tn.warn("RenderLoop already running") : (this._running = !0, this._lastTime = performance.now(), this._frameCount = 0, Tn.info("RenderLoop started"), this._tick());
	}
	stop() {
		this._running && (this._running = !1, this._rafId !== null && (cancelAnimationFrame(this._rafId), this._rafId = null), Tn.info(`RenderLoop stopped after ${this._frameCount} frames`));
	}
	_tick = () => {
		if (!this._running) return;
		let e = performance.now(), t = (e - this._lastTime) / 1e3, n = Math.min(t, this._maxDeltaTime);
		this._lastTime = e, this._frameCount++;
		try {
			this._update(n), this._render();
			let t = performance.now() - e, r = this._frameBudget - t;
			r > 1 && this._deferredTasks.length > 0 && this._processDeferredTasks(r - 1), this._updateFpsTracking(performance.now() - e);
		} catch (e) {
			Tn.error("Error in render loop:", e);
		}
		this._rafId = requestAnimationFrame(this._tick);
	};
	_updateFpsTracking(e) {
		this._fpsHistory.push(1e3 / e), this._fpsHistory.length > this._fpsHistorySize && this._fpsHistory.shift();
		let t = performance.now();
		t - this._lastFpsUpdate > 1e3 && (this._currentFps = this._fpsHistory.reduce((e, t) => e + t, 0) / this._fpsHistory.length, this._lastFpsUpdate = t);
	}
	_processDeferredTasks(e) {
		let t = performance.now();
		for (; this._deferredTasks.length > 0 && !(performance.now() - t >= e);) {
			let e = this._deferredTasks.shift();
			try {
				e.fn();
			} catch (t) {
				Tn.error(`Error in deferred task: ${e.label}`, t);
			}
		}
	}
	executeOrDefer(e, t = 0, n = "") {
		performance.now() - this._lastTime < .8 * this._frameBudget ? e() : (this._deferredTasks.push({
			fn: e,
			priority: t,
			label: n
		}), this._deferredTasks.sort((e, t) => t.priority - e.priority));
	}
	getFps() {
		return Math.round(this._currentFps);
	}
	getStats() {
		return {
			fps: this.getFps(),
			frameCount: this._frameCount,
			deferredTaskCount: this._deferredTasks.length,
			running: this._running
		};
	}
	isRunning() {
		return this._running;
	}
	getFrameCount() {
		return this._frameCount;
	}
	clearDeferredTasks() {
		this._deferredTasks.length = 0, Tn.debug("Cleared all deferred tasks");
	}
}, Dn = class {
	constructor(e = 60, t = null) {
		this._targetFps = e, this._frameBudget = 1e3 / e, this._onViolation = t, this._violations = 0, this._frameStart = 0;
	}
	startFrame() {
		this._frameStart = performance.now();
	}
	checkBudget(e = "") {
		let t = performance.now() - this._frameStart, n = t < this._frameBudget;
		return n || (this._violations++, this._onViolation && this._onViolation({
			location: e,
			elapsed: t,
			budget: this._frameBudget,
			overrun: t - this._frameBudget
		}), Tn.warn(`Frame budget violation at ${e}: ${t.toFixed(2)}ms / ${this._frameBudget.toFixed(2)}ms`)), n;
	}
	getViolationCount() {
		return this._violations;
	}
	resetViolations() {
		this._violations = 0;
	}
}, On = dt("EventEmitter"), kn = class {
	constructor() {
		this._listeners = /* @__PURE__ */ new Map(), this._disposed = !1, this._eventHistory = [], this._maxHistorySize = 50;
	}
	_assertNotDisposed() {
		if (this._disposed) throw Error("EventEmitter has been disposed");
	}
	on(e, t, n = {}) {
		if (this._assertNotDisposed(), typeof e != "string" || e.length === 0) throw new q("event must be a non-empty string", "event");
		if (typeof t != "function") throw new q("callback must be a function", "callback");
		let r = n.once ? (...n) => {
			this.off(e, r), t(...n);
		} : t;
		return n.once && (r._originalCallback = t), this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set()), this._listeners.get(e).add(r), On.debug(`Subscribed to event: ${e}`), () => this.off(e, r);
	}
	once(e, t) {
		return this.on(e, t, { once: !0 });
	}
	off(e, t) {
		this._assertNotDisposed();
		let n = this._listeners.get(e);
		if (!n) return !1;
		if (n.delete(t)) return On.debug(`Unsubscribed from event: ${e}`), !0;
		for (let r of n) if (r._originalCallback === t) return n.delete(r), On.debug(`Unsubscribed from event: ${e} (once listener)`), !0;
		return !1;
	}
	removeAllListeners(e = null) {
		if (this._assertNotDisposed(), e) {
			let t = this._listeners.get(e)?.size || 0;
			this._listeners.delete(e), On.debug(`Removed ${t} listeners for event: ${e}`);
		} else {
			let e = Array.from(this._listeners.values()).reduce((e, t) => e + t.size, 0);
			this._listeners.clear(), On.debug(`Removed all ${e} listeners`);
		}
	}
	emit(e, ...t) {
		this._assertNotDisposed();
		let n = this._listeners.get(e);
		if (!n || n.size === 0) return !1;
		this._recordEvent(e, t);
		let r = 0;
		for (let i of n) try {
			i(...t), r++;
		} catch (t) {
			On.error(`Error in event listener for '${e}':`, t);
		}
		return On.debug(`Emitted event: ${e} to ${r} listeners`), !0;
	}
	_recordEvent(e, t) {
		this._eventHistory.push({
			event: e,
			timestamp: Date.now(),
			argCount: t.length
		}), this._eventHistory.length > this._maxHistorySize && this._eventHistory.shift();
	}
	getEventHistory() {
		return [...this._eventHistory];
	}
	hasListeners(e) {
		let t = this._listeners.get(e);
		return !!t && t.size > 0;
	}
	listenerCount(e) {
		let t = this._listeners.get(e);
		return t ? t.size : 0;
	}
	eventNames() {
		return Array.from(this._listeners.keys());
	}
	getStats() {
		let e = {
			totalEvents: this._listeners.size,
			totalListeners: 0,
			eventBreakdown: {}
		};
		for (let [t, n] of this._listeners.entries()) {
			let r = n.size;
			e.totalListeners += r, e.eventBreakdown[t] = r;
		}
		return e;
	}
	dispose() {
		this._disposed ||= (On.debug("Disposing EventEmitter"), this.removeAllListeners(), this._eventHistory.length = 0, !0);
	}
}, An = class extends kn {
	constructor(e) {
		super(), this._allowedEvents = new Set(e);
	}
	_validateEvent(e) {
		if (!this._allowedEvents.has(e)) throw new q(`Event '${e}' is not registered. Allowed events: ${Array.from(this._allowedEvents).join(", ")}`, "event");
	}
	on(e, t, n) {
		return this._validateEvent(e), super.on(e, t, n);
	}
	emit(e, ...t) {
		return this._validateEvent(e), super.emit(e, ...t);
	}
}, J = {
	Idle: "Idle",
	Listening: "Listening",
	Responding: "Responding",
	Thinking: "Thinking"
}, jn = /* @__PURE__ */ "browDownLeft.browDownRight.browInnerUp.browOuterUpLeft.browOuterUpRight.cheekPuff.cheekSquintLeft.cheekSquintRight.eyeBlinkLeft.eyeBlinkRight.eyeLookDownLeft.eyeLookDownRight.eyeLookInLeft.eyeLookInRight.eyeLookOutLeft.eyeLookOutRight.eyeLookUpLeft.eyeLookUpRight.eyeSquintLeft.eyeSquintRight.eyeWideLeft.eyeWideRight.jawForward.jawLeft.jawOpen.jawRight.mouthClose.mouthDimpleLeft.mouthDimpleRight.mouthFrownLeft.mouthFrownRight.mouthFunnel.mouthLeft.mouthLowerDownLeft.mouthLowerDownRight.mouthPressLeft.mouthPressRight.mouthPucker.mouthRight.mouthRollLower.mouthRollUpper.mouthShrugLower.mouthShrugUpper.mouthSmileLeft.mouthSmileRight.mouthStretchLeft.mouthStretchRight.mouthUpperUpLeft.mouthUpperUpRight.noseSneerLeft.noseSneerRight.tongueOut".split("."), Mn = [
	"root",
	"neck",
	"jaw",
	"leftEye",
	"rightEye"
], Nn = jn.length, Pn = Mn.length, Fn = dt("AnimationManager"), In = class {
	constructor(e, t) {
		this.isPlaying = !1, this.stage = 0, this.actions = e || [], this.blendingTime = .5, this.isGroup = t || !1;
	}
	dispose() {
		this.actions = [];
	}
	update(e) {}
}, Ln = class extends In {
	constructor(e, t) {
		super(e, t);
	}
	update(e) {
		if (this.actions && this.actions.length !== 0 && (Y.CurPlaying === void 0 && e === J.Idle && !1 === this.isPlaying && (this.stage = 0, this.actions[this.stage].time = 0, Y.SetWeight(this.actions[this.stage], 1), this.actions[this.stage].loop = 2201, this.actions[this.stage].clampWhenFinished = !1, this.actions[this.stage].paused = !1, this.actions[this.stage].play(), Y.LastAction !== void 0 && Y.PrepareCrossFade(Y.LastAction, this.actions[this.stage], this.blendingTime), this.isPlaying = !0), Y.CurPlaying === J.Idle && e === J.Idle && !0 === this.isPlaying && this.actions[this.stage].time > this.actions[this.stage].getClip().duration - this.blendingTime)) {
			let e = this.stage + 1;
			e >= this.actions.length && (e = 0), this.actions[e].time = 0, Y.SetWeight(this.actions[e], 1), this.actions[e].loop = s, this.actions[e].play(), Y.PrepareCrossFade(this.actions[this.stage], this.actions[e], this.blendingTime), this.stage = e;
		}
	}
}, Rn = class extends In {
	constructor(e, t) {
		super(e, t);
	}
	update(e) {
		this.actions && this.actions.length !== 0 && (Y.CurPlaying === void 0 && e === J.Idle && !1 === this.isPlaying && (this.stage = 0, this.actions[this.stage].time = 0, Y.SetWeight(this.actions[this.stage], 1), this.actions[this.stage].loop = 2201, this.actions[this.stage].clampWhenFinished = !1, this.actions[this.stage].paused = !1, this.actions[this.stage].play(), Y.LastAction !== void 0 && Y.PrepareCrossFade(Y.LastAction, this.actions[this.stage], this.blendingTime), this.isPlaying = !0), Y.CurPlaying === J.Idle && e !== J.Idle && !0 === this.isPlaying && this.stage === 0 && (this.actions[this.stage].loop = 2200, this.actions[this.stage].clampWhenFinished = !0, this.isPlaying = !1, Y.LastAction = this.actions[this.stage]));
	}
}, zn = class extends In {
	constructor(e, t) {
		super(e, t);
	}
	update(e) {
		this.actions && this.actions.length !== 0 && (Y.CurPlaying === void 0 && e === J.Listening && !1 === this.isPlaying && (this.stage = 0, this.actions[this.stage].time = 0, this.actions[this.stage].play(), Y.SetWeight(this.actions[this.stage], 1), this.actions[this.stage].loop = this.isGroup ? 2200 : 2201, this.actions[this.stage].clampWhenFinished = !!this.isGroup, Y.LastAction !== void 0 && Y.PrepareCrossFade(Y.LastAction, this.actions[this.stage], this.blendingTime), this.isPlaying = !0), this.isGroup && (Y.CurPlaying === J.Listening && e === J.Listening && !0 === this.isPlaying && this.stage === 0 && this.actions[this.stage].time > this.actions[this.stage].getClip().duration - this.blendingTime && (this.actions[this.stage + 1].time = 0, Y.SetWeight(this.actions[this.stage + 1], 1), this.actions[this.stage + 1].loop = 2201, this.actions[this.stage + 1].play(), Y.PrepareCrossFade(this.actions[this.stage], this.actions[this.stage + 1], this.blendingTime), this.stage = 1), Y.CurPlaying !== J.Listening || e === J.Listening || !0 !== this.isPlaying || this.stage !== 0 && this.stage !== 1 || (this.actions[2].time = 0, this.actions[2].play(), Y.SetWeight(this.actions[2], 1), this.actions[2].loop = 2200, Y.PrepareCrossFade(this.actions[this.stage], this.actions[2], this.blendingTime), this.stage = 2)), Y.CurPlaying === J.Listening && e !== J.Listening && !0 === this.isPlaying && this.stage === (this.isGroup ? this.actions.length - 1 : 0) && (this.actions[this.stage].loop = 2200, this.actions[this.stage].clampWhenFinished = !0, this.isPlaying = !1, Y.LastAction = this.actions[this.stage]));
	}
}, Bn = class extends In {
	constructor(e, t) {
		super(e, t);
	}
	update(e) {
		this.actions && this.actions.length !== 0 && (Y.CurPlaying === void 0 && e === J.Thinking && !1 === this.isPlaying && (this.stage = 0, this.actions[this.stage].time = 0, this.actions[this.stage].play(), Y.SetWeight(this.actions[this.stage], 1), this.actions[this.stage].loop = 2200, Y.LastAction !== void 0 && Y.PrepareCrossFade(Y.LastAction, this.actions[this.stage], this.blendingTime), this.isPlaying = !0), this.isGroup && (Y.CurPlaying === J.Thinking && e === J.Thinking && !0 === this.isPlaying && this.stage === 0 && this.actions[this.stage].time > this.actions[this.stage].getClip().duration - this.blendingTime && (this.actions[this.stage + 1].time = 0, Y.SetWeight(this.actions[this.stage + 1], 1), this.actions[this.stage + 1].loop = 2201, this.actions[this.stage + 1].play(), Y.PrepareCrossFade(this.actions[this.stage], this.actions[this.stage + 1], this.blendingTime), this.stage = 1), Y.CurPlaying !== J.Thinking || e === J.Thinking || !0 !== this.isPlaying || this.stage !== 0 && this.stage !== 1 || (this.actions[2].time = 0, this.actions[2].play(), Y.SetWeight(this.actions[2], 1), this.actions[2].loop = 2200, Y.PrepareCrossFade(this.actions[this.stage], this.actions[2], this.blendingTime), this.stage = 2)), Y.CurPlaying === J.Thinking && e !== J.Thinking && !0 === this.isPlaying && this.stage === (this.isGroup ? this.actions.length - 1 : 0) && (this.actions[this.stage].loop = 2200, this.actions[this.stage].clampWhenFinished = !0, this.isPlaying = !1, Y.LastAction = this.actions[this.stage]));
	}
}, Vn = class extends In {
	constructor(e, t) {
		super(e, t), Fn.debug("[SPEAK] Initialized with", e?.length || 0, "actions, isGroup:", t);
	}
	getRandomNumber(e, t) {
		let n = e - t;
		return t + Math.round(Math.random() * n);
	}
	update(e) {
		if (this.actions && this.actions.length !== 0) {
			if (Y.CurPlaying === void 0 && e === J.Responding && !1 === this.isPlaying && (this.stage = Math.ceil(this.getRandomNumber(0, this.actions.length - 1)), Fn.debug("[SPEAK] Starting animation, stage:", this.stage, "of", this.actions.length), this.actions[this.stage].time = 0, this.actions[this.stage].play(), Y.SetWeight(this.actions[this.stage], 1), this.actions[this.stage].loop = 2200, this.actions[this.stage].clampWhenFinished = !0, Y.LastAction !== void 0 && Y.PrepareCrossFade(Y.LastAction, this.actions[this.stage], this.blendingTime), this.isPlaying = !0), Y.CurPlaying === J.Responding && e === J.Responding && !0 === this.isPlaying && this.actions[this.stage].time >= this.actions[this.stage].getClip().duration - this.blendingTime) {
				let e = this.actions[this.stage];
				this.stage = (this.stage + Math.ceil(this.getRandomNumber(1, this.actions.length - 1))) % this.actions.length, Fn.debug("[SPEAK] Cycling to next animation, stage:", this.stage), this.actions[this.stage].time = 0, this.actions[this.stage].play(), Y.SetWeight(this.actions[this.stage], 1), this.actions[this.stage].loop = p, this.actions[this.stage].clampWhenFinished = !0, Y.PrepareCrossFade(e, this.actions[this.stage], this.blendingTime);
			}
			Y.CurPlaying === J.Responding && e !== J.Responding && !0 === this.isPlaying && (this.actions[this.stage].loop = 2200, this.actions[this.stage].clampWhenFinished = !0, this.isPlaying = !1, Y.LastAction = this.actions[this.stage]);
		} else this._warnedNoActions ||= (Fn.warn("[SPEAK] No actions available!"), !0);
	}
}, Y = class e {
	static IsBlending = !1;
	static actions = [];
	static NeedReset = !1;
	static NeedFullReset = !1;
	static LastAction = void 0;
	static CurPlaying = void 0;
	static SetWeight(e, t) {
		e.enabled = !0, e.setEffectiveTimeScale(1), e.setEffectiveWeight(t);
	}
	static PrepareCrossFade(t, n, r) {
		let i = r;
		e.UnPauseAllActions(), e.ExecuteCrossFade(t, n, i), e.IsBlending = !0, setTimeout(() => {
			e.IsBlending = !1;
		}, r + .1);
	}
	static PauseAllActions() {
		e.actions.forEach(function(e) {
			e.paused = !0;
		});
	}
	static UnPauseAllActions() {
		e.actions.forEach(function(e) {
			e.paused = !1;
		});
	}
	static ExecuteCrossFade(t, n, r) {
		e.SetWeight(n, 1), n.time = 0, t.crossFadeTo(n, r, !0);
	}
	constructor(t, n, r) {
		let i = [], a = [], o = [], c = [], l = [];
		if (this.mixer = t, this.singleClipMode = !(!n || n.length !== 1), this.singleClipMode) {
			let r = t.clipAction(n[0]);
			r.loop = s, r.clampWhenFinished = !1, e.SetWeight(r, 1), r.play(), e.actions.push(r), this.hello = new Ln([], !1), this.idle = new Rn([r], !1), this.listen = new zn([], !1), this.think = new Bn([], !1), this.speak = new Vn([], !1);
			return;
		}
		let u = r?.hello?.size || 0, d = (r?.idle?.size || 0) + u, f = (r?.listen?.size || 0) + d, p = (r?.speak?.size || 0) + f, m = (r?.think?.size || 0) + p;
		if (n && n.length > 0) for (let r = 0; r < n.length; r++) {
			let s = n[r], h = t.clipAction(s);
			if (r < u) i.push(h);
			else if (r < d) {
				a.push(h);
				let n = (n) => {
					let r = t.clipAction(s.clone());
					n.push(r), e.actions.push(r), e.SetWeight(r, 0);
				};
				f === d && n(o), p === f && n(c), m === p && n(l);
			} else r < f ? o.push(h) : r < p ? c.push(h) : r < m && l.push(h);
			e.actions.push(h), e.SetWeight(h, 0);
		}
		this.hello = new Ln(i, r?.hello?.isGroup || !1), this.idle = new Rn(a, r?.idle?.isGroup || !1), this.listen = new zn(o, r?.listen?.isGroup || !1), this.think = new Bn(l, r?.think?.isGroup || !1), this.speak = new Vn(c, r?.speak?.isGroup || !1);
	}
	curPlaying() {
		return this.hello.isPlaying || this.idle.isPlaying ? J.Idle : this.listen.isPlaying ? J.Listening : this.think.isPlaying ? J.Thinking : this.speak.isPlaying ? J.Responding : void 0;
	}
	dispose() {
		this.hello.dispose(), this.idle.dispose(), this.listen.dispose(), this.think.dispose(), this.speak.dispose(), e.actions = [];
	}
	resetAllActions(t = !1) {
		switch (this.curPlaying()) {
			case J.Idle:
				e.LastAction = this.hello.actions[this.hello.stage];
				break;
			case J.Listening:
				e.LastAction = this.listen.actions[this.listen.stage];
				break;
			case J.Thinking:
				e.LastAction = this.think.actions[this.think.stage];
				break;
			case J.Responding:
				e.LastAction = this.speak.actions[this.speak.stage];
				break;
			default: e.LastAction = void 0;
		}
		e.LastAction && (e.LastAction.loop = 2200, e.LastAction.clampWhenFinished = !0, e.SetWeight(e.LastAction, 1)), t && (e.PauseAllActions(), e.actions.forEach(function(t) {
			t.time = 0, e.SetWeight(t, 0);
		}), e.LastAction = void 0), this.hello.isPlaying = !1, this.idle.isPlaying = !1, this.listen.isPlaying = !1, this.think.isPlaying = !1, this.speak.isPlaying = !1;
	}
	update(t) {
		if (!this.singleClipMode && !e.IsBlending) {
			if (e.CurPlaying = this.curPlaying(), e.CurPlaying === void 0) switch (t) {
				case J.Idle:
					this.idle.update(t);
					break;
				case J.Listening:
					this.listen.update(t);
					break;
				case J.Thinking:
					this.think.update(t);
					break;
				case J.Responding:
					this.speak.update(t);
					break;
				default: this.idle.update(t);
			}
			else switch (e.CurPlaying) {
				case J.Idle:
					this.idle.update(t);
					break;
				case J.Listening:
					this.listen.update(t);
					break;
				case J.Thinking:
					this.think.update(t);
					break;
				case J.Responding:
					this.speak.update(t);
					break;
				default: this.idle.update(t);
			}
		}
	}
}, Hn = class extends c {
	constructor(e, t = new k(), n = new _(), i = new k(1, 1, 1), a = 1, o = 1, s = !0) {
		super(), this.splatBuffer = e, this.position.copy(t), this.quaternion.copy(n), this.scale.copy(i), this.transform = new r(), this.minimumAlpha = a, this.opacity = o, this.visible = s;
	}
	copyTransformData(e) {
		this.position.copy(e.position), this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.transform.copy(e.transform);
	}
	updateTransform(e) {
		e ? (this.matrixWorldAutoUpdate && this.updateWorldMatrix(!0, !1), this.transform.copy(this.matrixWorld)) : (this.matrixAutoUpdate && this.updateMatrix(), this.transform.copy(this.matrix));
	}
}, Un = class {
	static build(e) {
		let t = new w();
		t.setIndex([
			0,
			1,
			2,
			0,
			2,
			3
		]);
		let n = new ee(/* @__PURE__ */ new Float32Array(12), 3);
		t.setAttribute("position", n), n.setXYZ(0, -1, -1, 0), n.setXYZ(1, -1, 1, 0), n.setXYZ(2, 1, 1, 0), n.setXYZ(3, 1, -1, 0), n.needsUpdate = !0;
		let r = new a().copy(t), i = new Uint32Array(e), s = new o(i, 1, !1);
		return s.setUsage(ne), r.setAttribute("splatIndex", s), r.instanceCount = 0, r;
	}
}, Wn = class e {
	constructor() {
		this.rootNode = null, this.splatMesh = null;
	}
	static convertWorkerSubTree(t, n) {
		let r = new e();
		return r.rootNode = t.rootNode, r.splatMesh = n, r;
	}
}, Gn = class {
	constructor(e, t) {
		this.maxDepth = e, this.maxCentersPerNode = t, this.subTrees = [], this.splatMesh = null;
	}
	dispose() {
		this.diposeSplatTreeWorker(), this.disposed = !0;
	}
	diposeSplatTreeWorker() {
		this.splatTreeWorker && this.splatTreeWorker.terminate(), this.splatTreeWorker = null;
	}
	processSplatMesh = (e, t = () => !0, n, r) => {
		this.splatTreeWorker ||= null, this.splatMesh = e, this.subTrees = [];
		let i = new k(), a = (n, r) => {
			let a = new Float32Array(4 * r), o = 0;
			for (let s = 0; s < r; s++) {
				let r = s + n;
				if (t(r)) {
					e.getSplatCenter(r, i);
					let t = 4 * o;
					a[t] = i.x, a[t + 1] = i.y, a[t + 2] = i.z, a[t + 3] = r, o++;
				}
			}
			return a;
		};
		return new Promise((t) => {
			let i = () => !!this.disposed && (this.diposeSplatTreeWorker(), t(), !0);
			n && n(!1), bt(() => {
				if (i()) return;
				let o = [];
				if (e.dynamicMode) {
					let t = 0;
					for (let n = 0; n < e.scenes.length; n++) {
						let r = e.getScene(n).splatBuffer.getSplatCount(), i = a(t, r);
						o.push(i), t += r;
					}
				} else {
					let t = a(0, e.getSplatCount());
					o.push(t);
				}
				this.splatTreeWorker.onmessage = (n) => {
					i() || n.data.subTrees && (r && r(!1), bt(() => {
						if (!i()) {
							for (let t of n.data.subTrees) {
								let n = Wn.convertWorkerSubTree(t, e);
								this.subTrees.push(n);
							}
							this.diposeSplatTreeWorker(), r && r(!0), bt(() => {
								t();
							});
						}
					}));
				}, bt(() => {
					if (i()) return;
					n && n(!0);
					let e = o.map((e) => e.buffer);
					var t = this.splatTreeWorker, r = o, a = e, s = this.maxDepth, c = this.maxCentersPerNode;
					t && t.postMessage({ process: {
						centers: r,
						maxDepth: s,
						maxCentersPerNode: c
					} }, a);
				});
			});
		});
	};
	countLeaves() {
		let e = 0;
		return this.visitLeaves(() => {
			e++;
		}), e;
	}
	visitLeaves(e) {
		let t = (e, n) => {
			e.children.length === 0 && n(e);
			for (let r of e.children) t(r, n);
		};
		for (let n of this.subTrees) t(n.rootNode, e);
	}
}, Kn = class {
	static buildVertexShaderBase(e = !1, t = !1, n = 0, r = "") {
		let i = "#define USE_SKINNING\n\n        precision highp float;\n        #include <common>\n\n        attribute uint splatIndex;\n        uniform highp usampler2D flameModelTexture;\n        uniform highp usampler2D boneTexture;\n        uniform highp usampler2D boneWeightTexture;\n\n\n        uniform highp usampler2D centersColorsTexture;\n        uniform highp sampler2D sphericalHarmonicsTexture;\n        uniform highp sampler2D sphericalHarmonicsTextureR;\n        uniform highp sampler2D sphericalHarmonicsTextureG;\n        uniform highp sampler2D sphericalHarmonicsTextureB;\n\n        uniform highp usampler2D sceneIndexesTexture;\n        uniform vec2 sceneIndexesTextureSize;\n        uniform int sceneCount;\n        uniform int gaussianSplatCount;\n        uniform int bsCount;\n        uniform float headBoneIndex;\n        uniform float useHeadOnlySkinning;\n        uniform float debugColorByBone;\n        #ifdef USE_SKINNING\n            uniform highp usampler2D skinIndexTexture;\n            uniform highp usampler2D skinWeightTexture;\n            uniform vec2 skinDataTextureSize;\n        #endif\n    ";
		return t && (i += `\n            uniform float sceneOpacity[${K.MaxScenes}];\n            uniform int sceneVisibility[${K.MaxScenes}];\n        `), e && (i += `\n            uniform highp mat4 transforms[${K.MaxScenes}];\n        `), i += `\n        ${r}\n        uniform vec2 focal;\n        uniform float orthoZoom;\n        uniform int orthographicMode;\n        uniform int pointCloudModeEnabled;\n        uniform float inverseFocalAdjustment;\n        uniform vec2 viewport;\n        uniform vec2 basisViewport;\n        uniform vec2 centersColorsTextureSize;\n        uniform vec2 flameModelTextureSize;\n        uniform vec2 boneWeightTextureSize;\n        uniform vec2 boneTextureSize;\n\n        uniform int sphericalHarmonicsDegree;\n        uniform vec2 sphericalHarmonicsTextureSize;\n        uniform int sphericalHarmonics8BitMode;\n        uniform int sphericalHarmonicsMultiTextureMode;\n        uniform float visibleRegionRadius;\n        uniform float visibleRegionFadeStartRadius;\n        uniform float firstRenderTime;\n        uniform float currentTime;\n        uniform int fadeInComplete;\n        uniform vec3 sceneCenter;\n        uniform float splatScale;\n        uniform float sphericalHarmonics8BitCompressionRangeMin[${K.MaxScenes}];\n        uniform float sphericalHarmonics8BitCompressionRangeMax[${K.MaxScenes}];\n\n        varying vec4 vColor;\n        varying vec2 vUv;\n        varying vec2 vPosition;\n        varying vec2 vSplatIndex;\n        #ifdef USE_SKINNING\n            uniform mat4 bindMatrix;\n            uniform mat4 bindMatrixInverse;\n            uniform highp sampler2D boneTexture0;\n            mat4 getBoneMatrix0( const in float i ) {\n                int size = textureSize( boneTexture0, 0 ).x;\n                int j = int( i ) * 4;\n                int x = j % size;\n                int y = j / size;\n                vec4 v1 = texelFetch( boneTexture0, ivec2( x, y ), 0 );\n                vec4 v2 = texelFetch( boneTexture0, ivec2( x + 1, y ), 0 );\n                vec4 v3 = texelFetch( boneTexture0, ivec2( x + 2, y ), 0 );\n                vec4 v4 = texelFetch( boneTexture0, ivec2( x + 3, y ), 0 );\n                return mat4( v1, v2, v3, v4 );\n            }\n        #endif\n\n        mat3 quaternionToRotationMatrix(float x, float y, float z, float w) {\n            float s = 1.0 / sqrt(w * w + x * x + y * y + z * z);\n        \n            return mat3(\n                1. - 2. * (y * y + z * z),\n                2. * (x * y + w * z),\n                2. * (x * z - w * y),\n                2. * (x * y - w * z),\n                1. - 2. * (x * x + z * z),\n                2. * (y * z + w * x),\n                2. * (x * z + w * y),\n                2. * (y * z - w * x),\n                1. - 2. * (x * x + y * y)\n            );\n        }\n\n        const float sqrt8 = sqrt(8.0);\n        const float minAlpha = 1.0 / 255.0;\n\n        const vec4 encodeNorm4 = vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0);\n        const uvec4 mask4 = uvec4(uint(0x000000FF), uint(0x0000FF00), uint(0x00FF0000), uint(0xFF000000));\n        const uvec4 shift4 = uvec4(0, 8, 16, 24);\n        int internal = 1;//show a gaussian splatting point every internal points.\n        vec4 uintToRGBAVec (uint u) {\n           uvec4 urgba = mask4 & u;\n           urgba = urgba >> shift4;\n           vec4 rgba = vec4(urgba) * encodeNorm4;\n           return rgba;\n        }\n        float getRealIndex(int sIndex, int reducedFactor) {\n            int remainder = sIndex % reducedFactor;\n\n            if(remainder == int(0)) {\n                return float(sIndex);\n            }\n            else\n            {\n                return float(sIndex - remainder);\n            }\n        }\n\n        vec2 getDataUV(in int stride, in int offset, in vec2 dimensions) {\n            vec2 samplerUV = vec2(0.0, 0.0);\n            float d = float(uint(getRealIndex(int(splatIndex), internal)) * uint(stride) + uint(offset)) / dimensions.x;\n            samplerUV.y = float(floor(d)) / dimensions.y;\n            samplerUV.x = fract(d);\n            return samplerUV;\n        }\n\n        vec2 getFlameDataUV(in int stride, in int offset, in vec2 dimensions) {\n            vec2 samplerUV = vec2(0.0, 0.0);\n            float d = float(uint(int(splatIndex) / internal) * uint(stride) + uint(offset) + uint(gaussianSplatCount * bsCount)) / dimensions.x;\n            samplerUV.y = float(floor(d)) / dimensions.y;\n            samplerUV.x = fract(d);\n            return samplerUV;\n        }\n\n        vec2 getBoneWeightUV(in int stride, in int offset, in vec2 dimensions) {\n            vec2 samplerUV = vec2(0.0, 0.0);\n            float d = float(uint(int(splatIndex) / internal) * uint(stride) + uint(offset)) / dimensions.x;\n            samplerUV.y = float(floor(d)) / dimensions.y;\n            samplerUV.x = fract(d);\n            return samplerUV;\n        }\n\n        vec2 getBSFlameDataUV(in int bsInedex, in int stride, in int offset, in vec2 dimensions) {\n            vec2 samplerUV = vec2(0.0, 0.0);\n            float d = float(uint(int(splatIndex) / internal) * uint(stride) + uint(offset) + uint(gaussianSplatCount * bsInedex)) / dimensions.x;\n            samplerUV.y = float(floor(d)) / dimensions.y;\n            samplerUV.x = fract(d);\n            return samplerUV;\n        }\n\n        vec2 getDataUVF(in uint sIndex, in float stride, in uint offset, in vec2 dimensions) {\n            vec2 samplerUV = vec2(0.0, 0.0);\n            float d = float(uint(float(getRealIndex(int(sIndex), internal)) * stride) + offset) / dimensions.x;\n            samplerUV.y = float(floor(d)) / dimensions.y;\n            samplerUV.x = fract(d);\n            return samplerUV;\n        }\n\n        const float SH_C1 = 0.4886025119029199f;\n        const float[5] SH_C2 = float[](1.0925484, -1.0925484, 0.3153916, -1.0925484, 0.5462742);\n\n        mat4 getBoneMatrix( float i ) {\n            float y = i;\n            float x = 0.0;\n\n            vec2 samplerUV = vec2(0.0, 0.0);\n            float d = float(i * 4.0) / boneTextureSize.x;//4\n            samplerUV.y = float(floor(d)) / boneTextureSize.y;//5\n            samplerUV.x = fract(d);\n\n            vec4 v1 = uintBitsToFloat(texture( boneTexture, samplerUV ));\n            vec4 v2 = uintBitsToFloat(texture( boneTexture, vec2(samplerUV.x + 1.0 / boneTextureSize.x, samplerUV.y)));\n            vec4 v3 = uintBitsToFloat(texture( boneTexture, vec2(samplerUV.x + 2.0 / boneTextureSize.x, samplerUV.y) ));\n            vec4 v4 = uintBitsToFloat(texture( boneTexture, vec2(samplerUV.x + 3.0 / boneTextureSize.x, samplerUV.y)));\n\n            return mat4( v1, v2, v3, v4 );\n        }\n\n        void main () {\n\n            uint oddOffset = splatIndex & uint(0x00000001);\n            uint doubleOddOffset = oddOffset * uint(2);\n            bool isEven = oddOffset == uint(0);\n            uint nearestEvenIndex = splatIndex - oddOffset;\n            float fOddOffset = float(oddOffset);\n\n            uvec4 sampledCenterColor = texture(centersColorsTexture, getDataUV(1, 0, centersColorsTextureSize));\n            // vec3 splatCenter = uintBitsToFloat(uvec3(sampledCenterColor.gba));\n\n            uvec3 sampledCenter = texture(centersColorsTexture, getDataUV(1, 0, centersColorsTextureSize)).gba;\n            vec3 splatCenter = uintBitsToFloat(uvec3(sampledCenter));\n\n            vec2 flameTextureUV = getBSFlameDataUV(bsCount, 1, 0, flameModelTextureSize);\n            uvec3 sampledflamePos = texture(flameModelTexture, flameTextureUV).rgb;\n            // splatCenter += uintBitsToFloat(uvec3(sampledflamePos.rgb));\n\n            for(int i = 0; i < bsCount; ++i) {\n                vec2 flameBSTextureUV = getBSFlameDataUV(i, 1, 0, flameModelTextureSize);\n                uvec3 sampledBSPos = texture(flameModelTexture, flameBSTextureUV).rgb;\n\n                vec2 samplerUV = vec2(0.0, 0.0);\n                float d = float(i / 4 + 5 * 4) / boneTextureSize.x;//4\n                samplerUV.y = float(floor(d)) / boneTextureSize.y;//32\n                samplerUV.x = fract(d);\n\n                vec4 bsWeight = uintBitsToFloat(texture(boneTexture, samplerUV));\n                float weight = bsWeight.r;\n                if(i % 4 == 1) {\n                    weight = bsWeight.g;\n                }\n                if(i % 4 == 2) {\n                    weight = bsWeight.b;\n                }\n                if(i % 4 == 3) {\n                    weight = bsWeight.a;\n                }\n\n                splatCenter = splatCenter + weight * uintBitsToFloat(sampledBSPos);\n            }\n\n\n            #ifdef USE_SKINNING\n                uint _skinRawIdx = uint(splatIndex);\n                int _skinTexX = int(_skinRawIdx % uint(skinDataTextureSize.x));\n                int _skinTexY = int(_skinRawIdx / uint(skinDataTextureSize.x));\n                uvec4 _skinIdxs = texelFetch(skinIndexTexture, ivec2(_skinTexX, _skinTexY), 0);\n                uvec4 _skinWsRaw = texelFetch(skinWeightTexture, ivec2(_skinTexX, _skinTexY), 0);\n                vec4 _skinWs = vec4(\n                    uintBitsToFloat(_skinWsRaw.x),\n                    uintBitsToFloat(_skinWsRaw.y),\n                    uintBitsToFloat(_skinWsRaw.z),\n                    uintBitsToFloat(_skinWsRaw.w)\n                );\n                mat4 boneMatX = getBoneMatrix0( float(_skinIdxs.x) );\n                mat4 boneMatY = getBoneMatrix0( float(_skinIdxs.y) );\n                mat4 boneMatZ = getBoneMatrix0( float(_skinIdxs.z) );\n                mat4 boneMatW = getBoneMatrix0( float(_skinIdxs.w) );\n            #endif\n            vec3 transformed = vec3(splatCenter.xyz);\n            #ifdef USE_SKINNING\n                // vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n                vec4 skinVertex = vec4( transformed, 1.0 );\n\n                vec4 skinned = vec4( 0.0 );\n                if (useHeadOnlySkinning > 0.5 && headBoneIndex >= 0.0) {\n                    mat4 boneMat = getBoneMatrix0( headBoneIndex );\n                    skinned += boneMat * skinVertex * 1.0;\n                } else {\n                    skinned += boneMatX * skinVertex * _skinWs.x;\n                    skinned += boneMatY * skinVertex * _skinWs.y;\n                    skinned += boneMatZ * skinVertex * _skinWs.z;\n                    skinned += boneMatW * skinVertex * _skinWs.w;\n                }\n\n                // transformed = ( bindMatrixInverse * skinned ).xyz;\n                transformed = skinned.xyz;\n\n            #endif\n            splatCenter = transformed.xyz;\n\n            #ifdef USE_FLAME\n                mat4 boneMatX = getBoneMatrix( 0.0 );\n                mat4 boneMatY = getBoneMatrix( 1.0 );\n                mat4 boneMatZ = getBoneMatrix( 2.0 );\n                mat4 boneMatW = getBoneMatrix( 3.0 );   \n                mat4 boneMat0 = getBoneMatrix( 4.0 );   \n                \n                vec2 boneWeightUV0 = getBoneWeightUV(2, 0, boneWeightTextureSize);\n                vec2 boneWeightUV1 = getBoneWeightUV(2, 1, boneWeightTextureSize);\n\n                uvec4 sampledBoneMatrixValue = texture(boneWeightTexture, boneWeightUV0);\n                uvec4 sampledBoneMatrixValue0 = texture(boneWeightTexture, boneWeightUV1);\n\n                vec4 boneMatrixValue = uintBitsToFloat(sampledBoneMatrixValue);\n                vec4 boneMatrixValue0 = uintBitsToFloat(sampledBoneMatrixValue0);\n\n                vec4 skinVertex = vec4( splatCenter, 1.0 );\n                vec4 skinned = vec4( 0.0 );\n                float minWeight = min(boneMatrixValue.x,min(boneMatrixValue.y, min(boneMatrixValue.z, min(boneMatrixValue.w, boneMatrixValue0.x))));\n                \n                if(boneMatrixValue.x > 0.0 && boneMatrixValue.x > minWeight)\n                    skinned += boneMatX * skinVertex * boneMatrixValue.x;\n                \n                if(boneMatrixValue.y > 0.0 && boneMatrixValue.y > minWeight)\n                    skinned += boneMatY * skinVertex * boneMatrixValue.y;\n                \n                if(boneMatrixValue.z > 0.0 && boneMatrixValue.z > minWeight)\n                    skinned += boneMatZ * skinVertex * boneMatrixValue.z;\n                \n                if(boneMatrixValue.w > 0.0 && boneMatrixValue.w > minWeight)\n                    skinned += boneMatW * skinVertex * boneMatrixValue.w;\n                \n                if(boneMatrixValue0.x > 0.0 && boneMatrixValue0.x > minWeight)\n                    skinned += boneMat0 * skinVertex * boneMatrixValue0.x;\n                \n                splatCenter = skinned.xyz;\n            #endif\n\n            uint sceneIndex = uint(0);\n            if (sceneCount > 1) {\n                sceneIndex = texture(sceneIndexesTexture, getDataUV(1, 0, sceneIndexesTextureSize)).r;\n            }\n            `, t && (i += "\n                float splatOpacityFromScene = sceneOpacity[sceneIndex];\n                int sceneVisible = sceneVisibility[sceneIndex];\n                if (splatOpacityFromScene <= 0.01 || sceneVisible == 0) {\n                    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);\n                    return;\n                }\n            "), i += e ? "\n                mat4 transform = transforms[sceneIndex];\n                mat4 transformModelViewMatrix = viewMatrix * transform;\n                #ifdef USE_SKINNING\n                    transformModelViewMatrix = transformModelViewMatrix * skinMatrix;\n                #endif\n            " : "mat4 transformModelViewMatrix = modelViewMatrix;", i += "\n            float sh8BitCompressionRangeMinForScene = sphericalHarmonics8BitCompressionRangeMin[sceneIndex];\n            float sh8BitCompressionRangeMaxForScene = sphericalHarmonics8BitCompressionRangeMax[sceneIndex];\n            float sh8BitCompressionRangeForScene = sh8BitCompressionRangeMaxForScene - sh8BitCompressionRangeMinForScene;\n            float sh8BitCompressionHalfRangeForScene = sh8BitCompressionRangeForScene / 2.0;\n            vec3 vec8BitSHShift = vec3(sh8BitCompressionRangeMinForScene);\n\n            vec4 viewCenter = transformModelViewMatrix * vec4(splatCenter, 1.0);\n\n            vec4 clipCenter = projectionMatrix * viewCenter;\n\n            float clip = 1.2 * clipCenter.w;\n            if (clipCenter.z < -clip || clipCenter.x < -clip || clipCenter.x > clip || clipCenter.y < -clip || clipCenter.y > clip) {\n                gl_Position = vec4(0.0, 0.0, 2.0, 1.0);\n                return;\n            }\n\n            vec3 ndcCenter = clipCenter.xyz / clipCenter.w;\n\n            vPosition = position.xy;\n            vSplatIndex = vec2(splatIndex, splatIndex);\n\n            vColor = uintToRGBAVec(sampledCenterColor.r);\n\n            #ifdef USE_SKINNING\n            if (debugColorByBone > 0.5) {\n                float maxW = max(max(_skinWs.x, _skinWs.y), max(_skinWs.z, _skinWs.w));\n                float domIdx = -1.0;\n                if (_skinWs.x >= maxW)      domIdx = float(_skinIdxs.x);\n                else if (_skinWs.y >= maxW) domIdx = float(_skinIdxs.y);\n                else if (_skinWs.z >= maxW) domIdx = float(_skinIdxs.z);\n                else if (_skinWs.w >= maxW) domIdx = float(_skinIdxs.w);\n\n                if (domIdx == 110.0)      vColor.rgb = vec3(1.0, 0.0, 0.0); // head -> RED\n                else if (domIdx == 109.0) vColor.rgb = vec3(0.0, 1.0, 0.0); // neckUpper -> GREEN\n                else if (domIdx == 108.0) vColor.rgb = vec3(0.0, 0.4, 1.0); // neckLower -> BLUE\n                else if (domIdx == 47.0)  vColor.rgb = vec3(1.0, 1.0, 0.0); // chestUpper -> YELLOW\n                else if (domIdx == 48.0)  vColor.rgb = vec3(0.0, 1.0, 1.0); // lCollar -> CYAN\n                else if (domIdx == 78.0)  vColor.rgb = vec3(1.0, 0.0, 1.0); // rCollar -> MAGENTA\n                else                       vColor.rgb = vec3(0.5, 0.5, 0.5); // other -> GRAY\n                vColor.a = 1.0;\n            }\n            #endif\n        ", n >= 1 && (i += "   \n            if (sphericalHarmonicsDegree >= 1) {\n            ", i += e ? "\n                    vec3 worldViewDir = normalize(splatCenter - vec3(inverse(transform) * vec4(cameraPosition, 1.0)));\n                " : "\n                    vec3 worldViewDir = normalize(splatCenter - cameraPosition);\n                ", i += "\n                vec3 sh1;\n                vec3 sh2;\n                vec3 sh3;\n            ", n >= 2 && (i += "\n                    vec3 sh4;\n                    vec3 sh5;\n                    vec3 sh6;\n                    vec3 sh7;\n                    vec3 sh8;\n                "), n === 1 ? i += "\n                    if (sphericalHarmonicsMultiTextureMode == 0) {\n                        vec2 shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset, sphericalHarmonicsTextureSize);\n                        vec4 sampledSH0123 = texture(sphericalHarmonicsTexture, shUV);\n                        shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset + uint(1), sphericalHarmonicsTextureSize);\n                        vec4 sampledSH4567 = texture(sphericalHarmonicsTexture, shUV);\n                        shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset + uint(2), sphericalHarmonicsTextureSize);\n                        vec4 sampledSH891011 = texture(sphericalHarmonicsTexture, shUV);\n                        sh1 = vec3(sampledSH0123.rgb) * (1.0 - fOddOffset) + vec3(sampledSH0123.ba, sampledSH4567.r) * fOddOffset;\n                        sh2 = vec3(sampledSH0123.a, sampledSH4567.rg) * (1.0 - fOddOffset) + vec3(sampledSH4567.gba) * fOddOffset;\n                        sh3 = vec3(sampledSH4567.ba, sampledSH891011.r) * (1.0 - fOddOffset) + vec3(sampledSH891011.rgb) * fOddOffset;\n                    } else {\n                        vec2 sampledSH01R = texture(sphericalHarmonicsTextureR, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;\n                        vec2 sampledSH23R = texture(sphericalHarmonicsTextureR, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;\n                        vec2 sampledSH01G = texture(sphericalHarmonicsTextureG, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;\n                        vec2 sampledSH23G = texture(sphericalHarmonicsTextureG, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;\n                        vec2 sampledSH01B = texture(sphericalHarmonicsTextureB, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;\n                        vec2 sampledSH23B = texture(sphericalHarmonicsTextureB, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;\n                        sh1 = vec3(sampledSH01R.rg, sampledSH23R.r);\n                        sh2 = vec3(sampledSH01G.rg, sampledSH23G.r);\n                        sh3 = vec3(sampledSH01B.rg, sampledSH23B.r);\n                    }\n                " : n === 2 && (i += "\n                    vec4 sampledSH0123;\n                    vec4 sampledSH4567;\n                    vec4 sampledSH891011;\n\n                    vec4 sampledSH0123R;\n                    vec4 sampledSH0123G;\n                    vec4 sampledSH0123B;\n\n                    if (sphericalHarmonicsMultiTextureMode == 0) {\n                        sampledSH0123 = texture(sphericalHarmonicsTexture, getDataUV(6, 0, sphericalHarmonicsTextureSize));\n                        sampledSH4567 = texture(sphericalHarmonicsTexture, getDataUV(6, 1, sphericalHarmonicsTextureSize));\n                        sampledSH891011 = texture(sphericalHarmonicsTexture, getDataUV(6, 2, sphericalHarmonicsTextureSize));\n                        sh1 = sampledSH0123.rgb;\n                        sh2 = vec3(sampledSH0123.a, sampledSH4567.rg);\n                        sh3 = vec3(sampledSH4567.ba, sampledSH891011.r);\n                    } else {\n                        sampledSH0123R = texture(sphericalHarmonicsTextureR, getDataUV(2, 0, sphericalHarmonicsTextureSize));\n                        sampledSH0123G = texture(sphericalHarmonicsTextureG, getDataUV(2, 0, sphericalHarmonicsTextureSize));\n                        sampledSH0123B = texture(sphericalHarmonicsTextureB, getDataUV(2, 0, sphericalHarmonicsTextureSize));\n                        sh1 = vec3(sampledSH0123R.rgb);\n                        sh2 = vec3(sampledSH0123G.rgb);\n                        sh3 = vec3(sampledSH0123B.rgb);\n                    }\n                "), i += "\n                    if (sphericalHarmonics8BitMode == 1) {\n                        sh1 = sh1 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                        sh2 = sh2 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                        sh3 = sh3 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                    }\n                    float x = worldViewDir.x;\n                    float y = worldViewDir.y;\n                    float z = worldViewDir.z;\n                    vColor.rgb += SH_C1 * (-sh1 * y + sh2 * z - sh3 * x);\n            ", n >= 2 && (i += "\n                    if (sphericalHarmonicsDegree >= 2) {\n                        float xx = x * x;\n                        float yy = y * y;\n                        float zz = z * z;\n                        float xy = x * y;\n                        float yz = y * z;\n                        float xz = x * z;\n                ", n === 2 && (i += "\n                        if (sphericalHarmonicsMultiTextureMode == 0) {\n                            vec4 sampledSH12131415 = texture(sphericalHarmonicsTexture, getDataUV(6, 3, sphericalHarmonicsTextureSize));\n                            vec4 sampledSH16171819 = texture(sphericalHarmonicsTexture, getDataUV(6, 4, sphericalHarmonicsTextureSize));\n                            vec4 sampledSH20212223 = texture(sphericalHarmonicsTexture, getDataUV(6, 5, sphericalHarmonicsTextureSize));\n                            sh4 = sampledSH891011.gba;\n                            sh5 = sampledSH12131415.rgb;\n                            sh6 = vec3(sampledSH12131415.a, sampledSH16171819.rg);\n                            sh7 = vec3(sampledSH16171819.ba, sampledSH20212223.r);\n                            sh8 = sampledSH20212223.gba;\n                        } else {\n                            vec4 sampledSH4567R = texture(sphericalHarmonicsTextureR, getDataUV(2, 1, sphericalHarmonicsTextureSize));\n                            vec4 sampledSH4567G = texture(sphericalHarmonicsTextureG, getDataUV(2, 1, sphericalHarmonicsTextureSize));\n                            vec4 sampledSH4567B = texture(sphericalHarmonicsTextureB, getDataUV(2, 1, sphericalHarmonicsTextureSize));\n                            sh4 = vec3(sampledSH0123R.a, sampledSH4567R.rg);\n                            sh5 = vec3(sampledSH4567R.ba, sampledSH0123G.a);\n                            sh6 = vec3(sampledSH4567G.rgb);\n                            sh7 = vec3(sampledSH4567G.a, sampledSH0123B.a, sampledSH4567B.r);\n                            sh8 = vec3(sampledSH4567B.gba);\n                        }\n                    "), i += "\n                        if (sphericalHarmonics8BitMode == 1) {\n                            sh4 = sh4 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                            sh5 = sh5 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                            sh6 = sh6 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                            sh7 = sh7 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                            sh8 = sh8 * sh8BitCompressionRangeForScene + vec8BitSHShift;\n                        }\n\n                        vColor.rgb +=\n                            (SH_C2[0] * xy) * sh4 +\n                            (SH_C2[1] * yz) * sh5 +\n                            (SH_C2[2] * (2.0 * zz - xx - yy)) * sh6 +\n                            (SH_C2[3] * xz) * sh7 +\n                            (SH_C2[4] * (xx - yy)) * sh8;\n                    }\n                "), i += "\n\n                vColor.rgb = clamp(vColor.rgb, vec3(0.), vec3(1.));\n\n            }\n\n            "), i;
	}
	static getVertexShaderFadeIn() {
		return "\n            if (fadeInComplete == 0) {\n                float opacityAdjust = 1.0;\n                float centerDist = length(splatCenter - sceneCenter);\n                float renderTime = max(currentTime - firstRenderTime, 0.0);\n\n                float fadeDistance = 0.75;\n                float distanceLoadFadeInFactor = step(visibleRegionFadeStartRadius, centerDist);\n                distanceLoadFadeInFactor = (1.0 - distanceLoadFadeInFactor) +\n                                        (1.0 - clamp((centerDist - visibleRegionFadeStartRadius) / fadeDistance, 0.0, 1.0)) *\n                                        distanceLoadFadeInFactor;\n                opacityAdjust *= distanceLoadFadeInFactor;\n                vColor.a *= opacityAdjust;\n            }\n        ";
	}
	static getUniforms(e = !1, t = !1, n = 0, i = 1, a = !1) {
		let o = {
			sceneCenter: {
				type: "v3",
				value: new k()
			},
			fadeInComplete: {
				type: "i",
				value: 0
			},
			orthographicMode: {
				type: "i",
				value: 0
			},
			visibleRegionFadeStartRadius: {
				type: "f",
				value: 0
			},
			visibleRegionRadius: {
				type: "f",
				value: 0
			},
			bindMatrix: {
				type: "m4",
				value: new r()
			},
			bindMatrixInverse: {
				type: "m4",
				value: new r()
			},
			currentTime: {
				type: "f",
				value: 0
			},
			firstRenderTime: {
				type: "f",
				value: 0
			},
			centersColorsTexture: {
				type: "t",
				value: null
			},
			flameModelTexture: {
				type: "t",
				value: null
			},
			boneTexture: {
				type: "t",
				value: null
			},
			boneTexture0: {
				type: "t",
				value: null
			},
			boneWeightTexture: {
				type: "t",
				value: null
			},
			sphericalHarmonicsTexture: {
				type: "t",
				value: null
			},
			sphericalHarmonicsTextureR: {
				type: "t",
				value: null
			},
			sphericalHarmonicsTextureG: {
				type: "t",
				value: null
			},
			sphericalHarmonicsTextureB: {
				type: "t",
				value: null
			},
			sphericalHarmonics8BitCompressionRangeMin: {
				type: "f",
				value: []
			},
			sphericalHarmonics8BitCompressionRangeMax: {
				type: "f",
				value: []
			},
			focal: {
				type: "v2",
				value: new j()
			},
			orthoZoom: {
				type: "f",
				value: 1
			},
			inverseFocalAdjustment: {
				type: "f",
				value: 1
			},
			viewport: {
				type: "v2",
				value: new j()
			},
			basisViewport: {
				type: "v2",
				value: new j()
			},
			debugColor: {
				type: "v3",
				value: new R()
			},
			centersColorsTextureSize: {
				type: "v2",
				value: new j(1024, 1024)
			},
			flameModelTextureSize: {
				type: "v2",
				value: new j(4096, 2048)
			},
			boneTextureSize: {
				type: "v2",
				value: new j(4, 32)
			},
			boneWeightTextureSize: {
				type: "v2",
				value: new j(512, 512)
			},
			sphericalHarmonicsDegree: {
				type: "i",
				value: n
			},
			sphericalHarmonicsTextureSize: {
				type: "v2",
				value: new j(1024, 1024)
			},
			sphericalHarmonics8BitMode: {
				type: "i",
				value: 0
			},
			sphericalHarmonicsMultiTextureMode: {
				type: "i",
				value: 0
			},
			splatScale: {
				type: "f",
				value: i
			},
			pointCloudModeEnabled: {
				type: "i",
				value: +!!a
			},
			sceneIndexesTexture: {
				type: "t",
				value: null
			},
			sceneIndexesTextureSize: {
				type: "v2",
				value: new j(1024, 1024)
			},
			sceneCount: {
				type: "i",
				value: 1
			},
			gaussianSplatCount: {
				type: "i",
				value: 1
			},
			bsCount: {
				type: "i",
				value: 1
			},
			headBoneIndex: {
				type: "f",
				value: -1
			},
			useHeadOnlySkinning: {
				type: "f",
				value: 0
			},
			debugColorByBone: {
				type: "f",
				value: 0
			},
			skinIndexTexture: {
				type: "t",
				value: null
			},
			skinWeightTexture: {
				type: "t",
				value: null
			},
			skinDataTextureSize: {
				type: "v2",
				value: new j(512, 512)
			},
			eyeBlinkLeft: {
				type: "f",
				value: 0
			},
			eyeBlinkRight: {
				type: "f",
				value: 0
			}
		};
		for (let e = 0; e < K.MaxScenes; e++) o.sphericalHarmonics8BitCompressionRangeMin.value.push(-K.SphericalHarmonics8BitCompressionRange / 2), o.sphericalHarmonics8BitCompressionRangeMax.value.push(K.SphericalHarmonics8BitCompressionRange / 2);
		if (t) {
			let e = [];
			for (let t = 0; t < K.MaxScenes; t++) e.push(1);
			o.sceneOpacity = {
				type: "f",
				value: e
			};
			let t = [];
			for (let e = 0; e < K.MaxScenes; e++) t.push(1);
			o.sceneVisibility = {
				type: "i",
				value: t
			};
		}
		if (e) {
			let e = [];
			for (let t = 0; t < K.MaxScenes; t++) e.push(new r());
			o.transforms = {
				type: "mat4",
				value: e
			};
		}
		return o;
	}
}, qn = class e {
	static build(t = !1, n = !1, r = !1, i = 2048, a = 1, o = !1, s = 0, c = .3, l = null) {
		let u = Kn.buildVertexShaderBase(t, n, s, "\n            uniform vec2 covariancesTextureSize;\n            uniform highp sampler2D covariancesTexture;\n            uniform highp usampler2D covariancesTextureHalfFloat;\n            uniform int covariancesAreHalfFloat;\n\n            void fromCovarianceHalfFloatV4(uvec4 val, out vec4 first, out vec4 second) {\n                vec2 r = unpackHalf2x16(val.r);\n                vec2 g = unpackHalf2x16(val.g);\n                vec2 b = unpackHalf2x16(val.b);\n\n                first = vec4(r.x, r.y, g.x, g.y);\n                second = vec4(b.x, b.y, 0.0, 0.0);\n            }\n        ");
		u += e.buildVertexShaderProjection(r, n, i, c);
		let d = e.buildFragmentShader(l), f = Kn.getUniforms(t, n, s, a, o);
		return f.covariancesTextureSize = {
			type: "v2",
			value: new j(1024, 1024)
		}, f.covariancesTexture = {
			type: "t",
			value: null
		}, f.covariancesTextureHalfFloat = {
			type: "t",
			value: null
		}, f.covariancesAreHalfFloat = {
			type: "i",
			value: 0
		}, new H({
			uniforms: f,
			vertexShader: u,
			fragmentShader: d,
			transparent: !0,
			alphaTest: 1,
			blending: 1,
			depthTest: !0,
			depthWrite: !1,
			side: 2
		});
	}
	static buildVertexShaderProjection(e, t, n, r) {
		let i = "\n\n            vec4 sampledCovarianceA;\n            vec4 sampledCovarianceB;\n            vec3 cov3D_M11_M12_M13;\n            vec3 cov3D_M22_M23_M33;\n            if (covariancesAreHalfFloat == 0) {\n                sampledCovarianceA = texture(covariancesTexture, getDataUVF(nearestEvenIndex, 1.5, oddOffset,\n                                                                            covariancesTextureSize));\n                sampledCovarianceB = texture(covariancesTexture, getDataUVF(nearestEvenIndex, 1.5, oddOffset + uint(1),\n                                                                            covariancesTextureSize));\n\n                cov3D_M11_M12_M13 = vec3(sampledCovarianceA.rgb) * (1.0 - fOddOffset) +\n                                    vec3(sampledCovarianceA.ba, sampledCovarianceB.r) * fOddOffset;\n                cov3D_M22_M23_M33 = vec3(sampledCovarianceA.a, sampledCovarianceB.rg) * (1.0 - fOddOffset) +\n                                    vec3(sampledCovarianceB.gba) * fOddOffset;\n            } else {\n                uvec4 sampledCovarianceU = texture(covariancesTextureHalfFloat, getDataUV(1, 0, covariancesTextureSize));\n                fromCovarianceHalfFloatV4(sampledCovarianceU, sampledCovarianceA, sampledCovarianceB);\n                cov3D_M11_M12_M13 = sampledCovarianceA.rgb;\n                cov3D_M22_M23_M33 = vec3(sampledCovarianceA.a, sampledCovarianceB.rg);\n            }\n        \n            // Construct the 3D covariance matrix\n            mat3 Vrk = mat3(\n                cov3D_M11_M12_M13.x, cov3D_M11_M12_M13.y, cov3D_M11_M12_M13.z,\n                cov3D_M11_M12_M13.y, cov3D_M22_M23_M33.x, cov3D_M22_M23_M33.y,\n                cov3D_M11_M12_M13.z, cov3D_M22_M23_M33.y, cov3D_M22_M23_M33.z\n            );\n\n            mat3 J;\n            if (orthographicMode == 1) {\n                // Since the projection is linear, we don't need an approximation\n                J = transpose(mat3(orthoZoom, 0.0, 0.0,\n                                0.0, orthoZoom, 0.0,\n                                0.0, 0.0, 0.0));\n            } else {\n                // Construct the Jacobian of the affine approximation of the projection matrix. It will be used to transform the\n                // 3D covariance matrix instead of using the actual projection matrix because that transformation would\n                // require a non-linear component (perspective division) which would yield a non-gaussian result.\n                float s = 1.0 / (viewCenter.z * viewCenter.z);\n                J = mat3(\n                    focal.x / viewCenter.z, 0., -(focal.x * viewCenter.x) * s,\n                    0., focal.y / viewCenter.z, -(focal.y * viewCenter.y) * s,\n                    0., 0., 0.\n                );\n            }\n\n            // Concatenate the projection approximation with the model-view transformation\n            mat3 W = transpose(mat3(transformModelViewMatrix));\n            mat3 T = W * J;\n\n            // Transform the 3D covariance matrix (Vrk) to compute the 2D covariance matrix\n            mat3 cov2Dm = transpose(T) * Vrk * T;\n            ";
		return i += e ? `\n                float detOrig = cov2Dm[0][0] * cov2Dm[1][1] - cov2Dm[0][1] * cov2Dm[0][1];\n                cov2Dm[0][0] += ${r};\n                cov2Dm[1][1] += ${r};\n                float detBlur = cov2Dm[0][0] * cov2Dm[1][1] - cov2Dm[0][1] * cov2Dm[0][1];\n                vColor.a *= sqrt(max(detOrig / detBlur, 0.0));\n                if (vColor.a < minAlpha) return;\n            ` : `\n                cov2Dm[0][0] += ${r};\n                cov2Dm[1][1] += ${r};\n            `, i += `\n\n            // We are interested in the upper-left 2x2 portion of the projected 3D covariance matrix because\n            // we only care about the X and Y values. We want the X-diagonal, cov2Dm[0][0],\n            // the Y-diagonal, cov2Dm[1][1], and the correlation between the two cov2Dm[0][1]. We don't\n            // need cov2Dm[1][0] because it is a symetric matrix.\n            vec3 cov2Dv = vec3(cov2Dm[0][0], cov2Dm[0][1], cov2Dm[1][1]);\n\n            // We now need to solve for the eigen-values and eigen vectors of the 2D covariance matrix\n            // so that we can determine the 2D basis for the splat. This is done using the method described\n            // here: https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html\n            // After calculating the eigen-values and eigen-vectors, we calculate the basis for rendering the splat\n            // by normalizing the eigen-vectors and then multiplying them by (sqrt(8) * sqrt(eigen-value)), which is\n            // equal to scaling them by sqrt(8) standard deviations.\n            //\n            // This is a different approach than in the original work at INRIA. In that work they compute the\n            // max extents of the projected splat in screen space to form a screen-space aligned bounding rectangle\n            // which forms the geometry that is actually rasterized. The dimensions of that bounding box are 3.0\n            // times the square root of the maximum eigen-value, or 3 standard deviations. They then use the inverse\n            // 2D covariance matrix (called 'conic') in the CUDA rendering thread to determine fragment opacity by\n            // calculating the full gaussian: exp(-0.5 * (X - mean) * conic * (X - mean)) * splat opacity\n            float a = cov2Dv.x;\n            float d = cov2Dv.z;\n            float b = cov2Dv.y;\n            float D = a * d - b * b;\n            float trace = a + d;\n            float traceOver2 = 0.5 * trace;\n            float term2 = sqrt(max(0.1f, traceOver2 * traceOver2 - D));\n            float eigenValue1 = traceOver2 + term2;\n            float eigenValue2 = traceOver2 - term2;\n\n            if (pointCloudModeEnabled == 1) {\n                eigenValue1 = eigenValue2 = 0.2;\n            }\n\n            if (eigenValue2 <= 0.0) return;\n\n            vec2 eigenVector1 = normalize(vec2(b, eigenValue1 - a));\n            // since the eigen vectors are orthogonal, we derive the second one from the first\n            vec2 eigenVector2 = vec2(eigenVector1.y, -eigenVector1.x);\n\n            // We use sqrt(8) standard deviations instead of 3 to eliminate more of the splat with a very low opacity.\n            vec2 basisVector1 = eigenVector1 * splatScale * min(sqrt8 * sqrt(eigenValue1), ${parseInt(n)}.0);\n            vec2 basisVector2 = eigenVector2 * splatScale * min(sqrt8 * sqrt(eigenValue2), ${parseInt(n)}.0);\n            `, t && (i += "\n                vColor.a *= splatOpacityFromScene;\n            "), i += "\n            vec2 ndcOffset = vec2(vPosition.x * basisVector1 + vPosition.y * basisVector2) *\n                             basisViewport * 2.0 * inverseFocalAdjustment;\n\n            vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);\n            gl_Position = quadPos;\n\n            // Scale the position data we send to the fragment shader\n            vPosition *= sqrt8;\n        ", i += Kn.getVertexShaderFadeIn(), i += "}", i;
	}
	static buildFragmentShader(e = null) {
		let t = "\n            precision highp float;\n            #include <common>\n\n            uniform float eyeBlinkLeft;\n            uniform float eyeBlinkRight;\n\n            varying vec4 vColor;\n            varying vec2 vUv;\n            varying vec2 vPosition;\n            varying vec2 vSplatIndex;\n        ";
		t += "\n            void main () {\n                float A = dot(vPosition, vPosition);\n                float opacity = exp(-0.5 * A) * vColor.a;\n                if (opacity < 1.0 / 255.0)\n                    discard;\n                ";
		let n = (e, t) => e && e[t] && e[t].length > 0, r = n(e, "right_iris"), i = n(e, "right_iris_north"), a = n(e, "right_iris_south"), o = n(e, "left_iris"), s = n(e, "left_iris_north"), c = n(e, "left_iris_south");
		return r || i || a || o || s || c ? (t += "\n                float idx = vSplatIndex.x;\n                ", i || a ? (t += i ? `\n                bool isRightIrisNorth = ${e.right_iris_north.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                   ")};\n                ` : "bool isRightIrisNorth = false;", t += a ? `\n                bool isRightIrisSouth = ${e.right_iris_south.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                   ")};\n                ` : "bool isRightIrisSouth = false;", t += r ? `\n                bool isRightIris = ${e.right_iris.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                   ")} && !isRightIrisNorth && !isRightIrisSouth;\n                ` : "bool isRightIris = false;") : t += r ? `\n                bool isRightIris = ${e.right_iris.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                   ")};\n                bool isRightIrisNorth = false;\n                bool isRightIrisSouth = false;\n                ` : "\n                bool isRightIris = false;\n                bool isRightIrisNorth = false;\n                bool isRightIrisSouth = false;\n                ", s || c ? (t += s ? `\n                bool isLeftIrisNorth = ${e.left_iris_north.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                   ")};\n                ` : "bool isLeftIrisNorth = false;", t += c ? `\n                bool isLeftIrisSouth = ${e.left_iris_south.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                   ")};\n                ` : "bool isLeftIrisSouth = false;", t += o ? `\n                bool isLeftIris = ${e.left_iris.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                   ")} && !isLeftIrisNorth && !isLeftIrisSouth;\n                ` : "bool isLeftIris = false;") : t += o ? `\n                bool isLeftIris = ${e.left_iris.map(([e, t]) => `(idx >= ${e}.0 && idx <= ${t}.0)`).join(" ||\n                                  ")};\n                bool isLeftIrisNorth = false;\n                bool isLeftIrisSouth = false;\n                ` : "\n                bool isLeftIris = false;\n                bool isLeftIrisNorth = false;\n                bool isLeftIrisSouth = false;\n                ", t += "\n                float finalOpacity = opacity;\n\n                if (isRightIris) {\n                    float fadeFactor = 1.0 - smoothstep(0.45, 0.65, eyeBlinkRight);\n                    finalOpacity = opacity * fadeFactor;\n                } else if (isRightIrisNorth) {\n                    // North part gets covered very early by upper eyelid\n                    float fadeFactor = 1.0 - smoothstep(0.0, 0.25, eyeBlinkRight);\n                    finalOpacity = opacity * fadeFactor;\n                } else if (isRightIrisSouth) {\n                    // South part gets covered much later\n                    float fadeFactor = 1.0 - smoothstep(0.65, 0.9, eyeBlinkRight);\n                    finalOpacity = opacity * fadeFactor;\n                } else if (isLeftIris) {\n                    float fadeFactor = 1.0 - smoothstep(0.45, 0.65, eyeBlinkLeft);\n                    finalOpacity = opacity * fadeFactor;\n                } else if (isLeftIrisNorth) {\n                    float fadeFactor = 1.0 - smoothstep(0.0, 0.25, eyeBlinkLeft);\n                    finalOpacity = opacity * fadeFactor;\n                } else if (isLeftIrisSouth) {\n                     float fadeFactor = 1.0 - smoothstep(0.65, 0.9, eyeBlinkLeft);\n                    finalOpacity = opacity * fadeFactor;\n                }\n\n                if (finalOpacity < 1.0 / 255.0)\n                    discard;\n\n                gl_FragColor = vec4(vColor.rgb, finalOpacity);\n            }\n        ") : t += "\n                gl_FragColor = vec4(vColor.rgb, opacity);\n            }\n        ", t;
	}
}, Jn = class e {
	static build(t = !1, n = !1, r = 1, i = !1, a = 0) {
		let o = Kn.buildVertexShaderBase(t, n, a, "\n            uniform vec2 scaleRotationsTextureSize;\n            uniform highp sampler2D scaleRotationsTexture;\n            varying mat3 vT;\n            varying vec2 vQuadCenter;\n            varying vec2 vFragCoord;\n        ");
		o += e.buildVertexShaderProjection();
		let s = e.buildFragmentShader(), c = Kn.getUniforms(t, n, a, r, i);
		return c.scaleRotationsTexture = {
			type: "t",
			value: null
		}, c.scaleRotationsTextureSize = {
			type: "v2",
			value: new j(1024, 1024)
		}, new H({
			uniforms: c,
			vertexShader: o,
			fragmentShader: s,
			transparent: !0,
			alphaTest: 1,
			blending: 1,
			depthTest: !0,
			depthWrite: !1,
			side: 2
		});
	}
	static buildVertexShaderProjection() {
		let e = "\n\n            vec4 scaleRotationA = texture(scaleRotationsTexture, getDataUVF(nearestEvenIndex, 1.5,\n                                                                            oddOffset, scaleRotationsTextureSize));\n            vec4 scaleRotationB = texture(scaleRotationsTexture, getDataUVF(nearestEvenIndex, 1.5,\n                                                                            oddOffset + uint(1), scaleRotationsTextureSize));\n\n            vec3 scaleRotation123 = vec3(scaleRotationA.rgb) * (1.0 - fOddOffset) +\n                                    vec3(scaleRotationA.ba, scaleRotationB.r) * fOddOffset;\n            vec3 scaleRotation456 = vec3(scaleRotationA.a, scaleRotationB.rg) * (1.0 - fOddOffset) +\n                                    vec3(scaleRotationB.gba) * fOddOffset;\n\n            float missingW = sqrt(1.0 - scaleRotation456.x * scaleRotation456.x - scaleRotation456.y *\n                                    scaleRotation456.y - scaleRotation456.z * scaleRotation456.z);\n            mat3 R = quaternionToRotationMatrix(scaleRotation456.r, scaleRotation456.g, scaleRotation456.b, missingW);\n            mat3 S = mat3(scaleRotation123.r, 0.0, 0.0,\n                            0.0, scaleRotation123.g, 0.0,\n                            0.0, 0.0, scaleRotation123.b);\n            \n            mat3 L = R * S;\n\n            mat3x4 splat2World = mat3x4(vec4(L[0], 0.0),\n                                        vec4(L[1], 0.0),\n                                        vec4(splatCenter.x, splatCenter.y, splatCenter.z, 1.0));\n\n            mat4 world2ndc = transpose(projectionMatrix * transformModelViewMatrix);\n\n            mat3x4 ndc2pix = mat3x4(vec4(viewport.x / 2.0, 0.0, 0.0, (viewport.x - 1.0) / 2.0),\n                                    vec4(0.0, viewport.y / 2.0, 0.0, (viewport.y - 1.0) / 2.0),\n                                    vec4(0.0, 0.0, 0.0, 1.0));\n\n            mat3 T = transpose(splat2World) * world2ndc * ndc2pix;\n            vec3 normal = vec3(viewMatrix * vec4(L[0][2], L[1][2], L[2][2], 0.0));\n        ";
		return e += "\n\n                mat4 splat2World4 = mat4(vec4(L[0], 0.0),\n                                        vec4(L[1], 0.0),\n                                        vec4(L[2], 0.0),\n                                        vec4(splatCenter.x, splatCenter.y, splatCenter.z, 1.0));\n\n                mat4 Tt = transpose(transpose(splat2World4) * world2ndc);\n\n                vec4 tempPoint1 = Tt * vec4(1.0, 0.0, 0.0, 1.0);\n                tempPoint1 /= tempPoint1.w;\n\n                vec4 tempPoint2 = Tt * vec4(0.0, 1.0, 0.0, 1.0);\n                tempPoint2 /= tempPoint2.w;\n\n                vec4 center = Tt * vec4(0.0, 0.0, 0.0, 1.0);\n                center /= center.w;\n\n                vec2 basisVector1 = tempPoint1.xy - center.xy;\n                vec2 basisVector2 = tempPoint2.xy - center.xy;\n\n                vec2 basisVector1Screen = basisVector1 * 0.5 * viewport;\n                vec2 basisVector2Screen = basisVector2 * 0.5 * viewport;\n\n                const float minPix = 1.;\n                if (length(basisVector1Screen) < minPix || length(basisVector2Screen) < minPix) {\n                    \n            vec3 T0 = vec3(T[0][0], T[0][1], T[0][2]);\n            vec3 T1 = vec3(T[1][0], T[1][1], T[1][2]);\n            vec3 T3 = vec3(T[2][0], T[2][1], T[2][2]);\n\n            vec3 tempPoint = vec3(1.0, 1.0, -1.0);\n            float distance = (T3.x * T3.x * tempPoint.x) + (T3.y * T3.y * tempPoint.y) + (T3.z * T3.z * tempPoint.z);\n            vec3 f = (1.0 / distance) * tempPoint;\n            if (abs(distance) < 0.00001) return;\n\n            float pointImageX = (T0.x * T3.x * f.x) + (T0.y * T3.y * f.y) + (T0.z * T3.z * f.z);\n            float pointImageY = (T1.x * T3.x * f.x) + (T1.y * T3.y * f.y) + (T1.z * T3.z * f.z);\n            vec2 pointImage = vec2(pointImageX, pointImageY);\n\n            float tempX = (T0.x * T0.x * f.x) + (T0.y * T0.y * f.y) + (T0.z * T0.z * f.z);\n            float tempY = (T1.x * T1.x * f.x) + (T1.y * T1.y * f.y) + (T1.z * T1.z * f.z);\n            vec2 temp = vec2(tempX, tempY);\n\n            vec2 halfExtend = pointImage * pointImage - temp;\n            vec2 extent = sqrt(max(vec2(0.0001), halfExtend));\n            float radius = max(extent.x, extent.y);\n\n            vec2 ndcOffset = ((position.xy * radius * 3.0) * basisViewport * 2.0);\n\n            vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);\n            gl_Position = quadPos;\n\n            vT = T;\n            vQuadCenter = pointImage;\n            vFragCoord = (quadPos.xy * 0.5 + 0.5) * viewport;\n        \n                } else {\n                    vec2 ndcOffset = vec2(position.x * basisVector1 + position.y * basisVector2) * 3.0 * inverseFocalAdjustment;\n                    vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);\n                    gl_Position = quadPos;\n\n                    vT = T;\n                    vQuadCenter = center.xy;\n                    vFragCoord = (quadPos.xy * 0.5 + 0.5) * viewport;\n                }\n            ", e += Kn.getVertexShaderFadeIn(), e += "}", e;
	}
	static buildFragmentShader() {
		return "\n            precision highp float;\n            #include <common>\n\n            uniform vec3 debugColor;\n\n            varying vec4 vColor;\n            varying vec2 vUv;\n            varying vec2 vPosition;\n            varying mat3 vT;\n            varying vec2 vQuadCenter;\n            varying vec2 vFragCoord;\n\n            void main () {\n\n                const float FilterInvSquare = 2.0;\n                const float near_n = 0.2;\n                const float T = 1.0;\n\n                vec2 xy = vQuadCenter;\n                vec3 Tu = vT[0];\n                vec3 Tv = vT[1];\n                vec3 Tw = vT[2];\n                vec3 k = vFragCoord.x * Tw - Tu;\n                vec3 l = vFragCoord.y * Tw - Tv;\n                vec3 p = cross(k, l);\n                if (p.z == 0.0) discard;\n                vec2 s = vec2(p.x / p.z, p.y / p.z);\n                float rho3d = (s.x * s.x + s.y * s.y); \n                vec2 d = vec2(xy.x - vFragCoord.x, xy.y - vFragCoord.y);\n                float rho2d = FilterInvSquare * (d.x * d.x + d.y * d.y); \n\n                // compute intersection and depth\n                float rho = min(rho3d, rho2d);\n                float depth = (rho3d <= rho2d) ? (s.x * Tw.x + s.y * Tw.y) + Tw.z : Tw.z; \n                if (depth < near_n) discard;\n                //  vec4 nor_o = collected_normal_opacity[j];\n                //  float normal[3] = {nor_o.x, nor_o.y, nor_o.z};\n                float opa = vColor.a;\n\n                float power = -0.5f * rho;\n                if (power > 0.0f) discard;\n\n                // Eq. (2) from 3D Gaussian splatting paper.\n                // Obtain alpha by multiplying with Gaussian opacity\n                // and its exponential falloff from mean.\n                // Avoid numerical instabilities (see paper appendix). \n                float alpha = min(0.99f, opa * exp(power));\n                if (alpha < 1.0f / 255.0f) discard;\n                float test_T = T * (1.0 - alpha);\n                if (test_T < 0.0001)discard;\n\n                float w = alpha * T;\n                gl_FragColor = vec4(vColor.rgb, w);\n            }\n        ";
	}
}, Yn = dt("SplatMesh"), Xn = new w(), Zn = new l();
function Qn(e) {
	let t = {};
	function n(n) {
		if (t[n] !== void 0) return t[n];
		let r;
		switch (n) {
			case "WEBGL_depth_texture":
				r = e.getExtension("WEBGL_depth_texture") || e.getExtension("MOZ_WEBGL_depth_texture") || e.getExtension("WEBKIT_WEBGL_depth_texture");
				break;
			case "EXT_texture_filter_anisotropic":
				r = e.getExtension("EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic") || e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
				break;
			case "WEBGL_compressed_texture_s3tc":
				r = e.getExtension("WEBGL_compressed_texture_s3tc") || e.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
				break;
			case "WEBGL_compressed_texture_pvrtc":
				r = e.getExtension("WEBGL_compressed_texture_pvrtc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
				break;
			default: r = e.getExtension(n);
		}
		return t[n] = r, r;
	}
	return {
		has: function(e) {
			return n(e) !== null;
		},
		init: function(e) {
			e.isWebGL2 ? (n("EXT_color_buffer_float"), n("WEBGL_clip_cull_distance")) : (n("WEBGL_depth_texture"), n("OES_texture_float"), n("OES_texture_half_float"), n("OES_texture_half_float_linear"), n("OES_standard_derivatives"), n("OES_element_index_uint"), n("OES_vertex_array_object"), n("ANGLE_instanced_arrays")), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture");
		},
		get: function(e) {
			let t = n(e);
			return t === null && Yn.warn("THREE.WebGLRenderer: " + e + " extension not supported."), t;
		}
	};
}
function $n(e, t, n) {
	let r;
	function i(t) {
		if (t === "highp") {
			if (e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision > 0) return "highp";
			t = "mediump";
		}
		return t === "mediump" && e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
	}
	let a = typeof WebGL2RenderingContext < "u" && e.constructor.name === "WebGL2RenderingContext", o = n.precision === void 0 ? "highp" : n.precision, s = i(o);
	s !== o && (Yn.warn("THREE.WebGLRenderer:", o, "not supported, using", s, "instead."), o = s);
	let c = a || t.has("WEBGL_draw_buffers"), l = !0 === n.logarithmicDepthBuffer, u = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), d = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS), f = e.getParameter(e.MAX_TEXTURE_SIZE), p = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE), m = e.getParameter(e.MAX_VERTEX_ATTRIBS), h = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS), g = e.getParameter(e.MAX_VARYING_VECTORS), _ = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS), v = d > 0, y = a || t.has("OES_texture_float");
	return {
		isWebGL2: a,
		drawBuffers: c,
		getMaxAnisotropy: function() {
			if (r !== void 0) return r;
			if (!0 === t.has("EXT_texture_filter_anisotropic")) {
				let n = t.get("EXT_texture_filter_anisotropic");
				r = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
			} else r = 0;
			return r;
		},
		getMaxPrecision: i,
		precision: o,
		logarithmicDepthBuffer: l,
		maxTextures: u,
		maxVertexTextures: d,
		maxTextureSize: f,
		maxCubemapSize: p,
		maxAttributes: m,
		maxVertexUniforms: h,
		maxVaryings: g,
		maxFragmentUniforms: _,
		vertexTextures: v,
		floatFragmentTextures: y,
		floatVertexTextures: v && y,
		maxSamples: a ? e.getParameter(e.MAX_SAMPLES) : 0
	};
}
function er(e, t, n) {
	let r = n.isWebGL2;
	return { convert: function(n, i) {
		let a;
		if (n === 1009) return e.UNSIGNED_BYTE;
		if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
		if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
		if (n === 1010) return e.BYTE;
		if (n === 1011) return e.SHORT;
		if (n === 1012) return e.UNSIGNED_SHORT;
		if (n === 1013) return e.INT;
		if (n === 1014) return e.UNSIGNED_INT;
		if (n === 1015) return e.FLOAT;
		if (n === 1016) return r ? e.HALF_FLOAT : (a = t.get("OES_texture_half_float"), a === null ? null : a.HALF_FLOAT_OES);
		if (n === 1021) return e.ALPHA;
		if (n === 1022) return e.RGB;
		if (n === 1023) return e.RGBA;
		if (n === 1024) return e.LUMINANCE;
		if (n === 1025) return e.LUMINANCE_ALPHA;
		if (n === 1026) return e.DEPTH_COMPONENT;
		if (n === 1027) return e.DEPTH_STENCIL;
		if (n === 1028) return e.RED;
		if (n === 1029) return e.RED_INTEGER;
		if (n === 1030) return e.RG;
		if (n === 1031) return e.RG_INTEGER;
		if (n === 1032) return e.RGB_INTEGER;
		if (n === 1033) return e.RGBA_INTEGER;
		if (n === 33776 || n === 33777 || n === 33778 || n === 33779) {
			if (a = t.get("WEBGL_compressed_texture_s3tc"), a === null) return null;
			if (n === 33776) return a.COMPRESSED_RGB_S3TC_DXT1_EXT;
			if (n === 33777) return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;
			if (n === 33778) return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;
			if (n === 33779) return a.COMPRESSED_RGBA_S3TC_DXT5_EXT;
		}
		if (n === 35840 || n === 35841 || n === 35842 || n === 35843) {
			if (a = t.get("WEBGL_compressed_texture_pvrtc"), a === null) return null;
			if (n === 35840) return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
			if (n === 35841) return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
			if (n === 35842) return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
			if (n === 35843) return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
		}
		if (n === 36196) return a = t.get("WEBGL_compressed_texture_etc1"), a === null ? null : a.COMPRESSED_RGB_ETC1_WEBGL;
		if (n >= 37808 && n <= 37814 || n >= 37840 && n <= 37846) return a = t.get("WEBGL_compressed_texture_astc"), a === null ? null : n;
		if (n === 36492 || n === 36494 || n === 36495) return a = t.get("EXT_texture_compression_bptc"), a === null ? null : n;
		if (n === 34042) return e.UNSIGNED_INT_24_8;
		if (r) {
			if (n === 6407) return e.RGB;
			if (n === 6408) return e.RGBA;
		}
		return e[n] === void 0 ? null : e[n];
	} };
}
var tr = 16777216, nr = class e extends g {
	constructor(e = Me.ThreeD, t = !1, n = !1, r = !1, i = 1, a = !0, o = !1, s = !1, c = 1024, l = De.None, u = 0, d = 1, f = .3, p = null) {
		super(Xn, Zn), this.renderer = void 0, this.splatRenderMode = e, this.dynamicMode = t, this.enableOptionalEffects = n, this.halfPrecisionCovariancesOnGPU = r, this.devicePixelRatio = i, this.enableDistancesComputationOnGPU = a, this.integerBasedDistancesComputation = o, this.antialiased = s, this.kernel2DSize = f, this.maxScreenSpaceSplatSize = c, this.logLevel = l, this.sphericalHarmonicsDegree = u, this.minSphericalHarmonicsDegree = 0, this.sceneFadeInRateMultiplier = d, this.scenes = [], this.splatTree = null, this.baseSplatTree = null, this.splatDataTextures = {}, this.flameModel = null, this.expressionBSNum = 0, this.bsWeight = [], this.bonesMatrix = null, this.bonesNum = null, this.bonesWeight = null, this.gaussianSplatCount = null, this.morphTargetDictionary = null, this.distancesTransformFeedback = {
			id: null,
			vertexShader: null,
			fragmentShader: null,
			program: null,
			centersBuffer: null,
			sceneIndexesBuffer: null,
			outDistancesBuffer: null,
			centersLoc: -1,
			modelViewProjLoc: -1,
			sceneIndexesLoc: -1,
			transformsLocs: []
		}, this.globalSplatIndexToLocalSplatIndexMap = [], this.globalSplatIndexToSceneIndexMap = [], this.irisOcclusionConfig = p, this.lastBuildSplatCount = 0, this.lastBuildScenes = [], this.lastBuildMaxSplatCount = 0, this.lastBuildSceneCount = 0, this.firstRenderTime = -1, this.finalBuild = !1, this.webGLUtils = null, this.boundingBox = new S(), this.calculatedSceneCenter = new k(), this.maxSplatDistanceFromSceneCenter = 0, this.visibleRegionBufferRadius = 0, this.visibleRegionRadius = 0, this.visibleRegionFadeStartRadius = 0, this.visibleRegionChanging = !1, this.splatScale = 1, this.pointCloudModeEnabled = !1, this.disposed = !1, this.lastRenderer = null, this.visible = !1;
	}
	static buildScenes(t, n, r) {
		let i = [];
		i.length = n.length;
		for (let a = 0; a < n.length; a++) {
			let o = n[a], s = r[a] || {}, c = s.position || [
				0,
				0,
				0
			], l = s.rotation || [
				0,
				0,
				0,
				1
			], u = s.scale || [
				1,
				1,
				1
			], d = new k().fromArray(c), f = new _().fromArray(l), p = new k().fromArray(u), m = e.createScene(o, d, f, p, s.splatAlphaRemovalThreshold || 1, s.opacity, s.visible);
			t.add(m), i[a] = m;
		}
		return i;
	}
	static createScene(e, t, n, r, i, a = 1, o = !0) {
		return new Hn(e, t, n, r, i, a, o);
	}
	static buildSplatIndexMaps(e) {
		let t = [], n = [], r = 0;
		for (let i = 0; i < e.length; i++) {
			let a = e[i].getMaxSplatCount();
			for (let e = 0; e < a; e++) t[r] = e, n[r] = i, r++;
		}
		return {
			localSplatIndexMap: t,
			sceneIndexMap: n
		};
	}
	buildSplatTree = (e = [], t, n) => new Promise((r) => {
		this.disposeSplatTree(), this.baseSplatTree = new Gn(8, 1e3);
		let i = performance.now(), a = new y();
		this.baseSplatTree.processSplatMesh(this, (t) => {
			this.getSplatColor(t, a);
			let n = e[this.getSceneIndexForSplat(t)] || 1;
			return a.w >= n;
		}, t, n).then(() => {
			let e = performance.now() - i;
			if (this.logLevel >= De.Info && Yn.info("SplatTree build: " + e + " ms"), this.disposed) r();
			else {
				this.splatTree = this.baseSplatTree, this.baseSplatTree = null;
				let e = 0, t = 0, n = 0;
				this.splatTree.visitLeaves((r) => {
					let i = r.data.indexes.length;
					i > 0 && (t += i, n++, e++);
				}), this.logLevel >= De.Info && (Yn.info(`SplatTree leaves: ${this.splatTree.countLeaves()}`), Yn.info(`SplatTree leaves with splats:${e}`), t /= n, Yn.info(`Avg splat count per node: ${t}`), Yn.info(`Total splat count: ${this.getSplatCount()}`)), r();
			}
		});
	});
	build(t, n, r = !0, i = !1, a, o, s = !0) {
		this.sceneOptions = n, this.finalBuild = i;
		let c = e.getTotalMaxSplatCountForSplatBuffers(t), l = e.buildScenes(this, t, n);
		if (r) for (let e = 0; e < this.scenes.length && e < l.length; e++) {
			let t = l[e], n = this.getScene(e);
			t.copyTransformData(n);
		}
		this.scenes = l;
		let u = 3;
		for (let e of t) {
			let t = e.getMinSphericalHarmonicsDegree();
			t < u && (u = t);
		}
		this.minSphericalHarmonicsDegree = Math.min(u, this.sphericalHarmonicsDegree);
		let d = !1;
		if (t.length !== this.lastBuildScenes.length) d = !0;
		else for (let e = 0; e < t.length; e++) if (t[e] !== this.lastBuildScenes[e].splatBuffer) {
			d = !0;
			break;
		}
		let f = !0;
		if ((this.scenes.length !== 1 || this.lastBuildSceneCount !== this.scenes.length || this.lastBuildMaxSplatCount !== c || d) && (f = !1), !f) {
			this.boundingBox = new S(), s || (this.maxSplatDistanceFromSceneCenter = 0, this.visibleRegionBufferRadius = 0, this.visibleRegionRadius = 0, this.visibleRegionFadeStartRadius = 0, this.firstRenderTime = -1), this.lastBuildScenes = [], this.lastBuildSplatCount = 0, this.lastBuildMaxSplatCount = 0, this.disposeMeshData(), this.geometry = Un.build(c), this.material = this.splatRenderMode === Me.ThreeD ? qn.build(this.dynamicMode, this.enableOptionalEffects, this.antialiased, this.maxScreenSpaceSplatSize, this.splatScale, this.pointCloudModeEnabled, this.minSphericalHarmonicsDegree, this.kernel2DSize, this.irisOcclusionConfig) : Jn.build(this.dynamicMode, this.enableOptionalEffects, this.splatScale, this.pointCloudModeEnabled, this.minSphericalHarmonicsDegree);
			let n = e.buildSplatIndexMaps(t);
			this.globalSplatIndexToLocalSplatIndexMap = n.localSplatIndexMap, this.globalSplatIndexToSceneIndexMap = n.sceneIndexMap;
		}
		let p = this.getSplatCount(!0);
		this.enableDistancesComputationOnGPU && this.setupDistancesComputationTransformFeedback();
		let m = this.refreshGPUDataFromSplatBuffers(f);
		for (let e = 0; e < this.scenes.length; e++) this.lastBuildScenes[e] = this.scenes[e];
		return this.lastBuildSplatCount = p, this.lastBuildMaxSplatCount = this.getMaxSplatCount(), this.lastBuildSceneCount = this.scenes.length, this.visible = this.scenes.length > 0, m;
	}
	freeIntermediateSplatData() {
		let e = (e) => {
			delete e.source.data, delete e.image, e.onUpdate = null;
		};
		delete this.splatDataTextures.baseData.covariances, delete this.splatDataTextures.baseData.centers, delete this.splatDataTextures.baseData.colors, delete this.splatDataTextures.baseData.sphericalHarmonics, delete this.splatDataTextures.centerColors.data, delete this.splatDataTextures.covariances.data, this.splatDataTextures.sphericalHarmonics && delete this.splatDataTextures.sphericalHarmonics.data, this.splatDataTextures.sceneIndexes && delete this.splatDataTextures.sceneIndexes.data, this.splatDataTextures.centerColors.texture.needsUpdate = !0, this.splatDataTextures.centerColors.texture.onUpdate = () => {
			e(this.splatDataTextures.centerColors.texture);
		}, this.splatDataTextures.flameModelPosTexture.texture.needsUpdate = !0, this.splatDataTextures.flameModelPosTexture.texture.onUpdate = () => {
			e(this.splatDataTextures.flameModelPosTexture.texture);
		}, this.splatDataTextures.covariances.texture.needsUpdate = !0, this.splatDataTextures.covariances.texture.onUpdate = () => {
			e(this.splatDataTextures.covariances.texture);
		}, this.splatDataTextures.sphericalHarmonics && (this.splatDataTextures.sphericalHarmonics.texture ? (this.splatDataTextures.sphericalHarmonics.texture.needsUpdate = !0, this.splatDataTextures.sphericalHarmonics.texture.onUpdate = () => {
			e(this.splatDataTextures.sphericalHarmonics.texture);
		}) : this.splatDataTextures.sphericalHarmonics.textures.forEach((t) => {
			t.needsUpdate = !0, t.onUpdate = () => {
				e(t);
			};
		})), this.splatDataTextures.sceneIndexes && (this.splatDataTextures.sceneIndexes.texture.needsUpdate = !0, this.splatDataTextures.sceneIndexes.texture.onUpdate = () => {
			e(this.splatDataTextures.sceneIndexes.texture);
		});
	}
	dispose() {
		this.disposeMeshData(), this.disposeTextures(), this.disposeSplatTree(), this.enableDistancesComputationOnGPU && (this.computeDistancesOnGPUSyncTimeout &&= (clearTimeout(this.computeDistancesOnGPUSyncTimeout), null), this.disposeDistancesComputationGPUResources()), this.scenes = [], this.distancesTransformFeedback = {
			id: null,
			vertexShader: null,
			fragmentShader: null,
			program: null,
			centersBuffer: null,
			sceneIndexesBuffer: null,
			outDistancesBuffer: null,
			centersLoc: -1,
			modelViewProjLoc: -1,
			sceneIndexesLoc: -1,
			transformsLocs: []
		}, this.renderer = null, this.globalSplatIndexToLocalSplatIndexMap = [], this.globalSplatIndexToSceneIndexMap = [], this.lastBuildSplatCount = 0, this.lastBuildScenes = [], this.lastBuildMaxSplatCount = 0, this.lastBuildSceneCount = 0, this.firstRenderTime = -1, this.finalBuild = !1, this.webGLUtils = null, this.boundingBox = new S(), this.calculatedSceneCenter = new k(), this.maxSplatDistanceFromSceneCenter = 0, this.visibleRegionBufferRadius = 0, this.visibleRegionRadius = 0, this.visibleRegionFadeStartRadius = 0, this.visibleRegionChanging = !1, this.splatScale = 1, this.pointCloudModeEnabled = !1, this.disposed = !0, this.lastRenderer = null, this.visible = !1;
	}
	disposeMeshData() {
		this.geometry && this.geometry !== Xn && (this.geometry.dispose(), this.geometry = null), this.material &&= (this.material.dispose(), null);
	}
	disposeTextures() {
		for (let e in this.splatDataTextures) if (Object.hasOwn(this.splatDataTextures, e)) {
			let t = this.splatDataTextures[e];
			t.texture &&= (t.texture.dispose(), null);
		}
		this.splatDataTextures = null;
	}
	disposeSplatTree() {
		this.splatTree &&= (this.splatTree.dispose(), null), this.baseSplatTree &&= (this.baseSplatTree.dispose(), null);
	}
	getSplatTree() {
		return this.splatTree;
	}
	onSplatTreeReady(e) {
		this.onSplatTreeReadyCallback = e;
	}
	getDataForDistancesComputation(e, t) {
		return {
			centers: this.integerBasedDistancesComputation ? this.getIntegerCenters(e, t, !0) : this.getFloatCenters(e, t, !0),
			sceneIndexes: this.getSceneIndexes(e, t)
		};
	}
	refreshGPUDataFromSplatBuffers(e) {
		let t = this.getSplatCount(!0);
		this.refreshDataTexturesFromSplatBuffers(e);
		let n = e ? this.lastBuildSplatCount : 0, { centers: r, sceneIndexes: i } = this.getDataForDistancesComputation(n, t - 1);
		return this.enableDistancesComputationOnGPU && this.refreshGPUBuffersForDistancesComputation(r, i, e), {
			from: n,
			to: t - 1,
			count: t - n,
			centers: r,
			sceneIndexes: i
		};
	}
	refreshGPUBuffersForDistancesComputation(e, t, n = !1) {
		let r = n ? this.lastBuildSplatCount : 0;
		this.updateGPUCentersBufferForDistancesComputation(n, e, r), this.updateGPUTransformIndexesBufferForDistancesComputation(n, t, r);
	}
	refreshDataTexturesFromSplatBuffers(e) {
		let t = this.getSplatCount(!0), n = this.lastBuildSplatCount, r = t - 1;
		e ? this.updateBaseDataFromSplatBuffers(n, r) : (this.setupDataTextures(), this.updateBaseDataFromSplatBuffers()), this.updateDataTexturesFromBaseData(n, r), this.updateVisibleRegion(e);
	}
	setupDataTextures() {
		let t = this.getMaxSplatCount(), n = this.getSplatCount(!0);
		this.disposeTextures();
		let r = (e, n) => {
			let r = new j(4096, 1024);
			for (; r.x * r.y * e < t * n;) r.y *= 2;
			return r;
		}, a = (e) => {
			let t = ((e) => e >= 1 ? 6 : 4)(e);
			return {
				elementsPerTexelStored: t,
				texSize: r(t, 6)
			};
		}, o = this.getTargetCovarianceCompressionLevel(), s = this.getTargetSphericalHarmonicsCompressionLevel(), c, l, u;
		if (this.splatRenderMode === Me.ThreeD) {
			let e = a(o);
			e.texSize.x * e.texSize.y > tr && o === 0 && (o = 1), c = new Float32Array(6 * t);
		} else l = new Float32Array(3 * t), u = new Float32Array(4 * t);
		let d = new Float32Array(3 * t), f = new Uint8Array(4 * t), p = Float32Array;
		s === 1 ? p = Uint16Array : s === 2 && (p = Uint8Array);
		let h = xt(this.minSphericalHarmonicsDegree), g = this.minSphericalHarmonicsDegree ? new p(t * h) : void 0, _ = r(4, 4), y = new Uint32Array(_.x * _.y * 4);
		e.updateCenterColorsPaddedData(0, n - 1, d, f, y);
		let b = new A(y, _.x, _.y, m, F);
		if (b.internalFormat = "RGBA32UI", b.needsUpdate = !0, this.material.uniforms.centersColorsTexture.value = b, this.material.uniforms.centersColorsTextureSize.value.copy(_), this.material.uniformsNeedUpdate = !0, this.splatDataTextures = {
			baseData: {
				covariances: c,
				scales: l,
				rotations: u,
				centers: d,
				colors: f,
				sphericalHarmonics: g
			},
			centerColors: {
				data: y,
				texture: b,
				size: _
			}
		}, this.splatRenderMode === Me.ThreeD) {
			let t = a(o), n = t.elementsPerTexelStored, r = t.texSize, i = o >= 1 ? 8 : 4, s = new (o >= 1 ? Uint32Array : Float32Array)(r.x * r.y * i), l;
			if (o === 0 ? s.set(c) : e.updatePaddedCompressedCovariancesTextureData(c, s, 0, 0, c.length), o >= 1) l = new A(s, r.x, r.y, m, F), l.internalFormat = "RGBA32UI", this.material.uniforms.covariancesTextureHalfFloat.value = l;
			else {
				l = new A(s, r.x, r.y, v, x), this.material.uniforms.covariancesTexture.value = l;
				let e = new A(/* @__PURE__ */ new Uint32Array(32), 2, 2, m, F);
				e.internalFormat = "RGBA32UI", this.material.uniforms.covariancesTextureHalfFloat.value = e, e.needsUpdate = !0;
			}
			l.needsUpdate = !0, this.material.uniforms.covariancesAreHalfFloat.value = +(o >= 1), this.material.uniforms.covariancesTextureSize.value.copy(r), this.splatDataTextures.covariances = {
				data: s,
				texture: l,
				size: r,
				compressionLevel: o,
				elementsPerTexelStored: n,
				elementsPerTexelAllocated: i
			};
		} else {
			let t = r(4, 6), i = Float32Array, a = x, o = new i(t.x * t.y * 4);
			e.updateScaleRotationsPaddedData(0, n - 1, l, u, o);
			let s = new A(o, t.x, t.y, v, a);
			s.needsUpdate = !0, this.material.uniforms.scaleRotationsTexture.value = s, this.material.uniforms.scaleRotationsTextureSize.value.copy(t), this.splatDataTextures.scaleRotations = {
				data: o,
				texture: s,
				size: t,
				compressionLevel: 0
			};
		}
		if (g) {
			let e = s === 2 ? z : i, t = h;
			t % 2 != 0 && t++;
			let a = this.minSphericalHarmonicsDegree === 2 ? 4 : 2, o = a === 4 ? v : E, c = r(a, t);
			if (c.x * c.y <= tr) {
				let r = new p(c.x * c.y * a);
				for (let e = 0; e < n; e++) {
					let n = h * e, i = t * e;
					for (let e = 0; e < h; e++) r[i + e] = g[n + e];
				}
				let i = new A(r, c.x, c.y, o, e);
				i.needsUpdate = !0, this.material.uniforms.sphericalHarmonicsTexture.value = i, this.splatDataTextures.sphericalHarmonics = {
					componentCount: h,
					paddedComponentCount: t,
					data: r,
					textureCount: 1,
					texture: i,
					size: c,
					compressionLevel: s,
					elementsPerTexel: a
				};
			} else {
				let i = h / 3;
				t = i, t % 2 != 0 && t++, c = r(a, t);
				let l = c.x * c.y * a, u = [
					this.material.uniforms.sphericalHarmonicsTextureR,
					this.material.uniforms.sphericalHarmonicsTextureG,
					this.material.uniforms.sphericalHarmonicsTextureB
				], d = [], f = [];
				for (let r = 0; r < 3; r++) {
					let a = new p(l);
					d.push(a);
					for (let e = 0; e < n; e++) {
						let n = h * e, o = t * e;
						if (i >= 3) {
							for (let e = 0; e < 3; e++) a[o + e] = g[n + 3 * r + e];
							if (i >= 8) for (let e = 0; e < 5; e++) a[o + 3 + e] = g[n + 9 + 5 * r + e];
						}
					}
					let s = new A(a, c.x, c.y, o, e);
					f.push(s), s.needsUpdate = !0, u[r].value = s;
				}
				this.material.uniforms.sphericalHarmonicsMultiTextureMode.value = 1, this.splatDataTextures.sphericalHarmonics = {
					componentCount: h,
					componentCountPerChannel: i,
					paddedComponentCount: t,
					data: d,
					textureCount: 3,
					textures: f,
					size: c,
					compressionLevel: s,
					elementsPerTexel: a
				};
			}
			this.material.uniforms.sphericalHarmonicsTextureSize.value.copy(c), this.material.uniforms.sphericalHarmonics8BitMode.value = +(s === 2);
			for (let e = 0; e < this.scenes.length; e++) {
				let t = this.scenes[e].splatBuffer;
				this.material.uniforms.sphericalHarmonics8BitCompressionRangeMin.value[e] = t.minSphericalHarmonicsCoeff, this.material.uniforms.sphericalHarmonics8BitCompressionRangeMax.value[e] = t.maxSphericalHarmonicsCoeff;
			}
			this.material.uniformsNeedUpdate = !0;
		}
		let S = r(1, 4), C = new Uint32Array(S.x * S.y * 1);
		for (let e = 0; e < n; e++) C[e] = this.globalSplatIndexToSceneIndexMap[e];
		let w = new A(C, S.x, S.y, N, F);
		w.internalFormat = "R32UI", w.needsUpdate = !0, this.material.uniforms.sceneIndexesTexture.value = w, this.material.uniforms.sceneIndexesTextureSize.value.copy(S), this.material.uniformsNeedUpdate = !0, this.splatDataTextures.sceneIndexes = {
			data: C,
			texture: w,
			size: S
		}, this.material.uniforms.sceneCount.value = this.scenes.length, this.flameModel && this.flameModel.geometry && this.flameModel.geometry.morphAttributes && this.flameModel.skeleton && (this.expressionBSNum = this.flameModel.geometry.morphAttributes.position.length, this.material.uniforms.bsCount.value = this.expressionBSNum, this.flameModel.skeleton.bones.forEach((e, t) => {
			e.name == "head" && (this.material.uniforms.headBoneIndex.value = t);
		}), this.buildModelTexture(this.flameModel), this.buildBoneMatrixTexture(), this.buildBoneWeightTexture(this.flameModel));
	}
	buildBoneMatrixTexture() {
		if (!this.bsWeight || !this.flameModel || !this.flameModel.morphTargetDictionary) return;
		let e = new j(4, 32), t = new Float32Array(this.bonesMatrix), n = new Uint32Array(e.x * e.y * 4);
		this.morphTargetDictionary = this.flameModel.morphTargetDictionary;
		for (let e = 0; e < 16 * this.bonesNum; e++) n[e] = zt(t[e]);
		this.flameModel && this.flameModel.skeleton && (this.material.uniforms.boneTexture0.value = this.flameModel.skeleton.boneTexture, this.material.uniforms.bindMatrix.value = this.flameModel.bindMatrix, this.material.uniforms.bindMatrixInverse.value = this.flameModel.bindMatrixInverse);
		for (let e in this.bsWeight) if (Object.hasOwn(this.bsWeight, e)) {
			let t = this.bsWeight[e];
			n[this.morphTargetDictionary[e] + 16 * this.bonesNum] = zt(t);
		}
		let r = new A(n, e.x, e.y, m, F);
		r.internalFormat = "RGBA32UI", r.needsUpdate = !0, this.material.uniforms.boneTexture.value = r, this.material.uniforms.boneTextureSize.value.copy(e), this.material.uniformsNeedUpdate = !0, this.splatDataTextures.boneMatrix = {
			data: n,
			texture: r,
			size: e
		}, this.splatDataTextures.baseData.boneMatrix = n;
	}
	updateBoneMatrixTexture() {
		if (this.bsWeight && this.morphTargetDictionary) {
			for (let e in this.bsWeight) if (Object.hasOwn(this.bsWeight, e)) {
				let t = this.bsWeight[e], n = this.morphTargetDictionary[e];
				this.splatDataTextures.baseData.boneMatrix[n + 16 * this.bonesNum] = zt(t);
			}
			this.splatDataTextures.boneMatrix.texture.data = this.splatDataTextures.baseData.boneMatrix, this.splatDataTextures.boneMatrix.texture.needsUpdate = !0, this.material.uniforms.boneTexture.value = this.splatDataTextures.boneMatrix.texture, this.flameModel.skeleton && (this.material.uniforms.boneTexture0.value = this.flameModel.skeleton.boneTexture, this.material.uniforms.bindMatrix.value = this.flameModel.bindMatrix, this.material.uniforms.bindMatrixInverse.value = this.flameModel.bindMatrixInverse), this.material.uniformsNeedUpdate = !0;
		}
	}
	buildSkinningTextures(e) {
		if (!e || !e.geometry) return;
		let t = e.geometry.attributes.skinIndex, n = e.geometry.attributes.skinWeight;
		if (!t || !n) return;
		let r = t.count, i = new j(512, 512), a = i.x * i.y;
		r > a && console.warn(`buildSkinningTextures: ${r} splats > 512x512 texture capacity ${a}; truncating`);
		let o = new Uint32Array(4 * a);
		for (let e = 0; e < r; e++) o[4 * e + 0] = t.array[4 * e + 0], o[4 * e + 1] = t.array[4 * e + 1], o[4 * e + 2] = t.array[4 * e + 2], o[4 * e + 3] = t.array[4 * e + 3];
		let s = new A(o, i.x, i.y, m, F);
		s.internalFormat = "RGBA32UI", s.needsUpdate = !0;
		let c = new Uint32Array(4 * a);
		for (let e = 0; e < r; e++) c[4 * e + 0] = zt(n.array[4 * e + 0]), c[4 * e + 1] = zt(n.array[4 * e + 1]), c[4 * e + 2] = zt(n.array[4 * e + 2]), c[4 * e + 3] = zt(n.array[4 * e + 3]);
		let l = new A(c, i.x, i.y, m, F);
		l.internalFormat = "RGBA32UI", l.needsUpdate = !0, this.material.uniforms.skinIndexTexture.value = s, this.material.uniforms.skinWeightTexture.value = l, this.material.uniforms.skinDataTextureSize.value.copy(i), this.material.uniformsNeedUpdate = !0;
	}
	buildBoneWeightTexture(e) {
		if (!this.bonesWeight) return;
		let t = e.geometry.attributes.position.array.length / 3, n = new j(512, 512), r = new Float32Array(n.x * n.y * 4), i = new Uint32Array(n.x * n.y * 4);
		for (let e = 0; e < t; e++) r[8 * e + 0] = this.bonesWeight[e][0], r[8 * e + 1] = this.bonesWeight[e][1], r[8 * e + 2] = this.bonesWeight[e][2], r[8 * e + 3] = this.bonesWeight[e][3], r[8 * e + 4] = this.bonesWeight[e][4], i[8 * e + 0] = zt(this.bonesWeight[e][0]), i[8 * e + 1] = zt(this.bonesWeight[e][1]), i[8 * e + 2] = zt(this.bonesWeight[e][2]), i[8 * e + 3] = zt(this.bonesWeight[e][3]), i[8 * e + 4] = zt(this.bonesWeight[e][4]);
		let a = new A(i, n.x, n.y, m, F);
		a.internalFormat = "RGBA32UI", a.needsUpdate = !0, this.material.uniforms.boneWeightTexture.value = a, this.material.uniforms.boneWeightTextureSize.value.copy(n), this.material.uniformsNeedUpdate = !0, this.splatDataTextures.boneWeight = {
			data: i,
			texture: a,
			size: n
		}, this.splatDataTextures.baseData.boneWeight = i;
	}
	buildModelTexture(e) {
		if (!(e && e.geometry && e.geometry.morphAttributes && e.morphTargetDictionary)) return;
		let t = new j(4096, 2048);
		var n = e.geometry.attributes.position.array, r = [];
		let i = n.length / 3, a = e.geometry.morphAttributes.position.length;
		Object.keys(e.morphTargetDictionary).forEach((t, n) => {
			let i = e.morphTargetDictionary[t];
			var a = e.geometry.morphAttributes.position[i];
			r = r.concat(Array.from(a.array));
		}), r = r.concat(Array.from(n));
		let o = new Float32Array(t.x * t.y * 4), s = new Uint32Array(t.x * t.y * 4);
		for (let e = 0; e < i * (a + 1); e++) o[4 * e + 0] = r[3 * e + 0], o[4 * e + 1] = r[3 * e + 1], o[4 * e + 2] = r[3 * e + 2], s[4 * e + 0] = zt(o[4 * e + 0]), s[4 * e + 1] = zt(o[4 * e + 1]), s[4 * e + 2] = zt(o[4 * e + 2]);
		let c = new A(s, t.x, t.y, m, F);
		c.internalFormat = "RGBA32UI", c.needsUpdate = !0, this.material.uniforms.flameModelTexture.value = c, this.material.uniforms.flameModelTextureSize.value.copy(t), this.material.uniformsNeedUpdate = !0, this.material.uniforms.gaussianSplatCount.value = this.gaussianSplatCount, this.splatDataTextures.flameModel = {
			data: s,
			texture: c,
			size: t
		}, this.splatDataTextures.baseData.flameModelPos = o;
	}
	updateTetureAfterBSAndSkeleton(t, n) {
		let i = new r();
		this.getSceneTransform(0, i), this.getScene(0).splatBuffer.fillSplatCenterArray(this.morphedMesh, this.splatDataTextures.baseData.centers, i, t, n, 0);
		let a = this.splatDataTextures.centerColors, o = a.data, s = a.texture;
		e.updateCenterColorsPaddedData(t, n, this.splatDataTextures.baseData.centers, this.splatDataTextures.baseData.colors, o);
		let c = this.renderer ? this.renderer.properties.get(s) : null;
		c && c.__webglTexture ? this.updateDataTexture(o, a.texture, a.size, c, 4, 4, 4, t, n) : s.needsUpdate = !0, this.updateBoneMatrixTexture();
	}
	updateBaseDataFromSplatBuffers(e, t) {
		let n = this.splatDataTextures.covariances, r = n ? n.compressionLevel : void 0, i = this.splatDataTextures.scaleRotations, a = i ? i.compressionLevel : void 0, o = this.splatDataTextures.sphericalHarmonics, s = o ? o.compressionLevel : 0;
		this.fillSplatDataArrays(this.splatDataTextures.baseData.covariances, this.splatDataTextures.baseData.scales, this.splatDataTextures.baseData.rotations, this.splatDataTextures.baseData.centers, this.splatDataTextures.baseData.colors, this.splatDataTextures.baseData.sphericalHarmonics, this.splatDataTextures.baseData.flameModelPos, void 0, r, a, s, e, t, e);
	}
	updateDataTexturesFromBaseData(t, n) {
		let r = this.splatDataTextures.covariances, i = r ? r.compressionLevel : void 0, a = this.splatDataTextures.scaleRotations, o = a ? a.compressionLevel : void 0, s = this.splatDataTextures.sphericalHarmonics, c = s ? s.compressionLevel : 0, l = this.splatDataTextures.flameModel, u = l.data, d = l.texture, f = this.renderer ? this.renderer.properties.get(d) : null;
		f && f.__webglTexture ? this.updateDataTexture(u, l.texture, l.size, f, 4, 4, 3, t, n) : d.needsUpdate = !0;
		let p = this.splatDataTextures.centerColors, m = p.data, h = p.texture;
		e.updateCenterColorsPaddedData(t, n, this.splatDataTextures.baseData.centers, this.splatDataTextures.baseData.colors, m);
		let g = this.renderer ? this.renderer.properties.get(h) : null;
		if (g && g.__webglTexture ? this.updateDataTexture(m, p.texture, p.size, g, 4, 4, 4, t, n) : h.needsUpdate = !0, r) {
			let a = r.texture, o = 6 * t, s = 6 * n;
			if (i === 0) for (let e = o; e <= s; e++) {
				let t = this.splatDataTextures.baseData.covariances[e];
				r.data[e] = t;
			}
			else e.updatePaddedCompressedCovariancesTextureData(this.splatDataTextures.baseData.covariances, r.data, t * r.elementsPerTexelAllocated, o, s);
			let c = this.renderer ? this.renderer.properties.get(a) : null;
			c && c.__webglTexture ? i === 0 ? this.updateDataTexture(r.data, r.texture, r.size, c, r.elementsPerTexelStored, 6, 4, t, n) : this.updateDataTexture(r.data, r.texture, r.size, c, r.elementsPerTexelAllocated, r.elementsPerTexelAllocated, 2, t, n) : a.needsUpdate = !0;
		}
		if (a) {
			let r = a.data, i = a.texture, s = o === 0 ? 4 : 2;
			e.updateScaleRotationsPaddedData(t, n, this.splatDataTextures.baseData.scales, this.splatDataTextures.baseData.rotations, r);
			let c = this.renderer ? this.renderer.properties.get(i) : null;
			c && c.__webglTexture ? this.updateDataTexture(r, a.texture, a.size, c, 4, 6, s, t, n) : i.needsUpdate = !0;
		}
		let _ = this.splatDataTextures.baseData.sphericalHarmonics;
		if (_) {
			let e = 4;
			c === 1 ? e = 2 : c === 2 && (e = 1);
			let r = (r, i, a, o, s) => {
				let c = this.renderer ? this.renderer.properties.get(r) : null;
				c && c.__webglTexture ? this.updateDataTexture(o, r, i, c, a, s, e, t, n) : r.needsUpdate = !0;
			}, i = s.componentCount, a = s.paddedComponentCount;
			if (s.textureCount === 1) {
				let e = s.data;
				for (let r = t; r <= n; r++) {
					let t = i * r, n = a * r;
					for (let r = 0; r < i; r++) e[n + r] = _[t + r];
				}
				r(s.texture, s.size, s.elementsPerTexel, e, a);
			} else {
				let e = s.componentCountPerChannel;
				for (let o = 0; o < 3; o++) {
					let c = s.data[o];
					for (let r = t; r <= n; r++) {
						let t = i * r, n = a * r;
						if (e >= 3) {
							for (let e = 0; e < 3; e++) c[n + e] = _[t + 3 * o + e];
							if (e >= 8) for (let e = 0; e < 5; e++) c[n + 3 + e] = _[t + 9 + 5 * o + e];
						}
					}
					r(s.textures[o], s.size, s.elementsPerTexel, c, a);
				}
			}
		}
		let v = this.splatDataTextures.sceneIndexes, y = v.data;
		for (let e = this.lastBuildSplatCount; e <= n; e++) y[e] = this.globalSplatIndexToSceneIndexMap[e];
		let b = v.texture, x = this.renderer ? this.renderer.properties.get(b) : null;
		x && x.__webglTexture ? this.updateDataTexture(y, v.texture, v.size, x, 1, 1, 1, this.lastBuildSplatCount, n) : b.needsUpdate = !0;
	}
	getTargetCovarianceCompressionLevel() {
		return +!!this.halfPrecisionCovariancesOnGPU;
	}
	getTargetSphericalHarmonicsCompressionLevel() {
		return Math.max(1, this.getMaximumSplatBufferCompressionLevel());
	}
	getMaximumSplatBufferCompressionLevel() {
		let e;
		for (let t = 0; t < this.scenes.length; t++) {
			let n = this.getScene(t).splatBuffer;
			(t === 0 || n.compressionLevel > e) && (e = n.compressionLevel);
		}
		return e;
	}
	getMinimumSplatBufferCompressionLevel() {
		let e;
		for (let t = 0; t < this.scenes.length; t++) {
			let n = this.getScene(t).splatBuffer;
			(t === 0 || n.compressionLevel < e) && (e = n.compressionLevel);
		}
		return e;
	}
	static computeTextureUpdateRegion(e, t, n, r, i) {
		let a = i / r, o = e * a, s = Math.floor(o / n), c = s * n * r, l = t * a, u = Math.floor(l / n);
		return {
			dataStart: c,
			dataEnd: u * n * r + n * r,
			startRow: s,
			endRow: u
		};
	}
	updateDataTexture(t, n, r, i, a, o, s, c, l) {
		let u = this.renderer.getContext(), d = e.computeTextureUpdateRegion(c, l, r.x, a, o), f = d.dataEnd - d.dataStart, p = new t.constructor(t.buffer, d.dataStart * s, f), m = d.endRow - d.startRow + 1, h = this.webGLUtils.convert(n.type), g = this.webGLUtils.convert(n.format, n.colorSpace), _ = u.getParameter(u.TEXTURE_BINDING_2D);
		u.bindTexture(u.TEXTURE_2D, i.__webglTexture), u.texSubImage2D(u.TEXTURE_2D, 0, 0, d.startRow, r.x, m, g, h, p), u.bindTexture(u.TEXTURE_2D, _);
	}
	static updatePaddedCompressedCovariancesTextureData(e, t, n, r, i) {
		let a = new DataView(t.buffer), o = n, s = 0;
		for (let t = r; t <= i; t += 2) a.setUint16(2 * o, e[t], !0), a.setUint16(2 * o + 2, e[t + 1], !0), o += 2, s++, s >= 3 && (o += 2, s = 0);
	}
	static updateCenterColorsPaddedData(e, t, n, r, i) {
		for (let a = e; a <= t; a++) {
			let e = 4 * a, t = 3 * a, o = 4 * a;
			i[o] = Vt(r, e), i[o + 1] = zt(n[t]), i[o + 2] = zt(n[t + 1]), i[o + 3] = zt(n[t + 2]);
		}
	}
	static updateScaleRotationsPaddedData(e, t, n, r, i) {
		for (let a = e; a <= t; a++) {
			let e = 3 * a, t = 4 * a, o = 6 * a;
			i[o] = n[e], i[o + 1] = n[e + 1], i[o + 2] = n[e + 2], i[o + 3] = r[t], i[o + 4] = r[t + 1], i[o + 5] = r[t + 2];
		}
	}
	updateVisibleRegion(e) {
		let t = this.getSplatCount(!0), n = new k();
		if (!e) {
			let e = new k();
			this.scenes.forEach((t) => {
				e.add(t.splatBuffer.sceneCenter);
			}), e.multiplyScalar(1 / this.scenes.length), this.calculatedSceneCenter.copy(e), this.material.uniforms.sceneCenter.value.copy(this.calculatedSceneCenter), this.material.uniformsNeedUpdate = !0;
		}
		for (let r = e ? this.lastBuildSplatCount : 0; r < t; r++) {
			this.getSplatCenter(this.morphedMesh, r, n, !0);
			let e = n.sub(this.calculatedSceneCenter).length();
			e > this.maxSplatDistanceFromSceneCenter && (this.maxSplatDistanceFromSceneCenter = e);
		}
		this.maxSplatDistanceFromSceneCenter - this.visibleRegionBufferRadius > 1 && (this.visibleRegionBufferRadius = this.maxSplatDistanceFromSceneCenter, this.visibleRegionRadius = Math.max(this.visibleRegionBufferRadius - 1, 0)), this.finalBuild && (this.visibleRegionRadius = this.visibleRegionBufferRadius = this.maxSplatDistanceFromSceneCenter), this.updateVisibleRegionFadeDistance();
	}
	updateVisibleRegionFadeDistance(e = je.Default) {
		let t = .012 * this.sceneFadeInRateMultiplier, n = .003 * this.sceneFadeInRateMultiplier, r = this.finalBuild ? t : n, i = e === je.Default ? r : n;
		this.visibleRegionFadeStartRadius = (this.visibleRegionRadius - this.visibleRegionFadeStartRadius) * i + this.visibleRegionFadeStartRadius;
		let a = (this.visibleRegionBufferRadius > 0 ? this.visibleRegionFadeStartRadius / this.visibleRegionBufferRadius : 0) > .99, o = a || e === je.Instant ? 1 : 0;
		this.material.uniforms.visibleRegionFadeStartRadius.value = this.visibleRegionFadeStartRadius, this.material.uniforms.visibleRegionRadius.value = this.visibleRegionRadius, this.material.uniforms.firstRenderTime.value = this.firstRenderTime, this.material.uniforms.currentTime.value = performance.now(), this.material.uniforms.fadeInComplete.value = o, this.material.uniformsNeedUpdate = !0, this.visibleRegionChanging = !a;
	}
	updateRenderIndexes(e, t) {
		let n = this.geometry;
		n.attributes.splatIndex.set(e), n.attributes.splatIndex.needsUpdate = !0, t > 0 && this.firstRenderTime === -1 && (this.firstRenderTime = performance.now()), n.instanceCount = t, n.setDrawRange(0, t);
	}
	updateTransforms() {
		for (let e = 0; e < this.scenes.length; e++) this.getScene(e).updateTransform(this.dynamicMode);
	}
	updateUniforms = function() {
		let e = new j();
		return function(t, n, r, i, a, o) {
			if (this.getSplatCount() > 0) {
				if (e.set(t.x * this.devicePixelRatio, t.y * this.devicePixelRatio), this.material.uniforms.viewport.value.copy(e), this.material.uniforms.basisViewport.value.set(1 / e.x, 1 / e.y), this.material.uniforms.focal.value.set(n, r), this.material.uniforms.orthographicMode.value = +!!i, this.material.uniforms.orthoZoom.value = a, this.material.uniforms.inverseFocalAdjustment.value = o, this.dynamicMode) for (let e = 0; e < this.scenes.length; e++) this.material.uniforms.transforms.value[e].copy(this.getScene(e).transform);
				if (this.enableOptionalEffects) for (let e = 0; e < this.scenes.length; e++) this.material.uniforms.sceneOpacity.value[e] = _t(this.getScene(e).opacity, 0, 1), this.material.uniforms.sceneVisibility.value[e] = +!!this.getScene(e).visible, this.material.uniformsNeedUpdate = !0;
				this.material.uniformsNeedUpdate = !0;
			}
		};
	}();
	setSplatScale(e = 1) {
		this.splatScale = e, this.material.uniforms.splatScale.value = e, this.material.uniformsNeedUpdate = !0;
	}
	getSplatScale() {
		return this.splatScale;
	}
	setPointCloudModeEnabled(e) {
		this.pointCloudModeEnabled = e, this.material.uniforms.pointCloudModeEnabled.value = +!!e, this.material.uniformsNeedUpdate = !0;
	}
	getPointCloudModeEnabled() {
		return this.pointCloudModeEnabled;
	}
	getSplatDataTextures() {
		return this.splatDataTextures;
	}
	getSplatCount(t = !1) {
		return t ? e.getTotalSplatCountForScenes(this.scenes) : this.lastBuildSplatCount;
	}
	static getTotalSplatCountForScenes(e) {
		let t = 0;
		for (let n of e) n && n.splatBuffer && (t += n.splatBuffer.getSplatCount());
		return t;
	}
	static getTotalSplatCountForSplatBuffers(e) {
		let t = 0;
		for (let n of e) t += n.getSplatCount();
		return t;
	}
	getMaxSplatCount() {
		return e.getTotalMaxSplatCountForScenes(this.scenes);
	}
	static getTotalMaxSplatCountForScenes(e) {
		let t = 0;
		for (let n of e) n && n.splatBuffer && (t += n.splatBuffer.getMaxSplatCount());
		return t;
	}
	static getTotalMaxSplatCountForSplatBuffers(e) {
		let t = 0;
		for (let n of e) t += n.getMaxSplatCount();
		return t;
	}
	disposeDistancesComputationGPUResources() {
		if (!this.renderer) return;
		let e = this.renderer.getContext();
		this.distancesTransformFeedback.vao && (e.deleteVertexArray(this.distancesTransformFeedback.vao), this.distancesTransformFeedback.vao = null), this.distancesTransformFeedback.program && (e.deleteProgram(this.distancesTransformFeedback.program), e.deleteShader(this.distancesTransformFeedback.vertexShader), e.deleteShader(this.distancesTransformFeedback.fragmentShader), this.distancesTransformFeedback.program = null, this.distancesTransformFeedback.vertexShader = null, this.distancesTransformFeedback.fragmentShader = null), this.disposeDistancesComputationGPUBufferResources(), this.distancesTransformFeedback.id && (e.deleteTransformFeedback(this.distancesTransformFeedback.id), this.distancesTransformFeedback.id = null);
	}
	disposeDistancesComputationGPUBufferResources() {
		if (!this.renderer) return;
		let e = this.renderer.getContext();
		this.distancesTransformFeedback.centersBuffer && (this.distancesTransformFeedback.centersBuffer = null, e.deleteBuffer(this.distancesTransformFeedback.centersBuffer)), this.distancesTransformFeedback.outDistancesBuffer && (e.deleteBuffer(this.distancesTransformFeedback.outDistancesBuffer), this.distancesTransformFeedback.outDistancesBuffer = null);
	}
	setRenderer(e) {
		if (e !== this.renderer) {
			this.renderer = e;
			let t = this.renderer.getContext(), n = new Qn(t), r = new $n(t, n, {});
			if (n.init(r), this.webGLUtils = new er(t, n, r), this.enableDistancesComputationOnGPU && this.getSplatCount() > 0) {
				this.setupDistancesComputationTransformFeedback();
				let { centers: e, sceneIndexes: t } = this.getDataForDistancesComputation(0, this.getSplatCount() - 1);
				this.refreshGPUBuffersForDistancesComputation(e, t);
			}
		}
	}
	setupDistancesComputationTransformFeedback = function() {
		let e;
		return () => {
			let t = this.getMaxSplatCount();
			if (!this.renderer) return;
			let n = this.lastRenderer !== this.renderer, r = e !== t;
			if (!n && !r) return;
			n ? this.disposeDistancesComputationGPUResources() : r && this.disposeDistancesComputationGPUBufferResources();
			let i = this.renderer.getContext(), a = (e, t, n) => {
				let r = e.createShader(t);
				if (!r) return Yn.error("Fatal error: gl could not create a shader object."), null;
				if (e.shaderSource(r, n), e.compileShader(r), !e.getShaderParameter(r, e.COMPILE_STATUS)) {
					let n = "unknown";
					t === e.VERTEX_SHADER ? n = "vertex shader" : t === e.FRAGMENT_SHADER && (n = "fragement shader");
					let i = e.getShaderInfoLog(r);
					return Yn.error("Failed to compile " + n + " with these errors:" + i), e.deleteShader(r), null;
				}
				return r;
			}, o;
			this.integerBasedDistancesComputation ? (o = "#version 300 es\n                in ivec4 center;\n                flat out int distance;", this.dynamicMode ? o += `\n                        in uint sceneIndex;\n                        uniform ivec4 transforms[${K.MaxScenes}];\n                        void main(void) {\n                            ivec4 transform = transforms[sceneIndex];\n                            distance = center.x * transform.x + center.y * transform.y + center.z * transform.z + transform.w * center.w;\n                        }\n                    ` : o += "\n                        uniform ivec3 modelViewProj;\n                        void main(void) {\n                            distance = center.x * modelViewProj.x + center.y * modelViewProj.y + center.z * modelViewProj.z;\n                        }\n                    ") : (o = "#version 300 es\n                in vec4 center;\n                flat out float distance;", this.dynamicMode ? o += `\n                        in uint sceneIndex;\n                        uniform mat4 transforms[${K.MaxScenes}];\n                        void main(void) {\n                            vec4 transformedCenter = transforms[sceneIndex] * vec4(center.xyz, 1.0);\n                            distance = transformedCenter.z;\n                        }\n                    ` : o += "\n                        uniform vec3 modelViewProj;\n                        void main(void) {\n                            distance = center.x * modelViewProj.x + center.y * modelViewProj.y + center.z * modelViewProj.z;\n                        }\n                    ");
			let s = i.getParameter(i.VERTEX_ARRAY_BINDING), c = i.getParameter(i.CURRENT_PROGRAM), l = !!c && i.getProgramParameter(c, i.DELETE_STATUS);
			if (n && (this.distancesTransformFeedback.vao = i.createVertexArray()), i.bindVertexArray(this.distancesTransformFeedback.vao), n) {
				let e = i.createProgram(), t = a(i, i.VERTEX_SHADER, o), n = a(i, i.FRAGMENT_SHADER, "#version 300 es\n                precision lowp float;\n                out vec4 fragColor;\n                void main(){}\n            ");
				if (!t || !n) throw Error("Could not compile shaders for distances computation on GPU.");
				if (i.attachShader(e, t), i.attachShader(e, n), i.transformFeedbackVaryings(e, ["distance"], i.SEPARATE_ATTRIBS), i.linkProgram(e), !i.getProgramParameter(e, i.LINK_STATUS)) {
					let r = i.getProgramInfoLog(e);
					throw Yn.error("Fatal error: Failed to link program: " + r), i.deleteProgram(e), i.deleteShader(n), i.deleteShader(t), /* @__PURE__ */ Error("Could not link shaders for distances computation on GPU.");
				}
				this.distancesTransformFeedback.program = e, this.distancesTransformFeedback.vertexShader = t, this.distancesTransformFeedback.vertexShader = n;
			}
			if (i.useProgram(this.distancesTransformFeedback.program), this.distancesTransformFeedback.centersLoc = i.getAttribLocation(this.distancesTransformFeedback.program, "center"), this.dynamicMode) {
				this.distancesTransformFeedback.sceneIndexesLoc = i.getAttribLocation(this.distancesTransformFeedback.program, "sceneIndex");
				for (let e = 0; e < this.scenes.length; e++) this.distancesTransformFeedback.transformsLocs[e] = i.getUniformLocation(this.distancesTransformFeedback.program, `transforms[${e}]`);
			} else this.distancesTransformFeedback.modelViewProjLoc = i.getUniformLocation(this.distancesTransformFeedback.program, "modelViewProj");
			(n || r) && (this.distancesTransformFeedback.centersBuffer = i.createBuffer(), i.bindBuffer(i.ARRAY_BUFFER, this.distancesTransformFeedback.centersBuffer), i.enableVertexAttribArray(this.distancesTransformFeedback.centersLoc), this.integerBasedDistancesComputation ? i.vertexAttribIPointer(this.distancesTransformFeedback.centersLoc, 4, i.INT, 0, 0) : i.vertexAttribPointer(this.distancesTransformFeedback.centersLoc, 4, i.FLOAT, !1, 0, 0), this.dynamicMode && (this.distancesTransformFeedback.sceneIndexesBuffer = i.createBuffer(), i.bindBuffer(i.ARRAY_BUFFER, this.distancesTransformFeedback.sceneIndexesBuffer), i.enableVertexAttribArray(this.distancesTransformFeedback.sceneIndexesLoc), i.vertexAttribIPointer(this.distancesTransformFeedback.sceneIndexesLoc, 1, i.UNSIGNED_INT, 0, 0))), (n || r) && (this.distancesTransformFeedback.outDistancesBuffer = i.createBuffer()), i.bindBuffer(i.ARRAY_BUFFER, this.distancesTransformFeedback.outDistancesBuffer), i.bufferData(i.ARRAY_BUFFER, 4 * t, i.STATIC_READ), n && (this.distancesTransformFeedback.id = i.createTransformFeedback()), i.bindTransformFeedback(i.TRANSFORM_FEEDBACK, this.distancesTransformFeedback.id), i.bindBufferBase(i.TRANSFORM_FEEDBACK_BUFFER, 0, this.distancesTransformFeedback.outDistancesBuffer), c && !0 !== l && i.useProgram(c), s && i.bindVertexArray(s), this.lastRenderer = this.renderer, e = t;
		};
	}();
	updateGPUCentersBufferForDistancesComputation(e, t, n) {
		if (!this.renderer) return;
		let r = this.renderer.getContext(), i = r.getParameter(r.VERTEX_ARRAY_BINDING);
		r.bindVertexArray(this.distancesTransformFeedback.vao);
		let a = this.integerBasedDistancesComputation ? Uint32Array : Float32Array, o = 16 * n;
		if (r.bindBuffer(r.ARRAY_BUFFER, this.distancesTransformFeedback.centersBuffer), e) r.bufferSubData(r.ARRAY_BUFFER, o, t);
		else {
			let e = new a(16 * this.getMaxSplatCount());
			e.set(t), r.bufferData(r.ARRAY_BUFFER, e, r.STATIC_DRAW);
		}
		r.bindBuffer(r.ARRAY_BUFFER, null), i && r.bindVertexArray(i);
	}
	updateGPUTransformIndexesBufferForDistancesComputation(e, t, n) {
		if (!this.renderer || !this.dynamicMode) return;
		let r = this.renderer.getContext(), i = r.getParameter(r.VERTEX_ARRAY_BINDING);
		r.bindVertexArray(this.distancesTransformFeedback.vao);
		let a = 4 * n;
		if (r.bindBuffer(r.ARRAY_BUFFER, this.distancesTransformFeedback.sceneIndexesBuffer), e) r.bufferSubData(r.ARRAY_BUFFER, a, t);
		else {
			let e = new Uint32Array(4 * this.getMaxSplatCount());
			e.set(t), r.bufferData(r.ARRAY_BUFFER, e, r.STATIC_DRAW);
		}
		r.bindBuffer(r.ARRAY_BUFFER, null), i && r.bindVertexArray(i);
	}
	getSceneIndexes(e, t) {
		let n;
		n = new Uint32Array(t - e + 1);
		for (let r = e; r <= t; r++) n[r] = this.globalSplatIndexToSceneIndexMap[r];
		return n;
	}
	fillTransformsArray = function() {
		let e = [];
		return function(t) {
			e.length !== t.length && (e.length = t.length);
			for (let t = 0; t < this.scenes.length; t++) {
				let n = this.getScene(t).transform.elements;
				for (let r = 0; r < 16; r++) e[16 * t + r] = n[r];
			}
			t.set(e);
		};
	}();
	computeDistancesOnGPU = function() {
		let t = new r();
		return (n, r) => {
			if (!this.renderer) return;
			let i = this.renderer.getContext(), a = i.getParameter(i.VERTEX_ARRAY_BINDING), o = i.getParameter(i.CURRENT_PROGRAM), s = !!o && i.getProgramParameter(o, i.DELETE_STATUS);
			if (i.bindVertexArray(this.distancesTransformFeedback.vao), i.useProgram(this.distancesTransformFeedback.program), i.enable(i.RASTERIZER_DISCARD), this.dynamicMode) for (let r = 0; r < this.scenes.length; r++) if (t.copy(this.getScene(r).transform), t.premultiply(n), this.integerBasedDistancesComputation) {
				let n = e.getIntegerMatrixArray(t), a = [
					n[2],
					n[6],
					n[10],
					n[14]
				];
				i.uniform4i(this.distancesTransformFeedback.transformsLocs[r], a[0], a[1], a[2], a[3]);
			} else i.uniformMatrix4fv(this.distancesTransformFeedback.transformsLocs[r], !1, t.elements);
			else if (this.integerBasedDistancesComputation) {
				let t = e.getIntegerMatrixArray(n), r = [
					t[2],
					t[6],
					t[10]
				];
				i.uniform3i(this.distancesTransformFeedback.modelViewProjLoc, r[0], r[1], r[2]);
			} else {
				let e = [
					n.elements[2],
					n.elements[6],
					n.elements[10]
				];
				i.uniform3f(this.distancesTransformFeedback.modelViewProjLoc, e[0], e[1], e[2]);
			}
			i.bindBuffer(i.ARRAY_BUFFER, this.distancesTransformFeedback.centersBuffer), i.enableVertexAttribArray(this.distancesTransformFeedback.centersLoc), this.integerBasedDistancesComputation ? i.vertexAttribIPointer(this.distancesTransformFeedback.centersLoc, 4, i.INT, 0, 0) : i.vertexAttribPointer(this.distancesTransformFeedback.centersLoc, 4, i.FLOAT, !1, 0, 0), this.dynamicMode && (i.bindBuffer(i.ARRAY_BUFFER, this.distancesTransformFeedback.sceneIndexesBuffer), i.enableVertexAttribArray(this.distancesTransformFeedback.sceneIndexesLoc), i.vertexAttribIPointer(this.distancesTransformFeedback.sceneIndexesLoc, 1, i.UNSIGNED_INT, 0, 0)), i.bindTransformFeedback(i.TRANSFORM_FEEDBACK, this.distancesTransformFeedback.id), i.bindBufferBase(i.TRANSFORM_FEEDBACK_BUFFER, 0, this.distancesTransformFeedback.outDistancesBuffer), i.beginTransformFeedback(i.POINTS), i.drawArrays(i.POINTS, 0, this.getSplatCount()), i.endTransformFeedback(), i.bindBufferBase(i.TRANSFORM_FEEDBACK_BUFFER, 0, null), i.bindTransformFeedback(i.TRANSFORM_FEEDBACK, null), i.disable(i.RASTERIZER_DISCARD);
			let c = i.fenceSync(i.SYNC_GPU_COMMANDS_COMPLETE, 0);
			i.flush();
			let l = new Promise((e) => {
				let t = () => {
					if (this.disposed) e();
					else switch (i.clientWaitSync(c, 0, 0)) {
						case i.TIMEOUT_EXPIRED: return this.computeDistancesOnGPUSyncTimeout = setTimeout(t), this.computeDistancesOnGPUSyncTimeout;
						case i.WAIT_FAILED: throw Error("should never get here");
						default: {
							this.computeDistancesOnGPUSyncTimeout = null, i.deleteSync(c);
							let t = i.getParameter(i.VERTEX_ARRAY_BINDING);
							i.bindVertexArray(this.distancesTransformFeedback.vao), i.bindBuffer(i.ARRAY_BUFFER, this.distancesTransformFeedback.outDistancesBuffer), i.getBufferSubData(i.ARRAY_BUFFER, 0, r), i.bindBuffer(i.ARRAY_BUFFER, null), t && i.bindVertexArray(t), e();
						}
					}
				};
				this.computeDistancesOnGPUSyncTimeout = setTimeout(t);
			});
			return o && !0 !== s && i.useProgram(o), a && i.bindVertexArray(a), l;
		};
	}();
	getLocalSplatParameters(e, t, n) {
		n ??= !this.dynamicMode, t.splatBuffer = this.getSplatBufferForSplat(e), t.localIndex = this.getSplatLocalIndex(e), t.sceneTransform = n ? this.getSceneTransformForSplat(e) : null;
	}
	fillSplatDataArrays(e, t, n, i, a, o, s, c, l = 0, u = 0, d = 1, f, p, m = 0, h) {
		let g = new k();
		g.x = void 0, g.y = void 0, g.z = this.splatRenderMode === Me.ThreeD ? void 0 : 1;
		let _ = new r(), v = 0, y = this.scenes.length - 1;
		h != null && h >= 0 && h <= this.scenes.length && (v = h, y = h);
		for (let r = v; r <= y; r++) {
			c ??= !this.dynamicMode;
			let s = this.getScene(r), h = s.splatBuffer, v;
			if (c && (this.getSceneTransform(r, _), v = _), e && h.fillSplatCovarianceArray(e, v, f, p, m, l), t || n) {
				if (!t || !n) throw Error("SplatMesh::fillSplatDataArrays() -> \"scales\" and \"rotations\" must both be valid.");
				h.fillSplatScaleRotationArray(t, n, v, f, p, m, u, g);
			}
			i && h.fillSplatCenterArray(this.morphedMesh, i, v, f, p, m), a && h.fillSplatColorArray(a, s.minimumAlpha, f, p, m), o && h.fillSphericalHarmonicsArray(o, this.minSphericalHarmonicsDegree, v, f, p, m, d), m += h.getSplatCount();
		}
	}
	morphedMesh;
	getIntegerCenters(e, t, n = !1) {
		let r = t - e + 1, i = new Float32Array(3 * r), a;
		this.fillSplatDataArrays(null, null, null, i, null, null, void 0, void 0, void 0, void 0, e);
		let o = n ? 4 : 3;
		a = new Int32Array(r * o);
		for (let e = 0; e < r; e++) {
			for (let t = 0; t < 3; t++) a[e * o + t] = Math.round(1e3 * i[3 * e + t]);
			n && (a[e * o + 3] = 1e3);
		}
		return a;
	}
	getFloatCenters(e, t, n = !1) {
		let r = t - e + 1, i = new Float32Array(3 * r);
		if (this.fillSplatDataArrays(null, null, null, i, null, null, void 0, void 0, void 0, void 0, e), !n) return i;
		let a = new Float32Array(4 * r);
		for (let e = 0; e < r; e++) {
			for (let t = 0; t < 3; t++) a[4 * e + t] = i[3 * e + t];
			a[4 * e + 3] = 1;
		}
		return a;
	}
	getSplatCenter = function() {
		let e = {};
		return function(t, n, r, i) {
			this.getLocalSplatParameters(n, e, i), e.splatBuffer.getSplatCenter(t, e.localIndex, r, e.sceneTransform);
		};
	}();
	getSplatScaleAndRotation = function() {
		let e = {}, t = new k();
		return function(n, r, i, a) {
			this.getLocalSplatParameters(n, e, a), t.x = void 0, t.y = void 0, t.z = void 0, this.splatRenderMode === Me.TwoD && (t.z = 0), e.splatBuffer.getSplatScaleAndRotation(e.localIndex, r, i, e.sceneTransform, t);
		};
	}();
	getSplatColor = function() {
		let e = {};
		return function(t, n) {
			this.getLocalSplatParameters(t, e), e.splatBuffer.getSplatColor(e.localIndex, n);
		};
	}();
	getSceneTransform(e, t) {
		let n = this.getScene(e);
		n.updateTransform(this.dynamicMode), t.copy(n.transform);
	}
	getScene(e) {
		if (e < 0 || e >= this.scenes.length) throw Error("SplatMesh::getScene() -> Invalid scene index.");
		return this.scenes[e];
	}
	getSceneCount() {
		return this.scenes.length;
	}
	getSplatBufferForSplat(e) {
		return this.getScene(this.globalSplatIndexToSceneIndexMap[e]).splatBuffer;
	}
	getSceneIndexForSplat(e) {
		return this.globalSplatIndexToSceneIndexMap[e];
	}
	getSceneTransformForSplat(e) {
		return this.getScene(this.globalSplatIndexToSceneIndexMap[e]).transform;
	}
	getSplatLocalIndex(e) {
		return this.globalSplatIndexToLocalSplatIndexMap[e];
	}
	static getIntegerMatrixArray(e) {
		let t = e.elements, n = [];
		for (let e = 0; e < 16; e++) n[e] = Math.round(1e3 * t[e]);
		return n;
	}
	computeBoundingBox(e = !1, t) {
		let n = this.getSplatCount();
		if (t != null) {
			if (t < 0 || t >= this.scenes.length) throw Error("SplatMesh::computeBoundingBox() -> Invalid scene index.");
			n = this.scenes[t].splatBuffer.getSplatCount();
		}
		let r = new Float32Array(3 * n);
		this.fillSplatDataArrays(null, null, null, r, null, null, e, void 0, void 0, void 0, void 0, t);
		let i = new k(), a = new k();
		for (let e = 0; e < n; e++) {
			let t = 3 * e, n = r[t], o = r[t + 1], s = r[t + 2];
			(e === 0 || n < i.x) && (i.x = n), (e === 0 || o < i.y) && (i.y = o), (e === 0 || s < i.z) && (i.z = s), (e === 0 || n > a.x) && (a.x = n), (e === 0 || o > a.y) && (a.y = o), (e === 0 || s > a.z) && (a.z = s);
		}
		return new S(i, a);
	}
}, rr = class extends Error {
	constructor(e) {
		super(e), this.name = "DirectLoadError";
	}
}, X = class e {
	static OFFSET = {
		X: 0,
		Y: 1,
		Z: 2,
		SCALE0: 3,
		SCALE1: 4,
		SCALE2: 5,
		ROTATION0: 6,
		ROTATION1: 7,
		ROTATION2: 8,
		ROTATION3: 9,
		FDC0: 10,
		FDC1: 11,
		FDC2: 12,
		OPACITY: 13,
		FRC0: 14,
		FRC1: 15,
		FRC2: 16,
		FRC3: 17,
		FRC4: 18,
		FRC5: 19,
		FRC6: 20,
		FRC7: 21,
		FRC8: 22,
		FRC9: 23,
		FRC10: 24,
		FRC11: 25,
		FRC12: 26,
		FRC13: 27,
		FRC14: 28,
		FRC15: 29,
		FRC16: 30,
		FRC17: 31,
		FRC18: 32,
		FRC19: 33,
		FRC20: 34,
		FRC21: 35,
		FRC22: 36,
		FRC23: 37
	};
	constructor(e = 0) {
		this.sphericalHarmonicsDegree = e, this.sphericalHarmonicsCount = xt(this.sphericalHarmonicsDegree), this.componentCount = this.sphericalHarmonicsCount + 14, this.defaultSphericalHarmonics = Array(this.sphericalHarmonicsCount).fill(0), this.splats = [], this.splatCount = 0;
	}
	static createSplat(e = 0) {
		let t = [
			0,
			0,
			0,
			1,
			1,
			1,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		], n = xt(e);
		for (let e = 0; e < n; e++) t.push(0);
		return t;
	}
	addSplat(e) {
		this.splats.push(e), this.splatCount++;
	}
	getSplat(e) {
		return this.splats[e];
	}
	addDefaultSplat() {
		let t = e.createSplat(this.sphericalHarmonicsDegree);
		return this.addSplat(t), t;
	}
	addSplatFromComonents(e, t, n, r, i, a, o, s, c, l, u, d, f, p, ...m) {
		let h = [
			e,
			t,
			n,
			r,
			i,
			a,
			o,
			s,
			c,
			l,
			u,
			d,
			f,
			p,
			...this.defaultSphericalHarmonics
		];
		for (let e = 0; e < m.length && e < this.sphericalHarmonicsCount; e++) h[e] = m[e];
		return this.addSplat(h), h;
	}
	addSplatFromArray(t, n) {
		let r = t.splats[n], i = e.createSplat(this.sphericalHarmonicsDegree);
		for (let e = 0; e < this.componentCount && e < r.length; e++) i[e] = r[e];
		this.addSplat(i);
	}
}, ir = (e, t, n, r, i = 0) => {
	let a = new Uint8Array(e, t), o = new Uint8Array(n, r);
	for (let e = 0; e < i; e++) o[e] = a[e];
}, ar = O.toHalfFloat.bind(O), or = O.fromHalfFloat.bind(O), Z = (e, t, n = !1, r, i) => t === 0 ? e : t === 1 || t === 2 && !n ? O.fromHalfFloat(e) : t === 2 ? cr(e, r, i) : void 0, sr = (e, t, n) => {
	e = _t(e, t, n);
	let r = n - t;
	return _t(Math.floor((e - t) / r * 255), 0, 255);
}, cr = (e, t, n) => e / 255 * (n - t) + t, Q = (e, t, n, r = !1) => n === 0 ? e.getFloat32(4 * t, !0) : n === 1 || n === 2 && !r ? e.getUint16(2 * t, !0) : e.getUint8(t, !0), lr = class e {
	static CurrentMajorVersion = 0;
	static CurrentMinorVersion = 1;
	static CenterComponentCount = 3;
	static ScaleComponentCount = 3;
	static RotationComponentCount = 4;
	static ColorComponentCount = 4;
	static CovarianceComponentCount = 6;
	static SplatScaleOffsetFloat = 3;
	static SplatRotationOffsetFloat = 6;
	static CompressionLevels = {
		0: {
			BytesPerCenter: 12,
			BytesPerScale: 12,
			BytesPerRotation: 16,
			BytesPerColor: 4,
			ScaleOffsetBytes: 12,
			RotationffsetBytes: 24,
			ColorOffsetBytes: 40,
			SphericalHarmonicsOffsetBytes: 44,
			ScaleRange: 1,
			BytesPerSphericalHarmonicsComponent: 4,
			SphericalHarmonicsOffsetFloat: 11,
			SphericalHarmonicsDegrees: {
				0: { BytesPerSplat: 44 },
				1: { BytesPerSplat: 80 },
				2: { BytesPerSplat: 140 }
			}
		},
		1: {
			BytesPerCenter: 6,
			BytesPerScale: 6,
			BytesPerRotation: 8,
			BytesPerColor: 4,
			ScaleOffsetBytes: 6,
			RotationffsetBytes: 12,
			ColorOffsetBytes: 20,
			SphericalHarmonicsOffsetBytes: 24,
			ScaleRange: 32767,
			BytesPerSphericalHarmonicsComponent: 2,
			SphericalHarmonicsOffsetFloat: 12,
			SphericalHarmonicsDegrees: {
				0: { BytesPerSplat: 24 },
				1: { BytesPerSplat: 42 },
				2: { BytesPerSplat: 72 }
			}
		},
		2: {
			BytesPerCenter: 6,
			BytesPerScale: 6,
			BytesPerRotation: 8,
			BytesPerColor: 4,
			ScaleOffsetBytes: 6,
			RotationffsetBytes: 12,
			ColorOffsetBytes: 20,
			SphericalHarmonicsOffsetBytes: 24,
			ScaleRange: 32767,
			BytesPerSphericalHarmonicsComponent: 1,
			SphericalHarmonicsOffsetFloat: 12,
			SphericalHarmonicsDegrees: {
				0: { BytesPerSplat: 24 },
				1: { BytesPerSplat: 33 },
				2: { BytesPerSplat: 48 }
			}
		}
	};
	static CovarianceSizeFloats = 6;
	static HeaderSizeBytes = 4096;
	static SectionHeaderSizeBytes = 1024;
	static BucketStorageSizeBytes = 12;
	static BucketStorageSizeFloats = 3;
	static BucketBlockSize = 5;
	static BucketSize = 256;
	constructor(e, t = !0) {
		this.constructFromBuffer(e, t);
	}
	getSplatCount() {
		return this.splatCount;
	}
	getMaxSplatCount() {
		return this.maxSplatCount;
	}
	getMinSphericalHarmonicsDegree() {
		let e = 0;
		for (let t = 0; t < this.sections.length; t++) {
			let n = this.sections[t];
			(t === 0 || n.sphericalHarmonicsDegree < e) && (e = n.sphericalHarmonicsDegree);
		}
		return e;
	}
	getBucketIndex(e, t) {
		let n, r = e.fullBucketCount * e.bucketSize;
		if (t < r) n = Math.floor(t / e.bucketSize);
		else {
			let i = r;
			n = e.fullBucketCount;
			let a = 0;
			for (; i < e.splatCount;) {
				let r = e.partiallyFilledBucketLengths[a];
				if (t >= i && t < i + r) break;
				i += r, n++, a++;
			}
		}
		return n;
	}
	getSplatCenter(t, n, r, i) {
		let a = this.globalSplatIndexToSectionMap[n], o = this.sections[a], s = n - o.splatCountOffset, c = o.bytesPerSplat * s, l = new DataView(this.bufferData, o.dataBase + c), u = Q(l, 0, this.compressionLevel), d = Q(l, 1, this.compressionLevel), f = Q(l, 2, this.compressionLevel);
		if (this.compressionLevel >= 1) {
			let t = this.getBucketIndex(o, s) * e.BucketStorageSizeFloats, n = o.compressionScaleFactor, i = o.compressionScaleRange;
			r.x = (u - i) * n + o.bucketArray[t], r.y = (d - i) * n + o.bucketArray[t + 1], r.z = (f - i) * n + o.bucketArray[t + 2];
		} else r.x = u, r.y = d, r.z = f;
		r.x += t[3 * n + 0], r.y += t[3 * n + 1], r.z += t[3 * n + 2], i && r.applyMatrix4(i);
	}
	getSplatScaleAndRotation = function() {
		let t = new r(), n = new r(), i = new r(), a = new k(), o = new k(), s = new _();
		return function(r, c, l, u, d) {
			let f = this.globalSplatIndexToSectionMap[r], p = this.sections[f], m = r - p.splatCountOffset, h = p.bytesPerSplat * m + e.CompressionLevels[this.compressionLevel].ScaleOffsetBytes, g = new DataView(this.bufferData, p.dataBase + h);
			o.set(Z(Q(g, 0, this.compressionLevel), this.compressionLevel), Z(Q(g, 1, this.compressionLevel), this.compressionLevel), Z(Q(g, 2, this.compressionLevel), this.compressionLevel)), d && (d.x !== void 0 && (o.x = d.x), d.y !== void 0 && (o.y = d.y), d.z !== void 0 && (o.z = d.z)), s.set(Z(Q(g, 4, this.compressionLevel), this.compressionLevel), Z(Q(g, 5, this.compressionLevel), this.compressionLevel), Z(Q(g, 6, this.compressionLevel), this.compressionLevel), Z(Q(g, 3, this.compressionLevel), this.compressionLevel)), u ? (t.makeScale(o.x, o.y, o.z), n.makeRotationFromQuaternion(s), i.copy(t).multiply(n).multiply(u), i.decompose(a, l, c)) : (c.copy(o), l.copy(s));
		};
	}();
	getSplatColor(t, n) {
		let r = this.globalSplatIndexToSectionMap[t], i = this.sections[r], a = t - i.splatCountOffset, o = i.bytesPerSplat * a + e.CompressionLevels[this.compressionLevel].ColorOffsetBytes, s = new Uint8Array(this.bufferData, i.dataBase + o, 4);
		n.set(s[0], s[1], s[2], s[3]);
	}
	fillSplatCenterArray(t, n, r, i, a, o) {
		let s = this.splatCount;
		i ||= 0, a ||= s - 1, o === void 0 && (o = i);
		let c = new k();
		for (let s = i; s <= a; s++) {
			let a = this.globalSplatIndexToSectionMap[s], l = this.sections[a], u = s - l.splatCountOffset, d = (s - i + o) * e.CenterComponentCount, f = l.bytesPerSplat * u, p = new DataView(this.bufferData, l.dataBase + f), m = Q(p, 0, this.compressionLevel), h = Q(p, 1, this.compressionLevel), g = Q(p, 2, this.compressionLevel);
			if (this.compressionLevel >= 1) {
				let t = this.getBucketIndex(l, u) * e.BucketStorageSizeFloats, n = l.compressionScaleFactor, r = l.compressionScaleRange;
				c.x = (m - r) * n + l.bucketArray[t], c.y = (h - r) * n + l.bucketArray[t + 1], c.z = (g - r) * n + l.bucketArray[t + 2];
			} else c.x = m, c.y = h, c.z = g;
			r && c.applyMatrix4(r), n[d] = c.x + t[3 * s + 0], n[d + 1] = c.y + t[3 * s + 1], n[d + 2] = c.z + t[3 * s + 2];
		}
	}
	fillSplatScaleRotationArray = function() {
		let t = new r(), n = new r(), i = new r(), a = new k(), o = new _(), s = new k(), c = (e) => {
			let t = e.w < 0 ? -1 : 1;
			e.x *= t, e.y *= t, e.z *= t, e.w *= t;
		};
		return function(r, l, u, d, f, p, m, h) {
			let g = this.splatCount;
			d ||= 0, f ||= g - 1, p === void 0 && (p = d);
			let _ = (e, t) => It(e, t, m);
			for (let m = d; m <= f; m++) {
				let f = this.globalSplatIndexToSectionMap[m], g = this.sections[f], v = m - g.splatCountOffset, y = g.bytesPerSplat * v + e.CompressionLevels[this.compressionLevel].ScaleOffsetBytes, b = (m - d + p) * e.ScaleComponentCount, x = (m - d + p) * e.RotationComponentCount, S = new DataView(this.bufferData, g.dataBase + y), C = h && h.x !== void 0 ? h.x : Q(S, 0, this.compressionLevel), w = h && h.y !== void 0 ? h.y : Q(S, 1, this.compressionLevel), T = h && h.z !== void 0 ? h.z : Q(S, 2, this.compressionLevel), E = Q(S, 3, this.compressionLevel), D = Q(S, 4, this.compressionLevel), O = Q(S, 5, this.compressionLevel), k = Q(S, 6, this.compressionLevel);
				a.set(Z(C, this.compressionLevel), Z(w, this.compressionLevel), Z(T, this.compressionLevel)), o.set(Z(D, this.compressionLevel), Z(O, this.compressionLevel), Z(k, this.compressionLevel), Z(E, this.compressionLevel)).normalize(), u && (s.set(0, 0, 0), t.makeScale(a.x, a.y, a.z), n.makeRotationFromQuaternion(o), i.identity().premultiply(t).premultiply(n), i.premultiply(u), i.decompose(s, o, a), o.normalize()), c(o), r && (r[b] = _(a.x, 0), r[b + 1] = _(a.y, 0), r[b + 2] = _(a.z, 0)), l && (l[x] = _(o.x, 0), l[x + 1] = _(o.y, 0), l[x + 2] = _(o.z, 0), l[x + 3] = _(o.w, 0));
			}
		};
	}();
	static computeCovariance = function() {
		let e = new r(), t = new ie(), n = new ie(), i = new ie(), a = new ie(), o = new ie(), s = new ie();
		return function(r, c, l, u, d = 0, f) {
			e.makeScale(r.x, r.y, r.z), t.setFromMatrix4(e), e.makeRotationFromQuaternion(c), n.setFromMatrix4(e), i.copy(n).multiply(t), a.copy(i).transpose().premultiply(i), l && (o.setFromMatrix4(l), s.copy(o).transpose(), a.multiply(s), a.premultiply(o)), f >= 1 ? (u[d] = ar(a.elements[0]), u[d + 1] = ar(a.elements[3]), u[d + 2] = ar(a.elements[6]), u[d + 3] = ar(a.elements[4]), u[d + 4] = ar(a.elements[7]), u[d + 5] = ar(a.elements[8])) : (u[d] = a.elements[0], u[d + 1] = a.elements[3], u[d + 2] = a.elements[6], u[d + 3] = a.elements[4], u[d + 4] = a.elements[7], u[d + 5] = a.elements[8]);
		};
	}();
	fillSplatCovarianceArray(t, n, r, i, a, o) {
		let s = this.splatCount, c = new k(), l = new _();
		r ||= 0, i ||= s - 1, a === void 0 && (a = r);
		for (let s = r; s <= i; s++) {
			let i = this.globalSplatIndexToSectionMap[s], u = this.sections[i], d = s - u.splatCountOffset, f = (s - r + a) * e.CovarianceComponentCount, p = u.bytesPerSplat * d + e.CompressionLevels[this.compressionLevel].ScaleOffsetBytes, m = new DataView(this.bufferData, u.dataBase + p);
			c.set(Z(Q(m, 0, this.compressionLevel), this.compressionLevel), Z(Q(m, 1, this.compressionLevel), this.compressionLevel), Z(Q(m, 2, this.compressionLevel), this.compressionLevel)), l.set(Z(Q(m, 4, this.compressionLevel), this.compressionLevel), Z(Q(m, 5, this.compressionLevel), this.compressionLevel), Z(Q(m, 6, this.compressionLevel), this.compressionLevel), Z(Q(m, 3, this.compressionLevel), this.compressionLevel)), e.computeCovariance(c, l, n, t, f, o);
		}
	}
	fillSplatColorArray(t, n, r, i, a) {
		let o = this.splatCount;
		r ||= 0, i ||= o - 1, a === void 0 && (a = r);
		for (let o = r; o <= i; o++) {
			let i = this.globalSplatIndexToSectionMap[o], s = this.sections[i], c = o - s.splatCountOffset, l = (o - r + a) * e.ColorComponentCount, u = s.bytesPerSplat * c + e.CompressionLevels[this.compressionLevel].ColorOffsetBytes, d = new Uint8Array(this.bufferData, s.dataBase + u), f = d[3];
			f = f >= n ? f : 0, t[l] = d[0], t[l + 1] = d[1], t[l + 2] = d[2], t[l + 3] = f;
		}
	}
	fillSphericalHarmonicsArray = function() {
		for (let e = 0; e < 15; e++) new k();
		let t = new ie(), n = new r(), i = new k(), a = new k(), o = new _(), s = [], c = [], l = [], u = [], d = [], f = [], p = [], m = [], h = [], g = [], v = [], y = [], b = [], x = [], S = [], C = [], w = [], T = [], E = (e) => e, D = (e, t, n, r) => {
			e[0] = t, e[1] = n, e[2] = r;
		}, O = (e, t, n, r, i) => {
			e[0] = Q(t, r, i, !0), e[1] = Q(t, r + n, i, !0), e[2] = Q(t, r + n + n, i, !0);
		}, A = (e, t) => {
			t[0] = e[0], t[1] = e[1], t[2] = e[2];
		}, j = (e, t, n, r) => {
			t[n] = r(e[0]), t[n + 1] = r(e[1]), t[n + 2] = r(e[2]);
		}, M = (e, t, n, r, i) => (t[0] = Z(e[0], n, !0, r, i), t[1] = Z(e[1], n, !0, r, i), t[2] = Z(e[2], n, !0, r, i), t);
		return function(r, _, k, N, P, F, I) {
			let L = this.splatCount;
			N ||= 0, P ||= L - 1, F === void 0 && (F = N), k && _ >= 1 && (n.copy(k), n.decompose(i, o, a), o.normalize(), n.makeRotationFromQuaternion(o), t.setFromMatrix4(n), D(s, t.elements[4], -t.elements[7], t.elements[1]), D(c, -t.elements[5], t.elements[8], -t.elements[2]), D(l, t.elements[3], -t.elements[6], t.elements[0]));
			let R = (e) => ((e, t, n) => sr(or(e), t, n))(e, this.minSphericalHarmonicsCoeff, this.maxSphericalHarmonicsCoeff), z = (e) => sr(e, this.minSphericalHarmonicsCoeff, this.maxSphericalHarmonicsCoeff);
			for (let t = N; t <= P; t++) {
				let n = this.globalSplatIndexToSectionMap[t], i = this.sections[n];
				_ = Math.min(_, i.sphericalHarmonicsDegree);
				let a = xt(_), o = t - i.splatCountOffset, D = i.bytesPerSplat * o + e.CompressionLevels[this.compressionLevel].SphericalHarmonicsOffsetBytes, P = new DataView(this.bufferData, i.dataBase + D), L = (t - N + F) * a, B = k ? 0 : this.compressionLevel, V = E;
				B !== I && (B === 1 ? I === 0 ? V = or : I == 2 && (V = R) : B === 0 && (I === 1 ? V = ar : I == 2 && (V = z)));
				let H = this.minSphericalHarmonicsCoeff, U = this.maxSphericalHarmonicsCoeff;
				_ >= 1 && (O(h, P, 3, 0, this.compressionLevel), O(g, P, 3, 1, this.compressionLevel), O(v, P, 3, 2, this.compressionLevel), k ? (M(h, h, this.compressionLevel, H, U), M(g, g, this.compressionLevel, H, U), M(v, v, this.compressionLevel, H, U), e.rotateSphericalHarmonics3(h, g, v, s, c, l, x, S, C)) : (A(h, x), A(g, S), A(v, C)), j(x, r, L, V), j(S, r, L + 3, V), j(C, r, L + 6, V), _ >= 2 && (O(h, P, 5, 9, this.compressionLevel), O(g, P, 5, 10, this.compressionLevel), O(v, P, 5, 11, this.compressionLevel), O(y, P, 5, 12, this.compressionLevel), O(b, P, 5, 13, this.compressionLevel), k ? (M(h, h, this.compressionLevel, H, U), M(g, g, this.compressionLevel, H, U), M(v, v, this.compressionLevel, H, U), M(y, y, this.compressionLevel, H, U), M(b, b, this.compressionLevel, H, U), e.rotateSphericalHarmonics5(h, g, v, y, b, s, c, l, u, d, f, p, m, x, S, C, w, T)) : (A(h, x), A(g, S), A(v, C), A(y, w), A(b, T)), j(x, r, L + 9, V), j(S, r, L + 12, V), j(C, r, L + 15, V), j(w, r, L + 18, V), j(T, r, L + 21, V)));
			}
		};
	}();
	static dot3 = (t, n, r, i, a) => {
		a[0] = a[1] = a[2] = 0;
		let o = i[0], s = i[1], c = i[2];
		e.addInto3(t[0] * o, t[1] * o, t[2] * o, a), e.addInto3(n[0] * s, n[1] * s, n[2] * s, a), e.addInto3(r[0] * c, r[1] * c, r[2] * c, a);
	};
	static addInto3 = (e, t, n, r) => {
		r[0] += e, r[1] += t, r[2] += n;
	};
	static dot5 = (t, n, r, i, a, o, s) => {
		s[0] = s[1] = s[2] = 0;
		let c = o[0], l = o[1], u = o[2], d = o[3], f = o[4];
		e.addInto3(t[0] * c, t[1] * c, t[2] * c, s), e.addInto3(n[0] * l, n[1] * l, n[2] * l, s), e.addInto3(r[0] * u, r[1] * u, r[2] * u, s), e.addInto3(i[0] * d, i[1] * d, i[2] * d, s), e.addInto3(a[0] * f, a[1] * f, a[2] * f, s);
	};
	static rotateSphericalHarmonics3 = (t, n, r, i, a, o, s, c, l) => {
		e.dot3(t, n, r, i, s), e.dot3(t, n, r, a, c), e.dot3(t, n, r, o, l);
	};
	static rotateSphericalHarmonics5 = (t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v) => {
		let y = Math.sqrt(1 / 4), b = Math.sqrt(3 / 4), x = Math.sqrt(1 / 3), S = Math.sqrt(4 / 3), C = Math.sqrt(1 / 12);
		l[0] = y * (c[2] * o[0] + c[0] * o[2] + (o[2] * c[0] + o[0] * c[2])), l[1] = c[1] * o[0] + o[1] * c[0], l[2] = b * (c[1] * o[1] + o[1] * c[1]), l[3] = c[1] * o[2] + o[1] * c[2], l[4] = y * (c[2] * o[2] - c[0] * o[0] + (o[2] * c[2] - o[0] * c[0])), e.dot5(t, n, r, i, a, l, m), u[0] = y * (s[2] * o[0] + s[0] * o[2] + (o[2] * s[0] + o[0] * s[2])), u[1] = s[1] * o[0] + o[1] * s[0], u[2] = b * (s[1] * o[1] + o[1] * s[1]), u[3] = s[1] * o[2] + o[1] * s[2], u[4] = y * (s[2] * o[2] - s[0] * o[0] + (o[2] * s[2] - o[0] * s[0])), e.dot5(t, n, r, i, a, u, h), d[0] = x * (s[2] * s[0] + s[0] * s[2]) + -C * (c[2] * c[0] + c[0] * c[2] + (o[2] * o[0] + o[0] * o[2])), d[1] = S * s[1] * s[0] + -x * (c[1] * c[0] + o[1] * o[0]), d[2] = s[1] * s[1] + -y * (c[1] * c[1] + o[1] * o[1]), d[3] = S * s[1] * s[2] + -x * (c[1] * c[2] + o[1] * o[2]), d[4] = x * (s[2] * s[2] - s[0] * s[0]) + -C * (c[2] * c[2] - c[0] * c[0] + (o[2] * o[2] - o[0] * o[0])), e.dot5(t, n, r, i, a, d, g), f[0] = y * (s[2] * c[0] + s[0] * c[2] + (c[2] * s[0] + c[0] * s[2])), f[1] = s[1] * c[0] + c[1] * s[0], f[2] = b * (s[1] * c[1] + c[1] * s[1]), f[3] = s[1] * c[2] + c[1] * s[2], f[4] = y * (s[2] * c[2] - s[0] * c[0] + (c[2] * s[2] - c[0] * s[0])), e.dot5(t, n, r, i, a, f, _), p[0] = y * (c[2] * c[0] + c[0] * c[2] - (o[2] * o[0] + o[0] * o[2])), p[1] = c[1] * c[0] - o[1] * o[0], p[2] = b * (c[1] * c[1] - o[1] * o[1]), p[3] = c[1] * c[2] - o[1] * o[2], p[4] = y * (c[2] * c[2] - c[0] * c[0] - (o[2] * o[2] - o[0] * o[0])), e.dot5(t, n, r, i, a, p, v);
	};
	static parseHeader(t) {
		let n = new Uint8Array(t, 0, e.HeaderSizeBytes), r = new Uint16Array(t, 0, e.HeaderSizeBytes / 2), i = new Uint32Array(t, 0, e.HeaderSizeBytes / 4), a = new Float32Array(t, 0, e.HeaderSizeBytes / 4);
		return {
			versionMajor: n[0],
			versionMinor: n[1],
			maxSectionCount: i[1],
			sectionCount: i[2],
			maxSplatCount: i[3],
			splatCount: i[4],
			compressionLevel: r[10],
			sceneCenter: new k(a[6], a[7], a[8]),
			minSphericalHarmonicsCoeff: a[9] || -kt,
			maxSphericalHarmonicsCoeff: a[10] || kt
		};
	}
	static writeHeaderCountsToBuffer(t, n, r) {
		let i = new Uint32Array(r, 0, e.HeaderSizeBytes / 4);
		i[2] = t, i[4] = n;
	}
	static writeHeaderToBuffer(t, n) {
		let r = new Uint8Array(n, 0, e.HeaderSizeBytes), i = new Uint16Array(n, 0, e.HeaderSizeBytes / 2), a = new Uint32Array(n, 0, e.HeaderSizeBytes / 4), o = new Float32Array(n, 0, e.HeaderSizeBytes / 4);
		r[0] = t.versionMajor, r[1] = t.versionMinor, r[2] = 0, r[3] = 0, a[1] = t.maxSectionCount, a[2] = t.sectionCount, a[3] = t.maxSplatCount, a[4] = t.splatCount, i[10] = t.compressionLevel, o[6] = t.sceneCenter.x, o[7] = t.sceneCenter.y, o[8] = t.sceneCenter.z, o[9] = t.minSphericalHarmonicsCoeff || -kt, o[10] = t.maxSphericalHarmonicsCoeff || kt;
	}
	static parseSectionHeaders(t, n, r = 0, i) {
		let a = t.compressionLevel, o = t.maxSectionCount, s = new Uint16Array(n, r, o * e.SectionHeaderSizeBytes / 2), c = new Uint32Array(n, r, o * e.SectionHeaderSizeBytes / 4), l = new Float32Array(n, r, o * e.SectionHeaderSizeBytes / 4), u = [], d = 0, f = d / 2, p = d / 4, m = e.HeaderSizeBytes + t.maxSectionCount * e.SectionHeaderSizeBytes, h = 0;
		for (let t = 0; t < o; t++) {
			let n = c[p + 1], r = c[p + 2], o = c[p + 3], g = l[p + 4], _ = g / 2, v = s[f + 10], y = c[p + 6] || e.CompressionLevels[a].ScaleRange, b = c[p + 8], x = c[p + 9], S = 4 * x, C = v * o + S, w = s[f + 20], { bytesPerSplat: T } = e.calculateComponentStorage(a, w), E = T * n, D = E + C, O = {
				bytesPerSplat: T,
				splatCountOffset: h,
				splatCount: i ? n : 0,
				maxSplatCount: n,
				bucketSize: r,
				bucketCount: o,
				bucketBlockSize: g,
				halfBucketBlockSize: _,
				bucketStorageSizeBytes: v,
				bucketsStorageSizeBytes: C,
				splatDataStorageSizeBytes: E,
				storageSizeBytes: D,
				compressionScaleRange: y,
				compressionScaleFactor: _ / y,
				base: m,
				bucketsBase: m + S,
				dataBase: m + C,
				fullBucketCount: b,
				partiallyFilledBucketCount: x,
				sphericalHarmonicsDegree: w
			};
			u[t] = O, m += D, d += e.SectionHeaderSizeBytes, f = d / 2, p = d / 4, h += n;
		}
		return u;
	}
	static writeSectionHeaderToBuffer(t, n, r, i = 0) {
		let a = new Uint16Array(r, i, e.SectionHeaderSizeBytes / 2), o = new Uint32Array(r, i, e.SectionHeaderSizeBytes / 4), s = new Float32Array(r, i, e.SectionHeaderSizeBytes / 4);
		o[0] = t.splatCount, o[1] = t.maxSplatCount, o[2] = n >= 1 ? t.bucketSize : 0, o[3] = n >= 1 ? t.bucketCount : 0, s[4] = n >= 1 ? t.bucketBlockSize : 0, a[10] = n >= 1 ? e.BucketStorageSizeBytes : 0, o[6] = n >= 1 ? t.compressionScaleRange : 0, o[7] = t.storageSizeBytes, o[8] = n >= 1 ? t.fullBucketCount : 0, o[9] = n >= 1 ? t.partiallyFilledBucketCount : 0, a[20] = t.sphericalHarmonicsDegree;
	}
	static writeSectionHeaderSplatCountToBuffer(t, n, r = 0) {
		new Uint32Array(n, r, e.SectionHeaderSizeBytes / 4)[0] = t;
	}
	constructFromBuffer(t, n) {
		this.bufferData = t, this.globalSplatIndexToLocalSplatIndexMap = [], this.globalSplatIndexToSectionMap = [];
		let r = e.parseHeader(this.bufferData);
		this.versionMajor = r.versionMajor, this.versionMinor = r.versionMinor, this.maxSectionCount = r.maxSectionCount, this.sectionCount = n ? r.maxSectionCount : 0, this.maxSplatCount = r.maxSplatCount, this.splatCount = n ? r.maxSplatCount : 0, this.compressionLevel = r.compressionLevel, this.sceneCenter = new k().copy(r.sceneCenter), this.minSphericalHarmonicsCoeff = r.minSphericalHarmonicsCoeff, this.maxSphericalHarmonicsCoeff = r.maxSphericalHarmonicsCoeff, this.sections = e.parseSectionHeaders(r, this.bufferData, e.HeaderSizeBytes, n), this.linkBufferArrays(), this.buildMaps();
	}
	static calculateComponentStorage(t, n) {
		let r = e.CompressionLevels[t].BytesPerCenter, i = e.CompressionLevels[t].BytesPerScale, a = e.CompressionLevels[t].BytesPerRotation, o = e.CompressionLevels[t].BytesPerColor, s = xt(n), c = e.CompressionLevels[t].BytesPerSphericalHarmonicsComponent * s;
		return {
			bytesPerCenter: r,
			bytesPerScale: i,
			bytesPerRotation: a,
			bytesPerColor: o,
			sphericalHarmonicsComponentsPerSplat: s,
			sphericalHarmonicsBytesPerSplat: c,
			bytesPerSplat: r + i + a + o + c
		};
	}
	linkBufferArrays() {
		for (let t = 0; t < this.maxSectionCount; t++) {
			let n = this.sections[t];
			n.bucketArray = new Float32Array(this.bufferData, n.bucketsBase, n.bucketCount * e.BucketStorageSizeFloats), n.partiallyFilledBucketCount > 0 && (n.partiallyFilledBucketLengths = new Uint32Array(this.bufferData, n.base, n.partiallyFilledBucketCount));
		}
	}
	buildMaps() {
		let e = 0;
		for (let t = 0; t < this.maxSectionCount; t++) {
			let n = this.sections[t];
			for (let r = 0; r < n.maxSplatCount; r++) {
				let n = e + r;
				this.globalSplatIndexToLocalSplatIndexMap[n] = r, this.globalSplatIndexToSectionMap[n] = t;
			}
			e += n.maxSplatCount;
		}
	}
	updateLoadedCounts(t, n) {
		e.writeHeaderCountsToBuffer(t, n, this.bufferData), this.sectionCount = t, this.splatCount = n;
	}
	updateSectionLoadedCounts(t, n) {
		let r = e.HeaderSizeBytes + e.SectionHeaderSizeBytes * t;
		e.writeSectionHeaderSplatCountToBuffer(n, this.bufferData, r), this.sections[t].splatCount = n;
	}
	static writeSplatDataToSectionBuffer = function() {
		let t = /* @__PURE__ */ new ArrayBuffer(12), n = /* @__PURE__ */ new ArrayBuffer(12), r = /* @__PURE__ */ new ArrayBuffer(16), i = /* @__PURE__ */ new ArrayBuffer(4), a = /* @__PURE__ */ new ArrayBuffer(256), o = new _(), s = new k(), c = new k(), { X: l, Y: u, Z: d, SCALE0: f, SCALE1: p, SCALE2: m, ROTATION0: h, ROTATION1: g, ROTATION2: v, ROTATION3: y, FDC0: b, FDC1: x, FDC2: S, OPACITY: C, FRC0: w, FRC9: T } = X.OFFSET, E = (e, t, n) => {
			let r = 2 * n + 1;
			return e = Math.round(e * t) + n, _t(e, 0, r);
		};
		return function(_, D, O, k, A, j, M, N, P = -kt, F = kt) {
			let I = xt(A), L = O, R = L + e.CompressionLevels[k].BytesPerCenter, z = R + e.CompressionLevels[k].BytesPerScale, B = z + e.CompressionLevels[k].BytesPerRotation, V = B + e.CompressionLevels[k].BytesPerColor;
			if (_[h] === void 0 ? o.set(1, 0, 0, 0) : (o.set(_[h], _[g], _[v], _[y]), o.normalize()), _[f] === void 0 ? s.set(0, 0, 0) : s.set(_[f] || 0, _[p] || 0, _[m] || 0), k === 0) {
				let t = new Float32Array(D, L, e.CenterComponentCount), n = new Float32Array(D, z, e.RotationComponentCount), r = new Float32Array(D, R, e.ScaleComponentCount);
				if (n.set([
					o.x,
					o.y,
					o.z,
					o.w
				]), r.set([
					s.x,
					s.y,
					s.z
				]), t.set([
					_[l],
					_[u],
					_[d]
				]), A > 0) {
					let e = new Float32Array(D, V, I);
					if (A >= 1) {
						for (let t = 0; t < 9; t++) e[t] = _[w + t] || 0;
						if (A >= 2) for (let t = 0; t < 15; t++) e[t + 9] = _[T + t] || 0;
					}
				}
			} else {
				let i = new Uint16Array(t, 0, e.CenterComponentCount), f = new Uint16Array(r, 0, e.RotationComponentCount), p = new Uint16Array(n, 0, e.ScaleComponentCount);
				if (f.set([
					ar(o.x),
					ar(o.y),
					ar(o.z),
					ar(o.w)
				]), p.set([
					ar(s.x),
					ar(s.y),
					ar(s.z)
				]), c.set(_[l], _[u], _[d]).sub(j), c.x = E(c.x, M, N), c.y = E(c.y, M, N), c.z = E(c.z, M, N), i.set([
					c.x,
					c.y,
					c.z
				]), A > 0) {
					let e = k === 1 ? 2 : 1, t = new (k === 1 ? Uint16Array : Uint8Array)(a, 0, I);
					if (A >= 1) {
						for (let e = 0; e < 9; e++) {
							let n = _[w + e] || 0;
							t[e] = k === 1 ? ar(n) : sr(n, P, F);
						}
						let n = 9 * e;
						if (ir(t.buffer, 0, D, V, n), A >= 2) {
							for (let e = 0; e < 15; e++) {
								let n = _[T + e] || 0;
								t[e + 9] = k === 1 ? ar(n) : sr(n, P, F);
							}
							ir(t.buffer, n, D, V + n, 15 * e);
						}
					}
				}
				ir(i.buffer, 0, D, L, 6), ir(p.buffer, 0, D, R, 6), ir(f.buffer, 0, D, z, 8);
			}
			let H = new Uint8ClampedArray(i, 0, 4);
			H.set([
				_[b] || 0,
				_[x] || 0,
				_[S] || 0
			]), H[3] = _[C] || 0, ir(H.buffer, 0, D, B, 4);
		};
	}();
	static generateFromUncompressedSplatArrays(t, n, r, i, a, o, s = []) {
		let c, l, u = 0;
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			u = Math.max(n.sphericalHarmonicsDegree, u);
		}
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			for (let e = 0; e < n.splats.length; e++) {
				let t = n.splats[e];
				for (let e = X.OFFSET.FRC0; e < X.OFFSET.FRC23 && e < t.length; e++) (!c || t[e] < c) && (c = t[e]), (!l || t[e] > l) && (l = t[e]);
			}
		}
		c ||= -kt, l ||= kt;
		let { bytesPerSplat: d } = e.calculateComponentStorage(r, u), f = e.CompressionLevels[r].ScaleRange, p = [], m = [], h = 0;
		for (let i = 0; i < t.length; i++) {
			let g = t[i], _ = new X(u);
			for (let e = 0; e < g.splatCount; e++) {
				let t = g.splats[e];
				(t[X.OFFSET.OPACITY] || 0) >= n && _.addSplat(t);
			}
			let v = s[i] || {}, y = (v.blockSizeFactor || 1) * (a || e.BucketBlockSize), b = Math.ceil((v.bucketSizeFactor || 1) * (o || e.BucketSize)), x = e.computeBucketsForUncompressedSplatArray(_, y, b), S = x.fullBuckets.length, C = x.partiallyFullBuckets.map((e) => e.splats.length), w = C.length, T = [...x.fullBuckets, ...x.partiallyFullBuckets], E = _.splats.length * d, D = 4 * w, O = r >= 1 ? T.length * e.BucketStorageSizeBytes + D : 0, A = E + O, j = new ArrayBuffer(A), M = f / (.5 * y), N = new k(), P = 0;
			for (let t = 0; t < T.length; t++) {
				let n = T[t];
				N.fromArray(n.center);
				for (let t = 0; t < n.splats.length; t++) {
					let i = n.splats[t], a = _.splats[i], o = O + P * d;
					e.writeSplatDataToSectionBuffer(a, j, o, r, u, N, M, f, c, l), P++;
				}
			}
			if (h += P, r >= 1) {
				let t = new Uint32Array(j, 0, 4 * C.length);
				for (let e = 0; e < C.length; e++) t[e] = C[e];
				let n = new Float32Array(j, D, T.length * e.BucketStorageSizeFloats);
				for (let e = 0; e < T.length; e++) {
					let t = T[e], r = 3 * e;
					n[r] = t.center[0], n[r + 1] = t.center[1], n[r + 2] = t.center[2];
				}
			}
			p.push(j);
			let F = new ArrayBuffer(e.SectionHeaderSizeBytes);
			e.writeSectionHeaderToBuffer({
				maxSplatCount: P,
				splatCount: P,
				bucketSize: b,
				bucketCount: T.length,
				bucketBlockSize: y,
				compressionScaleRange: f,
				storageSizeBytes: A,
				fullBucketCount: S,
				partiallyFilledBucketCount: w,
				sphericalHarmonicsDegree: u
			}, r, F, 0), m.push(F);
		}
		let g = 0;
		for (let e of p) g += e.byteLength;
		let _ = e.HeaderSizeBytes + e.SectionHeaderSizeBytes * p.length + g, v = new ArrayBuffer(_);
		e.writeHeaderToBuffer({
			versionMajor: 0,
			versionMinor: 1,
			maxSectionCount: p.length,
			sectionCount: p.length,
			maxSplatCount: h,
			splatCount: h,
			compressionLevel: r,
			sceneCenter: i,
			minSphericalHarmonicsCoeff: c,
			maxSphericalHarmonicsCoeff: l
		}, v);
		let y = e.HeaderSizeBytes;
		for (let t of m) new Uint8Array(v, y, e.SectionHeaderSizeBytes).set(new Uint8Array(t)), y += e.SectionHeaderSizeBytes;
		for (let e of p) new Uint8Array(v, y, e.byteLength).set(new Uint8Array(e)), y += e.byteLength;
		return new e(v);
	}
	static computeBucketsForUncompressedSplatArray(e, t, n) {
		let r = e.splatCount, i = t / 2, a = new k(), o = new k();
		for (let t = 0; t < r; t++) {
			let n = e.splats[t], r = [
				n[X.OFFSET.X],
				n[X.OFFSET.Y],
				n[X.OFFSET.Z]
			];
			(t === 0 || r[0] < a.x) && (a.x = r[0]), (t === 0 || r[0] > o.x) && (o.x = r[0]), (t === 0 || r[1] < a.y) && (a.y = r[1]), (t === 0 || r[1] > o.y) && (o.y = r[1]), (t === 0 || r[2] < a.z) && (a.z = r[2]), (t === 0 || r[2] > o.z) && (o.z = r[2]);
		}
		let s = new k().copy(o).sub(a), c = Math.ceil(s.y / t), l = Math.ceil(s.z / t), u = new k(), d = [], f = {};
		for (let o = 0; o < r; o++) {
			let r = e.splats[o], s = [
				r[X.OFFSET.X],
				r[X.OFFSET.Y],
				r[X.OFFSET.Z]
			], p = Math.floor((s[0] - a.x) / t), m = Math.floor((s[1] - a.y) / t), h = Math.floor((s[2] - a.z) / t);
			u.x = p * t + a.x + i, u.y = m * t + a.y + i, u.z = h * t + a.z + i;
			let g = c * l * p + m * l + h, _ = f[g];
			_ || (f[g] = _ = {
				splats: [],
				center: u.toArray()
			}), _.splats.push(o), _.splats.length >= n && (d.push(_), f[g] = null);
		}
		let p = [];
		for (let e in f) if (Object.hasOwn(f, e)) {
			let t = f[e];
			t && p.push(t);
		}
		return {
			fullBuckets: d,
			partiallyFullBuckets: p
		};
	}
}, ur = class e {
	constructor(e, t, n, r) {
		this.sectionCount = e, this.sectionFilters = t, this.groupingParameters = n, this.partitionGenerator = r;
	}
	partitionUncompressedSplatArray(e) {
		let t, n, r;
		if (this.partitionGenerator) {
			let i = this.partitionGenerator(e);
			t = i.groupingParameters, n = i.sectionCount, r = i.sectionFilters;
		} else t = this.groupingParameters, n = this.sectionCount, r = this.sectionFilters;
		let i = [];
		for (let t = 0; t < n; t++) {
			let n = new X(e.sphericalHarmonicsDegree), a = r[t];
			for (let t = 0; t < e.splatCount; t++) a(t) && n.addSplat(e.splats[t]);
			i.push(n);
		}
		return {
			splatArrays: i,
			parameters: t
		};
	}
	static getStandardPartitioner(t = 0, n = new k(), r = lr.BucketBlockSize, i = lr.BucketSize) {
		return new e(void 0, void 0, void 0, (e) => {
			let a = X.OFFSET.X, o = X.OFFSET.Y, s = X.OFFSET.Z;
			t <= 0 && (t = e.splatCount);
			let c = new k(), l = .5;
			e.splats.forEach((e) => {
				var t;
				c.set(e[a], e[o], e[s]).sub(n), (t = c).x = Math.floor(t.x / l) * l, t.y = Math.floor(t.y / l) * l, t.z = Math.floor(t.z / l) * l, e.centerDist = c.lengthSq();
			}), e.splats.sort((e, t) => e.centerDist > t.centerDist ? 1 : -1);
			let u = [], d = [];
			t = Math.min(e.splatCount, t);
			let f = Math.ceil(e.splatCount / t), p = 0;
			for (let e = 0; e < f; e++) {
				let e = p;
				u.push((n) => n >= e && n < e + t), d.push({
					blocksSize: r,
					bucketSize: i
				}), p += t;
			}
			return {
				sectionCount: u.length,
				sectionFilters: u,
				groupingParameters: d
			};
		});
	}
}, dr = class e {
	constructor(e, t, n, r, i, a, o) {
		this.splatPartitioner = e, this.alphaRemovalThreshold = t, this.compressionLevel = n, this.sectionSize = r, this.sceneCenter = i ? new k().copy(i) : void 0, this.blockSize = a, this.bucketSize = o;
	}
	generateFromUncompressedSplatArray(e) {
		let t = this.splatPartitioner.partitionUncompressedSplatArray(e);
		return lr.generateFromUncompressedSplatArrays(t.splatArrays, this.alphaRemovalThreshold, this.compressionLevel, this.sceneCenter, this.blockSize, this.bucketSize, t.parameters);
	}
	static getStandardGenerator(t = 1, n = 1, r = 0, i = new k(), a = lr.BucketBlockSize, o = lr.BucketSize) {
		let s = ur.getStandardPartitioner(r, i, a, o);
		return new e(s, t, n, r, i, a, o);
	}
}, fr = { INRIAV1: 0 }, pr = 0, mr = 1, hr = 2, gr = 3, _r = 4, vr = 5, yr = 6, br = {
	double: 0,
	int: 1,
	uint: 2,
	float: 3,
	short: 4,
	ushort: 5,
	uchar: 6
}, xr = {
	[pr]: 8,
	[mr]: 4,
	[hr]: 4,
	[gr]: 4,
	[_r]: 2,
	[vr]: 2,
	[yr]: 1
}, Sr = class e {
	static HeaderEndToken = "end_header";
	constructor() {}
	decodeSectionHeader(t, n, r = 0) {
		let i = [], a = !1, o = -1, s = 0, c = !1, l = null, u = [], d = [], f = [], p = {};
		for (let m = r; m < t.length; m++) {
			let h = t[m].trim();
			if (h.startsWith("element")) {
				if (a) {
					o--;
					break;
				}
				{
					a = !0, r = m, o = m;
					let e = h.split(" "), t = 0;
					for (let n of e) {
						let e = n.trim();
						e.length > 0 && (t++, t === 2 ? l = e : t === 3 && (s = parseInt(e)));
					}
				}
			} else if (h.startsWith("property")) {
				let e = h.match(/(\w+)\s+(\w+)\s+(\w+)/);
				if (e) {
					let t = e[2], r = e[3];
					f.push(r);
					let i = n[r];
					p[r] = t;
					let a = br[t];
					i !== void 0 && (u.push(i), d[i] = a);
				}
			}
			if (h === e.HeaderEndToken) {
				c = !0;
				break;
			}
			a && (i.push(h), o++);
		}
		let m = [], h = 0;
		for (let e of f) {
			let t = p[e];
			if (Object.hasOwn(p, e)) {
				let t = n[e];
				t !== void 0 && (m[t] = h);
			}
			h += xr[br[t]];
		}
		let g = this.decodeSphericalHarmonicsFromSectionHeader(f, n);
		return {
			headerLines: i,
			headerStartLine: r,
			headerEndLine: o,
			fieldTypes: d,
			fieldIds: u,
			fieldOffsets: m,
			bytesPerVertex: h,
			vertexCount: s,
			dataSizeBytes: h * s,
			endOfHeader: c,
			sectionName: l,
			sphericalHarmonicsDegree: g.degree,
			sphericalHarmonicsCoefficientsPerChannel: g.coefficientsPerChannel,
			sphericalHarmonicsDegree1Fields: g.degree1Fields,
			sphericalHarmonicsDegree2Fields: g.degree2Fields
		};
	}
	decodeSphericalHarmonicsFromSectionHeader(e, t) {
		let n = 0, r = 0;
		for (let t of e) t.startsWith("f_rest") && n++;
		r = n / 3;
		let i = 0;
		r >= 3 && (i = 1), r >= 8 && (i = 2);
		let a = [], o = [];
		for (let e = 0; e < 3; e++) {
			if (i >= 1) for (let n = 0; n < 3; n++) a.push(t["f_rest_" + (n + r * e)]);
			if (i >= 2) for (let n = 0; n < 5; n++) o.push(t["f_rest_" + (n + r * e + 3)]);
		}
		return {
			degree: i,
			coefficientsPerChannel: r,
			degree1Fields: a,
			degree2Fields: o
		};
	}
	static getHeaderSectionNames(e) {
		let t = [];
		for (let n of e) if (n.startsWith("element")) {
			let e = n.split(" "), r = 0;
			for (let n of e) {
				let e = n.trim();
				e.length > 0 && (r++, r === 2 && t.push(e));
			}
		}
		return t;
	}
	static checkTextForEndHeader(t) {
		return !!t.includes(e.HeaderEndToken);
	}
	static checkBufferForEndHeader(t, n, r, i) {
		let a = new Uint8Array(t, Math.max(0, n - r), r), o = i.decode(a);
		return e.checkTextForEndHeader(o);
	}
	static extractHeaderFromBufferToText(t) {
		let n = new TextDecoder(), r = 0, i = "";
		for (;;) {
			if (r + 100 >= t.byteLength) throw Error("End of file reached while searching for end of header");
			let a = new Uint8Array(t, r, 100);
			if (i += n.decode(a), r += 100, e.checkBufferForEndHeader(t, r, 200, n)) break;
		}
		return i;
	}
	readHeaderFromBuffer(t) {
		let n = new TextDecoder(), r = 0, i = "";
		for (;;) {
			if (r + 100 >= t.byteLength) throw Error("End of file reached while searching for end of header");
			let a = new Uint8Array(t, r, 100);
			if (i += n.decode(a), r += 100, e.checkBufferForEndHeader(t, r, 200, n)) break;
		}
		return i;
	}
	static convertHeaderTextToLines(t) {
		let n = t.split("\n"), r = [];
		for (let t = 0; t < n.length; t++) {
			let i = n[t].trim();
			if (r.push(i), i === e.HeaderEndToken) break;
		}
		return r;
	}
	static determineHeaderFormatFromHeaderText(e) {
		return fr.INRIAV1;
	}
	static determineHeaderFormatFromPlyBuffer(t) {
		let n = e.extractHeaderFromBufferToText(t);
		return e.determineHeaderFormatFromHeaderText(n);
	}
	static readVertex(e, t, n, r, i, a, o = !0) {
		let s = n * t.bytesPerVertex + r, c = t.fieldOffsets, l = t.fieldTypes;
		for (let t of i) {
			let n = l[t];
			n === 3 ? a[t] = e.getFloat32(s + c[t], !0) : n === 4 ? a[t] = e.getInt16(s + c[t], !0) : n === 5 ? a[t] = e.getUint16(s + c[t], !0) : n === 1 ? a[t] = e.getInt32(s + c[t], !0) : n === 2 ? a[t] = e.getUint32(s + c[t], !0) : n === 6 && (a[t] = o ? e.getUint8(s + c[t]) / 255 : e.getUint8(s + c[t]));
		}
	}
}, Cr = [
	"scale_0",
	"scale_1",
	"scale_2",
	"rot_0",
	"rot_1",
	"rot_2",
	"rot_3",
	"x",
	"y",
	"z",
	"f_dc_0",
	"f_dc_1",
	"f_dc_2",
	"opacity",
	"red",
	"green",
	"blue",
	"f_rest_0"
], [wr, Tr, Er, Dr, Or, kr, Ar, jr, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br, Vr] = Cr.map((e, t) => t), Hr = class e {
	constructor() {
		this.plyParserutils = new Sr();
	}
	decodeHeaderLines(e) {
		let t = 0;
		e.forEach((e) => {
			e.includes("f_rest_") && t++;
		});
		let n = 0;
		t >= 45 ? n = 45 : t >= 24 ? n = 24 : t >= 9 && (n = 9);
		let r = Array.from(Array(Math.max(n - 1, 0))).map((e, t) => `f_rest_${t + 1}`), i = [...Cr, ...r], a = i.map((e, t) => t), o = a.reduce((e, t) => (e[i[t]] = t, e), {}), s = this.plyParserutils.decodeSectionHeader(e, o, 0);
		return s.splatCount = s.vertexCount, s.bytesPerSplat = s.bytesPerVertex, s.fieldsToReadIndexes = a, s;
	}
	decodeHeaderText(e) {
		let t = Sr.convertHeaderTextToLines(e), n = this.decodeHeaderLines(t);
		return n.headerText = e, n.headerSizeBytes = e.indexOf(Sr.HeaderEndToken) + Sr.HeaderEndToken.length + 1, n;
	}
	decodeHeaderFromBuffer(e) {
		let t = this.plyParserutils.readHeaderFromBuffer(e);
		return this.decodeHeaderText(t);
	}
	findSplatData(e, t) {
		return new DataView(e, t.headerSizeBytes);
	}
	parseToUncompressedSplatBufferSection(t, n, r, i, a, o, s, c = 0) {
		c = Math.min(c, t.sphericalHarmonicsDegree);
		let l = lr.CompressionLevels[0].SphericalHarmonicsDegrees[c].BytesPerSplat;
		for (let u = n; u <= r; u++) {
			let n = e.parseToUncompressedSplat(i, u, t, a, c), r = u * l + s;
			lr.writeSplatDataToSectionBuffer(n, o, r, 0, c);
		}
	}
	parseToUncompressedSplatArraySection(t, n, r, i, a, o, s = 0) {
		s = Math.min(s, t.sphericalHarmonicsDegree);
		for (let c = n; c <= r; c++) {
			let n = e.parseToUncompressedSplat(i, c, t, a, s);
			o.addSplat(n);
		}
	}
	decodeSectionSplatData(t, n, r, i) {
		i = Math.min(i, r.sphericalHarmonicsDegree);
		let a = new X(i);
		for (let o = 0; o < n; o++) {
			let n = e.parseToUncompressedSplat(t, o, r, 0, i);
			a.addSplat(n);
		}
		return a;
	}
	static parseToUncompressedSplat = function() {
		let t = [], n = new _(), r = X.OFFSET.X, i = X.OFFSET.Y, a = X.OFFSET.Z, o = X.OFFSET.SCALE0, s = X.OFFSET.SCALE1, c = X.OFFSET.SCALE2, l = X.OFFSET.ROTATION0, u = X.OFFSET.ROTATION1, d = X.OFFSET.ROTATION2, f = X.OFFSET.ROTATION3, p = X.OFFSET.FDC0, m = X.OFFSET.FDC1, h = X.OFFSET.FDC2, g = X.OFFSET.OPACITY, v = [];
		for (let e = 0; e < 45; e++) v[e] = X.OFFSET.FRC0 + e;
		return function(_, y, b, x = 0, S = 0) {
			S = Math.min(S, b.sphericalHarmonicsDegree), e.readSplat(_, b, y, x, t);
			let C = X.createSplat(S);
			if (t[wr] === void 0 ? (C[o] = .01, C[s] = .01, C[c] = .01) : (C[o] = Math.exp(t[wr]), C[s] = Math.exp(t[Tr]), C[c] = Math.exp(t[Er])), t[Pr] === void 0 ? t[Rr] === void 0 ? (C[p] = 0, C[m] = 0, C[h] = 0) : (C[p] = 255 * t[Rr], C[m] = 255 * t[zr], C[h] = 255 * t[Br]) : (C[p] = 255 * t[Pr], C[m] = 255 * t[Fr], C[h] = 255 * t[Ir]), t[Lr] !== void 0 && (C[g] = 1 / (1 + Math.exp(-t[Lr])) * 255), C[p] = _t(Math.floor(C[p]), 0, 255), C[m] = _t(Math.floor(C[m]), 0, 255), C[h] = _t(Math.floor(C[h]), 0, 255), C[g] = _t(Math.floor(C[g]), 0, 255), S >= 1 && t[Vr] !== void 0) {
				for (let e = 0; e < 9; e++) C[v[e]] = t[b.sphericalHarmonicsDegree1Fields[e]];
				if (S >= 2) for (let e = 0; e < 15; e++) C[v[9 + e]] = t[b.sphericalHarmonicsDegree2Fields[e]];
			}
			return n.set(t[Dr], t[Or], t[kr], t[Ar]), n.normalize(), C[l] = n.x, C[u] = n.y, C[d] = n.z, C[f] = n.w, C[r] = t[jr], C[i] = t[Mr], C[a] = t[Nr], C;
		};
	}();
	static readSplat(e, t, n, r, i) {
		return Sr.readVertex(e, t, n, r, t.fieldsToReadIndexes, i, !0);
	}
	parseToUncompressedSplatArray(e, t = 0) {
		let n = this.decodeHeaderFromBuffer(e), r = n.splatCount, i = this.findSplatData(e, n);
		return this.decodeSectionSplatData(i, r, n, t);
	}
}, Ur = class {
	static parseToUncompressedSplatArray(e, t = 0) {
		return new Hr().parseToUncompressedSplatArray(e, t);
	}
}, Wr = dt("PlyLoader");
function Gr(e, t, n, r, i, a, o, s) {
	try {
		return t ? dr.getStandardGenerator(n, r, i, a, o, s).generateFromUncompressedSplatArray(e) : lr.generateFromUncompressedSplatArrays([e], n, 0, new k());
	} catch (e) {
		throw new at(`Failed to finalize splat data: ${e.message}`, "splatData", e);
	}
}
var Kr = class e {
	static loadFromURL(t, n, r, i, a, o, s = !0, c = 0, l, u, d, f, p) {
		try {
			Wt(t);
		} catch (e) {
			throw Wr.error("Invalid URL provided to loadFromURL", {
				fileName: t,
				error: e
			}), e;
		}
		n && $t(n, "onProgress", !1), i && $t(i, "onProgressiveLoadSectionProgress", !1), Wr.info("Loading PLY from URL", {
			fileName: t,
			optimizeSplatData: s,
			outSphericalHarmonicsDegree: c
		});
		let m = r ? Ze.DirectToSplatBuffer : Ze.DirectToSplatArray;
		s && (m = Ze.DirectToSplatArray);
		let h = K.ProgressiveLoadSectionSize, g = lr.HeaderSizeBytes + lr.SectionHeaderSizeBytes, _, v, y, b = 0, x = 0, S = !1, C = !1, w = St(), T, E = 0, D = 0, O = 0, A = "", j = null, M = [], N = new TextDecoder(), P = new Hr();
		if (n) try {
			n(0, "0%", Qe.Downloading);
		} catch (e) {
			Wr.warn("Error in onProgress callback", e);
		}
		return gt(t, (e, t, r) => {
			let a = e >= 100;
			if (r && (M.push({
				data: r,
				sizeBytes: r.byteLength,
				startBytes: O,
				endBytes: O + r.byteLength
			}), O += r.byteLength), m === Ze.DownloadBeforeProcessing) a && w.resolve(M);
			else {
				if (!S && (A += N.decode(r), Sr.checkTextForEndHeader(A))) {
					try {
						j = P.decodeHeaderText(A), b = j.splatCount, C = !0, Wr.debug("PLY header decoded", {
							splatCount: b,
							sphericalHarmonicsDegree: j.sphericalHarmonicsDegree
						}), c = Math.min(c, j.sphericalHarmonicsDegree);
					} catch (e) {
						let t = new at(`Failed to decode PLY header: ${e.message}`, "headerText", e);
						Wr.error("Header parsing failed", t), w.reject(t);
						return;
					}
					let e = lr.CompressionLevels[0].SphericalHarmonicsDegrees[c], t = g + e.BytesPerSplat * b;
					m === Ze.DirectToSplatBuffer ? (v = new ArrayBuffer(t), lr.writeHeaderToBuffer({
						versionMajor: lr.CurrentMajorVersion,
						versionMinor: lr.CurrentMinorVersion,
						maxSectionCount: 1,
						sectionCount: 1,
						maxSplatCount: b,
						splatCount: x,
						compressionLevel: 0,
						sceneCenter: new k()
					}, v)) : T = new X(c), E = j.headerSizeBytes, D = j.headerSizeBytes, S = !0;
				}
				if (S && C) {
					if (M.length > 0 && (_ = function(e, t) {
						let n = 0;
						for (let t of e) n += t.sizeBytes;
						(!t || t.byteLength < n) && (t = new ArrayBuffer(n));
						let r = 0;
						for (let n of e) new Uint8Array(t, r, n.sizeBytes).set(n.data), r += n.sizeBytes;
						return t;
					}(M, _), O - E > h || a)) {
						let e = O - D, t = Math.floor(e / j.bytesPerSplat), n = t * j.bytesPerSplat, r = e - n, o = x + t, s = D - M[0].startBytes, l = new DataView(_, s, n), u = lr.CompressionLevels[0].SphericalHarmonicsDegrees[c], d = x * u.BytesPerSplat + g;
						try {
							m === Ze.DirectToSplatBuffer ? P.parseToUncompressedSplatBufferSection(j, 0, t - 1, l, 0, v, d, c) : P.parseToUncompressedSplatArraySection(j, 0, t - 1, l, 0, T, c);
						} catch (e) {
							let n = new at(`Failed to parse splat data section: ${e.message}`, "splatData", e);
							Wr.error("Splat data parsing failed", {
								splatCount: x,
								addedSplatCount: t,
								error: e
							}), w.reject(n);
							return;
						}
						if (x = o, m === Ze.DirectToSplatBuffer && (y ||= (lr.writeSectionHeaderToBuffer({
							maxSplatCount: b,
							splatCount: x,
							bucketSize: 0,
							bucketCount: 0,
							bucketBlockSize: 0,
							compressionScaleRange: 0,
							storageSizeBytes: 0,
							fullBucketCount: 0,
							partiallyFilledBucketCount: 0,
							sphericalHarmonicsDegree: c
						}, 0, v, lr.HeaderSizeBytes), new lr(v, !1)), y.updateLoadedCounts(1, x), i && i(y, a)), E += h, D += n, r === 0) M = [];
						else {
							let e = [], t = 0;
							for (let n = M.length - 1; n >= 0; n--) {
								let i = M[n];
								if (t += i.sizeBytes, e.unshift(i), t >= r) break;
							}
							M = e;
						}
					}
					a && (m === Ze.DirectToSplatBuffer ? w.resolve(y) : w.resolve(T));
				}
			}
			if (n) try {
				n(e, t, Qe.Downloading);
			} catch (e) {
				Wr.warn("Error in onProgress callback", e);
			}
		}, !1, l).then(() => {
			if (n) try {
				n(0, "0%", Qe.Processing);
			} catch (e) {
				Wr.warn("Error in onProgress callback", e);
			}
			return w.promise;
		}).then((r) => {
			if (n) try {
				n(100, "100%", Qe.Done);
			} catch (e) {
				Wr.warn("Error in onProgress callback", e);
			}
			if (Wr.debug("PLY data loaded successfully", {
				internalLoadType: m,
				splatCount: r?.splatCount || "unknown"
			}), m === Ze.DownloadBeforeProcessing) {
				let n = M.map((e) => e.data);
				return new Blob(n).arrayBuffer().then((t) => e.loadFromFileData(t, a, o, s, c, u, d, f, p)).catch((e) => {
					throw new nt(`Failed to process downloaded PLY data: ${e.message}`, t, e);
				});
			}
			return m === Ze.DirectToSplatBuffer ? r : bt(() => Gr(r, s, a, o, u, d, f, p));
		}).catch((e) => {
			throw e instanceof q || e instanceof tt || e instanceof at || e instanceof nt ? (Wr.error("PLY loading failed", {
				fileName: t,
				errorCode: e.code
			}), e) : (Wr.error("Unexpected error loading PLY", {
				fileName: t,
				error: e
			}), new nt(`Unexpected error loading PLY file: ${e.message}`, t, e));
		});
	}
	static loadFromFileData(e, t, n, r, i = 0, a, o, s, c) {
		try {
			Zt(e, "plyFileData");
		} catch (e) {
			return Wr.error("Invalid PLY file data", e), Promise.reject(e);
		}
		return Wr.info("Loading PLY from file data", {
			sizeBytes: e.byteLength,
			optimizeSplatData: r,
			outSphericalHarmonicsDegree: i
		}), bt(() => {
			try {
				return Ur.parseToUncompressedSplatArray(e, i);
			} catch (e) {
				throw new at(`Failed to parse PLY file data: ${e.message}`, "plyFileData", e);
			}
		}).then((e) => (Wr.debug("PLY parsed successfully", { splatCount: e?.splatCount || "unknown" }), Gr(e, r, t, n, a, o, s, c))).catch((e) => {
			throw e instanceof q || e instanceof at ? (Wr.error("PLY file data loading failed", { errorCode: e.code }), e) : (Wr.error("Unexpected error loading PLY from file data", e), new at(`Unexpected error parsing PLY data: ${e.message}`, "plyFileData", e));
		});
	}
}, qr = new k(1, 0, 0), Jr = new k(0, 1, 0), Yr = new k(0, 0, 1), Xr = class {
	constructor(e = new k(), t = new k()) {
		this.origin = new k(), this.direction = new k(), this.setParameters(e, t);
	}
	setParameters(e, t) {
		this.origin.copy(e), this.direction.copy(t).normalize();
	}
	boxContainsPoint(e, t, n) {
		return !(t.x < e.min.x - n || t.x > e.max.x + n || t.y < e.min.y - n || t.y > e.max.y + n || t.z < e.min.z - n || t.z > e.max.z + n);
	}
	intersectBox = function() {
		let e = new k(), t = [], n = [], r = [];
		return function(i, a) {
			if (n[0] = this.origin.x, n[1] = this.origin.y, n[2] = this.origin.z, r[0] = this.direction.x, r[1] = this.direction.y, r[2] = this.direction.z, this.boxContainsPoint(i, this.origin, 1e-4)) return a && (a.origin.copy(this.origin), a.normal.set(0, 0, 0), a.distance = -1), !0;
			for (let o = 0; o < 3; o++) {
				if (r[o] == 0) continue;
				let s = o == 0 ? qr : o == 1 ? Jr : Yr, c = r[o] < 0 ? i.max : i.min, l = -Math.sign(r[o]);
				t[0] = o == 0 ? c.x : o == 1 ? c.y : c.z;
				let u = t[0] - n[o];
				if (u * l < 0) {
					let c = (o + 1) % 3, d = (o + 2) % 3;
					if (t[2] = r[c] / r[o] * u + n[c], t[1] = r[d] / r[o] * u + n[d], e.set(t[o], t[d], t[c]), this.boxContainsPoint(i, e, 1e-4)) return a && (a.origin.copy(e), a.normal.copy(s).multiplyScalar(l), a.distance = e.sub(this.origin).length()), !0;
				}
			}
			return !1;
		};
	}();
	intersectSphere = function() {
		let e = new k();
		return function(t, n, r) {
			e.copy(t).sub(this.origin);
			let i = e.dot(this.direction), a = i * i, o = e.dot(e) - a, s = n * n;
			if (o > s) return !1;
			let c = Math.sqrt(s - o), l = i - c, u = i + c;
			if (u < 0) return !1;
			let d = l < 0 ? u : l;
			return r && (r.origin.copy(this.origin).addScaledVector(this.direction, d), r.normal.copy(r.origin).sub(t).normalize(), r.distance = d), !0;
		};
	}();
}, Zr = class e {
	constructor() {
		this.origin = new k(), this.normal = new k(), this.distance = 0, this.splatIndex = 0;
	}
	set(e, t, n, r) {
		this.origin.copy(e), this.normal.copy(t), this.distance = n, this.splatIndex = r;
	}
	clone() {
		let t = new e();
		return t.origin.copy(this.origin), t.normal.copy(this.normal), t.distance = this.distance, t.splatIndex = this.splatIndex, t;
	}
}, Qr = class {
	constructor(e, t, n = !1) {
		this.ray = new Xr(e, t), this.raycastAgainstTrueSplatEllipsoid = n;
	}
	setFromCameraAndScreenPosition = function() {
		let e = new j();
		return function(t, n, r) {
			if (e.x = n.x / r.x * 2 - 1, e.y = (r.y - n.y) / r.y * 2 - 1, t.isPerspectiveCamera) this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, .5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t;
			else {
				if (!t.isOrthographicCamera) throw Error("Raycaster::setFromCameraAndScreenPosition() -> Unsupported camera type");
				this.ray.origin.set(e.x, e.y, (t.near + t.far) / (t.near - t.far)).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t;
			}
		};
	}();
	intersectSplatMesh = function() {
		let e = new r(), t = new r(), n = new r(), i = new Xr(), a = new k();
		return function(r, o = []) {
			let s = r.getSplatTree();
			if (s) {
				for (let c = 0; c < s.subTrees.length; c++) {
					let l = s.subTrees[c];
					t.copy(r.matrixWorld), r.dynamicMode && (r.getSceneTransform(c, n), t.multiply(n)), e.copy(t).invert(), i.origin.copy(this.ray.origin).applyMatrix4(e), i.direction.copy(this.ray.origin).add(this.ray.direction), i.direction.applyMatrix4(e).sub(i.origin).normalize();
					let u = [];
					l.rootNode && this.castRayAtSplatTreeNode(i, s, l.rootNode, u), u.forEach((e) => {
						e.origin.applyMatrix4(t), e.normal.applyMatrix4(t).normalize(), e.distance = a.copy(e.origin).sub(this.ray.origin).length();
					}), o.push(...u);
				}
				return o.sort((e, t) => e.distance > t.distance ? 1 : -1), o;
			}
		};
	}();
	castRayAtSplatTreeNode = function() {
		let e = new y(), t = new k(), n = new k(), i = new _(), a = new Zr(), o = 1e-7, s = new k(0, 0, 0), c = new r(), l = new r(), u = new r(), d = new r(), f = new r(), p = new Xr();
		return function(r, m, h, g = []) {
			if (r.intersectBox(h.boundingBox)) {
				if (h.data && h.data.indexes && h.data.indexes.length > 0) for (let _ = 0; _ < h.data.indexes.length; _++) {
					let v = h.data.indexes[_], y = m.splatMesh.getSceneIndexForSplat(v);
					if (m.splatMesh.getScene(y).visible && (m.splatMesh.getSplatColor(v, e), m.splatMesh.getSplatCenter(v, t), m.splatMesh.getSplatScaleAndRotation(v, n, i), !(n.x <= o || n.y <= o || m.splatMesh.splatRenderMode === Me.ThreeD && n.z <= o))) {
						if (this.raycastAgainstTrueSplatEllipsoid) {
							l.makeScale(n.x, n.y, n.z), u.makeRotationFromQuaternion(i);
							let o = 2 * Math.log10(e.w);
							if (c.makeScale(o, o, o), f.copy(c).multiply(u).multiply(l), d.copy(f).invert(), p.origin.copy(r.origin).sub(t).applyMatrix4(d), p.direction.copy(r.origin).add(r.direction).sub(t), p.direction.applyMatrix4(d).sub(p.origin).normalize(), p.intersectSphere(s, 1, a)) {
								let e = a.clone();
								e.splatIndex = v, e.origin.applyMatrix4(f).add(t), g.push(e);
							}
						} else {
							let e = n.x + n.y, i = 2;
							if (m.splatMesh.splatRenderMode === Me.ThreeD && (e += n.z, i = 3), e /= i, r.intersectSphere(t, e, a)) {
								let e = a.clone();
								e.splatIndex = v, g.push(e);
							}
						}
					}
				}
				if (h.children && h.children.length > 0) for (let e of h.children) this.castRayAtSplatTreeNode(r, m, e, g);
				return g;
			}
		};
	}();
}, $r = "AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACEgEDZW52Bm1lbW9yeQIDAICABAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQqiDwICAAucDwMBfAd9Bn8gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEFA0AgAyAFQQJ0IgFqIAIgACABaigCAEECdGooAgAiATYCACABIAogASAKSBshCiABIA0gASANShshDSAFQQFqIgUgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiGmooAgBBAnQiG2ooAgAiDkcEQAJ/IAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRgCfyARIA8qAiyUIBIgDyoCKJQgEyAPKgIglCAUIA8qAiSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRkCfyARIA8qAhyUIBIgDyoCGJQgEyAPKgIQlCAUIA8qAhSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRwCfyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIR0gDiEPCyADIBpqIAEgG0ECdGoiDigCBCAcbCAOKAIAIB1saiAOKAIIIBlsaiAOKAIMIBhsaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAii7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshAgJ/IAUqAhi7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshByALIAxNAn8gBSoCCLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEPQfj///8HIQpBiICAgHghDQ0CIAwhBQNAIAMgBUECdCIIaiABIAAgCGooAgBBBHRqIggoAgQgB2wgCCgCACAPbGogCCgCCCACbGoiCDYCACAIIAogCCAKSBshCiAIIA0gCCANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEFA0AgAyAFQQJ0IgFqAn8gAiAAIAFqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAVBAWoiBSALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIREgBSoCGCESIAUqAgghE0H4////ByEKQYiAgIB4IQ0gDCEFA0ACfyARIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCATIAIqAgCUIBIgAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIYaigCAEECdCIZaigCACIORwRAIAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSIRUgESAPKgIslCASIA8qAiiUIBMgDyoCIJQgFCAPKgIklJKSkiEWIBEgDyoCHJQgEiAPKgIYlCATIA8qAhCUIBQgDyoCFJSSkpIhFyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSIREgDiEPCyADIBhqAn8gFSABIBlBAnRqIg4qAgyUIBYgDioCCJQgESAOKgIAlCAXIA4qAgSUkpKSu0QAAAAAAACwQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIg42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gAkEBaiICIAtHDQALDAELQYiAgIB4IQ1B+P///wchCgsgCyAMSwRAIAlBAWuzIA2yIAqyk5UhESAMIQ0DQAJ/IBEgAyANQQJ0aiIBKAIAIAprspQiEotDAAAAT10EQCASqAwBC0GAgICAeAshDiABIA42AgAgBCAOQQJ0aiIBIAEoAgBBAWo2AgAgDUEBaiINIAtHDQALCyAJQQJPBEAgBCgCACENQQEhCgNAIAQgCkECdGoiASABKAIAIA1qIg02AgAgCkEBaiIKIAlHDQALCyAMQQBKBEAgDCEKA0AgBiAKQQFrIgFBAnQiAmogACACaigCADYCACAKQQFLIAEhCg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCws=";
function ei(e) {
	let t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b;
	e.onmessage = (x) => {
		if (x.data.centers) {
			let e = x.data.centers, t = x.data.sceneIndexes;
			i ? new Int32Array(n, m + x.data.range.from * b.BytesPerInt * 4, 4 * x.data.range.count).set(new Int32Array(e)) : new Float32Array(n, m + x.data.range.from * b.BytesPerFloat * 4, 4 * x.data.range.count).set(new Float32Array(e)), a && new Uint32Array(n, l + 4 * x.data.range.from, x.data.range.count).set(new Uint32Array(t)), y = x.data.range.from + x.data.range.count;
		} else if (x.data.sort) {
			let S = Math.min(x.data.sort.splatRenderCount || 0, y), C = Math.min(x.data.sort.splatSortCount || 0, y), w = x.data.sort.usePrecomputedDistances, T, E, D;
			r || (T = x.data.sort.indexesToSort, D = x.data.sort.transforms, w && (E = x.data.sort.precomputedDistances)), function(y, x, S, C, w, T, E) {
				let D = performance.now();
				if (!r && (new Uint32Array(n, s, w.byteLength / b.BytesPerInt).set(w), new Float32Array(n, u, E.byteLength / b.BytesPerFloat).set(E), C)) {
					let e;
					e = i ? new Int32Array(n, d, T.byteLength / b.BytesPerInt) : new Float32Array(n, d, T.byteLength / b.BytesPerFloat), e.set(T);
				}
				g ||= new Uint32Array(v), new Float32Array(n, h, 16).set(S), new Uint32Array(n, p, v).set(g), t.exports.sortIndexes(s, m, d, f, p, h, c, l, u, v, y, x, o, C, i, a);
				let O = {
					sortDone: !0,
					splatSortCount: y,
					splatRenderCount: x,
					sortTime: 0
				};
				if (!r) {
					let e = new Uint32Array(n, c, x);
					(!_ || _.length < x) && (_ = new Uint32Array(x)), _.set(e), O.sortedIndexes = _;
				}
				O.sortTime = performance.now() - D, e.postMessage(O);
			}(C, S, x.data.sort.modelViewProj, w, T, E, D);
		} else if (x.data.init) {
			b = x.data.init.Constants, o = x.data.init.splatCount, r = x.data.init.useSharedMemory, i = x.data.init.integerBasedSort, a = x.data.init.dynamicMode, v = x.data.init.distanceMapRange, y = 0;
			let g = i ? 4 * b.BytesPerInt : 4 * b.BytesPerFloat, _ = new Uint8Array(x.data.init.sorterWasmBytes), S = 16 * b.BytesPerFloat, C = o * b.BytesPerInt, w = o * g, T = S, E = i ? o * b.BytesPerInt : o * b.BytesPerFloat, D = o * b.BytesPerInt, O = o * b.BytesPerInt, k = i ? v * b.BytesPerInt * 2 : v * b.BytesPerFloat * 2, A = a ? o * b.BytesPerInt : 0, j = a ? b.MaxScenes * S : 0, M = 32 * b.MemoryPageSize, N = C + w + T + E + D + k + O + A + j + M, P = Math.floor(N / b.MemoryPageSize) + 1, F = {
				module: {},
				env: { memory: new WebAssembly.Memory({
					initial: P,
					maximum: P,
					shared: !0
				}) }
			};
			WebAssembly.compile(_).then((e) => WebAssembly.instantiate(e, F)).then((i) => {
				t = i, s = 0, m = s + C, h = m + w, d = h + T, f = d + E, p = f + D, c = p + k, l = c + O, u = l + A, n = F.env.memory.buffer, r ? e.postMessage({
					sortSetupPhase1Complete: !0,
					indexesToSortBuffer: n,
					indexesToSortOffset: s,
					sortedIndexesBuffer: n,
					sortedIndexesOffset: c,
					precomputedDistancesBuffer: n,
					precomputedDistancesOffset: d,
					transformsBuffer: n,
					transformsOffset: u
				}) : e.postMessage({ sortSetupPhase1Complete: !0 });
			});
		}
	};
}
var ti = dt("Viewer"), ni = class {
	constructor(e, t) {
		this.tasks = [];
	}
	show() {}
	hide() {}
	setContainer(e) {}
	addTask(e) {
		return this.tasks.push(e);
	}
	removeTask(e) {}
	removeAllTasks() {
		this.tasks = [];
	}
	setMessageForTask(e, t) {}
}, ri = class {
	constructor(e) {}
	show() {}
	hide() {}
	setContainer(e) {}
	setProgress(e) {}
}, ii = class {
	constructor(e) {
		this.scene = e, this.meshCursor = null, this.meshCursorVisible = !1, this.focusMarker = null, this.focusMarkerOpacity = 0, this.controlPlane = null, this.controlPlaneVisible = !1;
	}
	setupMeshCursor() {}
	setupFocusMarker() {}
	setupControlPlane() {}
	updateMeshCursor(e, t) {}
	updateFocusMarker(e, t, n) {}
	updateControlPlane(e, t) {}
	setFocusMarkerVisibility(e) {}
	setFocusMarkerOpacity(e) {
		this.focusMarkerOpacity = e;
	}
	getFocusMarkerOpacity() {
		return this.focusMarkerOpacity;
	}
	positionAndOrientFocusMarker(e, t) {}
	positionAndOrientMeshCursor(e, t) {}
	setMeshCursorVisibility(e) {
		this.meshCursorVisible = e;
	}
	getMeschCursorVisibility() {
		return this.meshCursorVisible;
	}
	setControlPlaneVisibility(e) {
		this.controlPlaneVisible = e;
	}
	positionAndOrientControlPlane(e, t, n) {}
	updateForRenderMode(e, t) {}
	dispose() {}
}, ai = class e {
	constructor(e = {}) {
		if (e.cameraUp ||= [
			0,
			1,
			0
		], this.cameraUp = new k().fromArray(e.cameraUp), e.initialCameraPosition ||= [
			0,
			10,
			15
		], this.initialCameraPosition = new k().fromArray(e.initialCameraPosition), e.initialCameraRotation ||= [
			0,
			0,
			0
		], this.initialCameraRotation = new k().fromArray(e.initialCameraRotation), this.backgroundColor = e.backgroundColor, this.irisOcclusionConfig = e.irisOcclusionConfig || null, e.initialCameraLookAt ||= [
			0,
			0,
			0
		], this.initialCameraLookAt = new k().fromArray(e.initialCameraLookAt), this.dropInMode = e.dropInMode || !1, e.selfDrivenMode !== void 0 && e.selfDrivenMode !== null || (e.selfDrivenMode = !0), this.selfDrivenMode = e.selfDrivenMode && !this.dropInMode, this.selfDrivenUpdateFunc = this.selfDrivenUpdate.bind(this), e.useBuiltInControls === void 0 && (e.useBuiltInControls = !0), this.useBuiltInControls = e.useBuiltInControls, this.rootElement = e.rootElement, this.canvas = e.threejsCanvas, this.ignoreDevicePixelRatio = e.ignoreDevicePixelRatio || !1, this.devicePixelRatio = this.ignoreDevicePixelRatio ? 1 : window.devicePixelRatio || 1, this.halfPrecisionCovariancesOnGPU = e.halfPrecisionCovariancesOnGPU || !1, this.threeScene = e.threeScene, this.renderer = e.renderer, this.camera = e.camera, this.gpuAcceleratedSort = e.gpuAcceleratedSort || !1, e.integerBasedSort !== void 0 && e.integerBasedSort !== null || (e.integerBasedSort = !0), this.integerBasedSort = e.integerBasedSort, e.sharedMemoryForWorkers !== void 0 && e.sharedMemoryForWorkers !== null || (e.sharedMemoryForWorkers = !0), this.sharedMemoryForWorkers = !1, this.dynamicScene = !!e.dynamicScene, this.antialiased = e.antialiased || !1, this.kernel2DSize = e.kernel2DSize === void 0 ? .3 : e.kernel2DSize, this.renderMode = e.renderMode || Oe.Always, this.sceneRevealMode = e.sceneRevealMode || je.Default, this.focalAdjustment = e.focalAdjustment || 1, this.maxScreenSpaceSplatSize = e.maxScreenSpaceSplatSize || 1024, this.logLevel = e.logLevel || De.None, this.sphericalHarmonicsDegree = e.sphericalHarmonicsDegree || 0, this.enableOptionalEffects = e.enableOptionalEffects || !1, e.enableSIMDInSort !== void 0 && e.enableSIMDInSort !== null || (e.enableSIMDInSort = !0), this.enableSIMDInSort = e.enableSIMDInSort, e.inMemoryCompressionLevel !== void 0 && e.inMemoryCompressionLevel !== null || (e.inMemoryCompressionLevel = 0), this.inMemoryCompressionLevel = e.inMemoryCompressionLevel, e.optimizeSplatData !== void 0 && e.optimizeSplatData !== null || (e.optimizeSplatData = !0), this.optimizeSplatData = e.optimizeSplatData, e.freeIntermediateSplatData !== void 0 && e.freeIntermediateSplatData !== null || (e.freeIntermediateSplatData = !1), this.freeIntermediateSplatData = e.freeIntermediateSplatData, Tt()) {
			let e = Et();
			e.major < 17 && (this.enableSIMDInSort = !1), e.major < 16 && (this.sharedMemoryForWorkers = !1);
		}
		e.splatRenderMode !== void 0 && e.splatRenderMode !== null || (e.splatRenderMode = Me.ThreeD), this.splatRenderMode = e.splatRenderMode, this.sceneFadeInRateMultiplier = e.sceneFadeInRateMultiplier || 1, this.splatSortDistanceMapPrecision = e.splatSortDistanceMapPrecision || K.DefaultSplatSortDistanceMapPrecision;
		let t = this.integerBasedSort ? 20 : 24;
		this.splatSortDistanceMapPrecision = _t(this.splatSortDistanceMapPrecision, 10, t), this.onSplatMeshChangedCallback = null, this.createSplatMesh(), this.controls = null, this.perspectiveControls = null, this.orthographicControls = null, this.orthographicCamera = null, this.perspectiveCamera = null, this.showMeshCursor = !1, this.showControlPlane = !1, this.showInfo = !1, this.sceneHelper = null, this.sortWorker = null, this.sortRunning = !1, this.splatRenderCount = 0, this.splatSortCount = 0, this.lastSplatSortCount = 0, this.sortWorkerIndexesToSort = null, this.sortWorkerSortedIndexes = null, this.sortWorkerPrecomputedDistances = null, this.sortWorkerTransforms = null, this.preSortMessages = [], this.runAfterNextSort = [], this.selfDrivenModeRunning = !1, this.splatRenderReady = !1, this.raycaster = new Qr(), this.infoPanel = null, this.startInOrthographicMode = !1, this.currentFPS = 0, this.lastSortTime = 0, this.consecutiveRenderFrames = 0, this.previousCameraTarget = new k(), this.nextCameraTarget = new k(), this.mousePosition = new j(), this.mouseDownPosition = new j(), this.mouseDownTime = null, this.resizeObserver = null, this.mouseMoveListener = null, this.mouseDownListener = null, this.mouseUpListener = null, this.keyDownListener = null, this.sortPromise = null, this.sortPromiseResolver = null, this.splatSceneDownloadControllers = [], this.splatSceneDownloadPromises = {}, this.splatSceneDownloadAndBuildPromise = null, this.splatSceneRemovalPromise = null, this.loadingSpinner = new ni(null, this.rootElement || document.body), this.loadingSpinner.hide(), this.loadingProgressBar = new ri(this.rootElement || document.body), this.loadingProgressBar.hide(), this.usingExternalCamera = !(!this.dropInMode && !this.camera), this.usingExternalRenderer = !(!this.dropInMode && !this.renderer), this.initialized = !1, this.disposing = !1, this.disposed = !1, this.disposePromise = null, this.lastTime = 0, this.gaussianSplatCount = 0, this.totalFrames = 0, this.frame = 0, this.avatarMesh = null, this.skinModel = null, this.boneRoot = null, this.baseMesh = null, this.setSkinAttibutes = !1, this.dropInMode || this.init();
	}
	createSplatMesh() {
		this.splatMesh = new nr(this.splatRenderMode, this.dynamicScene, this.enableOptionalEffects, this.halfPrecisionCovariancesOnGPU, this.devicePixelRatio, this.gpuAcceleratedSort, this.integerBasedSort, this.antialiased, this.maxScreenSpaceSplatSize, this.logLevel, this.sphericalHarmonicsDegree, this.sceneFadeInRateMultiplier, this.kernel2DSize, this.irisOcclusionConfig), this.splatMesh.frustumCulled = !1, this.onSplatMeshChangedCallback && this.onSplatMeshChangedCallback();
	}
	init() {
		this.initialized ||= (this.rootElement || (this.usingExternalRenderer ? this.rootElement = this.renderer.domElement || document.body : (this.rootElement = document.createElement("div"), this.rootElement.style.width = "100%", this.rootElement.style.height = "100%", this.rootElement.style.position = "absolute", document.body.appendChild(this.rootElement))), this.setupCamera(), this.setupRenderer(), this.setupEventHandlers(), this.threeScene = this.threeScene || new L(), this.sceneHelper = new ii(this.threeScene), this.sceneHelper.setupMeshCursor(), this.sceneHelper.setupFocusMarker(), this.sceneHelper.setupControlPlane(), this.loadingProgressBar.setContainer(this.rootElement), this.loadingSpinner.setContainer(this.rootElement), !0);
	}
	setupCamera() {
		if (!this.usingExternalCamera) {
			let e = new j();
			this.getRenderDimensions(e), this.perspectiveCamera = new B(50, e.x / e.y, .1, 1e3), this.orthographicCamera = new f(e.x / -2, e.x / 2, e.y / 2, e.y / -2, .1, 1e3), this.camera = this.startInOrthographicMode ? this.orthographicCamera : this.perspectiveCamera, this.camera.position.copy(this.initialCameraPosition), this.camera.rotateX(h.degToRad(this.initialCameraRotation.x)), this.camera.rotateY(h.degToRad(this.initialCameraRotation.y)), this.camera.rotateZ(h.degToRad(this.initialCameraRotation.z));
		}
	}
	setupRenderer() {
		if (!this.usingExternalRenderer) {
			let e = new j();
			this.getRenderDimensions(e), this.renderer = new M({
				antialias: !1,
				precision: "highp",
				canvas: this.canvas
			}), this.renderer.setPixelRatio(this.devicePixelRatio), this.renderer.autoClear = !0, this.renderer.setClearColor(this.backgroundColor, 1), this.renderer.setSize(e.x, e.y), this.resizeObserver = new ResizeObserver(() => {
				this.getRenderDimensions(e), this.renderer.setSize(e.x, e.y), this.forceRenderNextFrame();
			}), this.resizeObserver.observe(this.rootElement), this.rootElement.appendChild(this.renderer.domElement);
		}
	}
	setupControls() {
		if (this.useBuiltInControls) {
			this.usingExternalCamera ? this.camera.isOrthographicCamera ? this.orthographicControls = new me(this.camera, this.renderer.domElement) : this.perspectiveControls = new me(this.camera, this.renderer.domElement) : (this.perspectiveControls = new me(this.perspectiveCamera, this.renderer.domElement), this.orthographicControls = new me(this.orthographicCamera, this.renderer.domElement));
			for (let e of [this.orthographicControls, this.perspectiveControls]) e && (e.listenToKeyEvents(window), e.rotateSpeed = .5, e.maxPolarAngle = .5 * Math.PI, e.minPolarAngle = .5 * Math.PI, e.minAzimuthAngle = -Math.PI / 72, e.maxAzimuthAngle = Math.PI / 72, e.enableDamping = !0, e.dampingFactor = .05, e.target.copy(this.initialCameraLookAt), e.update());
			this.controls = this.camera.isOrthographicCamera ? this.orthographicControls : this.perspectiveControls, this.controls.update();
		}
	}
	setupEventHandlers() {
		this.useBuiltInControls && (this.mouseMoveListener = this.onMouseMove.bind(this), this.renderer.domElement.addEventListener("pointermove", this.mouseMoveListener, !1), this.mouseDownListener = this.onMouseDown.bind(this), this.renderer.domElement.addEventListener("pointerdown", this.mouseDownListener, !1), this.mouseUpListener = this.onMouseUp.bind(this), this.renderer.domElement.addEventListener("pointerup", this.mouseUpListener, !1), this.keyDownListener = this.onKeyDown.bind(this));
	}
	removeEventHandlers() {
		this.useBuiltInControls && (this.renderer.domElement.removeEventListener("pointermove", this.mouseMoveListener), this.mouseMoveListener = null, this.renderer.domElement.removeEventListener("pointerdown", this.mouseDownListener), this.mouseDownListener = null, this.renderer.domElement.removeEventListener("pointerup", this.mouseUpListener), this.mouseUpListener = null, window.removeEventListener("keydown", this.keyDownListener), this.keyDownListener = null);
	}
	setRenderMode(e) {
		this.renderMode = e;
	}
	setActiveSphericalHarmonicsDegrees(e) {
		this.splatMesh.material.uniforms.sphericalHarmonicsDegree.value = e, this.splatMesh.material.uniformsNeedUpdate = !0;
	}
	onSplatMeshChanged(e) {
		this.onSplatMeshChangedCallback = e;
	}
	tempForward = new k();
	tempMatrixLeft = new r();
	tempMatrixRight = new r();
	onKeyDown = (e) => {
		switch (this.tempForward.set(0, 0, -1), this.tempForward.transformDirection(this.camera.matrixWorld), this.tempMatrixLeft.makeRotationAxis(this.tempForward, Math.PI / 128), this.tempMatrixRight.makeRotationAxis(this.tempForward, -Math.PI / 128), e.code) {
			case "KeyG":
				this.focalAdjustment += .02, this.forceRenderNextFrame();
				break;
			case "KeyF":
				this.focalAdjustment -= .02, this.forceRenderNextFrame();
				break;
			case "ArrowLeft":
				this.camera.up.transformDirection(this.tempMatrixLeft);
				break;
			case "ArrowRight":
				this.camera.up.transformDirection(this.tempMatrixRight);
				break;
			case "KeyC":
				this.showMeshCursor = !this.showMeshCursor;
				break;
			case "KeyU":
				this.showControlPlane = !this.showControlPlane;
				break;
			case "KeyI":
				this.showInfo = !this.showInfo, this.showInfo;
				break;
			case "KeyO":
				this.usingExternalCamera || this.setOrthographicMode(!this.camera.isOrthographicCamera);
				break;
			case "KeyP":
				this.usingExternalCamera || this.splatMesh.setPointCloudModeEnabled(!this.splatMesh.getPointCloudModeEnabled());
				break;
			case "Equal":
				this.usingExternalCamera || this.splatMesh.setSplatScale(this.splatMesh.getSplatScale() + .05);
				break;
			case "Minus": this.usingExternalCamera || this.splatMesh.setSplatScale(Math.max(this.splatMesh.getSplatScale() - .05, 0));
		}
	};
	onMouseMove(e) {
		this.mousePosition.set(e.offsetX, e.offsetY);
	}
	onMouseDown() {
		this.mouseDownPosition.copy(this.mousePosition), this.mouseDownTime = vt();
	}
	onMouseUp = function() {
		let e = new j();
		return function(t) {
			e.copy(this.mousePosition).sub(this.mouseDownPosition), vt() - this.mouseDownTime < .5 && e.length() < 2 && this.onMouseClick(t);
		};
	}();
	onMouseClick(e) {
		this.mousePosition.set(e.offsetX, e.offsetY), this.checkForFocalPointChange();
	}
	checkPointRenderDimensions = new j();
	checkPointToNewFocalPoint = new k();
	checkPointOutHits = [];
	checkForFocalPointChange = () => {
		if (!this.transitioningCameraTarget && (this.getRenderDimensions(this.checkPointRenderDimensions), this.checkPointOutHits.length = 0, this.raycaster.setFromCameraAndScreenPosition(this.camera, this.mousePosition, this.checkPointRenderDimensions), this.raycaster.intersectSplatMesh(this.splatMesh, this.checkPointOutHits), this.checkPointOutHits.length > 0)) {
			let e = this.checkPointOutHits[0].origin;
			this.checkPointToNewFocalPoint.copy(e).sub(this.camera.position), this.checkPointToNewFocalPoint.length() > .5 && (this.previousCameraTarget.copy(this.controls.target), this.nextCameraTarget.copy(e), this.transitioningCameraTarget = !0, this.transitioningCameraTargetStartTime = vt());
		}
	};
	getRenderDimensions(e) {
		this.rootElement ? (e.x = this.rootElement.offsetWidth, e.y = this.rootElement.offsetHeight) : this.renderer.getSize(e);
	}
	setOrthographicMode(t) {
		if (t === this.camera.isOrthographicCamera) return;
		let n = this.camera, r = t ? this.orthographicCamera : this.perspectiveCamera;
		if (r.position.copy(n.position), r.up.copy(n.up), r.rotation.copy(n.rotation), r.quaternion.copy(n.quaternion), r.matrix.copy(n.matrix), this.camera = r, this.controls) {
			let i = (e) => {
				e.saveState(), e.reset();
			}, a = this.controls, o = t ? this.orthographicControls : this.perspectiveControls;
			i(o), i(a), o.target.copy(a.target), t ? e.setCameraZoomFromPosition(r, n, a) : e.setCameraPositionFromZoom(r, n, o), this.controls = o, this.camera.lookAt(this.controls.target);
		}
	}
	static setCameraPositionFromZoom = function() {
		let e = new k();
		return function(t, n, r) {
			let i = 1 / (.001 * n.zoom);
			e.copy(r.target).sub(t.position).normalize().multiplyScalar(i).negate(), t.position.copy(r.target).add(e);
		};
	}();
	static setCameraZoomFromPosition = function() {
		let e = new k();
		return function(t, n, r) {
			t.zoom = 1 / (.001 * e.copy(r.target).sub(n.position).length());
		};
	}();
	updateSplatMesh = function() {
		let e = new j();
		return function() {
			if (this.splatMesh && this.splatMesh.getSplatCount() > 0) {
				this.splatMesh.updateVisibleRegionFadeDistance(this.sceneRevealMode), this.splatMesh.updateTransforms(), this.getRenderDimensions(e);
				let t = .5 * this.camera.projectionMatrix.elements[0] * this.devicePixelRatio * e.x, n = .5 * this.camera.projectionMatrix.elements[5] * this.devicePixelRatio * e.y, r = this.camera.isOrthographicCamera ? 1 / this.devicePixelRatio : 1, i = this.focalAdjustment * r, a = 1 / i;
				this.adjustForWebXRStereo(e), this.splatMesh.updateUniforms(e, t * i, n * i, this.camera.isOrthographicCamera, this.camera.zoom || 1, a);
			}
		};
	}();
	adjustForWebXRStereo(e) {
		if (this.camera && this.webXRActive) {
			let t = this.renderer.xr.getCamera().projectionMatrix.elements[0], n = this.camera.projectionMatrix.elements[0];
			e.x *= n / t;
		}
	}
	isLoadingOrUnloading() {
		return Object.keys(this.splatSceneDownloadPromises).length > 0 || this.splatSceneDownloadAndBuildPromise !== null || this.splatSceneRemovalPromise !== null;
	}
	isDisposingOrDisposed() {
		return this.disposing || this.disposed;
	}
	addSplatSceneDownloadController(e) {
		this.splatSceneDownloadControllers.push(e);
	}
	removeSplatSceneDownloadController(e) {
		let t = this.splatSceneDownloadControllers.indexOf(e);
		t > -1 && this.splatSceneDownloadControllers.splice(t, 1);
	}
	addSplatSceneDownloadPromise(e) {
		this.splatSceneDownloadPromises[e.id] = e;
	}
	removeSplatSceneDownloadPromise(e) {
		delete this.splatSceneDownloadPromises[e.id];
	}
	setSplatSceneDownloadAndBuildPromise(e) {
		this.splatSceneDownloadAndBuildPromise = e;
	}
	clearSplatSceneDownloadAndBuildPromise() {
		this.splatSceneDownloadAndBuildPromise = null;
	}
	addSplatScene(t, n = {}) {
		if (this.isLoadingOrUnloading()) throw Error("Cannot add splat scene while another load or unload is already in progress.");
		if (this.isDisposingOrDisposed()) throw Error("Cannot add splat scene after dispose() is called.");
		n.progressiveLoad && this.splatMesh.scenes && this.splatMesh.scenes.length > 0 && (ti.warn("addSplatScene(): \"progressiveLoad\" option ignore because there are multiple splat scenes"), n.progressiveLoad = !1);
		let r = n.format !== void 0 && n.format !== null ? n.format : Ae(t), i = e.isProgressivelyLoadable(r) && n.progressiveLoad, a = n.showLoadingUI === void 0 || n.showLoadingUI === null || n.showLoadingUI, o = null;
		a && (this.loadingSpinner.removeAllTasks(), o = this.loadingSpinner.addTask("Downloading..."));
		let s = (e, t, n) => {
			if (a) {
				if (n === Qe.Downloading) {
					if (e == 100) this.loadingSpinner.setMessageForTask(o, "Download complete!");
					else if (i) this.loadingSpinner.setMessageForTask(o, "Downloading splats...");
					else {
						let e = t ? `: ${t}` : "...";
						this.loadingSpinner.setMessageForTask(o, `Downloading${e}`);
					}
				} else n === Qe.Processing && (ti.debug("loaderStatus === LoaderStatus.Processing"), this.loadingSpinner.setMessageForTask(o, "Processing splats..."));
			}
		}, c = !1, l = 0, u = (e, t) => {
			a && ((e && i || t && !i) && (this.loadingSpinner.removeTask(o), t || c || this.loadingProgressBar.show()), i && (t ? (c = !0, this.loadingProgressBar.hide()) : this.loadingProgressBar.setProgress(l)));
		};
		return (i ? this.downloadAndBuildSingleSplatSceneProgressiveLoad.bind(this) : this.downloadAndBuildSingleSplatSceneStandardLoad.bind(this))(t, r, n.splatAlphaRemovalThreshold, ((e, t, r) => {
			!i && n.onProgress && n.onProgress(0, "0%", Qe.Processing);
			let o = {
				rotation: n.rotation || n.orientation,
				position: n.position,
				scale: n.scale,
				splatAlphaRemovalThreshold: n.splatAlphaRemovalThreshold
			};
			return this.addSplatBuffers([e], [o], r, t && a, a, i, i).then(() => {
				!i && n.onProgress && n.onProgress(100, "100%", Qe.Processing), u(t, r);
			});
		}).bind(this), (e, t, r) => {
			l = e, s(e, t, r), n.onProgress && n.onProgress(e, t, r);
		}, (() => {
			this.loadingProgressBar.hide(), this.loadingSpinner.removeAllTasks();
		}).bind(this), n.headers);
	}
	downloadAndBuildSingleSplatSceneStandardLoad(e, t, n, r, i, a, o) {
		let s = this.downloadSplatSceneToSplatBuffer(e, n, i, !1, void 0, t, o), c = Ct(s.abort ? s.abort.bind(s) : void 0);
		return s.then((e) => (this.removeSplatSceneDownloadPromise(s), r(e, !0, !0).then(() => {
			c.resolve(), this.clearSplatSceneDownloadAndBuildPromise();
		}))).catch((t) => {
			a && a(), this.clearSplatSceneDownloadAndBuildPromise(), this.removeSplatSceneDownloadPromise(s);
			let n = t instanceof ht || t.name === "AbortError" ? t : /* @__PURE__ */ Error(`Viewer::addSplatScene -> Could not load file ${e}`);
			c.reject(n);
		}), this.addSplatSceneDownloadPromise(s), this.setSplatSceneDownloadAndBuildPromise(c.promise), c.promise;
	}
	downloadAndBuildSingleSplatSceneProgressiveLoad(e, t, n, r, i, a, o) {
		let s = 0, c = !1, l = [], u = () => {
			if (l.length > 0 && !c && !this.isDisposingOrDisposed()) {
				c = !0;
				let e = l.shift();
				r(e.splatBuffer, e.firstBuild, e.finalBuild).then(() => {
					c = !1, e.firstBuild ? p.resolve() : e.finalBuild && (m.resolve(), this.clearSplatSceneDownloadAndBuildPromise()), l.length > 0 && bt(() => u());
				});
			}
		}, d = this.downloadSplatSceneToSplatBuffer(e, n, i, !0, (e, t) => {
			this.isDisposingOrDisposed() || (t || l.length === 0 || e.getSplatCount() > l[0].splatBuffer.getSplatCount()) && (l.push({
				splatBuffer: e,
				firstBuild: s === 0,
				finalBuild: t
			}), s++, u());
		}, t, o), f = d.abort ? d.abort.bind(d) : void 0, p = Ct(f), m = Ct(f);
		return this.addSplatSceneDownloadPromise(d), this.setSplatSceneDownloadAndBuildPromise(m.promise), d.then(() => {
			this.removeSplatSceneDownloadPromise(d);
		}).catch((e) => {
			ti.error("Viewer::addSplatScene actual error:", e), this.clearSplatSceneDownloadAndBuildPromise(), this.removeSplatSceneDownloadPromise(d);
			let t = e instanceof ht || e.name === "AbortError" ? e : /* @__PURE__ */ Error(`Viewer::addSplatScene -> Could not load one or more scenes: ${e.message}`);
			p.reject(t), a && a(t);
		}), p.promise;
	}
	addSplatScenes(e, t = !0, n = void 0) {
		if (this.isLoadingOrUnloading()) throw Error("Cannot add splat scene while another load or unload is already in progress.");
		if (this.isDisposingOrDisposed()) throw Error("Cannot add splat scene after dispose() is called.");
		let r = e.length, i = [], a;
		t && (this.loadingSpinner.removeAllTasks(), a = this.loadingSpinner.addTask("Downloading..."));
		let o = (e, o, s, c) => {
			i[e] = o;
			let l = 0;
			for (let e = 0; e < r; e++) l += i[e] || 0;
			l /= r, s = `${l.toFixed(2)}%`, t && c === Qe.Downloading && this.loadingSpinner.setMessageForTask(a, l == 100 ? "Download complete!" : `Downloading: ${s}`), n && n(l, s, c);
		}, s = new AbortController(), c = s.signal;
		this.addSplatSceneDownloadController(s);
		let l = [];
		for (let t = 0; t < e.length; t++) {
			let n = e[t], r = n.format !== void 0 && n.format !== null ? n.format : Ae(n.path), i = this.downloadSplatSceneToSplatBuffer(n.path, n.splatAlphaRemovalThreshold, o.bind(this, t), !1, void 0, r, n.headers, c);
			l.push(i);
		}
		let u = Promise.all(l).then((r) => (t && this.loadingSpinner.removeTask(a), n && n(0, "0%", Qe.Processing), this.addSplatBuffers(r, e, !0, t, t, !1, !1).then(() => {
			n && n(100, "100%", Qe.Processing), this.clearSplatSceneDownloadAndBuildPromise();
		}))).catch((e) => {
			throw t && this.loadingSpinner.removeTask(a), this.clearSplatSceneDownloadAndBuildPromise(), e.name === "AbortError" ? e : /* @__PURE__ */ Error("Viewer::addSplatScenes -> Could not load one or more splat scenes.");
		}).finally(() => {
			this.removeSplatSceneDownloadController(s);
		});
		return this.setSplatSceneDownloadAndBuildPromise(u), u;
	}
	downloadSplatSceneToSplatBuffer(e, t = 1, n = void 0, r = !1, i = void 0, a, o) {
		let s = !r && this.optimizeSplatData;
		try {
			if (a === ke.Ply) return Kr.loadFromURL(e, n, r, i, t, this.inMemoryCompressionLevel, s, this.sphericalHarmonicsDegree, o);
		} catch (e) {
			throw e instanceof rr ? /* @__PURE__ */ Error("File type or server does not support progressive loading.") : e;
		}
		throw Error(`Viewer::downloadSplatSceneToSplatBuffer -> File format not supported: ${e}`);
	}
	static isProgressivelyLoadable(e) {
		return e === ke.Ply;
	}
	addSplatBuffers = (e, t = [], n = !0, r = !0, i = !0, a = !1, o = !1, s = !0) => {
		if (this.isDisposingOrDisposed()) return Promise.resolve();
		let c = null, l = () => {
			c !== null && (this.loadingSpinner.removeTask(c), c = null);
		};
		return this.splatRenderReady = !1, new Promise((u) => {
			r && (c = this.loadingSpinner.addTask("Processing splats...")), bt(() => {
				if (this.isDisposingOrDisposed()) u();
				else {
					let r = this.addSplatBuffersToMesh(e, t, n, i, a, s), c = this.splatMesh.getMaxSplatCount();
					this.sortWorker && this.sortWorker.maxSplatCount !== c && this.disposeSortWorker(), this.gpuAcceleratedSort || this.preSortMessages.push({
						centers: r.centers.buffer,
						sceneIndexes: r.sceneIndexes.buffer,
						range: {
							from: r.from,
							to: r.to,
							count: r.count
						}
					}), (!this.sortWorker && c > 0 ? this.setupSortWorker(this.splatMesh) : Promise.resolve()).then(() => {
						this.isDisposingOrDisposed() || this.runSplatSort(!0, !0).then((e) => {
							this.sortWorker && e ? (o ? this.splatRenderReady = !0 : this.runAfterNextSort.push(() => {
								this.splatRenderReady = !0;
							}), this.runAfterNextSort.push(() => {
								l(), u();
							})) : (this.splatRenderReady = !0, l(), u());
						});
					});
				}
			}, !0);
		});
	};
	addSplatBuffersToMesh = function() {
		let e;
		return function(t, n, r = !0, i = !1, a = !1, o = !0) {
			if (this.isDisposingOrDisposed()) return;
			let s = [], c = [];
			a || (s = this.splatMesh.scenes.map((e) => e.splatBuffer) || [], c = this.splatMesh.sceneOptions ? this.splatMesh.sceneOptions.map((e) => e) : []), s.push(...t), c.push(...n), this.renderer && this.splatMesh.setRenderer(this.renderer);
			let l = this.splatMesh.build(s, c, !0, r, (t) => {
				if (this.isDisposingOrDisposed()) return;
				let n = this.splatMesh.getSplatCount();
				i && n >= 15e5 && (t || e || (this.loadingSpinner.setMinimized(!0, !0), e = this.loadingSpinner.addTask("Optimizing data structures...")));
			}, (t) => {
				this.isDisposingOrDisposed() || t && e && (this.loadingSpinner.removeTask(e), e = null);
			}, o);
			return r && this.freeIntermediateSplatData && this.splatMesh.freeIntermediateSplatData(), l;
		};
	}();
	async setupSortWorker(e) {
		if (this.isDisposingOrDisposed()) return;
		let t = this.integerBasedSort ? Int32Array : Float32Array, n = e.getSplatCount(), r = e.getMaxSplatCount();
		return this.sortWorker = await function(e, t, n, r, i, a = K.DefaultSplatSortDistanceMapPrecision) {
			let o = new Worker(URL.createObjectURL(new Blob([
				"(",
				ei.toString(),
				")(self)"
			], { type: "application/javascript" }))), s = "AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEbA2AAAGAQf39/f39/f39/f39/f39/fwBgAAF/AhIBA2VudgZtZW1vcnkCAwCAgAQDBAMAAQIHVAQRX193YXNtX2NhbGxfY3RvcnMAABhfX3dhc21fYXBwbHlfZGF0YV9yZWxvY3MAAAtzb3J0SW5kZXhlcwABE2Vtc2NyaXB0ZW5fdGxzX2luaXQAAgqWEAMDAAELihAEAXwDewN/A30gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEBA0AgAyABQQJ0IgVqIAIgACAFaigCAEECdGooAgAiBTYCACAFIAogBSAKSBshCiAFIA0gBSANShshDSABQQFqIgEgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiFWooAgAiFkECdGooAgAiFEcEQAJ/IAX9CQI4IAggFEEGdGoiDv0JAgwgDioCHP0gASAOKgIs/SACIA4qAjz9IAP95gEgBf0JAiggDv0JAgggDioCGP0gASAOKgIo/SACIA4qAjj9IAP95gEgBf0JAgggDv0JAgAgDioCEP0gASAOKgIg/SACIA4qAjD9IAP95gEgBf0JAhggDv0JAgQgDioCFP0gASAOKgIk/SACIA4qAjT9IAP95gH95AH95AH95AEiEf1f/QwAAAAAAECPQAAAAAAAQI9AIhL98gEiE/0hASIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDgJ/IBP9IQAiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgL/REgDv0cAQJ/IBEgEf0NCAkKCwwNDg8AAAAAAAAAAP1fIBL98gEiEf0hACIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAv9HAICfyAR/SEBIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4C/0cAyESIBQhDwsgAyAVaiABIBZBBHRq/QAAACAS/bUBIhH9GwAgEf0bAWogEf0bAmogEf0bA2oiDjYCACAOIAogCiAOShshCiAOIA0gDSAOSBshDSACQQFqIgIgC0cNAAsMAwsCfyAFKgIIu/0UIAUqAhi7/SIB/QwAAAAAAECPQAAAAAAAQI9A/fIBIhH9IQEiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIQ4CfyAR/SEAIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyECAn8gBSoCKLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEFQfj///8HIQpBiICAgHghDSALIAxNDQIgAv0RIA79HAEgBf0cAiESIAwhBQNAIAMgBUECdCICaiABIAAgAmooAgBBBHRq/QAAACAS/bUBIhH9GwAgEf0bAWogEf0bAmoiAjYCACACIAogAiAKSBshCiACIA0gAiANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEBA0AgAyABQQJ0IgVqAn8gAiAAIAVqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAFBAWoiASALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIRcgBSoCGCEYIAUqAgghGUH4////ByEKQYiAgIB4IQ0gDCEFA0ACfyAXIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCAZIAIqAgCUIBggAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIUaigCAEECdCIVaigCACIORwRAIAX9CQI4IAggDkEGdGoiD/0JAgwgDyoCHP0gASAPKgIs/SACIA8qAjz9IAP95gEgBf0JAiggD/0JAgggDyoCGP0gASAPKgIo/SACIA8qAjj9IAP95gEgBf0JAgggD/0JAgAgDyoCEP0gASAPKgIg/SACIA8qAjD9IAP95gEgBf0JAhggD/0JAgQgDyoCFP0gASAPKgIk/SACIA8qAjT9IAP95gH95AH95AH95AEhESAOIQ8LIAMgFGoCfyAR/R8DIAEgFUECdCIOQQxyaioCAJQgEf0fAiABIA5BCHJqKgIAlCAR/R8AIAEgDmoqAgCUIBH9HwEgASAOQQRyaioCAJSSkpK7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAsiDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSACQQFqIgIgC0cNAAsMAQtBiICAgHghDUH4////ByEKCyALIAxLBEAgCUEBa7MgDbIgCrKTlSEXIAwhDQNAAn8gFyADIA1BAnRqIgEoAgAgCmuylCIYi0MAAABPXQRAIBioDAELQYCAgIB4CyEOIAEgDjYCACAEIA5BAnRqIgEgASgCAEEBajYCACANQQFqIg0gC0cNAAsLIAlBAk8EQCAEKAIAIQ1BASEKA0AgBCAKQQJ0aiIBIAEoAgAgDWoiDTYCACAKQQFqIgogCUcNAAsLIAxBAEoEQCAMIQoDQCAGIApBAWsiAUECdCICaiAAIAJqKAIANgIAIApBAUshAiABIQogAg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCwsEAEEACw==", c = Tt() ? Et() : null;
			n || t ? n ? t || c && c.major <= 16 && c.minor < 4 && (s = "AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACDwEDZW52Bm1lbW9yeQIAAAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQrrDwICAAvlDwQBfAN7B30DfyALIAprIQwCQAJAIA4EQCANBEBB+P///wchCkGIgICAeCENIAsgDE0NAyAMIQUDQCADIAVBAnQiAWogAiAAIAFqKAIAQQJ0aigCACIBNgIAIAEgCiABIApIGyEKIAEgDSABIA1KGyENIAVBAWoiBSALRw0ACwwDCyAPBEAgCyAMTQ0CQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIcaigCACIdQQJ0aigCACIbRwRAAn8gBf0JAjggCCAbQQZ0aiIO/QkCDCAOKgIc/SABIA4qAiz9IAIgDioCPP0gA/3mASAF/QkCKCAO/QkCCCAOKgIY/SABIA4qAij9IAIgDioCOP0gA/3mASAF/QkCCCAO/QkCACAOKgIQ/SABIA4qAiD9IAIgDioCMP0gA/3mASAF/QkCGCAO/QkCBCAOKgIU/SABIA4qAiT9IAIgDioCNP0gA/3mAf3kAf3kAf3kASIR/V/9DAAAAAAAQI9AAAAAAABAj0AiEv3yASIT/SEBIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOAn8gE/0hACIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAv9ESAO/RwBAn8gESAR/Q0ICQoLDA0ODwABAgMAAQID/V8gEv3yASIR/SEAIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4C/0cAgJ/IBH9IQEiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgL/RwDIRIgGyEPCyADIBxqIAEgHUEEdGr9AAAAIBL9tQEiEf0bACAR/RsBaiAR/RsCaiAR/RsDaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAgi7/RQgBSoCGLv9IgH9DAAAAAAAQI9AAAAAAABAj0D98gEiEf0hASIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDgJ/IBH9IQAiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLAn8gBSoCKLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEFQfj///8HIQpBiICAgHghDSALIAxNDQL9ESAO/RwBIAX9HAIhEiAMIQUDQCADIAVBAnQiAmogASAAIAJqKAIAQQR0av0AAAAgEv21ASIR/RsAIBH9GwFqIBH9GwJqIgI2AgAgAiAKIAIgCkgbIQogAiANIAIgDUobIQ0gBUEBaiIFIAtHDQALDAILIA0EQEH4////ByEKQYiAgIB4IQ0gCyAMTQ0CIAwhBQNAIAMgBUECdCIBagJ/IAIgACABaigCAEECdGoqAgC7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAsiDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgD0UEQCALIAxNDQEgBSoCKCEUIAUqAhghFSAFKgIIIRZB+P///wchCkGIgICAeCENIAwhBQNAAn8gFCABIAAgBUECdCIHaigCAEEEdGoiAioCCJQgFiACKgIAlCAVIAIqAgSUkpK7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDiADIAdqIA42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gBUEBaiIFIAtHDQALDAILIAsgDE0NAEF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiG2ooAgBBAnQiHGooAgAiDkcEQCAFKgI4IhQgCCAOQQZ0aiIPKgI8lCAFKgIoIhUgDyoCOJQgBSoCCCIWIA8qAjCUIAUqAhgiFyAPKgI0lJKSkiEYIBQgDyoCLJQgFSAPKgIolCAWIA8qAiCUIBcgDyoCJJSSkpIhGSAUIA8qAhyUIBUgDyoCGJQgFiAPKgIQlCAXIA8qAhSUkpKSIRogFCAPKgIMlCAVIA8qAgiUIBYgDyoCAJQgFyAPKgIElJKSkiEUIA4hDwsgAyAbagJ/IBggASAcQQJ0aiIOKgIMlCAZIA4qAgiUIBQgDioCAJQgGiAOKgIElJKSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAJBAWoiAiALRw0ACwwBC0GIgICAeCENQfj///8HIQoLIAsgDEsEQCAJQQFrsyANsiAKspOVIRQgDCENA0ACfyAUIAMgDUECdGoiASgCACAKa7KUIhWLQwAAAE9dBEAgFagMAQtBgICAgHgLIQ4gASAONgIAIAQgDkECdGoiASABKAIAQQFqNgIAIA1BAWoiDSALRw0ACwsgCUECTwRAIAQoAgAhDUEBIQoDQCAEIApBAnRqIgEgASgCACANaiINNgIAIApBAWoiCiAJRw0ACwsgDEEASgRAIAwhCgNAIAYgCkEBayIBQQJ0IgJqIAAgAmooAgA2AgAgCkEBSyABIQoNAAsLIAsgDEoEQCALIQoDQCAGIAsgBCADIApBAWsiCkECdCIBaigCAEECdGoiAigCACIFa0ECdGogACABaigCADYCACACIAVBAWs2AgAgCiAMSg0ACwsL") : s = $r : (s = $r, c && c.major <= 16 && c.minor < 4 && (s = "AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACDwEDZW52Bm1lbW9yeQIAAAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQqiDwICAAucDwMBfAd9Bn8gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEFA0AgAyAFQQJ0IgFqIAIgACABaigCAEECdGooAgAiATYCACABIAogASAKSBshCiABIA0gASANShshDSAFQQFqIgUgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiGmooAgBBAnQiG2ooAgAiDkcEQAJ/IAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRgCfyARIA8qAiyUIBIgDyoCKJQgEyAPKgIglCAUIA8qAiSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRkCfyARIA8qAhyUIBIgDyoCGJQgEyAPKgIQlCAUIA8qAhSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRwCfyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIR0gDiEPCyADIBpqIAEgG0ECdGoiDigCBCAcbCAOKAIAIB1saiAOKAIIIBlsaiAOKAIMIBhsaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAii7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshAgJ/IAUqAhi7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshByALIAxNAn8gBSoCCLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEPQfj///8HIQpBiICAgHghDQ0CIAwhBQNAIAMgBUECdCIIaiABIAAgCGooAgBBBHRqIggoAgQgB2wgCCgCACAPbGogCCgCCCACbGoiCDYCACAIIAogCCAKSBshCiAIIA0gCCANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEFA0AgAyAFQQJ0IgFqAn8gAiAAIAFqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAVBAWoiBSALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIREgBSoCGCESIAUqAgghE0H4////ByEKQYiAgIB4IQ0gDCEFA0ACfyARIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCATIAIqAgCUIBIgAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIYaigCAEECdCIZaigCACIORwRAIAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSIRUgESAPKgIslCASIA8qAiiUIBMgDyoCIJQgFCAPKgIklJKSkiEWIBEgDyoCHJQgEiAPKgIYlCATIA8qAhCUIBQgDyoCFJSSkpIhFyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSIREgDiEPCyADIBhqAn8gFSABIBlBAnRqIg4qAgyUIBYgDioCCJQgESAOKgIAlCAXIA4qAgSUkpKSu0QAAAAAAACwQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIg42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gAkEBaiICIAtHDQALDAELQYiAgIB4IQ1B+P///wchCgsgCyAMSwRAIAlBAWuzIA2yIAqyk5UhESAMIQ0DQAJ/IBEgAyANQQJ0aiIBKAIAIAprspQiEotDAAAAT10EQCASqAwBC0GAgICAeAshDiABIA42AgAgBCAOQQJ0aiIBIAEoAgBBAWo2AgAgDUEBaiINIAtHDQALCyAJQQJPBEAgBCgCACENQQEhCgNAIAQgCkECdGoiASABKAIAIA1qIg02AgAgCkEBaiIKIAlHDQALCyAMQQBKBEAgDCEKA0AgBiAKQQFrIgFBAnQiAmogACACaigCADYCACAKQQFLIAEhCg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCws="));
			let l = atob(s), u = new Uint8Array(l.length);
			for (let e = 0; e < l.length; e++) u[e] = l.charCodeAt(e);
			return o.postMessage({ init: {
				sorterWasmBytes: u.buffer,
				splatCount: e,
				useSharedMemory: t,
				integerBasedSort: r,
				dynamicMode: i,
				distanceMapRange: 1 << a,
				Constants: {
					BytesPerFloat: K.BytesPerFloat,
					BytesPerInt: K.BytesPerInt,
					MemoryPageSize: K.MemoryPageSize,
					MaxScenes: K.MaxScenes
				}
			} }), o;
		}(r, this.sharedMemoryForWorkers, this.enableSIMDInSort, this.integerBasedSort, this.splatMesh.dynamicMode, this.splatSortDistanceMapPrecision), new Promise((e) => {
			this.sortWorker.onmessage = (i) => {
				if (i.data.sortDone) {
					if (this.sortRunning = !1, Array.from({ length: this.gaussianSplatCount }, (e, t) => t), this.sharedMemoryForWorkers) this.splatMesh.updateRenderIndexes(this.sortWorkerSortedIndexes, i.data.splatRenderCount);
					else {
						let e = new Uint32Array(i.data.sortedIndexes.buffer, 0, i.data.splatRenderCount);
						this.splatMesh.updateRenderIndexes(e, i.data.splatRenderCount);
					}
					this.lastSplatSortCount = this.splatSortCount, this.lastSortTime = i.data.sortTime, this.sortPromiseResolver(), this.sortPromiseResolver = null, this.forceRenderNextFrame(), this.runAfterNextSort.length > 0 && (this.runAfterNextSort.forEach((e) => {
						e();
					}), this.runAfterNextSort.length = 0);
				} else if (i.data.sortCanceled) this.sortRunning = !1;
				else if (i.data.sortSetupPhase1Complete) {
					this.logLevel >= De.Info && ti.info("Sorting web worker WASM setup complete."), this.sharedMemoryForWorkers ? (this.sortWorkerSortedIndexes = new Uint32Array(i.data.sortedIndexesBuffer, i.data.sortedIndexesOffset, r), this.sortWorkerIndexesToSort = new Uint32Array(i.data.indexesToSortBuffer, i.data.indexesToSortOffset, r), this.sortWorkerPrecomputedDistances = new t(i.data.precomputedDistancesBuffer, i.data.precomputedDistancesOffset, r), this.sortWorkerTransforms = new Float32Array(i.data.transformsBuffer, i.data.transformsOffset, 16 * K.MaxScenes)) : (this.sortWorkerIndexesToSort = new Uint32Array(r), this.sortWorkerPrecomputedDistances = new t(r), this.sortWorkerTransforms = new Float32Array(16 * K.MaxScenes));
					for (let e = 0; e < n; e++) this.sortWorkerIndexesToSort[e] = e;
					if (this.sortWorker.maxSplatCount = r, this.logLevel >= De.Info) {
						ti.info("Sorting web worker ready.");
						let e = this.splatMesh.getSplatDataTextures(), t = e.covariances.size, n = e.centerColors.size;
						ti.info("Covariances texture size: " + t.x + " x " + t.y), ti.info("Centers/colors texture size: " + n.x + " x " + n.y);
					}
					e();
				}
			};
		});
	}
	disposeSortWorker() {
		this.sortWorker && this.sortWorker.terminate(), this.sortWorker = null, this.sortPromise = null, this.sortPromiseResolver &&= (this.sortPromiseResolver(), null), this.preSortMessages = [], this.sortRunning = !1;
	}
	removeSplatScene(e, t = !0) {
		return this.removeSplatScenes([e], t);
	}
	removeSplatScenes(e, t = !0) {
		if (this.isLoadingOrUnloading()) throw Error("Cannot remove splat scene while another load or unload is already in progress.");
		if (this.isDisposingOrDisposed()) throw Error("Cannot remove splat scene after dispose() is called.");
		let n;
		return this.splatSceneRemovalPromise = new Promise((r, i) => {
			let a;
			t && (this.loadingSpinner.removeAllTasks(), this.loadingSpinner.show(), a = this.loadingSpinner.addTask("Removing splat scene..."));
			let o = () => {
				t && (this.loadingSpinner.hide(), this.loadingSpinner.removeTask(a));
			}, s = (e) => {
				o(), this.splatSceneRemovalPromise = null, e ? i(e) : r();
			}, c = () => !!this.isDisposingOrDisposed() && (s(), !0);
			n = this.sortPromise || Promise.resolve(), n.then(() => {
				if (c()) return;
				let t = [], r = [], i = [];
				for (let n = 0; n < this.splatMesh.scenes.length; n++) {
					let a = !1;
					for (let t of e) if (t === n) {
						a = !0;
						break;
					}
					if (!a) {
						let e = this.splatMesh.scenes[n];
						t.push(e.splatBuffer), r.push(this.splatMesh.sceneOptions[n]), i.push({
							position: e.position.clone(),
							quaternion: e.quaternion.clone(),
							scale: e.scale.clone()
						});
					}
				}
				this.disposeSortWorker(), this.splatMesh.dispose(), this.sceneRevealMode = je.Instant, this.createSplatMesh(), this.addSplatBuffers(t, r, !0, !1, !0).then(() => {
					c() || (o(), this.splatMesh.scenes.forEach((e, t) => {
						e.position.copy(i[t].position), e.quaternion.copy(i[t].quaternion), e.scale.copy(i[t].scale);
					}), this.splatMesh.updateTransforms(), this.splatRenderReady = !1, this.runSplatSort(!0).then(() => {
						c() ? this.splatRenderReady = !0 : (n = this.sortPromise || Promise.resolve(), n.then(() => {
							this.splatRenderReady = !0, s();
						}));
					}));
				}).catch((e) => {
					s(e);
				});
			});
		}), this.splatSceneRemovalPromise;
	}
	start() {
		if (!this.selfDrivenMode) throw Error("Cannot start viewer unless it is in self driven mode.");
		this.requestFrameId = requestAnimationFrame(this.selfDrivenUpdateFunc), this.selfDrivenModeRunning = !0;
	}
	stop() {
		this.selfDrivenMode && this.selfDrivenModeRunning && (cancelAnimationFrame(this.requestFrameId), this.selfDrivenModeRunning = !1);
	}
	async dispose() {
		if (this.isDisposingOrDisposed()) return this.disposePromise;
		for (let e of this.splatSceneDownloadControllers) e.abort();
		let e = [];
		return this.sortPromise && e.push(this.sortPromise), this.disposing = !0, this.disposePromise = Promise.all(e).finally(() => {
			this.stop(), this.orthographicControls &&= (this.orthographicControls.dispose(), null), this.perspectiveControls &&= (this.perspectiveControls.dispose(), null), this.controls = null, this.splatMesh &&= (this.splatMesh.dispose(), null), this.avatarMesh &&= (yt(this.avatarMesh), null), this.sceneHelper &&= (this.sceneHelper.dispose(), null), this.resizeObserver &&= (this.resizeObserver.unobserve(this.rootElement), null), this.disposeSortWorker(), this.removeEventHandlers(), this.loadingSpinner.removeAllTasks(), this.loadingSpinner.setContainer(null), this.loadingProgressBar.hide(), this.loadingProgressBar.setContainer(null), this.camera = null, this.threeScene = null, this.splatRenderReady = !1, this.initialized = !1, this.renderer &&= (this.usingExternalRenderer || (this.rootElement.removeChild(this.renderer.domElement), this.renderer.dispose()), null), this.usingExternalRenderer, this.sortWorkerSortedIndexes = null, this.sortWorkerIndexesToSort = null, this.sortWorkerPrecomputedDistances = null, this.sortWorkerTransforms = null, this.disposed = !0, this.disposing = !1, this.disposePromise = null;
		}), this.disposePromise;
	}
	vsyncNum = 4;
	selfDrivenUpdate() {
		this.selfDrivenMode && (this.requestFrameId = requestAnimationFrame(this.selfDrivenUpdateFunc)), this.vsyncCount++, this.vsyncCount < this.vsyncNum || (this.vsyncCount = 0, this.update(), this.shouldRender() ? (this.render(), this.consecutiveRenderFrames++) : this.consecutiveRenderFrames = 0, this.renderNextFrame = !1);
	}
	forceRenderNextFrame() {
		this.renderNextFrame = !0;
	}
	shouldRender = function() {
		let e = 0, t = new k(), n = new _(), r = 1e-4;
		return function() {
			if (!this.initialized || !this.splatRenderReady || this.isDisposingOrDisposed()) return !1;
			let i = !1, a = !1;
			if (this.camera) {
				let e = this.camera.position, i = this.camera.quaternion;
				a = Math.abs(e.x - t.x) > r || Math.abs(e.y - t.y) > r || Math.abs(e.z - t.z) > r || Math.abs(i.x - n.x) > r || Math.abs(i.y - n.y) > r || Math.abs(i.z - n.z) > r || Math.abs(i.w - n.w) > r;
			}
			return i = this.renderMode !== Oe.Never && (e === 0 || this.splatMesh.visibleRegionChanging || a || this.renderMode === Oe.Always || !0 === this.dynamicMode || this.renderNextFrame), this.camera && (t.copy(this.camera.position), n.copy(this.camera.quaternion)), e++, i;
		};
	}();
	render = function() {
		if (!this.initialized || !this.splatRenderReady || this.isDisposingOrDisposed()) return;
		let e = this.renderer.autoClear;
		((e) => {
			for (let t of e.children) if (t.visible) return !0;
			return !1;
		})(this.threeScene) && (this.renderer.render(this.threeScene, this.camera), this.renderer.autoClear = !1), this.renderer.render(this.splatMesh, this.camera), this.renderer.autoClear = !1, this.sceneHelper.getFocusMarkerOpacity() > 0 && this.renderer.render(this.sceneHelper.focusMarker, this.camera), this.showControlPlane && this.renderer.render(this.sceneHelper.controlPlane, this.camera), this.renderer.autoClear = e;
	};
	update(t, n) {
		let r = document.getElementById("fps");
		r && (r.textContent = `FPS: ${this.currentFPS}`), this.frame >= this.totalFrames && (this.frame = 0), this.dropInMode && this.updateForDropInMode(t, n), this.initialized && this.splatRenderReady && !this.isDisposingOrDisposed() && (this.controls && (this.controls.update(), this.camera.isOrthographicCamera && !this.usingExternalCamera && e.setCameraPositionFromZoom(this.camera, this.camera, this.controls)), this.runMorphUpdate(), this.runSplatSort(!0, !0), this.updateForRendererSizeChanges(), this.updateSplatMesh(), this.updateMeshCursor(), this.updateFPS(), this.timingSensitiveUpdates(), this.updateControlPlane());
	}
	sortedIndexes;
	updateForDropInMode(e, t) {
		this.renderer = e, this.splatMesh && this.splatMesh.setRenderer(this.renderer), this.camera = t, this.controls && (this.controls.object = t), this.init();
	}
	lastCalcTime = vt();
	fpsFrameCount = 0;
	updateFPS = () => {
		if (this.consecutiveRenderFrames > 60) {
			let e = vt();
			e - this.lastCalcTime >= 1 ? (this.currentFPS = this.fpsFrameCount, this.fpsFrameCount = 0, this.lastCalcTime = e) : this.fpsFrameCount++;
		} else this.currentFPS = null;
	};
	updateForRendererSizeChanges = function() {
		let e = new j(), t = new j(), n;
		return function() {
			this.usingExternalCamera || (this.renderer.getSize(t), n !== void 0 && n === this.camera.isOrthographicCamera && t.x === e.x && t.y === e.y || (this.camera.isOrthographicCamera ? (this.camera.left = -t.x / 2, this.camera.right = t.x / 2, this.camera.top = t.y / 2, this.camera.bottom = -t.y / 2) : this.camera.aspect = t.x / t.y, this.camera.updateProjectionMatrix(), e.copy(t), n = this.camera.isOrthographicCamera));
		};
	}();
	timingSensitiveUpdates = function() {
		let e;
		return function() {
			let t = vt();
			e ||= t;
			let n = t - e;
			this.updateCameraTransition(t), this.updateFocusMarker(n), e = t;
		};
	}();
	tempCameraTarget = new k();
	toPreviousTarget = new k();
	toNextTarget = new k();
	updateCameraTransition = (e) => {
		if (this.transitioningCameraTarget) {
			this.toPreviousTarget.copy(this.previousCameraTarget).sub(this.camera.position).normalize(), this.toNextTarget.copy(this.nextCameraTarget).sub(this.camera.position).normalize();
			let t = Math.acos(this.toPreviousTarget.dot(this.toNextTarget)), n = (t / (Math.PI / 3) * .65 + .3) / t * (e - this.transitioningCameraTargetStartTime);
			this.tempCameraTarget.copy(this.previousCameraTarget).lerp(this.nextCameraTarget, n), this.camera.lookAt(this.tempCameraTarget), this.controls.target.copy(this.tempCameraTarget), n >= 1 && (this.transitioningCameraTarget = !1);
		}
	};
	updateFocusMarker = function() {
		let e = new j(), t = !1;
		return function(n) {
			if (this.getRenderDimensions(e), this.transitioningCameraTarget) {
				this.sceneHelper.setFocusMarkerVisibility(!0);
				let r = Math.max(this.sceneHelper.getFocusMarkerOpacity(), 0), i = Math.min(r + .4 * n, 1);
				this.sceneHelper.setFocusMarkerOpacity(i), this.sceneHelper.updateFocusMarker(this.nextCameraTarget, this.camera, e), t = !0, this.forceRenderNextFrame();
			} else {
				let r;
				if (r = t ? 1 : Math.min(this.sceneHelper.getFocusMarkerOpacity(), 1), r > 0) {
					this.sceneHelper.updateFocusMarker(this.nextCameraTarget, this.camera, e);
					let t = Math.max(r - .12 * n, 0);
					this.sceneHelper.setFocusMarkerOpacity(t), t === 0 && this.sceneHelper.setFocusMarkerVisibility(!1);
				}
				r > 0 && this.forceRenderNextFrame(), t = !1;
			}
		};
	}();
	updateMeshCursor = function() {
		let e = [], t = new j();
		return function() {
			this.showMeshCursor ? (this.forceRenderNextFrame(), this.getRenderDimensions(t), e.length = 0, this.raycaster.setFromCameraAndScreenPosition(this.camera, this.mousePosition, t), this.raycaster.intersectSplatMesh(this.splatMesh, e), e.length > 0 ? (this.sceneHelper.setMeshCursorVisibility(!0), this.sceneHelper.positionAndOrientMeshCursor(e[0].origin, this.camera)) : this.sceneHelper.setMeshCursorVisibility(!1)) : (this.sceneHelper.getMeschCursorVisibility() && this.forceRenderNextFrame(), this.sceneHelper.setMeshCursorVisibility(!1));
		};
	}();
	updateInfoPanel = function() {
		let e = new j();
		return function() {
			if (!this.showInfo) return;
			let t = this.splatMesh.getSplatCount();
			this.getRenderDimensions(e), this.controls && this.controls.target, this.showMeshCursor && this.sceneHelper.meshCursor.position, t > 0 && this.splatRenderCount;
		};
	}();
	updateControlPlane() {
		this.showControlPlane ? (this.sceneHelper.setControlPlaneVisibility(!0), this.sceneHelper.positionAndOrientControlPlane(this.controls.target, this.camera.up)) : this.sceneHelper.setControlPlaneVisibility(!1);
	}
	mvpMatrix = new r();
	cameraPositionArray = [];
	lastSortViewDir = new k(0, 0, -1);
	sortViewDir = new k(0, 0, -1);
	lastSortViewPos = new k();
	sortViewOffset = new k();
	queuedSorts = [];
	partialSorts = [
		{
			angleThreshold: .55,
			sortFractions: [
				.125,
				.33333,
				.75
			]
		},
		{
			angleThreshold: .65,
			sortFractions: [.33333, .66667]
		},
		{
			angleThreshold: .8,
			sortFractions: [.5]
		}
	];
	runSplatSort = (e = !1, t = !1) => {
		if (!this.initialized) return Promise.resolve(!1);
		if (this.sortRunning) return Promise.resolve(!0);
		if (this.splatMesh.getSplatCount() <= 0) return this.splatRenderCount = 0, Promise.resolve(!1);
		let n = 0, r = 0, i = !1, a = !1;
		if (this.sortViewDir.set(0, 0, -1).applyQuaternion(this.camera.quaternion), n = this.sortViewDir.dot(this.lastSortViewDir), r = this.sortViewOffset.copy(this.camera.position).sub(this.lastSortViewPos).length(), !(e || this.splatMesh.dynamicMode || this.queuedSorts.length !== 0 || (n <= .99 && (i = !0), r >= 1 && (a = !0), i || a))) return Promise.resolve(!1);
		this.sortRunning = !0;
		let { splatRenderCount: o, shouldSortAll: s } = this.gatherSceneNodesForSort();
		s ||= t, this.splatRenderCount = o, this.mvpMatrix.copy(this.camera.matrixWorld).invert();
		let c = this.perspectiveCamera || this.camera;
		this.mvpMatrix.premultiply(c.projectionMatrix), this.splatMesh.dynamicMode || this.mvpMatrix.multiply(this.splatMesh.matrixWorld);
		let l = Promise.resolve(!0);
		return this.gpuAcceleratedSort && (this.queuedSorts.length <= 1 || this.queuedSorts.length % 2 == 0) && (l = this.splatMesh.computeDistancesOnGPU(this.mvpMatrix, this.sortWorkerPrecomputedDistances)), l.then(() => {
			if (this.queuedSorts.length === 0) {
				if (this.splatMesh.dynamicMode || s) this.queuedSorts.push(this.splatRenderCount);
				else {
					for (let e of this.partialSorts) if (n < e.angleThreshold) {
						for (let t of e.sortFractions) this.queuedSorts.push(Math.floor(this.splatRenderCount * t));
						break;
					}
					this.queuedSorts.push(this.splatRenderCount);
				}
			}
			let e = Math.min(this.queuedSorts.shift(), this.splatRenderCount);
			this.splatSortCount = e, this.cameraPositionArray[0] = this.camera.position.x, this.cameraPositionArray[1] = this.camera.position.y, this.cameraPositionArray[2] = this.camera.position.z;
			let t = {
				modelViewProj: this.mvpMatrix.elements,
				cameraPosition: this.cameraPositionArray,
				splatRenderCount: this.splatRenderCount,
				splatSortCount: e,
				usePrecomputedDistances: this.gpuAcceleratedSort
			};
			return this.splatMesh.dynamicMode && this.splatMesh.fillTransformsArray(this.sortWorkerTransforms), this.sharedMemoryForWorkers || (t.indexesToSort = this.sortWorkerIndexesToSort, t.transforms = this.sortWorkerTransforms, this.gpuAcceleratedSort && (t.precomputedDistances = this.sortWorkerPrecomputedDistances)), this.sortPromise = new Promise((e) => {
				this.sortPromiseResolver = e;
			}), this.preSortMessages.length > 0 && (this.preSortMessages.forEach((e) => {
				this.sortWorker.postMessage(e);
			}), this.preSortMessages = []), this.sortWorker.postMessage({ sort: t }), this.queuedSorts.length === 0 && (this.lastSortViewPos.copy(this.camera.position), this.lastSortViewDir.copy(this.sortViewDir)), !0;
		}), l;
	};
	gatherSceneNodesForSort = function() {
		let e = [], t = null, n = new k(), i = new k(), a = new k(), o = new r(), s = new r(), c = new r(), l = new k(), u = new k(0, 0, -1), d = new k(), f = (e) => d.copy(e.max).sub(e.min).length();
		return function(r = !1) {
			this.getRenderDimensions(l);
			let d = l.y / 2 / Math.tan(this.camera.fov / 2 * h.DEG2RAD), p = Math.atan(l.x / 2 / d), m = Math.atan(l.y / 2 / d), g = Math.cos(p), _ = Math.cos(m), v = this.splatMesh.getSplatTree();
			if (v) {
				s.copy(this.camera.matrixWorld).invert(), this.splatMesh.dynamicMode || s.multiply(this.splatMesh.matrixWorld);
				let t = 0, l = 0;
				for (let d = 0; d < v.subTrees.length; d++) {
					let p = v.subTrees[d];
					o.copy(s), this.splatMesh.dynamicMode && (this.splatMesh.getSceneTransform(d, c), o.multiply(c));
					let m = p.nodesWithIndexes.length;
					for (let s = 0; s < m; s++) {
						let c = p.nodesWithIndexes[s];
						if (!c.data || !c.data.indexes || c.data.indexes.length === 0) continue;
						a.copy(c.center).applyMatrix4(o);
						let d = a.length();
						a.normalize(), n.copy(a).setX(0).normalize(), i.copy(a).setY(0).normalize();
						let m = u.dot(i), h = u.dot(n), v = f(c);
						!r && (m < g - .6 || h < _ - .6) && d > v || (l += c.data.indexes.length, e[t] = c, c.data.distanceToNode = d, t++);
					}
				}
				e.length = t, e.sort((e, t) => e.data.distanceToNode < t.data.distanceToNode ? -1 : 1);
				let d = l * K.BytesPerInt;
				for (let n = 0; n < t; n++) {
					let t = e[n], r = t.data.indexes.length, i = r * K.BytesPerInt;
					new Uint32Array(this.sortWorkerIndexesToSort.buffer, d - i, r).set(t.data.indexes), d -= i;
				}
				return {
					splatRenderCount: l,
					shouldSortAll: !1
				};
			}
			{
				let e = this.splatMesh.getSplatCount();
				if (!t || t.length !== e) {
					t = new Uint32Array(e);
					for (let n = 0; n < e; n++) t[n] = n;
				}
				return this.sortWorkerIndexesToSort.set(t), {
					splatRenderCount: e,
					shouldSortAll: !0
				};
			}
		};
	}();
	getSplatMesh() {
		return this.splatMesh;
	}
	getSplatScene(e) {
		return this.splatMesh.getScene(e);
	}
	getSceneCount() {
		return this.splatMesh.getSceneCount();
	}
	isMobile() {
		return navigator.userAgent.includes("Mobi");
	}
	updateMorphTarget(e) {
		this.avatarMesh = e, this.splatMesh.flameModel = e, this.runMorphUpdate(), this.splatMesh.gaussianSplatCount = this.gaussianSplatCount;
	}
	runMorphUpdate() {
		this.gaussianSplatCount = this.avatarMesh.geometry.attributes.position.count;
		var e = new Float32Array(this.avatarMesh.geometry.attributes.position.array);
		if (this.splatMesh.bonesNum = 5, this.skinModel.skeleton.update(), this.boneRoot.updateMatrixWorld(!0), this.splatMesh.geometry.getAttribute("splatIndex") && !1 === this.setSkinAttibutes) {
			this.setSkinAttibutes = !0;
			let e = this.splatMesh.geometry, t = this.skinModel.geometry.attributes.skinIndex, n = this.skinModel.geometry.attributes.skinWeight, r = new o(new t.array.constructor(t.array), 4, t.normalized, 1), i = new o(new n.array.constructor(n.array), 4, n.normalized, 1);
			r.setUsage(ne), i.setUsage(ne), e.setAttribute("skinIndex", r), e.setAttribute("skinWeight", i), typeof this.splatMesh.buildSkinningTextures == "function" && this.splatMesh.buildSkinningTextures(this.skinModel);
		}
		this.splatMesh.morphedMesh = e;
		let t = this.splatMesh.morphedMesh.length / 3;
		this.splatMesh.splatDataTextures.flameModel != null && this.splatMesh.updateTetureAfterBSAndSkeleton(0, t - 1, !1);
	}
}, $ = dt("GaussianSplatRenderer"), oi = 0, si = 1.8, ci = 1, li = -10, ui = 0, di = 0, fi = "ffffff", pi = {
	offset: {},
	scale: {}
}, mi = {
	hello: {
		size: 0,
		isGroup: !1
	},
	speak: {
		size: 6,
		isGroup: !1
	},
	think: {
		size: 0,
		isGroup: !1
	},
	listen: {
		size: 0,
		isGroup: !1
	},
	idle: {
		size: 1,
		isGroup: !1
	},
	other: []
}, hi = {
	out: 21.4,
	in: 9.6,
	up: 14.2,
	down: 11.9
}, gi = class e {
	static async create(t, n, r = {}) {
		try {
			tn(t, "container"), Wt(n), r.downloadProgress && $t(r.downloadProgress, "options.downloadProgress", !1), r.loadProgress && $t(r.loadProgress, "options.loadProgress", !1), r.getChatState && $t(r.getChatState, "options.getChatState", !1), r.getExpressionData && $t(r.getExpressionData, "options.getExpressionData", !1), r.getNeckPose && $t(r.getNeckPose, "options.getNeckPose", !1), r.getGazeOffset && $t(r.getGazeOffset, "options.getGazeOffset", !1), r.backgroundColor && en(r.backgroundColor, "options.backgroundColor"), $.info("Initializing GaussianSplatRenderer", { assetPath: n });
			let i = n, a, o, s, c;
			try {
				if (a = new URL(i, typeof window < "u" ? window.location.href : void 0).pathname.match(/\/([^/]+?)\.zip/)?.[1], !a) throw new q("Character model name could not be extracted from path. Expected format: /path/name.zip", "assetPath");
			} catch (e) {
				throw e instanceof q ? e : new q(`Invalid asset path format: ${e.message}`, "assetPath", e);
			}
			typeof NProgress < "u" && NProgress.start(), $.info("Downloading asset ZIP", { path: i });
			try {
				if (o = await fetch(i), !o.ok) throw new tt(`Failed to download asset: ${o.statusText}`, o.status);
			} catch (e) {
				throw e instanceof tt ? e : new tt(`Network error downloading asset: ${e.message}`, 0, e);
			}
			if (r.downloadProgress) try {
				r.downloadProgress(1);
			} catch (e) {
				$.warn("Error in downloadProgress callback", e);
			}
			if (r.loadProgress) try {
				r.loadProgress(.1);
			} catch (e) {
				$.warn("Error in loadProgress callback", e);
			}
			typeof NProgress < "u" && NProgress.done();
			try {
				s = await o.arrayBuffer();
			} catch (e) {
				throw new tt(`Failed to read response data: ${e.message}`, 0, e);
			}
			$.debug("Unpacking ZIP archive");
			try {
				c = await ae.default.loadAsync(s);
			} catch (e) {
				throw new nt(`Failed to unpack ZIP archive: ${e.message}`, i, e);
			}
			let l = "";
			if (Object.values(c.files).forEach((e) => {
				e.dir && (l = e.name?.slice(0, e.name?.length - 1));
			}), !l) throw new nt("No folder found in ZIP archive. Expected ZIP to contain a folder with model files.", i);
			$.debug("Found model folder in ZIP", { fileName: l }), $.debug("Creating GaussianSplatRenderer instance");
			let u = new e(t, c), d = ln.set(oi, si, ci), f = new k(li, ui, di);
			$.debug("Camera setup", {
				position: {
					x: d.x,
					y: d.y,
					z: d.z
				},
				rotation: {
					x: f.x,
					y: f.y,
					z: f.z
				}
			});
			let p = 16777215;
			try {
				p = parseInt(fi, 16), r?.backgroundColor && (u.isHexColorStrict(r.backgroundColor) ? p = parseInt(r.backgroundColor, 16) : $.warn("Invalid backgroundColor option, using config value", { value: r.backgroundColor }));
			} catch (e) {
				$.warn("Error parsing backgroundColor, using default", e);
			}
			$.debug("Background color set", { backgroundColor: p.toString(16) }), u.getChatState = r?.getChatState, u.getExpressionData = r?.getExpressionData, u.getNeckPose = r?.getNeckPose, u.getGazeOffset = r?.getGazeOffset, $.debug("Checking for iris_occlusion.json");
			let m, h = null;
			try {
				h = await u._loadJsonFromZip(l + "/iris_occlusion.json"), h ? ($.info("Iris occlusion configuration loaded", {
					rightIrisRanges: h.right_iris?.length ?? 0,
					leftIrisRanges: h.left_iris?.length ?? 0
				}), u.irisOcclusionConfig = h) : $.debug("No iris_occlusion.json found, iris occlusion will be disabled");
			} catch (e) {
				$.warn("Failed to load iris_occlusion.json, continuing without it", { error: e.message }), u.irisOcclusionConfig = null;
			}
			$.debug("Creating Viewer instance");
			try {
				u.viewer = new ai({
					rootElement: t,
					threejsCanvas: u._canvas,
					cameraUp: [
						0,
						1,
						0
					],
					initialCameraPosition: [
						d.x,
						d.y,
						d.z
					],
					initialCameraRotation: [
						f.x,
						f.y,
						f.z
					],
					sphericalHarmonicsDegree: 0,
					backgroundColor: p,
					sceneRevealMode: je.Default,
					sceneFadeInRateMultiplier: 3,
					irisOcclusionConfig: h
				});
			} catch (e) {
				throw new it(`Failed to create Viewer instance: ${e.message}`, e);
			}
			$.info("Loading model", { fileName: l });
			try {
				await u.loadModel(l, mi, pi);
			} catch (e) {
				throw new nt(`Failed to load model: ${e.message}`, l, e);
			}
			if (r.loadProgress) try {
				r.loadProgress(.2);
			} catch (e) {
				$.warn("Error in loadProgress callback", e);
			}
			$.debug("Loading offset PLY file");
			try {
				m = await u.unpackFileAsBlob(l + "/offset.ply");
			} catch (e) {
				throw new nt(`Failed to load offset.ply: ${e.message}`, l + "/offset.ply", e);
			}
			if (r.loadProgress) try {
				r.loadProgress(.3);
			} catch (e) {
				$.warn("Error in loadProgress callback", e);
			}
			$.debug("Adding splat scene");
			try {
				await u.viewer.addSplatScene(m, {
					progressiveLoad: !0,
					sharedMemoryForWorkers: !1,
					showLoadingUI: !1,
					format: ke.Ply
				});
			} catch (e) {
				throw new it(`Failed to add splat scene: ${e.message}`, e);
			}
			try {
				u.render();
			} catch (e) {
				$.error("Error in initial render", e);
			}
			if (r.loadProgress) try {
				r.loadProgress(1);
			} catch (e) {
				$.warn("Error in loadProgress callback", e);
			}
			return $.info("GaussianSplatRenderer initialized successfully"), u;
		} catch (e) {
			throw e instanceof q || e instanceof tt || e instanceof nt || e instanceof it ? ($.error("Initialization failed", {
				errorCode: e.code,
				message: e.message
			}), e) : ($.error("Unexpected error during initialization", e), new it(`Unexpected error initializing GaussianSplatRenderer: ${e.message}`, e));
		}
	}
	static async getInstance(e, t, n = {}) {
		return $.warn("getInstance() is deprecated. Use create() instead. Each call creates a new instance."), this.create(e, t, n);
	}
	constructor(e, t) {
		if ($.debug("GaussianSplatRenderer constructor called"), this._disposed = !1, this._blobUrlManager = new bn(), this.zipUrls = {
			urls: /* @__PURE__ */ new Map(),
			zip: t
		}, this.lastTime = 0, this.startTime = 0, this.expressionData = {}, this.chatState = J.Idle, this._canvas = null, typeof document < "u" && e) {
			this._canvas = document.createElement("canvas");
			let { width: t, height: n } = e.getBoundingClientRect();
			this._canvas.style.visibility = "visible", this._canvas.width = t, this._canvas.height = n, e.appendChild(this._canvas), $.debug("Canvas setup", {
				width: t,
				height: n
			});
		}
		this.clock = new D(), this.startTime = performance.now() / 1e3, this.viewer = null, this.mixer = null, this.animManager = null, this.model = null, this.irisOcclusionConfig = null, this.motioncfg = null, this.getChatState = null, this.getExpressionData = null, this.getNeckPose = null, this._overridableBones = null, $.debug("GaussianSplatRenderer instance created");
	}
	_assertNotDisposed() {
		if (this._disposed) throw new rt("GaussianSplatRenderer has been disposed");
	}
	dispose() {
		if (this._disposed) $.warn("GaussianSplatRenderer.dispose() called on already disposed instance");
		else {
			$.info("Disposing GaussianSplatRenderer"), this._canvas &&= (this._canvas.style.visibility = "hidden", this._canvas.parentNode && this._canvas.parentNode.removeChild(this._canvas), null), this.disposeModel();
			try {
				this._blobUrlManager?.dispose();
			} catch (e) {
				$.error("Error disposing BlobUrlManager", e);
			}
			this.zipUrls?.urls && (this.zipUrls.urls.forEach((e) => {
				try {
					URL.revokeObjectURL(e);
				} catch (t) {
					$.warn("Error revoking blob URL", {
						url: e,
						error: t
					});
				}
			}), this.zipUrls.urls.clear()), this.viewer = null, this.mixer = null, this.animManager = null, this.model = null, this.motioncfg = null, this.getChatState = null, this.getExpressionData = null, this.getNeckPose = null, this._overridableBones = null, this.zipUrls = null, this._disposed = !0, e.instance = void 0, $.debug("GaussianSplatRenderer disposed successfully");
		}
	}
	disposeModel() {
		if ($.debug("Disposing model resources"), this._overridableBones = null, this.mixer) {
			try {
				this.mixer.stopAllAction(), this.viewer?.avatarMesh && this.mixer.uncacheRoot(this.viewer.avatarMesh);
			} catch (e) {
				$.error("Error disposing animation mixer", e);
			}
			this.mixer = null;
		}
		if (this.animManager) {
			try {
				this.animManager.dispose();
			} catch (e) {
				$.error("Error disposing animation manager", e);
			}
			this.animManager = null;
		}
		if (this.viewer) {
			try {
				this.viewer.dispose();
			} catch (e) {
				$.error("Error disposing viewer", e);
			}
			this.viewer = null;
		}
		$.debug("Model resources disposed");
	}
	getCamera() {
		return this.viewer?.camera;
	}
	updateBS(e) {
		let t = {
			browDownLeft: 0,
			browDownRight: 0,
			browInnerUp: 0,
			browOuterUpLeft: 0,
			browOuterUpRight: 0,
			mouthCheekPuff: 0,
			cheekSquintLeft: 0,
			cheekSquintRight: 0,
			eyeBlinkLeft: 0,
			eyeBlinkRight: 0,
			eyeLookDownLeft: 0,
			eyeLookDownRight: 0,
			eyeLookInLeft: 0,
			eyeLookInRight: 0,
			eyeLookOutLeft: 0,
			eyeLookOutRight: 0,
			eyeLookUpLeft: 0,
			eyeLookUpRight: 0,
			eyeSquintLeft: 0,
			eyeSquintRight: 0,
			eyeWideLeft: 0,
			eyeWideRight: 0,
			jawForward: 0,
			jawLeft: 0,
			jawOpen: 0,
			jawRight: 0,
			mouthClose: 0,
			mouthDimpleLeft: 0,
			mouthDimpleRight: 0,
			mouthFrownLeft: 0,
			mouthFrownRight: 0,
			mouthFunnel: 0,
			mouthLeft: 0,
			mouthLowerDownLeft: 0,
			mouthLowerDownRight: 0,
			mouthPressLeft: 0,
			mouthPressRight: 0,
			mouthPucker: 0,
			mouthRight: 0,
			mouthRollLower: 0,
			mouthRollUpper: 0,
			mouthShrugLower: 0,
			mouthShrugUpper: 0,
			mouthSmileLeft: 0,
			mouthSmileRight: 0,
			mouthStretchLeft: 0,
			mouthStretchRight: 0,
			mouthUpperUpLeft: 0,
			mouthUpperUpRight: 0,
			noseSneerLeft: 0,
			noseSneerRight: 0,
			tongueOut: 0
		};
		return e != null && (t = e), t;
	}
	render() {
		if (!this.viewer || !this.viewer.selfDrivenMode) throw Error("Cannot start viewer unless it is in self driven mode.");
		{
			this.viewer.requestFrameId = requestAnimationFrame(() => this.render());
			let e = 1 / 30, t = performance.now() / 1e3, n = this.viewer.totalFrames || 1, r = (t - this.startTime) % (n * e), i = Math.floor(r / e);
			if (this.viewer.frame = i, this.getChatState && (this.chatState = this.getChatState(), this._lastLoggedState && this._lastLoggedState === this.chatState || ($.debug("Chat state changed", {
				newState: this.chatState,
				hasAnimManager: !!this.animManager
			}), this._lastLoggedState = this.chatState), this._clipPreviewActive || this.animManager?.update(this.chatState)), this.getExpressionData && (this.expressionData = this.updateBS(this.getExpressionData())), this.mixer && this.animManager) {
				let e = this.clock.getDelta();
				if (this.mixer.update(e), this.getNeckPose && this._applyNeckPose(this.getNeckPose()), this.getGazeOffset && this._applyCameraGaze(), this.motioncfg) for (let e in this.expressionData) {
					let t = this.motioncfg.offset?.[e], n = this.motioncfg.scale?.[e];
					t !== void 0 && n !== void 0 && (this.expressionData[e] = this.expressionData[e] * n + t);
				}
				this.setExpression();
			} else this._warnedOnce ||= ($.warn("Mixer or animManager not initialized, skipping animation update", {
				hasMixer: !!this.mixer,
				hasAnimManager: !!this.animManager
			}), !0), this.setExpression();
			this.viewer.update(this.viewer.renderer, this.viewer.camera);
			let a = this.viewer.shouldRender();
			this._renderLogCount <= 3 && $.debug("shouldRender check", { shouldRender: a }), a ? (this.viewer.render(), this.viewer.consecutiveRenderFrames++) : this.viewer.consecutiveRenderFrames = 0, this.viewer.renderNextFrame = !1, this.viewer.selfDrivenModeRunning = !0;
		}
	}
	isHexColorStrict(e) {
		return typeof e == "string" && /^(#|0x)[0-9A-Fa-f]{6}$/i.test(e);
	}
	_getOverridableBones() {
		if (this._overridableBones) return this._overridableBones;
		let e = this.viewer?.boneRoot;
		if (!e) return null;
		let t = {};
		return e.traverse((e) => {
			e.isBone && (t[e.name] = e);
		}), this._overridableBones = t, t;
	}
	_applyCameraGaze() {
		let e = this._getOverridableBones(), t = e && e.head, n = this.viewer && this.viewer.camera;
		if (!t || !n || !this.expressionData) return;
		let r = this.getGazeOffset();
		if (!r) return;
		t.getWorldPosition(ln), t.getWorldQuaternion(mn), un.copy(n.position).sub(ln).normalize(), mn.invert(), un.applyQuaternion(mn), this._gazeRestDir || (this._gazeRestDir = un.clone(), console.warn(`[gaze-lookat] rest direction captured: x=${un.x.toFixed(3)} y=${un.y.toFixed(3)} z=${un.z.toFixed(3)}`));
		let i = this._gazeRestDir, a = 180 / Math.PI, o = Math.atan2(un.x, un.z), s = Math.asin(Math.max(-1, Math.min(1, un.y))), c = (o - Math.atan2(i.x, i.z)) * a * 1, l = (s - Math.asin(Math.max(-1, Math.min(1, i.y)))) * a * 1, u = c + (r.yawDeg || 0), d = l + (r.pitchDeg || 0), f = performance.now();
		(!this._gazeLogMs || f - this._gazeLogMs > 1e3) && (this._gazeLogMs = f, console.warn(`[gaze-lookat] headComp(yaw=${c.toFixed(2)}°,pitch=${l.toFixed(2)}°) offset(${(r.yawDeg || 0).toFixed(2)},${(r.pitchDeg || 0).toFixed(2)}) eyes(yaw=${u.toFixed(2)}°,pitch=${d.toFixed(2)}°)`));
		let p = hi, m = this.expressionData;
		if (m.eyeLookOutLeft = 0, m.eyeLookInLeft = 0, m.eyeLookOutRight = 0, m.eyeLookInRight = 0, m.eyeLookUpLeft = 0, m.eyeLookUpRight = 0, m.eyeLookDownLeft = 0, m.eyeLookDownRight = 0, u > 0 ? (m.eyeLookOutLeft = Math.min(u / p.out, 1), m.eyeLookInRight = Math.min(u / p.in, 1)) : u < 0 && (m.eyeLookInLeft = Math.min(-u / p.in, 1), m.eyeLookOutRight = Math.min(-u / p.out, 1)), d > 0) {
			let e = Math.min(d / p.up, 1);
			m.eyeLookUpLeft = e, m.eyeLookUpRight = e;
		} else if (d < 0) {
			let e = Math.min(-d / p.down, 1);
			m.eyeLookDownLeft = e, m.eyeLookDownRight = e;
		}
	}
	listClips() {
		return (this.clips ?? []).map((e) => ({
			name: e.name,
			duration: e.duration
		}));
	}
	playClip(e, t = !0) {
		let n = (this.clips ?? []).find((t) => t.name === e);
		if (!n || !this.mixer) return null;
		this._clipPreviewActive = !0, this.mixer.stopAllAction();
		let r = this.mixer.clipAction(n);
		return r.reset(), r.loop = t ? s : p, r.clampWhenFinished = !0, r.setEffectiveTimeScale(1), r.setEffectiveWeight(1), r.play(), n.duration;
	}
	stopClipPreview() {
		this._clipPreviewActive && (this._clipPreviewActive = !1, this.mixer && this.mixer.stopAllAction(), this.animManager?.resetAllActions(!0));
	}
	_applyNeckPose(e) {
		if (!e) return;
		let t = this._getOverridableBones();
		if (!t) return;
		let n = (e, n) => {
			if (!Array.isArray(n) || n.length < 3) return;
			let r = t[e];
			r && (gn.set(n[0], n[1], n[2], "YXZ"), mn.setFromEuler(gn), r.quaternion.multiply(mn));
		};
		for (let t in e) Object.hasOwn(e, t) && n(t === "rotation" ? "hip" : t, e[t]);
	}
	setExpression() {
		if (this.viewer?.splatMesh) {
			this.viewer.splatMesh.bsWeight = this.expressionData;
			let e = this.viewer.splatMesh.material;
			if (e?.uniforms) {
				let t = this.expressionData.eyeBlinkLeft || 0, n = this.expressionData.eyeBlinkRight || 0;
				e.uniforms.eyeBlinkLeft && (e.uniforms.eyeBlinkLeft.value = t), e.uniforms.eyeBlinkRight && (e.uniforms.eyeBlinkRight.value = n);
			}
		}
		this.model && this.model.traverse((e) => {
			if (e.isMesh || e.isSkinnedMesh) {
				let t = e.geometry?.morphAttributes;
				if (t && Object.keys(t).length > 0) {
					let t = e.morphTargetDictionary;
					for (let n in t) {
						let r = t[n], i = this.expressionData[n];
						i !== void 0 && (e.morphTargetInfluences[r] = Math.max(0, Math.min(1, i)));
					}
				}
			}
		});
	}
	async loadModel(e, t, n) {
		let [r, i, a] = await Promise.all([
			this.unpackAndLoadGlb(e + "/skin.glb"),
			this.unpackAndLoadGlb(e + "/animation.glb"),
			this.unpackAndLoadJson(e + "/vertex_order.json")
		]);
		if (!this.viewer) throw Error("render viewer is not initialized");
		let o, s;
		r.traverse((e) => {
			e.isSkinnedMesh && (o = e), e instanceof V && e.name === "hip" && (s = e);
		}), this.viewer.sortedIndexes = a, o && (this.viewer.gaussianSplatCount = o.geometry.attributes.position.count), this.viewer.avatarMesh = r, this.viewer.skinModel = o, this.viewer.boneRoot = s, this.mixer = new b(r), this.animManager = new Y(this.mixer, i, t), this.motioncfg = n, this.clips = Array.isArray(i) ? i : [], Array.isArray(i) && i.length > 0 && i[0].duration ? this.viewer.totalFrames = Math.floor(30 * i[0].duration) : this.viewer.totalFrames = 1, $.debug("Total frames calculated", { totalFrames: this.viewer.totalFrames }), o && this.viewer.updateMorphTarget(o), this.viewer.threeScene.add(r), r.visible = !1, o && o.skeleton.computeBoneTexture();
	}
	async unpackFileAsBlob(e) {
		if (this._assertNotDisposed(), this.zipUrls.urls.has(e)) return $.debug("Returning cached blob URL", { path: e }), this.zipUrls.urls.get(e);
		$.debug("Unpacking file from ZIP", { path: e });
		let t = this.zipUrls.zip?.file(e);
		if (!t) throw new nt(`File not found in ZIP archive: ${e}`, e);
		let n;
		try {
			n = await t.async("blob");
		} catch (t) {
			throw new nt(`Failed to extract file from ZIP: ${t.message}`, e, t);
		}
		if (!n) throw new nt(`File extracted but blob is empty: ${e}`, e);
		let r = this._getMimeType(e), i = this._blobUrlManager.createBlobUrl(n, r, `zip:${e}`);
		return this.zipUrls.urls.set(e, i), $.debug("Blob URL created and cached", {
			path: e,
			url: i.substring(0, 50)
		}), i;
	}
	async _loadJsonFromZip(e) {
		this._assertNotDisposed(), $.debug("Attempting to load JSON from ZIP", { path: e });
		let t = this.zipUrls.zip?.file(e);
		if (!t) return $.debug("JSON file not found in ZIP, returning null", { path: e }), null;
		let n;
		try {
			n = await t.async("text");
		} catch (t) {
			throw new at(`Failed to extract JSON file from ZIP: ${t.message}`, e, t);
		}
		try {
			let t = JSON.parse(n);
			return $.debug("JSON file loaded successfully", { path: e }), t;
		} catch (t) {
			throw new at(`Failed to parse JSON file: ${t.message}`, e, t);
		}
	}
	async unpackAndLoadGlb(e) {
		if (this._assertNotDisposed(), this.zipUrls.urls.has(e)) return $.debug("Using cached GLB URL", { path: e }), this.LoadGLTF(this.zipUrls.urls.get(e));
		$.debug("Unpacking GLB from ZIP", { path: e });
		let t = this.zipUrls.zip?.file(e);
		if (!t) throw new nt(`GLB file not found in ZIP archive: ${e}`, e);
		let n;
		try {
			n = await t.async("arraybuffer");
		} catch (t) {
			throw new nt(`Failed to extract GLB from ZIP: ${t.message}`, e, t);
		}
		if (!n) throw new nt(`GLB extracted but ArrayBuffer is empty: ${e}`, e);
		let r = new Blob([n], { type: "model/gltf-binary" }), i = this._blobUrlManager.createBlobUrl(r, "model/gltf-binary", `zip:${e}`);
		return this.zipUrls.urls.set(e, i), $.debug("GLB blob URL created and cached", { path: e }), this.LoadGLTF(i);
	}
	_getMimeType(e) {
		return {
			ply: "model/ply",
			glb: "model/gltf-binary",
			gltf: "model/gltf+json",
			json: "application/json",
			bin: "application/octet-stream",
			png: "image/png",
			jpg: "image/jpeg",
			jpeg: "image/jpeg"
		}[e.split(".").pop()?.toLowerCase()] || "application/octet-stream";
	}
	async unpackAndLoadJson(e) {
		let t = this.zipUrls.zip?.file(e);
		if (!t) throw Error(`File not found in ZIP: ${e}`);
		let n = await t.async("string");
		if (!n) throw Error(`Failed to read file from ZIP: ${e}`);
		return JSON.parse(n);
	}
	async LoadGLTF(e) {
		return new Promise((t, n) => {
			new U().load(e, (e) => {
				e.animations.length > 0 ? t(e.animations) : t(e.scene);
			}, void 0, (e) => {
				n(e);
			});
		});
	}
}, _i = {
	FlameBonesCount: 5,
	DefaultBlendshapeCount: 52,
	FlameModelTextureSize: {
		width: 4096,
		height: 2048
	},
	BoneTextureSize: {
		width: 4,
		height: 32
	},
	BoneWeightTextureSize: {
		width: 512,
		height: 512
	}
}, vi = function() {
	let e = /* @__PURE__ */ new Float32Array(1), t = new Int32Array(e.buffer);
	return function(n) {
		return e[0] = n, t[0];
	};
}(), yi = {
	CENTER_COLORS_ELEMENTS_PER_TEXEL: 4,
	CENTER_COLORS_ELEMENTS_PER_SPLAT: 4,
	COVARIANCES_ELEMENTS_PER_TEXEL_STORED: 2,
	COVARIANCES_ELEMENTS_PER_TEXEL_ALLOCATED: 4,
	COVARIANCES_ELEMENTS_PER_TEXEL_COMPRESSED_STORED: 2,
	COVARIANCES_ELEMENTS_PER_TEXEL_COMPRESSED_ALLOCATED: 4,
	COVARIANCES_ELEMENTS_PER_SPLAT: 6,
	SCALES_ROTATIONS_ELEMENTS_PER_TEXEL: 4,
	SCENE_INDEXES_ELEMENTS_PER_TEXEL: 1,
	MAX_TEXTURE_TEXELS: 16777216
};
function bi(e, t, n) {
	let r = new j(4096, 2048), i = e.geometry.attributes.position.array, a = [], o = i.length / 3, s = e.geometry.morphAttributes.position.length;
	Object.keys(e.morphTargetDictionary).forEach((t) => {
		let n = e.morphTargetDictionary[t], r = e.geometry.morphAttributes.position[n];
		a = a.concat(Array.from(r.array));
	}), a = a.concat(Array.from(i));
	let c = new Float32Array(r.x * r.y * 4), l = new Uint32Array(r.x * r.y * 4);
	for (let e = 0; e < o * (s + 1); e++) c[4 * e + 0] = a[3 * e + 0], c[4 * e + 1] = a[3 * e + 1], c[4 * e + 2] = a[3 * e + 2], l[4 * e + 0] = vi(c[4 * e + 0]), l[4 * e + 1] = vi(c[4 * e + 1]), l[4 * e + 2] = vi(c[4 * e + 2]);
	let u = new A(l, r.x, r.y, m, F);
	return u.internalFormat = "RGBA32UI", u.needsUpdate = !0, t.uniforms.flameModelTexture.value = u, t.uniforms.flameModelTextureSize.value.copy(r), t.uniforms.gaussianSplatCount.value = n, t.uniformsNeedUpdate = !0, {
		data: l,
		texture: u,
		size: r,
		baseData: { flameModelPos: c }
	};
}
function xi(e, t, n, r, i, a, o) {
	if (!n) return null;
	let s = new j(4, 32), c = new Float32Array(e), l = new Uint32Array(s.x * s.y * 4);
	if (o) {
		for (let e = 0; e < 16 * t; e++) l[e] = vi(c[e]);
		i && i.skeleton && (a.uniforms.boneTexture0.value = i.skeleton.boneTexture, a.uniforms.bindMatrix.value = i.bindMatrix, a.uniforms.bindMatrixInverse.value = i.bindMatrixInverse);
	}
	for (let e in n) if (Object.hasOwn(n, e)) {
		let i = n[e];
		l[r[e] + 16 * t] = vi(i);
	}
	let u = new A(l, s.x, s.y, m, F);
	return u.internalFormat = "RGBA32UI", u.needsUpdate = !0, a.uniforms.boneTexture.value = u, a.uniforms.boneTextureSize.value.copy(s), a.uniformsNeedUpdate = !0, {
		data: l,
		texture: u,
		size: s,
		baseData: { boneMatrix: l }
	};
}
function Si(e, t, n, r, i, a, o, s = !1) {
	if (r && i) {
		if (s) {
			let r = new Float32Array(t);
			for (let t = 0; t < 16 * n; t++) e.baseData.boneMatrix[t] = vi(r[t]);
		}
		for (let t in r) if (Object.hasOwn(r, t)) {
			let a = r[t], o = i[t];
			e.baseData.boneMatrix[o + 16 * n] = vi(a);
		}
		e.boneMatrix.texture.data = e.baseData.boneMatrix, e.boneMatrix.texture.needsUpdate = !0, o.uniforms.boneTexture.value = e.boneMatrix.texture, a.skeleton && (o.uniforms.boneTexture0.value = a.skeleton.boneTexture, o.uniforms.bindMatrix.value = a.bindMatrix, o.uniforms.bindMatrixInverse.value = a.bindMatrixInverse), o.uniformsNeedUpdate = !0;
	}
}
function Ci(e, t, n) {
	let r = e.geometry.attributes.position.array.length / 3, i = new j(512, 512), a = new Float32Array(i.x * i.y * 4), o = new Uint32Array(i.x * i.y * 4);
	for (let e = 0; e < r; e++) a[8 * e + 0] = t[e][0], a[8 * e + 1] = t[e][1], a[8 * e + 2] = t[e][2], a[8 * e + 3] = t[e][3], a[8 * e + 4] = t[e][4], o[8 * e + 0] = vi(t[e][0]), o[8 * e + 1] = vi(t[e][1]), o[8 * e + 2] = vi(t[e][2]), o[8 * e + 3] = vi(t[e][3]), o[8 * e + 4] = vi(t[e][4]);
	let s = new A(o, i.x, i.y, m, F);
	return s.internalFormat = "RGBA32UI", s.needsUpdate = !0, n.uniforms.boneWeightTexture.value = s, n.uniforms.boneWeightTextureSize.value.copy(i), n.uniformsNeedUpdate = !0, {
		data: o,
		texture: s,
		size: i,
		baseData: { boneWeight: o }
	};
}
function wi(e, t) {
	let n = [];
	for (let r = 0; r < t; r++) {
		let t = e.bones[r].matrixWorld.clone().multiply(e.boneInverses[r].clone()).elements;
		for (let e = 0; e < t.length; e++) n.push(t[e]);
	}
	return new Float32Array(n);
}
var Ti = {
	buildModelTexture: bi,
	buildBoneMatrixTexture: xi,
	updateBoneMatrixTexture: Si,
	buildBoneWeightTexture: Ci,
	getUpdatedBoneMatrices: wi
}, Ei = dt("FlameAnimator"), Di = class {
	constructor() {
		this.skeleton = null, this.bones = null, this.flameParams = null, this.lbsWeight = null, this.frame = 0, this.totalFrames = 0, this.useFlame = !0, this.avatarMesh = null, this.gaussianSplatCount = 0, this._disposed = !1, Ei.debug("FlameAnimator instance created");
	}
	_assertNotDisposed() {
		if (this._disposed) throw new rt("FlameAnimator has been disposed");
	}
	initialize(e, t, n, r) {
		this._assertNotDisposed();
		try {
			Xt(e, [
				"rotation",
				"expr",
				"neck_pose",
				"jaw_pose",
				"eyes_pose"
			], "flameParams");
		} catch (e) {
			throw Ei.error("Invalid flameParams", e), e;
		}
		if (!(r && r.geometry && r.geometry.attributes && r.geometry.attributes.position)) {
			let e = new q("avatarMesh must have geometry with position attribute", "avatarMesh");
			throw Ei.error("Invalid avatarMesh", e), e;
		}
		Ei.info("Initializing FlameAnimator", {
			frameCount: e.rotation?.length,
			splatCount: r.geometry.attributes.position.count
		}), this.flameParams = e, this.lbsWeight = n, this.avatarMesh = r, e.rotation && Array.isArray(e.rotation) ? (this.totalFrames = e.rotation.length, Ei.debug("Animation has frames", { totalFrames: this.totalFrames })) : (Ei.warn("No rotation data found, totalFrames set to 0"), this.totalFrames = 0), this.gaussianSplatCount = r.geometry.attributes.position.count;
		try {
			this.buildSkeleton(t), Ei.debug("Skeleton built successfully", { boneCount: this.bones?.length });
		} catch (e) {
			throw Ei.error("Failed to build skeleton", e), new q(`Failed to build skeleton: ${e.message}`, "boneTree", e);
		}
	}
	buildSkeleton(e) {
		if (!e) return;
		this.bones = [];
		let t = [], n = (e, i = null) => {
			let a = new V();
			a.name = e.name || `bone_${this.bones.length}`, e.position && a.position.fromArray(e.position), e.rotation && a.rotation.fromArray(e.rotation), e.scale && a.scale.fromArray(e.scale), i && i.add(a), this.bones.push(a);
			let o = new r();
			e.inverseBindMatrix ? o.fromArray(e.inverseBindMatrix) : (a.updateMatrixWorld(!0), o.copy(a.matrixWorld).invert()), t.push(o), e.children && e.children.forEach((e) => n(e, a));
		};
		Array.isArray(e) ? (e.forEach((e, n) => {
			let i = new V();
			i.name = e.name || `bone_${n}`, e.position && i.position.fromArray(e.position), this.bones.push(i);
			let a = new r();
			e.inverseBindMatrix && a.fromArray(e.inverseBindMatrix), t.push(a);
		}), this.bones.length >= 5 && (this.bones[0].add(this.bones[1]), this.bones[1].add(this.bones[2]), this.bones[1].add(this.bones[3]), this.bones[1].add(this.bones[4]))) : e.root && n(e.root), this.skeleton = new C(this.bones, t);
	}
	setBoneRotation(e, t, n = !1) {
		if (this._assertNotDisposed(), !e || !t || !Array.isArray(t)) throw new q("bone and angles array are required", "bone/angles");
		let r = on.acquire();
		try {
			if (n) {
				if (t.length < 4) throw new q("Quaternion requires 4 values", "angles");
				r.set(t[0], t[1], t[2], t[3]);
			} else {
				if (t.length < 3) throw new q("Axis-angle requires 3 values", "angles");
				let e = rn.acquire();
				try {
					e.set(t[0], t[1], t[2]);
					let n = e.length();
					e.normalize(), r.setFromAxisAngle(e, n);
				} finally {
					rn.release(e);
				}
			}
			e.quaternion.copy(r), e.updateMatrixWorld(!0);
		} finally {
			on.release(r);
		}
	}
	updateFlameBones() {
		if (this._assertNotDisposed(), !this.flameParams || !this.skeleton) return Ei.warn("Cannot update bones: flameParams or skeleton not initialized"), {};
		let e = this.frame, t = this.flameParams.expr[e];
		try {
			let t = this.flameParams.rotation[e];
			this.setBoneRotation(this.skeleton.bones[0], t);
			let n = this.flameParams.neck_pose[e];
			this.setBoneRotation(this.skeleton.bones[1], n);
			let r = this.flameParams.jaw_pose[e];
			this.setBoneRotation(this.skeleton.bones[2], r);
			let i = this.flameParams.eyes_pose[e];
			this.setBoneRotation(this.skeleton.bones[3], i.slice(0, 3)), this.setBoneRotation(this.skeleton.bones[4], i.slice(3, 6));
		} catch (t) {
			throw Ei.error("Error setting bone rotations", {
				frame: e,
				error: t
			}), t;
		}
		return this.skeleton.update(), {
			bsWeight: t,
			bonesMatrix: Ti.getUpdatedBoneMatrices(this.skeleton, 5),
			bonesNum: 5,
			bonesWeight: this.lbsWeight
		};
	}
	runMorphUpdate(e) {
		let t = new Float32Array(this.avatarMesh.geometry.attributes.position.array);
		if (e.gaussianSplatCount = this.gaussianSplatCount, e.bonesNum = 5, this.useFlame) {
			let t = this.updateFlameBones();
			e.bsWeight = t.bsWeight, e.bonesMatrix = t.bonesMatrix, e.bonesNum = t.bonesNum, e.bonesWeight = t.bonesWeight;
		}
		e.morphedMesh = t;
		let n = e.morphedMesh.length / 3;
		e.splatDataTextures && e.splatDataTextures.flameModel && e.updateTextureAfterBSAndSkeleton(0, n - 1, this.useFlame);
	}
	setFrame(e) {
		if (this._assertNotDisposed(), typeof e != "number" || isNaN(e)) throw new q("frame must be a valid number", "frame");
		this.frame = this.totalFrames > 0 ? (e % this.totalFrames + this.totalFrames) % this.totalFrames : 0;
	}
	nextFrame() {
		this._assertNotDisposed(), this.totalFrames > 0 && (this.frame = (this.frame + 1) % this.totalFrames);
	}
	getSkeleton() {
		return this._assertNotDisposed(), this.skeleton;
	}
	getFrame() {
		return this._assertNotDisposed(), this.frame;
	}
	getTotalFrames() {
		return this._assertNotDisposed(), this.totalFrames;
	}
	dispose() {
		this._disposed ? Ei.warn("FlameAnimator.dispose() called on already disposed instance") : (Ei.info("Disposing FlameAnimator"), this.skeleton &&= (this.skeleton.dispose(), null), this.bones = null, this.flameParams = null, this.lbsWeight = null, this.avatarMesh = null, this.frame = 0, this.totalFrames = 0, this.gaussianSplatCount = 0, this._disposed = !0, Ei.debug("FlameAnimator disposed successfully"));
	}
};
export { Nn as ARKIT_BLENDSHAPES_COUNT, jn as ARKitBlendshapes, ht as AbortedPromiseError, Y as AnimationManager, Ht as BASE_COMPONENT_COUNT, bn as BlobUrlManager, Fe as CENTER_COLORS_ELEMENTS_PER_SPLAT, Ve as CENTER_COLORS_ELEMENTS_PER_TEXEL, qe as CONSECUTIVE_RENDERED_FRAMES_FOR_FPS_CALCULATION, Pe as COVARIANCES_ELEMENTS_PER_SPLAT, Le as COVARIANCES_ELEMENTS_PER_TEXEL_ALLOCATED, ze as COVARIANCES_ELEMENTS_PER_TEXEL_COMPRESSED_ALLOCATED, Re as COVARIANCES_ELEMENTS_PER_TEXEL_COMPRESSED_STORED, Ie as COVARIANCES_ELEMENTS_PER_TEXEL_STORED, K as Constants, kt as DefaultSphericalHarmonics8BitCompressionHalfRange, Ne as DefaultSphericalHarmonics8BitCompressionRange, rr as DirectLoadError, kn as EventEmitter, Pn as FLAME_BONES_COUNT, Ye as FOCUS_MARKER_FADE_IN_SPEED, Xe as FOCUS_MARKER_FADE_OUT_SPEED, xr as FieldSize, br as FieldSizeStringMap, Di as FlameAnimator, Mn as FlameBoneNames, _i as FlameConstants, Ti as FlameTextureManager, Dn as FrameBudgetMonitor, gi as GaussianSplatRenderer, Ln as Hello, Zr as Hit, Hr as INRIAV1PlyParser, Rn as Idle, Ze as InternalLoadType, zn as Listen, Qe as LoaderStatus, $e as LoaderUtils, De as LogLevel, st as Logger, ot as LoggerLevel, Ke as MINIMUM_DISTANCE_TO_NEW_FOCAL_POINT, Je as MIN_SPLAT_COUNT_TO_SHOW_SPLAT_TREE_LOADING_SPINNER, nn as ObjectPool, fr as PlyFormat, Kr as PlyLoader, Ur as PlyParser, Sr as PlyParserUtils, cn as PoolScope, Xr as Ray, Qr as Raycaster, En as RenderLoop, Oe as RenderMode, Be as SCALES_ROTATIONS_ELEMENTS_PER_TEXEL, Ue as SCENE_FADEIN_RATE_FAST, We as SCENE_FADEIN_RATE_GRADUAL, He as SCENE_INDEXES_ELEMENTS_PER_TEXEL, ke as SceneFormat, je as SceneRevealMode, wt as Semver, Vn as Speak, lr as SplatBuffer, dr as SplatBufferGenerator, Un as SplatGeometry, Kn as SplatMaterial, Jn as SplatMaterial2D, qn as SplatMaterial3D, nr as SplatMesh, ur as SplatPartitioner, Me as SplatRenderMode, Hn as SplatScene, Gn as SplatTree, In as State, Ge as THREE_CAMERA_FOV, J as TYVoiceChatState, yi as TextureConstants, Bn as Think, An as TypedEventEmitter, X as UncompressedSplatArray, ai as Viewer, Ct as abortablePromiseWithExtractedComponents, xi as buildBoneMatrixTexture, Ci as buildBoneWeightTexture, bi as buildModelTexture, _t as clamp, pt as configureForDevelopment, ft as configureForProduction, It as convertBetweenCompressionLevels, Lt as copyBetweenBuffers, Cn as createTrackedBlobUrl, Ft as dataViewFloatForCompressionLevel, bt as delayedExecute, yt as disposeAllMeshes, vn as disposeAllPools, sn as eulerPool, gt as fetchWithProgress, Rt as floatToHalf, Ot as fromHalfFloat, Nt as fromHalfFloatToUint8, Mt as fromUint8, Pt as fromUint8ToHalfFloat, vt as getCurrentTime, Sn as getGlobalBlobUrlManager, Et as getIOSSemever, dt as getLogger, _n as getPoolStats, xt as getSphericalHarmonicsComponentCountForDegree, wi as getUpdatedBoneMatrices, Tt as isIOS, an as matrix4Pool, St as nativePromiseWithExtractedComponents, on as quaternionPool, wn as revokeTrackedBlobUrl, Vt as rgbaArrayToInteger, Bt as rgbaToInteger, Ae as sceneFormatFromPath, ut as setGlobalLogLevel, gn as tempEulerA, fn as tempMatrix4A, pn as tempMatrix4B, mn as tempQuaternionA, hn as tempQuaternionB, ln as tempVector3A, un as tempVector3B, dn as tempVector3C, Dt as toHalfFloat, jt as toUint8, At as toUncompressedFloat, zt as uintEncodedFloat, Si as updateBoneMatrixTexture, Zt as validateArrayBuffer, Gt as validateAssetPath, $t as validateCallback, tn as validateDOMElement, Qt as validateEnum, Kt as validateFileExtension, en as validateHexColor, Jt as validateInteger, qt as validateNumberInRange, Yt as validatePositiveInteger, Xt as validateRequiredProperties, Wt as validateUrl, rn as vector3Pool };
