/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Camera,
  Sun,
  Moon,
} from "lucide-react";
import { getStoredCctv, CctvPoint } from "../../lib/store";
import CctvPlayerModal from "./CctvPlayerModal";

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
    label: "Normal / Clean",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  tercemar: {
    color: "#ef4444",
    weight: 7,
    opacity: 0.95,
    label: "Tercemar / Bahaya",
    badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
  },
  sampah: {
    color: "#f97316",
    weight: 7,
    opacity: 0.95,
    label: "Banyak Sampah",
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
// DATA SEGMEN GEOJSON SPASIAL DENGAN 18 JALUR SUNGAI UTAMA JABODETABEK
// =======================================================================
const GEOJSON_RIVER_DATA = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "ciliwung-hulu",
        nama_sungai: "Kali Ciliwung - Segmen Hulu (Depok - Jagakarsa)",
        status: "default",
        keterangan: "Kondisi air terpantau jernih, konservasi vegetasi bantaran terjaga.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.828, -6.365],
          [106.833, -6.345],
          [106.838, -6.325],
          [106.842, -6.305],
          [106.845, -6.28],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "ciliwung-tengah",
        nama_sungai: "Kali Ciliwung - Segmen Tengah (Kalibata - Tebet)",
        status: "sampah",
        keterangan: "Banyak laporan timbulan sampah rumah tangga & plastik di pinggir bantaran.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.845, -6.28],
          [106.8465, -6.262],
          [106.848, -6.25],
          [106.851, -6.242],
          [106.854, -6.235],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "ciliwung-hilir",
        nama_sungai: "Kali Ciliwung - Segmen Hilir (Manggarai - Pasar Baru - Ancol)",
        status: "tercemar",
        keterangan: "Laporan limbah cair industri terverifikasi DLH, air keruh hitam dan berbau.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.854, -6.235],
          [106.849, -6.21],
          [106.838, -6.18],
          [106.834, -6.155],
          [106.832, -6.128],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "bkb-01",
        nama_sungai: "Banjir Kanal Barat (BKB) - Segmen Manggarai to Pluit",
        status: "tercemar",
        keterangan: "Saluran pembuangan utama kota. Indikasi limbah minyak dan sedimen tebal.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.849, -6.21],
          [106.822, -6.202],
          [106.802, -6.185],
          [106.792, -6.155],
          [106.795, -6.118],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "bkt-01",
        nama_sungai: "Banjir Kanal Timur (BKT) - Segmen Cipinang to Marunda",
        status: "default",
        keterangan: "Saluran banjir timur dalam kondisi pemeliharaan rutin, air lancar.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.878, -6.228],
          [106.905, -6.222],
          [106.945, -6.185],
          [106.962, -6.145],
          [106.968, -6.105],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "pesanggrahan-01",
        nama_sungai: "Kali Pesanggrahan - Segmen Bintaro to Kebon Jeruk",
        status: "sampah",
        keterangan: "Penumpukan ranting pohon dan sampah rantai makanan pasca hujan deras.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.76, -6.34],
          [106.748, -6.305],
          [106.74, -6.275],
          [106.755, -6.225],
          [106.758, -6.175],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "angke-01",
        nama_sungai: "Kali Angke - Segmen Tangerang to Cengkareng",
        status: "tercemar",
        keterangan: "Buangan limbah tekstil usaha lokal. Keruh kebiruan di segmen Cengkareng.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.7787, -6.5828],
          [106.765, -6.42],
          [106.755, -6.28],
          [106.751, -6.2],
          [106.7485, -6.1659],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "cisadane-01",
        nama_sungai: "Kali Cisadane - Segmen Serpong to Kota Tangerang",
        status: "default",
        keterangan: "Debit air stabil, pengawasan rutin komunitas pecinta sungai.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.66, -6.33],
          [106.645, -6.27],
          [106.63, -6.21],
          [106.625, -6.16],
          [106.635, -6.11],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sunter-01",
        nama_sungai: "Kali Sunter - Segmen Kelapa Gading to Danau Sunter",
        status: "sampah",
        keterangan: "Tumpukan plastik dan pembendungan sampah sementara di perbatasan.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.89, -6.26],
          [106.885, -6.22],
          [106.88, -6.18],
          [106.872, -6.14],
          [106.88, -6.11],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "cipinang-01",
        nama_sungai: "Kali Cipinang - Segmen Ciracas to Jatinegara",
        status: "tercemar",
        keterangan: "Bau tidak sedap dan endapan lumpur hitam akibat pembuangan domestik.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.87, -6.32],
          [106.872, -6.28],
          [106.875, -6.24],
          [106.878, -6.228],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "krukut-01",
        nama_sungai: "Kali Krukut - Segmen Cilandak to Tanah Abang",
        status: "default",
        keterangan: "Aliran air cukup lancar pasca pengerukan polder oleh DLH.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.805, -6.31],
          [106.81, -6.27],
          [106.815, -6.23],
          [106.818, -6.195],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "grogol-01",
        nama_sungai: "Kali Grogol - Segmen Kebayoran to Muara Karang",
        status: "sampah",
        keterangan: "Penumpukan sampah plastik di jembatan penyeberangan Grogol.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.785, -6.25],
          [106.788, -6.21],
          [106.79, -6.17],
          [106.785, -6.12],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "mookervart-01",
        nama_sungai: "Kali Mookervart - Segmen Batu Ceper to Kalideres",
        status: "tercemar",
        keterangan: "Pencemaran limbah cair industri perbatasan Tangerang-Jakarta.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.64, -6.175],
          [106.68, -6.16],
          [106.72, -6.152],
          [106.75, -6.15],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "cakung-drain-01",
        nama_sungai: "Cakung Drain - Segmen Jaktim to Jakut",
        status: "tercemar",
        keterangan: "Drainase kawasan 9.85 km (Hulu: Jaktim 6°10'58.80\"S, Hilir: Jakut 6°5'51.60\"S)",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.9287, -6.183],
          [106.932, -6.145],
          [106.936, -6.115],
          [106.9398, -6.0977],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "kali-cakung-01",
        nama_sungai: "Kali Cakung - Segmen Bekasi to BKT",
        status: "sampah",
        keterangan: "Panjang 39.59 km (Hulu: Bekasi 6°22'13.61\"S, Hilir: BKT Jakut 6°5'54.49\"S)",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.9291, -6.3704],
          [106.931, -6.28],
          [106.935, -6.19],
          [106.9401, -6.0985],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "kali-jatikramat-01",
        nama_sungai: "Kali Jatikramat - Segmen Bekasi to Jaktim",
        status: "default",
        keterangan: "Panjang 13.75 km (Hulu: Bekasi 6°19'3.06\"S, Hilir: Jaktim 6°13'44.71\"S)",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.9254, -6.3175],
          [106.9258, -6.27],
          [106.9262, -6.2291],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "kali-buaran-01",
        nama_sungai: "Kali Buaran - Segmen Bekasi to Jaktim",
        status: "sampah",
        keterangan: "Panjang 11.34 km (Melintasi Bekasi & Jaktim, Hilir: 6°11'1.64\"S)",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.923, -6.255],
          [106.926, -6.215],
          [106.9288, -6.1838],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "kali-bekasi-01",
        nama_sungai: "Kali Bekasi - Segmen Bantargebang to Babelan",
        status: "tercemar",
        keterangan: "Busa limbah terdeteksi di segmen bendung Bekasi.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [106.99, -6.35],
          [106.998, -6.28],
          [107.002, -6.23],
          [107.012, -6.17],
          [107.025, -6.12],
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
    lat: -6.235,
    lng: 106.854,
    status: "terverifikasi",
    judul: "Limbah Cair Diduga Industri",
    lokasi: "Kali Ciliwung - Segmen Manggarai",
    upvotes: 142,
    timeAgo: "10 menit yang lalu",
    image: "/assets/sungai/026016200_1633163690-20211002-Pencemaran_Teluk_Jakarta_oleh_Paracetamol-1.jpg",
  },
  {
    id: "rpt-002",
    lat: -6.25,
    lng: 106.848,
    status: "terverifikasi",
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
    image: "/assets/sungai/_ (1).jpeg",
  },
  {
    id: "rpt-004",
    lat: -6.275,
    lng: 106.74,
    status: "pending",
    judul: "Sampah Plastik Menyumbat Jembatan",
    lokasi: "Kali Pesanggrahan - Segmen Bintaro",
    upvotes: 35,
    timeAgo: "2 jam yang lalu",
    image: "/assets/sungai/pencemaran-teluk-jakarta-9r95-dom.jpg",
  },
  {
    id: "rpt-005",
    lat: -6.18,
    lng: 106.936,
    status: "terverifikasi",
    judul: "Tumpukan Sampah & Pendangkalan",
    lokasi: "Cakung Drain - Segmen Jaktim",
    upvotes: 87,
    timeAgo: "1 jam yang lalu",
  },
  {
    id: "rpt-006",
    lat: -6.21,
    lng: 106.63,
    status: "selesai",
    judul: "Monitoring Kualitas Air Normal",
    lokasi: "Kali Cisadane - Segmen Tangerang",
    upvotes: 154,
    timeAgo: "3 jam yang lalu",
  },
  {
    id: "rpt-007",
    lat: -6.16,
    lng: 106.68,
    status: "terverifikasi",
    judul: "Busa & Limbah Industri Tekstil",
    lokasi: "Kali Mookervart - Segmen Batu Ceper",
    upvotes: 112,
    timeAgo: "20 menit yang lalu",
  },
  {
    id: "rpt-008",
    lat: -6.23,
    lng: 107.002,
    status: "terverifikasi",
    judul: "Limbah Berbusa Putih Pekat",
    lokasi: "Kali Bekasi - Segmen Bendung Bekasi",
    upvotes: 178,
    timeAgo: "15 menit yang lalu",
  },
];

const REPORT_STATUS_COLOR: Record<string, { color: string; label: string; badgeBg: string }> = {
  pending: {
    color: "#f97316",
    label: "Pending",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
  },
  terverifikasi: {
    color: "#ef4444",
    label: "Terverifikasi",
    badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
  },
  selesai: {
    color: "#22c55e",
    label: "Selesai",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
};

export interface RiverGISMapProps {
  onSelectLocation?: (location: { lat: number; lng: number; riverName: string }) => void;
  interactive?: boolean;
  showHeader?: boolean;
  actionLabel?: string;
}

const CCTV_STATUS_COLOR: Record<CctvPoint["status"], { color: string; label: string; badgeBg: string }> = {
  aktif: {
    color: "#06B6D4",
    label: "Aktif",
    badgeBg: "bg-sky-50 text-[#0284C7] border-sky-200",
  },
  offline: {
    color: "#64748B",
    label: "Offline",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-300",
  },
  perbaikan: {
    color: "#F59E0B",
    label: "Perbaikan",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export default function RiverGISMap({
  onSelectLocation,
  interactive = true,
  showHeader = true,
  actionLabel = "Lapor Titik Ini",
}: RiverGISMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const cctvGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const selectedPinRef = useRef<L.Marker | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>("semua");
  const [selectedSpot, setSelectedSpot] = useState<{
    lat: number;
    lng: number;
    riverName: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showCctv, setShowCctv] = useState(true);
  const [cctvPoints, setCctvPoints] = useState<CctvPoint[]>(() => getStoredCctv());
  const [playingCctv, setPlayingCctv] = useState<CctvPoint | null>(null);
  const [basemapMode, setBasemapMode] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  // Initialize Leaflet Map Instance with GeoJSON Rivers & Report Markers
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Greater Jakarta River Basin
    const map = L.map(mapContainerRef.current, {
      center: [-6.22, 106.84],
      zoom: 11,
      zoomControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
    });

    // High-Definition CartoDB Tile Layer (follows site theme at init)
    const initialUrl =
      basemapMode === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    const tileLayer = L.tileLayer(initialUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom Controls top-right (Only when interactive is true)
    if (interactive) {
      L.control.zoom({ position: "topright" }).addTo(map);
    }

    // Add GeoJSON River Segments Layer (Vector Polylines)
    const geojsonLayer = L.geoJSON(GEOJSON_RIVER_DATA as any, {
      style: getRiverStyle,
      onEachFeature: (feature, layer) => {
        const { nama_sungai, status, keterangan } = feature.properties;
        const statusConfig = RIVER_STATUS_STYLE[status] || RIVER_STATUS_STYLE.default;

        if (interactive) {
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
        }
      },
    }).addTo(map);

    // Auto-fit bounds to display all rivers in Jabodetabek
    if (geojsonLayer.getBounds().isValid()) {
      map.fitBounds(geojsonLayer.getBounds().pad(0.05));
    }

    geojsonLayerRef.current = geojsonLayer;

    // Report Point Markers Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Map Click Listener for custom pin placement (Only when interactive is true)
    if (interactive) {
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
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update GeoJSON Rivers & Report Point Markers on Filter Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 1. Filter GeoJSON River Polylines
    if (geojsonLayerRef.current) {
      geojsonLayerRef.current.clearLayers();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredFeatures = GEOJSON_RIVER_DATA.features.filter((feature: any) => {
        const status = feature.properties?.status;
        if (activeFilter === "semua") return true;
        if (activeFilter === "tercemar") return status === "tercemar";
        if (activeFilter === "sampah") return status === "sampah";
        if (activeFilter === "selesai") return status === "default";
        return true;
      });

      geojsonLayerRef.current.addData({
        type: "FeatureCollection",
        features: filteredFeatures,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }

    // 2. Filter Report Point Markers
    if (markersGroupRef.current) {
      const markersGroup = markersGroupRef.current;
      markersGroup.clearLayers();

      const filteredMarkers = REPORT_MARKERS.filter((item) => {
        if (activeFilter === "semua") return true;
        if (activeFilter === "tercemar") return item.status === "terverifikasi";
        if (activeFilter === "sampah") return item.status === "pending";
        if (activeFilter === "selesai") return item.status === "selesai";
        return true;
      });

      filteredMarkers.forEach((spot) => {
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
            ${spot.image
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
            <div class="flex items-center justify-between text-[10px] text-slate-600 font-bold border-t border-slate-100 pt-1.5 mb-2">
              <span>👍 ${spot.upvotes} Dukungan</span>
              <span class="text-sky-600">${spot.timeAgo}</span>
            </div>
            <a href="/laporan/${spot.id}" class="inline-flex w-full items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-bold transition-all shadow-xs" style="color: #ffffff !important; text-decoration: none;">
              <span>Lihat Detail Laporan →</span>
            </a>
          </div>
        `;

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });
        if (interactive) {
          marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -10] });
          marker.on("click", () => {
            setSelectedSpot({
              lat: spot.lat,
              lng: spot.lng,
              riverName: spot.lokasi,
            });
          });
        }
        markersGroup.addLayer(marker);
      });
    }
  }, [activeFilter]);

  // Sync CCTV points with shared store
  useEffect(() => {
    const handleUpdate = () => setCctvPoints(getStoredCctv());
    window.addEventListener("riverse_cctv_updated", handleUpdate);
    return () => window.removeEventListener("riverse_cctv_updated", handleUpdate);
  }, []);

  // Render CCTV Monitoring Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Recreate the layer group on every run (StrictMode-safe: the cached
    // group may point to a previously removed map instance).
    if (cctvGroupRef.current) {
      cctvGroupRef.current.remove();
    }
    const group = L.layerGroup().addTo(map);
    cctvGroupRef.current = group;

    if (!showCctv) return;

    cctvPoints.forEach((cam) => {
      const status = CCTV_STATUS_COLOR[cam.status] || CCTV_STATUS_COLOR.offline;

      const cctvIcon = L.divIcon({
        className: "river-cctv-marker",
        html: `<div style="
                width: 30px; height: 30px; border-radius: 10px;
                background:${status.color}; border:3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                display: flex; align-items: center; justify-content: center;
                transform: rotate(45deg);
              ">
                <div style="transform: rotate(-45deg); width:14px; height:14px; display:flex; align-items:center; justify-content:center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </div>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const popupHtml = `
        <div class="p-1 max-w-[220px] font-sans">
          <div class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${status.badgeBg} mb-1.5">
            ${status.label}
          </div>
          <h4 class="font-extrabold text-xs text-slate-900 leading-tight mb-1">${cam.name}</h4>
          <p class="text-[10px] text-slate-500 font-medium mb-1">${cam.riverName} — ${cam.locationDetail}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-600 font-bold border-t border-slate-100 pt-1.5 mb-2">
            <span>CCTV Live Monitoring</span>
            <span class="text-[#0284C7] font-semibold">${cam.lat.toFixed(4)}, ${cam.lng.toFixed(4)}</span>
          </div>
          ${
            cam.streamUrl
              ? `<button type="button" onclick="window.dispatchEvent(new CustomEvent('riverse_cctv_play',{detail:{id:'${cam.id}'}})); return false;" style="color: #ffffff !important; text-decoration: none;" class="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer border-0"><span style="color: #ffffff !important;">▶ Putar Live CCTV</span></button>`
              : `<span class="block text-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold">Stream tidak tersedia</span>`
          }
        </div>
      `;

      const marker = L.marker([cam.lat, cam.lng], { icon: cctvIcon });
      if (interactive) {
        marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -12] });
      }
      group.addLayer(marker);
    });
  }, [cctvPoints, showCctv, interactive]);

  // Listen for "putar live" requests from CCTV popups
  useEffect(() => {
    const handlePlay = (e: Event) => {
      const detail = (e as CustomEvent<{ id?: string }>).detail;
      if (!detail?.id) return;
      const cam = cctvPoints.find((c) => c.id === detail.id);
      if (cam) setPlayingCctv(cam);
    };
    window.addEventListener("riverse_cctv_play", handlePlay);
    return () => window.removeEventListener("riverse_cctv_play", handlePlay);
  }, [cctvPoints]);

  // Swap basemap tiles when map theme changes
  useEffect(() => {
    const layer = tileLayerRef.current;
    if (!layer) return;
    const url =
      basemapMode === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    layer.setUrl(url);
  }, [basemapMode]);

  // Follow the site-wide theme toggle automatically
  useEffect(() => {
    const onTheme = (e: Event) => {
      const mode = (e as CustomEvent<{ mode?: string }>).detail?.mode;
      if (mode === "dark" || mode === "light") setBasemapMode(mode);
    };
    window.addEventListener("riverse_theme_changed", onTheme);
    return () => window.removeEventListener("riverse_theme_changed", onTheme);
  }, []);

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
    <div className={`w-full h-full bg-white font-sans transition-all ${showHeader ? "rounded-[32px] border border-slate-200/80 shadow-2xl shadow-slate-200/60 overflow-hidden" : ""}`}>

      {/* Map Control Header Bar (Clean Light Theme per DESIGN.md) */}
      {showHeader && (
        <div className="p-4 sm:p-6 bg-white border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 overflow-hidden max-w-full">

          {/* Title & Live Status Indicator */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Peta Status Sungai & Laporan GIS
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                Klik alur sungai atau penanda titik untuk memantau & membuat laporan lokasi presisi.
              </p>
            </div>
          </div>

          {/* Basemap Dark/Light Switcher */}
          <button
            onClick={() => setBasemapMode((m) => (m === "dark" ? "light" : "dark"))}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer self-start xl:self-center shrink-0 bg-white border border-slate-200 text-slate-600 hover:text-[#0284C7] hover:border-sky-200"
            title={basemapMode === "dark" ? "Ganti Peta ke Mode Terang" : "Ganti Peta ke Mode Gelap"}
          >
            {basemapMode === "dark" ? (
              <Sun className="w-4 h-4 text-[#0284C7]" />
            ) : (
              <Moon className="w-4 h-4 text-[#0284C7]" />
            )}
            <span>{basemapMode === "dark" ? "Peta Terang" : "Peta Gelap"}</span>
          </button>

          {/* CCTV Layer Toggle */}
          <button
            onClick={() => setShowCctv(!showCctv)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer self-start xl:self-center shrink-0 ${
              showCctv
                ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20 ring-2 ring-[#0284C7]/30"
                : "bg-white border border-slate-200 text-slate-600 hover:text-[#0284C7] hover:border-sky-200"
            }`}
            title={showCctv ? "Sembunyikan Layer CCTV" : "Tampilkan Layer CCTV"}
          >
            <Camera className="w-4 h-4" />
            <span>CCTV Live</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-white/20">
              {cctvPoints.filter((c) => c.status === "aktif").length}
            </span>
          </button>

          {/* Filter Tab Controls (Pills Container) */}
          <div className="w-full xl:w-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 overflow-x-auto scrollbar-none shadow-inner max-w-full min-w-0">
            {[
              { id: "semua", label: "Semua Data", dot: "bg-sky-400" },
              { id: "tercemar", label: "Tercemar", dot: "bg-rose-500" },
              { id: "sampah", label: "Banyak Sampah", dot: "bg-amber-500" },
              { id: "selesai", label: "Bersih / Selesai", dot: "bg-emerald-500" },
            ].map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20 ring-2 ring-[#0284C7]/30 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/90"
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Leaflet Map Canvas Container */}
      <div className={`relative w-full bg-slate-50 ${showHeader ? "h-[420px] sm:h-[500px] lg:h-[540px]" : "h-full"}`}>

        {/* Leaflet Container Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Quick GPS Auto-Locate Button (Top Left Overlay) */}
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold shadow-lg shadow-slate-200/50 border border-slate-200/80 hover:bg-sky-50 hover:text-[#0284C7] transition-all cursor-pointer active:scale-95 max-w-[calc(100%-2rem)] truncate"
        >
          <Crosshair className={`w-4 h-4 text-[#0284C7] shrink-0 ${isLocating ? "animate-spin" : ""}`} />
          <span className="truncate">{isLocating ? "Mencari GPS..." : "Deteksi Lokasi Saya"}</span>
        </button>

        {/* Selected Location Action Bar (Bottom Floating Overlay) */}
        {selectedSpot && (
          <div className="absolute bottom-4 sm:bottom-5 left-3 right-3 sm:left-auto sm:right-5 z-10 max-w-full sm:max-w-md bg-slate-900/90 backdrop-blur-xl text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-800 animate-slideUp flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-3.5">
            <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] text-sky-300 font-semibold uppercase tracking-wider">
                  Titik Spasial Terpilih
                </span>
                <span className="block text-xs font-semibold text-white truncate max-w-full sm:max-w-[200px]">
                  {selectedSpot.riverName}
                </span>
              </div>
            </div>
            <button
              onClick={handleConfirmLocation}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0284C7] text-white text-xs font-semibold hover:bg-[#0284C7]/90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-900/30 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Map Legend Footer Bar (Clean & Minimalist per DESIGN.md) */}
      <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-slate-50/90 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-medium text-slate-600 max-w-full overflow-hidden">

        {/* Polyline River Colors Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
            Garis Sungai:
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="w-3 h-1.5 rounded-full bg-[#22c55e]" /> Normal / Clean
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="w-3 h-1.5 rounded-full bg-[#ef4444]" /> Tercemar / Bahaya
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="w-3 h-1.5 rounded-full bg-[#f97316]" /> Banyak Sampah
          </span>
        </div>

        {/* Marker Points Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 border-t md:border-t-0 border-slate-200/80 pt-2.5 md:pt-0">
          <span className="font-bold text-slate-900">Titik Laporan:</span>
          <span className="flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-[#f97316]" /> Pending
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Terverifikasi
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Selesai
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="w-3 h-3 rounded-[4px] bg-[#06B6D4]" /> CCTV Monitoring
          </span>
        </div>

      </div>

      {/* CCTV Live Player Modal */}
      <CctvPlayerModal cctv={playingCctv} onClose={() => setPlayingCctv(null)} />

    </div>
  );
}
