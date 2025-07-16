import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "acos(0 + 0i)",
  },
  {
    // 2
    re: +0,
    im: 0,
    description: "acos(+0 + 0i)",
  },
  {
    // 3
    re: -0,
    im: 0,
    description: "acos(-0 + 0i)",
  },
  {
    // 4
    re: 1,
    im: 0,
    description: "acos(1 + 0i)",
  },
  {
    // 5
    re: -1,
    im: 0,
    description: "acos(-1 + 0i)",
  },
  {
    // 6
    re: 0,
    im: 1,
    description: "acos(0 + 1i)",
  },
  {
    // 7
    re: 0,
    im: -1,
    description: "acos(0 - i)",
  },
  {
    // 8
    re: 30,
    im: 0,
    description: "acos(30 + 0i)",
  },
  {
    // 9
    re: -30,
    im: 0,
    description: "acos(-30 + 0i)",
  },
  {
    // 10
    re: Infinity,
    im: 1,
    description: "acos(∞ + i)",
  },
  {
    // 11
    re: Infinity,
    im: -1,
    description: "acos(∞ - 1i)",
  },
  {
    // 12
    re: NaN,
    im: 1,
    description: "acos(NaN + 1i)",
  },
  {
    // 13
    re: 1e-154,
    im: 1e-154,
    description: "acos(1e-154 + 1e-154i)",
  },
  {
    // 14
    re: 1,
    im: 1,
    description: "acos(1 + i)",
  },
  {
    // 15
    re: -1,
    im: -1,
    description: "acos(-1 - i)",
  },
  {
    // 16
    re: 1,
    im: 30,
    description: "acos(1 + 30i)",
  },
  {
    // 17
    re: true,
    im: true,
    description: "verifies symmetry acos(-ε - εi) = π - acos(ε + εi)",
  },
  {
    // 18
    re: 1,
    im: Number.EPSILON,
    description: "acos(1 + εi)",
  },
  {
    // 19
    re: -1,
    im: -Number.EPSILON,
    description: "acos(-1 - εi)",
  },
  {
    // 20
    re: 0.5,
    im: Number.EPSILON,
    description: "acos(0.5 + εi)",
  },
  {
    // 21
    re: 0,
    im: Number.MIN_VALUE,
    description: "acos(0 + min_value i)",
  },
  {
    // 22
    re: 0,
    im: 1e10,
    description: "acos(0 + 1e10i)",
  },
  {
    // 23
    re: Number.EPSILON,
    im: Number.EPSILON,
    description: "acos(ε + εi)",
  },
  {
    // 24
    re: true,
    im: true,
    description: "verifies symmetry: acos(-ε - εi) = π - acos(ε + εi)",
  },
  {
    // 25
    re: -1,
    im: Number.EPSILON,
    description: "acos(-1 + εi)",
  },
  {
    // 26
    re: 0.999,
    im: 0.1 * Number.EPSILON,
    description: "acos(0.999 + 0.1*ε)",
  },
  {
    // 27
    re: Number.MIN_VALUE,
    im: Number.MIN_VALUE,
    description: "acos(min + min i)",
  },
  {
    // 28
    re: Number.EPSILON,
    im: 1e10,
    description: "acos(ε + 1e10i)",
  },
  {
    // 29
    re: 1,
    im: -Number.EPSILON,
    description: "acos(1 - ε)",
  },
  {
    // 30
    re: Infinity,
    im: NaN,
    description: "acos(Inf + NaNi)",
  },
  {
    // 31
    re: 1,
    im: 1e-100,
    description: "acos(1 + 1e-100i)",
  },
  {
    // 32
    re: Number.MIN_VALUE,
    im: 1e10,
    description: "acos(min + 1e10i)",
  },
  {
    // 33
    re: -Number.MIN_VALUE,
    im: 0,
    description: "acos(-min + 0i)",
  },
  {
    // 34
    re: NaN,
    im: NaN,
    description: "acos(NaN + NaNi)",
  },
  {
    // 35
    re: 0.99999,
    im: Number.EPSILON * 0.00001,
    description: "acos(0.99999 + (ε* 0.00001)i)",
  },
];

const WolframRes = [
  // 1 - Wolfram acos(0 + 0i)
  { re: Math.PI / 2, im: 0 },
  // 2 - Wolfram acos(+0 + 0i)
  { re: Math.PI / 2, im: 0 },
  // 3 - Wolfram acos(-0 + 0i)
  { re: Math.PI / 2, im: 0 },
  // 4 - Wolfram acos(1 + 0i)
  { re: 0, im: 0 },
  // 5 - Wolfram acos(-1 + 0i)
  { re: Math.PI, im: 0 },
  // 6 - Wolfram acos(0 + i)
  { re: 1.5707963267948966192313, im: -0.8813735870195430252326 },
  // 7 - Wolfram acos(0 - i)
  { re: 1.570796326794896619231, im: 0.88137358701954302523 },
  // 8 - Wolfram acos(30 + 0i)
  { re: 0, im: 4.0940666686320851276677 },
  // 9 - Wolfram acos(-30 + 0i)
  { re: 3.1415926535897932384626, im: -4.0940666686320851276677 },
  // 10 - Wolfram acos(∞ + i)
  { re: 0, im: Infinity },
  // 11 - Wolfram acos(∞ - i)
  { re: 0, im: Infinity },
  // 12 - Wolfram acos(NaN + i)
  { re: "?", im: "?" },
  // 13 - Wolfram acos(1e-154 + 1e-154i)
  { re: 1.57079632679489661923, im: -1e-154 },
  // 14 - Wolfram acos(1 + i)
  { re: 0.904556894302381364127, im: -1.06127506190503565203 },
  // 15 - Wolfram acos(-1 - i)
  { re: 2.237035759287411874335, im: 1.06127506190503565203 },
  // 16 - Wolfram acos(1 + 30i)
  { re: 1.5374937930188871128555, im: -4.09517654853799887099 },
  // 17 - verifies symmetry: acos(-z) = π - acos(z)
  { re: true, im: true },
  // 18 - Wolfram acos(1 + εi)
  { re: 1.490116119384766e-8, im: -1.490116119384766e-8 },
  // 19 - Wolfram acos(-1 - εi)
  { re: 3.14159263868863204461499, im: +1.49011611938476562544485e-8 },
  // 20 - Wolfram acos(0.5 + εi)
  { re: 1.047197551196597746154, im: -2.563950248511418477049e-16 },
  // 21 - Wolfram acos(0 + min i)
  { re: 1.57079632679489661923, im: -5e-324 },
  // 22 - Wolfram acos(0 + 1e10i)
  { re: 1.570796326794896619231, im: -23.718998110500402149599646668 },
  // 23 - Wolfram acos(ε + εi)
  { re: 1.5707963267948963971867, im: -2.220446049250313e-16 },
  // 24 - verifies symmetry: acos(-ε - εi) = π - acos(ε + εi)
  { re: true, im: true },
  // 25 - Wolfram acos(-1 + εi)
  { re: 3.14159263868863204461499, im: -1.49011611938476562544e-8 },
  // 26 - Wolfram acos(0.999 + 0.1*εi)
  { re: 0.044725087168733431249696, im: -4.9663100392403560548566e-16 },
  // 27 - Wolfram acos(min + min i)
  { re: 1.57079632679489661923, im: -5e-324 },
  // 28 - Wolfram acos(ε + 1e10i)
  { re: 1.57079632679489661923, im: -23.7189981105004021495996 },
  // 29 - Wolfram acos(1 - εi)
  { re: 1.490116119384766e-8, im: +1.490116119384766e-8 },
  // 30 - Wolfram acos(∞ + NaNi)
  { re: "?", im: "?" },
  // 31 - Wolfram: acos(1 + 1e-100i)
  { re: 1e-50, im: -1e-50 },
  // 32 - Wolfram acos(min + 1e10i)
  { re: 1.570796326794896619231, im: -23.71899811050040214959964 },
  // 33 - Wolfram acos(-min + 0i)
  { re: 1.57079632679489661923, im: 0 },
  // 34 - Wolfram acos(NaN + NaN i)
  { re: "?", im: "?" },
  // 35 - Wolfram acos(0.99999 + (EPSILON * 0.00001)i)
  { re: 0.00447213968178792717, im: -4.96508071921185975906e-19 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for acos(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.acos(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.acos(new Complex(test.re, test.im));
    console.log(
      `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
    );
    // Wolfram
    console.log(
      `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
    );
  } else if (typeof test.re === "boolean") {
    console.log(`mathjs  -> Test ${test.description} = ${test.re}`);
    console.log(`Complex -> Test ${test.description} = ${test.re}`);
    console.log(`Wolfram -> Test ${test.description} = ${test.re}`);
  }
}
