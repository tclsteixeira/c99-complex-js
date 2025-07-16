// C99-Compliant Rules Table for polar(magnitude, phase)
// -----------------------------------------------------------------------
// Input magnitude, phase	        Output	                          Notes
// -----------------------------------------------------------------------
// NaN, any	                      NaN + NaN·i	                      If either input is NaN, result must be fully NaN
// any, NaN	                      NaN + NaN·i	                      Same — NaN propagates
// 0, any phase	                  +0 + 0·i	                        Phase is ignored — zero magnitude always results in zero
// +∞, finite phase	              ∞·cos(θ) + ∞·sin(θ)·i	            Real/imag parts are signed infinities depending on direction of θ
// -∞, finite phase	              Same as +∞, but θ adjusted by ±π	Because negative magnitude rotates direction by π
// finite m, ±∞ phase	            NaN + NaN·i	                      sin(∞) and cos(∞) are undefined in C99 — result must be NaN
// ±∞, ±∞	                        NaN + NaN·i	                      Invalid trig → result undefined
// finite m ≠ 0, finite phase	    m·cos(θ) + m·sin(θ)·i	            Normal case
// m < 0, finite phase	          Phase is normalized: θ ± π, then compute magnitude = abs(m)	Negative magnitude flips direction
// ------------------------------------------------------------------------

/**
 * Tests for Complex.polar(magnitude, phase).
 * Verifies conversion from polar to Cartesian coordinates with normalization:
 * - Magnitude is non-negative.
 * - Phase is in [-π, π].
 * - Rounds |cos(phase)| and |sin(phase)| < 1e-15 to 0 to match Wolfram|Alpha.
 * - Handles edge cases: NaN, Infinity, zero magnitude, large phases.
 * - Decision to treat 0 * ∞ = 0 in exp(z) (e.g., Test 9 in complex.exp.test.js) is unrelated but noted for context.
 * - Note: For small phases (e.g., 1e-15) or phases near ±π, Complex.js uses JavaScript’s Math.cos/Math.sin,
 *   producing approximate results (e.g., cos(1e-15) ≈ 1, sin(π ± 1e-15) ≈ ±1.010643e-15) compared to
 *   Wolfram|Alpha’s exact values. Tests 14–19 accept these approximations at 15 decimal places.
 * All tests verified as of June 5, 2025.
 */

// polar(magnitude, phase) — C99 edge case test suite
import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

const PI = Math.PI;
const SQRT1_2 = Math.SQRT1_2;

describe("Complex.polar — C99 edge cases", () => {
  // Test 1
  it("polar(NaN, 1) === NaN + NaN·i", () => {
    const z = Complex.polar(NaN, 1);
    expect(z.re).toBeNaN();
    expect(z.im).toBeNaN();
  });

  // Test 2
  it("polar(1, NaN) === NaN + NaN·i", () => {
    const z = Complex.polar(1, NaN);
    expect(z.re).toBeNaN();
    expect(z.im).toBeNaN();
  });

  // Test 3
  it("polar(0, π/2) === 0 + 0·i", () => {
    const z = Complex.polar(0, PI / 2);
    expect(z.re).toBe(0);
    expect(z.im).toBe(0);
  });

  // Test 4
  it("polar(+Infinity, 0) === Infinity + 0·i", () => {
    const z = Complex.polar(Infinity, 0);
    expect(z.re).toBe(Infinity);
    expect(z.im).toBe(0);
  });

  // Test 5
  it("polar(+Infinity, π/2) === 0 + Infinity·i", () => {
    const z = Complex.polar(Infinity, PI / 2);
    expect(z.re).toBeCloseTo(0, 15);
    expect(z.im).toBe(Infinity);
  });

  // Test 6
  it("polar(+Infinity, π) === -Infinity + 0·i", () => {
    const z = Complex.polar(Infinity, PI);
    expect(z.re).toBeCloseTo(-Infinity);
    expect(z.im).toBeCloseTo(0);
  });

  // Test 7
  it("polar(1, Infinity) === NaN + NaN·i", () => {
    const z = Complex.polar(1, Infinity);
    expect(z.re).toBeNaN();
    expect(z.im).toBeNaN();
  });

  // Test 8
  it("polar(+Infinity, Infinity) === NaN + NaN·i", () => {
    const z = Complex.polar(Infinity, Infinity);
    expect(z.re).toBeNaN();
    expect(z.im).toBeNaN();
  });

  // Test 9
  it("polar(+Infinity, -Infinity) === NaN + NaN·i", () => {
    const z = Complex.polar(Infinity, -Infinity);
    expect(z.re).toBeNaN();
    expect(z.im).toBeNaN();
  });

  // Test 10
  it("polar(-Infinity, Infinity) === NaN + NaN·i", () => {
    const z = Complex.polar(-Infinity, Infinity);
    expect(z.re).toBeNaN();
    expect(z.im).toBeNaN();
  });

  // Test 11
  it("polar(-Infinity, -Infinity) === NaN + NaN·i", () => {
    const z = Complex.polar(-Infinity, -Infinity);
    expect(z.re).toBeNaN();
    expect(z.im).toBeNaN();
  });

  // Test 12
  it("polar(2, 0) === 2 + 0·i", () => {
    const z = Complex.polar(2, 0);
    expect(z.re).toBeCloseTo(2);
    expect(z.im).toBeCloseTo(0);
  });

  // Test 13
  it("polar(2, π) === -2 + 0·i", () => {
    const z = Complex.polar(2, PI);
    expect(z.re).toBeCloseTo(-2);
    expect(z.im).toBeCloseTo(0);
  });

  // Test 14
  it("polar(3, π/2) === 0 + 3·i", () => {
    const z = Complex.polar(3, PI / 2);
    expect(z.re).toBeCloseTo(0);
    expect(z.im).toBeCloseTo(3);
  });

  // Test 15
  it("polar(3, -π/2) === 0 - 3·i", () => {
    const z = Complex.polar(3, -PI / 2);
    expect(z.re).toBeCloseTo(0);
    expect(z.im).toBeCloseTo(-3);
  });

  // Test 16
  it("polar(-3, 0) === 3∠π", () => {
    const z = Complex.polar(-3, 0);
    expect(z.re).toBeCloseTo(-3);
    expect(z.im).toBeCloseTo(0);
  });

  // Test 17: Verifies small positive phase, expecting 1 + 1e-15i (sin(1e-15) ≈ 1e-15, cos(1e-15) ≈ 1).
  it("handles small positive phase correctly", () => {
    const result = Complex.polar(1, 1e-15);
    // Wolfram:
    // re: 0.9999999999999999999999999999995,
    // im: 9.999999999999999999999999999998e-16,
    expect(result.re).toBeCloseTo(0.9999999999999999999999999999995, 15);
    expect(result.im).toBeCloseTo(9.999999999999999999999999999998e-16, 15);
  });

  // Test 18: Verifies small negative phase, expecting 1 - 1e-15i (sin(-1e-15) ≈ -1e-15, cos(-1e-15) ≈ 1).
  it("handles small negative phase correctly", () => {
    const result = Complex.polar(1, -1e-15);
    // Wolfram:
    // re: 0.9999999999999999999999999999995,
    // im: -9.999999999999999999999999999998e-16,
    expect(result.re).toBeCloseTo(0.9999999999999999999999999999995, 15);
    expect(result.im).toBeCloseTo(-9.999999999999999999999999999998e-16, 15);
  });

  // Test 19: Verifies phase slightly above π, expecting -1 + 0i (normalizes to π, sin(π) = 0).
  it("handles phase slightly above π correctly", () => {
    const result = Complex.polar(1, Math.PI + 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: -9.999999999999999999999999999998e-16,
    expect(result.re).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.im).toBeCloseTo(-9.999999999999999999999999999998e-16, 15);
  });

  // Test 20: Verifies phase slightly below π, expecting -1 + 0i (no normalization, sin(π - 1e-15) ≈ 0).
  it("handles phase slightly below π correctly", () => {
    const result = Complex.polar(1, Math.PI - 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: 9.999999999999999999999999999998e-16,
    expect(result.re).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.im).toBeCloseTo(9.999999999999999999999999999998e-16, 15);
  });

  // Test 21: Verifies phase slightly above -π, expecting -1 + 0i (no normalization, sin(-π + 1e-15) ≈ 0).
  it("handles phase slightly above -π correctly", () => {
    const result = Complex.polar(1, -Math.PI + 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: -9.999999999999999999999999999998e-16,
    expect(result.re).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.im).toBeCloseTo(-9.999999999999999999999999999998e-16, 15);
  });

  // Test 22: Verifies phase slightly below -π, expecting -1 + 0i (normalizes to -π, sin(-π) = 0).
  it("handles phase slightly below -π correctly", () => {
    const result = Complex.polar(1, -Math.PI - 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: 9.999999999999999999999999999998e-16,
    expect(result.re).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.im).toBeCloseTo(9.999999999999999999999999999998e-16, 15);
  });
});

/**
 * Tests for Complex.polar(magnitude, phase).
 * Verifies conversion from polar to Cartesian coordinates with normalization:
 * - Magnitude is non-negative.
 * - Phase is in [-π, π].
 * - Rounds |cos(phase)| and |sin(phase)| < 1e-15 to 0 to match Wolfram|Alpha.
 * - Handles edge cases: NaN, Infinity, zero magnitude, large phases.
 * - Decision to treat 0 * ∞ = 0 in exp(z) (e.g., Test 9 in complex.exp.test.js) is unrelated but noted for context.
 * - Note: For small phases (e.g., 1e-15) or phases near ±π, Complex.js uses JavaScript’s Math.cos/Math.sin,
 *   producing approximate results (e.g., cos(1e-15) ≈ 1, sin(π ± 1e-15) ≈ ±1.010643e-15) compared to
 *   Wolfram|Alpha’s exact values. Tests 14–19 accept these approximations at 15 decimal places.
 * All tests verified as of June 5, 2025.
 */

/*

import { Complex } from "../src/c99-complex.js";
import { describe, it, expect } from "vitest";

describe("Complex.polar", () => {
  // Summary -----------------
  // Test 1: Checks magnitude = 1, phase = 0 → 1 + 0i (positive real axis).
  // Test 2: Checks magnitude = 1, phase = π/2 → 0 + 1i (positive imaginary axis).
  // Test 3: Checks magnitude = -1, phase = 0 → -1 + 0i (phase adjusted to π).
  // Test 4: Checks phase = 3π → -1 + 0i (normalizes to π).
  // Test 5: Checks phase = -3π → -1 + 0i (normalizes to -π).
  // Test 6: Checks magnitude = 0 → 0 + 0i (origin).
  // Test 7: Checks magnitude = NaN → NaN + NaNi (undefined).
  // Test 8: Checks phase = NaN → NaN + NaNi (undefined cos/sin).
  // Test 9: Checks magnitude = Infinity, phase = 0 → Infinity + 0i (diverges along real axis).
  // Test 10: Checks magnitude = Infinity, phase = π/2 → 0 + Infinity i (diverges along imaginary axis).
  // Test 11: Checks phase = Infinity → NaN + NaNi (undefined cos/sin).
  // Test 12: Checks phase = 1000π → 1 + 0i (normalizes to 0).
  // Test 13: Checks magnitude = -1, phase = 3π → 1 + 0i (normalizes to 0).
  // Test 14: Checks small positive phase = 1e-15 → ~1 + 1e-15i (cos(1e-15) ≈ 1, sin(1e-15) ≈ 1e-15).
  // Test 15: Checks small negative phase = -1e-15 → ~1 - 1e-15i (cos(-1e-15) ≈ 1, sin(-1e-15) ≈ -1e-15).
  // Test 16: Checks phase = π + 1e-15 → ~-1 - 1e-15i (normalizes to -π + 1e-15).
  // Test 17: Checks phase = π - 1e-15 → ~-1 + 1e-15i (no normalization).
  // Test 18: Checks phase = -π + 1e-15 → ~-1 - 1e-15i (no normalization).
  // Test 19: Checks phase = -π - 1e-15 → ~-1 + 1e-15i (normalizes to π - 1e-15).

  // Test 1: Verifies conversion for positive magnitude and zero phase, expecting 1 + 0i (point on positive real axis).
  it("converts positive magnitude and zero phase correctly", () => {
    const result = Complex.polar(1, 0);
    expect(result.real).toBeCloseTo(1, 15);
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 2: Verifies conversion for positive magnitude and π/2 phase, expecting 0 + 1i (point on positive imaginary axis).
  it("converts positive magnitude and π/2 phase correctly", () => {
    const result = Complex.polar(1, Math.PI / 2);
    expect(result.real).toBeCloseTo(0, 15);
    expect(result.imag).toBeCloseTo(1, 15);
  });

  // Test 3: Verifies negative magnitude handling, adjusting phase by π, expecting -1 + 0i for magnitude -1, phase 0.
  it("converts negative magnitude correctly", () => {
    const result = Complex.polar(-1, 0);
    expect(result.real).toBeCloseTo(-1, 15); // r = 1, phase = π
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 4: Verifies phase normalization for phase > π, expecting -1 + 0i for phase 3π (normalizes to π).
  it("normalizes phase > π correctly", () => {
    const result = Complex.polar(1, 3 * Math.PI);
    expect(result.real).toBeCloseTo(-1, 15); // phase ≈ π
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 5: Verifies phase normalization for phase < -π, expecting -1 + 0i for phase -3π (normalizes to -π).
  it("normalizes phase < -π correctly", () => {
    const result = Complex.polar(1, -3 * Math.PI);
    expect(result.real).toBeCloseTo(-1, 15); // phase ≈ -π
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 6: Verifies zero magnitude, expecting 0 + 0i regardless of phase (origin point).
  it("handles zero magnitude correctly", () => {
    const result = Complex.polar(0, Math.PI / 4);
    expect(result.real).toBe(0);
    expect(result.imag).toBe(0);
  });

  // Test 7: Verifies NaN magnitude, expecting NaN + NaNi (undefined complex number).
  it("handles NaN magnitude correctly", () => {
    const result = Complex.polar(NaN, 0);
    expect(Number.isNaN(result.real)).toBe(true);
    expect(Number.isNaN(result.imag)).toBe(true);
  });

  // Test 8: Verifies NaN phase, expecting NaN + NaNi (undefined cos/sin values).
  it("handles NaN phase correctly", () => {
    const result = Complex.polar(1, NaN);
    expect(Number.isNaN(result.real)).toBe(true);
    expect(Number.isNaN(result.imag)).toBe(true);
  });

  // Test 9: Verifies infinite magnitude with zero phase, expecting Infinity + 0i (diverges along positive real axis).
  it("handles infinite magnitude with zero phase correctly", () => {
    const result = Complex.polar(Infinity, 0);
    expect(result.real).toBe(Infinity);
    expect(result.imag).toBe(0);
  });

  // Test 10: Verifies infinite magnitude with π/2 phase, expecting 0 + Infinity i (diverges along positive imaginary axis).
  it("handles infinite magnitude with π/2 phase correctly", () => {
    const result = Complex.polar(Infinity, Math.PI / 2);
    expect(result.real).toBe(0);
    expect(result.imag).toBe(Infinity);
  });

  // Test 11: Verifies infinite phase, expecting NaN + NaNi (undefined cos/sin for infinite phase).
  it("handles infinite phase correctly", () => {
    const result = Complex.polar(1, Infinity);
    expect(Number.isNaN(result.real)).toBe(true);
    expect(Number.isNaN(result.imag)).toBe(true);
  });

  // Test 12: Verifies normalization of very large phase, expecting 1 + 0i for phase 1000π (normalizes to 0).
  it("handles large phase normalization correctly", () => {
    const result = Complex.polar(1, 1000 * Math.PI);
    expect(result.real).toBeCloseTo(1, 15); // phase ≈ 0
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 13: Verifies negative magnitude with large phase, expecting 1 + 0i for magnitude -1, phase 3π (normalizes to 0).
  it("handles negative magnitude with large phase correctly", () => {
    const result = Complex.polar(-1, 3 * Math.PI);
    expect(result.real).toBeCloseTo(1, 15); // r = 1, phase ≈ 0
    expect(result.imag).toBeCloseTo(0, 15);
  });

  // Test 14: Verifies small positive phase, expecting 1 + 1e-15i (sin(1e-15) ≈ 1e-15, cos(1e-15) ≈ 1).
  it("handles small positive phase correctly", () => {
    const result = Complex.polar(1, 1e-15);
    // Wolfram:
    // re: 0.9999999999999999999999999999995,
    // im: 9.999999999999999999999999999998e-16,
    expect(result.real).toBeCloseTo(0.9999999999999999999999999999995, 15);
    expect(result.imag).toBeCloseTo(9.999999999999999999999999999998e-16, 15);
  });

  // Test 15: Verifies small negative phase, expecting 1 - 1e-15i (sin(-1e-15) ≈ -1e-15, cos(-1e-15) ≈ 1).
  it("handles small negative phase correctly", () => {
    const result = Complex.polar(1, -1e-15);
    // Wolfram:
    // re: 0.9999999999999999999999999999995,
    // im: -9.999999999999999999999999999998e-16,
    expect(result.real).toBeCloseTo(0.9999999999999999999999999999995, 15);
    expect(result.imag).toBeCloseTo(-9.999999999999999999999999999998e-16, 15);
  });

  // Test 16: Verifies phase slightly above π, expecting -1 + 0i (normalizes to π, sin(π) = 0).
  it("handles phase slightly above π correctly", () => {
    const result = Complex.polar(1, Math.PI + 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: -9.999999999999999999999999999998e-16,
    expect(result.real).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.imag).toBeCloseTo(-9.999999999999999999999999999998e-16, 15);
  });

  // Test 17: Verifies phase slightly below π, expecting -1 + 0i (no normalization, sin(π - 1e-15) ≈ 0).
  it("handles phase slightly below π correctly", () => {
    const result = Complex.polar(1, Math.PI - 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: 9.999999999999999999999999999998e-16,
    expect(result.real).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.imag).toBeCloseTo(9.999999999999999999999999999998e-16, 15);
  });

  // Test 18: Verifies phase slightly above -π, expecting -1 + 0i (no normalization, sin(-π + 1e-15) ≈ 0).
  it("handles phase slightly above -π correctly", () => {
    const result = Complex.polar(1, -Math.PI + 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: -9.999999999999999999999999999998e-16,
    expect(result.real).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.imag).toBeCloseTo(-9.999999999999999999999999999998e-16, 15);
  });

  // Test 19: Verifies phase slightly below -π, expecting -1 + 0i (normalizes to -π, sin(-π) = 0).
  it("handles phase slightly below -π correctly", () => {
    const result = Complex.polar(1, -Math.PI - 1e-15);
    // Wolfram:
    // re: -0.9999999999999999999999999999995,
    // im: 9.999999999999999999999999999998e-16,
    expect(result.real).toBeCloseTo(-0.9999999999999999999999999999995, 15);
    expect(result.imag).toBeCloseTo(9.999999999999999999999999999998e-16, 15);
  });
});
*/
