var C = Object.defineProperty;
var w = (a) => {
  throw TypeError(a);
};
var I = (a, e, s) => e in a ? C(a, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[e] = s;
var A = (a, e, s) => I(a, typeof e != "symbol" ? e + "" : e, s), E = (a, e, s) => e.has(a) || w("Cannot " + s);
var t = (a, e, s) => (E(a, e, "read from private field"), s ? s.call(a) : e.get(a)), u = (a, e, s) => e.has(a) ? w("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(a) : e.set(a, s), F = (a, e, s, i) => (E(a, e, "write to private field"), i ? i.call(a, s) : e.set(a, s), s);
import { T as M, Z as g, U as R, D as T, I as x, G as S, Y as B, K as G, _ as k, a6 as N, E as K, aN as P, a1 as U, a2 as Y, a4 as Z, $, a5 as D } from "./custom-element-DAaXFYsU.js";
var d, l, c, p, v, m, b;
class j {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(e, s = !0) {
    /** @type {TemplateNode} */
    A(this, "anchor");
    /** @type {Map<Batch, Key>} */
    u(this, d, /* @__PURE__ */ new Map());
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    u(this, l, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    u(this, c, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    u(this, p, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    u(this, v, !0);
    /**
     * @param {Batch} batch
     */
    u(this, m, (e) => {
      if (t(this, d).has(e)) {
        var s = (
          /** @type {Key} */
          t(this, d).get(e)
        ), i = t(this, l).get(s);
        if (i)
          M(i), t(this, p).delete(s);
        else {
          var f = t(this, c).get(s);
          f && (M(f.effect), t(this, l).set(s, f.effect), t(this, c).delete(s), f.fragment.lastChild.remove(), this.anchor.before(f.fragment), i = f.effect);
        }
        for (const [n, h] of t(this, d)) {
          if (t(this, d).delete(n), n === e)
            break;
          const r = t(this, c).get(h);
          r && (g(r.effect), t(this, c).delete(h));
        }
        for (const [n, h] of t(this, l)) {
          if (n === s || t(this, p).has(n)) continue;
          const r = () => {
            if (Array.from(t(this, d).values()).includes(n)) {
              var _ = document.createDocumentFragment();
              B(h, _), _.append(T()), t(this, c).set(n, { effect: h, fragment: _ });
            } else
              g(h);
            t(this, p).delete(n), t(this, l).delete(n);
          };
          t(this, v) || !i ? (t(this, p).add(n), R(h, r, !1)) : r();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    u(this, b, (e) => {
      t(this, d).delete(e);
      const s = Array.from(t(this, d).values());
      for (const [i, f] of t(this, c))
        s.includes(i) || (g(f.effect), t(this, c).delete(i));
    });
    this.anchor = e, F(this, v, s);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(e, s) {
    var i = (
      /** @type {Batch} */
      S
    ), f = G();
    if (s && !t(this, l).has(e) && !t(this, c).has(e))
      if (f) {
        var n = document.createDocumentFragment(), h = T();
        n.append(h), t(this, c).set(e, {
          effect: x(() => s(h)),
          fragment: n
        });
      } else
        t(this, l).set(
          e,
          x(() => s(this.anchor))
        );
    if (t(this, d).set(i, e), f) {
      for (const [r, o] of t(this, l))
        r === e ? i.unskip_effect(o) : i.skip_effect(o);
      for (const [r, o] of t(this, c))
        r === e ? i.unskip_effect(o.effect) : i.skip_effect(o.effect);
      i.oncommit(t(this, m)), i.ondiscard(t(this, b));
    } else
      k && (this.anchor = N), t(this, m).call(this, i);
  }
}
d = new WeakMap(), l = new WeakMap(), c = new WeakMap(), p = new WeakMap(), v = new WeakMap(), m = new WeakMap(), b = new WeakMap();
function H(a, e, s = !1) {
  var i;
  k && (i = N, U());
  var f = new j(a), n = s ? P : 0;
  function h(r, o) {
    if (k) {
      var _ = Y(
        /** @type {TemplateNode} */
        i
      );
      if (r !== parseInt(_.substring(1))) {
        var y = Z();
        $(y), f.anchor = y, D(!1), f.ensure(r, o), D(!0);
        return;
      }
    }
    f.ensure(r, o);
  }
  K(() => {
    var r = !1;
    e((o, _ = 0) => {
      r = !0, h(_, o);
    }), r || h(-1, null);
  }, n);
}
export {
  H as i
};
