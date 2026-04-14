import { useSnapshot } from "./hooks/useSnapshot";
import { HeroStats } from "./components/HeroStats";
import { GittertierMap } from "./components/GittertierMap";
import { HotspotChart } from "./components/HotspotChart";
import { PopulationTimeline } from "./components/PopulationTimeline";
import { TicketList } from "./components/TicketList";
import { FunFacts } from "./components/FunFacts";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-zinc-100 mb-1">{title}</h2>
      {subtitle && (
        <p className="text-zinc-500 text-sm mb-4 italic">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-4" />}
      {children}
    </section>
  );
}

export default function App() {
  const { snapshot, history, error, loading } = useSnapshot();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛒</div>
          <p className="text-zinc-400 italic">
            Spuren werden gesichert...
          </p>
        </div>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🛒💨</div>
          <p className="text-red-400 mb-2 font-bold">
            Die Gittertiere haben sich versteckt
          </p>
          <p className="text-zinc-500 text-sm">
            {error ??
              "Keine Daten verfügbar. Bitte zuerst den Scraper ausführen, um die Population zu erfassen."}
          </p>
        </div>
      </div>
    );
  }

  const { gittertiere, totalMagsReports } = snapshot;
  const free = gittertiere.filter((g) => g.status !== "Gelöst").length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <h1 className="text-lg font-bold text-amber-400">
              Gittertier Tracker MG
            </h1>
          </div>
          <div className="text-right text-xs text-zinc-600">
            Letzte Bestandsaufnahme:{" "}
            {new Date(snapshot.fetchedAt).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-zinc-800 bg-gradient-to-b from-amber-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-amber-500/80 text-sm font-medium tracking-widest uppercase mb-3">
            Wildtier-Monitoring Mönchengladbach
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            {free > 0 ? (
              <>
                <span className="text-amber-400">{free}</span> Gittertiere
                <br className="sm:hidden" /> in freier Wildbahn
              </>
            ) : (
              <>
                Alle Gittertiere
                <br className="sm:hidden" /> eingefangen!
              </>
            )}
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Einkaufswagen sind das meistgemeldete Problem im{" "}
            <a
              href="https://mags.de/service/mags-melder/"
              className="text-amber-500 hover:text-amber-400 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              mags Mängelmelder
            </a>
            . Wir tracken jedes einzelne Exemplar,
            das aus seinem Supermarkt-Gehege ausbricht und die Straßen von
            Mönchengladbach unsicher macht.
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        <HeroStats
          gittertiere={gittertiere}
          totalMagsReports={totalMagsReports}
        />

        <Section
          title="Lebensraum-Karte"
          subtitle="Bekannte Aufenthaltsorte und letzte Sichtungen im Stadtgebiet"
        >
          <GittertierMap gittertiere={gittertiere} />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
              Frisch entlaufen
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500" />
              Einfangversuch läuft
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
              Zurück im Gehege
            </span>
          </div>
        </Section>

        <Section
          title="Populationsentwicklung"
          subtitle="Wie sich die Gittertier-Population über die Zeit entwickelt"
        >
          <PopulationTimeline history={history} />
        </Section>

        <Section
          title="Beliebteste Reviere"
          subtitle="Wo die Gittertiere am liebsten herumstreunen"
        >
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
            <HotspotChart gittertiere={gittertiere} />
          </div>
        </Section>

        <Section title="Aus den Akten der Gittertier-Forschung">
          <FunFacts
            gittertiere={gittertiere}
            totalMagsReports={totalMagsReports}
          />
        </Section>

        <Section
          title="Feldprotokoll"
          subtitle="Alle dokumentierten Individuen im Überblick"
        >
          <TicketList gittertiere={gittertiere} />
        </Section>

        {/* CTA */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 text-center">
          <p className="text-2xl mb-2">🛒👀</p>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">
            Gittertier in freier Wildbahn gesichtet?
          </h3>
          <p className="text-zinc-400 text-sm mb-4 max-w-lg mx-auto">
            Melde entlaufene Einkaufswagen direkt über den offiziellen mags
            Mängelmelder. Jede Sichtung zählt für die Forschung!
          </p>
          <a
            href="https://mags.de/service/mags-melder/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm transition-colors"
          >
            Sichtung melden
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center space-y-3">
          <p className="text-zinc-500 text-sm italic">
            &bdquo;Das Gittertier ist ein scheues, aber überraschend mobiles
            Geschöpf, das bevorzugt in urbanen Feuchtgebieten und an
            Bushaltestellen anzutreffen ist.&ldquo;
          </p>
          <p className="text-zinc-600 text-xs">
            Daten:{" "}
            <a
              href="https://mags.de/service/mags-melder/"
              className="text-amber-600 hover:text-amber-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              mags Mängelmelder
            </a>{" "}
            · Kein offizielles Angebot der Stadt Mönchengladbach ·{" "}
            Gittertier Tracker ist ein Open-Source-Spaßprojekt
          </p>
        </div>
      </footer>
    </div>
  );
}
