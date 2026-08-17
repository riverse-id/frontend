"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  MapPin,
  Clock,
  ThumbsUp,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Layers,
  Copy,
  Check,
  Sliders,
  X,
  ExternalLink,
  MessageCircle,
  Send,
  ArrowLeft,
  Droplets,
  Trash2,
  Search,
  Sparkles,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useToast } from "../../components/ToastProvider";
import { getReportByIdOrTicket, voteReport, getStoredReports } from "../../../lib/store";
import { Report, ReportStatus } from "../../../lib/types";

// Dynamically import Leaflet mini map with SSR disabled
const ReportMiniGISMap = dynamic(
  () => import("../../components/ReportMiniGISMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold">Memuat Peta Spasial...</span>
        </div>
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

const STATUS_SHARE_LABEL: Record<ReportStatus, { icon: string; label: string }> = {
  pending: { icon: "🟠", label: "Pending (Menunggu Verifikasi Komunitas)" },
  terverifikasi: { icon: "🔴", label: "Terverifikasi (Antrean Prioritas DLH)" },
  diproses: { icon: "🔵", label: "Sedang Diproses Tim Lapangan" },
  selesai: { icon: "🟢", label: "Selesai (Closed-Loop Pembersihan)" },
  ditolak: { icon: "⚪", label: "Ditolak / Tidak Valid" },
};

export default function LaporanDetailPage({ params }: PageProps) {
  const router = useRouter();
  const routeParams = useParams();
  const rawId = (routeParams?.id as string) || "";
  const { showToast } = useToast();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeLightBoxImage, setActiveLightBoxImage] = useState<string | null>(null);

  // Load report by ID or Ticket Number
  useEffect(() => {
    const fetchReport = () => {
      if (!rawId) {
        setLoading(false);
        return;
      }
      const found = getReportByIdOrTicket(rawId);
      if (found) {
        setReport(found);
      }
      setLoading(false);
    };

    fetchReport();

    // Listen to changes in storage
    const handleUpdate = () => fetchReport();
    window.addEventListener("riverse_reports_updated", handleUpdate);
    return () => window.removeEventListener("riverse_reports_updated", handleUpdate);
  }, [rawId]);

  const handleVote = () => {
    if (!report || hasVoted) return;
    const updated = voteReport(report.id);
    if (updated) {
      setReport(updated);
      setHasVoted(true);
      showToast("Terima kasih! Dukungan Anda berhasil ditambahkan (+1 Vote).", "success");
    }
  };

  const getShareUrl = () => {
    if (typeof window === "undefined" || !report) return "";
    return `${window.location.origin}/laporan/${encodeURIComponent(report.ticketNo || report.id)}`;
  };

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast(`Tautan laporan #${report?.ticketNo} berhasil disalin ke clipboard!`, "success");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      showToast(`Tautan laporan #${report?.ticketNo} berhasil disalin ke clipboard!`, "success");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const buildShareMessage = () => {
    if (!report) return "";
    return (
      `*Laporan Pencemaran Sungai — RIVERSE*\n\n` +
      `📌 *No. Tiket:* #${report.ticketNo}\n` +
      `🌊 *Sungai:* ${report.riverName}\n` +
      `📍 *Lokasi:* ${report.locationDetail}\n` +
      `⚡ *Status:* ${report.status.toUpperCase()}\n` +
      `👍 *Dukungan Warga:* ${report.upvotes} suara\n\n` +
      `Ayo bantu dukung laporan ini agar segera ditangani Dinas Lingkungan Hidup:\n` +
      `${getShareUrl()}`
    );
  };

  const shareToWhatsApp = () => {
    const msg = buildShareMessage();
    if (!msg) return;
    const text = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const shareToTwitter = () => {
    const shareUrl = getShareUrl();
    if (!shareUrl || !report) return;
    const st = STATUS_SHARE_LABEL[report.status] || STATUS_SHARE_LABEL.pending;
    const text = encodeURIComponent(
      `Pantau & dukung laporan pencemaran #${report.ticketNo} di ${report.riverName} (${st.icon} ${st.label}) via @RIVERSE_ID:\n${shareUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleCopyMessage = async () => {
    const msg = buildShareMessage();
    if (!msg) return;
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedMessage(true);
      showToast("Pesan lengkap laporan berhasil disalin!", "success");
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = msg;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedMessage(true);
      showToast("Pesan lengkap laporan berhasil disalin!", "success");
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] text-slate-800 font-sans flex flex-col">
        <Navbar />
        <main className="max-w-5xl mx-auto w-full px-4 pt-32 pb-20 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-lg font-bold text-slate-800">Memuat Detail Laporan...</h2>
          <p className="text-xs text-slate-500 mt-1">Mengambil data spasial & audit trail dari sistem.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Not Found State
  if (!report) {
    return (
      <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] text-slate-800 font-sans flex flex-col">
        <Navbar />
        <main className="max-w-3xl mx-auto w-full px-4 pt-32 pb-20 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-200 text-[#0284C7] flex items-center justify-center mb-6 shadow-xl shadow-sky-100">
            <Search className="w-10 h-10" />
          </div>
          <span className="font-mono text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-3">
            Error 404 — Laporan Tidak Ditemukan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Laporan #{rawId} Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-600 max-w-md mb-8 leading-relaxed">
            Nomor tiket atau ID laporan ini mungkin salah atau belum terdaftar dalam basis data sistem RIVERSE.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/lapor"
              className="px-6 py-3.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Buka Peta & Daftar Laporan</span>
            </Link>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isCompleted = report.status === "selesai";
  const progressPercent = Math.min(
    100,
    Math.round((report.upvotes / report.voteThreshold) * 100)
  );

  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] text-slate-800 font-sans flex flex-col selection:bg-[#0284C7] selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 flex-1 space-y-6">
        
        {/* Top Action & Breadcrumb Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Back Button on Left */}
          <Link
            href="/lapor"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0284C7] font-bold text-xs border border-slate-200/90 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Kembali ke Peta Spasial</span>
          </Link>

          {/* Breadcrumb on Right */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/lapor" className="hover:text-[#0284C7] transition-colors">
              Buat Lapor
            </Link>
            <span>/</span>
            <span className="font-mono text-[#0284C7] font-bold">#{report.ticketNo}</span>
          </nav>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                  {report.ticketNo}
                </span>

                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {report.categoryLabel || "Pencemaran Sungai"}
                </span>

                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                  {report.region}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {report.riverName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
                <span>{report.locationDetail}</span>
              </p>
            </div>

            {/* Status & Urgency Badge */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                {report.status === "pending" && (
                  <span className="px-4 py-2 rounded-full bg-amber-50 text-amber-800 font-extrabold text-xs border border-amber-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending Vote Warga
                  </span>
                )}
                {report.status === "terverifikasi" && (
                  <span className="px-4 py-2 rounded-full bg-rose-50 text-rose-800 font-extrabold text-xs border border-rose-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    Terverifikasi (Antrean DLH)
                  </span>
                )}
                {report.status === "diproses" && (
                  <span className="px-4 py-2 rounded-full bg-sky-50 text-sky-800 font-extrabold text-xs border border-sky-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-spin" />
                    Sedang Ditangani DLH
                  </span>
                )}
                {report.status === "selesai" && (
                  <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Closed-Loop Selesai Clean
                  </span>
                )}
                {report.status === "ditolak" && (
                  <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200">
                    Ditolak DLH
                  </span>
                )}
              </div>

              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
                Urgency Score: {report.urgencyScore} Poin
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Media, Description, Sub-reports, Officer Note (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Before vs After Interactive Comparison Slider (If Selesai) */}
            {isCompleted && report.afterImage ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#0284C7]" />
                    Perbandingan Sebelum vs Sesudah Pembersihan
                  </h3>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Geser slider untuk melihat perbedaan
                  </span>
                </div>

                <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden select-none border border-slate-200 shadow-md group">
                  {/* Background Image (After - Clean) */}
                  <img
                    src={report.afterImage}
                    alt="Kondisi Setelah Dibersihkan (After)"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] shadow-md pointer-events-none z-10">
                    AFTER (Selesai Clean)
                  </span>

                  {/* Foreground Image (Before - Dirty) with Non-Warping Clip Path */}
                  <img
                    src={report.beforeImages[0]}
                    alt="Kondisi Awal (Before)"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                    }}
                  />
                  <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] shadow-md pointer-events-none z-10">
                    BEFORE (Kondisi Awal)
                  </span>

                  {/* Slider Divider Line */}
                  <div
                    style={{ left: `${sliderPos}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)] pointer-events-none z-20"
                  />

                  {/* Slider Center Circular Drag Handle */}
                  <div
                    style={{ left: `${sliderPos}%` }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-xl border-2 border-white pointer-events-none z-20 group-hover:scale-110 transition-transform"
                  >
                    <Sliders className="w-5 h-5" />
                  </div>

                  {/* Full Container Range Input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0 p-0"
                    aria-label="Geser perbandingan Before After"
                  />
                </div>
              </div>
            ) : (
              /* Regular Photo Gallery */
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Galeri Foto Bukti Lapangan
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Klik foto untuk memperbesar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.beforeImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveLightBoxImage(img)}
                      className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 relative group cursor-pointer shadow-xs hover:shadow-md transition-all"
                    >
                      <img
                        src={img}
                        alt={`Bukti ${idx + 1}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-4 py-2 rounded-full bg-white/95 text-slate-900 text-xs font-extrabold shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                          Perbesar Foto
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Reporter Info */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                Detail Kronologi Pelaporan
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  "{report.description}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-100 text-slate-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Pelapor:</span>
                    <strong className="text-slate-800">
                      {report.isAnonymous ? "Warga Anonim (Privasi Dilindungi)" : report.reporterName}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Tanggal Laporan:</span>
                    <strong className="text-slate-800">
                      {new Date(report.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Reports Cluster (Smart Geofencing Duplicates) */}
            {report.subReports && report.subReports.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0284C7]" />
                    Laporan Pendukung / Sub-Reports ({report.subReports.length})
                  </h3>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    Geofencing &lt; 500m
                  </span>
                </div>

                <div className="space-y-3">
                  {report.subReports.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{sub.reporterName}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{sub.categoryLabel}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">"{sub.description}"</p>
                      
                      {sub.images && sub.images.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {sub.images.map((subImg, sIdx) => (
                            <div
                              key={sIdx}
                              onClick={() => setActiveLightBoxImage(subImg)}
                              className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:scale-105 transition-transform relative group"
                            >
                              <img
                                src={subImg}
                                alt="Sub Bukti"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg";
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Officer Note if Completed */}
            {report.officerNote && (
              <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 text-emerald-900 space-y-2 shadow-xs">
                <span className="font-extrabold text-xs flex items-center gap-2 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Catatan Resmi Penanganan Dinas Lingkungan Hidup:
                </span>
                <p className="text-xs leading-relaxed font-medium text-emerald-950">
                  {report.officerNote}
                </p>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Map, Voting, Audit Trail, Share Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Precise GIS Map */}
            <ReportMiniGISMap
              lat={report.lat}
              lng={report.lng}
              riverName={report.riverName}
              locationDetail={report.locationDetail}
              status={report.status}
              ticketNo={report.ticketNo}
              categoryLabel={report.categoryLabel}
            />

            {/* 2. Vote & Citizen Support Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-[#0284C7]" />
                  Dukungan Warga Spasial
                </h3>
                <span className="text-xs font-mono font-bold text-[#0284C7]">
                  {report.upvotes} / {report.voteThreshold} Vote
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-[#0284C7] to-sky-400 rounded-full transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Progres: {progressPercent}%</span>
                  <span>Threshold Verifikasi: {report.voteThreshold} Vote</span>
                </div>
              </div>

              {/* Vote Button */}
              <button
                onClick={handleVote}
                disabled={hasVoted || report.status !== "pending"}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  hasVoted
                    ? "bg-emerald-600 text-white shadow-emerald-600/20"
                    : report.status !== "pending"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : "bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-[#0284C7]/20 active:scale-98"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>
                  {hasVoted
                    ? "Sudah Didukung! (+1 Vote)"
                    : report.status !== "pending"
                    ? "Laporan Sudah Terverifikasi / Diproses"
                    : "Dukung Laporan Ini (+1 Vote)"}
                </span>
              </button>
            </div>

            {/* 3. Share & Viral Distribution Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#0284C7]" />
                  Bagikan Laporan Ini
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Ajak warga sekitar memberikan dukungan vote agar segera diverifikasi oleh tim DLH.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Tautan Tersalin ke Clipboard!" : "Salin Tautan Khusus Laporan"}</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={shareToWhatsApp}
                    className="py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter / X</span>
                  </button>
                </div>

                <button
                  onClick={handleCopyMessage}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>
                    {copiedMessage
                      ? "Pesan Lengkap Tersalin!"
                      : "Salin Pesan Lengkap (Jika WhatsApp tidak otomatis terisi)"}
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Status Timeline & Audit Trail */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0284C7]" />
                Timeline & Audit Trail Status
              </h3>

              <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                {report.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#0284C7] ring-4 ring-white" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{step.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block font-medium mt-0.5">
                      Oleh: {step.actor}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. CTA Laporkan Titik Baru */}
            <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-[#0284C7] p-6 text-white shadow-xl shadow-sky-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-200" />
                <h4 className="font-extrabold text-sm">Lihat Pencemaran Serupa?</h4>
              </div>
              <p className="text-xs text-sky-100 leading-relaxed font-medium">
                Buat laporan mandiri atau pantau seluruh aliran sungai Jabodetabek di Peta Interaktif Spasial.
              </p>
              <Link
                href="/lapor"
                className="inline-flex items-center justify-center w-full py-3 rounded-2xl bg-white text-[#0284C7] font-extrabold text-xs hover:bg-sky-50 transition-all shadow-md"
              >
                Buat Laporan Baru di Peta
              </Link>
            </div>

          </div>

        </div>

      </main>

      {/* Full-Screen Lightbox Image Preview Modal */}
      {activeLightBoxImage && (
        <div
          onClick={() => setActiveLightBoxImage(null)}
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-in fade-in zoom-in duration-200"
        >
          <button
            type="button"
            onClick={() => setActiveLightBoxImage(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shadow-xl cursor-pointer"
            title="Tutup Preview Foto"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeLightBoxImage}
              alt="Preview Foto Bukti"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
