import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "atan(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "atan(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: 1,
    description: "atan(0 + 1i)",
  },
  {
    // 4
    re: 1,
    im: 1,
    description: "atan(1 + 1i)",
  },
  {
    // 5
    re: NaN,
    im: 1,
    description: "atan(NaN + 1i)",
  },
  {
    // 6
    re: Infinity,
    im: 1,
    description: "atan(∞ + 1i)",
  },
  {
    // 7
    re: 1e-154,
    im: 1e-154,
    description: "atan(1e-154 + 1e-154i)",
  },
  {
    // 8
    re: -Infinity,
    im: 1,
    description: "atan(-∞ + i)",
  },
  {
    // 9
    re: Infinity,
    im: 1000,
    description: "atan(∞ + 1000i)",
  },
  {
    // 10
    re: NaN,
    im: NaN,
    description: "atan(NaN + NaNi)",
  },
  {
    // 11
    re: 0,
    im: NaN,
    description: "atan(0 + NaNi)",
  },
  {
    // 12
    re: 0,
    im: 1 + Number.EPSILON,
    description: "atan(0 + (1 + EPSILON)i)",
  },
  {
    // 13
    re: 0.99999,
    im: Number.EPSILON * 0.00001,
    description: "atan(0.99999 + (EPSILON * 0.00001)i)",
  },
  {
    // 14
    re: true,
    im: true,
    description: "verifies symmetry: atan(-z) = -atan(z) for z = 1 + 1i ",
  },
  {
    // 15
    re: 1,
    im: Infinity,
    description: "atan(1 + ∞i)",
  },
  {
    // 16
    re: 0,
    im: -1,
    description: "atan(0 - i)",
  },
  {
    // 17
    re: Infinity,
    im: Infinity,
    description: "atan(∞ + ∞i)",
  },
  {
    // 18
    re: 1e-10,
    im: 1e10,
    description: "atan(1e-10 + 1e10i)",
  },
  {
    // 19
    re: 1e-10,
    im: -1e10,
    description: "atan(1e-10 - 1e10i)",
  },
  {
    // 20
    re: 1e-10,
    im: 1 + Number.EPSILON,
    description: "atan(1e-10 + (1 + EPSILON)i)",
  },
];

const WolframRes = [
  // 1 - Wolfram atan(0 + 0i)
  { re: 0, im: 0 },
  // 2 - Wolfram atan(1 + 0i)
  { re: Math.PI / 4, im: 0 },
  // 3 - Wolfram atan(0 + i)
  { re: 0, im: Infinity },
  // 4 - Wolfram atan(1 + i)
  { re: 1.01722196789785136772, im: +0.40235947810852509365 },
  // 5 - Wolfram atan(NaN + i)
  { re: "?", im: "?" },
  // 6 - Wolfram atan(∞ + i)
  { re: Math.PI / 2, im: 0 },
  // 7 - Wolfram atan(1e-154 + 1e-154i)
  { re: 1e-154, im: 1e-154 },
  // 8 - Wolfram atan(-∞ + i)
  { re: -Math.PI / 2, im: 0 },
  // 9 - Wolfram atan(∞ + 1000i)
  { re: Math.PI / 2, im: 0 },
  // 10 - Wolfram atan(NaN + NaNi)
  { re: "?", im: "?" },
  // 11 - Wolfram atan(0 + NaNi)
  { re: "?", im: "?" },
  // 12 - Wolfram atan(0 + (1 + ε)i)
  { re: 1.5707963267948966, im: +18.368400284838551 },
  // 13 - Wolfram atan(0.99999 + (ε * 0.00001)i)
  { re: 0.78539316337244822628, im: +1.11023412691091390279e-21 },
  // 14 - verifies symmetry: atan(-z) = -atan(z) for z = 1 + 1i
  { re: true, im: true },
  // 15 - Wolfram atan(1 + ∞i)
  { re: Math.PI / 2, im: 0 },
  // 16 - Wolfram atan(0 - i)
  { re: 0, im: -Infinity },
  // 17 - Wolfram atan(∞ + ∞i)
  { re: "?", im: "?" },
  // 18 - Wolfram atan(1e-10 + 1e10i)
  { re: 1.57079632679489661923, im: +1e-10 },
  // 19 - Wolfram atan(1e-10 - 1e10i)
  { re: 1.57079632679489661923, im: -1e-10 },
  // 20 - Wolfram atan(1e-10 + (1 + ε)i)
  { re: 0.78539927364547293294755, im: +11.859499055248968535146 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for atan(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.atan(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.atan(new Complex(test.re, test.im));
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
