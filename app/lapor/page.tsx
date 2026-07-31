"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Droplets,
  Zap,
  ShieldCheck,
  Sparkles,
  Info,
  Send,
  RefreshCw,
  Clock,
  UserCheck,
  X,
  PlusCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import dynamic from "next/dynamic";

const RiverGISMap = dynamic(() => import("../components/RiverGISMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-900 rounded-3xl flex items-center justify-center text-white border border-slate-800 shadow-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold">Memuat Peta GIS Spasial Leaflet...</span>
      </div>
    </div>
  ),
});

const POLLUTION_CATEGORIES = [
  {
    id: "sampah",
    title: "Penumpukan Sampah",
    desc: "Plastik, limbah rumah tangga & pembuangan liar",
    icon: Trash2,
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200"
  },
  {
    id: "limbah-cair",
    title: "Limbah Cair Industri",
    desc: "Busa, oli, cairan kimia & minyak berbahaya",
    icon: Droplets,
    color: "from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-200"
  },
  {
    id: "bau-warna",
    title: "Bau & Perubahan Warna",
    desc: "Air berbau menyengat, keruh hitam/merah",
    icon: AlertTriangle,
    color: "from-rose-500/10 to-red-500/10 text-rose-600 border-rose-200"
  },
  {
    id: "tanggul",
    title: "Kerusakan Tanggul",
    desc: "Tanggul retak, longsoran & erosi bantaran",
    icon: Zap,
    color: "from-sky-500/10 to-blue-500/10 text-sky-600 border-sky-200"
  }
];

const RIVER_SEGMENTS = [
  "Sungai Ciliwung (Segmen Manggarai - Kampung Melayu)",
  "Sungai Pesanggrahan (Segmen Kebon Jeruk)",
  "Sungai Krukut (Segmen Tanah Abang)",
  "Sungai Sunter (Segmen Kelapa Gading)",
  "Sungai Cisadane (Segmen Cisauk)",
  "Segmen Lainnya (Gunakan GPS)"
];

export default function LaporPage() {
  // Form States
  const [category, setCategory] = useState("sampah");
  const [riverSegment, setRiverSegment] = useState(RIVER_SEGMENTS[0]);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("sedang");
  const [reporterName, setReporterName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Submission & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);

  // Handle GPS Auto Locate
  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(5);
          const lng = position.coords.longitude.toFixed(5);
          setGpsLocation(`${lat}, ${lng} (Lokasi GPS Presisi)`);
          setIsLocating(false);
        },
        () => {
          // Fallback simulation if denied or mock
          setGpsLocation("-6.2088, 106.8456 (Sesuai Peta GIS)");
          setIsLocating(false);
        }
      );
    } else {
      setGpsLocation("-6.2088, 106.8456 (Sesuai Peta GIS)");
      setIsLocating(false);
    }
  };

  // Handle Location Selection from Leaflet GIS Map
  const handleMapSelectLocation = (location: { lat: number; lng: number; riverName: string }) => {
    setGpsLocation(`${location.lat}, ${location.lng} (Titik Spasial Peta Leaflet)`);
    setAddress(location.riverName);
    setShowFormModal(true);
  };

  // Handle Photo Upload Simulation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const randomTicket = `RVR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setTicketNumber(randomTicket);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCategory("sampah");
    setDescription("");
    setAddress("");
    setPreviewImage(null);
    setGpsLocation(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-24 selection:bg-[#0284C7] selection:text-white">
      {/* ============================================================ */}
      {/* FLOATING GLASSMORPHISM NAVBAR                                 */}
      {/* ============================================================ */}
      <Navbar />

      {/* ============================================================ */}
      {/* HERO SECTION: Full-Bleed Edge-to-Edge Grid Paper Background   */}
      {/* ============================================================ */}
      <section className="relative w-full bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] border-b border-slate-200/80 pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          {/* Floating Tilted Cards with Smooth Organic Bobbing Animations */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            className="hidden lg:block absolute left-2 xl:left-8 top-2 -rotate-6 hover:rotate-0 transition-transform duration-300 z-10 cursor-pointer"
          >
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-xl transition-shadow">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">5.000+</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Laporan Terverifikasi</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5.0, ease: "easeInOut" }}
            className="hidden lg:block absolute right-2 xl:right-8 top-4 rotate-6 hover:rotate-0 transition-transform duration-300 z-10 cursor-pointer"
          >
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-xl transition-shadow">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">10.000+</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Relawan Warga</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
            className="hidden lg:block absolute left-4 xl:left-10 bottom-2 -rotate-3 hover:rotate-0 transition-transform duration-300 z-10 cursor-pointer"
          >
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-xl transition-shadow">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">24 Jam</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Respon Cepat DLH</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5.4, ease: "easeInOut" }}
            className="hidden lg:block absolute right-4 xl:right-10 bottom-4 rotate-3 hover:rotate-0 transition-transform duration-300 z-10 cursor-pointer"
          >
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-xl transition-shadow">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">100% Spasial</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Geofencing GIS</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Main Hero Header Content */}
          <div className="max-w-3xl mx-auto relative z-20">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0284C7] leading-tight mb-4">
              Pusat Pelaporan Sungai <br className="hidden sm:block" />
              <span className="text-[#0284C7]">Terbaik di Indonesia</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-medium max-w-xl mx-auto mb-8">
              Laporkan semua aspek pencemaran sungai dari nol hingga terverifikasi. Bebas hambatan, tanpa login, dan langsung terhubung dengan Dinas Lingkungan Hidup.
            </p>

            {/* Search Input Box */}
            <div className="relative max-w-lg mx-auto mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Info className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Cari segmen sungai, jenis limbah, atau patokan lokasi..."
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/95 shadow-sm text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCategory("sampah")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === "sampah"
                    ? "bg-[#0284C7] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Sampah Plastik
              </button>
              <button
                type="button"
                onClick={() => setCategory("limbah-cair")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === "limbah-cair"
                    ? "bg-[#0284C7] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Limbah Cair
              </button>
              <button
                type="button"
                onClick={() => setCategory("bau-warna")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === "bau-warna"
                    ? "bg-[#0284C7] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bau Air
              </button>
              <button
                type="button"
                onClick={() => setCategory("tanggul")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === "tanggul"
                    ? "bg-[#0284C7] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Kerusakan Tanggul
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LEAFLET GIS SPATIAL MAP SECTION                              */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20 mb-8">
        <RiverGISMap onSelectLocation={handleMapSelectLocation} />
      </section>

      {/* Prominent CTA Button to Open Reporting Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-30">
        <button
          onClick={() => setShowFormModal(true)}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0284C7] text-white text-base font-extrabold shadow-xl shadow-[#0284C7]/30 hover:bg-[#0284C7]/90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Buat Laporan Baru Sekarang</span>
        </button>
        <p className="text-xs text-slate-500 font-medium mt-2">
          Atau klik salah satu titik penanda di peta untuk langsung mengisi laporan spasial.
        </p>
      </div>

      {/* ============================================================ */}
      {/* MODAL DIALOG REPORTING FORM OVERLAY                           */}
      {/* ============================================================ */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center flex-shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">Formulir Pelaporan Pencemaran Sungai</h3>
                  <p className="text-xs text-sky-200 font-medium">Lengkapi detail laporan pencemaran secara presisi</p>
                </div>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Tutup Formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Form Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {isSubmitted ? (
                /* SUCCESS SUBMISSION CARD */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-900/5 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
                  <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide mb-3">
                    Tiket Pelaporan Resmi
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Laporan Berhasil Terkirim!
                  </h2>
                  
                  <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                    Terima kasih telah berkontribusi menjaga kebersihan sungai. Laporan Anda telah tersimpan di basis data spasial RIVERSE.
                  </p>

                  {/* Ticket Card Box */}
                  <div className="my-6 p-6 rounded-2xl bg-sky-50/80 border border-sky-200 text-left max-w-md mx-auto">
                    <div className="flex justify-between items-center pb-3 border-b border-sky-200/80">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No. Tiket Spasial</span>
                      <span className="font-mono font-extrabold text-base text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-sky-200 shadow-xs">
                        {ticketNumber}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status Awal:</span>
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Menunggu Verifikasi DLH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Segmen Sungai:</span>
                        <span className="font-semibold text-slate-800">{riverSegment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Identitas Pelapor:</span>
                        <span className="font-semibold text-slate-800">
                          {isAnonymous ? "Anonim (Privasi Terjaga)" : reporterName || "Anonim"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        handleReset();
                        setShowFormModal(false);
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
                    >
                      Selesai & Kembali ke Peta
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0284C7]/90 transition-all shadow-md"
                    >
                      Buat Laporan Lain
                    </button>
                  </div>
                </div>
              ) : (
                /* MAIN pelaporan FORM */
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* 1. Kategori Pencemaran */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-900 mb-1">
                      1. Pilih Kategori Pencemaran <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-4">Pilih jenis masalah pencemaran sungai yang Anda temukan di lokasi.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {POLLUTION_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                              isSelected
                                ? "border-[#0284C7] bg-sky-50/50 shadow-md shadow-sky-500/5"
                                : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                          >
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cat.color} border`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-900">{cat.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{cat.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Lokasi & Segmen Sungai */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-900 mb-1">
                      2. Lokasi & Segmen Sungai <span className="text-rose-500">*</span>
                    </label>

                    <div className="space-y-3">
                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1.5">Wilayah / Segmen Sungai:</span>
                        <select
                          value={riverSegment}
                          onChange={(e) => setRiverSegment(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                        >
                          {RIVER_SEGMENTS.map((seg) => (
                            <option key={seg} value={seg}>
                              {seg}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* GPS Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={isLocating}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-bold hover:bg-sky-100 transition-all cursor-pointer"
                        >
                          <Zap className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
                          <span>{isLocating ? "Mendeteksi Koordinat GPS..." : "Gunakan Titik GPS Presisi"}</span>
                        </button>
                        {gpsLocation && (
                          <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{gpsLocation}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1.5">Detail Patokan Lokasi / Alamat Lengkap:</span>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Contoh: Dekat Jembatan Merah Rt 04/02, belakang pabrik..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Detail Kejadian */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-900 mb-1">
                      3. Detail Deskripsi Pencemaran <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Jelaskan kondisi pencemaran yang terjadi (misal: air menghitam sejak tadi pagi, tumpukan sampah plastik menyumbat aliran...)"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7] resize-none"
                    />
                  </div>

                  {/* 4. Unggah Foto Bukti */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-900 mb-1">
                      4. Unggah Foto Bukti Lapangan
                    </label>
                    
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-1 text-center">
                        <Camera className="mx-auto h-8 w-8 text-slate-400" />
                        <div className="flex text-xs text-slate-600 font-semibold justify-center">
                          <span className="text-[#0284C7]">Pilih foto</span>
                          <span className="pl-1">atau tarik berkas ke sini</span>
                        </div>
                        <p className="text-[10px] text-slate-400">PNG, JPG hingga 10MB</p>
                      </div>
                    </div>

                    {previewImage && (
                      <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 max-h-48">
                        <img src={previewImage} alt="Preview Bukti" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:brightness-110 text-white font-extrabold text-base shadow-xl shadow-[#0284C7]/25 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Mengirim Laporan ke Server Spasial...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Kirim Laporan Spasial Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
