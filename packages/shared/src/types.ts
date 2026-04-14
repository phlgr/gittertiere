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
