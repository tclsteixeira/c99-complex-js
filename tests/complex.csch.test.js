// C99 Rule Table for csch(x + yi)
// ---------------------------------------------------------------
// Input (x + yi)	    Expected Value	    Explanation
// 0 + 0i	            INF + 0i	          sinh(0) = 0, so 1/0 = ∞ (pole at 0). Sign of imaginary part is +0, result is real positive infinity.
// -0 + 0i	          -INF + 0i	          Same as above, but real part is -0. Still pole at 0. Sign is preserved.
// 0 - 0i	            +∞ - 0i	            Real part: +∞ (1 / +0), Imag part: -0 propagated from input
// -0 - 0i	          -∞ - 0i	            Real part: -∞ (1 / -0), Imag part: -0
// 0 + πi             0 - i	              sinh(πi) = i·sin(π) = 0, so 1/sinh(πi) = ∞ but sin(π) = 0 → leads to pole, but symmetry implies value approaches -i·∞ (standard C99 returns 0 - i).
// 0 - πi             +∞ + 0i	            Division by -0, but imaginary part remains +0 (sign flips with negative π input and negative zero denominator cancel)
// -0 + πi            0 + i               (imaginary part flips sign from πi case).
// -0 - πi            0 - i               Again, finite result via branch logic.
// 1 + 0i	            1 / sinh(1)	        Real case: sinh(1) > 0 ⇒ finite reciprocal.
// -1 + 0i            -1 / sinh(1)        Odd function: sinh(-1) = -sinh(1), so 1 / sinh(-1) = -1 / sinh(1)
// 0 + i	            -i / sin(1)	        sinh(i) = i·sin(1), so 1/sinh(i) = -i / sin(1).
// 0 - i	            i / sin(1)	        Mirror of above.
// -0 + i	            0 - (1 / sin(1))·i
// -0 - i	            0 + (1 / sin(1))·i
// π + 0i	            1 / sinh(π)	        Real-only value.
// -π + 0i            -1 / sinh(π) + 0i   csch(-π) = 1 / sinh(-π) = -1 / sinh(π)
// π - 0i)            1 / sinh(π) - 0i    The sign of zero imaginary part is preserved
// -π - 0i            -1 / sinh(π) - 0i   sinh(-π) = -sinh(π)
// x + ∞i	            0 + 0i	            sinh(x + i∞) = ∞·cos(x) + i∞·sin(x) ⇒ magnitude is infinite ⇒ 1/∞ = 0
// x + NaNi	          NaN + NaNi	        Imaginary part is NaN → sinh(z) = NaN ⇒ reciprocal is also NaN.
// NaN + yi	          NaN + NaNi	        Real part is NaN → sinh(NaN + i*y) = NaN ⇒ result is NaN.
// INF + 0i	          0 + 0i	            sinh(∞) = ∞, so csch(∞) = 0.
// -INF + 0i	        -0 + 0i	            sinh(-∞) = -∞ ⇒ reciprocal is 0.
// +INF - 0i	        +0 + 0i	            sinh(+∞) → +∞ ⇒ 1/∞ → +0. Imaginary -0 does not affect result.
// -INF - 0i	        -0 + 0i	            sinh(-∞) → -∞ ⇒ 1/(-∞) → -0. Imaginary -0 does not affect result.
// INF + yi	          0 + 0i	            sinh(∞ + i*y) ~ e^∞/2 ⇒ ∞ ⇒ 1/∞ = 0.
// -INF + yi	        -0 + 0i	            same as above, negative ∞.
// +INF - y·i	        0 + 0i	            Large real part dominates. Imaginary part (even if negative) is bounded ⇒ sinh(z) ~ e^x/2 ⇒ 1/∞ = 0.
// -INF - y·i	        -0 + 0i	            Large real part dominates. Imaginary part (even if negative) is bounded ⇒ sinh(z) ~ -e^x/2 ⇒ 1/(-∞) = 0.
// NaN + NaNi	        NaN + NaNi	        Fully undefined input ⇒ NaN result.
// ±0 +/- ∞i	        NaN + NaNi	        sinh(∞i) = i·sin(∞) is undefined ⇒ result is NaN.
// ±0 +/- NaNi	      NaN + NaNi	        Imaginary NaN → NaN.
// ±INF + NaNi	      NaN + NaNi	        sinh(∞ + NaNi) is undefined (indeterminate phase).
// NaN + ∞i	          NaN + NaNi	        Invalid due to sin(∞) or cos(∞).
// ---------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // adjust path as needed

const csch = Complex.csch;

describe("csch(x + yi) edge cases (C99 strict)", () => {
  const INF = Infinity;
  const NaN_ = NaN;

  it("csch(0 + 0i) = INF + 0i", () => {
    const z = new Complex(0, 0);
    const result = csch(z);
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(0);
  });

  it("csch(-0 + 0i) = -INF + 0i", () => {
    const z = new Complex(-0, 0);
    const result = csch(z);
    expect(result.re).toBe(-Infinity);
    expect(result.im).toBe(0);
  });

  it("csch(0 - 0i) = INF - 0i", () => {
    const z = new Complex(0, -0);
    const result = csch(z);
    expect(result.re).toBe(Infinity);
    expect(Object.is(result.im, -0)).toBe(true);
  });

  it("csch(-0 - 0i) = -INF - 0i", () => {
    const z = new Complex(-0, -0);
    const result = csch(z);
    expect(result.re).toBe(-Infinity);
    expect(Object.is(result.im, -0)).toBe(true);
  });

  it("csch(0 + πi) ≈ 0 - i", () => {
    const z = new Complex(0, Math.PI);
    const result = csch(z);
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1, 15);
  });

  it("csch(0 - πi) ≈ +∞ + 0i", () => {
    const z = new Complex(0, -Math.PI);
    const result = csch(z);
    expect(result.re).toBeCloseTo(Infinity, 15);
    expect(result.im).toBe(0);
  });

  it("csch(-0 + πi) ≈ 0 + i", () => {
    const z = new Complex(-0, Math.PI);
    const result = csch(z);
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1, 15);
  });

  it("csch(-0 - πi) ≈ 0 - i", () => {
    const z = new Complex(-0, -Math.PI);
    const result = csch(z);
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1, 15);
  });

  it("csch(±0 + ∞i) = NaN + NaNi", () => {
    const z = new Complex(0, Infinity);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(±0 + NaNi) = NaN + NaNi", () => {
    const z = new Complex(0, NaN);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(±0 - ∞i) = NaN + NaNi", () => {
    const z = new Complex(0, -Infinity);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(±0 - NaNi) = NaN + NaNi", () => {
    const z = new Complex(0, -NaN);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(0 + i) = -i / sin(1)", () => {
    const z = new Complex(0, 1);
    const result = csch(z);
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1 / Math.sin(1), 15);
  });

  it("csch(0 - i) = i / sin(1)", () => {
    const z = new Complex(0, -1);
    const result = csch(z);
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1 / Math.sin(1), 15);
  });

  it("csch(-0 + i) = -i / sin(1)", () => {
    const z = new Complex(-0, 1);
    const result = csch(z);
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1 / Math.sin(1), 15);
  });

  it("csch(-0 - i) = i / sin(1)", () => {
    const z = new Complex(-0, -1);
    const result = csch(z);
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1 / Math.sin(1), 15);
  });

  it("csch(1 + 0i)", () => {
    const z = new Complex(1, 0);
    const result = csch(z);
    expect(result.re).toBeCloseTo(1 / Math.sinh(1), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  it("csch(-1 + 0i)", () => {
    const z = new Complex(-1, 0);
    const result = csch(z);
    expect(result.re).toBeCloseTo(-1 / Math.sinh(1), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  it("csch(π + 0i)", () => {
    const z = new Complex(Math.PI, 0);
    const result = csch(z);
    expect(result.re).toBeCloseTo(1 / Math.sinh(Math.PI), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  it("csch(-π + 0i) = -1 / sinh(π) + 0i", () => {
    const z = new Complex(-Math.PI, 0);
    const result = csch(z);
    expect(result.re).toBeCloseTo(-1 / Math.sinh(Math.PI), 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  it("csch(π - 0i) = 1 / sinh(π) - 0i", () => {
    const z = new Complex(Math.PI, -0);
    const result = csch(z);
    expect(result.re).toBeCloseTo(1 / Math.sinh(Math.PI), 15);
    expect(Object.is(result.im, -0)).toBe(true);
  });

  it("csch(-π - 0i) = -1 / sinh(π) - 0i", () => {
    const z = new Complex(-Math.PI, -0);
    const result = csch(z);
    expect(result.re).toBeCloseTo(-1 / Math.sinh(Math.PI), 15);
    expect(Object.is(result.im, -0)).toBe(true);
  });

  it("csch(x + ∞i) = 0 + 0i", () => {
    const z = new Complex(1, Infinity);
    const result = csch(z);
    expect(result.re).toBe(0);
    expect(result.im).toBe(0);
  });

  it("csch(x + NaNi) = NaN + NaNi", () => {
    const z = new Complex(1, NaN);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(NaN + yi) = NaN + NaNi", () => {
    const z = new Complex(NaN, 1);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(INF + 0i) = 0 + 0i", () => {
    const z = new Complex(Infinity, 0);
    const result = csch(z);
    expect(Object.is(result.re, +0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(-INF + 0i) = -0 + 0i", () => {
    const z = new Complex(-Infinity, 0);
    const result = csch(z);
    expect(Object.is(result.re, -0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(INF - 0i) = 0 + 0i", () => {
    const z = new Complex(Infinity, -0);
    const result = csch(z);
    expect(Object.is(result.re, +0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(-INF - 0i) = -0 + 0i", () => {
    const z = new Complex(-Infinity, -0);
    const result = csch(z);
    expect(Object.is(result.re, -0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(INF + yi) = 0 + 0i", () => {
    const z = new Complex(Infinity, 1);
    const result = csch(z);
    expect(Object.is(result.re, +0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(-INF + yi) = -0 + 0i", () => {
    const z = new Complex(-Infinity, 1);
    const result = csch(z);
    expect(Object.is(result.re, -0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(INF - yi) = 0 + 0i", () => {
    const z = new Complex(Infinity, -1);
    const result = csch(z);
    expect(Object.is(result.re, +0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(-INF - yi) = -0 + 0i", () => {
    const z = new Complex(-Infinity, -1);
    const result = csch(z);
    expect(Object.is(result.re, -0)).toBeTruthy();
    expect(Object.is(result.im, +0)).toBeTruthy();
  });

  it("csch(±INF + NaNi) = NaN + NaNi", () => {
    const z = new Complex(Infinity, NaN);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(NaN + ∞i) = NaN + NaNi", () => {
    const z = new Complex(NaN, Infinity);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(NaN + NaNi) = NaN + NaNi", () => {
    const z = new Complex(NaN, NaN);
    const result = csch(z);
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  it("csch(1 + i)", () => {
    const z = new Complex(1, 1);
    const result = csch(z);
    // Wolfram = 0.30393100162842645033 - 0.6215180171704284212349 i
    expect(result.re).toBeCloseTo(0.30393100162842645033, 15);
    expect(result.im).toBeCloseTo(-0.6215180171704284212349, 15);
  });

  it("csch(-1 - i)", () => {
    const z = new Complex(-1, -1);
    const result = csch(z);
    // Wolfram = -0.30393100162842645033 + 0.6215180171704284212349 i
    expect(result.re).toBeCloseTo(-0.30393100162842645033, 15);
    expect(result.im).toBeCloseTo(0.6215180171704284212349, 15);
  });

  it("csch(2 + 2i)", () => {
    const z = new Complex(2, 2);
    const result = csch(z);
    // Wolfram = -0.10795459222138479741995 - 0.24468707358695719894698898 i
    expect(result.re).toBeCloseTo(-0.10795459222138479741995, 15);
    expect(result.im).toBeCloseTo(-0.24468707358695719894698898, 15);
  });

  it("csch(-2 + 1.5i)", () => {
    const z = new Complex(-2, 1.5);
    const result = csch(z);
    // Wolfram = -0.018132158683094101908 - 0.265230154638269933789 i
    expect(result.re).toBeCloseTo(-0.018132158683094101908, 15);
    expect(result.im).toBeCloseTo(-0.265230154638269933789, 15);
  });

  it("csch(π/2 + π/3 i)", () => {
    const z = new Complex(Math.PI / 2, Math.PI / 3);
    const result = csch(z);
    // Wolfram = 0.190316555966681972125 - 0.359414605007782918167 i
    expect(result.re).toBeCloseTo(0.190316555966681972125, 15);
    expect(result.im).toBeCloseTo(-0.359414605007782918167, 15);
  });
});
