import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "tanh(0 + 0i)",
  },
  {
    // 2
    re: 1,
    im: 0,
    description: "tanh(1 + 0i)",
  },
  {
    // 3
    re: 0,
    im: Math.PI / 2,
    description: "tanh(0 + π/2i)",
  },
  {
    // 4
    re: 1,
    im: Math.PI / 2,
    description: "tanh(1 + π/2i)",
  },
  {
    // 5
    re: NaN,
    im: 0,
    description: "tanh(NaN + 0i)",
  },
  {
    // 6
    re: 0,
    im: NaN,
    description: "tanh(0 + NaNi)",
  },
  {
    // 7
    re: NaN,
    im: NaN,
    description: "tanh(NaN + NaNi)",
  },
  {
    // 8
    re: Infinity,
    im: 0,
    description: "tanh(∞ + 0i)",
  },
  {
    // 9
    re: -Infinity,
    im: 0,
    description: "tanh(-∞ + 0i)",
  },
  {
    // 10
    re: Infinity,
    im: Math.PI / 2,
    description: "tanh(∞ + π/2i)",
  },
  {
    // 11
    re: -Infinity,
    im: Math.PI / 2,
    description: "tanh(-∞ + π/2i)",
  },
  {
    // 12
    re: Infinity,
    im: 1,
    description: "tanh(∞ + 1i)",
  },
  {
    // 13
    re: 0,
    im: Infinity,
    description: "tanh(0 + ∞i)",
  },
  {
    // 14
    re: 1,
    im: Infinity,
    description: "tanh(1 + ∞i)",
  },
  {
    // 15
    re: Infinity,
    im: NaN,
    description: "tanh(∞ + NaNi)",
  },
  {
    // 16
    re: 1e-15,
    im: 0,
    description: "tanh(1e-15 + 0i)",
  },
  {
    // 17
    re: 1e-15,
    im: 1e-15,
    description: "tanh(1e-15 + 1e-15i)",
  },
  {
    // 18
    re: 0,
    im: Math.PI,
    description: "tanh(0 + πi)",
  },
  {
    // 19
    re: Math.PI / 4,
    im: 0,
    description: "tanh(π/4 + 0i)",
  },
  {
    // 20
    re: 0,
    im: Math.PI / 4,
    description: "tanh(0 + π/4i)",
  },
];

const WolframRes = [
  // 1 - Wolfram tanh(0 + 0i)
  { re: 0, im: 0 },
  // 2 - Wolfram tanh(1 + 0i)
  { re: 0.761594155955764888119458, im: 0 },
  // 3 - Wolfram tanh(0 + π/2i)
  { re: "∞^~", im: "∞^~" }, // -> Complex Infinity
  // 4 - Wolfram tanh(1 + π/2i)
  { re: 1.313035285499331303636, im: 0 },
  // 5 - Wolfram tanh(NaN + 0i) = NaN
  { re: "?", im: "?" },
  // 6 - Wolfram tanh(0 + NaNi) = NaN
  { re: "?", im: "?" },
  // 7 - Wolfram tanh(NaN + NaNi)
  { re: "?", im: "?" },
  // 8 - Wolfram tanh(∞ + 0i)
  { re: 1, im: 0 },
  // 9 - Wolfram tanh(-∞ + 0i)
  { re: -1, im: 0 },
  // 10 - Wolfram tanh(∞ + π/2i)
  { re: 1, im: "+/-0 (don't specify sign)" },
  // 11 - Wolfram tanh(-∞ + π/2i)
  { re: -1, im: "+/-0 (don't specify sign)" },
  // 12 - Wolfram tanh(∞ + i)
  { re: 1, im: 0 },
  // 13 - Wolfram tanh(0 + ∞i)
  { re: "?", im: "i <∞" },
  // 14 - Wolfram tanh(1 + ∞i)
  { re: "?", im: "i <∞" },
  // 15 - Wolfram tanh(∞ + NaNi)
  { re: "?", im: "?" },
  // 16 - Wolfram tanh(1e-15 + 0i)
  { re: 9.99999999999999999999e-16, im: 0 },
  // 17 - Wolfram tanh(1e-15 + 1e-15i)
  { re: 1.0e-15, im: 9.999999999999999999999e-16 },
  // 18 - Wolfram tanh(0 + πi)
  { re: 0, im: "+/-0 (ambiguous)" },
  // 19 - Wolfram tanh(π/4 + 0i)
  { re: 0.65579420263267243565, im: 0 },
  // 20 - Wolfram tanh(0 + π/4i)
  { re: 0, im: 1 },
  //   // 21 - Wolfram tanh(π/2 + 0i) = 1
  //   { re: 1, im: 0 },
  //   // 22 - Wolfram tanh(π + 0i) = ∞^~ (pole)
  //   { re: "∞^~", im: "∞^~" },
  //   // 23 - Wolfram tanh(π + i) ≈ 0 - 0.85091812823932154513i
  //   { re: 0, im: 0.85091812823932154513 },
  //   // 24 - Wolfram tanh(π/3 + 0i) = 2/√3 ≈ 1.154700538379251529018
  //   { re: 1.154700538379251529018, im: 0 },
  //   // 25 - Wolfram tanh(π/6 + 0i) = 2 + 0i.
  //   { re: 2, im: 0 },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for tanh(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.tanh(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.tanh(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  // Wolfram
  console.log(
    `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  );
}
