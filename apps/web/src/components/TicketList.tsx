import { useState, useMemo } from "react";
import type { Gittertier, GittertierStatus } from "@gittertier/shared";
import { imageUrl } from "@gittertier/shared";

interface TicketListProps {
  gittertiere: Gittertier[];
}

const STATUS_BADGE: Record<
  GittertierStatus,
  { bg: string; text: string; label: string }
> = {
  Neu: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "🔴 Entlaufen",
  },
  "In Arbeit": {
    bg: "bg-amber-100",
    text: "text-amber-800",
    label: "🟡 Wird gejagt",
  },
  Gelöst: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "🟢 Eingefangen",
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
              className={`px-3 py-1 text-sm transition-colors ${
                filter === f
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {f === "all"
                ? `Alle (${count})`
                : `${FILTER_LABELS[f]} (${count})`}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th
                className="text-left p-3 text-stone-500 font-medium cursor-pointer hover:text-stone-800 text-xs"
                onClick={() => toggleSort("uid")}
              >
                Nr.{sortIndicator("uid")}
              </th>
              <th
                className="text-left p-3 text-stone-500 font-medium cursor-pointer hover:text-stone-800 text-xs"
                onClick={() => toggleSort("street")}
              >
                Standort{sortIndicator("street")}
              </th>
              <th
                className="text-left p-3 text-stone-500 font-medium cursor-pointer hover:text-stone-800 text-xs"
                onClick={() => toggleSort("neighborhood")}
              >
                Stadtteil{sortIndicator("neighborhood")}
              </th>
              <th
                className="text-left p-3 text-stone-500 font-medium cursor-pointer hover:text-stone-800 text-xs"
                onClick={() => toggleSort("status")}
              >
                Status{sortIndicator("status")}
              </th>
              <th className="text-left p-3 text-stone-500 font-medium text-xs">
                Foto
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const badge = STATUS_BADGE[g.status];
              return (
                <tr
                  key={g.uid}
                  className="border-b border-stone-100 hover:bg-stone-50"
                >
                  <td className="p-3 text-stone-400 font-mono text-xs">
                    {g.uid}
                  </td>
                  <td className="p-3 text-stone-800">
                    {g.street}
                    {g.locationname &&
                      g.locationname !== "Einkaufswagen" &&
                      g.locationname !== "EKW" && (
                        <span className="ml-1.5 text-stone-400 text-xs">
                          ({g.locationname})
                        </span>
                      )}
                  </td>
                  <td className="p-3 text-stone-500">{g.neighborhood}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="p-3">
                    {g.images.length > 0 ? (
                      <a
                        href={imageUrl(g.images[0])}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={imageUrl(g.images[0])}
                          alt="Sichtung"
                          className="w-10 h-10 object-cover border border-stone-200 hover:border-stone-400 transition-colors"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <span className="text-stone-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-stone-400 italic"
                >
                  Aktuell keine Gittertiere in dieser Kategorie. Schauen Sie
                  später wieder vorbei.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
