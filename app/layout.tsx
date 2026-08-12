import type { Metadata } from "next";
import "./globals.css";
import CursorGlow from "./components/CursorGlow";
import { ToastProvider } from "./components/ToastProvider";
import AccessibilityMount from "./components/AccessibilityMount";

export const metadata: Metadata = {
  title: "RIVERSE — Platform Monitoring & Pelaporan Sungai Crowdsourced",
  description: "Sistem Pemantauan Pencemaran Sungai Real-Time Berbasis Partisipasi Publik dan Dinas Lingkungan Hidup",
  icons: {
    icon: [
      { url: "/assets/logo-new.png" },
      { url: "/assets/logo-new.png", type: "image/png" }
    ],
    shortcut: "/assets/logo-new.png",
    apple: "/assets/logo-new.png",
  },
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var isLanding=window.location.pathname==='/';if(isLanding)return;var t=localStorage.getItem('riverse_theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-[#0284C7] selection:text-white relative">
        <ToastProvider>
          <CursorGlow />
          <AccessibilityMount />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
