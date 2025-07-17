# c99-complex.js

**High-precision complex number library for JavaScript**  
Supports a wide range of arithmetic, transcendental, and trigonometric operations, compliant with C99 standards.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![License: BSL-1.0](https://img.shields.io/badge/license-BSL--1.0-lightgrey.svg)](https://www.boost.org/LICENSE_1_0.txt)

[![NPM version](https://img.shields.io/npm/v/c99-complex.svg)](https://www.npmjs.com/package/c99-complex)
[![GitHub Repo](https://img.shields.io/badge/github-tclsteixeira%2Fc99--complex--js-blue.svg?logo=github)](https://github.com/tclsteixeira/c99-complex-js)

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

---

## Accuracy & Standards Compliance

This library was developed with a strong focus on **numerical accuracy**, particularly for complex number functions involving special values like ±0, infinities, and NaNs.

- ⚙️ Over **950 test cases**, including edge cases from the **C99 standard**  
- 🔬 Cross-checked with outputs from **multiple platforms** (Octave, Wolfram, etc.)  
- 🎯 Aims for behavior consistent with the **ISO/IEC 9899:1999 (C99)** standard

While exact compliance with C99 across all edge cases is challenging (and even major platforms diverge in subtle ways), this library strives for **high consistency, predictability, and correctness** across platforms.

---

## Installation

```bash
npm install c99-complex
```

The npm package includes only the `dist/` output — not the source or test files.  
To access full source and tests, see the [GitHub repo](https://github.com/tclsteixeira/c99-complex-js).

---

## Usage

### From NPM (Recommended)

```js
import { Complex } from 'c99-complex';

const a = new Complex(2, 3);
const b = new Complex(1, -1);
console.log(a.add(b).toString()); // 3 + 2i
```

---

## Import Matrix

| Use case           | Import path                                                | Notes                             |
|--------------------|------------------------------------------------------------|-----------------------------------|
| From NPM (Node/ESM) | `import { Complex } from 'c99-complex'`                   | ✅ Ideal for Node.js / bundlers   |
| From GitHub (local) | `import { Complex } from './dist/c99-complex.esm.js'`     | ✅ After build or file copy       |
| From CDN            | `import { Complex } from 'https://unpkg.com/c99-complex@latest/dist/c99-complex.esm.js'` | ✅ Quick test without install     |

---

## Running in the Browser

To use the library directly in the browser (no bundler):

1. Clone the repo or install via npm:

   ```bash
   npm install c99-complex
   ```

2. Copy the ESM file from the package:

   ```bash
   cp node_modules/c99-complex/dist/c99-complex.esm.js ./libs/
   ```

3. Reference it in your HTML:

   ```html
   <script type="module">
     import { Complex } from './libs/c99-complex.esm.js';
     const z = new Complex(1, 2);
     console.log(z.toString());
   </script>
   ```

### Serve over HTTP (required for modules)

```bash
npm install -g http-server
http-server ./src/examples
```

Or, alternatives:

```bash
# With Python 3
python -m http.server

# Or via npx (no global install)
npx serve ./src/examples
```

### Open your browser at

```bash
http://localhost:8080/test-browser.html
```

---

## Examples

Available under `src/examples/`:

- `test-esm.mjs` — Node or ESM browser test  
- `test-browser.html` — browser-only demo (served over HTTP)

---

## API Highlights

| Method        | Description                         |
|---------------|-------------------------------------|
| `abs()`       | Magnitude of the complex number     |
| `arg()`       | Phase angle (argument) in radians   |
| `conj()`      | Complex conjugate                   |
| `recip()`     | Complex reciprocal                  |
| `sign()`      | Unity of this complex (same arg)    |
| `polar(mag, arg)` | Create complex from polar coords|
| `exp()`       | Exponential function                |
| `ln()`        | Natural logarithm                   |
| `log2()`, `log10()` | Base-2 and base-10 logarithms |
| `pow(x)`      | Raise to power `x`                  |
| `sqrt()`      | Square root                         |
| `sin()`, `cos()`  | Trigonometric functions         |
| `sinh()`, `cosh()`| Hyperbolic functions            |
| `asin()`, `acos()`| Inverse trigonometric functions |
| `asinh()`, `acosh()`| Inverse hyperbolic functions  |
| `toString()`  | String representation               |
| `parse(str)`  | Parse from string like `"3 + 4i"`   |

---

## Roadmap

Planned features for future releases:

- `lngamma(z)`: Complex logarithmic gamma function  
- Riemann zeta function: `zeta(s)`  
- Beta and incomplete beta functions  
- Gamma and error functions  
- Bernoulli and Euler polynomials  
- Complex Lambert W  
- Improved precision modes (e.g. arbitrary precision via adapter)  
- CLI or REPL shell for experimentation  
- Better tree-shaking support with micro-modules

> Suggestions welcome — feel free to [open an issue](https://github.com/tclsteixeira/c99-complex-js/issues)!

---

## License

This project is dual-licensed under:

- [MIT License](./LICENSE) — for most of the codebase  
- [Boost Software License 1.0](./LICENSE.BOOST-1.0) — for adapted Boost functions

SPDX-License-Identifier: MIT OR BSL-1.0

---

## Contributing

Pull requests are welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Before submitting, please run the test suite:

```bash
git clone https://github.com/tclsteixeira/c99-complex-js
cd c99-complex-js
npm install
npm test
```

---

## Testing Philosophy

This library includes extensive unit tests for:

- Trigonometric, hyperbolic, exponential, and logarithmic functions  
- Behavior near zero, infinity, and NaN  
- Complex branch cuts, sign preservation per C99  
- Real-world and pathological edge cases

Tests are not just for correctness, but also to clarify **expected mathematical behavior** across platforms.

---

## Author

Maintained by Tiago C. Teixeira  
© 2025 – Released under the MIT & Boost Software Licenses.
