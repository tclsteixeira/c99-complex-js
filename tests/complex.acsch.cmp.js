// Special Cases Table for acsch(z)
// Input (z)	                Output (acsch(z))	Test Reference
// acsch(0 + 0i)	            ±∞ + NaNi (sign of real part undefined)	Test 1
// acsch(±i)	                0 ∓ π/2 i	Tests 2–3
// acsch(±∞ + yi) (finite y)	0 + 0i	Tests 4–7
// acsch(x ± ∞i) (finite x)	  NaN + NaNi	Tests 8–9
// acsch(±∞ ± ∞i)	            0 + 0i	Tests 10–13
// acsch(x + NaNi) (finite/infinite x)	NaN + NaNi	Tests 14–15
// acsch(NaN + yi) (finite y)	NaN + NaNi	Test 16
// acsch(NaN ± ∞i)	          NaN + NaNi	Test 17
// acsch(NaN + NaNi)	        NaN + NaNi	Test 18
//
// Symmetry: acsch(-z)	-acsch(z)	Test 19
// Conjugate symmetry: acsch(conj(z))	conj(acsch(z))	Test 20
// Near branch cuts: z ≈ ±i ± εi	Complex results	Tests 21–22
// Tiny inputs: z = MIN_VALUE + MIN_VALUE i	`≈ -ln(2/	z
// Large	                    z	          : z = 1 + 1e10i

import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "acsch(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "acsch(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: 1,
    description: "acsch(0 + i)",
  },
  {
    // 4
    re: 1,
    im: 1,
    description: "acsch(1 + i)",
  },
  {
    // 5
    re: NaN,
    im: 0,
    description: "acsch(NaN + 0i)",
  },
  {
    // 6
    re: 0,
    im: NaN,
    description: "acsch(0 + NaNi)",
  },
  {
    // 7
    re: NaN,
    im: NaN,
    description: "acsch(NaN + NaNi)",
  },
  {
    // 8
    re: Infinity,
    im: 0,
    description: "acsch(∞ + 0i)",
  },
  {
    // 9
    re: -Infinity,
    im: 0,
    description: "acsch(-∞ + 0i)",
  },
  {
    // 10
    re: Infinity,
    im: Math.PI,
    description: "acsch(∞ + i)",
  },
  {
    // 11
    re: -Infinity,
    im: Math.PI,
    description: "acsch(-∞ + i)",
  },
  {
    // 12
    re: Infinity,
    im: NaN,
    description: "acsch(∞ + NaNi)",
  },
  {
    // 13
    re: 0,
    im: Infinity,
    description: "acsch(0 + ∞i)",
  },
  {
    // 14
    re: 1,
    im: Infinity,
    description: "acsch(1 + ∞i)",
  },
  {
    // 15
    re: -Infinity,
    im: NaN,
    description: "acsch(-∞ + NaNi)",
  },
  {
    // 16
    re: 1e-15,
    im: 0,
    description: "acsch(1e-15 + 0i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "acsch(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 0,
    im: 0.5,
    description: "acsch(0 + 0.5i)",
  },
  {
    // 19
    re: -1,
    im: -1,
    description: "Checks symmetry acsch(-z) = -acsch(z) for z = 1 + i.",
  },
  {
    // 20
    re: 1,
    im: -1,
    description:
      "Checks conjugate symmetry acsch(conj(z)) = conj(acsch(z)) for z = 1 + i.",
  },
  {
    // 21
    re: 0,
    im: -1,
    description: "acsch(0 - i)",
  },
  {
    // 22
    re: Infinity,
    im: Infinity,
    description: "acsch(∞ + ∞i)",
  },
  {
    // 23
    re: Infinity,
    im: -Infinity,
    description: "acsch(∞ - ∞i)",
  },
  {
    // 24
    re: -Infinity,
    im: Infinity,
    description: "acsch(-∞ + ∞i)",
  },
  {
    // 25
    re: -Infinity,
    im: -Infinity,
    description: "acsch(-∞ - ∞i)",
  },
  {
    // 26
    re: 1,
    im: Number.EPSILON,
    description: "acsch(1 + εi)", // ε = Number.EPSILON
  },
  {
    // 27
    re: -1,
    im: Number.EPSILON,
    description: "acsch(-1 + εi)", // ε = Number.EPSILON
  },
  {
    // 28
    re: Number.MIN_VALUE,
    im: Number.MIN_VALUE,
    description: "acsch(Number.MIN_VALUE + Number.MIN_VALUE i)",
  },
  {
    // 29
    re: 1,
    im: 1e10,
    description: "acsch(1 + 1e10i)",
  },
];

const WolframRes = [
  // 1 - Wolfram acsch(0 + 0i)
  { re: "∞^~", im: "?" },
  // 2 - Wolfram acsch(1 + 0i)
  { re: 0.88137358701954302523, im: 0 },
  // 3 - Wolfram acsch(0 + i)
  { re: 0, im: -Math.PI / 2 },
  // 4 - Wolfram acsch(1 + i)
  { re: 0.5306375309525178260165, im: -0.452278447151190682063658 },
  // 5 - Wolfram acsch(NaN + 0i) = NaN
  { re: "?", im: "?" },
  // 6 - Wolfram acsch(0 + NaNi) = NaN
  { re: "?", im: "?" },
  // 7 - Wolfram acsch(NaN + NaNi)
  { re: "?", im: "?" },
  // 8 - Wolfram acsch(∞ + 0i)
  { re: 0, im: 0 },
  // 9 - Wolfram acsch(-∞ + 0i)
  { re: 0, im: 0 },
  // 10 - Wolfram acsch(∞ + i)
  { re: 0, im: 0 },
  // 11 - Wolfram acsch(-∞ + i)
  { re: 0, im: 0 },
  // 12 - Wolfram acsch(∞ + NaNi)
  { re: "?", im: "?" },
  // 13 - Wolfram acsch(0 + ∞i)
  { re: 0, im: 0 },
  // 14 - Wolfram acsch(1 + ∞i)
  { re: 0, im: 0 },
  // 15 - Wolfram acsch(-∞ + NaNi)
  { re: "?", im: "?" },
  // 16 - Wolfram acsch(1e-15 + 0i)
  { re: 35.231923575470630569687, im: 0 },
  // 17 - Wolfram acsch(1e-15 + 1e-15i)
  { re: 34.885349985190657914978, im: -0.78539816339744830961566 },
  // 18 - Wolfram acsch(0 + 0.5i)
  { re: -1.316957896924816708625, im: -1.57079632679489661923 },
  // 19 - Wolfram Checks symmetry acsch(-z) = -acsch(z) for z = 1 + i.
  { re: -0.5306375309525178260165, im: +0.45227844715119068206 },
  // 20 - Wolfram Checks conjugate symmetry acsch(conj(z)) = conj(acsch(z)) for z = 1 + i.
  { re: 0.5306375309525178260165, im: +0.45227844715119068206 },
  // 21 - Wolfram acsch(0 - i)
  { re: 0, im: Math.PI / 2 },
  // 22 - Wolfram acsch(∞ + ∞i)
  { re: "undef", im: "undef" },
  // 23 - Wolfram acsch(∞ - ∞i)
  { re: "undef", im: "undef" },
  // 24 - Wolfram acsch(-∞ + ∞i)
  { re: "undef", im: "undef" },
  // 25 - Wolfram acsch(-∞ - ∞i)
  { re: "undef", im: "undef" },
  // 26 - Wolfram acsch(1 + εi) with ε = 2.220446049250313e-16 → ≈ -ln(2/|z|) - π/2 i (near branch cut).
  { re: 0.88137358701954302523, im: -1.5700924586837750022257e-16 },
  // 27 - Wolfram acsch(-1 + εi) with ε = 2.220446049250313e-16 → ≈ -ln(2/|z|) + π/2 i (near branch cut).
  { re: -0.88137358701954302523, im: -1.5700924586837750022257e-16 },
  // 28 - Wolfram acsch(Number.MIN_VALUE + Number.MIN_VALUE i) with MIN_VALUE = 5e-324 → ≈ -ln(2/|z|) + arg(-z)i.
  { re: 744.774705807916673901937, im: -0.78539816339744830961566 },
  // 29 - Wolfram acsch(1 + 1e10i) → ≈ 1e-10 - π/2 i.
  { re: 9.999999999999999999949e-21, im: -9.999999999999999999916e-11 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for acsch(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.acsch(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  if (i + 1 === 28) {
    console.log("Test 28:");
  }

  // Complex test
  complexRes = Complex.acsch(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
