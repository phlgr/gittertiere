import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  Gittertier,
  RegistryEntry,
  Snapshot,
} from "@gittertier/shared";

const DATA_DIR = join(import.meta.dir, "../../../data");
const REGISTRY_PATH = join(DATA_DIR, "registry.json");

export function loadRegistry(): RegistryEntry[] {
  if (!existsSync(REGISTRY_PATH)) return [];
  return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as RegistryEntry[];
}

export function saveRegistry(entries: RegistryEntry[]): string {
  entries.sort((a, b) => a.firstSeen.localeCompare(b.firstSeen) || a.uid - b.uid);
  writeFileSync(REGISTRY_PATH, JSON.stringify(entries, null, 2));
  return REGISTRY_PATH;
}

function entryFromGittertier(g: Gittertier, day: string): RegistryEntry {
  return {
    uid: g.uid,
    street: g.street,
    zipcode: g.zipcode,
    neighborhood: g.neighborhood,
    lat: g.lat,
    lng: g.lng,
    firstSeen: day,
    lastSeen: day,
    resolvedAt: g.status === "Gelöst" ? day : null,
    status: g.status,
  };
}

export interface RegistryUpdate {
  added: number;
  resolved: number;
  resolvedByDisappearance: number;
}

/** Reconcile the registry against a fresh snapshot. Mutates `registry`.
 * A uid disappearing from the mags API is treated as resolution: status
 * becomes "Gelöst" and resolvedAt is set to today's scrape day. */
export function updateRegistry(
  registry: RegistryEntry[],
  snapshot: Snapshot,
): RegistryUpdate {
  const day = snapshot.fetchedAt.slice(0, 10);
  const byUid = new Map(registry.map((e) => [e.uid, e]));
  const seenNow = new Set<number>();
  let added = 0;
  let resolved = 0;
  let resolvedByDisappearance = 0;

  for (const g of snapshot.gittertiere) {
    seenNow.add(g.uid);
    const existing = byUid.get(g.uid);
    if (!existing) {
      const entry = entryFromGittertier(g, day);
      registry.push(entry);
      byUid.set(g.uid, entry);
      added++;
      if (entry.resolvedAt) resolved++;
      continue;
    }

    existing.lastSeen = day;
    existing.street = g.street;
    existing.zipcode = g.zipcode;
    existing.neighborhood = g.neighborhood;
    existing.lat = g.lat;
    existing.lng = g.lng;

    if (g.status === "Gelöst" && existing.resolvedAt === null) {
      existing.resolvedAt = day;
      resolved++;
    }
    existing.status = g.status;
  }

  for (const entry of registry) {
    if (seenNow.has(entry.uid)) continue;
    if (entry.status === "Gelöst") continue;
    entry.status = "Gelöst";
    if (entry.resolvedAt === null) {
      entry.resolvedAt = day;
    }
    resolvedByDisappearance++;
  }

  return { added, resolved, resolvedByDisappearance };
}
