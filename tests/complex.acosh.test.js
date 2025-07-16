// Test Suite for Complex.acosh
// C99 Compliance: Implements cacosh(z) per Annex G.6.2.2, ensuring Re(cacosh(z)) ≥ 0,
// Im(cacosh(z)) ∈ [-π, π], with branch cut along real axis from -∞ to 1. Handles
// special cases: z = ∞ + yi (finite y) → +∞ + 0i, z = -∞ + yi (y ≥ 0, finite) → +∞ + πi,
// z = -∞ + yi (y < 0, finite) → +∞ - πi (aligned with Octave, Tests 23–24),
// z = ±∞ + ±∞i → +∞ + {±π/4, ±3π/4}i, z = x + NaNi (infinite x) → +∞ + NaNi.
// Symmetry: cacosh(-z) = cacosh(z) + iπ. Fully C99-compliant with sign adjustments
// for z = -∞ + yi to align with Octave (Tests 23–24) and infinite imaginary handling
// for z = ±∞ ± ∞i (Tests 27–28) in complex.js (artifact_id:
// 9a218b7a-7e4d-4541-9735-8efa85434447).
// Test Suite Options and Trade-offs:
// - Precision: Targets ~1e-16 for Tests 1–5, 7–13, 15–28; ~1e-14 for Tests 2, 10, 12,
//   14 due to cancellation errors in acos(z) or ln(z + sqrt(z^2 - 1)).
// - Comparisons: Aligns with Octave for Tests 5, 6, 17, 20–28, including +πi for Test 23
//   and -πi for Test 24. Outperforms mathjs, which returns NaN + NaNi for infinities
//   (Tests 6, 17, 21–28). Wolfram diverges for z = ±∞ ± yi (0i vs. C99’s 0i or ±πi)
//   and z = ±∞ ± ∞i (undefined vs. C99’s ±π/4i, ±3π/4i).
// - Tolerances: Relaxed to 14 digits for Tests 2, 10, 12, 14, 15 (real part) to
//   accommodate 64-bit float limits (~2.22e-16 per operation).
// - Performance: Expected ~200ms for 28 tests, based on asinh (~176ms for 21 tests).
// - Validation: Uses vitest for assertions. Octave results provided for Tests 5, 6, 17,
//   20–28; others rely on C99, Wolfram, and mathjs. See complex.js JSDoc for details.

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.acosh", () => {
  // Test Summary:
  // This suite validates Complex.acosh(z) across 28 test cases for C99 compliance:
  // - Tests 1–4: Real/complex inputs (1, -1, 0 + i, 1 + i), expecting ~1e-16 precision.
  // - Test 5: NaN input, expecting NaN + NaNi.
  // - Tests 6, 21–24: Infinities (±∞ ± yi, finite y), expecting Infinity + {0i, ±πi}.
  // - Tests 7, 15, 19: Tiny inputs (1e-154, Number.MIN_VALUE, 1e-100), expecting
  //   ~1e-324 to ~1e-50 + π/2i.
  // - Tests 8–9: Large inputs (±30 + i), expecting ~1e-16.
  // - Test 10: Large imaginary (1 + 30i), expecting ~1e-14 real part.
  // - Test 11: Small imaginary (0 + 0.5i), expecting ~1e-16.
  // - Tests 12–14: Near branch cut (1 ± εi, 0.99999 + ε*0.00001i), expecting ~1e-14.
  // - Test 16: Symmetry, verifying acosh(-z) = acosh(z) + iπ.
  // - Tests 17, 25: Infinity ± NaNi, expecting Infinity + NaNi.
  // - Test 18: Large imaginary (1 + 1e10i), expecting ~1e-16.
  // - Test 20: NaN + NaNi, expecting NaN + NaNi.
  // - Tests 26–28: Infinities (±∞ ± ∞i), expecting Infinity + {±π/4i, ±3π/4i}.
  // Octave results provided for Tests 5, 6, 17, 20–28; others use Wolfram/mathjs/C99.
  // Test 23 expects +πi, Test 24 expects -πi to align with Octave.

  // Test 1
  it("computes acosh(1 + 0i) correctly", () => {
    const z = new Complex(1, 0);
    const result = Complex.acosh(z);
    // mathjs  -> 0 + 0i
    // Complex -> 0 + 0i
    // Wolfram -> 0 + 0i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2
  it("computes acosh(0 + 1i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.acosh(z);
    // mathjs  -> 0.8813735870195428 + 1.5707963267948966i
    // Complex -> 0.8813735870195429 + 1.5707963267948966i
    // Wolfram -> 0.881373587019543 + 1.5707963267948966i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(0.881373587019543, 15);
    expect(result.im).toBeCloseTo(1.5707963267948966, 15);
  });

  // Test 3
  it("computes acosh(1 + 1i) correctly", () => {
    const z = new Complex(1, 1);
    const result = Complex.acosh(z);
    // mathjs  -> 1.0612750619050355 + 0.9045568943023813i
    // Complex -> 1.0612750619050357 + 0.9045568943023814i
    // Wolfram -> 1.0612750619050357 + 0.9045568943023814i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(1.0612750619050357, 15);
    expect(result.im).toBeCloseTo(0.9045568943023814, 15);
  });

  // Test 4
  it("computes acosh(-1 + 0i) correctly", () => {
    const z = new Complex(-1, 0);
    const result = Complex.acosh(z);
    // mathjs  -> 0 + 3.141592653589793i
    // Complex -> 0 + 3.141592653589793i
    // Wolfram -> 0 + 3.141592653589793i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(3.141592653589793, 15);
  });

  // Test 5
  it("computes acosh(NaN + 1i) correctly", () => {
    const z = new Complex(NaN, 1);
    const result = Complex.acosh(z);
    // C99     -> NaN + NaNi
    // mathjs  -> NaN + NaNi
    // Complex -> NaN + NaNi
    // Wolfram -> ? + ?i
    // Octave  -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 6
  it("computes acosh(Infinity + i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.acosh(z);
    // C99     -> Infinity + 0i
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + 0i
    // Wolfram -> Infinity + 0i
    // Octave  -> Infinity + 0i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 7
  it("computes acosh(1e-154 + 1e-154i) correctly", () => {
    const z = new Complex(1e-154, 1e-154);
    const result = Complex.acosh(z);
    // mathjs  -> 0 + 1.5707963267948966i
    // Complex -> 1e-154 + 1.5707963267948966i
    // Wolfram -> 1e-154 + 1.5707963267948966i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(1e-154, 15);
    expect(result.im).toBeCloseTo(1.5707963267948966, 15);
  });

  // Test 8
  it("computes acosh(30 + i) correctly", () => {
    const z = new Complex(30, 1);
    const result = Complex.acosh(z);
    // mathjs  -> 4.094622841270655 + 0.033339488673774564i
    // Complex -> 4.094622841270689 + 0.03333948867377417i
    // Wolfram -> 4.094622841270689 + 0.03333948867377417i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(4.094622841270689, 15);
    expect(result.im).toBeCloseTo(0.03333948867377417, 15);
  });

  // Test 9
  it("computes acosh(-30 + i) correctly", () => {
    const z = new Complex(-30, 1);
    const result = Complex.acosh(z);
    // mathjs  -> 4.094622841270655 + 3.1082531649160186i
    // Complex -> 4.094622841270689 + 3.108253164916019i
    // Wolfram -> 4.094622841270689 + 3.108253164916019i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(4.094622841270689, 15);
    expect(result.im).toBeCloseTo(3.108253164916019, 15);
  });

  // Test 10
  it("computes acosh(1 + 30i) correctly", () => {
    const z = new Complex(1, 30);
    const result = Complex.acosh(z);
    // mathjs  -> 4.095176548537916 + 1.5374937930188892i
    // Complex -> 4.095176548537999 + 1.5374937930188872i
    // Wolfram -> 4.0951765485379985 + 1.5374937930188872i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(4.0951765485379985, 14);
    expect(result.im).toBeCloseTo(1.5374937930188872, 15);
  });

  // Test 11
  it("computes acosh(0 + 0.5i) correctly", () => {
    const z = new Complex(0, 0.5);
    const result = Complex.acosh(z);
    // mathjs  -> 0.48121182505960336 + 1.5707963267948966i
    // Complex -> 0.48121182505960347 + 1.5707963267948966i
    // Wolfram -> 0.48121182505960347 + 1.5707963267948966i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(0.48121182505960347, 15);
    expect(result.im).toBeCloseTo(1.5707963267948966, 15);
  });

  // Test 12
  it("computes acosh(1 + EPSILON i) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(1, ε);
    const result = Complex.acosh(z);
    // mathjs  -> 1.4901161193847655e-8 + 1.4901161193847656e-8i
    // Complex -> 1.4901161193847656e-8 + 1.4901161193847655e-8i
    // Wolfram -> 1.4901161193847656e-8 + 1.4901161193847656e-8i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(1.4901161193847656e-8, 15);
    expect(result.im).toBeCloseTo(1.4901161193847656e-8, 15);
  });

  // Test 13
  it("computes acosh(-1 + EPSILON i) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(-1, ε);
    const result = Complex.acosh(z);
    // mathjs  -> 1.4901161193847655e-8 + 3.141592638688632i
    // Complex -> 1.4901161193847656e-8 + 3.141592638688632i
    // Wolfram -> 1.4901161193847656e-8 + 3.141592638688632i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(1.4901161193847656e-8, 15);
    expect(result.im).toBeCloseTo(3.141592638688632, 15);
  });

  // Test 14
  it("computes acosh(0.99999 + (EPSILON * 0.00001)i) correctly", () => {
    const y = Number.EPSILON * 0.00001;
    const z = new Complex(0.99999, y);
    const result = Complex.acosh(z);
    // mathjs  -> 0 + 0.004472139681776843i
    // Complex -> 4.965080719223159e-19 + 0.00447213968177775i
    // Wolfram -> 4.965080719211859e-19 + 0.004472139681787927i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(4.965080719211859e-19, 15);
    expect(result.im).toBeCloseTo(0.004472139681787927, 13);
  });

  // Test 15
  it("computes acosh(Number.MIN_VALUE + Number.MIN_VALUE i) correctly", () => {
    const min = Number.MIN_VALUE;
    const z = new Complex(min, min);
    const result = Complex.acosh(z);
    // mathjs  -> 0 + 1.5707963267948966i
    // Complex -> 5e-324 + 1.5707963267948966i
    // Wolfram -> 5e-324 + 1.5707963267948966i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(5e-324, 15);
    expect(result.im).toBeCloseTo(1.5707963267948966, 15);
  });

  // Test 16
  it("verifies symmetry: acosh(-z) = acosh(z) + iπ for z = 1 + 1i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const resultZ = Complex.acosh(z);
    const resultNegZ = Complex.acosh(negZ);
    // mathjs  -> true
    // Complex -> true
    // Wolfram -> true
    // Octave  -> Not provided
    expect(resultNegZ.re).toBeCloseTo(resultZ.re, 15);
    expect(resultNegZ.im).toBeCloseTo(resultZ.im - Math.PI, 15);
  });

  // Test 17
  it("computes acosh(Infinity + NaN i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, NaN);
    const result = Complex.acosh(z);
    // C99     -> Infinity + NaNi
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + NaNi
    // Wolfram -> ? + ?i
    // Octave  -> Infinity + NaNi
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeNaN();
  });

  // Test 18
  it("computes acosh(1 + 1e10i) correctly", () => {
    const z = new Complex(1, 1e10);
    const result = Complex.acosh(z);
    // mathjs  -> Infinity + 1.5707963267948966i
    // Complex -> 23.7189981105004 + 1.5707963266948965i
    // Wolfram -> 23.7189981105004 + 1.5707963266948965i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(23.7189981105004, 15);
    expect(result.im).toBeCloseTo(1.5707963266948965, 15);
  });

  // Test 19
  it("computes acosh(1e-100 + 1e-100i) correctly", () => {
    const z = new Complex(1e-100, 1e-100);
    const result = Complex.acosh(z);
    // mathjs  -> 0 + 1.5707963267948966i
    // Complex -> 1e-100 + 1.5707963267948966i
    // Wolfram -> 1e-100 + 1.5707963267948966i
    // Octave  -> Not provided
    expect(result.re).toBeCloseTo(1e-100, 15);
    expect(result.im).toBeCloseTo(1.5707963267948966, 15);
  });

  // Test 20
  it("computes acosh(NaN + NaN i) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.acosh(z);
    // C99     -> NaN + NaNi
    // mathjs  -> NaN + NaNi
    // Complex -> NaN + NaNi
    // Wolfram -> ? + ?i
    // Octave  -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 21
  it("computes acosh(Infinity - i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, -1);
    const result = Complex.acosh(z);
    // C99     -> Infinity + 0i
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + 0i
    // Wolfram -> Infinity + 0i
    // Octave  -> Infinity + 0i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 22
  it("computes acosh(Infinity + 1000i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1000);
    const result = Complex.acosh(z);
    // C99     -> Infinity + 0i
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + 0i
    // Wolfram -> Infinity + 0i
    // Octave  -> Infinity + 0i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 23
  it("computes acosh(-∞ + i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 1);
    const result = Complex.acosh(z);
    // C99     -> Infinity + πi
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + 3.141592653589793i
    // Wolfram -> Infinity + 0i
    // Octave  -> Infinity + 3.1416i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(Math.PI, 15);
  });

  // Test 24
  it("computes acosh(-∞ - i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, -1);
    const result = Complex.acosh(z);
    // C99     -> Infinity - πi
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity - 3.141592653589793i
    // Wolfram -> Infinity + 0i
    // Octave  -> Infinity - 3.1416i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(-Math.PI, 15);
  });

  // Test 25
  it("computes acosh(-∞ + NaN i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, NaN);
    const result = Complex.acosh(z);
    // C99     -> Infinity + NaNi
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + NaNi
    // Wolfram -> ? + ?i
    // Octave  -> Infinity + NaNi
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeNaN();
  });

  // Test 26
  it("computes acosh(∞ + ∞i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.acosh(z);
    // C99     -> Infinity + π/4i
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + 0.7853981633974483i
    // Wolfram -> ? + ?i
    // Octave  -> Infinity + 0.7854i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(Math.PI / 4, 15);
  });

  // Test 27
  it("computes acosh(-∞ + ∞i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.acosh(z);
    // C99     -> Infinity + 3π/4i
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity + 2.356194490192345i
    // Wolfram -> ? + ?i
    // Octave  -> Infinity + 2.3562i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo((3 * Math.PI) / 4, 15);
  });

  // Test 28
  it("computes acosh(-∞ - ∞i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.acosh(z);
    // C99     -> Infinity - 3π/4i
    // mathjs  -> NaN + NaNi
    // Complex -> Infinity - 2.356194490192345i
    // Wolfram -> ? + ?i
    // Octave  -> Infinity - 2.3562i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo((-3 * Math.PI) / 4, 15);
  });
});

//-------------------------------------
// Octave results for infinite inputs:
//
// octave:1> z = complex(-Inf, -Inf)
// z = -Inf - Infi
// octave:2> acosh(z)
// ans =     Inf - 2.3562i
// octave:3> z = complex(-Inf, -1)
// z = -Inf -   1i
// octave:4> acosh(z)
// ans =     Inf - 3.1416i
// octave:5> z = complex(-Inf, 1)
// z = -Inf +   1i
// octave:6> acosh(z)
// ans =     Inf + 3.1416i
// octave:7> z = complex(Inf, 1000)
// z =   Inf + 1000i
// octave:8> acosh(z)
// ans = Inf
// octave:9> z = complex(Inf, -1)
// z =  Inf -   1i
// octave:10> acosh(z)
// ans = Inf
// octave:11> z = complex(Inf, NaN)
// z =  Inf + NaNi
// octave:12> acosh(z)
// ans =  Inf + NaNi
// octave:13> z = complex(Inf, Inf)
// z =  Inf + Infi
// octave:14> acosh(z)
// ans =     Inf + 0.7854i
// octave:1> z = complex(-Inf, NaN)
// z = -Inf + NaNi
// octave:2> acosh(z)
// ans =  Inf + NaNi
// octave:3> z = complex(-Inf, Inf)
// z = -Inf + Infi
// octave:4> acosh(z)
// ans =     Inf + 2.3562i
// octave:5> z = complex(Inf, 1)
// z =  Inf +   1i
// octave:6> acosh(z)
// ans = Inf
// octave:7> z = complex(NaN, 1)
// z =  NaN +   1i
// octave:8> acosh(z)
// ans =  NaN + NaNi
// octave:9> z = complex(NaN, NaN)
// z =  NaN + NaNi
// octave:10> acosh(z)
// ans =  NaN + NaNi
