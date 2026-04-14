import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Gittertier } from "@gittertier/shared";
import { imageUrl } from "@gittertier/shared";

interface GittertierMapProps {
  gittertiere: Gittertier[];
}

const STATUS_COLORS: Record<string, string> = {
  Neu: "#ef4444",
  "In Arbeit": "#eab308",
  Gelöst: "#22c55e",
};

const STATUS_EMOJI: Record<string, string> = {
  Neu: "🏃",
  "In Arbeit": "🎯",
  Gelöst: "🏠",
};

function createCircleIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid rgba(255,255,255,0.9);
      box-shadow: 0 0 8px ${color}99;
      cursor: pointer;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  });
}

export function GittertierMap({ gittertiere }: GittertierMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [51.185, 6.442],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
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

      const color = STATUS_COLORS[g.status] ?? "#a1a1aa";
      const emoji = STATUS_EMOJI[g.status] ?? "🛒";
      const icon = createCircleIcon(color);

      const imageHtml =
        g.images.length > 0
          ? `<img src="${imageUrl(g.images[0])}" alt="Beweisfoto" style="width:100%;max-width:200px;border-radius:0.5rem;margin-top:0.5rem;border:1px solid #3f3f46;" loading="lazy" />`
          : "";

      const storeHint =
        g.locationname &&
        g.locationname !== "Einkaufswagen" &&
        g.locationname !== "EKW"
          ? `<br/><span style="color:#a1a1aa;font-size:0.75rem;">Vermutlich entlaufen aus: ${g.locationname}</span>`
          : "";

      const popup = `
        <div style="font-size:0.875rem;min-width:160px;">
          <div style="font-size:0.7rem;color:#71717a;margin-bottom:0.25rem;">Akte #${g.uid}</div>
          <strong>🛒 ${g.street}</strong><br/>
          <span style="color:${color};">${emoji} ${g.statusLabel}</span><br/>
          <span style="color:#a1a1aa;">${g.neighborhood}</span>
          ${storeHint}
          ${imageHtml}
        </div>
      `;

      L.marker([g.lat, g.lng], { icon }).addTo(map).bindPopup(popup);
    }
  }, [gittertiere]);

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800">
      <div ref={mapRef} className="h-[500px] w-full" />
    </div>
  );
}
