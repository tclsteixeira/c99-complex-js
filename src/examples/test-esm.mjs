// test-esm.mjs (ES Modules)
import { Complex } from "../../dist/c99-complex.esm.js";

const a = new Complex(2, 3);
const b = new Complex(1, -1);
const sum = a.add(b);

console.log(`(${a}) + (${b}) = ${sum}`);
