"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

const PARTNER_LOGOS = [
  { name: "Kementerian LHK", src: "/assets/Logo Partner/Lambang_Kementerian_Lingkungan_Hidup_dan_Kehutanan.png" },
  { name: "PPLI", src: "/assets/Logo Partner/Logo-Prasadha-Pamunah-Limbah-Industri-PPLI.png" },
  { name: "BMKG", src: "/assets/Logo Partner/bmkg-seeklogo.png" },
  { name: "Indofood", src: "/assets/Logo Partner/indofood-seeklogo.png" },
  { name: "PAM Jaya", src: "/assets/Logo Partner/pam-jaya-logo.webp" },
  { name: "Pertamina", src: "/assets/Logo Partner/pertamina-seeklogo.png" },
  { name: "PLN", src: "/assets/Logo Partner/pln-2016-seeklogo.png" },
  { name: "Unilever", src: "/assets/Logo Partner/unilever-seeklogo.png" },
  { name: "Kementerian Kehutanan", src: "/assets/Logo Partner/kementerian-kehutanan-republik-indonesia-seeklogo_2.png" },
  { name: "Mitra Eco 1", src: "/assets/Logo Partner/1744836430483.jpeg" },
  { name: "Mitra Eco 2", src: "/assets/Logo Partner/c477faf31570b9a034a24624af14d10a.png" },
  { name: "Mitra Eco 3", src: "/assets/Logo Partner/images (1).jpeg" },
  { name: "Greenpeace", src: "/assets/Logo Partner/Greenpeace-logo.png" }
];

export default function PartnerSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Duplicate list to achieve 100% seamless infinite looping ticker
  const doublePartners = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section id="partner" className="scroll-mt-24 py-20 lg:py-28 bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] relative overflow-hidden">
      {/* Top & Bottom Gradient Fades for Seamless Section Transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mb-12"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
          Kolaborasi Strategis untuk Kelestarian Sungai
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
          Bermitra dengan instansi pemerintah, BUMN, dan komunitas lokal untuk mewujudkan ekosistem sungai yang bersih.
        </p>
      </motion.div>

      {/* Marquee Outer Track Wrapper with Fade Edge Gradient Shadows */}
      <div
        className="relative w-full overflow-hidden py-8 sm:py-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        {/* Left & Right Subtle Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        {/* Continuous Moving Marquee Track */}
        <div
          className="flex items-center gap-12 sm:gap-16 w-max"
          style={{
            animation: "partnerMarquee 36s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {doublePartners.map((partner, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`relative flex items-center justify-center transition-all duration-300 cursor-pointer w-[150px] sm:w-[180px] h-[75px] sm:h-[88px] select-none ${
                  isHovered ? "scale-108 z-30" : "opacity-85 hover:opacity-100"
                }`}
              >
                {/* Soft Subtle Blue Ambient Glow Backdrop */}
                <div
                  className={`absolute inset-2 bg-[#0284C7]/12 rounded-full blur-md pointer-events-none transition-all duration-300 ${
                    isHovered ? "opacity-100 scale-105" : "opacity-0 scale-75"
                  }`}
                />

                <Image
                  src={partner.src}
                  alt={partner.name}
                  fill
                  sizes="180px"
                  className="object-contain mix-blend-multiply transition-transform duration-300 relative z-10"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Animation Keyframes for Partner Marquee */}
      <style jsx global>{`
        @keyframes partnerMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
