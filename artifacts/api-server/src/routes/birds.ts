import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

// URL del servidor Python de inferencia (configurable por variable de entorno)
// Si no está configurado, usa OpenAI como motor de identificación
const MODEL_SERVER_URL = process.env.MODEL_SERVER_URL;

// ─── Identificación con modelo Python propio ──────────────────────────────────
async function identifyWithModel(imageBase64: string): Promise<Record<string, unknown>> {
  const response = await fetch(`${MODEL_SERVER_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64 }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Model server error ${response.status}: ${body}`);
  }

  const result = await response.json() as Record<string, unknown>;

  // El modelo devuelve predicciones pero no descripción/hábitat/dieta.
  // Completamos esos campos con OpenAI usando solo el nombre de la especie.
  const topSpecies = (result.topPrediction as { commonName?: string })?.commonName ?? "unknown bird";
  const enriched = await enrichWithOpenAI(topSpecies);

  return {
    ...result,
    description: enriched.description,
    habitat: enriched.habitat,
    diet: enriched.diet,
    conservationStatus: enriched.conservationStatus,
  };
}

// Enriquece el resultado del modelo con descripción textual vía OpenAI
async function enrichWithOpenAI(speciesName: string): Promise<{
  description: string;
  habitat: string;
  diet: string;
  conservationStatus: string;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Eres un ornitólogo experto. Para el ave "${speciesName}", devuelve SOLO un JSON válido (sin markdown) con:
{
  "description": "Descripción breve de 2-3 oraciones sobre apariencia y comportamiento",
  "habitat": "Hábitats típicos donde vive",
  "diet": "Qué come habitualmente",
  "conservationStatus": "Estado UICN en español (ej: Preocupación menor, Vulnerable, En peligro)"
}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    return {
      description: `El ${speciesName} es un ave identificada por tu modelo de predicción.`,
      habitat: "Datos no disponibles",
      diet: "Datos no disponibles",
      conservationStatus: "Preocupación menor",
    };
  }
}

// ─── Identificación completa con OpenAI (fallback) ────────────────────────────
async function identifyWithOpenAI(imageBase64: string): Promise<Record<string, unknown>> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Eres un ornitólogo experto con IA. Analiza esta imagen e identifica la especie de ave.

Devuelve SOLO un JSON válido (sin markdown, sin bloques de código) con esta estructura exacta:
{
  "topPrediction": {
    "species": "nombre común",
    "commonName": "nombre común completo",
    "scientificName": "nombre científico",
    "confidence": 87.5
  },
  "allPredictions": [
    { "species": "nombre común", "commonName": "nombre completo", "scientificName": "nombre científico", "confidence": 87.5 },
    { "species": "segunda posibilidad", "commonName": "nombre completo", "scientificName": "nombre científico", "confidence": 8.2 },
    { "species": "tercera posibilidad", "commonName": "nombre completo", "scientificName": "nombre científico", "confidence": 4.3 }
  ],
  "description": "Descripción breve de 2-3 oraciones sobre apariencia y comportamiento.",
  "habitat": "Hábitats típicos donde vive esta ave",
  "diet": "Qué come habitualmente",
  "conservationStatus": "Estado UICN en español"
}

Si la imagen no contiene un ave, pon topPrediction.species = "No se detectó ningún ave" con confidence 0.
Los valores de confidence deben sumar aproximadamente 100 entre allPredictions.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: "high",
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}

// ─── Endpoint principal ───────────────────────────────────────────────────────
router.post("/identify", async (req, res) => {
  const { imageBase64 } = req.body as { imageBase64?: string };

  if (!imageBase64) {
    res.status(400).json({ error: "BAD_REQUEST", message: "imageBase64 es requerido" });
    return;
  }

  try {
    let parsed: Record<string, unknown>;

    if (MODEL_SERVER_URL) {
      // Modo 1: usa tu modelo entrenado
      req.log.info("Usando modelo de predicción propio");
      try {
        parsed = await identifyWithModel(imageBase64);
      } catch (modelErr) {
        req.log.warn({ modelErr }, "Modelo propio falló, usando OpenAI como fallback");
        parsed = await identifyWithOpenAI(imageBase64);
      }
    } else {
      // Modo 2: usa OpenAI (mientras el modelo está en entrenamiento)
      req.log.info("MODEL_SERVER_URL no configurado, usando OpenAI");
      parsed = await identifyWithOpenAI(imageBase64);
    }

    res.json({
      ...parsed,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Identificación de ave fallida");
    res.status(500).json({ error: "IDENTIFICATION_FAILED", message: "No se pudo identificar el ave" });
  }
});

export default router;
