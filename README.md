# c99-complex.js

**High-precision complex number library for JavaScript**  
Supports a wide range of arithmetic, transcendental, and trigonometric operations, compliant with C99 standards.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM version](https://img.shields.io/npm/v/c99-complex.js.svg)](https://www.npmjs.com/package/c99-complex.js)

---

## Features

- Immutable complex number instances
- Full support for trigonometric, hyperbolic, and exponential functions
- Implements identities like `asinh(z) = -i asin(iz)`
- Works in both modern browsers and Node.js (via ES Modules)
- Tree-shakable & side-effect-free
- Lightweight and fast
- Fully tested — 950+ test cases!

> ⚠️ **Note**: CommonJS (`require()`) is **not supported**. Use native ES modules (`import`).

## Accuracy & Standards Compliance

This library was developed with a strong focus on **numerical accuracy**, particularly for complex number functions involving special values like ±0, infinities, and NaNs.

- ⚙️ Over **950 test cases**, including edge cases from the **C99 standard**
- 🔬 Cross-checked with outputs from **multiple platforms** (Octave, Wolfram, etc.)
- 🎯 Aims for behavior consistent with the **ISO/IEC 9899:1999 (C99)** standard

While exact compliance with C99 across all edge cases is challenging (and even major platforms diverge in subtle ways), this library strives for **high consistency, predictability, and correctness** across platforms.

---

## Installation

```bash
npm install c99-complex.js
```

The npm package only includes the dist/ output — not the source or tests.
For full source and tests, see the GitHub repo.

## Usage

### Import (ES Module)

```javascript
// ESM or in browser with <script type="module">
import { Complex } from 'c99-complex.js';

// Create a complex number
const z = new Complex(3, 4);  // 3 + 4i

console.log(z.abs());         // 5
console.log(z.arg());         // 0.927... radians
console.log(z.toString());    // "3 + 4i"
```

## Running Examples in the Browser

Since ES modules need to be served over HTTP, you can run a local server to test the examples:

```bash
npm install -g http-server
http-server ./src/examples
```

### Then open your browser at

```bash
http://localhost:8080/test-browser.html
```

### Here’s an example snippet you might find in your HTML files

```html
<script type="module">
  import { Complex } from './c99-complex.esm.js';  // Adjust path if needed

  const z = new Complex(2, -1);
  console.log(z.exp().toString());
</script>
```

## Examples

Check the src/examples/ folder:

- test-browser.html
- test-esm.mjs

## API Highlights

| Method        | Description                      |
|---------------|--------------------------------|
| abs()         | Magnitude of the complex number |
| arg()         | Phase angle (argument) in radians          |
| conj()        | Complex conjugate               |
| exp()         | Exponential function            |
| ln(), log10() | Natural and base-10 logarithms |
| sin(), cos()  | Trigonometric functions        |
| sinh(), cosh()| Hyperbolic functions            |
| pow(x)        | Raise to power x                |
| sqrt()        | Square root                    |
| parse(str)    | Parse from string like "3 + 4i"|

## Roadmap

Planned features for future releases:

- lngamma(z): Complex logarithmic gamma function
- Riemann zeta function: zeta(s)
- Beta and incomplete beta functions
- Gamma and error functions
- Bernoulli and Euler polynomials
- Complex Lambert W
- Improved precision modes (e.g. arbitrary precision via adapter)
- CLI or REPL shell for experimentation
- Better tree-shaking support with micro-modules

Suggestions welcome — feel free to open an issue!

## License

This project is dual-licensed under:

[MIT License](./LICENSE) — for most of the codebase

[Boost Software License 1.0](./LICENSE.BOOST-1.0) — only for functions adapted from the Boost C++ library

See the license files for full terms.\
SPDX-License-Identifier: MIT OR BSL-1.0

## Contributing

Pull requests are welcome!

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) and
run the test suite before submitting.

## Tests

Tests are not included in the npm package to keep it lightweight.
To run tests locally:

```bash
git clone https://github.com/tclsteixeira/c99-complex.js
cd c99-complex.js
npm install
npm test
```

## Testing Philosophy

This library includes extensive unit testing of:

- Trigonometric, hyperbolic, exponential, and logarithmic functions
- Behavior near zero, infinity, and NaN values
- Complex branches and sign preservation per C99 rules
- Real-world and edge-case inputs

Tests are not only functional but serve as a reference for behavior in **extreme mathematical scenarios**.

## Author

Maintained by Tiago C. Teixeira.\
© 2025 – Released under the MIT & Boost Software Licenses.
