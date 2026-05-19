"""
model.py — Aquí conectas tu modelo entrenado
============================================

PASOS:
1. Copia tu archivo de pesos aquí (ej: modelo.pt para PyTorch, modelo.h5 para Keras)
2. En load_model(): carga tu modelo con sus pesos
3. En predict(): aplica el preprocesamiento que usaste durante el entrenamiento
4. Ajusta SPECIES_CLASSES con los nombres de tus clases en el mismo orden del entrenamiento

El servidor ya maneja la decodificación base64 → PIL.Image por ti.
Recibirás un objeto PIL.Image en RGB listo para procesar.
"""

import os
import numpy as np
from PIL import Image

# ─────────────────────────────────────────────────────────────────────────────
# PASO 1: Define las clases de tu modelo (deben coincidir con el orden
#         en que entrenaste, ej. el índice 0 → primera especie, etc.)
# ─────────────────────────────────────────────────────────────────────────────
SPECIES_CLASSES = [
    # Reemplaza esta lista con las clases reales de tu dataset
    # Ejemplo:
    # "Columba livia",        # Paloma común
    # "Turdus merula",        # Mirlo común
    # "Passer domesticus",    # Gorrión común
    # "Hirundo rustica",      # Golondrina común
    # ...
    "Especie desconocida",  # placeholder hasta que definas tus clases
]

# Nombres comunes en español (mismo orden que SPECIES_CLASSES)
SPECIES_COMMON_NAMES = [
    # Ejemplo:
    # "Paloma común",
    # "Mirlo común",
    # "Gorrión común",
    # "Golondrina común",
    # ...
    "Especie desconocida",  # placeholder
]

# ─────────────────────────────────────────────────────────────────────────────
# PASO 2: Carga tu modelo
# ─────────────────────────────────────────────────────────────────────────────
def load_model():
    """
    Carga tu modelo con sus pesos entrenados.
    Descomenta el bloque correspondiente a tu framework.
    """

    # ── PyTorch ──────────────────────────────────────────────────────────────
    # import torch
    # model = torch.load("modelo.pt", map_location="cpu")
    # model.eval()
    # return model

    # ── TensorFlow / Keras ───────────────────────────────────────────────────
    # import tensorflow as tf
    # model = tf.keras.models.load_model("modelo.h5")
    # return model

    # ── Scikit-learn (clasificador con features) ──────────────────────────────
    # import pickle
    # with open("modelo.pkl", "rb") as f:
    #     model = pickle.load(f)
    # return model

    # PLACEHOLDER: mientras el modelo está en entrenamiento
    # Retorna None — el Express API usará OpenAI como fallback
    return None


# ─────────────────────────────────────────────────────────────────────────────
# PASO 3: Implementa la inferencia
# ─────────────────────────────────────────────────────────────────────────────
def predict(model, image: Image.Image) -> dict:
    """
    Recibe un PIL.Image en RGB y devuelve las predicciones.

    Parámetros
    ----------
    model   : tu modelo cargado (lo que retornó load_model)
    image   : PIL.Image.Image en modo RGB

    Retorno esperado (dict)
    -----------------------
    {
        "topPrediction": {
            "species": "nombre_común",
            "commonName": "Nombre común completo",
            "scientificName": "Nombre científico",
            "confidence": 87.5        # porcentaje 0-100
        },
        "allPredictions": [
            { "species": ..., "commonName": ..., "scientificName": ..., "confidence": ... },
            ...                         # top-3 o top-5 sugerido
        ]
    }
    """

    if model is None:
        raise RuntimeError("Modelo no cargado — aún en entrenamiento")

    # ── PyTorch ──────────────────────────────────────────────────────────────
    # import torch
    # import torchvision.transforms as T
    #
    # transform = T.Compose([
    #     T.Resize((224, 224)),
    #     T.ToTensor(),
    #     T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    # ])
    # tensor = transform(image).unsqueeze(0)   # [1, C, H, W]
    # with torch.no_grad():
    #     logits = model(tensor)
    #     probs = torch.softmax(logits, dim=1)[0].numpy()

    # ── TensorFlow / Keras ───────────────────────────────────────────────────
    # import tensorflow as tf
    #
    # img = image.resize((224, 224))
    # arr = np.array(img, dtype=np.float32) / 255.0
    # arr = np.expand_dims(arr, axis=0)           # [1, H, W, C]
    # probs = model.predict(arr)[0]               # array de probabilidades

    # ── Una vez que tengas `probs` (array numpy de probabilidades por clase):
    # top_indices = np.argsort(probs)[::-1][:5]  # top-5
    # predictions = []
    # for idx in top_indices:
    #     predictions.append({
    #         "species": SPECIES_COMMON_NAMES[idx],
    #         "commonName": SPECIES_COMMON_NAMES[idx],
    #         "scientificName": SPECIES_CLASSES[idx],
    #         "confidence": round(float(probs[idx]) * 100, 2),
    #     })
    # return {
    #     "topPrediction": predictions[0],
    #     "allPredictions": predictions,
    # }

    raise NotImplementedError("Implementa la función predict() con tu modelo")
