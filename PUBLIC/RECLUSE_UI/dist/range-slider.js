import { q as $e, c as _e, g as Me, a as Ce, p as d, v as L, w as Q, t as le, j as t, y as k, x as Pe, d as oe, e as Be, f as ve, s as h, aQ as c, i as f, n as g, r as x, o as W, k as Ee } from "./custom-element-DAaXFYsU.js";
import { i as Ie } from "./if-CrMZpu86.js";
import { a as p } from "./attributes-CMHZ5ruA.js";
import { s as m } from "./style-D6aGOzkX.js";
import { b as Re } from "./this-DcbZchmD.js";
var Ae = ve('<span class="label svelte-1pcqsuv"> </span>'), Oe = ve('<div class="wrap svelte-1pcqsuv"><!> <div class="track svelte-1pcqsuv"><div class="area svelte-1pcqsuv"><div class="fill svelte-1pcqsuv"></div> <svg class="mark max svelte-1pcqsuv" preserveAspectRatio="none"><polyline class="svelte-1pcqsuv"></polyline></svg> <svg class="mark min svelte-1pcqsuv" preserveAspectRatio="none"><polyline class="svelte-1pcqsuv"></polyline></svg> <svg class="mark center svelte-1pcqsuv" preserveAspectRatio="none"><polyline class="svelte-1pcqsuv"></polyline></svg> <div class="thumb max svelte-1pcqsuv"></div> <div class="thumb center svelte-1pcqsuv"></div> <div class="thumb min svelte-1pcqsuv"></div></div></div></div>');
const ze = {
  hash: "svelte-1pcqsuv",
  code: `:host {display:inline-flex;}.wrap.svelte-1pcqsuv {display:inline-flex;flex-direction:column;align-items:center;gap:4px;}.track.svelte-1pcqsuv {position:relative;box-sizing:border-box;background:var(--color-surface, #0D3C76);border:2px solid var(--color-border, #4BE581);cursor:ns-resize;touch-action:none;user-select:none;}.area.svelte-1pcqsuv {position:absolute;inset:0;            /* exactly the content area, inside the border */}.fill.svelte-1pcqsuv {position:absolute;left:0;right:0;background:var(--color-border, #4BE581);pointer-events:none;}
  /* marks: a mostly-flat line with a small chevron notch (SVG polyline).
     baseline (y=AMP) is the svg's vertical center, aligned to the value line. */.mark.svelte-1pcqsuv {position:absolute;left:0;right:0;width:100%;transform:translateY(-50%);pointer-events:none;overflow:visible;}.mark.svelte-1pcqsuv polyline:where(.svelte-1pcqsuv) {fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke;}.mark.min.svelte-1pcqsuv polyline:where(.svelte-1pcqsuv), .mark.max.svelte-1pcqsuv polyline:where(.svelte-1pcqsuv) {stroke:var(--color-text, #C4BFCC);}.mark.center.svelte-1pcqsuv polyline:where(.svelte-1pcqsuv) {stroke:var(--color-accent, #f7cf64);}

  /* grab thumbs: transparent hit zones. distinct x zones (right / left /
     middle) so each handle stays grabbable even when stacked at one value. */.thumb.svelte-1pcqsuv {position:absolute;width:30%;height:16px;transform:translateY(-50%);cursor:ns-resize;touch-action:none;}.thumb.max.svelte-1pcqsuv  {right:2px;}.thumb.min.svelte-1pcqsuv  {left:2px;}.thumb.center.svelte-1pcqsuv {left:50%;transform:translate(-50%, -50%);}.label.svelte-1pcqsuv {font:12px/1 'BerlinSans', sans-serif;color:var(--color-text, #C4BFCC);}`
};
function De(J, l) {
  Me(l, !0), Ce(J, ze);
  let _ = d(l, "width", 7, 48), M = d(l, "height", 7, 200), C = d(l, "min", 7, 0.5), b = d(l, "center", 7, 0.5), P = d(l, "max", 7, 0.5), B = d(l, "label", 7, ""), S = d(
    l,
    "fillOpacity",
    7,
    0.25
    // 0..1, driven by density
  );
  const ce = (e, s) => l.$$host.dispatchEvent(new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })), r = (e) => Math.min(1, Math.max(0, Number.isFinite(+e) ? +e : 0));
  let o = L(Q(r(b()))), H = L(Q(
    Math.max(0, r(P()) - r(b()))
    // remembered max - center
  )), T = L(Q(
    Math.max(0, r(b()) - r(C()))
    // remembered center - min
  )), K = c(() => r(t(o))), $ = c(() => r(t(o) + t(H))), E = c(() => r(t(o) - t(T))), I, R = null, A = null;
  const a = 4, O = 2 * a, V = 2, Y = 1;
  let pe = c(() => +M()), X = c(() => Math.max(0, t(pe) - 2 * V)), n = c(() => Math.max(0, +_() - 2 * V)), j = c(() => Math.max(0, t(X) - 2 * Y));
  const v = (e) => Y + (1 - e) * t(j), Z = (e) => `0,${a} ${e},${a}`;
  let ue = c(() => v(t($)) >= a ? `0,${a} ${0.8 * t(n)},${a} ${0.85 * t(n)},0 ${0.9 * t(n)},${a} ${t(n)},${a}` : Z(t(n))), me = c(() => t(X) - v(t(E)) >= a ? `0,${a} ${0.1 * t(n)},${a} ${0.15 * t(n)},${O} ${0.2 * t(n)},${a} ${t(n)},${a}` : Z(t(n)));
  function ee(e) {
    const s = I.getBoundingClientRect(), i = 1 - (e.clientY - s.top - V - Y) / t(j);
    return Math.min(1, Math.max(0, i));
  }
  function te(e, s) {
    e === "min" ? W(T, Math.max(0, t(o) - s), !0) : e === "max" ? W(H, Math.max(0, s - t(o)), !0) : W(o, s, !0);
    const i = r(t(o)), D = r(t(o) + t(H)), F = r(t(o) - t(T));
    C(F), b(i), P(D), ce("change", { min: F, center: i, max: D, handle: e });
  }
  function z(e, s, i) {
    s.stopPropagation(), R = e, A = s.pointerId, I.setPointerCapture(s.pointerId), i && te(e, ee(s));
  }
  const de = (e) => z("center", e, !0);
  function he(e) {
    !R || e.pointerId !== A || te(R, ee(e));
  }
  function se(e) {
    e.pointerId === A && (R = null, A = null, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId));
  }
  var fe = {
    get width() {
      return _();
    },
    set width(e = 48) {
      _(e), g();
    },
    get height() {
      return M();
    },
    set height(e = 200) {
      M(e), g();
    },
    get min() {
      return C();
    },
    set min(e = 0.5) {
      C(e), g();
    },
    get center() {
      return b();
    },
    set center(e = 0.5) {
      b(e), g();
    },
    get max() {
      return P();
    },
    set max(e = 0.5) {
      P(e), g();
    },
    get label() {
      return B();
    },
    set label(e = "") {
      B(e), g();
    },
    get fillOpacity() {
      return S();
    },
    set fillOpacity(e = 0.25) {
      S(e), g();
    }
  }, G = Oe(), ne = f(G);
  {
    var ge = (e) => {
      var s = Ae(), i = f(s, !0);
      x(s), le(() => Ee(i, B())), oe(e, s);
    };
    Ie(ne, (e) => {
      B() && e(ge);
    });
  }
  var u = h(ne, 2), ae = f(u), re = f(ae), q = h(re, 2);
  p(q, "height", O);
  var xe = f(q);
  x(q);
  var y = h(q, 2);
  p(y, "height", O);
  var be = f(y);
  x(y);
  var w = h(y, 2);
  p(w, "height", O);
  var qe = f(w);
  x(w);
  var N = h(w, 2), U = h(N, 2), ie = h(U, 2);
  return x(ae), x(u), Re(u, (e) => I = e, () => I), x(G), le(
    (e, s, i, D, F, ye, we, ke) => {
      m(u, `width: ${_() ?? ""}px; height: ${M() ?? ""}px;`), m(re, `top: ${e ?? ""}px; height: ${(t($) - t(E)) * t(j)}px; opacity: ${s ?? ""};`), p(q, "viewBox", `0 0 ${t(n) ?? ""} 8`), m(q, `top: ${i ?? ""}px;`), p(xe, "points", t(ue)), p(y, "viewBox", `0 0 ${t(n) ?? ""} 8`), m(y, `top: ${D ?? ""}px;`), p(be, "points", t(me)), p(w, "viewBox", `0 0 ${t(n) ?? ""} 8`), m(w, `top: ${F ?? ""}px;`), p(qe, "points", `0,4 ${t(n) ?? ""},4`), m(N, `top: ${ye ?? ""}px;`), m(U, `top: ${we ?? ""}px;`), m(ie, `top: ${ke ?? ""}px;`);
    },
    [
      () => v(t($)),
      () => r(S()),
      () => v(t($)),
      () => v(t(E)),
      () => v(t(K)),
      () => v(t($)),
      () => v(t(K)),
      () => v(t(E))
    ]
  ), k("pointerdown", u, de), k("pointermove", u, he), k("pointerup", u, se), Pe("pointercancel", u, se), k("pointerdown", N, (e) => z("max", e, !1)), k("pointerdown", U, (e) => z("center", e, !1)), k("pointerdown", ie, (e) => z("min", e, !1)), oe(J, G), Be(fe);
}
$e(["pointerdown", "pointermove", "pointerup"]);
customElements.define("recluse-range-slider", _e(
  De,
  {
    width: {},
    height: {},
    min: {},
    center: {},
    max: {},
    label: {},
    fillOpacity: {}
  },
  [],
  [],
  { mode: "open" }
));
