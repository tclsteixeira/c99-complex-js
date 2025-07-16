// C99 scenarios that still matter for log2(z)
// Because log2(z) is just a linear transformation of ln(z), the same edge behaviors will apply:
// -------------------------------------------------------------------------------------
// Input z = x + yi       Output = ln(z) / ln(10)             Explanation
// -------------------------------------------------------------------------------------
// ±0 + 0i	              -∞ / ln(2) + ±0 / ln(2)·i         Should result in signed infinities
// 0 + y·i (y > 0)	      log2(|y|) + i·π/(2·ln(2))         Magnitude: |z| = |y|, arg = π/2
// 0 + y·i (y < 0)	      log2(|y|) - i·π/(2·ln(2))         Arg = -π/2
// -x + 0i	              log2(x) + ±π / ln(2)·i            Arg from negative real axis
// ±∞ + ±∞·i	            ∞ + angle / ln(2)·i               Infinite magnitude, defined angle
// NaN in any component	  NaN + NaN·i                       Must propagate

// log2(z) — Derived from ln(z)
import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

// Helper constant
const PI = Math.PI;
const LN2 = Math.LN2;

describe("Complex.log2 — derived from ln(z)", () => {
  // Test 1 - z = log2(+0 + 0i)
  it("log2(+0 + 0i) === -Infinity + 0i", () => {
    const z = new Complex(0.0, 0.0);
    const result = Complex.log2(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBe(0.0);
  });

  // Test 2 - z = log2(-0 + 0i)
  it("log2(-0 + 0i) === -Infinity + πi / LN2", () => {
    const z = new Complex(-0.0, 0.0);
    const result = Complex.log2(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBeCloseTo(PI / LN2);
  });

  // Test 3 - z = log2(4 + 0i)
  it("log2(4 + 0i) === log2(4) + 0i", () => {
    const z = new Complex(4, 0);
    const result = Complex.log2(z);
    expect(result.re).toBeCloseTo(Math.log2(4));
    expect(result.im).toBe(0);
  });

  // Test 4 - z = log2(-4 + 0i)
  it("log2(-4 + 0i) === log2(4) + πi / LN2", () => {
    const z = new Complex(-4, 0);
    const result = Complex.log2(z);
    expect(result.re).toBeCloseTo(Math.log2(4));
    expect(result.im).toBeCloseTo(PI / LN2);
  });

  // Test 5 - z = log2(0 + 5i)
  it("log2(0 + 5i) === log2(5) + π/2·i / LN2", () => {
    const z = new Complex(0, 5);
    const result = Complex.log2(z);
    expect(result.re).toBeCloseTo(Math.log2(5));
    expect(result.im).toBeCloseTo(PI / 2 / LN2);
  });

  // Test 6 - z = log2(0 - 6i)
  it("log2(0 - 6i) === log2(6) - π/2·i / LN2", () => {
    const z = new Complex(0, -6);
    const result = Complex.log2(z);
    expect(result.re).toBeCloseTo(Math.log2(6));
    expect(result.im).toBeCloseTo(-PI / 2 / LN2);
  });

  // Test 7 - z = log2(∞ + 0i)
  it("log2(∞ + 0i) === ∞ + 0i", () => {
    const z = new Complex(Infinity, 0);
    const result = Complex.log2(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(0);
  });

  // Test 8 - z = log2(-∞ + 0i)
  it("log2(-∞ + 0i) === ∞ + πi / LN2", () => {
    const z = new Complex(-Infinity, 0);
    const result = Complex.log2(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(PI / LN2);
  });

  // Test 9 - z = log2(NaN + 0i)
  it("log2(NaN + 0i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, 0);
    const result = Complex.log2(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 10 - z = log2(0 + NaN·i)
  it("log2(0 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(0, NaN);
    const result = Complex.log2(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });
});

/*

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.log2", () => {
  // Test 1: Standard complex number
  it("computes log2(3 + 4i) correctly", () => {
    const z = new Complex(3, 4);
    const result = Complex.log2(z);
    const lnZ = Complex.ln(z); // log2(z) = ln(z) / ln(2)
    const expectedReal = lnZ.real / Math.LN2;
    const expectedImag = lnZ.imag / Math.LN2;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 2: Positive real number
  it("computes log2(2 + 0i) correctly", () => {
    const z = new Complex(2, 0);
    const result = Complex.log2(z);
    expect(result.real).toBeCloseTo(1, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 3: Negative real number
  it("computes log2(-2 + 0i) correctly", () => {
    const z = new Complex(-2, 0);
    const result = Complex.log2(z);
    const expectedReal = Math.log2(2);
    const expectedImag = Math.PI / Math.LN2;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 4: Pure imaginary number
  it("computes log2(0 + 1i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.log2(z);
    const expectedReal = 0;
    const expectedImag = Math.PI / 2 / Math.LN2;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 5: Negative pure imaginary number
  it("computes log2(0 - 1i) correctly", () => {
    const z = new Complex(0, -1);
    const result = Complex.log2(z);
    const expectedReal = 0;
    const expectedImag = -Math.PI / 2 / Math.LN2;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 6: Zero complex number
  it("computes log2(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.log2(z);
    expect(result.real).toBe(Number.NEGATIVE_INFINITY);
    expect(result.imag).toBe(0); // Convention: arg(0) = 0
  });

  // Test 7: NaN input
  it("computes log2(NaN + NaNi) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.log2(z);
    expect(result.real).toBeNaN();
    expect(result.imag).toBeNaN();
  });

  // Test 8: Infinity real part
  it("computes log2(∞ + 0i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 0);
    const result = Complex.log2(z);
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 9: Complex infinity
  it("computes log2(∞ + ∞i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.log2(z);
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    const expectedImag = Math.PI / 4 / Math.LN2;
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 10: Large magnitude
  it("computes log2(1e150 + 1e150i) correctly", () => {
    const z = new Complex(1e150, 1e150);
    const result = Complex.log2(z);
    const lnZ = Complex.ln(z);
    // Wolfram log2(1e150 + 1e150i) =
    //      498.7892142331043521805479144234085263797247089536870918082134593723902164... +
    //      1.133090035456798452406920736429166702542965366930948896046504136985150238... i

    //      /usr/bin/node --experimental-network-inspection ./test_log2_mathjs.js
    //        Math.js Result:
    //          Real: 498.78921423310436
    //          Imag: 1.1330900354567985

    // Result Complex.log2(1e150 + 1e150i) = 498.78921423310436 + 1.1330900354567983i

    // console.log(
    //   `Result Complex.log2(1e150 + 1e150i) = ${result.toString(false)}`
    // );
    // const expectedReal = lnZ.real / Math.LN2;
    const expectedReal = 498.78921423310435218; // Wolfram
    // const expectedImag = lnZ.imag / Math.LN2;
    const expectedImag = 1.133090035456798452;
    expect(result.real).toBeCloseTo(expectedReal, 12); // 3 digits for integer part plus 12 digits for frac part = 15 digits precision
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 11: Small magnitude
  it("computes log2(1e-150 + 1e-150i) correctly", () => {
    const z = new Complex(1e-150, 1e-150);
    const result = Complex.log2(z);
    const lnZ = Complex.ln(z);
    const expectedReal = lnZ.real / Math.LN2;
    const expectedImag = lnZ.imag / Math.LN2;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 12: Negative real, small imaginary
  it("computes log2(-1 + 1e-10i) correctly", () => {
    const z = new Complex(-1, 1e-10);
    const result = Complex.log2(z);
    const lnZ = Complex.ln(z);
    // Wolfram log2(-1 + 1e-10i) =
    //      7.21347520444481703676355602898723660194947210291336386114280573654... × 10^-21 +
    //      4.53236014168292430553878660498115524041863524178358141160763680731... i

    // const expectedReal = lnZ.real / Math.LN2;
    // const expectedImag = lnZ.imag / Math.LN2;
    const expectedReal = 7.21347520444481703676e-21; // Wolfram
    const expectedImag = 4.5323601416829243055; // Wolfram
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 13: Positive real, negative imaginary
  it("computes log2(1 - 1i) correctly", () => {
    const z = new Complex(1, -1);
    const result = Complex.log2(z);
    const lnZ = Complex.ln(z);
    const expectedReal = lnZ.real / Math.LN2;
    const expectedImag = lnZ.imag / Math.LN2;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 14: Infinity with finite imaginary
  it("computes log2(∞ + 1i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.log2(z);
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 15: Property: log2(z) = ln(z) / ln(2)
  it("verifies log2(1 + 1i) = ln(1 + 1i) / ln(2)", () => {
    const z = new Complex(1, 1);
    const result = Complex.log2(z);
    const lnZ = Complex.ln(z);
    const expectedReal = lnZ.real / Math.LN2;
    const expectedImag = lnZ.imag / Math.LN2;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });
});
*/
