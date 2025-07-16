// C99 scenarios that still matter for log10(z)
// Because log10(z) is just a linear transformation of ln(z), the same edge behaviors will apply:
// -------------------------------------------------------------------------------------
// Input z = x + yi       Output = ln(z) / ln(10)             Explanation
// -------------------------------------------------------------------------------------
// ±0 + 0i	              -∞ / ln(10) + ±0 / ln(10)·i         Should result in signed infinities
// 0 + y·i (y > 0)	      log10(|y|) + i·π/(2·ln(10))         Magnitude: |z| = |y|, arg = π/2
// 0 + y·i (y < 0)	      log10(|y|) - i·π/(2·ln(10))         Arg = -π/2
// -x + 0i	              log10(x) + ±π / ln(10)·i            Arg from negative real axis
// ±∞ + ±∞·i	            ∞ + angle / ln(10)·i                Infinite magnitude, defined angle
// NaN in any component	  NaN + NaN·i                         Must propagate

// log10(z) — Derived from ln(z)
import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

const PI = Math.PI;
const LN10 = Math.LN10;

describe("Complex.log10 — derived from ln(z)", () => {
  // Test 1 - z = log10(+0 + 0i)
  it("log10(+0 + 0i) === -Infinity + 0i", () => {
    const z = new Complex(0.0, 0.0);
    const result = Complex.log10(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBe(0.0);
  });

  // Test 2 - z = log10(-0 + 0i)
  it("log10(-0 + 0i) === -Infinity + πi / LN10", () => {
    const z = new Complex(-0.0, 0.0);
    const result = Complex.log10(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBeCloseTo(PI / LN10);
  });

  // Test 3 - z = log10(4 + 0i)
  it("log10(4 + 0i) === log10(4) + 0i", () => {
    const z = new Complex(4, 0);
    const result = Complex.log10(z);
    expect(result.re).toBeCloseTo(Math.log10(4));
    expect(result.im).toBe(0);
  });

  // Test 4 - z = log10(-4 + 0i)
  it("log10(-4 + 0i) === log10(4) + πi / LN10", () => {
    const z = new Complex(-4, 0);
    const result = Complex.log10(z);
    expect(result.re).toBeCloseTo(Math.log10(4));
    expect(result.im).toBeCloseTo(PI / LN10);
  });

  // Test 5 - z = log10(0 + 5i)
  it("log10(0 + 5i) === log10(5) + π/2·i / LN10", () => {
    const z = new Complex(0, 5);
    const result = Complex.log10(z);
    expect(result.re).toBeCloseTo(Math.log10(5));
    expect(result.im).toBeCloseTo(PI / 2 / LN10);
  });

  // Test 6 - z = log10(0 - 6i)
  it("log10(0 - 6i) === log10(6) - π/2·i / LN10", () => {
    const z = new Complex(0, -6);
    const result = Complex.log10(z);
    expect(result.re).toBeCloseTo(Math.log10(6));
    expect(result.im).toBeCloseTo(-PI / 2 / LN10);
  });

  // Test 7 - z = log10(∞ + 0i)
  it("log10(∞ + 0i) === ∞ + 0i", () => {
    const z = new Complex(Infinity, 0);
    const result = Complex.log10(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(0);
  });

  // Test 8 - z = log10(-∞ + 0i)
  it("log10(-∞ + 0i) === ∞ + πi / LN10", () => {
    const z = new Complex(-Infinity, 0);
    const result = Complex.log10(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(PI / LN10);
  });

  // Test 9 - z = log10(NaN + 0i)
  it("log10(NaN + 0i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, 0);
    const result = Complex.log10(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 10 - z = log10(0 + NaN·i)
  it("log10(0 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(0, NaN);
    const result = Complex.log10(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });
});
