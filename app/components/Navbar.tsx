"use client";

import React from "react";
import Image from "next/image";
import { MapPin, PlusCircle, BarChart3, ShieldCheck, Layers } from "lucide-react";

interface NavbarProps {
  opacity?: number;
  className?: string;
}

export default function Navbar({ opacity = 1, className = "" }: NavbarProps) {
  return (
    <header
      style={{ opacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between rounded-2xl bg-white/85 backdrop-blur-md px-5 py-3 shadow-lg shadow-[#0284C7]/10 border border-[#E0F2FE]">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0F172A] p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/logo.png"
                alt="RIVERSE Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain filter drop-shadow"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-[#0F172A]">
                RIVER<span className="text-[#0284C7]">SE</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide text-sky-700 uppercase -mt-1">
                River Monitoring GIS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#E0F2FE]/50 p-1.5 rounded-xl border border-sky-200/60">
            <a
              href="#peta-gis"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0284C7] bg-white shadow-sm transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
              Peta GIS
            </a>
            <a
              href="#laporan"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-white hover:shadow-sm transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              Laporan Warga
            </a>
            <a
              href="#statistik"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-white hover:shadow-sm transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-500" />
              Statistik
            </a>
            <a
              href="#dashboard-dlh"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-white hover:shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
              Portal DLH
            </a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <a
              href="#buat-laporan"
              className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white text-xs font-semibold shadow-md shadow-[#0284C7]/25 hover:shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Laporan</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
