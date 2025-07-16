/**
 * Tests for Complex.cos(z).
 * Verifies the cosine of a complex number z = x + yi, computed as cos(z) = cos(x)cosh(y) - i sin(x)sinh(y).
 * Covers standard cases, purely real/imaginary inputs, general complex numbers, edge cases (NaN, Infinity),
 * small inputs, and large real parts.
 * Uses toBeCloseTo(..., 15) for numerical precision and exact checks for NaN/Infinity.
 * Note: cos(z) normalizes real part x to [-π, π] to ensure exact results for large angles
 * (e.g., cos(1000π) = 1 in Test 20). For infinite imaginary inputs, returns NaN + NaNi
 * to align with sin(z) and C99 standard, differing from mathjs (Tests 9, 17, 19, 21).
 * All tests verified as of June 6, 2025.
 */
import { Complex } from "../src/c99-complex.js";
import { describe, it, expect } from "vitest";

describe("Complex.cos", () => {
  // Summary -----------------
  // Test 1: Checks cos(0 + 0i) → 1 + 0i.
  // Test 2: Checks cos(π/2 + 0i) → 0 + 0i.
  // Test 3: Checks cos(0 + i) → cosh(1) + 0i.
  // Test 4: Checks cos(1 + i) → cos(1)cosh(1) - i sin(1)sinh(1).
  // Test 5: Checks cos(NaN + 0i) → NaN + NaNi.
  // Test 6: Checks cos(0 + NaNi) → NaN + NaNi.
  // Test 7: Checks cos(NaN + NaNi) → NaN + NaNi.
  // Test 8: Checks cos(∞ + 0i) → NaN + NaNi.
  // Test 9: Checks cos(0 + ∞i) → NaN + NaNi (cos(0) ≠ 0, differs from mathjs: ∞ + NaNi).
  // Test 10: Checks cos(∞ + ∞i) → NaN + NaNi.
  // Test 11: Checks cos(1 + 1e-15i) → ~cos(1) - i sin(1)sinh(1e-15).
  // Test 12: Checks cos(-π/2 + 0i) → 0 + 0i.
  // Test 13: Checks cos(0 - i) → cosh(-1) + 0i.
  // Test 14: Checks cos(π/2 + i) → cos(π/2)cosh(1) - i sin(π/2)sinh(1).
  // Test 15: Checks cos(-∞ + 0i) → NaN + NaNi.
  // Test 16: Checks cos(1e-15 + 0i) → ~1 + 0i.
  // Test 17: Checks cos(0 - ∞i) → NaN + NaNi (cos(0) ≠ 0, differs from mathjs: -∞ + NaNi).
  // Test 18: Checks cos(1e-15 + 1e-15i) → ~1 - i * 1e-15.
  // Test 19: Checks cos(1 + ∞i) → NaN + NaNi (cos(1) ≠ 0, differs from mathjs: ∞ - ∞i).
  // Test 20: Checks cos(1000π + 0i) → 1 + 0i (normalized to cos(0)).
  // Test 21: Checks cos(π/2 + ∞i) → NaN + NaNi (cos(π/2) ≈ 0, aligns with C99, differs from mathjs).

  // Test 1: Verifies cos(0 + 0i), expecting 1 + 0i (cos(0) = 1, sinh(0) = 0).
  it("computes cos(0 + 0i) correctly", () => {
    const result = Complex.cos(new Complex(0, 0));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Verifies cos(π/2 + 0i), expecting 0 + 0i (cos(π/2) = 0, sinh(0) = 0).
  it("computes cos(π/2 + 0i) correctly", () => {
    const result = Complex.cos(new Complex(Math.PI / 2, 0));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Verifies cos(0 + i), expecting cosh(1) + 0i (cos(0) = 1, sin(0) = 0, cosh(1) ≈ 1.5430806348152437).
  it("computes cos(0 + i) correctly", () => {
    const result = Complex.cos(new Complex(0, 1));
    expect(result.re).toBeCloseTo(Math.cosh(1), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 4: Verifies cos(1 + i), expecting cos(1)cosh(1) - i sin(1)sinh(1).
  it("computes cos(1 + i) correctly", () => {
    const result = Complex.cos(new Complex(1, 1));
    const expectedReal = Math.cos(1) * Math.cosh(1); // ≈ 0.8337300251311491
    const expectedImag = -(Math.sin(1) * Math.sinh(1)); // ≈ -0.9888977057628651
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 5: Verifies cos(NaN + 0i), expecting NaN + NaNi (undefined due to NaN input).
  it("handles cos(NaN + 0i) correctly", () => {
    const result = Complex.cos(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: Verifies cos(0 + NaNi), expecting NaN + NaNi (undefined due to NaN imaginary part).
  it("handles cos(0 + NaNi) correctly", () => {
    const result = Complex.cos(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Verifies cos(NaN + NaNi), expecting NaN + NaNi (undefined due to NaN components).
  it("handles cos(NaN + NaNi) correctly", () => {
    const result = Complex.cos(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Verifies cos(∞ + 0i), expecting NaN + NaNi (cos(∞) is undefined).
  it("handles cos(∞ + 0i) correctly", () => {
    const result = Complex.cos(new Complex(Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 9: Verifies cos(0 + ∞i), expecting NaN + NaNi (cos(0) ≠ 0, aligns with C99, differs from mathjs: ∞ + NaNi).
  it("handles cos(0 + ∞i) correctly", () => {
    const result = Complex.cos(new Complex(0, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 10: Verifies cos(∞ + ∞i), expecting NaN + NaNi (undefined due to infinite components).
  it("handles cos(∞ + ∞i) correctly", () => {
    const result = Complex.cos(new Complex(Infinity, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 11: Verifies cos(1 + 1e-15i), expecting ~cos(1) - i sin(1)sinh(1e-15).
  it("handles cos(1 + 1e-15i) correctly", () => {
    const result = Complex.cos(new Complex(1, 1e-15));
    const expectedReal = Math.cos(1) * Math.cosh(1e-15); // ≈ cos(1)
    const expectedImag = -(Math.sin(1) * Math.sinh(1e-15)); // ≈ -sin(1) * 1e-15
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 12: Verifies cos(-π/2 + 0i), expecting 0 + 0i (cos(-π/2) = 0, sinh(0) = 0).
  it("computes cos(-π/2 + 0i) correctly", () => {
    const result = Complex.cos(new Complex(-Math.PI / 2, 0));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 13: Verifies cos(0 - i), expecting cosh(-1) + 0i (cos(0) = 1, sin(0) = 0, cosh(-1) ≈ 1.5430806348152437).
  it("computes cos(0 - i) correctly", () => {
    const result = Complex.cos(new Complex(0, -1));
    expect(result.re).toBeCloseTo(Math.cosh(-1), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 14: Verifies cos(π/2 + i), expecting cos(π/2)cosh(1) - i sin(π/2)sinh(1) (cos(π/2) = 0).
  it("computes cos(π/2 + i) correctly", () => {
    const result = Complex.cos(new Complex(Math.PI / 2, 1));
    const expectedReal = Math.cos(Math.PI / 2) * Math.cosh(1); // ≈ 0
    const expectedImag = -(Math.sin(Math.PI / 2) * Math.sinh(1)); // ≈ -1.1752011936438014
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 15: Verifies cos(-∞ + 0i), expecting NaN + NaNi (cos(-∞) is undefined).
  it("handles cos(-∞ + 0i) correctly", () => {
    const result = Complex.cos(new Complex(-Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16: Verifies cos(1e-15 + 0i), expecting ~1 + 0i (cos(1e-15) ≈ 1, sinh(0) = 0).
  it("handles cos(1e-15 + 0i) correctly", () => {
    const result = Complex.cos(new Complex(1e-15, 0));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 17: Verifies cos(0 - ∞i), expecting NaN + NaNi (cos(0) ≠ 0, aligns with C99, differs from mathjs: -∞ + NaNi).
  it("handles cos(0 - ∞i) correctly", () => {
    const result = Complex.cos(new Complex(0, -Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 18: Verifies cos(1e-15 + 1e-15i), expecting ~1 - i * 1e-15 (small real and imaginary parts).
  it("handles cos(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.cos(new Complex(1e-15, 1e-15));
    const expectedReal = Math.cos(1e-15) * Math.cosh(1e-15); // ≈ 1
    const expectedImag = -(Math.sin(1e-15) * Math.sinh(1e-15)); // ≈ -1e-15
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 19: Verifies cos(1 + ∞i), expecting NaN + NaNi (cos(1) ≠ 0, aligns with C99, differs from mathjs: ∞ - ∞i).
  it("handles cos(1 + ∞i) correctly", () => {
    const result = Complex.cos(new Complex(1, Infinity));
    // Wolfram: ∞, mathjs: { re: Infinity, im: -Infinity }
    // Returns NaN + NaNi to align with sin(z) and C99 since cos(1) ≠ 0
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 20: Verifies cos(1000π + 0i), expecting 1 + 0i (normalized to cos(0)).
  it("handles cos(1000π + 0i) correctly", () => {
    const result = Complex.cos(new Complex(1000 * Math.PI, 0));
    // Wolfram: 1
    // Normalized to cos(0) = 1
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 21: Verifies cos(π/2 + ∞i), expecting NaN + NaNi (cos(π/2) ≈ 0, aligns with C99, differs from mathjs: NaN - ∞i).
  it("handles cos(π/2 + ∞i) correctly", () => {
    const result = Complex.cos(new Complex(Math.PI / 2, Infinity));
    // mathjs: { re: NaN, im: -Infinity }
    // Returns NaN + NaNi to align with sin(z) and C99 since cos(π/2) ≈ 0
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });
});
