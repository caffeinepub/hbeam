function En(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var le = {}, Ot = {}, tr;
function bn() {
  if (tr) return Ot;
  tr = 1, Ot.byteLength = a, Ot.toByteArray = p, Ot.fromByteArray = B;
  for (var o = [], t = [], e = typeof Uint8Array < "u" ? Uint8Array : Array, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, u = n.length; s < u; ++s)
    o[s] = n[s], t[n.charCodeAt(s)] = s;
  t[45] = 62, t[95] = 63;
  function c(w) {
    var E = w.length;
    if (E % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var I = w.indexOf("=");
    I === -1 && (I = E);
    var C = I === E ? 0 : 4 - I % 4;
    return [I, C];
  }
  function a(w) {
    var E = c(w), I = E[0], C = E[1];
    return (I + C) * 3 / 4 - C;
  }
  function l(w, E, I) {
    return (E + I) * 3 / 4 - I;
  }
  function p(w) {
    var E, I = c(w), C = I[0], S = I[1], x = new e(l(w, C, S)), T = 0, P = S > 0 ? C - 4 : C, M;
    for (M = 0; M < P; M += 4)
      E = t[w.charCodeAt(M)] << 18 | t[w.charCodeAt(M + 1)] << 12 | t[w.charCodeAt(M + 2)] << 6 | t[w.charCodeAt(M + 3)], x[T++] = E >> 16 & 255, x[T++] = E >> 8 & 255, x[T++] = E & 255;
    return S === 2 && (E = t[w.charCodeAt(M)] << 2 | t[w.charCodeAt(M + 1)] >> 4, x[T++] = E & 255), S === 1 && (E = t[w.charCodeAt(M)] << 10 | t[w.charCodeAt(M + 1)] << 4 | t[w.charCodeAt(M + 2)] >> 2, x[T++] = E >> 8 & 255, x[T++] = E & 255), x;
  }
  function g(w) {
    return o[w >> 18 & 63] + o[w >> 12 & 63] + o[w >> 6 & 63] + o[w & 63];
  }
  function y(w, E, I) {
    for (var C, S = [], x = E; x < I; x += 3)
      C = (w[x] << 16 & 16711680) + (w[x + 1] << 8 & 65280) + (w[x + 2] & 255), S.push(g(C));
    return S.join("");
  }
  function B(w) {
    for (var E, I = w.length, C = I % 3, S = [], x = 16383, T = 0, P = I - C; T < P; T += x)
      S.push(y(w, T, T + x > P ? P : T + x));
    return C === 1 ? (E = w[I - 1], S.push(
      o[E >> 2] + o[E << 4 & 63] + "=="
    )) : C === 2 && (E = (w[I - 2] << 8) + w[I - 1], S.push(
      o[E >> 10] + o[E >> 4 & 63] + o[E << 2 & 63] + "="
    )), S.join("");
  }
  return Ot;
}
var Xt = {};
var er;
function In() {
  return er || (er = 1, Xt.read = function(o, t, e, n, s) {
    var u, c, a = s * 8 - n - 1, l = (1 << a) - 1, p = l >> 1, g = -7, y = e ? s - 1 : 0, B = e ? -1 : 1, w = o[t + y];
    for (y += B, u = w & (1 << -g) - 1, w >>= -g, g += a; g > 0; u = u * 256 + o[t + y], y += B, g -= 8)
      ;
    for (c = u & (1 << -g) - 1, u >>= -g, g += n; g > 0; c = c * 256 + o[t + y], y += B, g -= 8)
      ;
    if (u === 0)
      u = 1 - p;
    else {
      if (u === l)
        return c ? NaN : (w ? -1 : 1) * (1 / 0);
      c = c + Math.pow(2, n), u = u - p;
    }
    return (w ? -1 : 1) * c * Math.pow(2, u - n);
  }, Xt.write = function(o, t, e, n, s, u) {
    var c, a, l, p = u * 8 - s - 1, g = (1 << p) - 1, y = g >> 1, B = s === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, w = n ? 0 : u - 1, E = n ? 1 : -1, I = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, c = g) : (c = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -c)) < 1 && (c--, l *= 2), c + y >= 1 ? t += B / l : t += B * Math.pow(2, 1 - y), t * l >= 2 && (c++, l /= 2), c + y >= g ? (a = 0, c = g) : c + y >= 1 ? (a = (t * l - 1) * Math.pow(2, s), c = c + y) : (a = t * Math.pow(2, y - 1) * Math.pow(2, s), c = 0)); s >= 8; o[e + w] = a & 255, w += E, a /= 256, s -= 8)
      ;
    for (c = c << s | a, p += s; p > 0; o[e + w] = c & 255, w += E, c /= 256, p -= 8)
      ;
    o[e + w - E] |= I * 128;
  }), Xt;
}
var rr;
function xn() {
  return rr || (rr = 1, (function(o) {
    const t = bn(), e = In(), n = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    o.Buffer = a, o.SlowBuffer = x, o.INSPECT_MAX_BYTES = 50;
    const s = 2147483647;
    o.kMaxLength = s, a.TYPED_ARRAY_SUPPORT = u(), !a.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function u() {
      try {
        const f = new Uint8Array(1), r = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(f, r), f.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(a.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (a.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(a.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (a.isBuffer(this))
          return this.byteOffset;
      }
    });
    function c(f) {
      if (f > s)
        throw new RangeError('The value "' + f + '" is invalid for option "size"');
      const r = new Uint8Array(f);
      return Object.setPrototypeOf(r, a.prototype), r;
    }
    function a(f, r, i) {
      if (typeof f == "number") {
        if (typeof r == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return y(f);
      }
      return l(f, r, i);
    }
    a.poolSize = 8192;
    function l(f, r, i) {
      if (typeof f == "string")
        return B(f, r);
      if (ArrayBuffer.isView(f))
        return E(f);
      if (f == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof f
        );
      if (st(f, ArrayBuffer) || f && st(f.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (st(f, SharedArrayBuffer) || f && st(f.buffer, SharedArrayBuffer)))
        return I(f, r, i);
      if (typeof f == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const h = f.valueOf && f.valueOf();
      if (h != null && h !== f)
        return a.from(h, r, i);
      const d = C(f);
      if (d) return d;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof f[Symbol.toPrimitive] == "function")
        return a.from(f[Symbol.toPrimitive]("string"), r, i);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof f
      );
    }
    a.from = function(f, r, i) {
      return l(f, r, i);
    }, Object.setPrototypeOf(a.prototype, Uint8Array.prototype), Object.setPrototypeOf(a, Uint8Array);
    function p(f) {
      if (typeof f != "number")
        throw new TypeError('"size" argument must be of type number');
      if (f < 0)
        throw new RangeError('The value "' + f + '" is invalid for option "size"');
    }
    function g(f, r, i) {
      return p(f), f <= 0 ? c(f) : r !== void 0 ? typeof i == "string" ? c(f).fill(r, i) : c(f).fill(r) : c(f);
    }
    a.alloc = function(f, r, i) {
      return g(f, r, i);
    };
    function y(f) {
      return p(f), c(f < 0 ? 0 : S(f) | 0);
    }
    a.allocUnsafe = function(f) {
      return y(f);
    }, a.allocUnsafeSlow = function(f) {
      return y(f);
    };
    function B(f, r) {
      if ((typeof r != "string" || r === "") && (r = "utf8"), !a.isEncoding(r))
        throw new TypeError("Unknown encoding: " + r);
      const i = T(f, r) | 0;
      let h = c(i);
      const d = h.write(f, r);
      return d !== i && (h = h.slice(0, d)), h;
    }
    function w(f) {
      const r = f.length < 0 ? 0 : S(f.length) | 0, i = c(r);
      for (let h = 0; h < r; h += 1)
        i[h] = f[h] & 255;
      return i;
    }
    function E(f) {
      if (st(f, Uint8Array)) {
        const r = new Uint8Array(f);
        return I(r.buffer, r.byteOffset, r.byteLength);
      }
      return w(f);
    }
    function I(f, r, i) {
      if (r < 0 || f.byteLength < r)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (f.byteLength < r + (i || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let h;
      return r === void 0 && i === void 0 ? h = new Uint8Array(f) : i === void 0 ? h = new Uint8Array(f, r) : h = new Uint8Array(f, r, i), Object.setPrototypeOf(h, a.prototype), h;
    }
    function C(f) {
      if (a.isBuffer(f)) {
        const r = S(f.length) | 0, i = c(r);
        return i.length === 0 || f.copy(i, 0, 0, r), i;
      }
      if (f.length !== void 0)
        return typeof f.length != "number" || he(f.length) ? c(0) : w(f);
      if (f.type === "Buffer" && Array.isArray(f.data))
        return w(f.data);
    }
    function S(f) {
      if (f >= s)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes");
      return f | 0;
    }
    function x(f) {
      return +f != f && (f = 0), a.alloc(+f);
    }
    a.isBuffer = function(r) {
      return r != null && r._isBuffer === !0 && r !== a.prototype;
    }, a.compare = function(r, i) {
      if (st(r, Uint8Array) && (r = a.from(r, r.offset, r.byteLength)), st(i, Uint8Array) && (i = a.from(i, i.offset, i.byteLength)), !a.isBuffer(r) || !a.isBuffer(i))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (r === i) return 0;
      let h = r.length, d = i.length;
      for (let m = 0, b = Math.min(h, d); m < b; ++m)
        if (r[m] !== i[m]) {
          h = r[m], d = i[m];
          break;
        }
      return h < d ? -1 : d < h ? 1 : 0;
    }, a.isEncoding = function(r) {
      switch (String(r).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, a.concat = function(r, i) {
      if (!Array.isArray(r))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (r.length === 0)
        return a.alloc(0);
      let h;
      if (i === void 0)
        for (i = 0, h = 0; h < r.length; ++h)
          i += r[h].length;
      const d = a.allocUnsafe(i);
      let m = 0;
      for (h = 0; h < r.length; ++h) {
        let b = r[h];
        if (st(b, Uint8Array))
          m + b.length > d.length ? (a.isBuffer(b) || (b = a.from(b)), b.copy(d, m)) : Uint8Array.prototype.set.call(
            d,
            b,
            m
          );
        else if (a.isBuffer(b))
          b.copy(d, m);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        m += b.length;
      }
      return d;
    };
    function T(f, r) {
      if (a.isBuffer(f))
        return f.length;
      if (ArrayBuffer.isView(f) || st(f, ArrayBuffer))
        return f.byteLength;
      if (typeof f != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof f
        );
      const i = f.length, h = arguments.length > 2 && arguments[2] === !0;
      if (!h && i === 0) return 0;
      let d = !1;
      for (; ; )
        switch (r) {
          case "ascii":
          case "latin1":
          case "binary":
            return i;
          case "utf8":
          case "utf-8":
            return fe(f).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return i * 2;
          case "hex":
            return i >>> 1;
          case "base64":
            return Ze(f).length;
          default:
            if (d)
              return h ? -1 : fe(f).length;
            r = ("" + r).toLowerCase(), d = !0;
        }
    }
    a.byteLength = T;
    function P(f, r, i) {
      let h = !1;
      if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((i === void 0 || i > this.length) && (i = this.length), i <= 0) || (i >>>= 0, r >>>= 0, i <= r))
        return "";
      for (f || (f = "utf8"); ; )
        switch (f) {
          case "hex":
            return ce(this, r, i);
          case "utf8":
          case "utf-8":
            return D(this, r, i);
          case "ascii":
            return ae(this, r, i);
          case "latin1":
          case "binary":
            return jt(this, r, i);
          case "base64":
            return L(this, r, i);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Lt(this, r, i);
          default:
            if (h) throw new TypeError("Unknown encoding: " + f);
            f = (f + "").toLowerCase(), h = !0;
        }
    }
    a.prototype._isBuffer = !0;
    function M(f, r, i) {
      const h = f[r];
      f[r] = f[i], f[i] = h;
    }
    a.prototype.swap16 = function() {
      const r = this.length;
      if (r % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let i = 0; i < r; i += 2)
        M(this, i, i + 1);
      return this;
    }, a.prototype.swap32 = function() {
      const r = this.length;
      if (r % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let i = 0; i < r; i += 4)
        M(this, i, i + 3), M(this, i + 1, i + 2);
      return this;
    }, a.prototype.swap64 = function() {
      const r = this.length;
      if (r % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let i = 0; i < r; i += 8)
        M(this, i, i + 7), M(this, i + 1, i + 6), M(this, i + 2, i + 5), M(this, i + 3, i + 4);
      return this;
    }, a.prototype.toString = function() {
      const r = this.length;
      return r === 0 ? "" : arguments.length === 0 ? D(this, 0, r) : P.apply(this, arguments);
    }, a.prototype.toLocaleString = a.prototype.toString, a.prototype.equals = function(r) {
      if (!a.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
      return this === r ? !0 : a.compare(this, r) === 0;
    }, a.prototype.inspect = function() {
      let r = "";
      const i = o.INSPECT_MAX_BYTES;
      return r = this.toString("hex", 0, i).replace(/(.{2})/g, "$1 ").trim(), this.length > i && (r += " ... "), "<Buffer " + r + ">";
    }, n && (a.prototype[n] = a.prototype.inspect), a.prototype.compare = function(r, i, h, d, m) {
      if (st(r, Uint8Array) && (r = a.from(r, r.offset, r.byteLength)), !a.isBuffer(r))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
        );
      if (i === void 0 && (i = 0), h === void 0 && (h = r ? r.length : 0), d === void 0 && (d = 0), m === void 0 && (m = this.length), i < 0 || h > r.length || d < 0 || m > this.length)
        throw new RangeError("out of range index");
      if (d >= m && i >= h)
        return 0;
      if (d >= m)
        return -1;
      if (i >= h)
        return 1;
      if (i >>>= 0, h >>>= 0, d >>>= 0, m >>>= 0, this === r) return 0;
      let b = m - d, $ = h - i;
      const G = Math.min(b, $), K = this.slice(d, m), z = r.slice(i, h);
      for (let q = 0; q < G; ++q)
        if (K[q] !== z[q]) {
          b = K[q], $ = z[q];
          break;
        }
      return b < $ ? -1 : $ < b ? 1 : 0;
    };
    function U(f, r, i, h, d) {
      if (f.length === 0) return -1;
      if (typeof i == "string" ? (h = i, i = 0) : i > 2147483647 ? i = 2147483647 : i < -2147483648 && (i = -2147483648), i = +i, he(i) && (i = d ? 0 : f.length - 1), i < 0 && (i = f.length + i), i >= f.length) {
        if (d) return -1;
        i = f.length - 1;
      } else if (i < 0)
        if (d) i = 0;
        else return -1;
      if (typeof r == "string" && (r = a.from(r, h)), a.isBuffer(r))
        return r.length === 0 ? -1 : N(f, r, i, h, d);
      if (typeof r == "number")
        return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? d ? Uint8Array.prototype.indexOf.call(f, r, i) : Uint8Array.prototype.lastIndexOf.call(f, r, i) : N(f, [r], i, h, d);
      throw new TypeError("val must be string, number or Buffer");
    }
    function N(f, r, i, h, d) {
      let m = 1, b = f.length, $ = r.length;
      if (h !== void 0 && (h = String(h).toLowerCase(), h === "ucs2" || h === "ucs-2" || h === "utf16le" || h === "utf-16le")) {
        if (f.length < 2 || r.length < 2)
          return -1;
        m = 2, b /= 2, $ /= 2, i /= 2;
      }
      function G(z, q) {
        return m === 1 ? z[q] : z.readUInt16BE(q * m);
      }
      let K;
      if (d) {
        let z = -1;
        for (K = i; K < b; K++)
          if (G(f, K) === G(r, z === -1 ? 0 : K - z)) {
            if (z === -1 && (z = K), K - z + 1 === $) return z * m;
          } else
            z !== -1 && (K -= K - z), z = -1;
      } else
        for (i + $ > b && (i = b - $), K = i; K >= 0; K--) {
          let z = !0;
          for (let q = 0; q < $; q++)
            if (G(f, K + q) !== G(r, q)) {
              z = !1;
              break;
            }
          if (z) return K;
        }
      return -1;
    }
    a.prototype.includes = function(r, i, h) {
      return this.indexOf(r, i, h) !== -1;
    }, a.prototype.indexOf = function(r, i, h) {
      return U(this, r, i, h, !0);
    }, a.prototype.lastIndexOf = function(r, i, h) {
      return U(this, r, i, h, !1);
    };
    function F(f, r, i, h) {
      i = Number(i) || 0;
      const d = f.length - i;
      h ? (h = Number(h), h > d && (h = d)) : h = d;
      const m = r.length;
      h > m / 2 && (h = m / 2);
      let b;
      for (b = 0; b < h; ++b) {
        const $ = parseInt(r.substr(b * 2, 2), 16);
        if (he($)) return b;
        f[i + b] = $;
      }
      return b;
    }
    function H(f, r, i, h) {
      return Jt(fe(r, f.length - i), f, i, h);
    }
    function O(f, r, i, h) {
      return Jt(yn(r), f, i, h);
    }
    function k(f, r, i, h) {
      return Jt(Ze(r), f, i, h);
    }
    function _(f, r, i, h) {
      return Jt(wn(r, f.length - i), f, i, h);
    }
    a.prototype.write = function(r, i, h, d) {
      if (i === void 0)
        d = "utf8", h = this.length, i = 0;
      else if (h === void 0 && typeof i == "string")
        d = i, h = this.length, i = 0;
      else if (isFinite(i))
        i = i >>> 0, isFinite(h) ? (h = h >>> 0, d === void 0 && (d = "utf8")) : (d = h, h = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const m = this.length - i;
      if ((h === void 0 || h > m) && (h = m), r.length > 0 && (h < 0 || i < 0) || i > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      d || (d = "utf8");
      let b = !1;
      for (; ; )
        switch (d) {
          case "hex":
            return F(this, r, i, h);
          case "utf8":
          case "utf-8":
            return H(this, r, i, h);
          case "ascii":
          case "latin1":
          case "binary":
            return O(this, r, i, h);
          case "base64":
            return k(this, r, i, h);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return _(this, r, i, h);
          default:
            if (b) throw new TypeError("Unknown encoding: " + d);
            d = ("" + d).toLowerCase(), b = !0;
        }
    }, a.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function L(f, r, i) {
      return r === 0 && i === f.length ? t.fromByteArray(f) : t.fromByteArray(f.slice(r, i));
    }
    function D(f, r, i) {
      i = Math.min(f.length, i);
      const h = [];
      let d = r;
      for (; d < i; ) {
        const m = f[d];
        let b = null, $ = m > 239 ? 4 : m > 223 ? 3 : m > 191 ? 2 : 1;
        if (d + $ <= i) {
          let G, K, z, q;
          switch ($) {
            case 1:
              m < 128 && (b = m);
              break;
            case 2:
              G = f[d + 1], (G & 192) === 128 && (q = (m & 31) << 6 | G & 63, q > 127 && (b = q));
              break;
            case 3:
              G = f[d + 1], K = f[d + 2], (G & 192) === 128 && (K & 192) === 128 && (q = (m & 15) << 12 | (G & 63) << 6 | K & 63, q > 2047 && (q < 55296 || q > 57343) && (b = q));
              break;
            case 4:
              G = f[d + 1], K = f[d + 2], z = f[d + 3], (G & 192) === 128 && (K & 192) === 128 && (z & 192) === 128 && (q = (m & 15) << 18 | (G & 63) << 12 | (K & 63) << 6 | z & 63, q > 65535 && q < 1114112 && (b = q));
          }
        }
        b === null ? (b = 65533, $ = 1) : b > 65535 && (b -= 65536, h.push(b >>> 10 & 1023 | 55296), b = 56320 | b & 1023), h.push(b), d += $;
      }
      return Et(h);
    }
    const nt = 4096;
    function Et(f) {
      const r = f.length;
      if (r <= nt)
        return String.fromCharCode.apply(String, f);
      let i = "", h = 0;
      for (; h < r; )
        i += String.fromCharCode.apply(
          String,
          f.slice(h, h += nt)
        );
      return i;
    }
    function ae(f, r, i) {
      let h = "";
      i = Math.min(f.length, i);
      for (let d = r; d < i; ++d)
        h += String.fromCharCode(f[d] & 127);
      return h;
    }
    function jt(f, r, i) {
      let h = "";
      i = Math.min(f.length, i);
      for (let d = r; d < i; ++d)
        h += String.fromCharCode(f[d]);
      return h;
    }
    function ce(f, r, i) {
      const h = f.length;
      (!r || r < 0) && (r = 0), (!i || i < 0 || i > h) && (i = h);
      let d = "";
      for (let m = r; m < i; ++m)
        d += mn[f[m]];
      return d;
    }
    function Lt(f, r, i) {
      const h = f.slice(r, i);
      let d = "";
      for (let m = 0; m < h.length - 1; m += 2)
        d += String.fromCharCode(h[m] + h[m + 1] * 256);
      return d;
    }
    a.prototype.slice = function(r, i) {
      const h = this.length;
      r = ~~r, i = i === void 0 ? h : ~~i, r < 0 ? (r += h, r < 0 && (r = 0)) : r > h && (r = h), i < 0 ? (i += h, i < 0 && (i = 0)) : i > h && (i = h), i < r && (i = r);
      const d = this.subarray(r, i);
      return Object.setPrototypeOf(d, a.prototype), d;
    };
    function V(f, r, i) {
      if (f % 1 !== 0 || f < 0) throw new RangeError("offset is not uint");
      if (f + r > i) throw new RangeError("Trying to access beyond buffer length");
    }
    a.prototype.readUintLE = a.prototype.readUIntLE = function(r, i, h) {
      r = r >>> 0, i = i >>> 0, h || V(r, i, this.length);
      let d = this[r], m = 1, b = 0;
      for (; ++b < i && (m *= 256); )
        d += this[r + b] * m;
      return d;
    }, a.prototype.readUintBE = a.prototype.readUIntBE = function(r, i, h) {
      r = r >>> 0, i = i >>> 0, h || V(r, i, this.length);
      let d = this[r + --i], m = 1;
      for (; i > 0 && (m *= 256); )
        d += this[r + --i] * m;
      return d;
    }, a.prototype.readUint8 = a.prototype.readUInt8 = function(r, i) {
      return r = r >>> 0, i || V(r, 1, this.length), this[r];
    }, a.prototype.readUint16LE = a.prototype.readUInt16LE = function(r, i) {
      return r = r >>> 0, i || V(r, 2, this.length), this[r] | this[r + 1] << 8;
    }, a.prototype.readUint16BE = a.prototype.readUInt16BE = function(r, i) {
      return r = r >>> 0, i || V(r, 2, this.length), this[r] << 8 | this[r + 1];
    }, a.prototype.readUint32LE = a.prototype.readUInt32LE = function(r, i) {
      return r = r >>> 0, i || V(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
    }, a.prototype.readUint32BE = a.prototype.readUInt32BE = function(r, i) {
      return r = r >>> 0, i || V(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
    }, a.prototype.readBigUInt64LE = dt(function(r) {
      r = r >>> 0, Ht(r, "offset");
      const i = this[r], h = this[r + 7];
      (i === void 0 || h === void 0) && Mt(r, this.length - 8);
      const d = i + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, m = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + h * 2 ** 24;
      return BigInt(d) + (BigInt(m) << BigInt(32));
    }), a.prototype.readBigUInt64BE = dt(function(r) {
      r = r >>> 0, Ht(r, "offset");
      const i = this[r], h = this[r + 7];
      (i === void 0 || h === void 0) && Mt(r, this.length - 8);
      const d = i * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], m = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + h;
      return (BigInt(d) << BigInt(32)) + BigInt(m);
    }), a.prototype.readIntLE = function(r, i, h) {
      r = r >>> 0, i = i >>> 0, h || V(r, i, this.length);
      let d = this[r], m = 1, b = 0;
      for (; ++b < i && (m *= 256); )
        d += this[r + b] * m;
      return m *= 128, d >= m && (d -= Math.pow(2, 8 * i)), d;
    }, a.prototype.readIntBE = function(r, i, h) {
      r = r >>> 0, i = i >>> 0, h || V(r, i, this.length);
      let d = i, m = 1, b = this[r + --d];
      for (; d > 0 && (m *= 256); )
        b += this[r + --d] * m;
      return m *= 128, b >= m && (b -= Math.pow(2, 8 * i)), b;
    }, a.prototype.readInt8 = function(r, i) {
      return r = r >>> 0, i || V(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
    }, a.prototype.readInt16LE = function(r, i) {
      r = r >>> 0, i || V(r, 2, this.length);
      const h = this[r] | this[r + 1] << 8;
      return h & 32768 ? h | 4294901760 : h;
    }, a.prototype.readInt16BE = function(r, i) {
      r = r >>> 0, i || V(r, 2, this.length);
      const h = this[r + 1] | this[r] << 8;
      return h & 32768 ? h | 4294901760 : h;
    }, a.prototype.readInt32LE = function(r, i) {
      return r = r >>> 0, i || V(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
    }, a.prototype.readInt32BE = function(r, i) {
      return r = r >>> 0, i || V(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
    }, a.prototype.readBigInt64LE = dt(function(r) {
      r = r >>> 0, Ht(r, "offset");
      const i = this[r], h = this[r + 7];
      (i === void 0 || h === void 0) && Mt(r, this.length - 8);
      const d = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (h << 24);
      return (BigInt(d) << BigInt(32)) + BigInt(i + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
    }), a.prototype.readBigInt64BE = dt(function(r) {
      r = r >>> 0, Ht(r, "offset");
      const i = this[r], h = this[r + 7];
      (i === void 0 || h === void 0) && Mt(r, this.length - 8);
      const d = (i << 24) + // Overflow
      this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
      return (BigInt(d) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + h);
    }), a.prototype.readFloatLE = function(r, i) {
      return r = r >>> 0, i || V(r, 4, this.length), e.read(this, r, !0, 23, 4);
    }, a.prototype.readFloatBE = function(r, i) {
      return r = r >>> 0, i || V(r, 4, this.length), e.read(this, r, !1, 23, 4);
    }, a.prototype.readDoubleLE = function(r, i) {
      return r = r >>> 0, i || V(r, 8, this.length), e.read(this, r, !0, 52, 8);
    }, a.prototype.readDoubleBE = function(r, i) {
      return r = r >>> 0, i || V(r, 8, this.length), e.read(this, r, !1, 52, 8);
    };
    function J(f, r, i, h, d, m) {
      if (!a.isBuffer(f)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (r > d || r < m) throw new RangeError('"value" argument is out of bounds');
      if (i + h > f.length) throw new RangeError("Index out of range");
    }
    a.prototype.writeUintLE = a.prototype.writeUIntLE = function(r, i, h, d) {
      if (r = +r, i = i >>> 0, h = h >>> 0, !d) {
        const $ = Math.pow(2, 8 * h) - 1;
        J(this, r, i, h, $, 0);
      }
      let m = 1, b = 0;
      for (this[i] = r & 255; ++b < h && (m *= 256); )
        this[i + b] = r / m & 255;
      return i + h;
    }, a.prototype.writeUintBE = a.prototype.writeUIntBE = function(r, i, h, d) {
      if (r = +r, i = i >>> 0, h = h >>> 0, !d) {
        const $ = Math.pow(2, 8 * h) - 1;
        J(this, r, i, h, $, 0);
      }
      let m = h - 1, b = 1;
      for (this[i + m] = r & 255; --m >= 0 && (b *= 256); )
        this[i + m] = r / b & 255;
      return i + h;
    }, a.prototype.writeUint8 = a.prototype.writeUInt8 = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 1, 255, 0), this[i] = r & 255, i + 1;
    }, a.prototype.writeUint16LE = a.prototype.writeUInt16LE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 2, 65535, 0), this[i] = r & 255, this[i + 1] = r >>> 8, i + 2;
    }, a.prototype.writeUint16BE = a.prototype.writeUInt16BE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 2, 65535, 0), this[i] = r >>> 8, this[i + 1] = r & 255, i + 2;
    }, a.prototype.writeUint32LE = a.prototype.writeUInt32LE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 4, 4294967295, 0), this[i + 3] = r >>> 24, this[i + 2] = r >>> 16, this[i + 1] = r >>> 8, this[i] = r & 255, i + 4;
    }, a.prototype.writeUint32BE = a.prototype.writeUInt32BE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 4, 4294967295, 0), this[i] = r >>> 24, this[i + 1] = r >>> 16, this[i + 2] = r >>> 8, this[i + 3] = r & 255, i + 4;
    };
    function Pt(f, r, i, h, d) {
      We(r, h, d, f, i, 7);
      let m = Number(r & BigInt(4294967295));
      f[i++] = m, m = m >> 8, f[i++] = m, m = m >> 8, f[i++] = m, m = m >> 8, f[i++] = m;
      let b = Number(r >> BigInt(32) & BigInt(4294967295));
      return f[i++] = b, b = b >> 8, f[i++] = b, b = b >> 8, f[i++] = b, b = b >> 8, f[i++] = b, i;
    }
    function Yt(f, r, i, h, d) {
      We(r, h, d, f, i, 7);
      let m = Number(r & BigInt(4294967295));
      f[i + 7] = m, m = m >> 8, f[i + 6] = m, m = m >> 8, f[i + 5] = m, m = m >> 8, f[i + 4] = m;
      let b = Number(r >> BigInt(32) & BigInt(4294967295));
      return f[i + 3] = b, b = b >> 8, f[i + 2] = b, b = b >> 8, f[i + 1] = b, b = b >> 8, f[i] = b, i + 8;
    }
    a.prototype.writeBigUInt64LE = dt(function(r, i = 0) {
      return Pt(this, r, i, BigInt(0), BigInt("0xffffffffffffffff"));
    }), a.prototype.writeBigUInt64BE = dt(function(r, i = 0) {
      return Yt(this, r, i, BigInt(0), BigInt("0xffffffffffffffff"));
    }), a.prototype.writeIntLE = function(r, i, h, d) {
      if (r = +r, i = i >>> 0, !d) {
        const G = Math.pow(2, 8 * h - 1);
        J(this, r, i, h, G - 1, -G);
      }
      let m = 0, b = 1, $ = 0;
      for (this[i] = r & 255; ++m < h && (b *= 256); )
        r < 0 && $ === 0 && this[i + m - 1] !== 0 && ($ = 1), this[i + m] = (r / b >> 0) - $ & 255;
      return i + h;
    }, a.prototype.writeIntBE = function(r, i, h, d) {
      if (r = +r, i = i >>> 0, !d) {
        const G = Math.pow(2, 8 * h - 1);
        J(this, r, i, h, G - 1, -G);
      }
      let m = h - 1, b = 1, $ = 0;
      for (this[i + m] = r & 255; --m >= 0 && (b *= 256); )
        r < 0 && $ === 0 && this[i + m + 1] !== 0 && ($ = 1), this[i + m] = (r / b >> 0) - $ & 255;
      return i + h;
    }, a.prototype.writeInt8 = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[i] = r & 255, i + 1;
    }, a.prototype.writeInt16LE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 2, 32767, -32768), this[i] = r & 255, this[i + 1] = r >>> 8, i + 2;
    }, a.prototype.writeInt16BE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 2, 32767, -32768), this[i] = r >>> 8, this[i + 1] = r & 255, i + 2;
    }, a.prototype.writeInt32LE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 4, 2147483647, -2147483648), this[i] = r & 255, this[i + 1] = r >>> 8, this[i + 2] = r >>> 16, this[i + 3] = r >>> 24, i + 4;
    }, a.prototype.writeInt32BE = function(r, i, h) {
      return r = +r, i = i >>> 0, h || J(this, r, i, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[i] = r >>> 24, this[i + 1] = r >>> 16, this[i + 2] = r >>> 8, this[i + 3] = r & 255, i + 4;
    }, a.prototype.writeBigInt64LE = dt(function(r, i = 0) {
      return Pt(this, r, i, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), a.prototype.writeBigInt64BE = dt(function(r, i = 0) {
      return Yt(this, r, i, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function Rt(f, r, i, h, d, m) {
      if (i + h > f.length) throw new RangeError("Index out of range");
      if (i < 0) throw new RangeError("Index out of range");
    }
    function _t(f, r, i, h, d) {
      return r = +r, i = i >>> 0, d || Rt(f, r, i, 4), e.write(f, r, i, h, 23, 4), i + 4;
    }
    a.prototype.writeFloatLE = function(r, i, h) {
      return _t(this, r, i, !0, h);
    }, a.prototype.writeFloatBE = function(r, i, h) {
      return _t(this, r, i, !1, h);
    };
    function rt(f, r, i, h, d) {
      return r = +r, i = i >>> 0, d || Rt(f, r, i, 8), e.write(f, r, i, h, 52, 8), i + 8;
    }
    a.prototype.writeDoubleLE = function(r, i, h) {
      return rt(this, r, i, !0, h);
    }, a.prototype.writeDoubleBE = function(r, i, h) {
      return rt(this, r, i, !1, h);
    }, a.prototype.copy = function(r, i, h, d) {
      if (!a.isBuffer(r)) throw new TypeError("argument should be a Buffer");
      if (h || (h = 0), !d && d !== 0 && (d = this.length), i >= r.length && (i = r.length), i || (i = 0), d > 0 && d < h && (d = h), d === h || r.length === 0 || this.length === 0) return 0;
      if (i < 0)
        throw new RangeError("targetStart out of bounds");
      if (h < 0 || h >= this.length) throw new RangeError("Index out of range");
      if (d < 0) throw new RangeError("sourceEnd out of bounds");
      d > this.length && (d = this.length), r.length - i < d - h && (d = r.length - i + h);
      const m = d - h;
      return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(i, h, d) : Uint8Array.prototype.set.call(
        r,
        this.subarray(h, d),
        i
      ), m;
    }, a.prototype.fill = function(r, i, h, d) {
      if (typeof r == "string") {
        if (typeof i == "string" ? (d = i, i = 0, h = this.length) : typeof h == "string" && (d = h, h = this.length), d !== void 0 && typeof d != "string")
          throw new TypeError("encoding must be a string");
        if (typeof d == "string" && !a.isEncoding(d))
          throw new TypeError("Unknown encoding: " + d);
        if (r.length === 1) {
          const b = r.charCodeAt(0);
          (d === "utf8" && b < 128 || d === "latin1") && (r = b);
        }
      } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
      if (i < 0 || this.length < i || this.length < h)
        throw new RangeError("Out of range index");
      if (h <= i)
        return this;
      i = i >>> 0, h = h === void 0 ? this.length : h >>> 0, r || (r = 0);
      let m;
      if (typeof r == "number")
        for (m = i; m < h; ++m)
          this[m] = r;
      else {
        const b = a.isBuffer(r) ? r : a.from(r, d), $ = b.length;
        if ($ === 0)
          throw new TypeError('The value "' + r + '" is invalid for argument "value"');
        for (m = 0; m < h - i; ++m)
          this[m + i] = b[m % $];
      }
      return this;
    };
    const Q = {};
    function it(f, r, i) {
      Q[f] = class extends i {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: r.apply(this, arguments),
            writable: !0,
            configurable: !0
          }), this.name = `${this.name} [${f}]`, this.stack, delete this.name;
        }
        get code() {
          return f;
        }
        set code(d) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: d,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${f}]: ${this.message}`;
        }
      };
    }
    it(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(f) {
        return f ? `${f} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), it(
      "ERR_INVALID_ARG_TYPE",
      function(f, r) {
        return `The "${f}" argument must be of type number. Received type ${typeof r}`;
      },
      TypeError
    ), it(
      "ERR_OUT_OF_RANGE",
      function(f, r, i) {
        let h = `The value of "${f}" is out of range.`, d = i;
        return Number.isInteger(i) && Math.abs(i) > 2 ** 32 ? d = Ut(String(i)) : typeof i == "bigint" && (d = String(i), (i > BigInt(2) ** BigInt(32) || i < -(BigInt(2) ** BigInt(32))) && (d = Ut(d)), d += "n"), h += ` It must be ${r}. Received ${d}`, h;
      },
      RangeError
    );
    function Ut(f) {
      let r = "", i = f.length;
      const h = f[0] === "-" ? 1 : 0;
      for (; i >= h + 4; i -= 3)
        r = `_${f.slice(i - 3, i)}${r}`;
      return `${f.slice(0, i)}${r}`;
    }
    function dn(f, r, i) {
      Ht(r, "offset"), (f[r] === void 0 || f[r + i] === void 0) && Mt(r, f.length - (i + 1));
    }
    function We(f, r, i, h, d, m) {
      if (f > i || f < r) {
        const b = typeof r == "bigint" ? "n" : "";
        let $;
        throw r === 0 || r === BigInt(0) ? $ = `>= 0${b} and < 2${b} ** ${(m + 1) * 8}${b}` : $ = `>= -(2${b} ** ${(m + 1) * 8 - 1}${b}) and < 2 ** ${(m + 1) * 8 - 1}${b}`, new Q.ERR_OUT_OF_RANGE("value", $, f);
      }
      dn(h, d, m);
    }
    function Ht(f, r) {
      if (typeof f != "number")
        throw new Q.ERR_INVALID_ARG_TYPE(r, "number", f);
    }
    function Mt(f, r, i) {
      throw Math.floor(f) !== f ? (Ht(f, i), new Q.ERR_OUT_OF_RANGE("offset", "an integer", f)) : r < 0 ? new Q.ERR_BUFFER_OUT_OF_BOUNDS() : new Q.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${r}`,
        f
      );
    }
    const pn = /[^+/0-9A-Za-z-_]/g;
    function gn(f) {
      if (f = f.split("=")[0], f = f.trim().replace(pn, ""), f.length < 2) return "";
      for (; f.length % 4 !== 0; )
        f = f + "=";
      return f;
    }
    function fe(f, r) {
      r = r || 1 / 0;
      let i;
      const h = f.length;
      let d = null;
      const m = [];
      for (let b = 0; b < h; ++b) {
        if (i = f.charCodeAt(b), i > 55295 && i < 57344) {
          if (!d) {
            if (i > 56319) {
              (r -= 3) > -1 && m.push(239, 191, 189);
              continue;
            } else if (b + 1 === h) {
              (r -= 3) > -1 && m.push(239, 191, 189);
              continue;
            }
            d = i;
            continue;
          }
          if (i < 56320) {
            (r -= 3) > -1 && m.push(239, 191, 189), d = i;
            continue;
          }
          i = (d - 55296 << 10 | i - 56320) + 65536;
        } else d && (r -= 3) > -1 && m.push(239, 191, 189);
        if (d = null, i < 128) {
          if ((r -= 1) < 0) break;
          m.push(i);
        } else if (i < 2048) {
          if ((r -= 2) < 0) break;
          m.push(
            i >> 6 | 192,
            i & 63 | 128
          );
        } else if (i < 65536) {
          if ((r -= 3) < 0) break;
          m.push(
            i >> 12 | 224,
            i >> 6 & 63 | 128,
            i & 63 | 128
          );
        } else if (i < 1114112) {
          if ((r -= 4) < 0) break;
          m.push(
            i >> 18 | 240,
            i >> 12 & 63 | 128,
            i >> 6 & 63 | 128,
            i & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return m;
    }
    function yn(f) {
      const r = [];
      for (let i = 0; i < f.length; ++i)
        r.push(f.charCodeAt(i) & 255);
      return r;
    }
    function wn(f, r) {
      let i, h, d;
      const m = [];
      for (let b = 0; b < f.length && !((r -= 2) < 0); ++b)
        i = f.charCodeAt(b), h = i >> 8, d = i % 256, m.push(d), m.push(h);
      return m;
    }
    function Ze(f) {
      return t.toByteArray(gn(f));
    }
    function Jt(f, r, i, h) {
      let d;
      for (d = 0; d < h && !(d + i >= r.length || d >= f.length); ++d)
        r[d + i] = f[d];
      return d;
    }
    function st(f, r) {
      return f instanceof r || f != null && f.constructor != null && f.constructor.name != null && f.constructor.name === r.name;
    }
    function he(f) {
      return f !== f;
    }
    const mn = (function() {
      const f = "0123456789abcdef", r = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const h = i * 16;
        for (let d = 0; d < 16; ++d)
          r[h + d] = f[i] + f[d];
      }
      return r;
    })();
    function dt(f) {
      return typeof BigInt > "u" ? Bn : f;
    }
    function Bn() {
      throw new Error("BigInt not supported");
    }
  })(le)), le;
}
var A = xn();
const Ve = 2n ** 256n, xt = Ve - 0x1000003d1n, Y = Ve - 0x14551231950b75fc4402da1732fc9bebfn, An = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n, Sn = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n, Kr = { a: 0n, b: 7n }, W = 32, nr = (o) => R(R(o * o) * o + Kr.b), v = (o = "") => {
  throw new Error(o);
}, ie = (o) => typeof o == "bigint", Vr = (o) => typeof o == "string", de = (o) => ie(o) && 0n < o && o < xt, Kt = (o) => ie(o) && 0n < o && o < Y, Tn = (o) => o instanceof Uint8Array || o != null && typeof o == "object" && o.constructor.name === "Uint8Array", De = (o, t) => (
  // assert is Uint8Array (of specific length)
  !Tn(o) || typeof t == "number" && t > 0 && o.length !== t ? v("Uint8Array expected") : o
), ut = (o) => new Uint8Array(o), lt = (o, t) => De(Vr(o) ? Vt(o) : ut(De(o)), t), R = (o, t = xt) => {
  let e = o % t;
  return e >= 0n ? e : t + e;
}, ir = (o) => o instanceof X ? o : v("Point expected");
class X {
  constructor(t, e, n) {
    this.px = t, this.py = e, this.pz = n;
  }
  //3d=less inversions
  static fromAffine(t) {
    return t.x === 0n && t.y === 0n ? X.ZERO : new X(t.x, t.y, 1n);
  }
  static fromHex(t) {
    t = lt(t);
    let e;
    const n = t[0], s = t.subarray(1), u = ee(s, 0, W), c = t.length;
    if (c === 33 && [2, 3].includes(n)) {
      de(u) || v("Point hex invalid: x not FE");
      let a = Cn(nr(u));
      const l = (a & 1n) === 1n;
      (n & 1) === 1 !== l && (a = R(-a)), e = new X(u, a, 1n);
    }
    return c === 65 && n === 4 && (e = new X(u, ee(s, W, 2 * W), 1n)), e ? e.ok() : v("Point is not on curve");
  }
  static fromPrivateKey(t) {
    return ht.mul(re(t));
  }
  // Create point from a private key.
  get x() {
    return this.aff().x;
  }
  // .x, .y will call expensive toAffine:
  get y() {
    return this.aff().y;
  }
  // should be used with care.
  equals(t) {
    const { px: e, py: n, pz: s } = this, { px: u, py: c, pz: a } = ir(t), l = R(e * a), p = R(u * s), g = R(n * a), y = R(c * s);
    return l === p && g === y;
  }
  negate() {
    return new X(this.px, R(-this.py), this.pz);
  }
  // Flip point over y coord
  double() {
    return this.add(this);
  }
  // Point doubling: P+P, complete formula.
  add(t) {
    const { px: e, py: n, pz: s } = this, { px: u, py: c, pz: a } = ir(t), { a: l, b: p } = Kr;
    let g = 0n, y = 0n, B = 0n;
    const w = R(p * 3n);
    let E = R(e * u), I = R(n * c), C = R(s * a), S = R(e + n), x = R(u + c);
    S = R(S * x), x = R(E + I), S = R(S - x), x = R(e + s);
    let T = R(u + a);
    return x = R(x * T), T = R(E + C), x = R(x - T), T = R(n + s), g = R(c + a), T = R(T * g), g = R(I + C), T = R(T - g), B = R(l * x), g = R(w * C), B = R(g + B), g = R(I - B), B = R(I + B), y = R(g * B), I = R(E + E), I = R(I + E), C = R(l * C), x = R(w * x), I = R(I + C), C = R(E - C), C = R(l * C), x = R(x + C), E = R(I * x), y = R(y + E), E = R(T * x), g = R(S * g), g = R(g - E), E = R(S * I), B = R(T * B), B = R(B + E), new X(g, y, B);
  }
  mul(t, e = !0) {
    if (!e && t === 0n)
      return te;
    if (Kt(t) || v("invalid scalar"), this.equals(ht))
      return Fn(t).p;
    let n = te, s = ht;
    for (let u = this; t > 0n; u = u.double(), t >>= 1n)
      t & 1n ? n = n.add(u) : e && (s = s.add(u));
    return n;
  }
  mulAddQUns(t, e, n) {
    return this.mul(e, !1).add(t.mul(n, !1)).ok();
  }
  // to private keys. Doesn't use Shamir trick
  toAffine() {
    const { px: t, py: e, pz: n } = this;
    if (this.equals(te))
      return { x: 0n, y: 0n };
    if (n === 1n)
      return { x: t, y: e };
    const s = zt(n);
    return R(n * s) !== 1n && v("invalid inverse"), { x: R(t * s), y: R(e * s) };
  }
  assertValidity() {
    const { x: t, y: e } = this.aff();
    return (!de(t) || !de(e)) && v("Point invalid: x or y"), R(e * e) === nr(t) ? (
      // y² = x³ + ax + b, must be equal
      this
    ) : v("Point invalid: not on curve");
  }
  multiply(t) {
    return this.mul(t);
  }
  // Aliases to compress code
  aff() {
    return this.toAffine();
  }
  ok() {
    return this.assertValidity();
  }
  toHex(t = !0) {
    const { x: e, y: n } = this.aff();
    return (t ? (n & 1n) === 0n ? "02" : "03" : "04") + qt(e) + (t ? "" : qt(n));
  }
  toRawBytes(t = !0) {
    return Vt(this.toHex(t));
  }
}
X.BASE = new X(An, Sn, 1n);
X.ZERO = new X(0n, 1n, 0n);
const { BASE: ht, ZERO: te } = X, Gr = (o, t) => o.toString(16).padStart(t, "0"), Ge = (o) => Array.from(o).map((t) => Gr(t, 2)).join(""), Vt = (o) => {
  const t = o.length;
  (!Vr(o) || t % 2) && v("hex invalid 1");
  const e = ut(t / 2);
  for (let n = 0; n < e.length; n++) {
    const s = n * 2, u = o.slice(s, s + 2), c = Number.parseInt(u, 16);
    (Number.isNaN(c) || c < 0) && v("hex invalid 2"), e[n] = c;
  }
  return e;
}, Gt = (o) => BigInt("0x" + (Ge(o) || "0")), ee = (o, t, e) => Gt(o.slice(t, e)), se = (o) => ie(o) && o >= 0n && o < Ve ? Vt(Gr(o, 2 * W)) : v("bigint expected"), qt = (o) => Ge(se(o)), $e = (...o) => {
  const t = ut(o.reduce((n, s) => n + De(s).length, 0));
  let e = 0;
  return o.forEach((n) => {
    t.set(n, e), e += n.length;
  }), t;
}, zt = (o, t = xt) => {
  (o === 0n || t <= 0n) && v("no inverse n=" + o + " mod=" + t);
  let e = R(o, t), n = t, s = 0n, u = 1n;
  for (; e !== 0n; ) {
    const c = n / e, a = n % e, l = s - u * c;
    n = e, e = a, s = u, u = l;
  }
  return n === 1n ? R(s, t) : v("no inverse");
}, Cn = (o) => {
  let t = 1n;
  for (let e = o, n = (xt + 1n) / 4n; n > 0n; n >>= 1n)
    n & 1n && (t = t * e % xt), e = e * e % xt;
  return R(t * t) === o ? t : v("sqrt invalid");
}, re = (o) => (ie(o) || (o = Gt(lt(o, W))), Kt(o) ? o : v("private key out of range")), ze = (o) => o > Y >> 1n, qe = (o, t = !0) => X.fromPrivateKey(o).toRawBytes(t);
class at {
  constructor(t, e, n) {
    this.r = t, this.s = e, this.recovery = n, this.assertValidity();
  }
  // constructed outside.
  static fromCompact(t) {
    return t = lt(t, 64), new at(ee(t, 0, W), ee(t, W, 2 * W));
  }
  assertValidity() {
    return Kt(this.r) && Kt(this.s) ? this : v();
  }
  // 0 < r or s < CURVE.n
  addRecoveryBit(t) {
    return new at(this.r, this.s, t);
  }
  hasHighS() {
    return ze(this.s);
  }
  normalizeS() {
    return this.hasHighS() ? new at(this.r, R(this.s, Y), this.recovery) : this;
  }
  recoverPublicKey(t) {
    const { r: e, s: n, recovery: s } = this;
    [0, 1, 2, 3].includes(s) || v("recovery id invalid");
    const u = je(lt(t, W)), c = s === 2 || s === 3 ? e + Y : e;
    c >= xt && v("q.x invalid");
    const a = (s & 1) === 0 ? "02" : "03", l = X.fromHex(a + qt(c)), p = zt(c, Y), g = R(-u * p, Y), y = R(n * p, Y);
    return ht.mulAddQUns(l, g, y);
  }
  toCompactRawBytes() {
    return Vt(this.toCompactHex());
  }
  // Uint8Array 64b compact repr
  toCompactHex() {
    return qt(this.r) + qt(this.s);
  }
  // hex 64b compact repr
}
const zr = (o) => {
  const t = o.length * 8 - 256, e = Gt(o);
  return t > 0 ? e >> BigInt(t) : e;
}, je = (o) => R(zr(o), Y), sr = (o) => se(o), or = () => (
  // We support: 1) browsers 2) node.js 19+ 3) deno, other envs with crypto
  typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0
);
let vt;
const jr = { lowS: !0 }, Pn = { lowS: !0 }, Rn = (o, t, e = jr) => {
  ["der", "recovered", "canonical"].some((y) => y in e) && v("sign() legacy options not supported");
  let { lowS: n } = e;
  n == null && (n = !0);
  const s = je(lt(o)), u = sr(s), c = re(t), a = [sr(c), u];
  let l = e.extraEntropy;
  if (l) {
    l === !0 && (l = oe.randomBytes(W));
    const y = lt(l);
    y.length !== W && v(), a.push(y);
  }
  const p = s, g = (y) => {
    const B = zr(y);
    if (!Kt(B))
      return;
    const w = zt(B, Y), E = ht.mul(B).aff(), I = R(E.x, Y);
    if (I === 0n)
      return;
    const C = R(w * R(p + R(c * I, Y), Y), Y);
    if (C === 0n)
      return;
    let S = C, x = (E.x === I ? 0 : 2) | Number(E.y & 1n);
    return n && ze(C) && (S = R(-C, Y), x ^= 1), new at(I, S, x);
  };
  return { seed: $e(...a), k2sig: g };
};
function Un(o) {
  let t = ut(W), e = ut(W), n = 0;
  const s = () => {
    t.fill(1), e.fill(0), n = 0;
  }, u = "drbg: tried 1000 values";
  {
    const c = (...p) => {
      const g = vt;
      return g || v("etc.hmacSha256Sync not set"), g(e, t, ...p);
    }, a = (p = ut()) => {
      e = c(ut([0]), p), t = c(), p.length !== 0 && (e = c(ut([1]), p), t = c());
    }, l = () => (n++ >= 1e3 && v(u), t = c(), t);
    return (p, g) => {
      s(), a(p);
      let y;
      for (; !(y = g(l())); )
        a();
      return s(), y;
    };
  }
}
const Yr = (o, t, e = jr) => {
  const { seed: n, k2sig: s } = Rn(o, t, e);
  return Un()(n, s);
}, Jr = (o, t, e, n = Pn) => {
  let { lowS: s } = n;
  s == null && (s = !0), "strict" in n && v("verify() legacy options not supported");
  let u, c, a;
  const l = o && typeof o == "object" && "r" in o;
  !l && lt(o).length !== 2 * W && v("signature must be 64 bytes");
  try {
    u = l ? new at(o.r, o.s).assertValidity() : at.fromCompact(o), c = je(lt(t)), a = e instanceof X ? e.ok() : X.fromHex(e);
  } catch {
    return !1;
  }
  if (!u)
    return !1;
  const { r: p, s: g } = u;
  if (s && ze(g))
    return !1;
  let y;
  try {
    const w = zt(g, Y), E = R(c * w, Y), I = R(p * w, Y);
    y = ht.mulAddQUns(a, E, I).aff();
  } catch {
    return !1;
  }
  return y ? R(y.x, Y) === p : !1;
}, Xr = (o) => {
  o = lt(o);
  const t = W + 8;
  (o.length < t || o.length > 1024) && v("expected proper params");
  const e = R(Gt(o), Y - 1n) + 1n;
  return se(e);
}, oe = {
  hexToBytes: Vt,
  bytesToHex: Ge,
  // share API with noble-curves.
  concatBytes: $e,
  bytesToNumberBE: Gt,
  numberToBytesBE: se,
  mod: R,
  invert: zt,
  // math utilities
  hmacSha256Async: async (o, ...t) => {
    const e = or(), n = e && e.subtle;
    if (!n)
      return v("etc.hmacSha256Async not set");
    const s = await n.importKey("raw", o, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]);
    return ut(await n.sign("HMAC", s, $e(...t)));
  },
  hmacSha256Sync: vt,
  // For TypeScript. Actual logic is below
  hashToPrivateKey: Xr,
  randomBytes: (o = 32) => {
    const t = or();
    return (!t || !t.getRandomValues) && v("crypto.getRandomValues must be defined"), t.getRandomValues(ut(o));
  }
}, Hn = {
  normPrivateKeyToScalar: re,
  isValidPrivateKey: (o) => {
    try {
      return !!re(o);
    } catch {
      return !1;
    }
  },
  randomPrivateKey: () => Xr(oe.randomBytes(W + 16)),
  // FIPS 186 B.4.1.
  precompute(o = 8, t = ht) {
    return t.multiply(3n), t;
  }
  // no-op
};
Object.defineProperties(oe, { hmacSha256Sync: {
  configurable: !1,
  get() {
    return vt;
  },
  set(o) {
    vt || (vt = o);
  }
} });
const bt = 8, Nn = () => {
  const o = [], t = 256 / bt + 1;
  let e = ht, n = e;
  for (let s = 0; s < t; s++) {
    n = e, o.push(n);
    for (let u = 1; u < 2 ** (bt - 1); u++)
      n = n.add(e), o.push(n);
    e = n.double();
  }
  return o;
};
let ur;
const Fn = (o) => {
  const t = ur || (ur = Nn()), e = (g, y) => {
    let B = y.negate();
    return g ? B : y;
  };
  let n = te, s = ht;
  const u = 1 + 256 / bt, c = 2 ** (bt - 1), a = BigInt(2 ** bt - 1), l = 2 ** bt, p = BigInt(bt);
  for (let g = 0; g < u; g++) {
    const y = g * c;
    let B = Number(o & a);
    o >>= p, B > c && (B -= l, o += 1n);
    const w = y, E = y + Math.abs(B) - 1, I = g % 2 !== 0, C = B < 0;
    B === 0 ? s = s.add(e(I, t[w])) : n = n.add(e(C, t[E]));
  }
  return { p: n, f: s };
};
function At(o) {
  if (!Number.isSafeInteger(o) || o < 0)
    throw new Error(`positive integer expected, not ${o}`);
}
function kn(o) {
  return o instanceof Uint8Array || o != null && typeof o == "object" && o.constructor.name === "Uint8Array";
}
function ue(o, ...t) {
  if (!kn(o))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(o.length))
    throw new Error(`Uint8Array expected of length ${t}, not of length=${o.length}`);
}
function Ln(o) {
  if (typeof o != "function" || typeof o.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  At(o.outputLen), At(o.blockLen);
}
function St(o, t = !0) {
  if (o.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && o.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ye(o, t) {
  ue(o);
  const e = t.outputLen;
  if (o.length < e)
    throw new Error(`digestInto() expects output buffer of length at least ${e}`);
}
const _n = (o) => new Uint8Array(o.buffer, o.byteOffset, o.byteLength), ne = (o) => new Uint32Array(o.buffer, o.byteOffset, Math.floor(o.byteLength / 4)), pe = (o) => new DataView(o.buffer, o.byteOffset, o.byteLength), Z = (o, t) => o << 32 - t | o >>> t, et = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, Qr = (o) => o << 24 & 4278190080 | o << 8 & 16711680 | o >>> 8 & 65280 | o >>> 24 & 255, Mn = et ? (o) => o : (o) => Qr(o);
function tt(o) {
  for (let t = 0; t < o.length; t++)
    o[t] = Qr(o[t]);
}
function On(o) {
  if (typeof o != "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof o}`);
  return new Uint8Array(new TextEncoder().encode(o));
}
function kt(o) {
  return typeof o == "string" && (o = On(o)), ue(o), o;
}
class Je {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Dn(o) {
  const t = (n) => o().update(kt(n)).digest(), e = o();
  return t.outputLen = e.outputLen, t.blockLen = e.blockLen, t.create = () => o(), t;
}
function $n(o) {
  const t = (n, s) => o(s).update(kt(n)).digest(), e = o({});
  return t.outputLen = e.outputLen, t.blockLen = e.blockLen, t.create = (n) => o(n), t;
}
function qn(o, t, e, n) {
  if (typeof o.setBigUint64 == "function")
    return o.setBigUint64(t, e, n);
  const s = BigInt(32), u = BigInt(4294967295), c = Number(e >> s & u), a = Number(e & u), l = n ? 4 : 0, p = n ? 0 : 4;
  o.setUint32(t + l, c, n), o.setUint32(t + p, a, n);
}
const vn = (o, t, e) => o & t ^ ~o & e, Kn = (o, t, e) => o & t ^ o & e ^ t & e;
class Vn extends Je {
  constructor(t, e, n, s) {
    super(), this.blockLen = t, this.outputLen = e, this.padOffset = n, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = pe(this.buffer);
  }
  update(t) {
    St(this);
    const { view: e, buffer: n, blockLen: s } = this;
    t = kt(t);
    const u = t.length;
    for (let c = 0; c < u; ) {
      const a = Math.min(s - this.pos, u - c);
      if (a === s) {
        const l = pe(t);
        for (; s <= u - c; c += s)
          this.process(l, c);
        continue;
      }
      n.set(t.subarray(c, c + a), this.pos), this.pos += a, c += a, this.pos === s && (this.process(e, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    St(this), Ye(t, this), this.finished = !0;
    const { buffer: e, view: n, blockLen: s, isLE: u } = this;
    let { pos: c } = this;
    e[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > s - c && (this.process(n, 0), c = 0);
    for (let y = c; y < s; y++)
      e[y] = 0;
    qn(n, s - 8, BigInt(this.length * 8), u), this.process(n, 0);
    const a = pe(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = l / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let y = 0; y < p; y++)
      a.setUint32(4 * y, g[y], u);
  }
  digest() {
    const { buffer: t, outputLen: e } = this;
    this.digestInto(t);
    const n = t.slice(0, e);
    return this.destroy(), n;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: e, buffer: n, length: s, finished: u, destroyed: c, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = u, t.destroyed = c, s % e && t.buffer.set(n), t;
  }
}
const Gn = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), pt = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gt = /* @__PURE__ */ new Uint32Array(64);
class zn extends Vn {
  constructor() {
    super(64, 32, 8, !1), this.A = pt[0] | 0, this.B = pt[1] | 0, this.C = pt[2] | 0, this.D = pt[3] | 0, this.E = pt[4] | 0, this.F = pt[5] | 0, this.G = pt[6] | 0, this.H = pt[7] | 0;
  }
  get() {
    const { A: t, B: e, C: n, D: s, E: u, F: c, G: a, H: l } = this;
    return [t, e, n, s, u, c, a, l];
  }
  // prettier-ignore
  set(t, e, n, s, u, c, a, l) {
    this.A = t | 0, this.B = e | 0, this.C = n | 0, this.D = s | 0, this.E = u | 0, this.F = c | 0, this.G = a | 0, this.H = l | 0;
  }
  process(t, e) {
    for (let y = 0; y < 16; y++, e += 4)
      gt[y] = t.getUint32(e, !1);
    for (let y = 16; y < 64; y++) {
      const B = gt[y - 15], w = gt[y - 2], E = Z(B, 7) ^ Z(B, 18) ^ B >>> 3, I = Z(w, 17) ^ Z(w, 19) ^ w >>> 10;
      gt[y] = I + gt[y - 7] + E + gt[y - 16] | 0;
    }
    let { A: n, B: s, C: u, D: c, E: a, F: l, G: p, H: g } = this;
    for (let y = 0; y < 64; y++) {
      const B = Z(a, 6) ^ Z(a, 11) ^ Z(a, 25), w = g + B + vn(a, l, p) + Gn[y] + gt[y] | 0, I = (Z(n, 2) ^ Z(n, 13) ^ Z(n, 22)) + Kn(n, s, u) | 0;
      g = p, p = l, l = a, a = c + w | 0, c = u, u = s, s = n, n = w + I | 0;
    }
    n = n + this.A | 0, s = s + this.B | 0, u = u + this.C | 0, c = c + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(n, s, u, c, a, l, p, g);
  }
  roundClean() {
    gt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const Wr = /* @__PURE__ */ Dn(() => new zn());
class Zr extends Je {
  constructor(t, e) {
    super(), this.finished = !1, this.destroyed = !1, Ln(t);
    const n = kt(e);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, u = new Uint8Array(s);
    u.set(n.length > s ? t.create().update(n).digest() : n);
    for (let c = 0; c < u.length; c++)
      u[c] ^= 54;
    this.iHash.update(u), this.oHash = t.create();
    for (let c = 0; c < u.length; c++)
      u[c] ^= 106;
    this.oHash.update(u), u.fill(0);
  }
  update(t) {
    return St(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    St(this), ue(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: e, iHash: n, finished: s, destroyed: u, blockLen: c, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = u, t.blockLen = c, t.outputLen = a, t.oHash = e._cloneInto(t.oHash), t.iHash = n._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const tn = (o, t, e) => new Zr(o, t).update(e).digest();
tn.create = (o, t) => new Zr(o, t);
const Qt = /* @__PURE__ */ BigInt(2 ** 32 - 1), ar = /* @__PURE__ */ BigInt(32);
function cr(o, t = !1) {
  return t ? { h: Number(o & Qt), l: Number(o >> ar & Qt) } : { h: Number(o >> ar & Qt) | 0, l: Number(o & Qt) | 0 };
}
class jn extends Je {
  constructor(t, e, n = {}, s, u, c) {
    if (super(), this.blockLen = t, this.outputLen = e, this.length = 0, this.pos = 0, this.finished = !1, this.destroyed = !1, At(t), At(e), At(s), e < 0 || e > s)
      throw new Error("outputLen bigger than keyLen");
    if (n.key !== void 0 && (n.key.length < 1 || n.key.length > s))
      throw new Error(`key must be up 1..${s} byte long or undefined`);
    if (n.salt !== void 0 && n.salt.length !== u)
      throw new Error(`salt must be ${u} byte long or undefined`);
    if (n.personalization !== void 0 && n.personalization.length !== c)
      throw new Error(`personalization must be ${c} byte long or undefined`);
    this.buffer32 = ne(this.buffer = new Uint8Array(t));
  }
  update(t) {
    St(this);
    const { blockLen: e, buffer: n, buffer32: s } = this;
    t = kt(t);
    const u = t.length, c = t.byteOffset, a = t.buffer;
    for (let l = 0; l < u; ) {
      this.pos === e && (et || tt(s), this.compress(s, 0, !1), et || tt(s), this.pos = 0);
      const p = Math.min(e - this.pos, u - l), g = c + l;
      if (p === e && !(g % 4) && l + p < u) {
        const y = new Uint32Array(a, g, Math.floor((u - l) / 4));
        et || tt(y);
        for (let B = 0; l + e < u; B += s.length, l += e)
          this.length += e, this.compress(y, B, !1);
        et || tt(y);
        continue;
      }
      n.set(t.subarray(l, l + p), this.pos), this.pos += p, this.length += p, l += p;
    }
    return this;
  }
  digestInto(t) {
    St(this), Ye(t, this);
    const { pos: e, buffer32: n } = this;
    this.finished = !0, this.buffer.subarray(e).fill(0), et || tt(n), this.compress(n, 0, !0), et || tt(n);
    const s = ne(t);
    this.get().forEach((u, c) => s[c] = Mn(u));
  }
  digest() {
    const { buffer: t, outputLen: e } = this;
    this.digestInto(t);
    const n = t.slice(0, e);
    return this.destroy(), n;
  }
  _cloneInto(t) {
    const { buffer: e, length: n, finished: s, destroyed: u, outputLen: c, pos: a } = this;
    return t || (t = new this.constructor({ dkLen: c })), t.set(...this.get()), t.length = n, t.finished = s, t.destroyed = u, t.outputLen = c, t.buffer.set(e), t.pos = a, t;
  }
}
const ct = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
function yt(o, t, e, n, s) {
  return o = o + t + s | 0, n = Z(n ^ o, 16), e = e + n | 0, t = Z(t ^ e, 12), { a: o, b: t, c: e, d: n };
}
function wt(o, t, e, n, s) {
  return o = o + t + s | 0, n = Z(n ^ o, 8), e = e + n | 0, t = Z(t ^ e, 7), { a: o, b: t, c: e, d: n };
}
function fr(o, t, e, n, s, u, c, a, l, p, g, y, B, w, E, I, C, S, x, T) {
  let P = 0;
  for (let M = 0; M < n; M++)
    ({ a: s, b: l, c: B, d: C } = yt(s, l, B, C, e[t + o[P++]])), { a: s, b: l, c: B, d: C } = wt(s, l, B, C, e[t + o[P++]]), { a: u, b: p, c: w, d: S } = yt(u, p, w, S, e[t + o[P++]]), { a: u, b: p, c: w, d: S } = wt(u, p, w, S, e[t + o[P++]]), { a: c, b: g, c: E, d: x } = yt(c, g, E, x, e[t + o[P++]]), { a: c, b: g, c: E, d: x } = wt(c, g, E, x, e[t + o[P++]]), { a, b: y, c: I, d: T } = yt(a, y, I, T, e[t + o[P++]]), { a, b: y, c: I, d: T } = wt(a, y, I, T, e[t + o[P++]]), { a: s, b: p, c: E, d: T } = yt(s, p, E, T, e[t + o[P++]]), { a: s, b: p, c: E, d: T } = wt(s, p, E, T, e[t + o[P++]]), { a: u, b: g, c: I, d: C } = yt(u, g, I, C, e[t + o[P++]]), { a: u, b: g, c: I, d: C } = wt(u, g, I, C, e[t + o[P++]]), { a: c, b: y, c: B, d: S } = yt(c, y, B, S, e[t + o[P++]]), { a: c, b: y, c: B, d: S } = wt(c, y, B, S, e[t + o[P++]]), { a, b: l, c: w, d: x } = yt(a, l, w, x, e[t + o[P++]]), { a, b: l, c: w, d: x } = wt(a, l, w, x, e[t + o[P++]]);
  return { v0: s, v1: u, v2: c, v3: a, v4: l, v5: p, v6: g, v7: y, v8: B, v9: w, v10: E, v11: I, v12: C, v13: S, v14: x, v15: T };
}
const hr = /* @__PURE__ */ (() => {
  const o = Array.from({ length: 16 }, (n, s) => s), t = (n) => [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8].map((s) => n[s]), e = [];
  for (let n = 0, s = o; n < 7; n++, s = t(s))
    e.push(...s);
  return Uint8Array.from(e);
})();
class Xe extends jn {
  constructor(t = {}, e = 0) {
    if (super(64, t.dkLen === void 0 ? 32 : t.dkLen, {}, Number.MAX_SAFE_INTEGER, 0, 0), this.flags = 0, this.chunkPos = 0, this.chunksDone = 0, this.stack = [], this.posOut = 0, this.bufferOut32 = new Uint32Array(16), this.chunkOut = 0, this.enableXOF = !0, this.outputLen = t.dkLen === void 0 ? 32 : t.dkLen, At(this.outputLen), t.key !== void 0 && t.context !== void 0)
      throw new Error("Blake3: only key or context can be specified at same time");
    if (t.key !== void 0) {
      const n = kt(t.key).slice();
      if (n.length !== 32)
        throw new Error("Blake3: key should be 32 byte");
      this.IV = ne(n), et || tt(this.IV), this.flags = e | 16;
    } else if (t.context !== void 0) {
      const n = new Xe(
        { dkLen: 32 },
        32
        /* B3_Flags.DERIVE_KEY_CONTEXT */
      ).update(t.context).digest();
      this.IV = ne(n), et || tt(this.IV), this.flags = e | 64;
    } else
      this.IV = ct.slice(), this.flags = e;
    this.state = this.IV.slice(), this.bufferOut = _n(this.bufferOut32);
  }
  // Unused
  get() {
    return [];
  }
  set() {
  }
  b2Compress(t, e, n, s = 0) {
    const { state: u, pos: c } = this, { h: a, l } = cr(BigInt(t), !0), { v0: p, v1: g, v2: y, v3: B, v4: w, v5: E, v6: I, v7: C, v8: S, v9: x, v10: T, v11: P, v12: M, v13: U, v14: N, v15: F } = fr(hr, s, n, 7, u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], ct[0], ct[1], ct[2], ct[3], a, l, c, e);
    u[0] = p ^ S, u[1] = g ^ x, u[2] = y ^ T, u[3] = B ^ P, u[4] = w ^ M, u[5] = E ^ U, u[6] = I ^ N, u[7] = C ^ F;
  }
  compress(t, e = 0, n = !1) {
    let s = this.flags;
    if (this.chunkPos || (s |= 1), (this.chunkPos === 15 || n) && (s |= 2), n || (this.pos = this.blockLen), this.b2Compress(this.chunksDone, s, t, e), this.chunkPos += 1, this.chunkPos === 16 || n) {
      let u = this.state;
      this.state = this.IV.slice();
      for (let c, a = this.chunksDone + 1; (n || !(a & 1)) && (c = this.stack.pop()); a >>= 1)
        this.buffer32.set(c, 0), this.buffer32.set(u, 8), this.pos = this.blockLen, this.b2Compress(0, this.flags | 4, this.buffer32, 0), u = this.state, this.state = this.IV.slice();
      this.chunksDone++, this.chunkPos = 0, this.stack.push(u);
    }
    this.pos = 0;
  }
  _cloneInto(t) {
    t = super._cloneInto(t);
    const { IV: e, flags: n, state: s, chunkPos: u, posOut: c, chunkOut: a, stack: l, chunksDone: p } = this;
    return t.state.set(s.slice()), t.stack = l.map((g) => Uint32Array.from(g)), t.IV.set(e), t.flags = n, t.chunkPos = u, t.chunksDone = p, t.posOut = c, t.chunkOut = a, t.enableXOF = this.enableXOF, t.bufferOut32.set(this.bufferOut32), t;
  }
  destroy() {
    this.destroyed = !0, this.state.fill(0), this.buffer32.fill(0), this.IV.fill(0), this.bufferOut32.fill(0);
    for (let t of this.stack)
      t.fill(0);
  }
  // Same as b2Compress, but doesn't modify state and returns 16 u32 array (instead of 8)
  b2CompressOut() {
    const { state: t, pos: e, flags: n, buffer32: s, bufferOut32: u } = this, { h: c, l: a } = cr(BigInt(this.chunkOut++));
    et || tt(s);
    const { v0: l, v1: p, v2: g, v3: y, v4: B, v5: w, v6: E, v7: I, v8: C, v9: S, v10: x, v11: T, v12: P, v13: M, v14: U, v15: N } = fr(hr, 0, s, 7, t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], ct[0], ct[1], ct[2], ct[3], a, c, e, n);
    u[0] = l ^ C, u[1] = p ^ S, u[2] = g ^ x, u[3] = y ^ T, u[4] = B ^ P, u[5] = w ^ M, u[6] = E ^ U, u[7] = I ^ N, u[8] = t[0] ^ C, u[9] = t[1] ^ S, u[10] = t[2] ^ x, u[11] = t[3] ^ T, u[12] = t[4] ^ P, u[13] = t[5] ^ M, u[14] = t[6] ^ U, u[15] = t[7] ^ N, et || (tt(s), tt(u)), this.posOut = 0;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0, this.buffer.fill(0, this.pos);
    let t = this.flags | 8;
    this.stack.length ? (t |= 4, et || tt(this.buffer32), this.compress(this.buffer32, 0, !0), et || tt(this.buffer32), this.chunksDone = 0, this.pos = this.blockLen) : t |= (this.chunkPos ? 0 : 1) | 2, this.flags = t, this.b2CompressOut();
  }
  writeInto(t) {
    St(this, !1), ue(t), this.finish();
    const { blockLen: e, bufferOut: n } = this;
    for (let s = 0, u = t.length; s < u; ) {
      this.posOut >= e && this.b2CompressOut();
      const c = Math.min(e - this.posOut, u - s);
      t.set(n.subarray(this.posOut, this.posOut + c), s), this.posOut += c, s += c;
    }
    return t;
  }
  xofInto(t) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible after digest call");
    return this.writeInto(t);
  }
  xof(t) {
    return At(t), this.xofInto(new Uint8Array(t));
  }
  digestInto(t) {
    if (Ye(t, this), this.finished)
      throw new Error("digest() was already called");
    return this.enableXOF = !1, this.writeInto(t), this.destroy(), t;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
}
const lr = /* @__PURE__ */ $n((o) => new Xe(o)), ve = "qpzry9x8gf2tvdw0s3jn54khce6mua7l", It = 8, dr = [0x98f2bc8e61n, 0x79b76d99e2n, 0xf33e5fb3c4n, 0xae2eabe2a8n, 0x1e4f43e470n];
function pr(o, t, e) {
  const n = Buffer.concat([Buffer.from([e]), t]), s = en(n, 8, 5, !0), u = nn(o, s), c = Buffer.concat([s, u]), a = rn(c);
  return `${o}:${a}`;
}
function Ke(o) {
  if (o.length < It + 2)
    throw new Error(`Invalid bech32 string length ${o.length}`);
  for (let B = 0; B < o.length; B++) {
    const w = o.charCodeAt(B);
    if (w < 33 || w > 126)
      throw new Error(`Invalid character in string: '${o[B]}'`);
  }
  const t = o.toLowerCase(), e = o.toUpperCase();
  if (o !== t && o !== e)
    throw new Error("String not all lowercase or all uppercase");
  const n = t, s = n.lastIndexOf(":");
  if (s < 1 || s + It + 1 > n.length)
    throw new Error('Invalid index of ":"');
  const u = n.slice(0, s), c = n.slice(s + 1), a = Yn(c);
  if (!Jn(u, a)) {
    const B = c.slice(-It), w = rn(nn(u, a.slice(0, -It)));
    throw new Error(`Checksum failed. Expected ${w}, got ${B}`);
  }
  const l = a.slice(0, -It), p = en(l, 5, 8, !1), g = p[0], y = p.slice(1);
  return { prefix: u, payload: y, version: g };
}
function en(o, t, e, n) {
  const s = [];
  let u = 0, c = 0;
  for (const a of o)
    for (u = u << t | a, c += t; c >= e; )
      c -= e, s.push(u >> c & (1 << e) - 1), u &= (1 << c) - 1;
  if (n && c > 0)
    s.push(u << e - c & (1 << e) - 1);
  else if (c >= t || c > 0 && u !== 0)
    throw new Error("Invalid padding in conversion");
  return Buffer.from(s);
}
function rn(o) {
  let t = "";
  for (const e of o) {
    if (e >= ve.length)
      return "";
    t += ve[e];
  }
  return t;
}
function Yn(o) {
  const t = [];
  for (const e of o) {
    const n = ve.indexOf(e);
    if (n < 0)
      throw new Error(`Invalid character not part of charset: ${e}`);
    t.push(n);
  }
  return Buffer.from(t);
}
function nn(o, t) {
  const e = sn(o), n = Array.from(t), s = [0, 0, 0, 0, 0, 0, 0, 0], u = [...e, 0, ...n, ...s], c = on(u), a = [];
  for (let l = 0; l < It; l++)
    a.push(Number(c >> BigInt(5 * (It - 1 - l)) & 31n));
  return Buffer.from(a);
}
function Jn(o, t) {
  const e = sn(o), n = Array.from(t), s = [...e, 0, ...n];
  return on(s) === 0n;
}
function sn(o) {
  const t = [];
  for (let e = 0; e < o.length; e++) {
    const n = o.charCodeAt(e);
    t.push(n & 31);
  }
  return t;
}
function on(o) {
  let t = 1n;
  for (const e of o) {
    const n = t >> 35n;
    t = (t & 0x07ffffffffn) << 5n ^ BigInt(e);
    for (let s = 0; s < dr.length; s++)
      (n >> BigInt(s) & 1n) === 1n && (t ^= dr[s]);
  }
  return t ^ 1n;
}
const j = {
  // Network prefixes
  MAINNET_PREFIX: "hoosat",
  TESTNET_PREFIX: "hoosattest",
  // Address prefixes (with colon for validation)
  MAINNET_ADDRESS_PREFIX: "hoosat:",
  TESTNET_ADDRESS_PREFIX: "hoosattest:",
  SIGHASH_ALL: 1,
  SIGHASH_NONE: 2,
  SIGHASH_SINGLE: 4,
  SIGHASH_ANYONECANPAY: 128,
  COINBASE_MATURITY: 100,
  MIN_FEE: 3250,
  SUBNETWORK_ID_NATIVE: A.Buffer.alloc(20, 0)
}, mt = {
  // Transaction structure overhead (from HTND code)
  // version(2) + input_count(8) + output_count(8) + lockTime(8) +
  // subnetwork(32) + gas(8) + payload_hash(32) + payload_length(8) = 106 bytes
  BaseTxOverhead: 106,
  // Per-input size estimation (from HTND code)
  // outpoint(36) + sig_script_length(8) + signature(~107) + sequence(8) = 159 bytes
  EstimatedInputSize: 159,
  // Per-output size estimation (from HTND code)
  // amount(8) + version(2) + script_length(8) + script(~35) = 53 bytes
  EstimatedOutputSize: 53,
  // Mass calculation weights (from HTND)
  MassPerTxByte: 1,
  MassPerScriptPubKeyByte: 10,
  MassPerSigOp: 1e3,
  // Script-only size per output for extra mass calculation (from HTND)
  // version(2) + script(~34) = 36 bytes (НЕ 34!)
  ScriptPubKeyBytesPerOutput: 36
};
oe.hmacSha256Sync = (o, ...t) => {
  const e = tn.create(Wr, o);
  return t.forEach((n) => e.update(n)), e.digest();
};
class ft {
  // ==================== HASHING ====================
  /**
   * Computes Blake3 hash (single pass)
   * @param data - Data to hash
   * @returns 32-byte hash
   * @example
   * const hash = HoosatCrypto.blake3Hash(Buffer.from('hello'));
   */
  static blake3Hash(t) {
    const e = lr(t, { dkLen: 32 });
    return A.Buffer.from(e);
  }
  /**
   * Computes double Blake3 hash (for transaction IDs)
   * @param data - Data to hash
   * @returns 32-byte double hash
   * @example
   * const doubleHash = HoosatCrypto.doubleBlake3Hash(txData);
   */
  static doubleBlake3Hash(t) {
    return this.blake3Hash(this.blake3Hash(t));
  }
  /**
   * Computes Blake3 keyed hash (Hoosat-specific)
   * Used internally for signature hashing
   * @param key - 32-byte key or string (auto-padded with zeros)
   * @param data - Data to hash
   * @returns 32-byte keyed hash
   * @example
   * const hash = HoosatCrypto.blake3KeyedHash('TransactionSigningHash', data);
   */
  static blake3KeyedHash(t, e) {
    let n;
    if (typeof t == "string") {
      const u = new TextEncoder(), c = new Uint8Array(32), a = u.encode(t);
      c.set(a.slice(0, 32)), n = c;
    } else if (t.length === 32)
      n = t instanceof A.Buffer ? new Uint8Array(t) : t;
    else
      throw new Error(`Blake3 key must be 32 bytes, got ${t.length}`);
    const s = lr(e, { key: n, dkLen: 32 });
    return A.Buffer.from(s);
  }
  /**
   * Computes SHA256 hash (for ECDSA signature hashing)
   * @param data - Data to hash
   * @returns 32-byte hash
   * @internal
   */
  static sha256Hash(t) {
    return A.Buffer.from(Wr(t));
  }
  /**
   * Computes double SHA256 hash
   * @param data - Data to hash
   * @returns 32-byte double hash
   * @internal
   */
  static doubleSha256Hash(t) {
    return this.sha256Hash(this.sha256Hash(t));
  }
  /**
   * Calculates transaction ID (double Blake3 hash)
   * @param transaction - Signed transaction object
   * @returns 64-character hex transaction ID
   * @example
   * const txId = HoosatCrypto.getTransactionId(signedTx);
   */
  static getTransactionId(t) {
    const e = this.serializeTransactionForID(t);
    return this.doubleBlake3Hash(e).toString("hex");
  }
  // ==================== KEY MANAGEMENT ====================
  /**
   * Generates a new ECDSA key pair with Hoosat address
   * Uses Web Crypto API for secure random generation
   * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
   * @returns KeyPair object containing privateKey, publicKey, and address
   * @example
   * const mainnetWallet = HoosatCrypto.generateKeyPair();
   * const testnetWallet = HoosatCrypto.generateKeyPair('testnet');
   */
  static generateKeyPair(t = "mainnet") {
    const e = Hn.randomPrivateKey(), n = A.Buffer.from(e), s = qe(e, !0), u = A.Buffer.from(s), c = this.publicKeyToAddressECDSA(u, t);
    return { privateKey: n, publicKey: u, address: c };
  }
  /**
   * Derives public key from private key
   * @param privateKey - 32-byte private key buffer
   * @returns 33-byte compressed ECDSA public key
   * @example
   * const publicKey = HoosatCrypto.getPublicKey(privateKey);
   */
  static getPublicKey(t) {
    try {
      const e = qe(t, !0);
      return A.Buffer.from(e);
    } catch {
      throw new Error("Invalid private key");
    }
  }
  /**
   * Imports wallet from hex-encoded private key
   * @param privateKeyHex - 64-character hex string (32 bytes)
   * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
   * @throws Error if private key is invalid
   * @example
   * const mainnetWallet = HoosatCrypto.importKeyPair('33a4a81e...');
   * const testnetWallet = HoosatCrypto.importKeyPair('33a4a81e...', 'testnet');
   */
  static importKeyPair(t, e = "mainnet") {
    const n = A.Buffer.from(t, "hex");
    if (n.length !== 32)
      throw new Error(`Private key must be 32 bytes, got ${n.length}`);
    try {
      const s = this.getPublicKey(n), u = this.publicKeyToAddressECDSA(s, e);
      return { privateKey: n, publicKey: s, address: u };
    } catch {
      throw new Error("Invalid private key");
    }
  }
  // ==================== ADDRESS OPERATIONS ====================
  /**
   * Converts Schnorr public key to Hoosat address (version 0x00)
   * @param publicKey - 32-byte Schnorr public key
   * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
   * @returns Bech32-encoded address
   * @example
   * const mainnetAddr = HoosatCrypto.publicKeyToAddress(schnorrPubkey);
   * const testnetAddr = HoosatCrypto.publicKeyToAddress(schnorrPubkey, 'testnet');
   */
  static publicKeyToAddress(t, e = "mainnet") {
    if (t.length !== 32)
      throw new Error(`Schnorr public key must be 32 bytes, got ${t.length}`);
    const n = e === "testnet" ? j.TESTNET_PREFIX : j.MAINNET_PREFIX, s = t instanceof A.Buffer ? t : A.Buffer.from(t);
    return pr(n, s, 0);
  }
  /**
   * Converts ECDSA public key to Hoosat address (version 0x01)
   * @param publicKey - 33-byte compressed ECDSA public key
   * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
   * @returns Bech32-encoded address with network prefix
   * @example
   * const mainnetAddr = HoosatCrypto.publicKeyToAddressECDSA(pubkey);
   * const testnetAddr = HoosatCrypto.publicKeyToAddressECDSA(pubkey, 'testnet');
   */
  static publicKeyToAddressECDSA(t, e = "mainnet") {
    if (t.length !== 33)
      throw new Error(`ECDSA public key must be 33 bytes, got ${t.length}`);
    const n = e === "testnet" ? j.TESTNET_PREFIX : j.MAINNET_PREFIX, s = t instanceof A.Buffer ? t : A.Buffer.from(t);
    return pr(n, s, 1);
  }
  /**
   * Converts Hoosat address to ScriptPublicKey for transaction outputs
   * @param address - Bech32-encoded Hoosat address
   * @returns Script buffer (format: length + pubkey + opcode)
   * @throws Error for unsupported address versions
   * @example
   * const script = HoosatCrypto.addressToScriptPublicKey('hoosat:qyp...');
   * // For ECDSA: 0x21 + 33-byte pubkey + 0xAB (OP_CHECKSIGECDSA)
   */
  static addressToScriptPublicKey(t) {
    const e = Ke(t);
    if (e.version === 0) {
      const n = e.payload.length;
      return A.Buffer.concat([
        A.Buffer.from([n]),
        e.payload,
        A.Buffer.from([172])
        // OP_CHECKSIG
      ]);
    }
    if (e.version === 1) {
      const n = e.payload.length;
      return A.Buffer.concat([
        A.Buffer.from([n]),
        e.payload,
        A.Buffer.from([171])
        // OP_CHECKSIGECDSA
      ]);
    }
    if (e.version === 8)
      return A.Buffer.concat([
        A.Buffer.from([170]),
        // OP_BLAKE3
        A.Buffer.from([32]),
        // OP_DATA_32
        e.payload,
        A.Buffer.from([135])
        // OP_EQUAL
      ]);
    throw new Error(`Unsupported address version: ${e.version}`);
  }
  // ==================== TRANSACTION UTILITIES ====================
  /**
   * Calculate minimum transaction fee using MASS-based calculation
   * Based on HTND implementation (util\txmass\calculator.go)
   *
   * Formula:
   * 1. size = overhead + (inputs × inputSize) + (outputs × outputSize)
   * 2. massForSize = size × 1
   * 3. massForScriptPubKey = (outputs × scriptPubKeySize) × 10
   * 4. massForSigOps = inputs × 1000
   * 5. massForPayload = payloadSize × 1
   * 6. totalMass = massForSize + massForScriptPubKey + massForSigOps + massForPayload
   * 7. fee = totalMass (minimumRelayTxFee = 1)
   *
   * @param inputCount - Number of inputs
   * @param outputCount - Number of outputs
   * @param payloadSize - Payload size in bytes (default: 0, for future subnetwork usage)
   * @returns Fee amount in sompi as string
   *
   * @example
   * const fee = HoosatCrypto.calculateMinFee(5, 2);
   * // Returns: "6653" (for 5 inputs, 2 outputs)
   *
   * @example
   * // With payload
   * const fee = HoosatCrypto.calculateMinFee(5, 2, 256);
   * // Returns: "6909" (for 5 inputs, 2 outputs, 256 byte payload)
   */
  static calculateMinFee(t, e, n = 0) {
    const s = mt.BaseTxOverhead + t * mt.EstimatedInputSize + e * mt.EstimatedOutputSize, u = e * mt.ScriptPubKeyBytesPerOutput, c = s * mt.MassPerTxByte, a = u * mt.MassPerScriptPubKeyByte, l = t * mt.MassPerSigOp, p = n * mt.MassPerTxByte;
    return (c + a + l + p).toString();
  }
  // ==================== TRANSACTION SIGNING ====================
  /**
   * Computes Schnorr signature hash (intermediate step)
   * Uses Blake3 keyed hash with "TransactionSigningHash" domain
   * @param transaction - Transaction to sign
   * @param inputIndex - Index of input to sign (0-based)
   * @param utxo - UTXO being spent
   * @param reusedValues - Cache for hash optimization (optional)
   * @returns 32-byte signature hash
   * @internal Exposed for testing/debugging only
   */
  static getSignatureHashSchnorr(t, e, n, s = {}) {
    const u = t.inputs[e], c = j.SIGHASH_ALL, a = [], l = A.Buffer.alloc(2);
    l.writeUInt16LE(t.version, 0), a.push(l), a.push(this._getPreviousOutputsHash(t, c, s)), a.push(this._getSequencesHash(t, c, s)), a.push(this._getSigOpCountsHash(t, c, s)), a.push(A.Buffer.from(u.previousOutpoint.transactionId, "hex"));
    const p = A.Buffer.alloc(4);
    p.writeUInt32LE(u.previousOutpoint.index, 0), a.push(p);
    const g = A.Buffer.alloc(2);
    g.writeUInt16LE(0, 0), a.push(g);
    const y = A.Buffer.from(n.utxoEntry.scriptPublicKey.script, "hex"), B = A.Buffer.alloc(8);
    B.writeBigUInt64LE(BigInt(y.length), 0), a.push(B), a.push(y);
    const w = A.Buffer.alloc(8);
    w.writeBigUInt64LE(BigInt(n.utxoEntry.amount), 0), a.push(w);
    const E = A.Buffer.alloc(8);
    E.writeBigUInt64LE(BigInt(u.sequence), 0), a.push(E), a.push(A.Buffer.from([u.sigOpCount])), a.push(this._getOutputsHash(t, e, c, s));
    const I = A.Buffer.alloc(8);
    I.writeBigUInt64LE(BigInt(t.lockTime), 0), a.push(I), a.push(A.Buffer.from(t.subnetworkId, "hex"));
    const C = A.Buffer.alloc(8);
    C.writeBigUInt64LE(BigInt(t.gas), 0), a.push(C), a.push(this._getPayloadHash(t, s)), a.push(A.Buffer.from([c]));
    const S = A.Buffer.concat(a);
    return this.blake3KeyedHash("TransactionSigningHash", S);
  }
  /**
   * Computes ECDSA signature hash (final step)
   * Formula: SHA256(SHA256("TransactionSigningHashECDSA") + schnorrHash)
   * @param transaction - Transaction to sign
   * @param inputIndex - Index of input to sign (0-based)
   * @param utxo - UTXO being spent
   * @param reusedValues - Cache for hash optimization (optional)
   * @returns 32-byte ECDSA signature hash
   * @internal Exposed for testing/debugging only
   */
  static getSignatureHashECDSA(t, e, n, s = {}) {
    const u = this.getSignatureHashSchnorr(t, e, n, s), c = this.sha256Hash(A.Buffer.from("TransactionSigningHashECDSA", "utf8")), a = A.Buffer.concat([c, u]);
    return this.sha256Hash(a);
  }
  /**
   * Signs single transaction input with ECDSA
   * @param transaction - Transaction to sign
   * @param inputIndex - Index of input to sign (0-based)
   * @param privateKey - 32-byte private key
   * @param utxo - UTXO being spent (includes scriptPubKey)
   * @param reusedValues - Cache for hash optimization (optional)
   * @returns Signature object with 64-byte raw signature + pubkey
   * @internal Used by TxBuilder
   */
  static signTransactionInput(t, e, n, s, u = {}) {
    const c = this.getSignatureHashECDSA(t, e, s, u), a = Yr(c, n), l = this.getPublicKey(n);
    return {
      signature: A.Buffer.from(a.toCompactRawBytes()),
      publicKey: l,
      sigHashType: j.SIGHASH_ALL
    };
  }
  /**
   * Verifies ECDSA signature for transaction input
   * @param transaction - Transaction containing the input
   * @param inputIndex - Index of input to verify
   * @param signature - 64-byte raw ECDSA signature
   * @param publicKey - 33-byte compressed public key
   * @param utxo - UTXO that was spent
   * @returns true if signature is valid
   * @internal Used for testing/validation
   */
  static verifyTransactionSignature(t, e, n, s, u) {
    try {
      const c = this.getSignatureHashECDSA(t, e, u), a = at.fromCompact(n);
      return Jr(a, c, s);
    } catch {
      return !1;
    }
  }
  // ==================== PRIVATE HELPERS ====================
  static _getPreviousOutputsHash(t, e, n) {
    if (e & j.SIGHASH_ANYONECANPAY)
      return A.Buffer.alloc(32, 0);
    if (!n.previousOutputsHash) {
      const s = [];
      for (const u of t.inputs) {
        s.push(A.Buffer.from(u.previousOutpoint.transactionId, "hex"));
        const c = A.Buffer.alloc(4);
        c.writeUInt32LE(u.previousOutpoint.index, 0), s.push(c);
      }
      n.previousOutputsHash = this.blake3KeyedHash("TransactionSigningHash", A.Buffer.concat(s));
    }
    return n.previousOutputsHash;
  }
  static _getSequencesHash(t, e, n) {
    if ((e & 7) === j.SIGHASH_SINGLE || (e & 7) === j.SIGHASH_NONE || e & j.SIGHASH_ANYONECANPAY)
      return A.Buffer.alloc(32, 0);
    if (!n.sequencesHash) {
      const s = [];
      for (const u of t.inputs) {
        const c = A.Buffer.alloc(8);
        c.writeBigUInt64LE(BigInt(u.sequence), 0), s.push(c);
      }
      n.sequencesHash = this.blake3KeyedHash("TransactionSigningHash", A.Buffer.concat(s));
    }
    return n.sequencesHash;
  }
  static _getSigOpCountsHash(t, e, n) {
    if (e & j.SIGHASH_ANYONECANPAY)
      return A.Buffer.alloc(32, 0);
    if (!n.sigOpCountsHash) {
      const s = t.inputs.map((u) => u.sigOpCount);
      n.sigOpCountsHash = this.blake3KeyedHash("TransactionSigningHash", A.Buffer.from(s));
    }
    return n.sigOpCountsHash;
  }
  static _getOutputsHash(t, e, n, s) {
    if ((n & 7) === j.SIGHASH_NONE)
      return A.Buffer.alloc(32, 0);
    if ((n & 7) === j.SIGHASH_SINGLE) {
      if (e >= t.outputs.length)
        return A.Buffer.alloc(32, 0);
      const u = [], c = t.outputs[e], a = A.Buffer.alloc(8);
      a.writeBigUInt64LE(BigInt(c.amount), 0), u.push(a);
      const l = A.Buffer.alloc(2);
      l.writeUInt16LE(0, 0), u.push(l);
      const p = A.Buffer.from(c.scriptPublicKey.scriptPublicKey, "hex"), g = A.Buffer.alloc(8);
      return g.writeBigUInt64LE(BigInt(p.length), 0), u.push(g), u.push(p), this.blake3KeyedHash("TransactionSigningHash", A.Buffer.concat(u));
    }
    if (!s.outputsHash) {
      const u = [];
      for (const c of t.outputs) {
        const a = A.Buffer.alloc(8);
        a.writeBigUInt64LE(BigInt(c.amount), 0), u.push(a);
        const l = A.Buffer.alloc(2);
        l.writeUInt16LE(0, 0), u.push(l);
        const p = A.Buffer.from(c.scriptPublicKey.scriptPublicKey, "hex"), g = A.Buffer.alloc(8);
        g.writeBigUInt64LE(BigInt(p.length), 0), u.push(g), u.push(p);
      }
      s.outputsHash = this.blake3KeyedHash("TransactionSigningHash", A.Buffer.concat(u));
    }
    return s.outputsHash;
  }
  static _getPayloadHash(t, e) {
    if (A.Buffer.from(t.subnetworkId, "hex").equals(j.SUBNETWORK_ID_NATIVE))
      return A.Buffer.alloc(32, 0);
    if (!e.payloadHash) {
      const s = A.Buffer.from(t.payload, "hex"), u = A.Buffer.alloc(8);
      u.writeBigUInt64LE(BigInt(s.length), 0), e.payloadHash = this.blake3KeyedHash("TransactionSigningHash", A.Buffer.concat([u, s]));
    }
    return e.payloadHash;
  }
  /**
   * Serializes transaction for ID calculation
   * @param transaction - Transaction to serialize
   * @returns Serialized transaction buffer
   * @internal
   */
  static serializeTransactionForID(t) {
    const e = [], n = A.Buffer.alloc(2);
    n.writeUInt16LE(t.version, 0), e.push(n);
    const s = A.Buffer.alloc(8);
    s.writeBigUInt64LE(BigInt(t.inputs.length), 0), e.push(s);
    for (const p of t.inputs) {
      e.push(A.Buffer.from(p.previousOutpoint.transactionId, "hex").reverse());
      const g = A.Buffer.alloc(4);
      g.writeUInt32LE(p.previousOutpoint.index, 0), e.push(g);
      const y = A.Buffer.from(p.signatureScript, "hex"), B = A.Buffer.alloc(8);
      B.writeBigUInt64LE(BigInt(y.length), 0), e.push(B), e.push(y);
      const w = A.Buffer.alloc(8);
      w.writeBigUInt64LE(BigInt(p.sequence), 0), e.push(w);
    }
    const u = A.Buffer.alloc(8);
    u.writeBigUInt64LE(BigInt(t.outputs.length), 0), e.push(u);
    for (const p of t.outputs) {
      const g = A.Buffer.alloc(8);
      g.writeBigUInt64LE(BigInt(p.amount), 0), e.push(g);
      const y = A.Buffer.alloc(2);
      y.writeUInt16LE(p.scriptPublicKey.version, 0), e.push(y);
      const B = A.Buffer.from(p.scriptPublicKey.scriptPublicKey, "hex"), w = A.Buffer.alloc(8);
      w.writeBigUInt64LE(BigInt(B.length), 0), e.push(w), e.push(B);
    }
    const c = A.Buffer.alloc(8);
    c.writeBigUInt64LE(BigInt(t.lockTime), 0), e.push(c), e.push(A.Buffer.from(t.subnetworkId, "hex"));
    const a = A.Buffer.alloc(8);
    a.writeBigUInt64LE(BigInt(t.gas || "0"), 0), e.push(a);
    const l = t.payload ? A.Buffer.from(t.payload, "hex") : A.Buffer.alloc(32, 0);
    return e.push(l), A.Buffer.concat(e);
  }
}
const Xn = `Hoosat Signed Message:
`;
function Qn(o) {
  return `${Xn}${o}`;
}
function ge(o) {
  const t = Qn(o), e = A.Buffer.from(t, "utf8");
  return ft.blake3Hash(e);
}
function Ai(o) {
  return ft.blake3Hash(o);
}
class Si {
  /**
   * Sign a message with a private key
   *
   * @param privateKey - Hex string private key (64 chars without 0x prefix)
   * @param message - Message to sign (plain text)
   * @returns Compact signature in hex format (128 chars)
   *
   * @throws Error if private key is invalid
   * @throws Error if signing fails
   *
   * @example
   * ```typescript
   * const privateKey = 'a1b2c3d4...'; // 64 char hex
   * const signature = HoosatSigner.signMessage(privateKey, 'Hello World');
   * console.log(signature); // "3045022100ab12cd34..."
   * ```
   */
  static signMessage(t, e) {
    try {
      const n = t.replace(/^0x/, "");
      if (n.length !== 64)
        throw new Error("Private key must be 64 hex characters");
      const s = ge(e);
      return Yr(s, n, {
        lowS: !0
        // Prevent signature malleability (BIP-62)
      }).toCompactHex();
    } catch (n) {
      throw new Error(`Message signing failed: ${n.message}`);
    }
  }
  /**
   * Verify a message signature
   *
   * @param signature - Compact signature hex (128 chars)
   * @param message - Original message that was signed
   * @param publicKey - Public key hex (66 chars, compressed format with 02/03 prefix)
   * @returns True if signature is valid
   *
   * @example
   * ```typescript
   * const isValid = HoosatSigner.verifyMessage(
   *   signature,
   *   'Hello World',
   *   publicKey
   * );
   * console.log(isValid); // true or false
   * ```
   */
  static verifyMessage(t, e, n) {
    try {
      const s = t.replace(/^0x/, ""), u = n.replace(/^0x/, ""), c = ge(e), a = at.fromCompact(s);
      return Jr(a, c, u);
    } catch (s) {
      return console.error("Signature verification failed:", s), !1;
    }
  }
  /**
   * Recover public key from signature
   *
   * Note: This method requires trying different recovery IDs (0-3)
   * to find the correct public key. Use verifyMessage() when possible.
   *
   * @param signature - Compact signature hex (128 chars)
   * @param message - Original message
   * @param recoveryId - Recovery ID (0-3), default 0
   * @returns Recovered public key in compressed format (66 hex chars)
   *
   * @throws Error if recovery fails
   *
   * @example
   * ```typescript
   * const publicKey = HoosatSigner.recoverPublicKey(
   *   signature,
   *   'Hello World',
   *   0
   * );
   * ```
   */
  static recoverPublicKey(t, e, n = 0) {
    try {
      const s = t.replace(/^0x/, ""), u = ge(e);
      return at.fromCompact(s).addRecoveryBit(n).recoverPublicKey(u).toHex(!0);
    } catch (s) {
      throw new Error(`Public key recovery failed: ${s.message}`);
    }
  }
  /**
   * Get public key from private key
   *
   * @param privateKey - Private key hex (64 chars)
   * @param compressed - Return compressed format (default: true)
   * @returns Public key hex string (66 chars if compressed, 130 if uncompressed)
   *
   * @example
   * ```typescript
   * const publicKey = HoosatSigner.getPublicKey(privateKey);
   * console.log(publicKey); // "02a1b2c3d4..."
   * ```
   */
  static getPublicKey(t, e = !0) {
    try {
      const n = t.replace(/^0x/, ""), s = qe(n, e);
      return A.Buffer.from(s).toString("hex");
    } catch (n) {
      throw new Error(`Failed to derive public key: ${n.message}`);
    }
  }
  /**
   * Create a complete signed message object
   *
   * @param privateKey - Private key to sign with
   * @param message - Message to sign
   * @param address - Hoosat address (for metadata)
   * @returns Complete SignedMessage object with timestamp
   *
   * @example
   * ```typescript
   * const signedMsg = HoosatSigner.createSignedMessage(
   *   privateKey,
   *   'Hello World',
   *   'hoosat:qyp...'
   * );
   * // Returns: { message, signature, address, timestamp }
   * ```
   */
  static createSignedMessage(t, e, n) {
    const s = this.signMessage(t, e);
    return {
      message: e,
      signature: s,
      address: n,
      timestamp: Date.now()
    };
  }
  /**
   * Verify a complete signed message object
   *
   * @param signedMessage - SignedMessage object to verify
   * @param publicKey - Public key to verify against
   * @returns Verification result with details
   *
   * @example
   * ```typescript
   * const result = HoosatSigner.verifySignedMessage(signedMsg, publicKey);
   * if (result.valid) {
   *   console.log('Signature is valid');
   * } else {
   *   console.log('Invalid:', result.error);
   * }
   * ```
   */
  static verifySignedMessage(t, e) {
    try {
      return this.verifyMessage(t.signature, t.message, e) ? {
        valid: !0,
        publicKey: e
      } : {
        valid: !1,
        error: "Invalid signature"
      };
    } catch (n) {
      return {
        valid: !1,
        error: n.message
      };
    }
  }
}
class un {
  constructor(t) {
    this.baseUrl = t.baseUrl.replace(/\/$/, ""), this.timeout = t.timeout || 3e4, this.headers = {
      "Content-Type": "application/json",
      ...t.headers
    }, this.debug = t.debug || !1;
  }
  async request(t, e = {}) {
    const n = `${this.baseUrl}${t}`, s = e.timeout || this.timeout;
    this.debug && (console.log(`[${this.constructor.name}] ${e.method || "GET"} ${n}`), e.body && console.log(`[${this.constructor.name}] Request body:`, e.body));
    const u = new AbortController(), c = setTimeout(() => u.abort(), s);
    try {
      const a = await fetch(n, {
        ...e,
        headers: {
          ...this.headers,
          ...e.headers
        },
        signal: u.signal
      });
      if (clearTimeout(c), !a.ok)
        throw new Error(`HTTP ${a.status}: ${a.statusText}`);
      const l = await a.json();
      return this.debug && console.log(`[${this.constructor.name}] Response:`, l), this.transformResponse(l);
    } catch (a) {
      throw clearTimeout(c), a.name === "AbortError" ? new Error(`Request timeout after ${s}ms`) : (this.debug && console.error(`[${this.constructor.name}] Error:`, a), a);
    }
  }
  async ping() {
    try {
      return await this.getNetworkInfo(), !0;
    } catch {
      return !1;
    }
  }
}
class an extends un {
  get endpoints() {
    return {
      balance: "/address/:address/balance",
      utxos: "/address/utxos",
      submitTransaction: "/transaction/submit",
      networkInfo: "/node/info",
      feeEstimate: "/mempool/fee-estimate"
    };
  }
  transformResponse(t) {
    if (t.success !== void 0) {
      const e = t;
      if (!e.success)
        throw new Error(e.error || "API request failed");
      if (!e.data)
        throw new Error("API response missing data field");
      return e.data;
    }
    return t;
  }
  async getBalance(t) {
    const e = this.endpoints.balance.replace(":address", t);
    return this.request(e);
  }
  async getUtxos(t) {
    const e = await this.request(this.endpoints.utxos, {
      method: "POST",
      body: JSON.stringify({ addresses: t })
    });
    return e.utxos && (e.utxos = e.utxos.map((n) => ({
      ...n,
      utxoEntry: {
        ...n.utxoEntry,
        scriptPublicKey: {
          version: n.utxoEntry.scriptPublicKey.version,
          script: n.utxoEntry.scriptPublicKey.scriptPublicKey
        }
      }
    }))), e;
  }
  async submitTransaction(t) {
    return this.request(this.endpoints.submitTransaction, {
      method: "POST",
      body: JSON.stringify(t)
    });
  }
  async getNetworkInfo() {
    return this.request(this.endpoints.networkInfo);
  }
  async getFeeEstimate() {
    return this.request(this.endpoints.feeEstimate);
  }
}
class Ti {
  /**
   * Creates a new HoosatWebClient instance
   *
   * @param config - Client configuration
   * @param config.baseUrl - Base URL of the API (backward compatibility)
   * @param config.provider - Custom API provider instance
   * @param config.timeout - Request timeout in milliseconds (default: 30000)
   * @param config.headers - Additional headers to include in requests
   * @param config.debug - Enable debug logging (default: false)
   */
  constructor(t) {
    if (t.provider)
      this.provider = t.provider;
    else if (t.baseUrl)
      this.provider = new an({
        baseUrl: t.baseUrl,
        timeout: t.timeout,
        headers: t.headers,
        debug: t.debug
      });
    else
      throw new Error("Either baseUrl or provider must be specified");
  }
  // ==================== PUBLIC API METHODS ====================
  /**
   * Get balance for a Hoosat address
   *
   * @param address - Hoosat address (e.g., 'hoosat:qz7ulu...')
   * @returns Address balance in sompi
   *
   * @example
   * ```typescript
   * const balance = await client.getBalance('hoosat:qz7ulu...');
   * console.log(`Balance: ${balance.balance} sompi`);
   * // Convert to HTN: parseFloat(balance.balance) / 100_000_000
   * ```
   */
  async getBalance(t) {
    return this.provider.getBalance(t);
  }
  /**
   * Get UTXOs for Hoosat addresses
   * Required for building transactions
   *
   * @param addresses - Array of Hoosat addresses
   * @returns List of unspent transaction outputs
   *
   * @example
   * ```typescript
   * const utxos = await client.getUtxos(['hoosat:qz7ulu...']);
   * console.log(`Found ${utxos.utxos.length} UTXOs`);
   *
   * // Use with HoosatTxBuilder
   * const builder = new HoosatTxBuilder();
   * utxos.utxos.forEach(utxo => {
   *   builder.addInput(utxo, privateKey);
   * });
   * ```
   */
  async getUtxos(t) {
    return this.provider.getUtxos(t);
  }
  /**
   * Submit a signed transaction to the network
   *
   * @param transaction - Signed transaction object (from HoosatTxBuilder)
   * @returns Transaction ID
   *
   * @example
   * ```typescript
   * // Build and sign transaction
   * const builder = new HoosatTxBuilder();
   * // ... add inputs, outputs, sign ...
   * const signedTx = builder.sign(privateKey);
   *
   * // Submit to network
   * const result = await client.submitTransaction(signedTx);
   * console.log(`Transaction submitted: ${result.transactionId}`);
   * ```
   */
  async submitTransaction(t) {
    return this.provider.submitTransaction(t);
  }
  /**
   * Get network information
   *
   * @returns Network status and sync information
   *
   * @example
   * ```typescript
   * const info = await client.getNetworkInfo();
   * console.log(`Network: ${info.networkName}`);
   * console.log(`Synced: ${info.isSynced}`);
   * console.log(`Block height: ${info.blockCount}`);
   * ```
   */
  async getNetworkInfo() {
    return this.provider.getNetworkInfo();
  }
  /**
   * Get recommended transaction fees
   *
   * @returns Fee recommendations in sompi per byte
   *
   * @example
   * ```typescript
   * const fees = await client.getFeeEstimate();
   * console.log(`Normal fee: ${fees.medium} sompi/byte`);
   *
   * // Use with HoosatCrypto.calculateMinFee()
   * const fee = HoosatCrypto.calculateMinFee(inputCount, outputCount);
   * ```
   */
  async getFeeEstimate() {
    return this.provider.getFeeEstimate();
  }
  // ==================== UTILITY METHODS ====================
  /**
   * Check if API is reachable
   *
   * @returns true if API responds successfully
   *
   * @example
   * ```typescript
   * const isOnline = await client.ping();
   * if (!isOnline) {
   *   console.error('API is unreachable');
   * }
   * ```
   */
  async ping() {
    return this.provider.ping();
  }
  /**
   * Get the current API provider instance
   *
   * @returns Current provider
   */
  getProvider() {
    return this.provider;
  }
}
var Wn = /* @__PURE__ */ ((o) => (o.Low = "low", o.Normal = "normal", o.High = "high", o.Urgent = "urgent", o))(Wn || {});
class Zn extends un {
  get endpoints() {
    return {
      balance: "/addresses/:address/balance",
      utxos: "/addresses/:address/utxos",
      submitTransaction: "/transactions",
      networkInfo: "/info/network",
      feeEstimate: "/info/hashrate"
    };
  }
  transformResponse(t) {
    return t;
  }
  async getBalance(t) {
    const e = this.endpoints.balance.replace(":address", t), n = await this.request(e);
    return {
      balance: n.balance || n.confirmedBalance || "0"
    };
  }
  async getUtxos(t) {
    const e = t[0], n = this.endpoints.utxos.replace(":address", e), s = await this.request(n);
    return {
      address: e,
      utxos: s.utxos || s || []
    };
  }
  async submitTransaction(t) {
    const e = await this.request(this.endpoints.submitTransaction, {
      method: "POST",
      body: JSON.stringify(t)
    });
    return {
      transactionId: e.transactionId || e.txId || e.id
    };
  }
  async getNetworkInfo() {
    const t = await this.request(this.endpoints.networkInfo);
    return {
      p2pId: t.p2pId || "",
      mempoolSize: t.mempoolSize || "0",
      serverVersion: t.version || t.serverVersion || "1.0.0",
      isUtxoIndexed: t.isUtxoIndexed || [],
      isSynced: t.isSynced || t.synced || 1
    };
  }
  async getFeeEstimate() {
    const t = await this.request(this.endpoints.feeEstimate);
    return {
      feeRate: t.feeRate || 1e3,
      totalFee: t.totalFee || "1000",
      priority: t.priority || "normal",
      percentile: t.percentile || 50,
      basedOnSamples: t.basedOnSamples || 100
    };
  }
}
class ti {
  constructor(t) {
    if (this.currentProviderIndex = 0, !t.providers.length)
      throw new Error("At least one provider is required");
    this.providers = t.providers, this.strategy = t.strategy || "failover", this.maxRetries = t.maxRetries || this.providers.length, this.retryDelay = t.retryDelay || 1e3, this.debug = t.debug || !1;
  }
  async withFallback(t, e) {
    const n = [];
    let s = 0;
    for (; s < this.maxRetries; ) {
      let u;
      switch (this.strategy) {
        case "round-robin":
          u = this.providers[this.currentProviderIndex], this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
          break;
        case "fastest":
          const c = await Promise.allSettled(
            this.providers.map(async (a) => ({ provider: a, result: await t(a) }))
          );
          for (const a of c) {
            if (a.status === "fulfilled")
              return a.value.result;
            a.status === "rejected" && n.push(a.reason);
          }
          throw new Error(`All providers failed for ${e}: ${n.map((a) => a.message).join(", ")}`);
        case "failover":
        default:
          u = this.providers[s % this.providers.length];
          break;
      }
      try {
        this.debug && console.log(`[MultiProvider] Attempting ${e} with provider ${s + 1}/${this.maxRetries}`);
        const c = await t(u);
        return this.debug && console.log(`[MultiProvider] ${e} succeeded with provider ${s + 1}`), c;
      } catch (c) {
        n.push(c), s++, this.debug && console.warn(`[MultiProvider] Provider ${s} failed for ${e}:`, c.message), s < this.maxRetries && await new Promise((a) => setTimeout(a, this.retryDelay));
      }
    }
    throw new Error(`All ${this.maxRetries} providers failed for ${e}: ${n.map((u) => u.message).join(", ")}`);
  }
  async getBalance(t) {
    return this.withFallback((e) => e.getBalance(t), "getBalance");
  }
  async getUtxos(t) {
    return this.withFallback((e) => e.getUtxos(t), "getUtxos");
  }
  async submitTransaction(t) {
    return this.withFallback((e) => e.submitTransaction(t), "submitTransaction");
  }
  async getNetworkInfo() {
    return this.withFallback((t) => t.getNetworkInfo(), "getNetworkInfo");
  }
  async getFeeEstimate() {
    return this.withFallback((t) => t.getFeeEstimate(), "getFeeEstimate");
  }
  async ping() {
    try {
      return await this.getNetworkInfo(), !0;
    } catch {
      return !1;
    }
  }
  getProviders() {
    return [...this.providers];
  }
  getStrategy() {
    return this.strategy;
  }
}
const Ci = (o, t) => new an({
  baseUrl: o,
  ...t
}), Pi = (o, t) => new Zn({
  baseUrl: o,
  ...t
}), Ri = (o, t) => new ti({
  providers: o,
  strategy: t
}), Dt = {
  HEX_HASH_LENGTH: 64,
  MAX_ADDRESSES_BATCH: 1e3
};
class Ft {
  // ==================== AMOUNT CONVERSION ====================
  /**
   * Formats an amount from sompi (smallest unit) to HTN (readable format)
   * @param sompi - Amount in sompi as string or bigint
   * @returns Formatted amount in HTN with 8 decimal places
   * @example
   * HoosatUtils.sompiToAmount('100000000') // '1.00000000'
   */
  static sompiToAmount(t) {
    const e = typeof t == "string" ? BigInt(t) : t;
    return (Number(e) / 1e8).toFixed(8);
  }
  /**
   * Parses an amount from HTN (readable format) to sompi (smallest unit)
   * @param htn - Amount in HTN as string
   * @returns Amount in sompi as string
   * @example
   * HoosatUtils.amountToSompi('1.5') // '150000000'
   */
  static amountToSompi(t) {
    const e = parseFloat(t) * 1e8;
    return BigInt(Math.round(e)).toString();
  }
  /**
   * Formats amount with thousands separators for display
   * @param htn - Amount in HTN as string
   * @param decimals - Number of decimal places (default: 8)
   * @returns Formatted string with separators
   * @example
   * HoosatUtils.formatAmount('1234567.89') // '1,234,567.89000000'
   */
  static formatAmount(t, e = 8) {
    return parseFloat(t).toLocaleString("en-US", {
      minimumFractionDigits: e,
      maximumFractionDigits: e
    });
  }
  // ==================== ADDRESS VALIDATION ====================
  /**
   * Validates a Hoosat address format (both mainnet and testnet)
   * @param address - HTN address as string
   * @returns True if valid, false otherwise
   * @example
   * HoosatUtils.isValidAddress('hoosat:qz7ulu...') // mainnet - true
   * HoosatUtils.isValidAddress('hoosattest:qreey20...') // testnet - true
   */
  static isValidAddress(t) {
    if (!t || typeof t != "string" || !(t.startsWith(j.MAINNET_ADDRESS_PREFIX) || t.startsWith(j.TESTNET_ADDRESS_PREFIX)))
      return !1;
    try {
      const n = Ke(t);
      return [0, 1, 8].includes(n.version);
    } catch {
      return !1;
    }
  }
  /**
   * Validates an array of Hoosat addresses
   * @param addresses - Array of addresses to validate
   * @param checkUnique - Whether to check for duplicate addresses (default: false)
   * @returns True if all addresses are valid, false otherwise
   * @example
   * HoosatUtils.isValidAddresses(['hoosat:qz7...', 'hoosat:qyp...']) // true
   */
  static isValidAddresses(t, e = !1) {
    return !Array.isArray(t) || t.length === 0 || t.length > Dt.MAX_ADDRESSES_BATCH || e && new Set(t).size !== t.length ? !1 : t.every((n) => this.isValidAddress(n));
  }
  /**
   * Gets the version of a Hoosat address
   * @param address - HTN address as string
   * @returns Version number (0x00, 0x01, 0x08) or null if invalid
   * @example
   * HoosatUtils.getAddressVersion('hoosat:qyp...') // 0x01 (ECDSA)
   */
  static getAddressVersion(t) {
    try {
      return Ke(t).version;
    } catch {
      return null;
    }
  }
  /**
   * Gets the type of a Hoosat address
   * @param address - HTN address as string
   * @returns Address type: 'schnorr' | 'ecdsa' | 'p2sh' | null if invalid
   * @example
   * HoosatUtils.getAddressType('hoosat:qyp...') // 'ecdsa'
   */
  static getAddressType(t) {
    const e = this.getAddressVersion(t);
    if (e === null) return null;
    switch (e) {
      case 0:
        return "schnorr";
      case 1:
        return "ecdsa";
      case 8:
        return "p2sh";
      default:
        return null;
    }
  }
  /**
   * Gets the network type from a Hoosat address
   * @param address - HTN address as string
   * @returns Network type: 'mainnet' | 'testnet' | null if invalid
   * @example
   * HoosatUtils.getAddressNetwork('hoosat:qz7ulu...') // 'mainnet'
   * HoosatUtils.getAddressNetwork('hoosattest:qreey20...') // 'testnet'
   */
  static getAddressNetwork(t) {
    return !t || typeof t != "string" ? null : t.startsWith(j.MAINNET_ADDRESS_PREFIX) ? "mainnet" : t.startsWith(j.TESTNET_ADDRESS_PREFIX) ? "testnet" : null;
  }
  // ==================== HASH VALIDATION ====================
  /**
   * Validates a hexadecimal hash
   * @param hash - Hash string to validate
   * @param length - Expected length in characters (default: 64 for 32 bytes)
   * @returns True if valid hex hash, false otherwise
   * @example
   * HoosatUtils.isValidHash('a1b2c3...') // true if 64 chars
   */
  static isValidHash(t, e = Dt.HEX_HASH_LENGTH) {
    return !t || typeof t != "string" ? !1 : new RegExp(`^[a-fA-F0-9]{${e}}$`).test(t);
  }
  /**
   * Validates a transaction ID
   * @param txId - Transaction ID to validate
   * @returns True if valid transaction ID, false otherwise
   * @example
   * HoosatUtils.isValidTransactionId('091ea22a707ac840...') // true
   */
  static isValidTransactionId(t) {
    return this.isValidHash(t, Dt.HEX_HASH_LENGTH);
  }
  /**
   * Validates a block hash
   * @param blockHash - Block hash to validate
   * @returns True if valid block hash, false otherwise
   * @example
   * HoosatUtils.isValidBlockHash('a1b2c3d4e5f6...') // true
   */
  static isValidBlockHash(t) {
    return this.isValidHash(t, Dt.HEX_HASH_LENGTH);
  }
  /**
   * Validates an array of hashes
   * @param hashes - Array of hashes to validate
   * @param length - Expected length of each hash (default: 64)
   * @returns True if all hashes are valid, false otherwise
   * @example
   * HoosatUtils.isValidHashes(['a1b2...', 'c3d4...']) // true
   */
  static isValidHashes(t, e = Dt.HEX_HASH_LENGTH) {
    return !Array.isArray(t) || t.length === 0 ? !1 : t.every((n) => this.isValidHash(n, e));
  }
  // ==================== KEY VALIDATION ====================
  /**
   * Validates a private key
   * @param privateKey - Private key as hex string
   * @returns True if valid 32-byte private key, false otherwise
   * @example
   * HoosatUtils.isValidPrivateKey('33a4a81e...') // true if 64 chars
   */
  static isValidPrivateKey(t) {
    return this.isValidHash(t, 64);
  }
  /**
   * Validates a public key
   * @param publicKey - Public key as hex string
   * @param compressed - Whether key is compressed (default: true)
   * @returns True if valid public key, false otherwise
   * @example
   * HoosatUtils.isValidPublicKey('02eddf8d...') // true if 66 chars (compressed)
   */
  static isValidPublicKey(t, e = !0) {
    const n = e ? 66 : 130;
    return this.isValidHash(t, n);
  }
  // ==================== AMOUNT VALIDATION ====================
  /**
   * Validates an amount string
   * @param amount - Amount to validate (in HTN or sompi)
   * @param maxDecimals - Maximum decimal places (default: 8)
   * @returns True if valid amount, false otherwise
   * @example
   * HoosatUtils.isValidAmount('1.5') // true
   * HoosatUtils.isValidAmount('1.123456789') // false (too many decimals)
   */
  static isValidAmount(t, e = 8) {
    if (!t || typeof t != "string")
      return !1;
    const n = parseFloat(t);
    if (isNaN(n) || n < 0)
      return !1;
    const s = t.split(".");
    return !(s.length === 2 && s[1].length > e);
  }
  // ==================== FORMATTING UTILITIES ====================
  /**
   * Truncates an address for display in UI
   * @param address - Full address
   * @param startChars - Characters to show at start (default: 12)
   * @param endChars - Characters to show at end (default: 8)
   * @returns Truncated address with ellipsis
   * @example
   * HoosatUtils.truncateAddress('hoosat:qz7ulu...abc123')
   * // 'hoosat:qz7ul...abc123'
   */
  static truncateAddress(t, e = 12, n = 8) {
    return !t || t.length <= e + n ? t : `${t.slice(0, e)}...${t.slice(-n)}`;
  }
  /**
   * Truncates a hash for display in UI
   * @param hash - Full hash
   * @param startChars - Characters to show at start (default: 8)
   * @param endChars - Characters to show at end (default: 8)
   * @returns Truncated hash with ellipsis
   * @example
   * HoosatUtils.truncateHash('a1b2c3d4e5f6...xyz') // 'a1b2c3d4...xyz'
   */
  static truncateHash(t, e = 8, n = 8) {
    return !t || t.length <= e + n ? t : `${t.slice(0, e)}...${t.slice(-n)}`;
  }
  /**
   * Compares two addresses for equality (case-insensitive)
   * @param address1 - First address
   * @param address2 - Second address
   * @returns True if addresses are equal, false otherwise
   * @example
   * HoosatUtils.compareAddresses('hoosat:QZ7...', 'hoosat:qz7...') // true
   */
  static compareAddresses(t, e) {
    return !t || !e ? !1 : t.toLowerCase() === e.toLowerCase();
  }
  /**
   * Compares two hashes for equality (case-insensitive)
   * @param hash1 - First hash
   * @param hash2 - Second hash
   * @returns True if hashes are equal, false otherwise
   * @example
   * HoosatUtils.compareHashes('A1B2C3...', 'a1b2c3...') // true
   */
  static compareHashes(t, e) {
    return !t || !e ? !1 : t.toLowerCase() === e.toLowerCase();
  }
  // ==================== HASHRATE / DIFFICULTY FORMATTING ====================
  /**
   * Formats hashrate to human-readable format with automatic unit selection
   * @param hashrate - Hashrate value as number or string (H/s)
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted hashrate string with unit (e.g., '1.50 TH/s')
   * @example
   * HoosatUtils.formatHashrate(1500000000000) // '1.50 TH/s'
   * HoosatUtils.formatHashrate('150000000') // '150.00 MH/s'
   */
  static formatHashrate(t, e = 2) {
    const n = typeof t == "string" ? parseFloat(t) : t;
    if (isNaN(n) || n < 0)
      return "0 H/s";
    const s = [
      { threshold: 1e18, suffix: "EH/s" },
      // Exahash
      { threshold: 1e15, suffix: "PH/s" },
      // Petahash
      { threshold: 1e12, suffix: "TH/s" },
      // Terahash
      { threshold: 1e9, suffix: "GH/s" },
      // Gigahash
      { threshold: 1e6, suffix: "MH/s" },
      // Megahash
      { threshold: 1e3, suffix: "KH/s" },
      // Kilohash
      { threshold: 1, suffix: "H/s" }
      // Hash
    ];
    for (const u of s)
      if (n >= u.threshold)
        return `${(n / u.threshold).toFixed(e)} ${u.suffix}`;
    return `${n.toFixed(e)} H/s`;
  }
  /**
   * Formats difficulty to human-readable format with automatic unit selection
   * @param difficulty - Difficulty value as number or string
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted difficulty string with unit (e.g., '1.50 T')
   * @example
   * HoosatUtils.formatDifficulty(1500000000000) // '1.50 T'
   * HoosatUtils.formatDifficulty('150000000') // '150.00 M'
   */
  static formatDifficulty(t, e = 2) {
    const n = typeof t == "string" ? parseFloat(t) : t;
    if (isNaN(n) || n < 0)
      return "0";
    const s = [
      { threshold: 1e18, suffix: "E" },
      // Exa
      { threshold: 1e15, suffix: "P" },
      // Peta
      { threshold: 1e12, suffix: "T" },
      // Tera
      { threshold: 1e9, suffix: "G" },
      // Giga
      { threshold: 1e6, suffix: "M" },
      // Mega
      { threshold: 1e3, suffix: "K" },
      // Kilo
      { threshold: 1, suffix: "" }
    ];
    for (const u of s)
      if (n >= u.threshold)
        return `${(n / u.threshold).toFixed(e)}${u.suffix ? " " + u.suffix : ""}`;
    return n.toFixed(e);
  }
  /**
   * Parses formatted hashrate string to numeric value in H/s
   * @param formatted - Formatted hashrate string (e.g., '1.5 TH/s')
   * @returns Numeric hashrate value in H/s or null if invalid
   * @example
   * HoosatUtils.parseHashrate('1.5 TH/s') // 1500000000000
   */
  static parseHashrate(t) {
    if (!t || typeof t != "string")
      return null;
    const e = t.match(/^([\d.]+)\s*(EH|PH|TH|GH|MH|KH|H)?\/s$/i);
    if (!e)
      return null;
    const n = parseFloat(e[1]), s = e[2]?.toUpperCase() || "H";
    return n * ({
      EH: 1e18,
      PH: 1e15,
      TH: 1e12,
      GH: 1e9,
      MH: 1e6,
      KH: 1e3,
      H: 1
    }[s] || 1);
  }
  // ==================== CONVERSION UTILITIES ====================
  /**
   * Converts hex string to Buffer
   * @param hex - Hex string
   * @returns Buffer or null if invalid
   * @example
   * HoosatUtils.hexToBuffer('a1b2c3') // Buffer<a1 b2 c3>
   */
  static hexToBuffer(t) {
    if (!t || typeof t != "string")
      return null;
    try {
      return Buffer.from(t, "hex");
    } catch {
      return null;
    }
  }
  /**
   * Converts Buffer to hex string
   * @param buffer - Buffer to convert
   * @returns Hex string
   * @example
   * HoosatUtils.bufferToHex(Buffer.from([161, 178, 195])) // 'a1b2c3'
   */
  static bufferToHex(t) {
    return t.toString("hex");
  }
  // ==================== PAYLOAD DECODING ====================
  /**
   * Decodes hex-encoded payload to UTF-8 string
   * @param hexPayload - Hex-encoded payload string (with or without 0x prefix)
   * @returns Decoded UTF-8 string
   * @throws Error if payload is not valid hex
   * @example
   * HoosatUtils.decodePayload('48656c6c6f') // 'Hello'
   */
  static decodePayload(t) {
    if (!t || t.length === 0)
      return "";
    const e = t.toLowerCase().replace(/^0x/, "");
    if (!/^[0-9a-f]*$/.test(e))
      throw new Error(`Invalid hex payload format: ${t}`);
    return Buffer.from(e, "hex").toString("utf-8");
  }
  /**
   * Decodes hex-encoded payload and parses it as JSON
   * @param hexPayload - Hex-encoded JSON payload string
   * @returns Parsed JSON object
   * @throws Error if payload is not valid hex or JSON
   * @example
   * const data = HoosatUtils.parsePayloadAsJson('7b2274797065223a22766f7465227d');
   * // Returns: { type: 'vote' }
   */
  static parsePayloadAsJson(t) {
    const e = this.decodePayload(t);
    try {
      return JSON.parse(e);
    } catch {
      throw new Error(`Payload is not valid JSON: ${e}`);
    }
  }
  /**
   * Encodes UTF-8 string to hex payload
   * @param payload - UTF-8 string to encode
   * @returns Hex-encoded payload string
   * @example
   * HoosatUtils.encodePayload('Hello') // '48656c6c6f'
   */
  static encodePayload(t) {
    return !t || t.length === 0 ? "" : Buffer.from(t, "utf-8").toString("hex");
  }
  /**
   * Encodes JSON object to hex payload
   * @param data - Object to encode as JSON payload
   * @returns Hex-encoded JSON payload string
   * @example
   * HoosatUtils.encodePayloadAsJson({ type: 'vote' }) // '7b2274797065223a22766f7465227d'
   */
  static encodePayloadAsJson(t) {
    const e = JSON.stringify(t);
    return this.encodePayload(e);
  }
  /**
   * Checks if payload is valid JSON after decoding
   * @param hexPayload - Hex-encoded payload string
   * @returns True if payload is valid JSON, false otherwise
   * @example
   * HoosatUtils.isJsonPayload('7b7d') // true (empty object)
   * HoosatUtils.isJsonPayload('48656c6c6f') // false ('Hello' is not JSON)
   */
  static isJsonPayload(t) {
    try {
      return this.parsePayloadAsJson(t), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Decodes payload with fallback to raw hex if not valid UTF-8
   * @param hexPayload - Hex-encoded payload string
   * @returns Object with decoded string and metadata
   * @example
   * HoosatUtils.decodePayloadSafe('48656c6c6f')
   * // Returns: { decoded: 'Hello', isValidUtf8: true, isJson: false }
   */
  static decodePayloadSafe(t) {
    const e = t.toLowerCase().replace(/^0x/, "");
    try {
      const n = this.decodePayload(t), s = this.isJsonPayload(t);
      return {
        decoded: n,
        isValidUtf8: !0,
        isJson: s,
        raw: e
      };
    } catch {
      return {
        decoded: e,
        isValidUtf8: !1,
        isJson: !1,
        raw: e
      };
    }
  }
}
class Ui {
  /**
   * Creates a new transaction builder
   * @param options - Builder options
   */
  constructor(t = {}) {
    this._inputs = [], this._outputs = [], this._lockTime = "0", this._fee = "1000", this._subnetworkId = "0000000000000000000000000000000000000000", this._payload = "", this._reusedValues = {}, this._debug = t.debug || !1;
  }
  /**
   * Adds an input to the transaction
   * @param utxo - UTXO to spend
   * @param privateKey - Private key for this specific input (optional if using global key in sign())
   * @returns This builder instance for chaining
   * @example
   * builder.addInput(utxo, privateKey);
   */
  addInput(t, e) {
    return this._inputs.push({ utxo: t, privateKey: e }), this;
  }
  /**
   * Adds an output to the transaction (for recipients only)
   *
   * ⚠️ Use addChangeOutput() for change to avoid spam protection check
   *
   * @param address - Recipient address
   * @param amount - Amount in sompi as string
   * @returns This builder instance for chaining
   * @throws Error if address is invalid
   * @throws Error if exceeds spam protection limit (max 2 recipients)
   *
   * @remarks
   * **Spam Protection:** Hoosat inherits anti-dust-attack protection from Kaspa.
   * Transactions are limited to 3 total outputs (2 recipients + 1 change) to prevent
   * spam attacks. This is a hardcoded network rule, not a configuration setting.
   *
   * **Important:** This validation only counts recipient outputs, not change.
   * Always use `addChangeOutput()` for change outputs.
   *
   * @example
   * // ✅ Correct usage
   * builder.addOutput('hoosat:qz7ulu...', '100000000');     // recipient 1
   * builder.addOutput('hoosat:qr97kz...', '50000000');      // recipient 2
   * builder.addChangeOutput(wallet.address);                // change (no check)
   *
   * @example
   * // ❌ Wrong - manually adding change
   * builder.addOutput(wallet.address, changeAmount); // ← will trigger spam check!
   */
  addOutput(t, e) {
    if (!Ft.isValidAddress(t))
      throw new Error(`Invalid address: ${t}`);
    if (this._outputs.length >= 2)
      throw new Error(
        "Maximum 2 recipients per transaction due to spam protection. This anti-dust-attack mechanism limits outputs to 3 total (2 recipients + 1 change). Inherited from Kaspa Golang. For more recipients, send multiple transactions. Note: Use addChangeOutput() for change, not addOutput()."
      );
    const s = ft.addressToScriptPublicKey(t);
    return this._outputs.push({
      amount: e,
      scriptPublicKey: {
        scriptPublicKey: s.toString("hex"),
        version: 0
      }
    }), this;
  }
  /**
   * Adds change output with automatic amount calculation
   * Change outputs bypass spam protection check
   *
   * @param changeAddress - Address to receive change
   * @returns This builder instance for chaining
   * @throws Error if insufficient funds or invalid address
   * @example
   * builder.addChangeOutput('hoosat:qz7ulu...');
   */
  addChangeOutput(t) {
    if (!Ft.isValidAddress(t))
      throw new Error(`Invalid change address: ${t}`);
    const e = this.getTotalInputAmount(), n = this.getTotalOutputAmount(), s = BigInt(this._fee), u = e - n - s;
    if (u < 0n)
      throw new Error(`Insufficient funds for change: inputs ${e}, outputs ${n}, fee ${s}`);
    if (u > BigInt(j.MIN_FEE)) {
      const c = ft.addressToScriptPublicKey(t);
      this.addOutputRaw({
        amount: u.toString(),
        scriptPublicKey: {
          scriptPublicKey: c.toString("hex"),
          version: 0
        }
      });
    }
    return this;
  }
  /**
   * Adds a raw output to the transaction (bypasses validation)
   * Use for change outputs or advanced scenarios
   *
   * @param output - Pre-formatted transaction output
   * @returns This builder instance for chaining
   * @example
   * builder.addOutputRaw({ amount: '100000000', scriptPublicKey: {...} });
   */
  addOutputRaw(t) {
    return this._outputs.push(t), this;
  }
  /**
   * Sets transaction fee
   * @param fee - Fee amount in sompi as string
   * @returns This builder instance for chaining
   * @example
   * builder.setFee('1000');
   */
  setFee(t) {
    return this._fee = t, this;
  }
  /**
   * Sets transaction lock time
   * @param lockTime - Lock time as string
   * @returns This builder instance for chaining
   * @example
   * builder.setLockTime('0');
   */
  setLockTime(t) {
    return this._lockTime = t, this;
  }
  /**
   * Sets subnetwork ID for the transaction
   *
   * ⚠️ Payload is disabled on the native subnetwork (0x00...00) until hardfork.
   * Alternative subnetwork IDs may allow payload before the hardfork.
   *
   * @param subnetworkId - Subnetwork ID as hex string (40 chars, 20 bytes)
   * @returns This builder instance for chaining
   * @throws Error if subnetworkId format is invalid
   *
   * @example
   * // Use alternative subnetwork that may support payload
   * builder.setSubnetworkId('0300000000000000000000000000000000000000');
   *
   * @example
   * // Use native subnetwork (default)
   * builder.setSubnetworkId('0000000000000000000000000000000000000000');
   */
  setSubnetworkId(t) {
    const e = t.toLowerCase().replace(/^0x/, "");
    if (!/^[0-9a-f]{40}$/.test(e))
      throw new Error(
        `Invalid subnetwork ID format: ${t}. Expected 40 hex characters (20 bytes), e.g., "0300000000000000000000000000000000000000"`
      );
    return this._subnetworkId = e, this;
  }
  /**
   * Sets payload data for the transaction
   *
   * ⚠️ Payload is disabled on the native subnetwork (0x00...00) until hardfork.
   * Use alternative subnetwork IDs to test payload functionality.
   *
   * @param payload - Payload data as hex string or Buffer
   * @returns This builder instance for chaining
   *
   * @example
   * // Set payload as hex string
   * builder.setPayload('48656c6c6f20576f726c64'); // "Hello World"
   *
   * @example
   * // Set payload from Buffer
   * const data = Buffer.from('Hello World', 'utf-8');
   * builder.setPayload(data.toString('hex'));
   *
   * @example
   * // With alternative subnetwork
   * builder
   *   .setSubnetworkId('0300000000000000000000000000000000000000')
   *   .setPayload('48656c6c6f');
   */
  setPayload(t) {
    const e = t.toLowerCase().replace(/^0x/, "");
    if (e.length > 0 && !/^[0-9a-f]*$/.test(e))
      throw new Error(
        `Invalid payload format: ${t}. Expected hex string, e.g., "48656c6c6f"`
      );
    return this._payload = e, this;
  }
  /**
   * Builds unsigned transaction
   * @returns Unsigned transaction object
   * @throws Error if validation fails
   * @example
   * const unsignedTx = builder.build();
   */
  build() {
    if (this._inputs.length === 0)
      throw new Error("Transaction must have at least one input");
    if (this._outputs.length === 0)
      throw new Error("Transaction must have at least one output");
    return this.validate(), {
      version: 0,
      inputs: this._inputs.map(({ utxo: t }) => ({
        previousOutpoint: t.outpoint,
        signatureScript: "",
        sequence: "0",
        sigOpCount: 1,
        utxoEntry: t.utxoEntry
      })),
      outputs: this._outputs,
      lockTime: this._lockTime,
      subnetworkId: this._subnetworkId,
      gas: "0",
      payload: this._payload,
      fee: this._fee
    };
  }
  /**
   * Signs the transaction with provided private key(s)
   * @param globalPrivateKey - Global private key to use for all inputs without specific keys
   * @returns Signed transaction ready for broadcast
   * @throws Error if no private key provided for any input
   * @example
   * const signedTx = builder.sign(privateKey);
   */
  sign(t) {
    const e = this.build();
    this._debug && console.log(`
🔐 === SIGNING PROCESS START ===
`);
    for (let n = 0; n < this._inputs.length; n++) {
      const { utxo: s, privateKey: u } = this._inputs[n], c = u || t;
      if (!c)
        throw new Error(`No private key provided for input ${n}`);
      this._debug && (console.log(`Input ${n} signing:`), console.log(`  UTXO amount: ${s.utxoEntry.amount}`), console.log(`  Script version: ${s.utxoEntry.scriptPublicKey.version}`), console.log(`  Script: ${s.utxoEntry.scriptPublicKey.script}
`));
      const a = ft.getSignatureHashSchnorr(e, n, s, this._reusedValues), l = ft.getSignatureHashECDSA(e, n, s, this._reusedValues);
      this._debug && (console.log(`  Schnorr Hash: ${a.toString("hex")}`), console.log(`  ECDSA Hash: ${l.toString("hex")}`));
      const p = ft.signTransactionInput(e, n, c, s, this._reusedValues);
      this._debug && console.log(`  Raw Signature: ${p.signature.toString("hex")}`);
      const g = Buffer.concat([p.signature, Buffer.from([p.sigHashType])]), y = Buffer.concat([Buffer.from([g.length]), g]);
      this._debug && (console.log(`  SigScript: ${y.toString("hex")}`), console.log(`  SigScript length: ${y.length} bytes
`)), e.inputs[n].signatureScript = y.toString("hex");
    }
    return e.inputs.forEach((n) => {
      delete n.utxoEntry;
    }), this._debug && (console.log(`🔐 === SIGNING PROCESS COMPLETE ===
`), console.log(`Transaction ID: ${ft.getTransactionId(e)}
`)), e;
  }
  /**
   * Builds and signs transaction in one step
   * @param globalPrivateKey - Private key to use for all inputs
   * @returns Signed transaction
   * @example
   * const signedTx = builder.buildAndSign(privateKey);
   */
  buildAndSign(t) {
    return this.sign(t);
  }
  /**
   * Estimates minimum transaction fee based on inputs/outputs count
   * @param payloadSize - Payload size in bytes (default: 0)
   * @returns Minimum fee as string
   * @example
   * const fee = builder.estimateFee();
   */
  estimateFee(t = 0) {
    return ft.calculateMinFee(this._inputs.length, this._outputs.length, t);
  }
  /**
   * Gets total amount of all inputs
   * @returns Total input amount as bigint
   * @example
   * const totalIn = builder.getTotalInputAmount();
   */
  getTotalInputAmount() {
    return this._inputs.reduce((t, { utxo: e }) => t + BigInt(e.utxoEntry.amount), 0n);
  }
  /**
   * Gets total amount of all outputs
   * @returns Total output amount as bigint
   * @example
   * const totalOut = builder.getTotalOutputAmount();
   */
  getTotalOutputAmount() {
    return this._outputs.reduce((t, e) => t + BigInt(e.amount), 0n);
  }
  /**
   * Validates transaction amounts
   * @throws Error if outputs + fee exceed inputs
   * @example
   * builder.validate(); // throws if invalid
   */
  validate() {
    const t = this.getTotalInputAmount(), e = this.getTotalOutputAmount(), n = BigInt(this._fee);
    if (e + n > t)
      throw new Error(`Insufficient funds: inputs ${t}, outputs ${e}, fee ${n}`);
  }
  /**
   * Resets builder to initial state
   * @returns This builder instance for chaining
   * @example
   * builder.clear().addInput(...).addOutput(...);
   */
  clear() {
    return this._inputs = [], this._outputs = [], this._fee = "1000", this._lockTime = "0", this._subnetworkId = "0000000000000000000000000000000000000000", this._payload = "", this._reusedValues = {}, this;
  }
  /**
   * Gets current number of inputs
   * @returns Number of inputs
   */
  getInputCount() {
    return this._inputs.length;
  }
  /**
   * Gets current number of outputs
   * @returns Number of outputs
   */
  getOutputCount() {
    return this._outputs.length;
  }
}
var Nt = {}, ye, gr;
function ei() {
  return gr || (gr = 1, ye = function() {
    return typeof Promise == "function" && Promise.prototype && Promise.prototype.then;
  }), ye;
}
var we = {}, Bt = {}, yr;
function Tt() {
  if (yr) return Bt;
  yr = 1;
  let o;
  const t = [
    0,
    // Not used
    26,
    44,
    70,
    100,
    134,
    172,
    196,
    242,
    292,
    346,
    404,
    466,
    532,
    581,
    655,
    733,
    815,
    901,
    991,
    1085,
    1156,
    1258,
    1364,
    1474,
    1588,
    1706,
    1828,
    1921,
    2051,
    2185,
    2323,
    2465,
    2611,
    2761,
    2876,
    3034,
    3196,
    3362,
    3532,
    3706
  ];
  return Bt.getSymbolSize = function(n) {
    if (!n) throw new Error('"version" cannot be null or undefined');
    if (n < 1 || n > 40) throw new Error('"version" should be in range from 1 to 40');
    return n * 4 + 17;
  }, Bt.getSymbolTotalCodewords = function(n) {
    return t[n];
  }, Bt.getBCHDigit = function(e) {
    let n = 0;
    for (; e !== 0; )
      n++, e >>>= 1;
    return n;
  }, Bt.setToSJISFunction = function(n) {
    if (typeof n != "function")
      throw new Error('"toSJISFunc" is not a valid function.');
    o = n;
  }, Bt.isKanjiModeEnabled = function() {
    return typeof o < "u";
  }, Bt.toSJIS = function(n) {
    return o(n);
  }, Bt;
}
var me = {}, wr;
function Qe() {
  return wr || (wr = 1, (function(o) {
    o.L = { bit: 1 }, o.M = { bit: 0 }, o.Q = { bit: 3 }, o.H = { bit: 2 };
    function t(e) {
      if (typeof e != "string")
        throw new Error("Param is not a string");
      switch (e.toLowerCase()) {
        case "l":
        case "low":
          return o.L;
        case "m":
        case "medium":
          return o.M;
        case "q":
        case "quartile":
          return o.Q;
        case "h":
        case "high":
          return o.H;
        default:
          throw new Error("Unknown EC Level: " + e);
      }
    }
    o.isValid = function(n) {
      return n && typeof n.bit < "u" && n.bit >= 0 && n.bit < 4;
    }, o.from = function(n, s) {
      if (o.isValid(n))
        return n;
      try {
        return t(n);
      } catch {
        return s;
      }
    };
  })(me)), me;
}
var Be, mr;
function ri() {
  if (mr) return Be;
  mr = 1;
  function o() {
    this.buffer = [], this.length = 0;
  }
  return o.prototype = {
    get: function(t) {
      const e = Math.floor(t / 8);
      return (this.buffer[e] >>> 7 - t % 8 & 1) === 1;
    },
    put: function(t, e) {
      for (let n = 0; n < e; n++)
        this.putBit((t >>> e - n - 1 & 1) === 1);
    },
    getLengthInBits: function() {
      return this.length;
    },
    putBit: function(t) {
      const e = Math.floor(this.length / 8);
      this.buffer.length <= e && this.buffer.push(0), t && (this.buffer[e] |= 128 >>> this.length % 8), this.length++;
    }
  }, Be = o, Be;
}
var Ee, Br;
function ni() {
  if (Br) return Ee;
  Br = 1;
  function o(t) {
    if (!t || t < 1)
      throw new Error("BitMatrix size must be defined and greater than 0");
    this.size = t, this.data = new Uint8Array(t * t), this.reservedBit = new Uint8Array(t * t);
  }
  return o.prototype.set = function(t, e, n, s) {
    const u = t * this.size + e;
    this.data[u] = n, s && (this.reservedBit[u] = !0);
  }, o.prototype.get = function(t, e) {
    return this.data[t * this.size + e];
  }, o.prototype.xor = function(t, e, n) {
    this.data[t * this.size + e] ^= n;
  }, o.prototype.isReserved = function(t, e) {
    return this.reservedBit[t * this.size + e];
  }, Ee = o, Ee;
}
var be = {}, Er;
function ii() {
  return Er || (Er = 1, (function(o) {
    const t = Tt().getSymbolSize;
    o.getRowColCoords = function(n) {
      if (n === 1) return [];
      const s = Math.floor(n / 7) + 2, u = t(n), c = u === 145 ? 26 : Math.ceil((u - 13) / (2 * s - 2)) * 2, a = [u - 7];
      for (let l = 1; l < s - 1; l++)
        a[l] = a[l - 1] - c;
      return a.push(6), a.reverse();
    }, o.getPositions = function(n) {
      const s = [], u = o.getRowColCoords(n), c = u.length;
      for (let a = 0; a < c; a++)
        for (let l = 0; l < c; l++)
          a === 0 && l === 0 || // top-left
          a === 0 && l === c - 1 || // bottom-left
          a === c - 1 && l === 0 || s.push([u[a], u[l]]);
      return s;
    };
  })(be)), be;
}
var Ie = {}, br;
function si() {
  if (br) return Ie;
  br = 1;
  const o = Tt().getSymbolSize, t = 7;
  return Ie.getPositions = function(n) {
    const s = o(n);
    return [
      // top-left
      [0, 0],
      // top-right
      [s - t, 0],
      // bottom-left
      [0, s - t]
    ];
  }, Ie;
}
var xe = {}, Ir;
function oi() {
  return Ir || (Ir = 1, (function(o) {
    o.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    const t = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    o.isValid = function(s) {
      return s != null && s !== "" && !isNaN(s) && s >= 0 && s <= 7;
    }, o.from = function(s) {
      return o.isValid(s) ? parseInt(s, 10) : void 0;
    }, o.getPenaltyN1 = function(s) {
      const u = s.size;
      let c = 0, a = 0, l = 0, p = null, g = null;
      for (let y = 0; y < u; y++) {
        a = l = 0, p = g = null;
        for (let B = 0; B < u; B++) {
          let w = s.get(y, B);
          w === p ? a++ : (a >= 5 && (c += t.N1 + (a - 5)), p = w, a = 1), w = s.get(B, y), w === g ? l++ : (l >= 5 && (c += t.N1 + (l - 5)), g = w, l = 1);
        }
        a >= 5 && (c += t.N1 + (a - 5)), l >= 5 && (c += t.N1 + (l - 5));
      }
      return c;
    }, o.getPenaltyN2 = function(s) {
      const u = s.size;
      let c = 0;
      for (let a = 0; a < u - 1; a++)
        for (let l = 0; l < u - 1; l++) {
          const p = s.get(a, l) + s.get(a, l + 1) + s.get(a + 1, l) + s.get(a + 1, l + 1);
          (p === 4 || p === 0) && c++;
        }
      return c * t.N2;
    }, o.getPenaltyN3 = function(s) {
      const u = s.size;
      let c = 0, a = 0, l = 0;
      for (let p = 0; p < u; p++) {
        a = l = 0;
        for (let g = 0; g < u; g++)
          a = a << 1 & 2047 | s.get(p, g), g >= 10 && (a === 1488 || a === 93) && c++, l = l << 1 & 2047 | s.get(g, p), g >= 10 && (l === 1488 || l === 93) && c++;
      }
      return c * t.N3;
    }, o.getPenaltyN4 = function(s) {
      let u = 0;
      const c = s.data.length;
      for (let l = 0; l < c; l++) u += s.data[l];
      return Math.abs(Math.ceil(u * 100 / c / 5) - 10) * t.N4;
    };
    function e(n, s, u) {
      switch (n) {
        case o.Patterns.PATTERN000:
          return (s + u) % 2 === 0;
        case o.Patterns.PATTERN001:
          return s % 2 === 0;
        case o.Patterns.PATTERN010:
          return u % 3 === 0;
        case o.Patterns.PATTERN011:
          return (s + u) % 3 === 0;
        case o.Patterns.PATTERN100:
          return (Math.floor(s / 2) + Math.floor(u / 3)) % 2 === 0;
        case o.Patterns.PATTERN101:
          return s * u % 2 + s * u % 3 === 0;
        case o.Patterns.PATTERN110:
          return (s * u % 2 + s * u % 3) % 2 === 0;
        case o.Patterns.PATTERN111:
          return (s * u % 3 + (s + u) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + n);
      }
    }
    o.applyMask = function(s, u) {
      const c = u.size;
      for (let a = 0; a < c; a++)
        for (let l = 0; l < c; l++)
          u.isReserved(l, a) || u.xor(l, a, e(s, l, a));
    }, o.getBestMask = function(s, u) {
      const c = Object.keys(o.Patterns).length;
      let a = 0, l = 1 / 0;
      for (let p = 0; p < c; p++) {
        u(p), o.applyMask(p, s);
        const g = o.getPenaltyN1(s) + o.getPenaltyN2(s) + o.getPenaltyN3(s) + o.getPenaltyN4(s);
        o.applyMask(p, s), g < l && (l = g, a = p);
      }
      return a;
    };
  })(xe)), xe;
}
var Wt = {}, xr;
function cn() {
  if (xr) return Wt;
  xr = 1;
  const o = Qe(), t = [
    // L  M  Q  H
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    1,
    2,
    2,
    4,
    1,
    2,
    4,
    4,
    2,
    4,
    4,
    4,
    2,
    4,
    6,
    5,
    2,
    4,
    6,
    6,
    2,
    5,
    8,
    8,
    4,
    5,
    8,
    8,
    4,
    5,
    8,
    11,
    4,
    8,
    10,
    11,
    4,
    9,
    12,
    16,
    4,
    9,
    16,
    16,
    6,
    10,
    12,
    18,
    6,
    10,
    17,
    16,
    6,
    11,
    16,
    19,
    6,
    13,
    18,
    21,
    7,
    14,
    21,
    25,
    8,
    16,
    20,
    25,
    8,
    17,
    23,
    25,
    9,
    17,
    23,
    34,
    9,
    18,
    25,
    30,
    10,
    20,
    27,
    32,
    12,
    21,
    29,
    35,
    12,
    23,
    34,
    37,
    12,
    25,
    34,
    40,
    13,
    26,
    35,
    42,
    14,
    28,
    38,
    45,
    15,
    29,
    40,
    48,
    16,
    31,
    43,
    51,
    17,
    33,
    45,
    54,
    18,
    35,
    48,
    57,
    19,
    37,
    51,
    60,
    19,
    38,
    53,
    63,
    20,
    40,
    56,
    66,
    21,
    43,
    59,
    70,
    22,
    45,
    62,
    74,
    24,
    47,
    65,
    77,
    25,
    49,
    68,
    81
  ], e = [
    // L  M  Q  H
    7,
    10,
    13,
    17,
    10,
    16,
    22,
    28,
    15,
    26,
    36,
    44,
    20,
    36,
    52,
    64,
    26,
    48,
    72,
    88,
    36,
    64,
    96,
    112,
    40,
    72,
    108,
    130,
    48,
    88,
    132,
    156,
    60,
    110,
    160,
    192,
    72,
    130,
    192,
    224,
    80,
    150,
    224,
    264,
    96,
    176,
    260,
    308,
    104,
    198,
    288,
    352,
    120,
    216,
    320,
    384,
    132,
    240,
    360,
    432,
    144,
    280,
    408,
    480,
    168,
    308,
    448,
    532,
    180,
    338,
    504,
    588,
    196,
    364,
    546,
    650,
    224,
    416,
    600,
    700,
    224,
    442,
    644,
    750,
    252,
    476,
    690,
    816,
    270,
    504,
    750,
    900,
    300,
    560,
    810,
    960,
    312,
    588,
    870,
    1050,
    336,
    644,
    952,
    1110,
    360,
    700,
    1020,
    1200,
    390,
    728,
    1050,
    1260,
    420,
    784,
    1140,
    1350,
    450,
    812,
    1200,
    1440,
    480,
    868,
    1290,
    1530,
    510,
    924,
    1350,
    1620,
    540,
    980,
    1440,
    1710,
    570,
    1036,
    1530,
    1800,
    570,
    1064,
    1590,
    1890,
    600,
    1120,
    1680,
    1980,
    630,
    1204,
    1770,
    2100,
    660,
    1260,
    1860,
    2220,
    720,
    1316,
    1950,
    2310,
    750,
    1372,
    2040,
    2430
  ];
  return Wt.getBlocksCount = function(s, u) {
    switch (u) {
      case o.L:
        return t[(s - 1) * 4 + 0];
      case o.M:
        return t[(s - 1) * 4 + 1];
      case o.Q:
        return t[(s - 1) * 4 + 2];
      case o.H:
        return t[(s - 1) * 4 + 3];
      default:
        return;
    }
  }, Wt.getTotalCodewordsCount = function(s, u) {
    switch (u) {
      case o.L:
        return e[(s - 1) * 4 + 0];
      case o.M:
        return e[(s - 1) * 4 + 1];
      case o.Q:
        return e[(s - 1) * 4 + 2];
      case o.H:
        return e[(s - 1) * 4 + 3];
      default:
        return;
    }
  }, Wt;
}
var Ae = {}, $t = {}, Ar;
function ui() {
  if (Ar) return $t;
  Ar = 1;
  const o = new Uint8Array(512), t = new Uint8Array(256);
  return (function() {
    let n = 1;
    for (let s = 0; s < 255; s++)
      o[s] = n, t[n] = s, n <<= 1, n & 256 && (n ^= 285);
    for (let s = 255; s < 512; s++)
      o[s] = o[s - 255];
  })(), $t.log = function(n) {
    if (n < 1) throw new Error("log(" + n + ")");
    return t[n];
  }, $t.exp = function(n) {
    return o[n];
  }, $t.mul = function(n, s) {
    return n === 0 || s === 0 ? 0 : o[t[n] + t[s]];
  }, $t;
}
var Sr;
function ai() {
  return Sr || (Sr = 1, (function(o) {
    const t = ui();
    o.mul = function(n, s) {
      const u = new Uint8Array(n.length + s.length - 1);
      for (let c = 0; c < n.length; c++)
        for (let a = 0; a < s.length; a++)
          u[c + a] ^= t.mul(n[c], s[a]);
      return u;
    }, o.mod = function(n, s) {
      let u = new Uint8Array(n);
      for (; u.length - s.length >= 0; ) {
        const c = u[0];
        for (let l = 0; l < s.length; l++)
          u[l] ^= t.mul(s[l], c);
        let a = 0;
        for (; a < u.length && u[a] === 0; ) a++;
        u = u.slice(a);
      }
      return u;
    }, o.generateECPolynomial = function(n) {
      let s = new Uint8Array([1]);
      for (let u = 0; u < n; u++)
        s = o.mul(s, new Uint8Array([1, t.exp(u)]));
      return s;
    };
  })(Ae)), Ae;
}
var Se, Tr;
function ci() {
  if (Tr) return Se;
  Tr = 1;
  const o = ai();
  function t(e) {
    this.genPoly = void 0, this.degree = e, this.degree && this.initialize(this.degree);
  }
  return t.prototype.initialize = function(n) {
    this.degree = n, this.genPoly = o.generateECPolynomial(this.degree);
  }, t.prototype.encode = function(n) {
    if (!this.genPoly)
      throw new Error("Encoder not initialized");
    const s = new Uint8Array(n.length + this.degree);
    s.set(n);
    const u = o.mod(s, this.genPoly), c = this.degree - u.length;
    if (c > 0) {
      const a = new Uint8Array(this.degree);
      return a.set(u, c), a;
    }
    return u;
  }, Se = t, Se;
}
var Te = {}, Ce = {}, Pe = {}, Cr;
function fn() {
  return Cr || (Cr = 1, Pe.isValid = function(t) {
    return !isNaN(t) && t >= 1 && t <= 40;
  }), Pe;
}
var ot = {}, Pr;
function hn() {
  if (Pr) return ot;
  Pr = 1;
  const o = "[0-9]+", t = "[A-Z $%*+\\-./:]+";
  let e = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  e = e.replace(/u/g, "\\u");
  const n = "(?:(?![A-Z0-9 $%*+\\-./:]|" + e + `)(?:.|[\r
]))+`;
  ot.KANJI = new RegExp(e, "g"), ot.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g"), ot.BYTE = new RegExp(n, "g"), ot.NUMERIC = new RegExp(o, "g"), ot.ALPHANUMERIC = new RegExp(t, "g");
  const s = new RegExp("^" + e + "$"), u = new RegExp("^" + o + "$"), c = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  return ot.testKanji = function(l) {
    return s.test(l);
  }, ot.testNumeric = function(l) {
    return u.test(l);
  }, ot.testAlphanumeric = function(l) {
    return c.test(l);
  }, ot;
}
var Rr;
function Ct() {
  return Rr || (Rr = 1, (function(o) {
    const t = fn(), e = hn();
    o.NUMERIC = {
      id: "Numeric",
      bit: 1,
      ccBits: [10, 12, 14]
    }, o.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 2,
      ccBits: [9, 11, 13]
    }, o.BYTE = {
      id: "Byte",
      bit: 4,
      ccBits: [8, 16, 16]
    }, o.KANJI = {
      id: "Kanji",
      bit: 8,
      ccBits: [8, 10, 12]
    }, o.MIXED = {
      bit: -1
    }, o.getCharCountIndicator = function(u, c) {
      if (!u.ccBits) throw new Error("Invalid mode: " + u);
      if (!t.isValid(c))
        throw new Error("Invalid version: " + c);
      return c >= 1 && c < 10 ? u.ccBits[0] : c < 27 ? u.ccBits[1] : u.ccBits[2];
    }, o.getBestModeForData = function(u) {
      return e.testNumeric(u) ? o.NUMERIC : e.testAlphanumeric(u) ? o.ALPHANUMERIC : e.testKanji(u) ? o.KANJI : o.BYTE;
    }, o.toString = function(u) {
      if (u && u.id) return u.id;
      throw new Error("Invalid mode");
    }, o.isValid = function(u) {
      return u && u.bit && u.ccBits;
    };
    function n(s) {
      if (typeof s != "string")
        throw new Error("Param is not a string");
      switch (s.toLowerCase()) {
        case "numeric":
          return o.NUMERIC;
        case "alphanumeric":
          return o.ALPHANUMERIC;
        case "kanji":
          return o.KANJI;
        case "byte":
          return o.BYTE;
        default:
          throw new Error("Unknown mode: " + s);
      }
    }
    o.from = function(u, c) {
      if (o.isValid(u))
        return u;
      try {
        return n(u);
      } catch {
        return c;
      }
    };
  })(Ce)), Ce;
}
var Ur;
function fi() {
  return Ur || (Ur = 1, (function(o) {
    const t = Tt(), e = cn(), n = Qe(), s = Ct(), u = fn(), c = 7973, a = t.getBCHDigit(c);
    function l(B, w, E) {
      for (let I = 1; I <= 40; I++)
        if (w <= o.getCapacity(I, E, B))
          return I;
    }
    function p(B, w) {
      return s.getCharCountIndicator(B, w) + 4;
    }
    function g(B, w) {
      let E = 0;
      return B.forEach(function(I) {
        const C = p(I.mode, w);
        E += C + I.getBitsLength();
      }), E;
    }
    function y(B, w) {
      for (let E = 1; E <= 40; E++)
        if (g(B, E) <= o.getCapacity(E, w, s.MIXED))
          return E;
    }
    o.from = function(w, E) {
      return u.isValid(w) ? parseInt(w, 10) : E;
    }, o.getCapacity = function(w, E, I) {
      if (!u.isValid(w))
        throw new Error("Invalid QR Code version");
      typeof I > "u" && (I = s.BYTE);
      const C = t.getSymbolTotalCodewords(w), S = e.getTotalCodewordsCount(w, E), x = (C - S) * 8;
      if (I === s.MIXED) return x;
      const T = x - p(I, w);
      switch (I) {
        case s.NUMERIC:
          return Math.floor(T / 10 * 3);
        case s.ALPHANUMERIC:
          return Math.floor(T / 11 * 2);
        case s.KANJI:
          return Math.floor(T / 13);
        case s.BYTE:
        default:
          return Math.floor(T / 8);
      }
    }, o.getBestVersionForData = function(w, E) {
      let I;
      const C = n.from(E, n.M);
      if (Array.isArray(w)) {
        if (w.length > 1)
          return y(w, C);
        if (w.length === 0)
          return 1;
        I = w[0];
      } else
        I = w;
      return l(I.mode, I.getLength(), C);
    }, o.getEncodedBits = function(w) {
      if (!u.isValid(w) || w < 7)
        throw new Error("Invalid QR Code version");
      let E = w << 12;
      for (; t.getBCHDigit(E) - a >= 0; )
        E ^= c << t.getBCHDigit(E) - a;
      return w << 12 | E;
    };
  })(Te)), Te;
}
var Re = {}, Hr;
function hi() {
  if (Hr) return Re;
  Hr = 1;
  const o = Tt(), t = 1335, e = 21522, n = o.getBCHDigit(t);
  return Re.getEncodedBits = function(u, c) {
    const a = u.bit << 3 | c;
    let l = a << 10;
    for (; o.getBCHDigit(l) - n >= 0; )
      l ^= t << o.getBCHDigit(l) - n;
    return (a << 10 | l) ^ e;
  }, Re;
}
var Ue = {}, He, Nr;
function li() {
  if (Nr) return He;
  Nr = 1;
  const o = Ct();
  function t(e) {
    this.mode = o.NUMERIC, this.data = e.toString();
  }
  return t.getBitsLength = function(n) {
    return 10 * Math.floor(n / 3) + (n % 3 ? n % 3 * 3 + 1 : 0);
  }, t.prototype.getLength = function() {
    return this.data.length;
  }, t.prototype.getBitsLength = function() {
    return t.getBitsLength(this.data.length);
  }, t.prototype.write = function(n) {
    let s, u, c;
    for (s = 0; s + 3 <= this.data.length; s += 3)
      u = this.data.substr(s, 3), c = parseInt(u, 10), n.put(c, 10);
    const a = this.data.length - s;
    a > 0 && (u = this.data.substr(s), c = parseInt(u, 10), n.put(c, a * 3 + 1));
  }, He = t, He;
}
var Ne, Fr;
function di() {
  if (Fr) return Ne;
  Fr = 1;
  const o = Ct(), t = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " ",
    "$",
    "%",
    "*",
    "+",
    "-",
    ".",
    "/",
    ":"
  ];
  function e(n) {
    this.mode = o.ALPHANUMERIC, this.data = n;
  }
  return e.getBitsLength = function(s) {
    return 11 * Math.floor(s / 2) + 6 * (s % 2);
  }, e.prototype.getLength = function() {
    return this.data.length;
  }, e.prototype.getBitsLength = function() {
    return e.getBitsLength(this.data.length);
  }, e.prototype.write = function(s) {
    let u;
    for (u = 0; u + 2 <= this.data.length; u += 2) {
      let c = t.indexOf(this.data[u]) * 45;
      c += t.indexOf(this.data[u + 1]), s.put(c, 11);
    }
    this.data.length % 2 && s.put(t.indexOf(this.data[u]), 6);
  }, Ne = e, Ne;
}
var Fe, kr;
function pi() {
  if (kr) return Fe;
  kr = 1;
  const o = Ct();
  function t(e) {
    this.mode = o.BYTE, typeof e == "string" ? this.data = new TextEncoder().encode(e) : this.data = new Uint8Array(e);
  }
  return t.getBitsLength = function(n) {
    return n * 8;
  }, t.prototype.getLength = function() {
    return this.data.length;
  }, t.prototype.getBitsLength = function() {
    return t.getBitsLength(this.data.length);
  }, t.prototype.write = function(e) {
    for (let n = 0, s = this.data.length; n < s; n++)
      e.put(this.data[n], 8);
  }, Fe = t, Fe;
}
var ke, Lr;
function gi() {
  if (Lr) return ke;
  Lr = 1;
  const o = Ct(), t = Tt();
  function e(n) {
    this.mode = o.KANJI, this.data = n;
  }
  return e.getBitsLength = function(s) {
    return s * 13;
  }, e.prototype.getLength = function() {
    return this.data.length;
  }, e.prototype.getBitsLength = function() {
    return e.getBitsLength(this.data.length);
  }, e.prototype.write = function(n) {
    let s;
    for (s = 0; s < this.data.length; s++) {
      let u = t.toSJIS(this.data[s]);
      if (u >= 33088 && u <= 40956)
        u -= 33088;
      else if (u >= 57408 && u <= 60351)
        u -= 49472;
      else
        throw new Error(
          "Invalid SJIS character: " + this.data[s] + `
Make sure your charset is UTF-8`
        );
      u = (u >>> 8 & 255) * 192 + (u & 255), n.put(u, 13);
    }
  }, ke = e, ke;
}
var Le = { exports: {} }, _r;
function yi() {
  return _r || (_r = 1, (function(o) {
    var t = {
      single_source_shortest_paths: function(e, n, s) {
        var u = {}, c = {};
        c[n] = 0;
        var a = t.PriorityQueue.make();
        a.push(n, 0);
        for (var l, p, g, y, B, w, E, I, C; !a.empty(); ) {
          l = a.pop(), p = l.value, y = l.cost, B = e[p] || {};
          for (g in B)
            B.hasOwnProperty(g) && (w = B[g], E = y + w, I = c[g], C = typeof c[g] > "u", (C || I > E) && (c[g] = E, a.push(g, E), u[g] = p));
        }
        if (typeof s < "u" && typeof c[s] > "u") {
          var S = ["Could not find a path from ", n, " to ", s, "."].join("");
          throw new Error(S);
        }
        return u;
      },
      extract_shortest_path_from_predecessor_list: function(e, n) {
        for (var s = [], u = n; u; )
          s.push(u), e[u], u = e[u];
        return s.reverse(), s;
      },
      find_path: function(e, n, s) {
        var u = t.single_source_shortest_paths(e, n, s);
        return t.extract_shortest_path_from_predecessor_list(
          u,
          s
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(e) {
          var n = t.PriorityQueue, s = {}, u;
          e = e || {};
          for (u in n)
            n.hasOwnProperty(u) && (s[u] = n[u]);
          return s.queue = [], s.sorter = e.sorter || n.default_sorter, s;
        },
        default_sorter: function(e, n) {
          return e.cost - n.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(e, n) {
          var s = { value: e, cost: n };
          this.queue.push(s), this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    o.exports = t;
  })(Le)), Le.exports;
}
var Mr;
function wi() {
  return Mr || (Mr = 1, (function(o) {
    const t = Ct(), e = li(), n = di(), s = pi(), u = gi(), c = hn(), a = Tt(), l = yi();
    function p(S) {
      return unescape(encodeURIComponent(S)).length;
    }
    function g(S, x, T) {
      const P = [];
      let M;
      for (; (M = S.exec(T)) !== null; )
        P.push({
          data: M[0],
          index: M.index,
          mode: x,
          length: M[0].length
        });
      return P;
    }
    function y(S) {
      const x = g(c.NUMERIC, t.NUMERIC, S), T = g(c.ALPHANUMERIC, t.ALPHANUMERIC, S);
      let P, M;
      return a.isKanjiModeEnabled() ? (P = g(c.BYTE, t.BYTE, S), M = g(c.KANJI, t.KANJI, S)) : (P = g(c.BYTE_KANJI, t.BYTE, S), M = []), x.concat(T, P, M).sort(function(N, F) {
        return N.index - F.index;
      }).map(function(N) {
        return {
          data: N.data,
          mode: N.mode,
          length: N.length
        };
      });
    }
    function B(S, x) {
      switch (x) {
        case t.NUMERIC:
          return e.getBitsLength(S);
        case t.ALPHANUMERIC:
          return n.getBitsLength(S);
        case t.KANJI:
          return u.getBitsLength(S);
        case t.BYTE:
          return s.getBitsLength(S);
      }
    }
    function w(S) {
      return S.reduce(function(x, T) {
        const P = x.length - 1 >= 0 ? x[x.length - 1] : null;
        return P && P.mode === T.mode ? (x[x.length - 1].data += T.data, x) : (x.push(T), x);
      }, []);
    }
    function E(S) {
      const x = [];
      for (let T = 0; T < S.length; T++) {
        const P = S[T];
        switch (P.mode) {
          case t.NUMERIC:
            x.push([
              P,
              { data: P.data, mode: t.ALPHANUMERIC, length: P.length },
              { data: P.data, mode: t.BYTE, length: P.length }
            ]);
            break;
          case t.ALPHANUMERIC:
            x.push([
              P,
              { data: P.data, mode: t.BYTE, length: P.length }
            ]);
            break;
          case t.KANJI:
            x.push([
              P,
              { data: P.data, mode: t.BYTE, length: p(P.data) }
            ]);
            break;
          case t.BYTE:
            x.push([
              { data: P.data, mode: t.BYTE, length: p(P.data) }
            ]);
        }
      }
      return x;
    }
    function I(S, x) {
      const T = {}, P = { start: {} };
      let M = ["start"];
      for (let U = 0; U < S.length; U++) {
        const N = S[U], F = [];
        for (let H = 0; H < N.length; H++) {
          const O = N[H], k = "" + U + H;
          F.push(k), T[k] = { node: O, lastCount: 0 }, P[k] = {};
          for (let _ = 0; _ < M.length; _++) {
            const L = M[_];
            T[L] && T[L].node.mode === O.mode ? (P[L][k] = B(T[L].lastCount + O.length, O.mode) - B(T[L].lastCount, O.mode), T[L].lastCount += O.length) : (T[L] && (T[L].lastCount = O.length), P[L][k] = B(O.length, O.mode) + 4 + t.getCharCountIndicator(O.mode, x));
          }
        }
        M = F;
      }
      for (let U = 0; U < M.length; U++)
        P[M[U]].end = 0;
      return { map: P, table: T };
    }
    function C(S, x) {
      let T;
      const P = t.getBestModeForData(S);
      if (T = t.from(x, P), T !== t.BYTE && T.bit < P.bit)
        throw new Error('"' + S + '" cannot be encoded with mode ' + t.toString(T) + `.
 Suggested mode is: ` + t.toString(P));
      switch (T === t.KANJI && !a.isKanjiModeEnabled() && (T = t.BYTE), T) {
        case t.NUMERIC:
          return new e(S);
        case t.ALPHANUMERIC:
          return new n(S);
        case t.KANJI:
          return new u(S);
        case t.BYTE:
          return new s(S);
      }
    }
    o.fromArray = function(x) {
      return x.reduce(function(T, P) {
        return typeof P == "string" ? T.push(C(P, null)) : P.data && T.push(C(P.data, P.mode)), T;
      }, []);
    }, o.fromString = function(x, T) {
      const P = y(x, a.isKanjiModeEnabled()), M = E(P), U = I(M, T), N = l.find_path(U.map, "start", "end"), F = [];
      for (let H = 1; H < N.length - 1; H++)
        F.push(U.table[N[H]].node);
      return o.fromArray(w(F));
    }, o.rawSplit = function(x) {
      return o.fromArray(
        y(x, a.isKanjiModeEnabled())
      );
    };
  })(Ue)), Ue;
}
var Or;
function mi() {
  if (Or) return we;
  Or = 1;
  const o = Tt(), t = Qe(), e = ri(), n = ni(), s = ii(), u = si(), c = oi(), a = cn(), l = ci(), p = fi(), g = hi(), y = Ct(), B = wi();
  function w(U, N) {
    const F = U.size, H = u.getPositions(N);
    for (let O = 0; O < H.length; O++) {
      const k = H[O][0], _ = H[O][1];
      for (let L = -1; L <= 7; L++)
        if (!(k + L <= -1 || F <= k + L))
          for (let D = -1; D <= 7; D++)
            _ + D <= -1 || F <= _ + D || (L >= 0 && L <= 6 && (D === 0 || D === 6) || D >= 0 && D <= 6 && (L === 0 || L === 6) || L >= 2 && L <= 4 && D >= 2 && D <= 4 ? U.set(k + L, _ + D, !0, !0) : U.set(k + L, _ + D, !1, !0));
    }
  }
  function E(U) {
    const N = U.size;
    for (let F = 8; F < N - 8; F++) {
      const H = F % 2 === 0;
      U.set(F, 6, H, !0), U.set(6, F, H, !0);
    }
  }
  function I(U, N) {
    const F = s.getPositions(N);
    for (let H = 0; H < F.length; H++) {
      const O = F[H][0], k = F[H][1];
      for (let _ = -2; _ <= 2; _++)
        for (let L = -2; L <= 2; L++)
          _ === -2 || _ === 2 || L === -2 || L === 2 || _ === 0 && L === 0 ? U.set(O + _, k + L, !0, !0) : U.set(O + _, k + L, !1, !0);
    }
  }
  function C(U, N) {
    const F = U.size, H = p.getEncodedBits(N);
    let O, k, _;
    for (let L = 0; L < 18; L++)
      O = Math.floor(L / 3), k = L % 3 + F - 8 - 3, _ = (H >> L & 1) === 1, U.set(O, k, _, !0), U.set(k, O, _, !0);
  }
  function S(U, N, F) {
    const H = U.size, O = g.getEncodedBits(N, F);
    let k, _;
    for (k = 0; k < 15; k++)
      _ = (O >> k & 1) === 1, k < 6 ? U.set(k, 8, _, !0) : k < 8 ? U.set(k + 1, 8, _, !0) : U.set(H - 15 + k, 8, _, !0), k < 8 ? U.set(8, H - k - 1, _, !0) : k < 9 ? U.set(8, 15 - k - 1 + 1, _, !0) : U.set(8, 15 - k - 1, _, !0);
    U.set(H - 8, 8, 1, !0);
  }
  function x(U, N) {
    const F = U.size;
    let H = -1, O = F - 1, k = 7, _ = 0;
    for (let L = F - 1; L > 0; L -= 2)
      for (L === 6 && L--; ; ) {
        for (let D = 0; D < 2; D++)
          if (!U.isReserved(O, L - D)) {
            let nt = !1;
            _ < N.length && (nt = (N[_] >>> k & 1) === 1), U.set(O, L - D, nt), k--, k === -1 && (_++, k = 7);
          }
        if (O += H, O < 0 || F <= O) {
          O -= H, H = -H;
          break;
        }
      }
  }
  function T(U, N, F) {
    const H = new e();
    F.forEach(function(D) {
      H.put(D.mode.bit, 4), H.put(D.getLength(), y.getCharCountIndicator(D.mode, U)), D.write(H);
    });
    const O = o.getSymbolTotalCodewords(U), k = a.getTotalCodewordsCount(U, N), _ = (O - k) * 8;
    for (H.getLengthInBits() + 4 <= _ && H.put(0, 4); H.getLengthInBits() % 8 !== 0; )
      H.putBit(0);
    const L = (_ - H.getLengthInBits()) / 8;
    for (let D = 0; D < L; D++)
      H.put(D % 2 ? 17 : 236, 8);
    return P(H, U, N);
  }
  function P(U, N, F) {
    const H = o.getSymbolTotalCodewords(N), O = a.getTotalCodewordsCount(N, F), k = H - O, _ = a.getBlocksCount(N, F), L = H % _, D = _ - L, nt = Math.floor(H / _), Et = Math.floor(k / _), ae = Et + 1, jt = nt - Et, ce = new l(jt);
    let Lt = 0;
    const V = new Array(_), J = new Array(_);
    let Pt = 0;
    const Yt = new Uint8Array(U.buffer);
    for (let it = 0; it < _; it++) {
      const Ut = it < D ? Et : ae;
      V[it] = Yt.slice(Lt, Lt + Ut), J[it] = ce.encode(V[it]), Lt += Ut, Pt = Math.max(Pt, Ut);
    }
    const Rt = new Uint8Array(H);
    let _t = 0, rt, Q;
    for (rt = 0; rt < Pt; rt++)
      for (Q = 0; Q < _; Q++)
        rt < V[Q].length && (Rt[_t++] = V[Q][rt]);
    for (rt = 0; rt < jt; rt++)
      for (Q = 0; Q < _; Q++)
        Rt[_t++] = J[Q][rt];
    return Rt;
  }
  function M(U, N, F, H) {
    let O;
    if (Array.isArray(U))
      O = B.fromArray(U);
    else if (typeof U == "string") {
      let nt = N;
      if (!nt) {
        const Et = B.rawSplit(U);
        nt = p.getBestVersionForData(Et, F);
      }
      O = B.fromString(U, nt || 40);
    } else
      throw new Error("Invalid data");
    const k = p.getBestVersionForData(O, F);
    if (!k)
      throw new Error("The amount of data is too big to be stored in a QR Code");
    if (!N)
      N = k;
    else if (N < k)
      throw new Error(
        `
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + k + `.
`
      );
    const _ = T(N, F, O), L = o.getSymbolSize(N), D = new n(L);
    return w(D, N), E(D), I(D, N), S(D, F, 0), N >= 7 && C(D, N), x(D, _), isNaN(H) && (H = c.getBestMask(
      D,
      S.bind(null, D, F)
    )), c.applyMask(H, D), S(D, F, H), {
      modules: D,
      version: N,
      errorCorrectionLevel: F,
      maskPattern: H,
      segments: O
    };
  }
  return we.create = function(N, F) {
    if (typeof N > "u" || N === "")
      throw new Error("No input text");
    let H = t.M, O, k;
    return typeof F < "u" && (H = t.from(F.errorCorrectionLevel, t.M), O = p.from(F.version), k = c.from(F.maskPattern), F.toSJISFunc && o.setToSJISFunction(F.toSJISFunc)), M(N, O, H, k);
  }, we;
}
var _e = {}, Me = {}, Dr;
function ln() {
  return Dr || (Dr = 1, (function(o) {
    function t(e) {
      if (typeof e == "number" && (e = e.toString()), typeof e != "string")
        throw new Error("Color should be defined as hex string");
      let n = e.slice().replace("#", "").split("");
      if (n.length < 3 || n.length === 5 || n.length > 8)
        throw new Error("Invalid hex color: " + e);
      (n.length === 3 || n.length === 4) && (n = Array.prototype.concat.apply([], n.map(function(u) {
        return [u, u];
      }))), n.length === 6 && n.push("F", "F");
      const s = parseInt(n.join(""), 16);
      return {
        r: s >> 24 & 255,
        g: s >> 16 & 255,
        b: s >> 8 & 255,
        a: s & 255,
        hex: "#" + n.slice(0, 6).join("")
      };
    }
    o.getOptions = function(n) {
      n || (n = {}), n.color || (n.color = {});
      const s = typeof n.margin > "u" || n.margin === null || n.margin < 0 ? 4 : n.margin, u = n.width && n.width >= 21 ? n.width : void 0, c = n.scale || 4;
      return {
        width: u,
        scale: u ? 4 : c,
        margin: s,
        color: {
          dark: t(n.color.dark || "#000000ff"),
          light: t(n.color.light || "#ffffffff")
        },
        type: n.type,
        rendererOpts: n.rendererOpts || {}
      };
    }, o.getScale = function(n, s) {
      return s.width && s.width >= n + s.margin * 2 ? s.width / (n + s.margin * 2) : s.scale;
    }, o.getImageWidth = function(n, s) {
      const u = o.getScale(n, s);
      return Math.floor((n + s.margin * 2) * u);
    }, o.qrToImageData = function(n, s, u) {
      const c = s.modules.size, a = s.modules.data, l = o.getScale(c, u), p = Math.floor((c + u.margin * 2) * l), g = u.margin * l, y = [u.color.light, u.color.dark];
      for (let B = 0; B < p; B++)
        for (let w = 0; w < p; w++) {
          let E = (B * p + w) * 4, I = u.color.light;
          if (B >= g && w >= g && B < p - g && w < p - g) {
            const C = Math.floor((B - g) / l), S = Math.floor((w - g) / l);
            I = y[a[C * c + S] ? 1 : 0];
          }
          n[E++] = I.r, n[E++] = I.g, n[E++] = I.b, n[E] = I.a;
        }
    };
  })(Me)), Me;
}
var $r;
function Bi() {
  return $r || ($r = 1, (function(o) {
    const t = ln();
    function e(s, u, c) {
      s.clearRect(0, 0, u.width, u.height), u.style || (u.style = {}), u.height = c, u.width = c, u.style.height = c + "px", u.style.width = c + "px";
    }
    function n() {
      try {
        return document.createElement("canvas");
      } catch {
        throw new Error("You need to specify a canvas element");
      }
    }
    o.render = function(u, c, a) {
      let l = a, p = c;
      typeof l > "u" && (!c || !c.getContext) && (l = c, c = void 0), c || (p = n()), l = t.getOptions(l);
      const g = t.getImageWidth(u.modules.size, l), y = p.getContext("2d"), B = y.createImageData(g, g);
      return t.qrToImageData(B.data, u, l), e(y, p, g), y.putImageData(B, 0, 0), p;
    }, o.renderToDataURL = function(u, c, a) {
      let l = a;
      typeof l > "u" && (!c || !c.getContext) && (l = c, c = void 0), l || (l = {});
      const p = o.render(u, c, l), g = l.type || "image/png", y = l.rendererOpts || {};
      return p.toDataURL(g, y.quality);
    };
  })(_e)), _e;
}
var Oe = {}, qr;
function Ei() {
  if (qr) return Oe;
  qr = 1;
  const o = ln();
  function t(s, u) {
    const c = s.a / 255, a = u + '="' + s.hex + '"';
    return c < 1 ? a + " " + u + '-opacity="' + c.toFixed(2).slice(1) + '"' : a;
  }
  function e(s, u, c) {
    let a = s + u;
    return typeof c < "u" && (a += " " + c), a;
  }
  function n(s, u, c) {
    let a = "", l = 0, p = !1, g = 0;
    for (let y = 0; y < s.length; y++) {
      const B = Math.floor(y % u), w = Math.floor(y / u);
      !B && !p && (p = !0), s[y] ? (g++, y > 0 && B > 0 && s[y - 1] || (a += p ? e("M", B + c, 0.5 + w + c) : e("m", l, 0), l = 0, p = !1), B + 1 < u && s[y + 1] || (a += e("h", g), g = 0)) : l++;
    }
    return a;
  }
  return Oe.render = function(u, c, a) {
    const l = o.getOptions(c), p = u.modules.size, g = u.modules.data, y = p + l.margin * 2, B = l.color.light.a ? "<path " + t(l.color.light, "fill") + ' d="M0 0h' + y + "v" + y + 'H0z"/>' : "", w = "<path " + t(l.color.dark, "stroke") + ' d="' + n(g, p, l.margin) + '"/>', E = 'viewBox="0 0 ' + y + " " + y + '"', C = '<svg xmlns="http://www.w3.org/2000/svg" ' + (l.width ? 'width="' + l.width + '" height="' + l.width + '" ' : "") + E + ' shape-rendering="crispEdges">' + B + w + `</svg>
`;
    return typeof a == "function" && a(null, C), C;
  }, Oe;
}
var vr;
function bi() {
  if (vr) return Nt;
  vr = 1;
  const o = ei(), t = mi(), e = Bi(), n = Ei();
  function s(u, c, a, l, p) {
    const g = [].slice.call(arguments, 1), y = g.length, B = typeof g[y - 1] == "function";
    if (!B && !o())
      throw new Error("Callback required as last argument");
    if (B) {
      if (y < 2)
        throw new Error("Too few arguments provided");
      y === 2 ? (p = a, a = c, c = l = void 0) : y === 3 && (c.getContext && typeof p > "u" ? (p = l, l = void 0) : (p = l, l = a, a = c, c = void 0));
    } else {
      if (y < 1)
        throw new Error("Too few arguments provided");
      return y === 1 ? (a = c, c = l = void 0) : y === 2 && !c.getContext && (l = a, a = c, c = void 0), new Promise(function(w, E) {
        try {
          const I = t.create(a, l);
          w(u(I, c, l));
        } catch (I) {
          E(I);
        }
      });
    }
    try {
      const w = t.create(a, l);
      p(null, u(w, c, l));
    } catch (w) {
      p(w);
    }
  }
  return Nt.create = t.create, Nt.toCanvas = s.bind(null, e.render), Nt.toDataURL = s.bind(null, e.renderToDataURL), Nt.toString = s.bind(null, function(u, c, a) {
    return n.render(u, a);
  }), Nt;
}
var Ii = bi();
const Zt = /* @__PURE__ */ En(Ii);
class Hi {
  /**
   * Generate QR code for a simple Hoosat address
   *
   * @param address - Hoosat address (with or without 'hoosat:' prefix)
   * @param options - QR code generation options
   * @returns Data URL (base64 PNG image) for use in <img> tag
   *
   * @example
   * ```typescript
   * const qr = await HoosatQR.generateAddressQR('hoosat:qz7ulu...');
   * // Use in HTML: <img src="${qr}" />
   * ```
   */
  static async generateAddressQR(t, e = {}) {
    if (!Ft.isValidAddress(t))
      throw new Error(`Invalid Hoosat address: ${t}`);
    const n = t.startsWith("hoosat:") ? t : `hoosat:${t}`;
    return this.generateQRDataURL(n, e);
  }
  /**
   * Generate QR code for a payment request with amount and metadata
   *
   * @param params - Payment URI parameters
   * @param options - QR code generation options
   * @returns Data URL (base64 PNG image)
   *
   * @example
   * ```typescript
   * const qr = await HoosatQR.generatePaymentQR({
   *   address: 'hoosat:qz7ulu...',
   *   amount: 100,
   *   label: 'Coffee Shop',
   *   message: 'Order #12345'
   * });
   * ```
   */
  static async generatePaymentQR(t, e = {}) {
    const n = this.buildPaymentURI(t);
    return this.generateQRDataURL(n, e);
  }
  /**
   * Generate QR code as SVG string
   *
   * @param address - Hoosat address or payment URI
   * @param options - QR code generation options
   * @returns SVG string
   *
   * @example
   * ```typescript
   * const svg = await HoosatQR.generateQRSVG('hoosat:qz7ulu...');
   * document.getElementById('qr').innerHTML = svg;
   * ```
   */
  static async generateQRSVG(t, e = {}) {
    const n = this.buildQROptions(e);
    return new Promise((s, u) => {
      Zt.toString(t, { ...n, type: "svg" }, (c, a) => {
        c ? u(c) : s(a);
      });
    });
  }
  /**
   * Generate QR code as terminal string (ASCII art)
   * Useful for CLI applications
   *
   * @param address - Hoosat address or payment URI
   * @returns Terminal-friendly QR code string
   *
   * @example
   * ```typescript
   * const qr = await HoosatQR.generateQRTerminal('hoosat:qz7ulu...');
   * console.log(qr);
   * ```
   */
  static async generateQRTerminal(t) {
    return new Promise((e, n) => {
      Zt.toString(t, { type: "terminal", small: !0 }, (s, u) => {
        s ? n(s) : e(u);
      });
    });
  }
  /**
   * Generate QR code as Buffer (for Node.js file saving)
   *
   * @param address - Hoosat address or payment URI
   * @param options - QR code generation options
   * @returns PNG image as Buffer
   *
   * @example
   * ```typescript
   * const buffer = await HoosatQR.generateQRBuffer('hoosat:qz7ulu...');
   * fs.writeFileSync('qr.png', buffer);
   * ```
   */
  static async generateQRBuffer(t, e = {}) {
    const n = this.buildQROptions(e);
    return new Promise((s, u) => {
      Zt.toBuffer(t, n, (c, a) => {
        c ? u(c) : s(a);
      });
    });
  }
  /**
   * Build payment URI from parameters
   * Format: hoosat:address?amount=X&label=Y&message=Z
   *
   * @param params - Payment parameters
   * @returns Formatted payment URI
   *
   * @example
   * ```typescript
   * const uri = HoosatQR.buildPaymentURI({
   *   address: 'hoosat:qz7ulu...',
   *   amount: 100,
   *   label: 'Coffee'
   * });
   * // Result: "hoosat:qz7ulu...?amount=100&label=Coffee"
   * ```
   */
  static buildPaymentURI(t) {
    if (!Ft.isValidAddress(t.address))
      throw new Error(`Invalid Hoosat address: ${t.address}`);
    const e = t.address.replace("hoosat:", ""), n = [];
    if (t.amount !== void 0) {
      const u = typeof t.amount == "string" ? parseFloat(t.amount) : t.amount;
      if (isNaN(u) || u <= 0)
        throw new Error(`Invalid amount: ${t.amount}`);
      n.push(`amount=${u}`);
    }
    t.label && n.push(`label=${encodeURIComponent(t.label)}`), t.message && n.push(`message=${encodeURIComponent(t.message)}`);
    const s = `hoosat:${e}`;
    return n.length > 0 ? `${s}?${n.join("&")}` : s;
  }
  /**
   * Parse payment URI from QR code
   *
   * @param uri - Payment URI string
   * @returns Parsed payment information
   * @throws Error if URI is invalid
   *
   * @example
   * ```typescript
   * const parsed = HoosatQR.parsePaymentURI(
   *   'hoosat:qz7ulu...?amount=100&label=Coffee'
   * );
   * console.log(parsed.address); // "hoosat:qz7ulu..."
   * console.log(parsed.amount);  // "10000000000" (sompi)
   * console.log(parsed.label);   // "Coffee"
   * ```
   */
  static parsePaymentURI(t) {
    if (!t.startsWith("hoosat:"))
      throw new Error('Invalid Hoosat URI: must start with "hoosat:"');
    const [e, n] = t.substring(7).split("?"), s = `hoosat:${e}`;
    if (!Ft.isValidAddress(s))
      throw new Error(`Invalid Hoosat address in URI: ${s}`);
    const u = {
      address: s,
      rawUri: t
    };
    if (n) {
      const c = new URLSearchParams(n), a = c.get("amount");
      if (a) {
        const g = parseFloat(a);
        !isNaN(g) && g > 0 && (u.amount = Ft.amountToSompi(String(g)));
      }
      const l = c.get("label");
      l && (u.label = decodeURIComponent(l));
      const p = c.get("message");
      p && (u.message = decodeURIComponent(p));
    }
    return u;
  }
  /**
   * Validate if string is a valid Hoosat payment URI
   *
   * @param uri - URI string to validate
   * @returns true if valid payment URI
   *
   * @example
   * ```typescript
   * HoosatQR.isValidPaymentURI('hoosat:qz7ulu...'); // true
   * HoosatQR.isValidPaymentURI('bitcoin:...'); // false
   * ```
   */
  static isValidPaymentURI(t) {
    try {
      return this.parsePaymentURI(t), !0;
    } catch {
      return !1;
    }
  }
  // ==================== PRIVATE HELPERS ====================
  /**
   * Generate QR code as Data URL (base64 PNG)
   */
  static async generateQRDataURL(t, e) {
    const n = this.buildQROptions(e);
    return new Promise((s, u) => {
      Zt.toDataURL(t, n, (c, a) => {
        c ? u(c) : s(a);
      });
    });
  }
  /**
   * Build QR code options from custom options
   */
  static buildQROptions(t) {
    return {
      errorCorrectionLevel: t.errorCorrectionLevel || "M",
      width: t.width || 300,
      margin: t.margin || 2,
      color: {
        dark: t.color?.dark || "#000000",
        light: t.color?.light || "#ffffff"
      }
    };
  }
}
typeof globalThis < "u" && (globalThis.Buffer = A.Buffer, typeof globalThis.window < "u" && (globalThis.window.Buffer = A.Buffer));
export {
  un as BaseProvider,
  mt as HOOSAT_MASS,
  j as HOOSAT_PARAMS,
  ft as HoosatCrypto,
  Zn as HoosatNetworkProvider,
  an as HoosatProxyProvider,
  Hi as HoosatQR,
  Si as HoosatSigner,
  Ui as HoosatTxBuilder,
  Ft as HoosatUtils,
  Ti as HoosatWebClient,
  Xn as MESSAGE_PREFIX,
  ti as MultiProvider,
  Wn as PriorityFee,
  Pi as createHoosatNetworkProvider,
  Ci as createHoosatProxyProvider,
  Ri as createMultiProvider,
  Qn as formatMessage,
  Ai as hashBuffer,
  ge as hashMessage
};
//# sourceMappingURL=hoosat-sdk.es.js.map
