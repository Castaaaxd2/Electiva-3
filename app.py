        from flask import Flask, request, jsonify
        from flask_cors import CORS
        from tensorflow.keras.models import load_model
        import numpy as np
        from PIL import Image

        # 🔥 Crear app
        app = Flask(__name__)
        CORS(app)

        # 🔥 Cargar modelo
        modelo = load_model("modelo_aves.h5")

        # 🔥 LISTA DE LAS 32 ESPECIES (ORDEN IMPORTANTE)
        clases = [
            "canario costeño",
            "Caracara plancus",
            "Carpinterito Oliváceo",
            "Carpintero Coronirrojo",
            "Centzontle Tropical",
            "chulo",
            "Colibrí Cola Canela",
            "colibrí cola de raqueta",
            "copetón",
            "cucarachero común",
            "Eufonia Piquigruesa",
            "garza ganadera",
            "Garza Ganadera Occidental",
            "gavilan caminero",
            "golondrina azul y blanco",
            "Golondrina Yucateca",
            "Loro Cabeciazul",
            "Luis Bienteveo",
            "Mango Gorjinegro",
            "mirla patinaranja",
            "paloma domestica",
            "Papamoscas Rayado Chico",
            "perico carisucio",
            "Rascón Chiricote",
            "semillero común",
            "Tangara Azulegris",
            "tangara dorada",
            "Tirano Pirirí",
            "tordo negro",
            "tortolita común",
            "Vireón Cejas Canela",
            "Zorzal Sabiá"
        ]

        # 🔹 Ruta principal
        @app.route("/")
        def home():
            return "API de aves funcionando 🐦"

        # 🔹 Ruta de predicción
        @app.route("/predict", methods=["POST"])
        def predict():
            try:
                # 📸 Recibir imagen
                file = request.files["file"]

                # 🧠 Procesar imagen
                img = Image.open(file).convert("RGB")
                img = img.resize((224, 224))
                img = np.array(img) / 255.0
                img = np.expand_dims(img, axis=0)

                # 🔥 Predicción
                pred = modelo.predict(img)[0]

                # 🔝 Mejor resultado
                indice = np.argmax(pred)
                especie = clases[indice]
                confianza = float(pred[indice]) * 100

                # 📤 Respuesta
                return jsonify({
                    "especie": especie,
                    "confianza": f"{confianza:.2f}%"
                })

            except Exception as e:
                return jsonify({
                    "error": str(e)
                })

        # 🚀 Ejecutar servidor
        if __name__ == "__main__":
            app.run(host="0.0.0.0", port=3000)