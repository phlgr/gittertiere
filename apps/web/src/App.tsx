import { useSnapshot } from "./hooks/useSnapshot";
import { GittertierMap } from "./components/GittertierMap";
import { HotspotChart } from "./components/HotspotChart";
import { PopulationTimeline } from "./components/PopulationTimeline";
import { TicketList } from "./components/TicketList";
import { FunFacts } from "./components/FunFacts";

export default function App() {
  const { snapshot, history, error, loading } = useSnapshot();

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
        />

        {/* Ticket list */}
        <section className="py-8 border-b border-stone-200">
          <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
            Alle Sichtungen
          </h3>
          <p className="text-stone-400 text-sm mb-4">
            {gittertiere.length} dokumentierte Exemplare
          </p>
          <TicketList gittertiere={gittertiere} />
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
          <span>Kein offizielles Angebot · Open-Source-Spaßprojekt</span>
        </div>
      </footer>
    </div>
  );
}
