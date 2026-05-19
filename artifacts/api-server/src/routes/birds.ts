import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

router.post("/identify", async (req, res) => {
  const { imageBase64 } = req.body as { imageBase64?: string };

  if (!imageBase64) {
    res.status(400).json({ error: "BAD_REQUEST", message: "imageBase64 is required" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert ornithologist AI. Analyze this bird image and identify the species.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "topPrediction": {
    "species": "common name",
    "commonName": "full common name",
    "scientificName": "scientific name",
    "confidence": 87.5
  },
  "allPredictions": [
    { "species": "common name", "commonName": "full common name", "scientificName": "scientific name", "confidence": 87.5 },
    { "species": "second possibility", "commonName": "full common name", "scientificName": "scientific name", "confidence": 8.2 },
    { "species": "third possibility", "commonName": "full common name", "scientificName": "scientific name", "confidence": 4.3 }
  ],
  "description": "Brief 2-3 sentence description of this bird species, its appearance and behavior.",
  "habitat": "Typical habitats where this bird lives",
  "diet": "What this bird typically eats",
  "conservationStatus": "IUCN status e.g. Least Concern, Near Threatened, Vulnerable, Endangered"
}

If the image does not contain a bird, set topPrediction.species to "No bird detected" with confidence 0, and provide empty arrays/strings accordingly.
Confidence values must sum to approximately 100 across allPredictions.`,
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
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      req.log.error({ content }, "Failed to parse OpenAI response as JSON");
      res.status(500).json({ error: "PARSE_ERROR", message: "Failed to parse AI response" });
      return;
    }

    res.json({
      ...parsed,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Bird identification failed");
    res.status(500).json({ error: "IDENTIFICATION_FAILED", message: "Failed to identify bird" });
  }
});

export default router;
