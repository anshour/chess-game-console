import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'es2022',
  outDir: 'build',
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  bundle: true,
  platform: 'node',
});
