"use client";

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import {
  MapPin,
  Crosshair,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";

// =======================================================================
// KONFIGURASI WARNA & STYLE SEGMEN SUNGAI (GEOJSON POLYLINE)
// =======================================================================
// "default"  -> Hijau (#22c55e), segmen belum pernah dilaporkan
// "tercemar" -> Merah (#ef4444), laporan limbah cair / bau / bahaya
// "sampah"   -> Oranye (#f97316), laporan sampah plastik menumpuk
const RIVER_STATUS_STYLE: Record<
  string,
  { color: string; weight: number; opacity: number; label: string; badgeBg: string }
> = {
  default: {
    color: "#22c55e",
    weight: 6,
    opacity: 0.9,
    label: "Normal / Clean 🟢",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  tercemar: {
    color: "#ef4444",
    weight: 7,
    opacity: 0.95,
    label: "Tercemar / Bahaya 🔴",
    badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
  },
  sampah: {
    color: "#f97316",
    weight: 7,
    opacity: 0.95,
    label: "Banyak Sampah 🟠",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

function getRiverStyle(feature: any) {
  const status = feature?.properties?.status || "default";
  const style = RIVER_STATUS_STYLE[status] || RIVER_STATUS_STYLE.default;
  return {
    color: style.color,
    weight: style.weight,
    opacity: style.opacity,
    lineCap: "round" as const,
    lineJoin: "round" as const,
  };
}

// =======================================================================
// DATA SEGMEN GEOJSON DUMMY (FALLBACK LOKAL SAMA DENGAN RIVERS-DUMMY)
// =======================================================================
const GEOJSON_RIVER_DATA = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "sungai-ciliwung-01",
        nama_sungai: "Kali Ciliwung - Segmen Kalibata",
        status: "default",
        keterangan: "Belum ada laporan pencemaran pada segmen ini. Kondisi teratur.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.8451, -6.2615],
          [106.8465, -6.258],
          [106.848, -6.254],
          [106.8495, -6.25],
          [106.851, -6.246],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sungai-ciliwung-02",
        nama_sungai: "Kali Ciliwung - Segmen Manggarai",
        status: "tercemar",
        keterangan: "Laporan limbah cair terverifikasi, bau menyengat & busa industri.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.851, -6.246],
          [106.8525, -6.242],
          [106.854, -6.238],
          [106.8555, -6.234],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sungai-cipinang-01",
        nama_sungai: "Kali Cipinang - Segmen Jatinegara",
        status: "sampah",
        keterangan: "Banyak laporan sampah plastik rumah tangga menumpuk di bantaran.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.87, -6.235],
          [106.873, -6.232],
          [106.876, -6.229],
          [106.879, -6.226],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sungai-cipinang-02",
        nama_sungai: "Kali Cipinang - Segmen Rawa Terate",
        status: "default",
        keterangan: "Belum ada laporan pencemaran pada segmen ini.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.879, -6.226],
          [106.882, -6.2225],
          [106.885, -6.219],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sungai-kalimalang-01",
        nama_sungai: "Kalimalang - Segmen Bintara",
        status: "sampah",
        keterangan: "Penumpukan sampah plastik dan sisa pembuangan liar warga.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.955, -6.24],
          [106.96, -6.238],
          [106.965, -6.236],
          [106.97, -6.234],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sungai-pesanggrahan-01",
        nama_sungai: "Kali Pesanggrahan - Segmen Bintaro",
        status: "tercemar",
        keterangan: "Pencemaran limbah cair industri terverifikasi oleh petugas DLH.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.73, -6.285],
          [106.735, -6.282],
          [106.74, -6.278],
          [106.745, -6.274],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sungai-pesanggrahan-02",
        nama_sungai: "Kali Pesanggrahan - Segmen Kebon Jeruk",
        status: "default",
        keterangan: "Segmen terpantau normal dan bersih.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.745, -6.274],
          [106.75, -6.27],
          [106.755, -6.265],
        ],
      },
    },
  ],
};

// =======================================================================
// MARKER LAPORAN TITIK SPASIAL
// =======================================================================
interface ReportMarker {
  id: string;
  lat: number;
  lng: number;
  status: "pending" | "terverifikasi" | "diproses" | "selesai";
  judul: string;
  lokasi: string;
  upvotes: number;
  timeAgo: string;
  image?: string;
}

const REPORT_MARKERS: ReportMarker[] = [
  {
    id: "rpt-001",
    lat: -6.238,
    lng: 106.854,
    status: "terverifikasi",
    judul: "Limbah Cair Diduga Industri",
    lokasi: "Kali Ciliwung - Segmen Manggarai",
    upvotes: 142,
    timeAgo: "10 menit yang lalu",
    image: "/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg",
  },
  {
    id: "rpt-002",
    lat: -6.25,
    lng: 106.848,
    status: "diproses",
    judul: "Bau Menyengat & Air Keruh",
    lokasi: "Kali Ciliwung - Segmen Kalibata",
    upvotes: 98,
    timeAgo: "45 menit yang lalu",
    image: "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg",
  },
  {
    id: "rpt-003",
    lat: -6.229,
    lng: 106.876,
    status: "selesai",
    judul: "Pembersihan Sampah Plastik Selesai",
    lokasi: "Kali Cipinang - Segmen Jatinegara",
    upvotes: 210,
    timeAgo: "Dibersihkan kemarin",
    image: "/assets/sungai/sungai ciliwung bening.jpg",
  },
  {
    id: "rpt-004",
    lat: -6.282,
    lng: 106.73,
    status: "pending",
    judul: "Laporan Baru Menunggu Verifikasi",
    lokasi: "Kali Pesanggrahan - Segmen Bintaro",
    upvotes: 35,
    timeAgo: "2 jam yang lalu",
    image: "/assets/sungai/20200812-Sungai-Ciliwung-1_ratio-16x9.jpg",
  },
];

const REPORT_STATUS_COLOR: Record<string, { color: string; label: string; badgeBg: string }> = {
  pending: {
    color: "#f97316",
    label: "Pending 🟠",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
  },
  terverifikasi: {
    color: "#ef4444",
    label: "Terverifikasi 🔴",
    badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
  },
  diproses: {
    color: "#3b82f6",
    label: "Diproses DLH 🔵",
    badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
  },
  selesai: {
    color: "#22c55e",
    label: "Selesai 🟢",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
};

interface RiverGISMapProps {
  onSelectLocation?: (location: { lat: number; lng: number; riverName: string }) => void;
}

export default function RiverGISMap({ onSelectLocation }: RiverGISMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const selectedPinRef = useRef<L.Marker | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>("semua");
  const [selectedSpot, setSelectedSpot] = useState<{
    lat: number;
    lng: number;
    riverName: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Leaflet Map Instance with GeoJSON Rivers & Report Markers
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Jakarta River Basin
    const map = L.map(mapContainerRef.current, {
      center: [-6.24, 106.84],
      zoom: 12,
      zoomControl: false,
    });

    // High-Definition CartoDB Tile Layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Zoom Controls top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Add GeoJSON River Segments Layer (Vector Polylines)
    const geojsonLayer = L.geoJSON(GEOJSON_RIVER_DATA as any, {
      style: getRiverStyle,
      onEachFeature: (feature, layer) => {
        const { nama_sungai, status, keterangan } = feature.properties;
        const statusConfig = RIVER_STATUS_STYLE[status] || RIVER_STATUS_STYLE.default;

        layer.bindPopup(
          `<div class="p-1 max-w-[210px] font-sans">
            <div class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusConfig.badgeBg} mb-1.5">
              ${statusConfig.label}
            </div>
            <h4 class="font-extrabold text-xs text-slate-900 leading-tight mb-1">${nama_sungai}</h4>
            <p class="text-[11px] text-slate-600 font-medium leading-relaxed">${keterangan || ""}</p>
          </div>`,
          { closeButton: false, offset: [0, -5] }
        );

        // Hover Effect on River Vector Polylines
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 10, opacity: 1 });
            if (l.bringToFront) l.bringToFront();
          },
          mouseout: (e) => {
            geojsonLayer.resetStyle(e.target);
          },
          click: (e) => {
            const { lat, lng } = e.latlng;
            const formattedLat = parseFloat(lat.toFixed(4));
            const formattedLng = parseFloat(lng.toFixed(4));
            setSelectedSpot({
              lat: formattedLat,
              lng: formattedLng,
              riverName: nama_sungai,
            });
          },
        });
      },
    }).addTo(map);

    geojsonLayerRef.current = geojsonLayer;

    // Report Point Markers Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Map Click Listener for custom pin placement
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const formattedLat = parseFloat(lat.toFixed(4));
      const formattedLng = parseFloat(lng.toFixed(4));
      const estRiverName = `Lokasi Titik Spasial (${formattedLat}, ${formattedLng})`;

      setSelectedSpot({
        lat: formattedLat,
        lng: formattedLng,
        riverName: estRiverName,
      });

      if (selectedPinRef.current) {
        selectedPinRef.current.setLatLng([lat, lng]);
      } else {
        const customPinIcon = L.divIcon({
          className: "custom-selected-pin",
          html: `<div class="w-8 h-8 rounded-full bg-[#0284C7] ring-4 ring-[#0284C7]/30 text-white flex items-center justify-center shadow-2xl animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const newMarker = L.marker([lat, lng], { icon: customPinIcon }).addTo(map);
        selectedPinRef.current = newMarker;
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Report Point Markers on Filter Change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    const filtered = REPORT_MARKERS.filter((item) => {
      if (activeFilter === "semua") return true;
      return item.status === activeFilter;
    });

    filtered.forEach((spot) => {
      const config = REPORT_STATUS_COLOR[spot.status] || REPORT_STATUS_COLOR.pending;

      const customIcon = L.divIcon({
        className: "river-report-marker",
        html: `<div style="
                width: 28px; height: 28px; border-radius: 9999px;
                background:${config.color}; border:3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                display: flex; align-items: center; justify-content: center;
              " class="transition-transform hover:scale-125 cursor-pointer">
                <div style="width:8px; height:8px; border-radius:9999px; background:white;"></div>
              </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const popupHtml = `
        <div class="p-1 max-w-[220px] font-sans">
          ${
            spot.image
              ? `<div class="relative h-24 w-full rounded-xl overflow-hidden mb-2">
                  <img src="${spot.image}" alt="${spot.judul}" class="w-full h-full object-cover" />
                 </div>`
              : ""
          }
          <div class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${config.badgeBg} mb-1">
            ${config.label}
          </div>
          <h4 class="font-extrabold text-xs text-slate-900 leading-tight mb-1">${spot.judul}</h4>
          <p class="text-[10px] text-slate-500 font-medium mb-2">${spot.lokasi}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-600 font-bold border-t border-slate-100 pt-1.5">
            <span>👍 ${spot.upvotes} Dukungan</span>
            <span class="text-sky-600">${spot.timeAgo}</span>
          </div>
        </div>
      `;

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });
      marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -10] });
      marker.on("click", () => {
        setSelectedSpot({
          lat: spot.lat,
          lng: spot.lng,
          riverName: spot.lokasi,
        });
      });
      markersGroup.addLayer(marker);
    });
  }, [activeFilter]);

  // Locate User's Browser GPS Position
  const handleLocateUser = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const formattedLat = parseFloat(latitude.toFixed(4));
        const formattedLng = parseFloat(longitude.toFixed(4));
        const riverName = `Lokasi Presisi GPS Anda (${formattedLat}, ${formattedLng})`;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15, {
            duration: 1.5,
          });
        }

        setSelectedSpot({
          lat: formattedLat,
          lng: formattedLng,
          riverName,
        });

        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  // Confirm Location & Trigger Callback
  const handleConfirmLocation = () => {
    if (selectedSpot && onSelectLocation) {
      onSelectLocation(selectedSpot);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      
      {/* Map Control Header Bar */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800">
        
        {/* Title & Status Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Peta Status Segmen Sungai & Laporan (GeoJSON GIS)
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Vectors
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Garis sungai berwarna sesuai status pencemaran. Klik segmen atau penanda titik untuk melaporkan.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "semua", label: "Semua Titik" },
            { id: "terverifikasi", label: "Terverifikasi 🔴" },
            { id: "diproses", label: "Diproses 🔵" },
            { id: "selesai", label: "Selesai 🟢" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#0284C7] text-white shadow-md"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative w-full h-[460px] sm:h-[520px]">
        
        {/* Leaflet Container Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Quick GPS Auto-Locate Button (Top Left Overlay) */}
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold shadow-lg border border-slate-200/90 hover:bg-sky-50 hover:text-[#0284C7] transition-all cursor-pointer"
        >
          <Crosshair className={`w-4 h-4 text-[#0284C7] ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Mencari GPS..." : "Deteksi Lokasi Saya"}</span>
        </button>

        {/* Selected Location Action Bar (Bottom Floating Overlay) */}
        {selectedSpot && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-10 max-w-md bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-slideUp flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-sky-300 font-extrabold uppercase tracking-wider">
                  Titik Spasial Terpilih
                </span>
                <span className="block text-xs font-bold text-white truncate max-w-[200px]">
                  {selectedSpot.riverName}
                </span>
              </div>
            </div>
            <button
              onClick={handleConfirmLocation}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0284C7]/90 transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Lapor Titik Ini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Map Legend Footer Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Polyline River Colors Legend */}
        <div className="flex flex-wrap items-center gap-3 text-slate-700 font-medium">
          <span className="font-extrabold text-slate-900 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
            Garis Sungai:
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 rounded bg-[#22c55e]" /> Normal / Clean
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 rounded bg-[#ef4444]" /> Tercemar / Bahaya
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 rounded bg-[#f97316]" /> Banyak Sampah
          </span>
        </div>

        {/* Marker Points Legend */}
        <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium border-t md:border-t-0 border-slate-200 pt-2 md:pt-0">
          <span className="font-extrabold text-slate-900">Titik Laporan:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Terverifikasi
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Diproses
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Selesai
          </span>
        </div>

      </div>

    </div>
  );
}
