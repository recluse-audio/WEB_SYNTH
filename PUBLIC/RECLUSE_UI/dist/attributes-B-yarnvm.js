const j = [...` 	
\r\f \v\uFEFF`];
function C(r, l, u) {
  var f = r == null ? "" : "" + r;
  if (u) {
    for (var i of Object.keys(u))
      if (u[i])
        f = f ? f + " " + i : i;
      else if (f.length)
        for (var h = i.length, g = 0; (g = f.indexOf(i, g)) >= 0; ) {
          var b = g + h;
          (g === 0 || j.includes(f[g - 1])) && (b === f.length || j.includes(f[b])) ? f = (g === 0 ? "" : f.substring(0, g)) + f.substring(b + 1) : g = b;
        }
  }
  return f === "" ? null : f;
}
function t(r, l = !1) {
  var u = l ? " !important;" : ";", f = "";
  for (var i of Object.keys(r)) {
    var h = r[i];
    h != null && h !== "" && (f += " " + i + ": " + h + u);
  }
  return f;
}
function O(r) {
  return r[0] !== "-" || r[1] !== "-" ? r.toLowerCase() : r;
}
function L(r, l) {
  if (l) {
    var u = "", f, i;
    if (Array.isArray(l) ? (f = l[0], i = l[1]) : f = l, r) {
      r = String(r).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var h = !1, g = 0, b = !1, p = [];
      f && p.push(...Object.keys(f).map(O)), i && p.push(...Object.keys(i).map(O));
      var v = 0, o = -1;
      const c = r.length;
      for (var a = 0; a < c; a++) {
        var s = r[a];
        if (b ? s === "/" && r[a - 1] === "*" && (b = !1) : h ? h === s && (h = !1) : s === "/" && r[a + 1] === "*" ? b = !0 : s === '"' || s === "'" ? h = s : s === "(" ? g++ : s === ")" && g--, !b && h === !1 && g === 0) {
          if (s === ":" && o === -1)
            o = a;
          else if (s === ";" || a === c - 1) {
            if (o !== -1) {
              var A = O(r.substring(v, o).trim());
              if (!p.includes(A)) {
                s !== ";" && a++;
                var S = r.substring(v, a).trim();
                u += " " + S + ";";
              }
            }
            v = a + 1, o = -1;
          }
        }
      }
    }
    return f && (u += t(f)), i && (u += t(i, !0)), u = u.trim(), u === "" ? null : u;
  }
  return r == null ? null : String(r);
}
export {
  L as a,
  C as t
};
