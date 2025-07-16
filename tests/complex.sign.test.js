// Full C99 Edge Case Rules Table — sign(z)
//-------------------------------------------------------------
// Input z = x + yi	                Output sign(z)	Explanation
// +0 + 0i	                        +0 + 0i	Defined: 0 stays 0
// -0 + 0i	                        -0 + 0i	Preserves signed zero
// +0 - 0i	                        +0 - 0i	Preserves sign of imaginary part
// -0 - 0i	                        -0 - 0i	Preserves sign of both zeros
// finite x, y (and z ≠ 0)	        sign(z) = z / |z|         The normalized vector z / |z| has magnitude 1 and the same angle (argument) as z.
// x = +∞, y = finite	              (x + yi) / ∞ = 1 + 0i	Magnitude → ∞, direction unit vector
// x = -∞, y = finite	              -1 + 0i	Negative direction on unit circle
// x = finite, y = +∞	              0 + i	Infinity dominates direction → up (π/2)
// x = finite, y = -∞	              0 - i	Direction dominated by negative imaginary part → arg ≈ -π/2
// x = ∞, y = ∞	                    1/√2 + i/√2	45° on unit circle
// x = -∞, y = ∞	                  -1/√2 + i/√2	135° on unit circle
// x = -∞, y = -∞	                  -1/√2 - i/√2	-135°
// x = ∞, y = -∞	                  1/√2 - i/√2	-45°
// x = NaN, y = finite	            NaN + NaN·i	NaN contaminates output
// x = finite, y = NaN	            NaN + NaN·i	Same
// x = NaN, y = NaN	                NaN + NaN·i	Undefined
// z has real or imag infinity 	    Finite complex number on the unit circle with same direction as z	Since `sign(z) = z /
// z has real or imag NaN	          NaN + NaN·i	Because either z or `

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.sign", () => {
  const Sqrt1Over2 = Math.SQRT1_2; // ≈ 0.7071067811865476

  // Test 1: sign(0 + 0i)
  it("computes sign(0 + 0i) = 0 + 0i correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.sign(z);
    expect(Object.is(result.re, +0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  // Test 2: sign(-0 + 0i)
  it("computes sign(-0 + 0i) = -0 + 0i correctly", () => {
    const z = new Complex(-0, 0);
    const result = Complex.sign(z);
    expect(Object.is(result.re, -0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  // Test 3: sign(+0 - 0i)
  it("computes sign(+0 - 0i) = +0 - 0i correctly", () => {
    const z = new Complex(0, -0);
    const result = Complex.sign(z);
    expect(Object.is(result.re, +0)).toBeTruthy();
    expect(Object.is(result.im, -0)).toBeTruthy();
  });

  // Test 4: sign(-0 - 0i)
  it("computes sign(-0 - 0i) = -0 - 0i correctly", () => {
    const z = new Complex(-0, -0);
    const result = Complex.sign(z);
    expect(Object.is(result.re, -0)).toBeTruthy();
    expect(Object.is(result.im, -0)).toBeTruthy();
  });

  // Test 5: Pure positive real finite input
  it("computes sign(5 + 0i) = 1 + 0i correctly", () => {
    const z = new Complex(5, 0);
    const result = Complex.sign(z);
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 6: Positive real infinity, finite imaginary
  it("computes sign(∞ + 5i) = 1 + 0i correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 5);
    const result = Complex.sign(z);
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 7: Negative real infinity, finite imaginary
  it("computes sign(-∞ + 5i) = -1 + 0i correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 5);
    const result = Complex.sign(z);
    expect(result.re).toBe(-1);
    expect(result.im).toBe(0);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 8: Finite real, positive imaginary infinity
  it("computes sign(5 + ∞i) = 0 + i correctly", () => {
    const z = new Complex(5, Number.POSITIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(1);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 9: Finite real, negative imaginary infinity
  it("computes sign(5 - ∞i) = 0 - i correctly", () => {
    const z = new Complex(5, Number.NEGATIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(-1);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 10: Both positive infinity
  it("computes sign(∞ + ∞i) = 1/√2 + i/√2 correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBeCloseTo(Sqrt1Over2, 15);
    expect(result.im).toBeCloseTo(Sqrt1Over2, 15);
    expect(Math.hypot(result.re, result.im)).toBeCloseTo(1, 15);
  });

  // Test 11: Negative real, positive imaginary infinity
  it("computes sign(-∞ + ∞i) = -1/√2 + i/√2 correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBeCloseTo(-Sqrt1Over2, 15);
    expect(result.im).toBeCloseTo(+Sqrt1Over2, 15);
    expect(Math.hypot(result.re, result.im)).toBeCloseTo(1, 15);
  });

  // Test 12: Both negative infinity
  it("computes sign(-∞ - ∞i) = -1/√2 - i/√2 correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBeCloseTo(-Sqrt1Over2, 15);
    expect(result.im).toBeCloseTo(-Sqrt1Over2, 15);
    expect(Math.hypot(result.re, result.im)).toBeCloseTo(1, 15);
  });

  // Test 13: Positive real, negative imaginary infinity
  it("computes sign(∞ - ∞i) = 1/√2 - i/√2 correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBeCloseTo(Sqrt1Over2, 15);
    expect(result.im).toBeCloseTo(-Sqrt1Over2, 15);
    expect(Math.hypot(result.re, result.im)).toBeCloseTo(1, 15);
  });

  // Test 14: NaN real part with finite imaginary
  it("computes sign(NaN + 0i) = NaN + NaNi correctly", () => {
    const z = new Complex(NaN, 0);
    const result = Complex.sign(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 15: Real finite and NaN imaginary part
  it("computes sign(0 + NaNi) = NaN + NaNi correctly", () => {
    const z = new Complex(0, NaN);
    const result = Complex.sign(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 16: NaN input
  it("computes sign(NaN + NaNi) = NaN + NaNi correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.sign(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 11: Finite real, positive imaginary infinity
  it("computes sign(5 + ∞i) = 0 + i correctly", () => {
    const z = new Complex(5, Number.POSITIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(1);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 12: Finite real, negative imaginary infinity
  it("computes sign(5 - ∞i) = 0 - i correctly", () => {
    const z = new Complex(5, Number.NEGATIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(-1);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 13: Positive real infinity, zero imaginary
  it("computes sign(∞ + 0i) = 1 + 0i correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 0);
    const result = Complex.sign(z);
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 14: Zero real, positive imaginary infinity
  it("computes sign(0 + ∞i) = 0 + 1i correctly", () => {
    const z = new Complex(0, Number.POSITIVE_INFINITY);
    const result = Complex.sign(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(1);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 15: Near-zero input
  it("computes sign(1e-150 + 1e-150i) = 1/√2 + i/√2 correctly", () => {
    const z = new Complex(1e-150, 1e-150);
    const result = Complex.sign(z);
    const expectedReal = Sqrt1Over2;
    const expectedImag = Sqrt1Over2;
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(expectedImag, 15);
    expect(Math.hypot(result.re, result.im)).toBeCloseTo(1, 15);
  });

  // Test 16: Standard finite input (for completeness)
  it("computes sign(3 + 4i) = 0.6 + 0.8i correctly", () => {
    const z = new Complex(3, 4);
    const result = Complex.sign(z);
    const mod = Math.hypot(3, 4); // 5
    expect(result.re).toBeCloseTo(3 / mod, 15); // 0.6
    expect(result.im).toBeCloseTo(4 / mod, 15); // 0.8
    expect(Math.hypot(result.re, result.im)).toBeCloseTo(1, 15);
  });

  // Test 18: Pure negative real finite input
  it("computes sign(-5 + 0i) = -1 + 0i correctly", () => {
    const z = new Complex(-5, 0);
    const result = Complex.sign(z);
    expect(result.re).toBe(-1);
    expect(result.im).toBe(0);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 19: Pure positive imaginary finite input
  it("computes sign(0 + 5i) = 0 + 1i correctly", () => {
    const z = new Complex(0, 5);
    const result = Complex.sign(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(1);
    expect(Math.hypot(result.re, result.im)).toBe(1);
  });

  // Test 20: Infinite real, NaN imaginary
  it("computes sign(∞ + NaNi) = NaN + NaNi correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, NaN);
    const result = Complex.sign(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });
});
