import { c as R, g as A, a as V, p as _, j as t, l as z, h as k, b as j, d as O, e as X, aM as W, m as M, f as Y, i as q, n as C, o as P, r as F } from "./custom-element-DAaXFYsU.js";
import "./legacy-BIaJ2ujo.js";
import { o as G, a as I } from "./index-client-DEHk01t7.js";
import { b as T } from "./this-DcbZchmD.js";
import { i as J } from "./lifecycle-3Q6hVaE9.js";
var K = Y('<div class="wrap svelte-161zzfw"><canvas class="svelte-161zzfw"></canvas></div>');
const L = {
  hash: "svelte-161zzfw",
  code: `:host {display:block;}.wrap.svelte-161zzfw
  {width:100%;height:100%;min-width:120px;min-height:60px;background:var(--color-surface, #0D3C76);border:1px solid var(--color-border, #4BE5B1);border-radius:var(--radius-sm, 4px);box-sizing:border-box;}canvas.svelte-161zzfw
  {display:block;width:100%;height:100%;}`
};
function N(v, f) {
  A(f, !1), V(v, L);
  let o = _(f, "samples", 12, null), i = _(f, "active", 12, !0), s = M(), r = M(), d;
  function p() {
    if (!t(s) || !t(r)) return;
    const a = window.devicePixelRatio || 1, l = t(r).clientWidth, n = t(r).clientHeight;
    if (l === 0 || n === 0) return;
    W(s, t(s).width = Math.round(l * a)), W(s, t(s).height = Math.round(n * a));
    const e = t(s).getContext("2d");
    e.setTransform(a, 0, 0, a, 0, 0), e.clearRect(0, 0, l, n);
    const u = getComputedStyle(t(s)), D = u.getPropertyValue("--color-border").trim() || "#4BE5B1", E = u.getPropertyValue("--color-accent").trim() || "#f7cf64";
    if (e.save(), e.globalAlpha = 0.35, e.strokeStyle = D, e.lineWidth = 1, e.beginPath(), e.moveTo(0, n / 2), e.lineTo(l, n / 2), e.stroke(), e.restore(), !o() || o().length === 0) return;
    const g = 1, b = 3, w = Math.max(0, l - g * 2), H = Math.max(0, n - b * 2), h = o().length;
    e.save(), e.globalAlpha = i() ? 1 : 0.18, e.beginPath();
    for (let c = 0; c < h; c++) {
      const y = g + (h === 1 ? w / 2 : c / (h - 1) * w), x = b + (1 - (o()[c] + 1) / 2) * H;
      c === 0 ? e.moveTo(y, x) : e.lineTo(y, x);
    }
    e.lineWidth = 1.5, e.strokeStyle = E, e.stroke(), e.restore();
  }
  G(() => {
    d = new ResizeObserver(() => p()), d.observe(t(r)), p();
  }), I(() => {
    d && d.disconnect();
  }), z(() => (k(o()), t(s)), () => {
    o() !== void 0 && t(s) && p();
  }), z(() => (k(i()), t(s)), () => {
    i() !== void 0 && t(s) && p();
  }), j();
  var B = {
    get samples() {
      return o();
    },
    set samples(a) {
      o(a), C();
    },
    get active() {
      return i();
    },
    set active(a) {
      i(a), C();
    }
  };
  J();
  var m = K(), S = q(m);
  return T(S, (a) => P(s, a), () => t(s)), F(m), T(m, (a) => P(r, a), () => t(r)), O(v, m), X(B);
}
customElements.define("recluse-wavetable-display", R(N, { samples: {}, active: {} }, [], [], { mode: "open" }));
export {
  N as W
};
