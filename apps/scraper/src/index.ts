import { isGittertier, toGittertier, type Snapshot, type HistoryEntry } from "@gittertier/shared";
import { fetchMagsData } from "./fetch";
import { diffSnapshots } from "./diff";
import { loadLatestSnapshot, saveLatest, saveSnapshot, saveHistory } from "./store";
import { loadRegistry, saveRegistry, updateRegistry } from "./registry";

async function main() {
  console.log("🛒 Gittertier Scraper – fetching mags Mängelmelder data...");

  const data = await fetchMagsData();
  console.log(`  Total mags reports: ${data.config.totalHits}`);

  const gittertiere = data.address.filter(isGittertier).map(toGittertier);
  console.log(`  Gittertier sightings: ${gittertiere.length}`);
  console.log(
    `  That's ${((gittertiere.length / data.address.length) * 100).toFixed(0)}% of all reports!`,
  );

  const snapshot: Snapshot = {
    fetchedAt: new Date().toISOString(),
    totalMagsReports: data.config.totalHits,
    gittertiere,
  };

  // Diff against previous snapshot
  const previous = loadLatestSnapshot();
  const diff = previous ? diffSnapshots(previous, snapshot) : null;

  if (diff) {
    if (diff.newSightings.length > 0) {
      console.log(`\n  🆕 New sightings: ${diff.newSightings.length}`);
      for (const s of diff.newSightings) {
        console.log(`     - ${s.street} (${s.neighborhood})`);
      }
    }
    if (diff.removedSightings.length > 0) {
      console.log(`  🗑️  Removed: ${diff.removedSightings.length}`);
    }
    if (diff.statusChanges.length > 0) {
      console.log(`  🔄 Status changes: ${diff.statusChanges.length}`);
      for (const c of diff.statusChanges) {
        console.log(`     - #${c.uid} ${c.street}: ${c.from} → ${c.to}`);
      }
    }
    if (
      diff.newSightings.length === 0 &&
      diff.removedSightings.length === 0 &&
      diff.statusChanges.length === 0
    ) {
      console.log("\n  No changes since last snapshot.");
    }
  }

  // Build history entry
  const byNeighborhood: HistoryEntry["byNeighborhood"] = {};
  for (const g of gittertiere) {
    const hood = g.neighborhood;
    if (!byNeighborhood[hood]) {
      byNeighborhood[hood] = { total: 0, neu: 0, inArbeit: 0, geloest: 0 };
    }
    byNeighborhood[hood].total++;
    if (g.status === "Neu") byNeighborhood[hood].neu++;
    else if (g.status === "In Arbeit") byNeighborhood[hood].inArbeit++;
    else byNeighborhood[hood].geloest++;
  }

  const historyEntry: HistoryEntry = {
    date: new Date().toISOString().split("T")[0],
    total: gittertiere.length,
    neu: gittertiere.filter((g) => g.status === "Neu").length,
    inArbeit: gittertiere.filter((g) => g.status === "In Arbeit").length,
    geloest: gittertiere.filter((g) => g.status === "Gelöst").length,
    totalMagsReports: data.config.totalHits,
    newSightings: diff?.newSightings.length ?? 0,
    removed: diff?.removedSightings.length ?? 0,
    byNeighborhood,
  };

  // Update the long-lived registry of every case ever seen
  const registry = loadRegistry();
  const registryUpdate = updateRegistry(registry, snapshot);
  const registryPath = saveRegistry(registry);
  if (
    registryUpdate.added > 0 ||
    registryUpdate.resolved > 0 ||
    registryUpdate.resolvedByDisappearance > 0
  ) {
    console.log(
      `\n  📒 Registry: +${registryUpdate.added} new, ` +
        `${registryUpdate.resolved} resolved (status), ` +
        `${registryUpdate.resolvedByDisappearance} resolved (disappearance)`,
    );
  }

  const snapshotPath = saveSnapshot(snapshot);
  const latestPath = saveLatest(snapshot);
  const historyPath = saveHistory(historyEntry);
  console.log(`\n  Saved snapshot: ${snapshotPath}`);
  console.log(`  Updated latest: ${latestPath}`);
  console.log(`  Updated history: ${historyPath}`);
  console.log(`  Updated registry: ${registryPath}`);
  console.log("✅ Done!");
}

main().catch((err) => {
  console.error("❌ Scraper failed:", err);
  process.exit(1);
});
