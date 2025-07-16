import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "asech(0 + 0i)",
  },
  {
    // 2
    re: 2,
    im: 0,
    description: "asech(2 + 0i)",
  },
  {
    // 3
    re: 1,
    im: 0,
    description: "asech(1 + 0i)",
  },
  {
    // 4
    re: -1,
    im: 0,
    description: "asech(-1 + 0i)",
  },
  {
    // 5
    re: 0,
    im: 1,
    description: "asech(0 + i)",
  },
  {
    // 6
    re: 0,
    im: 0.5,
    description: "asech(0 + 0.5i)",
  },
  {
    // 7
    re: 1,
    im: 1,
    description: "asech(1 + i)",
  },
  {
    // 8
    re: 30,
    im: 1,
    description: "asech(30 + i)",
  },
  {
    // 9
    re: -30,
    im: 1,
    description: "asech(-30 + i)",
  },
  {
    // 10
    re: 1,
    im: 30,
    description: "asech(1 + 30i)",
  },
  {
    // 11
    re: Infinity,
    im: 1,
    description: "asech(∞ + i)",
  },
  {
    // 12
    re: Infinity,
    im: -1,
    description: "asech(∞ - i)",
  },
  {
    // 13
    re: NaN,
    im: 1,
    description: "asech(NaN + i)",
  },
  {
    // 14
    re: 1e-154,
    im: 1e-154,
    description: "asech(1e-154 + 1e-154i)",
  },
  {
    // 15
    re: -Infinity,
    im: 1,
    description: "asech(-∞ + i)",
  },
  {
    // 16
    re: -Infinity,
    im: -1,
    description: "asech(-∞ - i)",
  },
  {
    // 17
    re: 1,
    im: Infinity,
    description: "asech(1 + ∞i)",
  },
  {
    // 18
    re: 1,
    im: -Infinity,
    description: "asech(1 - ∞i)", // ε
  },
  {
    // 19
    re: Infinity,
    im: Infinity,
    description: "asech(∞ + ∞i)",
  },
  {
    // 20
    re: Infinity,
    im: -Infinity,
    description: "asech(∞ - ∞i)",
  },
  {
    // 21
    re: -Infinity,
    im: Infinity,
    description: "asech(-∞ + ∞i)",
  },
  {
    // 22
    re: -Infinity,
    im: -Infinity,
    description: "asech(-∞ - ∞i)",
  },
  {
    // 23
    re: Infinity,
    im: NaN,
    description: "asech(∞ + NaNi)",
  },
  {
    // 24
    re: -Infinity,
    im: NaN,
    description: "asech(-∞ + NaNi)",
  },
  {
    // 25
    re: NaN,
    im: Infinity,
    description: "asech(NaN + ∞i)",
  },
  {
    // 26
    re: NaN,
    im: NaN,
    description: "asech(NaN + NaNi)",
  },
  {
    // 27
    re: 1,
    im: Number.EPSILON,
    description: "asech(1 + εi)",
  },
  {
    // 28
    re: -1,
    im: Number.EPSILON,
    description: "asech(-1 + εi)",
  },
  {
    // 29
    re: Number.MIN_VALUE,
    im: Number.MIN_VALUE,
    description: "asech(MIN_VALUE + MIN_VALUE i) <-> (MIN_VALUE = 5e-324)",
  },
  {
    // 30
    re: 1,
    im: 1e10,
    description: "asech(1 + 1e10i)",
  },
  {
    // 31
    re: true,
    im: true,
    description: "verifies symmetry: asech(-z) = πi - asech(z) for z = 1 + i",
  },
  {
    // 32
    re: true,
    im: true,
    description: "verifies conjugate symmetry: asech(conj(z)) = conj(asech(z))",
  },
];

const OctaveRes = [
  // 1 - Octave asech(0 + 0i)
  { re: Infinity, im: NaN },
  // 2 - Octave asech(2 + 0i)
  { re: 0, im: +1.047197551196598 },
  // 3 - Octave asech(1 + 0i)
  { re: 0, im: 0 },
  // 4 - Octave asech(-1 + 0i)
  { re: 0, im: +3.141592653589793 },
  // 5 - Octave asech(0 + i)
  { re: 0.881373587019543, im: -1.570796326794897 },
  // 6 - Octave asech(0 + 0.5i)
  { re: 1.44363547517881, im: -1.570796326794897 },
  // 7 - Octave asech(1 + i)
  { re: 0.530637530952518, im: -1.118517879643706 },
  // 8 - Octave asech(30 + 1i)
  { re: 1.110493427356471e-3, im: -1.537493854553468 },
  // 9 - Octave asech(-30 + 1i)
  { re: 1.110493427356471e-3, im: -1.604098799036325 },
  // 10 - Octave asech(1 + 30i)
  { re: 3.329020863483614e-2, im: -1.569687063374557 },
  // 11 - Octave asech(∞ + i)
  { re: 0, im: +1.570796326794897 },
  // 12 - Octave asech(∞ - i)
  { re: 0, im: +1.570796326794897 },
  // 13 - Octave asech(NaN + i)
  { re: NaN, im: NaN },
  // 14 - Octave asech(1e-154 + 1e-154i)
  { re: 3.54944677911363e2, im: -7.853981633974483e-1 },
  // 15 - Octave asech(-∞ + i)
  { re: 0, im: +1.570796326794897 },
  // 16 - Octave asech(-∞ - i)
  { re: 0, im: +1.570796326794897 },
  // 17 - Octave asech(1 + ∞)
  { re: 0, im: +1.570796326794897 },
  // 18 - Octave asech(1 - ∞i)
  { re: 0, im: +1.570796326794897 },
  // 19 - Octave asech(∞ + ∞i)
  { re: 0, im: +1.570796326794897 },
  // 20 - Octave asech(∞ - ∞i)
  { re: 0, im: +1.570796326794897 },
  // 21 - Octave asech(-∞ + ∞i)
  { re: 0, im: +1.570796326794897 },
  // 22 - Octave asech(-∞ - ∞i)
  { re: 0, im: +1.570796326794897 },
  // 23 - Octave asech(∞ + NaNi)
  { re: 0, im: +1.570796326794897 },
  // 24 - Octave asech(-∞ + NaNi)
  { re: 0, im: +1.570796326794897 },
  // 25 - Octave asech(NaN + ∞i)
  { re: 0, im: +1.570796326794897 },
  // 26 - Octave asech(NaN + NaNi)
  { re: NaN, im: NaN },
  // 27 - Octave asech(1 + εi)  -> ε = 2.220446049250313e-16
  { re: 1.490116119384765e-8, im: -1.490116119384765e-8 },
  // 28 - Octave asech(-1 + εi)
  { re: 1.490116119384765e-8, im: -3.141592638688632 },
  // 29 - Octave asech(min + min i) -> min = 5e-324
  { re: Infinity, im: -0.785398163397448 },
  // 30 - Octave asech(1 + 1e10i)
  { re: 1.0e-10, im: -1.570796326794897 },
  // 31 - "verifies symmetry: asech(-z) = πi - asech(z) for z = 1 + i",
  { re: true, im: true },
  // 32 - "verifies conjugate symmetry: asech(conj(z)) = conj(asech(z))",
  { re: true, im: true },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for asech(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.asech(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.asech(new Complex(test.re, test.im));
    console.log(
      `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
    );
    // Octave
    console.log(
      `Octave  -> Test ${test.description} = ${OctaveRes[i].re} + ${OctaveRes[i].im}i`
    );
  } else if (typeof test.re === "boolean") {
    console.log(`mathjs  -> Test ${test.description} = ${test.re}`);
    console.log(`Complex -> Test ${test.description} = ${test.re}`);
    console.log(`Octave -> Test ${test.description} = ${test.re}`);
  }
}
