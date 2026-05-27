import type { BirdResult } from "@/context/BirdStore";
import SPECIES_DATA from "@/assets/models/bird_species_data.json";

type SpeciesData = {
  scientificName: string;
  description: string;
  habitat: string;
  diet: string;
  conservationStatus: string;
};

const speciesData: Record<string, SpeciesData> = SPECIES_DATA.species as Record<
  string,
  SpeciesData
>;

// Mapping from MobileNet English class name keywords → Colombian species
const CLASS_NAME_MAPPING: Array<[string, string]> = [
  ["vulture", "Chulo"],
  ["hummingbird", "Colibrí Cola Canela"],
  ["macaw", "Loro Cabeciazul"],
  ["lorikeet", "Perico carisucio"],
  ["cockatoo", "Perico carisucio"],
  ["african grey", "Loro Cabeciazul"],
  ["toucan", "Tangara dorada"],
  ["goldfinch", "Canario costeño"],
  ["house finch", "Semillero común"],
  ["indigo bunting", "Tangara Azulegris"],
  ["junco", "Semillero común"],
  ["brambling", "Canario costeño"],
  ["robin", "Mirla patinaranja"],
  ["bulbul", "Cucarachero común"],
  ["chickadee", "Cucarachero común"],
  ["water ouzel", "Cucarachero común"],
  ["jay", "Luis Bienteveo"],
  ["magpie", "Tordo negro"],
  ["kite", "Gavilán caminero"],
  ["bald eagle", "Caracara plancus"],
  ["great grey owl", "Carpintero Coronirrojo"],
  ["black grouse", "Tortolita común"],
  ["ptarmigan", "Tortolita común"],
  ["ruffed grouse", "Tortolita común"],
  ["prairie chicken", "Tortolita común"],
  ["quail", "Tortolita común"],
  ["partridge", "Tortolita común"],
  ["peacock", "Loro Cabeciazul"],
  ["jacamar", "Carpinterito Oliváceo"],
  ["bee eater", "Mango Gorjinegro"],
  ["hornbill", "Carpintero Coronirrojo"],
  ["coucal", "Tirano Pirirí"],
  ["egret", "Garza Ganadera Occidental"],
  ["heron", "Garza ganadera"],
  ["stork", "Garza Ganadera Occidental"],
  ["flamingo", "Garza ganadera"],
  ["spoonbill", "Garza ganadera"],
  ["bittern", "Garza ganadera"],
  ["crane", "Garza Ganadera Occidental"],
  ["limpkin", "Rascón Chiricote"],
  ["gallinule", "Rascón Chiricote"],
  ["coot", "Rascón Chiricote"],
  ["duck", "Rascón Chiricote"],
  ["merganser", "Rascón Chiricote"],
  ["goose", "Rascón Chiricote"],
  ["pelican", "Garza ganadera"],
  ["ostrich", "Garza ganadera"],
  ["bustard", "Gavilán caminero"],
  ["sandpiper", "Papamoscas Rayado Chico"],
  ["redshank", "Papamoscas Rayado Chico"],
  ["oystercatcher", "Gavilán caminero"],
  ["cock", "Copetón"],
  ["hen", "Semillero común"],
  ["black swan", "Tordo negro"],
];

function mapClassName(className: string): string | null {
  const lower = className.toLowerCase();
  for (const [keyword, species] of CLASS_NAME_MAPPING) {
    if (lower.includes(keyword)) return species;
  }
  return null;
}

type MobilenetModule = typeof import("@tensorflow-models/mobilenet");
type TfModule = typeof import("@tensorflow/tfjs");

let modelCache: Awaited<
  ReturnType<MobilenetModule["load"]>
> | null = null;
let tfReady = false;

async function getModel() {
  if (modelCache) return modelCache;

  const [tf, mobilenet] = await Promise.all([
    import("@tensorflow/tfjs") as Promise<TfModule>,
    import("@tensorflow-models/mobilenet") as Promise<MobilenetModule>,
  ]);

  if (!tfReady) {
    await tf.ready();
    tfReady = true;
  }

  modelCache = await mobilenet.load({ version: 1, alpha: 1.0 });
  return modelCache;
}

async function loadImageElement(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = uri;
  });
}

export async function identifyBirdOffline(
  imageUri: string
): Promise<Omit<BirdResult, "id" | "analyzedAt" | "imageBase64" | "location">> {
  const model = await getModel();
  const img = await loadImageElement(imageUri);

  // Classify top 10 to find bird candidates
  const predictions = await model.classify(img, 10);

  // Find first bird match
  const birdMatches: Array<{ species: string; probability: number }> = [];
  const seenSpecies = new Set<string>();

  for (const pred of predictions) {
    const species = mapClassName(pred.className);
    if (species && !seenSpecies.has(species)) {
      seenSpecies.add(species);
      birdMatches.push({ species, probability: pred.probability });
    }
  }

  if (birdMatches.length === 0) {
    return {
      topPrediction: {
        species: "No se detectó ningún ave",
        commonName: "No se detectó ningún ave",
        scientificName: "",
        confidence: 0,
      },
      allPredictions: [],
      description:
        "El modelo no detectó un ave en esta imagen. Intenta con una foto más clara, mejor iluminada y con el ave centrada en el encuadre.",
      habitat: "—",
      diet: "—",
      conservationStatus: "—",
    };
  }

  const total = birdMatches.reduce((s, m) => s + m.probability, 0);
  const allPredictions = birdMatches.slice(0, 3).map((m) => {
    const data = speciesData[m.species];
    return {
      species: m.species,
      commonName: m.species,
      scientificName: data?.scientificName ?? "Especie no determinada",
      confidence: Math.round((m.probability / total) * 100 * 10) / 10,
    };
  });

  const top = allPredictions[0]!;
  const topData = speciesData[top.species];

  return {
    topPrediction: top,
    allPredictions,
    description: topData
      ? `[Modo offline] ${topData.description}`
      : "Especie identificada por el modelo local.",
    habitat: topData?.habitat ?? "Datos no disponibles",
    diet: topData?.diet ?? "Datos no disponibles",
    conservationStatus: topData?.conservationStatus ?? "Preocupación menor",
  };
}
