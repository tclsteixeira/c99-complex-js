// Complete Edge Case Table for exp(z)(C99 / IEEE 754)
//-------------------------------------------------------------------------
// Input 	              Output cexp(z)	            Explanation
// 0.0 + 0.0i	          1.0 + 0.0i	                exp(0) = 1
// -0.0 + 0.0i	        1.0 + 0.0i	                exp(-0) = 1, even with signed zero
// 0.0 + -0.0i	        1.0 + -0.0i	                exp(0 - i0) = 1 - i0 (phase preserved)
// -0.0 + -0.0i	        1.0 + -0.0i	                Same as above
// 1.0 + 0.0i	          e + 0.0i	                  exp(1) = e
// 0.0 + πi	            -1.0 + 0.0i	                Euler identity: exp(iπ) = -1
// 0.0 + π/2·i	        0.0 + 1.0i	                exp(iπ/2) = i
// 0.0 + -π/2·i	        0.0 - 1.0i	                Negative angle: exp(-iπ/2) = -i
// ln(2) + πi	          -2.0 + 0.0i	                exp(ln(2) + iπ) = -2
// -1.0 + 0.0i	        1/e + 0.0i	                Real exponential decay
// 3.0 + 4.0i	          ~(-13.128... - 15.201...i)	exp(3) · (cos(4), sin(4))
// ∞ + 0.0i	            ∞ + 0.0i	                  exp(∞) = ∞
// -∞ + 0.0i	          0.0 + 0.0i	                exp(-∞) = 0
// 0.0 +/- ∞·i          NaN + NaN·i
// ∞ + πi	              -∞ + 0.0i	                  exp(∞) * exp(iπ) = -∞
// ∞ + finite·i	        ∞ + NaN·i	                  Infinite magnitude with oscillating phase → imaginary part is indeterminate
// finite + ∞i	        NaN + NaN·i	                Oscillating phase undefined → full uncertainty
// finite + -∞i	        NaN + NaN·i	                Same
// ∞ + ∞i	              NaN + NaN·i	                exp(∞) * complex phase oscillates infinitely → undefined
// ∞ - ∞i               NaN + NaN·i                 The imaginary part -∞ again makes cos(-∞) and sin(-∞) undefined oscillations.
// -∞ +/- ∞i	            0 + 0 (or NaN)	            exp(-∞) → 0, but angle is undefined → usually NaN contamination
// ∞ + NaN·i	          Inf + NaN·i	                Angle is undefined, real part overflows
// -∞ + NaN·i	          0 + 0 (or NaN)	            exp(-Inf) = 0, but direction is NaN
// NaN +/- ∞·i	        NaN + NaN·i	                Infinite angle → exp(NaN) * complex angle = total uncertainty
// NaN + finite·i	      NaN + NaN·i	                NaN real → exp(NaN) = NaN
// finite + NaN·i	      NaN + NaN·i	                Phase is undefined
// NaN + NaN·i	        NaN + NaN·i	                Total uncertainty
// NaN + 0.0i	          NaN + 0.0i	                exp(NaN) = NaN, imaginary zero preserved
// 0.0 + NaN·i	        NaN + NaN·i	                exp(0) = 1, but angle undefined → total NaN
// 0.0 + DBL_MIN·i	    1.0 + DBL_MIN·i	            Taylor expansion around 1
// DBL_MIN + 0.0i	      ~1.0 + 0.0i	                exp(tiny) ≈ 1 + ε
// DBL_MIN + DBL_MIN·i	~1.0 + εi	                  Very small perturbation around 1
// 1e308 + 0.0i	        ∞ + 0.0i	                  Overflow
// -1e308 + 0.0i	      0.0 + 0.0i	                Underflow → flushes toward 0

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

// C99/IEEE 754 edge case tests for Complex.exp

describe("Complex.exp - C99/IEEE 754 edge cases", () => {
  // Test 1 - exp(0 + 0i) = 1 + 0i
  it("exp(0 + 0i) === 1 + 0i", () => {
    const z = new Complex(0.0, 0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(1.0);
    expect(result.im).toBe(0.0);
  });

  // Test 2 - exp(-0 + 0i) = 1 + 0i
  it("exp(-0 + 0i) === 1 + 0i", () => {
    const z = new Complex(-0.0, 0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(1.0);
    expect(result.im).toBe(0.0);
  });

  // Test 3 - exp(0 + -0i) = 1 + -0i
  it("exp(0 + -0i) === 1 + -0i", () => {
    const z = new Complex(0.0, -0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(1.0);
    expect(Object.is(result.im, -0.0)).toBe(true);
  });

  // Test 4 - exp(-0 + -0i) = 1 + -0i
  it("exp(-0 + -0i) === 1 + -0i", () => {
    const z = new Complex(-0.0, -0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(1.0);
    expect(Object.is(result.im, -0.0)).toBe(true);
  });

  // Test 5 - exp(0 + πi) = -1 + 0i
  it("exp(0 + πi) === -1 + 0i", () => {
    const z = new Complex(0.0, Math.PI);
    const result = Complex.exp(z);
    expect(result.re).toBeCloseTo(-1.0, 15);
    expect(result.im).toBeCloseTo(0.0, 15);
  });

  // Test 6 - exp(0 + π/2·i) = 0 + 1i
  it("exp(0 + π/2·i) === 0 + 1i", () => {
    const z = new Complex(0.0, Math.PI / 2);
    const result = Complex.exp(z);
    expect(result.re).toBeCloseTo(0.0, 15);
    expect(result.im).toBeCloseTo(1.0, 15);
  });

  // Test 7 - exp(0 - π/2·i) = 0 - 1i
  it("exp(0 - π/2·i) === 0 + 1i", () => {
    const z = new Complex(0.0, -Math.PI / 2);
    const result = Complex.exp(z);
    expect(result.re).toBeCloseTo(0.0, 15);
    expect(result.im).toBeCloseTo(-1.0, 15);
  });

  // Test 8 - exp(ln(2) + π·i) = -2 + 0i
  it("exp(ln(2) + π·i) === -2 + 0i", () => {
    const z = new Complex(Math.log(2), Math.PI);
    const result = Complex.exp(z);
    expect(result.re).toBeCloseTo(-2.0, 15);
    expect(result.im).toBeCloseTo(0.0, 15);
  });

  // Test 9 - exp(-1 + 0i) = 1/e + 0i
  it("exp(-1 + 0i) === 1/e + 0i", () => {
    const z = new Complex(-1.0, 0.0);
    const result = Complex.exp(z);
    expect(result.re).toBeCloseTo(1 / Math.E, 15);
    expect(result.im).toBeCloseTo(0.0, 15);
  });

  // Test 10 - exp(3 + 4i) ~(-13.128... - 15.201...i)
  it("exp(3 + 4i) === -13.128... - 15.201...i", () => {
    const z = new Complex(3.0, 4.0);
    const result = Complex.exp(z);
    // Wolfram: -13.128783081462158080327555 - 15.20078446306795456220348i
    expect(result.re).toBeCloseTo(-13.128783081462158080327555, 15);
    expect(result.im).toBeCloseTo(-15.20078446306795456220348, 15);
  });

  // Test 11 - exp(Inf + 0i) = Inf + 0i
  it("exp(Inf + 0i) === Inf + 0i", () => {
    const z = new Complex(Infinity, 0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(0.0);
  });

  // Test 12 - exp(-Inf + 0i) = 0 + 0i
  it("exp(-Inf + 0i) === 0 + 0i", () => {
    const z = new Complex(-Infinity, 0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(0.0);
  });

  // Test 13 - exp(0 + Inf·i) = NaN + NaN·i
  it("exp(0 + Inf·i) === NaN + NaN·i", () => {
    const z = new Complex(0.0, Infinity);
    const result = Complex.exp(z);
    // Octave = NaN + NaN·i
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 14 - exp(0 - Inf·i) = NaN + NaN·i
  it("exp(0 - Inf·i) === NaN + NaN·i", () => {
    const z = new Complex(0.0, -Infinity);
    const result = Complex.exp(z);
    // Octave = NaN + NaN·i
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 15 - exp(∞ + πi) = -∞ + 0.0i
  it("exp(∞ + πi) === -∞ + 0.0i", () => {
    const z = new Complex(Infinity, Math.PI);
    const result = Complex.exp(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBeCloseTo(0.0, 15);
  });

  // Test 16 - exp(∞ + finite·i) = ∞ + NaN·i
  it("exp(∞ + finite·i) === ∞ + NaN·i", () => {
    const z = new Complex(Infinity, 1.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 17 - exp(finite + ∞i) = NaN + NaN·i
  it("exp(finite + ∞i) === NaN + NaN·i", () => {
    const z = new Complex(1.0, Infinity);
    const result = Complex.exp(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 18 - exp(finite + ∞i) = NaN + NaN·i
  it("exp(finite - ∞i) === NaN + NaN·i", () => {
    const z = new Complex(1.0, -Infinity);
    const result = Complex.exp(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 19 - exp(∞ + ∞i) = NaN + NaN·i
  it("exp(∞ + ∞i) === NaN + NaN·i", () => {
    const z = new Complex(Infinity, Infinity);
    const result = Complex.exp(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 20 - exp(∞ - ∞i) = NaN + NaN·i
  it("exp(∞ - ∞i) === NaN + NaN·i", () => {
    const z = new Complex(Infinity, -Infinity);
    const result = Complex.exp(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 21 - exp(-∞ + ∞i) = 0.0 + 0.0 (NaN possible)
  it("exp(-∞ + ∞i) === 0.0 + 0.0 or NaN contamination", () => {
    const z = new Complex(-Infinity, Infinity);
    const result = Complex.exp(z);
    expect(result.re === 0.0 || Number.isNaN(result.re)).toBe(true);
    expect(result.im === 0.0 || Number.isNaN(result.im)).toBe(true);
  });

  // Test 22 - exp(Inf + NaN·i) = Inf + NaN·i
  it("exp(Inf + NaN·i) === Inf + NaN·i", () => {
    const z = new Complex(Infinity, NaN);
    const result = Complex.exp(z);
    // Octave = Inf + NaNi
    expect(result.re).toBe(Infinity);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 23 - exp(-Inf + NaN·i) = 0 + 0i
  it("exp(-Inf + NaN·i) === 0 + 0i", () => {
    const z = new Complex(-Infinity, NaN);
    const result = Complex.exp(z);
    // Octave = 0 + 0i
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(0.0);
  });

  // Test 24 - exp(NaN + Inf·i) = NaN + NaN·i
  it("exp(NaN + Inf·i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, Infinity);
    const result = Complex.exp(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 25 - exp(NaN + -Inf·i) = NaN + NaN·i
  it("exp(NaN + -Inf·i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, -Infinity);
    const result = Complex.exp(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 26 - exp(NaN + finitei) = NaN + NaN·i
  it("exp(NaN + 1i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, 1.0);
    const result = Complex.exp(z);
    // Octave = NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 27 - exp(finite + NaN·i) = NaN + NaN·i
  it("exp(1 + NaNi) === NaN + NaN·i", () => {
    const z = new Complex(1.0, NaN);
    const result = Complex.exp(z);
    // Octave = NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 28 - exp(NaN + NaN·i) = NaN + NaN·i
  it("exp(NaN + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.exp(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 29 - exp(NaN + 0i) = NaN + 0·i
  it("exp(NaN + 0i) === NaN + 0·i", () => {
    const z = new Complex(NaN, 0.0);
    const result = Complex.exp(z);
    // Octave = NaN
    expect(Number.isNaN(result.re)).toBe(true);
    expect(result.im).toBe(0);
  });

  // Test 30 - exp(0 + NaN·i) = NaN + NaN·i
  it("exp(0 + NaN·i) === NaN + NaN·i", () => {
    const z = new Complex(0.0, NaN);
    const result = Complex.exp(z);
    // Octave = NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 31 - exp(0.0 + DBL_MIN·i) ≈ 1.0 + DBL_MIN·i
  it("exp(0.0 + DBL_MIN·i) ≈ 1.0 + DBL_MIN·i", () => {
    const z = new Complex(0.0, Number.MIN_VALUE);
    const result = Complex.exp(z);
    // Octave = 1 + DBL_MIN·i
    expect(result.re).toBeCloseTo(1.0, 15);
    expect(result.im).toBeCloseTo(Number.MIN_VALUE, 15);
  });

  // Test 32 - exp(DBL_MIN + 0i) ≈ 1 + 0i
  it("exp(DBL_MIN + 0i) ≈ 1 + 0i", () => {
    const z = new Complex(Number.MIN_VALUE, 0.0);
    const result = Complex.exp(z);
    // Octave = 1 + 0i
    expect(result.re).toBeCloseTo(1.0, 15);
    expect(result.im).toBeCloseTo(0.0, 15);
  });

  // Test 33 - exp(DBL_MIN + DBL_MIN·i) ≈ 1.0 + εi -> ε = DBL_MIN
  it("exp(DBL_MIN + DBL_MIN·i) ≈ 1.0 + εi", () => {
    const z = new Complex(Number.MIN_VALUE, Number.MIN_VALUE);
    const result = Complex.exp(z);
    // Octave = 1.0000e+00 + DBL_MIN i
    expect(result.re).toBeCloseTo(1.0, 15);
    expect(result.im).toBeCloseTo(Number.MIN_VALUE, 15);
  });

  // Test 34 - exp(1e308 + 0i) = ∞ + 0.0i
  it("exp(1e308 + 0i) === ∞ + 0.0i", () => {
    const z = new Complex(1e308, 0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0.0, 15);
  });

  // Test 34 - exp(-1e308 + 0i) = 0.0 + 0.0i
  it("exp(-1e308 + 0i) === 0.0 + 0.0i", () => {
    const z = new Complex(-1e308, 0.0);
    const result = Complex.exp(z);
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(0.0);
  });
});

/**
 * Tests for Complex.exp(z).
 * Note: For cases like exp(∞ + π/2 i) (Test 9), we return 0 + Infinity i, assuming 0 * ∞ = 0 when cos(y) = 0 or sin(y) = 0.
 * This is a practical convention for numerical consistency, though C99 suggests NaN for 0 * ∞ (indeterminate).
 * All 12 tests pass with this implementation, and we assume other tests are correct as verified on June 3, 2025.
 */
/*
import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.exp", () => {
  // Test 1: Standard complex number
  it("computes exp(1 + 2i) correctly", () => {
    const z = new Complex(1, 2);
    const result = Complex.exp(z);
    // Wolfram exp(1 + 2i) =
    //     -1.13120438375681363843125525551079471062886799582652575021772191041650191... +
    //     2.47172667200481892761693089355166453273619036924100818420075883527783966... i
    const expectedReal = Math.exp(1) * Math.cos(2);
    const expectedImag = Math.exp(1) * Math.sin(2);
    expect(result.real).toBeCloseTo(expectedReal, 10);
    expect(result.imag).toBeCloseTo(expectedImag, 10);
  });

  // Test 2: Pure imaginary number
  it("computes exp(0 + πi) correctly", () => {
    const z = new Complex(0, Math.PI);
    const result = Complex.exp(z);
    // Wolfram exp(0 + πi) = -1 + 0i
    expect(result.real).toBeCloseTo(-1, 10);
    expect(result.imag).toBeCloseTo(0, 10);
  });

  // Test 3: NaN input
  it("computes exp(NaN + NaNi) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.exp(z);
    expect(result.real).toBeNaN();
    expect(result.imag).toBeNaN();
  });

  // Test 4: Positive infinity real part
  it("computes exp(∞ + 0i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 0);
    const result = Complex.exp(z);
    // Wolfram exp(∞ + 0i) = ∞
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 5: Negative infinity real part
  it("computes exp(-∞ + 0i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 0);
    const result = Complex.exp(z);
    // Wolfram exp(-∞ + 0i) = 0 + 0i
    expect(result.real).toBe(0);
    expect(result.imag).toBe(0);
  });

  // Test 6: Infinity imaginary part
  it("computes exp(0 + ∞i) correctly", () => {
    const z = new Complex(0, Number.POSITIVE_INFINITY);
    const result = Complex.exp(z);
    // Wolfram exp(0 + ∞i) = Undefined
    expect(result.real).toBeNaN();
    expect(result.imag).toBeNaN();
  });

  // Test 7: Mixed infinity and finite (πi)
  it("computes exp(∞ + πi) correctly", () => {
    // Note: exp(∞ + πi) = e^∞ * (cos(π) + i sin(π)) = ∞ * (-1 + 0i) = -∞ + 0i
    const z = new Complex(Number.POSITIVE_INFINITY, Math.PI);
    const result = Complex.exp(z);
    // Wolfram exp(∞ + πi) = ∞
    expect(result.real).toBe(Number.NEGATIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 8: Mixed infinity and finite (2πi)
  it("computes exp(∞ + 2πi) correctly", () => {
    // Note: exp(∞ + 2πi) = e^∞ * (cos(2π) + i sin(2π)) = ∞ * (1 + 0i) = ∞ + 0i
    const z = new Complex(Number.POSITIVE_INFINITY, 2 * Math.PI);
    const result = Complex.exp(z);
    // Wolfram exp(∞ + 2πi) = ∞
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 9: Mixed infinity and finite (π/2 i)
  it("computes exp(∞ + π/2 i) correctly", () => {
    // Note: exp(∞ + π/2 i) = e^∞ * (cos(π/2) + i sin(π/2)) = ∞ * (0 + i) = 0 + ∞i
    const z = new Complex(Number.POSITIVE_INFINITY, Math.PI / 2);
    const result = Complex.exp(z);
    // Wolfram exp(∞ + π/2 i) = ∞
    expect(result.real).toBe(0);
    expect(result.imag).toBe(Number.POSITIVE_INFINITY);
  });

  // Test 10: Near π multiple (π + 1e-12)
  it("computes exp(∞ + (π + 1e-12)i) correctly", () => {
    // Note: z.imag ≈ π, so expect same as exp(∞ + πi) = -∞ + 0i
    const z = new Complex(Number.POSITIVE_INFINITY, Math.PI + 1e-12);
    const result = Complex.exp(z);
    // Wolfram exp(∞ + (π + 1e-12)i) = ∞
    expect(result.real).toBe(Number.NEGATIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 11: Near 2π multiple (2π - 1e-12)
  it("computes exp(∞ + (2π - 1e-12)i) correctly", () => {
    // Note: z.imag ≈ 2π, so expect same as exp(∞ + 2πi) = ∞ + 0i
    const z = new Complex(Number.POSITIVE_INFINITY, 2 * Math.PI - 1e-12);
    const result = Complex.exp(z);
    // Wolfram exp(∞ + (2π - 1e-12)i) = ∞
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 12: Near π/2 multiple (π/2 + 1e-12)
  it("computes exp(∞ + (π/2 + 1e-12)i) correctly", () => {
    // Note: z.imag ≈ π/2, so expect same as exp(∞ + π/2 i) = 0 + ∞i
    const z = new Complex(Number.POSITIVE_INFINITY, Math.PI / 2 + 1e-12);
    const result = Complex.exp(z);
    // Wolfram exp(∞ + (π/2 + 1e-12)i) = ∞
    expect(result.real).toBe(0);
    expect(result.imag).toBe(Number.POSITIVE_INFINITY);
  });
});
*/
