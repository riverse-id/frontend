import React from "react";
import ScrollIntroHero from "./components/ScrollIntroHero";
import FeaturesOverview from "./components/FeaturesOverview";
import AboutSection from "./components/AboutSection";
import Image from "next/image";
import { MapPin, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#0284C7] selection:text-white">
      {/* Animated Scroll Intro & Portal Hero Sequence */}
      <ScrollIntroHero />

      {/* Main Ecosystem Features & Design System Showcase */}
      <FeaturesOverview />

      {/* About Us & Mission Section */}
      <AboutSection />

      {/* Interactive Map CTA Banner */}
      <section id="peta-gis" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0284C7] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/30 border border-sky-400/40 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Sistem Informasi Geografis Real-Time
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Jelajahi Peta Kondisi Sungai <br />
              <span className="text-[#38BDF8]">Di Wilayah Anda Hari Ini</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-sky-100/90 leading-relaxed">
              Pantau titik ketercemaran, berikan dukungan upvote pada laporan terdekat, atau unggah laporan pencemaran sungai baru secara presisi dengan smart geofencing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a
              href="#peta-gis"
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white font-bold text-sm shadow-xl shadow-[#0284C7]/30 hover:brightness-110 transition-all hover:scale-105 active:scale-95"
            >
              <MapPin className="w-5 h-5 text-white" />
              <span>Buka Peta GIS</span>
            </a>
            <a
              href="#dashboard-dlh"
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 text-sky-300" />
              <span>Portal Dinas DLH</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 p-1 flex items-center justify-center">
              <Image
                src="/assets/logo.png"
                alt="RIVERSE Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-white font-bold tracking-tight text-lg">RIVER<span className="text-[#38BDF8]">SE</span></span>
              <p className="text-[11px] text-slate-400">Crowdsourced River Monitoring & DLH Governance Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <a href="#peta-gis" className="hover:text-white transition-colors">Peta GIS</a>
            <a href="#laporan" className="hover:text-white transition-colors">Laporan Warga</a>
            <a href="#dashboard-dlh" className="hover:text-white transition-colors">Portal DLH</a>
            <a href="#privasi" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>Palette Token:</span>
            <span className="text-[#38BDF8] font-semibold">#0F172A • #0284C7 • #E0F2FE</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
