"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  UserCheck
} from "lucide-react";

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
  
  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

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
      {/* TOP HEADER & NAVIGATION                                      */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-sky-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] bg-slate-100 hover:bg-sky-50 px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-[#0284C7] to-[#0F172A] p-0.5 shadow-sm">
              <Image
                src="/assets/logo.png"
                alt="RIVERSE Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#0F172A]">
              RIVER<span className="text-[#0284C7]">SE</span>
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Tanpa Login Required</span>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN FORM CONTENT AREA                                       */}
      {/* ============================================================ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* ============================================================ */}
        {/* HERO SECTION: White Grid Graph Background & Floating Badges */}
        {/* ============================================================ */}
        <div className="relative bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden py-12 px-4 sm:px-10 text-center mb-10">
          
          {/* Floating Tilted Cards (Left & Right - Matching Reference Design) */}
          <div className="hidden lg:block absolute left-6 top-8 -rotate-6 hover:rotate-0 transition-transform duration-300 z-10">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">5.000+</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Laporan Terverifikasi</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-10 rotate-6 hover:rotate-0 transition-transform duration-300 z-10">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">10.000+</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Relawan Warga</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute left-12 bottom-12 -rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">24 Jam</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Respon Cepat DLH</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute right-14 bottom-14 rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">100% Spasial</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Geofencing GIS</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Main Hero Header Title */}
          <div className="max-w-2xl mx-auto relative z-20">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0284C7] leading-tight mb-4">
              Pusat Pelaporan Sungai <br className="hidden sm:block" />
              <span className="text-[#0284C7]">Terbaik di Indonesia</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-xl mx-auto mb-8">
              Laporkan semua aspek pencemaran sungai dari nol hingga terverifikasi. Bebas hambatan, tanpa login, dan langsung terhubung dengan Dinas Lingkungan Hidup.
            </p>

            {/* Search Input Box (Matching Reference Design) */}
            <div className="relative max-w-lg mx-auto mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Info className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Cari segmen sungai, jenis limbah, atau patokan lokasi..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white/90 shadow-sm text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
              />
            </div>

            {/* Category Filter Pills (Matching Reference Design) */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCategory("sampah")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
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
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
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
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
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
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
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

        {/* Form Container or Success Confirmation */}
        {isSubmitted ? (
          /* ============================================================ */
          /* SUCCESS SUBMISSION CARD                                      */
          /* ============================================================ */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sky-100 shadow-xl shadow-sky-900/5 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
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
            <div className="my-8 p-6 rounded-2xl bg-sky-50/80 border border-sky-200 text-left max-w-md mx-auto">
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
                    {isAnonymous ? "Anonim (Privasi Dilindungi)" : reporterName || "Warga Peduli"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0284C7] hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-[#0284C7]/20 transition-all hover:scale-105"
              >
                <MapPin className="w-4 h-4" />
                <span>Lihat di Peta GIS Utama</span>
              </Link>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Buat Laporan Baru</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* FORM SECTION                                                 */
          /* ============================================================ */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-xl shadow-sky-900/5 space-y-8">
            
            {/* SECTION 1: Category Selection */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-2">
                1. Pilih Kategori Pencemaran <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-4">
                Pilih jenis masalah pencemaran sungai yang Anda temukan di lokasi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {POLLUTION_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? "border-[#0284C7] bg-sky-50/60 shadow-md ring-2 ring-[#0284C7]/20"
                          : "border-slate-200 hover:border-sky-300 bg-slate-50/50"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cat.color} border shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">{cat.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION 2: Location & River Segment */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-2">
                2. Lokasi & Segmen Sungai <span className="text-rose-500">*</span>
              </label>
              
              <div className="space-y-4">
                {/* River Segment Selection */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">Wilayah / Segmen Sungai:</span>
                  <select
                    value={riverSegment}
                    onChange={(e) => setRiverSegment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  >
                    {RIVER_SEGMENTS.map((seg, idx) => (
                      <option key={idx} value={seg}>{seg}</option>
                    ))}
                  </select>
                </div>

                {/* GPS Auto Button */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0284C7] font-bold text-xs transition-all active:scale-95"
                  >
                    <MapPin className={`w-4 h-4 ${isLocating ? "animate-bounce" : ""}`} />
                    <span>{isLocating ? "Mencari GPS..." : "Gunakan Koordinat GPS Presisi Saya"}</span>
                  </button>

                  {gpsLocation && (
                    <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {gpsLocation}
                    </span>
                  )}
                </div>

                {/* Address Landmark Input */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">Patokan / Alamat Detil:</span>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Dekat Pintu Air Manggarai, Samping Jembatan Merah..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION 3: Photo Evidence Upload */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-2">
                3. Unggah Foto Bukti Lapangan <span className="text-slate-400 font-normal">(Sangat Dianjurkan)</span>
              </label>
              <p className="text-xs text-slate-500 mb-4">
                Foto bukti membantu verifikator DLH merespons laporan Anda secara cepat.
              </p>

              <div className="border-2 border-dashed border-sky-200 hover:border-[#0284C7] bg-sky-50/40 rounded-2xl p-6 text-center transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                
                {previewImage ? (
                  <div className="relative h-48 w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-md">
                    <img src={previewImage} alt="Preview Bukti" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                      Klik untuk Mengganti Foto
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <div className="h-12 w-12 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Tarik foto ke sini atau pilih file</span>
                    <span className="text-[11px] text-slate-400">Format PNG, JPG, JPEG (Maks. 10MB)</span>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION 4: Urgency & Description */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-2">
                4. Urgensi & Detail Kronologi <span className="text-rose-500">*</span>
              </label>

              <div className="space-y-4">
                {/* Urgency Radio Pills */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-2">Tingkat Keparahan:</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "ringan", label: "Ringan", desc: "Sampah Kecil", color: "peer-checked:bg-emerald-500 peer-checked:text-white" },
                      { id: "sedang", label: "Sedang", desc: "Penumpukan Sedang", color: "peer-checked:bg-amber-500 peer-checked:text-white" },
                      { id: "darurat", label: "Darurat (DLH)", desc: "Limbah Berbahaya", color: "peer-checked:bg-rose-600 peer-checked:text-white" }
                    ].map((urg) => (
                      <label key={urg.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value={urg.id}
                          checked={urgency === urg.id}
                          onChange={(e) => setUrgency(e.target.value)}
                          className="peer sr-only"
                        />
                        <div className={`p-3 rounded-xl border border-slate-200 text-center transition-all bg-slate-50 ${urg.color} peer-checked:border-transparent peer-checked:shadow-sm`}>
                          <span className="block font-bold text-xs">{urg.label}</span>
                          <span className="block text-[10px] opacity-80 mt-0.5">{urg.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description Textarea */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi Kronologi Laporan:</span>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan kondisi air, warna, estimasi volume sampah, atau pihak penyebab jika terlihat..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION 5: Identity & Privacy Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-extrabold text-slate-900">
                  5. Identitas Pelapor <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                
                {/* Anonymous Toggle Switch */}
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative"></div>
                  <span className="text-xs font-bold text-slate-700">Kirim Sebagai Anonim</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-in fade-in duration-200">
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap:</span>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp (Untuk Update Status):</span>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="0812xxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:brightness-110 text-white font-extrabold text-base shadow-xl shadow-[#0284C7]/25 active:scale-[0.99] transition-all disabled:opacity-70"
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
              <p className="text-[11px] text-slate-400 text-center mt-3">
                Dengan mengklik Kirim, Anda menyatakan bahwa informasi pencemaran ini diberikan secara ikhlas & benar demi kelestarian sungai Indonesia.
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
