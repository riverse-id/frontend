"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Navigation,
  FileCheck2,
} from "lucide-react";

export default function FeaturesOverview() {
  return (
    <section id="beranda" className="relative bg-[#F8FAFC] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-sky-100 overflow-hidden">
      {/* Subtle Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284C7_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10 space-y-28">
        
        {/* ============================================================ */}
        {/* HERO SHOWCASE SECTION (Matching Reference Example Layout)    */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Bold Blue Headline, Underlined Copywriting, CTA Button */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0284C7] leading-[1.12] tracking-tight">
              Laporkan & Pantau <br />
              Sungai dalam <br />
              5 Menit!
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
              Tingkatkan kepedulian lingkungan dan raih penanganan sungai lebih cepat dengan platform GIS profesional. Sistem verifikasi komunitas & geofencing presisi membuat laporan warga terpercaya dan siap direspons langsung oleh Dinas Lingkungan Hidup. Wujudkan aksi nyata penyelamatan sungai hanya dengan satu langkah mudah.
            </p>

            <div className="pt-2">
              <a
                href="#peta-gis"
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
              
              {/* Card 1: Interactive GIS Map Preview */}
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
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src="/assets/sungai/026016200_1633163690-20211002-Pencemaran_Teluk_Jakarta_oleh_Paracetamol-1.jpg"
                    alt="Pencemaran Teluk Jakarta"
                    fill
                    className="object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <span className="block text-xs font-bold truncate">Pencemaran Teluk Jakarta</span>
                      <span className="text-[10px] text-sky-300">Jakarta Utara • Radius 500m</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-rose-500 text-white text-[10px] font-bold shadow">
                      Terverifikasi 🔴
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: GIS Status Indicator */}
              <div className="rounded-2xl bg-white p-3.5 shadow-xl border border-sky-100 transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-1.5 mb-2.5 text-[#0F172A] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                  <span>Status GIS Palette</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">Pending 🟠</span>
                    <span className="text-slate-500">Warga</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-blue-50 border border-blue-100">
                    <span className="font-semibold text-blue-900">Diproses 🔵</span>
                    <span className="text-blue-700">Dinas DLH</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="font-semibold text-emerald-900">Selesai 🟢</span>
                    <span className="text-emerald-700">Closed-Loop</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Geofencing & Anti-Spam */}
              <div className="rounded-2xl bg-white p-3.5 shadow-xl border border-sky-100 transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-1.5 mb-2 text-[#0F172A] text-xs font-bold">
                  <Navigation className="w-4 h-4 text-[#0284C7]" />
                  <span>Smart Geofencing</span>
                </div>
                <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2">
                  <Image
                    src="/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg"
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
                    Kalkulasi Rumus W = U + (α × S)
                  </span>
                  <span className="text-[11px] text-sky-100/90 block mt-0.5">
                    Otomatis eskalasi status ke Dinas DLH
                  </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* EXISTING ECOSYSTEM OVERVIEW & FEATURE CARDS                  */}
        {/* ============================================================ */}
        <div className="pt-10 border-t border-sky-100/80">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-sky-200 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              Ekosistem RIVERSE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Tata Kelola Pencemaran Sungai Berbasis <br className="hidden sm:block" />
              <span className="text-[#0284C7]">Partisipasi Publik & Akuntabilitas Dinas</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Menghubungkan laporan masyarakat langsung dengan unit kerja Dinas Lingkungan Hidup (DLH) melalui pemetaan GIS presisi dan transparansi closed-loop.
            </p>
          </div>

          {/* Status Palette Legend Card */}
          <div className="mb-16 p-6 rounded-3xl bg-white border border-sky-100/80 shadow-md shadow-sky-950/5 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 text-center sm:text-left">
              Indikator Status Penanda GIS (GIS Status Palette)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Pending */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-[#F97316] ring-4 ring-[#F97316]/20 flex-shrink-0 animate-pulse" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Pending 🟠</span>
                  <span className="text-[11px] text-slate-500">Menunggu verifikasi warga</span>
                </div>
              </div>

              {/* Terverifikasi */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-[#EF4444] ring-4 ring-[#EF4444]/20 flex-shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Terverifikasi 🔴</span>
                  <span className="text-[11px] text-slate-500">Prioritas utama DLH</span>
                </div>
              </div>

              {/* Diproses */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-[#3B82F6] ring-4 ring-[#3B82F6]/20 flex-shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Diproses 🔵</span>
                  <span className="text-[11px] text-slate-500">Penanganan di lapangan</span>
                </div>
              </div>

              {/* Selesai */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-[#22C55E] ring-4 ring-[#22C55E]/20 flex-shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Selesai 🟢</span>
                  <span className="text-[11px] text-slate-500">Bukti Before vs After</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-3xl p-7 bg-white border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  Smart Geofencing & Anti-Spam (&lt;500m)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deteksi otomatis radius 500 meter untuk mengelompokkan laporan sejenis. Mencegah duplikasi data dan memperkuat bobot urgensi titik pencemaran.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                <span>Deteksi Presisi PostGIS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-3xl p-7 bg-white border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-[#0284C7] group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  Eskalasi Verifikasi Komunitas
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Logika otomatis mengkalkulasi upvote warga dan sub-laporan kategori pembeda. Laporan otomatis naik status ke Terverifikasi setelah mencapai threshold.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                <span>Rumus W = U + (α × S)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-3xl p-7 bg-white border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  Closed-Loop Before vs After DLH
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparansi penuh di mana petugas DLH mengunggah bukti hasil pembersihan nyata di lokasi sungai sebelum laporan ditutup secara permanen.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                <span>Akuntabilitas Publik</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
