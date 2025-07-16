import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.round", () => {
  // Test 1: Standard non-integer with 2 decimal places
  it("computes round(3.756 + 4.237i, 2) correctly", () => {
    const z = new Complex(3.756, 4.237);
    const result = Complex.round(z, 2);
    expect(result.re).toBeCloseTo(3.76, 10);
    expect(result.im).toBeCloseTo(4.24, 10);
  });

  // Test 2: Integer complex number with 2 decimal places
  it("computes round(3 + 4i, 2) correctly", () => {
    const z = new Complex(3, 4);
    const result = Complex.round(z, 2);
    expect(result.re).toBe(3);
    expect(result.im).toBe(4);
  });

  // Test 3: Negative non-integer with 1 decimal place
  it("computes round(-3.756 - 4.237i, 1) correctly", () => {
    const z = new Complex(-3.756, -4.237);
    const result = Complex.round(z, 1);
    expect(result.re).toBeCloseTo(-3.8, 10);
    expect(result.im).toBeCloseTo(-4.2, 10);
  });

  // Test 4: Zero complex number with 0 decimal places
  it("computes round(0 + 0i, 0) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.round(z, 0);
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  // Test 5: NaN input
  it("computes round(NaN + NaNi, 2) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.round(z, 2);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 6: Positive infinity
  it("computes round(∞ + ∞i, 2) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.round(z, 2);
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBe(Number.POSITIVE_INFINITY);
  });

  // Test 7: Negative infinity
  it("computes round(-∞ - ∞i, 2) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.round(z, 2);
    expect(result.re).toBe(Number.NEGATIVE_INFINITY);
    expect(result.im).toBe(Number.NEGATIVE_INFINITY);
  });

  // Test 8: Mixed infinity and finite
  it("computes round(∞ + 3.756i, 2) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 3.756);
    const result = Complex.round(z, 2);
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(3.76, 10);
  });

  // Test 9: Very small non-integer input
  it("computes round(1e-10 + 1e-10i, 5) correctly", () => {
    const z = new Complex(1e-10, 1e-10);
    const result = Complex.round(z, 5);
    expect(result.re).toBeCloseTo(0, 10);
    expect(result.im).toBeCloseTo(0, 10);
  });

  // Test 10: Mixed NaN and finite
  it("computes round(NaN + 3.756i, 2) correctly", () => {
    const z = new Complex(NaN, 3.756);
    const result = Complex.round(z, 2);
    expect(result.re).toBeNaN();
    expect(result.im).toBeCloseTo(3.76, 10);
  });

  // Test 11: Invalid numDec (NaN)
  it("computes round(3.756 + 4.237i, NaN) correctly", () => {
    const z = new Complex(3.756, 4.237);
    const result = Complex.round(z, NaN);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 12: Undefined numDec
  it("computes round(3.756 + 4.237i, undefined) correctly", () => {
    const z = new Complex(3.756, 4.237);
    const result = Complex.round(z, undefined);
    expect(result.re).toBe(4);
    expect(result.im).toBe(4);
  });
});
