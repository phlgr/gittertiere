import { useEffect, useState } from "react";
import type { Snapshot, HistoryEntry } from "@gittertier/shared";
import { loadSnapshot, loadHistory } from "../lib/data";

export function useSnapshot() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadSnapshot(), loadHistory()])
      .then(([snap, hist]) => {
        setSnapshot(snap);
        setHistory(hist);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { snapshot, history, error, loading };
}
