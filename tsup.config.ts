import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/'],
  splitting: false,
  sourcemap: false,
  clean: true,
  platform: 'node',
  outDir: 'public/dist',
  format: ['cjs', 'esm', 'iife'],
  cjsInterop: true,
  dts: false
})
