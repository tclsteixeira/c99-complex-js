import { describe, expect, it } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.tanh", () => {
  // Tests 1–3, 5–20 unchanged
  // Test 1: Zero input, expect tanh(0 + 0i) = 0 + 0i
  it("computes tanh(0 + 0i) correctly", () => {
    const result = Complex.tanh(new Complex(0, 0));
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  // Test 2: Real input, expect tanh(1 + 0i) ≈ 0.7615941559557649
  it("computes tanh(1 + 0i) correctly", () => {
    const result = Complex.tanh(new Complex(1, 0));
    expect(result.re).toBeCloseTo(0.7615941559557649, 15);
    expect(result.im).toBe(0);
  });

  // Test 3: Pure imaginary, expect tanh(0 + π/2i) = NaN + i NaN (pole)
  it("computes tanh(0 + π/2i) correctly", () => {
    const result = Complex.tanh(new Complex(0, Math.PI / 2));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 4: Mixed input, expect tanh(1 + π/2i) ≈ 1.3130352854993312 + 0i (C99: finite, not a pole)
  it("computes tanh(1 + π/2i) correctly", () => {
    const result = Complex.tanh(new Complex(1, Math.PI / 2));
    expect(result.re).toBeCloseTo(1.3130352854993312, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 5: NaN real part, expect tanh(NaN + 0i) = NaN + i NaN
  it("handles tanh(NaN + 0i) correctly", () => {
    const result = Complex.tanh(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: NaN imaginary part, expect tanh(0 + NaNi) = NaN + i NaN
  it("handles tanh(0 + NaNi) correctly", () => {
    const result = Complex.tanh(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Both NaN, expect tanh(NaN + NaNi) = NaN + i NaN
  it("handles tanh(NaN + NaNi) correctly", () => {
    const result = Complex.tanh(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Infinite real part, expect tanh(∞ + 0i) = 1 + 0i
  it("handles tanh(∞ + 0i) correctly", () => {
    const result = Complex.tanh(new Complex(Infinity, 0));
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
  });

  // Test 9: Negative infinite real part, expect tanh(-∞ + 0i) = -1 + 0i
  it("handles tanh(-∞ + 0i) correctly", () => {
    const result = Complex.tanh(new Complex(-Infinity, 0));
    expect(result.re).toBe(-1);
    expect(result.im).toBe(0);
  });

  // Test 10: Infinite real part with π/2i, expect tanh(∞ + π/2i) = 1 + i NaN
  it("handles tanh(∞ + π/2i) correctly", () => {
    const result = Complex.tanh(new Complex(Infinity, Math.PI / 2));
    expect(result.re).toBe(1);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 11: Negative infinite real part with π/2i, expect tanh(-∞ + π/2i) = -1 + i NaN
  it("handles tanh(-∞ + π/2i) correctly", () => {
    const result = Complex.tanh(new Complex(-Infinity, Math.PI / 2));
    expect(result.re).toBe(-1);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 12: Infinite real part with finite imag, expect tanh(∞ + 1i) = 1 + i 0
  it("handles tanh(∞ + 1i) correctly", () => {
    const result = Complex.tanh(new Complex(Infinity, 1));
    expect(result.re).toBe(1);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 13: Infinite imaginary part, expect tanh(0 + ∞i) = NaN + i NaN
  it("handles tanh(0 + ∞i) correctly", () => {
    const result = Complex.tanh(new Complex(0, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 14: Finite real with infinite imag, expect tanh(1 + ∞i) = NaN + i NaN
  it("handles tanh(1 + ∞i) correctly", () => {
    const result = Complex.tanh(new Complex(1, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 15: Infinite real with NaN imag, expect tanh(∞ + NaNi) = 1 + i NaN
  it("handles tanh(∞ + NaNi) correctly", () => {
    const result = Complex.tanh(new Complex(Infinity, NaN));
    expect(result.re).toBe(1);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16: Small real input, expect tanh(1e-15 + 0i) ≈ 1e-15
  it("handles tanh(1e-15 + 0i) correctly", () => {
    const result = Complex.tanh(new Complex(1e-15, 0));
    expect(result.re).toBeCloseTo(1e-15, 15);
    expect(result.im).toBe(0);
  });

  // Test 17: Small complex input, expect tanh(1e-15 + 1e-15i) ≈ 1e-15 + i 1e-15
  it("handles tanh(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.tanh(new Complex(1e-15, 1e-15));
    expect(result.re).toBeCloseTo(1e-15, 15);
    expect(result.im).toBeCloseTo(1e-15, 15);
  });

  // Test 18: Pure imaginary πi, expect tanh(0 + πi) = 0 + 0i
  it("handles tanh(0 + πi) correctly", () => {
    const result = Complex.tanh(new Complex(0, Math.PI));
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  // Test 19: Real input π/4, expect tanh(π/4 + 0i) ≈ 0.6557942026326722
  it("computes tanh(π/4 + 0i) correctly", () => {
    const result = Complex.tanh(new Complex(Math.PI / 4, 0));
    expect(result.re).toBeCloseTo(0.6557942026326722, 15);
    expect(result.im).toBe(0);
  });

  // Test 20: Pure imaginary π/4i, expect tanh(0 + π/4i) = 0 + i
  it("computes tanh(0 + π/4i) correctly", () => {
    const result = Complex.tanh(new Complex(0, Math.PI / 4));
    expect(result.re).toBe(0);
    expect(result.im).toBeCloseTo(1, 15);
  });
});
