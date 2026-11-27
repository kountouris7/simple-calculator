# simple-calculator

A simple scientific calculator web app. Plain HTML, CSS, and JavaScript: no build step, no dependencies, no database.

## Run

Open `index.html` in a browser.

## Features

- Basic arithmetic: `+ − × ÷`, percent, decimal point
- Scientific: `sin cos tan` (DEG/RAD toggle), `ln log`, `√`, `x²`, `xʸ`, `1/x`, `n!`, `π`, `e`, `±`, parentheses
- Correct operator precedence, implicit multiplication (`2π`, `3(4)`), auto-closing parentheses
- Responsive: on narrow screens the scientific keys stack above the keypad

## Test

```bash
node calc.test.js
```

The expression logic lives in `calc.js` (a small parser, no `eval`).
