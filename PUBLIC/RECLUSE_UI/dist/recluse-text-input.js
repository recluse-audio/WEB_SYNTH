import { aA as i, G as c, aR as m, as as x, ax as _, _ as b, q as h, c as p, g as y, a as E, p as k, y as S, d as B, e as j, f as g, n as w } from "./custom-element-DAaXFYsU.js";
import { r as C } from "./attributes-CMHZ5ruA.js";
function R(e, a, l = a) {
  var n = /* @__PURE__ */ new WeakSet();
  i(e, "input", async (s) => {
    var t = s ? e.defaultValue : e.value;
    if (t = v(e) ? f(t) : t, l(t), c !== null && n.add(c), await m(), t !== (t = a())) {
      var o = e.selectionStart, r = e.selectionEnd, d = e.value.length;
      if (e.value = t ?? "", r !== null) {
        var u = e.value.length;
        o === r && r === d && u > d ? (e.selectionStart = u, e.selectionEnd = u) : (e.selectionStart = o, e.selectionEnd = Math.min(r, u));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  (b && e.defaultValue !== e.value || // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  x(a) == null && e.value) && (l(v(e) ? f(e.value) : e.value), c !== null && n.add(c)), _(() => {
    var s = a();
    if (e === document.activeElement) {
      var t = (
        /** @type {Batch} */
        c
      );
      if (n.has(t))
        return;
    }
    v(e) && s === f(e.value) || e.type === "date" && !s && !e.value || s !== e.value && (e.value = s ?? "");
  });
}
function v(e) {
  var a = e.type;
  return a === "number" || a === "range";
}
function f(e) {
  return e === "" ? null : +e;
}
var V = g('<input class="text-input svelte-1jefltp" placeholder="enter command"/>');
const q = {
  hash: "svelte-1jefltp",
  code: `:host {display:inline-block;}.text-input.svelte-1jefltp
  {width:220px;padding:6px 10px;background:var(--color-surface, #0D3C76);border:1px solid var(--color-border, #4BE5B1);color:var(--color-text, #fff);font:14px 'BerlinSans', sans-serif;}.text-input.svelte-1jefltp::placeholder {color:var(--color-border, #4BE5B1);}`
};
function A(e, a) {
  y(a, !0), E(e, q);
  let l = k(a, "text", 7, "");
  const n = (r, d) => a.$$host.dispatchEvent(new CustomEvent(r, { detail: d, bubbles: !0, composed: !0 }));
  function s(r) {
    r.key === "Enter" && (n("command", { text: l() }), l(""));
  }
  var t = {
    get text() {
      return l();
    },
    set text(r = "") {
      l(r), w();
    }
  }, o = V();
  return C(o), S("keydown", o, s), R(o, l), B(e, o), j(t);
}
h(["keydown"]);
customElements.define("recluse-text-input", p(A, { text: {} }, [], [], { mode: "open" }));
