import { Complex } from "../src/c99-complex.js";
import * as math from "mathjs";

const tests = [
  {
    // 1
    re: 0,
    im: 0,
    description: "atanh(0 + 0i)",
  },
  {
    // 2
    re: 0.5,
    im: 0,
    description: "atanh(0.5 + 0i)",
  },
  {
    // 3
    re: -1,
    im: 0,
    description: "atanh(-1 + 0i)",
  },
  {
    // 4
    re: 1,
    im: 0,
    description: "atanh(1 + 0i)",
  },
  {
    // 5
    re: 0,
    im: 1,
    description: "atanh(0 + i)",
  },
  {
    // 6
    re: 0,
    im: 0.5,
    description: "atanh(0 + 0.5i)",
  },
  {
    // 7
    re: 1,
    im: 1,
    description: "atanh(1 + i)",
  },
  {
    // 8
    re: 30,
    im: 1,
    description: "atanh(30 + i)",
  },
  {
    // 9
    re: -30,
    im: 1,
    description: "atanh(-30 + i)",
  },
  {
    // 10
    re: 1,
    im: 30,
    description: "atanh(1 + 30i)",
  },
  {
    // 11
    re: Infinity,
    im: 1,
    description: "atanh(∞ + i)",
  },
  {
    // 12
    re: Infinity,
    im: -1,
    description: "atanh(∞ - i)",
  },
  {
    // 13
    re: NaN,
    im: 1,
    description: "atanh(NaN + i)",
  },
  {
    // 14
    re: 1e-154,
    im: 1e-154,
    description: "atanh(1e-154 + 1e-154i)",
  },
  {
    // 15
    re: -Infinity,
    im: 1,
    description: "atanh(-∞ + i)",
  },
  {
    // 16
    re: -Infinity,
    im: -1,
    description: "atanh(-∞ - i)",
  },
  {
    // 17
    re: 1,
    im: Infinity,
    description: "atanh(1 + ∞i)",
  },
  {
    // 18
    re: 1,
    im: -Infinity,
    description: "atanh(1 - ∞i)", // ε
  },
  {
    // 19
    re: Infinity,
    im: Infinity,
    description: "atanh(∞ + ∞i)",
  },
  {
    // 20
    re: Infinity,
    im: -Infinity,
    description: "atanh(∞ - ∞i)",
  },
  {
    // 21
    re: -Infinity,
    im: Infinity,
    description: "atanh(-∞ + ∞i)",
  },
  {
    // 22
    re: -Infinity,
    im: -Infinity,
    description: "atanh(-∞ - ∞i)",
  },
  {
    // 23
    re: Infinity,
    im: NaN,
    description: "atanh(∞ + NaNi)",
  },
  {
    // 24
    re: -Infinity,
    im: NaN,
    description: "atanh(-∞ + NaNi)",
  },
  {
    // 25
    re: NaN,
    im: Infinity,
    description: "atanh(NaN + ∞i)",
  },
  {
    // 26
    re: NaN,
    im: NaN,
    description: "atanh(NaN + NaNi)",
  },
  {
    // 27
    re: 1,
    im: Number.EPSILON,
    description: "atanh(1 + εi)",
  },
  {
    // 28
    re: -1,
    im: Number.EPSILON,
    description: "atanh(-1 + εi)",
  },
  {
    // 29
    re: Number.MIN_VALUE,
    im: Number.MIN_VALUE,
    description: "atanh(MIN_VALUE + MIN_VALUE i)",
  },
  {
    // 30
    re: 1,
    im: 1e10,
    description: "atanh(1 + 1e10i)",
  },
  {
    // 31
    re: true,
    im: true,
    description: "verifies symmetry: atanh(-z) = -atanh(z) for z = 1 + 1i",
  },
];

const OctaveRes = [
  // 1 - Octave atanh(0 + 0i)
  { re: 0, im: 0 },
  // 2 - Octave atanh(0.5 + 0i)
  { re: 0.549306144334055, im: 0 },
  // 3 - Octave atanh(-1 + 0i)
  { re: -Infinity, im: 0 },
  // 4 - Octave atanh(1 + 0i)
  { re: Infinity, im: 0 },
  // 5 - Octave atanh(0 + i)
  { re: 0, im: 0.785398163397448 },
  // 6 - Octave atanh(0 + 0.5i)
  { re: 0, im: 0.463647609000806 },
  // 7 - Octave atanh(1 + i)
  { re: 0.402359478108525, im: 1.017221967897851 },
  // 8 - Octave atanh(30 + 1i)
  { re: 3.330860910584494e-2, im: 1.56968521751277 },
  // 9 - Octave atanh(-30 + 1i)
  { re: -3.330860910584494e-2, im: 1.56968521751277 },
  // 10 - Octave atanh(1 + 30i)
  { re: 1.108649266966437e-3, im: 1.537512244906985 },
  // 11 - Octave atanh(∞ + i)
  { re: 0, im: 1.570796326794897 },
  // 12 - Octave atanh(∞ - i)
  { re: 0, im: -1.570796326794897 },
  // 13 - Octave atanh(NaN + i)
  { re: NaN, im: NaN },
  // 14 - Octave atanh(1e-154 + 1e-154i)
  { re: 1e-154, im: +1e-154 },
  // 15 - Octave atanh(-∞ + i)
  { re: 0, im: 1.570796326794897 },
  // 16 - Octave atanh(-∞ - i)
  { re: 0, im: -1.570796326794897 },
  // 17 - Octave atanh(1 + ∞)
  { re: 0, im: 1.570796326794897 },
  // 18 - Octave atanh(1 - ∞i)
  { re: 0, im: -1.570796326794897 },
  // 19 - Octave atanh(∞ + ∞i)
  { re: 0, im: 1.570796326794897 },
  // 20 - Octave atanh(∞ - ∞i)
  { re: 0, im: -1.570796326794897 },
  // 21 - Octave atanh(-∞ + ∞i)
  { re: 0, im: 1.570796326794897 },
  // 22 - Octave atanh(-∞ - ∞i)
  { re: 0, im: -1.570796326794897 },
  // 23 - Octave atanh(∞ + NaNi)
  { re: Infinity, im: NaN },
  // 24 - Octave atanh(-∞ + NaNi)
  { re: Infinity, im: NaN },
  // 25 - Octave atanh(NaN + ∞i)
  { re: 0, im: 1.570796326794897 },
  // 26 - Octave atanh(NaN + NaNi)
  { re: NaN, im: NaN },
  // 27 - Octave atanh(1 + εi)
  { re: 1.836840028483855e1, im: 7.853981633974484e-1 },
  // 28 - Octave atanh(-1 + εi)
  { re: -1.836840028483855e1, im: 7.853981633974484e-1 },
  // 29 - Octave atanh(min + min i)
  { re: 4.940656458412465e-324, im: 4.940656458412465e-324 },
  // 30 - Octave atanh(1 + 1e10i)
  { re: 9.999999999999999e-21, im: 1.570796326694897 },
  // 31 - verifies symmetry: atanh(-z) = -atanh(z) for z = 1 + 1i
  { re: true, im: true },
];

let mathjsRes, complexRes;
console.log(
  "\n--------------------------------------------------" +
    "\nComparing results for atanh(z) for all test cases" +
    "\n--------------------------------------------------"
);

// Execute tests
for (const [i, test] of tests.entries()) {
  console.log("\nTest" + (i + 1) + " ----");

  if (typeof test.re === "number") {
    // mathjs test
    mathjsRes = math.atanh(math.complex(test.re, test.im));
    console.log(
      `mathjs  -> Test ${test.description} = ${mathjsRes.re} + ${mathjsRes.im}i`
    );
    // Complex test
    complexRes = Complex.atanh(new Complex(test.re, test.im));
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
 * Gnu Octave results:
 * 
 * octave:4> z = complex(0, 0)
z =  0 + 0i
octave:5> atanh(z)
ans = 0
octave:6> z = complex(0.5, 0)
z =  0.5000 +      0i
octave:7> output_precision(16)
octave:8> atanh(z)
ans = 0.549306144334055
octave:9> z = complex(-1, 0)
z = -1 + 0i
octave:10> atanh(z)
ans = -Inf
octave:11> z = complex(1, 0)
z =  1 + 0i
octave:12> atanh(z)
ans = Inf
octave:13> z = complex(0, 1)
z =  0 + 1i
octave:14> atanh(z)
ans =                  0 + 0.785398163397448i
octave:15> z = complex(0, 0.5)
z =                  0 + 0.500000000000000i
octave:16> atanh(z)
ans =                  0 + 0.463647609000806i
octave:17> z = complex(1, 1)
z =  1 + 1i
octave:18> atanh(z)
ans =  0.402359478108525 + 1.017221967897851i
octave:19> z = complex(30, 1)
z =  30 +  1i
octave:20> atanh(z)
ans =  3.330860910584494e-02 + 1.569685217512770e+00i
octave:21> z = complex(-30, 1)
z = -30 +  1i
octave:22> atanh(z)
ans = -3.330860910584494e-02 + 1.569685217512770e+00i
octave:23> z = complex(1, 30)
z =   1 + 30i
octave:24> atanh(z)
ans =  1.108649266966437e-03 + 1.537512244906985e+00i
octave:25> z = complex(Inf, 1)
z =  Inf +   1i
octave:26> atanh(z)
ans =                  0 + 1.570796326794897i
octave:27> z = complex(Inf, -1)
z =  Inf -   1i
octave:28> atanh(z)
ans =                  0 - 1.570796326794897i
octave:29> z = complex(NaN, 1)
z =  NaN +   1i
octave:30> atanh(z)
ans =  NaN + NaNi
octave:31> z = complex(1e-154, 1e-154)
z =  1.000000000000000e-154 + 1.000000000000000e-154i
octave:32> atanh(z)
ans =  1.000000000000000e-154 + 1.000000000000000e-154i
octave:33> z = complex(-Inf, 1)
z = -Inf +   1i
octave:34> atanh(z)
ans =                  0 + 1.570796326794897i
NOTICE: Due to inactivity, your session will expire in five minutes.
octave:35> z = complex(-Inf, -1)
z = -Inf -   1i
octave:36> atanh(z)
ans =                  0 - 1.570796326794897i
octave:37> z = complex(1, Inf)
z =    1 + Infi
octave:38> atanh(z)
ans =                  0 + 1.570796326794897i
octave:39> z = complex(1, -Inf)
z =    1 - Infi
octave:40> atanh(z)
ans =                  0 - 1.570796326794897i
octave:41> z = complex(Inf, Inf)
z =  Inf + Infi
octave:42> atanh(z)
ans =                  0 + 1.570796326794897i
octave:43> z = complex(Inf, -Inf)
z =  Inf - Infi
octave:44> atanh(z)
ans =                  0 - 1.570796326794897i
octave:45> z = complex(-Inf, Inf)
z = -Inf + Infi
octave:46> atanh(z)
ans =                  0 + 1.570796326794897i
octave:47> z = complex(-Inf, -Inf)
z = -Inf - Infi
octave:48> atanh(z)
ans =                  0 - 1.570796326794897i
octave:49> z = complex(Inf, NaN)
z =  Inf + NaNi
octave:50> z = complex(-Inf, NaN)
z = -Inf + NaNi
octave:51> z = complex(Inf, NaN)
z =  Inf + NaNi
octave:52> z = complex(NaN, Inf)
z =  NaN + Infi
octave:53> atanh(z)
ans =                  0 + 1.570796326794897i
octave:54> z = complex(NaN, NaN)
z =  NaN + NaNi
octave:55> EPS = 2.220446049250313e-16
EPS = 2.220446049250313e-16
octave:56> z = complex(1, EPS)
z =  1.000000000000000e+00 + 2.220446049250313e-16i
octave:57> atanh(z)
ans =  1.836840028483855e+01 + 7.853981633974484e-01i
octave:58> z = complex(-1, EPS)
z = -1.000000000000000e+00 + 2.220446049250313e-16i
octave:59> atanh(z)
ans = -1.836840028483855e+01 + 7.853981633974484e-01i
octave:60> min = 5e-324
min = 4.940656458412465e-324
octave:61> z = complex(min, min)
z =  4.940656458412465e-324 + 4.940656458412465e-324i
octave:62> atanh(z)
ans =  4.940656458412465e-324 + 4.940656458412465e-324i
octave:63> z = complex(1, 1e10)
z =            1 + 10000000000i
octave:64> atanh(z)
ans =  9.999999999999999e-21 + 1.570796326694897e+00i
 */
