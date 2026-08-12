"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function CursorGlow() {
  const pathname = usePathname();
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  // Nonaktifkan efek shadow kursor pada halaman dashboard dinas
  const isDashboard = pathname?.startsWith("/dinas");

  useEffect(() => {
    if (isDashboard) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isDashboard]);

  if (isDashboard || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* Soft Blue Shadow Glow attached directly behind the cursor pointer */}
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {/* Outer Soft Blue Aura */}
        <div className="w-16 h-16 rounded-full bg-[#0284C7]/30 blur-xl" />
        {/* Inner Bright Sky Glow Center */}
        <div className="absolute inset-2 rounded-full bg-sky-400/40 blur-md" />
      </div>
    </div>
  );
}
