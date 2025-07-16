import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "sinh(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "sinh(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: Math.PI / 2,
    description: "sinh(0 + π/2i)",
  },
  {
    // 4
    re: 1,
    im: Math.PI / 2,
    description: "sinh(1 + π/2i)",
  },
  {
    // 5
    re: NaN,
    im: 0,
    description: "sinh(NaN + 0i)",
  },
  {
    // 6
    re: 0,
    im: NaN,
    description: "sinh(0 + NaNi)",
  },
  {
    // 7
    re: NaN,
    im: NaN,
    description: "sinh(NaN + NaNi)",
  },
  {
    // 8
    re: Infinity,
    im: 0,
    description: "sinh(∞ + 0i)",
  },
  {
    // 9
    re: -Infinity,
    im: 0,
    description: "sinh(-∞ + 0i)",
  },
  {
    // 10
    re: Infinity,
    im: Math.PI / 2,
    description: "sinh(∞ + π/2i)",
  },
  {
    // 11
    re: -Infinity,
    im: Math.PI / 2,
    description: "sinh(-∞ + π/2i)",
  },
  {
    // 12
    re: Infinity,
    im: 1,
    description: "sinh(∞ + 1i)",
  },
  {
    // 13
    re: 0,
    im: Infinity,
    description: "sinh(0 + ∞i)",
  },
  {
    // 14
    re: 1,
    im: Infinity,
    description: "sinh(1 + ∞i)",
  },
  {
    // 15
    re: Infinity,
    im: NaN,
    description: "sinh(∞ + NaNi)",
  },
  {
    // 16
    re: 1e-15,
    im: 0,
    description: "sinh(1e-15 + 0i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "sinh(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 0,
    im: Math.PI,
    description: "sinh(0 + πi)",
  },
  {
    // 19
    re: Math.PI / 4,
    im: 0,
    description: "sinh(π/4 + 0i)",
  },
  {
    // 20
    re: 0,
    im: Math.PI / 4,
    description: "sinh(0 + π/4i)",
  },
];

const WolframRes = [
  // 1 - Wolfram sinh(0 + 0i)
  { re: 0, im: 0 },
  // 2 - Wolfram sinh(1 + 0i)
  { re: 1.17520119364380145688, im: 0 },
  // 3 - Wolfram sinh(0 + π/2i)
  { re: 0, im: 1 },
  // 4 - Wolfram sinh(1 + π/2i)
  { re: 0, im: 1.5430806348152437784779 },
  // 5 - Wolfram sinh(NaN + 0i) = NaN
  { re: "?", im: "?" },
  // 6 - Wolfram sinh(0 + NaNi) = NaN
  { re: "?", im: "?" },
  // 7 - Wolfram sinh(NaN + NaNi)
  { re: "?", im: "?" },
  // 8 - Wolfram sinh(∞ + 0i)
  { re: Infinity, im: "?" },
  // 9 - Wolfram sinh(-∞ + 0i)
  { re: -Infinity, im: "?" },
  // 10 - Wolfram sinh(∞ + π/2i)
  { re: Infinity, im: "?" },
  // 11 - Wolfram sinh(-∞ + π/2i)
  { re: -Infinity, im: "?" },
  // 12 - Wolfram sinh(∞ + i)
  { re: Infinity, im: "?" },

  // 13 - Wolfram sinh(0 + ∞i)
  { re: "0", im: "[-1 to 1]" },
  // 14 - Wolfram sinh(1 + ∞i)
  { re: "0", im: "[-1 to 1]" },
  // 15 - Wolfram sinh(∞ + NaNi)
  { re: "?", im: "?" },
  // 16 - Wolfram sinh(1e-15 + 0i)
  { re: 1e-15, im: 0 },
  // 17 - Wolfram sinh(1e-15 + 1e-15i)
  { re: 9.999999999999999999999e-16, im: 1.0e-15 },
  // 18 - Wolfram sinh(0 + πi)
  { re: 0, im: 0 },
  // 19 - Wolfram sinh(π/4 + 0i)
  { re: 0.8686709614860096098969, im: 0 },
  // 20 - Wolfram sinh(0 + π/4i)
  { re: 0, im: 1 / Math.SQRT2 },
  //   // 21 - Wolfram sinh(π/2 + 0i) = 1
  //   { re: 1, im: 0 },
  //   // 22 - Wolfram sinh(π + 0i) = ∞^~ (pole)
  //   { re: "∞^~", im: "∞^~" },
  //   // 23 - Wolfram sinh(π + i) ≈ 0 - 0.85091812823932154513i
  //   { re: 0, im: 0.85091812823932154513 },
  //   // 24 - Wolfram sinh(π/3 + 0i) = 2/√3 ≈ 1.154700538379251529018
  //   { re: 1.154700538379251529018, im: 0 },
  //   // 25 - Wolfram sinh(π/6 + 0i) = 2 + 0i.
  //   { re: 2, im: 0 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for sinh(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.sinh(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.sinh(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
