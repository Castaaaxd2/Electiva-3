import type { BirdResult } from "@/context/BirdStore";

export async function identifyBirdFromBase64(
  base64: string,
  signal?: AbortSignal,
): Promise<BirdResult> {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  const url = `https://${domain}/api/birds/identify`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64 }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<BirdResult>;
}

export { identifyBirdOffline } from "@/lib/offlineBirdClassifier";
