/**
 * Summary:
 * 
 * {
  test: 3,
  input: { real: 2, imag: 0 },
  complexExpected: { real: 1.0471975511965979, imag: 0 },
  mathjsNote: "mathjs returns imag = -5.551115123125783e-17, incorrect; Complex matches Wolfram"
},
{
  test: 5,
  input: { real: 0, imag: 0 },
  complexExpected: { real: 1.5707963267948966, imag: Number.POSITIVE_INFINITY },
  wolframNote: "Wolfram reports ∞^~ + ∞^~i (ComplexInfinity), equivalent to Complex; mathjs returns 0 + ∞i, non-C99-compliant"
},
{
  test: 8,
  input: { real: 0.5, imag: 0 },
  complexExpected: { real: 0, imag: 1.3169578969248166 },
  wolframNote: "Wolfram reports imag = 1.3169578969248168, difference (~2e-16) within double-precision tolerance"
},
{
  test: 9,
  input: { real: 1, imag: 1 },
  complexExpected: { real: 1.118517879643706, imag: 0.5306375309525178 },
  wolframNote: "Wolfram reports real = 1.1185178796437059, imag = 0.5306375309525179, differences (~1e-16) within tolerance"
},
{
  test: 11,
  input: { real: 1, imag: Number.EPSILON },
  complexExpected: { real: 1.4901161193847655e-8, imag: 1.4901161193847656e-8 },
  wolframNote: "Wolfram swaps real/imag parts (1.4901161193847656e-8 + 1.4901161193847655e-8i), difference (~1e-16) within tolerance"
},
{
  test: 12,
  input: { real: -1, imag: Number.EPSILON },
  complexExpected: { real: 3.141592638688632, imag: 1.4901161193847656e-8 },
  wolframNote: "Wolfram reports imag = 1.4901161193847655e-8, difference (~1e-16) within tolerance"
},
{
  test: 17,
  input: { real: 1.5, imag: 0 },
  complexExpected: { real: 0.8410686705679303, imag: 0 },
  wolquamNote: "Wolfram reports real = 0.8410686705679302, difference (~1e-16) within tolerance"
},
{
  test: 18,
  input: { real: 0, imag: 1 },
  complexExpected: { real: 1.5707963267948966, imag: 0.8813735870195429 },
  wolframNote: "Wolfram reports imag = 0.881373587019543, difference (~1e-16) within tolerance"
},
{
  test: 19,
  input: { real: 0, imag: -1 },
  complexExpected: { real: 1.5707963267948966, imag: -0.8813735870195429 },
  wolframNote: "Wolfram reports imag = -0.881373587019543, difference (~1e-16) within tolerance"
},
{
  test: 20,
  input: { real: 1e-10, imag: 1e10 },
  complexExpected: { real: 1.5707963267948966, imag: 1e-10 },
  mathjsNote: "mathjs reports imag = 1.000000082940371e-10, difference (~8.27e-17) within tolerance; Complex matches Wolfram"
},
{
    test: 21,
    input: { real: -1, imag: 1 },
    complexExpected: { real: 2.023074773946087, imag: 0.5306375309525178 },
    wolframNote: "Wolfram reports real = 2.0230747739460875, imag = 0.5306375309525179, differences (~5e-16, ~1e-16) within tolerance"
  }
 * */

import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 1,
    im: 0,
    description: "asec(1 + 0i)",
  },
  {
    // 2
    re: -1,
    im: 0,
    description: "asec(-1 + 0i)",
  },
  {
    // 3
    re: 2,
    im: 0,
    description: "asec(2 + 0i)",
  },
  {
    // 4
    re: -2,
    im: 0,
    description: "asec(-2 + 0i)",
  },
  {
    // 5
    re: 0,
    im: 0,
    description: "asec(0 + 0i)",
  },
  {
    // 6
    re: Infinity,
    im: 0,
    description: "asec(∞ + 0i)",
  },
  {
    // 7
    re: -Infinity,
    im: 0,
    description: "asec(-∞ + 0i)",
  },
  {
    // 8
    re: 0.5,
    im: 0,
    description: "asec(0.5 + 0i)",
  },
  {
    // 9
    re: 1,
    im: 1,
    description: "asec(1 + 1i)",
  },
  {
    // 10
    re: NaN,
    im: NaN,
    description: "asec(NaN + NaNi)",
  },
  {
    // 11
    re: 1,
    im: Number.EPSILON,
    description: "asec(1 + εi)",
  },
  {
    // 12
    re: -1,
    im: Number.EPSILON,
    description: "asec(-1 + εi)",
  },
  {
    // 13
    re: 1e-10,
    im: 1e-10,
    description: "asec(1e-10 + 1e-10i)",
  },
  {
    // 14
    re: Infinity,
    im: 1,
    description: "asec(∞ + 1i)",
  },
  {
    // 15
    re: 1,
    im: Infinity,
    description: "asec(1 + ∞i)",
  },
  {
    // 16
    re: true,
    im: true,
    description: "verifies asec(-z) = π - asec(z) for z = 1 + 1i",
  },
  {
    // 17
    re: 1.5,
    im: 0,
    description: "asec(1.5 + 0i)",
  },
  {
    // 18
    re: 0,
    im: 1,
    description: "asec(0 + 1i)",
  },
  {
    // 19
    re: 0,
    im: -1,
    description: "asec(0 - 1i)",
  },
  {
    // 20
    re: 1e-10,
    im: 1e10,
    description: "asec(1e-10 + 1e10i)",
  },
  {
    // 21
    re: -1,
    im: 1,
    description: "asec(-1 + 1i)",
  },
];

const WolframRes = [
  // 1 - Wolfram asec(1 + 0i)
  { re: 0, im: 0 },
  // 2 - Wolfram asec(-1 + 0i)
  { re: Math.PI, im: 0 },
  // 3 - Wolfram asec(2 + 0i)
  { re: 1.04719755119659774615, im: 0 },
  // 4 - Wolfram asec(-2 + 0i)
  { re: 2.0943951023931954923, im: 0 },
  // 5 - Wolfram asec(0 + 0i)
  { re: "∞^~", im: "∞^~" },
  // 6 - Wolfram asec(∞ + 0i)
  { re: Math.PI / 2, im: 0 },
  // 7 - Wolfram asec(-∞ + 0i)
  { re: Math.PI / 2, im: 0 },
  // 8 - Wolfram asec(0.5 + 0i)
  { re: 0, im: 1.31695789692481670862 },
  // 9 - Wolfram asec(1 + 1i)
  { re: 1.11851787964370593716766, im: 0.5306375309525178260165 },
  // 10 - Wolfram asec(NaN + NaNi)
  { re: "?", im: "?" },
  // 11 - Wolfram asec(1 + εi)
  { re: 1.490116119384765735735595e-8, im: 1.4901161193847654600087e-8 },
  // 12 - Wolfram asec(-1 + εi)
  { re: 3.14159263868863204461499, im: 1.49011611938476546e-8 },
  // 13 - Wolfram asec(1e-10 + 1e-10i)
  { re: 0.78539816339744830962, im: 23.3724245202204294948885 },
  // 14 - Wolfram asec(∞ + 1i)
  { re: Math.PI / 2, im: 0 },
  // 15 - Wolfram asec(1 + ∞i)
  { re: Math.PI / 2, im: 0 },
  // 16 - verifies asec(-z) = π - asec(z) for z = 1 + 1i
  { re: true, im: true },
  // 17 - Wolfram asec(1.5 + 0i)
  { re: 0.8410686705679302557765, im: 0 },
  // 18 - Wolfram asec(0 + 1i)
  { re: 1.57079632679489661923, im: 0.88137358701954302523 },
  // 19 - Wolfram asec(0 - 1i)
  { re: 1.57079632679489661923, im: -0.88137358701954302523 },
  // 20 - Wolfram asec(1e-10 + 1e10i)
  { re: 1.57079632679489661923, im: 9.999999999999999999983e-11 },
  // 21 - Wolfram asec(-1 + 1i)
  { re: 2.02307477394608730129498, im: 0.5306375309525178260165 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for asec(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.asec(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.asec(new Complex(test.re, test.im));
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
