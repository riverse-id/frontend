"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, AlertTriangle, Trash2, CheckCircle2, Info, ArrowRight, ShieldCheck, Filter } from "lucide-react";

export interface StatusItem {
  id: "semua" | "tercemar" | "sampah" | "selesai";
  step: number;
  label: string;
  emoji?: string;
  badge: string;
  sublabel: string;
  description: string;
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    ring: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
  };
  icon: React.ElementType;
  weightInfo: string;
}

export const STATUS_PALETTE_ITEMS: StatusItem[] = [
  {
    id: "semua",
    step: 1,
    label: "Semua Data",
    badge: "Filter Utama",
    sublabel: "Seluruh Laporan & Segmen",
    description: "Menampilkan seluruh titik pemantauan spasial GIS, laporan aktif warga, dan status konservasi sungai secara komprehensif.",
    weightInfo: "Semua Titik GIS",
    color: {
      bg: "bg-sky-50/70 hover:bg-sky-50",
      border: "border-sky-200/90",
      text: "text-sky-950",
      accent: "bg-[#0284C7]",
      ring: "ring-sky-500/30",
      glow: "hover:shadow-sky-500/15",
      badgeBg: "bg-sky-100/80 text-sky-800 border-sky-200",
      badgeText: "text-sky-800",
    },
    icon: Layers,
  },
  {
    id: "tercemar",
    step: 2,
    label: "Tercemar",
    badge: "Prioritas DLH",
    sublabel: "Limbah Cair & Bahaya",
    description: "Segmen sungai atau laporan dengan indikasi pencemaran limbah cair industri, zat kimia, atau bau busuk menyengat.",
    weightInfo: "High Urgency",
    color: {
      bg: "bg-rose-50/70 hover:bg-rose-50",
      border: "border-rose-200/90",
      text: "text-rose-950",
      accent: "bg-rose-500",
      ring: "ring-rose-500/30",
      glow: "hover:shadow-rose-500/15",
      badgeBg: "bg-rose-100/80 text-rose-800 border-rose-200",
      badgeText: "text-rose-800",
    },
    icon: AlertTriangle,
  },
  {
    id: "sampah",
    step: 3,
    label: "Banyak Sampah",
    badge: "Timbulan Sampah",
    sublabel: "Limbah Padat & Plastik",
    description: "Penumpukan sampah rumah tangga, limbah padat, atau mikroplastik yang menumpuk di bantaran alur sungai.",
    weightInfo: "Medium Urgency",
    color: {
      bg: "bg-amber-50/70 hover:bg-amber-50",
      border: "border-amber-200/90",
      text: "text-amber-950",
      accent: "bg-amber-500",
      ring: "ring-amber-500/30",
      glow: "hover:shadow-amber-500/15",
      badgeBg: "bg-amber-100/80 text-amber-800 border-amber-200",
      badgeText: "text-amber-800",
    },
    icon: Trash2,
  },
  {
    id: "selesai",
    step: 4,
    label: "Bersih / Selesai",
    badge: "Before vs After",
    sublabel: "Segmen Normal & Clear",
    description: "Kondisi air terpantau jernih/bersih atau laporan pembersihan sungai yang telah diselesaikan oleh tim DLH.",
    weightInfo: "Resolved / Clean",
    color: {
      bg: "bg-emerald-50/70 hover:bg-emerald-50",
      border: "border-emerald-200/90",
      text: "text-emerald-950",
      accent: "bg-emerald-500",
      ring: "ring-emerald-500/30",
      glow: "hover:shadow-emerald-500/15",
      badgeBg: "bg-emerald-100/80 text-emerald-800 border-emerald-200",
      badgeText: "text-emerald-800",
    },
    icon: CheckCircle2,
  },
];

export default function GisStatusPalette() {
  const [selectedStatus, setSelectedStatus] = useState<StatusItem>(STATUS_PALETTE_ITEMS[0]);

  return (
    <div className="w-full rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-rose-500 via-amber-500 to-emerald-500 opacity-90" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200/80">
              <ShieldCheck className="w-3 h-3 text-sky-600" /> Standar GIS Riverse
            </span>
            <span className="text-xs font-semibold text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-500">Live Status Legend</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Indikator Status Penanda GIS
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">(GIS Status Palette)</span>
          </h3>
        </div>

        {/* Pill-style Filter Quick Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/60 overflow-x-auto self-start sm:self-auto shadow-inner">
          {STATUS_PALETTE_ITEMS.map((item) => {
            const isSelected = selectedStatus.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedStatus(item)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#0284C7] text-white shadow-md ring-2 ring-[#0284C7]/20 scale-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 4 Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATUS_PALETTE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedStatus.id === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStatus(item)}
              className={`cursor-pointer group relative p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 ${item.color.bg} ${item.color.border} ${item.color.glow} ${
                isSelected
                  ? `ring-2 ${item.color.ring} shadow-md bg-white border-transparent`
                  : "shadow-xs hover:shadow-md"
              }`}
            >
              {/* Top Card Row: Status Badge & Step Indicator */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border ${item.color.badgeBg}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] font-mono font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                  {item.weightInfo}
                </span>
              </div>

              {/* Icon & Label with Animated Radar Beacon */}
              <div className="flex items-center gap-3 mb-2.5">
                {/* Glowing Radar Pulse Indicator */}
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200/80 flex-shrink-0">
                  {/* Radar ping animation layer */}
                  <span className={`absolute inset-0 rounded-xl ${item.color.accent} opacity-35 animate-ping`} />
                  {/* Middle ring */}
                  <span className={`absolute inset-1 rounded-lg ${item.color.accent} opacity-20`} />
                  {/* Center Dot or Icon */}
                  <span className={`w-4 h-4 rounded-full ${item.color.accent} ring-2 ring-white flex items-center justify-center text-white z-10 shadow-xs`}>
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-sm font-extrabold ${item.color.text} tracking-tight`}>
                      {item.label}
                    </h4>
                    {item.emoji && <span className="text-xs">{item.emoji}</span>}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-tight">
                    {item.sublabel}
                  </p>
                </div>
              </div>

              {/* Bottom Subtle Interactive Cue */}
              <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="group-hover:text-slate-800 transition-colors flex items-center gap-1">
                  <Icon className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                  Detail Kategori
                </span>
                <ArrowRight className={`w-3 h-3 transition-transform duration-200 ${isSelected ? "translate-x-1 text-slate-700" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Status Animated Detail Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStatus.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={`p-4 rounded-2xl border ${selectedStatus.color.bg} ${selectedStatus.color.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-white shadow-xs border ${selectedStatus.color.border} text-slate-700 flex-shrink-0 mt-0.5 sm:mt-0`}>
              {React.createElement(selectedStatus.icon, { className: "w-5 h-5" })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detail Indikator Kategori:
                </span>
                <span className={`text-xs font-extrabold ${selectedStatus.color.text}`}>
                  {selectedStatus.label} {selectedStatus.emoji || "🌐"}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                {selectedStatus.description}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 self-end sm:self-center">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border ${selectedStatus.color.badgeBg}`}>
              Status Penanda GIS
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
