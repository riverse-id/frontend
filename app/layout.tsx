import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      className={`${poppins.variable} font-sans h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-[#79AC78] selection:text-white">
        {children}
      </body>
    </html>
  );
}

