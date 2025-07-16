import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "cosh(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "cosh(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: Math.PI / 2,
    description: "cosh(0 + π/2i)",
  },
  {
    // 4
    re: 1,
    im: Math.PI / 2,
    description: "cosh(1 + π/2i)",
  },
  {
    // 5
    re: NaN,
    im: 0,
    description: "cosh(NaN + 0i)",
  },
  {
    // 6
    re: 0,
    im: NaN,
    description: "cosh(0 + NaNi)",
  },
  {
    // 7
    re: NaN,
    im: NaN,
    description: "cosh(NaN + NaNi)",
  },
  {
    // 8
    re: Infinity,
    im: 0,
    description: "cosh(∞ + 0i)",
  },
  {
    // 9
    re: -Infinity,
    im: 0,
    description: "cosh(-∞ + 0i)",
  },
  {
    // 10
    re: Infinity,
    im: Math.PI / 2,
    description: "cosh(∞ + π/2i)",
  },
  {
    // 11
    re: -Infinity,
    im: Math.PI / 2,
    description: "cosh(-∞ + π/2i)",
  },
  {
    // 12
    re: Infinity,
    im: 1,
    description: "cosh(∞ + 1i)",
  },
  {
    // 13
    re: 0,
    im: Infinity,
    description: "cosh(0 + ∞i)",
  },
  {
    // 14
    re: 1,
    im: Infinity,
    description: "cosh(1 + ∞i)",
  },
  {
    // 15
    re: Infinity,
    im: NaN,
    description: "cosh(∞ + NaNi)",
  },
  {
    // 16
    re: 1e-15,
    im: 0,
    description: "cosh(1e-15 + 0i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "cosh(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 0,
    im: Math.PI,
    description: "cosh(0 + πi)",
  },
  {
    // 19
    re: Math.PI / 4,
    im: 0,
    description: "cosh(π/4 + 0i)",
  },
  {
    // 20
    re: 0,
    im: Math.PI / 4,
    description: "cosh(0 + π/4i)",
  },
];

const WolframRes = [
  // 1 - Wolfram cosh(0 + 0i)
  { re: 1, im: 0 },
  // 2 - Wolfram cosh(1 + 0i)
  { re: 1.5430806348152437784779, im: 0 },
  // 3 - Wolfram cosh(0 + π/2i)
  { re: 0, im: 0 },
  // 4 - Wolfram cosh(1 + π/2i)
  { re: 0, im: 1.17520119364380145688 },
  // 5 - Wolfram cosh(NaN + 0i) = NaN
  { re: "?", im: "?" },
  // 6 - Wolfram cosh(0 + NaNi) = NaN
  { re: "?", im: "?" },
  // 7 - Wolfram cosh(NaN + NaNi)
  { re: "?", im: "?" },
  // 8 - Wolfram cosh(∞ + 0i)
  { re: Infinity, im: "?" },
  // 9 - Wolfram cosh(-∞ + 0i)
  { re: Infinity, im: "?" },
  // 10 - Wolfram cosh(∞ + π/2i)
  { re: Infinity, im: "?" },
  // 11 - Wolfram cosh(-∞ + π/2i)
  { re: Infinity, im: "?" },
  // 12 - Wolfram cosh(∞ + i)
  { re: Infinity, im: "?" },
  // 13 - Wolfram cosh(0 + ∞i)
  { re: "0", im: "[-1 to 1]" },
  // 14 - Wolfram cosh(1 + ∞i)
  { re: "0", im: "[-1 to 1]" },
  // 15 - Wolfram cosh(∞ + NaNi)
  { re: "?", im: "?" },
  // 16 - Wolfram cosh(1e-15 + 0i)
  { re: 1.0000000000000000000000000000005, im: 0 },
  // 17 - Wolfram cosh(1e-15 + 1e-15i)
  { re: 0.99999999999999999999, im: 9.999999999999999999999e-31 },
  // 18 - Wolfram cosh(0 + πi)
  { re: -1, im: 0 },
  // 19 - Wolfram cosh(π/4 + 0i)
  { re: 1.3246090892520058466628, im: 0 },
  // 20 - Wolfram cosh(0 + π/4i)
  { re: 1 / Math.SQRT2, im: 0 },
  //   // 21 - Wolfram cosh(π/2 + 0i) = 1
  //   { re: 1, im: 0 },
  //   // 22 - Wolfram cosh(π + 0i) = ∞^~ (pole)
  //   { re: "∞^~", im: "∞^~" },
  //   // 23 - Wolfram cosh(π + i) ≈ 0 - 0.85091812823932154513i
  //   { re: 0, im: 0.85091812823932154513 },
  //   // 24 - Wolfram cosh(π/3 + 0i) = 2/√3 ≈ 1.154700538379251529018
  //   { re: 1.154700538379251529018, im: 0 },
  //   // 25 - Wolfram cosh(π/6 + 0i) = 2 + 0i.
  //   { re: 2, im: 0 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for cosh(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.cosh(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.cosh(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
