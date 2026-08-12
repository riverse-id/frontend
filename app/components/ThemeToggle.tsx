"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("riverse_theme", next ? "dark" : "light");
    } catch (e) {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent("riverse_theme_changed", { detail: { mode: next ? "dark" : "light" } })
    );
  };

  return (
    <button
      onClick={toggle}
      aria-label="Ganti Tema"
      title="Ganti Tema Terang / Gelap"
      className={`inline-flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${className}`}
    >
      <Sun className="w-4 h-4 dark:hidden" />
      <Moon className="w-4 h-4 hidden dark:block" />
    </button>
  );
}
