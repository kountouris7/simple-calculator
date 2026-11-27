// Expression evaluator for the calculator. No eval(): a small recursive-descent parser.
// Accepts display symbols (× ÷ − √ π) as well as ASCII (* / - sqrt pi).
// Returns a number; NaN means the expression is invalid.

const FUNCS = {
  sin: (x, deg) => Math.sin(deg ? (x * Math.PI) / 180 : x),
  cos: (x, deg) => Math.cos(deg ? (x * Math.PI) / 180 : x),
  tan: (x, deg) => Math.tan(deg ? (x * Math.PI) / 180 : x),
  ln: Math.log,
  log: Math.log10,
  sqrt: Math.sqrt,
};

function tokenize(src) {
  const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    .replace(/√/g, 'sqrt').replace(/π/g, 'pi').replace(/\s+/g, '');
  const tokens = s.match(/\d*\.?\d+|\d+\.|sin|cos|tan|ln|log|sqrt|pi|e|[-+*/^()!%]/g) || [];
  if (tokens.join('') !== s) throw new Error('bad token');
  return tokens;
}

function factorial(n) {
  if (!Number.isInteger(n) || n < 0 || n > 170) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function evaluate(src, { deg = true } = {}) {
  let tokens;
  try { tokens = tokenize(src); } catch { return NaN; }
  if (!tokens.length) return NaN;
  // Auto-close open parentheses, like most calculators.
  const open = tokens.filter(t => t === '(').length - tokens.filter(t => t === ')').length;
  for (let i = 0; i < open; i++) tokens.push(')');

  let i = 0;
  const peek = () => tokens[i];
  const next = () => tokens[i++];
  const startsPrimary = t => t !== undefined && /^(\d|\.|[a-z]|\()/.test(t);

  function expr() {
    let v = term();
    while (peek() === '+' || peek() === '-') v = next() === '+' ? v + term() : v - term();
    return v;
  }
  function term() {
    let v = unary();
    for (;;) {
      if (peek() === '*') { next(); v *= unary(); }
      else if (peek() === '/') { next(); v /= unary(); }
      else if (startsPrimary(peek())) v *= unary(); // implicit: 2π, 3(4)
      else return v;
    }
  }
  function unary() {
    if (peek() === '-') { next(); return -unary(); }
    if (peek() === '+') { next(); return unary(); }
    return power();
  }
  function power() {
    const base = postfix();
    if (peek() === '^') { next(); return Math.pow(base, unary()); } // right-assoc, -2^2 = -4
    return base;
  }
  function postfix() {
    let v = primary();
    while (peek() === '!' || peek() === '%') v = next() === '!' ? factorial(v) : v / 100;
    return v;
  }
  function primary() {
    const t = next();
    if (t === undefined) throw new Error('unexpected end');
    if (t === '(') { const v = expr(); if (next() !== ')') throw new Error('missing )'); return v; }
    if (/^[\d.]/.test(t)) return parseFloat(t);
    if (t === 'pi') return Math.PI;
    if (t === 'e') return Math.E;
    if (FUNCS[t]) {
      if (next() !== '(') throw new Error('expected (');
      const v = expr();
      if (next() !== ')') throw new Error('missing )');
      return FUNCS[t](v, deg);
    }
    throw new Error('unexpected ' + t);
  }

  try {
    const v = expr();
    if (i !== tokens.length) return NaN;
    return Number.isFinite(v) ? parseFloat(v.toPrecision(12)) : NaN;
  } catch {
    return NaN;
  }
}

if (typeof module !== 'undefined') module.exports = { evaluate };
