import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    re: 0,
    im: 0,
    description: "tan(0 + 0i)",
  },
  {
    re: Math.PI / 4,
    im: 0,
    description: "tan(π/4 + 0i)",
  },
  {
    re: 0,
    im: 1,
    description: "tan(0 + i)",
  },
  {
    re: 1,
    im: 1,
    description: "tan(1 + i)",
  },
  {
    re: NaN,
    im: 0,
    description: "tan(NaN + 0i)",
  },
  {
    re: 0,
    im: NaN,
    description: "tan(0 + NaNi)",
  },
  {
    re: NaN,
    im: NaN,
    description: "tan(NaN + NaNi)",
  },
  {
    re: Infinity,
    im: 0,
    description: "tan(∞ + 0i)",
  },
  {
    re: 0,
    im: Infinity,
    description: "tan(0 + ∞i)",
  },
  {
    re: Infinity,
    im: Infinity,
    description: "tan(∞ + ∞i)",
  },
  {
    re: 1,
    im: 1e-15,
    description: "tan(1 + 1e-15i)",
  },
  {
    re: -Math.PI / 4,
    im: 0,
    description: "tan(-π/4 + 0i)",
  },
  {
    re: 0,
    im: -1,
    description: "tan(0 - i)",
  },
  {
    re: Math.PI / 4,
    im: 1,
    description: "tan(π/4 + i)",
  },
  {
    re: -Infinity,
    im: 0,
    description: "tan(-∞ + 0i)",
  },
  {
    re: 1e-15,
    im: 0,
    description: "tan(1e-15 + 0i)",
  },
  {
    re: 0,
    im: -Infinity,
    description: "tan(0 - ∞i)",
  },
  {
    re: 1e-15,
    im: 1e-15,
    description: "tan(1e-15 + 1e-15i)",
  },
  {
    re: 1,
    im: Infinity,
    description: "tan(1 + ∞i)",
  },
  {
    re: 1000 * Math.PI,
    im: 0,
    description: "tan(1000π + 0i)",
  },
  {
    re: Math.PI / 2,
    im: 0,
    description: "tan(π / 2 + 0i)",
  },
  {
    re: -Math.PI / 2,
    im: 0,
    description: "tan(-π/2 + 0i)",
  },
  {
    re: Math.PI / 2,
    im: Infinity,
    description: "tan(π/2 + ∞i)",
  },
];
/*
const WolframRes = [
  // Wolfram tan(0 + 0i) = 
  { re: , im:  },

  // Wolfram tan(π / 4 + 0i) = -
  { re: , im:  },

  // Wolfram tan(0 + 1i) = Undefined
  { re: , im:  },

  // Wolfram tan(0 + 1i) = 
  { re: , im:  },

  // Wolfram tan(1 + 1i) = 
  { re: , im:  },

  // Wolfram tan(NaN + 0i) = 
  { re: , im:  },

  // Wolfram tan(0 + NaNi) =
  { re: , im:  },

  // Wolfram tan(NaN + NaNi) 
  { re: , im:  },

  // Wolfram tan(∞ + 0i) = 
  { re: , im:  },

  // Wolfram tan(0 + ∞i) = 
  { re: 0, im: 1 },

  // Wolfram exp(∞ + ∞i) =
  { re: , im:  },

  // Wolfram tan(1 + 1e-15i) 
  { re: , im:  },

  // Wolfram tan(-π / 4 + 0i) =
  { re: Infinity, im: 0 },

  // Wolfram tan(0 - i) =
  { re: Infinity, im: 0 },

  // Wolfram tan(π / 4 + i) =
  { re: , im: },

  // Wolfram tan(-∞-+ 0i) =
  { re: , im:  },
  
  // Wolfram tan(1e-15 + oi) =
  { re: , im:  },
  
  // Wolfram tan(0 - ∞i) =
  { re: 0, im: -1 },
  
  // Wolfram tan(1e-15 + 1e-15i) =
  { re: 1e-15, im: 1e-15 },
  
  // Wolfram tan(1 + ∞i) =
  { re: 0, im: 1 },
  
  // Wolfram tan(1000π + 0i) =
  { re: , im:  },
  
  // Wolfram tan(π/2 + 0i) =
  { re: , im:  },
  
  // Wolfram tan(-π/2 + 0i) =
  { re: , im:  },
  
// Wolfram tan(π/2 + ∞i) =
  { re: , im:  },
  
];
*/

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for tan(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  // mathjs test
  mathjsRes = math.tan(math.complex(test.re, test.im));
  console.log(
    `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
  );

  // Complex test
  complexRes = Complex.tan(new Complex(test.re, test.im));
  console.log(
    `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
  );

  //   // Wolfram
  //   console.log(
  //     `Wolfram -> Test ${test.description} = ${WolframRes[i].re} + ${WolframRes[i].im}i`
  //   );
}
