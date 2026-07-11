import { q as m, c as h, g as x, a as _, p as c, s as k, i as d, t as y, y as B, d as C, e as E, f as w, n as i, r as v, k as S } from "./custom-element-DAaXFYsU.js";
import { a as q } from "./attributes-CMHZ5ruA.js";
import { s as D } from "./class-fIUYqVN4.js";
var F = w('<button><span class="dot svelte-1l3vdsv"></span> <span class="label"> </span></button>');
const R = {
  hash: "svelte-1l3vdsv",
  code: `:host {display:inline-flex;}.toggle.svelte-1l3vdsv {display:inline-flex;align-items:center;gap:6px;padding:4px 8px;background:var(--color-surface, #0D3C76);border:1px solid var(--color-border, #4BE5B1);border-radius:var(--radius-sm, 4px);cursor:pointer;font:12px/1 'BerlinSans', sans-serif;color:var(--color-text, #C4BFCC);}.dot.svelte-1l3vdsv {width:8px;height:8px;border-radius:50%;background:var(--color-border, #4BE5B1);transition:background 80ms linear;}

  /* '.on' is what is toggled by 'class:on' */.toggle.on.svelte-1l3vdsv .dot:where(.svelte-1l3vdsv) {background:var(--color-accent, #f7cf64);}.toggle.on.svelte-1l3vdsv {border-color:var(--color-accent, #f7cf64);}`
};
function j(o, t) {
  x(t, !0), _(o, R);
  let l = c(t, "on", 7, !1), a = c(t, "label", 7, "");
  const p = (s, f) => t.$$host.dispatchEvent(new CustomEvent(s, { detail: f, bubbles: !0, composed: !0 }));
  function u() {
    p("toggle");
  }
  var g = {
    get on() {
      return l();
    },
    set on(s = !1) {
      l(s), i();
    },
    get label() {
      return a();
    },
    set label(s = "") {
      a(s), i();
    }
  }, e = F();
  let r;
  var n = k(d(e), 2), b = d(n, !0);
  return v(n), v(e), y(() => {
    r = D(e, 1, "toggle svelte-1l3vdsv", null, r, { on: l() }), q(e, "aria-pressed", l()), S(b, a());
  }), B("click", e, u), C(o, e), E(g);
}
m(["click"]);
customElements.define("recluse-toggle", h(j, { on: {}, label: {} }, [], [], { mode: "open" }));
