"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Report } from "../../lib/types";
import {
  X,
  ThumbsUp,
  Share2,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Layers,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";
import { useToast } from "./ToastProvider";


interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onVote: (reportId: string) => void;
}

export default function ReportDetailModal({
  report,
  onClose,
  onVote,
}: ReportDetailModalProps) {
  const { showToast } = useToast();
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeLightBoxImage, setActiveLightBoxImage] = useState<string | null>(null);

  // Kunci scroll halaman belakang dan tangani tombol ESC
  React.useEffect(() => {
    if (!report) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [report, onClose]);

  if (!report) return null;

  const isCompleted = report.status === "selesai";
  const progressPercent = Math.min(
    100,
    Math.round((report.upvotes / report.voteThreshold) * 100)
  );

  const handleVoteClick = () => {
    if (!hasVoted) {
      onVote(report.id);
      setHasVoted(true);
      showToast("Terima kasih! Dukungan Anda berhasil ditambahkan (+1 Vote).", "success");
    }
  };

  const handleCopyLink = async () => {
    if (typeof window !== "undefined" && report) {
      const shareUrl = `${window.location.origin}/laporan/${encodeURIComponent(report.ticketNo || report.id)}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        showToast(`Tautan laporan #${report.ticketNo} berhasil disalin ke clipboard!`, "success");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        showToast(`Tautan laporan #${report.ticketNo} berhasil disalin ke clipboard!`, "success");
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn overscroll-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
              {report.ticketNo}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {report.riverName}
              </h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                {report.locationDetail}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Status Badge & Vote Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status Laporan:</span>
                {report.status === "pending" && (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Pending (Mengumpulkan Dukungan Warga)
                  </span>
                )}
                {report.status === "terverifikasi" && (
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Terverifikasi (Antrean DLH)
                  </span>
                )}
                {report.status === "diproses" && (
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-spin" />
                    Sedang Diproses Tim Lapangan
                  </span>
                )}
                {report.status === "selesai" && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Closed-Loop Selesai Clean
                  </span>
                )}
                {report.status === "ditolak" && (
                  <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300">
                    Ditolak DLH
                  </span>
                )}
              </div>

              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                Urgency Score: {report.urgencyScore} Poin
              </span>
            </div>

            {/* Vote Threshold Progress Bar */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-600">Dukungan Warga Spasial</span>
                <span className="text-[#0284C7] font-mono">
                  {report.upvotes} / {report.voteThreshold} Vote ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-[#0284C7] to-sky-400 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* BEFORE vs AFTER INTERACTIVE COMPARISON SLIDER (When Selesai) */}
          {isCompleted && report.afterImage ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#0284C7]" />
                  Perbandingan Hasil Pembersihan (Before vs After)
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">Geser garis slider untuk melihat perbedaan</span>
              </div>

              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden select-none border border-slate-200 shadow-md group">
                {/* Background Image (After - Clean) */}
                <img
                  src={report.afterImage}
                  alt="Kondisi Setelah Dibersihkan (After)"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] shadow-md pointer-events-none z-10">
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
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] shadow-md pointer-events-none z-10">
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
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-xl border-2 border-white pointer-events-none z-20 group-hover:scale-110 transition-transform"
                >
                  <Sliders className="w-4 h-4" />
                </div>

                {/* Full Container Range Input - Captures Touch & Drag Events Everywhere */}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900">Galeri Foto Bukti Lapangan</h4>
                <span className="text-[10px] font-semibold text-slate-400">Klik foto untuk melihat ukuran penuh</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.beforeImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveLightBoxImage(img)}
                    className="h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={img}
                      alt={`Bukti ${idx + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-extrabold shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                        Klik Untuk Melihat Detail
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & Detail */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Deskripsi Pelapor</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">"{report.description}"</p>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
              <span>Pelapor: <strong className="text-slate-800">{report.isAnonymous ? "Anonim (Privasi Terjaga)" : report.reporterName}</strong></span>
              <span>Diupload: {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Sub-Reports Cluster (If Any) */}
          {report.subReports.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0284C7]" />
                Laporan Pendukung / Sub-Reports ({report.subReports.length})
              </h4>
              <div className="space-y-2">
                {report.subReports.map((sub) => (
                  <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-xs">{sub.reporterName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{sub.categoryLabel}</span>
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
                                (e.target as HTMLImageElement).src = "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg";
                              }}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                              Klik Untuk Melihat Detail
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Riwayat Perubahan Status */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0284C7]" />
              Timeline & Audit Trail Status
            </h4>
            <div className="space-y-3 pl-4 border-l-2 border-slate-200">
              {report.timeline.map((step, idx) => (
                <div key={idx} className="relative pl-4">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#0284C7] ring-4 ring-white" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{step.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block font-medium">Oleh: {step.actor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Note if Completed */}
          {report.officerNote && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4" /> Catatan Resmi Penanganan Dinas:
              </span>
              <p className="text-xs leading-relaxed font-medium">{report.officerNote}</p>
            </div>
          )}

          {/* Actions: Vote & Social Share */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleVoteClick}
              disabled={hasVoted || report.status !== "pending"}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                hasVoted
                  ? "bg-emerald-600 text-white"
                  : report.status !== "pending"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#0284C7] hover:bg-[#0284C7]/90 text-white active:scale-95"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{hasVoted ? "Sudah Didukung! (+1 Vote)" : "Dukung Laporan Ini (+1 Vote)"}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Salin tautan langsung menuju laporan ini"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Tautan Tersalin!" : "Salin Tautan"}</span>
              </button>

              <a
                href={`/laporan/${encodeURIComponent(report.ticketNo || report.id)}`}
                className="px-3.5 py-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold text-xs flex items-center justify-center gap-1.5 border border-sky-200/80 transition-all"
                title="Buka halaman detail khusus laporan ini"
              >
                <span>Halaman Khusus</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>

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
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
          >
            <img
              src={activeLightBoxImage}
              alt="Foto Bukti Detail"
              className="max-w-full max-h-[80vh] object-contain rounded-3xl border-2 border-white/20 shadow-2xl"
            />
            <div className="mt-4 px-4 py-2 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur-md border border-white/15 flex items-center gap-2">
              <span>Foto Bukti Lapangan Spasial RIVERSE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
