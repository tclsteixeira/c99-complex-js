// C99 Division Rules Table for z1 / z2
// -------------------------------------------------------------------------------------------------
// Case #  z1=a+b i	                z2=c+d i                  Result	           Notes / Sign Rules
// -------------------------------------------------------------------------------------
// 1       0 + 0 i                   0 + 0 i	               NaN + NaN i	     Indeterminate 0/0
// 2       finite	                0 + 0 i	                  ±∞ + ±∞ i	        Signs from sign⁡(a)sign(a) and sign⁡(b)sign(b)
// 3	   0 + 0 i	                 finite	                   0 + 0 i	            Signed zeros: signs from 0⋅c+0⋅dc2+d2c2+d20⋅c+0⋅d​ and 0⋅c−0⋅dc2+d2c2+d20⋅c−0⋅d​ (always +0 by convention)
// 4	   finite	                NaN part	                 NaN + NaN i	       Any NaN in denominator → full NaN
// 5	   NaN part	                finite	                 NaN + NaN i	       Any NaN in numerator → full NaN
// 6	   finite	                ∞ + ∞ i (both infinite)	   ±0 + ±0 i	        Signed zeros: ℜℜ-sign ← sign of (a c+b d) treating 0 ⁣⋅ ⁣∞→+00⋅∞→+0,	ℑℑ-sign ← sign of (b c−a d).
// 7	   finite	                ∞  – ∞ i (opposite signs)	   ±0 + ±0 i	Same formula as case 6, but dd has opposite sign → changes imaginary‑zero sign
// 8	   finite	                ±∞ + 0 i or 0 + ±∞ i	        ±0 + ±0 i	One infinite part → still zero result, but sign driven by that one term
// 9	   ∞ + ∞ i	                finite	                   ±∞ + ±∞ i	ℜ=∞⋅c−∞⋅dℜ=∞⋅c−∞⋅d, ℑ=∞⋅d+∞⋅cℑ=∞⋅d+∞⋅c → infinities or NaN if cancellation
// 10	   ∞ – ∞ i (mixed signs)    finite	                   ±∞ + ±∞ i / NaN	Real part = ∞·c – (–∞)·d = ∞+∞ → ∞; imaginary = (–∞)·c + ∞·d etc.; if any ∞–∞ → NaN
// 11	   finite	        very large vs very small	     finite / 0 → underflow or small finite	Handled by Kahan algorithm
// 12	   very large vs very small	finite	                 finite
// 13	   subnormal	            subnormal	             finite
// 14	   NaN + ∞i	                ±∞ + finite i	          NaN + NaN i	    NaN contaminates when paired with non‑infinite
// 15	   ∞ + NaN i	             finite	                   NaN + NaN i	    Same as case 14
// 16	   ∞ + NaN i	             ±∞ + ∞ i	                NaN+ NaN i	     Infinite denominator branch takes precedence → signed zero

// 17 finite	                ∞ + NaN i	              ±0 + ±0 i	        Same as case 6 but with one NaN in denominator part ignored in infinity branch
// a ≥ 0, b ≥ 0 (finite)        ∞ + NaN·i               +0 + 0i
// a ≥ 0, b < 0 (finite)        ∞ + NaN·i               +0 - 0i
// a < 0, b ≥ 0 (finite)        ∞ + NaN·i               -0 + 0i
// a < 0, b < 0 (finite)        ∞ + NaN·i               -0 - 0i
// a ≤ 0, b ≤ 0 (finite)        -∞ + NaN·i              +0 + 0i
// a ≤ 0, b > 0 (finite)        -∞ + NaN·i              +0 - 0i
// a > 0, b ≤ 0 (finite)        -∞ + NaN·i              -0 + 0i
// a > 0, b > 0 (finite)        -∞ + NaN·i              -0 - 0i

// 18	   NaN + 0 i	            ±∞ + ±∞ i	              ±0 + ±0 i	        Same as case 6
// 19      0 + NaN·i / ∞ + ∞i	+0 + +0i	Imaginary NaN is ignored since real part is 0, and divisor is infinite: falls under case 6
// 20      0 + NaN·i / -∞ + ∞i	-0 + +0i	Same magnitude but negative real part in denominator: real part becomes -0
// 21      0 + NaN·i / ∞ - ∞i	+0 - 0i	Imaginary sign in denominator is -∞ → reflected in imaginary part
// 22      0 + NaN·i / -∞ - ∞i	-0 - 0i	Real and imaginary both negative → signs propagate to both zero parts
// 19	   0 + NaN i	             ±∞ + ±∞ i	               ±0 + ±0 i	    Same as case 6
// -------------------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust import as needed

describe("C.div (C99-compliant)", () => {
  const C = Complex;

  /**
   * Verifies if the result match the expected values within a given tolerance.
   * @param {*} result
   * @param {*} expectedRe
   * @param {*} expectedIm
   * @param {*} epsilon
   */
  function expectClose(result, expectedRe, expectedIm, epsilon = 1e-15) {
    expect(result.re).toBeCloseTo(expectedRe, epsilon);
    expect(result.im).toBeCloseTo(expectedIm, epsilon);
  }

  /**
   * Verifies if result zeros are correctly signed.
   * @param {Complex} result - The imput complex result.
   * @param {*} expectedReSign - The expected real zero (signed) result.
   * @param {*} expectedImSign - The expected imaginary zero (signed) result.
   */
  function expectSignedZero(result, expectedReSign, expectedImSign) {
    expect(Object.is(result.re, expectedReSign)).toBe(true);
    expect(Object.is(result.im, expectedImSign)).toBe(true);
  }

  // Test 1
  it("1. 0 + 0i / 0 + 0i = NaN + NaN·i", () => {
    const result = C.div(new C(0, 0), new C(0, 0));
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 2
  it("2. 1 + 1i / 0 + 0i = Infinity + Infinity·i", () => {
    const result = C.div(new C(1, 1), new C(0, 0));
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });

  // Test 3
  it("3. 0 + 0i / 1 + 1i = 0 + 0i", () => {
    const result = C.div(new C(0, 0), new C(1, 1));
    expectClose(result, 0, 0);
  });

  // Test 4 - C99 allows result ∞ +/- ∞i
  it("4. ∞ + 0i / 1 + 1i = ∞ +/- ∞·i (signs may vary)", () => {
    const result = C.div(new C(Infinity, 0), new C(1, 1));
    expect(Math.abs(result.re)).toBe(Infinity);
    expect(Math.abs(result.im)).toBe(Infinity);
  });

  // Test 5
  it("5. ∞ + ∞i / ∞ + ∞i = NaN + NaN·i", () => {
    const result = C.div(new C(Infinity, Infinity), new C(Infinity, Infinity));
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 6
  it("6. 1 + 1i / ∞ + ∞i = 0 + 0i", () => {
    const result = C.div(new C(1, 1), new C(Infinity, Infinity));
    expectClose(result, 0, 0);
  });

  //Test 7
  it("7. NaN + 1i / 1 + 1i = NaN + NaN·i", () => {
    const result = C.div(new C(NaN, 1), new C(1, 1));
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 8
  it("8. 1 + 1i / NaN + 1i = NaN + NaN·i", () => {
    const result = C.div(new C(1, 1), new C(NaN, 1));
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 9
  it("9. 3 + 4i / 1 + 2i = 2.2 - 0.4i", () => {
    const result = C.div(new C(3, 4), new C(1, 2));
    expectClose(result, 2.2, -0.4);
  });

  // Test 10
  it("10. 1 + 2i / 3 + 4i = 0.44 + 0.08i", () => {
    const result = C.div(new C(1, 2), new C(3, 4));
    expectClose(result, 0.44, 0.08);
  });

  // Test 11
  it("11. 1 + 0i / +∞ + ∞i = +0 + 0i", () => {
    const result = C.div(new C(1, 0), new C(Infinity, Infinity));
    expect(Object.is(result.re, +0)).toBe(true);
    expect(Object.is(result.im, -0)).toBe(true);
  });

  // Test 12
  it("12. 1 + 0i / -∞ - ∞i = -0 - 0i", () => {
    const resultNeg = C.div(new C(1, 0), new C(-Infinity, -Infinity));
    expect(Object.is(resultNeg.re, -0)).toBe(true);
    expect(Object.is(resultNeg.im, +0)).toBe(true);
  });

  // Test 13
  it("(1 - 0i) / (∞ + ∞i) => +0 - 0i", () => {
    const result = C.div(new C(1, -0), new C(Infinity, Infinity));
    expectSignedZero(result, +0, -0);
  });

  // Test 14
  it("(1 - 0i) / (-∞ - ∞i) => -0 + 0i", () => {
    const result = C.div(new C(1, -0), new C(-Infinity, -Infinity));
    expectSignedZero(result, -0, +0);
  });

  // Test 15
  it("(1 - 0i) / (∞ - ∞i) => +0 + 0i", () => {
    const result = C.div(new C(1, -0), new C(Infinity, -Infinity));
    expectSignedZero(result, +0, +0);
  });

  // Test 16
  it("(1 - 0i) / (-∞ + ∞i) => -0 - 0i", () => {
    const result = C.div(new C(1, -0), new C(-Infinity, Infinity));
    expectSignedZero(result, -0, -0);
  });

  // Test 17
  it("(-1 - 0i) / (∞ + ∞i) => -0 + 0i", () => {
    const result = C.div(new C(-1, -0), new C(Infinity, Infinity));
    expectSignedZero(result, -0, +0);
  });

  // Test 18
  it("(-1 - 0i) / (-∞ - ∞i) => +0 - 0i", () => {
    const result = C.div(new C(-1, -0), new C(-Infinity, -Infinity));
    expectSignedZero(result, +0, -0);
  });

  // Test 19
  it("(-1 - 0i) / (∞ - ∞i) => -0 - 0i", () => {
    const result = C.div(new C(-1, -0), new C(Infinity, -Infinity));
    expectSignedZero(result, -0, -0);
  });

  // Test 20
  it("(-1 - 0i) / (-∞ + ∞i) => +0 + 0i", () => {
    const result = C.div(new C(-1, -0), new C(-Infinity, Infinity));
    expectSignedZero(result, +0, +0);
  });

  // Additional signed-zero infinity variations
  // Test 21
  it("(1 - 0i) / (∞ + ∞i) => +0 - 0i", () => {
    const result = C.div(new C(1, -0), new C(Infinity, Infinity));
    expectSignedZero(result, +0, -0);
  });

  // Test 22
  it("(1 - 0i) / (-∞ - ∞i) => -0 + 0i", () => {
    const result = C.div(new C(1, -0), new C(-Infinity, -Infinity));
    expectSignedZero(result, -0, +0);
  });

  // Test 23
  it("(1 - 0i) / (∞ - ∞i) => +0 + 0i", () => {
    const result = C.div(new C(1, -0), new C(Infinity, -Infinity));
    expectSignedZero(result, +0, +0);
  });

  // Test 24
  it("(1 - 0i) / (-∞ + ∞i) => -0 - 0i", () => {
    const result = C.div(new C(1, -0), new C(-Infinity, Infinity));
    expectSignedZero(result, -0, -0);
  });

  // Test 25
  it("(-1 - 0i) / (∞ + ∞i) => -0 + 0i", () => {
    const result = C.div(new C(-1, -0), new C(Infinity, Infinity));
    expectSignedZero(result, -0, +0);
  });

  // Test 26
  it("(-1 - 0i) / (-∞ - ∞i) => +0 - 0i", () => {
    const result = C.div(new C(-1, -0), new C(-Infinity, -Infinity));
    expectSignedZero(result, +0, -0);
  });

  // Test 27
  it("(-1 - 0i) / (∞ - ∞i) => -0 - 0i", () => {
    const result = C.div(new C(-1, -0), new C(Infinity, -Infinity));
    expectSignedZero(result, -0, -0);
  });

  // Test 28
  it("(-1 - 0i) / (-∞ + ∞i) => +0 + 0i", () => {
    const result = C.div(new C(-1, -0), new C(-Infinity, Infinity));
    expectSignedZero(result, +0, +0);
  });

  // Test 29
  // NaN/∞ denominator edge cases
  it("NaN + ∞i / 1 + 2i = NaN + NaN·i", () => {
    const result = C.div(new C(NaN, Infinity), new C(1, 2));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 30
  it("∞ + NaN·i / 2 + 3i = NaN + NaN·i", () => {
    const result = C.div(new C(Infinity, NaN), new C(2, 3));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Rule 31
  it("∞ + NaN·i / ∞ + ∞i = NaN + NaNi", () => {
    const result = C.div(new C(Infinity, NaN), new C(Infinity, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 32
  it("∞ + NaN·i / -∞ - ∞i = -0 + 0i", () => {
    const result = C.div(new C(Infinity, NaN), new C(-Infinity, -Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 33
  it("∞ + NaN·i / ∞ - ∞i = +0 + 0i", () => {
    const result = C.div(new C(Infinity, NaN), new C(Infinity, -Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 34
  it("∞ + NaN·i / -∞ + ∞i = -0 - 0i", () => {
    const result = C.div(new C(Infinity, NaN), new C(-Infinity, Infinity));
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 35
  it("1 + 2i / ∞ + NaN·i = +0 + 0i", () => {
    const result = C.div(new C(1, 2), new C(Infinity, NaN));
    expectSignedZero(result, +0, +0);
  });

  // Test 36
  it("NaN + 0i / ∞ + ∞i = +0 + 0i", () => {
    const result = C.div(new C(NaN, 0), new C(Infinity, Infinity));
    expectSignedZero(result, +0, +0);
  });

  // Test 37
  it("NaN + 0i / -∞ - ∞i = -0 + +0i", () => {
    const result = C.div(new C(NaN, 0), new C(-Infinity, -Infinity));
    expectSignedZero(result, -0, +0);
  });

  // Test 38
  it("NaN + 0i / ∞ - ∞i = +0 + +0i", () => {
    const result = C.div(new C(NaN, 0), new C(Infinity, -Infinity));
    expectSignedZero(result, +0, +0);
  });

  // Test 39
  it("NaN + 0i / -∞ + ∞i = -0 + -0i", () => {
    const result = C.div(new C(NaN, 0), new C(-Infinity, Infinity));
    expectSignedZero(result, -0, -0);
  });

  // Test 40
  it("0 + NaN·i / ∞ + ∞i = +0 + 0i", () => {
    const result = C.div(new C(0, NaN), new C(Infinity, Infinity));
    expectSignedZero(result, +0, +0);
  });

  // Test 41
  it("1 + 2·i / NaN + NaNi = +0 + 0i", () => {
    const result = C.div(new C(1, 2), new C(NaN, NaN));
    expectSignedZero(result, +0, +0);
  });
});
