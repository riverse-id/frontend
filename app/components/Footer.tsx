/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 p-1 flex items-center justify-center">
              <Image
                src="/assets/logo-putih.png"
                alt="RIVERSE Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-white font-extrabold tracking-tight text-xl">
              RIVERSE
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Platform Pemantauan & Pelaporan Sungai Crowdsourced Terintegrasi Sistem Informasi Geografis (GIS) dan Portal Penanganan Dinas Lingkungan Hidup.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            Navigasi Halaman
          </span>
          <div className="flex flex-col gap-2 text-xs">
            <a href="/#beranda" className="hover:text-white transition-colors">Beranda</a>
            <a href="/#tentang-kami" className="hover:text-white transition-colors">Tentang Kami</a>
            <a href="/#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
            <a href="/#partner" className="hover:text-white transition-colors">Partner & Kolaborasi</a>
            <a href="/lapor" className="hover:text-white transition-colors">Buat Laporan Warga</a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            Hubungi Kami
          </span>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
            <Mail className="w-4 h-4" />
            <span>kontak@riverse.id</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>
          &copy; {new Date().getFullYear()} RIVERSE System. Hak Cipta Dilindungi Undang-Undang.
        </span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-300">Kembali ke Atas ↑</a>
        </div>
      </div>
    </footer>
  );
}
