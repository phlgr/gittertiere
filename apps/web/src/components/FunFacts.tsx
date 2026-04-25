import type { Gittertier, RegistryEntry } from "@gittertier/shared";

interface FunFactsProps {
  gittertiere: Gittertier[];
  totalMagsReports: number;
  registry: RegistryEntry[];
}

function totalsByYear(registry: RegistryEntry[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const e of registry) {
    const y = e.firstSeen.slice(0, 4);
    result[y] = (result[y] ?? 0) + 1;
  }
  return result;
}

function daysBetween(from: string, to: string): number {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return ms / 86_400_000;
}

function formatCatchDays(days: number, fractional = false): string {
  const value = fractional ? Number(days.toFixed(1)) : Math.round(days);
  if (value === 0) return "am gleichen Tag";
  if (value === 1) return "1 Tag";
  return `${fractional ? days.toFixed(1) : value} Tage`;
}

interface Fact {
  icon: string;
  title: string;
  text: string;
  breakdown?: { year: string; count: number }[];
}

export function FunFacts({
  gittertiere,
  totalMagsReports,
  registry,
}: FunFactsProps) {
  const total = gittertiere.length;
  const percentage =
    totalMagsReports > 0 ? Math.round((total / totalMagsReports) * 100) : 0;
  const free = gittertiere.filter((g) => g.status !== "Gelöst").length;
  const resolvedNow = gittertiere.filter((g) => g.status === "Gelöst").length;

  const countByHoodAllTime = new Map<string, number>();
  for (const e of registry) {
    countByHoodAllTime.set(
      e.neighborhood,
      (countByHoodAllTime.get(e.neighborhood) ?? 0) + 1,
    );
  }
  const topHood = [...countByHoodAllTime.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];
  const uniqueAreasAllTime = new Set(registry.map((e) => e.zipcode)).size;

  const yearTotals = totalsByYear(registry);
  const yearEntries = Object.entries(yearTotals).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const totalEverSeen = registry.length;

  const resolvedRegistry = registry.filter((e) => e.resolvedAt !== null);
  const catchTimes = resolvedRegistry.map((e) =>
    daysBetween(e.firstSeen, e.resolvedAt as string),
  );
  const avgCatchDays =
    catchTimes.length > 0
      ? catchTimes.reduce((a, b) => a + b, 0) / catchTimes.length
      : null;

  const todayMs = Date.now();
  const sevenDaysAgo = todayMs - 7 * 86_400_000;
  const recentResolved = resolvedRegistry.filter(
    (e) => new Date(e.resolvedAt as string).getTime() >= sevenDaysAgo,
  );
  const recentCatchTimes = recentResolved.map((e) =>
    daysBetween(e.firstSeen, e.resolvedAt as string),
  );
  const fastestRecentCatch =
    recentCatchTimes.length > 0 ? Math.min(...recentCatchTimes) : null;

  const totalResolvedEver = resolvedRegistry.length;
  const catchRate =
    totalEverSeen > 0
      ? Math.round((totalResolvedEver / totalEverSeen) * 100)
      : 0;

  const facts: (Fact | null)[] = [
    {
      icon: "🏆",
      title: "Platz 1 im Mängelmelder",
      text: `${percentage}% aller gemeldeten Probleme in Mönchengladbach sind entlaufene Einkaufswagen. Ein ganzer Verwaltungsapparat ist damit beschäftigt, sie wieder einzufangen.`,
    },
    {
      icon: "🦁",
      title: "Freilebende Population",
      text:
        free > 0
          ? `${free} Gittertiere streifen aktuell frei durch das Stadtgebiet. ${resolvedNow} sind derzeit als eingefangen verzeichnet.`
          : `Aktuell sind alle Gittertiere eingefangen. Erfahrungsgemäß nur vorübergehend.`,
    },
    topHood
      ? {
          icon: "📍",
          title: `Hotspot: ${topHood[0]}`,
          text: `${topHood[1]} dokumentierte Sichtungen seit Beginn der Beobachtung — das beliebteste Revier der Gladbacher Gittertiere. Was sie dorthin zieht, ist der Wissenschaft ein Rätsel.`,
        }
      : null,
    {
      icon: "🗺️",
      title: "Verbreitungsgebiet",
      text: `Gittertiere wurden in ${uniqueAreasAllTime} Postleitzahlgebieten dokumentiert. Kein Stadtteil ist vor ihnen sicher.`,
    },
    avgCatchDays !== null
      ? (() => {
          const fastestPart =
            fastestRecentCatch === null
              ? "Diese Woche wurde noch nichts eingefangen."
              : fastestRecentCatch < 0.5
                ? "Schnellster Fang dieser Woche noch am gleichen Tag."
                : `Schnellster Fang dieser Woche: ${formatCatchDays(fastestRecentCatch)}.`;
          return {
            icon: "⏱️",
            title: "Durchschnittliche Fangzeit",
            text: `Vom ersten Sichtungseintrag bis zur Rückkehr ins Gehege vergehen im Schnitt ${formatCatchDays(avgCatchDays, true)}. ${fastestPart} Insgesamt ${totalResolvedEver} von ${totalEverSeen} Akten geschlossen (${catchRate}%).`,
          };
        })()
      : null,
    {
      icon: "🤔",
      title: "Die große Frage",
      text: `${totalMagsReports} offene Meldungen, ${total} davon Einkaufswagen. Manche Städte haben Tauben. Mönchengladbach hat Gittertiere.`,
    },
    totalEverSeen > 0
      ? {
          icon: "📚",
          title: "Akten seit Beginn",
          text: `Insgesamt ${totalEverSeen} Gittertiere wurden seit Beginn der Beobachtung dokumentiert. Die Akte wächst.`,
          breakdown: yearEntries.map(([year, count]) => ({ year, count })),
        }
      : null,
  ];

  const visibleFacts = facts.filter((f): f is Fact => f !== null);

  return (
    <article className="py-8 border-b border-stone-200">
      <h3 className="font-serif text-xl font-bold text-stone-800 mb-4">
        Wussten Sie schon?
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleFacts.map((fact, i) => (
          <div key={i} className="border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{fact.icon}</span>
              <h4 className="font-bold text-sm text-stone-800">{fact.title}</h4>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              {fact.text}
            </p>
            {fact.breakdown && (
              <ul className="mt-3 border-t border-stone-100 pt-2 space-y-1 text-xs">
                {fact.breakdown.map(({ year, count }) => (
                  <li
                    key={year}
                    className="flex justify-between text-stone-500"
                  >
                    <span className="font-mono tracking-wider">{year}</span>
                    <span>
                      <strong className="text-stone-800">{count}</strong>{" "}
                      Sichtungen
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
