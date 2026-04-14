import { useState, useEffect } from "react";
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

const SHORT_NAMES: Record<string, string> = {
  "Lürrip / Hardterbroich": "Lürrip / H.",
  "Eicken / Bonnenbroich": "Eicken / B.",
  "Holt / Westend": "Holt / W.",
};

function useIsMobile() {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 640,
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
}

export function HotspotChart({ gittertiere }: HotspotChartProps) {
  const isMobile = useIsMobile();

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
      <p className="text-stone-400 text-sm py-4 italic">Keine Daten.</p>
    );
  }

  const yAxisWidth = isMobile ? 75 : 110;
  const leftMargin = isMobile ? 0 : 10;

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: leftMargin, right: 10, top: 5, bottom: 5 }}
        >
          <XAxis
            type="number"
            stroke="#d6d3d1"
            tick={{ fill: "#78716c", fontSize: isMobile ? 11 : 12 }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#d6d3d1"
            tick={{ fill: "#57534e", fontSize: isMobile ? 11 : 12 }}
            width={yAxisWidth}
            tickFormatter={(name: string) =>
              isMobile ? (SHORT_NAMES[name] ?? name) : name
            }
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e7e5e4",
              borderRadius: "3px",
              color: "#1a1a1a",
              fontSize: "0.8rem",
            }}
            formatter={(value: number) => [
              `${value} Sichtung${value !== 1 ? "en" : ""}`,
              "Anzahl",
            ]}
          />
          <Bar dataKey="count" radius={[0, 3, 3, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? "#292524" : "#57534e"}
                fillOpacity={Math.max(0.35, 1 - index * 0.1)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
