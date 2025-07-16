import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: Math.PI / 4,
    im: 0,
    description: "csc(π/4 + 0i)",
  },
  {
    // 2
    re: 0,
    im: 1,
    description: "csc(0 + i)",
  },
  {
    // 3
    re: 1,
    im: 1,
    description: "csc(1 + i)",
  },
  {
    // 4
    re: NaN,
    im: 0,
    description: "csc(NaN + 0i)",
  },
  {
    // 5
    re: 0,
    im: NaN,
    description: "csc(0 + NaNi)",
  },
  {
    // 6
    re: NaN,
    im: NaN,
    description: "csc(NaN + NaNi)",
  },
  {
    // 7
    re: Infinity,
    im: 0,
    description: "csc(∞ + 0i)",
  },
  {
    // 8
    re: 0,
    im: Infinity,
    description: "csc(0 + ∞i)",
  },
  {
    // 9
    re: Infinity,
    im: Infinity,
    description: "csc(∞ + ∞i)",
  },
  {
    // 10
    re: 1,
    im: 1e-15,
    description: "csc(1 + 1e-15i)",
  },
  {
    // 11
    re: -Math.PI / 4,
    im: 0,
    description: "csc(-π/4 + 0i)",
  },
  {
    // 12
    re: 0,
    im: -1,
    description: "csc(0 - i)",
  },
  {
    // 13
    re: Math.PI / 4,
    im: 1,
    description: "csc(π/4 + i)",
  },
  {
    // 14
    re: -Infinity,
    im: 0,
    description: "csc(-∞ + 0i)",
  },
  {
    // 15
    re: 1e-15,
    im: 0,
    description: "csc(1e-15 + 0i)",
  },
  {
    // 16
    re: 0,
    im: -Infinity,
    description: "csc(0 - ∞i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "csc(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 1,
    im: Infinity,
    description: "csc(1 + ∞i)",
  },
  {
    // 19
    re: 0,
    im: 0,
    description: "csc(0 + 0i)",
  },
  {
    // 20
    re: 1000 * Math.PI,
    im: 0,
    description: "csc(1000π + 0i)",
  },
  {
    // 21
    re: Math.PI / 2,
    im: 0,
    description: "csc(π/2 + 0i)",
  },
  {
    // 22
    re: Math.PI,
    im: 0,
    description: "csc(π + 0i)",
  },
  {
    // 23
    re: Math.PI,
    im: 1,
    description: "csc(π + 1i)",
  },
  {
    // 24
    re: Math.PI / 3,
    im: 0,
    description: "csc(π/3 + 0i)",
  },
  {
    // 25
    re: Math.PI / 6,
    im: 0,
    description: "csc(π/6 + 0i)",
  },
];

const WolframRes = [
  // 1 - Wolfram csc(π/4 + 0i) = sqrt(2)
  { re: Math.SQRT2, im: 0 },
  // 2 - Wolfram csc(0 + i) = -i/sinh(1) ≈ 0 - -0.85091812823932154513i
  { re: 0, im: -0.85091812823932154513 },
  // 3 - Wolfram csc(1 + i) ≈ 0.62151801717042842123 - 0.30393100162842645033i
  { re: 0.62151801717042842123, im: -0.30393100162842645033 },
  // 4 - Wolfram csc(NaN + 0i) = NaN
  { re: "?", im: "?" },
  // 5 - Wolfram csc(0 + NaNi) = NaN
  { re: "?", im: "?" },
  // 6 - Wolfram csc(NaN + NaNi) = NaN
  { re: "?", im: "?" },
  // 7 - Wolfram csc(∞ + 0i) = <-1, >1 + <-1, >1i
  { re: "<-1, >1", im: "<-1, >1" },
  // 8 - Wolfram csc(0 + ∞i) = 0 - 0i
  { re: 0, im: -0 },
  // 9 - Wolfram csc(∞ + ∞i) = NaN
  { re: "?", im: "?" },
  // 10 - Wolfram csc(1 + 1e-15i) ≈ csc(1) - i 2 cos(1) sinh(1e-15) / (cosh(0) - cos(2))
  { re: 1.18839510577812121626, im: -7.63059722232629496167e-16 },
  // 11 - Wolfram csc(-π/4 + 0i) = -sqrt(2)
  { re: -Math.SQRT2, im: 0 },
  // 12 - Wolfram csc(0 - i) = i/sinh(1) ≈ 0 + 0.85091812823932154513i
  { re: 0, im: 0.85091812823932154513 },
  // 13 - Wolfram csc(π/4 + i) ≈ 0.5800457341341664912486967 - 0.44175944130365253172i
  { re: 0.5800457341341664912486967, im: -0.44175944130365253172 },
  // 14 - Wolfram csc(-∞ + 0i) = <-1, >1 + <-1, >1i
  { re: "<-1, >1", im: "<-1, >1" },
  // 15 - Wolfram csc(1e-15 + 0i) ≈ 1/(1e-15)
  { re: 1e15, im: 0 },
  // 16 - Wolfram csc(0 - ∞i) = 0
  { re: 0, im: 0 },
  // 17 - Wolfram csc(1e-15 + 1e-15i) ≈ 1/(1e-15 + i 1e-15) ≈ 5e14 - 5e14i
  { re: 5e14, im: -5e14 },
  // 18 - Wolfram csc(1 + ∞i) = 0 - 0i
  { re: 0, im: -0 },
  // 19 - Wolfram csc(0 + 0i) = ∞^~ (pole)
  { re: "∞^~", im: "∞^~" },
  // 20 - Wolfram csc(1000π + 0i) = ∞^~ (pole)
  { re: "∞^~", im: "∞^~" },
  // 21 - Wolfram csc(π/2 + 0i) = 1
  { re: 1, im: 0 },
  // 22 - Wolfram csc(π + 0i) = ∞^~ (pole)
  { re: "∞^~", im: "∞^~" },
  // 23 - Wolfram csc(π + i) ≈ 0 - 0.85091812823932154513i
  { re: 0, im: 0.85091812823932154513 },
  // 24 - Wolfram csc(π/3 + 0i) = 2/√3 ≈ 1.154700538379251529018
  { re: 1.154700538379251529018, im: 0 },
  // 25 - Wolfram csc(π/6 + 0i) = 2 + 0i.
  { re: 2, im: 0 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for csc(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.csc(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.csc(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
