import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "asin(0 + 0i)",
  },
  {
    // 2
    re: +0,
    im: 0,
    description: "asin(+0 + 0i)",
  },
  {
    // 3
    re: -0,
    im: 0,
    description: "asin(-0 + 0i)",
  },
  {
    // 4
    re: 1,
    im: 0,
    description: "asin(1 + 0i)",
  },
  {
    // 5
    re: -1,
    im: 0,
    description: "asin(-1 + 0i)",
  },
  {
    // 6
    re: 0,
    im: 1,
    description: "asin(0 + 1i)",
  },
  {
    // 7
    re: 0,
    im: -1,
    description: "asin(0 - i)",
  },
  {
    // 8
    re: 30,
    im: 0,
    description: "asin(30 + 0i)",
  },
  {
    // 9
    re: -30,
    im: 0,
    description: "asin(-30 + 0i)",
  },
  {
    // 10
    re: 1,
    im: 30,
    description: "asin(1 + 30i)",
  },
  {
    // 11
    re: Infinity,
    im: 1,
    description: "asin(∞ + i)",
  },
  {
    // 12
    re: Infinity,
    im: -1,
    description: "asin(∞ - 1i)",
  },
  {
    // 13
    re: 1,
    im: Infinity,
    description: "asin(1 + ∞i)",
  },
  {
    // 14
    re: 1,
    im: -Infinity,
    description: "asin(1 - ∞i)",
  },
  {
    // 15
    re: Infinity,
    im: Infinity,
    description: "asin(∞ + ∞i)",
  },
  {
    // 16
    re: -Infinity,
    im: -Infinity,
    description: "asin(-∞ - ∞i)",
  },
  {
    // 17
    re: Infinity,
    im: -Infinity,
    description: "asin(∞ - ∞i)",
  },
  {
    // 18
    re: -Infinity,
    im: Infinity,
    description: "asin(-∞ + ∞i)",
  },
  {
    // 19
    re: NaN,
    im: 1,
    description: "asin(NaN + 1i)",
  },
  {
    // 20
    re: 1e-154,
    im: 1e-154,
    description: "asin(1e-154 + 1e-154i)",
  },
  {
    // 21 - Verifies simmetry
    re: Number.NaN,
    im: Number.NaN,
    description: "asin(-z) = -asin(z)",
  },
  {
    // 22
    re: 0.99999,
    im: Number.EPSILON * 0.0001,
    description: "asin(0.99999 + (EPSILON * 0.0001)i)",
  },
  {
    // 23
    re: -0.99999,
    im: Number.EPSILON * 0.0001,
    description: "asin(-0.99999 + (EPSILON * 0.0001)i)",
  },
  {
    // 24
    re: -1.00001,
    im: -Number.EPSILON * 0.00001,
    description: "asin(-1.00001 - (EPSILON * 0.00001)i)",
  },
  {
    // 25
    re: 1,
    im: Number.EPSILON,
    description: "asin(1 + EPSILON i)",
  },
  {
    // 26
    re: -1,
    im: -Number.EPSILON,
    description: "asin(-1 - EPSILON i)",
  },
  {
    // 27
    re: 0.1,
    im: 1e8,
    description: "asin(0.1 + 1e8i)",
  },
  {
    // 28
    re: 0.5,
    im: 1e5,
    description: "asin(0.5 + 1e5i)",
  },
];

const WolframRes = [
  // 1 - Wolfram asin(0 + 0i)
  { re: 0, im: 0 },
  // 2 - Wolfram asin(+0 + 0i)
  { re: 0, im: 0 },
  // 3 - Wolfram asin(-0 + 0i)
  { re: 0, im: 0 },
  // 4 - Wolfram asin(1 + 0i)
  { re: Math.PI / 2, im: 0 },
  // 5 - Wolfram asin(-1 + 0i) = NaN
  { re: -Math.PI / 2, im: 0 },
  // 6 - Wolfram asin(0 + 1i) = NaN
  { re: 0, im: 0.8813735870195430252326 },
  // 7 - Wolfram asin(0 + -1i)
  { re: "?", im: -0.8813735870195430252326 },
  // 8 - Wolfram asin(30 + 0i)
  { re: 1.570796326794896619231, im: -4.0940666686320851276677 },
  // 9 - Wolfram asin(-30 + 0i)
  { re: -1.570796326794896619231, im: 4.0940666686320851276677 },
  // 10 - Wolfram asin(1 + 30i)
  { re: 0.0333025337760095063758, im: +4.0951765485379988709901 },
  // 11 - Wolfram asin(∞ + i)
  { re: 0, im: -Infinity },
  // 12 - Wolfram asin(∞ - i)
  { re: 0, im: -Infinity },
  // 13 - Wolfram asin(1 + ∞i)
  { re: "0", im: Infinity },
  // 14 - Wolfram asin(1 - ∞i)
  { re: "0", im: -Infinity },
  // 15 - Wolfram asin(∞ + ∞i)
  { re: "?", im: "?" },
  // 16 - Wolfram asin(-∞ - ∞i)
  { re: "?", im: "?" },
  // 17 - Wolfram asin(∞ - ∞i)
  { re: "?", im: "?" },
  // 18 - Wolfram asin(-∞ + ∞i)
  { re: "?", im: "?" },
  // 19 - Wolfram asin(NaN + 1i)
  { re: "?", im: "?" },
  // 20 - Wolfram asin(1e-154 + 1e-154i)
  { re: 1e-154, im: 1e-154 },
  // 21 - Wolfram symmetry asin(-z) = -asin(z)
  { re: "Not applicable", im: "Not applicable" },
  // 22 - Wolfram asin(0.99999 + (EPSILON * 0.0001)i)
  { re: 1.56632418711310869205898, im: 4.965080719211859759e-18 },
  // 23 - Wolfram asin(-0.99999 + (EPSILON * 0.0001)i)
  { re: -1.56632418711310869205898, im: 0 },
  // 24 - Wolfram asin(-1.00001 - (EPSILON * 0.00001)i)
  { re: -1.5707963267948966187348, im: -0.004472132228228002123 },
  // 25 - Wolfram asin(1 + EPSILON i)
  { re: 1.57079631189373542538367, im: +1.49011611938476562544485e-8 },
  // 26 - Wolfram asin(-1 - EPSILON i)
  { re: -1.57079631189373542538367, im: -1.49011611938476562544485e-8 },
  // 27 - Wolfram asin(0.1 + 1e8i)
  { re: 1e-9, im: 19.113827924512310807061 },
  // 28 - Wolfram asin(0.5 + 1e5i)
  { re: 4.999999999708333333365e-6, im: +12.2060726455676737295 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for asin(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.asin(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.asin(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
