import type { MagsApiResponse } from "@gittertier/shared";

const MAGS_ENDPOINT = "https://mags.de/index.php?id=317";

export async function fetchMagsData(): Promise<MagsApiResponse> {
  const response = await fetch(MAGS_ENDPOINT, {
    headers: {
      "User-Agent": "GittertierTracker/0.1 (https://github.com/gittertier-tracker)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch mags data: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<MagsApiResponse>;
}
