import { c as n, g, a as u, p as r, t as b, d as m, e as p, f as v, n as s } from "./custom-element-DAaXFYsU.js";
import "./legacy-BIaJ2ujo.js";
import { s as f } from "./style-D6aGOzkX.js";
var k = v('<div class="rect svelte-1bk2dly"></div>');
const w = {
  hash: "svelte-1bk2dly",
  code: `.rect.svelte-1bk2dly
    {background:var(--bg);border:2px solid var(--bd);}`
};
function y(h, t) {
  g(t, !1), u(h, w);
  let o = r(t, "width", 12, 100), d = r(t, "height", 12, 50), l = r(t, "color", 12, "#323539"), a = r(t, "border", 12, "#4BE581");
  var i = {
    get width() {
      return o();
    },
    set width(e) {
      o(e), s();
    },
    get height() {
      return d();
    },
    set height(e) {
      d(e), s();
    },
    get color() {
      return l();
    },
    set color(e) {
      l(e), s();
    },
    get border() {
      return a();
    },
    set border(e) {
      a(e), s();
    }
  }, c = k();
  return b(() => f(c, `width: ${o() ?? ""}px; height: ${d() ?? ""}px; --bg: ${l() ?? ""}; --bd: ${a() ?? ""};`)), m(h, c), p(i);
}
customElements.define("recluse-pulsar-background", n(y, { width: {}, height: {}, color: {}, border: {} }, [], [], { mode: "open" }));
