import { t as F, ai as C, aF as v, a0 as p, aG as E, aH as M, _ as m, $ as b, a1 as _, a6 as w, a7 as k, a9 as A, aI as H, aJ as T, aK as N, aL as R, c as B, g as D, a as L, p as x, d as O, e as j, j as f, aM as S, f as G, n as g, m as I, r as P, o as J } from "./custom-element-DAaXFYsU.js";
import "./legacy-BIaJ2ujo.js";
import { o as K, b as U } from "./index-client-DEHk01t7.js";
import { b as V } from "./this-DcbZchmD.js";
import { i as Y } from "./lifecycle-3Q6hVaE9.js";
function q(h, l, d = !1, s = !1, n = !1, t = !1) {
  var r = h, o = "";
  if (d) {
    var a = (
      /** @type {Element} */
      h
    );
    m && (r = b(p(a)));
  }
  F(() => {
    var e = (
      /** @type {Effect} */
      C
    );
    if (o === (o = l() ?? "")) {
      m && _();
      return;
    }
    if (d && !m) {
      e.nodes = null, a.innerHTML = /** @type {string} */
      o, o !== "" && v(
        /** @type {TemplateNode} */
        p(a),
        /** @type {TemplateNode} */
        a.lastChild
      );
      return;
    }
    if (e.nodes !== null && (E(
      e.nodes.start,
      /** @type {TemplateNode} */
      e.nodes.end
    ), e.nodes = null), o !== "") {
      if (m) {
        w.data;
        for (var i = _(), y = i; i !== null && (i.nodeType !== k || /** @type {Comment} */
        i.data !== ""); )
          y = i, i = A(i);
        if (i === null)
          throw H(), T;
        v(w, y), r = b(i);
        return;
      }
      var z = s ? N : n ? R : void 0, u = (
        /** @type {HTMLTemplateElement | SVGElement | MathMLElement} */
        M(s ? "svg" : n ? "math" : "template", z)
      );
      u.innerHTML = /** @type {any} */
      o;
      var c = s || n ? u : (
        /** @type {HTMLTemplateElement} */
        u.content
      );
      if (v(
        /** @type {TemplateNode} */
        p(c),
        /** @type {TemplateNode} */
        c.lastChild
      ), s || n)
        for (; p(c); )
          r.before(
            /** @type {TemplateNode} */
            p(c)
          );
      else
        r.before(c);
    }
  });
}
var Q = G('<div class="box svelte-1l41eiv"></div>');
const W = {
  hash: "svelte-1l41eiv",
  code: `:host {display:inline-block;}.box.svelte-1l41eiv {box-sizing:border-box;
    /* width/height are overridable per instance via CSS custom properties
       (they inherit across the shadow boundary). Defaults keep the original
       250x72 so existing uses are unchanged. */width:var(--text-display-width, 250px);
    /* fixed height: the box never grows with content, so the page never
       reflows when the text changes. overflow is hidden as a safety net for
       the rare case the font hits minFontSize and still does not fit. */height:var(--text-display-height, 72px);overflow:hidden;padding:6px 6px;background:var(--color-surface, #0D3C76);border:1px solid color-mix(in srgb, var(--color-border, #FBE5BF) 60%, white);border-radius:var(--radius-sm, 4px);color:var(--color-text, #C4BFCC);font:14px/1.4 'BerlinSans', sans-serif;white-space:pre-line;
    /* default block layout keeps multi-element {@html} content (the main
       description) in normal left-justified flow. A single-value instance
       (the id box) can set --text-display-display: flex to center its one
       line; flex would split rich content into columns, so it is opt-in. */display:var(--text-display-display, block);align-items:var(--text-display-align-y, flex-start);justify-content:var(--text-display-align-x, flex-start);text-align:var(--text-display-text-align, left);}

  /* :global keeps these as plain class names so they match spans that come
     from the {@html} hover string, which Svelte never scopes. */.box.svelte-1l41eiv .accent {color:var(--color-accent, #f7cf64);}.box.svelte-1l41eiv .strong {font-weight:700;}`
};
function X(h, l) {
  D(l, !1), L(h, W);
  let d = x(l, "text", 12, ""), s = x(l, "maxFontSize", 12, 14), n = x(l, "minFontSize", 12, 7), t = I();
  function r() {
    if (!f(t)) return;
    let e = s();
    for (S(t, f(t).style.fontSize = e + "px"); e > n() && f(t).scrollHeight > f(t).clientHeight; )
      e -= 0.5, S(t, f(t).style.fontSize = e + "px");
  }
  K(r), U(r);
  var o = {
    get text() {
      return d();
    },
    set text(e) {
      d(e), g();
    },
    get maxFontSize() {
      return s();
    },
    set maxFontSize(e) {
      s(e), g();
    },
    get minFontSize() {
      return n();
    },
    set minFontSize(e) {
      n(e), g();
    }
  };
  Y();
  var a = Q();
  return q(a, d, !0), P(a), V(a, (e) => J(t, e), () => f(t)), O(h, a), j(o);
}
customElements.define("recluse-text-display", B(X, { text: {}, maxFontSize: {}, minFontSize: {} }, [], [], { mode: "open" }));
