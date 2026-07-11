var Ur = Object.defineProperty;
var kn = (e) => {
  throw TypeError(e);
};
var zr = (e, t, n) => t in e ? Ur(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var R = (e, t, n) => zr(e, typeof t != "symbol" ? t + "" : t, n), rn = (e, t, n) => t.has(e) || kn("Cannot " + n);
var l = (e, t, n) => (rn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), m = (e, t, n) => t.has(e) ? kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), g = (e, t, n, r) => (rn(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n), E = (e, t, n) => (rn(e, t, "access private method"), n);
const Gr = "5";
var Yn;
typeof window < "u" && ((Yn = window.__svelte ?? (window.__svelte = {})).v ?? (Yn.v = /* @__PURE__ */ new Set())).add(Gr);
const $i = 1, mi = 2, Ei = 16, Wr = 1, Kr = 2, Jr = 4, Xr = 8, Zr = 16, Un = 1, Qr = 2, zn = "[", Gn = "[!", Cn = "[?", Wn = "]", ft = {}, x = Symbol("uninitialized"), es = "http://www.w3.org/1999/xhtml", bi = "http://www.w3.org/2000/svg", Ti = "http://www.w3.org/1998/Math/MathML", Kn = !1;
var ts = Array.isArray, ns = Array.prototype.indexOf, Ht = Array.prototype.includes, rs = Array.from, Bt = Object.keys, Yt = Object.defineProperty, He = Object.getOwnPropertyDescriptor, ss = Object.getOwnPropertyDescriptors, is = Object.prototype, ls = Array.prototype, Jn = Object.getPrototypeOf, xn = Object.isExtensible;
const fs = () => {
};
function Si(e) {
  return e();
}
function as(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Xn() {
  var e, t, n = new Promise((r, s) => {
    e = r, t = s;
  });
  return { promise: n, resolve: e, reject: t };
}
const L = 2, at = 4, St = 8, Zn = 1 << 24, ie = 16, de = 32, me = 64, an = 128, X = 512, C = 1024, M = 2048, ae = 4096, Z = 8192, Q = 16384, Ge = 32768, Mn = 1 << 25, yt = 65536, Vt = 1 << 17, us = 1 << 18, We = 1 << 19, Qn = 1 << 20, Ai = 1 << 25, qe = 65536, qt = 1 << 21, Qe = 1 << 22, Oe = 1 << 23, ke = Symbol("$state"), er = Symbol("legacy props"), Ri = Symbol(""), os = Symbol("attributes"), cs = Symbol("class"), hs = Symbol("style"), ct = Symbol("text"), Mt = Symbol("form reset"), Jt = new class extends Error {
  constructor() {
    super(...arguments);
    R(this, "name", "StaleReactionError");
    R(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
var Vn;
const Oi = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!((Vn = globalThis.document) != null && Vn.contentType) && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), Xt = 3, Zt = 8;
function ds() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function ki(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function _s(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function vs() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ps(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function gs() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ys() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Ci(e) {
  throw new Error("https://svelte.dev/e/lifecycle_legacy_only");
}
function ws(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function $s() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ms() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Es() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function bs() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Ts() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Qt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function xi() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ss() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let P = !1;
function kt(e) {
  P = e;
}
let b;
function _e(e) {
  if (e === null)
    throw Qt(), ft;
  return b = e;
}
function tr() {
  return _e(/* @__PURE__ */ be(b));
}
function Mi(e) {
  if (P) {
    if (/* @__PURE__ */ be(b) !== null)
      throw Qt(), ft;
    b = e;
  }
}
function As(e = 1) {
  if (P) {
    for (var t = e, n = b; t--; )
      n = /** @type {TemplateNode} */
      /* @__PURE__ */ be(n);
    b = n;
  }
}
function Rs(e = !0) {
  for (var t = 0, n = b; ; ) {
    if (n.nodeType === Zt) {
      var r = (
        /** @type {Comment} */
        n.data
      );
      if (r === Wn) {
        if (t === 0) return n;
        t -= 1;
      } else (r === zn || r === Gn || // "[1", "[2", etc. for if blocks
      r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
    }
    var s = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ be(n)
    );
    e && n.remove(), n = s;
  }
}
function Pi(e) {
  if (!e || e.nodeType !== Zt)
    throw Qt(), ft;
  return (
    /** @type {Comment} */
    e.data
  );
}
function nr(e) {
  return e === this.v;
}
function Ns(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function rr(e) {
  return !Ns(e, this.v);
}
let At = !1, Os = !1;
function Di() {
  At = !0;
}
let k = null;
function ut(e) {
  k = e;
}
function ks(e, t = !1, n) {
  k = {
    p: k,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      w
    ),
    l: At && !t ? { s: null, u: null, $: [] } : null
  };
}
function Cs(e) {
  var t = (
    /** @type {ComponentContext} */
    k
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      Nr(r);
  }
  return e !== void 0 && (t.x = e), t.i = !0, k = t.p, e ?? /** @type {T} */
  {};
}
function Rt() {
  return !At || k !== null && k.l === null;
}
let Me = [];
function sr() {
  var e = Me;
  Me = [], as(e);
}
function Be(e) {
  if (Me.length === 0 && !pt) {
    var t = Me;
    queueMicrotask(() => {
      t === Me && sr();
    });
  }
  Me.push(e);
}
function xs() {
  for (; Me.length > 0; )
    sr();
}
function ir(e) {
  var t = w;
  if (t === null)
    return $.f |= Oe, e;
  if (!(t.f & Ge) && !(t.f & at))
    throw e;
  Ne(e, t);
}
function Ne(e, t) {
  if (!(t !== null && t.f & Q)) {
    for (; t !== null; ) {
      if (t.f & an) {
        if (!(t.f & Ge))
          throw e;
        try {
          t.b.error(e);
          return;
        } catch (n) {
          e = n;
        }
      }
      t = t.parent;
    }
    throw e;
  }
}
const Ms = -7169;
function O(e, t) {
  e.f = e.f & Ms | t;
}
function $n(e) {
  e.f & X || e.deps === null ? O(e, C) : O(e, ae);
}
function lr(e) {
  if (e !== null)
    for (const t of e)
      !(t.f & L) || !(t.f & qe) || (t.f ^= qe, lr(
        /** @type {Derived} */
        t.deps
      ));
}
function fr(e, t, n) {
  e.f & M ? t.add(e) : e.f & ae && n.add(e), lr(e.deps), O(e, C);
}
let Ct = !1;
function Ps(e) {
  var t = Ct;
  try {
    return Ct = !1, [e(), Ct];
  } finally {
    Ct = t;
  }
}
function Ds(e) {
  let t = 0, n = Nt(0), r;
  return () => {
    An() && (Y(n), tn(() => (t === 0 && (r = nn(() => e(() => gt(n)))), t += 1, () => {
      Be(() => {
        t -= 1, t === 0 && (r == null || r(), r = void 0, gt(n));
      });
    })));
  };
}
var Ls = yt | We;
function Is(e, t, n, r) {
  new Fs(e, t, n, r);
}
var q, mt, W, Le, j, K, F, U, ve, Ie, Ae, et, Et, bt, pe, Wt, A, ar, ur, or, un, Pt, Dt, on, cn;
class Fs {
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, r, s) {
    m(this, A);
    /** @type {Boundary | null} */
    R(this, "parent");
    R(this, "is_pending", !1);
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    R(this, "transform_error");
    /** @type {TemplateNode} */
    m(this, q);
    /** @type {TemplateNode | null} */
    m(this, mt, P ? b : null);
    /** @type {BoundaryProps} */
    m(this, W);
    /** @type {((anchor: Node) => void)} */
    m(this, Le);
    /** @type {Effect} */
    m(this, j);
    /** @type {Effect | null} */
    m(this, K, null);
    /** @type {Effect | null} */
    m(this, F, null);
    /** @type {Effect | null} */
    m(this, U, null);
    /** @type {DocumentFragment | null} */
    m(this, ve, null);
    m(this, Ie, 0);
    m(this, Ae, 0);
    m(this, et, !1);
    /** @type {Set<Effect>} */
    m(this, Et, /* @__PURE__ */ new Set());
    /** @type {Set<Effect>} */
    m(this, bt, /* @__PURE__ */ new Set());
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    m(this, pe, null);
    m(this, Wt, Ds(() => (g(this, pe, Nt(l(this, Ie))), () => {
      g(this, pe, null);
    })));
    var i;
    g(this, q, t), g(this, W, n), g(this, Le, (f) => {
      var a = (
        /** @type {Effect} */
        w
      );
      a.b = this, a.f |= an, r(f);
    }), this.parent = /** @type {Effect} */
    w.b, this.transform_error = s ?? ((i = this.parent) == null ? void 0 : i.transform_error) ?? ((f) => f), g(this, j, ni(() => {
      if (P) {
        const f = (
          /** @type {Comment} */
          l(this, mt)
        );
        tr();
        const a = f.data === Gn;
        if (f.data.startsWith(Cn)) {
          const o = JSON.parse(f.data.slice(Cn.length));
          E(this, A, ur).call(this, o);
        } else a ? E(this, A, or).call(this) : E(this, A, ar).call(this);
      } else
        E(this, A, un).call(this);
    }, Ls)), P && g(this, q, b);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    fr(t, l(this, Et), l(this, bt));
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!l(this, W).pending;
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, n) {
    E(this, A, on).call(this, t, n), g(this, Ie, l(this, Ie) + t), !(!l(this, pe) || l(this, et)) && (g(this, et, !0), Be(() => {
      g(this, et, !1), l(this, pe) && Gt(l(this, pe), l(this, Ie));
    }));
  }
  get_effect_pending() {
    return l(this, Wt).call(this), Y(
      /** @type {Source<number>} */
      l(this, pe)
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!l(this, W).onerror && !l(this, W).failed)
      throw t;
    y != null && y.is_fork ? (l(this, K) && y.skip_effect(l(this, K)), l(this, F) && y.skip_effect(l(this, F)), l(this, U) && y.skip_effect(l(this, U)), y.oncommit(() => {
      E(this, A, cn).call(this, t);
    })) : E(this, A, cn).call(this, t);
  }
}
q = new WeakMap(), mt = new WeakMap(), W = new WeakMap(), Le = new WeakMap(), j = new WeakMap(), K = new WeakMap(), F = new WeakMap(), U = new WeakMap(), ve = new WeakMap(), Ie = new WeakMap(), Ae = new WeakMap(), et = new WeakMap(), Et = new WeakMap(), bt = new WeakMap(), pe = new WeakMap(), Wt = new WeakMap(), A = new WeakSet(), ar = function() {
  try {
    g(this, K, xe(() => l(this, Le).call(this, l(this, q))));
  } catch (t) {
    this.error(t);
  }
}, /**
 * @param {unknown} error The deserialized error from the server's hydration comment
 */
ur = function(t) {
  const n = l(this, W).failed;
  n && g(this, U, xe(() => {
    n(
      l(this, q),
      () => t,
      () => () => {
      }
    );
  }));
}, or = function() {
  const t = l(this, W).pending;
  t && (this.is_pending = !0, g(this, F, xe(() => t(l(this, q)))), Be(() => {
    var n = g(this, ve, document.createDocumentFragment()), r = Ue();
    n.append(r), g(this, K, E(this, A, Dt).call(this, () => xe(() => l(this, Le).call(this, r)))), l(this, Ae) === 0 && (l(this, q).before(n), g(this, ve, null), It(
      /** @type {Effect} */
      l(this, F),
      () => {
        g(this, F, null);
      }
    ), E(this, A, Pt).call(
      this,
      /** @type {Batch} */
      y
    ));
  }));
}, un = function() {
  try {
    if (this.is_pending = this.has_pending_snippet(), g(this, Ae, 0), g(this, Ie, 0), g(this, K, xe(() => {
      l(this, Le).call(this, l(this, q));
    })), l(this, Ae) > 0) {
      var t = g(this, ve, document.createDocumentFragment());
      ii(l(this, K), t);
      const n = (
        /** @type {(anchor: Node) => void} */
        l(this, W).pending
      );
      g(this, F, xe(() => n(l(this, q))));
    } else
      E(this, A, Pt).call(
        this,
        /** @type {Batch} */
        y
      );
  } catch (n) {
    this.error(n);
  }
}, /**
 * @param {Batch} batch
 */
Pt = function(t) {
  this.is_pending = !1, t.transfer_effects(l(this, Et), l(this, bt));
}, /**
 * @template T
 * @param {() => T} fn
 */
Dt = function(t) {
  var n = w, r = $, s = k;
  te(l(this, j)), ee(l(this, j)), ut(l(this, j).ctx);
  try {
    return Ce.ensure(), t();
  } catch (i) {
    return ir(i), null;
  } finally {
    te(n), ee(r), ut(s);
  }
}, /**
 * Updates the pending count associated with the currently visible pending snippet,
 * if any, such that we can replace the snippet with content once work is done
 * @param {1 | -1} d
 * @param {Batch} batch
 */
on = function(t, n) {
  var r;
  if (!this.has_pending_snippet()) {
    this.parent && E(r = this.parent, A, on).call(r, t, n);
    return;
  }
  g(this, Ae, l(this, Ae) + t), l(this, Ae) === 0 && (E(this, A, Pt).call(this, n), l(this, F) && It(l(this, F), () => {
    g(this, F, null);
  }), l(this, ve) && (l(this, q).before(l(this, ve)), g(this, ve, null)));
}, /**
 * @param {unknown} error
 */
cn = function(t) {
  l(this, K) && (fe(l(this, K)), g(this, K, null)), l(this, F) && (fe(l(this, F)), g(this, F, null)), l(this, U) && (fe(l(this, U)), g(this, U, null)), P && (_e(
    /** @type {TemplateNode} */
    l(this, mt)
  ), As(), _e(Rs()));
  var n = l(this, W).onerror;
  let r = l(this, W).failed;
  var s = !1, i = !1;
  const f = () => {
    if (s) {
      Ss();
      return;
    }
    s = !0, i && bs(), l(this, U) !== null && It(l(this, U), () => {
      g(this, U, null);
    }), E(this, A, Dt).call(this, () => {
      E(this, A, un).call(this);
    });
  }, a = (u) => {
    try {
      i = !0, n == null || n(u, f), i = !1;
    } catch (o) {
      Ne(o, l(this, j) && l(this, j).parent);
    }
    r && g(this, U, E(this, A, Dt).call(this, () => {
      try {
        return xe(() => {
          var o = (
            /** @type {Effect} */
            w
          );
          o.b = this, o.f |= an, r(
            l(this, q),
            () => u,
            () => f
          );
        });
      } catch (o) {
        return Ne(
          o,
          /** @type {Effect} */
          l(this, j).parent
        ), null;
      }
    }));
  };
  Be(() => {
    var u;
    try {
      u = this.transform_error(t);
    } catch (o) {
      Ne(o, l(this, j) && l(this, j).parent);
      return;
    }
    u !== null && typeof u == "object" && typeof /** @type {any} */
    u.then == "function" ? u.then(
      a,
      /** @param {unknown} e */
      (o) => Ne(o, l(this, j) && l(this, j).parent)
    ) : a(u);
  });
};
function js(e, t, n, r) {
  const s = Rt() ? wt : hr;
  var i = e.filter((h) => !h.settled), f = t.map(s);
  if (n.length === 0 && i.length === 0) {
    r(f);
    return;
  }
  var a = (
    /** @type {Effect} */
    w
  ), u = Hs(), o = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((h) => h.promise)) : null;
  function d(h) {
    if (!(a.f & Q)) {
      u();
      try {
        r([...f, ...h]);
      } catch (v) {
        Ne(v, a);
      }
      Ut();
    }
  }
  var _ = cr();
  if (n.length === 0) {
    o.then(() => d([])).finally(_);
    return;
  }
  function c() {
    Promise.all(n.map((h) => /* @__PURE__ */ Bs(h))).then(d).catch((h) => Ne(h, a)).finally(_);
  }
  o ? o.then(() => {
    u(), c(), Ut();
  }) : c();
}
function Hs() {
  var e = (
    /** @type {Effect} */
    w
  ), t = $, n = k, r = (
    /** @type {Batch} */
    y
  );
  return function(i = !0) {
    te(e), ee(t), ut(n), i && !(e.f & Q) && (r == null || r.activate(), r == null || r.apply());
  };
}
function Ut(e = !0) {
  te(null), ee(null), ut(null), e && (y == null || y.deactivate());
}
function cr() {
  var e = (
    /** @type {Effect} */
    w
  ), t = e.b, n = (
    /** @type {Batch} */
    y
  ), r = !!(t != null && t.is_rendered());
  return t == null || t.update_pending_count(1, n), n.increment(r, e), () => {
    t == null || t.update_pending_count(-1, n), n.decrement(r, e);
  };
}
// @__NO_SIDE_EFFECTS__
function wt(e) {
  var t = L | M;
  return w !== null && (w.f |= We), {
    ctx: k,
    deps: null,
    effects: null,
    equals: nr,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      x
    ),
    wv: 0,
    parent: w,
    ac: null
  };
}
const ht = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Bs(e, t, n) {
  let r = (
    /** @type {Effect | null} */
    w
  );
  r === null && ds();
  var s = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), i = Nt(
    /** @type {V} */
    x
  ), f = !$, a = /* @__PURE__ */ new Set();
  return ti(() => {
    var h, v;
    var u = (
      /** @type {Effect} */
      w
    ), o = Xn();
    s = o.promise;
    try {
      Promise.resolve(e()).then(o.resolve, (p) => {
        p !== Jt && o.reject(p);
      }).finally(Ut);
    } catch (p) {
      o.reject(p), Ut();
    }
    var d = (
      /** @type {Batch} */
      y
    );
    if (f) {
      if (u.f & Ge)
        var _ = cr();
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        (h = r.b) != null && h.is_rendered()
      )
        (v = d.async_deriveds.get(u)) == null || v.reject(ht);
      else
        for (const p of a.values())
          p.reject(ht);
      a.add(o), d.async_deriveds.set(u, o);
    }
    const c = (p, S = void 0) => {
      _ == null || _(), a.delete(o), S !== ht && (d.activate(), S ? (i.f |= Oe, Gt(i, S)) : (i.f & Oe && (i.f ^= Oe), Gt(i, p)), d.deactivate());
    };
    o.promise.then(c, (p) => c(null, p || "unknown"));
  }), Rr(() => {
    for (const u of a)
      u.reject(ht);
  }), new Promise((u) => {
    function o(d) {
      function _() {
        d === s ? u(i) : o(s);
      }
      d.then(_, _);
    }
    o(s);
  });
}
// @__NO_SIDE_EFFECTS__
function Li(e) {
  const t = /* @__PURE__ */ wt(e);
  return Mr(t), t;
}
// @__NO_SIDE_EFFECTS__
function hr(e) {
  const t = /* @__PURE__ */ wt(e);
  return t.equals = rr, t;
}
function Ys(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      fe(
        /** @type {Effect} */
        t[n]
      );
  }
}
function mn(e) {
  var t, n = w, r = e.parent;
  if (!Ee && r !== null && e.v !== x && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  r.f & (Q | Z))
    return Ts(), e.v;
  te(r);
  try {
    e.f &= ~qe, Ys(e), t = Ir(e);
  } finally {
    te(n);
  }
  return t;
}
function dr(e) {
  var t = mn(e);
  if (!e.equals(t) && (e.wv = Dr(), (!(y != null && y.is_fork) || e.deps === null) && (y !== null ? (y.capture(e, t, !0), vt == null || vt.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    O(e, C);
    return;
  }
  Ee || (D !== null ? (An() || y != null && y.is_fork) && D.set(e, t) : $n(e));
}
function Vs(e) {
  var t, n;
  if (e.effects !== null)
    for (const r of e.effects)
      (r.teardown || r.ac) && ((t = r.teardown) == null || t.call(r), (n = r.ac) == null || n.abort(Jt), r.fn !== null && (r.teardown = fs), r.ac = null, $t(r, 0), Rn(r));
}
function _r(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && t.fn !== null && ze(t);
}
let sn = null, Ke = null, y = null, vt = null, D = null, hn = null, pt = !1, ln = !1, Xe = null, Lt = null;
var Pn = 0;
let qs = 1;
var tt, Re, Fe, nt, rt, st, ge, it, H, Tt, ye, re, oe, lt, je, T, dn, dt, _n, vr, pr, Je, Us, _t;
const Kt = class Kt {
  constructor() {
    m(this, T);
    R(this, "id", qs++);
    /** True as soon as `#process` was called */
    m(this, tt, !1);
    R(this, "linked", !0);
    /** @type {Batch | null} */
    m(this, Re, null);
    /** @type {Batch | null} */
    m(this, Fe, null);
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    R(this, "async_deriveds", /* @__PURE__ */ new Map());
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    R(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    R(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    m(this, nt, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    m(this, rt, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    m(this, st, 0);
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    m(this, ge, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    m(this, it, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    m(this, H, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    m(this, Tt, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    m(this, ye, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    m(this, re, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    m(this, oe, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    m(this, lt, /* @__PURE__ */ new Set());
    R(this, "is_fork", !1);
    m(this, je, !1);
    Ke === null ? sn = Ke = this : (g(Ke, Fe, this), g(this, Re, Ke)), Ke = this;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    l(this, oe).has(t) || l(this, oe).set(t, { d: [], m: [] }), l(this, lt).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, n = (r) => this.schedule(r)) {
    var r = l(this, oe).get(t);
    if (r) {
      l(this, oe).delete(t);
      for (var s of r.d)
        O(s, M), n(s);
      for (s of r.m)
        O(s, ae), n(s);
    }
    l(this, lt).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, n, r = !1) {
    t.v !== x && !this.previous.has(t) && this.previous.set(t, t.v), t.f & Oe || (this.current.set(t, [n, r]), D == null || D.set(t, n)), this.is_fork || (t.v = n);
  }
  activate() {
    y = this;
  }
  deactivate() {
    y = null, D = null;
  }
  flush() {
    try {
      ln = !0, y = this, E(this, T, dt).call(this);
    } finally {
      Pn = 0, hn = null, Xe = null, Lt = null, ln = !1, y = null, D = null, Ye.clear();
    }
  }
  discard() {
    var t;
    for (const n of l(this, rt)) n(this);
    l(this, rt).clear();
    for (const n of this.async_deriveds.values())
      n.reject(ht);
    E(this, T, _t).call(this), (t = l(this, it)) == null || t.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    l(this, Tt).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, n) {
    if (g(this, st, l(this, st) + 1), t) {
      let r = l(this, ge).get(n) ?? 0;
      l(this, ge).set(n, r + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, n) {
    if (g(this, st, l(this, st) - 1), t) {
      let r = l(this, ge).get(n) ?? 0;
      r === 1 ? l(this, ge).delete(n) : l(this, ge).set(n, r - 1);
    }
    l(this, je) || (g(this, je, !0), Be(() => {
      g(this, je, !1), this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, n) {
    for (const r of t)
      l(this, ye).add(r);
    for (const r of n)
      l(this, re).add(r);
    t.clear(), n.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    l(this, nt).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    l(this, rt).add(t);
  }
  settled() {
    return (l(this, it) ?? g(this, it, Xn())).promise;
  }
  static ensure() {
    if (y === null) {
      const t = y = new Kt();
      !ln && !pt && Be(() => {
        l(t, tt) || t.flush();
      });
    }
    return y;
  }
  apply() {
    {
      D = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    var s;
    if (hn = t, (s = t.b) != null && s.is_pending && t.f & (at | St | Zn) && !(t.f & Ge)) {
      t.b.defer_effect(t);
      return;
    }
    for (var n = t; n.parent !== null; ) {
      n = n.parent;
      var r = n.f;
      if (Xe !== null && n === w && ($ === null || !($.f & L)))
        return;
      if (r & (me | de)) {
        if (!(r & C))
          return;
        n.f ^= C;
      }
    }
    l(this, H).push(n);
  }
};
tt = new WeakMap(), Re = new WeakMap(), Fe = new WeakMap(), nt = new WeakMap(), rt = new WeakMap(), st = new WeakMap(), ge = new WeakMap(), it = new WeakMap(), H = new WeakMap(), Tt = new WeakMap(), ye = new WeakMap(), re = new WeakMap(), oe = new WeakMap(), lt = new WeakMap(), je = new WeakMap(), T = new WeakSet(), dn = function() {
  if (this.is_fork) return !0;
  for (const r of l(this, ge).keys()) {
    for (var t = r, n = !1; t.parent !== null; ) {
      if (l(this, oe).has(t)) {
        n = !0;
        break;
      }
      t = t.parent;
    }
    if (!n)
      return !0;
  }
  return !1;
}, dt = function() {
  var u, o, d, _;
  g(this, tt, !0), Pn++ > 1e3 && (E(this, T, _t).call(this), zs());
  for (const c of l(this, ye))
    l(this, re).delete(c), O(c, M), this.schedule(c);
  for (const c of l(this, re))
    O(c, ae), this.schedule(c);
  const t = l(this, H);
  g(this, H, []), this.apply();
  var n = Xe = [], r = [], s = Lt = [];
  for (const c of t)
    try {
      E(this, T, _n).call(this, c, n, r);
    } catch (h) {
      throw $r(c), E(this, T, dn).call(this) || this.discard(), h;
    }
  if (y = null, s.length > 0) {
    var i = Kt.ensure();
    for (const c of s)
      i.schedule(c);
  }
  if (Xe = null, Lt = null, E(this, T, dn).call(this)) {
    E(this, T, Je).call(this, r), E(this, T, Je).call(this, n);
    for (const [c, h] of l(this, oe))
      wr(c, h);
    s.length > 0 && /** @type {unknown} */
    E(u = y, T, dt).call(u);
    return;
  }
  const f = E(this, T, vr).call(this);
  if (f) {
    E(this, T, Je).call(this, r), E(this, T, Je).call(this, n), E(o = f, T, pr).call(o, this);
    return;
  }
  l(this, ye).clear(), l(this, re).clear();
  for (const c of l(this, nt)) c(this);
  l(this, nt).clear(), vt = this, Dn(r), Dn(n), vt = null, (d = l(this, it)) == null || d.resolve();
  var a = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    y
  );
  if (l(this, st) === 0 && (l(this, H).length === 0 || a !== null) && E(this, T, _t).call(this), l(this, H).length > 0)
    if (a !== null) {
      const c = a;
      l(c, H).push(...l(this, H).filter((h) => !l(c, H).includes(h)));
    } else
      a = this;
  a !== null && E(_ = a, T, dt).call(_);
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
_n = function(t, n, r) {
  t.f ^= C;
  for (var s = t.first; s !== null; ) {
    var i = s.f, f = (i & (de | me)) !== 0, a = f && (i & C) !== 0, u = a || (i & Z) !== 0 || l(this, oe).has(s);
    if (!u && s.fn !== null) {
      f ? s.f ^= C : i & at ? n.push(s) : ot(s) && (i & ie && l(this, re).add(s), ze(s));
      var o = s.first;
      if (o !== null) {
        s = o;
        continue;
      }
    }
    for (; s !== null; ) {
      var d = s.next;
      if (d !== null) {
        s = d;
        break;
      }
      s = s.parent;
    }
  }
}, vr = function() {
  for (var t = l(this, Re); t !== null; ) {
    if (!t.is_fork) {
      for (const [n, [, r]] of this.current)
        if (t.current.has(n) && !r)
          return t;
    }
    t = l(t, Re);
  }
  return null;
}, /**
 * @param {Batch} batch
 */
pr = function(t) {
  var r;
  for (const [s, i] of t.current)
    !this.previous.has(s) && t.previous.has(s) && this.previous.set(s, t.previous.get(s)), this.current.set(s, i);
  for (const [s, i] of t.async_deriveds) {
    const f = this.async_deriveds.get(s);
    f && i.promise.then(f.resolve).catch(f.reject);
  }
  t.async_deriveds.clear(), this.transfer_effects(l(t, ye), l(t, re));
  const n = (s) => {
    var i = s.reactions;
    if (i !== null)
      for (const u of i) {
        var f = u.f;
        if (f & L)
          n(
            /** @type {Derived} */
            u
          );
        else {
          var a = (
            /** @type {Effect} */
            u
          );
          f & (Qe | ie) && !this.async_deriveds.has(a) && (l(this, re).delete(a), O(a, M), this.schedule(a));
        }
      }
  };
  for (const s of this.current.keys())
    n(s);
  this.oncommit(() => t.discard()), E(r = t, T, _t).call(r), y = this, E(this, T, dt).call(this);
}, /**
 * @param {Effect[]} effects
 */
Je = function(t) {
  for (var n = 0; n < t.length; n += 1)
    fr(t[n], l(this, ye), l(this, re));
}, Us = function() {
  var _;
  for (let c = sn; c !== null; c = l(c, Fe)) {
    var t = c.id < this.id, n = [];
    for (const [h, [v, p]] of this.current) {
      if (c.current.has(h)) {
        var r = (
          /** @type {[any, boolean]} */
          c.current.get(h)[0]
        );
        if (t && v !== r)
          c.current.set(h, [v, p]);
        else
          continue;
      }
      n.push(h);
    }
    if (t)
      for (const [h, v] of this.async_deriveds) {
        const p = c.async_deriveds.get(h);
        p && v.promise.then(p.resolve).catch(p.reject);
      }
    var s = [...c.current.keys()].filter(
      (h) => !/** @type {[any, boolean]} */
      c.current.get(h)[1]
    );
    if (!(!l(c, tt) || s.length === 0)) {
      var i = s.filter((h) => !this.current.has(h));
      if (i.length === 0)
        t && c.discard();
      else if (n.length > 0) {
        if (t)
          for (const h of l(this, lt))
            c.unskip_effect(h, (v) => {
              var p;
              v.f & (ie | Qe) ? c.schedule(v) : E(p = c, T, Je).call(p, [v]);
            });
        c.activate();
        var f = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
        for (var u of n)
          yr(u, i, f, a);
        a = /* @__PURE__ */ new Map();
        var o = [...c.current].filter(([h, v]) => {
          const p = this.current.get(h);
          return p ? p[0] !== v[0] || p[1] !== v[1] : !0;
        }).map(([h]) => h);
        if (o.length > 0)
          for (const h of l(this, Tt))
            !(h.f & (Q | Z | Vt)) && En(h, o, a) && (h.f & (Qe | ie) ? (O(h, M), c.schedule(h)) : l(c, ye).add(h));
        if (l(c, H).length > 0 && !l(c, je)) {
          c.apply();
          for (var d of l(c, H))
            E(_ = c, T, _n).call(_, d, [], []);
          g(c, H, []);
        }
        c.deactivate();
      }
    }
  }
}, _t = function() {
  if (this.linked) {
    var t = l(this, Re), n = l(this, Fe);
    t === null ? sn = n : g(t, Fe, n), n === null ? Ke = t : g(n, Re, t), this.linked = !1;
  }
};
let Ce = Kt;
function gr(e) {
  var t = pt;
  pt = !0;
  try {
    for (var n; ; ) {
      if (xs(), y === null)
        return (
          /** @type {T} */
          n
        );
      y.flush();
    }
  } finally {
    pt = t;
  }
}
function zs() {
  try {
    gs();
  } catch (e) {
    Ne(e, hn);
  }
}
let ne = null;
function Dn(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if (!(r.f & (Q | Z)) && ot(r) && (ne = /* @__PURE__ */ new Set(), ze(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && kr(r), (ne == null ? void 0 : ne.size) > 0)) {
        Ye.clear();
        for (const s of ne) {
          if (s.f & (Q | Z)) continue;
          const i = [s];
          let f = s.parent;
          for (; f !== null; )
            ne.has(f) && (ne.delete(f), i.push(f)), f = f.parent;
          for (let a = i.length - 1; a >= 0; a--) {
            const u = i[a];
            u.f & (Q | Z) || ze(u);
          }
        }
        ne.clear();
      }
    }
    ne = null;
  }
}
function yr(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const s of e.reactions) {
      const i = s.f;
      i & L ? yr(
        /** @type {Derived} */
        s,
        t,
        n,
        r
      ) : i & (Qe | ie) && !(i & M) && En(s, t, r) && (O(s, M), bn(
        /** @type {Effect} */
        s
      ));
    }
}
function En(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const s of e.deps) {
      if (Ht.call(t, s))
        return !0;
      if (s.f & L && En(
        /** @type {Derived} */
        s,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          s,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function bn(e) {
  y.schedule(e);
}
function wr(e, t) {
  if (!(e.f & de && e.f & C)) {
    e.f & M ? t.d.push(e) : e.f & ae && t.m.push(e), O(e, C);
    for (var n = e.first; n !== null; )
      wr(n, t), n = n.next;
  }
}
function $r(e) {
  O(e, C);
  for (var t = e.first; t !== null; )
    $r(t), t = t.next;
}
let zt = /* @__PURE__ */ new Set();
const Ye = /* @__PURE__ */ new Map();
let mr = !1;
function Nt(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: nr,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function Se(e, t) {
  const n = Nt(e);
  return Mr(n), n;
}
// @__NO_SIDE_EFFECTS__
function Gs(e, t = !1, n = !0) {
  var s;
  const r = Nt(e);
  return t || (r.equals = rr), At && n && k !== null && k.l !== null && ((s = k.l).s ?? (s.s = [])).push(r), r;
}
function Ii(e, t) {
  return ce(
    e,
    nn(() => Y(e))
  ), t;
}
function ce(e, t, n = !1) {
  $ !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!le || $.f & Vt) && Rt() && $.f & (L | ie | Qe | Vt) && (he === null || !he.has(e)) && Es();
  let r = n ? Ze(t) : t;
  return Gt(e, r, Lt);
}
function Gt(e, t, n = null) {
  if (!e.equals(t)) {
    Ye.set(e, Ee ? t : e.v);
    var r = Ce.ensure();
    if (r.capture(e, t), e.f & L) {
      const s = (
        /** @type {Derived} */
        e
      );
      e.f & M && mn(s), D === null && $n(s);
    }
    e.wv = Dr(), Er(e, M, n), Rt() && w !== null && w.f & C && !(w.f & (de | me)) && (G === null ? li([e]) : G.push(e)), !r.is_fork && zt.size > 0 && !mr && Ws();
  }
  return t;
}
function Ws() {
  mr = !1;
  for (const e of zt) {
    e.f & C && O(e, ae);
    let t;
    try {
      t = ot(e);
    } catch {
      t = !0;
    }
    t && ze(e);
  }
  zt.clear();
}
function gt(e) {
  ce(e, e.v + 1);
}
function Er(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var s = Rt(), i = r.length, f = 0; f < i; f++) {
      var a = r[f], u = a.f;
      if (!(!s && a === w)) {
        var o = (u & M) === 0;
        if (o && O(a, t), u & Vt)
          zt.add(
            /** @type {Effect} */
            a
          );
        else if (u & L) {
          var d = (
            /** @type {Derived} */
            a
          );
          D == null || D.delete(d), u & qe || (u & X && (w === null || !(w.f & qt)) && (a.f |= qe), Er(d, ae, n));
        } else if (o) {
          var _ = (
            /** @type {Effect} */
            a
          );
          u & ie && ne !== null && ne.add(_), n !== null ? n.push(_) : bn(_);
        }
      }
    }
}
function Ze(e) {
  if (typeof e != "object" || e === null || ke in e)
    return e;
  const t = Jn(e);
  if (t !== is && t !== ls)
    return e;
  var n = /* @__PURE__ */ new Map(), r = ts(e), s = /* @__PURE__ */ Se(0), i = Ve, f = (a) => {
    if (Ve === i)
      return a();
    var u = $, o = Ve;
    ee(null), Hn(i);
    var d = a();
    return ee(u), Hn(o), d;
  };
  return r && n.set("length", /* @__PURE__ */ Se(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(a, u, o) {
        (!("value" in o) || o.configurable === !1 || o.enumerable === !1 || o.writable === !1) && $s();
        var d = n.get(u);
        return d === void 0 ? f(() => {
          var _ = /* @__PURE__ */ Se(o.value);
          return n.set(u, _), _;
        }) : ce(d, o.value, !0), !0;
      },
      deleteProperty(a, u) {
        var o = n.get(u);
        if (o === void 0) {
          if (u in a) {
            const d = f(() => /* @__PURE__ */ Se(x));
            n.set(u, d), gt(s);
          }
        } else
          ce(o, x), gt(s);
        return !0;
      },
      get(a, u, o) {
        var h;
        if (u === ke)
          return e;
        var d = n.get(u), _ = u in a;
        if (d === void 0 && (!_ || (h = He(a, u)) != null && h.writable) && (d = f(() => {
          var v = Ze(_ ? a[u] : x), p = /* @__PURE__ */ Se(v);
          return p;
        }), n.set(u, d)), d !== void 0) {
          var c = Y(d);
          return c === x ? void 0 : c;
        }
        return Reflect.get(a, u, o);
      },
      getOwnPropertyDescriptor(a, u) {
        var o = Reflect.getOwnPropertyDescriptor(a, u);
        if (o && "value" in o) {
          var d = n.get(u);
          d && (o.value = Y(d));
        } else if (o === void 0) {
          var _ = n.get(u), c = _ == null ? void 0 : _.v;
          if (_ !== void 0 && c !== x)
            return {
              enumerable: !0,
              configurable: !0,
              value: c,
              writable: !0
            };
        }
        return o;
      },
      has(a, u) {
        var c;
        if (u === ke)
          return !0;
        var o = n.get(u), d = o !== void 0 && o.v !== x || Reflect.has(a, u);
        if (o !== void 0 || w !== null && (!d || (c = He(a, u)) != null && c.writable)) {
          o === void 0 && (o = f(() => {
            var h = d ? Ze(a[u]) : x, v = /* @__PURE__ */ Se(h);
            return v;
          }), n.set(u, o));
          var _ = Y(o);
          if (_ === x)
            return !1;
        }
        return d;
      },
      set(a, u, o, d) {
        var Te;
        var _ = n.get(u), c = u in a;
        if (r && u === "length")
          for (var h = o; h < /** @type {Source<number>} */
          _.v; h += 1) {
            var v = n.get(h + "");
            v !== void 0 ? ce(v, x) : h in a && (v = f(() => /* @__PURE__ */ Se(x)), n.set(h + "", v));
          }
        if (_ === void 0)
          (!c || (Te = He(a, u)) != null && Te.writable) && (_ = f(() => /* @__PURE__ */ Se(void 0)), ce(_, Ze(o)), n.set(u, _));
        else {
          c = _.v !== x;
          var p = f(() => Ze(o));
          ce(_, p);
        }
        var S = Reflect.getOwnPropertyDescriptor(a, u);
        if (S != null && S.set && S.set.call(d, o), !c) {
          if (r && typeof u == "string") {
            var N = (
              /** @type {Source<number>} */
              n.get("length")
            ), z = Number(u);
            Number.isInteger(z) && z >= N.v && ce(N, z + 1);
          }
          gt(s);
        }
        return !0;
      },
      ownKeys(a) {
        Y(s);
        var u = Reflect.ownKeys(a).filter((_) => {
          var c = n.get(_);
          return c === void 0 || c.v !== x;
        });
        for (var [o, d] of n)
          d.v !== x && !(o in a) && u.push(o);
        return u;
      },
      setPrototypeOf() {
        ms();
      }
    }
  );
}
function Ln(e) {
  try {
    if (e !== null && typeof e == "object" && ke in e)
      return e[ke];
  } catch {
  }
  return e;
}
function Fi(e, t) {
  return Object.is(Ln(e), Ln(t));
}
var In, br, Tr, Sr;
function vn() {
  if (In === void 0) {
    In = window, br = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    Tr = He(t, "firstChild").get, Sr = He(t, "nextSibling").get, xn(e) && (e[cs] = void 0, e[os] = null, e[hs] = void 0, e.__e = void 0), xn(n) && (n[ct] = void 0);
  }
}
function Ue(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function se(e) {
  return (
    /** @type {TemplateNode | null} */
    Tr.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function be(e) {
  return (
    /** @type {TemplateNode | null} */
    Sr.call(e)
  );
}
function ji(e, t) {
  if (!P)
    return /* @__PURE__ */ se(e);
  var n = /* @__PURE__ */ se(b);
  if (n === null)
    n = b.appendChild(Ue());
  else if (t && n.nodeType !== Xt) {
    var r = Ue();
    return n == null || n.before(r), _e(r), r;
  }
  return t && Sn(
    /** @type {Text} */
    n
  ), _e(n), n;
}
function Hi(e, t = !1) {
  if (!P) {
    var n = /* @__PURE__ */ se(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ be(n) : n;
  }
  if (t) {
    if ((b == null ? void 0 : b.nodeType) !== Xt) {
      var r = Ue();
      return b == null || b.before(r), _e(r), r;
    }
    Sn(
      /** @type {Text} */
      b
    );
  }
  return b;
}
function Bi(e, t = 1, n = !1) {
  let r = P ? b : e;
  for (var s; t--; )
    s = r, r = /** @type {TemplateNode} */
    /* @__PURE__ */ be(r);
  if (!P)
    return r;
  if (n) {
    if ((r == null ? void 0 : r.nodeType) !== Xt) {
      var i = Ue();
      return r === null ? s == null || s.after(i) : r.before(i), _e(i), i;
    }
    Sn(
      /** @type {Text} */
      r
    );
  }
  return _e(r), r;
}
function Ks(e) {
  e.textContent = "";
}
function Yi() {
  return !1;
}
function Tn(e, t, n) {
  return t == null || t === es ? (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    n ? document.createElement(e, { is: n }) : document.createElement(e)
  ) : (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e)
  );
}
function Sn(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === Xt; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
let Fn = !1;
function Js() {
  Fn || (Fn = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        var t;
        if (!e.defaultPrevented)
          for (
            const n of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            (t = n[Mt]) == null || t.call(n);
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function en(e) {
  var t = $, n = w;
  ee(null), te(null);
  try {
    return e();
  } finally {
    ee(t), te(n);
  }
}
function Vi(e, t, n, r = n) {
  e.addEventListener(t, () => en(n));
  const s = (
    /** @type {any} */
    e[Mt]
  );
  s ? e[Mt] = () => {
    s(), r(!0);
  } : e[Mt] = () => r(!0), Js();
}
function Ar(e) {
  w === null && ($ === null && ps(), vs()), Ee && _s();
}
function Xs(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function ue(e, t) {
  var n = w;
  n !== null && n.f & Z && (e |= Z);
  var r = {
    ctx: k,
    deps: null,
    nodes: null,
    f: e | M | X,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  y == null || y.register_created_effect(r);
  var s = r;
  if (e & at)
    Xe !== null ? Xe.push(r) : Ce.ensure().schedule(r);
  else if (t !== null) {
    try {
      ze(r);
    } catch (f) {
      throw fe(r), f;
    }
    s.deps === null && s.teardown === null && s.nodes === null && s.first === s.last && // either `null`, or a singular child
    !(s.f & We) && (s = s.first, e & ie && e & yt && s !== null && (s.f |= yt));
  }
  if (s !== null && (s.parent = n, n !== null && Xs(s, n), $ !== null && $.f & L && !(e & me))) {
    var i = (
      /** @type {Derived} */
      $
    );
    (i.effects ?? (i.effects = [])).push(s);
  }
  return r;
}
function An() {
  return $ !== null && !le;
}
function Rr(e) {
  const t = ue(St, null);
  return O(t, C), t.teardown = e, t;
}
function qi(e) {
  Ar();
  var t = (
    /** @type {Effect} */
    w.f
  ), n = !$ && (t & de) !== 0 && k !== null && !k.i;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      k
    );
    (r.e ?? (r.e = [])).push(e);
  } else
    return Nr(e);
}
function Nr(e) {
  return ue(at | Qn, e);
}
function Ui(e) {
  return Ar(), ue(St | Qn, e);
}
function Zs(e) {
  Ce.ensure();
  const t = ue(me | We, e);
  return () => {
    fe(t);
  };
}
function Qs(e) {
  Ce.ensure();
  const t = ue(me | We, e);
  return (n = {}) => new Promise((r) => {
    n.outro ? It(t, () => {
      fe(t), r(void 0);
    }) : (fe(t), r(void 0));
  });
}
function ei(e) {
  return ue(at, e);
}
function zi(e, t) {
  var n = (
    /** @type {ComponentContextLegacy} */
    k
  ), r = { effect: null, ran: !1, deps: e };
  n.l.$.push(r), r.effect = tn(() => {
    if (e(), !r.ran) {
      r.ran = !0;
      var s = (
        /** @type {Effect} */
        w
      );
      try {
        te(s.parent), nn(t);
      } finally {
        te(s);
      }
    }
  });
}
function Gi() {
  var e = (
    /** @type {ComponentContextLegacy} */
    k
  );
  tn(() => {
    for (var t of e.l.$) {
      t.deps();
      var n = t.effect;
      n.f & C && n.deps !== null && O(n, ae), ot(n) && ze(n), t.ran = !1;
    }
  });
}
function ti(e) {
  return ue(Qe | We, e);
}
function tn(e, t = 0) {
  return ue(St | t, e);
}
function Wi(e, t = [], n = [], r = []) {
  js(r, t, n, (s) => {
    ue(St, () => {
      e(...s.map(Y));
    });
  });
}
function ni(e, t = 0) {
  var n = ue(ie | t, e);
  return n;
}
function xe(e) {
  return ue(de | We, e);
}
function Or(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Ee, r = $;
    jn(!0), ee(null);
    try {
      t.call(null);
    } finally {
      jn(n), ee(r);
    }
  }
}
function Rn(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const s = n.ac;
    s !== null && en(() => {
      s.abort(Jt);
    });
    var r = n.next;
    n.f & me ? n.parent = null : fe(n, t), n = r;
  }
}
function ri(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    t.f & de || fe(t), t = n;
  }
}
function fe(e, t = !0) {
  var n = !1;
  (t || e.f & us) && e.nodes !== null && e.nodes.end !== null && (si(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), e.f |= Mn, Rn(e, t && !n), $t(e, 0);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const i of r)
      i.stop();
  Or(e), e.f ^= Mn, e.f |= Q;
  var s = e.parent;
  s !== null && s.first !== null && kr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function si(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ be(e);
    e.remove(), e = n;
  }
}
function kr(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function It(e, t, n = !0) {
  var r = [];
  Cr(e, r, !0);
  var s = () => {
    n && fe(e), t && t();
  }, i = r.length;
  if (i > 0) {
    var f = () => --i || s();
    for (var a of r)
      a.out(f);
  } else
    s();
}
function Cr(e, t, n) {
  if (!(e.f & Z)) {
    e.f ^= Z;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const a of r)
        (a.is_global || n) && t.push(a);
    for (var s = e.first; s !== null; ) {
      var i = s.next;
      if (!(s.f & me)) {
        var f = (s.f & yt) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (s.f & de) !== 0 && (e.f & ie) !== 0;
        Cr(s, t, f ? n : !1);
      }
      s = i;
    }
  }
}
function Ki(e) {
  xr(e, !0);
}
function xr(e, t) {
  if (e.f & Z) {
    e.f ^= Z, e.f & C || (O(e, M), Ce.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, s = (n.f & yt) !== 0 || (n.f & de) !== 0;
      xr(n, s ? t : !1), n = r;
    }
    var i = e.nodes && e.nodes.t;
    if (i !== null)
      for (const f of i)
        (f.is_global || t) && f.in();
  }
}
function ii(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var s = n === r ? null : /* @__PURE__ */ be(n);
      t.append(n), n = s;
    }
}
let Ft = !1, Ee = !1;
function jn(e) {
  Ee = e;
}
let $ = null, le = !1;
function ee(e) {
  $ = e;
}
let w = null;
function te(e) {
  w = e;
}
let he = null;
function Mr(e) {
  $ !== null && (he ?? (he = /* @__PURE__ */ new Set())).add(e);
}
let B = null, V = 0, G = null;
function li(e) {
  G = e;
}
let Pr = 1, Pe = 0, Ve = Pe;
function Hn(e) {
  Ve = e;
}
function Dr() {
  return ++Pr;
}
function ot(e) {
  var t = e.f;
  if (t & M)
    return !0;
  if (t & L && (e.f &= ~qe), t & ae) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, s = 0; s < r; s++) {
      var i = n[s];
      if (ot(
        /** @type {Derived} */
        i
      ) && dr(
        /** @type {Derived} */
        i
      ), i.wv > e.wv)
        return !0;
    }
    t & X && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    D === null && O(e, C);
  }
  return !1;
}
function Lr(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(he !== null && he.has(e)))
    for (var s = 0; s < r.length; s++) {
      var i = r[s];
      i.f & L ? Lr(
        /** @type {Derived} */
        i,
        t,
        !1
      ) : t === i && (n ? O(i, M) : i.f & C && O(i, ae), bn(
        /** @type {Effect} */
        i
      ));
    }
}
function Ir(e) {
  var p;
  var t = B, n = V, r = G, s = $, i = he, f = k, a = le, u = Ve, o = e.f;
  B = /** @type {null | Value[]} */
  null, V = 0, G = null, $ = o & (de | me) ? null : e, he = null, ut(e.ctx), le = !1, Ve = ++Pe, e.ac !== null && (en(() => {
    e.ac.abort(Jt);
  }), e.ac = null);
  try {
    e.f |= qt;
    var d = (
      /** @type {Function} */
      e.fn
    ), _ = d();
    e.f |= Ge;
    var c = e.deps, h = y == null ? void 0 : y.is_fork;
    if (B !== null) {
      var v;
      if (h || $t(e, V), c !== null && V > 0)
        for (c.length = V + B.length, v = 0; v < B.length; v++)
          c[V + v] = B[v];
      else
        e.deps = c = B;
      if (An() && e.f & X)
        for (v = V; v < c.length; v++)
          ((p = c[v]).reactions ?? (p.reactions = [])).push(e);
    } else !h && c !== null && V < c.length && ($t(e, V), c.length = V);
    if (Rt() && G !== null && !le && c !== null && !(e.f & (L | ae | M)))
      for (v = 0; v < /** @type {Source[]} */
      G.length; v++)
        Lr(
          G[v],
          /** @type {Effect} */
          e
        );
    if (s !== null && s !== e) {
      if (Pe++, s.deps !== null)
        for (let S = 0; S < n; S += 1)
          s.deps[S].rv = Pe;
      if (t !== null)
        for (const S of t)
          S.rv = Pe;
      G !== null && (r === null ? r = G : r.push(.../** @type {Source[]} */
      G));
    }
    return e.f & Oe && (e.f ^= Oe), _;
  } catch (S) {
    return ir(S);
  } finally {
    e.f ^= qt, B = t, V = n, G = r, $ = s, he = i, ut(f), le = a, Ve = u;
  }
}
function fi(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = ns.call(n, e);
    if (r !== -1) {
      var s = n.length - 1;
      s === 0 ? n = t.reactions = null : (n[r] = n[s], n.pop());
    }
  }
  if (n === null && t.f & L && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (B === null || !Ht.call(B, t))) {
    var i = (
      /** @type {Derived} */
      t
    );
    i.f & X && (i.f ^= X, i.f &= ~qe), i.v !== x && $n(i), Vs(i), $t(i, 0);
  }
}
function $t(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      fi(e, n[r]);
}
function ze(e) {
  var t = e.f;
  if (!(t & Q)) {
    O(e, C);
    var n = w, r = Ft;
    w = e, Ft = !0;
    try {
      t & (ie | Zn) ? ri(e) : Rn(e), Or(e);
      var s = Ir(e);
      e.teardown = typeof s == "function" ? s : null, e.wv = Pr;
      var i;
      Kn && Os && e.f & M && e.deps;
    } finally {
      Ft = r, w = n;
    }
  }
}
async function Ji() {
  await Promise.resolve(), gr();
}
function Y(e) {
  var t = e.f, n = (t & L) !== 0;
  if ($ !== null && !le) {
    var r = w !== null && (w.f & Q) !== 0;
    if (!r && (he === null || !he.has(e))) {
      var s = $.deps;
      if ($.f & qt)
        e.rv < Pe && (e.rv = Pe, B === null && s !== null && s[V] === e ? V++ : B === null ? B = [e] : B.push(e));
      else {
        $.deps ?? ($.deps = []), Ht.call($.deps, e) || $.deps.push(e);
        var i = e.reactions;
        i === null ? e.reactions = [$] : Ht.call(i, $) || i.push($);
      }
    }
  }
  if (Ee && Ye.has(e))
    return Ye.get(e);
  if (n) {
    var f = (
      /** @type {Derived} */
      e
    );
    if (Ee) {
      var a = f.v;
      return (!(f.f & C) && f.reactions !== null || jr(f)) && (a = mn(f)), Ye.set(f, a), a;
    }
    var u = (f.f & X) === 0 && !le && $ !== null && (Ft || ($.f & X) !== 0), o = (f.f & Ge) === 0;
    ot(f) && (u && (f.f |= X), dr(f)), u && !o && (_r(f), Fr(f));
  }
  if (D != null && D.has(e))
    return D.get(e);
  if (e.f & Oe)
    throw e.v;
  return e.v;
}
function Fr(e) {
  if (e.f |= X, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ?? (t.reactions = [])).push(e), t.f & L && !(t.f & X) && (_r(
        /** @type {Derived} */
        t
      ), Fr(
        /** @type {Derived} */
        t
      ));
}
function jr(e) {
  if (e.v === x) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (Ye.has(t) || t.f & L && jr(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function nn(e) {
  var t = le;
  try {
    return le = !0, e();
  } finally {
    le = t;
  }
}
function Xi(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (ke in e)
      pn(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && ke in n && pn(n);
      }
  }
}
function pn(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let r in e)
      try {
        pn(e[r], t);
      } catch {
      }
    const n = Jn(e);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = ss(n);
      for (let s in r) {
        const i = r[s].get;
        if (i)
          try {
            i.call(e);
          } catch {
          }
      }
    }
  }
}
const De = Symbol("events"), Hr = /* @__PURE__ */ new Set(), gn = /* @__PURE__ */ new Set();
function ai(e, t, n, r = {}) {
  function s(i) {
    if (r.capture || yn.call(t, i), !i.cancelBubble)
      return en(() => n == null ? void 0 : n.call(this, i));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Be(() => {
    t.addEventListener(e, s, r);
  }) : t.addEventListener(e, s, r), s;
}
function Zi(e, t, n, r, s) {
  var i = { capture: r, passive: s }, f = ai(e, t, n, i);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && Rr(() => {
    t.removeEventListener(e, f, i);
  });
}
function Qi(e, t, n) {
  (t[De] ?? (t[De] = {}))[e] = n;
}
function el(e) {
  for (var t = 0; t < e.length; t++)
    Hr.add(e[t]);
  for (var n of gn)
    n(e);
}
let Bn = null;
function yn(e) {
  var p, S;
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, s = ((p = e.composedPath) == null ? void 0 : p.call(e)) || [], i = (
    /** @type {null | Element} */
    s[0] || e.target
  );
  Bn = e;
  var f = 0, a = Bn === e && e[De];
  if (a) {
    var u = s.indexOf(a);
    if (u !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[De] = t;
      return;
    }
    var o = s.indexOf(t);
    if (o === -1)
      return;
    u <= o && (f = u);
  }
  if (i = /** @type {Element} */
  s[f] || e.target, i !== t) {
    Yt(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || n;
      }
    });
    var d = $, _ = w;
    ee(null), te(null);
    try {
      for (var c, h = []; i !== null && i !== t; ) {
        try {
          var v = (S = i[De]) == null ? void 0 : S[r];
          v != null && (!/** @type {any} */
          i.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === i) && v.call(i, e);
        } catch (N) {
          c ? h.push(N) : c = N;
        }
        if (e.cancelBubble) break;
        f++, i = f < s.length ? (
          /** @type {Element} */
          s[f]
        ) : null;
      }
      if (c) {
        for (let N of h)
          queueMicrotask(() => {
            throw N;
          });
        throw c;
      }
    } finally {
      e[De] = t, delete e.currentTarget, ee(d), te(_);
    }
  }
}
var qn;
const fn = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  ((qn = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : qn.trustedTypes) && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function ui(e) {
  return (
    /** @type {string} */
    (fn == null ? void 0 : fn.createHTML(e)) ?? e
  );
}
function Br(e) {
  var t = Tn("template");
  return t.innerHTML = ui(e.replaceAll("<!>", "<!---->")), t.content;
}
function $e(e, t) {
  var n = (
    /** @type {Effect} */
    w
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function tl(e, t) {
  var n = (t & Un) !== 0, r = (t & Qr) !== 0, s, i = !e.startsWith("<!>");
  return () => {
    if (P)
      return $e(b, null), b;
    s === void 0 && (s = Br(i ? e : "<!>" + e), n || (s = /** @type {TemplateNode} */
    /* @__PURE__ */ se(s)));
    var f = (
      /** @type {TemplateNode} */
      r || br ? document.importNode(s, !0) : s.cloneNode(!0)
    );
    if (n) {
      var a = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ se(f)
      ), u = (
        /** @type {TemplateNode} */
        f.lastChild
      );
      $e(a, u);
    } else
      $e(f, f);
    return f;
  };
}
// @__NO_SIDE_EFFECTS__
function oi(e, t, n = "svg") {
  var r = !e.startsWith("<!>"), s = (t & Un) !== 0, i = `<${n}>${r ? e : "<!>" + e}</${n}>`, f;
  return () => {
    if (P)
      return $e(b, null), b;
    if (!f) {
      var a = (
        /** @type {DocumentFragment} */
        Br(i)
      ), u = (
        /** @type {Element} */
        /* @__PURE__ */ se(a)
      );
      if (s)
        for (f = document.createDocumentFragment(); /* @__PURE__ */ se(u); )
          f.appendChild(
            /** @type {TemplateNode} */
            /* @__PURE__ */ se(u)
          );
      else
        f = /** @type {Element} */
        /* @__PURE__ */ se(u);
    }
    var o = (
      /** @type {TemplateNode} */
      f.cloneNode(!0)
    );
    if (s) {
      var d = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ se(o)
      ), _ = (
        /** @type {TemplateNode} */
        o.lastChild
      );
      $e(d, _);
    } else
      $e(o, o);
    return o;
  };
}
// @__NO_SIDE_EFFECTS__
function nl(e, t) {
  return /* @__PURE__ */ oi(e, t, "svg");
}
function rl() {
  if (P)
    return $e(b, null), b;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = Ue();
  return e.append(t, n), $e(t, n), e;
}
function ci(e, t) {
  if (P) {
    var n = (
      /** @type {Effect & { nodes: EffectNodes }} */
      w
    );
    (!(n.f & Ge) || n.nodes.end === null) && (n.nodes.end = b), tr();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
const hi = ["touchstart", "touchmove"];
function di(e) {
  return hi.includes(e);
}
function sl(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[ct] ?? (e[ct] = e.nodeValue)) && (e[ct] = n, e.nodeValue = `${n}`);
}
function Yr(e, t) {
  return Vr(e, t);
}
function _i(e, t) {
  vn(), t.intro = t.intro ?? !1;
  const n = t.target, r = P, s = b;
  try {
    for (var i = /* @__PURE__ */ se(n); i && (i.nodeType !== Zt || /** @type {Comment} */
    i.data !== zn); )
      i = /* @__PURE__ */ be(i);
    if (!i)
      throw ft;
    kt(!0), _e(
      /** @type {Comment} */
      i
    );
    const f = Vr(e, { ...t, anchor: i });
    return kt(!1), /**  @type {Exports} */
    f;
  } catch (f) {
    if (f instanceof Error && f.message.split(`
`).some((a) => a.startsWith("https://svelte.dev/e/")))
      throw f;
    return f !== ft && console.warn("Failed to hydrate: ", f), t.recover === !1 && ys(), vn(), Ks(n), kt(!1), Yr(e, t);
  } finally {
    kt(r), _e(s);
  }
}
const xt = /* @__PURE__ */ new Map();
function Vr(e, { target: t, anchor: n, props: r = {}, events: s, context: i, intro: f = !0, transformError: a }) {
  vn();
  var u = void 0, o = Qs(() => {
    var d = n ?? t.appendChild(Ue());
    Is(
      /** @type {TemplateNode} */
      d,
      {
        pending: () => {
        }
      },
      (h) => {
        ks({});
        var v = (
          /** @type {ComponentContext} */
          k
        );
        if (i && (v.c = i), s && (r.$$events = s), P && $e(
          /** @type {TemplateNode} */
          h,
          null
        ), u = e(h, r) || {}, P && (w.nodes.end = b, b === null || b.nodeType !== Zt || /** @type {Comment} */
        b.data !== Wn))
          throw Qt(), ft;
        Cs();
      },
      a
    );
    var _ = /* @__PURE__ */ new Set(), c = (h) => {
      for (var v = 0; v < h.length; v++) {
        var p = h[v];
        if (!_.has(p)) {
          _.add(p);
          var S = di(p);
          for (const Te of [t, document]) {
            var N = xt.get(Te);
            N === void 0 && (N = /* @__PURE__ */ new Map(), xt.set(Te, N));
            var z = N.get(p);
            z === void 0 ? (Te.addEventListener(p, yn, { passive: S }), N.set(p, 1)) : N.set(p, z + 1);
          }
        }
      }
    };
    return c(rs(Hr)), gn.add(c), () => {
      var S;
      for (var h of _)
        for (const N of [t, document]) {
          var v = (
            /** @type {Map<string, number>} */
            xt.get(N)
          ), p = (
            /** @type {number} */
            v.get(h)
          );
          --p == 0 ? (N.removeEventListener(h, yn), v.delete(h), v.size === 0 && xt.delete(N)) : v.set(h, p);
        }
      gn.delete(c), d !== n && ((S = d.parentNode) == null || S.removeChild(d));
    };
  });
  return wn.set(u, o), u;
}
let wn = /* @__PURE__ */ new WeakMap();
function vi(e, t) {
  const n = wn.get(e);
  return n ? (wn.delete(e), n(t)) : Promise.resolve();
}
function il(e, t) {
  ei(() => {
    var n = e.getRootNode(), r = (
      /** @type {ShadowRoot} */
      n.host ? (
        /** @type {ShadowRoot} */
        n
      ) : (
        /** @type {Document} */
        n.head ?? /** @type {Document} */
        n.ownerDocument.head
      )
    );
    if (!r.querySelector("#" + t.hash)) {
      const s = Tn("style");
      s.id = t.hash, s.textContent = t.code, r.appendChild(s);
    }
  });
}
function ll(e, t, n, r) {
  var Nn;
  var s = !At || (n & Kr) !== 0, i = (n & Xr) !== 0, f = (n & Zr) !== 0, a = (
    /** @type {V} */
    r
  ), u = !0, o = (
    /** @type {Derived<V> | undefined} */
    void 0
  ), d = () => f && s ? (o ?? (o = /* @__PURE__ */ wt(
    /** @type {() => V} */
    r
  )), Y(o)) : (u && (u = !1, a = f ? nn(
    /** @type {() => V} */
    r
  ) : (
    /** @type {V} */
    r
  )), a);
  let _;
  if (i) {
    var c = ke in e || er in e;
    _ = ((Nn = He(e, t)) == null ? void 0 : Nn.set) ?? (c && t in e ? (I) => e[t] = I : void 0);
  }
  var h, v = !1;
  i ? [h, v] = Ps(() => (
    /** @type {V} */
    e[t]
  )) : h = /** @type {V} */
  e[t], h === void 0 && r !== void 0 && (h = d(), _ && (s && ws(), _(h)));
  var p;
  if (s ? p = () => {
    var I = (
      /** @type {V} */
      e[t]
    );
    return I === void 0 ? d() : (u = !0, I);
  } : p = () => {
    var I = (
      /** @type {V} */
      e[t]
    );
    return I !== void 0 && (a = /** @type {V} */
    void 0), I === void 0 ? a : I;
  }, s && !(n & Jr))
    return p;
  if (_) {
    var S = e.$$legacy;
    return (
      /** @type {() => V} */
      function(I, Ot) {
        return arguments.length > 0 ? ((!s || !Ot || S || v) && _(Ot ? p() : I), I) : p();
      }
    );
  }
  var N = !1, z = (n & Wr ? wt : hr)(() => (N = !1, p()));
  i && Y(z);
  var Te = (
    /** @type {Effect} */
    w
  );
  return (
    /** @type {() => V} */
    function(I, Ot) {
      if (arguments.length > 0) {
        const On = Ot ? Y(z) : s && i ? Ze(I) : I;
        return ce(z, On), N = !0, a !== void 0 && (a = On), I;
      }
      return Ee && N || Te.f & Q ? z.v : Y(z);
    }
  );
}
function pi(e) {
  return new gi(e);
}
var we, J;
class gi {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(t) {
    /** @type {any} */
    m(this, we);
    /** @type {Record<string, any>} */
    m(this, J);
    var i;
    var n = /* @__PURE__ */ new Map(), r = (f, a) => {
      var u = /* @__PURE__ */ Gs(a, !1, !1);
      return n.set(f, u), u;
    };
    const s = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(f, a) {
          return Y(n.get(a) ?? r(a, Reflect.get(f, a)));
        },
        has(f, a) {
          return a === er ? !0 : (Y(n.get(a) ?? r(a, Reflect.get(f, a))), Reflect.has(f, a));
        },
        set(f, a, u) {
          return ce(n.get(a) ?? r(a, u), u), Reflect.set(f, a, u);
        }
      }
    );
    g(this, J, (t.hydrate ? _i : Yr)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: s,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    })), (!((i = t == null ? void 0 : t.props) != null && i.$$host) || t.sync === !1) && gr(), g(this, we, s.$$events);
    for (const f of Object.keys(l(this, J)))
      f === "$set" || f === "$destroy" || f === "$on" || Yt(this, f, {
        get() {
          return l(this, J)[f];
        },
        /** @param {any} value */
        set(a) {
          l(this, J)[f] = a;
        },
        enumerable: !0
      });
    l(this, J).$set = /** @param {Record<string, any>} next */
    (f) => {
      Object.assign(s, f);
    }, l(this, J).$destroy = () => {
      vi(l(this, J));
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    l(this, J).$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, n) {
    l(this, we)[t] = l(this, we)[t] || [];
    const r = (...s) => n.call(this, ...s);
    return l(this, we)[t].push(r), () => {
      l(this, we)[t] = l(this, we)[t].filter(
        /** @param {any} fn */
        (s) => s !== r
      );
    };
  }
  $destroy() {
    l(this, J).$destroy();
  }
}
we = new WeakMap(), J = new WeakMap();
let qr;
typeof HTMLElement == "function" && (qr = class extends HTMLElement {
  /**
   * @param {*} $$componentCtor
   * @param {*} $$slots
   * @param {ShadowRootInit | undefined} shadow_root_init
   */
  constructor(t, n, r) {
    super();
    /** The Svelte component constructor */
    R(this, "$$ctor");
    /** Slots */
    R(this, "$$s");
    /** @type {any} The Svelte component instance */
    R(this, "$$c");
    /** Whether or not the custom element is connected */
    R(this, "$$cn", !1);
    /** @type {Record<string, any>} Component props data */
    R(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    R(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    R(this, "$$p_d", {});
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    R(this, "$$l", {});
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    R(this, "$$l_u", /* @__PURE__ */ new Map());
    /** @type {any} The managed render effect for reflecting attributes */
    R(this, "$$me");
    /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
    R(this, "$$shadowRoot", null);
    this.$$ctor = t, this.$$s = n, r && (this.$$shadowRoot = this.attachShadow(r));
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(t, n, r) {
    if (this.$$l[t] = this.$$l[t] || [], this.$$l[t].push(n), this.$$c) {
      const s = this.$$c.$on(t, n);
      this.$$l_u.set(n, s);
    }
    super.addEventListener(t, n, r);
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(t, n, r) {
    if (super.removeEventListener(t, n, r), this.$$c) {
      const s = this.$$l_u.get(n);
      s && (s(), this.$$l_u.delete(n));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let t = function(s) {
        return (i) => {
          const f = Tn("slot");
          s !== "default" && (f.name = s), ci(i, f);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const n = {}, r = yi(this);
      for (const s of this.$$s)
        s in r && (s === "default" && !this.$$d.children ? (this.$$d.children = t(s), n.default = !0) : n[s] = t(s));
      for (const s of this.attributes) {
        const i = this.$$g_p(s.name);
        i in this.$$d || (this.$$d[i] = jt(i, s.value, this.$$p_d, "toProp"));
      }
      for (const s in this.$$p_d)
        !(s in this.$$d) && this[s] !== void 0 && (this.$$d[s] = this[s], delete this[s]);
      this.$$c = pi({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$host: this
        }
      }), this.$$me = Zs(() => {
        tn(() => {
          var s;
          this.$$r = !0;
          for (const i of Bt(this.$$c)) {
            if (!((s = this.$$p_d[i]) != null && s.reflect)) continue;
            this.$$d[i] = this.$$c[i];
            const f = jt(
              i,
              this.$$d[i],
              this.$$p_d,
              "toAttribute"
            );
            f == null ? this.removeAttribute(this.$$p_d[i].attribute || i) : this.setAttribute(this.$$p_d[i].attribute || i, f);
          }
          this.$$r = !1;
        });
      });
      for (const s in this.$$l)
        for (const i of this.$$l[s]) {
          const f = this.$$c.$on(s, i);
          this.$$l_u.set(i, f);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  /**
   * @param {string} attr
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(t, n, r) {
    var s;
    this.$$r || (t = this.$$g_p(t), this.$$d[t] = jt(t, r, this.$$p_d, "toProp"), (s = this.$$c) == null || s.$set({ [t]: this.$$d[t] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$me(), this.$$c = void 0);
    });
  }
  /**
   * @param {string} attribute_name
   */
  $$g_p(t) {
    return Bt(this.$$p_d).find(
      (n) => this.$$p_d[n].attribute === t || !this.$$p_d[n].attribute && n.toLowerCase() === t
    ) || t;
  }
});
function jt(e, t, n, r) {
  var i;
  const s = (i = n[e]) == null ? void 0 : i.type;
  if (t = s === "Boolean" && typeof t != "boolean" ? t != null : t, !r || !n[e])
    return t;
  if (r === "toAttribute")
    switch (s) {
      case "Object":
      case "Array":
        return t == null ? null : JSON.stringify(t);
      case "Boolean":
        return t ? "" : null;
      case "Number":
        return t ?? null;
      default:
        return t;
    }
  else
    switch (s) {
      case "Object":
      case "Array":
        return t && JSON.parse(t);
      case "Boolean":
        return t;
      case "Number":
        return t != null ? +t : t;
      default:
        return t;
    }
}
function yi(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function fl(e, t, n, r, s, i) {
  let f = class extends qr {
    constructor() {
      super(e, n, s), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Bt(t).map(
        (a) => (t[a].attribute || a).toLowerCase()
      );
    }
  };
  return Bt(t).forEach((a) => {
    Yt(f.prototype, a, {
      get() {
        return this.$$c && a in this.$$c ? this.$$c[a] : this.$$d[a];
      },
      set(u) {
        var _;
        u = jt(a, u, t), this.$$d[a] = u;
        var o = this.$$c;
        if (o) {
          var d = (_ = He(o, a)) == null ? void 0 : _.get;
          d ? o[a] = u : o.$set({ [a]: u });
        }
      }
    });
  }), r.forEach((a) => {
    Yt(f.prototype, a, {
      get() {
        var u;
        return (u = this.$$c) == null ? void 0 : u[a];
      }
    });
  }), e.element = /** @type {any} */
  f, f;
}
export {
  _e as $,
  As as A,
  Rr as B,
  He as C,
  Ue as D,
  ni as E,
  Gt as F,
  y as G,
  Ai as H,
  xe as I,
  ki as J,
  Yi as K,
  hr as L,
  ts as M,
  rs as N,
  $i as O,
  Ei as P,
  Nt as Q,
  mi as R,
  Q as S,
  Ki as T,
  It as U,
  Z as V,
  de as W,
  Ks as X,
  ii as Y,
  fe as Z,
  P as _,
  il as a,
  se as a0,
  tr as a1,
  Pi as a2,
  Gn as a3,
  Rs as a4,
  kt as a5,
  b as a6,
  Zt as a7,
  Wn as a8,
  be as a9,
  Vi as aA,
  xi as aB,
  Fi as aC,
  rl as aD,
  nl as aE,
  $e as aF,
  si as aG,
  Tn as aH,
  Qt as aI,
  ft as aJ,
  bi as aK,
  Ti as aL,
  Ii as aM,
  yt as aN,
  At as aO,
  Ci as aP,
  Li as aQ,
  Ji as aR,
  cs as aa,
  Ri as ab,
  os as ac,
  es as ad,
  Jn as ae,
  ee as af,
  te as ag,
  $ as ah,
  w as ai,
  ss as aj,
  Mt as ak,
  Be as al,
  Js as am,
  Oi as an,
  hs as ao,
  k as ap,
  Ui as aq,
  as as ar,
  nn as as,
  Si as at,
  wt as au,
  Di as av,
  ei as aw,
  tn as ax,
  Mn as ay,
  ke as az,
  Gi as b,
  fl as c,
  ci as d,
  Cs as e,
  tl as f,
  ks as g,
  Xi as h,
  ji as i,
  Y as j,
  sl as k,
  zi as l,
  Gs as m,
  gr as n,
  ce as o,
  ll as p,
  el as q,
  Mi as r,
  Bi as s,
  Wi as t,
  qi as u,
  Se as v,
  Ze as w,
  Zi as x,
  Qi as y,
  Hi as z
};
