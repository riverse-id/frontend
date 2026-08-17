"use client";

import { useEffect } from "react";

// Memastikan mode terang selalu aktif di halaman publik
export default function ForceLightMode() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return null;
}

