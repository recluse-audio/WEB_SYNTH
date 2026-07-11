import { q, c as F, g as K, a as Q, p as i, s as y, t, y as _, d as w, e as R, f as C, i as z, n as l, r as k, k as A, j as D, aQ as G } from "./custom-element-DAaXFYsU.js";
import { i as H } from "./if-CrMZpu86.js";
import { s } from "./attributes-CMHZ5ruA.js";
import { s as I } from "./style-D6aGOzkX.js";
import "./range-slider.js";
import "./knob-DWJt2HDv.js";
var J = C('<span class="label svelte-161s2az"> </span>'), L = C('<div class="wrap svelte-161s2az"><!> <recluse-range-slider></recluse-range-slider> <recluse-knob></recluse-knob></div>', 2);
const N = {
  hash: "svelte-161s2az",
  code: ":host {display:inline-flex;}.wrap.svelte-161s2az {display:inline-flex;flex-direction:column;align-items:center;gap:6px;}.label.svelte-161s2az {font:12px/1 'BerlinSans', sans-serif;color:var(--color-text, #C4BFCC);}"
};
function P(p, a) {
  K(a, !0), Q(p, N);
  let c = i(
    a,
    "width",
    7,
    48
    // shared width of slider + knob
  ), f = i(
    a,
    "height",
    7,
    200
    // slider track height
  ), o = i(a, "label", 7, ""), m = i(a, "min", 7, 0.5), h = i(a, "center", 7, 0.5), u = i(a, "max", 7, 0.5), r = i(a, "density", 7, 0.5);
  const x = (e, d) => a.$$host.dispatchEvent(new CustomEvent(e, { detail: d, bubbles: !0, composed: !0 }));
  let S = G(() => 0.1 + 0.9 * Math.min(1, Math.max(0, +r())));
  function E(e) {
    m(e.detail.min), h(e.detail.center), u(e.detail.max), x("rangechange", e.detail);
  }
  function B(e) {
    r(+e.detail.value), x("densitychange", { density: r() });
  }
  var M = {
    get width() {
      return c();
    },
    set width(e = 48) {
      c(e), l();
    },
    get height() {
      return f();
    },
    set height(e = 200) {
      f(e), l();
    },
    get label() {
      return o();
    },
    set label(e = "") {
      o(e), l();
    },
    get min() {
      return m();
    },
    set min(e = 0.5) {
      m(e), l();
    },
    get center() {
      return h();
    },
    set center(e = 0.5) {
      h(e), l();
    },
    get max() {
      return u();
    },
    set max(e = 0.5) {
      u(e), l();
    },
    get density() {
      return r();
    },
    set density(e = 0.5) {
      r(e), l();
    }
  }, g = L(), b = z(g);
  {
    var O = (e) => {
      var d = J(), j = z(d, !0);
      k(d), t(() => A(j, o())), w(e, d);
    };
    H(b, (e) => {
      o() && e(O);
    });
  }
  var n = y(b, 2);
  t(() => s(n, "width", c())), t(() => s(n, "height", f())), t(() => s(n, "min", m())), t(() => s(n, "center", h())), t(() => s(n, "max", u())), t(() => s(n, "fillOpacity", D(S)));
  var v = y(n, 2);
  return t(() => s(v, "size", c())), t(() => s(v, "value", r())), s(v, "label", "density"), k(g), t(() => I(g, `width: ${c() ?? ""}px;`)), _("change", n, E), _("change", v, B), w(p, g), R(M);
}
q(["change"]);
customElements.define("recluse-stochastic-slider", F(
  P,
  {
    width: {},
    height: {},
    label: {},
    min: {},
    center: {},
    max: {},
    density: {}
  },
  [],
  [],
  { mode: "open" }
));
