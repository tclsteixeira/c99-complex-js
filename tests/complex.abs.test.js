// Complete Edge Case Table for abs(z) (C99)
//-------------------------------------------------------------------------
// Input z = x + yi	    Output	              Explanation
// 0.0 + 0.0i	          0.0	                  Both parts zero
// -0.0 + 0.0i	        0.0	                  Magnitude ignores signs
// 0.0 + -0.0i	        0.0	                  Same as above
// -0.0 + -0.0i	        0.0	                  Same
// 1.0 + 0.0i	          1.0	                  Real axis only
// 0.0 + 1.0i	          1.0	                  Imaginary axis only
// -1.0 + 0.0i	        1.0	                  Absolute value of real part
// 0.0 + -1.0i	        1.0	                  Absolute value of imaginary part
// 3.0 + 4.0i	          5.0	                  Classic Pythagorean triple
// Inf + 0.0i	          Inf	                  Infinity dominates
// 0.0 + Inf·i	        Inf	                  Same
// Inf + Inf·i	        Inf	                  √(∞² + ∞²) = ∞
// Inf + finite·i	      Inf	                  ∞ dominates
// finite + Inf·i	      Inf	                  ∞ dominates
// -Inf + Inf·i	        Inf	                  Same
// Inf + NaN·i	        Inf	                  IEEE 754: treat NaN as ignorable if ∞ present
// NaN + Inf·i	        Inf	                  Same
// NaN + finite·i	      NaN	                  NaN contaminates, no ∞ to dominate
// finite + NaN·i	      NaN	                  Same
// NaN + NaN·i	        NaN	                  Total uncertainty
// NaN + 0.0i	          NaN	                  No ∞ to override
// 0.0 + NaN·i	        NaN	                  Same
// Inf + -Inf·i	        Inf	                  Still ∞
// -Inf + -Inf·i	      Inf	                  Still ∞
// DBL_MIN + 0.0i	      DBL_MIN	              Very small real
// 0.0 + DBL_MIN·i	    DBL_MIN	              Very small imaginary
// DBL_MIN + DBL_MIN·i	√2·DBL_MIN ≈ 7e-324	  Subnormal range
// 1e308 + 0.0i	        1e308	                Near max finite
// -1e308 + 1e308·i	    √2·1e308 ≈ 1.414e308	Still finite
//------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.abs - C99/IEEE 754 edge cases", () => {
  // Test 1 - Both parts +0
  it("abs(0 + 0i) === 0", () => {
    const z = new Complex(0.0, 0.0);
    expect(Complex.abs(z)).toBe(0.0);
  });
  // Both parts are +0, expected result is 0

  // Test 2 - Real is -0
  it("abs(-0 + 0i) === 0", () => {
    const z = new Complex(-0.0, 0.0);
    expect(Complex.abs(z)).toBe(0.0);
  });
  // Negative zero real part, still magnitude 0

  // Test 3 - Imaginary is -0
  it("abs(0 - 0i) === 0", () => {
    const z = new Complex(0.0, -0.0);
    expect(Complex.abs(z)).toBe(0.0);
  });
  // Negative zero imaginary part, magnitude is still 0

  // Test 4 - Both parts -0
  it("abs(-0 - 0i) === 0", () => {
    const z = new Complex(-0.0, -0.0);
    expect(Complex.abs(z)).toBe(0.0);
  });
  // Magnitude ignores sign of zeros

  // Test 5 - Real only positive
  it("abs(1 + 0i) === 1", () => {
    const z = new Complex(1.0, 0.0);
    expect(Complex.abs(z)).toBe(1.0);
  });

  // Test 6 - Imaginary only positive
  it("abs(0 + 1i) === 1", () => {
    const z = new Complex(0.0, 1.0);
    expect(Complex.abs(z)).toBe(1.0);
  });

  // Test 7 - Real only negative
  it("abs(-1 + 0i) === 1", () => {
    const z = new Complex(-1.0, 0.0);
    expect(Complex.abs(z)).toBe(1.0);
  });

  // Test 8 - Imaginary only negative
  it("abs(0 - 1i) === 1", () => {
    const z = new Complex(0.0, -1.0);
    expect(Complex.abs(z)).toBe(1.0);
  });

  // Test 9 - Typical finite case
  it("abs(3 + 4i) === 5", () => {
    const z = new Complex(3.0, 4.0);
    expect(Complex.abs(z)).toBe(5.0);
  });

  // Test 10 - Real infinity
  it("abs(Inf + 0i) === Inf", () => {
    const z = new Complex(Infinity, 0.0);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 11 - Imaginary infinity
  it("abs(0 + Inf·i) === Inf", () => {
    const z = new Complex(0.0, Infinity);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 12 - Both parts infinite
  it("abs(Inf + Inf·i) === Inf", () => {
    const z = new Complex(Infinity, Infinity);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 13 - Mixed finite and Inf
  it("abs(Inf + 1i) === Inf", () => {
    const z = new Complex(Infinity, 1.0);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 14 - Mixed finite and Inf imaginary
  it("abs(1 + Inf·i) === Inf", () => {
    const z = new Complex(1.0, Infinity);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 15 - Negative Inf real + Inf imaginary
  it("abs(-Inf + Inf·i) === Inf", () => {
    const z = new Complex(-Infinity, Infinity);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 16 - NaN real, Inf imag
  it("abs(NaN + Inf·i) === Inf", () => {
    const z = new Complex(NaN, Infinity);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 17 - Inf real, NaN imag
  it("abs(Inf + NaN·i) === Inf", () => {
    const z = new Complex(Infinity, NaN);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 18 - NaN real, finite imag
  it("abs(NaN + 1i) === NaN", () => {
    const z = new Complex(NaN, 1.0);
    expect(Number.isNaN(Complex.abs(z))).toBe(true);
  });

  // Test 19 - Finite real, NaN imag
  it("abs(1 + NaN·i) === NaN", () => {
    const z = new Complex(1.0, NaN);
    expect(Number.isNaN(Complex.abs(z))).toBe(true);
  });

  // Test 20 - Both parts NaN
  it("abs(NaN + NaN·i) === NaN", () => {
    const z = new Complex(NaN, NaN);
    expect(Number.isNaN(Complex.abs(z))).toBe(true);
  });

  // Test 21 - NaN real, zero imaginary
  it("abs(NaN + 0i) === NaN", () => {
    const z = new Complex(NaN, 0.0);
    expect(Number.isNaN(Complex.abs(z))).toBe(true);
  });

  // Test 22 - Zero real, NaN imaginary
  it("abs(0 + NaN·i) === NaN", () => {
    const z = new Complex(0.0, NaN);
    expect(Number.isNaN(Complex.abs(z))).toBe(true);
  });

  // Test 23 - Inf real, -Inf imaginary
  it("abs(Inf - Inf·i) === Inf", () => {
    const z = new Complex(Infinity, -Infinity);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 24 - -Inf real, -Inf imaginary
  it("abs(-Inf - Inf·i) === Inf", () => {
    const z = new Complex(-Infinity, -Infinity);
    expect(Complex.abs(z)).toBe(Infinity);
  });

  // Test 25 - Minimum double precision positive value (real)
  it("abs(DBL_MIN + 0i) === DBL_MIN", () => {
    const z = new Complex(Number.MIN_VALUE, 0.0);
    expect(Complex.abs(z)).toBe(Number.MIN_VALUE);
  });

  // Test 26 - Minimum double precision (imaginary)
  it("abs(0 + DBL_MIN·i) === DBL_MIN", () => {
    const z = new Complex(0.0, Number.MIN_VALUE);
    expect(Complex.abs(z)).toBe(Number.MIN_VALUE);
  });

  // Test 27 - DBL_MIN on both parts
  it("abs(DBL_MIN + DBL_MIN·i)", () => {
    const z = new Complex(Number.MIN_VALUE, Number.MIN_VALUE);
    const expected = Math.SQRT2 * Number.MIN_VALUE;
    expect(Complex.abs(z)).toBeCloseTo(expected, 12);
  });

  // Test 28 - Large magnitude real
  it("abs(1e308 + 0i) === 1e308", () => {
    const z = new Complex(1e308, 0.0);
    expect(Complex.abs(z)).toBe(1e308);
  });

  // Test 29 - Large real/imag pair
  it("abs(-1e308 + 1e308i)", () => {
    const z = new Complex(-1e308, 1e308);
    const expected = Math.hypot(-1e308, 1e308);
    expect(Complex.abs(z)).toBeCloseTo(expected, 4);
  });
});
