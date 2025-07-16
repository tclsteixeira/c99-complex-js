// Input	                      Output	          Explanation
//---------------------------------------------------------------
// 1.0 + 0i, any z2	            1.0 + 0i	        Anything^0 = 1; 1^z = exp(z·log(1)) = 1
// any z1, 0.0 + 0i	            1.0 + 0i	        z^0 = 1 for z≠0; log branch handled consistently
// 0.0 + 0i, z2 > 0	            0.0 + 0i	        0^positive = 0
// 0.0 + 0i, z2 = 0	            1.0 + 0i	        0^0 is defined as 1 in C99 for complex power
// 0.0 + 0i, z2 < 0	            ∞ + 0i or NaN	  0^negative → division by zero; magnitude → ∞ or NaN depending on branch
// 0.0 + 0i, NaN imaginary	    NaN + NaN·i	      Log(0) undefined branch → NaN
// ∞ + 0i, z2 ≠ 0 finite	      ∞ + 0i	          ∞^finite positive = ∞
// ∞ + 0i, z2 = 0	              1.0 + 0i	        log(∞)=∞, z2·∞ → 0*∞ undefined, but 0 exponent → 1
// ∞ + 0i, z2 negative	        0.0 + 0i	        ∞^negative = 0
// ∞ + 0i, NaN imaginary	      NaN + NaN·i	      Branch cut undefined → NaN
// ∞ + ∞i, z2 finite real	      NaN + NaN·i
// ∞ ± ∞i, z2 finite	          NaN + NaN·i
// finite, z2 = ∞ + 0i	        NaN + 0i or ∞ + 0i	    exp(∞·log(z1)): sign depends on Re(log(z1)); could be ∞ or NaN
// finite, z2 = 0 + ∞i	        NaN + NaN·i	            oscillating exponent magnitude → undefined
// finite, z2 = ∞ + ∞i	        NaN + NaN·i	            magnitude infinite × oscillatory → undefined
// NaN anywhere	                NaN + NaN·i             (unless overridden)	Propagates NaN unless ∞ dominates branch
// DBL_MIN, small z2	          ≈1 + z2*(log(DBL_MIN))	small exponent around 1
// 1e308, z2=2	                ∞ + 0i	                (1e308)^2 overflows
// 1e-308, z2 = -2	            ∞ + 0i or 0.0+0i	      may overflow to ∞ or underflow to 0 based on branch
// −∞ + 0i,	Real, even integer	+∞ + 0i	                Because (−∞)²ⁿ → +∞
// −∞ + 0i,	Real, odd integer	  −∞ + 0i	                Because (−∞)²ⁿ⁺¹ → −∞
// −∞ + 0i,	Real, non-integer	  NaN + NaN·i	            Because log(−∞) → ∞ + πi → branch cut → complex result is undefined
// −∞ + 0i,	Complex (any)	      NaN + NaN·i	            Same reason: log(−∞) has discontinuity → result is NaN
// −∞ + finite i ≠ 0,	Finite	  finite (directional)	  Approaches finite complex value along branch of log()
// −∞ + ∞i or −∞ − ∞i	Finite	  NaN + NaN·i	            Undefined magnitude/angle → log() is undefined → NaN

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

// C99/IEEE 754 edge case tests for Complex.pow

describe("Complex.pow - C99/IEEE 754 edge cases", () => {
  // Test 1 - pow(1 + 0i, any z2) = 1 + 0i
  it("pow(1 + 0i, z2) === 1 + 0i", () => {
    const z1 = new Complex(1.0, 0.0);
    const z2 = new Complex(3.14, 2.71);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBeCloseTo(1.0);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 2 - pow(z1, 0 + 0i) = 1 + 0i
  it("pow(z1, 0 + 0i) === 1 + 0i", () => {
    const z1 = new Complex(3.14, -2.0);
    const z2 = new Complex(0.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBeCloseTo(1.0);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 3 - pow(0 + 0i, z2 > 0) = 0 + 0i
  it("pow(0 + 0i, 2 + 0i) === 0 + 0i", () => {
    const z1 = new Complex(0.0, 0.0);
    const z2 = new Complex(2.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(0.0);
  });

  // Test 4 - pow(0 + 0i, 0 + 0i) = 1 + 0i
  it("pow(0 + 0i, 0 + 0i) === 1 + 0i", () => {
    const z1 = new Complex(0.0, 0.0);
    const z2 = new Complex(0.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(1.0);
    expect(result.im).toBe(0.0);
  });

  // Test 5 - pow(0 + 0i, -2 + 0i) = ∞ + 0i
  it("pow(0 + 0i, -2 + 0i) === Infinity", () => {
    const z1 = new Complex(0.0, 0.0);
    const z2 = new Complex(-2.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 6 - pow(0 + 0i, NaN·i) = NaN + NaN·i
  it("pow(0 + 0i, NaN·i) === NaN + NaN·i", () => {
    const z1 = new Complex(0.0, 0.0);
    const z2 = new Complex(0.0, NaN);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7 - pow(∞ + 0i, finite z2) = ∞ + 0i
  it("pow(∞ + 0i, 1 + 0i) === ∞ + 0i", () => {
    const z1 = new Complex(Infinity, 0.0);
    const z2 = new Complex(1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 8 - pow(∞ + 0i, 0 + 0i) = 1 + 0i
  it("pow(∞ + 0i, 0 + 0i) === 1 + 0i", () => {
    const z1 = new Complex(Infinity, 0.0);
    const z2 = new Complex(0.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(1.0);
    expect(result.im).toBe(0.0);
  });

  // Test 9 - pow(∞ + 0i, -1 + 0i) = 0 + 0i
  it("pow(∞ + 0i, -1 + 0i) === 0 + 0i", () => {
    const z1 = new Complex(Infinity, 0.0);
    const z2 = new Complex(-1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(0.0);
    expect(result.im).toBe(0.0);
  });

  // Test 10 - pow(∞ + 0i, NaN·i) = NaN + NaN·i
  it("pow(∞ + 0i, NaN·i) === NaN + NaN·i", () => {
    const z1 = new Complex(Infinity, 0.0);
    const z2 = new Complex(0.0, NaN);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 11 - pow(∞ + ∞i, finite) = NaN + NaN·i
  it("pow(∞ + ∞i, 1 + 0i) === NaN + NaN·i", () => {
    const z1 = new Complex(Infinity, Infinity);
    const z2 = new Complex(1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 12 - pow(∞ - ∞i, finite) = NaN + NaN·i
  it("pow(∞ - ∞i, 1 + 0i) === NaN + NaN·i", () => {
    const z1 = new Complex(Infinity, -Infinity);
    const z2 = new Complex(1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 13 - pow(finite, ∞ + 0i) = NaN + 0i or ∞ + 0i
  it("pow(2 + 0i, ∞ + 0i) === ∞ + 0i", () => {
    const z1 = new Complex(2.0, 0.0);
    const z2 = new Complex(Infinity, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 14 - pow(finite, 0 + ∞i) = NaN + NaN·i
  it("pow(2 + 0i, 0 + ∞i) === NaN + NaN·i", () => {
    const z1 = new Complex(2.0, 0.0);
    const z2 = new Complex(0.0, Infinity);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 15 - pow(finite, ∞ + ∞i) = NaN + NaN·i
  it("pow(2 + 0i, ∞ + ∞i) === NaN + NaN·i", () => {
    const z1 = new Complex(2.0, 0.0);
    const z2 = new Complex(Infinity, Infinity);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16 - pow(NaN + 0i, anything) = NaN + NaN·i
  it("pow(NaN + 0i, 1 + 0i) === NaN + NaN·i", () => {
    const z1 = new Complex(NaN, 0.0);
    const z2 = new Complex(1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 17 - pow(DBL_MIN, 0.0001 + 0i) ≈ 1 + small
  it("pow(DBL_MIN, 0.0001 + 0i) ≈ small + 0i", () => {
    const z1 = new Complex(Number.MIN_VALUE, 0.0);
    const z2 = new Complex(0.0001, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBeGreaterThan(0.0);
    expect(Number.isFinite(result.re)).toBe(true);
  });

  // Test 18 - pow(1e308 + 0i, 2 + 0i) = ∞ + 0i
  it("pow(1e308 + 0i, 2 + 0i) === ∞ + 0i", () => {
    const z1 = new Complex(1e308, 0.0);
    const z2 = new Complex(2.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 19 - pow(1e-308 + 0i, -2 + 0i) = ∞ + 0i
  it("pow(1e-308 + 0i, -2 + 0i) === ∞ + 0i", () => {
    const z1 = new Complex(1e-308, 0.0);
    const z2 = new Complex(-2.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 20 - pow(-∞ + 0i, 2 + 0i) = Infinity + 0i
  it("pow(-∞ + 0i, 2 + 0i) === Infinity + 0i", () => {
    const z1 = new Complex(-Infinity, 0.0);
    const z2 = new Complex(2.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 21 - pow(-∞ + 0i, 3 + 0i) = -Infinity + 0i
  it("pow(-∞ + 0i, 3 + 0i) === -Infinity + 0i", () => {
    const z1 = new Complex(-Infinity, 0.0);
    const z2 = new Complex(3.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBeCloseTo(0.0);
  });

  // Test 22 - pow(-∞ + 0i, 2.5 + 0i) = NaN + NaN·i
  it("pow(-∞ + 0i, 2.5 + 0i) === NaN + NaN·i", () => {
    const z1 = new Complex(-Infinity, 0.0);
    const z2 = new Complex(2.5, 0.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 23 - pow(-∞ + 0i, 1 + 1i) = NaN + NaN·i
  it("pow(-∞ + 0i, 1 + 1i) === NaN + NaN·i", () => {
    const z1 = new Complex(-Infinity, 0.0);
    const z2 = new Complex(1.0, 1.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 24 - pow(-∞ + 1.0i, 1 + 0i) = result with infinite magnitude, not NaN
  it("pow(-∞ + 1.0i, 1 + 0i) has defined angle, magnitude = Infinity", () => {
    const z1 = new Complex(-Infinity, 1.0);
    const z2 = new Complex(1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(false);
    expect(Number.isNaN(result.im)).toBe(false);
    expect(Complex.abs(result)).toBe(Infinity);
  }); // Tresultest 24 - pow(-∞ + 1.0i, 1 + 0i) = finite complex

  // it("pow(-∞ + 1.0i, 1 + 0i) yields finite result", () => {

  //   const z1 = new Complex(-Infinity, 1.0);
  //   const z2 = new Complex(1.0, 0.0);
  //   const result = Complex.pow(z1, z2);
  //   expect(Number.isFinite(result.real)).toBe(true);
  //   expect(Number.isFinite(result.imag)).toBe(true);
  // });

  // Test 25 - pow(-∞ + ∞i, 1 + 0i) = NaN + NaN·i
  it("pow(-∞ + ∞i, 1 + 0i) === NaN + NaN·i", () => {
    const z1 = new Complex(-Infinity, Infinity);
    const z2 = new Complex(1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 26 - pow(-∞ - ∞i, 1 + 0i) = NaN + NaN·i
  it("pow(-∞ - ∞i, 1 + 0i) === NaN + NaN·i", () => {
    const z1 = new Complex(-Infinity, -Infinity);
    const z2 = new Complex(1.0, 0.0);
    const result = Complex.pow(z1, z2);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });
});

/*
import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path as needed

describe("Complex.pow", () => {
  const EPSILON = Number.EPSILON;

  // Test 1: Base and exponent are zero (0^0)
  it("computes pow(0 + 0i, 0 + 0i) correctly", () => {
    const z1 = new Complex(0, 0);
    const z2 = new Complex(0, 0);
    const result = Complex.pow(z1, z2);
    // Convention: 0^0 = 1 (principal value)
    expect(result.real).toBeCloseTo(1, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 2: Real base, integer exponent
  it("computes pow(2 + 0i, 3 + 0i) correctly", () => {
    const z1 = new Complex(2, 0);
    const z2 = new Complex(3, 0);
    const result = Complex.pow(z1, z2);
    // 2^3 = 8
    expect(result.real).toBeCloseTo(8, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 3: Negative real base, integer exponent
  it("computes pow(-2 + 0i, 2 + 0i) correctly", () => {
    const z1 = new Complex(-2, 0);
    const z2 = new Complex(2, 0);
    const result = Complex.pow(z1, z2);
    // (-2)^2 = 4
    expect(result.real).toBeCloseTo(4, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 4: Complex base, real exponent
  it("computes pow(1 + 1i, 2 + 0i) correctly", () => {
    const z1 = new Complex(1, 1);
    const z2 = new Complex(2, 0);
    const result = Complex.pow(z1, z2);
    // (1 + i)^2 = 1 + 2i - 1 = 2i
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(2, 15);
  });

  // Test 5: Real base, complex exponent
  it("computes pow(2 + 0i, 1 + 1i) correctly", () => {
    const z1 = new Complex(2, 0);
    const z2 = new Complex(1, 1);
    const result = Complex.pow(z1, z2);
    // 2^(1+i) = 2^1 * 2^i = 2 * e^(i ln 2) ≈ 2 * (cos(ln 2) + i sin(ln 2))
    // ln(2) ≈ 0.6931471805599453
    const expectedReal = 2 * Math.cos(Math.LN2);
    const expectedImag = 2 * Math.sin(Math.LN2);
    expect(result.real).toBeCloseTo(expectedReal, 14);
    expect(result.imag).toBeCloseTo(expectedImag, 14);
  });

  // Test 6: Complex base and exponent
  it("computes pow(1 + 1i, 1 + 1i) correctly", () => {
    const z1 = new Complex(1, 1);
    const z2 = new Complex(1, 1);
    const result = Complex.pow(z1, z2);
    // (1+i)^(1+i) = e^((1+i) * ln(1+i))
    // ln(1+i) = ln(sqrt(2)) + i * π/4
    // Compute numerically for precision
    const absZ1 = Math.hypot(1, 1);
    const argZ1 = Math.atan2(1, 1);
    const logReal = Math.log(absZ1);
    const logImag = argZ1;
    const expReal = logReal - logImag; // (1+i) * (logReal + i logImag)
    const expImag = logReal + logImag;
    const expectedReal = Math.exp(expReal) * Math.cos(expImag);
    const expectedImag = Math.exp(expReal) * Math.sin(expImag);
    expect(result.real).toBeCloseTo(expectedReal, 14);
    expect(result.imag).toBeCloseTo(expectedImag, 14);
  });

  // Test 7: Zero base, positive real exponent
  it("computes pow(0 + 0i, 2 + 0i) correctly", () => {
    const z1 = new Complex(0, 0);
    const z2 = new Complex(2, 0);
    const result = Complex.pow(z1, z2);
    // 0^2 = 0
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 8: Zero base, negative real exponent
  it("computes pow(0 + 0i, -1 + 0i) correctly", () => {
    const z1 = new Complex(0, 0);
    const z2 = new Complex(-1, 0);
    const result = Complex.pow(z1, z2);
    // 0^(-1) = 1/0 = undefined, typically Infinity in principal value
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 9: Infinity base, real exponent
  it("computes pow(∞ + 0i, 2 + 0i) correctly", () => {
    const z1 = new Complex(Number.POSITIVE_INFINITY, 0);
    const z2 = new Complex(2, 0);
    const result = Complex.pow(z1, z2);
    // ∞^2 = ∞
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 10: Finite base, infinity exponent
  it("computes pow(2 + 0i, ∞ + 0i) correctly", () => {
    const z1 = new Complex(2, 0);
    const z2 = new Complex(Number.POSITIVE_INFINITY, 0);
    const result = Complex.pow(z1, z2);
    // |z1| > 1, z2 = ∞ -> ∞
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(0);
  });

  // Test 11: NaN base
  it("computes pow(NaN + NaNi, 1 + 0i) correctly", () => {
    const z1 = new Complex(NaN, NaN);
    const z2 = new Complex(1, 0);
    const result = Complex.pow(z1, z2);
    expect(result.real).toBeNaN();
    expect(result.imag).toBeNaN();
  });

  // Test 12: NaN exponent
  it("computes pow(1 + 0i, NaN + NaNi) correctly", () => {
    const z1 = new Complex(1, 0);
    const z2 = new Complex(NaN, NaN);
    const result = Complex.pow(z1, z2);
    expect(result.real).toBeNaN();
    expect(result.imag).toBeNaN();
  });

  // Test 13: Negative real base, fractional exponent
  it("computes pow(-1 + 0i, 0.5 + 0i) correctly", () => {
    const z1 = new Complex(-1, 0);
    const z2 = new Complex(0.5, 0);
    const result = Complex.pow(z1, z2);
    // (-1)^0.5 = sqrt(-1) = i
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(1, 15);
  });

  // Test 14: Small magnitude base
  it("computes pow(1e-150 + 1e-150i, 2 + 0i) correctly", () => {
    const z1 = new Complex(1e-150, 1e-150);
    const z2 = new Complex(2, 0);
    const result = Complex.pow(z1, z2);
    // (1e-150 + 1e-150i)^2 = (1e-150)^2 + 2i(1e-150)^2 - (1e-150)^2 = 2i * 1e-300
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(2e-300, 15);
  });

  // Test 15: Large magnitude base
  it("computes pow(1e150 + 1e150i, 0.5 + 0i) correctly", () => {
    const z1 = new Complex(1e150, 1e150);
    const z2 = new Complex(0.5, 0);
    const result = Complex.pow(z1, z2);
    // Should match sqrt(1e150 + 1e150i)
    const expected = Complex.sqrt(z1);
    expect(result.real).toBeCloseTo(expected.real, 14);
    expect(result.imag).toBeCloseTo(expected.imag, 14);
  });

  // Test 16: Pure imaginary base
  it("computes pow(0 + 1i, 2 + 0i) correctly", () => {
    const z1 = new Complex(0, 1);
    const z2 = new Complex(2, 0);
    const result = Complex.pow(z1, z2);
    // i^2 = -1
    expect(result.real).toBeCloseTo(-1, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 17: Base 1, any exponent
  it("computes pow(1 + 0i, 3 + 4i) correctly", () => {
    const z1 = new Complex(1, 0);
    const z2 = new Complex(3, 4);
    const result = Complex.pow(z1, z2);
    // 1^z = 1 for any z
    expect(result.real).toBeCloseTo(1, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 18: Complex base, negative exponent
  it("computes pow(1 + 1i, -1 + 0i) correctly", () => {
    const z1 = new Complex(1, 1);
    const z2 = new Complex(-1, 0);
    const result = Complex.pow(z1, z2);
    // (1+i)^(-1) = 1/(1+i) = (1-i)/2
    expect(result.real).toBeCloseTo(0.5, 15);
    expect(result.imag).toBeCloseTo(-0.5, 15);
  });

  // Test 19: Infinity base, complex exponent
  it("computes pow(∞ + ∞i, 1 + 1i) correctly", () => {
    const z1 = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const z2 = new Complex(1, 1);
    const result = Complex.pow(z1, z2);
    // Large magnitude base with complex exponent -> ∞ + ∞i
    expect(result.real).toBe(Number.POSITIVE_INFINITY);
    expect(result.imag).toBe(Number.POSITIVE_INFINITY);
  });

  // Test 20: Property: pow(z, 2) = z * z
  it("verifies pow(2 + 3i, 2) = (2 + 3i) * (2 + 3i)", () => {
    const z = new Complex(2, 3);
    const z2 = new Complex(2, 0);
    const result = Complex.pow(z, z2);
    const expected = Complex.mul(z, z);
    expect(result.real).toBeCloseTo(expected.real, 15);
    expect(result.imag).toBeCloseTo(expected.imag, 15);
  });
});
*/
