import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    re: 0,
    im: 0,
    description: "cos(0 + 0i)",
  },
  {
    re: Math.PI / 2,
    im: 0,
    description: "cos(π/2 + 0i)",
  },
  {
    re: 0,
    im: 1,
    description: "cos(0 + i)",
  },
  {
    re: 1,
    im: 1,
    description: "cos(1 + i)",
  },
  {
    re: NaN,
    im: 0,
    description: "cos(NaN + 0i)",
  },
  {
    re: 0,
    im: NaN,
    description: "cos(0 + NaNi)",
  },
  {
    re: NaN,
    im: NaN,
    description: "cos(NaN + NaNi)",
  },
  {
    re: Infinity,
    im: 0,
    description: "cos(∞ + 0i)",
  },
  {
    re: 0,
    im: Infinity,
    description: "cos(0 + ∞i)",
  },
  {
    re: Infinity,
    im: Infinity,
    description: "cos(∞ + ∞i)",
  },
  {
    re: 1,
    im: 1e-15,
    description: "cos(1 + 1e-15i)",
  },
  {
    re: -Math.PI / 2,
    im: 0,
    description: "cos(-π/2 + 0i)",
  },
  {
    re: 0,
    im: -1,
    description: "cos(0 + -i)",
  },
  {
    re: Math.PI / 2,
    im: 1,
    description: "cos(π/2 + i)",
  },
  {
    re: -Infinity,
    im: 0,
    description: "cos(-∞ + 0i)",
  },
  {
    re: 1e-15,
    im: 0,
    description: "cos(1e-15 + 0i)",
  },
  {
    re: 0,
    im: -Infinity,
    description: "cos(0 + -∞i)",
  },
  {
    re: 1e-15,
    im: 1e-15,
    description: "cos(1e-15 + 1e-15i)",
  },
  {
    re: 1,
    im: Infinity,
    description: "cos(1 + ∞i)",
  },
  {
    re: 1000 * Math.PI,
    im: 0,
    description: "cos(1000π + 0i)",
  },
];
/*
const WolframRes = [
  // Wolfram exp(1 + 2i) = -1.1312043837568136384... + 2.4717266720048189276... i
  { re: -1.1312043837568136384, im: 2.4717266720048189276 },

  // Wolfram exp(0 + πi) = -1 + 0i
  { re: -1, im: 0 },

  // Wolfram exp(NaN + NaNi) = Undefined
  { re: NaN, im: NaN },

  // Wolfram exp(∞ + 0i) = ∞
  { re: Infinity, im: 0 },

  // Wolfram exp(-∞ + 0i) = 0 + 0i
  { re: 0, im: 0 },

  // Wolfram exp(0 + ∞i) = Undefined
  { re: NaN, im: NaN },

  // Wolfram exp(∞ + πi) = ∞
  { re: Infinity, im: 0 },

  // Wolfram exp(∞ + 2πi) = ∞
  { re: Infinity, im: 0 },

  // Wolfram exp(∞ + π/2 i) = ∞
  { re: Infinity, im: 0 },

  // Wolfram exp(∞ + (π + 1e-12)i) = ∞
  { re: Infinity, im: 0 },

  // Wolfram exp(∞ + (2π - 1e-12)i) = ∞
  { re: Infinity, im: 0 },

  // Wolfram exp(∞ + (π/2 + 1e-12)i) = ∞
  { re: Infinity, im: 0 },
];
*/

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for cos(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("");

  // mathjs test
  mathjsRes = math.cos(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.cos(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  //   // Wolfram
  //   console.log(
  //     `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  //   );
}
