import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex.atan", () => {
  // Summary
  // Test 1: Zero input
  // Test 2: Real input
  // Test 3: Imaginary input
  // Test 4: Complex input
  // Test 5: NaN input
  // Test 6: Infinity + finite i
  // Test 7: Near-zero input
  // Test 8: Negative infinity + finite i
  // Test 9: Infinity + large finite i
  // Test 10: NaN + NaN i
  // Test 11: Singularity at z = i
  // Test 12: Near-singularity
  // Test 13: Precision stress
  // Test 14: Symmetry check
  // Test 15: Finite + Infinity i
  // Test 16: Singularity at z = -i
  // Test 17: Infinity + Infinity i
  // Test 18: Near-Zero Real, Large Imaginary
  // Test 19: Negative Large Imaginary
  // Test 20: Small Real, Near-Singularity Imaginary

  // Test 1: Zero input
  it("computes atan(0 + 0i) correctly", () => {
    const z = new Complex(0, 0);
    const result = Complex.atan(z);
    // C99: atan(0 + 0i) = 0 + 0i
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 2: Real input
  it("computes atan(1 + 0i) correctly", () => {
    const z = new Complex(1, 0);
    const result = Complex.atan(z);
    // Wolfram: atan(1 + 0i) = π/4 = 0.7853981633974483 + 0i
    expect(result.re).toBeCloseTo(Math.PI / 4, 15); // ≈ 0.7853981633974483
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 3: Imaginary input near singularity
  it("computes atan(0 + 1i) correctly", () => {
    const z = new Complex(0, 1);
    const result = Complex.atan(z);
    // Wolfram: atan(0 + 1i) ≈ i ∞
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBe(Number.POSITIVE_INFINITY);
  });

  // Test 4: Complex input
  it("computes atan(1 + 1i) correctly", () => {
    const z = new Complex(1, 1);
    const result = Complex.atan(z);
    // Wolfram: atan(1 + 1i) ≈ 1.0172219678978514 + 0.4023594781085251i
    //       1.01722196789785136772278896155048292206356087698683658714920269243705303... +
    //       0.402359478108525093650189833306546909881400338567129430478161972868544746... i
    expect(result.re).toBeCloseTo(1.01722196789785136772, 15);
    expect(result.im).toBeCloseTo(0.40235947810852509365, 15);
  });

  // Test 5: NaN input
  it("computes atan(NaN + 1i) correctly", () => {
    const z = new Complex(NaN, 1);
    const result = Complex.atan(z);
    // C99: atan(NaN + 1i) = NaN + NaN i
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 6: Infinity + finite i
  it("computes atan(Infinity + 1i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1);
    const result = Complex.atan(z);
    // C99: atan(Infinity + 1i) = π/2 + 0i = Wolfram
    expect(result.re).toBeCloseTo(Math.PI / 2, 15); // ≈ 1.5707963267948966
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 7: Near-zero input
  it("computes atan(1e-154 + 1e-154i) correctly", () => {
    const z = new Complex(1e-154, 1e-154);
    const result = Complex.atan(z);
    // Wolfram: atan(1e-154 + 1e-154i) ≈ 1e-154 + 1e-154i
    expect(result.re).toBeCloseTo(1e-154, 15);
    expect(result.im).toBeCloseTo(1e-154, 15);
  });

  // Test 8: Negative infinity + finite i
  it("computes atan(-Infinity + 1i) correctly", () => {
    const z = new Complex(Number.NEGATIVE_INFINITY, 1);
    const result = Complex.atan(z);
    // C99: atan(-Infinity + 1i) = -π/2 + 0i = Wolfram
    expect(result.re).toBeCloseTo(-Math.PI / 2, 15); // ≈ -1.5707963267948966
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 9: Infinity + large finite i
  it("computes atan(Infinity + 1000i) correctly", () => {
    const z = new Complex(Number.POSITIVE_INFINITY, 1000);
    const result = Complex.atan(z);
    // C99: atan(Infinity + 1000i) = π/2 + 0i = Wolfram
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 10: NaN + NaN i
  it("computes atan(NaN + NaN i) correctly", () => {
    const z = new Complex(NaN, NaN);
    const result = Complex.atan(z);
    // C99: atan(NaN + NaN i) = NaN + NaN i
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 11
  it("computes atan(0 + NaNi) near singularity", () => {
    const z = new Complex(0, NaN); // Pole at z = i
    const result = Complex.atan(z);
    // Wolfram: atan(0 + 1i) ≈ i ∞
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  // Test 12: Near-singularity
  it("computes atan(0 + (1 + EPSILON)i) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(0, 1 + ε);
    const result = Complex.atan(z);
    // Wolfram: atan(0 + (1 + 2.220446049250313e-16)i) ≈
    //         1.57079632679489661923132169163975144209858469968755291048747229615390820... +
    //         18.3684002848385507732729877016371013039416125910540821455704535047022847... i
    expect(result.re).toBeCloseTo(1.57079632679489661923, 15);
    expect(result.im).toBeCloseTo(18.36840028483855077327, 15);
  });

  // Test 13: Precision stress
  it("computes atan(0.99999 + (EPSILON * 0.00001)i) correctly", () => {
    const y = Number.EPSILON * 0.00001;
    const z = new Complex(0.99999, y);
    const result = Complex.atan(z);
    // mathjs  -> Test atan(0.99999 + (EPSILON * 0.00001)i) = 0.7853931633724482 + -2.7755575615628914e-17i
    // Complex -> Test atan(0.99999 + (EPSILON * 0.00001)i) = 0.7853931633724482 + 0i
    // Wolfram -> Test atan(0.99999 + (EPSILON * 0.00001)i) = 0.7853931633724482 + 1.1102341269109139e-21i
    expect(result.re).toBeCloseTo(0.785393163372448226, 15);
    expect(result.im).toBeCloseTo(1.110234126910913902e-21, 15); // Limited by JS precision
  });

  // Test 14: Symmetry check
  it("verifies symmetry: atan(-z) = -atan(z) for z = 1 + 1i", () => {
    const z = new Complex(1, 1);
    const negZ = new Complex(-1, -1);
    const resultZ = Complex.atan(z);
    const resultNegZ = Complex.atan(negZ);
    // C99: atan(-z) = -atan(z)
    expect(resultNegZ.re).toBeCloseTo(-resultZ.re, 15);
    expect(resultNegZ.im).toBeCloseTo(-resultZ.im, 15);
  });

  // Test 15: Finite + Infinity i
  it("computes atan(1 + Infinity i) correctly", () => {
    const z = new Complex(1, Number.POSITIVE_INFINITY);
    const result = Complex.atan(z);
    // C99: atan(1 + Infinity i) = π/2 + 0i
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(0, 15);
  });

  // Test 16: Singularity at z = -i:
  it("computes atan(0 - 1i) correctly", () => {
    const z = new Complex(0, -1);
    const result = Complex.atan(z);
    // Wolfram: atan(0 - 1i) ≈ 0 - i * ∞
    expect(result.re).toBeCloseTo(0, 15);
    expect(result.im).toBeCloseTo(Number.NEGATIVE_INFINITY, 15);
  });

  // Test 17
  it("computes atan(Infinity + Infinityi) correctly", () => {
    const z = new Complex(Infinity, Infinity);
    const result = Complex.atan(z);
    // C99: atan(∞ + ∞i) = π/2 + 0i (limit as x, y → ∞, Annex G.6.3.1)
    // Note: Wolfram reports undefined (? + ?i), and mathjs returns NaN + NaNi, but
    // C99 specifies π/2 + 0i, consistent with atan(∞ + yi) = π/2 + 0i for finite y.
    // glibc also complies with C99 and returns π/2.
    const expectedReal = Math.PI / 2;
    const expectedImag = 0;
    expect(result.re).toBe(expectedReal);
    expect(result.im).toBe(expectedImag);
  });

  // Test 18: Near-Zero Real, Large Imaginary
  it("computes atan(1e-10 + 1e10i) correctly", () => {
    const z = new Complex(1e-10, 1e10);
    const result = Complex.atan(z);
    // Wolfram: atan(1e-10 + 1e10i) ≈
    //       (π/2) 1.57079632679489661923132169163875144209858469968754291048747229615... +
    //       1.00000000000000000000333333333333333333325333333333333333333147619... × 10^-10 i
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(1.000000000000000000003e-10, 15);
  });

  // Test 19: Negative Large Imaginary:
  it("computes atan(1e-10 - 1e10i) correctly", () => {
    const z = new Complex(1e-10, -1e10);
    const result = Complex.atan(z);
    // Wolfram: atan(1e-10 - 1e10i) ≈ π/2 - 1e-10i
    expect(result.re).toBeCloseTo(Math.PI / 2, 15);
    expect(result.im).toBeCloseTo(-1.000000000000000000003e-10, 15);
  });

  // Test 20: Small Real, Near-Singularity Imaginary:
  it("computes atan(1e-10 + (1 + EPSILON)i) correctly", () => {
    const ε = Number.EPSILON;
    const z = new Complex(1e-10, 1 + ε);
    const result = Complex.atan(z);
    // Wolfram: atan(1e-10 + (1 + 2.220446049250313e-16)i) ≈
    //          0.78539927364547293294755346762675623637193521881771569118641308087006629... +
    //          11.8594990552489685351459447731342125409146560060111416026585468760274157... i
    expect(result.re).toBeCloseTo(0.78539927364547293294755, 15);
    expect(result.im).toBeCloseTo(11.859499055248968, 15);
  });
});
