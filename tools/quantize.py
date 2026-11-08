"""Shrink wav2arkit_cpu.onnx (fp32, 402 MB external data) to an int8 dynamic-quantized single file.
Run: uv run --with onnx --with onnxruntime python tools/quantize.py
"""
import os, sys, time
import onnx
from onnxruntime.quantization import quantize_dynamic, QuantType
from onnxruntime.quantization.shape_inference import quant_pre_process

src_dir = os.path.join(os.path.dirname(__file__), '..', 'assets', 'wav2arkit')
src = os.path.join(src_dir, 'wav2arkit_cpu.onnx')
pre = os.path.join(src_dir, 'wav2arkit_pre.onnx')
out = os.path.join(src_dir, 'wav2arkit_int8.onnx')

t0 = time.time()
print('preprocess (shape inference + optimisation)...', flush=True)
try:
    quant_pre_process(src, pre, skip_symbolic_shape=True, save_as_external_data=True, all_tensors_to_one_file=True)
    model_in = pre
except Exception as e:  # noqa: BLE001
    print('preprocess failed, quantizing the raw graph:', e, flush=True)
    model_in = src
print('quantize int8 (dynamic, MatMul/Gemm weights)...', flush=True)
quantize_dynamic(model_in, out, weight_type=QuantType.QInt8, per_channel=False, reduce_range=False,
                 use_external_data_format=False)
m = onnx.load(out, load_external_data=False)
print('ok:', out, f'{os.path.getsize(out)/1e6:.1f} MB', f'{time.time()-t0:.0f}s', 'opset', [o.version for o in m.opset_import][:1], flush=True)
for f in (pre, pre + '.data', pre + '_data'):
    if os.path.exists(f): os.remove(f)
