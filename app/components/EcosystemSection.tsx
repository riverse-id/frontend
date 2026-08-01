"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface StepData {
  stepNumber: string;
  title: string;
  userRole: string;
  roleBg: string;
  shortDesc: string;
  details: {
    subtitle: string;
    points: { label: string; desc: string }[];
    footerNote: string;
  };
}

const STEPS: StepData[] = [
  {
    stepNumber: "01",
    title: "Potret & Kirim Laporan",
    userRole: "Pengguna: Warga",
    roleBg: "bg-[#E0F2FE] text-[#0284C7] border-sky-200",
    shortDesc:
      "Potret kondisi sungai yang tercemar di sekitarmu. Sistem akan otomatis mengunci koordinat lokasi secara presisi menggunakan GIS.",
    details: {
      subtitle: "Mekanisme Pelaporan Spasial",
      points: [
        {
          label: "Deteksi GPS Presisi",
          desc: "Membaca metadata lokasi & koordinat spasial titik sungai secara otomatis.",
        },
        {
          label: "Privasi Pelapor Terjamin",
          desc: "Identitas warga dilindungi dengan enkripsi data terverifikasi.",
        },
        {
          label: "Offline First Mode",
          desc: "Foto & draft laporan dapat disimpan lokal saat koneksi internet minim.",
        },
      ],
      footerNote: "Laporan tersimpan di database & langsung muncul di peta publik.",
    },
  },
  {
    stepNumber: "02",
    title: "Deteksi Otomatis & Anti-Spam",
    userRole: "Pengguna: Sistem",
    roleBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    shortDesc:
      "Sistem mengecek lokasi dalam radius 500 meter untuk mencegah laporan ganda. Laporan sejenis dari beberapa warga akan otomatis digabungkan menjadi satu titik lokasi.",
    details: {
      subtitle: "Algoritma Geofencing & Clustering",
      points: [
        {
          label: "Buffer Spatial 500m",
          desc: "PostGIS mengelompokkan laporan sejenis di sepanjang alur sungai.",
        },
        {
          label: "Penggabungan Sub-Laporan",
          desc: "Foto tambahan warga lain otomatis memperkuat bukti titik lokasi.",
        },
        {
          label: "Filter Anti-Spam AI",
          desc: "Verifikasi kelayakan foto untuk mencegah laporan palsu atau nirlokasi.",
        },
      ],
      footerNote: "Mencegah duplikasi data agar penanganan DLH lebih terfokus.",
    },
  },
  {
    stepNumber: "03",
    title: "Dukungan Warga & Prioritas",
    userRole: "Pengguna: Komunitas",
    roleBg: "bg-amber-50 text-amber-800 border-amber-200",
    shortDesc:
      "Warga sekitar memberikan dukungan (vote) pada laporan. Semakin banyak vote, laporan otomatis naik ke urutan paling atas di dashboard DLH.",
    details: {
      subtitle: "Formula Urgensi & Upvote",
      points: [
        {
          label: "Eskalasi Urgensi Publik",
          desc: "Upvote warga mempercepat status dari Pending ke Terverifikasi.",
        },
        {
          label: "Rank Dashboard DLH",
          desc: "Laporan berbobot tinggi otomatis masuk daftar penanganan teratas.",
        },
        {
          label: "Notifikasi Komunitas",
          desc: "Warga sekitar mendapat notifikasi jika titik sungai mereka dievaluasi.",
        },
      ],
      footerNote: "Menjamin suara publik menjadi penentu utama skala prioritas.",
    },
  },
  {
    stepNumber: "04",
    title: "Penanganan & Bukti Before-After",
    userRole: "Pengguna: Dinas DLH",
    roleBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    shortDesc:
      "Petugas DLH menerima laporan prioritas, melakukan tindakan di lapangan, dan mengunggah foto bukti pembersihan (Before vs After) sebelum ditutup.",
    details: {
      subtitle: "Akuntabilitas & Closed-Loop",
      points: [
        {
          label: "Dispatch Tim Satgas",
          desc: "Petugas kebersihan diterjunkan langsung ke lokasi titik GIS.",
        },
        {
          label: "Bukti Transparan",
          desc: "Foto Before vs After diunggah publik sebagai bukti penyelesaian.",
        },
        {
          label: "Penutupan Resmi",
          desc: "Laporan ditutup secara permanen setelah diverifikasi selesai.",
        },
      ],
      footerNote: "Transparansi penuh hingga alur penanganan selesai 100%.",
    },
  },
];

function FlipStepCard({
  step,
  isFlipped,
  onToggle,
}: {
  step: StepData;
  isFlipped: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="w-full h-[320px] cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={onToggle}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-[#0284C7]/25 transition-all duration-300"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* ========================================================================= */}
        {/* SISI DEPAN (FRONT CARD - CLEAN WITHOUT ICON BOXES) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 group-hover:border-sky-400/70 flex flex-col justify-between overflow-hidden transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Subtle Ambient Hover Backdrop */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-100/60 rounded-full blur-xl pointer-events-none group-hover:bg-sky-200/70 transition-colors" />

          <div>
            {/* Header: Step Number */}
            <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-slate-300 group-hover:text-[#0284C7] transition-colors font-mono tracking-tighter">
                {step.stepNumber}
              </span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-sky-600 transition-colors uppercase tracking-wider font-mono">
                Langkah {step.stepNumber}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-extrabold text-[#0F172A] mb-3 group-hover:text-[#0284C7] transition-colors leading-snug relative z-10">
              {step.title}
            </h3>

            {/* Short Description */}
            <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-4 relative z-10">
              {step.shortDesc}
            </p>
          </div>

          {/* Footer Arrow Indicator */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end text-slate-400 group-hover:text-[#0284C7] transition-colors relative z-10">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SISI BELAKANG (BACK CARD - DETAIL VIEW) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white border border-slate-700/80 flex flex-col justify-between overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header: Step Number */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-400/20 text-sky-300 border border-sky-400/30">
                Detail Langkah {step.stepNumber}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white mb-3 tracking-tight border-b border-slate-700/80 pb-2">
              {step.details.subtitle}
            </h4>

            {/* Bullet Points without heavy icon boxes */}
            <div className="space-y-2.5">
              {step.details.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-sky-200 leading-tight">
                      {pt.label}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium leading-tight block mt-0.5">
                      {pt.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Arrow Indicator */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-end text-slate-400 group-hover:text-sky-300 transition-colors">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function EcosystemSection() {
  const [activeFlippedStep, setActiveFlippedStep] = useState<string | null>(null);

  const handleToggleFlip = (stepNumber: string) => {
    setActiveFlippedStep((prev) => (prev === stepNumber ? null : stepNumber));
  };

  return (
    <section
      id="cara-kerja"
      className="relative bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] scroll-mt-20 pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 overflow-hidden"
    >
      {/* Top & Bottom Gradient Fades for Seamless Section Transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            4 Langkah Mudah Laporkan Pencemaran Sungai
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Dari jepretan foto di lapangan hingga pembersihan oleh petugas, semua transparan dan dapat dipantau secara{" "}
            <span className="text-[#0284C7] font-semibold">real-time</span>.
          </p>
        </div>

        {/* 4 Interactive 3D Flip Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <FlipStepCard
              key={step.stepNumber}
              step={step}
              isFlipped={activeFlippedStep === step.stepNumber}
              onToggle={() => handleToggleFlip(step.stepNumber)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
