"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PlusCircle } from "lucide-react";

interface NavbarProps {
  opacity?: number;
  className?: string;
}

export default function Navbar({ opacity = 1, className = "" }: NavbarProps) {
  const [activeNav, setActiveNav] = useState("beranda");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["beranda", "tentang-kami", "partner", "kontak"];
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
  }, []);

  const NAV_ITEMS = [
    { id: "beranda", label: "Beranda", href: "#beranda" },
    { id: "tentang-kami", label: "Tentang Kami", href: "#tentang-kami" },
    { id: "partner", label: "Partner", href: "#partner" },
    { id: "kontak", label: "Kontak", href: "#kontak" },
    { id: "lapor", label: "Buat Laporan", href: "/lapor", isCta: true },
  ];

  return (
    <header
      style={{ opacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Glassmorphism Floating Pill Bar Container */}
        <div className="flex items-center justify-between rounded-full bg-white/70 backdrop-blur-xl backdrop-saturate-180 px-6 py-2.5 shadow-[0_8px_32px_rgba(2,132,199,0.12)] border border-white/60 transition-all duration-300">
          
          {/* Logo & Brand */}
          <a href="#beranda" className="flex items-center gap-3 cursor-pointer group">
            <Image
              src="/assets/logo.png"
              alt="RIVERSE Logo"
              width={48}
              height={48}
              className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
                RIVER<span className="text-[#0284C7]">SE</span>
              </span>
            </div>
          </a>

          {/* Navigation Links with Glass Pill Highlight */}
          <nav className="flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              if (item.isCta) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="ml-1 px-4 py-1.5 rounded-full text-xs font-bold bg-[#0284C7] text-white hover:bg-[#0284C7]/90 shadow-md shadow-[#0284C7]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </a>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNav(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
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

        </div>
      </div>
    </header>
  );
}
