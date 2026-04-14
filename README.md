# 🛒 Gittertier Tracker MG

Tracking stray shopping carts ("Gittertiere") in Mönchengladbach, Germany.

"Gittertier" (literally "grid animal") is a German internet meme — an affectionate nickname for shopping carts found abandoned in the wild. In Mönchengladbach, they are the **#1 reported issue** in the city's official [mags Mängelmelder](https://mags.de/service/mags-melder/), making up ~35–49% of all reports.

This dashboard tracks every escaped shopping cart, treating them like wildlife sightings — because honestly, at this point, they kind of are.

## Features

- **Live stats** — total sightings, capture rate, population on the loose
- **Interactive map** — all known Gittertier locations with status-coded markers and photos
- **Hotspot ranking** — which neighborhoods have the most activity
- **Field log** — sortable/filterable list of every documented specimen
- **Fun facts** — satirical nature-documentary-style commentary on the data

## Tech Stack

- **Monorepo**: Bun workspaces + Turborepo
- **Frontend**: React, Vite, Tailwind CSS
- **Map**: Leaflet (with CARTO dark basemap)
- **Charts**: Recharts
- **Scraper**: Bun script fetching from the mags Mängelmelder public API
- **Deployment**: GitHub Pages via GitHub Actions

## Getting Started

```bash
bun install
bun run scrape        # fetch latest data from mags
cd apps/web && bun run dev   # start dashboard at localhost:5173
```

## Project Structure

```
├── apps/
│   ├── web/           # React dashboard
│   └── scraper/       # Daily data fetcher
├── packages/
│   └── shared/        # Types and filtering logic
├── data/              # JSON snapshots
└── .github/workflows/ # Scrape cron + GitHub Pages deploy
```

## Data Source

Data comes from the [mags Mängelmelder](https://mags.de/service/mags-melder/), the public defect reporting system of mags (Mönchengladbacher Abfall-, Grün- und Straßenbetriebe). The scraper runs once daily and is intentionally conservative.

## License

MIT
