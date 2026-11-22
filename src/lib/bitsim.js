// A tiny teaching simulator for single-bit expressions.
// It understands one statement such as `q <= ~d;` or `assign pulse = sig & ~sig_d;`
// and evaluates it cycle by cycle. It is deliberately small: real Verilog runs
// through Icarus/Verilator later. Operators: ~ ! & && | || ^ and parentheses.

export class SimError extends Error {}

function tokenize(src) {
  const tokens = [];
  const re = /\s*(1'b[01]|[01]|[A-Za-z_][A-Za-z0-9_]*|&&|\|\||[~!&|^()])/y;
  let i = 0;
  const s = src.trim();
  while (i < s.length) {
    re.lastIndex = i;
    const m = re.exec(s);
    if (!m) throw new SimError(`I don't understand "${s.slice(i).trim().slice(0, 12)}" here.`);
    tokens.push(m[1]);
    i = re.lastIndex;
  }
  return tokens;
}

/** Parse an expression into a function (env) => 0 | 1. */
export function compile(src, allowed) {
  const t = tokenize(src);
  let p = 0;
  const peek = () => t[p];
  const take = (x) => {
    if (t[p] !== x) throw new SimError(`Expected "${x}" but found "${t[p] ?? 'end of line'}".`);
    p++;
  };
  function or() {
    let l = xor();
    while (peek() === '|' || peek() === '||') { p++; const a = l, b = xor(); l = (e) => a(e) | b(e); }
    return l;
  }
  function xor() {
    let l = and();
    while (peek() === '^') { p++; const a = l, b = and(); l = (e) => a(e) ^ b(e); }
    return l;
  }
  function and() {
    let l = unary();
    while (peek() === '&' || peek() === '&&') { p++; const a = l, b = unary(); l = (e) => a(e) & b(e); }
    return l;
  }
  function unary() {
    if (peek() === '~' || peek() === '!') { p++; const a = unary(); return (e) => a(e) ^ 1; }
    return primary();
  }
  function primary() {
    const x = t[p++];
    if (x === undefined) throw new SimError('The expression ends too early.');
    if (x === '(') { const v = or(); take(')'); return v; }
    if (x === '0' || x === "1'b0") return () => 0;
    if (x === '1' || x === "1'b1") return () => 1;
    if (/^[A-Za-z_]/.test(x)) {
      if (!allowed.includes(x)) throw new SimError(`"${x}" isn't a signal here. You can use: ${allowed.join(', ')}.`);
      return (e) => e[x] & 1;
    }
    throw new SimError(`Unexpected "${x}".`);
  }
  const fn = or();
  if (p < t.length) throw new SimError(`Unexpected "${t[p]}" after the expression.`);
  return fn;
}

/** Find `target <= expr;` (or `assign target = expr;`) in source code and return expr. */
export function extract(code, target, kind) {
  const clean = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const re = kind === 'assign'
    ? new RegExp(`assign\\s+${target}\\s*=\\s*([^;]+);`)
    : new RegExp(`\\b${target}\\s*<=\\s*([^;]+);`);
  const m = clean.match(re);
  if (!m) {
    throw new SimError(kind === 'assign'
      ? `I couldn't find "assign ${target} = ...;".`
      : `I couldn't find "${target} <= ...;" inside the always block.`);
  }
  return m[1];
}

/** Square-wave clock: low for the first half period, rising at t = half. */
export function clockPath(period, total, hi = 4, lo = 28) {
  let d = `M0 ${lo}`;
  for (let t = period / 2; t < total; t += period) {
    d += `H${t}V${hi}H${Math.min(total, t + period / 2)}V${lo}`;
  }
  return d + `H${total}`;
}

/** Path for a 0/1 signal given as [[time, value], ...]; value null = unknown (X). */
export function signalPath(points, total, hi = 4, lo = 28) {
  let d = '';
  let x = null;
  let prev = null;
  for (let i = 0; i < points.length; i++) {
    const [t, v] = points[i];
    const end = i + 1 < points.length ? points[i + 1][0] : total;
    if (v === null) { continue; }
    const y = v ? hi : lo;
    if (prev === null) d += `M${t} ${y}`;
    else d += `V${y}`;
    d += `H${end}`;
    prev = v;
    x = end;
  }
  return d;
}

/** Crossed box for the unknown (X) region at the start of a register's output. */
export function unknownPath(until, hi = 4, lo = 28) {
  return `M0 ${hi}H${until}M0 ${lo}H${until}M0 ${hi}L${until} ${lo}M0 ${lo}L${until} ${hi}`;
}
