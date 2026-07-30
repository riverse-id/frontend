import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RIVERSE — Platform Monitoring & Pelaporan Sungai Crowdsourced",
  description: "Sistem Pemantauan Pencemaran Sungai Real-Time Berbasis Partisipasi Publik dan Dinas Lingkungan Hidup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="font-sans h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-[#0284C7] selection:text-white">
        {children}
      </body>
    </html>
  );
}
