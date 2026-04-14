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
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.`;
}

export function PopulationTimeline({ history }: PopulationTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="text-zinc-500 text-center py-8 italic">
        Noch keine historischen Daten vorhanden.
      </div>
    );
  }

  if (history.length === 1) {
    const entry = history[0];
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
        <div className="text-center space-y-3">
          <p className="text-zinc-400 text-sm">
            Tracking seit{" "}
            <span className="text-amber-400 font-medium">
              {new Date(entry.date).toLocaleDateString("de-DE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{entry.total}</div>
              <div className="text-xs text-zinc-500">Gesamt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {entry.inArbeit}
              </div>
              <div className="text-xs text-zinc-500">Wird gejagt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {entry.geloest}
              </div>
              <div className="text-xs text-zinc-500">Eingefangen</div>
            </div>
          </div>
          <p className="text-zinc-600 text-xs italic">
            Die Zeitreihe füllt sich mit jeder täglichen Bestandsaufnahme.
          </p>
        </div>
      </div>
    );
  }

  const data = history.map((h) => ({
    date: formatDate(h.date),
    Gesamt: h.total,
    Entlaufen: h.neu + h.inArbeit,
    Eingefangen: h.geloest,
  }));

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 10, top: 5 }}>
            <defs>
              <linearGradient id="colorFree" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCaptured" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#27272a",
                border: "1px solid #3f3f46",
                borderRadius: "0.5rem",
                color: "#fafafa",
              }}
            />
            <Area
              type="monotone"
              dataKey="Entlaufen"
              stroke="#f59e0b"
              fill="url(#colorFree)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Eingefangen"
              stroke="#22c55e"
              fill="url(#colorCaptured)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex justify-center gap-6 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
          Auf freiem Fuß
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
          Eingefangen
        </span>
      </div>
    </div>
  );
}
