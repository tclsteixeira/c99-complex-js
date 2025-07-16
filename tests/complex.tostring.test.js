import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // adjust path as needed

describe("Complex.prototype.toString", () => {
  it('should return "0 + 0i" when real and imaginary parts are both +0 (default)', () => {
    const z = new Complex(+0, +0);
    expect(z.toString()).toBe("0 + 0i");
  });

  it('should return "0" when real and imaginary parts are both +0 (not explicit)', () => {
    const z = new Complex(+0, +0);
    expect(z.toString(false)).toBe("0");
  });

  it('should return "-0 - 0i" when real and imaginary parts are both -0 (default)', () => {
    const z = new Complex(-0, -0);
    expect(z.toString()).toBe("-0 - 0i");
  });

  it('should return "-0 - 0i" when real and imaginary parts are both -0 (not explicit)', () => {
    const z = new Complex(-0, -0);
    expect(z.toString(false)).toBe("0");
  });

  it('should return "1 + 0i" for 1 + 0i (default)', () => {
    const z = new Complex(1, 0);
    expect(z.toString()).toBe("1 + 0i");
  });

  it('should return "1" for 1 + 0i (not explicit)', () => {
    const z = new Complex(1, 0);
    expect(z.toString(false)).toBe("1");
  });

  it('should return "0 + i" for 0 + 1i (default)', () => {
    const z = new Complex(0, 1);
    expect(z.toString()).toBe("0 + i");
  });

  it('should return "i" for 0 + 1i (not explicit)', () => {
    const z = new Complex(0, 1);
    expect(z.toString(false)).toBe("i");
  });

  it('should return "0 - i" for 0 - 1i (default)', () => {
    const z = new Complex(0, -1);
    expect(z.toString()).toBe("0 - i");
  });

  it('should return "-i" for 0 - 1i (not explicit)', () => {
    const z = new Complex(0, -1);
    expect(z.toString(false)).toBe("-i");
  });

  it('should return "1 + i" for 1 + 1i (default)', () => {
    const z = new Complex(1, 1);
    expect(z.toString()).toBe("1 + i");
  });

  it('should return "1 + i" for 1 + 1i (not explicit)', () => {
    const z = new Complex(1, 1);
    expect(z.toString(false)).toBe("1 + i");
  });

  it('should return "1 - i" for 1 - 1i (default)', () => {
    const z = new Complex(1, -1);
    expect(z.toString()).toBe("1 - i");
  });

  it('should return "1 - i" for 1 - 1i (not explicit)', () => {
    const z = new Complex(1, -1);
    expect(z.toString(false)).toBe("1 - i");
  });

  it('should return "-1 - i" for -1 - 1i (default)', () => {
    const z = new Complex(-1, -1);
    expect(z.toString()).toBe("-1 - i");
  });

  it('should return "-1 - i" for -1 - 1i (not explicit)', () => {
    const z = new Complex(-1, -1);
    expect(z.toString(false)).toBe("-1 - i");
  });

  it('should return "2.5 + 3.1i" for 2.5 + 3.1i (default)', () => {
    const z = new Complex(2.5, 3.1);
    expect(z.toString()).toBe("2.5 + 3.1i");
  });

  it('should return "2.5 + 3.1i" for 2.5 + 3.1i (not explicit)', () => {
    const z = new Complex(2.5, 3.1);
    expect(z.toString(false)).toBe("2.5 + 3.1i");
  });

  it('should return "2.5 - 3.1i" for 2.5 - 3.1i (default)', () => {
    const z = new Complex(2.5, -3.1);
    expect(z.toString()).toBe("2.5 - 3.1i");
  });

  it('should return "2.5 - 3.1i" for 2.5 - 3.1i (not explicit)', () => {
    const z = new Complex(2.5, -3.1);
    expect(z.toString(false)).toBe("2.5 - 3.1i");
  });

  it('should return "-2.5 - 3.1i" for -2.5 - 3.1i (default)', () => {
    const z = new Complex(-2.5, -3.1);
    expect(z.toString()).toBe("-2.5 - 3.1i");
  });

  it('should return "-2.5 - 3.1i" for -2.5 - 3.1i (not explicit)', () => {
    const z = new Complex(-2.5, -3.1);
    expect(z.toString(false)).toBe("-2.5 - 3.1i");
  });

  it('should return "-2.5 + 3.1i" for -2.5 + 3.1i (default)', () => {
    const z = new Complex(-2.5, +3.1);
    expect(z.toString()).toBe("-2.5 + 3.1i");
  });

  it('should return "-2.5 + 3.1i" for -2.5 + 3.1i (not explicit)', () => {
    const z = new Complex(-2.5, +3.1);
    expect(z.toString(false)).toBe("-2.5 + 3.1i");
  });

  it('should return "-2.5 + 0i" for -2.5 + 0i (default)', () => {
    const z = new Complex(-2.5, +0);
    expect(z.toString()).toBe("-2.5 + 0i");
  });

  it('should return "-2.5" for -2.5 + 0i (not explicit)', () => {
    const z = new Complex(-2.5, +0);
    expect(z.toString(false)).toBe("-2.5");
  });

  it('should return "-2.5 - 0i" for -2.5 - 0i (default)', () => {
    const z = new Complex(-2.5, -0);
    expect(z.toString()).toBe("-2.5 - 0i");
  });

  it('should return "-2.5" for -2.5 - 0i (not explicit)', () => {
    const z = new Complex(-2.5, -0);
    expect(z.toString(false)).toBe("-2.5");
  });

  it('should return "-0 - 3.1i" for -0 - 3.1i (default)', () => {
    const z = new Complex(-0, -3.1);
    expect(z.toString()).toBe("-0 - 3.1i");
  });

  it('should return "-3.1i" for -0 - 3.1i (not explicit)', () => {
    const z = new Complex(-0, -3.1);
    expect(z.toString(false)).toBe("-3.1i");
  });

  it('should return "-0 + i" for -0 + 1i (default)', () => {
    const z = new Complex(-0, 1);
    expect(z.toString()).toBe("-0 + i");
  });

  it('should return "i" for -0 + 1i (not explicit)', () => {
    const z = new Complex(-0, 1);
    expect(z.toString(false)).toBe("i");
  });

  it('"Infinity + i" should return "Infinity + i" (default)', () => {
    const z = new Complex(Infinity, 1);
    expect(z.toString()).toBe("Infinity + i");
  });

  it('"Infinity + i" should return "Infinity + i" (not explicit)', () => {
    const z = new Complex(Infinity, 1);
    expect(z.toString(false)).toBe("Infinity + i");
  });

  it('"-Infinity - i" should return "-Infinity - i" (default)', () => {
    const z = new Complex(-Infinity, -1);
    expect(z.toString()).toBe("-Infinity - i");
  });

  it('"-Infinity - i" should return "-Infinity - i" (not explicit)', () => {
    const z = new Complex(-Infinity, -1);
    expect(z.toString(false)).toBe("-Infinity - i");
  });

  it('"NaN + i" should return "NaN + i" (default)', () => {
    const z = new Complex(NaN, 1);
    expect(z.toString()).toBe("NaN + i");
  });

  it('"NaN + i" should return "NaN + i" (not explicit)', () => {
    const z = new Complex(NaN, 1);
    expect(z.toString(false)).toBe("NaN + i");
  });

  it('"1 + NaNi" should return "1 + NaNi" (default)', () => {
    const z = new Complex(1, NaN);
    expect(z.toString()).toBe("1 + NaNi");
  });

  it('"1 + NaNi" should return "1 + NaNi" (not explicit)', () => {
    const z = new Complex(1, NaN);
    expect(z.toString(false)).toBe("1 + NaNi");
  });

  it('"NaN + NaNi" should return "NaN + NaNi" (default)', () => {
    const z = new Complex(NaN, NaN);
    expect(z.toString()).toBe("NaN + NaNi");
  });

  it('"NaN + NaNi" should return "NaN + NaNi" (not explicit)', () => {
    const z = new Complex(NaN, NaN);
    expect(z.toString(false)).toBe("NaN + NaNi");
  });

  it('"Infinity + Infinityi" should return "Infinity + Infinityi" (default)', () => {
    const z = new Complex(Infinity, Infinity);
    expect(z.toString()).toBe("Infinity + Infinityi");
  });

  it('"Infinity + Infinityi" should return "Infinity + Infinityi" (not explicit)', () => {
    const z = new Complex(Infinity, Infinity);
    expect(z.toString(false)).toBe("Infinity + Infinityi");
  });

  it('"-Infinity + Infinityi" should return "-Infinity + Infinityi" (default)', () => {
    const z = new Complex(-Infinity, Infinity);
    expect(z.toString()).toBe("-Infinity + Infinityi");
  });

  it('"-Infinity + Infinityi" should return "-Infinity + Infinityi" (not explicit)', () => {
    const z = new Complex(-Infinity, Infinity);
    expect(z.toString(false)).toBe("-Infinity + Infinityi");
  });

  it('"Infinity - Infinityi" should return "Infinity - Infinityi" (default)', () => {
    const z = new Complex(Infinity, -Infinity);
    expect(z.toString()).toBe("Infinity - Infinityi");
  });

  it('"Infinity - Infinityi" should return "Infinity - Infinityi" (not explicit)', () => {
    const z = new Complex(Infinity, -Infinity);
    expect(z.toString(false)).toBe("Infinity - Infinityi");
  });

  it('"-Infinity - Infinityi" should return "-Infinity - Infinityi" (default)', () => {
    const z = new Complex(-Infinity, -Infinity);
    expect(z.toString()).toBe("-Infinity - Infinityi");
  });

  it('"-Infinity - Infinityi" should return "-Infinity - Infinityi" (not explicit)', () => {
    const z = new Complex(-Infinity, -Infinity);
    expect(z.toString(false)).toBe("-Infinity - Infinityi");
  });

  it('"Infinity + 0i" should return "Infinity + 0i" (default)', () => {
    const z = new Complex(Infinity, 0);
    expect(z.toString()).toBe("Infinity + 0i");
  });

  it('"Infinity + 0i" should return "Infinity" (not explicit)', () => {
    const z = new Complex(Infinity, 0);
    expect(z.toString(false)).toBe("Infinity");
  });

  it('"Infinity - 0i" should return "Infinity - 0i" (default)', () => {
    const z = new Complex(Infinity, -0);
    expect(z.toString()).toBe("Infinity - 0i");
  });

  it('"Infinity - 0i" should return "Infinity" (not explicit)', () => {
    const z = new Complex(Infinity, -0);
    expect(z.toString(false)).toBe("Infinity");
  });

  it('"0 + Infinityi" should return "0 + Infinityi" (default)', () => {
    const z = new Complex(0, Infinity);
    expect(z.toString()).toBe("0 + Infinityi");
  });

  it('"0 + Infinityi" should return "Infinityi" (not explicit)', () => {
    const z = new Complex(0, Infinity);
    expect(z.toString(false)).toBe("Infinityi");
  });

  it('"-0 + Infinityi" should return "-0 + Infinityi" (default)', () => {
    const z = new Complex(-0, Infinity);
    expect(z.toString()).toBe("-0 + Infinityi");
  });

  it('"-0 + Infinityi" should return "Infinityi" (not explicit)', () => {
    const z = new Complex(-0, Infinity);
    expect(z.toString(false)).toBe("Infinityi");
  });

  it('"0 - Infinityi" should return "0 - Infinityi" (default)', () => {
    const z = new Complex(0, -Infinity);
    expect(z.toString()).toBe("0 - Infinityi");
  });

  it('"0 - Infinityi" should return "-Infinityi" (not explicit)', () => {
    const z = new Complex(0, -Infinity);
    expect(z.toString(false)).toBe("-Infinityi");
  });

  it('"-0 - Infinityi" should return "-0 - Infinityi" (default)', () => {
    const z = new Complex(-0, -Infinity);
    expect(z.toString()).toBe("-0 - Infinityi");
  });

  it('"-0 - Infinityi" should return "-Infinityi" (not explicit)', () => {
    const z = new Complex(-0, -Infinity);
    expect(z.toString(false)).toBe("-Infinityi");
  });
});

/*

import { describe, it, expect } from "vitest";
import { Complex } from "../src/c99-complex.js"; // adjust path as needed

describe("Complex.prototype.toString", () => {
  const testCases = [
    // [re, im, expected (ignoreZero=true), expected (ignoreZero=false)]
    [0, 0, "0", "0 + 0i"],
    [+0, +0, "0", "0 + 0i"],
    [-0, -0, "0", "-0 - 0i"],
    [1, 0, "1", "1 + 0i"],
    [0, 1, "i", "0 + i"],
    [0, -1, "-i", "0 - i"],
    [1, 1, "1 + i", "1 + i"],
    [1, -1, "1 - i", "1 - i"],
    [-1, -1, "-1 - i", "-1 - i"],
    [2.5, 3.1, "2.5 + 3.1i", "2.5 + 3.1i"],
    [2.5, -3.1, "2.5 - 3.1i", "2.5 - 3.1i"],
    [-0, 1, "i", "-0 + i"],
    [Infinity, 1, "Infinity + i", "Infinity + i"],
    [-Infinity, -1, "-Infinity - i", "-Infinity - i"],
    [NaN, 1, "NaN + i", "NaN + i"],
    [1, NaN, "1 + NaNi", "1 + NaNi"],
    [NaN, NaN, "NaN + NaNi", "NaN + NaNi"],
  ];

  it.each(testCases)(
    "should return correct string for re=%s, im=%s (ignoreZero=true)",
    (re, im, expectedIgnore, _) => {
      const z = new Complex(re, im);
      expect(z.toString()).toBe(expectedIgnore);
    }
  );

  it.each(testCases)(
    "should return correct string for re=%s, im=%s (ignoreZero=false)",
    (re, im, _, expectedNoIgnore) => {
      const z = new Complex(re, im);
      expect(z.toString(false)).toBe(expectedNoIgnore);
    }
  );
});
*/
