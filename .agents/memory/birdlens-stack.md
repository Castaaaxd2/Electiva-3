---
name: BirdLens stack
description: Key architectural facts about the BirdLens mobile app project.
---

## App
- Expo SDK 54, React Native 0.81, New Architecture enabled
- 32 Colombian bird species (Universidad Cooperativa de Colombia)
- EAS Build project ID: `da24855b-aaa2-454e-aeb8-8f24389e0edc`, owner: `castaaaxd`
- GitHub repo: `https://github.com/Castaaaxd2/Electiva-3`

## Colors
- Primary: `#80BA27` (UCC green), Foreground: `#2C3E50` (navy)
- Background: `#F4F7F0`, SoftGreen: `#EBF3D9`

## Key files
- `app/(tabs)/index.tsx` — identify screen (camera/gallery + analyze button)
- `lib/birdApi.ts` — online (OpenAI) + offline (TFLite) identification
- `lib/offlineBirdClassifier.ts` — TFLite inference pipeline
- `context/BirdStore.tsx` — BirdResult interface + AsyncStorage history
- `components/SightingsMap.native.tsx` / `.tsx` — platform-specific map
- `assets/models/` — TFLite model + species data JSON

## API server
- Express 5, OpenAI vision (gpt-5.4) for bird identification
- 32-species DATASET_SPECIES list used in prompt
- Optional `MODEL_SERVER_URL` env var for custom Python model server

## Tabs: Identificar, Historial, Mapa, Catálogo
