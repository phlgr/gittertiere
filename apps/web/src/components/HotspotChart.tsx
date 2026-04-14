import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Gittertier } from "@gittertier/shared";

interface HotspotChartProps {
  gittertiere: Gittertier[];
}

export function HotspotChart({ gittertiere }: HotspotChartProps) {
  const countByNeighborhood = new Map<string, number>();
  for (const g of gittertiere) {
    const name = g.neighborhood;
    countByNeighborhood.set(name, (countByNeighborhood.get(name) ?? 0) + 1);
  }

  const data = Array.from(countByNeighborhood.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) {
    return (
      <div className="text-zinc-500 text-center py-8 italic">
        Keine Reviere dokumentiert. Die Gittertiere sind abgetaucht.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 120, right: 20 }}
        >
          <XAxis
            type="number"
            stroke="#71717a"
            tick={{ fill: "#a1a1aa" }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#71717a"
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            width={110}
          />
          <Tooltip
            contentStyle={{
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: "0.5rem",
              color: "#fafafa",
            }}
            formatter={(value: number) => [
              `${value} Sichtung${value !== 1 ? "en" : ""}`,
              "Population",
            ]}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? "#f59e0b" : "#d97706"}
                fillOpacity={Math.max(0.4, 1 - index * 0.08)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
