import type { Gittertier } from "@gittertier/shared";

interface HeroStatsProps {
  gittertiere: Gittertier[];
  totalMagsReports: number;
}

function StatCard({
  value,
  label,
  icon,
  accent,
}: {
  value: string | number;
  label: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 group hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <div
        className={`text-3xl font-extrabold mb-0.5 ${accent ? "text-amber-400" : "text-white"}`}
      >
        {value}
      </div>
      <div className="text-zinc-500 text-xs">{label}</div>
    </div>
  );
}

export function HeroStats({ gittertiere, totalMagsReports }: HeroStatsProps) {
  const total = gittertiere.length;
  const free = gittertiere.filter((g) => g.status !== "Gelöst").length;
  const resolved = gittertiere.filter((g) => g.status === "Gelöst").length;
  const captureRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const percentage =
    totalMagsReports > 0 ? Math.round((total / totalMagsReports) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        value={total}
        label="Gesichtete Exemplare"
        icon="🔍"
        accent
      />
      <StatCard
        value={free}
        label="Noch auf freiem Fuß"
        icon="🏃"
      />
      <StatCard
        value={`${captureRate}%`}
        label="Einfangquote"
        icon="🎯"
      />
      <StatCard
        value={`${percentage}%`}
        label="Anteil aller mags-Meldungen"
        icon="🏆"
        accent
      />
    </div>
  );
}
