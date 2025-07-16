import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "asinh(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "asinh(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: 1,
    description: "asinh(0 + i)",
  },
  {
    // 4
    re: 1,
    im: 1,
    description: "asinh(1 + i)",
  },
  {
    // 5
    re: NaN,
    im: 1,
    description: "asinh(NaN + i)",
  },
  {
    // 6
    re: Infinity,
    im: 1,
    description: "asinh(∞ + i)",
  },
  {
    // 7
    re: -Infinity,
    im: 1,
    description: "asinh(-∞ + i)",
  },
  {
    // 8
    re: Infinity,
    im: -1,
    description: "asinh(∞ - i)",
  },
  {
    // 9
    re: -Infinity,
    im: -1,
    description: "asinh(-∞ - i)",
  },
  {
    // 10
    re: Infinity,
    im: Infinity,
    description: "asinh(∞ + ∞i)",
  },
  {
    // 11
    re: -Infinity,
    im: -Infinity,
    description: "asinh(-∞ - ∞i)",
  },
  {
    // 12
    re: Infinity,
    im: -Infinity,
    description: "asinh(∞ - ∞i)",
  },
  {
    // 13
    re: -Infinity,
    im: Infinity,
    description: "asinh(-∞ + ∞i)",
  },
  {
    // 14
    re: 1e-154,
    im: 1e-154,
    description: "asinh(1e-154 + 1e-154i)",
  },
  {
    // 15
    re: 30,
    im: 1,
    description: "asinh(30 + i)",
  },
  {
    // 16
    re: -30,
    im: 1,
    description: "asinh(-30 + i)",
  },
  {
    // 17
    re: 0,
    im: -1,
    description: "asinh(0 - i)",
  },
  {
    // 18
    re: 0,
    im: 0.5,
    description: "asinh(0 + 0.5i)",
  },
  {
    // 19
    re: 1e10,
    im: 1e10,
    description: "asinh(1e10 + 1e10i)",
  },
  {
    // 20
    re: -1e8,
    im: +0.1,
    description: "asinh(-1e8 + 0.1i)",
  },
  //   {
  //     // 19
  //     re: NaN,
  //     im: 1,
  //     description: "asinh(NaN + 1i)",
  //   },
  //   {
  //     // 20
  //     re: 1e-154,
  //     im: 1e-154,
  //     description: "asinh(1e-154 + 1e-154i)",
  //   },
  //   {
  //     // 21 - Verifies simmetry
  //     re: Number.NaN,
  //     im: Number.NaN,
  //     description: "asinh(-z) = -asinh(z)",
  //   },
  //   {
  //     // 22
  //     re: 0.99999,
  //     im: Number.EPSILON * 0.0001,
  //     description: "asinh(0.99999 + (EPSILON * 0.0001)i)",
  //   },
  //   {
  //     // 23
  //     re: -0.99999,
  //     im: Number.EPSILON * 0.0001,
  //     description: "asinh(-0.99999 + (EPSILON * 0.0001)i)",
  //   },
  //   {
  //     // 24
  //     re: -1.00001,
  //     im: -Number.EPSILON * 0.00001,
  //     description: "asinh(-1.00001 - (EPSILON * 0.00001)i)",
  //   },
  //   {
  //     // 25
  //     re: 1,
  //     im: Number.EPSILON,
  //     description: "asinh(1 + EPSILON i)",
  //   },
  //   {
  //     // 26
  //     re: -1,
  //     im: -Number.EPSILON,
  //     description: "asinh(-1 - EPSILON i)",
  //   },
];

const WolframRes = [
  // 1 - Wolfram asinh(0 + 0i)
  { re: 0, im: 0 },
  // 2 - Wolfram asinh(1 + 0i)
  { re: 0.88137358701954302523, im: 0 },
  // 3 - Wolfram asinh(0 + i)
  { re: 0, im: Math.PI / 2 },
  // 4 - Wolfram asinh(1 + i)
  { re: 1.06127506190503565203, im: +0.6662394324925152551 },
  // 5 - Wolfram asinh(NaN + i)
  { re: "?", im: "?" },
  // 6 - Wolfram asinh(∞ + i)
  { re: Infinity, im: 0 },
  // 7 - Wolfram asinh(-∞ + i)
  { re: -Infinity, im: 0 },
  // 8 - Wolfram asinh(∞ - i)
  { re: Infinity, im: 0 },
  // 9 - Wolfram asinh(-∞ - i)
  { re: -Infinity, im: 0 },
  // 10 - Wolfram asinh(∞ + ∞i)
  { re: "?", im: "?" },
  // 11 - Wolfram asinh(-∞ - ∞i)
  { re: "?", im: "?" },
  // 12 - Wolfram asinh(∞ - ∞i)
  { re: "?", im: "?" },
  // 13 - Wolfram asinh(-∞ + ∞i)
  { re: "?", im: "?" },
  // 14 - Wolfram asinh(1e-154 + 1e-154i)
  { re: 1e-154, im: 1e-154 },
  // 15 - Wolfram asinh(30 + i)
  { re: 4.09517654853799887099, im: 0.0333025337760095063758 },
  // 16 - Wolfram asinh(-30 + i)
  { re: -4.09517654853799887099, im: 0.0333025337760095063758 },
  // 17 - Wolfram asinh(0 - i)
  { re: 0, im: -Math.PI / 2 },
  // 18 - Wolfram asinh(0 + 0.5i)
  { re: 0, im: 0.523598775598298873077 },
  // 19 - Woolfram asinh(1e10 + 1e10i)
  { re: 24.06557170078037480430576, im: 0.78539816339744830961 },
  // 20 - Woolfram asinh(-1e8 + 0.1i)
  { re: -19.113827924512310807061, im: 9.999999999999999496666e-10 },

  //   // 19 - Wolfram asinh(NaN + 1i)
  //   { re: "?", im: "?" },
  //   // 20 - Wolfram asinh(1e-154 + 1e-154i)
  //   { re: 1e-154, im: 1e-154 },
  //   // 21 - Wolfram symmetry asinh(-z) = -asinh(z)
  //   { re: "Not applicable", im: "Not applicable" },
  //   // 22 - Wolfram asinh(0.99999 + (EPSILON * 0.0001)i)
  //   { re: 1.56632418711310869205898, im: 4.965080719211859759e-18 },
  //   // 23 - Wolfram asinh(-0.99999 + (EPSILON * 0.0001)i)
  //   { re: -1.56632418711310869205898, im: 0 },
  //   // 24 - Wolfram asinh(-1.00001 - (EPSILON * 0.00001)i)
  //   { re: -1.5707963267948966187348, im: -0.004472132228228002123 },
  //   // 25 - Wolfram asinh(1 + EPSILON i)
  //   { re: 1.57079631189373542538367, im: +1.49011611938476562544485e-8 },
  //   // 26 - Wolfram asinh(-1 - EPSILON i)
  //   { re: -1.57079631189373542538367, im: -1.49011611938476562544485e-8 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for asinh(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.asinh(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.asinh(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
