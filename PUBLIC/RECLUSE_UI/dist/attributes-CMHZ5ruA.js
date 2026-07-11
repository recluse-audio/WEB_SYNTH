import { ab as h, ac as A, ad as E, ae as S, af as n, ag as u, ah as T, ai as N, aj as m, _ as c, ak as L, al as y, am as M, an as v, a5 as d } from "./custom-element-DAaXFYsU.js";
const R = Symbol("is custom element"), I = Symbol("is html"), b = v ? "link" : "LINK", p = v ? "progress" : "PROGRESS";
function H(s) {
  if (c) {
    var t = !1, a = () => {
      if (!t) {
        if (t = !0, s.hasAttribute("value")) {
          var r = s.value;
          _(s, "value", null), s.value = r;
        }
        if (s.hasAttribute("checked")) {
          var e = s.checked;
          _(s, "checked", null), s.checked = e;
        }
      }
    };
    s[L] = a, y(a), M();
  }
}
function O(s, t) {
  var a = g(s);
  a.value === (a.value = // treat null and undefined the same for the initial value
  t ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  s.value === t && (t !== 0 || s.nodeName !== p) || (s.value = t ?? "");
}
function _(s, t, a, r) {
  var e = g(s);
  c && (e[t] = s.getAttribute(t), t === "src" || t === "srcset" || t === "href" && s.nodeName === b) || e[t] !== (e[t] = a) && (t === "loading" && (s[h] = a), a == null ? s.removeAttribute(t) : typeof a != "string" && l(s).includes(t) ? s[t] = a : s.setAttribute(t, a));
}
function k(s, t, a) {
  var r = T, e = N;
  let o = c;
  c && d(!1), n(null), u(null);
  try {
    // `style` should use `set_attribute` rather than the setter
    t !== "style" && // Don't compute setters for custom elements while they aren't registered yet,
    // because during their upgrade/instantiation they might add more setters.
    // Instead, fall back to a simple "an object, then set as property" heuristic.
    (f.has(s.getAttribute("is") || s.nodeName) || // customElements may not be available in browser extension contexts
    !customElements || customElements.get(s.getAttribute("is") || s.nodeName.toLowerCase()) ? l(s).includes(t) : a && typeof a == "object") ? s[t] = a : _(s, t, a == null ? a : String(a));
  } finally {
    n(r), u(e), o && d(!0);
  }
}
function g(s) {
  var t;
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    s[t = A] ?? (s[t] = {
      [R]: s.nodeName.includes("-"),
      [I]: s.namespaceURI === E
    })
  );
}
var f = /* @__PURE__ */ new Map();
function l(s) {
  var t = s.getAttribute("is") || s.nodeName, a = f.get(t);
  if (a) return a;
  f.set(t, a = []);
  for (var r, e = s, o = Element.prototype; o !== e; ) {
    r = m(e);
    for (var i in r)
      r[i].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      i !== "innerHTML" && i !== "textContent" && i !== "innerText" && a.push(i);
    e = S(e);
  }
  return a;
}
export {
  _ as a,
  O as b,
  H as r,
  k as s
};
