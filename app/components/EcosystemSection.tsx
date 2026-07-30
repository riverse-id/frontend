"use client";

import React from "react";
import { Sparkles, Navigation, Users, FileCheck2, ArrowRight } from "lucide-react";

export default function EcosystemSection() {
  return (
    <section id="ekosistem" className="relative bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] py-20 px-4 sm:px-6 lg:px-8 border-t border-sky-100 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
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
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Menghubungkan laporan masyarakat langsung dengan unit kerja Dinas Lingkungan Hidup (DLH) melalui pemetaan GIS presisi dan transparansi closed-loop.
          </p>
        </div>

        {/* Status Palette Legend Card */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 text-center sm:text-left">
            Indikator Status Penanda GIS (GIS Status Palette)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Pending */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
              <div className="w-4 h-4 rounded-full bg-[#F97316] ring-4 ring-[#F97316]/20 flex-shrink-0 animate-pulse" />
              <div>
                <span className="block text-xs font-bold text-slate-900">Pending 🟠</span>
                <span className="text-[11px] text-slate-500 font-medium">Menunggu verifikasi warga</span>
              </div>
            </div>

            {/* Terverifikasi */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
              <div className="w-4 h-4 rounded-full bg-[#EF4444] ring-4 ring-[#EF4444]/20 flex-shrink-0" />
              <div>
                <span className="block text-xs font-bold text-slate-900">Terverifikasi 🔴</span>
                <span className="text-[11px] text-slate-500 font-medium">Prioritas utama DLH</span>
              </div>
            </div>

            {/* Diproses */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
              <div className="w-4 h-4 rounded-full bg-[#3B82F6] ring-4 ring-[#3B82F6]/20 flex-shrink-0" />
              <div>
                <span className="block text-xs font-bold text-slate-900">Diproses 🔵</span>
                <span className="text-[11px] text-slate-500 font-medium">Penanganan di lapangan</span>
              </div>
            </div>

            {/* Selesai */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-sm">
              <div className="w-4 h-4 rounded-full bg-[#22C55E] ring-4 ring-[#22C55E]/20 flex-shrink-0" />
              <div>
                <span className="block text-xs font-bold text-slate-900">Selesai 🟢</span>
                <span className="text-[11px] text-slate-500 font-medium">Bukti Before vs After</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                Smart Geofencing & Anti-Spam (&lt;500m)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Deteksi otomatis radius 500 meter untuk mengelompokkan laporan sejenis. Mencegah duplikasi data dan memperkuat bobot urgensi titik pencemaran.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
              <span>Deteksi Presisi PostGIS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                Eskalasi Verifikasi Komunitas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Logika otomatis mengkalkulasi upvote warga dan sub-laporan kategori pembeda. Laporan otomatis naik status ke Terverifikasi setelah mencapai threshold.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
              <span>Rumus W = U + (α × S)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                Closed-Loop Before vs After DLH
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
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
    </section>
  );
}
