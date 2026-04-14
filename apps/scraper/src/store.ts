import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Snapshot } from "@gittertier/shared";

const DATA_DIR = join(import.meta.dir, "../../../data");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

/** Save a snapshot as a timestamped JSON file */
export function saveSnapshot(snapshot: Snapshot): string {
  ensureDataDir();
  const timestamp = snapshot.fetchedAt.replace(/[:.]/g, "-");
  const filename = `snapshot-${timestamp}.json`;
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(snapshot, null, 2));
  return filepath;
}

/** Also maintain a latest.json that the frontend reads */
export function saveLatest(snapshot: Snapshot): string {
  ensureDataDir();
  const filepath = join(DATA_DIR, "latest.json");
  writeFileSync(filepath, JSON.stringify(snapshot, null, 2));
  return filepath;
}

/** Load the most recent snapshot (if any) for diffing */
export function loadLatestSnapshot(): Snapshot | null {
  ensureDataDir();
  const filepath = join(DATA_DIR, "latest.json");
  if (!existsSync(filepath)) return null;
  return JSON.parse(readFileSync(filepath, "utf-8")) as Snapshot;
}

/** List all stored snapshots sorted by date */
export function listSnapshots(): string[] {
  ensureDataDir();
  return readdirSync(DATA_DIR)
    .filter((f) => f.startsWith("snapshot-") && f.endsWith(".json"))
    .sort();
}
