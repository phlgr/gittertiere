import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Gittertier } from "@gittertier/shared";
import { imageUrl } from "@gittertier/shared";

interface GittertierMapProps {
  gittertiere: Gittertier[];
}

const STATUS_COLORS: Record<string, string> = {
  Neu: "#dc2626",
  "In Arbeit": "#ca8a04",
  Gelöst: "#16a34a",
};

function createCircleIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10],
  });
}

export function GittertierMap({ gittertiere }: GittertierMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const MG_BOUNDS = L.latLngBounds([51.10, 6.30], [51.28, 6.55]);

    const map = L.map(mapRef.current, {
      center: [51.185, 6.442],
      zoom: 13,
      minZoom: 11,
      zoomControl: true,
      maxBounds: MG_BOUNDS,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
        bounds: MG_BOUNDS,
      },
    ).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    for (const g of gittertiere) {
      if (!g.lat || !g.lng) continue;

      const color = STATUS_COLORS[g.status] ?? "#888";
      const icon = createCircleIcon(color);

      const imageHtml =
        g.images.length > 0
          ? `<img src="${imageUrl(g.images[0])}" alt="Foto" style="width:100%;max-width:200px;border-radius:3px;margin-top:0.4rem;" loading="lazy" />`
          : "";

      const storeHint =
        g.locationname &&
        g.locationname !== "Einkaufswagen" &&
        g.locationname !== "EKW"
          ? `<br/><span style="color:#888;font-size:0.7rem;">Vermutl. entlaufen aus: ${g.locationname}</span>`
          : "";

      const popup = `
        <div style="font-size:0.8rem;min-width:140px;line-height:1.4;">
          <div style="font-size:0.65rem;color:#999;margin-bottom:2px;">Nr. ${g.uid}</div>
          <strong>${g.street}</strong><br/>
          <span style="color:${color};">${g.statusLabel}</span><br/>
          <span style="color:#666;">${g.neighborhood}</span>
          ${storeHint}
          ${imageHtml}
        </div>
      `;

      L.marker([g.lat, g.lng], { icon }).addTo(map).bindPopup(popup);
    }
  }, [gittertiere]);

  return (
    <div className="border border-stone-200 overflow-hidden">
      <div ref={mapRef} className="h-[450px] w-full" />
    </div>
  );
}
