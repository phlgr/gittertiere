import { useSnapshot } from "./hooks/useSnapshot";
import { GittertierMap } from "./components/GittertierMap";
import { HotspotChart } from "./components/HotspotChart";
import { PopulationTimeline } from "./components/PopulationTimeline";
import { TicketList } from "./components/TicketList";
import { FunFacts } from "./components/FunFacts";

export default function App() {
  const { snapshot, history, registry, error, loading } = useSnapshot();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f3]">
        <p className="text-stone-400">Laden...</p>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f3]">
        <div className="max-w-md px-4">
          <p className="text-red-700 mb-2 font-bold">
            Daten konnten nicht geladen werden.
          </p>
          <p className="text-stone-500 text-sm">
            {error ?? "Bitte zuerst den Scraper ausführen."}
          </p>
        </div>
      </div>
    );
  }

  const { gittertiere, totalMagsReports } = snapshot;
  const free = gittertiere.filter((g) => g.status !== "Gelöst").length;
  const resolved = gittertiere.filter((g) => g.status === "Gelöst").length;
  const captureRate =
    gittertiere.length > 0
      ? Math.round((resolved / gittertiere.length) * 100)
      : 0;
  const percentage =
    totalMagsReports > 0
      ? Math.round((gittertiere.length / totalMagsReports) * 100)
      : 0;
  const totalEverSeen =
    registry.length > 0 ? registry.length : gittertiere.length;

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Masthead */}
      <header className="mx-4 sm:mx-auto max-w-4xl">
        <div className="py-4 text-center">
          <div className="text-[0.65rem] uppercase tracking-[0.3em] text-stone-400 mb-1">
            Mönchengladbach · Sonderausgabe ·{" "}
            {new Date(snapshot.fetchedAt).toLocaleDateString("de-DE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-900 leading-none">
            Gittertier Tracker
          </h1>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-400 mt-1">
            Das Leitmedium für entlaufene Einkaufswagen
          </div>
        </div>
      </header>

      {/* Ticker bar */}
      <div className="sticky top-0 z-[1000] border-b border-stone-200 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs font-medium">
          <span>
            🛒 <strong>{gittertiere.length}</strong> Sichtungen
          </span>
          <span>
            🏃 <strong>{free}</strong> auf freiem Fuß
          </span>
          <span>
            ✅ <strong>{captureRate}%</strong> Einfangquote
          </span>
          <span>
            📊 <strong>{percentage}%</strong> aller mags-Meldungen
          </span>
          <span>
            🗂️ <strong>{totalEverSeen}</strong> Fälle insgesamt
          </span>
          <span className="hidden sm:inline text-stone-500">·</span>
          <a
            href="https://mags.de/service/mags-melder/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-100 underline underline-offset-2"
          >
            Sichtung melden
          </a>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4">
        {/* Headline */}
        <article className="py-8 border-b border-stone-200">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 leading-tight mb-4">
            {free > 0 ? (
              <>
                {free} Einkaufswagen streunen
                <br />
                durch die Stadt
              </>
            ) : (
              <>Alle Einkaufswagen eingefangen — vorerst</>
            )}
          </h2>
          <p className="text-stone-600 leading-relaxed max-w-2xl">
            Entlaufene Einkaufswagen sind das meistgemeldete Problem im{" "}
            <a
              href="https://mags.de/service/mags-melder/"
              className="text-amber-700 hover:text-amber-900 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              mags Mängelmelder
            </a>
            . Sie machen {percentage}% aller Meldungen aus. Diese Seite
            dokumentiert das Ausmaß der Lage.
          </p>
        </article>

        {/* Map */}
        <section className="py-8 border-b border-stone-200">
          <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
            Karte der Sichtungen
          </h3>
          <p className="text-stone-400 text-sm mb-3">
            Letzte bekannte Aufenthaltsorte im Stadtgebiet
          </p>
          <GittertierMap gittertiere={gittertiere} />
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
              Entlaufen
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
              Einfangversuch
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              Eingefangen
            </span>
          </div>
        </section>

        {/* Two-column: timeline + hotspots */}
        <div className="grid lg:grid-cols-2 gap-0 lg:divide-x divide-stone-200 border-b border-stone-200">
          <section className="py-8 lg:pr-8">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
              Population über Zeit
            </h3>
            <p className="text-stone-400 text-sm mb-3">
              Tägliche Bestandsaufnahme
            </p>
            <PopulationTimeline history={history} />
          </section>
          <section className="py-8 lg:pl-8">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
              Beliebteste Reviere
            </h3>
            <p className="text-stone-400 text-sm mb-3">
              Sichtungen nach Stadtteil
            </p>
            <HotspotChart gittertiere={gittertiere} />
          </section>
        </div>

        {/* Fun facts */}
        <FunFacts
          gittertiere={gittertiere}
          totalMagsReports={totalMagsReports}
          registry={registry}
        />

        {/* Ticket list */}
        <section className="py-8 border-b border-stone-200">
          <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
            Alle Sichtungen
          </h3>
          <p className="text-stone-400 text-sm mb-4">
            {gittertiere.length} dokumentierte Exemplare
          </p>
          <TicketList gittertiere={gittertiere} registry={registry} />
        </section>

        {/* CTA */}
        <section className="py-10 text-center">
          <p className="text-stone-500 text-sm mb-3">
            🛒 Einkaufswagen in freier Wildbahn gesichtet?
          </p>
          <a
            href="https://mags.de/service/mags-melder/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors"
          >
            Beim mags Mängelmelder melden &rarr;
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 bg-[#f5f2eb]">
        <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-stone-400">
          <span>
            Daten:{" "}
            <a
              href="https://mags.de/service/mags-melder/"
              className="underline underline-offset-2 hover:text-stone-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              mags Mängelmelder
            </a>
          </span>
          <span>
            Kein offizielles Angebot ·{" "}
            <a
              href="https://github.com/phlgr/gittertiere"
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-stone-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Open Source
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
