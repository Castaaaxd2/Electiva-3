---
name: BirdLens offline ML
description: How offline bird identification is implemented in BirdLens (TFLite + MobileNet V1).
---

## Model
- File: `artifacts/mobile/assets/models/mobilenet_v1_1.0_224_quant.tflite` (4.1 MB)
- Source: `https://storage.googleapis.com/download.tensorflow.org/models/tflite/mobilenet_v1_1.0_224_quant_and_labels.zip`
- Input: [1, 224, 224, 3] uint8 (0–255 pixel values, no normalization)
- Output: [1, 1001] uint8 (quantized probabilities)

## Inference library
- `react-native-fast-tflite` v3 (Nitro Modules) + `react-native-nitro-modules`
- **Requires EAS Build** — does NOT work in Expo Go or web preview
- API: `loadTensorflowModel(require('...'), [])` — second arg is delegates array (empty = CPU)
- Run: `model.runSync([inputArrayBuffer])` returns `ArrayBuffer[]`

## Image preprocessing
- `expo-image-manipulator` → resize to 224×224, JPEG, base64
- `base64-arraybuffer` → decode base64 to `ArrayBuffer`
- `jpeg-js` → decode JPEG to RGBA Uint8Array
- Manual RGBA→RGB strip → Uint8Array(150528) → `.buffer` as ArrayBuffer

## Species mapping
- `assets/models/bird_species_data.json` maps ImageNet indices to our 32 Colombian species + full species info
- Only ~50 ImageNet indices map to birds; mapping is best-effort by visual/taxonomic similarity
- Classifier: `lib/offlineBirdClassifier.ts`; exported via `lib/birdApi.ts`

## UI integration
- `useNetworkStatus().isOffline` controls which path runs in `handleAnalyzePress`
- Offline: green banner "Sin conexión — usando modelo local", button shows "Identificar offline"
- Online: normal API path via OpenAI

## Accuracy note
MobileNet V1 ImageNet covers only ~50 bird families. Specific Colombian species accuracy is limited.
**Why:** No custom-trained model is available yet. Swap `mobilenet_v1_1.0_224_quant.tflite` with student's trained `.tflite` model when ready. Keep the same 224×224 uint8 input contract.
