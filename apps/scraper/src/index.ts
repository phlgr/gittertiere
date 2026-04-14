import { isGittertier, toGittertier, type Snapshot } from "@gittertier/shared";
import { fetchMagsData } from "./fetch.js";
import { diffSnapshots } from "./diff.js";
import { loadLatestSnapshot, saveLatest, saveSnapshot } from "./store.js";

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
  if (previous) {
    const diff = diffSnapshots(previous, snapshot);
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

  const snapshotPath = saveSnapshot(snapshot);
  const latestPath = saveLatest(snapshot);
  console.log(`\n  Saved snapshot: ${snapshotPath}`);
  console.log(`  Updated latest: ${latestPath}`);
  console.log("✅ Done!");
}

main().catch((err) => {
  console.error("❌ Scraper failed:", err);
  process.exit(1);
});
