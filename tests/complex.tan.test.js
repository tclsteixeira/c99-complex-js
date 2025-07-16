/**
 * Tests for Complex.tan(z).
 * Verifies the tangent of a complex number z = x + yi, computed as tan(z) = sin(2x)/(cos(2x) + cosh(2y)) + i sinh(2y)/(cos(2x) + cosh(2y)).
 * Covers standard cases, purely real/imaginary inputs, general complex numbers, edge cases (NaN, Infinity),
 * small inputs, large real parts, and poles.
 * Uses toBeCloseTo(..., 15) for numerical precision and exact checks for NaN/Infinity.
 * Note: tan(z) normalizes real part x to [-π, π] to ensure exact results for large angles
 * (e.g., tan(1000π) = 0 in Test 20). For infinite imaginary inputs, returns 0 ± i to align with C99,
 * differing from mathjs (Tests 9, 17, 19, 23). Returns NaN + NaNi at poles (e.g., tan(π/2) in Test 21, tan(-π/2) in Test 22).
 * All tests verified as of June 7, 2025.
 */
import { Complex } from "../src/c99-complex.js";
import { describe, it, expect } from "vitest";

describe("Complex.tan", () => {
  // Summary -----------------
  // Test 1: Checks tan(0 + 0i) → 0 + 0i.
  // Test 2: Checks tan(π/4 + 0i) → 1 + 0i.
  // Test 3: Checks tan(0 + i) → 0 + tanh(1)i.
  // Test 4: Checks tan(1 + i) → sin(2)/(cos(2) + cosh(2)) + i sinh(2)/(cos(2) + cosh(2)).
  // Test 5: Checks tan(NaN + 0i) → NaN + NaNi.
  // Test 6: Checks tan(0 + NaNi) → NaN + NaNi.
  // Test 7: Checks tan(NaN + NaNi) → NaN + NaNi.
  // Test 8: Checks tan(∞ + 0i) → NaN + NaNi.
  // Test 9: Checks tan(0 + ∞i) → 0 + i (large |y|, differs from mathjs: 0 + ∞i).
  // Test 10: Checks tan(∞ + ∞i) → NaN + NaNi.
  // Test 11: Checks tan(1 + 1e-15i) → ~tan(1) + i sinh(2e-15)/(cos(2) + 1).
  // Test 12: Checks tan(-π/4 + 0i) → -1 + 0i.
  // Test 13: Checks tan(0 - i) → 0 - tanh(1)i.
  // Test 14: Checks tan(π/4 + i) → sin(π/2)/(cos(π/2) + cosh(2)) + i sinh(2)/(cos(π/2) + cosh(2)).
  // Test 15: Checks tan(-∞ + 0i) → NaN + NaNi.
  // Test 16: Checks tan(1e-15 + 0i) → ~1e-15 + 0i.
  // Test 17: Checks tan(0 - ∞i) → 0 - i (large |y|, differs from mathjs: 0 - ∞i).
  // Test 18: Checks tan(1e-15 + 1e-15i) → ~1e-15 + i 1e-15.
  // Test 19: Checks tan(1 + ∞i) → 0 + i (large |y|, differs from mathjs: NaN + ∞i).
  // Test 20: Checks tan(1000π + 0i) → 0 + 0i (normalized to tan(0)).
  // Test 21: Checks tan(π/2 + 0i) → NaN + NaNi (pole, differs from mathjs: ∞ + 0i).
  // Test 22: Checks tan(-π/2 + 0i) → NaN + NaNi (pole, differs from mathjs: -∞ + 0i).
  // Test 23: Checks tan(π/2 + ∞i) → 0 + i (large |y|, differs from mathjs: NaN + ∞i).

  // Test 1: Verifies tan(0 + 0i), expecting 0 + 0i (tan(0) = 0, sinh(0) = 0).
  it("computes tan(0 + 0i) correctly", () => {
    const result = Complex.tan(new Complex(0, 0));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Verifies tan(π/4 + 0i), expecting 1 + 0i (tan(π/4) = 1).
  it("computes tan(π/4 + 0i) correctly", () => {
    const result = Complex.tan(new Complex(Math.PI / 4, 0));
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Verifies tan(0 + i), expecting 0 + tanh(1)i (tan(i) = i tanh(1)).
  it("computes tan(0 + i) correctly", () => {
    const result = Complex.tan(new Complex(0, 1));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(Math.tanh(1), 15); // ≈ 0.7615941559557649
  });

  // Test 4: Verifies tan(1 + i), expecting sin(2)/(cos(2) + cosh(2)) + i sinh(2)/(cos(2) + cosh(2)).
  it("computes tan(1 + i) correctly", () => {
    const result = Complex.tan(new Complex(1, 1));
    const denom = Math.cos(2) + Math.cosh(2); // ≈ 4.406616688824721
    const expectedReal = Math.sin(2) / denom; // ≈ 0.2069816568204637
    const expectedImag = Math.sinh(2) / denom; // ≈ 0.8298130028589138
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 5: Verifies tan(NaN + 0i), expecting NaN + NaNi (undefined due to NaN input).
  it("handles tan(NaN + 0i) correctly", () => {
    const result = Complex.tan(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: Verifies tan(0 + NaNi), expecting NaN + NaNi (undefined due to NaN imaginary part).
  it("handles tan(0 + NaNi) correctly", () => {
    const result = Complex.tan(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Verifies tan(NaN + NaNi), expecting NaN + NaNi (undefined due to NaN components).
  it("handles tan(NaN + NaNi) correctly", () => {
    const result = Complex.tan(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Verifies tan(∞ + 0i), expecting NaN + NaNi (tan(∞) is undefined).
  it("handles tan(∞ + 0i) correctly", () => {
    const result = Complex.tan(new Complex(Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 9: Verifies tan(0 + ∞i), expecting 0 + i (large |y|, differs from mathjs: 0 + ∞i).
  it("handles tan(0 + ∞i) correctly", () => {
    const result = Complex.tan(new Complex(0, Infinity));
    // Wolfram tan(0 + ∞i) = i  -> Aligns with C99 std
    // mathjs tan(0 + ∞i) = 0 + NaNi  -> Does not align with C99 std
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(1);
  });

  // Test 10: Verifies tan(∞ + ∞i), expecting NaN + NaNi (undefined due to infinite components).
  it("handles tan(∞ + ∞i) correctly", () => {
    const result = Complex.tan(new Complex(Infinity, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 11: Verifies tan(1 + 1e-15i), expecting ~tan(1) + i sinh(2e-15)/(cos(2) + 1).
  it("handles tan(1 + 1e-15i) correctly", () => {
    const result = Complex.tan(new Complex(1, 1e-15));
    const denom = Math.cos(2) + Math.cosh(2e-15); // ≈ cos(2) + 1
    const expectedReal = Math.sin(2) / denom; // ≈ tan(1)
    const expectedImag = Math.sinh(2e-15) / denom; // ≈ 2e-15 / (cos(2) + 1)
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 12: Verifies tan(-π/4 + 0i), expecting -1 + 0i (tan(-π/4) = -1).
  it("computes tan(-π/4 + 0i) correctly", () => {
    const result = Complex.tan(new Complex(-Math.PI / 4, 0));
    expect(result.re).toBeCloseTo(-1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 13: Verifies tan(0 - i), expecting 0 - tanh(1)i (tan(-i) = -i tanh(1)).
  it("computes tan(0 - i) correctly", () => {
    const result = Complex.tan(new Complex(0, -1));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-Math.tanh(1), 15);
  });

  // Test 14: Verifies tan(π/4 + i), expecting sin(π/2)/(cos(π/2) + cosh(2)) + i sinh(2)/(cos(π/2) + cosh(2)).
  it("computes tan(π/4 + i) correctly", () => {
    const result = Complex.tan(new Complex(Math.PI / 4, 1));
    const denom = Math.cos(Math.PI / 2) + Math.cosh(2); // ≈ cosh(2)
    const expectedReal = Math.sin(Math.PI / 2) / denom; // ≈ 1/cosh(2)
    const expectedImag = Math.sinh(2) / denom; // ≈ sinh(2)/cosh(2)
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 15: Verifies tan(-∞ + 0i), expecting NaN + NaNi (tan(-∞) is undefined).
  it("handles tan(-∞ + 0i) correctly", () => {
    const result = Complex.tan(new Complex(-Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16: Verifies tan(1e-15 + 0i), expecting ~1e-15 + 0i (tan(1e-15) ≈ 1e-15).
  it("handles tan(1e-15 + 0i) correctly", () => {
    const result = Complex.tan(new Complex(1e-15, 0));
    expect(result.re).toBeCloseTo(1e-15, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 17: Verifies tan(0 - ∞i), expecting 0 - i (large |y|, differs from mathjs: 0 - ∞i).
  it("handles tan(0 - ∞i) correctly", () => {
    const result = Complex.tan(new Complex(0, -Infinity));
    // Wolfram tan(0 - ∞i) = -i  -> Aligns with C99 std
    // mathjs tan(0 - ∞i) = 0 + NaNi  -> Does not align with C99 std
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(-1);
  });

  // Test 18: Verifies tan(1e-15 + 1e-15i), expecting ~1e-15 + i 1e-15.
  it("handles tan(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.tan(new Complex(1e-15, 1e-15));
    const denom = Math.cos(2e-15) + Math.cosh(2e-15); // ≈ 2
    const expectedReal = Math.sin(2e-15) / denom; // ≈ 1e-15
    const expectedImag = Math.sinh(2e-15) / denom; // ≈ 1e-15
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 19: Verifies tan(1 + ∞i), expecting 0 + i (large |y|, differs from mathjs: NaN + ∞i).
  it("handles tan(1 + ∞i) correctly", () => {
    const result = Complex.tan(new Complex(1, Infinity));
    // Wolfram tan(1 + ∞i) = i  -> Aligns with C99 std
    // mathjs: { re: 0, im: NaN }  -> Does not align with C99 std
    // Complex returns 0 + i to align with C99 for large |y|
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(1);
  });

  // Test 20: Verifies tan(1000π + 0i), expecting 0 + 0i (normalized to tan(0)).
  it("handles tan(1000π + 0i) correctly", () => {
    const result = Complex.tan(new Complex(1000 * Math.PI, 0));
    // Wolfram tan(1000π + 0i) = 0  -> Aligns with C99 std
    // mathjs: { re: -3.2141664592756335e-13, im: 0i }  -> Does not align with C99 std
    // Complex returns 0 + 0i to align with C99 for large |y|
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 21: Verifies tan(π/2 + 0i), expecting NaN + NaNi (pole, differs from mathjs: ∞ + 0i).
  it("handles tan(π/2 + 0i) correctly", () => {
    const result = Complex.tan(new Complex(Math.PI / 2, 0));
    // Wolfram tan(π/2 + 0i) = undefined  -> Aligns with C99 std (NaN + NaNi)
    // mathjs: { re: Infinity, im: 0 }  -> Does not align with C99 std
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 22: Verifies tan(-π/2 + 0i), expecting NaN + NaNi (pole, differs from mathjs: -∞ + 0i).
  it("handles tan(-π/2 + 0i) correctly", () => {
    const result = Complex.tan(new Complex(-Math.PI / 2, 0));
    // Wolfram tan(-π/2 + 0i) = undefined  -> Aligns with C99 std (NaN + NaNi)
    // mathjs: { re: -Infinity, im: 0 }  -> Does not align with C99 std
    // Complex returns NaN + NaNi to align with C99 std
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 23: Verifies tan(π/2 + ∞i), expecting 0 + i (large |y|, differs from mathjs: NaN + ∞i).
  it("handles tan(π/2 + ∞i) correctly", () => {
    const result = Complex.tan(new Complex(Math.PI / 2, Infinity));
    // Wolfram tan(π/2 + ∞i) = i  -> Aligns with C99 std
    // mathjs: { re: NaN, im: ∞ }  -> Does not align with C99 std
    // Complex returns 0 + 1i to align with C99 for large |y|
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(1);
  });
});
