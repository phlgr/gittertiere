import type { Snapshot, HistoryEntry } from "@gittertier/shared";

export async function loadSnapshot(): Promise<Snapshot> {
  const base = import.meta.env.BASE_URL;
  const response = await fetch(`${base}data/latest.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data: ${response.status}`);
  }
  return response.json();
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  const base = import.meta.env.BASE_URL;
  const response = await fetch(`${base}data/history.json`);
  if (!response.ok) return [];
  return response.json();
}
