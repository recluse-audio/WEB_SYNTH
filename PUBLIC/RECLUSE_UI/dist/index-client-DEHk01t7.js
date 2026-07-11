import { ap as n, aO as c, u, as as a, aP as f } from "./custom-element-DAaXFYsU.js";
function o(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function i(e) {
  n === null && o(), c && n.l !== null ? l(n).m.push(e) : u(() => {
    const t = a(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function r(e) {
  n === null && o(), i(() => () => a(e));
}
function p(e) {
  n === null && o(), n.l === null && f(), l(n).a.push(e);
}
function l(e) {
  var t = (
    /** @type {ComponentContextLegacy} */
    e.l
  );
  return t.u ?? (t.u = { a: [], b: [], m: [] });
}
export {
  r as a,
  p as b,
  i as o
};
