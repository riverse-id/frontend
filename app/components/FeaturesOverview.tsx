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

export default function FeaturesOverview() {
  return (
    <section id="beranda" className="relative bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* ============================================================ */}
        {/* HERO SHOWCASE SECTION (Beranda Hero)                          */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Bold Blue Headline, Copywriting, CTA Button */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0284C7] leading-[1.12] tracking-tight">
              Laporkan & Pantau <br />
              Sungai dalam <br />
              5 Menit!
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-xl">
              Tingkatkan kepedulian lingkungan dan raih penanganan sungai lebih cepat dengan platform GIS profesional. Sistem verifikasi komunitas & geofencing presisi membuat laporan warga terpercaya dan siap direspons langsung oleh Dinas Lingkungan Hidup. Wujudkan aksi nyata penyelamatan sungai hanya dengan satu langkah mudah.
            </p>

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
                    src="/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg"
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
                    src="/assets/sungai/20200812-Sungai-Ciliwung-1_ratio-16x9.jpg"
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
      </div>
    </section>
  );
}
