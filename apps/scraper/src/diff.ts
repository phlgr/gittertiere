import type { Gittertier, Snapshot } from "@gittertier/shared";

export interface SnapshotDiff {
  newSightings: Gittertier[];
  removedSightings: Gittertier[];
  statusChanges: {
    uid: number;
    street: string;
    from: string;
    to: string;
  }[];
}

/** Compare two snapshots and return the differences */
export function diffSnapshots(
  previous: Snapshot,
  current: Snapshot,
): SnapshotDiff {
  const prevMap = new Map(previous.gittertiere.map((g) => [g.uid, g]));
  const currMap = new Map(current.gittertiere.map((g) => [g.uid, g]));

  const newSightings = current.gittertiere.filter((g) => !prevMap.has(g.uid));
  const removedSightings = previous.gittertiere.filter(
    (g) => !currMap.has(g.uid),
  );

  const statusChanges: SnapshotDiff["statusChanges"] = [];
  for (const [uid, curr] of currMap) {
    const prev = prevMap.get(uid);
    if (prev && prev.status !== curr.status) {
      statusChanges.push({
        uid,
        street: curr.street,
        from: prev.status,
        to: curr.status,
      });
    }
  }

  return { newSightings, removedSightings, statusChanges };
}
