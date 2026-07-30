"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { ChevronDown, MapPin, Waves, Sparkles, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";

const RIVER_CARDS = [
  {
    id: 1,
    src: "/assets/sungai/026016200_1633163690-20211002-Pencemaran_Teluk_Jakarta_oleh_Paracetamol-1.jpg",
    title: "Pencemaran Teluk Jakarta",
    location: "Jakarta Utara",
    tag: "Terverifikasi DLH",
    tagBg: "bg-red-500/90 text-white",
    startX: -220,
    endX: -540,
    startY: -140,
    endY: -320,
    rotate: -12,
  },
  {
    id: 2,
    src: "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg",
    title: "Penumpukan Sampah Plastik",
    location: "Sungai Ciliwung",
    tag: "Diproses DLH",
    tagBg: "bg-sky-500/90 text-white",
    startX: 220,
    endX: 540,
    startY: -150,
    endY: -330,
    rotate: 12,
  },
  {
    id: 3,
    src: "/assets/sungai/Potret Lautan Sampah di Teluk Jakarta.jpeg",
    title: "Pesisir Muara Sungai",
    location: "Kawasan Estuari",
    tag: "Investigasi",
    tagBg: "bg-amber-500/90 text-white",
    startX: -280,
    endX: -620,
    startY: 60,
    endY: 120,
    rotate: -15,
  },
  {
    id: 4,
    src: "/assets/sungai/antarafoto-bantaran-sungai-penuh-sampah-230624-adm-1.jpg",
    title: "Bantaran Sungai Penuh Sampah",
    location: "Jakarta Timur",
    tag: "Laporan Warga",
    tagBg: "bg-rose-500/90 text-white",
    startX: 280,
    endX: 620,
    startY: 70,
    endY: 130,
    rotate: 11,
  },
  {
    id: 5,
    src: "/assets/sungai/pencemaran-teluk-jakarta-9r95-dom.jpg",
    title: "Pembersihan Area Hilir",
    location: "Teluk Jakarta",
    tag: "Selesai Penanganan",
    tagBg: "bg-emerald-500/90 text-white",
    startX: -160,
    endX: -380,
    startY: 200,
    endY: 360,
    rotate: 7,
  },
  {
    id: 6,
    src: "/assets/sungai/Rivers of waste_ Pakistan's recyclers go out on patrol – in pictures.jpeg",
    title: "Patroli Pemantauan Sungai",
    location: "Tim Pelapor Warga",
    tag: "Monitoring GIS",
    tagBg: "bg-[#0284C7]/90 text-white",
    startX: 160,
    endX: 380,
    startY: 210,
    endY: 370,
    rotate: -9,
  },
];

interface RiverCardItemProps {
  card: (typeof RIVER_CARDS)[0];
  cardDispersionProgress: MotionValue<number>;
  cardScale: MotionValue<number>;
  cardOpacity: MotionValue<number>;
}

const RiverCardItem = React.memo(function RiverCardItem({
  card,
  cardDispersionProgress,
  cardScale,
  cardOpacity,
}: RiverCardItemProps) {
  // Disperse cards outwards strictly around outer perimeter to leave center clear
  const cardX = useTransform(cardDispersionProgress, [0, 1], [card.startX, card.endX]);
  const cardY = useTransform(cardDispersionProgress, [0, 1], [card.startY, card.endY]);
  const cardRotate = useTransform(cardDispersionProgress, [0, 1], [0, card.rotate]);

  return (
    <motion.div
      style={{
        x: cardX,
        y: cardY,
        rotate: cardRotate,
        scale: cardScale,
        opacity: cardOpacity,
      }}
      className="absolute w-52 sm:w-60 md:w-68 rounded-2xl overflow-hidden bg-white/90 p-2 shadow-2xl border border-sky-200/80 backdrop-blur-xl pointer-events-auto hover:scale-105 hover:z-40 transition-all duration-300 will-change-transform"
    >
      <div className="relative h-32 sm:h-38 md:h-44 w-full rounded-xl overflow-hidden group">
        <Image
          src={card.src}
          alt={card.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 220px, 280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg backdrop-blur-md border border-white/20 ${card.tagBg}`}>
            {card.tag}
          </span>
        </div>

        {/* Title & Location */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex flex-col max-w-[75%]">
            <span className="text-xs font-bold leading-tight drop-shadow truncate">{card.title}</span>
            <span className="flex items-center text-[10px] text-sky-200 gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#38BDF8]" />
              {card.location}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function ScrollIntroHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress 0 to 1 inside spacious container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tuned spring physics for silky smooth 60fps tracking without jerky jumps
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 28,
    restDelta: 0.001,
  });

  // --- PHASE 1: Welcome Screen (0.00 -> 0.22 Scroll) ---
  // Initial Logo scales up slightly then FADES OUT COMPLETELY so it never collides with Chapter 1 text
  const introLogoScale = useTransform(smoothProgress, [0.05, 0.20], [1, 0.8]);
  const introLogoY = useTransform(smoothProgress, [0.05, 0.20], [0, -80]);
  const introLogoOpacity = useTransform(smoothProgress, [0.10, 0.22], [1, 0]);
  const introSubtitleOpacity = useTransform(smoothProgress, [0.02, 0.16], [1, 0]);
  const scrollCueOpacity = useTransform(smoothProgress, [0.0, 0.12], [1, 0]);
  const phase1BgOpacity = useTransform(smoothProgress, [0.10, 0.24], [1, 0]);

  // --- PHASE 2: Storytelling & Floating Cards (0.20 -> 0.62 Scroll) ---
  const navbarOpacity = useTransform(smoothProgress, [0.18, 0.32], [0, 1]);
  
  // Floating cards fly out gradually in perimeter & stay visible comfortably
  const cardDispersionProgress = useTransform(smoothProgress, [0.22, 0.58], [0, 1]);
  const cardOpacity = useTransform(smoothProgress, [0.22, 0.32, 0.52, 0.64], [0, 1, 1, 0]);
  const cardScale = useTransform(smoothProgress, [0.22, 0.52, 0.64], [0.6, 1, 1.25]);

  // Chapter 1 Concept text reveals in CLEAN CENTER SPACE (Logo is 100% hidden by 0.22)
  const chapterTextOpacity = useTransform(smoothProgress, [0.26, 0.38, 0.54, 0.64], [0, 1, 1, 0]);
  const chapterTextY = useTransform(smoothProgress, [0.26, 0.38, 0.54, 0.64], [30, 0, 0, -25]);

  // --- PHASE 3: Dark Vignette Lens & Aperture Portal Flash (0.55 -> 0.88 Scroll) ---
  const darkVignetteOpacity = useTransform(smoothProgress, [0.52, 0.68, 0.90, 1.0], [0, 1, 1, 0]);
  const ambientBackgroundOpacity = useTransform(smoothProgress, [0.72, 0.92], [1, 0]);

  // White Light Aperture Circle Scaling
  const apertureScale = useTransform(smoothProgress, [0.58, 0.82, 0.94], [0.1, 4.5, 75.0]);
  const apertureOpacity = useTransform(smoothProgress, [0.55, 0.68, 0.92, 1.0], [0, 1, 1, 0]);

  // Portal message in the light
  const portalTextOpacity = useTransform(smoothProgress, [0.68, 0.78, 0.88], [0, 1, 0]);
  const portalTextScale = useTransform(smoothProgress, [0.68, 0.78, 0.88], [0.85, 1, 1.15]);

  return (
    // Extended h-[600vh] canvas container provides spacious, unhurried scroll track
    <div ref={containerRef} className="relative h-[600vh] w-full bg-[#0F172A] selection:bg-[#0284C7] selection:text-white">
      
      {/* Sticky Header Navbar */}
      <motion.div style={{ opacity: navbarOpacity }} className="pointer-events-auto z-50 fixed top-0 left-0 right-0">
        <Navbar />
      </motion.div>

      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#0F172A]">

        {/* Phase 1 Light/White Background Layer */}
        <motion.div
          style={{ opacity: phase1BgOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-sky-50 pointer-events-none z-12"
        />

        {/* Dynamic Dark Vignette Camera Lens Frame */}
        <motion.div
          style={{ opacity: darkVignetteOpacity }}
          className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_180px_100px_rgba(15,23,42,0.95)]"
        />

        {/* Ambient Dark Navy Slate Base */}
        <motion.div
          style={{ opacity: ambientBackgroundOpacity }}
          className="absolute inset-0 bg-[#0F172A] pointer-events-none z-10"
        />

        {/* Glowing Aperture Portal Circle (Zeroz Light Flash Effect) */}
        <motion.div
          style={{
            scale: apertureScale,
            opacity: apertureOpacity,
          }}
          className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-white via-[#E0F2FE] to-[#0284C7] shadow-[0_0_220px_110px_rgba(56,189,248,0.85)] blur-md pointer-events-none z-15 will-change-transform flex items-center justify-center"
        >
          {/* Inner Light Core */}
          <div className="w-[300px] h-[300px] rounded-full bg-white blur-xs opacity-90" />
        </motion.div>

        {/* 3D Dispersing River Cards Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
          {RIVER_CARDS.map((card) => (
            <RiverCardItem
              key={card.id}
              card={card}
              cardDispersionProgress={cardDispersionProgress}
              cardScale={cardScale}
              cardOpacity={cardOpacity}
            />
          ))}
        </div>

        {/* PHASE 1: Main Welcome Hero Branding (Fades OUT completely before Phase 2) */}
        <motion.div
          style={{
            scale: introLogoScale,
            y: introLogoY,
            opacity: introLogoOpacity,
          }}
          className="relative z-30 flex flex-col items-center text-center px-4 max-w-3xl will-change-transform pointer-events-none"
        >
          {/* Central Logo & Glow Aura */}
          <div className="relative mb-6">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-[#0284C7]/25 via-[#38BDF8]/35 to-sky-200/40 opacity-70 blur-3xl animate-pulse" />
            <div className="relative h-36 w-36 md:h-48 md:w-48 flex items-center justify-center">
              <Image
                src="/assets/logo.png"
                alt="RIVERSE Logo"
                width={200}
                height={200}
                className="h-full w-full object-contain filter drop-shadow-[0_12px_30px_rgba(2,132,199,0.35)]"
                priority
              />
            </div>
          </div>

          {/* Title & Brand Tagline */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] drop-shadow-sm flex items-center gap-1">
              /RIVER<span className="text-[#0284C7]">SE</span>
            </h1>
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-sky-700 uppercase mt-1">
              Active River System ゼロズ
            </span>
          </div>

          {/* Subtitle & Info Pill */}
          <motion.div style={{ opacity: introSubtitleOpacity }} className="mt-5 flex flex-col items-center">
            <p className="text-base md:text-xl font-semibold text-slate-700 tracking-wide max-w-xl">
              Platform Monitoring & Pelaporan Sungai <span className="text-[#0284C7] font-bold">Crowdsourced</span>
            </p>
            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/30 text-sky-900 text-xs font-bold shadow-sm backdrop-blur-md">
              <Waves className="w-4 h-4 text-[#0284C7] animate-bounce" />
              <span>Scroll Ke Bawah Untuk Memulai Animasi</span>
            </div>
          </motion.div>
        </motion.div>

        {/* PHASE 2: Concept Storytelling Text (Appears on CLEAN CENTER CANVAS) */}
        <motion.div
          style={{
            opacity: chapterTextOpacity,
            y: chapterTextY,
          }}
          className="absolute z-30 flex flex-col items-center text-center px-6 pointer-events-none will-change-transform"
        >
          <h2 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight max-w-3xl leading-tight drop-shadow-md">
            Menjaga Aliran Sungai, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-sky-200 to-white">
              Menyelamatkan Masa Depan
            </span>
          </h2>
        </motion.div>

        {/* PHASE 3: Portal Aperture Center Message */}
        <motion.div
          style={{
            opacity: portalTextOpacity,
            scale: portalTextScale,
          }}
          className="absolute z-35 flex flex-col items-center text-center px-6 pointer-events-none will-change-transform"
        >
          <div className="p-3 rounded-2xl bg-white/90 shadow-2xl border border-sky-200 mb-3">
            <ShieldCheck className="w-8 h-8 text-[#0284C7]" />
          </div>
          <span className="text-2xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight drop-shadow">
            Ekosistem Terintegrasi
          </span>
          <p className="mt-2 text-xs md:text-sm font-bold text-[#0284C7] tracking-wider uppercase">
            Mari Berpartisipasi & Gunakan Sistem RIVERSE Sekarang
          </p>
        </motion.div>

        {/* Bouncing Scroll Cue Button */}
        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-35 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer"
        >
          <span className="text-[11px] font-bold text-sky-200 tracking-widest uppercase bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-sky-400/30">
            Scroll Ke Bawah
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="p-2 rounded-full bg-[#0284C7] text-white shadow-xl border border-[#0284C7]/50"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}



