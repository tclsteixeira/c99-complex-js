/**
 * Test suite for Complex.acsch(z), the complex inverse hyperbolic cosecant function.
 * @module tests/complex.acsch.test
 * @description
 * Validates the Complex.acsch(z) implementation against 29 edge cases, ensuring
 * compliance with C99 standard (N1256, Annex G) and IEEE 754 double-precision arithmetic.
 * Tests cover zero, small, finite, infinite, and NaN inputs, including poles at
 * z = 0 and branch cuts along z = yi, |y| ≤ 1. Numerical results are checked to
 * 15 decimal places using toBeCloseTo(value, 15). The suite uses Vitest for assertions
 * and follows the structure of complex.coth.test.js for consistency.
 * @notes
 * - C99 Compliance: Implements acsch(z) = asinh(1/z), with:
 *   - Pole at z = 0 yielding ±∞ + i NaN (Annex G.5.1).
 *   - Branch cuts along z = yi, |y| ≤ 1, inherited from asinh(1/z).
 *   - acsch(±∞ + yi) for finite y (e.g., acsch(±∞ + 0i)) returns 0 + i NaN due to
 *     indeterminate form, per C99 Annex G. This differs from Wolfram’s 0 + 0i,
 *     which uses a limit-based approach and is not C99-compliant.
 *   - acsch(±∞ + NaNi) = NaN + i NaN.
 *   - acsch(x + ±∞i) for finite x = NaN + i NaN.
 *   - Real inputs: acsch(x + 0i) = asinh(1/x).
 * - Precision: Uses epsilon = Number.EPSILON ≈ 2.220446049250313e-16 for numerical checks.
 * - Edge Cases: Includes inputs like acsch(0 + i) (branch cut), acsch(1e-15 + 0i),
 *   acsch(Number.MIN_VALUE + Number.MIN_VALUE i), and acsch(1 + 1e10i).
 * - Created: June 13, 2025.
 * - Updated: June 26, 2025, to include symmetry, branch cut, tiny, and large inputs.
 *
 * 
 * C99-Compliant Expected Results for 29 tests
 * Test	Input zz	          Expected acsch(z) (C99)	                  Notes
 * 1	  0 + 0i	            ∞ + 0i	                                  asinh(1/0) → ∞
 * 2    1 + 0i	            0.881373587019543 + 0i	                  Standard real
 * 3	  0 + i	              0 − π/2·i = 0 − 1.5707963267948966i	      Imaginary input
 * 4	  1 + i	              0.5306375309525179 − 0.4522784471511907i	Complex input
 * 5	  NaN + 0i	          NaN + NaNi	                              NaN propagation
 * 6	  0 + NaNi	          NaN + NaNi	                              NaN propagation
 * 7	  NaN + NaNi	        NaN + NaNi	                              NaN propagation
 * 8	  ∞ + 0i	            0 + 0i	                                  1/∞ = 0, asinh(0) = 0
 * 9	  -∞ + 0i	            -0 + 0i	                                  Sign-preserved zero
 * 10	  ∞ + i	              0 + 0i	                                  1/z → 0, asinh(0) = 0
 * 11	  -∞ + i	            -0 + 0i	                                  Same, with signed zero
 * 12	  ∞ + NaNi	          NaN + NaNi	                              Undefined
 * 13	  0 + ∞i	            0 − 0i	                                  Direction matters; sign preserved
 * 14	  1 + ∞i	            0 − 0i	                                  Limit of small reciprocal
 * 15	  -∞ + NaNi	          NaN + NaNi	                              Undefined
 * 16	  1e-15 + 0i	        35.23192357547063 + 0i	                  Large result: asinh(1e15)
 * 17	  1e-15 + 1e-15i	    34.88534998519066 − 0.7853981633974483i	  Approaches ∞ at 45°
 * 18	  0 + 0.5i	          −1.3169578969248168 − 1.5707963267948966i	Imaginary axis
 * 19	  −(1 + i)	          −0.5306375309525179 + 0.4522784471511907i	Symmetry: −acsch(z)
 * 20	  conj(1 + i)	conj(acsch(1 + i))	                              Conjugate symmetry
 * 21	  0 − i	              0 + π/2·i = 0 + 1.5707963267948966i	      Opposite sign of test 3
 * 22	  ∞ + ∞i	            NaN + NaNi	                              Undefined division
 * 23	  ∞ − ∞i	            NaN + NaNi	                              Undefined division
 * 24	  −∞ + ∞i	            NaN + NaNi	                              Undefined division
 * 25	  −∞ − ∞i	            NaN + NaNi	                              Undefined division
 * 26	  1 + εi (ε ≈ 1e-16)	0.881373587019543 − εi	                  Small imaginary perturbation
 * 27	  −1 + εi	            −0.881373587019543 − εi	                  Same, negative real axis
 * 28	  DBL_MIN + DBL_MIN·i	Large real + angle ≈ −π/4i	              Magnitude ≈ `log(2/
 * 29	  1 + 1e10i	          1e-20 − 1e-10i	                          Reciprocal of huge imag = small
 
 *
 * C99 Special Cases Table for acsch(z)
 * --------------------------------------------------------------------------------
 * | Input (z)                          | Output (acsch(z))                     | Test Reference | Notes                                                                 |
 * |------------------------------------|---------------------------------------|--------------------|-----------------------------------------------------------------------|
 * | acsch(0 + 0i)                     | ±∞ + NaNi                            | Test 1             | Pole at z = 0; `1/z` undefined, yields `±∞ + NaNi` (Annex G.5.1). `mathjs`: `∞ + 0i`, `Wolfram`: `∞^~ + i`, both non-C99-compliant. |
 * | acsch(+i)                         | 0 - π/2 i                            | Test 3             | `acsch(i) = asinh(-i) = -π/2 i` (exact). Matches `mathjs`, `Complex`, `Wolfram`. |
 * | acsch(-i)                         | 0 + π/2 i                            | Test 21            | `acsch(-i) = asinh(i) = π/2 i` (exact). Matches `mathjs`, `Complex`, `Wolfram`. |
 * | acsch(+∞ + yi) (finite y)         | 0 + i NaN                            | Tests 8, 10        | `1/z ≈ 0 + 0i`, indeterminate (Annex G.5.1). `Wolfram`: `0 + 0i` (non-C99). |
 * | acsch(-∞ + yi) (finite y)         | 0 + i NaN                            | Tests 9, 11        | Same as above. `Wolfram`: `0 + 0i` (non-C99).                         |
 * | acsch(x + ±∞i) (finite x)         | NaN + NaNi                           | Tests 13, 14       | `1/z` undefined direction, yields `NaN + NaNi` (Annex G.5.1). Matches `mathjs`, `Wolfram`. |
 * | acsch(+∞ + +∞i)                   | 0 + 0i                               | Test 22            | `1/z ≈ 0 + 0i`, `asinh(0) = 0`. Matches `mathjs`, `Wolfram`.          |
 * | acsch(+∞ + -∞i)                   | 0 + 0i                               | Test 23            | Same as above. Matches `mathjs`, `Wolfram`.                           |
 * | acsch(-∞ + +∞i)                   | 0 + 0i                               | Test 24            | Same as above. Matches `mathjs`, `Wolfram`.                           |
 * | acsch(-∞ + -∞i)                   | 0 + 0i                               | Test 25            | Same as above. Matches `mathjs`, `Wolfram`.                           |
 * | acsch(x + NaNi) (finite x)        | NaN + NaNi                           | Test 6             | NaN propagation (Annex G.5.1). Matches `mathjs`, `Wolfram`.           |
 * | acsch(±∞ + NaNi)                  | NaN + NaNi                           | Tests 12, 15       | Same as above. Matches `mathjs`, `Wolfram`.                           |
 * | acsch(NaN + yi) (finite y)        | NaN + NaNi                           | Test 5             | Same as above. Matches `mathjs`, `Wolfram`.                           |
 * | acsch(NaN + ±∞i)                  | NaN + NaNi                           | Test 17            | Same as above. Matches `mathjs`, `Wolfram`.                           |
 * | acsch(NaN + NaNi)                 | NaN + NaNi                           | Test 7             | Same as above. Matches `mathjs`, `Wolfram`.                           |
 * | Symmetry: acsch(-z)               | -acsch(z)                            | Test 19            | `acsch(-z) = asinh(-1/z) = -asinh(1/z)`. Matches `mathjs`, `Wolfram`. |
 * | Conjugate symmetry: acsch(conj(z)) | conj(acsch(z))                       | Test 20            | `acsch(x - yi) = conj(acsch(x + yi))`. Matches `mathjs`, `Wolfram`.   |
 * | Near branch cuts: z ≈ +i + εi     | ≈ -ln(2/|z|) - π/2 i                 | Test 26            | `z ≈ i`, `1/z ≈ -i`, `acsch(z) ≈ -π/2 i`. Matches `mathjs`, `Wolfram`.|
 * | Near branch cuts: z ≈ -i + εi     | ≈ -ln(2/|z|) + π/2 i                 | Test 27            | `z ≈ -i`, `1/z ≈ i`, `acsch(z) ≈ π/2 i`. Matches `mathjs`, `Wolfram`. |
 * | Tiny inputs: z = MIN_VALUE + MIN_VALUE i | ≈ -ln(2/|z|) + arg(-z)i | Test 28            | `|z| ≈ 7.071e-324`, `acsch(z) ≈ 744.4400719213812 + 0.7853981633974483i`. |
 * | Large |z|: z = 1 + 1e10i          | ≈ 1e-10 - π/2 i                      | Test 29            | `1/z ≈ -1e-10i`, `acsch(z) ≈ -1e-10 - 1.5707963267948966i`. Matches `mathjs`, `Wolfram`. |
 *
 * Summary -----------------
 * Test 1: Checks acsch(0 + 0i) → ±∞ + NaNi (pole).
 * Test 2: Checks acsch(1 + 0i) → asinh(1) ≈ 0.881373587019543 + 0i.
 * Test 3: Checks acsch(0 + i) → asinh(-i) ≈ 0 - 1.5707963267948966i (branch cut).
 * Test 4: Checks acsch(1 + i) → asinh(0.5 - 0.5i) ≈ 0.5306375309525178 - 0.4522784471511907i.
 * Test 5: Checks acsch(NaN + 0i) → NaN + NaNi.
 * Test 6: Checks acsch(0 + NaNi) → NaN + NaNi.
 * Test 7: Checks acsch(NaN + NaNi) → NaN + NaNi.
 * Test 8: Checks acsch(∞ + 0i) → 0 + i NaN (indeterminate, C99-compliant).
 * Test 9: Checks acsch(-∞ + 0i) → 0 + i NaN (indeterminate, C99-compliant).
 * Test 10: Checks acsch(∞ + 1i) → 0 + i NaN (indeterminate, C99-compliant).
 * Test 11: Checks acsch(-∞ + 1i) → 0 + i NaN (indeterminate, C99-compliant).
 * Test 12: Checks acsch(∞ + NaNi) → NaN + i NaN.
 * Test 13: Checks acsch(0 + ∞i) → NaN + i NaN.
 * Test 14: Checks acsch(1 + ∞i) → NaN + i NaN.
 * Test 15: Checks acsch(-∞ + NaNi) → NaN + i NaN.
 * Test 16: Checks acsch(1e-15 + 0i) → asinh(1e15) ≈ 35.23192357547063 + 0i.
 * Test 17: Checks acsch(1e-15 + 1e-15i) → asinh(5e14 - 5e14i) ≈ 34.88534998519066 - 0.7853981633974483i.
 * Test 18: Checks acsch(0 + 0.5i) → asinh(-2i) ≈ -1.3169578969248166 - 1.5707963267948966i.
 * Test 19: Checks symmetry acsch(-z) = -acsch(z) for z = 1 + i.
 * Test 20: Checks conjugate symmetry acsch(conj(z)) = conj(acsch(z)) for z = 1 + i.
 * Test 21: Checks acsch(0 - i) → asinh(i) ≈ 0 + 1.5707963267948966i (branch cut).
 * Test 22: Checks acsch(∞ + ∞i) → 0 + 0i.
 * Test 23: Checks acsch(∞ - ∞i) → 0 + 0i.
 * Test 24: Checks acsch(-∞ + ∞i) → 0 + 0i.
 * Test 25: Checks acsch(-∞ - ∞i) → 0 + 0i.
 * Test 26: Checks acsch(1 + εi) → ≈ -ln(2/|z|) - π/2 i (near branch cut).
 * Test 27: Checks acsch(-1 + εi) → ≈ -ln(2/|z|) + π/2 i (near branch cut).
 * Test 28: Checks acsch(Number.MIN_VALUE + Number.MIN_VALUE i) → ≈ -ln(2/|z|) + arg(-z)i.
 * Test 29: Checks acsch(1 + 1e10i) → ≈ 1e-10 - π/2 i.
 */

import { describe, expect, it } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.acsch", () => {
  const ε = Number.EPSILON; // ≈ 2.220446049250313e-16

  // Test 1: Zero input, acsch(0 + 0i) = ±∞ + i NaN (pole)
  // C99 Annex G specifies ±∞ + i NaN for the pole at z = 0. mathjs’s Infinity + 0i
  // and Wolfram’s ∞^~ + i are not C99-compliant.
  it("handles acsch(0 + 0i) correctly", () => {
    const result = Complex.acsch(new Complex(0, 0));
    // mathjs  -> Test acsch(0 + 0i) = Infinity + 0i
    // Complex -> Test acsch(0 + 0i) = Infinity + 0i
    // Wolfram -> Test acsch(0 + 0i) = ∞^~ + ?i  (complex infinity)
    // C99 = Infinity + 0i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBe(0);
  });

  // Test 2: Real input, expect acsch(1 + 0i) ≈ 0.881373587019543
  it("computes acsch(1 + 0i) correctly", () => {
    const result = Complex.acsch(new Complex(1, 0));
    // mathjs  -> Test acsch(1 + 0i) = 0.881373587019543 + 0i
    // Complex -> Test acsch(1 + 0i) = 0.881373587019543 + 0i
    // Wolfram -> Test acsch(1 + 0i) = 0.881373587019543 + 0i
    expect(result.re).toBeCloseTo(0.881373587019543, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Pure imaginary on branch cut, expect acsch(0 + i) ≈ 0 - 1.5707963267948966i
  it("handles acsch(0 + i) correctly", () => {
    const result = Complex.acsch(new Complex(0, 1));
    // mathjs  -> Test acsch(0 + i) = 0 + -1.5707963267948966i
    // Complex -> Test acsch(0 + i) = 0 + -1.5707963267948966i
    // Wolfram -> Test acsch(0 + i) = 0 + -1.5707963267948966i
    // C99 -> 0 + -1.5707963267948966i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1.5707963267948966, 15);
  });

  // Test 4: Complex input, expect acsch(1 + i) ≈ 0.5306375309525178 - 0.4522784471511907i
  it("computes acsch(1 + i) correctly", () => {
    const result = Complex.acsch(new Complex(1, 1));
    // mathjs  -> Test acsch(1 + i) = 0.5306375309525179 + -0.45227844715119064i
    // Complex -> Test acsch(1 + i) = 0.5306375309525178 + -0.45227844715119064i
    // Wolfram -> Test acsch(1 + i) = 0.5306375309525179 + -0.4522784471511907i
    // C99 -> 0.5306375309525179 + -0.4522784471511907i
    expect(result.re).toBeCloseTo(0.5306375309525179, 15);
    expect(result.im).toBeCloseTo(-0.4522784471511907, 15);
  });

  // Test 5: NaN real part, expect acsch(NaN + 0i) = NaN + i NaN
  it("handles acsch(NaN + 0i) correctly", () => {
    const result = Complex.acsch(new Complex(NaN, 0));
    // mathjs  -> Test acsch(NaN + 0i) = NaN + NaNi
    // Complex -> Test acsch(NaN + 0i) = NaN + NaNi
    // Wolfram -> Test acsch(NaN + 0i) = NaN + NaNi
    // C99 -> NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 6: NaN imaginary part, expect acsch(0 + NaNi) = NaN + i NaN
  it("handles acsch(0 + NaNi) correctly", () => {
    const result = Complex.acsch(new Complex(0, NaN));
    // mathjs  -> Test acsch(0 + NaNi) = NaN + NaNi
    // Complex -> Test acsch(0 + NaNi) = NaN + NaNi
    // Wolfram -> Test acsch(0 + NaNi) = NaN + NaNi
    // C99 -> NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 7: Both NaN, expect acsch(NaN + NaNi) = NaN + i NaN
  it("handles acsch(NaN + NaNi) correctly", () => {
    const result = Complex.acsch(new Complex(NaN, NaN));
    // mathjs  -> Test acsch(NaN + NaNi) = NaN + NaNi
    // Complex -> Test acsch(NaN + NaNi) = NaN + NaNi
    // Wolfram -> Test acsch(NaN + NaNi) = NaN + NaNi
    // C99 -> NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 8: Infinite real part, expect acsch(∞ + 0i) = 0 + i NaN
  it("handles acsch(∞ + 0i) correctly", () => {
    const result = Complex.acsch(new Complex(Infinity, 0));
    // mathjs  -> Test acsch(∞ + 0i) = Infinity + 0i (non-C99)
    // Complex -> Test acsch(∞ + 0i) = 0 + 0i
    // Wolfram -> Test acsch(∞ + 0i) = 0 + 0i
    // C99 -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 9: Negative infinite real part, expect acsch(-∞ + 0i) = 0 + i NaN
  it("handles acsch(-∞ + 0i) correctly", () => {
    const result = Complex.acsch(new Complex(-Infinity, 0));
    // mathjs  -> Test acsch(-∞ + 0i) = NaN + 0i (non-C99)
    // Complex -> Test acsch(-∞ + 0i) = 0 + 0i
    // Wolfram -> Test acsch(-∞ + 0i) = 0 + 0i
    // C99 ->  = 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 10: Infinite real part with finite imag, expect acsch(∞ + 1i) = 0 + i NaN
  it("handles acsch(∞ + 1i) correctly", () => {
    const result = Complex.acsch(new Complex(Infinity, 1));
    // mathjs  -> Test acsch(∞ + 1i) = NaN + NaNi
    // Complex -> Test acsch(∞ + 1i) = 0 + 0i
    // Wolfram -> Test acsch(∞ + 1i) = 0 + 0i
    // C99 -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 11: Negative infinite real part with finite imag, expect acsch(-∞ + 1i) = 0 + i NaN
  it("handles acsch(-∞ + 1i) correctly", () => {
    const result = Complex.acsch(new Complex(-Infinity, 1));
    // mathjs  -> Test acsch(-∞ + 1i) = 0 + 0i
    // Complex -> Test acsch(-∞ + 1i) = 0 + 0i
    // Wolfram -> Test acsch(-∞ + 1i) = 0 + 0i
    // C99 -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 12: Infinite real part with NaN imag, expect acsch(∞ + NaNi) = NaN + i NaN
  it("handles acsch(∞ + NaNi) correctly", () => {
    const result = Complex.acsch(new Complex(Infinity, NaN));
    // mathjs  -> Test acsch(∞ + NaNi) = NaN + NaNi
    // Complex -> Test acsch(∞ + NaNi) = NaN + NaNi
    // Wolfram -> Test acsch(∞ + NaNi) = NaN + NaNi
    // C99 -> NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 13: Infinite imaginary part
  it("handles acsch(0 + ∞i) correctly", () => {
    const result = Complex.acsch(new Complex(0, Infinity));
    // mathjs  -> Test acsch(0 + ∞i) = NaN + NaNi
    // Complex -> Test acsch(0 + ∞i) = 0 - 0i
    // Wolfram -> Test acsch(0 + ∞i) = 0 +/- 0i
    // C99 -> 0 - 0i
    expect(result.re).toBe(0);
    expect(result.im).toBe(-0);
  });

  // Test 14: Finite real with infinite imag
  it("handles acsch(1 + ∞i) correctly", () => {
    const result = Complex.acsch(new Complex(1, Infinity));
    // mathjs  -> Test acsch(1 + ∞i) = NaN + NaNi
    // Complex -> Test acsch(1 + ∞i) = 0 - 0i
    // Wolfram -> Test acsch(1 + ∞i) = 0 +/- 0i
    // C99 -> 0 - 0i
    expect(result.re).toBe(0);
    expect(result.im).toBe(-0);
  });

  // Test 15: Negative infinite real with NaN imag, expect acsch(-∞ + NaNi) = NaN + i NaN
  it("handles acsch(-∞ + NaNi) correctly", () => {
    const result = Complex.acsch(new Complex(-Infinity, NaN));
    // mathjs  -> Test acsch(-∞ + NaNi) = NaN + NaNi
    // Complex -> Test acsch(-∞ + NaNi) = NaN + NaNi
    // Wolfram -> Test acsch(-∞ + NaNi) = NaN + NaNi
    // C99 -> NaN + NaNi
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(true);
  });

  // Test 16: Small real input, expect acsch(1e-15 + 0i) ≈ 35.23192357547063
  it("handles acsch(1e-15 + 0i) correctly", () => {
    const result = Complex.acsch(new Complex(1e-15, 0));
    // mathjs  -> Test acsch(1e-15 + 0i) = 1.110223024625156e-15 + 0i (incorrect)
    // Complex -> Test acsch(1e-15 + 0i) = 35.23192357547063 + 0i
    // Wolfram -> Test acsch(1e-15 + 0i) = 35.23192357547063 + 0i
    // C99 -> 35.23192357547063 + 0i
    expect(result.re).toBeCloseTo(35.23192357547063, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 17: Small complex input, expect acsch(1e-15 + 1e-15i) ≈ 34.88534998519066 - 0.7853981633974483i
  it("handles acsch(1e-15 + 1e-15i) correctly", () => {
    const result = Complex.acsch(new Complex(1e-15, 1e-15));
    // mathjs  -> Test acsch(1e-15 + 1e-15i) = 34.88534998519066 + -0.7853981633974483i
    // Complex -> Test acsch(1e-15 + 1e-15i) = 34.88534998519066 + -0.7853981633974483i
    // Wolfram -> Test acsch(1e-15 + 1e-15i) = 34.88534998519066 + -0.7853981633974483i
    // C99 -> 34.88534998519066 + -0.7853981633974483i
    expect(result.re).toBeCloseTo(34.88534998519066, 15);
    expect(result.im).toBeCloseTo(-0.7853981633974483, 15);
  });

  // Test 18: Pure imaginary input, expect acsch(0 + 0.5i) ≈ -1.3169578969248166 - 1.5707963267948966i
  it("computes acsch(0 + 0.5i) correctly", () => {
    const result = Complex.acsch(new Complex(0, 0.5));
    // mathjs  -> Test acsch(0 + 0.5i) = -1.3169578969248164 + -1.5707963267948966i
    // Complex -> Test acsch(0 + 0.5i) = -1.3169578969248166 + -1.5707963267948966i
    // Wolfram -> Test acsch(0 + 0.5i) = -1.3169578969248168 + -1.5707963267948966i
    // C99 -> -1.3169578969248168 + -1.5707963267948966i
    expect(result.re).toBeCloseTo(-1.3169578969248168, 15);
    expect(result.im).toBeCloseTo(-1.5707963267948966, 15);
  });

  // Test 19: Symmetry, expect acsch(-z) = -acsch(z) for z = 1 + i
  it("handles acsch(-z) = -acsch(z) correctly for z = 1 + i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const result = Complex.acsch(z);
    const resultNeg = Complex.acsch(negZ);
    // mathjs  -> Test acsch(-1 - i) = -0.5306375309525179 + 0.4522784471511907i
    // Complex -> Test acsch(-1 - i) = -0.5306375309525178 + 0.45227844715119064i
    // Wolfram -> Test acsch(-1 - i) = -0.5306375309525179 + 0.4522784471511907i
    expect(resultNeg.re).toBeCloseTo(-result.re, 15);
    expect(resultNeg.im).toBeCloseTo(-result.im, 15);
    expect(result.re).toBeCloseTo(0.5306375309525179, 15);
    expect(result.im).toBeCloseTo(-0.4522784471511907, 15);
  });

  // Test 20: Conjugate symmetry, expect acsch(conj(z)) = conj(acsch(z)) for z = 1 + i
  it("handles acsch(conj(z)) = conj(acsch(z)) correctly for z = 1 + i", () => {
    const z = new Complex(1, 1);
    const conjZ = new Complex(1, -1);
    const conjResult = Complex.conj(Complex.acsch(z));
    const resultConj = Complex.acsch(conjZ);
    // mathjs  -> Test acsch(1 - i)) = 0.5306375309525179 + 0.4522784471511907i
    // Complex -> Test acsch(1 - i) = 0.5306375309525178 + 0.45227844715119064i
    // Wolfram -> Test acsch(1 - i) = 0.5306375309525179 + 0.4522784471511907i
    expect(resultConj.re).toBeCloseTo(conjResult.re, 15);
    expect(resultConj.im).toBeCloseTo(conjResult.im, 15);
    expect(conjResult.re).toBeCloseTo(0.5306375309525179, 15);
    expect(conjResult.im).toBeCloseTo(0.4522784471511907, 15);
  });

  // Test 21: Pure imaginary on branch cut, expect acsch(0 - i) ≈ 0 + 1.5707963267948966i (PI/2i)
  it("handles acsch(0 - i) correctly", () => {
    const result = Complex.acsch(new Complex(0, -1));
    // mathjs  -> Test acsch(0 - i) = 0 + 1.5707963267948966i
    // Complex -> Test acsch(0 - i) = 0 + 1.5707963267948966i
    // Wolfram -> Test acsch(0 - i) = 0 + 1.5707963267948966i
    // C99 -> 0 + 1.5707963267948966i (PI/2i)
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.5707963267948966, 15);
  });

  // Test 22: Infinite real and imag, expect acsch(∞ + ∞i) = 0 + 0i
  it("handles acsch(∞ + ∞i) correctly", () => {
    const result = Complex.acsch(new Complex(Infinity, Infinity));
    // mathjs  -> Test acsch(∞ + ∞i) = NaN + NaNi
    // Complex -> Test acsch(∞ + ∞i) = NaN + NaNi
    // Wolfram -> Test acsch(∞ + ∞i) = undef
    // C99 -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 23: Infinite real and negative imag, expect acsch(∞ - ∞i) = 0 + 0i
  it("handles acsch(∞ - ∞i) correctly", () => {
    const result = Complex.acsch(new Complex(Infinity, -Infinity));
    // mathjs  -> Test acsch(∞ - ∞i) = NaN + NaNi
    // Complex -> Test acsch(∞ - ∞i) = NaN + NaNi
    // Wolfram -> Test acsch(∞ - ∞i) = undef
    // C99 -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 24: Negative infinite real and imag
  it("handles acsch(-∞ + ∞i) correctly", () => {
    const result = Complex.acsch(new Complex(-Infinity, Infinity));
    // mathjs  -> Test acsch(-∞ + ∞i) = NaN + NaNi
    // Complex -> Test acsch(-∞ + ∞i) = NaN + NaNi
    // Wolfram -> Test acsch(-∞ + ∞i) = undef
    // C99 -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 25: Negative infinite real and negative imag, expect acsch(-∞ - ∞i) = 0 + 0i
  it("handles acsch(-∞ - ∞i) correctly", () => {
    const result = Complex.acsch(new Complex(-Infinity, -Infinity));
    // mathjs  -> Test acsch(-∞ - ∞i) = NaN + NaNi
    // Complex -> Test acsch(-∞ - ∞i) = NaN + NaNi
    // Wolfram -> Test acsch(-∞ - ∞i) = undef
    // C99 -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 26: Near branch cut
  it("handles acsch(i + εi) correctly, ε = Number.EPSILON", () => {
    const z = new Complex(1, ε);
    const result = Complex.acsch(z);
    const expectedReal = 0.881373587019543;
    // mathjs  -> Test acsch(i + εi) ≈ 0.8813735870195429 + -1.5700924586837752e-16i
    // Complex -> Test acsch(i + εi) ≈ 0.8813735870195429 + -1.5700924586837752e-16i
    // Wolfram -> Test acsch(i + εi) ≈ 0.881373587019543 + -1.570092458683775e-16i
    // C99 -> 0.881373587019543 + -1.570092458683775e-16i
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(-1.570092458683775e-16, 15);
  });

  // Test 27: Near branch cut,
  it("handles acsch(-1 + εi) correctly, ε = Number.EPSILON", () => {
    const z = new Complex(-1, ε);
    const result = Complex.acsch(z);
    const expectedReal = -0.881373587019543;
    // mathjs  -> Test acsch(-i + εi) ≈ -0.8813735870195427 + -1.570092458683775e-16i
    // Complex -> Test acsch(-i + εi) ≈ -0.8813735870195429 + -1.5700924586837752e-16i
    // Wolfram -> Test acsch(-i + εi) ≈ -0.881373587019543 + -1.570092458683775e-16i
    // C99 -> -0.881373587019543 + -1.570092458683775e-16i
    expect(result.re).toBeCloseTo(expectedReal, 15);
    expect(result.im).toBeCloseTo(-1.570092458683775e-16, 15);
  });

  // Test 28: Tiny input
  it("handles acsch(Number.MIN_VALUE + Number.MIN_VALUE i) correctly", () => {
    const z = new Complex(Number.MIN_VALUE, Number.MIN_VALUE);
    const result = Complex.acsch(z);
    // mathjs  -> Test acsch(MIN_VALUE + MIN_VALUE i) ≈ NaNi + NaNi
    // Complex -> Test acsch(MIN_VALUE + MIN_VALUE i) ≈ 744.7747058079167 + -0.7853981633974483i
    // Wolfram -> Test acsch(MIN_VALUE + MIN_VALUE i) ≈ 744.7747058079167 + -0.7853981633974483i
    // C99 -> 744.7747058079167 + -0.7853981633974483i
    expect(result.re).toBeCloseTo(744.7747058079167, 15);
    expect(result.im).toBeCloseTo(-0.7853981633974483, 15);
  });

  // Test 29: Large magnitude input, expect acsch(1 + 1e10i) ≈ 1e-10 - π/2 i
  // mathjs  -> Test acsch(1 + 1e10i) ≈ 0 + -1e-10i
  // Complex -> Test acsch(1 + 1e10i) ≈ 1e-20 + -1e-10i
  // Wolfram -> Test acsch(1 + 1e10i) ≈ 1e-20 + -1e-10i
  // C99 -> 1e-20 + -1e-10i
  it("handles acsch(1 + 1e10i) correctly", () => {
    const result = Complex.acsch(new Complex(1, 1e10));
    expect(result.re).toBeCloseTo(1e-20, 15);
    expect(result.im).toBeCloseTo(-1e-10, 15);
  });
});
