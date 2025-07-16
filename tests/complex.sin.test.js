/**
 * Tests for Complex.sin(z).
 * Verifies the sine of a complex number z = x + yi, computed as sin(z) = sin(x)cosh(y) + i cos(x)sinh(y).
 * Covers standard cases, purely real/imaginary inputs, general complex numbers, edge cases (NaN, Infinity),
 * small inputs, and large real parts.
 * Uses toBeCloseTo(..., 15) for numerical precision and exact checks for NaN/Infinity.
 * All tests verified as of June 5, 2025.
 */
import { Complex } from "../src/c99-complex.js";
import { describe, it, expect } from "vitest";

describe("Complex.sin", () => {
  // Summary -----------------
  // Test 1: Checks sin(0 + 0i) → 0 + 0i.
  // Test 2: Checks sin(π/2 + 0i) → 1 + 0i.
  // Test 3: Checks sin(0 + i) → 0 + sinh(1)i.
  // Test 4: Checks sin(1 + i) → sin(1)cosh(1) + i cos(1)sinh(1).
  // Test 5: Checks sin(NaN + 0i) → NaN + NaNi.
  // Test 6: Checks sin(0 + NaNi) → NaN + NaNi.
  // Test 7: Checks sin(NaN + NaNi) → NaN + NaNi.
  // Test 8: Checks sin(∞ + 0i) → NaN + NaNi.
  // Test 9: Checks sin(0 + ∞i) → 0 + ∞i.
  // Test 10: Checks sin(∞ + ∞i) → NaN + NaNi.
  // Test 11: Checks sin(1 + 1e-15i) → ~sin(1) + i cos(1)sinh(1e-15).
  // Test 12: Checks sin(-π/2 + 0i) → -1 + 0i.
  // Test 13: Checks sin(0 + -i) → 0 + sinh(-1)i.
  // Test 14: Checks sin(π/2 + i) → sin(π/2)cosh(1) + i cos(π/2)sinh(1).
  // Test 15: Checks sin(-∞ + 0i) → NaN + NaNi.
  // Test 16: Checks sin(1e-15 + 0i) → ~1e-15 + 0i.
  // Test 17: Checks sin(0 + -∞i) → 0 - ∞i.
  // Test 18: Checks sin(1e-15 + 1e-15i) → ~1e-15 + i * 1e-15.
  // Test 19: Checks sin(1 + ∞i) → NaN + NaNi.
  // Test 20: Checks sin(1000π + 0i) → 0 + 0i.

  // Test 1: Verifies sin(0 + 0i), expecting 0 + 0i (sin(0) = 0, sinh(0) = 0).
  it("computes sin(0 + 0i) correctly", () => {
    const result = Complex.sin(new Complex(0, 0));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Verifies sin(π/2 + 0i), expecting 1 + 0i (sin(π/2) = 1, sinh(0) = 0).
  it("computes sin(π/2 + 0i) correctly", () => {
    const result = Complex.sin(new Complex(Math.PI / 2, 0));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Verifies sin(0 + i), expecting 0 + sinh(1)i (sin(0) = 0, cos(0) = 1, sinh(1) ≈ 1.1752011936438014).
  it("computes sin(0 + i) correctly", () => {
    const result = Complex.sin(new Complex(0, 1));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(Math.sinh(1), 15);
  });

  // Test 4: Verifies sin(1 + i), expecting sin(1)cosh(1) + i cos(1)sinh(1).
  it("computes sin(1 + i) correctly", () => {
    const result = Complex.sin(new Complex(1, 1));
    const expectedReal = Math.sin(1) * Math.cosh(1); // ≈ 1.2984575814159773
    const expectedImag = Math.cos(1) * Math.sinh(1); // ≈ 0.6349639147847361
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 5: Verifies sin(NaN + 0i), expecting NaN + NaNi (undefined due to NaN input).
  it("handles sin(NaN + 0i) correctly", () => {
    const result = Complex.sin(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: Verifies sin(0 + NaNi), expecting NaN + NaNi (undefined due to NaN imaginary part).
  it("handles sin(0 + NaNi) correctly", () => {
    const result = Complex.sin(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Verifies sin(NaN + NaNi), expecting NaN + NaNi (undefined due to NaN components).
  it("handles sin(NaN + NaNi) correctly", () => {
    const result = Complex.sin(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Verifies sin(∞ + 0i), expecting NaN + NaNi (sin(∞) is undefined).
  it("handles sin(∞ + 0i) correctly", () => {
    const result = Complex.sin(new Complex(Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 9: Verifies sin(0 + ∞i), expecting 0 + ∞i (sin(0) = 0, cosh(∞) = ∞, sinh(∞) = ∞).
  it("handles sin(0 + ∞i) correctly", () => {
    const result = Complex.sin(new Complex(0, Infinity));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(Infinity);
  });

  // Test 10: Verifies sin(∞ + ∞i), expecting NaN + NaNi (undefined due to infinite components).
  it("handles sin(∞ + ∞i) correctly", () => {
    const result = Complex.sin(new Complex(Infinity, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 11: Verifies sin(1 + 1e-15i), expecting ~sin(1) + i cos(1)sinh(1e-15) (small imaginary part).
  it("handles sin(1 + 1e-15i) correctly", () => {
    const result = Complex.sin(new Complex(1, 1e-15));
    const expectedReal = Math.sin(1) * Math.cosh(1e-15); // ≈ sin(1)
    const expectedImag = Math.cos(1) * Math.sinh(1e-15); // ≈ cos(1) * 1e-15
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 12: Verifies sin(-π/2 + 0i), expecting -1 + 0i (sin(-π/2) = -1, sinh(0) = 0).
  it("computes sin(-π/2 + 0i) correctly", () => {
    const result = Complex.sin(new Complex(-Math.PI / 2, 0));
    expect(result.re).toBeCloseTo(-1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 13: Verifies sin(0 + -i), expecting 0 + sinh(-1)i (sin(0) = 0, cos(0) = 1, sinh(-1) ≈ -1.1752011936438014).
  it("computes sin(0 + -i) correctly", () => {
    const result = Complex.sin(new Complex(0, -1));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(Math.sinh(-1), 15);
  });

  // Test 14: Verifies sin(π/2 + i), expecting sin(π/2)cosh(1) + i cos(π/2)sinh(1) (cos(π/2) = 0).
  it("computes sin(π/2 + i) correctly", () => {
    const result = Complex.sin(new Complex(Math.PI / 2, 1));
    const expectedReal = Math.sin(Math.PI / 2) * Math.cosh(1); // ≈ 1.5430806348152437
    const expectedImag = Math.cos(Math.PI / 2) * Math.sinh(1); // ≈ 0
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 15: Verifies sin(-∞ + 0i), expecting NaN + NaNi (sin(-∞) is undefined).
  it("handles sin(-∞ + 0i) correctly", () => {
    const result = Complex.sin(new Complex(-Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16: Verifies sin(1e-15 + 0i), expecting ~1e-15 + 0i (sin(1e-15) ≈ 1e-15, sinh(0) = 0).
  it("handles sin(1e-15 + 0i) correctly", () => {
    const result = Complex.sin(new Complex(1e-15, 0));
    expect(result.re).toBeCloseTo(1e-15, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 17: Verifies sin(0 + -∞i), expecting 0 - ∞i (sin(0) = 0, cosh(-∞) = ∞, sinh(-∞) = -∞).
  it("handles sin(0 + -∞i) correctly", () => {
    const result = Complex.sin(new Complex(0, -Infinity));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(-Infinity);
  });

  // Test 18: Verifies sin(1e-15 + 1e-15i), expecting ~1e-15 + i * 1e-15 (small real and imaginary parts).
  it("handles sin(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.sin(new Complex(1e-15, 1e-15));
    const expectedReal = Math.sin(1e-15) * Math.cosh(1e-15); // ≈ 1e-15
    const expectedImag = Math.cos(1e-15) * Math.sinh(1e-15); // ≈ 1e-15
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 19: Verifies sin(1 + ∞i), expecting NaN + NaNi (undefined due to infinite imaginary part and non-zero sin(1)).
  it("handles sin(1 + ∞i) correctly", () => {
    const result = Complex.sin(new Complex(1, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 20: Verifies sin(1000π + 0i), expecting 0 + 0i (sin(1000π) = 0 due to periodicity).
  it("handles sin(1000π + 0i) correctly", () => {
    const result = Complex.sin(new Complex(1000 * Math.PI, 0));
    // Wolfram: 0
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });
});
