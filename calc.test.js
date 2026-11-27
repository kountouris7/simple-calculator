// Run with: node calc.test.js
const assert = require('assert');
const { evaluate } = require('./calc.js');

const cases = [
  ['1+2', 3],
  ['2+3×4', 14],
  ['(2+3)×4', 20],
  ['10÷4', 2.5],
  ['5−8', -3],
  ['0.1+0.2', 0.3],
  ['2^3^2', 512],
  ['-2^2', -4],
  ['2^-1', 0.5],
  ['√(16)', 4],
  ['sin(30)', 0.5],
  ['cos(60)+2^2', 4.5],
  ['tan(45)', 1],
  ['ln(e)', 1],
  ['log(1000)', 3],
  ['5!', 120],
  ['50%', 0.5],
  ['2π', 6.28318530718],
  ['πe', 8.53973422267],
  ['3(4)', 12],
  ['(1+2', 3],
  ['1/(4)', 0.25],
  ['-(5)', -5],
];
for (const [src, want] of cases) assert.strictEqual(evaluate(src), want, src);

assert.strictEqual(evaluate('sin(π÷2)', { deg: false }), 1);
for (const bad of ['', '1+', '1÷0', '(-1)!', '2.5!', '√(-1)', '1)', '*2', 'abc'])
  assert.ok(Number.isNaN(evaluate(bad)), 'expected error for ' + JSON.stringify(bad));

console.log('all calc tests passed');
