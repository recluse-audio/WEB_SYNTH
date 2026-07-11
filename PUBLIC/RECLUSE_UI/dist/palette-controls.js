import { aA as J, G as E, aw as K, B as Q, M as U, aB as X, aC as Y, c as Z, g as $, a as ee, p as te, t as T, j as r, x as g, d as D, e as oe, f as R, m as x, i as k, n as re, o as m, r as y, k as I, s as q } from "./custom-element-DAaXFYsU.js";
import "./legacy-BIaJ2ujo.js";
import { o as ae } from "./index-client-DEHk01t7.js";
import { e as ne, i as le } from "./each-DsVxvOSM.js";
import { r as ce, b as ie } from "./attributes-CMHZ5ruA.js";
import { b as P } from "./props-sUt8ZElc.js";
import { b as M } from "./this-DcbZchmD.js";
import { i as se } from "./lifecycle-3Q6hVaE9.js";
function j(t, o, d = !1) {
  if (t.multiple) {
    if (o == null)
      return;
    if (!U(o))
      return X();
    for (var l of t.options)
      l.selected = o.includes(f(l));
    return;
  }
  for (l of t.options) {
    var n = f(l);
    if (Y(n, o)) {
      l.selected = !0;
      return;
    }
  }
  (!d || o !== void 0) && (t.selectedIndex = -1);
}
function ue(t) {
  var o = new MutationObserver(() => {
    j(t, t.__value);
  });
  o.observe(t, {
    // Listen to option element changes
    childList: !0,
    subtree: !0,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: !0,
    attributeFilter: ["value"]
  }), Q(() => {
    o.disconnect();
  });
}
function de(t, o, d = o) {
  var l = /* @__PURE__ */ new WeakSet(), n = !0;
  J(t, "change", (i) => {
    var u = i ? "[selected]" : ":checked", s;
    if (t.multiple)
      s = [].map.call(t.querySelectorAll(u), f);
    else {
      var p = t.querySelector(u) ?? // will fall back to first non-disabled option if no option is selected
      t.querySelector("option:not([disabled])");
      s = p && f(p);
    }
    d(s), t.__value = s, E !== null && l.add(E);
  }), K(() => {
    var i = o();
    if (t === document.activeElement) {
      var u = (
        /** @type {Batch} */
        E
      );
      if (l.has(u))
        return;
    }
    if (j(t, i, n), n && i === void 0) {
      var s = t.querySelector(":checked");
      s !== null && (i = f(s), d(i));
    }
    t.__value = i, n = !1;
  }), ue(t);
}
function f(t) {
  return "__value" in t ? t.__value : t.value;
}
var pe = R("<option> </option>"), me = R('<div class="wrap svelte-1chqtzo"><select id="palette-switcher" class="svelte-1chqtzo"></select> <button id="palette-rotate" class="svelte-1chqtzo">rotate</button> <button id="palette-copy" class="svelte-1chqtzo"> </button> <input id="palette-color" type="color" class="svelte-1chqtzo"/></div>');
const ve = {
  hash: "svelte-1chqtzo",
  code: `:host {display:inline-block;}.wrap.svelte-1chqtzo {display:inline-flex;flex-direction:row;align-items:center;gap:6px;border:3px solid var(--color-border, #4BE5B1);border-radius:6px;padding:6px 10px;background-color:color-mix(in srgb, var(--color-surface, #0D3C76) 20%, transparent);}select.svelte-1chqtzo, button.svelte-1chqtzo {background:var(--color-surface, #0D3C76);color:var(--color-text, #C4BFCC);border:1px solid var(--color-border, #4BE5B1);border-radius:4px;padding:4px 8px;font-family:'BerlinSans', sans-serif;font-size:0.85em;cursor:pointer;}input[type="color"].svelte-1chqtzo {width:28px;height:28px;padding:0;border:1px solid var(--color-border, #4BE5B1);border-radius:4px;background:var(--color-surface, #0D3C76);cursor:pointer;}`
};
function fe(t, o) {
  $(o, !1), ee(t, ve);
  const d = [
    "original",
    "forest",
    "copperwood",
    "octobersky",
    "stoneflower",
    "northshoresummer",
    "chocolatecream",
    "chocolatestrawberry",
    "punchymustard"
  ], l = [
    "--color_0",
    "--color_1",
    "--color_2",
    "--color_3",
    "--color_4",
    "--color_5",
    "--color_6",
    "--color_7"
  ];
  let n = x(""), i = x("copy"), u = te(o, "color", 12, "#800000"), s = x(), p = x();
  function F(e) {
    u(e.target.value), r(s).dispatchEvent(new CustomEvent("palette-color:change", { detail: { color: u() }, bubbles: !0, composed: !0 }));
  }
  function z() {
    if (r(p))
      try {
        r(p).showPicker();
      } catch {
        r(p).click();
      }
  }
  ae(() => {
    const e = document.documentElement;
    m(n, e.getAttribute("data-color-palette") || "");
  });
  function B() {
    const e = getComputedStyle(document.documentElement);
    return l.map((a) => e.getPropertyValue(a).trim());
  }
  function N() {
    l.forEach((e) => document.documentElement.style.removeProperty(e));
  }
  function S(e) {
    var a;
    N(), m(n, e), r(n) ? document.documentElement.setAttribute("data-color-palette", r(n)) : document.documentElement.removeAttribute("data-color-palette"), (a = window.RecluseAuth) == null || a.setColorPalette(r(n) || "original");
  }
  function G(e) {
    S(e.target.value);
  }
  function A() {
    const e = r(n) || "original", a = d.indexOf(e), c = d[(a + 1) % d.length];
    S(c === "original" ? "" : c);
  }
  function w() {
    const e = B();
    e.push(e.shift()), e.push(e.shift()), l.forEach((a, c) => document.documentElement.style.setProperty(a, e[c]));
  }
  async function V() {
    const e = B(), a = `[data-color-palette="my-palette"] {
` + l.map((c, C) => `  ${c}: ${e[C]};`).join(`
`) + `
}`;
    await navigator.clipboard.writeText(a), m(i, "copied!"), setTimeout(() => m(i, "copy"), 1500);
  }
  var W = {
    openColorPicker: z,
    nextPalette: A,
    rotate: w,
    get color() {
      return u();
    },
    set color(e) {
      u(e), re();
    }
  };
  se();
  var _ = me(), v = k(_);
  ne(v, 5, () => d, le, (e, a) => {
    var c = pe(), C = k(c, !0);
    y(c);
    var O = {};
    T(() => {
      I(C, r(a)), O !== (O = r(a) === "original" ? "" : r(a)) && (c.value = (c.__value = r(a) === "original" ? "" : r(a)) ?? "");
    }), D(e, c);
  }), y(v);
  var L = q(v, 2), b = q(L, 2), H = k(b, !0);
  y(b);
  var h = q(b, 2);
  return ce(h), M(h, (e) => m(p, e), () => r(p)), y(_), M(_, (e) => m(s, e), () => r(s)), T(() => {
    I(H, r(i)), ie(h, u());
  }), de(v, () => r(n), (e) => m(n, e)), g("change", v, G), g("click", L, w), g("click", b, V), g("input", h, F), D(t, _), P(o, "openColorPicker", z), P(o, "nextPalette", A), P(o, "rotate", w), oe(W);
}
customElements.define("recluse-palette-controls", Z(fe, { color: {} }, [], ["openColorPicker", "nextPalette", "rotate"], { mode: "open" }));
