import { useEffect, useState } from "react";
import type { Snapshot, HistoryEntry, RegistryEntry } from "@gittertier/shared";
import { loadSnapshot, loadHistory, loadRegistry } from "../lib/data";

export function useSnapshot() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [registry, setRegistry] = useState<RegistryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadSnapshot(), loadHistory(), loadRegistry()])
      .then(([snap, hist, reg]) => {
        setSnapshot(snap);
        setHistory(hist);
        setRegistry(reg);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { snapshot, history, registry, error, loading };
}
