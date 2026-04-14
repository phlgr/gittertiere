import type { Snapshot } from "@gittertier/shared";

export async function loadSnapshot(): Promise<Snapshot> {
  const base = import.meta.env.BASE_URL;
  const response = await fetch(`${base}data/latest.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data: ${response.status}`);
  }
  return response.json();
}
