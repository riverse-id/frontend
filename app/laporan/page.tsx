"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LaporanIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/lapor");
  }, [router]);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-500">Mengarahkan ke Peta Laporan...</span>
      </div>
    </div>
  );
}
