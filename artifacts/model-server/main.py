"""
BirdLens — Servidor de inferencia para modelo de predicción de aves
====================================================================
Este servidor recibe imágenes en base64 y devuelve predicciones de especie.

INSTRUCCIONES PARA CONECTAR TU MODELO:
1. Coloca tu archivo de pesos en este directorio (ej: modelo.pt, modelo.h5)
2. Edita model.py para cargar tu modelo y definir las clases
3. ¡Listo! El servidor ya está cableado con la app móvil
"""

import os
import base64
import logging
from io import BytesIO

from flask import Flask, jsonify, request
from PIL import Image

from model import load_model, predict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Carga el modelo al iniciar el servidor (una sola vez)
logger.info("Cargando modelo...")
model = load_model()
logger.info("Modelo cargado correctamente")


@app.route("/healthz")
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


@app.route("/predict", methods=["POST"])
def predict_route():
    data = request.get_json(force=True)
    image_b64 = data.get("imageBase64")

    if not image_b64:
        return jsonify({"error": "imageBase64 es requerido"}), 400

    try:
        # Decodifica la imagen base64
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        logger.error(f"Error al decodificar imagen: {e}")
        return jsonify({"error": "Imagen inválida"}), 400

    try:
        result = predict(model, image)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error en predicción: {e}")
        return jsonify({"error": "Error en la predicción del modelo"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("MODEL_PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
