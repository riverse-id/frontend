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
  PlusCircle,
  X,
  ThumbsUp,
  Layers,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  submitCitizenReport,
  voteReport,
  getStoredReports,
  getReportByIdOrTicket,
  SubmissionResult
} from "../../lib/store";
import { Report, ReportCategory } from "../../lib/types";
import dynamic from "next/dynamic";
import { useToast } from "../components/ToastProvider";

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
  const { showToast } = useToast();
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

  const router = useRouter();

  // Reports & Geofence Submission States
  const [reports, setReports] = useState<Report[]>([]);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  // Pagination / Index State (reports per page, configurable)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const totalPages = Math.ceil(reports.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const displayedReports = reports.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Sync with store & localStorage and redirect if ticket/id query param is present
  React.useEffect(() => {
    const all = getStoredReports();
    setReports(all);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get("id") || params.get("ticket");
      if (queryId) {
        router.replace(`/laporan/${encodeURIComponent(queryId)}`);
      }
    }

    const handleUpdate = () => setReports(getStoredReports());
    window.addEventListener("riverse_reports_updated", handleUpdate);
    return () => window.removeEventListener("riverse_reports_updated", handleUpdate);
  }, [router]);

  const handleVote = (reportId: string) => {
    const updated = voteReport(reportId);
    if (updated) {
      setReports(getStoredReports());
      showToast("Dukungan laporan (+1 Vote) berhasil ditambahkan!", "success");
    }
  };

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
          showToast("Koordinat lokasi GPS presisi berhasil didapatkan!", "info");
        },
        () => {
          // Fallback simulation if denied or mock
          setGpsLocation("-6.2352, 106.8543 (Sesuai Peta GIS)");
          setIsLocating(false);
          showToast("Lokasi diset ke titik GIS default (-6.2352, 106.8543)", "info");
        }
      );
    } else {
      setGpsLocation("-6.2352, 106.8543 (Sesuai Peta GIS)");
      setIsLocating(false);
      showToast("Lokasi diset ke titik GIS default (-6.2352, 106.8543)", "info");
    }
  };

  // Handle Location Selection from Leaflet GIS Map
  const handleMapSelectLocation = (location: { lat: number; lng: number; riverName: string }) => {
    setGpsLocation(`${location.lat}, ${location.lng} (Titik Spasial Peta Leaflet)`);
    setAddress(location.riverName);
    setShowFormModal(true);
    showToast(`Lokasi ${location.riverName} dipilih dari Peta Spasial GIS!`, "info");
  };

  // Handle Photo Upload Simulation (Persistent Base64 Data URL)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
          showToast("Foto bukti pencemaran sungai berhasil diunggah!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission with 500m Geofencing
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let targetLat = -6.235;
    let targetLng = 106.854;

    if (gpsLocation) {
      const match = gpsLocation.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (match) {
        targetLat = parseFloat(match[1]);
        targetLng = parseFloat(match[2]);
      }
    }

    const selectedCatObj = POLLUTION_CATEGORIES.find((c) => c.id === category);
    const categoryLabel = selectedCatObj ? selectedCatObj.title : "Pencemaran Sungai";

    setTimeout(() => {
      const result = submitCitizenReport({
        category: category as ReportCategory,
        categoryLabel,
        riverName: riverSegment,
        locationDetail: address || riverSegment,
        description,
        reporterName,
        isAnonymous,
        lat: targetLat,
        lng: targetLng,
        image: previewImage || undefined,
        radiusMetersThreshold: 500,
      });

      setSubmissionResult(result);
      setTicketNumber(result.ticketNo);
      setReports(getStoredReports());
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(`Laporan ${result.ticketNo} berhasil dikirim ke sistem RIVERSE!`, "success");
    }, 1000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionResult(null);
    setCategory("sampah");
    setDescription("");
    setAddress("");
    setPreviewImage(null);
    setGpsLocation(null);
  };

  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] text-slate-800 font-sans selection:bg-[#0284C7] selection:text-white">
      {/* ============================================================ */}
      {/* FLOATING GLASSMORPHISM NAVBAR                                 */}
      {/* ============================================================ */}
      <Navbar />

      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative w-full pt-40 sm:pt-48 lg:pt-52 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          {/* Floating Tilted Cards with Smooth Organic Bobbing Animations */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            className="hidden lg:block absolute left-2 xl:left-8 top-6 -rotate-6 hover:rotate-0 transition-transform duration-300 z-10 cursor-pointer"
          >
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-2xl hover:shadow-[#0284C7]/25 hover:border-sky-400/70 hover:scale-105 transition-all">
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
            className="hidden lg:block absolute right-2 xl:right-8 top-6 rotate-6 hover:rotate-0 transition-transform duration-300 z-10 cursor-pointer"
          >
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-2xl hover:shadow-[#0284C7]/25 hover:border-sky-400/70 hover:scale-105 transition-all">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">10.000+</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Partisipasi Warga</span>
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-2xl hover:shadow-[#0284C7]/25 hover:border-sky-400/70 hover:scale-105 transition-all">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">24/7</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Respon Siaga DLH</span>
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-3 hover:shadow-2xl hover:shadow-[#0284C7]/25 hover:border-sky-400/70 hover:scale-105 transition-all">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg text-slate-900 leading-none">100% Akurat</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Akurasi Lokasi GIS</span>
              </div>
              <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Main Hero Header Content */}
          <div className="max-w-3xl mx-auto relative z-20">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0284C7] leading-tight mb-4">
              Satu Laporan Warga, <br className="hidden sm:block" />
              <span className="text-[#0284C7]">Satu Langkah Selamatkan Sungai</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto mb-2">
              Sampaikan laporan pencemaran secara akurat dalam hitungan menit. Tanpa proses rumit, langsung terverifikasi dan diproses oleh Dinas Lingkungan Hidup.
            </p>
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
          <span>Buat Laporan Baru Sekarang</span>
        </button>
        <p className="text-xs text-slate-500 font-medium mt-2">
          Atau klik salah satu titik penanda di peta untuk langsung mengisi laporan spasial.
        </p>
      </div>

      {/* ============================================================ */}
      {/* COMMUNITY LIVE REPORTS & VOTING SECTION                      */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dukung & Pantau Laporan Warga
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Dukungan warga mempercepat verifikasi & penanganan langsung oleh Dinas Lingkungan Hidup.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              Total Laporan: {reports.length}
            </span>
          </div>
        </div>

        {/* Reports Grid (4 Items per page) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReports.map((rpt) => {
            const subCount = rpt.subReports?.length || 0;
            return (
              <div
                key={rpt.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs transition-all hover:shadow-2xl hover:shadow-[#0284C7]/20 hover:border-sky-400/70 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                      #{rpt.ticketNo}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        rpt.status === "terverifikasi"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : rpt.status === "diproses"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : rpt.status === "selesai"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {rpt.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug mb-1.5">
                    {rpt.riverName}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mb-3 line-clamp-2 leading-relaxed">
                    {rpt.description}
                  </p>

                  {/* Meta info tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-slate-600 font-medium">
                    <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {rpt.locationDetail}
                    </span>
                    {subCount > 0 && (
                      <span className="bg-sky-50 text-[#0284C7] px-2.5 py-1 rounded-lg border border-sky-200 font-bold">
                        💬 {subCount} Sub-Laporan
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions & Voting Bar */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleVote(rpt.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Dukung (+1 Vote)</span>
                    <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
                      {rpt.upvotes}
                    </span>
                  </button>

                  <Link
                    href={`/laporan/${encodeURIComponent(rpt.ticketNo || rpt.id)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284C7] font-bold text-xs transition-all border border-slate-200/80 cursor-pointer"
                  >
                    <span>Detail & Sub-Laporan</span>
                    <ChevronRight className="w-4 h-4 text-[#0284C7]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Index (configurable per page) */}
        {reports.length > 0 && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">
                Menampilkan Halaman {safePage} dari {totalPages} ({reports.length} Total Laporan)
              </span>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="hidden sm:inline">Tampilkan:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer outline-none focus:border-[#0284C7]"
                >
                  {[4, 8, 12, 20].map((n) => (
                    <option key={n} value={n}>
                      {n} / hal.
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {(() => {
                const pages: (number | "…")[] = [];
                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (safePage > 3) pages.push("…");
                  for (
                    let i = Math.max(2, safePage - 1);
                    i <= Math.min(totalPages - 1, safePage + 1);
                    i++
                  ) {
                    pages.push(i);
                  }
                  if (safePage < totalPages - 2) pages.push("…");
                  pages.push(totalPages);
                }
                return pages.map((pageNum, idx) =>
                  pageNum === "…" ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-1 text-xs text-slate-400 font-bold select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        safePage === pageNum
                          ? "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                );
              })()}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* MODAL DIALOG REPORTING FORM OVERLAY                           */}
      {/* ============================================================ */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar (Clean Light Theme per DESIGN.md) */}
            <div className="p-6 sm:p-7 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">Formulir Pelaporan Pencemaran Sungai</h3>
                  <p className="text-xs text-slate-500 font-medium">Isi detail kejadian pencemaran secara presisi untuk verifikasi komunitas & DLH</p>
                </div>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
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
                  {submissionResult?.isAggregated ? (
                    <>
                      <div className="h-20 w-20 bg-sky-100 text-[#0284C7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-sky-200">
                        <MapPin className="w-10 h-10 animate-bounce" />
                      </div>

                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-[#0284C7] text-xs font-extrabold tracking-wide mb-3 border border-sky-200">
                        ⚡ Smart Geofencing Radius ({submissionResult.aggregatedDistanceMeters}m ≤ 500m)
                      </div>
                      
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Laporan Otomatis Digabungkan!
                      </h2>
                      
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        Sistem Spasial RIVERSE mendeteksi laporan aktif pada lokasi yang sama dalam radius <strong>{submissionResult.aggregatedDistanceMeters} meter</strong>. Laporan Anda berhasil ditambahkan ke Tiket Utama <strong>#{ticketNumber}</strong> sebagai <strong>Sub-Laporan Komunitas</strong> (+1 Dukungan Warga & foto bukti baru).
                      </p>

                      {/* Ticket Card Box */}
                      <div className="my-6 p-6 rounded-2xl bg-sky-50/80 border border-sky-200 text-left max-w-md mx-auto shadow-xs">
                        <div className="flex justify-between items-center pb-3 border-b border-sky-200/80">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tiket Utama Komando</span>
                          <span className="font-mono font-extrabold text-base text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-sky-200 shadow-xs">
                            #{ticketNumber}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Status Penanganan:</span>
                            <span className="font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-200 capitalize">
                              {submissionResult.report.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Total Dukungan Warga:</span>
                            <span className="font-bold text-slate-800">
                              👍 {submissionResult.report.upvotes} Votes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Sub-Laporan Komunitas:</span>
                            <span className="font-bold text-[#0284C7]">
                              {submissionResult.report.subReports?.length || 1} Sub-Laporan Ditambahkan
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}

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
                /* MAIN FORM */
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* 1. Kategori Pencemaran */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] text-xs font-bold">1</span>
                      <h4 className="text-sm font-bold text-slate-900">Pilih Kategori Pencemaran</h4>
                      <span className="text-rose-500 text-xs font-bold">*</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-8 mb-4">Pilih jenis masalah pencemaran sungai yang Anda temukan di lokasi.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {POLLUTION_CATEGORIES.map((cat) => {
                        const isSelected = category === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3.5 relative ${
                              isSelected
                                ? "border-[#0284C7] bg-sky-50/70 shadow-sm ring-2 ring-[#0284C7]/15"
                                : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                          >
                            <div className="pr-2">
                              <h4 className="font-bold text-xs text-slate-900">{cat.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-normal">{cat.desc}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Lokasi & Segmen Sungai */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] text-xs font-bold">2</span>
                      <h4 className="text-sm font-bold text-slate-900">Lokasi & Segmen Sungai</h4>
                      <span className="text-rose-500 text-xs font-bold">*</span>
                    </div>

                    <div className="ml-8 space-y-3.5 mt-3">
                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1.5">Wilayah / Segmen Sungai:</span>
                        <select
                          value={riverSegment}
                          onChange={(e) => setRiverSegment(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all outline-none"
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
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/80 text-[#0284C7] text-xs font-bold transition-all cursor-pointer active:scale-95"
                        >
                          <span>{isLocating ? "Mendeteksi Koordinat GPS..." : "Gunakan Titik GPS Presisi"}</span>
                        </button>
                        {gpsLocation && (
                          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center gap-2">
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
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Detail Kejadian */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] text-xs font-bold">3</span>
                      <h4 className="text-sm font-bold text-slate-900">Detail Deskripsi Pencemaran</h4>
                      <span className="text-rose-500 text-xs font-bold">*</span>
                    </div>
                    <div className="ml-8 mt-2">
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Jelaskan kondisi pencemaran yang terjadi (misal: air menghitam sejak tadi pagi, tumpukan sampah plastik menyumbat aliran...)"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* 4. Unggah Foto Bukti */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] text-xs font-bold">4</span>
                      <h4 className="text-sm font-bold text-slate-900">Unggah Foto Bukti Lapangan</h4>
                    </div>
                    
                    <div className="ml-8 mt-2">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200/90 border-dashed rounded-2xl bg-slate-50/50 hover:bg-sky-50/30 hover:border-[#0284C7] transition-all relative cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-1 text-center">
                          <Camera className="mx-auto h-7 w-7 text-slate-400 group-hover:text-[#0284C7] transition-colors" />
                          <div className="flex text-xs text-slate-600 font-semibold justify-center">
                            <span className="text-[#0284C7]">Pilih foto</span>
                            <span className="pl-1">atau tarik berkas ke sini</span>
                          </div>
                          <p className="text-[10px] text-slate-400">PNG, JPG hingga 10MB</p>
                        </div>
                      </div>

                      {previewImage && (
                        <div className="mt-3 relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 shadow-sm">
                          <img src={previewImage} alt="Preview Bukti" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-sm shadow-xl shadow-[#0284C7]/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Mengirim Laporan...</span>
                      ) : (
                        <span>Kirim Laporan</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
}
