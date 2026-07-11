import { c as z, g as k, a as C, p as i, u as v, j as t, s as f, x, d as j, e as D, v as b, f as R, i as S, n as d, o as _, r as q } from "./custom-element-DAaXFYsU.js";
import { b as h } from "./this-DcbZchmD.js";
import "./recluse-toggle.js";
import "./recluse-text-input.js";
import "./recluse-component.js";
var A = R('<div class="debug-panel svelte-1fwzman"><recluse-toggle></recluse-toggle> <recluse-text-input></recluse-text-input> <recluse-component></recluse-component></div>', 2);
const B = {
  hash: "svelte-1fwzman",
  code: `:host {display:inline-block;}.debug-panel.svelte-1fwzman
  {display:flex;gap:7px;align-items:center;padding:5px;background:var(--color-surface, #0D3C76);border-radius:5px;}`
};
function F(p, s) {
  k(s, !0), C(p, B);
  let a = i(s, "on", 7, !1), n = i(s, "text", 7, ""), r = i(s, "color", 7, ""), l = b(void 0), o = b(void 0);
  const m = (e, w) => s.$$host.dispatchEvent(new CustomEvent(e, { detail: w, bubbles: !0, composed: !0 }));
  v(() => {
    t(l) && (t(l).on = a());
  }), v(() => {
    t(o) && (t(o).text = n(), t(o).color = r());
  });
  var y = {
    get on() {
      return a();
    },
    set on(e = !1) {
      a(e), d();
    },
    get text() {
      return n();
    },
    set text(e = "") {
      n(e), d();
    },
    get color() {
      return r();
    },
    set color(e = "") {
      r(e), d();
    }
  }, c = A(), u = S(c);
  h(u, (e) => _(l, e), () => t(l));
  var g = f(u, 2), E = f(g, 2);
  return h(E, (e) => _(o, e), () => t(o)), q(c), x("toggle", u, () => m("toggle")), x("command", g, (e) => m("command", e.detail)), j(p, c), D(y);
}
customElements.define("recluse-debug-panel", z(F, { on: {}, text: {}, color: {} }, [], [], { mode: "open" }));
