import * as ImageManipulator from "expo-image-manipulator";
import { decode as decodeBase64 } from "base64-arraybuffer";
import jpeg from "jpeg-js";

import type { BirdResult } from "@/context/BirdStore";
import SPECIES_DATA from "@/assets/models/bird_species_data.json";

type SpeciesData = {
  scientificName: string;
  description: string;
  habitat: string;
  diet: string;
  conservationStatus: string;
};

const MODEL_INPUT_SIZE = 224;
const BIRD_CLASS_INDICES = new Set([
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 81,
  82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
  101, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141,
  142, 143, 144, 145, 146, 147,
]);

const imagenetMapping: Record<string, string> = SPECIES_DATA.imagenetMapping;
const speciesData: Record<string, SpeciesData> = SPECIES_DATA.species as Record<
  string,
  SpeciesData
>;

let modelInstance: import("react-native-fast-tflite").TfliteModel | null = null;

async function getModel(): Promise<
  import("react-native-fast-tflite").TfliteModel
> {
  if (modelInstance) return modelInstance;
  try {
    const { loadTensorflowModel } = await import("react-native-fast-tflite");
    modelInstance = await loadTensorflowModel(
      require("../assets/models/mobilenet_v1_1.0_224_quant.tflite") as number,
      []
    );
    return modelInstance;
  } catch (err) {
    throw new Error(
      `No se pudo cargar el modelo offline. Asegúrate de usar la versión compilada (APK/IPA). ${String(err)}`
    );
  }
}

async function preprocessImage(imageUri: string): Promise<ArrayBuffer> {
  const resized = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
    {
      format: ImageManipulator.SaveFormat.JPEG,
      compress: 1.0,
      base64: true,
    }
  );

  if (!resized.base64) throw new Error("No se pudo redimensionar la imagen");

  const arrayBuffer = decodeBase64(resized.base64);
  const decoded = jpeg.decode(arrayBuffer, {
    useTArray: true,
    colorTransform: true,
  });

  const { data, width, height } = decoded;
  const pixelCount = width * height;
  const rgb = new Uint8Array(pixelCount * 3);

  for (let i = 0; i < pixelCount; i++) {
    rgb[i * 3] = data[i * 4];
    rgb[i * 3 + 1] = data[i * 4 + 1];
    rgb[i * 3 + 2] = data[i * 4 + 2];
  }

  return rgb.buffer as ArrayBuffer;
}

interface ScoredClass {
  index: number;
  score: number;
  speciesName: string;
}

function interpretOutput(outputBuffer: ArrayBuffer): {
  top: ScoredClass[];
  hasBird: boolean;
} {
  const probabilities = new Uint8Array(outputBuffer);

  const birdScores: ScoredClass[] = [];
  for (const idx of BIRD_CLASS_INDICES) {
    const rawScore = probabilities[idx] ?? 0;
    const mappedSpecies = imagenetMapping[String(idx)];
    if (mappedSpecies) {
      birdScores.push({ index: idx, score: rawScore, speciesName: mappedSpecies });
    }
  }

  birdScores.sort((a, b) => b.score - a.score);

  const maxOverall = Math.max(...Array.from(probabilities));
  const topBirdScore = birdScores[0]?.score ?? 0;
  const hasBird = topBirdScore > 10 && topBirdScore >= maxOverall * 0.3;

  return { top: birdScores.slice(0, 5), hasBird };
}

function buildPrediction(
  speciesName: string,
  rawScore: number,
  totalBirdScore: number
) {
  const data = speciesData[speciesName];
  const confidence =
    totalBirdScore > 0
      ? Math.round((rawScore / totalBirdScore) * 100 * 10) / 10
      : 0;
  return {
    species: speciesName,
    commonName: speciesName,
    scientificName: data?.scientificName ?? "Especie no determinada",
    confidence,
  };
}

export async function identifyBirdOffline(
  imageUri: string
): Promise<Omit<BirdResult, "id" | "analyzedAt" | "imageBase64" | "location">> {
  const model = await getModel();
  const inputBuffer = await preprocessImage(imageUri);
  const [outputBuffer] = model.runSync([inputBuffer]);
  const { top, hasBird } = interpretOutput(outputBuffer);

  if (!hasBird || top.length === 0) {
    return {
      topPrediction: {
        species: "No se detectó ningún ave",
        commonName: "No se detectó ningún ave",
        scientificName: "",
        confidence: 0,
      },
      allPredictions: [],
      description:
        "El modelo no pudo detectar un ave en esta imagen. Intenta con una foto más clara, mejor iluminada y con el ave más centrada.",
      habitat: "—",
      diet: "—",
      conservationStatus: "—",
    };
  }

  const totalScore = top.reduce((sum, s) => sum + s.score, 0);

  const dedupedTop: ScoredClass[] = [];
  const seenSpecies = new Set<string>();
  for (const s of top) {
    if (!seenSpecies.has(s.speciesName)) {
      seenSpecies.add(s.speciesName);
      dedupedTop.push(s);
    }
    if (dedupedTop.length >= 3) break;
  }

  const topSpecies = dedupedTop[0]!;
  const topData = speciesData[topSpecies.speciesName];

  const allPredictions = dedupedTop.map((s) =>
    buildPrediction(s.speciesName, s.score, totalScore)
  );

  const topConfidence = allPredictions[0]?.confidence ?? 0;

  return {
    topPrediction: {
      species: topSpecies.speciesName,
      commonName: topSpecies.speciesName,
      scientificName: topData?.scientificName ?? "Especie no determinada",
      confidence: topConfidence,
    },
    allPredictions,
    description: topData
      ? `[Modo offline] ${topData.description}`
      : "Especie identificada por el modelo local.",
    habitat: topData?.habitat ?? "Datos no disponibles",
    diet: topData?.diet ?? "Datos no disponibles",
    conservationStatus: topData?.conservationStatus ?? "Preocupación menor",
  };
}
