import { useState, useMemo } from "react";
import type { Gittertier, GittertierStatus } from "@gittertier/shared";
import { imageUrl } from "@gittertier/shared";

interface TicketListProps {
  gittertiere: Gittertier[];
}

const STATUS_BADGE: Record<
  GittertierStatus,
  { bg: string; text: string; label: string; icon: string }
> = {
  Neu: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    label: "Entlaufen",
    icon: "🔴",
  },
  "In Arbeit": {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    label: "Wird gejagt",
    icon: "🟡",
  },
  Gelöst: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    label: "Eingefangen",
    icon: "🟢",
  },
};

const FILTER_LABELS: Record<GittertierStatus, string> = {
  Neu: "Entlaufen",
  "In Arbeit": "Wird gejagt",
  Gelöst: "Eingefangen",
};

type SortKey = "uid" | "street" | "neighborhood" | "status";

export function TicketList({ gittertiere }: TicketListProps) {
  const [filter, setFilter] = useState<GittertierStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("uid");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let items =
      filter === "all"
        ? gittertiere
        : gittertiere.filter((g) => g.status === filter);

    items = [...items].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp =
        typeof va === "number"
          ? va - (vb as number)
          : String(va).localeCompare(String(vb));
      return sortAsc ? cmp : -cmp;
    });

    return items;
  }, [gittertiere, filter, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " ▲" : " ▼") : "";

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "Neu", "In Arbeit", "Gelöst"] as const).map((f) => {
          const count =
            f === "all"
              ? gittertiere.length
              : gittertiere.filter((g) => g.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-amber-500 text-zinc-900"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {f === "all" ? `Alle Exemplare (${count})` : `${FILTER_LABELS[f]} (${count})`}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th
                className="text-left p-3 text-zinc-400 cursor-pointer hover:text-zinc-200"
                onClick={() => toggleSort("uid")}
              >
                Akte{sortIndicator("uid")}
              </th>
              <th
                className="text-left p-3 text-zinc-400 cursor-pointer hover:text-zinc-200"
                onClick={() => toggleSort("street")}
              >
                Letzter bekannter Aufenthaltsort{sortIndicator("street")}
              </th>
              <th
                className="text-left p-3 text-zinc-400 cursor-pointer hover:text-zinc-200"
                onClick={() => toggleSort("neighborhood")}
              >
                Revier{sortIndicator("neighborhood")}
              </th>
              <th
                className="text-left p-3 text-zinc-400 cursor-pointer hover:text-zinc-200"
                onClick={() => toggleSort("status")}
              >
                Zustand{sortIndicator("status")}
              </th>
              <th className="text-left p-3 text-zinc-400">Beweisfoto</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const badge = STATUS_BADGE[g.status];
              return (
                <tr
                  key={g.uid}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/50"
                >
                  <td className="p-3 text-zinc-500 font-mono text-xs">
                    #{g.uid}
                  </td>
                  <td className="p-3">
                    {g.street}
                    {g.locationname &&
                      g.locationname !== "Einkaufswagen" &&
                      g.locationname !== "EKW" && (
                        <span className="ml-2 text-zinc-600 text-xs">
                          ({g.locationname})
                        </span>
                      )}
                  </td>
                  <td className="p-3 text-zinc-400">{g.neighborhood}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                    >
                      {badge.icon} {badge.label}
                    </span>
                  </td>
                  <td className="p-3">
                    {g.images.length > 0 ? (
                      <a
                        href={imageUrl(g.images[0])}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Beweisfoto vergrößern"
                      >
                        <img
                          src={imageUrl(g.images[0])}
                          alt="Gittertier-Sichtung"
                          className="w-12 h-12 object-cover rounded-lg border border-zinc-700 hover:border-amber-500 transition-colors"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <span className="text-zinc-700 text-xs italic">
                        kein Foto
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500 italic">
                  Keine Gittertiere in dieser Kategorie. Verdächtig ruhig.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
