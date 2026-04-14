import type { Gittertier } from "@gittertier/shared";

interface FunFactsProps {
  gittertiere: Gittertier[];
  totalMagsReports: number;
}

export function FunFacts({ gittertiere, totalMagsReports }: FunFactsProps) {
  const total = gittertiere.length;
  const percentage =
    totalMagsReports > 0 ? Math.round((total / totalMagsReports) * 100) : 0;
  const free = gittertiere.filter((g) => g.status !== "Gelöst").length;
  const resolved = gittertiere.filter((g) => g.status === "Gelöst").length;

  const countByHood = new Map<string, number>();
  for (const g of gittertiere) {
    countByHood.set(g.neighborhood, (countByHood.get(g.neighborhood) ?? 0) + 1);
  }
  const topHood = [...countByHood.entries()].sort((a, b) => b[1] - a[1])[0];
  const uniqueAreas = new Set(gittertiere.map((g) => g.zipcode)).size;

  const facts = [
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
          ? `${free} Gittertiere streifen aktuell frei durch das Stadtgebiet. ${resolved} konnten bereits eingefangen und in ihre Gehege zurückgebracht werden.`
          : `Aktuell sind alle Gittertiere eingefangen. Erfahrungsgemäß nur vorübergehend.`,
    },
    topHood
      ? {
          icon: "📍",
          title: `Hotspot: ${topHood[0]}`,
          text: `${topHood[1]} Sichtungen — das beliebteste Revier der Gladbacher Gittertiere. Was sie dorthin zieht, ist der Wissenschaft ein Rätsel.`,
        }
      : null,
    {
      icon: "🗺️",
      title: "Verbreitungsgebiet",
      text: `Gittertiere wurden in ${uniqueAreas} Postleitzahlgebieten dokumentiert. Kein Stadtteil ist vor ihnen sicher.`,
    },
    {
      icon: "🤔",
      title: "Die große Frage",
      text: `${totalMagsReports} offene Meldungen, ${total} davon Einkaufswagen. Manche Städte haben Tauben. Mönchengladbach hat Gittertiere.`,
    },
  ].filter(Boolean) as { icon: string; title: string; text: string }[];

  return (
    <article className="py-8 border-b border-stone-200">
      <h3 className="font-serif text-xl font-bold text-stone-800 mb-4">
        Wussten Sie schon?
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {facts.map((fact, i) => (
          <div key={i} className="border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{fact.icon}</span>
              <h4 className="font-bold text-sm text-stone-800">{fact.title}</h4>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              {fact.text}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
