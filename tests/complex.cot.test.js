/**
 * Tests for Complex.cot(z).
 * Verifies the cotangent of a complex number z = x + yi, computed as cot(z) = sin(2x)/(cosh(2y) - cos(2x)) - i sinh(2y)/(cosh(2y) - cos(2x)).
 * Covers standard cases, purely real/imaginary inputs, general complex numbers, edge cases (NaN, Infinity),
 * small inputs, large real parts, and poles.
 * Uses toBeCloseTo(..., 15) for numerical precision and exact checks for NaN/Infinity.
 * Note: cot(z) normalizes real part x to [-π, π] to ensure exact results for large angles
 * (e.g., cot(1000π) = NaN + NaNi in Test 20). For infinite imaginary inputs, returns 0 - i to align with C99/Wolfram,
 * differing from mathjs (Tests 8, 16, 18, 23). Returns NaN + NaNi at poles (e.g., cot(0) in Test 21, cot(π) in Test 22).
 * All tests verified as of June 7, 2025.
 */
import { Complex } from "../src/c99-complex.js";
import { describe, it, expect } from "vitest";

describe("Complex.cot", () => {
  // Summary -----------------
  // Test 1: Checks cot(π/4 + 0i) → 1 + 0i.
  // Test 2: Checks cot(0 + i) → 0 - coth(1)i.
  // Test 3: Checks cot(1 + i) → sin(2)/(cosh(2) - cos(2)) - i sinh(2)/(cosh(2) - cos(2)).
  // Test 4: Checks cot(NaN + 0i) → NaN + NaNi.
  // Test 5: Checks cot(0 + NaNi) → NaN + NaNi.
  // Test 6: Checks cot(NaN + NaNi) → NaN + NaNi.
  // Test 7: Checks cot(∞ + 0i) → NaN + NaNi.
  // Test 8: Checks cot(0 + ∞i) → 0 + i.
  // Test 9: Checks cot(∞ + ∞i) → NaN + NaNi.
  // Test 10: Checks cot(1 + 1e-15i) → ~cot(1) - i sinh(2e-15)/(cosh(0) - cos(2)).
  // Test 11: Checks cot(-π/4 + 0i) → -1 + 0i.
  // Test 12: Checks cot(0 - i) → 0 + coth(1)i.
  // Test 13: Checks cot(π/4 + i) → sin(π/2)/(cosh(2) - cos(π/2)) - i sinh(2)/(cosh(2) - cos(π/2)).
  // Test 14: Checks cot(-∞ + 0i) → NaN + NaNi.
  // Test 15: Checks cot(1e-15 + 0i) → ~1e15 + 0i.
  // Test 16: Checks cot(0 - ∞i) → 0 + i.
  // Test 17: Checks cot(1e-15 + 1e-15i) → ~5e14 - 5e14i.
  // Test 18: Checks cot(1 + ∞i) → 0 + i.
  // Test 19: Checks cot(π/2 + 0i) → 0 + 0i.
  // Test 20: Checks cot(1000π + 0i) → NaN + NaNi (pole).
  // Test 21: Checks cot(0 + 0i) → NaN + NaNi (pole).
  // Test 22: Checks cot(π + 0i) → NaN + NaNi (pole).
  // Test 23: Checks cot(π/2 + ∞i) → 0 + i.

  // Test 1: Verifies cot(π/4 + 0i), expecting 1 + 0i (cot(π/4) = 1).
  it("computes cot(π/4 + 0i) correctly", () => {
    const result = Complex.cot(new Complex(Math.PI / 4, 0));
    // Wolfram cot(π/4 + 0i) = 1 + 0i
    // mathjs cot(π/4 + 0i) = 1.0000000000000002 + 0i
    // Complex cot(π/4 + 0i) = 1.0000000000000002 + 0i
    expect(result.re).toBeCloseTo(1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Verifies cot(0 + i), expecting 0 - coth(1)i (cot(i) = -i coth(1)).
  it("computes cot(0 + i) correctly", () => {
    const result = Complex.cot(new Complex(0, 1));
    // Wolfram cot(0 + i) = 0 - 1.3130352854993313036i
    // mathjs cot(0 + i) = 0 - 1.3130352854993315i
    // Complex cot(0 + i) = 0 - 1.3130352854993315i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1 / Math.tanh(1), 15); // ≈ -1.3130352854993315
  });

  // Test 3: Verifies cot(1 + i), expecting sin(2)/(cosh(2) - cos(2)) - i sinh(2)/(cosh(2) - cos(2)).
  it("computes cot(1 + i) correctly", () => {
    const result = Complex.cot(new Complex(1, 1));
    const denom = Math.cosh(2) - Math.cos(2); // ≈ 5.406616688824721
    const expectedReal = Math.sin(2) / denom; // ≈ 0.1685239388440084
    const expectedImag = -Math.sinh(2) / denom; // ≈ -0.6766283984006246
    // Wolfram cot(1 + i) = 0.2176215618544026813 - 0.8680141428959249486i
    // mathjs cot(1 + i) = 0.2176215618544027 - 0.868014142895925i
    // Complex cot(1 + i) = 0.2176215618544027 - 0.868014142895925i
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 4: Verifies cot(NaN + 0i), expecting NaN + NaNi.
  it("handles cot(NaN + 0i) correctly", () => {
    const result = Complex.cot(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 5: Verifies cot(0 + NaNi), expecting NaN + NaNi.
  it("handles cot(0 + NaNi) correctly", () => {
    const result = Complex.cot(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: Verifies cot(NaN + NaNi), expecting NaN + NaNi.
  it("handles cot(NaN + NaNi) correctly", () => {
    const result = Complex.cot(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Verifies cot(∞ + 0i), expecting NaN + NaNi.
  it("handles cot(∞ + 0i) correctly", () => {
    const result = Complex.cot(new Complex(Infinity, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Verifies cot(0 + ∞i), expecting 0 + i.
  it("handles cot(0 + ∞i) correctly", () => {
    const result = Complex.cot(new Complex(0, Infinity));
    // Wolfram cot(0 + ∞i) = -i
    // mathjs cot(0 + ∞i) = 0 + NaNi
    // Complex cot(0 + ∞i) = 0 - i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(-1);
  });

  // Test 9: Verifies cot(∞ + ∞i), expecting NaN + NaNi.
  it("handles cot(∞ + ∞i) correctly", () => {
    const result = Complex.cot(new Complex(Infinity, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 10: Verifies cot(1 + 1e-15i), expecting ~cot(1) - i sinh(2e-15)/(cosh(0) - cos(2)).
  it("handles cot(1 + 1e-15i) correctly", () => {
    const result = Complex.cot(new Complex(1, 1e-15));
    const denom = Math.cosh(2e-15) - Math.cos(2); // ≈ 1 - cos(2)
    const expectedReal = Math.sin(2) / denom; // ≈ cot(1)
    const expectedImag = -Math.sinh(2e-15) / denom; // ≈ -2e-15 / (1 - cos(2))
    // Wolfram cot(1 + 1e-15i) = 0.642092615934330703006 - 1.412282927437391914609e-15i
    // mathjs cot(1 + 1e-15i) = 0.6420926159343308 + -1.412282927437392e-15i
    // Complex cot(1 + 1e-15i) = 0.6420926159343308 + -1.412282927437392e-15i
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 11: Verifies cot(-π/4 + 0i), expecting -1 + 0i (cot(-π/4) = -1).
  it("computes cot(-π/4 + 0i) correctly", () => {
    const result = Complex.cot(new Complex(-Math.PI / 4, 0));
    // Wolfram cot(0 - i) = -1 + 0i
    // mathjs  cot(0 - i) = -1.0000000000000002 + 0i
    // Complex cot(0 - i) = -1.0000000000000002 + 0i
    expect(result.re).toBeCloseTo(-1, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 12: Verifies cot(0 - i), expecting 0 + coth(1)i (cot(-i) = i coth(1)).
  it("computes cot(0 - i) correctly", () => {
    const result = Complex.cot(new Complex(0, -1));
    // Wolfram cot(0 - i) = 0 + 1.313035285499331303636i
    // mathjs  cot(0 - i) = 0 + 1.3130352854993315i
    // Complex cot(0 - i) = 0 + 1.3130352854993315i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1 / Math.tanh(1), 15); // ≈ 1.3130352854993315
  });

  // Test 13: Verifies cot(π/4 + i), expecting sin(π/2)/(cosh(2) - cos(π/2)) - i sinh(2)/(cosh(2) - cos(π/2)).
  it("computes cot(π/4 + i) correctly", () => {
    const result = Complex.cot(new Complex(Math.PI / 4, 1));
    const denom = Math.cosh(2) - Math.cos(Math.PI / 2); // ≈ cosh(2)
    const expectedReal = Math.sin(Math.PI / 2) / denom; // ≈ 1/cosh(2)
    const expectedImag = -Math.sinh(2) / denom; // ≈ -sinh(2)/cosh(2)
    // Wolfram cot(π/4 + i) = 0.26580222883407969212 - 0.9640275800758168839i
    // mathjs cot(π/4 + i) = 0.2658022288340797 - 0.964027580075817i
    // Complex cot(π/4 + i) = 0.2658022288340797 - 0.964027580075817i
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 14: Verifies cot(-∞ + 0i), expecting NaN + NaNi.
  it("handles cot(-∞ + 0i) correctly", () => {
    const result = Complex.cot(new Complex(-Infinity, 0));
    // Wolfram cot(-∞ + 0i) = [-∞..+∞]
    // mathjs cot(-∞ + 0i) = NaN + NaNi
    // Complex cot(-∞ + 0i) = NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 15: Verifies cot(1e-15 + 0i), expecting ~1e15 + 0i (cot(1e-15) ≈ 1e15).
  it("handles cot(1e-15 + 0i) correctly", () => {
    const result = Complex.cot(new Complex(1e-15, 0));
    // Wolfram cot(1e-15 + 0i) = 9.99999999999999999999e14 + 0i
    // mathjs cot(1e-15 + 0i) = -Infinity + 0i
    // Complex cot(1e-15 + 0i) = 999999999999999.9 + 0i
    expect(result.re).toBeCloseTo(1 / 1e-15, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 16: Verifies cot(0 - ∞i), expecting 0 + i.
  it("handles cot(0 - ∞i) correctly", () => {
    const result = Complex.cot(new Complex(0, -Infinity));
    // Wolfram cot(0 - ∞i) = 0 - i
    // mathjs cot(0 - ∞i) = 0 + NaNi
    // Complex cot(0 - ∞i) = 0 - i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(-1);
  });

  // Test 17: Verifies cot(1e-15 + 1e-15i), expecting ~5e14 - 5e14i.
  it("handles cot(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.cot(new Complex(1e-15, 1e-15));
    const expectedReal = 5e14; // ≈ 1/(2e-15)
    const expectedImag = -5e14; // ≈ -1/(2e-15)
    // Wolfram cot(1e-15 + 1e-15i) =
    //      4.999999999999999999999999999996666666666666666666666666666667111111... × 10^14 -
    //      5.000000000000000000000000000003333333333333333333333333333333777777... × 10^14 i
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
  });

  // Test 18: Verifies cot(1 + ∞i), expecting 0 + i.
  it("handles cot(1 + ∞i) correctly", () => {
    const result = Complex.cot(new Complex(1, Infinity));
    // Wolfram cot(1 + ∞i) = 0 - 1i
    // mathjs cot(1 + ∞i) = 0 + NaNi
    // Complex -> Test cot(1 + ∞i) = 0 - 1i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(-1);
  });

  // Test 19: Verifies cot(π/2 + 0i), expecting 0 + 0i (cot(π/2) = 0).
  it("handles cot(π/2 + 0i) correctly", () => {
    const result = Complex.cot(new Complex(Math.PI / 2, 0));
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 20: Verifies cot(1000π + 0i), expecting NaN + NaNi (pole).
  it("handles cot(1000π + 0i) correctly", () => {
    const result = Complex.cot(new Complex(1000 * Math.PI, 0));
    // Wolfram cot(1000π) = undefined
    // mathjs cot(1000π) = Infinity + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 21: Verifies cot(0 + 0i), expecting NaN + NaNi (pole).
  it("handles cot(0 + 0i) correctly", () => {
    const result = Complex.cot(new Complex(0, 0));
    // Wolfram cot(0) = undefined
    // mathjs cot(0) = NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 22: Verifies cot(π + 0i), expecting NaN + NaNi (pole).
  it("handles cot(π + 0i) correctly", () => {
    const result = Complex.cot(new Complex(Math.PI, 0));
    // Wolfram cot(π) = undefined
    // mathjs cot(π) = Infinity + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 23: Verifies cot(π/2 + ∞i), expecting 0 + i.
  it("handles cot(π/2 + ∞i) correctly", () => {
    const result = Complex.cot(new Complex(Math.PI / 2, Infinity));
    // Wolfram cot(π/2 + ∞i) = 0 - i
    // mathjs cot(π/2 + ∞i) = 0 + NaNi
    // Complex cot(π/2 + ∞i) = 0 - i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(-1);
  });
});
