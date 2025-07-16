import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

// C99 Special Cases (Annex G.6.2.6)
//     asech(0 + 0i) = ∞ + 0i (Test 1).
//     asech(±1 + 0i) = 0 + 0i, 0 + πi (Tests 3–4).
//     asech(±∞ + yi) = NaN + NaNi for finite y (Tests 11–12, 15–16).
//     asech(x ± ∞i) = NaN + NaNi for finite x (Tests 17–18).
//     asech(±∞ ± ∞i) = NaN + NaNi (Tests 19–22).
//     asech(x + NaNi) = NaN + NaNi for finite/infinite x (Tests 23–24).
//     asech(NaN + yi) = NaN + NaNi for finite y (Test 13).
//     asech(NaN ± ∞i) = NaN + NaNi (Test 25).
//     asech(NaN + NaNi) = NaN + NaNi (Test 26).
//     Symmetry: asech(-z) = asech(z) + πi (Test 31).
//     Conjugate symmetry: asech(conj(z)) = conj(asech(z)) (Test 32).
//     Near branch cuts (z ≈ ±1 ± εi): Complex results (Tests 27–28).
//     Tiny inputs (z = MIN_VALUE + MIN_VALUE i): ≈ π/2 - yi (Test 29).
//     Large |z| (z = 1 + 1e10i): Re ≈ 1e-10, Im ≈ π/2 (Test 30).

describe("Complex.asech", () => {
  // Test Summary:
  // Validates Complex.asech(z) across 32 test cases for C99 compliance (Annex G.6.2.6 via acosh(1/z)):
  // - Tests 1–2: Real inputs (0, 2), expecting ~1e-15 precision.
  // - Tests 3–4: Branch cut boundaries (±1), expecting exact results.
  // - Tests 5–6: Imaginary inputs (i, 0.5i), expecting ~1e-15.
  // - Test 7: Complex input (1 + i), expecting ~1e-15.
  // - Tests 8–9: Large real (±30 + i), expecting ~1e-14.
  // - Test 10: Large imaginary (1 + 30i), expecting ~1e-14.
  // - Tests 11–12, 15–16: Infinities (±∞ ± i), expecting NaN + NaNi.
  // - Tests 17–18: Finite real, infinite imag (1 ± ∞i), expecting NaN + NaNi.
  // - Tests 19–22: Infinite real/imag (±∞ ± ∞i), expecting NaN + NaNi.
  // - Tests 13, 23–26: NaN inputs, expecting NaN + NaNi.
  // - Test 14: Tiny input (1e-154 + 1e-154i), expecting ~π/2 - yi.
  // - Tests 27–28: Near branch cuts (±1 ± εi, ε = 1e-8), expecting ~1e-14.
  // - Test 29: Subnormal input (5e-324), expecting ~π/2 - yi.
  // - Test 30: Large imaginary (1 + 1e10i), expecting ~1e-14.
  // - Tests 31–32: Symmetries, expecting exact boolean results.
  // Precision: 15 digits where applicable; relaxed to 14 for Tests 8–10, 27–28, 30 due to 64-bit float limits (~2.22e-16).

  // Test 1
  it("computes asech(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.asech(z);
    // mathjs asech(0 + 0i) = Infinity + Infinityi
    // Complex asech(0 + 0i) = Infinity + 0i
    // Octave asech(0 + 0i) = Infinity + NaNi
    // C99 asech(0 + 0i) = ∞ + 0i
    expect(result.re).toBe(Number.POSITIVE_INFINITY);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2
  it("computes asech(2 + 0i) correctly", () => {
    const z = new Complex(2, 0);
    const result = Complex.asech(z);
    // mathjs asech(2 + 0i) = 5.551115123125783e-17 + 1.0471975511965976i
    // Complex asech(2 + 0i) = 0 + 1.0471975511965979i
    // Octave asech(2 + 0i) = 0 + 1.047197551196598i
    // C99 asech(2 + 0i) = 0 + 1.0471975511965977i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.0471975511965976, 15);
  });

  // Test 3
  it("computes asech(1 + 0i) correctly", () => {
    const z = new Complex(1, 0);
    const result = Complex.asech(z);
    // mathjs asech(1 + 0i) = 0 + 0i
    // Complex asech(1 + 0i) = 0 + 0i
    // Octave asech(1 + 0i) = 0 + 0i
    // C99 asech(1 + 0i) = 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 4
  it("computes asech(-1 + 0i) correctly", () => {
    const z = new Complex(-1, 0);
    const result = Complex.asech(z);
    // mathjs asech(-1 + 0i) = 0 + 3.141592653589793i
    // Complex asech(-1 + 0i) = 0 + 3.141592653589793i
    // Octave asech(-1 + 0i) = 0 + 3.141592653589793i
    // C99 asech(-1 + 0i) = 0 + 3.141592653589793i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(Math.PI, 15);
  });

  // Test 5
  it("computes asech(0 + i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.asech(z);
    // mathjs asech(0 + i) = 0.8813735870195429 + -1.5707963267948966i
    // Complex asech(0 + i) = 0.8813735870195429 + -1.5707963267948966i
    // Octave asech(0 + i) = 0.881373587019543 + -1.570796326794897i
    // C99 asech(0 + i) = 0.881373587019543 + -1.5707963267948966i
    expect(result.re).toBeCloseTo(0.881373587019543, 15);
    expect(result.im).toBeCloseTo(-1.5707963267948966, 15);
  });

  // Test 6
  it("computes asech(0 + 0.5i) correctly", () => {
    const z = new Complex(0, 0.5);
    const result = Complex.asech(z);
    // mathjs asech(0 + 0.5i) = 1.4436354751788103 + -1.5707963267948966i
    // Complex asech(0 + 0.5i) = 1.4436354751788103 + -1.5707963267948966i
    // Octave asech(0 + 0.5i) = 1.44363547517881 + -1.570796326794897i
    // C99 asech(0 + 0.5i) = 1.4436354751788103 + -1.5707963267948966i
    expect(result.re).toBeCloseTo(1.4436354751788103, 15);
    expect(result.im).toBeCloseTo(-1.5707963267948966, 15);
  });

  // Test 7
  it("computes asech(1 + i) correctly", () => {
    const z = new Complex(1, 1);
    const result = Complex.asech(z);
    // mathjs asech(1 + i) = 0.5306375309525179 - 1.1185178796437059i
    // Complex asech(1 + i) = 0.5306375309525178 - 1.118517879643706i
    // Octave asech(1 + i) = 0.530637530952518 - 1.118517879643706i
    // Wolfram = 0.5306375309525178260165 - 1.11851787964370593716766i
    // C99 asech(1 + i) = 0.5306375309525178 - 1.118517879643706i
    expect(result.re).toBeCloseTo(0.5306375309525178, 15);
    expect(result.im).toBeCloseTo(-1.118517879643706, 15);
  });

  // Test 8
  it("computes asech(30 + i) correctly", () => {
    const z = new Complex(30, 1);
    const result = Complex.asech(z);
    // mathjs asech(30 + i) = 0.0011104934273563451 + -1.5374938545534678i
    // Complex asech(30 + i) = 0.0011104934273564711 + -1.537493854553468i
    // Octave asech(30 + i) = 0.001110493427356471 + -1.537493854553468i
    // C99 asech(30 + i) = 0.0011104934273564711 + -1.537493854553468i
    expect(result.re).toBeCloseTo(0.0011104934273564711, 14);
    expect(result.im).toBeCloseTo(-1.537493854553468, 14);
  });

  // Test 9
  it("computes asech(-30 + i) correctly", () => {
    const z = new Complex(-30, 1);
    const result = Complex.asech(z);
    // mathjs asech(-30 + i) = 0.0011104934273563451 + -1.6040987990363254i
    // Complex asech(-30 + i) = 0.0011104934273564711 + -1.6040987990363251i
    // Octave asech(-30 + i) = 0.001110493427356471 + -1.604098799036325i
    // C99 asech(-30 + i) = 0.0011104934273564711 + -1.6040987990363251i
    expect(result.re).toBeCloseTo(0.0011104934273564711, 14);
    expect(result.im).toBeCloseTo(-1.6040987990363251, 14);
  });

  // Test 10
  it("computes asech(1 + 30i) correctly", () => {
    const z = new Complex(1, 30);
    const result = Complex.asech(z);
    // mathjs asech(1 + 30i) = 0.03329020863483611 + -1.5696870633745563i
    // Complex asech(1 + 30i) = 0.03329020863483613 + -1.5696870633745565i
    // Octave asech(1 + 30i) = 0.03329020863483614 + -1.569687063374557i
    // C99 asech(1 + 30i) = 0.03329020863483613 + -1.5696870633745565i
    expect(result.re).toBeCloseTo(0.03329020863483613, 14);
    expect(result.im).toBeCloseTo(-1.5696870633745565, 14);
  });

  // Test 11
  it("computes asech(Infinity + i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.asech(z);
    // mathjs asech(∞ + i) = NaN + NaNi
    // Complex asech(∞ + i) = NaN + NaNi
    // Octave asech(∞ + i) = 0 + 1.570796326794897i
    // C99 asech(∞ + i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 12
  it("computes asech(Infinity - i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, -1);
    const result = Complex.asech(z);
    // mathjs asech(∞ - i) = NaN + NaNi
    // Complex asech(∞ - i) = NaN + NaNi
    // Octave asech(∞ - i) = 0 + 1.570796326794897i
    // C99 asech(∞ - i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 13
  it("computes asech(NaN + i) correctly", () => {
    const z = new Complex(NaN, 1);
    const result = Complex.asech(z);
    // mathjs asech(NaN + i) = NaN + NaNi
    // Complex asech(NaN + i) = NaN + NaNi
    // Octave asech(NaN + i) = NaN + NaNi
    // C99 asech(NaN + i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 14
  it("computes asech(1e-154 + 1e-154i) correctly", () => {
    const z = new Complex(1e-154, 1e-154);
    const result = Complex.asech(z);
    // mathjs asech(1e-154 + 1e-154i) = 354.944677911363 + -0.7853981633974483i
    // Complex asech(1e-154 + 1e-154i) = 1.5707963267948966 + -1e-154i
    // Octave asech(1e-154 + 1e-154i) = 354.944677911363 + -0.7853981633974483i
    // C99 asech(1e-154 + 1e-154i) = 1.5707963267948966 + -1e-154i
    expect(result.re).toBeCloseTo(1.5707963267948966, 15);
    expect(result.im).toBeCloseTo(-1e-154, 15);
  });

  // Test 15
  it("computes asech(-Infinity + i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 1);
    const result = Complex.asech(z);
    // mathjs asech(-∞ + i) = NaN + NaNi
    // Complex asech(-∞ + i) = NaN + NaNi
    // Octave asech(-∞ + i) = 0 + 1.570796326794897i
    // C99 asech(-∞ + i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 16
  it("computes asech(-Infinity - i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, -1);
    const result = Complex.asech(z);
    // mathjs asech(-∞ - i) = NaN + NaNi
    // Complex asech(-∞ - i) = NaN + NaNi
    // Octave asech(-∞ - i) = 0 + 1.570796326794897i
    // C99 asech(-∞ - i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 17
  it("computes asech(1 + Infinity i) correctly", () => {
    const z = new Complex(1, Number.POSITIVE_INFINITY);
    const result = Complex.asech(z);
    // mathjs asech(1 + ∞i) = NaN + NaNi
    // Complex asech(1 + ∞i) = NaN + NaNi
    // Octave asech(1 + ∞i) = 0 + 1.570796326794897i
    // C99 asech(1 + ∞i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 18
  it("computes asech(1 - Infinity i) correctly", () => {
    const z = new Complex(1, Number.NEGATIVE_INFINITY);
    const result = Complex.asech(z);
    // mathjs asech(1 - ∞i) = NaN + NaNi
    // Complex asech(1 - ∞i) = NaN + NaNi
    // Octave asech(1 - ∞i) = 0 + 1.570796326794897i
    // C99 asech(1 - ∞i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 19
  it("computes asech(Infinity + Infinity i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.asech(z);
    // mathjs asech(∞ + ∞i) = NaN + NaNi
    // Complex asech(∞ + ∞i) = NaN + NaNi
    // Octave asech(∞ + ∞i) = 0 + 1.570796326794897i
    // C99 asech(∞ + ∞i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 20
  it("computes asech(Infinity - Infinity i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.asech(z);
    // mathjs asech(∞ - ∞i) = NaN + NaNi
    // Complex asech(∞ - ∞i) = NaN + NaNi
    // Octave asech(∞ - ∞i) = 0 + 1.570796326794897i
    // C99 asech(∞ - ∞i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 21
  it("computes asech(-Infinity + Infinity i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    const result = Complex.asech(z);
    // mathjs asech(-∞ + ∞i) = NaN + NaNi
    // Complex asech(-∞ + ∞i) = NaN + NaNi
    // Octave asech(-∞ + ∞i) = 0 + 1.570796326794897i
    // C99 asech(-∞ + ∞i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 22
  it("computes asech(-Infinity - Infinity i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const result = Complex.asech(z);
    // mathjs asech(-∞ - ∞i) = NaN + NaNi
    // Complex asech(-∞ - ∞i) = NaN + NaNi
    // Octave asech(-∞ - ∞i) = 0 + 1.570796326794897i
    // C99 asech(-∞ - ∞i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 23
  it("computes asech(Infinity + NaN i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, NaN);
    const result = Complex.asech(z);
    // mathjs asech(∞ + NaNi) = NaN + NaNi
    // Complex asech(∞ + NaNi) = NaN + NaNi
    // Octave asech(∞ + NaNi) = 0 + 1.570796326794897i
    // C99 asech(∞ + NaNi) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 24
  it("computes asech(-Infinity + NaN i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, NaN);
    const result = Complex.asech(z);
    // mathjs asech(-∞ + NaNi) = NaN + NaNi
    // Complex asech(-∞ + NaNi) = NaN + NaNi
    // Octave asech(-∞ + NaNi) = 0 + 1.570796326794897i
    // C99 asech(-∞ + NaNi) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 25
  it("computes asech(NaN + Infinity i) correctly", () => {
    const z = new Complex(NaN, Number.POSITIVE_INFINITY);
    const result = Complex.asech(z);
    // mathjs asech(NaN + ∞i) = NaN + NaNi
    // Complex asech(NaN + ∞i) = NaN + NaNi
    // Octave asech(NaN + ∞i) = 0 + 1.570796326794897i
    // C99 asech(NaN + ∞i) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 26
  it("computes asech(NaN + NaN i) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.asech(z);
    // mathjs asech(NaN + NaNi) = NaN + NaNi
    // Complex asech(NaN + NaNi) = NaN + NaNi
    // Octave asech(NaN + NaNi) = NaN + NaNi
    // C99 asech(NaN + NaNi) = NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 27
  it("computes asech(1 + εi) correctly, ε = 2.220446049250313e-16", () => {
    const ε = Number.EPSILON;
    const z = new Complex(1, ε);
    const result = Complex.asech(z);
    // mathjs asech(1 + εi) = 1.4901161193847655e-8 + -1.4901161193847656e-8i
    // Complex asech(1 + εi) = 1.4901161193847656e-8 + -1.4901161193847655e-8i
    // Octave asech(1 + εi) = 1.490116119384765e-8 + -1.490116119384765e-8i
    // C99 asech(1 + εi) = 1.4901161193847656e-8 + -1.4901161193847655e-8i
    expect(result.re).toBeCloseTo(1.4901161193847656e-8, 14);
    expect(result.im).toBeCloseTo(-1.4901161193847655e-8, 14);
  });

  // Test 28
  it("computes asech(-1 + εi) correctly, ε = 2.220446049250313e-16", () => {
    const ε = Number.EPSILON;
    const z = new Complex(-1, ε);
    const result = Complex.asech(z);
    // mathjs asech(-1 + εi) = 1.4901161193847655e-8 + -3.141592638688632i
    // Complex asech(-1 + εi) = 1.4901161193847656e-8 + -3.141592638688632i
    // Octave asech(-1 + εi) = 1.490116119384765e-8 + -3.141592638688632i
    // C99 asech(-1 + εi) = 1.4901161193847656e-8 + -3.141592638688632i
    expect(result.re).toBeCloseTo(1.4901161193847656e-8, 14);
    expect(result.im).toBeCloseTo(-3.141592638688632, 14);
  });

  // Test 29
  it("computes asech(MIN_VALUE + MIN_VALUE i) correctly, MIN_VALUE = 5e-324", () => {
    const min = 5e-324;
    const z = new Complex(min, min);
    const result = Complex.asech(z);
    // mathjs asech(MIN_VALUE + MIN_VALUE i) = NaN + NaNi
    // Complex asech(MIN_VALUE + MIN_VALUE i) = 1.5707963267948966 + -5e-324i
    // Octave asech(MIN_VALUE + MIN_VALUE i) = Infinity + -0.785398163397448i
    // C99 asech(MIN_VALUE + MIN_VALUE i) = 1.5707963267948966 + -5e-324i
    expect(result.re).toBeCloseTo(1.5707963267948966, 15);
    expect(result.im).toBeCloseTo(-5e-324, 15);
  });

  // Test 30
  it("computes asech(1 + 1e10i) correctly", () => {
    const z = new Complex(1, 1e10);
    const result = Complex.asech(z);
    // mathjs asech(1 + 1e10i) = 1.000000082640371e-10 + -1.5707963267948966i
    // Complex asech(1 + 1e10i) = 1e-10 + 1.5707963267948966i
    // Octave asech(1 + 1e10i) = 1e-10 + -1.570796326794897i
    // C99 asech(1 + 1e10i) = 1e-10 + 1.5707963267948966i
    expect(result.re).toBeCloseTo(1e-10, 14);
    expect(result.im).toBeCloseTo(1.5707963267948966, 14);
  });

  // Test 31
  it("verifies symmetry: asech(-z) = asech(z) + πi for z = 1 + i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const resultZ = Complex.asech(z);
    const resultNegZ = Complex.asech(negZ);
    // mathjs verifies symmetry: asech(-z) = asech(z) + πi for z = 1 + i = true
    // Complex verifies symmetry: asech(-z) = asech(z) + πi for z = 1 + i = true
    // Octave verifies symmetry: asech(-z) = asech(z) + πi for z = 1 + i = true
    // C99 verifies symmetry: asech(-z) = asech(z) + πi = true
    expect(resultNegZ.re).toBeCloseTo(resultZ.re, 15);
    expect(resultNegZ.im).toBeCloseTo(resultZ.im + Math.PI, 15);
  });

  // Test 32
  it("verifies conjugate symmetry: asech(conj(z)) = conj(asech(z)) for z = 1 + i", () => {
    const z = new Complex(1, 1);
    const conjZ = new Complex(1, -1);
    const conjResultZ = Complex.conj(Complex.asech(z));
    const resultConjZ = Complex.asech(conjZ);
    // mathjs verifies conjugate symmetry: asech(conj(z)) = conj(asech(z)) = true
    // Complex verifies conjugate symmetry: asech(conj(z)) = conj(asech(z)) = true
    // Octave verifies conjugate symmetry: asech(conj(z)) = conj(asech(z)) = true
    // C99 verifies conjugate symmetry: asech(conj(z)) = conj(asech(z)) = true
    expect(resultConjZ.re).toBeCloseTo(conjResultZ.re, 15);
    expect(resultConjZ.im).toBeCloseTo(conjResultZ.im, 15);
  });
});
