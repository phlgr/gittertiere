/** Raw response from the mags Mängelmelder API */
export interface MagsApiResponse {
  config: {
    totalHits: number;
    legendImg: string;
    markerImg: string;
  };
  address: MagsTicket[];
}

/** A single ticket from the mags API */
export interface MagsTicket {
  uid: number;
  type: string;
  name: string;
  area: string;
  street: string;
  zipcode: string;
  city: string;
  coordinates: string;
  maptitle: string;
  locationname: string;
  category: string;
  descriptionger: string;
  status: string;
  responsible: string;
  images: string[];
}

/** Parsed status of a Gittertier sighting */
export type GittertierStatus = "Neu" | "In Arbeit" | "Gelöst";

/** A processed Gittertier sighting with parsed coordinates */
export interface Gittertier {
  uid: number;
  street: string;
  zipcode: string;
  neighborhood: string;
  lat: number;
  lng: number;
  status: GittertierStatus;
  statusLabel: string;
  responsible: string;
  locationname: string;
  images: string[];
}

/** A stored data snapshot */
export interface Snapshot {
  fetchedAt: string;
  totalMagsReports: number;
  gittertiere: Gittertier[];
}

/** A single case in the persistent registry — keyed by uid, never deleted.
 * Disappearing from the mags API is treated as resolution: the case is closed
 * with `resolvedAt` set to the scrape day we first noticed it was gone. */
export interface RegistryEntry {
  uid: number;
  street: string;
  zipcode: string;
  neighborhood: string;
  lat: number;
  lng: number;
  firstSeen: string;          // YYYY-MM-DD
  lastSeen: string;           // YYYY-MM-DD — last scrape day this uid was present in the API
  resolvedAt: string | null;  // YYYY-MM-DD — day status first became "Gelöst" (or day we first noticed disappearance)
  status: GittertierStatus;
}

/** A single daily history entry appended by the scraper */
export interface HistoryEntry {
  date: string;
  total: number;
  neu: number;
  inArbeit: number;
  geloest: number;
  totalMagsReports: number;
  newSightings: number;
  removed: number;
  byNeighborhood: Record<string, { total: number; neu: number; inArbeit: number; geloest: number }>;
}
