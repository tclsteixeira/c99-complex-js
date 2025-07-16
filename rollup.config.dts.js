import dts from "rollup-plugin-dts";

export default {
  input: "dist/types/c99-complex.d.ts", // Must match the tsc output
  output: [
    {
      file: "dist/c99-complex.d.ts",
      format: "es",
    },
  ],
  plugins: [dts()],
};
