import { defineConfig, defaultClientConditions } from 'vite';

// Browser build: everything bundled, nothing left as a bare import, so a page can load it
// straight from a URL with `import(url)` (the unoverse server serves this folder).
// The heavy parts (onnxruntime-web, the splat renderer, MediaPipe) stay dynamic imports,
// so they split into their own files and download only when used. Every chunk sits at the
// folder's top level, so `./assets/` resolves the same from each of them.
export default defineConfig({
  publicDir: false,
  define: { __AVATARZ_ASSET_ROOT__: JSON.stringify('./assets/') },
  // onnxruntime-web's default entry inlines its WASM (79 MB of JavaScript). This condition picks
  // the entry that fetches the WASM from `wasmPaths` instead, which is assets/ort, served beside.
  resolve: { conditions: ['onnxruntime-web-use-extern-wasm', ...defaultClientConditions] },
  build: {
    outDir: 'dist-browser',
    emptyOutDir: true,
    sourcemap: false,
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'avatarz.js' },
    rollupOptions: {
      output: { chunkFileNames: '[name]-[hash].js' },
    },
    target: 'es2022',
  },
});
