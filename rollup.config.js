import terser from "@rollup/plugin-terser";

export default {
  input: "src/c99-complex.js",
  output: [
    {
      file: "dist/c99-complex.esm.js",
      format: "es",
      exports: "named",
    },
    {
      file: "dist/c99-complex.min.js",
      format: "iife",
      name: "C99Complex",
      exports: "auto",
      plugins: [terser()], // minify only the .min.js output
    },
  ],
  plugins: [
    // No terser here; only on the minified output above
  ],
};
