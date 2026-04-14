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

  // Find most active neighborhood
  const countByHood = new Map<string, number>();
  for (const g of gittertiere) {
    countByHood.set(g.neighborhood, (countByHood.get(g.neighborhood) ?? 0) + 1);
  }
  const topHood = [...countByHood.entries()].sort((a, b) => b[1] - a[1])[0];

  // Count unique PLZ areas
  const uniqueAreas = new Set(gittertiere.map((g) => g.zipcode)).size;

  // Count sightings with photos
  const withPhotos = gittertiere.filter((g) => g.images.length > 0).length;

  const facts = [
    {
      icon: "🏆",
      title: "Platz 1 im Mängelmelder",
      text: `Vergiss Schlaglöcher, vergiss kaputte Laternen — in Mönchengladbach sind ${percentage}% aller gemeldeten Probleme entlaufene Einkaufswagen. Ein ganzer Verwaltungsapparat ist damit beschäftigt, Einkaufswagen einzusammeln.`,
    },
    {
      icon: "🦁",
      title: "Freilebende Population",
      text:
        free > 0
          ? `Aktuell streifen ${free} Gittertiere unkontrolliert durch das Stadtgebiet. ${resolved} weitere konnten bereits eingefangen und in ihre Supermarkt-Gehege zurückgebracht werden. Der Kreislauf des Lebens.`
          : `Aktuell sind alle bekannten Gittertiere eingefangen. Aber keine Sorge — Ausbrüche sind nur eine Frage der Zeit.`,
    },
    topHood
      ? {
          icon: "📍",
          title: `Hotspot: ${topHood[0]}`,
          text: `Mit ${topHood[1]} Sichtungen ist ${topHood[0]} das beliebteste Revier der Gladbacher Gittertiere. Was sie dorthin zieht, ist der Wissenschaft bislang ein Rätsel.`,
        }
      : null,
    {
      icon: "🗺️",
      title: "Verbreitungsgebiet",
      text: `Gittertiere wurden in ${uniqueAreas} verschiedenen Postleitzahlgebieten dokumentiert. Ihr natürlicher Lebensraum erstreckt sich von Rheydt bis Stadtmitte — kein Stadtteil ist vor ihnen sicher.`,
    },
    withPhotos > 0
      ? {
          icon: "📸",
          title: "Beweisfotos",
          text: `Bei ${withPhotos} von ${total} Sichtungen liegt Fotomaterial vor. Die Bürger von Mönchengladbach dokumentieren entlaufene Einkaufswagen mit einer Sorgfalt, die man sich bei Blitzer-Fotos wünschen würde.`,
        }
      : null,
    {
      icon: "🤔",
      title: "Die große Frage",
      text: `Warum liegt hier überhaupt Einkaufswagen? ${totalMagsReports} offene Meldungen hat der mags Mängelmelder insgesamt. ${total} davon sind Einkaufswagen. Manche Städte haben ein Taubenproblem. Mönchengladbach hat Gittertiere.`,
    },
  ].filter(Boolean) as { icon: string; title: string; text: string }[];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {facts.map((fact, i) => (
        <div
          key={i}
          className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{fact.icon}</span>
            <h3 className="font-bold text-sm text-zinc-200">{fact.title}</h3>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">{fact.text}</p>
        </div>
      ))}
    </div>
  );
}
