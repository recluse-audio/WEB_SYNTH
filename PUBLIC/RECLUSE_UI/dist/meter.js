import { c as m, a as b, p as d, l as h, b as _, t as y, d as x, e as w, f as B, g as C, h as k, i, r as o, s as M, j as E, k as S, m as j, n as p, o as D } from "./custom-element-DAaXFYsU.js";
import "./legacy-BIaJ2ujo.js";
import { s as F } from "./style-D6aGOzkX.js";
var q = B('<div class="wrap svelte-y712gs"><div class="bar svelte-y712gs"><div class="fill svelte-y712gs"></div></div> <span class="label svelte-y712gs"> </span></div>');
const z = {
  hash: "svelte-y712gs",
  code: ":host {display:inline-flex;}.wrap.svelte-y712gs {display:inline-flex;flex-direction:column;gap:4px;}.bar.svelte-y712gs {width:120px;height:10px;background:var(--color-surface, #0D3C76);border:1px solid var(--color-border, #4BE5B1);border-radius:var(--radius-sm, 4px);overflow:hidden;}.fill.svelte-y712gs {height:100%;background:var(--color-accent, #f7cf64);transition:width 60ms linear;}.label.svelte-y712gs {font:12px/1 'BerlinSans', sans-serif;color:var(--color-text, #C4BFCC);}"
};
function A(n, s) {
  C(s, !1), b(n, z);
  const v = j();
  let e = d(s, "value", 12, 0.5), a = d(s, "label", 12, "");
  h(() => k(e()), () => {
    D(v, Math.max(0, Math.min(1, e())) * 100);
  }), _();
  var f = {
    get value() {
      return e();
    },
    set value(r) {
      e(r), p();
    },
    get label() {
      return a();
    },
    set label(r) {
      a(r), p();
    }
  }, t = q(), l = i(t), u = i(l);
  o(l);
  var c = M(l, 2), g = i(c, !0);
  return o(c), o(t), y(() => {
    F(u, `width: ${E(v) ?? ""}%`), S(g, a());
  }), x(n, t), w(f);
}
customElements.define("recluse-meter", m(A, { value: {}, label: {} }, [], [], { mode: "open" }));
