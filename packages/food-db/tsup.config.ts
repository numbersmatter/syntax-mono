import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  sourcemap: true,
  clean: true,
  dts: true,
  minify: false,
  format: ["esm", "cjs"],
  target: "node22",
  outDir: "dist",
});
