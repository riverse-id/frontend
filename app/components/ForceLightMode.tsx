"use client";

import { useEffect } from "react";

// Memaksa halaman landing selalu mode terang.
// Saat unmount, tema dikembalikan sesuai preferensi tersimpan user.
export default function ForceLightMode() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark");
    window.dispatchEvent(
      new CustomEvent("riverse_theme_changed", { detail: { mode: "light" } })
    );

    return () => {
      try {
        const saved = localStorage.getItem("riverse_theme");
        let mode: "dark" | "light" = "light";
        if (saved === "dark") {
          html.classList.add("dark");
          mode = "dark";
        } else if (saved === "light") {
          html.classList.remove("dark");
          mode = "light";
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          html.classList.add("dark");
          mode = "dark";
        }
        window.dispatchEvent(
          new CustomEvent("riverse_theme_changed", { detail: { mode } })
        );
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  return null;
}
