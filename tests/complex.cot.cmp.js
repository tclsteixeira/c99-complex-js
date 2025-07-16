import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: Math.PI / 4,
    im: 0,
    description: "cot(π/4 + 0i)",
  },
  {
    // 2
    re: 0,
    im: 1,
    description: "cot(0 + i)",
  },
  {
    // 3
    re: 1,
    im: 1,
    description: "cot(1 + i)",
  },
  {
    // 4
    re: NaN,
    im: 0,
    description: "cot(NaN + 0i)",
  },
  {
    // 5
    re: 0,
    im: NaN,
    description: "cot(0 + NaNi)",
  },
  {
    // 6
    re: NaN,
    im: NaN,
    description: "cot(NaN + NaNi)",
  },
  {
    // 7
    re: Infinity,
    im: 0,
    description: "cot(∞ + 0i)",
  },
  {
    // 8
    re: 0,
    im: Infinity,
    description: "cot(0 + ∞i)",
  },
  {
    // 9
    re: Infinity,
    im: Infinity,
    description: "cot(∞ + ∞i)",
  },
  {
    // 10
    re: 1,
    im: 1e-15,
    description: "cot(1 + 1e-15i)",
  },
  {
    // 11
    re: -Math.PI / 4,
    im: 0,
    description: "cot(-π/4 + 0i)",
  },
  {
    // 12
    re: 0,
    im: -1,
    description: "cot(0 - i)",
  },
  {
    // 13
    re: Math.PI / 4,
    im: 1,
    description: "cot(π/4 + i)",
  },
  {
    // 14
    re: -Infinity,
    im: 0,
    description: "cot(-∞ + 0i)",
  },
  {
    // 15
    re: 1e-15,
    im: 0,
    description: "cot(1e-15 + 0i)",
  },
  {
    // 16
    re: 0,
    im: -Infinity,
    description: "cot(0 - ∞i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "cot(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 1,
    im: Infinity,
    description: "cot(1 + ∞i)",
  },
  {
    // 19
    re: Math.PI / 2,
    im: 0,
    description: "cot(π/2 + 0i)",
  },
  {
    // 20
    re: 1000 * Math.PI,
    im: 0,
    description: "cot(1000π + 0i)",
  },

  {
    // 21
    re: 0,
    im: 0,
    description: "cot(0 + 0i)",
  },
  {
    // 22
    re: Math.PI,
    im: 0,
    description: "cot(π + 0i)",
  },
  {
    // 23
    re: Math.PI / 2,
    im: Infinity,
    description: "cot(π/2 + ∞i)",
  },
];

const WolframRes = [
  // 1 - Wolfram cot(π / 4 + 0i) = -
  { re: 1, im: 0 },

  // 2 - Wolfram cot(0 + 1i) = Undefined
  { re: 0, im: -1.3130352854993313036 },

  // 3 - Wolfram cot(1 + 1i) =
  { re: 0.2176215618544026813, im: -0.8680141428959249486 },

  // 4 - Wolfram cot(NaN + 0i) =
  { re: "?", im: "?" },

  // 5 - Wolfram cot(0 + NaNi) =
  { re: "?", im: "?" },

  // 6 - Wolfram cot(NaN + NaNi)
  { re: "?", im: "?" },

  // 7 - Wolfram cot(∞ + 0i) = [-∞..+∞]
  { re: "[-∞..+∞]", im: "[-∞..+∞]" },

  // 8 - Wolfram cot(0 + ∞i) = -i
  { re: 0, im: -1 },

  // 9 - Wolfram exp(∞ + ∞i) =
  { re: "?", im: "?" },

  // 10 - Wolfram cot(1 + 1e-15i)
  { re: 0.642092615934330703006, im: -1.412282927437391914609e-15 },

  // 11 - Wolfram cot(-π/4 + 0i) =
  { re: -1, im: 0 },

  // 12 - Wolfram cot(0 - i) =
  { re: 0, im: 1.313035285499331303636 },

  // 13 - Wolfram cot(π/4 + i) =
  { re: 0.26580222883407969212, im: -0.9640275800758168839 },

  // 14 - Wolfram cot(-∞ + 0i) =
  { re: "[-∞..+∞]", im: "[-∞..+∞]" },

  // 15 - Wolfram cot(1e-15 + oi) =
  { re: 9.99999999999999999999e14, im: 0 },

  // 16 - Wolfram cot(0 - ∞i) =
  { re: 0, im: -1 },

  // 17 - Wolfram cot(1e-15 + 1e-15i) =
  { re: 5e14, im: -5e14 },

  // 18 - Wolfram cot(1 + ∞i) =
  { re: 0, im: -1 },

  // 19 - Wolfram cot(π/2 + 0i) =
  { re: 0, im: 0 },

  // 20 - Wolfram cot(1000π + 0i) =
  { re: "∞^~", im: "∞^~" },

  // 21 - Wolfram cot(0 + 0i) =
  { re: "∞^~", im: "∞^~" },

  // 22 - Wolfram cot(π + 0i) =
  { re: "∞^~", im: "∞^~" },

  // 23 - Wolfram cot(π/2 + ∞i) =
  { re: 0, im: -1 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for cot(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.cot(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.cot(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
