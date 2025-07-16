import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js";

describe("Complex Number parser", () => {
  it("should parse a complex number string in en-US culture format without thousands separator correctly", () => {
    const z = Complex.parse("1234.56+789.01i");
    expect(z.re).toBe(1234.56);
    expect(z.im).toBe(789.01);
  });

  it("should parse a complex number string in scientific notation in en-US culture format correctly", () => {
    const z = Complex.parse("1.5e2 + 2.3e-1i");
    expect(z.re).toBe(150);
    expect(z.im).toBe(0.23);
  });

  it("should parse a complex number string with no imaginary part in en-US culture format correctly", () => {
    const z = Complex.parse("45");
    expect(z.re).toBe(45);
    expect(z.im).toBe(0);
  });

  it("should parse a complex number string with no real part in en-US culture format correctly", () => {
    const z = Complex.parse("-4.2i");
    expect(z.re).toBe(0);
    expect(z.im).toBe(-4.2);
  });

  it("should parse a complex number string representing the imaginary one (i) correctly", () => {
    const z = Complex.parse("i");
    expect(z.re).toBe(0);
    expect(z.im).toBe(1);
  });

  it("should parse a complex number string representing the negative imaginary one (-i) correctly", () => {
    const z = Complex.parse("-i");
    expect(z.re).toBe(0);
    expect(z.im).toBe(-1);
  });

  it("should parse a complex number string with negative real and imaginary parts in scientific notation correctly", () => {
    const z = Complex.parse("-1.5e2 - 2.3e-1i");
    expect(z.re).toBe(-150);
    expect(z.im).toBe(-0.23);
  });

  it("should parse a complex number string with only real part in scientific notation correctly", () => {
    const z = Complex.parse("5e2");
    expect(z.re).toBe(500);
    expect(z.im).toBe(0);
  });

  it("should parse a complex number string representing imaginary one with leading plus sign (+i) correctly", () => {
    const z = Complex.parse("+i");
    expect(z.re).toBe(0);
    expect(z.im).toBe(1);
  });

  it("should parse a complex number string with only real part starting with leading decimal point correctly", () => {
    const z = Complex.parse(".45");
    expect(z.re).toBe(0.45);
    expect(z.im).toBe(0);
  });

  // Invalid formatted strings should throw exceptions

  it("should throw an exception due to invalid number format string for a complex number with a no supported thousands separator", () => {
    expect(() => Complex.parse("1,234.56 + 789.01i")).toThrow();
  });

  it("should throw an exception due to invalid number format string with missing digit after decimal separator", () => {
    expect(() => Complex.parse(".e5i")).toThrow();
  });

  it("should throw an exception because is an empty string", () => {
    expect(() => Complex.parse("")).toThrow();
  });

  it("should throw an exception due to invalid number format string due to number with two decimal separators", () => {
    expect(() => Complex.parse("1.2.3")).toThrow();
  });
});
