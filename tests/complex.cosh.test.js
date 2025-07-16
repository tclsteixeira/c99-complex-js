import { describe, expect, it } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.cosh", () => {
  // Test 1: Zero input, expect cosh(0 + 0i) = 1 + 0i (C99: cosh(0) = 1, cos(0) = 1, sin(0) = 0)
  it("computes cosh(0 + 0i) correctly", () => {
    const result = Complex.cosh(new Complex(0, 0));
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
  });

  // Test 2: Real input, expect cosh(1 + 0i) = cosh(1) ≈ 1.5430806348152437 (C99: cos(0) = 1, sin(0) = 0)
  it("computes cosh(1 + 0i) correctly", () => {
    const result = Complex.cosh(new Complex(1, 0));
    expect(result.re).toBeCloseTo(1.5430806348152437, 10);
    expect(result.im).toBe(0);
  });

  // Test 3: Pure imaginary, expect cosh(0 + π/2i) = 0 + 0i (C99: cosh(0) = 1, cos(π/2) = 0, sin(π/2) = 1, sinh(0) = 0)
  it("computes cosh(0 + π/2i) correctly", () => {
    const result = Complex.cosh(new Complex(0, Math.PI / 2));
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  // Test 4: Mixed input, expect cosh(1 + π/2i) = 0 + i sinh(1) (C99: cos(π/2) = 0, sin(π/2) = 1)
  it("computes cosh(1 + π/2i) correctly", () => {
    const result = Complex.cosh(new Complex(1, Math.PI / 2));
    expect(result.re).toBe(0);
    expect(result.im).toBeCloseTo(1.1752011936438014, 10);
  });

  // Test 5: NaN real part, expect cosh(NaN + 0i) = NaN + i NaN (C99: NaN propagates)
  it("handles cosh(NaN + 0i) correctly", () => {
    const result = Complex.cosh(new Complex(NaN, 0));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: NaN imaginary part, expect cosh(0 + NaNi) = NaN + i NaN (C99: NaN propagates)
  it("handles cosh(0 + NaNi) correctly", () => {
    const result = Complex.cosh(new Complex(0, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Both NaN, expect cosh(NaN + NaNi) = NaN + i NaN (C99: NaN propagates)
  it("handles cosh(NaN + NaNi) correctly", () => {
    const result = Complex.cosh(new Complex(NaN, NaN));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Infinite real part, expect cosh(∞ + 0i) = ∞ + 0i (C99: cosh(∞) = ∞, cos(0) = 1, sin(0) = 0)
  it("handles cosh(∞ + 0i) correctly", () => {
    const result = Complex.cosh(new Complex(Infinity, 0));
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(0);
  });

  // Test 9: Negative infinite real part, expect cosh(-∞ + 0i) = ∞ + 0i (C99: cosh(-∞) = ∞)
  it("handles cosh(-∞ + 0i) correctly", () => {
    const result = Complex.cosh(new Complex(-Infinity, 0));
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(0);
  });

  // Test 10: Infinite real part with π/2i, expect cosh(∞ + π/2i) = 0 + i ∞ (C99: cos(π/2) = 0, sin(π/2) = 1)
  it("handles cosh(∞ + π/2i) correctly", () => {
    const result = Complex.cosh(new Complex(Infinity, Math.PI / 2));
    expect(result.re).toBe(0);
    expect(result.im).toBe(Infinity);
  });

  // Test 11: Negative infinite real part with π/2i, expect cosh(-∞ + π/2i) = 0 - i ∞ (C99: sinh(-∞) = -∞)
  it("handles cosh(-∞ + π/2i) correctly", () => {
    const result = Complex.cosh(new Complex(-Infinity, Math.PI / 2));
    expect(result.re).toBe(0);
    expect(result.im).toBe(-Infinity);
  });

  // Test 12: Infinite real part with finite imag, expect cosh(∞ + 1i) = ∞ cos(1) + i ∞ sin(1) (C99: both parts infinite)
  it("handles cosh(∞ + 1i) correctly", () => {
    const result = Complex.cosh(new Complex(Infinity, 1));
    expect(result.re).toBe(Infinity); // cos(1) ≈ 0.5403 > 0
    expect(result.im).toBe(Infinity); // sin(1) ≈ 0.8415 > 0
  });

  // Test 13: Infinite imaginary part, expect cosh(0 + ∞i) = NaN + i NaN (C99: cos(∞), sin(∞) undefined)
  it("handles cosh(0 + ∞i) correctly", () => {
    const result = Complex.cosh(new Complex(0, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 14: Finite real with infinite imag, expect cosh(1 + ∞i) = NaN + i NaN (C99: cos(∞), sin(∞) undefined)
  it("handles cosh(1 + ∞i) correctly", () => {
    const result = Complex.cosh(new Complex(1, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 15: Infinite real with NaN imag, expect cosh(∞ + NaNi) = ∞ + i NaN (C99: cos(NaN) = NaN, sin(NaN) = NaN)
  it("handles cosh(∞ + NaNi) correctly", () => {
    const result = Complex.cosh(new Complex(Infinity, NaN));
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16: Small real input, expect cosh(1e-15 + 0i) ≈ 1 (C99: cosh(x) ≈ 1 for small x)
  it("handles cosh(1e-15 + 0i) correctly", () => {
    const result = Complex.cosh(new Complex(1e-15, 0));
    expect(result.re).toBeCloseTo(1, 10);
    expect(result.im).toBe(0);
  });

  // Test 17: Small complex input, expect cosh(1e-15 + 1e-15i) ≈ 1 + i 1e-15 (C99: cosh(z) ≈ 1 + i z for small |z|)
  it("handles cosh(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.cosh(new Complex(1e-15, 1e-15));
    expect(result.re).toBeCloseTo(1, 10);
    expect(result.im).toBeCloseTo(1e-15, 10);
  });

  // Test 18: Pure imaginary πi, expect cosh(0 + πi) = -1 + 0i (C99: cos(π) = -1, sin(π) = 0)
  it("handles cosh(0 + πi) correctly", () => {
    const result = Complex.cosh(new Complex(0, Math.PI));
    expect(result.re).toBeCloseTo(-1, 10);
    expect(result.im).toBe(0);
  });

  // Test 19: Real input π/4, expect cosh(π/4 + 0i) ≈ 1.3246090892520057 (C99: cos(0) = 1, sin(0) = 0)
  it("computes cosh(π/4 + 0i) correctly", () => {
    const result = Complex.cosh(new Complex(Math.PI / 4, 0));
    expect(result.re).toBeCloseTo(1.3246090892520057, 10);
    expect(result.im).toBe(0);
  });

  // Test 20: Pure imaginary π/4i, expect cosh(0 + π/4i) ≈ cos(π/4) (C99: cosh(0) = 1, sin(π/4) = 0)
  it("computes cosh(0 + π/4i) correctly", () => {
    const result = Complex.cosh(new Complex(0, Math.PI / 4));
    expect(result.re).toBeCloseTo(0.7071067811865476, 10);
    expect(result.im).toBe(0);
  });
});
