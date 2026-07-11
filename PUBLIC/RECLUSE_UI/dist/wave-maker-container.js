import { c as J, g as L, a as N, p as o, l as d, h as l, j as s, b as O, s as M, t as P, d as Q, e as R, m as i, f as U, i as k, n as r, r as z, o as c } from "./custom-element-DAaXFYsU.js";
import "./legacy-BIaJ2ujo.js";
import { s as A } from "./style-D6aGOzkX.js";
import { W as V } from "./wavetable-display-DqtS6K0E.js";
import { K as D } from "./knob-DWJt2HDv.js";
var X = U('<div class="rect svelte-1xdojat"><div class="section svelte-1xdojat"><!></div> <div class="section controls svelte-1xdojat"><!> <!></div></div>');
const Y = {
  hash: "svelte-1xdojat",
  code: `.rect.svelte-1xdojat
    {display:flex;gap:8px;padding:8px;box-sizing:border-box;background:var(--bg);border:2px solid var(--bd);}.section.svelte-1xdojat
    {flex:1;border:1px solid var(--section-bd);color:var(--section-fg);box-sizing:border-box;padding:4px 8px;display:flex;min-height:0;min-width:0;overflow:hidden;}.section.svelte-1xdojat:first-child
    {flex:2;border:1px solid var(--section-bd);color:var(--section-fg);}.section.svelte-1xdojat:last-child
    {flex:1;border:1px solid var(--section-bd);color:var(--section-fg);}.controls.svelte-1xdojat
    {align-items:center;justify-content:space-evenly;gap:16px;}`
};
function Z(F, t) {
  L(t, !1), N(F, Y);
  const m = i(), S = i(), W = i(), h = i(), T = i();
  let _ = o(t, "samples", 12, null), n = o(t, "width", 12, 400), x = o(t, "aspect", 12, 1.6), w = o(t, "color", 12, "#0A0009"), a = o(t, "border", 12, "#FF0551"), b = o(t, "topBorder", 12, ""), g = o(t, "bottomBorder", 12, ""), E = o(t, "topText", 12, ""), H = o(t, "bottomText", 12, ""), B = o(t, "topTextColor", 12, "#FB05A1"), y = o(t, "bottomTextColor", 12, "#4BE581"), j = o(
    t,
    "direction",
    12,
    "column"
    // 'column' = stacked, 'row' = side by side
  ), u = o(t, "amount", 12, 0.5), v = o(t, "skew", 12, 0.5);
  d(() => (l(n()), l(x())), () => {
    c(m, n() / x());
  }), d(() => (l(b()), l(a())), () => {
    c(S, b() || a());
  }), d(
    () => (l(g()), l(a())),
    () => {
      c(W, g() || a());
    }
  ), d(() => s(m), () => {
    c(h, (s(m) - 24) / 3);
  }), d(() => s(h), () => {
    c(T, Math.max(16, s(h) * 0.5));
  }), O();
  var q = {
    get samples() {
      return _();
    },
    set samples(e) {
      _(e), r();
    },
    get width() {
      return n();
    },
    set width(e) {
      n(e), r();
    },
    get aspect() {
      return x();
    },
    set aspect(e) {
      x(e), r();
    },
    get color() {
      return w();
    },
    set color(e) {
      w(e), r();
    },
    get border() {
      return a();
    },
    set border(e) {
      a(e), r();
    },
    get topBorder() {
      return b();
    },
    set topBorder(e) {
      b(e), r();
    },
    get bottomBorder() {
      return g();
    },
    set bottomBorder(e) {
      g(e), r();
    },
    get topText() {
      return E();
    },
    set topText(e) {
      E(e), r();
    },
    get bottomText() {
      return H();
    },
    set bottomText(e) {
      H(e), r();
    },
    get topTextColor() {
      return B();
    },
    set topTextColor(e) {
      B(e), r();
    },
    get bottomTextColor() {
      return y();
    },
    set bottomTextColor(e) {
      y(e), r();
    },
    get direction() {
      return j();
    },
    set direction(e) {
      j(e), r();
    },
    get amount() {
      return u();
    },
    set amount(e) {
      u(e), r();
    },
    get skew() {
      return v();
    },
    set skew(e) {
      v(e), r();
    }
  }, p = X(), f = k(p), G = k(f);
  V(G, {
    get samples() {
      return _();
    }
  }), z(f);
  var C = M(f, 2), K = k(C);
  D(K, {
    label: "Amount",
    get size() {
      return s(T);
    },
    get value() {
      return u();
    },
    set value(e) {
      u(e);
    },
    $$legacy: !0
  });
  var I = M(K, 2);
  return D(I, {
    label: "Skew",
    get size() {
      return s(T);
    },
    get value() {
      return v();
    },
    set value(e) {
      v(e);
    },
    $$legacy: !0
  }), z(C), z(p), P(() => {
    A(p, `width: ${n() ?? ""}px; height: ${s(m) ?? ""}px; flex-direction: ${j() ?? ""}; --bg: ${w() ?? ""}; --bd: ${a() ?? ""};`), A(f, `--section-bd: ${s(S) ?? ""}; --section-fg: ${B() ?? ""};`), A(C, `--section-bd: ${s(W) ?? ""}; --section-fg: ${y() ?? ""};`);
  }), Q(F, p), R(q);
}
customElements.define("wave-maker-container", J(
  Z,
  {
    samples: {},
    width: {},
    aspect: {},
    color: {},
    border: {},
    topBorder: {},
    bottomBorder: {},
    topText: {},
    bottomText: {},
    topTextColor: {},
    bottomTextColor: {},
    direction: {},
    amount: {},
    skew: {}
  },
  [],
  [],
  { mode: "open" }
));
