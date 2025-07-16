/**
 * Tests for mathjs, Complex.fromPolar(z) and Wolfram comparison.
 */

import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

/**
 * Creates a mathjs complex number instance from polar coordinates (magnitude and angle in radians).
 * @param {*} r - The input magnitude.
 * @param {*} phi - The input angle in radians.
 * @returns Returns a mathjs complex number instance from polar coordinates (magnitude and angle in radians).
 */
const fromPolar = (r, phi) => {
  return math.complex({ r: r, phi: phi });
};

const tests = [
  {
    r: 1,
    phi: 0,
    description: "fromPolar(1, 0)",
  },
  {
    r: 1,
    phi: Math.PI / 2,
    description: "fromPolar(1, Math.PI / 2)",
  },
  {
    r: -1,
    phi: 0,
    description: "fromPolar(-1, 0)",
  },
  {
    r: 1,
    phi: 3 * Math.PI,
    description: "fromPolar(1, 3 * Math.PI)",
  },
  {
    r: 1,
    phi: -3 * Math.PI,
    description: "fromPolar(1, -3 * Math.PI)",
  },
  {
    r: 0,
    phi: Math.PI / 4,
    description: "fromPolar(0, Math.PI / 4)",
  },
  {
    r: NaN,
    phi: 0,
    description: "fromPolar(NaN, 0)",
  },
  {
    r: 1,
    phi: NaN,
    description: "fromPolar(1, NaN)",
  },
  {
    r: Infinity,
    phi: 0,
    description: "fromPolar(∞, 0)",
  },
  {
    r: Infinity,
    phi: Math.PI / 2,
    description: "fromPolar(∞, Math.PI / 2)",
  },
  {
    r: 1,
    phi: Infinity,
    description: "fromPolar(1, ∞)",
  },
  {
    r: 1,
    phi: 1000 * Math.PI,
    description: "fromPolar(1, 1000 * Math.PI)",
  },
  {
    r: -1,
    phi: 3 * Math.PI,
    description: "fromPolar(-1, 3 * Math.PI)",
  },
  {
    r: 1,
    phi: 1e-15,
    description: "fromPolar(1, 1e-15)",
  },
  {
    r: 1,
    phi: -1e-15,
    description: "fromPolar(1, -1e-15)",
  },
  {
    r: 1,
    phi: Math.PI + 1e-15,
    description: "fromPolar(1, Math.PI + 1e-15)",
  },
  {
    r: 1,
    phi: Math.PI - 1e-15,
    description: "fromPolar(1, Math.PI - 1e-15)",
  },
  {
    r: 1,
    phi: -Math.PI + 1e-15,
    description: "fromPolar(1, -Math.PI + 1e-15)",
  },
  {
    r: 1,
    phi: -Math.PI - 1e-15,
    description: "fromPolar(1, -Math.PI - 1e-15)",
  },
];

/**
 * Wolfram results
 */
const WolframRes = [
  // Wolfram fromPolar(1, 0) = 1 * (cos(0) + i sin(0)) i
  { re: 1, im: 0 },

  // Wolfram fromPolar(1, PI / 2)
  { re: 0, im: 1 },

  // Wolfram fromPolar(-1, 0)
  { re: -1, im: 0 },

  // Wolfram fromPolar(1, 3 * Math.PI)
  { re: -1, im: 0 },

  // Wolfram fromPolar(1, -3 * Math.PI)
  { re: -1, im: 0 },

  // Wolfram fromPolar(0, Math.PI / 4i)
  { re: 0, im: 0 },

  // Wolfram fromPolar(NaN, 0)
  { re: "?", im: "?" },

  // Wolfram fromPolar(1, NaNi)
  { re: "?", im: "?" },

  // Wolfram fromPolar(∞, 0)
  { re: "∞", im: "?" },

  // Wolfram fromPolar(∞, Math.PI / 2)
  { re: 0, im: "∞" },

  // Wolfram fromPolar(1, ∞i)
  { re: "[-1..1]", im: "[-1..1]" },

  // Wolfram fromPolar(1, 1000 * Math.PI)
  { re: 1, im: 0 },

  // Wolfram fromPolar(-1, 3 * Math.PI)
  { re: 1, im: 0 },

  // Wolfram fromPolar(1, 1e-15)
  {
    re: 0.9999999999999999999999999999995,
    im: 9.999999999999999999999999999998e-16,
  },

  // Wolfram fromPolar(1, -1e-15)
  {
    re: 0.9999999999999999999999999999995,
    im: -9.999999999999999999999999999998e-16,
  },

  // Wolfram fromPolar(1, Math.PI + 1e-15)
  {
    re: -0.9999999999999999999999999999995,
    im: -9.999999999999999999999999999998e-16,
  },

  // Wolfram fromPolar(1, Math.PI - 1e-15)
  {
    re: -0.9999999999999999999999999999995,
    im: 9.999999999999999999999999999998e-16,
  },

  // Wolfram fromPolar(1, -Math.PI + 1e-15)
  {
    re: -0.9999999999999999999999999999995,
    im: -9.999999999999999999999999999998e-16,
  },

  // Wolfram fromPolar(1, -Math.PI - 1e-15)
  {
    re: -0.9999999999999999999999999999995,
    im: +9.999999999999999999999999999998e-16,
  },
];

let mathjsRes, complexRes;
console.log(
  "\n-------------------------------------------------------------------" +
    "\nComparing results for fromPolar(r, phi) for all test cases" +
    "\nNote: Wolfram assumes fromPolar(r, phi) <=> r * (cos(phi) + i sin(phi))" +
    "\n-------------------------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\n-- Test " + (i + 1));

  // mathjs test
  mathjsRes = fromPolar(test.r, test.phi);
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.polar(test.r, test.phi);
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
