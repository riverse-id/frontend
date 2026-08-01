"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Users,
  Navigation,
} from "lucide-react";
import dynamic from "next/dynamic";

const RiverGISMap = dynamic(() => import("./RiverGISMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-52 sm:h-60 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-800">
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-sky-200">Memuat Interactive GIS Map...</span>
      </div>
    </div>
  ),
});

export default function FeaturesOverview() {
  return (
    <section id="beranda" className="relative bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36 min-h-[85vh] flex items-center overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* ============================================================ */}
        {/* HERO SHOWCASE SECTION (Beranda Hero)                          */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Bold Blue Headline, Copywriting, CTA Button */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0284C7] leading-[1.12] tracking-tight">
              Lapor Sungai Tercemar Cuma 5 Menit!
            </h2>

            <div className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-xl space-y-3">
              <p>
                Bantu jaga sungai dengan teknologi GIS presisi. Potret, laporkan, dan pantau penanganannya oleh Dinas Lingkungan Hidup secara real-time tanpa proses rumit.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/lapor"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#0284C7] text-white font-bold text-base shadow-xl shadow-[#0284C7]/30 hover:bg-[#0284C7]/90 hover:scale-105 active:scale-95 transition-all duration-300 gap-2.5"
              >
                <span>Buat Laporan Sekarang</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Tilted Perspective Cards Showcase */}
          <div className="lg:col-span-6 relative w-full perspective-[1200px]">
            <div className="relative grid grid-cols-2 gap-4 [transform:rotateY(-12deg)_rotateX(7deg)_rotateZ(2deg)] sm:[transform:rotateY(-15deg)_rotateX(9deg)_rotateZ(3deg)] hover:[transform:rotateY(-4deg)_rotateX(3deg)_rotateZ(1deg)] transition-transform duration-700 ease-out">
              
              {/* Card 1: Live Interactive GIS Map */}
              <div className="col-span-2 rounded-2xl bg-white p-4 shadow-2xl border border-sky-100 backdrop-blur-md transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0284C7]/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#0284C7]" />
                    </div>
                    <span className="text-xs font-bold text-[#0F172A]">Peta GIS Riverse Live</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Real-Time GIS
                  </span>
                </div>
                <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 pointer-events-none select-none">
                  <RiverGISMap interactive={false} showHeader={false} />
                </div>
              </div>

              {/* Card 2: GIS Status Indicator */}
              <div className="rounded-2xl bg-white p-3.5 shadow-xl border border-sky-100 hover:border-sky-400/70 hover:shadow-2xl hover:shadow-[#0284C7]/25 transform hover:-translate-y-1 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 mb-2.5 text-[#0F172A] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                  <span>Status GIS Palette</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50 border border-rose-100">
                    <span className="font-semibold text-rose-900">Tercemar 🔴</span>
                    <span className="text-rose-700">Limbah / Bahaya</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                    <span className="font-semibold text-amber-900">Banyak Sampah 🟠</span>
                    <span className="text-amber-700">Plastik / Pemukiman</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="font-semibold text-emerald-900">Bersih / Selesai 🟢</span>
                    <span className="text-emerald-700">Normal / Terawat</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Geofencing & Anti-Spam */}
              <div className="rounded-2xl bg-white p-3.5 shadow-xl border border-sky-100 hover:border-sky-400/70 hover:shadow-2xl hover:shadow-[#0284C7]/25 transform hover:-translate-y-1 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 mb-2 text-[#0F172A] text-xs font-bold">
                  <Navigation className="w-4 h-4 text-[#0284C7]" />
                  <span>Smart Geofencing</span>
                </div>
                <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2">
                  <Image
                    src="/assets/sungai/antarafoto-bantaran-sungai-penuh-sampah-230624-adm-1.jpg"
                    alt="Penumpukan Sampah"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#0284C7]/20 mix-blend-multiply" />
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded">
                    Radius &lt;500m
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 block leading-tight font-medium">
                  Validasi PostGIS Mencegah Duplikasi
                </span>
              </div>

              {/* Card 4: Community Escalation */}
              <div className="col-span-2 rounded-2xl bg-gradient-to-r from-sky-500 via-[#0284C7] to-[#0F172A] p-4 text-white shadow-2xl transform hover:-translate-y-1 transition-transform flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block text-sky-200">
                    Verifikasi Komunitas
                  </span>
                  <span className="text-xs sm:text-sm font-bold block mt-0.5">
                    Prioritas & Upvote Komunitas
                  </span>
                  <span className="text-[11px] text-sky-100/90 block mt-0.5">
                    Laporan berdukungan warga otomatis dieskalasi ke Dinas DLH
                  </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
