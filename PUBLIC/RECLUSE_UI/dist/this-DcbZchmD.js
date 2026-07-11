import { ap as x, aw as S, ax as T, as as E, ai as O, ay as Y, az as k } from "./custom-element-DAaXFYsU.js";
function n(a, s) {
  return a === s || (a == null ? void 0 : a[k]) === s;
}
function A(a = {}, s, i, y) {
  var p = (
    /** @type {ComponentContext} */
    x.r
  ), w = (
    /** @type {Effect} */
    O
  );
  return S(() => {
    var f, r;
    return T(() => {
      f = r, r = [], E(() => {
        n(i(...r), a) || (s(a, ...r), f && n(i(...f), a) && s(null, ...f));
      });
    }), () => {
      let t = w;
      for (; t !== p && t.parent !== null && t.parent.f & Y; )
        t = t.parent;
      const h = () => {
        r && n(i(...r), a) && s(null, ...r);
      }, c = t.teardown;
      t.teardown = () => {
        h(), c == null || c();
      };
    };
  }), a;
}
export {
  A as b
};
