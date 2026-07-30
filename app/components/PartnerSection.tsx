"use client";

import React, { useState } from "react";
import { Handshake } from "lucide-react";

const PARTNERS = [
  { name: "Dinas LH DKI", role: "Integrasi Eskalasi Official", badge: "DLH" },
  { name: "PostGIS Spasial", role: "Spatial Indexing Database", badge: "GIS" },
  { name: "Komunitas Ciliwung", role: "Relawan Verifikasi Lapangan", badge: "NGO" },
  { name: "EcoGIS Indonesia", role: "Peta Topografi Precision", badge: "MAP" },
  { name: "Kementerian LHK", role: "Pengawasan Mutu Air", badge: "GOV" },
  { name: "BMKG Hydro", role: "Sensor Telemetri Hujan", badge: "IOT" },
  { name: "UNICEF Indonesia", role: "Sanitasi Pemukiman Sungai", badge: "ORG" },
  { name: "Clean Rivers ID", role: "Teknologi Filter Limbah", badge: "ECO" },
];

export default function PartnerSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Duplicate list to achieve 100% seamless infinite looping ticker
  const doublePartners = [...PARTNERS, ...PARTNERS];

  return (
    <section id="partner" className="py-20 bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] border-t border-sky-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/10 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-4 border border-[#0284C7]/20">
          <Handshake className="w-4 h-4" /> Partner & Kolaborasi Institusi
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Dipercaya Oleh Instansi Lingkungan & Komunitas Sungai
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
          Terhubung langsung dengan Dinas Lingkungan Hidup (DLH), komunitas peduli sungai, dan penyedia peta GIS profesional.
        </p>
      </div>

      {/* Marquee Outer Track Wrapper with Fade Edge Gradient Shadows */}
      <div
        className="relative w-full overflow-hidden py-4"
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
          className="flex gap-6 w-max"
          style={{
            animation: "partnerMarquee 28s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {doublePartners.map((partner, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`flex flex-col items-center justify-center px-8 py-5 rounded-2xl border transition-all duration-300 cursor-pointer min-w-[240px] select-none ${
                  isHovered
                    ? "bg-white border-[#0284C7] shadow-xl shadow-[#0284C7]/20 scale-105 -translate-y-1 z-30 ring-2 ring-[#0284C7]/30"
                    : "bg-slate-50/90 border-slate-200/80 shadow-sm hover:border-sky-300 opacity-90"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                      isHovered ? "bg-[#0284C7] text-white" : "bg-sky-100 text-[#0284C7]"
                    }`}
                  >
                    {partner.badge}
                  </div>
                  <span className="font-extrabold text-base text-slate-800 tracking-tight">
                    {partner.name}
                  </span>
                </div>
                <span className="text-xs text-sky-600 font-semibold mt-1.5">
                  {partner.role}
                </span>
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
