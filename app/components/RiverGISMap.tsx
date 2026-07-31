"use client";

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Search,
  Crosshair,
  Layers,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface MapMarkerData {
  id: string;
  title: string;
  category: string;
  status: "pending" | "verified" | "processing" | "completed";
  lat: number;
  lng: number;
  riverName: string;
  upvotes: number;
  timeAgo: string;
  image?: string;
}

const SAMPLE_MARKERS: MapMarkerData[] = [
  {
    id: "RVR-101",
    title: "Pencemaran Sampah Pesisir",
    category: "Penumpukan Sampah",
    status: "verified",
    lat: -6.1088,
    lng: 106.8156,
    riverName: "Muara Teluk Jakarta",
    upvotes: 142,
    timeAgo: "10 menit yang lalu",
    image: "/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg",
  },
  {
    id: "RVR-102",
    title: "Limbah Industri & Sampah Plastik",
    category: "Limbah B3 / Cair",
    status: "processing",
    lat: -6.212,
    lng: 106.848,
    riverName: "Sungai Ciliwung (Segmen Manggarai)",
    upvotes: 98,
    timeAgo: "45 menit yang lalu",
    image: "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg",
  },
  {
    id: "RVR-103",
    title: "Air Berbau & Keruh Merah",
    category: "Bau & Perubahan Warna Air",
    status: "pending",
    lat: -6.265,
    lng: 106.772,
    riverName: "Sungai Pesanggrahan",
    upvotes: 35,
    timeAgo: "2 jam yang lalu",
    image: "/assets/sungai/20200812-Sungai-Ciliwung-1_ratio-16x9.jpg",
  },
  {
    id: "RVR-104",
    title: "Pembersihan Hilir Selesai DLH",
    category: "Penumpukan Sampah",
    status: "completed",
    lat: -6.23,
    lng: 106.885,
    riverName: "Kali Cipinang (Segmen Jatinegara)",
    upvotes: 210,
    timeAgo: "Dibersihkan kemarin",
    image: "/assets/sungai/sungai ciliwung bening.jpg",
  },
  {
    id: "RVR-105",
    title: "Kerusakan Tanggul Bantaran",
    category: "Kerusakan Tanggul",
    status: "verified",
    lat: -6.155,
    lng: 106.875,
    riverName: "Sungai Sunter (Segmen Kelapa Gading)",
    upvotes: 76,
    timeAgo: "3 jam yang lalu",
    image: "/assets/sungai/antarafoto-bantaran-sungai-penuh-sampah-230624-adm-1.jpg",
  },
];

interface RiverGISMapProps {
  onSelectLocation?: (location: { lat: number; lng: number; riverName: string }) => void;
}

export default function RiverGISMap({ onSelectLocation }: RiverGISMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const selectedPinRef = useRef<L.Marker | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<{
    lat: number;
    lng: number;
    riverName: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Leaflet Map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map centered at Jakarta Ciliwung River Basin
    const map = L.map(mapContainerRef.current, {
      center: [-6.2088, 106.8456],
      zoom: 12,
      zoomControl: false,
    });

    // Add High-Definition CartoDB Voyager Tile Layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Add Custom Zoom Controls on top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Create Markers Group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Listen for Map Clicks to select custom coordinates
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const formattedLat = parseFloat(lat.toFixed(4));
      const formattedLng = parseFloat(lng.toFixed(4));
      const estRiverName = `Lokasi Geofencing (${formattedLat}, ${formattedLng})`;

      setSelectedSpot({
        lat: formattedLat,
        lng: formattedLng,
        riverName: estRiverName,
      });

      // Update Custom Selected Pin on map
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

  // Update Markers based on Filters & Search
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    const filtered = SAMPLE_MARKERS.filter((item) => {
      const matchFilter =
        activeFilter === "all" || item.status === activeFilter;
      const matchQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.riverName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchQuery;
    });

    filtered.forEach((spot) => {
      // Determine Status Color
      let colorClass = "bg-[#F97316] ring-[#F97316]/30";
      let statusBadgeText = "Pending 🟠";
      let statusBadgeBg = "bg-amber-50 text-amber-800 border-amber-200";

      if (spot.status === "verified") {
        colorClass = "bg-[#EF4444] ring-[#EF4444]/30";
        statusBadgeText = "Terverifikasi 🔴";
        statusBadgeBg = "bg-rose-50 text-rose-800 border-rose-200";
      } else if (spot.status === "processing") {
        colorClass = "bg-[#3B82F6] ring-[#3B82F6]/30";
        statusBadgeText = "Diproses DLH 🔵";
        statusBadgeBg = "bg-blue-50 text-blue-800 border-blue-200";
      } else if (spot.status === "completed") {
        colorClass = "bg-[#22C55E] ring-[#22C55E]/30";
        statusBadgeText = "Selesai 🟢";
        statusBadgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
      }

      const customIcon = L.divIcon({
        className: "custom-gis-marker",
        html: `<div class="relative group cursor-pointer">
                <div class="w-7 h-7 rounded-full ${colorClass} ring-4 text-white flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-125">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
              </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const popupHtml = `
        <div class="p-1 max-w-[220px] font-sans">
          ${
            spot.image
              ? `<div class="relative h-24 w-full rounded-xl overflow-hidden mb-2">
                  <img src="${spot.image}" alt="${spot.title}" class="w-full h-full object-cover" />
                 </div>`
              : ""
          }
          <div class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBadgeBg} mb-1">
            ${statusBadgeText}
          </div>
          <h4 class="font-extrabold text-xs text-slate-900 leading-tight mb-1">${
            spot.title
          }</h4>
          <p class="text-[10px] text-slate-500 font-medium mb-2">${
            spot.riverName
          }</p>
          <div class="flex items-center justify-between text-[10px] text-slate-600 font-bold border-t border-slate-100 pt-1.5">
            <span>👍 ${spot.upvotes} Dukungan</span>
            <span class="text-sky-600">${spot.timeAgo}</span>
          </div>
        </div>
      `;

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });
      marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -20] });
      marker.on("click", () => {
        setSelectedSpot({
          lat: spot.lat,
          lng: spot.lng,
          riverName: spot.riverName,
        });
      });
      markersGroup.addLayer(marker);
    });
  }, [activeFilter, searchQuery]);

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

  // Confirm Location & Scroll to Report Form
  const handleConfirmLocation = () => {
    if (selectedSpot && onSelectLocation) {
      onSelectLocation(selectedSpot);
    }
    const formElement = document.getElementById("form-pelaporan");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
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
                Peta Kondisi & Titik Laporan Sungai Live (GIS)
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live GIS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Klik lokasi pada peta atau pilih penanda untuk langsung melaporkan titik pencemaran.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "Semua Titik" },
            { id: "verified", label: "Terverifikasi 🔴" },
            { id: "processing", label: "Diproses 🔵" },
            { id: "completed", label: "Selesai 🟢" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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
      <div className="relative w-full h-[450px] sm:h-[500px]">
        
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
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <span className="font-bold text-slate-800">Legenda Penanda:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> Pending
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Terverifikasi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Diproses DLH
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> Selesai
          </span>
        </div>

        <div className="text-slate-500 font-medium text-[11px]">
          Radius Deteksi Duplikasi Spasial: <strong className="text-slate-800">&lt;500 meter (PostGIS)</strong>
        </div>
      </div>

    </div>
  );
}
