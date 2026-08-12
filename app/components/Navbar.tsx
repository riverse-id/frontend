"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LogIn, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  opacity?: number;
  className?: string;
}

export default function Navbar({ opacity = 1, className = "" }: NavbarProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [activeNav, setActiveNav] = useState("beranda");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/lapor") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveNav("lapor");
      return;
    }

    const handleScroll = () => {
      const sections = ["beranda", "tentang-kami", "cara-kerja", "partner", "kontak"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const NAV_ITEMS = [
    { id: "beranda", label: "Beranda", href: "/#beranda" },
    { id: "tentang-kami", label: "Tentang Kami", href: "/#tentang-kami" },
    { id: "cara-kerja", label: "Cara Kerja", href: "/#cara-kerja" },
    { id: "partner", label: "Partner", href: "/#partner" },
    { id: "kontak", label: "Kontak", href: "/#kontak" },
    { id: "lapor", label: "Buat Laporan", href: "/lapor" },
  ];

  return (
    <header
      style={{ opacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Glassmorphism Floating Pill Bar Container */}
        <div className="flex items-center justify-between rounded-full bg-white/75 backdrop-blur-xl backdrop-saturate-180 px-4 sm:px-6 py-2 sm:py-2.5 shadow-lg shadow-slate-900/5 border border-white/70 transition-all duration-300">
          
          {/* Logo & Brand */}
          <a href="/#beranda" className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0">
            <Image
              src="/assets/logo-new.png"
              alt="RIVERSE Logo"
              width={48}
              height={48}
              className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-ink">
                RIVERSE
              </span>
            </div>
          </a>

          {/* Uniform Navigation Links (Centered in Middle for Desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-1.5 flex-1 mx-4">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNav(item.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#0284C7]/15 text-[#0284C7] font-bold shadow-xs border border-[#0284C7]/30"
                      : "text-slate-700 hover:text-[#0284C7] hover:bg-slate-100/50"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isLanding && (
              <ThemeToggle className="bg-slate-100/80 text-slate-700 hover:text-[#0284C7] hover:bg-slate-200/80" />
            )}

            <a
              href="/dinas"
              className="flex items-center gap-2 px-4 sm:px-5.5 py-2 sm:py-2.5 rounded-full bg-[#0284C7] text-white text-xs font-bold shadow-md shadow-[#0284C7]/20 hover:bg-[#0284C7]/90 transition-all hover:scale-105 active:scale-95"
            >
              <span>Masuk</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-slate-100/80 text-slate-700 hover:text-[#0284C7] hover:bg-slate-200/80 transition-all cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Sliding Glassmorphic Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2.5 rounded-3xl bg-white/95 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl border border-white/80 flex flex-col gap-1.5 animate-slideDown">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-1 border-b border-slate-100">
              Navigasi Halaman
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-[#0284C7]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </a>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}
