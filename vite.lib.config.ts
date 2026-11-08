import { defineConfig } from 'vite';

// Library build. three and three-vrm stay external (peer deps). The HeadAudio
// worklet, its model and the vendored main module are emitted into dist/assets
// and referenced with new URL(..., import.meta.url), so a host that serves
// dist/ serves everything from its own origin.
export default defineConfig({
  publicDir: false,
  define: { __AVATARZ_ASSET_ROOT__: JSON.stringify('./assets/') },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'avatarz.js' },
    rollupOptions: {
      external: [/^three/, /^@pixiv\/three-vrm/, /^@myned-ai\/gsplat-flame-avatar-renderer/, /^onnxruntime-web/, /^@mediapipe\/tasks-vision/],
    },
    target: 'es2022',
  },
});
