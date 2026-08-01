import React from "react";
import ScrollIntroHero from "./components/ScrollIntroHero";
import FeaturesOverview from "./components/FeaturesOverview";
import AboutSection from "./components/AboutSection";
import EcosystemSection from "./components/EcosystemSection";
import PartnerSection from "./components/PartnerSection";
import ContactSection from "./components/ContactSection";
import Image from "next/image";
import { ArrowRight, MapPin, ShieldCheck, Mail } from "lucide-react";
import Footer from "./components/Footer";

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

      {/* 7. CTA Ajakan Lapor Sekarang */}
      <section id="lapor-cta" className="py-16 sm:py-20 bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] relative overflow-hidden">
        {/* Top & Bottom Gradient Fades for Seamless Section Transition */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-br from-sky-50 via-[#F0F9FF] to-sky-100/70 p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl shadow-sky-100/60 border border-sky-200/90 relative overflow-hidden">
            
            {/* Background Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
                Lihat Pencemaran Sungai? <br className="hidden sm:block" />
                <span className="text-[#0284C7]">Laporkan Sekarang!</span>
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                Bantu jaga kelestarian sungai di wilayah Anda. Unggah lokasi presisi & foto untuk penanganan cepat oleh tim DLH dan komunitas.
              </p>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto relative z-10">
              <a
                href="/lapor"
                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-full bg-[#0284C7] text-white font-extrabold text-base shadow-xl shadow-[#0284C7]/25 hover:bg-[#0369A1] transition-all hover:scale-105 active:scale-95 gap-2.5"
              >
                <span>Lapor Sekarang</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
      <Footer />
    </main>
  );
}
