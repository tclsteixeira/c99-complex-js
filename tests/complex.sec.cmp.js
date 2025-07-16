import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: Math.PI / 4,
    im: 0,
    description: "sec(π/4 + 0i)",
  },
  {
    // 2
    re: 0,
    im: 1,
    description: "sec(0 + i)",
  },
  {
    // 3
    re: 1,
    im: 1,
    description: "sec(1 + i)",
  },
  {
    // 4
    re: NaN,
    im: 0,
    description: "sec(NaN + 0i)",
  },
  {
    // 5
    re: 0,
    im: NaN,
    description: "sec(0 + NaNi)",
  },
  {
    // 6
    re: NaN,
    im: NaN,
    description: "sec(NaN + NaNi)",
  },
  {
    // 7
    re: Infinity,
    im: 0,
    description: "sec(∞ + 0i)",
  },
  {
    // 8
    re: 0,
    im: Infinity,
    description: "sec(0 + ∞i)",
  },
  {
    // 9
    re: Infinity,
    im: Infinity,
    description: "sec(∞ + ∞i)",
  },
  {
    // 10
    re: 1,
    im: 1e-15,
    description: "sec(1 + 1e-15i)",
  },
  {
    // 11
    re: -Math.PI / 4,
    im: 0,
    description: "sec(-π/4 + 0i)",
  },
  {
    // 12
    re: 0,
    im: -1,
    description: "sec(0 - i)",
  },
  {
    // 13
    re: Math.PI / 4,
    im: 1,
    description: "sec(π/4 + i)",
  },
  {
    // 14
    re: -Infinity,
    im: 0,
    description: "sec(-∞ + 0i)",
  },
  {
    // 15
    re: 1e-15,
    im: 0,
    description: "sec(1e-15 + 0i)",
  },
  {
    // 16
    re: 0,
    im: -Infinity,
    description: "sec(0 - ∞i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "sec(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 1,
    im: Infinity,
    description: "sec(1 + ∞i)",
  },
  {
    // 19
    re: Math.PI / 2,
    im: 0,
    description: "sec(π/2 + 0i)",
  },
  {
    // 20
    re: 1000 * Math.PI,
    im: 0,
    description: "sec(1000π + 0i)",
  },

  {
    // 21
    re: 0,
    im: 0,
    description: "sec(0 + 0i)",
  },
  {
    // 22
    re: Math.PI,
    im: 0,
    description: "sec(π + 0i)",
  },
  {
    // 23
    re: Math.PI / 2,
    im: 1,
    description: "sec(π/2 + 1i)",
  },
  {
    // 24
    re: Math.PI / 3,
    im: 0,
    description: "sec(π/3 + 0i)",
  },
];

const WolframRes = [
  // 1 - Wolfram sec(π / 4 + 0i) = sqrt(2)
  { re: Math.SQRT2, im: 0 },

  // 2 - Wolfram sec(0 + 1i) = 0.64805427366388539957
  { re: 0.64805427366388539957, im: 0 },

  // 3 - Wolfram sec(1 + 1i) = 0.49833703055518678521 + 0.59108384172104504805
  { re: 0.49833703055518678521, im: 0.59108384172104504805 },

  // 4 - Wolfram sec(NaN + 0i) =
  { re: "?", im: "?" },

  // 5 - Wolfram sec(0 + NaNi) =
  { re: "?", im: "?" },

  // 6 - Wolfram sec(NaN + NaNi)
  { re: "?", im: "?" },

  // 7 - Wolfram sec(∞ + 0i) = <-1, >1
  { re: "<-1, >1", im: "<-1, >1" },

  // 8 - Wolfram sec(0 + ∞i) = 0
  { re: 0, im: 0 },

  // 9 - Wolfram sec(∞ + ∞i) =
  { re: "?", im: "?" },

  // 10 - Wolfram sec(1 + 1e-15i)
  { re: 1.85081571768092561791, im: +2.88247469562898026657e-15 },

  // 11 - Wolfram sec(-π/4 + 0i) = sqrt(2)
  { re: Math.SQRT2, im: 0 },

  // 12 - Wolfram sec(0 - i) =
  { re: 0.64805427366388539957, im: 0 },

  // 13 - Wolfram sec(π/4 + i) =
  { re: 0.580045734134166491248, im: +0.44175944130365253172077 },

  // 14 - Wolfram sec(-∞ + 0i) = <-1, >1
  { re: "<-1, >1", im: "<-1, >1" },

  // 15 - Wolfram sec(1e-15 + 0i) =
  { re: 1.0, im: 0 },

  // 16 - Wolfram sec(0 - ∞i) = 0
  { re: 0, im: 0 },

  // 17 - Wolfram sec(1e-15 + 1e-15i) =
  { re: 0.999999999999999999999, im: +9.999999999999999999999e-31 },

  // 18 - Wolfram sec(1 + ∞i) = 0
  { re: 0, im: 0 },

  // 19 - Wolfram sec(π/2 + 0i) = ∞^~
  { re: "∞^~", im: "∞^~" },

  // 20 - Wolfram sec(1000π + 0i) = 1
  { re: 1, im: 0 },

  // 21 - Wolfram sec(0 + 0i) = 1
  { re: 1, im: 0 },

  // 22 - Wolfram sec(π + 0i) = -1
  { re: -1, im: 0 },

  // 23 - Wolfram sec(π/2 + 1i) =
  { re: 0, im: 0.85091812823932154513 },

  // 24 - Wolfram sec(π/3 + 0i) =
  { re: 2, im: 0 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for sec(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.sec(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.sec(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
