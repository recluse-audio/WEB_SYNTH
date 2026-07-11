import { q as R, c as X, g as q, a as A, p as n, s as C, t as D, j as a, k, y as g, x as G, d as L, e as Q, aQ as m, n as s, i as x, f as U, r as y } from "./custom-element-DAaXFYsU.js";
import { s as V } from "./style-D6aGOzkX.js";
var H = U('<div class="wrap svelte-11h6hyj"><span class="label svelte-11h6hyj"> </span> <div class="dial svelte-11h6hyj"></div> <span class="label svelte-11h6hyj"> </span></div>');
const J = {
  hash: "svelte-11h6hyj",
  code: `:host {display:inline-flex;}.wrap.svelte-11h6hyj {display:inline-flex;flex-direction:column;align-items:center;gap:4px;}.dial.svelte-11h6hyj
  {border-radius:50%;border:2px solid var(--bd);background:var(--bg);position:relative;cursor:ns-resize;touch-action:none;user-select:none;box-sizing:border-box;}.dial.svelte-11h6hyj::after
  {content:'';position:absolute;top:2px;left:50%;width:2px;height:38%;background:var(--color-accent, #f7cf64);transform:translateX(-50%);}.label.svelte-11h6hyj {font:12px/1 'BerlinSans', sans-serif;color:var(--color-text, #C4BFCC);}`
};
function O(_, t) {
  q(t, !0), A(_, J);
  let o = n(t, "value", 7, 0.5), i = n(t, "label", 7, ""), c = n(
    t,
    "size",
    7,
    48
    // dial diameter in px
  ), d = n(t, "color", 7, "var(--color-surface, #323539)"), u = n(t, "border", 7, "var(--color-border, #4BE581)");
  const B = (e, f) => t.$$host.dispatchEvent(new CustomEvent(e, { detail: f, bubbles: !0, composed: !0 }));
  let j = m(() => +c()), v = m(() => Number.isFinite(+o()) ? +o() : 0), Y = m(() => -135 + a(v) * 270), p = !1, P = 0, w = 0, l = null;
  const F = 200;
  function M(e) {
    p = !0, P = e.clientY, w = a(v), l = e.pointerId, e.currentTarget.setPointerCapture(e.pointerId);
  }
  function S(e) {
    if (!p || e.pointerId !== l) return;
    const f = P - e.clientY, z = Math.min(1, Math.max(0, w + f / F));
    o(z), B("change", { value: z });
  }
  function E(e) {
    e.pointerId === l && (p = !1, l = null, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId));
  }
  var T = {
    get value() {
      return o();
    },
    set value(e = 0.5) {
      o(e), s();
    },
    get label() {
      return i();
    },
    set label(e = "") {
      i(e), s();
    },
    get size() {
      return c();
    },
    set size(e = 48) {
      c(e), s();
    },
    get color() {
      return d();
    },
    set color(e = "var(--color-surface, #323539)") {
      d(e), s();
    },
    get border() {
      return u();
    },
    set border(e = "var(--color-border, #4BE581)") {
      u(e), s();
    }
  }, h = H(), b = x(h), K = x(b, !0);
  y(b);
  var r = C(b, 2), I = C(r, 2), N = x(I, !0);
  return y(I), y(h), D(
    (e) => {
      k(K, i()), V(r, `width: ${a(j) ?? ""}px; height: ${a(j) ?? ""}px; transform: rotate(${a(Y) ?? ""}deg); --bg: ${d() ?? ""}; --bd: ${u() ?? ""};`), k(N, e);
    },
    [() => a(v).toFixed(2)]
  ), g("pointerdown", r, M), g("pointermove", r, S), g("pointerup", r, E), G("pointercancel", r, E), L(_, h), Q(T);
}
R(["pointerdown", "pointermove", "pointerup"]);
customElements.define("recluse-knob", X(O, { value: {}, label: {}, size: {}, color: {}, border: {} }, [], [], { mode: "open" }));
export {
  O as K
};
