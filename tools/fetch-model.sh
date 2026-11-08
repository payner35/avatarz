#!/usr/bin/env sh
# Downloads the fp32 wav2arkit model from Hugging Face (Apache-2.0) and quantizes it to int8.
# Result: assets/wav2arkit/wav2arkit_int8.onnx (101 MB), the file the extractor loads by default.
set -e
cd "$(dirname "$0")/../assets/wav2arkit"
for f in wav2arkit_cpu.onnx wav2arkit_cpu.onnx.data config.json README.md; do
  [ -f "$f" ] || curl -L -o "$f" "https://huggingface.co/myned-ai/wav2arkit_cpu/resolve/main/$f"
done
cd ../..
uv run --with onnx --with onnxruntime python tools/quantize.py
