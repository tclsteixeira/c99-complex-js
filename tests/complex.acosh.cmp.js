import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 1,
    im: 0,
    description: "acosh(1 + 0i)",
  },
  {
    // 2
    re: 0,
    im: 1,
    description: "acosh(0 + i)",
  },
  {
    // 3
    re: 1,
    im: 1,
    description: "acosh(1 + i)",
  },
  {
    // 4
    re: -1,
    im: 0,
    description: "acosh(-1 + 0i)",
  },
  {
    // 5
    re: NaN,
    im: 1,
    description: "acosh(NaN + i)",
  },
  {
    // 6
    re: Infinity,
    im: 1,
    description: "acosh(∞ + i)",
  },
  {
    // 7
    re: 1e-154,
    im: 1e-154,
    description: "acosh(1e-154 + 1e-154i)",
  },
  {
    // 8
    re: 30,
    im: 1,
    description: "acosh(30 + i)",
  },
  {
    // 9
    re: -30,
    im: 1,
    description: "acosh(-30 + i)",
  },
  {
    // 10
    re: 1,
    im: 30,
    description: "acosh(1 + 30i)",
  },
  {
    // 11
    re: 0,
    im: 0.5,
    description: "acosh(0 + 0.5i)",
  },
  {
    // 12
    re: 1,
    im: Number.EPSILON,
    description: "acosh(1 + EPSILON i)",
  },
  {
    // 13
    re: -1,
    im: Number.EPSILON,
    description: "acosh(-1 + EPSILON i)",
  },
  {
    // 14
    re: 0.99999,
    im: Number.EPSILON * 0.00001,
    description: "acosh(0.99999 + (EPSILON * 0.00001)i)",
  },
  {
    // 15
    re: Number.MIN_VALUE,
    im: Number.MIN_VALUE,
    description: "acosh(Number.MIN_VALUE + Number.MIN_VALUE i)",
  },
  {
    // 16
    re: true,
    im: true,
    description: "verifies symmetry: acosh(-z) = acosh(z) + iπ for z = 1 + 1i ",
  },
  {
    // 17
    re: Infinity,
    im: NaN,
    description: "acosh(∞ + NaN i)",
  },
  {
    // 18
    re: 1,
    im: 1e10,
    description: "acosh(1 + 1e10i)",
  },
  {
    // 19
    re: 1e-100,
    im: 1e-100,
    description: "acosh(1e-100 + 1e-100i)",
  },
  {
    // 20
    re: NaN,
    im: NaN,
    description: "acosh(NaN + NaNi)",
  },
  {
    // 21
    re: Infinity,
    im: -1,
    description: "acosh(∞ - i)",
  },
  {
    // 22
    re: Infinity,
    im: 1000,
    description: "acosh(∞ + 1000i)",
  },
  {
    // 23
    re: -Infinity,
    im: 1,
    description: "acosh(-∞ + 1i)",
  },
  {
    // 24
    re: -Infinity,
    im: -1,
    description: "acosh(-∞ - i)",
  },
  {
    // 25
    re: -Infinity,
    im: NaN,
    description: "acosh(-∞ + NaNi)",
  },
  {
    // 26
    re: Infinity,
    im: Infinity,
    description: "acosh(∞ + ∞i)",
  },
  {
    // 27
    re: -Infinity,
    im: Infinity,
    description: "acosh(-∞ + ∞i)",
  },
  {
    // 28
    re: -Infinity,
    im: -Infinity,
    description: "acosh(-∞ - ∞i)",
  },
];

const WolframRes = [
  // 1 - Wolfram acosh(1 + 0i)
  { re: 0, im: 0 },
  // 2 - Wolfram acosh(0 + i)
  { re: 0.88137358701954302523, im: 1.5707963267948966192313 },
  // 3 - Wolfram acosh(1 + i)
  { re: 1.061275061905035652033, im: 0.904556894302381364127 },
  // 4 - Wolfram acosh(-1 + 0i)
  { re: 0, im: Math.PI },
  // 5 - Wolfram acosh(NaN + i)
  { re: NaN, im: NaN },
  // 6 - Wolfram acosh(∞ + i)
  { re: Infinity, im: 0 },
  // 7 - Wolfram acosh(1e-154 + 1e-154i)
  { re: 1e-154, im: +1.570796326794896619231 },
  // 8 - Wolfram acosh(30 + i)
  { re: 4.094622841270688904955, im: 0.0333394886737741669238 },
  // 9 - Wolfram acosh(-30 + i)
  { re: 4.094622841270688904955, im: 3.1082531649160190715388 },
  // 10 - Wolfram acosh(1 + 30i)
  { re: 4.09517654853799887099, im: 1.5374937930188871128555 },
  // 11 - Wolfram acosh(0 + 0.5i)
  { re: 0.4812118250596034474977589, im: 1.57079632679489661923 },
  // 12 - Wolfram acosh(1 + εi) -> ε = 2.220446049250313e-16
  { re: 1.49011611938476562544e-8, im: +1.49011611938476557029947e-8 },
  // 13 - Wolfram acosh(-1 + εi)
  { re: 1.49011611938476562544485e-8, im: 3.14159263868863204461499 },
  // 14 - Wolfram acosh(0.99999 + (ε * 0.00001)i)
  { re: 4.96508071921185975906e-19, im: 0.00447213968178792717 },
  // 15 - Wolfram acosh(MIN_VALUE + MIN_VALUE i)  -> MIN_VALUE = 5e-324
  { re: 5e-324, im: 1.57079632679489661923 },
  // 16 - verifies symmetry: acosh(-z) = acosh(z) + iπ for z = 1 + 1i
  { re: true, im: true },
  // 17 - Wolfram acosh(∞ + NaNi)
  { re: Infinity, im: NaN },
  // 18 - Wolfram acosh(1 + 1e10i)
  { re: 23.7189981105004021496, im: 1.57079632669489661923 },
  // 19 - Woolfram acosh(1e-100 + 1e-100i)
  { re: 1e-100, im: 1.57079632679489661923 },
  // 20 - Woolfram acosh(NaN + NaNi)
  { re: NaN, im: NaN },
  // 21 - Octave acosh(∞ - i)
  { re: Infinity, im: 0 },
  // 22 - Octave acosh(∞ + 1000i)
  { re: Infinity, im: 0 },
  // 23 - Octave acosh(-∞ + i)
  { re: Infinity, im: +3.1416 },
  // 24 - Octave acosh(-∞ - i)
  { re: Infinity, im: -3.1416 },
  // 25 - Octave acosh(-∞ + NaN i)
  { re: Infinity, im: NaN },
  // 26 - Octave acosh(∞ + ∞i)
  { re: Infinity, im: 0.7854 },
  // 27 - Octave acosh(-∞ + ∞i)
  { re: Infinity, im: +2.3562 },
  // 28 - Octave acosh(-∞ - ∞i)
  { re: Infinity, im: -2.3562 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for acosh(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.acosh(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.acosh(new Complex(test.re, test.im));
    console.log(
      `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
    );
    // Wolfram/Octave
    console.log(
      `${Number.isFinite(WolframRes[i].re) ? "Wolfram" : "Octave"} -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
    );
  } else if (typeof test.re === "boolean") {
    console.log(`mathjs  -> Test ${test.description} = ${test.re}`);
    console.log(`Complex -> Test ${test.description} = ${test.re}`);
    console.log(`Wolfram -> Test ${test.description} = ${test.re}`);
  }
}
