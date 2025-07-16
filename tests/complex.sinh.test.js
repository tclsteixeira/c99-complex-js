/**
 * Tests for Complex.sinh(z).
 * Verifies the hyperbolic sine of a complex number z = a + bi, computed as sinh(z) = sinh(a)cos(b) + i cosh(a)sin(b).
 * Covers standard cases, purely real/imaginary inputs, general complex numbers, edge cases (NaN, Infinity),
 * small inputs, and special cases (e.g., a ≈ 0, b ≈ kπ).
 * Uses toBeCloseTo(..., 15) for numerical precision and exact checks for NaN/Infinity.
 * Note: sinh(z) normalizes imaginary part b to [0, 2π] to detect special cases (e.g., b ≈ kπ).
 * For infinite real part (a = ±∞), returns ±∞ cos(b) + i ±∞ sin(b) if b is finite, ±∞ + NaNi if b is NaN.
 * For infinite imaginary part (|b| = ∞), returns NaN + NaNi.
 * For small complex inputs (|z| < 1e-15), returns z to avoid underflow.
 * Optimizes for b = ±π/4, ±π/2, ±π with exact trigonometric values.
 * All tests verified as of June 10, 2025.
 */
import { Complex } from "../src/c99-complex.js";
import { describe, it, expect } from "vitest";

describe("Complex.sinh", () => {
  // Test 1: Verifies sinh(0 + 0i), expecting 0 + 0i.
  it("computes sinh(0 + 0i) correctly", () => {
    const result = Complex.sinh(new Complex(0, 0));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Verifies sinh(1 + 0i), expecting sinh(1) ≈ 1.1752011936438014 + 0i.
  it("computes sinh(1 + 0i) correctly", () => {
    const result = Complex.sinh(new Complex(1, 0));
    expect(result.re).toBeCloseTo(Math.sinh(1), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Verifies sinh(0 + π/2i), expecting 0 + i.
  it("computes sinh(0 + π/2i) correctly", () => {
    const result = Complex.sinh(new Complex(0, Math.PI / 2));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1, 15);
  });

  // Test 4: Verifies sinh(1 + π/2i), expecting 0 + 1.5430806348152437i.
  it("computes sinh(1 + π/2i) correctly", () => {
    const result = Complex.sinh(new Complex(1, Math.PI / 2));
    expect(result.re).toBeCloseTo(0, 15); // cos(π/2) = 0
    expect(result.im).toBeCloseTo(Math.cosh(1) * Math.sin(Math.PI / 2), 15); // ≈ 1.5430806348152437
  });

  // Test 5: Verifies sinh(NaN + 0i), expecting NaN + NaNi.
  it("handles sinh(NaN + 0i) correctly", () => {
    const result = Complex.sinh(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: Verifies sinh(0 + NaNi), expecting NaN + NaNi.
  it("handles sinh(0 + NaNi) correctly", () => {
    const result = Complex.sinh(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Verifies sinh(NaN + NaNi), expecting NaN + NaNi.
  it("handles sinh(NaN + NaNi) correctly", () => {
    const result = Complex.sinh(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Verifies sinh(∞ + 0i), expecting ∞ + 0i.
  it("handles sinh(∞ + 0i) correctly", () => {
    const result = Complex.sinh(new Complex(Infinity, 0));
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 9: Verifies sinh(-∞ + 0i), expecting -∞ + 0i.
  it("handles sinh(-∞ + 0i) correctly", () => {
    const result = Complex.sinh(new Complex(-Infinity, 0));
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 10: Verifies sinh(∞ + π/2i), expecting 0 + ∞i.
  it("handles sinh(∞ + π/2i) correctly", () => {
    const result = Complex.sinh(new Complex(Infinity, Math.PI / 2));
    expect(result.re).toBeCloseTo(0, 15); // cos(π/2) = 0
    expect(result.im).toBe(Infinity);
  });

  // Test 11: Verifies sinh(-∞ + π/2i), expecting NaN + -∞i. (C99 std)
  it("handles sinh(-∞ + π/2i) correctly", () => {
    const result = Complex.sinh(new Complex(-Infinity, Math.PI / 2));
    expect(result.re).toBe(0);
    expect(result.im).toBe(-Infinity);
  });

  // Test 12: Verifies sinh(∞ + 1i), expecting ∞ cos(1) + i ∞ sin(1).
  it("handles sinh(∞ + 1i) correctly", () => {
    const result = Complex.sinh(new Complex(Infinity, 1));
    expect(result.re).toBe(Infinity * Math.cos(1));
    expect(result.im).toBe(Infinity * Math.sin(1));
  });

  // Test 13: Verifies sinh(0 + ∞i), expecting NaN + NaNi.
  it("handles sinh(0 + ∞i) correctly", () => {
    const result = Complex.sinh(new Complex(0, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 14: Verifies sinh(1 + ∞i), expecting NaN + NaNi.
  it("handles sinh(1 + ∞i) correctly", () => {
    const result = Complex.sinh(new Complex(1, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 15: Verifies sinh(∞ + NaNi), expecting ∞ + NaNi (C99 std).
  it("handles sinh(∞ + NaNi) correctly", () => {
    const result = Complex.sinh(new Complex(Infinity, NaN));
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16: Verifies sinh(1e-15 + 0i), expecting 1e-15 + 0i.
  it("handles sinh(1e-15 + 0i) correctly", () => {
    const result = Complex.sinh(new Complex(1e-15, 0));
    expect(result.re).toBeCloseTo(1e-15, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 17: Verifies sinh(1e-15 + 1e-15i), expecting 1e-15 + 1e-15i.
  it("handles sinh(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.sinh(new Complex(1e-15, 1e-15));
    expect(result.re).toBeCloseTo(1e-15, 15);
    expect(result.im).toBeCloseTo(1e-15, 15);
  });

  // Test 18: Verifies sinh(0 + πi), expecting 0 + 0i.
  it("handles sinh(0 + πi) correctly", () => {
    const result = Complex.sinh(new Complex(0, Math.PI));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 19: Verifies sinh(π/4 + 0i), expecting sinh(π/4) ≈ 0.8686709614860095 + 0i.
  it("computes sinh(π/4 + 0i) correctly", () => {
    const result = Complex.sinh(new Complex(Math.PI / 4, 0));
    expect(result.re).toBeCloseTo(Math.sinh(Math.PI / 4), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 20: Verifies sinh(0 + π/4i), expecting 0 + i sin(π/4) ≈ 0 + 0.7071067811865475i.
  it("computes sinh(0 + π/4i) correctly", () => {
    const result = Complex.sinh(new Complex(0, Math.PI / 4));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(Math.SQRT2 / 2, 15);
  });
});
