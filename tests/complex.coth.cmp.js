import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "coth(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "coth(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: Math.PI,
    description: "coth(0 + πi)",
  },
  {
    // 4
    re: 1,
    im: Math.PI,
    description: "coth(1 + πi)",
  },
  {
    // 5
    re: NaN,
    im: 0,
    description: "coth(NaN + 0i)",
  },
  {
    // 6
    re: 0,
    im: NaN,
    description: "coth(0 + NaNi)",
  },
  {
    // 7
    re: NaN,
    im: NaN,
    description: "coth(NaN + NaNi)",
  },
  {
    // 8
    re: Infinity,
    im: 0,
    description: "coth(∞ + 0i)",
  },
  {
    // 9
    re: -Infinity,
    im: 0,
    description: "coth(-∞ + 0i)",
  },
  {
    // 10
    re: Infinity,
    im: Math.PI,
    description: "coth(∞ + πi)",
  },
  {
    // 11
    re: -Infinity,
    im: Math.PI,
    description: "coth(-∞ + πi)",
  },
  {
    // 12
    re: Infinity,
    im: 1,
    description: "coth(∞ + 1i)",
  },
  {
    // 13
    re: 0,
    im: Infinity,
    description: "coth(0 + ∞i)",
  },
  {
    // 14
    re: 1,
    im: Infinity,
    description: "coth(1 + ∞i)",
  },
  {
    // 15
    re: Infinity,
    im: NaN,
    description: "coth(∞ + NaNi)",
  },
  {
    // 16
    re: 1e-15,
    im: 0,
    description: "coth(1e-15 + 0i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "coth(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 0,
    im: Math.PI / 2,
    description: "coth(0 + π/2i)",
  },
  {
    // 19
    re: Math.PI / 4,
    im: 0,
    description: "coth(π/4 + 0i)",
  },
  {
    // 20
    re: 0,
    im: Math.PI / 4,
    description: "coth(0 + π/4i)",
  },
];

const WolframRes = [
  // 1 - Wolfram coth(0 + 0i)
  { re: "∞^~", im: "" },
  // 2 - Wolfram coth(1 + 0i)
  { re: 1.313035285499331303636, im: 0 },
  // 3 - Wolfram coth(0 + πi)
  { re: "∞^~", im: "∞^~" }, // -> Complex Infinity
  // 4 - Wolfram coth(1 + πi)
  { re: 1.313035285499331303636, im: 0 },
  // 5 - Wolfram coth(NaN + 0i) = NaN
  { re: "?", im: "?" },
  // 6 - Wolfram coth(0 + NaNi) = NaN
  { re: "?", im: "?" },
  // 7 - Wolfram coth(NaN + NaNi)
  { re: "?", im: "?" },
  // 8 - Wolfram coth(∞ + 0i)
  { re: 1, im: 0 },
  // 9 - Wolfram coth(-∞ + 0i)
  { re: -1, im: 0 },
  // 10 - Wolfram coth(∞ + πi)
  { re: 1, im: "0" },
  // 11 - Wolfram coth(-∞ + πi)
  { re: -1, im: "0" },
  // 12 - Wolfram coth(∞ + i)
  { re: 1, im: 0 },
  // 13 - Wolfram coth(0 + ∞i)
  { re: "?", im: "i <∞" },
  // 14 - Wolfram coth(1 + ∞i)
  { re: "?", im: "i <∞" },
  // 15 - Wolfram coth(∞ + NaNi)
  { re: "?", im: "?" },
  // 16 - Wolfram coth(1e-15 + 0i)
  { re: 1e15, im: 0 },
  // 17 - Wolfram coth(1e-15 + 1e-15i)
  { re: 5e14, im: -5e14 },
  // 18 - Wolfram coth(0 + π/2i)
  { re: 0, im: 0 },
  // 19 - Wolfram coth(π/4 + 0i)
  { re: 1.5248686188220640244069, im: 0 },
  // 20 - Wolfram coth(0 + π/4i)
  { re: 0, im: 1 },
  //   // 21 - Wolfram coth(π/2 + 0i) = 1
  //   { re: 1, im: 0 },
  //   // 22 - Wolfram coth(π + 0i) = ∞^~ (pole)
  //   { re: "∞^~", im: "∞^~" },
  //   // 23 - Wolfram coth(π + i) ≈ 0 - 0.85091812823932154513i
  //   { re: 0, im: 0.85091812823932154513 },
  //   // 24 - Wolfram coth(π/3 + 0i) = 2/√3 ≈ 1.154700538379251529018
  //   { re: 1.154700538379251529018, im: 0 },
  //   // 25 - Wolfram coth(π/6 + 0i) = 2 + 0i.
  //   { re: 2, im: 0 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for coth(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.coth(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.coth(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
