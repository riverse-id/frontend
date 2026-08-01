"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ShieldCheck, Waves, Users, MapPin } from "lucide-react";

export default function AboutSection() {
  const tiltCardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-9deg", "9deg"]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltCardRef.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleCardMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <section id="tentang-kami" className="relative bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] pt-0 pb-24 overflow-hidden">
      
      {/* ============================================================ */}
      {/* TOP BANNER: Solid Blue Topographic Header (No Dark Gradient)  */}
      {/* ============================================================ */}
      <div className="relative bg-[#0284C7] text-white overflow-hidden">
        
        {/* Top 5-Stop Smooth Fade Gradient Overlay */}
        <div
          className="absolute top-0 inset-x-0 h-64 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, white 0%, rgba(255,255,255,0.7) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.05) 75%, transparent 100%)'
          }}
        />

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
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-32 pb-40 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Mewujudkan Sungai Indonesia <br className="hidden sm:block" />
            <span className="text-white drop-shadow-sm">Bersih, Transparan & Berkelanjutan</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-2xl mx-auto font-medium">
            Kombinasi sistem GIS presisi dan partisipasi masyarakat untuk menghubungkan laporan warga secara langsung dengan respon cepat Dinas Lingkungan Hidup.
          </p>
        </div>

        {/* Landai 2-Curve River Wave Shape Divider */}
        <svg
          className="absolute -bottom-1 left-0 w-full h-20 sm:h-28 z-[1] pointer-events-none"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
        >
          <path
            d="M0,90 C240,120 480,60 720,80 C960,100 1200,50 1440,85 L1440,150 L0,150 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* FLOATING MEDIA CARDS (Overlapping Header into Content)       */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 sm:-mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-end">
          
          {/* Card 1: Tall Portrait */}
          <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-all duration-300 group">
            <Image
              src="/assets/sungai/026016200_1633163690-20211002-Pencemaran_Teluk_Jakarta_oleh_Paracetamol-1.jpg"
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
              src="/assets/sungai/pencemaran-teluk-jakarta-9r95-dom.jpg"
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
              src="/assets/sungai/_ (1).jpeg"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl mb-8">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Solusi Digital untuk Perlindungan & Kelestarian Sungai Kita
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
      {/* BOTTOM SECTION: 2-Column 3D Interactive Tilt Card            */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 perspective-[1000px]">
        <motion.div
          ref={tiltCardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-[#0284C7]/20 hover:border-sky-400/60 transition-shadow duration-300 cursor-pointer"
        >
          {/* Image Left */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="md:col-span-5 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-lg border border-sky-100 transition-transform duration-300"
          >
            <Image
              src="/assets/sungai/Potret Lautan Sampah di Teluk Jakarta.jpeg"
              alt="Tim Pemantau Sungai"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
          </div>

          {/* Text Right */}
          <div
            style={{ transform: "translateZ(25px)" }}
            className="md:col-span-7 space-y-4 transition-transform duration-300"
          >
            <h4 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-snug">
              Kami Mempercepat Transformasi Tata Kelola Sungai Indonesia
            </h4>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Kami percaya pada kekuatan transformatif kolaborasi publik dan transparansi data GIS untuk menjaga ekosistem sungai. Misi kami adalah mengakselerasi penanganan pencemaran sungai secara adil, responsif, dan berkelanjutan dari hulu ke hilir.
            </p>
          </div>

        </motion.div>
      </div>

    </section>
  );
}
