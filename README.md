# 🌊 RIVERSE — Platform Monitoring & Pelaporan Sungai Crowdsourced

> **Mempercepat Transformasi Tata Kelola Sungai Indonesia Berbasis Sistem Informasi Geografis (GIS) Presisi & Partisipasi Publik**

![RIVERSE Platform](/public/assets/logo-new.png)

---

## 📌 Tentang RIVERSE

**RIVERSE** (River Governance & Environmental Monitoring Platform) adalah platform web interaktif yang menghubungkan partisipasi masyarakat secara langsung dengan respon cepat Dinas Lingkungan Hidup (DLH) untuk mempercepat penanganan pencemaran sungai di Indonesia dari hulu ke hilir.

Dengan mengombinasikan **teknologi GIS Spasial presisi**, **pemetaan kualitas air real-time**, dan **sistem verifikasi pelaporan warga**, RIVERSE menghadirkan transparansi penuh dalam pengelolaan ekosistem sungai.

---

## ✨ Fitur Unggulan

### 1. 🗺️ Peta GIS Spasial Kualitas Air (`RiverGISMap.tsx`)
- **Visualisasi Jalur Sungai Spasial**: Menampilkan aliran sungai utama (Ciliwung, Cisadane, Sunter, Pesanggrahan, Krukut, Karang) menggunakan GeoJSON presisi.
- **Kategori Kualitas Air**: Indikator warna standar lingkungan:
  - 🔴 **Sangat Tercemar** (Merah)
  - 🟡 **Tercemar Sedang** (Kuning)
  - 🟢 **Tercemar Ringan** (Hijau)
  - 🔵 **Bersih** (Biru)
- **Palet Status GIS Interaktif (`GisStatusPalette.tsx`)**: Filter langsung berdasarkan tingkat bahaya, status laporan warga, dan wilayah aliran sungai.

### 2. 📸 Portal Pelaporan Warga Presisi (`/lapor`)
- **Deteksi Lokasi GPS Otomatis**: Memanfaatkan HTML5 Geolocation API untuk mengunci koordinat latitude & longitude titik pencemaran secara akurat.
- **Unggah Foto Bukti & Anti-Spam**: Validasi instan foto bukti kondisi sungai di lapangan.
- **Dukungan & Upvote Warga**: Fitur voting warga untuk menaikkan prioritas penanganan lokasi sungai yang mendesak.

### 3. 🏢 Dashboard Pengawasan Dinas Lingkungan Hidup (`/dinas`)
- **Portal Khusus Petugas DLH**: Otentikasi aman untuk tim pengawas lapangan.
- **Manajemen Status Laporan**: Pembaruan status penanganan dari *Menunggu* ➔ *Diproses* ➔ *Selesai*.
- **Bukti Penanganan Before-After**: Dokumentasi transparan hasil pembersihan sungai yang dapat diakses oleh publik.

### 4. 🎨 UI/UX Modern & Animasi 3D Interactive
- **3D Tilt Effect Mengikuti Kursor Mouse**: Kartu narasi misi di halaman *Tentang Kami* merespons pergerakan kursor mouse secara spasial 3D dengan kedalaman `translateZ`.
- **Floating Glassmorphic Navbar**: Design *frosted glass* (`bg-white/75 backdrop-blur-xl`) yang melayang secara elegan saat di-scroll.
- **Global Toast Notification System**: Konfirmasi aksi pengguna secara visual di pojok kanan bawah layar (upvote, buat laporan, kirim pesan, salin GPS).

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (60 FPS smooth animations & 3D tilt)
- **Peta & Spasial GIS**: [Leaflet.js](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + GeoJSON Data
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (dengan persitensi local storage)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Struktur Proyek

```
riverse/
├── app/
│   ├── components/
│   │   ├── AboutSection.tsx        # Card 3D tilt & narasi transformasi sungai
│   │   ├── ContactSection.tsx      # Form kontak & pengaduan darurat
│   │   ├── EcosystemSection.tsx    # 4 Langkah flip card cara kerja
│   │   ├── FeaturesOverview.tsx    # Hero showcase & GIS map preview
│   │   ├── Footer.tsx              # Footer navigasi & hak cipta
│   │   ├── GisStatusPalette.tsx    # Palet status kualitas air & filter GIS
│   │   ├── Navbar.tsx              # Floating frosted glass navbar
│   │   ├── PartnerSection.tsx      # Infinite marquee logo kolaborasi
│   │   ├── RiverGISMap.tsx         # Komponen peta GIS Leaflet & GeoJSON
│   │   ├── ScrollIntroHero.tsx     # Hero portal & animasi scroll intro
│   │   └── ToastProvider.tsx       # Sistem notifikasi Toast global
│   ├── dinas/
│   │   └── page.tsx                # Portal & Dashboard Pengawasan DLH
│   ├── lapor/
│   │   └── page.tsx                # Form Pelaporan Warga Presisi
│   ├── layout.tsx                  # Root Layout & Toast Provider wrapper
│   ├── page.tsx                    # Landing Page utama
│   └── globals.css                 # Custom CSS & Tailwind imports
├── lib/
│   └── store.ts                    # Zustand Store (Laporan, Upvote, Status GIS)
├── public/
│   ├── assets/                     # Gambar & logo resmi RIVERSE
│   └── data/                       # Data GeoJSON jalur sungai & titik laporan
└── package.json
```

---

## 🚀 Panduan Memulai (Getting Started)

Prasyarat: Pastikan Anda telah menginstal **Node.js** (v18.x atau lebih baru) dan **npm** / **yarn** / **pnpm**.

### 1. Clone Repository
```bash
git clone https://github.com/riverse-id/frontend.git
cd frontend
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembang (Development Server)
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada peramban Anda untuk melihat aplikasi berjalan.

### 4. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 📄 Lisensi & Hak Cipta

© 2026 RIVERSE System. Hak Cipta Dilindungi Undang-Undang.
Bermitra dengan Dinas Lingkungan Hidup (DLH), Komunitas Peduli Sungai, dan Instansi Terkait.
