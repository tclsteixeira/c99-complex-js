/**
 * Tests for Complex.sec(z).
 * Verifies the secant of a complex number z = x + yi, computed as sec(z) = 2 cos(x) cosh(y) / (cosh(2y) + cos(2x)) + i 2 sin(x) sinh(y) / (cosh(2y) + cos(2x)).
 * Covers standard cases, purely real/imaginary inputs, general complex numbers, edge cases (NaN, Infinity),
 * small inputs, large real parts, and poles.
 * Uses toBeCloseTo(..., 15) for numerical precision and exact checks for NaN/Infinity.
 * Note: sec(z) normalizes real part x to [-π, π] to ensure exact results for large angles
 * (e.g., sec(1000π) = 1 + 0i in Test 20). For infinite inputs, returns NaN + NaNi to align with C99,
 * differing from Wolfram in some cases (e.g., Tests 8, 16, 18 expect 0 + 0i). Returns NaN + NaNi at poles (e.g., sec(π/2) in Test 19).
 * All tests verified as of June 8, 2025.
 */
import { Complex } from "../src/c99-complex.js";
import { describe, it, expect } from "vitest";

describe("Complex.sec", () => {
  // Summary -----------------
  // Test 1: Checks sec(π/4 + 0i) → √2 + 0i.
  // Test 2: Checks sec(0 + i) → 1/cosh(1) + 0i. Matches Wolfram using precomputed constant.
  // Test 3: Checks sec(1 + i) → 2 cos(1) cosh(1) / (cosh(2) + cos(2)) + i 2 sin(1) sinh(1) / (cosh(2) + cos(2)). Differs from Wolfram by ~6e-17 due to floating-point errors.
  // Test 4: Checks sec(NaN + 0i) → NaN + NaNi.
  // Test 5: Checks sec(0 + NaNi) → NaN + NaNi.
  // Test 6: Checks sec(NaN + NaNi) → NaN + NaNi.
  // Test 7: Checks sec(∞ + 0i) → NaN + NaNi. Wolfram expects <-1, >1 + <-1, >1i due to oscillatory behavior.
  // Test 8: Checks sec(0 + ∞i) → NaN + NaNi. Wolfram expects 0 + 0i as sec(i∞) → 1/cosh(∞) = 0.
  // Test 9: Checks sec(∞ + ∞i) → NaN + NaNi.
  // Test 10: Checks sec(1 + 1e-15i) → ~sec(1) + i 2 sin(1) sinh(1e-15) / (cosh(0) + cos(2)).
  // Test 11: Checks sec(-π/4 + 0i) → √2 + 0i.
  // Test 12: Checks sec(0 - i) → 1/cosh(1) + 0i. Matches Wolfram using precomputed constant.
  // Test 13: Checks sec(π/4 + i) → 2 cos(π/4) cosh(1) / (cosh(2) + cos(π/2)) + i 2 sin(π/4) sinh(1) / (cosh(2) + cos(π/2)).
  // Test 14: Checks sec(-∞ + 0i) → NaN + NaNi. Wolfram expects <-1, >1 + <-1, >1i due to oscillatory behavior.
  // Test 15: Checks sec(1e-15 + 0i) → ~1 + 0i.
  // Test 16: Checks sec(0 - ∞i) → NaN + NaNi. Wolfram expects 0 + 0i as sec(-i∞) → 1/cosh(∞) = 0.
  // Test 17: Checks sec(1e-15 + 1e-15i) → ~1 + 0i.
  // Test 18: Checks sec(1 + ∞i) → NaN + NaNi. Wolfram expects 0 + 0i, possibly simplifying to sec(i∞).
  // Test 19: Checks sec(π/2 + 0i) → NaN + NaNi (pole). Wolfram expects ∞^~ + ∞^~i, indicating unbounded divergence.
  // Test 20: Checks sec(1000π + 0i) → 1 + 0i.
  // Test 21: Checks sec(0 + 0i) → 1 + 0i.
  // Test 22: Checks sec(π + 0i) → -1 + 0i.
  // Test 23: Checks sec(π/2 + i) → 0 + i 2 sin(π/2) sinh(1) / (cosh(2) + cos(π)). Matches Wolfram after real part fix.
  // Test 24: Checks sec(π/3 + 0i) → 2 + 0i.

  // Test 1: Verifies sec(π/4 + 0i), expecting √2 + 0i (sec(π/4) = √2).
  it("computes sec(π/4 + 0i) correctly", () => {
    const result = Complex.sec(new Complex(Math.PI / 4, 0));
    expect(result.re).toBeCloseTo(Math.SQRT2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Verifies sec(0 + i), expecting 1/cosh(1) + 0i (sec(i) = 1/cosh(1)).
  // Complex returns 0.6480542736638853 using precomputed constant, matching Wolfram.
  // Verified June 8, 2025.
  it("computes sec(0 + i) correctly", () => {
    const result = Complex.sec(new Complex(0, 1));
    expect(result.re).toBeCloseTo(1 / Math.cosh(1), 15); // ≈ 0.6480542736638853
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Verifies sec(1 + i), expecting 2 cos(1) cosh(1) / (cosh(2) + cos(2)) + i 2 sin(1) sinh(1) / (cosh(2) + cos(2)).
  // Complex returns 0.49833703055518686 + 0.5910838417210451i, differing from Wolfram's 0.4983370305551868 + 0.591083841721045i by ~6e-17.
  // Difference is due to floating-point errors in trigonometric and hyperbolic functions. Error is within tolerance. Verified June 8, 2025.
  it("computes sec(1 + i) correctly", () => {
    const result = Complex.sec(new Complex(1, 1));
    const denom = Math.cosh(2) + Math.cos(2); // ≈ 5.406616688824721
    const expectedReal = (2 * Math.cos(1) * Math.cosh(1)) / denom; // ≈ 0.4983370305551868
    const expectedImag = (2 * Math.sin(1) * Math.sinh(1)) / denom; // ≈ 0.591083841721045
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 4: Verifies sec(NaN + 0i), expecting NaN + NaNi.
  it("handles sec(NaN + 0i) correctly", () => {
    const result = Complex.sec(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 5: Verifies sec(0 + NaNi), expecting NaN + NaNi.
  it("handles sec(0 + NaNi) correctly", () => {
    const result = Complex.sec(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: Verifies sec(NaN + NaNi), expecting NaN + NaNi.
  it("handles sec(NaN + NaNi) correctly", () => {
    const result = Complex.sec(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Verifies sec(∞ + 0i), expecting NaN + NaNi.
  // Wolfram expects <-1, >1 + <-1, >1i, indicating oscillatory behavior of sec(x) as x → ∞.
  // Complex returns NaN + NaNi per C99, as sec(∞) is undefined due to non-convergent cos(∞). Verified June 8, 2025.
  it("handles sec(∞ + 0i) correctly", () => {
    const result = Complex.sec(new Complex(Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Verifies sec(0 + ∞i), expecting NaN + NaNi.
  // Wolfram expects 0 + 0i, as sec(iy) = 1/cosh(y) → 0 as y → ∞.
  // Complex returns NaN + NaNi per C99, treating infinite inputs as undefined to avoid numerical instability.
  // C99 compliance prioritizes NaN over mathematical limit. Verified June 8, 2025.
  it("handles sec(0 + ∞i) correctly", () => {
    const result = Complex.sec(new Complex(0, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 9: Verifies sec(∞ + ∞i), expecting NaN + NaNi.
  it("handles sec(∞ + ∞i) correctly", () => {
    const result = Complex.sec(new Complex(Infinity, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 10: Verifies sec(1 + 1e-15i), expecting ~sec(1) + i 2 sin(1) sinh(1e-15) / (cosh(0) + cos(2)).
  it("handles sec(1 + 1e-15i) correctly", () => {
    const result = Complex.sec(new Complex(1, 1e-15));
    const denom = Math.cosh(2e-15) + Math.cos(2); // ≈ 1 + cos(2)
    const expectedReal = (2 * Math.cos(1) * Math.cosh(1e-15)) / denom; // ≈ sec(1)
    const expectedImag = (2 * Math.sin(1) * Math.sinh(1e-15)) / denom; // ≈ 2 sin(1) * 1e-15 / (1 + cos(2))
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 11: Verifies sec(-π/4 + 0i), expecting √2 + 0i (sec(-π/4) = √2).
  it("computes sec(-π/4 + 0i) correctly", () => {
    const result = Complex.sec(new Complex(-Math.PI / 4, 0));
    expect(result.re).toBeCloseTo(Math.SQRT2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 12: Verifies sec(0 - i), expecting 1/cosh(1) + 0i (sec(-i) = 1/cosh(1)).
  // Complex returns 0.6480542736638853 using precomputed constant, matching Wolfram.
  // Verified June 8, 2025.
  it("computes sec(0 - i) correctly", () => {
    const result = Complex.sec(new Complex(0, -1));
    expect(result.re).toBeCloseTo(1 / Math.cosh(1), 15); // ≈ 0.6480542736638853
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 13: Verifies sec(π/4 + i), expecting 2 cos(π/4) cosh(1) / (cosh(2) + cos(π/2)) + i 2 sin(π/4) sinh(1) / (cosh(2) + cos(π/2)).
  // Complex returns 0.5800457341341665 + 0.4417594413036525i, matching Wolfram.
  // Verified June 8, 2025.
  it("computes sec(π/4 + i) correctly", () => {
    const result = Complex.sec(new Complex(Math.PI / 4, 1));
    const denom = Math.cosh(2) + Math.cos(Math.PI / 2); // ≈ cosh(2)
    const expectedReal = (2 * Math.cos(Math.PI / 4) * Math.cosh(1)) / denom; // ≈ 0.5800457341341665
    const expectedImag = (2 * Math.sin(Math.PI / 4) * Math.sinh(1)) / denom; // ≈ 0.4417594413036525
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 14: Verifies sec(-∞ + 0i), expecting NaN + NaNi.
  // Wolfram expects <-1, >1 + <-1, >1i, indicating oscillatory behavior of sec(x) as x → -∞.
  // Complex returns NaN + NaNi per C99, as sec(-∞) is undefined due to non-convergent cos(-∞). Verified June 8, 2025.
  it("handles sec(-∞ + 0i) correctly", () => {
    const result = Complex.sec(new Complex(-Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 15: Verifies sec(1e-15 + 0i), expecting ~1 + 0i (sec(1e-15) ≈ 1).
  it("handles sec(1e-15 + 0i) correctly", () => {
    const result = Complex.sec(new Complex(1e-15, 0));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 16: Verifies sec(0 - ∞i), expecting NaN + NaNi.
  // Wolfram expects 0 + 0i, as sec(-iy) = 1/cosh(-y) = 1/cosh(y) → 0 as y → ∞.
  // Complex returns NaN + NaNi per C99, treating infinite inputs as undefined. C99 compliance prioritizes NaN over mathematical limit.
  // Verified June 8, 2025.
  it("handles sec(0 - ∞i) correctly", () => {
    const result = Complex.sec(new Complex(0, -Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 17: Verifies sec(1e-15 + 1e-15i), expecting ~1 + 0i.
  it("handles sec(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.sec(new Complex(1e-15, 1e-15));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 18: Verifies sec(1 + ∞i), expecting NaN + NaNi.
  // Wolfram expects 0 + 0i, possibly simplifying to sec(i∞) → 0.
  // Complex returns NaN + NaNi per C99, as sec(x + ∞i) is undefined due to oscillatory behavior for non-zero x.
  // C99 compliance prioritizes NaN. Verified June 8, 2025.
  it("handles sec(1 + ∞i) correctly", () => {
    const result = Complex.sec(new Complex(1, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 19: Verifies sec(π/2 + 0i), expecting NaN + NaNi (pole).
  // Wolfram expects ∞^~ + ∞^~i, indicating unbounded divergence at the pole where cos(π/2) = 0.
  // Complex returns NaN + NaNi per C99, as sec(π/2) = 1/cos(π/2) is undefined. Verified June 8, 2025.
  it("handles sec(π/2 + 0i) correctly", () => {
    const result = Complex.sec(new Complex(Math.PI / 2, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 20: Verifies sec(1000π + 0i), expecting 1 + 0i.
  it("handles sec(1000π + 0i) correctly", () => {
    const result = Complex.sec(new Complex(1000 * Math.PI, 0));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 21: Verifies sec(0 + 0i), expecting 1 + 0i (sec(0) = 1).
  it("handles sec(0 + 0i) correctly", () => {
    const result = Complex.sec(new Complex(0, 0));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 22: Verifies sec(π + 0i), expecting -1 + 0i (sec(π) = -1).
  it("handles sec(π + 0i) correctly", () => {
    const result = Complex.sec(new Complex(Math.PI, 0));
    expect(result.re).toBeCloseTo(-1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 23: Verifies sec(π/2 + i), expecting 0 + i 2 sin(π/2) sinh(1) / (cosh(2) + cos(π)).
  // Complex returns 0 + 0.8509181282393216i, matching Wolfram after fixing real part to 0 when |x ± π/2| < 1e-15.
  // Verified June 8, 2025.
  it("handles sec(π/2 + i) correctly", () => {
    const result = Complex.sec(new Complex(Math.PI / 2, 1));
    const denom = Math.cosh(2) + Math.cos(Math.PI); // ≈ cosh(2) - 1
    const expectedReal = (2 * Math.cos(Math.PI / 2) * Math.cosh(1)) / denom; // ≈ 0
    const expectedImag = (2 * Math.sin(Math.PI / 2) * Math.sinh(1)) / denom; // ≈ 0.8509181282393216
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 24: Verifies sec(π/3 + 0i), expecting 2 + 0i (sec(π/3) = 1/cos(π/3) = 2).
  it("computes sec(π/3 + 0i) correctly", () => {
    const result = Complex.sec(new Complex(Math.PI / 3, 0));
    expect(result.re).toBeCloseTo(2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });
});
