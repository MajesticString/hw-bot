import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  bundle: false,
  dts: false,
  entry: ['src/**/*.ts', '!src/**/*.d.ts'],
  format: ['esm'],
  minify: true,
  tsconfig: 'tsconfig.json',
  target: 'es2022',
  sourcemap: true,
  splitting: false,
  skipNodeModulesBundle: true,
  shims: false,
  keepNames: true,
});
