import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HistoryEntry } from "@gittertier/shared";

interface PopulationTimelineProps {
  history: HistoryEntry[];
}

function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${d}.${m}.`;
}

export function PopulationTimeline({ history }: PopulationTimelineProps) {
  if (history.length === 0) {
    return (
      <p className="text-stone-400 text-sm py-4">
        Noch keine historischen Daten.
      </p>
    );
  }

  if (history.length === 1) {
    const entry = history[0];
    return (
      <div className="border border-stone-200 p-4">
        <p className="text-stone-500 text-sm mb-3">
          Erfassung seit{" "}
          <strong className="text-stone-700">
            {new Date(entry.date).toLocaleDateString("de-DE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
        </p>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-xl font-bold text-stone-900">
              {entry.total}
            </span>{" "}
            <span className="text-stone-400">gesamt</span>
          </div>
          <div>
            <span className="text-xl font-bold text-amber-700">
              {entry.neu + entry.inArbeit}
            </span>{" "}
            <span className="text-stone-400">frei</span>
          </div>
          <div>
            <span className="text-xl font-bold text-green-700">
              {entry.geloest}
            </span>{" "}
            <span className="text-stone-400">gefangen</span>
          </div>
        </div>
        <p className="text-stone-400 text-xs mt-3">
          Die Zeitreihe füllt sich täglich.
        </p>
      </div>
    );
  }

  const data = history.map((h) => ({
    date: formatDate(h.date),
    Entlaufen: h.neu + h.inArbeit,
    Eingefangen: h.geloest,
  }));

  return (
    <div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 10, top: 5 }}>
            <defs>
              <linearGradient id="colorFree" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b45309" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#b45309" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCaptured" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="date"
              stroke="#d6d3d1"
              tick={{ fill: "#78716c", fontSize: 11 }}
            />
            <YAxis
              stroke="#d6d3d1"
              tick={{ fill: "#78716c", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e7e5e4",
                borderRadius: "3px",
                color: "#1a1a1a",
                fontSize: "0.8rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="Entlaufen"
              stroke="#b45309"
              fill="url(#colorFree)"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="Eingefangen"
              stroke="#16a34a"
              fill="url(#colorCaptured)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-700" />
          Auf freiem Fuß
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
          Eingefangen
        </span>
      </div>
    </div>
  );
}
