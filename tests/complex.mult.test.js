// ----------------------------------------------------------------------------------------------
// C99 mul(z1, z2) Edge Case Table (with Sign Details)
// ----------------------------------------------------------------------------------------------
// z1 = x1 + y1·i	    z2 = x2 + y2·i	Case Type	        Output	            Notes
// 0 + 0i	            ∞ + ∞i	        0 × ∞	            NaN	+ NaNi	        Indeterminate form: C99 requires NaN
// 1 + 0i	            1 + 0i	        Finite × Finite	    1 +	0i	            Normal multiplication
// ∞ + 0i	            0 + 1i	        ∞ × finite	        NaN	+ NaNi	        ∞ × 0 → NaN
// ∞ + ∞i	            ∞ + ∞i	        ∞ × ∞	            NaN	+ ∞i	        Real: ∞·∞ − ∞·∞ = NaN; Imag: ∞·∞ + ∞·∞ = ∞
// -∞ + ∞i	            ∞ - ∞i	        Mixed signed ∞	    NaN	+ ∞i	        Real part = -∞·∞ − ∞·(-∞) = -∞ − (−∞) = NaN
// NaN + 1i	            2 + 3i	        NaN input	        NaN	+ NaNi	        Any NaN in operand → NaN
// 1 + 2i	            NaN + 3i	    NaN input	        NaN	+ NaNi	        Propagates NaN
// -0 + 0i	            1 + 0i	        Negative zero	    -0 + 0i	            C99 requires preserving signs of zero
// 1e-308 + 0i	        1 + 0i	        Subnormal	        1e-308 + 0i	        Subnormal remains finite
// 1e308 + 1e308i	    1e-308 + 0i	    Huge × Tiny	        Finite + Finite i	OK unless overflow/underflow
// ∞ + 1i	            ∞ + 2i	        ∞ × finite	        ∞ +	∞i	            Signs determine polarity, magnitude = ∞
// 0 + 0i	            0 + 0i	        Zero × Zero	        0 +	0i	            Trivial multiplication
// ∞ + ∞i	            1 + 0i	        ∞ × finite	        ∞ +	∞i	            Imag: ∞·0 + ∞·1 = ∞
// ∞ + ∞i	            -1 + 0i	        ∞ × finite (neg)	-∞ - ∞i	            Signs preserved
// ∞ + 0i	            -∞ + 0i	        ∞ × ∞	            -∞ + NaNi	        Imag: ∞·0 + 0·(−∞) = NaN
// ∞ + 0i	            0 + ∞i	        ∞ × 0	            NaN + NaNi	        Indeterminate
// ----------------------------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // adjust to your path

const C = Complex;

describe("Complex.mul(z1, z2) — C99 Edge Cases", () => {
  // Rule 1: Normal multiplication
  it("finite * finite: (2 + 3i) * (4 - 5i)", () => {
    const z1 = new C(2, 3);
    const z2 = new C(4, -5);
    const result = C.mul(z1, z2);
    expect(result.re).toBeCloseTo(23);
    expect(result.im).toBeCloseTo(2);
  });

  // Rule 2: NaN in any component propagates
  it("NaN in real part → NaN + NaNi", () => {
    expect(C.mul(new C(NaN, 1), new C(2, 3)).isNaN()).toBe(true);
  });

  it("NaN in imaginary part → NaN + NaNi", () => {
    expect(C.mul(new C(1, NaN), new C(2, 3)).isNaN()).toBe(true);
  });

  it("NaN in second operand → NaN + NaNi", () => {
    expect(C.mul(new C(1, 1), new C(NaN, 1)).isNaN()).toBe(true);
    expect(C.mul(new C(1, 1), new C(1, NaN)).isNaN()).toBe(true);
  });

  // Rule 3: Infinite * finite (non-zero) — expect ∞ with correct signs
  it("finite * ∞ → ∞ with signs", () => {
    const result = C.mul(new C(1, 2), new C(Infinity, 1));
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });

  it("finite * -∞ → ∞ or -∞ depending on sign", () => {
    const result = C.mul(new C(-1, 2), new C(-Infinity, 3));
    expect(result.re).toBe(Infinity); // due to -1 * -∞ - 2 * 3 = ∞ - 6
    expect(result.im).toBeCloseTo(-Infinity);
  });

  // Rule 4: ∞ * ∞ — can result in NaN or ∞
  it("∞ + ∞i * ∞ + ∞i → ∞ or NaN + ∞i", () => {
    const result = C.mul(new C(Infinity, Infinity), new C(Infinity, Infinity));
    expect(result.re).toBeNaN(); // ∞ - ∞ = NaN
    expect(result.im).toBe(Infinity); // ∞ + ∞ = ∞
  });

  // Rule 5: ∞ * 0 → NaN + NaNi (indeterminate)
  it("∞ * 0 → NaN", () => {
    const result = C.mul(new C(Infinity, 0), new C(0, 1));
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  it("0 * ∞ → NaN", () => {
    const result = C.mul(new C(0, 0), new C(Infinity, 1));
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Rule 6: 0 * 0 → 0
  it("0 * 0 → 0", () => {
    const result = C.mul(new C(0, 0), new C(0, 0));
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  // Rule 7: Mixed signs with ∞
  it("(-∞ + ∞i) * (∞ - ∞i) → NaN + ∞", () => {
    const result = C.mul(
      new C(-Infinity, Infinity),
      new C(Infinity, -Infinity)
    );
    expect(result.re).toBeNaN(); // ∞ - ∞ = NaN
    expect(result.im).toBe(Infinity);
  });

  // Rule 8: Multiplying with ±0
  it("0 + 0i * (1 + 1i) → 0 + 0i", () => {
    const result = C.mul(new C(0, 0), new C(1, 1));
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  it("(-0 + 0i) * (1 + 0i) → -0 + 0i", () => {
    const result = C.mul(new C(-0, 0), new C(1, 0));
    expect(Object.is(result.re, -0)).toBe(true);
    expect(result.im).toBe(0);
  });

  // Rule 9: Finite * subnormal
  it("finite * subnormal (1e-308) → ~0", () => {
    const result = C.mul(new C(1e-308, 0), new C(1, 0));
    expect(result.re).toBeCloseTo(1e-308);
    expect(result.im).toBeCloseTo(0);
  });

  // Rule 10: Very large * very small = finite or underflow
  it("large * small = finite", () => {
    const result = C.mul(new C(1e308, 1e308), new C(1e-308, 0));
    expect(Number.isFinite(result.re)).toBe(true);
    expect(Number.isFinite(result.im)).toBe(true);
  });
});
