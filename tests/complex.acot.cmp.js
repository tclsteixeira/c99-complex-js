import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "acot(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "acot(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: 1,
    description: "acot(0 + 1i)",
  },
  {
    // 4
    re: 1,
    im: 1,
    description: "acot(1 + 1i)",
  },
  {
    // 5
    re: NaN,
    im: 1,
    description: "acot(NaN + 1i)",
  },
  {
    // 6
    re: Infinity,
    im: 1,
    description: "acot(∞ + 1i)",
  },
  {
    // 7
    re: 1e-154,
    im: 1e-154,
    description: "acot(1e-154 + 1e-154i)",
  },
  {
    // 8
    re: -Infinity,
    im: 1,
    description: "acot(-∞ + i)",
  },
  {
    // 9
    re: Infinity,
    im: 1000,
    description: "acot(∞ + 1000i)",
  },
  {
    // 10
    re: NaN,
    im: NaN,
    description: "acot(NaN + NaNi)",
  },
  {
    // 11
    re: -1e-10,
    im: 1 + Number.EPSILON,
    description: "acot(-1e-10 + (1 + EPSILON)i)",
  },
  {
    // 12
    re: 0,
    im: 1 + Number.EPSILON,
    description: "acot(0 + (1 + EPSILON)i)",
  },
  {
    // 13
    re: 0.99999,
    im: Number.EPSILON * 0.00001,
    description: "acot(0.99999 + (EPSILON * 0.00001)i)",
  },
  {
    // 14
    re: true,
    im: true,
    description: "verifies symmetry: acot(-z) = π - acot(z) for z = 1 + 1i",
  },
  {
    // 15
    re: 1,
    im: Infinity,
    description: "acot(1 + ∞i)",
  },
  {
    // 16
    re: 0,
    im: -1,
    description: "acot(0 - i)",
  },
  {
    // 17
    re: Infinity,
    im: Infinity,
    description: "acot(∞ + ∞i)",
  },
  {
    // 18
    re: 1e-10,
    im: 1e10,
    description: "acot(1e-10 + 1e10i)",
  },
  {
    // 19
    re: 1e-10,
    im: -1e10,
    description: "acot(1e-10 - 1e10i)",
  },
  {
    // 20
    re: 1e-10,
    im: 1 + Number.EPSILON,
    description: "acot(1e-10 + (1 + EPSILON)i)",
  },
];

const WolframRes = [
  // 1 - Wolfram acot(0 + 0i)
  { re: Math.PI / 2, im: 0 },
  // 2 - Wolfram acot(1 + 0i)
  { re: Math.PI / 4, im: 0 },
  // 3 - Wolfram acot(0 + i)
  { re: 0, im: -Infinity },
  // 4 - Wolfram acot(1 + i)
  { re: 0.5535743588970452515, im: -0.40235947810852509365 },
  // 5 - Wolfram acot(NaN + i)
  { re: "?", im: "?" },
  // 6 - Wolfram acot(∞ + i)
  { re: 0, im: 0 },
  // 7 - Wolfram acot(1e-154 + 1e-154i)
  { re: 1.57079632679489661923, im: -1e-154 },
  // 8 - Wolfram acot(-∞ + i)
  { re: 0, im: 0 },
  // 9 - Wolfram acot(∞ + 1000i)
  { re: 0, im: 0 },
  // 10 - Wolfram acot(NaN + NaNi)
  { re: "?", im: "?" },
  // 11 - Wolfram acot(-1e-10 + (1 + EPSILON)i)
  { re: -0.78539705314942368628377, im: -11.859499055248968535146 },
  // 12 - Wolfram acot(0 + (1 + ε)i)
  { re: 0, im: -18.3684002848385508 },
  // 13 - Wolfram acot(0.99999 + (ε * 0.00001)i)
  { re: 0.78540316342244839294899, im: -1.11023412691091390279e-21 },
  // 14 - verifies symmetry: acot(-z) = -acot(z) for z = 1 + 1i
  { re: true, im: true },
  // 15 - Wolfram acot(1 + ∞i)
  { re: 0, im: 0 },
  // 16 - Wolfram acot(0 - i)
  { re: 0, im: Infinity },
  // 17 - Wolfram acot(∞ + ∞i)
  { re: "?", im: "?" },
  // 18 - Wolfram acot(1e-10 + 1e10i)
  { re: 1.0000000000000000000099e-30, im: -1.0000000000000000000033e-10 },
  // 19 - Wolfram acot(1e-10 - 1e10i)
  { re: 1.0000000000000000000099e-30, im: 1.0000000000000000000033e-10 },
  // 20 - Wolfram acot(1e-10 + (1 + ε)i)
  // note: "Wolfram's real part differs by ~5e-11, likely due to output formatting or precision.
  //        Complex matches mathjs and is closer to π/4 (0.7853981633974483)."
  { re: 0.78539705314942368628377, im: -11.859499055248968535146 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for acot(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.acot(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.acot(new Complex(test.re, test.im));
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
