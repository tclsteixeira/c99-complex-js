// test-esm.mjs (ES Modules)
// adjust path as needed
import { Complex } from "../../dist/c99-complex.esm.js";
// Instead if installed via NPM
// import { Complex } from 'c99-complex';

const a = new Complex(2, 3);
const b = new Complex(1, -1);
const sum = a.add(b);

console.log(`(${a}) + (${b}) = ${sum}`);
