import { D as H, E as W, j as B, F as U, G as Z, H as T, I as Y, J as $, K as j, L as ee, M as ne, N as V, O as re, P as fe, m as ae, Q as X, R as ie, S as le, T as J, U as K, V as O, W as ue, X as se, Y as oe, Z as ve, _ as I, $ as z, a0 as te, a1 as de, a2 as ce, a3 as pe, a4 as q, a5 as y, a6 as b, a7 as ge, a8 as he, a9 as _e } from "./custom-element-DAaXFYsU.js";
function Ce(e, a) {
  return a;
}
function Ee(e, a, l) {
  for (var o = [], c = a.length, u, i = a.length, r = 0; r < c; r++) {
    let v = a[r];
    K(
      v,
      () => {
        if (u) {
          if (u.pending.delete(v), u.done.add(v), u.pending.size === 0) {
            var w = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            L(e, V(u.done)), w.delete(u), w.size === 0 && (e.outrogroups = null);
          }
        } else
          i -= 1;
      },
      !1
    );
  }
  if (i === 0) {
    var t = o.length === 0 && l !== null;
    if (t) {
      var f = (
        /** @type {Element} */
        l
      ), d = (
        /** @type {Element} */
        f.parentNode
      );
      se(d), d.append(f), e.items.clear();
    }
    L(e, a, !t);
  } else
    u = {
      pending: new Set(a),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ?? (e.outrogroups = /* @__PURE__ */ new Set())).add(u);
}
function L(e, a, l = !0) {
  var o;
  if (e.pending.size > 0) {
    o = /* @__PURE__ */ new Set();
    for (const i of e.pending.values())
      for (const r of i)
        o.add(
          /** @type {EachItem} */
          e.items.get(r).e
        );
  }
  for (var c = 0; c < a.length; c++) {
    var u = a[c];
    if (o != null && o.has(u)) {
      u.f |= T;
      const i = document.createDocumentFragment();
      oe(u, i);
    } else
      ve(a[c], l);
  }
}
var G;
function Ne(e, a, l, o, c, u = null) {
  var i = e, r = /* @__PURE__ */ new Map();
  {
    var t = (
      /** @type {Element} */
      e
    );
    i = I ? z(te(t)) : t.appendChild(H());
  }
  I && de();
  var f = null, d = ee(() => {
    var s = l();
    return (
      /** @type {V[]} */
      ne(s) ? s : s == null ? [] : V(s)
    );
  }), v, w = /* @__PURE__ */ new Map(), h = !0;
  function n(s) {
    p.effect.f & le || (p.pending.delete(s), p.fallback = f, me(p, v, i, a, o), f !== null && (v.length === 0 ? f.f & T ? (f.f ^= T, D(f, null, i)) : J(f) : K(f, () => {
      f = null;
    })));
  }
  function C(s) {
    p.pending.delete(s);
  }
  var M = W(() => {
    v = /** @type {V[]} */
    B(d);
    var s = v.length;
    let A = !1;
    if (I) {
      var R = ce(i) === pe;
      R !== (s === 0) && (i = q(), z(i), y(!1), A = !0);
    }
    for (var _ = /* @__PURE__ */ new Set(), N = (
      /** @type {Batch} */
      Z
    ), x = j(), E = 0; E < s; E += 1) {
      I && b.nodeType === ge && /** @type {Comment} */
      b.data === he && (i = /** @type {Comment} */
      b, A = !0, y(!1));
      var g = v[E], F = o(g, E), m = h ? null : r.get(F);
      m ? (m.v && U(m.v, g), m.i && U(m.i, E), x && N.unskip_effect(m.e)) : (m = Te(
        r,
        h ? i : G ?? (G = H()),
        g,
        F,
        E,
        c,
        a,
        l
      ), h || (m.e.f |= T), r.set(F, m)), _.add(F);
    }
    if (s === 0 && u && !f && (h ? f = Y(() => u(i)) : (f = Y(() => u(G ?? (G = H()))), f.f |= T)), s > _.size && $(), I && s > 0 && z(q()), !h)
      if (w.set(N, _), x) {
        for (const [P, Q] of r)
          _.has(P) || N.skip_effect(Q.e);
        N.oncommit(n), N.ondiscard(C);
      } else
        n(N);
    A && y(!0), B(d);
  }), p = { effect: M, items: r, pending: w, outrogroups: null, fallback: f };
  h = !1, I && (i = b);
}
function k(e) {
  for (; e !== null && !(e.f & ue); )
    e = e.next;
  return e;
}
function me(e, a, l, o, c) {
  var E;
  var u = a.length, i = e.items, r = k(e.effect.first), t, f = null, d = [], v = [], w, h, n, C;
  for (C = 0; C < u; C += 1) {
    if (w = a[C], h = c(w, C), n = /** @type {EachItem} */
    i.get(h).e, e.outrogroups !== null)
      for (const g of e.outrogroups)
        g.pending.delete(n), g.done.delete(n);
    if (n.f & O && J(n), n.f & T)
      if (n.f ^= T, n === r)
        D(n, null, l);
      else {
        var M = f ? f.next : r;
        n === e.effect.last && (e.effect.last = n.prev), n.prev && (n.prev.next = n.next), n.next && (n.next.prev = n.prev), S(e, f, n), S(e, n, M), D(n, M, l), f = n, d = [], v = [], r = k(f.next);
        continue;
      }
    if (n !== r) {
      if (t !== void 0 && t.has(n)) {
        if (d.length < v.length) {
          var p = v[0], s;
          f = p.prev;
          var A = d[0], R = d[d.length - 1];
          for (s = 0; s < d.length; s += 1)
            D(d[s], p, l);
          for (s = 0; s < v.length; s += 1)
            t.delete(v[s]);
          S(e, A.prev, R.next), S(e, f, A), S(e, R, p), r = p, f = R, C -= 1, d = [], v = [];
        } else
          t.delete(n), D(n, r, l), S(e, n.prev, n.next), S(e, n, f === null ? e.effect.first : f.next), S(e, f, n), f = n;
        continue;
      }
      for (d = [], v = []; r !== null && r !== n; )
        (t ?? (t = /* @__PURE__ */ new Set())).add(r), v.push(r), r = k(r.next);
      if (r === null)
        continue;
    }
    n.f & T || d.push(n), f = n, r = k(n.next);
  }
  if (e.outrogroups !== null) {
    for (const g of e.outrogroups)
      g.pending.size === 0 && (L(e, V(g.done)), (E = e.outrogroups) == null || E.delete(g));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (r !== null || t !== void 0) {
    var _ = [];
    if (t !== void 0)
      for (n of t)
        n.f & O || _.push(n);
    for (; r !== null; )
      !(r.f & O) && r !== e.fallback && _.push(r), r = k(r.next);
    var N = _.length;
    if (N > 0) {
      var x = u === 0 ? l : null;
      Ee(e, _, x);
    }
  }
}
function Te(e, a, l, o, c, u, i, r) {
  var t = i & re ? i & fe ? X(l) : ae(l, !1, !1) : null, f = i & ie ? X(c) : null;
  return {
    v: t,
    i: f,
    e: Y(() => (u(a, t ?? l, f ?? c, r), () => {
      e.delete(o);
    }))
  };
}
function D(e, a, l) {
  if (e.nodes)
    for (var o = e.nodes.start, c = e.nodes.end, u = a && !(a.f & T) ? (
      /** @type {EffectNodes} */
      a.nodes.start
    ) : l; o !== null; ) {
      var i = (
        /** @type {TemplateNode} */
        _e(o)
      );
      if (u.before(o), o === c)
        return;
      o = i;
    }
}
function S(e, a, l) {
  a === null ? e.effect.first = l : a.next = l, l === null ? e.effect.last = a : l.prev = a;
}
export {
  Ne as e,
  Ce as i
};
