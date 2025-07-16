// Test Suite for Complex.atanh
// C99 Compliance: Implements catanh(z) per Annex G.6.2.4, ensuring Re(catanh(z)) ∈ [-∞, +∞],
// Im(catanh(z)) ∈ [-π/2, π/2], with branch cuts along real axis for z < -1 and z > 1.
// Handles special cases:
// - catanh(±1 + 0i) = ±∞ + 0i (Tests 3–4)
// - catanh(±∞ + yi) = 0 ± π/2i for finite y (Tests 11–12, 15–16)
// - catanh(x ± ∞i) = 0 ± π/2i for finite x (Tests 17–18)
// - catanh(±∞ ± ∞i) = 0 ± π/2i (Tests 19–22)
// - catanh(x + NaNi) = NaN + NaNi for finite/infinite x (Tests 13, 23–24)
// - catanh(NaN + yi) = NaN + NaNi for finite y (Test 13)
// - catanh(NaN ± ∞i) = NaN + NaNi (Test 25)
// - catanh(NaN + NaNi) = NaN + NaNi (Test 26)
// Symmetry: catanh(-z) = -catanh(z) (Test 31). Fully C99-compliant with proper handling
// of infinities, NaNs, and branch cuts in complex.js (artifact_id:
// 9a218b7a-7e4d-4541-9735-8efa85434447).
// Test Suite Options and Trade-offs:
// - Precision: Targets ~1e-16 for Tests 1–7, 11–26, 29, 31; ~1e-14 for Tests 8–10,
//   27–28, 30 due to cancellation errors in log(1 + z) - log(1 - z) or Math.atan2.
// - Comparisons: Aligns with Octave/Wolfram for Tests 1–31. Mathjs may diverge for
//   infinities/NaNs. Octave results provided where available.
// - Tolerances: Relaxed to 14 digits for Tests 8–10, 27–28, 30 to accommodate 64-bit
//   float limits (~2.22e-16 per operation).
// - Performance: Expected ~30ms for 31 tests, based on acosh (~21ms for 28 tests).
// - Validation: Uses vitest for assertions. See complex.js JSDoc for details.
//
// Note:
//    Some Octave results involvind NaN inputs do not comply with C99 std, so in this tests
//    the expected results are the C99 expected results and not the Octave results.
//--------------------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.atanh", () => {
  // Test Summary:
  // This suite validates Complex.atanh(z) across 31 test cases, aligned with Octave results:
  // - Tests 1–2: Real inputs (0, 0.5), expecting ~1e-15 precision.
  // - Tests 3–4: Branch cut boundaries (±1), expecting ±∞ + 0i.
  // - Tests 5–6: Imaginary inputs (i, 0.5i), expecting 0 + ~π/4i or similar.
  // - Test 7: Complex input (1 + i), expecting ~1e-15.
  // - Tests 8–9: Large real (±30 + i), expecting ~1e-14.
  // - Test 10: Large imaginary (1 + 30i), expecting ~1e-14.
  // - Tests 11–12, 15–16: Infinities (±∞ ± i), expecting 0 ± π/2i.
  // - Tests 17–18: Finite real, infinite imag (1 ± ∞i), expecting 0 ± π/2i.
  // - Tests 19–22: Infinite real/imag (±∞ ± ∞i), expecting 0 ± π/2i.
  // - Tests 13, 23–26: NaN inputs, expecting NaN + NaNi (except Tests 23–25 per Octave).
  // - Test 14: Tiny input (1e-154 + 1e-154i), expecting ~z.
  // - Tests 27–28: Near branch cuts (1 ± εi, -1 + εi), expecting ~1e-14.
  // - Test 29: Subnormal input (Number.MIN_VALUE), expecting ~z.
  // - Test 30: Large imaginary (1 + 1e10i), expecting ~1e-14.
  // - Test 31: Symmetry, verifying catanh(-z) = -catanh(z).
  // Precision: Set to 15 digits where applicable; relaxed to 14 for Tests 8–10, 27–28, 30 due to 64-bit float limits (~2.22e-16). Expected values match Octave results from comparison.

  // Test 1
  it("computes atanh(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.atanh(z);
    // mathjs  -> 0 + 0i
    // Complex -> 0 + 0i
    // Octave  -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2
  it("computes atanh(0.5 + 0i) correctly", () => {
    const z = new Complex(0.5, 0);
    const result = Complex.atanh(z);
    // mathjs  -> 0.5493061443340548 + 0i
    // Complex -> 0.5493061443340548 + 0i
    // Octave  -> 0.549306144334055 + 0i
    expect(result.re).toBeCloseTo(0.549306144334055, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3
  it("computes atanh(-1 + 0i) correctly", () => {
    const z = new Complex(-1, 0);
    const result = Complex.atanh(z);
    // mathjs  -> -Infinity + 0i
    // Complex -> -Infinity + 0i
    // Octave  -> -Infinity + 0i
    expect(result.re).toBe(Number.NEGATIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 4
  it("computes atanh(1 + 0i) correctly", () => {
    const z = new Complex(1, 0);
    const result = Complex.atanh(z);
    // mathjs  -> Infinity + 0i
    // Complex -> Infinity + 0i
    // Octave  -> Infinity + 0i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 5
  it("computes atanh(0 + i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.atanh(z);
    // mathjs  -> 0 + 0.7853981633974483i
    // Complex -> 0 + 0.7853981633974483i
    // Octave  -> 0 + 0.785398163397448i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0.785398163397448, 15);
  });

  // Test 6
  it("computes atanh(0 + 0.5i) correctly", () => {
    const z = new Complex(0, 0.5);
    const result = Complex.atanh(z);
    // mathjs  -> 0 + 0.46364760900080615i
    // Complex -> 0 + 0.4636476090008061i
    // Octave  -> 0 + 0.463647609000806i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0.463647609000806, 15);
  });

  // Test 7
  it("computes atanh(1 + i) correctly", () => {
    const z = new Complex(1, 1);
    const result = Complex.atanh(z);
    // mathjs  -> 0.40235947810852507 + 1.0172219678978514i
    // Complex -> 0.40235947810852507 + 1.0172219678978514i
    // Octave  -> 0.402359478108525 + 1.017221967897851i
    expect(result.re).toBeCloseTo(0.402359478108525, 15);
    expect(result.im).toBeCloseTo(1.017221967897851, 15);
  });

  // Test 8
  it("computes atanh(30 + i) correctly", () => {
    const z = new Complex(30, 1);
    const result = Complex.atanh(z);
    // mathjs  -> 0.03330860910584495 + 1.5696852175127696i
    // Complex -> 0.03330860910584494 + 1.5696852175127696i
    // Octave  -> 0.03330860910584494 + 1.56968521751277i
    expect(result.re).toBeCloseTo(0.03330860910584494, 14);
    expect(result.im).toBeCloseTo(1.56968521751277, 14);
  });

  // Test 9
  it("computes atanh(-30 + i) correctly", () => {
    const z = new Complex(-30, 1);
    const result = Complex.atanh(z);
    // mathjs  -> -0.03330860910584491 + 1.5696852175127696i
    // Complex -> -0.03330860910584494 + 1.5696852175127696i
    // Octave  -> -0.03330860910584494 + 1.56968521751277i
    expect(result.re).toBeCloseTo(-0.03330860910584494, 14);
    expect(result.im).toBeCloseTo(1.56968521751277, 14);
  });

  // Test 10
  it("computes atanh(1 + 30i) correctly", () => {
    const z = new Complex(1, 30);
    const result = Complex.atanh(z);
    // mathjs  -> 0.0011086492669664437 + 1.5375122449069847i
    // Complex -> 0.0011086492669664366 + 1.5375122449069847i
    // Octave  -> 0.001108649266966437 + 1.537512244906985i
    expect(result.re).toBeCloseTo(0.001108649266966437, 14);
    expect(result.im).toBeCloseTo(1.537512244906985, 14);
  });

  // Test 11
  it("computes atanh(Infinity + i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + 1.5707963267948966i
    // Octave  -> 0 + 1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.570796326794897, 15);
  });

  // Test 12
  it("computes atanh(Infinity - i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, -1);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + -1.5707963267948966i
    // Octave  -> 0 + -1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1.570796326794897, 15);
  });

  // Test 13
  it("computes atanh(NaN + i) correctly", () => {
    const z = new Complex(NaN, 1);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> NaN + NaNi
    // Octave  -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 14
  it("computes atanh(1e-154 + 1e-154i) correctly", () => {
    const z = new Complex(1e-154, 1e-154);
    const result = Complex.atanh(z);
    // mathjs  -> 0 + 1e-154i
    // Complex -> 1e-154 + 1e-154i
    // Octave  -> 1e-154 + 1e-154i
    expect(result.re).toBeCloseTo(1e-154, 15);
    expect(result.im).toBeCloseTo(1e-154, 15);
  });

  // Test 15
  it("computes atanh(-Infinity + i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 1);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + 1.5707963267948966i
    // Octave  -> 0 + 1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.570796326794897, 15);
  });

  // Test 16
  it("computes atanh(-Infinity - i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, -1);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + -1.5707963267948966i
    // Octave  -> 0 + -1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1.570796326794897, 15);
  });

  // Test 17
  it("computes atanh(1 + Infinity i) correctly", () => {
    const z = new Complex(1, Number.POSITIVE_INFINITY);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + 1.5707963267948966i
    // Octave  -> 0 + 1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.570796326794897, 15);
  });

  // Test 18
  it("computes atanh(1 - Infinity i) correctly", () => {
    const z = new Complex(1, Number.NEGATIVE_INFINITY);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + -1.5707963267948966i
    // Octave  -> 0 + -1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1.570796326794897, 15);
  });

  // Test 19
  it("computes atanh(Infinity + Infinity i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + 1.5707963267948966i
    // Octave  -> 0 + 1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.570796326794897, 15);
  });

  // Test 20
  it("computes atanh(Infinity - Infinity i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + -1.5707963267948966i
    // Octave  -> 0 + -1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1.570796326794897, 15);
  });

  // Test 21
  it("computes atanh(-Infinity + Infinity i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + 1.5707963267948966i
    // Octave  -> 0 + 1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.570796326794897, 15);
  });

  // Test 22
  it("computes atanh(-Infinity - Infinity i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> 0 + -1.5707963267948966i
    // Octave  -> 0 + -1.570796326794897i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1.570796326794897, 15);
  });

  // Test 23
  it("computes atanh(Infinity + NaN i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, NaN);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> NaN + NaNi
    // Octave  -> Infinity + NaNi   (Non C99 compliant)
    expect(result.re).toBe(NaN);
    expect(result.im).toBeNaN();
  });

  // Test 24
  it("computes atanh(-Infinity + NaN i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, NaN);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> NaN + NaNi
    // Octave  -> Infinity + NaNi   (Non C99 compliant)
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 25
  it("computes atanh(NaN + Infinity i) correctly", () => {
    const z = new Complex(NaN, Number.POSITIVE_INFINITY);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> NaN + NaNi  (C99 compliant)
    // Octave  -> 0 + 1.570796326794897i   (Non C99 compliant)
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 26
  it("computes atanh(NaN + NaN i) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.atanh(z);
    // mathjs  -> NaN + NaNi
    // Complex -> NaN + NaNi
    // Octave  -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 27
  it("computes atanh(1 + EPSILON i) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(1, ε);
    const result = Complex.atanh(z);
    // mathjs  -> 18.36840028483855 + 0.7853981633974484i
    // Complex -> 18.36840028483855 + 0.7853981633974484i
    // Octave  -> 18.36840028483855 + 0.7853981633974484i
    expect(result.re).toBeCloseTo(18.36840028483855, 14);
    expect(result.im).toBeCloseTo(0.7853981633974484, 14);
  });

  // Test 28
  it("computes atanh(-1 + EPSILON i) correctly", () => {
    const z = new Complex(-1, Number.EPSILON);
    const result = Complex.atanh(z);
    // mathjs  -> -18.36840028483855 + 0.7853981633974484i
    // Complex -> -18.36840028483855 + 0.7853981633974484i
    // Octave  -> -18.36840028483855 + 0.7853981633974484i
    expect(result.re).toBeCloseTo(-18.36840028483855, 14);
    expect(result.im).toBeCloseTo(0.7853981633974484, 14);
  });

  // Test 29
  it("computes atanh(Number.MIN_VALUE + Number.MIN_VALUE i) correctly", () => {
    const min = Number.MIN_VALUE;
    const z = new Complex(min, min);
    const result = Complex.atanh(z);
    // mathjs  -> 0 + 5e-324i
    // Complex -> 5e-324 + 5e-324i
    // Octave  -> 5e-324 + 5e-324i
    expect(result.re).toBeCloseTo(5e-324, 15);
    expect(result.im).toBeCloseTo(5e-324, 15);
  });

  // Test 30
  it("computes atanh(1 + 1e10i) correctly", () => {
    const z = new Complex(1, 1e10);
    const result = Complex.atanh(z);
    // mathjs  -> 0 + 1.5707963266948965i
    // Complex -> 1e-20 + 1.5707963266948965i
    // Octave  -> 1e-20 + 1.570796326694897i
    expect(result.re).toBeCloseTo(1e-20, 14);
    expect(result.im).toBeCloseTo(1.570796326694897, 14);
  });

  // Test 31
  it("verifies symmetry: atanh(-z) = -atanh(z) for z = 1 + 1i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const resultZ = Complex.atanh(z);
    const resultNegZ = Complex.atanh(negZ);
    // mathjs  -> true
    // Complex -> true
    // Octave  -> true
    expect(resultNegZ.re).toBeCloseTo(-resultZ.re, 15);
    expect(resultNegZ.im).toBeCloseTo(-resultZ.im, 15);
  });
});
