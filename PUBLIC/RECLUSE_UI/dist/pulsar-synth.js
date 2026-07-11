import { q as Q, c as T, g as V, a as X, p as r, u as I, v as Y, w as Z, s as h, i as y, t as i, x as v, y as J, d as $, e as ee, f as te, j as a, n as o, r as f } from "./custom-element-DAaXFYsU.js";
import { s as t } from "./attributes-CMHZ5ruA.js";
import { s as se } from "./style-D6aGOzkX.js";
import { b as ae } from "./this-DcbZchmD.js";
import "./wavetable-display-DqtS6K0E.js";
import "./stochastic-slider.js";
var ie = te('<div class="root svelte-8h29j4"><div class="title-row svelte-8h29j4"><h3 class="svelte-8h29j4">PULSARELLO</h3></div> <div class="stage svelte-8h29j4"><div class="col svelte-8h29j4"><recluse-stochastic-slider></recluse-stochastic-slider> <recluse-stochastic-slider></recluse-stochastic-slider></div> <div class="center-box svelte-8h29j4"><button part="start" class="svelte-8h29j4">Start</button> <button part="stop" class="svelte-8h29j4">Stop</button></div> <div class="col svelte-8h29j4"><recluse-stochastic-slider></recluse-stochastic-slider> <recluse-stochastic-slider></recluse-stochastic-slider></div></div> <div class="display-row svelte-8h29j4"><recluse-wavetable-display></recluse-wavetable-display></div></div>', 2);
const ne = {
  hash: "svelte-8h29j4",
  code: `:host
  {display:inline-block;width:100%;

    /* Default design width; consumers may override on the host to re-cap. */--rd-width: 520px;}.root.svelte-8h29j4
  {--rd-radius: 8px;--rd-pad:    12px;display:block;width:100%;max-width:var(--rd-width);font-family:'BerlinSans', ui-sans-serif, system-ui, sans-serif;color:var(--color-text, #e8e8e8);background:var(--color-surface, #1a1a1a);border:1px solid var(--color-border, #2a2a2a);border-radius:var(--rd-radius);padding:8px var(--rd-pad) var(--rd-pad);box-sizing:border-box;}.title-row.svelte-8h29j4
  {text-align:center;margin-bottom:8px;}h3.svelte-8h29j4
  {display:inline-block;margin:0;padding:12px 24px;font-size:14px;font-weight:600;letter-spacing:0.1em;color:var(--color-accent, #ff6b00);border:1px solid var(--color-border, #2a2a2a);border-radius:4px;background:var(--color-bg, transparent);}.stage.svelte-8h29j4
  {display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:8px;}.col.svelte-8h29j4
  {display:flex;gap:16px;align-items:flex-start;}.center-box.svelte-8h29j4
  {display:flex;flex-direction:column;gap:10px;align-items:stretch;padding:16px;border-radius:6px;background:var(--color-panel, #0D3C76);border:1px solid var(--color-accent, #f7cf64);}.display-row.svelte-8h29j4
  {margin-top:8px;}button.svelte-8h29j4
  {background:var(--color-accent, #ff6b00);color:var(--color-bg, #000);border:0;border-radius:4px;padding:6px 12px;font:inherit;cursor:pointer;}button[disabled].svelte-8h29j4
  {opacity:0.5;cursor:default;}`
};
function re(O, n) {
  V(n, !0), X(O, ne);
  let b = r(n, "emission", 7, 0.066), x = r(n, "formant", 7, 0.157), w = r(n, "wavePos", 7, 0), _ = r(n, "amp", 7, 1), k = r(n, "emissionDensity", 7, 0.5), S = r(n, "formantDensity", 7, 0.5), E = r(n, "wavePosDensity", 7, 0.5), L = r(n, "ampDensity", 7, 0.5), p = r(n, "running", 7, !1), z = r(n, "samples", 7, null), A = r(n, "active", 7, !0), g;
  I(() => {
    g && (g.samples = z());
  }), I(() => {
    g && (g.active = A());
  });
  let s = Y(Z({
    emission: {
      min: +b(),
      center: +b(),
      max: +b(),
      density: +k()
    },
    formant: {
      min: +x(),
      center: +x(),
      max: +x(),
      density: +S()
    },
    wavePos: {
      min: +w(),
      center: +w(),
      max: +w(),
      density: +E()
    },
    amp: {
      min: +_(),
      center: +_(),
      max: +_(),
      density: +L()
    }
  }));
  const D = (e, u) => n.$$host.dispatchEvent(new CustomEvent(e, { detail: u, bubbles: !0, composed: !0 }));
  function j(e, u) {
    a(s)[e].min = u.min, a(s)[e].center = u.center, a(s)[e].max = u.max, D("paramchange", { param: e, ...a(s)[e] });
  }
  function P(e, u) {
    a(s)[e].density = u.density, D("paramchange", { param: e, ...a(s)[e] });
  }
  const K = () => {
    p(!0), D("start");
  }, M = () => {
    p(!1), D("stop");
  };
  var N = {
    get emission() {
      return b();
    },
    set emission(e = 0.066) {
      b(e), o();
    },
    get formant() {
      return x();
    },
    set formant(e = 0.157) {
      x(e), o();
    },
    get wavePos() {
      return w();
    },
    set wavePos(e = 0) {
      w(e), o();
    },
    get amp() {
      return _();
    },
    set amp(e = 1) {
      _(e), o();
    },
    get emissionDensity() {
      return k();
    },
    set emissionDensity(e = 0.5) {
      k(e), o();
    },
    get formantDensity() {
      return S();
    },
    set formantDensity(e = 0.5) {
      S(e), o();
    },
    get wavePosDensity() {
      return E();
    },
    set wavePosDensity(e = 0.5) {
      E(e), o();
    },
    get ampDensity() {
      return L();
    },
    set ampDensity(e = 0.5) {
      L(e), o();
    },
    get running() {
      return p();
    },
    set running(e = !1) {
      p(e), o();
    },
    get samples() {
      return z();
    },
    set samples(e = null) {
      z(e), o();
    },
    get active() {
      return A();
    },
    set active(e = !0) {
      A(e), o();
    }
  }, C = ie(), R = h(y(C), 2), q = y(R), l = y(q);
  t(l, "label", "Emission"), t(l, "width", 56), t(l, "height", 180), i(() => t(l, "min", a(s).emission.min)), i(() => t(l, "center", a(s).emission.center)), i(() => t(l, "max", a(s).emission.max)), i(() => t(l, "density", a(s).emission.density));
  var d = h(l, 2);
  t(d, "label", "Formant"), t(d, "width", 56), t(d, "height", 180), i(() => t(d, "min", a(s).formant.min)), i(() => t(d, "center", a(s).formant.center)), i(() => t(d, "max", a(s).formant.max)), i(() => t(d, "density", a(s).formant.density)), f(q);
  var B = h(q, 2), F = y(B), U = h(F, 2);
  f(B);
  var W = h(B, 2), c = y(W);
  t(c, "label", "Wave Pos"), t(c, "width", 56), t(c, "height", 180), i(() => t(c, "min", a(s).wavePos.min)), i(() => t(c, "center", a(s).wavePos.center)), i(() => t(c, "max", a(s).wavePos.max)), i(() => t(c, "density", a(s).wavePos.density));
  var m = h(c, 2);
  t(m, "label", "Amp"), t(m, "width", 56), t(m, "height", 180), i(() => t(m, "min", a(s).amp.min)), i(() => t(m, "center", a(s).amp.center)), i(() => t(m, "max", a(s).amp.max)), i(() => t(m, "density", a(s).amp.density)), f(W), f(R);
  var G = h(R, 2), H = y(G);
  return se(H, "width:100%; height:120px; display:block;"), ae(H, (e) => g = e, () => g), f(G), f(C), i(() => {
    F.disabled = p(), U.disabled = !p();
  }), v("rangechange", l, (e) => j("emission", e.detail)), v("densitychange", l, (e) => P("emission", e.detail)), v("rangechange", d, (e) => j("formant", e.detail)), v("densitychange", d, (e) => P("formant", e.detail)), J("click", F, K), J("click", U, M), v("rangechange", c, (e) => j("wavePos", e.detail)), v("densitychange", c, (e) => P("wavePos", e.detail)), v("rangechange", m, (e) => j("amp", e.detail)), v("densitychange", m, (e) => P("amp", e.detail)), $(O, C), ee(N);
}
Q(["click"]);
customElements.define("recluse-pulsar-synth", T(
  re,
  {
    emission: {},
    formant: {},
    wavePos: {},
    amp: {},
    emissionDensity: {},
    formantDensity: {},
    wavePosDensity: {},
    ampDensity: {},
    running: {},
    samples: {},
    active: {}
  },
  [],
  [],
  { mode: "open" }
));
