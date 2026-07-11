import { ap as d, aq as g, u as i, ar as l, as as m, at as b, j as p, h, au as v } from "./custom-element-DAaXFYsU.js";
function x(n = !1) {
  const s = (
    /** @type {ComponentContextLegacy} */
    d
  ), e = s.l.u;
  if (!e) return;
  let r = () => h(s.s);
  if (n) {
    let a = 0, t = (
      /** @type {Record<string, any>} */
      {}
    );
    const _ = v(() => {
      let c = !1;
      const f = s.s;
      for (const o in f)
        f[o] !== t[o] && (t[o] = f[o], c = !0);
      return c && a++, a;
    });
    r = () => p(_);
  }
  e.b.length && g(() => {
    u(s, r), l(e.b);
  }), i(() => {
    const a = m(() => e.m.map(b));
    return () => {
      for (const t of a)
        typeof t == "function" && t();
    };
  }), e.a.length && i(() => {
    u(s, r), l(e.a);
  });
}
function u(n, s) {
  if (n.l.s)
    for (const e of n.l.s) p(e);
  s();
}
export {
  x as i
};
