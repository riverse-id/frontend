"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Accessibility,
  X,
  Type,
  Minus,
  Plus,
  Contrast,
  Palette,
  Eye,
  Highlighter,
  Underline,
  AlignLeft,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface A11ySettings {
  textSize: number; // 0 | 1 | 2
  highContrast: boolean;
  grayscale: boolean;
  invert: boolean;
  readableFont: boolean;
  underlineLinks: boolean;
  letterSpacing: boolean;
  reduceMotion: boolean;
}

const DEFAULTS: A11ySettings = {
  textSize: 0,
  highContrast: false,
  grayscale: false,
  invert: false,
  readableFont: false,
  underlineLinks: false,
  letterSpacing: false,
  reduceMotion: false,
};

const ZOOM_LEVELS = ["100%", "112%", "125%"];

const BTN_W = 48;
const BTN_H = 48;
const PANEL_W = 288;

interface DragPos {
  x: number;
  y: number;
}

function loadPosition(): DragPos | null {
  if (typeof window === "undefined") return null;
  try {
    const p = JSON.parse(localStorage.getItem("riverse_a11y_pos") || "null");
    if (p && typeof p.x === "number" && typeof p.y === "number") return p;
  } catch {
    /* ignore */
  }
  return null;
}

function defaultPosition(): DragPos {
  if (typeof window === "undefined") return { x: 20, y: 20 };
  return { x: 20, y: Math.max(20, window.innerHeight - BTN_H - 20) };
}

function loadSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULTS;
    try {
      const raw = localStorage.getItem("riverse_a11y");
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
  return DEFAULTS;
}

function ToggleRow({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
    >
      <span className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
        <Icon className="w-4 h-4 text-[#0284C7] shrink-0" />
        {label}
      </span>
      <span
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
          value ? "bg-[#0284C7]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  );
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(loadSettings);
  const [pos, setPos] = useState<DragPos | null>(loadPosition);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const lastPosRef = useRef<DragPos | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const cur = pos ?? defaultPosition();
    setDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: cur.x,
      origY: cur.y,
      moved: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
    if (!d.moved || !containerRef.current) return;
    const maxX = Math.max(PANEL_W + 8, window.innerWidth - BTN_W - 8);
    const maxY = window.innerHeight - BTN_H - 8;
    const x = Math.min(Math.max(8, d.origX + dx), maxX);
    const y = Math.min(Math.max(8, d.origY + dy), maxY);
    // Update langsung ke DOM (transform GPU) agar drag mulus tanpa re-render
    containerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    lastPosRef.current = { x, y };
  };

  const handlePointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (d?.moved) {
      // Snap otomatis ke sisi terdekat (kiri/kanan)
      const cur = lastPosRef.current ?? pos ?? defaultPosition();
      const centerX = cur.x + BTN_W / 2;
      const snapX =
        centerX < window.innerWidth / 2
          ? 8
          : window.innerWidth - BTN_W - 8;
      const snapped = { x: snapX, y: cur.y };
      setPos(snapped);
      lastPosRef.current = snapped;
      try {
        localStorage.setItem("riverse_a11y_pos", JSON.stringify(snapped));
      } catch {
        /* ignore */
      }
      return;
    }
    setOpen((o) => !o);
  };

  const effPos = pos ?? defaultPosition();
  const isRight = effPos.x + BTN_W / 2 >= (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const showPanelBelow =
    typeof window !== "undefined" && effPos.y < Math.max(340, window.innerHeight / 2);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("a11y-hc", settings.highContrast);
    el.classList.toggle("a11y-grayscale", settings.grayscale);
    el.classList.toggle("a11y-invert", settings.invert);
    el.classList.toggle("a11y-readable", settings.readableFont);
    el.classList.toggle("a11y-underline", settings.underlineLinks);
    el.classList.toggle("a11y-spacing", settings.letterSpacing);
    el.classList.toggle("a11y-motion", settings.reduceMotion);
    el.style.zoom = ZOOM_LEVELS[settings.textSize] || "100%";
    try {
      localStorage.setItem("riverse_a11y", JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const set = (patch: Partial<A11ySettings>) => setSettings((s) => ({ ...s, ...patch }));
  const resetAll = () => setSettings(DEFAULTS);

  const panel = (
    <div className="w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slideUp">
      <div className="px-4 py-3.5 bg-gradient-to-r from-sky-50 via-white to-white border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0">
            <Accessibility className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold text-slate-900 leading-tight">Aksesibilitas</h3>
            <p className="text-[10px] text-slate-500 font-medium">Bantuan untuk disabilitas</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          aria-label="Tutup Panel Aksesibilitas"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-2.5 space-y-1">
        {/* Ukuran Teks */}
        <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
          <span className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
            <Type className="w-4 h-4 text-[#0284C7] shrink-0" />
            Ukuran Teks
          </span>
          <span className="flex items-center gap-1.5">
            <button
              onClick={() => set({ textSize: Math.max(0, settings.textSize - 1) })}
              disabled={settings.textSize === 0}
              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              aria-label="Perkecil Teks"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center text-[10px] font-extrabold text-slate-600">
              {["Normal", "Besar", "Sangat Besar"][settings.textSize]}
            </span>
            <button
              onClick={() => set({ textSize: Math.min(2, settings.textSize + 1) })}
              disabled={settings.textSize === 2}
              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              aria-label="Perbesar Teks"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>

        <ToggleRow label="Kontras Tinggi" icon={Contrast} value={settings.highContrast} onChange={(v) => set({ highContrast: v })} />
        <ToggleRow label="Skala Abu-abu" icon={Palette} value={settings.grayscale} onChange={(v) => set({ grayscale: v })} />
        <ToggleRow label="Inversi Warna" icon={Eye} value={settings.invert} onChange={(v) => set({ invert: v })} />
        <ToggleRow label="Font Mudah Dibaca" icon={Highlighter} value={settings.readableFont} onChange={(v) => set({ readableFont: v })} />
        <ToggleRow label="Garis Bawah Tautan" icon={Underline} value={settings.underlineLinks} onChange={(v) => set({ underlineLinks: v })} />
        <ToggleRow label="Spasi Huruf Lebih" icon={AlignLeft} value={settings.letterSpacing} onChange={(v) => set({ letterSpacing: v })} />
        <ToggleRow label="Kurangi Animasi" icon={Sparkles} value={settings.reduceMotion} onChange={(v) => set({ reduceMotion: v })} />
      </div>

      <div className="p-3 pt-2 border-t border-slate-100">
        <button
          onClick={resetAll}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Semua Pengaturan
        </button>
      </div>
    </div>
  );

  const dragButton = (
    <button
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
      aria-label="Buka Panel Aksesibilitas"
      title="Alat Aksesibilitas (geser untuk memindahkan)"
      className="w-12 h-12 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xl shadow-sky-300/50 border border-white/40 flex items-center justify-center transition-colors hover:scale-105 active:scale-95 cursor-grab touch-none select-none"
    >
      <Accessibility className="w-6 h-6 pointer-events-none" />
    </button>
  );

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 z-[999] flex flex-col gap-3 will-change-transform ${isRight ? "items-end" : "items-start"}`}
      style={{
        transform: `translate3d(${effPos.x}px, ${effPos.y}px, 0)`,
        transition: dragging ? "none" : "transform 0.25s ease",
      }}
    >
      {showPanelBelow ? (
        <>
          {dragButton}
          {open && panel}
        </>
      ) : (
        <>
          {open && panel}
          {dragButton}
        </>
      )}
    </div>
  );
}
