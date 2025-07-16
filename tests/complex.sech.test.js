import { expect, describe, it } from "vitest";
import { Complex } from "../src/c99-complex.js"; // Adjust path to your Complex.js file

describe("Complex.sech", () => {
  it("sech(1e-154 + 1e-154i) should return 1 + 0i", () => {
    const z = new Complex(1e-154, 1e-154);
    const result = Complex.sech(z);
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
  });

  it("sech(1 + 1i) should return 0.4983370305551868 - 0.591083841721045i", () => {
    const z = new Complex(1, 1);
    const result = Complex.sech(z);
    expect(result.re).toBeCloseTo(0.4983370305551868, 15);
    expect(result.im).toBeCloseTo(-0.591083841721045, 15);
  });

  it("sech(0 + Math.PI/4 i) should return sqrt(2)", () => {
    const z = new Complex(0, Math.PI / 4);
    const result = Complex.sech(z);
    expect(result.re).toBeCloseTo(Math.sqrt(2), 15);
    expect(result.im).toBe(0);
  });

  it("sech(0 + Math.PI/2 i) should return NaN + NaNi", () => {
    const z = new Complex(0, Math.PI / 2);
    const result = Complex.sech(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  it("sech(30 + 1i) should return 1.0111890535018027e-13 - 1.5748336430101868e-13i", () => {
    const z = new Complex(30, 1);
    const result = Complex.sech(z);
    expect(result.re).toBeCloseTo(1.0111890535018027e-13, 15);
    expect(result.im).toBeCloseTo(-1.5748336430101868e-13, 15);
  });

  it("sech(-30 + 1i) should return 1.0111890535018027e-13 + 1.5748336430101868e-13i", () => {
    const z = new Complex(-30, 1);
    const result = Complex.sech(z);
    expect(result.re).toBeCloseTo(1.0111890535018027e-13, 15);
    expect(result.im).toBeCloseTo(1.5748336430101868e-13, 15);
  });

  it("sech(NaN + 1i) should return NaN + NaNi", () => {
    const z = new Complex(NaN, 1);
    const result = Complex.sech(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  it("sech(Infinity + 1i) should return NaN + NaNi", () => {
    const z = new Complex(Infinity, 1);
    const result = Complex.sech(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  it("sech(0 + 3 * Math.PI/2 i) should return NaN + NaNi", () => {
    const z = new Complex(0, (3 * Math.PI) / 2);
    const result = Complex.sech(z);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
  });

  it("sech(0 + Math.PI i) should return -1 + 0i", () => {
    const z = new Complex(0, Math.PI);
    const result = Complex.sech(z);
    expect(result.re).toBe(-1);
    expect(result.im).toBe(0);
  });

  it("sech(1e-154 + 0i) should return 1 + 0i", () => {
    const z = new Complex(1e-154, 0);
    const result = Complex.sech(z);
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
  });
});
