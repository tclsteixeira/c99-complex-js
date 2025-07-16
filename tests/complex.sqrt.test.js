// C99 sqrt(z) Edge‑Case Table
//-----------------------------------------------------
// Input z = x + yi	                  Output csqrt(z)	            Explanation
// 0.0 + 0.0i	                        0.0 + 0.0i	                √0 = 0, preserves +0 in both parts
// -0.0 + 0.0i	                      0.0 + 0.0i	                Branch cut uses sign(imaginary); both zeros positive
// 0.0 + -0.0i	                      0.0 + -0.0i	                Imaginary becomes -0 (below branch cut), real stays +0
// -0.0 + -0.0i	                      0.0 + -0.0i	                Same as above
// x > 0 (finite), y = 0.0	          √x + 0.0i	                  Real positive -> sqrt is positive real
// x < 0 (finite), y = 0.0	          +0.0 + sqrt(-x)·i	          sqrt of negative real is purely imaginary
// x = 0.0, y > 0	                    √(y/2) + i√(y/2)	          Pure positive imaginary → both parts equal
// x = 0.0, y < 0	                    sqrt(-y/2) - sqrt(-y/2)·i	  Principal root lies in the 4th quadrant
// Inf + 0.0i	                        Inf + 0.0i	                sqrt(∞) = ∞
// -Inf + 0.0i	                      0.0 + Inf·i	                sqrt(−∞) = infinite imaginary
// 0.0 + Inf·i	                      Inf + Inf·i	                magnitude infinite, both parts infinite
// -Inf - 0.0i                        0 - Inf·i                   Real: +0.0 Imag: +∞, but preserving the sign of the imaginary part, so: -∞
// ±Inf + Inf·i                       Inf + Inf·i or Inf + NaN·i  x = ±Inf, y = ±Inf: real = Inf, imaginary = NaN (due to indeterminate direction)
// ±Inf - Inf·i                       Inf - Inf·i or Inf + NaN·i  x = ±Inf, y = ±Inf: real = Inf, imaginary = NaN (due to indeterminate direction)
// NaN + finite·i or finite + NaN·i	  NaN + NaN·i	                NaN contaminates
// NaN + NaN·i	                      NaN + NaN·i	                Full NaN
// ±Inf + NaN·i or NaN ± Inf·i	      Inf + NaN·i	                Infinite part dominates magnitude, NaN in imaginary

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

// C99/IEEE 754 edge case tests for Complex.sqrt

describe("Complex.sqrt - C99/IEEE 754 edge cases", () => {
  // Test 1 - sqrt(0 + 0i) = 0 + 0i
  it("sqrt(0 + 0i) === 0 + 0i", () => {
    const z = new Complex(0.0, 0.0);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(0.0);
  });

  // Test 2 - sqrt(-0 + 0i) = +0 + 0i
  it("sqrt(-0 + 0i) === +0 + 0i", () => {
    const z = new Complex(-0.0, 0.0);
    const result = Complex.sqrt(z);
    expect(Object.is(result.re, 0.0)).toBe(true);
    expect(Object.is(result.im, 0.0)).toBe(true);
  });

  // Test 3 - sqrt(0 - 0i) = +0 - 0i
  it("sqrt(0 - 0i) === +0 - 0i", () => {
    const z = new Complex(0.0, -0.0);
    const result = Complex.sqrt(z);
    expect(Object.is(result.re, 0.0)).toBe(true);
    expect(Object.is(result.im, -0.0)).toBe(true);
  });

  // Test 4 - sqrt(-0 - 0i) = +0 - 0i
  it("sqrt(-0 - 0i) === +0 - 0i", () => {
    const z = new Complex(-0.0, -0.0);
    const result = Complex.sqrt(z);
    expect(Object.is(result.re, 0.0)).toBe(true);
    expect(Object.is(result.im, -0.0)).toBe(true);
  });

  // Test 5 - sqrt(4 + 0i)
  it("sqrt(4 + 0i) === 2 + 0i", () => {
    const z = new Complex(4.0, 0.0);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(2.0);
    expect(result.im).toBe(0.0);
  });

  // Test 6 - sqrt(-4 + 0i) = 0 + 2i
  it("sqrt(-4 + 0i) === 0 + 2i", () => {
    const z = new Complex(-4.0, 0.0);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(0.0);
    expect(result.im).toBeCloseTo(2.0, 15);
  });

  // Test 7 - sqrt(0 + 4i)
  it("sqrt(0 + 4i)", () => {
    const z = new Complex(0.0, 4.0);
    const result = Complex.sqrt(z);
    expect(result.re).toBeCloseTo(1.414213562373095, 15);
    expect(result.im).toBeCloseTo(1.414213562373095, 15);
  });

  // Test 8 - sqrt(0 - 4i) = sqrt(2) - sqrt(2)i
  it("sqrt(0 - 4i) === sqrt(2) - sqrt(2)i", () => {
    const z = new Complex(0.0, -4.0);
    const expected = Math.sqrt(2);
    const result = Complex.sqrt(z);
    expect(result.re).toBeCloseTo(expected, 15);
    expect(result.im).toBeCloseTo(-expected, 15);
  });

  // Test 9 - sqrt(Inf + 0i)
  it("sqrt(Inf + 0i) === Inf + 0i", () => {
    const z = new Complex(Infinity, 0.0);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(0.0);
  });

  // Test 10 - sqrt(-Inf + 0i)
  it("sqrt(-Inf + 0i) === 0 + Inf·i", () => {
    const z = new Complex(-Infinity, 0.0);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(Infinity);
  });

  // Test 11 - sqrt(0 + Inf·i)
  it("sqrt(0 + Inf·i) === Inf + Inf·i", () => {
    const z = new Complex(0.0, Infinity);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });

  // Test 12 - sqrt(-Inf - 0i) = 0 - Inf·i
  it("sqrt(-Inf - 0i) === 0 - Inf·i", () => {
    // The square root of a negative real number on the real
    // axis with a negative zero imaginary component yields:
    //    Real: +0.0
    //    Imag: +∞, but preserving the sign of the imaginary
    //          part, so: -∞
    const z = new Complex(-Infinity, -0.0);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(-Infinity);
  });

  // Test 13 - sqrt(Inf + Inf·i)
  it("sqrt(Inf + Inf·i) === Inf + Inf·i", () => {
    const z = new Complex(Infinity, Infinity);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });

  // Test 14 - sqrt(-Infinity + Infinity·i)
  it("sqrt(-Inf + Inf·i) === Inf + Inf·i", () => {
    const z = new Complex(-Infinity, Infinity);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });

  // Test 15 - sqrt(Infinity - Infinity·i)
  it("sqrt(Inf - Inf·i) === Inf - Inf·i", () => {
    const z = new Complex(Infinity, -Infinity);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(-Infinity);
  });

  // Test 16 - sqrt(-Infinity - Infinity·i)
  it("sqrt(-Inf - Inf·i) === Inf - Inf·i", () => {
    const z = new Complex(-Infinity, -Infinity);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(-Infinity);
  });

  // Test 17 - sqrt(NaN + 2.0i)
  it("sqrt(NaN + 2i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, 2.0);
    const result = Complex.sqrt(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 18 - sqrt(2.0 + NaN·i)
  it("sqrt(2 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(2.0, NaN);
    const result = Complex.sqrt(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 19 - sqrt(NaN + NaN·i)
  it("sqrt(NaN + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.sqrt(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 20 - sqrt(Infinity + NaN·i)
  it("sqrt(Inf + NaN·i) === Inf + NaN·i", () => {
    const z = new Complex(Infinity, NaN);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 21 - sqrt(-Infinity + NaN·i)
  it("sqrt(-Inf + NaN·i) === Inf + NaN·i", () => {
    const z = new Complex(-Infinity, NaN);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 22 - sqrt(NaN - Infinity·i)
  it("sqrt(NaN - Inf·i) === Inf - NaN·i", () => {
    const z = new Complex(NaN, -Infinity);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 23 - sqrt(NaN + Infinity·i)
  it("sqrt(NaN + Inf·i) === Inf + NaN·i", () => {
    const z = new Complex(NaN, Infinity);
    const result = Complex.sqrt(z);
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 24 - sqrt(+0 + NaN·i) = NaN + NaN·i
  it("sqrt(+0 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(0.0, NaN);
    const result = Complex.sqrt(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 25 - sqrt(-0 + NaN·i) = NaN + NaN·i
  it("sqrt(-0 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(-0.0, NaN);
    const result = Complex.sqrt(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });
});
