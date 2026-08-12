"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X, MapPin } from "lucide-react";
import { CctvPoint } from "../../lib/store";

interface CctvPlayerModalProps {
  cctv: CctvPoint | null;
  onClose: () => void;
}

const CCTV_STATUS_STYLE: Record<CctvPoint["status"], { label: string; cls: string }> = {
  aktif: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  offline: { label: "Offline", cls: "bg-slate-100 text-slate-600 border-slate-300" },
  perbaikan: { label: "Perbaikan", cls: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default function CctvPlayerModal({ cctv, onClose }: CctvPlayerModalProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Kunci scroll halaman belakang dan blokir seluruh interaksi saat modal CCTV terbuka
  React.useEffect(() => {
    if (!cctv) return;

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
  }, [cctv, onClose]);

  if (!cctv) return null;

  const status = CCTV_STATUS_STYLE[cctv.status] || CCTV_STATUS_STYLE.offline;
  const hasStream = Boolean(cctv.streamUrl);

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-none"
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
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-50 via-white to-white border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
                {cctv.name}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${status.cls}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
              <span className="truncate">
                {cctv.riverName} — {cctv.locationDetail}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Tutup Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
          {hasStream ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white bg-slate-900">
                  <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-300">Menghubungkan ke stream CCTV...</span>
                </div>
              )}
              <iframe
                src={cctv.streamUrl}
                title={cctv.name}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-500">
              <span className="text-sm font-bold">Stream tidak tersedia</span>
              <span className="text-xs text-slate-400">
                Titik CCTV ini belum memiliki URL stream live.
              </span>
            </div>
          )}

          {/* Live Status Note */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Feed CCTV monitoring alur sungai secara real-time.
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
