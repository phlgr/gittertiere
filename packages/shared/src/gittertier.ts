import type { MagsTicket, Gittertier, GittertierStatus } from "./types.js";

/** PLZ to neighborhood name mapping for Mönchengladbach */
export const PLZ_NEIGHBORHOODS: Record<string, string> = {
  "41061": "Stadtmitte",
  "41063": "Eicken / Bonnenbroich",
  "41065": "Lürrip / Hardterbroich",
  "41066": "Neuwerk",
  "41068": "Uedding",
  "41069": "Holt / Westend",
  "41189": "Wickrath",
  "41199": "Odenkirchen",
  "41236": "Rheydt",
  "41238": "Giesenkirchen",
  "41239": "Mülfort",
};

/** Human-friendly status labels (wildlife tracker theme) */
const STATUS_LABELS: Record<GittertierStatus, string> = {
  Neu: "Frisch entlaufen",
  "In Arbeit": "Einfangversuch läuft",
  Gelöst: "Zurück im Gehege",
};

/** Check if a mags ticket is a Gittertier (shopping cart) sighting */
export function isGittertier(ticket: MagsTicket): boolean {
  if (ticket.category === "Einkaufswagen") return true;
  if (ticket.type === "Einkaufswagen") return true;

  const loc = ticket.locationname.toLowerCase();
  if (loc.includes("einkaufswagen") || loc.includes("einkauswagen"))
    return true;
  if (loc === "ekw" || loc.startsWith("ekw ")) return true;

  return false;
}

/** Parse a coordinate string "lat,lng" into numbers */
function parseCoordinates(coords: string): { lat: number; lng: number } {
  const [lat, lng] = coords.split(",").map(Number);
  return { lat: lat || 0, lng: lng || 0 };
}

/** Normalize the status string to a known GittertierStatus */
function parseStatus(status: string): GittertierStatus {
  if (status === "Neu") return "Neu";
  if (status === "In Arbeit") return "In Arbeit";
  return "Gelöst";
}

/** Convert a raw mags ticket to a processed Gittertier */
export function toGittertier(ticket: MagsTicket): Gittertier {
  const { lat, lng } = parseCoordinates(ticket.coordinates);
  const status = parseStatus(ticket.status);

  return {
    uid: ticket.uid,
    street: ticket.street,
    zipcode: ticket.zipcode,
    neighborhood: PLZ_NEIGHBORHOODS[ticket.zipcode] ?? "Unbekannt",
    lat,
    lng,
    status,
    statusLabel: STATUS_LABELS[status],
    responsible: ticket.responsible,
    locationname: ticket.locationname,
    images: ticket.images,
  };
}

/** Build the full image URL from a relative path */
export function imageUrl(relativePath: string): string {
  return `https://mags.de${relativePath}`;
}
