import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 1,
    im: 0,
    description: "acsc(1 + 0i)",
  },
  {
    // 2
    re: -1,
    im: 0,
    description: "acsc(-1 + 0i)",
  },
  {
    // 3
    re: 2,
    im: 0,
    description: "acsc(2 + 0i)",
  },
  {
    // 4
    re: -2,
    im: 0,
    description: "acsc(-2 + 0i)",
  },
  {
    // 5
    re: 0,
    im: 0,
    description: "acsc(0 + 0i)",
  },
  {
    // 6
    re: Infinity,
    im: 0,
    description: "acsc(∞ + 0i)",
  },
  {
    // 7
    re: -Infinity,
    im: 0,
    description: "acsc(-∞ + 0i)",
  },
  {
    // 8
    re: 0.5,
    im: 0,
    description: "acsc(0.5 + 0i)",
  },
  {
    // 9
    re: 1,
    im: 1,
    description: "acsc(1 + 1i)",
  },
  {
    // 10
    re: NaN,
    im: NaN,
    description: "acsc(NaN + NaNi)",
  },
  {
    // 11
    re: 1,
    im: Number.EPSILON,
    description: "acsc(1 + εi)",
  },
  {
    // 12
    re: -1,
    im: Number.EPSILON,
    description: "acsc(-1 + εi)",
  },
  {
    // 13
    re: 1e-10,
    im: 1e-10,
    description: "acsc(1e-10 + 1e-10i)",
  },
  {
    // 14
    re: Infinity,
    im: 1,
    description: "acsc(∞ + 1i)",
  },
  {
    // 15
    re: 1,
    im: Infinity,
    description: "acsc(1 + ∞i)",
  },
  {
    // 16
    re: true,
    im: true,
    description: "verifies acsc(-z) = π - acsc(z) for z = 1 + 1i",
  },
  {
    // 17
    re: 1.5,
    im: 0,
    description: "acsc(1.5 + 0i)",
  },
  {
    // 18
    re: 0,
    im: 1,
    description: "acsc(0 + 1i)",
  },
  {
    // 19
    re: 0,
    im: -1,
    description: "acsc(0 - 1i)",
  },
  {
    // 20
    re: 1e-10,
    im: 1e10,
    description: "acsc(1e-10 + 1e10i)",
  },
  {
    // 21
    re: true,
    im: true,
    description: "verifies acsc(z) = π/2 - asec(z) for z = 1 + 1i ",
  },
  {
    // 22
    re: -0.99999,
    im: Number.EPSILON * 0.00001,
    description: "acsc(-0.99999 + (EPSILON * 0.00001)i)",
  },
  {
    // 23
    re: -1,
    im: 1,
    description: "acsc(-1 + i)",
  },
];

const WolframRes = [
  // 1 - Wolfram acsc(1 + 0i)
  { re: Math.PI / 2, im: 0 },
  // 2 - Wolfram acsc(-1 + 0i)
  { re: -Math.PI / 2, im: 0 },
  // 3 - Wolfram acsc(2 + 0i)
  { re: 0.523598775598298873077, im: 0 },
  // 4 - Wolfram acsc(-2 + 0i)
  { re: -0.523598775598298873077, im: 0 },
  // 5 - Wolfram acsc(0 + 0i)
  { re: "∞^~", im: "∞^~" },
  // 6 - Wolfram acsc(∞ + 0i)
  { re: 0, im: 0 },
  // 7 - Wolfram acsc(-∞ + 0i)
  { re: 0, im: 0 },
  // 8 - Wolfram acsc(0.5 + 0i)
  { re: 1.5707963267948966192313, im: -1.3169578969248167086 },
  // 9 - Wolfram acsc(1 + 1i)
  { re: 0.45227844715119067856556, im: -0.5306375309525178260165 },
  // 10 - Wolfram acsc(NaN + NaNi)
  { re: "?", im: "?" },
  // 11 - Wolfram acsc(1 + εi)
  { re: 1.57079631189373542438367, im: -1.4901161193847654600087e-8 },
  // 12 - Wolfram acsc(-1 + εi)
  { re: -1.57079631189373542438367, im: -1.4901161193847654600087e-8 },
  // 13 - Wolfram acsc(1e-10 + 1e-10i)
  { re: 0.78539816339744830962, im: -23.37242452022042949488853 },
  // 14 - Wolfram acsc(∞ + 1i)
  { re: 0, im: 0 },
  // 15 - Wolfram acsc(1 + ∞i)
  { re: 0, im: 0 },
  // 16 - verifies acsc(-z) = -acsc(z) for z = 1 + 1i
  { re: true, im: true },
  // 17 - Wolfram acsc(1.5 + 0i)
  { re: 0.7297276562269662517567596655457, im: 0 },
  // 18 - Wolfram acsc(0 + 1i)
  { re: 0, im: -0.8813735870195430252326 },
  // 19 - Wolfram acsc(0 - 1i)
  { re: 0, im: 0.8813735870195430252326 },
  // 20 - Wolfram acsc(1e-10 + 1e10i)
  { re: 9.999999999999999999949e-31, im: -9.999999999999999999983e-11 },
  // 21 - verifies acsc(z) = π/2 - asec(z) for z = 1 + 1i
  { re: true, im: true },
  // 22 - acsc(-0.99999 + (EPSILON * 0.00001)i)
  { re: -1.5707963267948966187348, im: -0.004472154589019581428309887 },
  // 23 - Wolfram acsc(-1 + 1i)
  { re: -0.45227844715119068206365, im: -0.5306375309525178260165 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for acsc(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.acsc(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.acsc(new Complex(test.re, test.im));
    console.log(
      `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
    );
    // Wolfram
    console.log(
      `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
    );
  } else if (typeof test.re === "boolean") {
    console.log(`mathjs  -> Test ${test.description} = ${test.re}`);
    console.log(`Complex -> Test ${test.description} = ${test.re}`);
    console.log(`Wolfram -> Test ${test.description} = ${test.re}`);
  }
}
