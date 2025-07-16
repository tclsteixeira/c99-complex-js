/**
 * Test suite for Complex.asec(z), the inverse secant of a complex number.
 * Verifies C99 compliance (Annex G.6.2.1) using asec(z) = acos(1/z), ensuring
 * principal value Re(asec(z)) ∈ [0, π]. Covers real inputs (±1, ±2, 1.5, 0.5),
 * complex inputs (1 + 1i, 0 ± 1i, 1e-10 + 1e10i), infinities (±∞ + 0i, ∞ + 1i,
 * 1 + ∞i), NaN, near-singularities (±1 + εi), small inputs (1e-10 + 1e-10i), and
 * symmetry (asec(-z) = π - asec(z)). Numerical differences with Wolfram (e.g.,
 * Tests 8, 9, 11, 12, 18, 19, 20) are within double-precision tolerance (~2.22e-16).
 * Test 5 aligns with C99 (π/2 + ∞i) despite Wolfram’s ComplexInfinity.
 * @module ComplexAsecTests
 */

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.asec", () => {
  // Test Summary:
  // Test 1: asec(1 + 0i) → 0 + 0i, real input at boundary |z| = 1.
  // Test 2: asec(-1 + 0i) → π + 0i, real input at boundary |z| = 1.
  // Test 3: asec(2 + 0i) → acos(0.5) ≈ 1.0471975511965979 + 0i, real input |z| > 1.
  // Test 4: asec(-2 + 0i) → acos(-0.5) ≈ 2.0943951023931957 + 0i, real input |z| > 1.
  // Test 5: asec(0 + 0i) → π/2 + ∞i, C99-compliant singularity.
  // Test 6: asec(∞ + 0i) → π/2 + 0i, infinite real part.
  // Test 7: asec(-∞ + 0i) → π/2 + 0i, infinite real part.
  // Test 8: asec(0.5 + 0i) → 0 + 1.3169578969248166i, real input |z| < 1.
  // Test 9: asec(1 + 1i) → 1.118517879643706 + 0.5306375309525178i, complex input.
  // Test 10: asec(NaN + NaNi) → NaN + NaNi, undefined input.
  // Test 11: asec(1 + εi) → ~1.4901161193847655e-8 + 1.4901161193847656e-8i, near singularity.
  // Test 12: asec(-1 + εi) → ~π - 1.4901161193847655e-8 + 1.4901161193847656e-8i, near singularity.
  // Test 13: asec(1e-10 + 1e-10i) → 0.7853981633974483 + 23.37242452022043i, small complex input.
  // Test 14: asec(∞ + 1i) → π/2 + 0i, infinite real part.
  // Test 15: asec(1 + ∞i) → π/2 + 0i, infinite imaginary part.
  // Test 16: Verifies symmetry asec(-z) = π - asec(z) for z = 1 + 1i.
  // Test 17: asec(1.5 + 0i) → acos(1/1.5) ≈ 0.8410686705679303 + 0i, real input |z| > 1.
  // Test 18: asec(0 + 1i) → π/2 + 0.8813735870195429i, purely imaginary input.
  // Test 19: asec(0 - 1i) → π/2 - 0.8813735870195429i, purely imaginary input.
  // Test 20: asec(1e-10 + 1e10i) → π/2 + 1e-10i, large imaginary part.
  // Test 21: asec(-1 + 1i) → ~2.023074773946087 + 0.5306375309525178i, complex input for symmetry.

  // Test 1: Real input, x = 1
  it("computes asec(1 + 0i) correctly", () => {
    const z = new Complex(1, 0);
    const result = Complex.asec(z);
    // Wolfram asec(1 + 0i) = 0
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Real input, x = -1
  it("computes asec(-1 + 0i) correctly", () => {
    const z = new Complex(-1, 0);
    const result = Complex.asec(z);
    // Wolfram asec(-1 + 0i) = PI
    expect(result.re).toBeCloseTo(Math.PI, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Real input, x = 2
  it("computes asec(2 + 0i) correctly", () => {
    const z = new Complex(2, 0);
    const result = Complex.asec(z);
    // Wolfram asec(2 + 0i) ≈ 1.04719755119659774615421446109316762806572313312503527365831486410260546876
    expect(result.re).toBeCloseTo(Math.acos(0.5), 15); // ≈ 1.0471975511965979
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 4: Real input, x = -2
  it("computes asec(-2 + 0i) correctly", () => {
    const z = new Complex(-2, 0);
    const result = Complex.asec(z);
    // Wolfram asec(-2 + 0i) ≈ 2.09439510239319549230842892218633525613144626625007054731662972820521093752
    expect(result.re).toBeCloseTo(Math.acos(-0.5), 15); // ≈ 2.0943951023931957
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 5: Real input, x = 0
  it("computes asec(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.asec(z);
    // Wolfram asec(0 + 0i) = ∞^~ (ComplexInfinity); C99: π/2 + ∞i
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(Number.POSITIVE_INFINITY, 15);
  });

  // Test 6: Real input, x = ∞
  it("computes asec(∞ + 0i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 0);
    const result = Complex.asec(z);
    // Wolfram asec(∞ + 0i) = π/2
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 7: Real input, x = -∞
  it("computes asec(-∞ + 0i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 0);
    const result = Complex.asec(z);
    // Wolfram asec(-∞ + 0i) = π/2
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 8: Complex input, z = 0.5 + 0i
  it("computes asec(0.5 + 0i) correctly", () => {
    const z = new Complex(0.5, 0);
    const result = Complex.asec(z);
    // Wolfram asec(0.5 + 0i) ≈ 0 + 1.31695789692481670862504634730796844402698197146751647976847225692046019i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(1.3169578969248167086, 15);
  });

  // Test 9: Complex input, z = 1 + 1i
  it("computes asec(1 + 1i) correctly", () => {
    const z = new Complex(1, 1);
    const result = Complex.asec(z);
    // Wolfram asec(1 + 1i) ≈ 1.11851787964370593716766329380877208138303741920675037665947306947894359 +
    // 0.530637530952517826016509458106786742903392749469316848198605140756430430i
    expect(result.re).toBeCloseTo(1.118517879643705937, 15);
    expect(result.im).toBeCloseTo(0.530637530952517826, 15);
  });

  // Test 10: NaN input
  it("computes asec(NaN + NaNi) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.asec(z);
    // Wolfram asec(NaN + NaNi) = ? + ?i; C99: NaN + NaNi
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 11: Near singularity, z = 1 + εi
  it("computes asec(1 + εi) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(1, ε);
    const result = Complex.asec(z);
    // Wolfram asec(1 + εi) ≈ 1.490116119384765735735595425504584957514620950306643950235832070058e-8 +
    // 1.490116119384765460008724574495375059354678433978635996847994458937e-8i
    expect(result.re).toBeCloseTo(1.4901161193847657e-8, 15);
    expect(result.im).toBeCloseTo(1.49011611938476546e-8, 15);
  });

  // Test 12: Near singularity, z = -1 + εi
  it("computes asec(-1 + εi) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(-1, ε);
    const result = Complex.asec(z);
    // Wolfram asec(-1 + εi) ≈ 3.14159263868863204461499 + 1.49011611938476546000872e-8i
    expect(result.re).toBeCloseTo(3.14159263868863204461499, 15);
    expect(result.im).toBeCloseTo(1.49011611938476546e-8, 15);
  });

  // Test 13: Small complex input
  it("computes asec(1e-10 + 1e-10i) correctly", () => {
    const z = new Complex(1e-10, 1e-10);
    const result = Complex.asec(z);
    // Wolfram asec(1e-10 + 1e-10i) ≈ 0.785398163397448309620660845819875721049292349843776455243735731410287434 +
    // 23.3724245202204294948885306075727303600488024534678573873936190144224229i
    expect(result.re).toBeCloseTo(0.7853981633974483096, 15);
    expect(result.im).toBeCloseTo(23.37242452022042949, 15);
  });

  // Test 14: Infinity + finite i
  it("computes asec(∞ + 1i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.asec(z);
    // Wolfram asec(∞ + 1i) = π/2
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 15: Finite + ∞i
  it("computes asec(1 + ∞i) correctly", () => {
    const z = new Complex(1, Number.POSITIVE_INFINITY);
    const result = Complex.asec(z);
    // Wolfram asec(1 + ∞i) = π/2
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 16: Symmetry check for z = 1 + 1i
  it("verifies asec(-z) = π - asec(z) for z = 1 + 1i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const resultZ = Complex.asec(z);
    const resultNegZ = Complex.asec(negZ);
    // asec(1 + 1i) ≈ 1.118517879643705937 + 0.530637530952517826i
    // asec(-1 - 1i) ≈ π - 1.118517879643705937 - 0.530637530952517826i
    expect(resultNegZ.re).toBeCloseTo(Math.PI - resultZ.re, 15);
    expect(resultNegZ.im).toBeCloseTo(-resultZ.im, 15);
  });

  // Test 17: Real input, x = 1.5
  it("computes asec(1.5 + 0i) correctly", () => {
    const z = new Complex(1.5, 0);
    const result = Complex.asec(z);
    // Wolfram asec(1.5 + 0i) ≈ 0.84106867056793025577652503182643074670207878563983921977852280469208930
    expect(result.re).toBeCloseTo(Math.acos(1 / 1.5), 15); // ≈ 0.8410686705679303
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 18: Complex input, z = 0 + 1i
  it("computes asec(0 + 1i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.asec(z);
    // Wolfram asec(0 + 1i) ≈ π/2 + 0.881373587019543025232609324979792309028160328261635410753295608653377184i
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(0.881373587019543, 15);
  });

  // Test 19: Complex input, z = 0 - 1i
  it("computes asec(0 - 1i) correctly", () => {
    const z = new Complex(0, -1);
    const result = Complex.asec(z);
    // Wolfram asec(0 - 1i) ≈ π/2 - 0.881373587019543025232609324979792309028160328261635410753295608653377184i
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(-0.881373587019543, 15);
  });

  // Test 20: Large imaginary
  it("computes asec(1e-10 + 1e10i) correctly", () => {
    const z = new Complex(1e-10, 1e10);
    const result = Complex.asec(z);
    // Wolfram asec(1e-10 + 1e10i) ≈ π/2 + 9.9999999999999999999833333333333333333324083333333333333333428869e-11i
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(9.99999999999999999998e-11, 15);
  });

  // Test 21: Complex input, z = -1 + 1i
  it("computes asec(-1 + 1i) correctly", () => {
    const z = new Complex(-1, 1);
    const result = Complex.asec(z);
    // Wolfram asec(-1 + 1i) ≈ 2.023074773946087301423980089770730802810547280468805243929471237828649955 +
    // 0.530637530952517826016509458106786742903392749469316848198605140756430430i
    expect(result.re).toBeCloseTo(2.023074773946087301, 15);
    expect(result.im).toBeCloseTo(0.530637530952517826, 15);
  });
});

/*
import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.asec", () => {
  // Test 1: Real input, x = 1
  it("computes asec(1 + 0i) correctly", () => {
    const z = new Complex(1, 0);
    const result = Complex.asec(z);
    // Wolfram asec(1 + 0i) = 0
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 2: Real input, x = -1
  it("computes asec(-1 + 0i) correctly", () => {
    const z = new Complex(-1, 0);
    const result = Complex.asec(z);
    // Wolfram asec(-1 + 0i) = PI
    //      3.14159265358979323846264338327950288419716939937510582097494459230781640628...
    expect(result.real).toBeCloseTo(Math.PI, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 3: Real input, x = 2
  it("computes asec(2 + 0i) correctly", () => {
    const z = new Complex(2, 0);
    const result = Complex.asec(z);
    // Wolfram asec(2 + 0i) =
    //      1.04719755119659774615421446109316762806572313312503527365831486410260546876...
    expect(result.real).toBeCloseTo(Math.acos(0.5), 15); // ≈ 1.0471975511965976
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 4: Real input, x = -2
  it("computes asec(-2 + 0i) correctly", () => {
    const z = new Complex(-2, 0);
    const result = Complex.asec(z);
    // Wolfram asec(-2 + 0i) =
    //      2.09439510239319549230842892218633525613144626625007054731662972820521093752...
    expect(result.real).toBeCloseTo(Math.acos(-0.5), 15); // ≈ 2.0943951023931953
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 5: Real input, x = 0
  it("computes asec(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.asec(z);
    // Wolfram asec(0 + 0i) =
    //      ∞^~  -> ComplexInfinity
    expect(result.real).toBeCloseTo(Math.PI / 2, 15); // C99 standard
    expect(result.imag).toBeCloseTo(Number.POSITIVE_INFINITY, 15);
  });

  // Test 6: Real input, x = ∞
  it("computes asec(∞ + 0i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 0);
    const result = Complex.asec(z);
    // Wolfram asec(∞ + 0i) =
    //      π/2 -> is a transcendental number
    expect(result.real).toBeCloseTo(Math.PI / 2, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 7: Real input, x = -∞
  it("computes asec(-∞ + 0i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 0);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      π/2 -> is a transcendental number
    expect(result.real).toBeCloseTo(Math.PI / 2, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 8: Complex input, z = 0.5 + 0i
  it("computes asec(0.5 + 0i) correctly", () => {
    const z = new Complex(0.5, 0);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      1.31695789692481670862504634730796844402698197146751647976847225692046019... i
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(1.3169578969248167086, 15); //  1.3169578969248167086
  });

  // Test 9: Complex input, z = 1 + 1i
  it("computes asec(1 + 1i) correctly", () => {
    const z = new Complex(1, 1);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      1.11851787964370593716766329380877208138303741920675037665947306947894359... +
    //      0.530637530952517826016509458106786742903392749469316848198605140756430430... i
    expect(result.real).toBeCloseTo(1.118517879643705937, 15);
    expect(result.imag).toBeCloseTo(0.530637530952517826, 15);
  });

  // Test 10: NaN input
  it("computes asec(NaN + NaNi) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.asec(z);
    expect(result.real).toBeNaN();
    expect(result.imag).toBeNaN();
  });

  // Test 11: Near singularity, z = 1 + εi
  it("computes asec(1 + εi) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(1, ε);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      1.490116119384765735735595425504584957514620950306643950235832070058... × 10^-8 +
    //      1.490116119384765460008724574495375059354678433978635996847994458937... × 10^-8 i
    expect(result.real).toBeCloseTo(1.4901161193847657e-8, 15);
    expect(result.imag).toBeCloseTo(1.49011611938476546e-8, 15);
  });

  // Test 12: Near singularity, z = -1 + εi
  it("computes asec(-1 + εi) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(-1, ε);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      3.14159263868863204461499... +
    //      1.49011611938476546000872... × 10^-8 i
    expect(result.real).toBeCloseTo(3.14159263868863204461499, 15);
    expect(result.imag).toBeCloseTo(1.49011611938476546e-8, 15);
  });

  // Test 13: Small complex input
  it("computes asec(1e-10 + 1e-10i) correctly", () => {
    const z = new Complex(1e-10, 1e-10);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      0.785398163397448309620660845819875721049292349843776455243735731410287434... +
    //      23.3724245202204294948885306075727303600488024534678573873936190144224229... i
    expect(result.real).toBeCloseTo(0.7853981633974483096, 15);
    expect(result.imag).toBeCloseTo(23.37242452022042949, 15); // ≈ ln(1e10)
  });

  // Test 14: Infinity + finite i
  it("computes asec(∞ + 1i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //     (PI / 2) 1.57079632679489661923132169163975144209858469968755291048747229615390820314...
    expect(result.real).toBeCloseTo(Math.PI / 2, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 15: Finite + ∞i
  it("computes asec(1 + ∞i) correctly", () => {
    const z = new Complex(1, Number.POSITIVE_INFINITY);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      π/2
    expect(result.real).toBeCloseTo(Math.PI / 2, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 16: Symmetry check
  it("verifies asec(-z) = π - asec(z) for z = 1 + 1i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const resultZ = Complex.asec(z);
    const resultNegZ = Complex.asec(negZ);
    expect(resultNegZ.real).toBeCloseTo(Math.PI - resultZ.real, 15);
    expect(resultNegZ.imag).toBeCloseTo(-resultZ.imag, 15);
  });

  // Test 17: Real input, x = 1.5
  it("computes asec(1.5 + 0i) correctly", () => {
    const z = new Complex(1.5, 0);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      0.84106867056793025577652503182643074670207878563983921977852280469208930...
    expect(result.real).toBeCloseTo(Math.acos(1 / 1.5), 15); // ≈ 0.8410686705679303
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 18: Complex input, z = 0 + 1i
  it("computes asec(0 + 1i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      1.57079632679489661923132169163975144209858469968755291048747229615390820... +
    //      0.881373587019543025232609324979792309028160328261635410753295608653377184... i
    expect(result.real).toBeCloseTo(Math.PI / 2, 15);
    expect(result.imag).toBeCloseTo(0.881373587019543, 15); // acos(-i)
  });

  // Test 19: Complex input, z = 0 - 1i
  it("computes asec(0 - 1i) correctly", () => {
    const z = new Complex(0, -1);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      1.57079632679489661923132169163975144209858469968755291048747229615390820... -
    //      0.881373587019543025232609324979792309028160328261635410753295608653377184... i
    expect(result.real).toBeCloseTo(Math.PI / 2, 15);
    expect(result.imag).toBeCloseTo(-0.881373587019543, 15);
  });

  // Test 20: Large imaginary
  it("computes asec(1e-10 + 1e10i) correctly", () => {
    const z = new Complex(1e-10, 1e10);
    const result = Complex.asec(z);
    // Wolfram asec() =
    //      1.57079632679489661923132169163875144209858469968755791048747229615... +
    //      9.9999999999999999999833333333333333333324083333333333333333428869... × 10^-11 i
    expect(result.real).toBeCloseTo(Math.PI / 2, 15);
    expect(result.imag).toBeCloseTo(9.99999999999999999998e-11, 15);
  });
});
*/
