/**
 * One-time bootstrap of data/registry.json from existing on-disk snapshots
 * plus latest.json. UIDs first seen in the oldest available snapshot get
 * that snapshot's date as firstSeen; UIDs that only appear in latest.json
 * get latest.json's fetchedAt date (we have no earlier evidence).
 *
 * Idempotent: rerunning from existing snapshots produces the same registry.
 * Safe to run multiple times — does not call the mags API.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { RegistryEntry, Snapshot } from "@gittertier/shared";
import { saveRegistry, updateRegistry } from "./registry";

const DATA_DIR = join(import.meta.dir, "../../../data");

function loadSnapshot(filename: string): Snapshot {
  return JSON.parse(
    readFileSync(join(DATA_DIR, filename), "utf-8"),
  ) as Snapshot;
}

function main() {
  const timestamped = readdirSync(DATA_DIR)
    .filter((f) => f.startsWith("snapshot-") && f.endsWith(".json"))
    .sort();

  const registry: RegistryEntry[] = [];
  let added = 0;
  let resolved = 0;

  for (const file of timestamped) {
    const snap = loadSnapshot(file);
    const update = updateRegistry(registry, snap);
    added += update.added;
    resolved += update.resolved;
  }

  const latestPath = join(DATA_DIR, "latest.json");
  if (existsSync(latestPath)) {
    const latest = JSON.parse(readFileSync(latestPath, "utf-8")) as Snapshot;
    const update = updateRegistry(registry, latest);
    added += update.added;
    resolved += update.resolved;
  }

  const out = saveRegistry(registry);
  const byStatus = registry.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`📒 Bootstrapped registry from ${timestamped.length} snapshots + latest.json`);
  console.log(`   Total entries: ${registry.length}`);
  console.log(`   By status: ${JSON.stringify(byStatus)}`);
  console.log(`   Wrote: ${out}`);
  console.log(`   (added=${added}, resolved=${resolved} during replay)`);
}

main();
