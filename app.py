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
            "Canario costeño",
            "Caracara plancus",
            "Carpinterito Oliváceo",
            "Carpintero Coronirrojo",
            "Centzontle Tropical",
            "Chulo",
            "Colibrí Cola Canela",
            "colibrí cola de raqueta",
            "Copetón",
            "Cucarachero común",
            "Eufonia Piquigruesa",
            "Garza ganadera",
            "Garza Ganadera Occidental",
            "Gavilan caminero",
            "Golondrina azul y blanco",
            "Golondrina Yucateca",
            "Loro Cabeciazul",
            "Luis Bienteveo",
            "Mango Gorjinegro",
            "Mirla patinaranja",
            "Paloma domestica",
            "Papamoscas Rayado Chico",
            "Perico carisucio",
            "Rascón Chiricote",
            "Semillero común",
            "Tangara Azulegris",
            "Tangara dorada",
            "Tirano Pirirí",
            "Tordo negro",
            "Tortolita común",
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