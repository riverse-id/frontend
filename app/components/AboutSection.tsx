"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Waves, Users, MapPin } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="tentang-kami" className="relative bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] pt-0 pb-24 border-t border-sky-100 overflow-hidden">
      
      {/* ============================================================ */}
      {/* TOP BANNER: Blue Topographic Wave Gradient Header             */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* TOP BANNER: Blue Topographic Wave Gradient Header             */}
      {/* ============================================================ */}
      <div className="relative bg-gradient-to-br from-[#0284C7] via-[#0284C7] to-[#0F172A] text-white overflow-hidden">
        
        {/* Top Fade Transition (Multi-Stop easing gradient, smooth melt without hard cut) */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none z-[5] blur-[1px]" />

        {/* Ambient Radial Glow */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.5),transparent_60%)]" />

        {/* Dual-Layer Parallax Flowing River Waves (Full Bleed Edge-to-Edge) */}
        <motion.div
          animate={{ backgroundPositionX: ["0px", "-220px"] }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
          className="absolute inset-0 pointer-events-none opacity-100 z-0"
          style={{
            backgroundImage: "url('/wave-a.svg')",
            backgroundSize: "220px 110px",
            backgroundRepeat: "repeat",
          }}
        />

        <motion.div
          animate={{ backgroundPositionX: ["0px", "180px"] }}
          transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
          className="absolute inset-0 pointer-events-none opacity-100 z-0"
          style={{
            backgroundImage: "url('/wave-b.svg')",
            backgroundSize: "180px 90px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Content Wrapper Layer */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-28 pb-40 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-sky-100 text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            Tentang Kami
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Mewujudkan Sungai Indonesia <br className="hidden sm:block" />
            <span className="text-[#38BDF8]">Bersih, Transparan & Berkelanjutan</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-2xl mx-auto font-medium">
            Buka potensi penuh pemantauan sungai presisi berbasis GIS dan partisipasi masyarakat untuk memadukan kemudahan pelaporan warga dengan respon cepat Dinas Lingkungan Hidup.
          </p>
        </div>

        {/* Bottom Gentle Landai River Wave Shape Divider */}
        <svg
          className="absolute bottom-0 left-0 w-full h-16 sm:h-20 text-white z-[1] pointer-events-none"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C360,110 1080,10 1440,60 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>

        {/* Bottom Easing Fade Gradient Overlay */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-[#0284C7]/20 to-white pointer-events-none z-[2]" />
      </div>

      {/* ============================================================ */}
      {/* FLOATING MEDIA CARDS (Overlapping Header into Content)       */}
      {/* ============================================================ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 sm:-mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-end">
          
          {/* Card 1: Tall Portrait */}
          <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-all duration-300 group">
            <Image
              src="/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg"
              alt="Pencemaran Pesisir"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="block text-xs font-bold truncate">Pencemaran Pesisir</span>
              <span className="text-[10px] text-sky-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#38BDF8]" /> Jakarta Utara
              </span>
            </div>
          </div>

          {/* Card 2: Medium Square */}
          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-all duration-300 group">
            <Image
              src="/assets/sungai/20200812-Sungai-Ciliwung-1_ratio-16x9.jpg"
              alt="Sungai Ciliwung"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="block text-xs font-bold truncate">Sungai Ciliwung</span>
              <span className="text-[10px] text-sky-200 flex items-center gap-1 mt-0.5">
                <Users className="w-3 h-3 text-[#38BDF8]" /> Laporan Warga
              </span>
            </div>
          </div>

          {/* Card 3: Tall Portrait */}
          <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-all duration-300 group">
            <Image
              src="/assets/sungai/sungai ciliwung bening.jpg"
              alt="Pembersihan Hilir"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="block text-xs font-bold truncate">Pembersihan Hilir</span>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Aksi DLH Selesai
              </span>
            </div>
          </div>

          {/* Card 4: Medium Square */}
          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-all duration-300 group">
            <Image
              src="/assets/sungai/antarafoto-bantaran-sungai-penuh-sampah-230624-adm-1.jpg"
              alt="Bantaran Sungai"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="block text-xs font-bold truncate">Bantaran Sungai</span>
              <span className="text-[10px] text-sky-200 flex items-center gap-1 mt-0.5">
                <Waves className="w-3 h-3 text-[#38BDF8]" /> Monitoring GIS
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* MIDDLE SECTION: Solusi & 2-Column Paragraph Grid              */}
      {/* ============================================================ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl mb-8">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Solusi Digital untuk Pertumbuhan & Kelestarian Sungai Kita
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Menghadapi ketercemaran sungai di Indonesia adalah tantangan nyata. Penumpukan sampah plastik, limbah industri yang tidak terdeteksi, dan keterbatasan pengawasan langsung oleh dinas menjadi kendala utama di berbagai wilayah aliran sungai.
          </p>
          <p>
            <strong className="text-[#0284C7] font-semibold">RIVERSE</strong> hadir sebagai jawaban atas tantangan tersebut. Kami menyediakan platform terintegrasi berbasis Sistem Informasi Geografis (GIS) yang menghubungkan partisipasi masyarakat secara langsung dengan respon cepat Dinas Lingkungan Hidup (DLH).
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM SECTION: 2-Column (Image Left, Mission Text Right)    */}
      {/* ============================================================ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/40">
          
          {/* Image Left */}
          <div className="md:col-span-5 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-lg border border-sky-100">
            <Image
              src="/assets/sungai/Potret Lautan Sampah di Teluk Jakarta.jpeg"
              alt="Tim Pemantau Sungai"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
          </div>

          {/* Text Right */}
          <div className="md:col-span-7 space-y-4">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-snug">
              Kami Mempercepat Transformasi Tata Kelola Sungai Indonesia
            </h4>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Kami percaya pada kekuatan transformatif kolaborasi publik dan transparansi data GIS untuk menjaga ekosistem sungai. Misi kami adalah mengakselerasi penanganan pencemaran sungai secara adil, responsif, dan berkelanjutan dari hilir hingga hulu.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
