import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "acoth(0 + 0i)",
  },
  {
    // 2
    re: 2,
    im: 0,
    description: "acoth(2 + 0i)",
  },
  {
    // 3
    re: -1,
    im: 0,
    description: "acoth(-1 + 0i)",
  },
  {
    // 4
    re: 1,
    im: 0,
    description: "acoth(1 + 0i)",
  },
  {
    // 5
    re: 0,
    im: 1,
    description: "acoth(0 + i)",
  },
  {
    // 6
    re: 0,
    im: 0.5,
    description: "acoth(0 + 0.5i)",
  },
  {
    // 7
    re: 1,
    im: 1,
    description: "acoth(1 + i)",
  },
  {
    // 8
    re: 30,
    im: 1,
    description: "acoth(30 + i)",
  },
  {
    // 9
    re: -30,
    im: 1,
    description: "acoth(-30 + i)",
  },
  {
    // 10
    re: 1,
    im: 30,
    description: "acoth(1 + 30i)",
  },
  {
    // 11
    re: Infinity,
    im: 1,
    description: "acoth(∞ + i)",
  },
  {
    // 12
    re: Infinity,
    im: -1,
    description: "acoth(∞ - i)",
  },
  {
    // 13
    re: NaN,
    im: 1,
    description: "acoth(NaN + i)",
  },
  {
    // 14
    re: 1e-154,
    im: 1e-154,
    description: "acoth(1e-154 + 1e-154i)",
  },
  {
    // 15
    re: -Infinity,
    im: 1,
    description: "acoth(-∞ + i)",
  },
  {
    // 16
    re: -Infinity,
    im: -1,
    description: "acoth(-∞ - i)",
  },
  {
    // 17
    re: 1,
    im: Infinity,
    description: "acoth(1 + ∞i)",
  },
  {
    // 18
    re: 1,
    im: -Infinity,
    description: "acoth(1 - ∞i)", // ε
  },
  {
    // 19
    re: Infinity,
    im: Infinity,
    description: "acoth(∞ + ∞i)",
  },
  {
    // 20
    re: Infinity,
    im: -Infinity,
    description: "acoth(∞ - ∞i)",
  },
  {
    // 21
    re: -Infinity,
    im: Infinity,
    description: "acoth(-∞ + ∞i)",
  },
  {
    // 22
    re: -Infinity,
    im: -Infinity,
    description: "acoth(-∞ - ∞i)",
  },
  {
    // 23
    re: Infinity,
    im: NaN,
    description: "acoth(∞ + NaNi)",
  },
  {
    // 24
    re: -Infinity,
    im: NaN,
    description: "acoth(-∞ + NaNi)",
  },
  {
    // 25
    re: NaN,
    im: Infinity,
    description: "acoth(NaN + ∞i)",
  },
  {
    // 26
    re: NaN,
    im: NaN,
    description: "acoth(NaN + NaNi)",
  },
  {
    // 27
    re: 1,
    im: Number.EPSILON,
    description: "acoth(1 + εi)",
  },
  {
    // 28
    re: -1,
    im: Number.EPSILON,
    description: "acoth(-1 + εi)",
  },
  {
    // 29
    re: Number.MIN_VALUE,
    im: Number.MIN_VALUE,
    description: "acoth(MIN_VALUE + MIN_VALUE i) <-> (MIN_VALUE = 5e-324)",
  },
  {
    // 30
    re: 1,
    im: 1e10,
    description: "acoth(1 + 1e10i)",
  },
  {
    // 31
    re: true,
    im: true,
    description: "verifies symmetry: acoth(-z) = -acoth(z) for z = 1 + 1i",
  },
];

const OctaveRes = [
  // 1 - Octave acoth(0 + 0i)
  { re: 0, im: NaN },
  // 2 - Octave acoth(2 + 0i)
  { re: 0.549306144334055, im: 0 },
  // 3 - Octave acoth(-1 + 0i)
  { re: -Infinity, im: 0 },
  // 4 - Octave acoth(1 + 0i)
  { re: Infinity, im: 0 },
  // 5 - Octave acoth(0 + i)
  { re: 0, im: -0.785398163397448 },
  // 6 - Octave acoth(0 + 0.5i)
  { re: 0, im: -1.10714871779409 },
  // 7 - Octave acoth(1 + i)
  { re: 0.402359478108525, im: -0.553574358897045 },
  // 8 - Octave acoth(30 + 1i)
  { re: 3.330860910584493e-2, im: -1.111109282127047e-3 },
  // 9 - Octave acoth(-30 + 1i)
  { re: -3.330860910584494e-2, im: -1.111109282127047e-3 },
  // 10 - Octave acoth(1 + 30i)
  { re: 1.108649266966437e-3, im: -3.32840818879119e-2 },
  // 11 - Octave acoth(∞ + i)
  { re: 0, im: 0 },
  // 12 - Octave acoth(∞ - i)
  { re: 0, im: 0 },
  // 13 - Octave acoth(NaN + i)
  { re: NaN, im: NaN },
  // 14 - Octave acoth(1e-154 + 1e-154i)
  { re: 1e-154, im: -1.570796326794897 },
  // 15 - Octave acoth(-∞ + i)
  { re: 0, im: 0 },
  // 16 - Octave acoth(-∞ - i)
  { re: 0, im: 0 },
  // 17 - Octave acoth(1 + ∞)
  { re: 0, im: 0 },
  // 18 - Octave acoth(1 - ∞i)
  { re: 0, im: 0 },
  // 19 - Octave acoth(∞ + ∞i)
  { re: 0, im: 0 },
  // 20 - Octave acoth(∞ - ∞i)
  { re: 0, im: 0 },
  // 21 - Octave acoth(-∞ + ∞i)
  { re: 0, im: 0 },
  // 22 - Octave acoth(-∞ - ∞i)
  { re: 0, im: 0 },
  // 23 - Octave acoth(∞ + NaNi)
  { re: 0, im: 0 },
  // 24 - Octave acoth(-∞ + NaNi)
  { re: 0, im: 0 },
  // 25 - Octave acoth(NaN + ∞i)
  { re: 0, im: 0 },
  // 26 - Octave acoth(NaN + NaNi)
  { re: NaN, im: NaN },
  // 27 - Octave acoth(1 + εi)
  { re: 1.836840028483855e1, im: -7.853981633974484e-1 },
  // 28 - Octave acoth(-1 + εi)
  { re: -1.836840028483855e1, im: -7.853981633974484e-1 },
  // 29 - Octave acoth(min + min i) -> min = 5e-324
  { re: 0, im: -1.570796326794897 },
  // 30 - Octave acoth(1 + 1e10i)
  { re: 1e-20, im: -1e-10 },
  // 31 - verifies symmetry: acoth(-z) = -acoth(z) for z = 1 + 1i
  { re: true, im: true },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for acoth(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.acoth(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.acoth(new Complex(test.re, test.im));
    console.log(
      `Complex -> Test ${test.description} = ${complexRes.re} + ${complexRes.im}i`
    );
    // Octave
    console.log(
      `Octave  -> Test ${test.description} = ${OctaveRes[i].re} + ${OctaveRes[i].im}i`
    );
  } else if (typeof test.re === "boolean") {
    console.log(`mathjs  -> Test ${test.description} = ${test.re}`);
    console.log(`Complex -> Test ${test.description} = ${test.re}`);
    console.log(`Octave -> Test ${test.description} = ${test.re}`);
  }
}

/**
 Octave results summary:

 octave:2> z = complex(0,0)
z =  0 + 0i
octave:3> acoth(z)
ans =    0 + NaNi
octave:4> z = complex(2,0)
z =  2 + 0i
octave:6> output_precision(16)
octave:8> acoth(z)
ans = 0.549306144334055
octave:9> z = complex(-1,0)
z = -1 + 0i
octave:10> acoth(z)
ans = -Inf
octave:11> z = complex(1,0)
z =  1 + 0i
octave:12> acoth(z)
ans = Inf
octave:13> z = complex(0,1)
z =  0 + 1i
octave:14> acoth(z)
ans =                  0 - 0.785398163397448i
octave:1> z = complex(0,0.5)
z =       0 + 0.5000i
octave:2> acoth(z)
ans =       0 - 1.1071i
octave:4> acoth(z)
ans =                  0 - 1.107148717794090i
octave:5> z = complex(1, 1)
z =  1 + 1i
octave:6> acoth(z)
ans =  0.402359478108525 - 0.553574358897045i
octave:7> z = complex(30, 1)
z =  30 +  1i
octave:8> acoth(z)
ans =  3.330860910584493e-02 - 1.111109282127047e-03i
octave:9> z = complex(-30, 1)
z = -30 +  1i
octave:10> acoth(z)
ans = -3.330860910584494e-02 - 1.111109282127047e-03i
octave:11> z = complex(1, 30)
z =   1 + 30i
octave:12> acoth(z)
ans =  1.108649266966437e-03 - 3.328408188791190e-02i
octave:13> z = complex(Inf, 1)
z =  Inf +   1i
octave:14> acoth(z)
ans = 0
octave:15> z = complex(Inf, -1)
z =  Inf -   1i
octave:16> acoth(z)
ans = 0
octave:17> z = complex(NaN, 1)
z =  NaN +   1i
octave:18> acoth(z)
ans =  NaN + NaNi
octave:19> z = complex(1e-154, 1e-154)
z =  1.000000000000000e-154 + 1.000000000000000e-154i
octave:20> acoth(z)
ans =  1.000000000000000e-154 -  1.570796326794897e+00i
octave:21> z = complex(-Inf, 1)
z = -Inf +   1i
octave:22> acoth(z)
ans = 0
octave:23> z = complex(-Inf, -1)
z = -Inf -   1i
octave:24> acoth(z)
ans = 0
octave:25> z = complex(1, Inf)
z =    1 + Infi
octave:26> acoth(z)
ans = 0
octave:27> z = complex(1, -Inf)
z =    1 - Infi
octave:28> acoth(z)
ans = 0
octave:29> z = complex(Inf, Inf)
z =  Inf + Infi
octave:30> acoth(z)
ans = 0
octave:31> z = complex(Inf, -Inf)
z =  Inf - Infi
octave:32> acoth(z)
ans = 0
octave:33> z = complex(-Inf, Inf)
z = -Inf + Infi
octave:34> acoth(z)
ans = 0
octave:35> z = complex(-Inf, -Inf)
z = -Inf - Infi
octave:36> acoth(z)
ans = 0
octave:37> z = complex(Inf, NaN)
z =  Inf + NaNi
octave:38> acoth(z)
ans = 0
octave:39> z = complex(-Inf, NaN)
z = -Inf + NaNi
octave:40> acoth(z)
ans = 0
octave:41> z = complex(NaN, Inf)
z =  NaN + Infi
octave:42> acoth(z)
ans = 0
octave:43> z = complex(NaN, NaN)
z =  NaN + NaNi
octave:44> z = complex(1, EPS)
octave:45> EPS = 2.220446049250313e-16
EPS = 2.220446049250313e-16
octave:46> z = complex(1, EPS)
z =  1.000000000000000e+00 + 2.220446049250313e-16i
octave:47> acoth(z)
ans =  1.836840028483855e+01 - 7.853981633974484e-01i
octave:48> z = complex(-1, EPS)
z = -1.000000000000000e+00 + 2.220446049250313e-16i
octave:49> acoth(z)
ans = -1.836840028483855e+01 - 7.853981633974484e-01i
octave:50> min = 5e-324
min = 4.940656458412465e-324
octave:51> z = complex(5e-324, 5e-324)
z =  4.940656458412465e-324 + 4.940656458412465e-324i
octave:56> z = complex(min, min)
z =  4.940656458412465e-324 + 4.940656458412465e-324i
octave:57> acoth(z)
ans =                  0 - 1.570796326794897i
octave:53> z = complex(1, 1e10)
z =            1 + 10000000000i
octave:54> acoth(z)
ans =  1.000000000000000e-20 - 1.000000000000000e-10i

 */
