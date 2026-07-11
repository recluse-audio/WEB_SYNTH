import { q as _, c as g, g as h, a as k, p as n, t as y, y as j, d as z, e as B, f as E, n as l, i as d, r as u, k as C } from "./custom-element-DAaXFYsU.js";
import { a as S } from "./attributes-CMHZ5ruA.js";
import { s as q } from "./class-fIUYqVN4.js";
import { s as w } from "./style-D6aGOzkX.js";
var R = E('<button><span class="label"> </span></button>');
const A = {
  hash: "svelte-jm1zdm",
  code: `:host {display:inline-block;}.component.svelte-jm1zdm
  {padding:8px 16px;border:1px solid var(--color-border, #4B35B1);border-radius:4px;color:var(--color-text, #fff);font:14px 'BerlinSans', sans-serif;cursor:pointer;}`
};
function D(c, s) {
  h(s, !0), k(c, A);
  let o = n(s, "on", 7, !1), r = n(s, "text", 7, ""), a = n(s, "color", 7, "");
  const i = (t, v) => s.$$host.dispatchEvent(new CustomEvent(t, { detail: v, bubbles: !0, composed: !0 }));
  function f() {
    i("toggle");
  }
  var x = {
    get on() {
      return o();
    },
    set on(t = !1) {
      o(t), l();
    },
    get text() {
      return r();
    },
    set text(t = "") {
      r(t), l();
    },
    get color() {
      return a();
    },
    set color(t = "") {
      a(t), l();
    }
  }, e = R();
  let m;
  var p = d(e), b = d(p, !0);
  return u(p), u(e), y(() => {
    m = q(e, 1, "component svelte-jm1zdm", null, m, { on: o() }), S(e, "aria-pressed", o()), w(e, `background: ${a() ?? ""}`), C(b, r());
  }), j("click", e, f), z(c, e), B(x);
}
_(["click"]);
customElements.define("recluse-component", g(D, { on: {}, text: {}, color: {} }, [], [], { mode: "open" }));
