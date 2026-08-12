/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { ReportStatus } from "../../lib/types";

interface ReportMiniGISMapProps {
  lat: number;
  lng: number;
  riverName: string;
  locationDetail?: string;
  status: ReportStatus;
  ticketNo?: string;
  categoryLabel?: string;
}

const STATUS_COLOR_MAP: Record<ReportStatus, { color: string; bg: string; label: string }> = {
  pending: { color: "#F59E0B", bg: "bg-amber-500", label: "Pending Vote" },
  terverifikasi: { color: "#EF4444", bg: "bg-rose-500", label: "Terverifikasi DLH" },
  diproses: { color: "#0284C7", bg: "bg-sky-500", label: "Sedang Ditangani" },
  selesai: { color: "#10B981", bg: "bg-emerald-500", label: "Selesai Clean" },
  ditolak: { color: "#64748B", bg: "bg-slate-500", label: "Ditolak DLH" },
};

export default function ReportMiniGISMap({
  lat,
  lng,
  riverName,
  locationDetail,
  status,
  ticketNo,
  categoryLabel,
}: ReportMiniGISMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const safeLat = typeof lat === "number" && !isNaN(lat) ? lat : -6.22;
    const safeLng = typeof lng === "number" && !isNaN(lng) ? lng : 106.84;

    const map = L.map(mapContainerRef.current, {
      center: [safeLat, safeLng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }
    ).addTo(map);

    // 500m Geofencing Radius
    const geofenceCircle = L.circle([safeLat, safeLng], {
      radius: 500,
      color: "#0284C7",
      fillColor: "#38BDF8",
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: "4, 6",
    }).addTo(map);

    const stConfig = STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP.pending;

    // Custom Map Marker with status color
    const customIcon = L.divIcon({
      className: "custom-mini-report-marker",
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
          <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: ${stConfig.color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="width: 24px; height: 24px; border-radius: 9999px; background-color: ${stConfig.color}; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background-color: #ffffff;"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const marker = L.marker([safeLat, safeLng], { icon: customIcon }).addTo(map);

    const popupContent = `
      <div style="font-family: inherit; font-size: 11px; padding: 4px; max-width: 200px;">
        <strong style="color: #0f172a; display: block; margin-bottom: 2px;">${ticketNo ? `#${ticketNo}` : "Titik Laporan"}</strong>
        <p style="color: #475569; margin: 0 0 4px 0; font-size: 10px;">${riverName}</p>
        <span style="display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 9px; font-weight: bold; background: ${stConfig.color}20; color: ${stConfig.color};">
          ${stConfig.label}
        </span>
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, status, riverName, ticketNo, categoryLabel]);

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
      <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0284C7]" />
          <span className="font-bold text-xs text-slate-800">Peta Spasial Lokasi Presisi</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md border border-sky-200">
          Radius Geofence: 500m
        </span>
      </div>

      <div className="relative w-full h-64 sm:h-72 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-[11px] text-slate-500 font-medium">
          Koordinat: <strong className="font-mono text-slate-700">{lat?.toFixed(5)}, {lng?.toFixed(5)}</strong>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Buka di Google Maps</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </div>
  );
}
