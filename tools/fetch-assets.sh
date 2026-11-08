#!/usr/bin/env sh
# Fetches the runtime files and sample heads the test page needs. They are not in git: the WASM
# runtimes come from npm packages already installed, the model from Hugging Face, the sample heads
# from their public repositories. Run once after `npm install`. Idempotent.
set -e
cd "$(dirname "$0")/.."
mkdir -p assets/ort assets/mediapipe assets/avatars assets/wav2arkit

# onnxruntime-web (MIT): single-thread WASM runtime, used by the Wav2ARKit extractor in a worker.
cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm \
   node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.mjs node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm assets/ort/

# MediaPipe tasks-vision (Apache-2.0): face landmarker runtime + model, for the parked webcam attention.
cp node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.js node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.wasm \
   node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_module_internal.js node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_module_internal.wasm assets/mediapipe/
[ -f assets/mediapipe/face_landmarker.task ] || curl -L -o assets/mediapipe/face_landmarker.task \
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

# Sample Gaussian-splat heads from gsplat-talkinghead (repo code MIT; the bundles' own licence is not
# stated upstream, so treat them as development samples only). Jane is the test page default.
for h in Jane Jack John Sasha; do
  [ -f "assets/avatars/$h.zip" ] || curl -L -o "assets/avatars/$h.zip" \
    "https://raw.githubusercontent.com/NavodPeiris/gsplat-talkinghead/main/gsplat-talkinghead/assets/$h.zip"
done

# Sample VRM (VRM Public License 1.0, VirtualCast) for the stylised renderer.
[ -f assets/avatars/Seed-san.vrm ] || curl -L -o assets/avatars/Seed-san.vrm \
  "https://raw.githubusercontent.com/vrm-c/vrm-specification/master/samples/Seed-san/vrm/Seed-san.vrm"

# The lip-sync model (Apache-2.0), downloaded and quantized to int8 by tools/fetch-model.sh.
[ -f assets/wav2arkit/wav2arkit_int8.onnx ] || sh tools/fetch-model.sh
echo "assets ready"
