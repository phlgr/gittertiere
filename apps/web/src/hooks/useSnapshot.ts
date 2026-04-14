import { useEffect, useState } from "react";
import type { Snapshot } from "@gittertier/shared";
import { loadSnapshot } from "../lib/data";

export function useSnapshot() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSnapshot()
      .then(setSnapshot)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { snapshot, error, loading };
}
