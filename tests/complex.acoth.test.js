import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

// C99 Special Cases (Annex G.6.2.2)
//
//     acoth(0 + 0i) = 0 + π/2i (Test 1).
//     acoth(±1 + 0i) = ±∞ + 0i (Tests 3–4).
//     acoth(±∞ + yi) = 0 + 0i for finite y (Tests 11–12, 15–16).
//     acoth(x ± ∞i) = 0 + 0i for finite x (Tests 17–18).
//     acoth(±∞ ± ∞i) = 0 + 0i (Tests 19–22).
//     acoth(x + NaNi) = NaN + NaNi for finite/infinite x (Tests 23–24).
//     acoth(NaN + yi) = NaN + NaNi for finite y (Test 13).
//     acoth(NaN ± ∞i) = NaN + NaNi (Test 25).
//     acoth(NaN + NaNi) = NaN + NaNi (Test 26).
//     Symmetry: acoth(-z) = -acoth(z) (Test 31).
//     Near branch cuts (z ≈ ±1 ± εi): Large real part, Im = -π/4 (Tests 27–28).
//     Tiny inputs (z = MIN_VALUE + MIN_VALUE i): ≈ 1/z - π/2i (Test 29).
//     Large |y| (z = 1 + 1e10i): Re ≈ 1e-20, Im ≈ -1e-10 (Test 30).

describe("Complex.acoth", () => {
  // Test Summary:
  // This suite validates Complex.acoth(z) across 31 test cases for C99 compliance (Annex G.6.2.2 via atanh(1/z)):
  // - Tests 1–2: Real inputs (0, 2), expecting ~1e-15 precision.
  // - Tests 3–4: Branch cut boundaries (±1), expecting ±∞ + 0i.
  // - Tests 5–6: Imaginary inputs (i, 0.5i), expecting 0 ± Im(atanh(1/z)).
  // - Test 7: Complex input (1 + i), expecting ~1e-15.
  // - Tests 8–9: Large real (±30 + i), expecting ~1e-14.
  // - Test 10: Large imaginary (1 + 30i), expecting ~1e-14.
  // - Tests 11–12, 15–16: Infinities (±∞ ± i), expecting 0 + 0i.
  // - Tests 17–18: Finite real, infinite imag (1 ± ∞i), expecting 0 + 0i.
  // - Tests 19–22: Infinite real/imag (±∞ ± ∞i), expecting 0 + 0i.
  // - Tests 13, 23–26: NaN inputs, expecting NaN + NaNi.
  // - Test 14: Tiny input (1e-154 + 1e-154i), expecting ~1/z - π/2i.
  // - Tests 27–28: Near branch cuts (1 ± εi, -1 + εi), expecting ~1e-14, Im = ±π/4.
  // - Test 29: Subnormal input (Number.MIN_VALUE), expecting ~1/z - π/2i.
  // - Test 30: Large imaginary (1 + 1e10i), expecting ~1e-14, Re ≈ 5e-11.
  // - Test 31: Symmetry, verifying acoth(-z) = -acoth(z).
  // Precision: Set to 15 digits where applicable; relaxed to 14 for Tests 8–10, 27–28, 30 due to 64-bit float limits (~2.22e-16).

  // Test 1
  it("computes acoth(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(0 + 0i) = 0 + 1.5707963267948966i
    // Complex -> Test acoth(0 + 0i) = 0 + 1.5707963267948966i
    // Octave  -> Test acoth(0 + 0i) = 0 + NaNi   (non C99 std compliant)
    // Wolfram -> 0 + 1.5707963267948966i (PI/2i)
    // C99     -> 0 + 1.5707963267948966i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(Math.PI / 2, 15);
  });

  // Test 2
  it("computes acoth(2 + 0i) correctly", () => {
    const z = new Complex(2, 0);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(2 + 0i) = 0.5493061443340548 + 0i
    // Complex -> Test acoth(2 + 0i) = 0.5493061443340548 + 0i
    // Octave  -> Test acoth(2 + 0i) = 0.549306144334055 + 0i
    // Wolfram -> Test acoth(2 + 0i) = 0.5493061443340548 + 0i
    // C99     -> 0.5493061443340548 + 0i
    expect(result.re).toBeCloseTo(0.5493061443340548, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3
  it("computes acoth(-1 + 0i) correctly", () => {
    const z = new Complex(-1, 0);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-1 + 0i) = -Infinity + 0i
    // Complex -> Test acoth(-1 + 0i) = -Infinity + 0i
    // Octave  -> Test acoth(-1 + 0i) = -Infinity + 0i
    // Wolfram -> Test acoth(-1 + 0i) = -Infinity + 0i
    // C99     -> -Infinity + 0i
    expect(result.re).toBe(Number.NEGATIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 4
  it("computes acoth(1 + 0i) correctly", () => {
    const z = new Complex(1, 0);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1 + 0i) = Infinity + 0i
    // Complex -> Test acoth(1 + 0i) = Infinity + 0i
    // Octave  -> Test acoth(1 + 0i) = Infinity + 0i
    // Wolfram -> Infinity + 0i
    // C99     -> Infinity + 0i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 5
  it("computes acoth(0 + i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(0 + i) = 0 + -0.7853981633974483i
    // Complex -> Test acoth(0 + i) = 0 + -0.7853981633974483i
    // Octave  -> Test acoth(0 + i) = 0 + -0.785398163397448i
    // Wolfram -> 0 - 0.7853981633974483i
    // C99     -> 0 - 0.7853981633974483i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-0.7853981633974483, 15);
  });

  // Test 6
  it("computes acoth(0 + 0.5i) correctly", () => {
    const z = new Complex(0, 0.5);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(0 + 0.5i) = 0 + -1.1071487177940904i
    // Complex -> Test acoth(0 + 0.5i) = 0 + -1.1071487177940904i
    // Octave  -> Test acoth(0 + 0.5i) = 0 + -1.10714871779409i
    // Wolfram -> 0 - 1.1071487177940905i
    // C99     -> 0 - 1.1071487177940905i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(-1.1071487177940905, 15);
  });

  // Test 7
  it("computes acoth(1 + i) correctly", () => {
    const z = new Complex(1, 1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1 + i) = 0.40235947810852507 + -0.5535743588970452i
    // Complex -> Test acoth(1 + i) = 0.4023594781085251 + -0.5535743588970452i
    // Octave  -> Test acoth(1 + i) = 0.402359478108525 + -0.553574358897045i
    // Wolfram -> 0.4023594781085251 - 0.5535743588970453i
    // C99     -> 0.4023594781085251 - 0.5535743588970453i
    expect(result.re).toBeCloseTo(0.4023594781085251, 15);
    expect(result.im).toBeCloseTo(-0.5535743588970453, 15);
  });

  // Test 8
  it("computes acoth(30 + i) correctly", () => {
    const z = new Complex(30, 1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(30 + i) = 0.03330860910584495 + -0.001111109282127047i
    // Complex -> Test acoth(30 + i) = 0.03330860910584494 + -0.001111109282127047i
    // Octave  -> Test acoth(30 + i) = 0.03330860910584493 + -0.001111109282127047i
    // Wolfram -> 0.03330860910584494 - 0.001111109282127047i
    // C99     -> 0.03330860910584494 - 0.001111109282127047i
    expect(result.re).toBeCloseTo(0.03330860910584494, 15);
    expect(result.im).toBeCloseTo(-0.001111109282127047, 15);
  });

  // Test 9
  it("computes acoth(-30 + i) correctly", () => {
    const z = new Complex(-30, 1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-30 + i) = -0.033308609105844975 + -0.0011111092821270473i
    // Complex -> Test acoth(-30 + i) = -0.03330860910584494 + -0.001111109282127047i
    // Octave  -> Test acoth(-30 + i) = -0.03330860910584494 + -0.001111109282127047i
    // Wolfram -> -0.03330860910584494 - 0.001111109282127047i
    // C99     -> -0.03330860910584494 - 0.001111109282127047i
    expect(result.re).toBeCloseTo(-0.03330860910584494, 15);
    expect(result.im).toBeCloseTo(-0.001111109282127047, 15);
  });

  // Test 10
  it("computes acoth(1 + 30i) correctly", () => {
    const z = new Complex(1, 30);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1 + 30i) = 0.0011086492669664437 + -0.03328408188791191i
    // Complex -> Test acoth(1 + 30i) = 0.0011086492669664366 + -0.033284081887911904i
    // Octave  -> Test acoth(1 + 30i) = 0.001108649266966437 + -0.0332840818879119i
    // Wolfram -> 0.0011086492669664365 - 0.0332840818879119i
    // C99     -> 0.0011086492669664365 - 0.0332840818879119i
    expect(result.re).toBeCloseTo(0.0011086492669664365, 15);
    expect(result.im).toBeCloseTo(-0.0332840818879119, 15);
  });

  // Test 11
  it("computes acoth(Infinity + i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(∞ + i) = NaN + NaNi    (not compliant with C99 std)
    // Complex -> Test acoth(∞ + i) = 0 + 0i
    // Octave  -> Test acoth(∞ + i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 12
  it("computes acoth(Infinity - i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, -1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(∞ - i) = NaN + NaNi    (not compliant with C99 std)
    // Complex -> Test acoth(∞ - i) = 0 + 0i
    // Octave  -> Test acoth(∞ - i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 13
  it("computes acoth(NaN + i) correctly", () => {
    const z = new Complex(NaN, 1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(NaN + i) = NaN + NaNi
    // Complex -> Test acoth(NaN + i) = NaN + NaNi
    // Octave  -> Test acoth(NaN + i) = NaN + NaNi
    // Wolfram -> NaN + NaNi
    // C99     -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 14
  it("computes acoth(1e-154 + 1e-154i) correctly", () => {
    const z = new Complex(1e-154, 1e-154);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1e-154 + 1e-154i) = 0 + 1.5707963267948966i    (real part not compliant with C99 std)
    // Complex -> Test acoth(1e-154 + 1e-154i) = 1e-154 + -1.5707963267948966i
    // Octave  -> Test acoth(1e-154 + 1e-154i) = 1e-154 + -1.570796326794897i
    // Wolfram -> 1e-154 - 1.5707963267948966i
    // C99     -> 1e-154 - 1.5707963267948966i
    expect(result.re).toBeCloseTo(1e-154, 15);
    expect(result.im).toBeCloseTo(-1.5707963267948966, 15);
  });

  // Test 15
  it("computes acoth(-Infinity + i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-∞ + i) = NaN + NaNi   (not compliant with C99 std)
    // Complex -> Test acoth(-∞ + i) = 0 + 0i
    // Octave  -> Test acoth(-∞ + i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 16
  it("computes acoth(-Infinity - i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, -1);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-∞ - i) = NaN + NaNi   (not compliant with C99 std)
    // Complex -> Test acoth(-∞ - i) = 0 + 0i
    // Octave  -> Test acoth(-∞ - i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 17
  it("computes acoth(1 + Infinity i) correctly", () => {
    const z = new Complex(1, Number.POSITIVE_INFINITY);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1 + ∞i) = NaN + NaNi   (not compliant with C99 std)
    // Complex -> Test acoth(1 + ∞i) = 0 + 0i
    // Octave  -> Test acoth(1 + ∞i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 18
  it("computes acoth(1 - Infinity i) correctly", () => {
    const z = new Complex(1, Number.NEGATIVE_INFINITY);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1 - ∞i) = NaN + NaNi   (not compliant with C99 std)
    // Complex -> Test acoth(1 - ∞i) = 0 + 0i
    // Octave  -> Test acoth(1 - ∞i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 19
  it("computes acoth(Infinity + Infinity i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(∞ + ∞i) = NaN + NaNi   (not compliant with C99 std)
    // Complex -> Test acoth(∞ + ∞i) = 0 + 0i
    // Octave  -> Test acoth(∞ + ∞i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 20
  it("computes acoth(Infinity - Infinity i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(∞ - ∞i) = NaN + NaNi   (not compliant with C99 std)
    // Complex -> Test acoth(∞ - ∞i) = 0 + 0i
    // Octave  -> Test acoth(∞ - ∞i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 21
  it("computes acoth(-Infinity + Infinity i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-∞ + ∞i) = NaN + NaNi    (not compliant with C99 std)
    // Complex -> Test acoth(-∞ + ∞i) = 0 + 0i
    // Octave  -> Test acoth(-∞ + ∞i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 22
  it("computes acoth(-Infinity - Infinity i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-∞ - ∞i) = NaN + NaNi    (not compliant with C99 std)
    // Complex -> Test acoth(-∞ - ∞i) = 0 + 0i
    // Octave  -> Test acoth(-∞ - ∞i) = 0 + 0i
    // Wolfram -> 0 + 0i
    // C99     -> 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 23
  it("computes acoth(Infinity + NaN i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, NaN);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(∞ + NaNi) = NaN + NaNi
    // Complex -> Test acoth(∞ + NaNi) = NaN + NaNi
    // Octave  -> Test acoth(∞ + NaNi) = 0 + 0i   (not compliant with C99 std)
    // Wolfram -> NaN + NaNi
    // C99     -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 24
  it("computes acoth(-Infinity + NaN i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, NaN);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-∞ + NaNi) = NaN + NaNi
    // Complex -> Test acoth(-∞ + NaNi) = NaN + NaNi
    // Octave  -> Test acoth(-∞ + NaNi) = 0 + 0i    (not compliant with C99 std)
    // Wolfram -> NaN + NaNi
    // C99     -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 25
  it("computes acoth(NaN + Infinity i) correctly", () => {
    const z = new Complex(NaN, Number.POSITIVE_INFINITY);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(NaN + ∞i) = NaN + NaNi
    // Complex -> Test acoth(NaN + ∞i) = NaN + NaNi
    // Octave  -> Test acoth(NaN + ∞i) = 0 + 0i   (not compliant with C99 std)
    // Wolfram -> NaN + NaNi
    // C99     -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 26
  it("computes acoth(NaN + NaN i) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(NaN + NaNi) = NaN + NaNi
    // Complex -> Test acoth(NaN + NaNi) = NaN + NaNi
    // Octave  -> Test acoth(NaN + NaNi) = NaN + NaNi
    // Wolfram -> NaN + NaNi
    // C99     -> NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 27
  it("computes acoth(1 + EPSILON i) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(1, ε);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1 + εi) = 18.36840028483855 + -0.7853981633974484i
    // Complex -> Test acoth(1 + εi) = 18.36840028483855 + -0.7853981633974484i
    // Octave  -> Test acoth(1 + εi) = 18.36840028483855 + -0.7853981633974484i
    // Wolfram -> 18.36840028483855 - 0.7853981633974483i
    // C99     -> 18.36840028483855 - 0.7853981633974483i
    expect(result.re).toBeCloseTo(18.36840028483855, 15);
    expect(result.im).toBeCloseTo(-0.7853981633974483, 15);
  });

  // Test 28
  it("computes acoth(-1 + EPSILON i) correctly", () => {
    const z = new Complex(-1, Number.EPSILON);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(-1 + εi) = -18.36840028483855 + -0.7853981633974484i
    // Complex -> Test acoth(-1 + εi) = -18.36840028483855 + -0.7853981633974484i
    // Octave  -> Test acoth(-1 + εi) = -18.36840028483855 + -0.7853981633974484i
    // Wolfram -> -18.36840028483855 - 0.7853981633974483i
    // C99     -> -18.36840028483855 - 0.7853981633974483i
    expect(result.re).toBeCloseTo(-18.36840028483855, 15);
    expect(result.im).toBeCloseTo(-0.7853981633974483, 15);
  });

  // Test 29 -> Number.MIN_VALUE = 5e-324
  it("computes acoth(Number.MIN_VALUE + Number.MIN_VALUE i) correctly", () => {
    const min = Number.MIN_VALUE;
    const z = new Complex(min, min);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(MIN_VALUE + MIN_VALUE i) <-> (MIN_VALUE = 5e-324) = NaN + NaNi
    // Complex -> Test acoth(MIN_VALUE + MIN_VALUE i) <-> (MIN_VALUE = 5e-324) = 5e-324 + -1.5707963267948966i
    // Octave  -> Test acoth(MIN_VALUE + MIN_VALUE i) <-> (MIN_VALUE = 5e-324) = 0 + -1.570796326794897i
    // Wolfram -> 5e-324 - 1.5707963267948966i   (C99 std)
    // C99     -> 5e-324 - 1.5707963267948966i
    expect(result.re).toBeCloseTo(5e-324, 15);
    expect(result.im).toBeCloseTo(-1.5707963267948966, 15);
  });

  // Test 30
  it("computes acoth(1 + 1e10i) correctly", () => {
    const z = new Complex(1, 1e10);
    const result = Complex.acoth(z);
    // mathjs  -> Test acoth(1 + 1e10i) = 0 + -1e-10i   (non C99 std)
    // Complex -> Test acoth(1 + 1e10i) = 1.0000000000000001e-20 + -1e-10i
    // Octave  -> Test acoth(1 + 1e10i) = 1e-20 + -1e-10i
    // Wolfram -> 1e-20 - 1e-10i
    // C99     -> 1e-20 - 1e-10i
    expect(result.re).toBeCloseTo(1e-20, 15);
    expect(result.im).toBeCloseTo(-1e-10, 15);
  });

  // Test 31
  it("verifies symmetry: acoth(-z) = -acoth(z) for z = 1 + 1i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const resultZ = Complex.acoth(z);
    const resultNegZ = Complex.acoth(negZ);
    // Wolfram -> true
    // mathjs  -> N/A
    // Octave  -> N/A
    // C99     -> true
    expect(resultNegZ.re).toBeCloseTo(-resultZ.re, 15);
    expect(resultNegZ.im).toBeCloseTo(-resultZ.im, 15);
  });
});
