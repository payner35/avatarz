import { defineConfig, type Plugin } from 'vite';
import { mkdirSync, createWriteStream } from 'node:fs';
import { join, basename } from 'node:path';

// Dev-only: the test page posts motion recordings here; they land in lab/recordings/.
function labPlugin(): Plugin {
  return {
    name: 'avatarz-lab',
    configureServer(server) {
      server.middlewares.use('/__lab/save', (req, res) => {
        const url = new URL(req.url ?? '', 'http://x');
        const name = basename(url.searchParams.get('name') ?? '');
        if (req.method !== 'POST' || !/^[\w.-]+\.(json|webm)$/.test(name)) { res.statusCode = 400; res.end('bad name'); return; }
        const dir = join(process.cwd(), 'lab', 'recordings');
        mkdirSync(dir, { recursive: true });
        const out = createWriteStream(join(dir, name));
        req.pipe(out).on('finish', () => { res.statusCode = 200; res.end(name); });
      });
    },
  };
}

// Demo / test page. `npm run dev` serves demo/index.html at /.
export default defineConfig({
  plugins: [labPlugin()],
  root: 'demo',
  publicDir: false,
  // No cross-origin isolation: multi-threaded WASM never started a session here (2026-11-08) and the
  // isolation headers break onnxruntime-web's proxy worker, which is the path that matters.
  server: { port: 5178, fs: { allow: ['..'] } },
  build: { outDir: '../dist-demo', emptyOutDir: true },
});
