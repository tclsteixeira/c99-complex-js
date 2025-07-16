import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.ceil", () => {
  // Test 1: Standard non-integer complex number
  it("computes ceil(3.7 + 4.2i) correctly", () => {
    const z = new Complex(3.7, 4.2);
    const result = Complex.ceil(z);
    expect(result.re).toBe(4);
    expect(result.im).toBe(5);
  });

  // Test 2: Integer complex number
  it("computes ceil(3 + 4i) correctly", () => {
    const z = new Complex(3, 4);
    const result = Complex.ceil(z);
    expect(result.re).toBe(3);
    expect(result.im).toBe(4);
  });

  // Test 3: Negative non-integer complex number
  it("computes ceil(-3.7 - 4.2i) correctly", () => {
    const z = new Complex(-3.7, -4.2);
    const result = Complex.ceil(z);
    expect(result.re).toBe(-3);
    expect(result.im).toBe(-4);
  });

  // Test 4: Zero complex number
  it("computes ceil(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.ceil(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  // Test 5: NaN input
  it("computes ceil(NaN + NaNi) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.ceil(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 6: Positive infinity
  it("computes ceil(∞ + ∞i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.ceil(z);
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBe(Number.POSITIVE_INFINITY);
  });

  // Test 7: Negative infinity
  it("computes ceil(-∞ - ∞i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.ceil(z);
    expect(result.re).toBe(Number.NEGATIVE_INFINITY);
    expect(result.im).toBe(Number.NEGATIVE_INFINITY);
  });

  // Test 8: Mixed infinity and finite
  it("computes ceil(∞ + 3.7i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 3.7);
    const result = Complex.ceil(z);
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBe(4);
  });

  // Test 9: Very small non-integer input
  it("computes ceil(1e-10 + 1e-10i) correctly", () => {
    const z = new Complex(1e-10, 1e-10);
    const result = Complex.ceil(z);
    expect(result.re).toBe(1);
    expect(result.im).toBe(1);
  });

  // Test 10: Mixed NaN and finite
  it("computes ceil(NaN + 3.7i) correctly", () => {
    const z = new Complex(NaN, 3.7);
    const result = Complex.ceil(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBe(4);
  });
});
