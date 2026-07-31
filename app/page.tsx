import React from "react";
import ScrollIntroHero from "./components/ScrollIntroHero";
import FeaturesOverview from "./components/FeaturesOverview";
import AboutSection from "./components/AboutSection";
import EcosystemSection from "./components/EcosystemSection";
import PartnerSection from "./components/PartnerSection";
import ContactSection from "./components/ContactSection";
import Image from "next/image";
import { MapPin, ShieldCheck, Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#0284C7] selection:text-white">
      {/* 1. Animated Scroll Intro & Portal Hero Sequence */}
      <ScrollIntroHero />

      {/* 2. Beranda Hero Showcase ("Laporkan & Pantau Sungai dalam 5 Menit!") */}
      <FeaturesOverview />

      {/* 3. About Us & Mission Section ("Tentang Kami") */}
      <AboutSection />

      {/* 4. Ecosystem Governance Section ("Ekosistem RIVERSE") */}
      <EcosystemSection />

      {/* 5. Infinite Marquee Partner Section ("Partner") */}
      <PartnerSection />

      {/* 6. Contact & Emergency Callout Section ("Kontak") */}
      <ContactSection />

      {/* 7. Interactive Map CTA Banner */}
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
              href="/lapor"
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white font-bold text-sm shadow-xl shadow-[#0284C7]/30 hover:brightness-110 transition-all hover:scale-105 active:scale-95"
            >
              <MapPin className="w-5 h-5 text-white" />
              <span>Buka Peta GIS</span>
            </a>
            <a
              href="/lapor"
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 text-sky-300" />
              <span>Buat Laporan Warga</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
      <footer className="bg-[#0F172A] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                <Image
                  src="/assets/logo.png"
                  alt="RIVERSE Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-white font-extrabold tracking-tight text-xl">RIVER<span className="text-[#38BDF8]">SE</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform Pemantauan & Pelaporan Sungai Crowdsourced Terintegrasi Sistem Informasi Geografis (GIS) dan Portal Penanganan Dinas Lingkungan Hidup.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Navigasi Halaman</span>
            <div className="flex flex-col gap-2 text-xs">
              <a href="#beranda" className="hover:text-white transition-colors">Beranda</a>
              <a href="#tentang-kami" className="hover:text-white transition-colors">Tentang Kami</a>
              <a href="#ekosistem" className="hover:text-white transition-colors">Ekosistem Tata Kelola</a>
              <a href="#partner" className="hover:text-white transition-colors">Partner & Kolaborasi</a>
              <a href="#kontak" className="hover:text-white transition-colors">Kontak & Layanan Pengaduan</a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Hubungi Kami</span>
            <p className="text-xs text-slate-400">Tim Pengembang RIVERSE — Lomba Inovasi Sistem GIS</p>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <Mail className="w-4 h-4" />
              <span>kontak@riverse.id</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>&copy; {new Date().getFullYear()} RIVERSE System. Hak Cipta Dilindungi Undang-Undang.</span>
          <div className="flex items-center gap-4">
            <a href="#beranda" className="hover:text-slate-300">Kembali ke Atas</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
