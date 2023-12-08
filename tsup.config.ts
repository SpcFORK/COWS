import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/'],
  splitting: false,
  sourcemap: false,
  clean: true,
  platform: 'neutral',
  outDir: 'public/dist',
  dts: true,
  format: ['cjs', 'esm', 'iife']
})
