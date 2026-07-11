import { c as T, g as U, a as W, p as j, o as n, l as q, j as e, b as Y, t as B, d as f, e as Z, m as g, f as w, i as z, n as P, z as $, s as R, r as h, x as V, A as tt } from "./custom-element-DAaXFYsU.js";
import "./legacy-BIaJ2ujo.js";
import { o as et, a as ot } from "./index-client-DEHk01t7.js";
import { i as st } from "./if-CrMZpu86.js";
import { e as X, i as G } from "./each-DsVxvOSM.js";
import { a as H } from "./attributes-CMHZ5ruA.js";
import { s as m } from "./class-fIUYqVN4.js";
import { s as I } from "./style-D6aGOzkX.js";
import { b as rt } from "./this-DcbZchmD.js";
import { i as it } from "./lifecycle-3Q6hVaE9.js";
var at = w('<div><span class="chevron down svelte-134mtg6" aria-hidden="true">&#8964;</span> <button></button></div>'), lt = w('<div><button></button> <span class="chevron up svelte-134mtg6" aria-hidden="true">&#8963;</span></div>'), nt = w('<div class="row top svelte-134mtg6"></div> <div class="row bottom svelte-134mtg6"></div>', 1), ct = w("<div><!></div>");
const dt = {
  hash: "svelte-134mtg6",
  code: `:host {display:inline-block;}
  /* bg + outline matched to recluse-text-display so the swatch reads as part
     of the same bottom-bar family. */.box.svelte-134mtg6 {box-sizing:border-box;display:flex;flex-direction:column;gap:6px;
    /* half the old single-row width: 4 columns instead of 8. */width:var(--color-swatch-width, 125px);height:var(--color-swatch-height, 80px);
    /* tight vertical padding so the chevrons sit close to the box edge. */padding:2px 6px;overflow:hidden;background:var(--color-surface, #0D3C76);border:1px solid color-mix(in srgb, var(--color-border, #FBE5BF) 60%, white);border-radius:var(--radius-sm, 4px);}
  /* two horizontal rows: accent marks on top, base backgrounds on the bottom.
     each row splits its width evenly across its 4 slots. */.row.svelte-134mtg6 {flex:1 1 0;display:flex;flex-direction:row;align-items:stretch;gap:6px;min-height:0;}
  /* each slot stacks its swatch and its single chevron. the chevron sits on the
     row's outer edge: below the swatch on the top row (points down), above it on
     the bottom row (points up), so both point inward at the selection. */.slot.svelte-134mtg6 {flex:1 1 0;display:flex;flex-direction:column;align-items:center;height:100%;gap:1px;}.swatch.svelte-134mtg6 {width:100%;
    /* fill the slot but yield room for the chevron line below/above. */flex:1 1 0;min-height:0;padding:0;border:1px solid color-mix(in srgb, var(--color-border, #FBE5BF) 60%, white);border-radius:var(--radius-sm, 4px);cursor:pointer;}
  /* one chevron per slot, hidden until that slot is the active selection.
     top row sits above its swatch, bottom row below, both on the box edge. */.chevron.svelte-134mtg6 {flex:0 0 auto;font-size:10px;line-height:1;
    /* stretched horizontally so the arrowhead reads wider than the swatch. */transform:scaleX(1.8);color:var(--color_1, #FBE5BF);visibility:hidden;}.slot.active.svelte-134mtg6 .chevron:where(.svelte-134mtg6) {visibility:visible;}`
};
function vt(S, _) {
  U(_, !1), W(S, dt);
  const L = g(), O = g(), J = [
    "--color_0",
    "--color_1",
    "--color_2",
    "--color_3",
    "--color_4",
    "--color_5",
    "--color_6",
    "--color_7"
  ];
  let u = j(_, "show", 12, !1), a = j(_, "color", 12, "#800000"), x = g(), l = g([]), p;
  function y() {
    const t = getComputedStyle(document.documentElement);
    return J.map(function(s) {
      return t.getPropertyValue(s).trim();
    });
  }
  et(function() {
    n(l, y()), requestAnimationFrame(function() {
      n(l, y());
    }), p = new MutationObserver(function() {
      n(l, y());
    }), p.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["data-color-palette", "style"]
    });
  }), ot(function() {
    p && p.disconnect();
  });
  function A(t) {
    a(t), e(x).dispatchEvent(new CustomEvent("active-color:change", { detail: { color: t }, bubbles: !0, composed: !0 }));
  }
  function b(t, s) {
    return t.toLowerCase() === (s || "").toLowerCase();
  }
  q(() => e(l), () => {
    n(L, e(l).filter(function(t, s) {
      return s % 2 === 1;
    }));
  }), q(() => e(l), () => {
    n(O, e(l).filter(function(t, s) {
      return s % 2 === 0;
    }));
  }), Y();
  var K = {
    get show() {
      return u();
    },
    set show(t) {
      u(t), P();
    },
    get color() {
      return a();
    },
    set color(t) {
      a(t), P();
    }
  };
  it();
  var c = ct();
  let D;
  var N = z(c);
  {
    var Q = (t) => {
      var s = nt(), k = $(s);
      X(k, 5, () => e(L), G, (C, o) => {
        var r = at();
        let d;
        var i = R(z(r), 2);
        let v;
        h(r), B(
          (E, F) => {
            d = m(r, 1, "slot svelte-134mtg6", null, d, E), v = m(i, 1, "swatch svelte-134mtg6", null, v, F), I(i, `background: ${e(o) ?? ""};`), H(i, "title", e(o));
          },
          [
            () => ({ active: b(e(o), a()) }),
            () => ({ active: b(e(o), a()) })
          ]
        ), V("click", i, function() {
          A(e(o));
        }), f(C, r);
      }), h(k);
      var M = R(k, 2);
      X(M, 5, () => e(O), G, (C, o) => {
        var r = lt();
        let d;
        var i = z(r);
        let v;
        tt(2), h(r), B(
          (E, F) => {
            d = m(r, 1, "slot svelte-134mtg6", null, d, E), v = m(i, 1, "swatch svelte-134mtg6", null, v, F), I(i, `background: ${e(o) ?? ""};`), H(i, "title", e(o));
          },
          [
            () => ({ active: b(e(o), a()) }),
            () => ({ active: b(e(o), a()) })
          ]
        ), V("click", i, function() {
          A(e(o));
        }), f(C, r);
      }), h(M), f(t, s);
    };
    st(N, (t) => {
      u() && t(Q);
    });
  }
  return h(c), rt(c, (t) => n(x, t), () => e(x)), B(() => D = m(c, 1, "box svelte-134mtg6", null, D, { blank: !u() })), f(S, c), Z(K);
}
customElements.define("recluse-color-swatch", T(vt, { show: {}, color: {} }, [], [], { mode: "open" }));
