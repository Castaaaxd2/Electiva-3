# BirdLens — Servidor de Inferencia Python

Servidor Flask que expone tu modelo de predicción de aves como una API REST.

## Cómo conectar tu modelo (cuando termine el entrenamiento)

### 1. Copia tu archivo de pesos aquí
```
artifacts/model-server/
├── modelo.pt        ← PyTorch
├── modelo.h5        ← Keras / TensorFlow
└── modelo.pkl       ← scikit-learn
```

### 2. Edita `model.py`

**Define tus clases** — lista de nombres de especie en el mismo orden que usaste al entrenar:
```python
SPECIES_CLASSES = ["Columba livia", "Turdus merula", ...]
SPECIES_COMMON_NAMES = ["Paloma común", "Mirlo común", ...]
```

**Carga el modelo en `load_model()`** — descomenta el bloque de tu framework (PyTorch/Keras).

**Implementa `predict()`** — descomenta el bloque de tu framework y ajusta el preprocesamiento (resize, normalización) al que usaste en el entrenamiento.

### 3. Instala dependencias
```bash
pip install -r requirements.txt
# Descomenta tu framework en requirements.txt primero
```

### 4. Configura la variable de entorno en el API server
Añade en el entorno del servidor Express:
```
MODEL_SERVER_URL=http://localhost:5001
```

### 5. Arranca el servidor Python
```bash
python main.py
```

## Comportamiento automático

| Situación | Comportamiento |
|-----------|---------------|
| `MODEL_SERVER_URL` no configurado | Usa OpenAI para identificar (modo actual) |
| `MODEL_SERVER_URL` configurado, modelo responde | Usa tu modelo + OpenAI para descripción/hábitat |
| `MODEL_SERVER_URL` configurado, modelo falla | Fallback automático a OpenAI |

## Endpoint

`POST /predict`
```json
// Request
{ "imageBase64": "<imagen en base64>" }

// Response
{
  "topPrediction": { "species": "...", "commonName": "...", "scientificName": "...", "confidence": 87.5 },
  "allPredictions": [...]
}
```
