// C99 Edge Case Table — clog(z)
//-------------------------------------------------------------
// Input z = x + yi	                  Output clog(z)	        Explanation
// +0 + 0i	                          -∞ + 0i	                ln(0) = -∞, arg(+0 + 0i) = 0
// -0 + 0i	                          -∞ + πi	                arg(-0 + 0i) = π
// +0 - 0i	                          -∞ - 0i	                arg(+0 - 0i) = -0
// -0 - 0i	                          -∞ - πi	                arg(-0 - 0i) = -π
// x > 0 (finite), y = 0	            ln(x) + 0i	            Real logarithm
// x < 0 (finite), y = 0	`           ln(-x) + i·π            The magnitude of z = |z| = |x| = -x (since x < 0). C99 specifies atan2(0, x) = π (Annex G.6.2.2), as z lies on the negative real axis.
// x > 0 (finite), y = -0	            ln(x) - 0i	            Reflects negative zero on imaginary axis
// x < 0 (finite), y = -0	`           ln(-x) - i·π            Magnitude: y = -0 (negative zero) = |x| = -x. The argument = atan2(y, x). C99 specifies that atan2(-0, x) for x < 0 returns -π.
// 0 + y·i (y > 0 finite)	            ln(y) + i·π/2	          Magnitude: |z| = |y| = y (since y < 0), z lies on the positive imaginary axis so arg(z) = arctan2(y, 0) = π/2
// 0 + y·i (y < 0 finite)	            ln(-y) - i·π/2	        The magnitude |z| = |y| = -y (since y < 0, so -y > 0), z lies on the negative imaginary axis arg(z) = arctan2(y, 0) = -π/2.
// ∞ + finite·i	                      ln(∞) + arg(∞ + y)i	    Magnitude infinite, phase from atan2
// -∞ + finite·i	                    ln(∞) + arg(-∞ + y)i
// finite + ∞·i	                      ln(∞) + arg(x + ∞)i
// finite - ∞·i	                      ln(∞) + arg(x - ∞)i
// ∞ + ∞·i	                          ln(∞) + π/4·i	          Magnitude infinite, phase π/4
// -∞ + ∞·i	                          ln(∞) + 3π/4·i
// -∞ - ∞·i	                          ln(∞) - 3π/4·i
// ∞ - ∞·i	                          ln(∞) - π/4·i
// NaN + finite·i or finite + NaN·i	  NaN + NaN·i	            NaN contaminates result
// NaN + NaN·i	                      NaN + NaN·i	            Full NaN input
// ∞ + NaN·i or NaN + ∞·i	            ∞ + NaN·i	              Magnitude = ∞, angle is NaN → imaginary part becomes NaN
// 0 + NaN·i	                        NaN + NaN·i             Magnitude and argument are undefined due to NaN imaginary part.
// NaN + 0i	                          NaN + NaN·i             NaN + 0i	NaN + NaN·i	Magnitude and argument are undefined due to NaN real part.

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

// C99/IEEE 754 edge case tests for Complex.ln

describe("Complex.ln - C99/IEEE 754 edge cases", () => {
  // Test 1 - ln(+0 + 0i) = -Inf + 0i
  it("ln(+0 + 0i) === -Infinity + 0i", () => {
    const z = new Complex(0.0, 0.0);
    const result = Complex.ln(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBe(0.0);
  });

  // Test 2 - ln(-0 + 0i) = -Inf + πi
  it("ln(-0 + 0i) === -Infinity + πi", () => {
    const z = new Complex(-0.0, 0.0);
    const result = Complex.ln(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBeCloseTo(Math.PI, 15);
  });

  // Test 3 - ln(+0 - 0i) = -Inf - 0i
  it("ln(+0 - 0i) === -Infinity - 0i", () => {
    const z = new Complex(0.0, -0.0);
    const result = Complex.ln(z);
    expect(result.re).toBe(-Infinity);
    expect(Object.is(result.im, -0.0)).toBe(true);
  });

  // Test 4 - ln(-0 - 0i) = -Inf - πi
  it("ln(-0 - 0i) === -Infinity - πi", () => {
    const z = new Complex(-0.0, -0.0);
    const result = Complex.ln(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBeCloseTo(-Math.PI, 15);
  });

  // Test 5 - ln(4 + 0i) = ln(4) + 0i
  it("ln(4 + 0i) === ln(4) + 0i", () => {
    const z = new Complex(4.0, 0.0);
    const result = Complex.ln(z);
    expect(result.re).toBeCloseTo(Math.log(4.0), 15);
    expect(result.im).toBe(0.0);
  });

  // Test 6 - ln(-4 + 0i) = ln(4) + πi
  it("ln(-4 + 0i) === ln(4) + πi", () => {
    const z = new Complex(-4.0, 0.0);
    const result = Complex.ln(z);
    expect(result.re).toBeCloseTo(Math.log(4.0), 15);
    expect(result.im).toBeCloseTo(Math.PI, 15);
  });

  // Test 7 - ln(4 - 0i) = ln(4) - 0i
  it("ln(4 - 0i) === ln(4) - 0i", () => {
    const z = new Complex(4.0, -0.0);
    const result = Complex.ln(z);
    expect(result.re).toBeCloseTo(Math.log(4.0), 15);
    expect(Object.is(result.im, -0.0)).toBe(true);
  });

  // Test 8 - ln(-4 - 0i) = ln(4) - πi
  it("ln(-4 - 0i) === ln(4) - πi", () => {
    const z = new Complex(-4.0, -0.0);
    const result = Complex.ln(z);
    expect(result.re).toBeCloseTo(Math.log(4.0), 15);
    expect(result.im).toBeCloseTo(-Math.PI, 15);
  });

  // Test 9 - ln(0 + 4i) = ln(4) + π/2·i
  it("ln(0 + 4i) === ln(4) + π/2·i", () => {
    const z = new Complex(0.0, 4.0);
    const result = Complex.ln(z);
    expect(result.re).toBeCloseTo(Math.log(4.0), 15);
    expect(result.im).toBeCloseTo(Math.PI / 2, 15);
  });

  // Test 10 - ln(0 - 4i) = ln(4) - π/2·i
  it("ln(0 - 4i) === ln(4) - π/2·i", () => {
    const z = new Complex(0.0, -4.0);
    const result = Complex.ln(z);
    expect(result.re).toBeCloseTo(Math.log(4.0), 15);
    expect(result.im).toBeCloseTo(-Math.PI / 2, 15);
  });

  // Test 11 - ln(∞ + 1i)
  it("ln(∞ + 1i) === ∞ + arg(∞ + 1i)i", () => {
    const z = new Complex(Infinity, 1.0);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(Math.atan2(1.0, Infinity), 15);
  });

  // Test 12 - ln(-∞ + 1i)
  it("ln(-∞ + 1i) === ∞ + arg(-∞ + 1i)i", () => {
    const z = new Complex(-Infinity, 1.0);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(Math.atan2(1.0, -Infinity), 15);
  });

  // Test 13 - ln(1 + ∞i)
  it("ln(1 + ∞i) === ∞ + arg(1 + ∞)i", () => {
    const z = new Complex(1.0, Infinity);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(Math.atan2(Infinity, 1.0), 15);
  });

  // Test 14 - ln(1 - ∞i)
  it("ln(1 - ∞i) === ∞ + arg(1 - ∞)i", () => {
    const z = new Complex(1.0, -Infinity);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(Math.atan2(-Infinity, 1.0), 15);
  });

  // Test 15 - ln(∞ + ∞i)
  it("ln(∞ + ∞i) === ∞ + π/4·i", () => {
    const z = new Complex(Infinity, Infinity);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(Math.PI / 4, 15);
  });

  // Test 16 - ln(-∞ + ∞i)
  it("ln(-∞ + ∞i) === ∞ + 3π/4·i", () => {
    const z = new Complex(-Infinity, Infinity);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo((3 * Math.PI) / 4, 15);
  });

  // Test 17 - ln(-∞ - ∞i)
  it("ln(-∞ - ∞i) === ∞ - 3π/4·i", () => {
    const z = new Complex(-Infinity, -Infinity);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo((-3 * Math.PI) / 4, 15);
  });

  // Test 18 - ln(∞ - ∞i)
  it("ln(∞ - ∞i) === ∞ - π/4·i", () => {
    const z = new Complex(Infinity, -Infinity);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(-Math.PI / 4, 15);
  });

  // Test 19 - ln(NaN + 2i)
  it("ln(NaN + 2i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, 2.0);
    const result = Complex.ln(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 20 - ln(2 + NaN·i)
  it("ln(2 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(2.0, NaN);
    const result = Complex.ln(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 21 - ln(NaN + NaN·i)
  it("ln(NaN + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.ln(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 22 - ln(∞ + NaN·i)
  it("ln(∞ + NaN·i) === ∞ + NaN·i", () => {
    const z = new Complex(Infinity, NaN);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 23 - ln(NaN + ∞·i)
  it("ln(NaN + ∞·i) === ∞ + NaN·i", () => {
    const z = new Complex(NaN, Infinity);
    const result = Complex.ln(z);
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 24 - ln(0 + NaN·i)
  it("ln(0 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(0.0, NaN);
    const result = Complex.ln(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 25 - ln(NaN + 0i)
  it("ln(NaN + 0i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, 0.0);
    const result = Complex.ln(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });
});

/*
import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.ln", () => {
  // Test 1: Standard complex number
  it("computes ln(3 + 4i) correctly", () => {
    const z = new Complex(3, 4);
    const result = Complex.ln(z);
    // |z| = 5, arg(z) = atan2(4, 3) ≈ 0.9272952180016122
    // ln(z) = ln(5) + i * 0.9272952180016122
    const expectedReal = Math.log(5);
    const expectedImag = Math.atan2(4, 3);
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 2: Positive real number
  it("computes ln(2 + 0i) correctly", () => {
    const z = new Complex(2, 0);
    const result = Complex.ln(z);
    // ln(2) = ln(2) + i * 0
    expect(result.real).toBeCloseTo(Math.LN2, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 3: Negative real number
  it("computes ln(-2 + 0i) correctly", () => {
    const z = new Complex(-2, 0);
    const result = Complex.ln(z);
    // ln(-2) = ln(2) + i * π
    expect(result.real).toBeCloseTo(Math.LN2, 15);
    expect(result.imag).toBeCloseTo(Math.PI, 15);
  });

  // Test 4: Pure imaginary number
  it("computes ln(0 + 1i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.ln(z);
    // ln(i) = ln(1) + i * π/2 = 0 + i * π/2
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(Math.PI / 2, 15);
  });

  // Test 5: Negative pure imaginary number
  it("computes ln(0 - 1i) correctly", () => {
    const z = new Complex(0, -1);
    const result = Complex.ln(z);
    // ln(-i) = ln(1) + i * (-π/2) = 0 - i * π/2
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(-Math.PI / 2, 15);
  });

  // Test 6: Zero complex number
  it("computes ln(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.ln(z);
    // ln(0) = -∞ (principal value, arg indeterminate)
    expect(result.real).toBe(Number.NEGATIVE_INFINITY);
    expect(result.imag).toBe(0); // Convention: arg(0) = 0
  });

  // Test 7: NaN input
  it("computes ln(NaN + NaNi) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.ln(z);
    expect(result.real).toBeNaN();
    expect(result.imag).toBeNaN();
  });

  // Test 8: Infinity real part
  it("computes ln(∞ + 0i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 0);
    const result = Complex.ln(z);
    // ln(∞) = ∞ + i * 0
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 9: Complex infinity
  it("computes ln(∞ + ∞i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.ln(z);
    // ln(∞ + ∞i) = ln(∞) + i * arg(∞ + ∞i) = ∞ + i * π/4
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBeCloseTo(Math.PI / 4, 15);
  });

  // Test 10: Large magnitude
  it("computes ln(1e150 + 1e150i) correctly", () => {
    const z = new Complex(1e150, 1e150);
    const result = Complex.ln(z);
    // |z| = √2 * 1e150, arg(z) = π/4
    // ln(z) = ln(√2 * 1e150) + i * π/4 = (150 * ln(10) + ln(√2)) + i * π/4
    const expectedReal = 150 * Math.LN10 + 0.5 * Math.LN2;
    const expectedImag = Math.PI / 4;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 11: Small magnitude
  it("computes ln(1e-150 + 1e-150i) correctly", () => {
    const z = new Complex(1e-150, 1e-150);
    const result = Complex.ln(z);
    // Expected result from Wolfram Alpha:
    // ln(1e-150 + 1e-150i) ≈ -345.04119035882687994799010214192554285612747322713581877793884514038919
    //                       + 0.78539816339744830961566084581987572104929234984377645524373614807695410i
    // Computed as ln(|z|) + i * arg(z), where |z| = √2 * 1e-150, arg(z) = π/4.
    // Precision note: JavaScript's 64-bit floating-point arithmetic (IEEE 754) limits precision to ~15-17 digits.
    // For subnormal inputs like 1e-150, Math.hypot (used in Complex.abs) and Math.log introduce errors ~1e-14
    // due to denormalized number handling. This causes the real part to be -345.0411903588269, differing
    // from the expected -345.04119035882695 by ~5.68e-14. mathjs produces the same result, confirming
    // the error is inherent. Thus, real part precision is relaxed to 12 digits (error < 1e-12), consistent
    // with Complex.sqrt and Complex.pow tests for large/small magnitudes. The imaginary part, computed via
    // Math.atan2, is precise, allowing 14-digit precision.

    // |z| = √2 * 1e-150, arg(z) = π/4
    // ln(z) = ln(√2 * 1e-150) + i * π/4 = (-150 * ln(10) + ln(√2)) + i * π/4
    // console.log(
    //   `Result Complex.ln(1e-150 + 1e-150) = ${result.toString(false)}`
    // );
    const expectedReal = -150 * Math.LN10 + 0.5 * Math.LN2;
    const expectedImag = Math.PI / 4;
    expect(result.real).toBeCloseTo(expectedReal, 12);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 12: Negative real, small imaginary
  it("computes ln(-1 + 1e-10i) correctly", () => {
    const z = new Complex(-1, 1e-10);
    const result = Complex.ln(z);
    // |z| ≈ 1, arg(z) ≈ π - 1e-10
    // ln(z) ≈ ln(1) + i * (π - 1e-10) ≈ 0 + i * (π - 1e-10)
    const expectedReal = Math.log(Complex.abs(z));
    const expectedImag = Math.atan2(1e-10, -1);
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 13: Positive real, negative imaginary
  it("computes ln(1 - 1i) correctly", () => {
    const z = new Complex(1, -1);
    const result = Complex.ln(z);
    // |z| = √2, arg(z) = -π/4
    // ln(z) = ln(√2) + i * (-π/4)
    const expectedReal = 0.5 * Math.LN2;
    const expectedImag = -Math.PI / 4;
    expect(result.real).toBeCloseTo(expectedReal, 15);
    expect(result.imag).toBeCloseTo(expectedImag, 15);
  });

  // Test 14: Infinity with finite imaginary
  it("computes ln(∞ + 1i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.ln(z);
    // ln(∞ + 1i) = ln(∞) + i * 0 = ∞ + i * 0
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 15: Property: ln(z) + ln(-z) = ln(z * -z)
  it("verifies ln(1 + 1i) + ln(-1 - 1i) = ln((1 + 1i) * (-1 - 1i))", () => {
    const z = new Complex(1, 1);
    const minusZ = new Complex(-1, -1);
    const lnZ = Complex.ln(z);
    const lnMinusZ = Complex.ln(minusZ);
    const product = Complex.mul(z, minusZ);
    const lnProduct = Complex.ln(product);
    const sumLn = new Complex(
      lnZ.real + lnMinusZ.real,
      lnZ.imag + lnMinusZ.imag
    );
    expect(sumLn.real).toBeCloseTo(lnProduct.real, 15);
    expect(sumLn.imag).toBeCloseTo(lnProduct.imag, 15);
  });
});
*/
