# RIVERSE — Smart River Monitoring & GIS Reporting Platform
### *Humanity OS Solution for River Ecosystem Preservation*
> **Platform Sistem Informasi Geografis (SIG) Partisipatif untuk Pemantauan & Pelaporan Pencemaran Sungai secara Real-Time.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.11-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Mapping-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-0284C7?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Deploy](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://riverse.vercel.app)

---

## Instansi
**Universitas Amikom Yogyakarta**

## Anggota Tim (My Team Gueh)
- **Ketua** : Muhammad Firdaus Chuzaeni
- **Anggota 1** : Nisa Athifah As Sodri
- **Anggota 2** : Wasima Juhaina

---

## Deskripsi Karya

### Latar Belakang & Masalah
Berdasarkan data Kementerian Lingkungan Hidup (KLH), sebesar **70,7% dari 4.482 lokasi pemantauan sungai di Indonesia berstatus tercemar**. Meskipun tingkat literasi digital masyarakat tinggi, partisipasi dalam pengawasan lingkungan secara digital masih sangat minim. Hal ini disebabkan oleh *interface design failure* pada platform pengaduan umum yang birokratis, rumit, serta tidak memberikan kepastian tindak lanjut.

### Solusi & Konsep Humanity OS
**RIVERSE** hadir sebagai solusi berbasis **Humanity OS** yang mengintegrasikan pendekatan *Human-Centered Design (HCD)* dan *Eco-Emotional Visual Language*. RIVERSE menghubungkan kepedulian warga dengan aksi nyata **Dinas Lingkungan Hidup (DLH)** melalui mekanisme pelaporan berbasis lokasi yang bebas hambatan (*frictionless report* < 90 detik) tanpa prosedur pendaftaran yang membingungkan.

---

## Fitur Inovasi Unggulan

| Fitur Utama | Deskripsi & Nilai Tambah | Impact bagi Pengguna / DLH |
| :--- | :--- | :--- |
| **Geotagging & Peta GIS Interaktif** | Pemetaan titik pencemaran spasial secara *real-time* menggunakan Leaflet.js & PostGIS. | Memudahkan pemantauan visual persebaran sampah dari hulu ke hilir secara akurat. |
| **Smart Geofencing (<500m)** | Algoritma pemindaian lokasi otomatis untuk mendeteksi laporan ganda dalam radius 500 meter. | Mencegah redundansi data & penumpukan pin laporan ganda di lokasi yang sama. |
| **Community Upvote** | Fitur dukungan publik untuk aduan warga di wilayah sekitarnya. | Menentukan skala prioritas aduan yang otomatis diteruskan ke Dashboard DLH. |
| **Workflow & Visual Before-After** | Tracking status penanganan berjenjang disertai penggeser foto interaktif *Before vs After*. | Menjamin transparansi, akuntabilitas, dan kepuasan visual bagi pelapor. |

---

## Relevansi Tema & Dukungan SDGs
RIVERSE dirancang untuk mendukung ketercapaian target **Indeks Kualitas Air (IKA) Nasional** serta 3 poin utama **Sustainable Development Goals (SDGs)**:
- **SDG 6 (Clean Water and Sanitation)**: Menjaga kebersihan sumber air permukaan masyarakat dari kontaminasi limbah berbahaya.
- **SDG 13 (Climate Action)**: Memperluas akses partisipasi digital warga dalam aksi mitigasi pencemaran lingkungan hidup.
- **SDG 14 (Life Below Water)**: Mencegah aliran limbah dan mikroplastik darat mencemari biota dan ekosistem perairan.

---

## Tech Stack & Arsitektur

- **Frontend Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling & Design System**: [Tailwind CSS](https://tailwindcss.com/) + Custom Design Tokens (`#0F172A`, `#0284C7`, `#E0F2FE`, `#F8FAFC`, `#FFFFFF`)
- **GIS & Pemetaan Spasial**: [Leaflet.js](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + GeoJSON Polylines + SVG Map Pins
- **Animasi & Interaksi**: [Framer Motion](https://www.framer.com/motion/) + 3D Tilt Spatial Effects + Canvas Particle Systems
- **Eksportir Data**: [XLSX SheetJS](https://sheetjs.com/) (Ekspor Rekap Laporan & Armada DLH)
- **Kompatibilitas Standar**: WCAG 2.1 AA Compliance (Inklusivitas & Disabilitas)

---

## Panduan Penggunaan Platform RIVERSE

### A. Modul Warga (Masyarakat Umum)

#### 1. Tata Cara Melaporkan Pencemaran Sungai:
1. **Buka Menu Pelaporan**: Akses halaman utama dan pilih menu **Buat Laporan** atau klik tombol **Buat Laporan Sekarang**.
2. **Tentukan Titik Lokasi**: Pilih alur atau titik sungai yang mengalami pencemaran pada **Peta GIS Interaktif**.
3. **Konfirmasi Titik Spasial**: Klik tombol **Lapor Titik Ini** pada jendela informasi lokasi yang muncul di peta.
4. **Isi Formulir Pengaduan**: Lengkapi detail laporan, mulai dari kategori pencemaran, patokan lokasi, deskripsi kejadian, hingga foto bukti lapangan.
5. **Kirim Laporan**: Klik tombol **Kirim Laporan** untuk menerbitkan aduan ke dalam sistem GIS.

#### 2. Tata Cara Mendukung (Upvote) Laporan Warga Lain:
1. **Eksplorasi Daftar Laporan**: Gulir ke bawah pada menu Buat Laporan hingga menemukan bagian **Dukung & Pantau Laporan Warga**.
2. **Cek Detail Aduan**: Pilih kartu laporan yang ingin ditinjau untuk melihat deskripsi lengkap, lokasi, dan status terkini.
3. **Berikan Upvote**: Klik tombol **Dukung (+1 Vote)** pada laporan yang valid untuk memprioritaskan penanganannya oleh Dinas Lingkungan Hidup (DLH).

---

### B. Modul Administrator & Petugas (Dinas Lingkungan Hidup)

#### 1. Akses Portal Komando & Otentikasi Keamanan:
- Klik tombol **Masuk** pada navbar, lalu masukkan **NIP / ID Petugas** dan **Kata Sandi**.
- *Catatan/Disclaimer*: Platform tidak menyediakan formulir registrasi publik demi menjaga integritas data dan membatasi akses khusus bagi personel resmi berkepentingan.

#### 2. Fitur & Navigasi Dashboard DLH:
- **Dashboard Utama**: Menampilkan ringkasan statistik real-time, seperti total laporan aktif, status terverifikasi, persentase tingkat penyelesaian, serta peta sebaran laporan per wilayah.
- **Peta Density GIS**: Pemetaan spasial interaktif untuk memantau sebaran koordinat titik hotspot pencemaran sungai di seluruh wilayah administratif.
- **Tim & Beban Kerja**: Modul manajemen personel untuk memantau alokasi petugas lapangan yang sedang bertugas beserta riwayat penanganan yang telah diselesaikan.
- **Manajemen Laporan**: Pusat kendali bagi admin untuk mengonfirmasi, menindaklanjuti, atau menolak aduan warga berdasarkan verifikasi lapangan.
- **CCTV Monitoring**: Modul integrasi untuk menambahkan dan memantau titik feed kamera pengawas di sepanjang aliran sungai secara real-time.
- **Audit Log Aktivitas**: Catatan rekam jejak digital (*log history*) yang mencatat setiap tindakan dan aktivitas personel dalam sistem secara akuntabel.
- **Pengaturan Radius & Ambang Vote**: Fitur konfigurasi dinamis bagi admin untuk menentukan ambang batas dukungan publik (*upvote threshold*) serta radius Smart Geofencing guna memvalidasi laporan warga.

---

### C. Fitur Aksesibilitas (Disabilitas)
RIVERSE berkomitmen menyediakan antarmuka inklusif berstandar **WCAG 2.1 AA** bagi pengguna berkebutuhan khusus melalui widget aksesibilitas terintegrasi:
- **Penyesuaian Teks & Kontras**: Pengaturan ukuran font, Mode Kontras Tinggi (*High Contrast*), Skala Abu-Abu (*Grayscale*), dan Inversi Warna.
- **Kenyamanan Membaca & Navigasi**: Pilihan Font Mudah Dibaca (*Dyslexia Friendly*), Garis Bawah Tautan, Penyesuaian Spasi Huruf, serta Fitur Pengurangan Animasi (*Reduce Motion*).

---

## Struktur Direktori Proyek

```
frontend-1/
├── app/
│   ├── components/
│   │   ├── AboutSection.tsx          # Card 3D tilt & narasi transformasi sungai
│   │   ├── AccessibilityMount.tsx    # Dynamic client mount aksesibilitas
│   │   ├── AccessibilityWidget.tsx   # Widget aksesibilitas WCAG 2.1 AA
│   │   ├── CctvPlayerModal.tsx       # Modal pemutar live stream CCTV sungai
│   │   ├── ContactSection.tsx        # Form kontak & kanal aduan darurat
│   │   ├── CursorGlow.tsx            # Efek glowing cursor dinamis
│   │   ├── EcosystemSection.tsx      # 4 Langkah flip card mekanisme kerja
│   │   ├── FeaturesOverview.tsx      # Showcase fitur unggulan & palet GIS
│   │   ├── Footer.tsx                # Footer navigasi & hak cipta
│   │   ├── ForceLightMode.tsx        # Handler penegakan tema standar
│   │   ├── GisStatusPalette.tsx      # Palet status kualitas air & filter GIS
│   │   ├── Navbar.tsx                # Floating glassmorphic navbar
│   │   ├── PartnerSection.tsx        # Infinite marquee logo kolaborasi
│   │   ├── ReportDetailModal.tsx     # Modal detail laporan & foto before-after
│   │   ├── RiverGISMap.tsx           # Peta GIS Leaflet & GeoJSON interaktif
│   │   ├── ScrollIntroHero.tsx       # Hero section & animasi scroll intro
│   │   └── ToastProvider.tsx         # Sistem notifikasi Toast global
│   ├── dinas/
│   │   └── page.tsx                  # Portal Komando & Dashboard DLH
│   ├── lapor/
│   │   └── page.tsx                  # Modul Pelaporan Warga Presisi Spasial
│   ├── laporan-saya/
│   │   └── page.tsx                  # Modul Pelacakan Riwayat Laporan Warga
│   ├── globals.css                   # Tailwind CSS v4 & konfigurasi global
│   ├── layout.tsx                    # Root layout & providers
│   └── page.tsx                      # Landing page utama RIVERSE
├── lib/
│   ├── exportExcel.ts                # Utilitas ekspor data laporan & petugas (.xlsx)
│   ├── store.ts                      # Penyimpanan data lokal, mock data, & CCTV
│   └── types.ts                      # Definisi tipe TypeScript
├── public/
│   ├── assets/                       # Aset gambar, ikon, & logo resmi RIVERSE
│   └── data/                         # GeoJSON alur sungai & titik pemantauan
├── DESIGN.md                         # Panduan token warna & pedoman desain UI/UX
├── LIST-CCTV.md                      # Daftar titik kamera CCTV monitoring sungai
├── package.json
└── README.md
```

---

## Panduan Memulai (Getting Started)

### Prasyarat
Pastikan sistem Anda telah terpasang:
- **Node.js**: `v18.x` atau lebih baru
- **npm** atau **yarn** atau **pnpm**

### 1. Clone Repository
```bash
git clone https://github.com/riverse-id/frontend.git
cd frontend
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Lokal (Development)
```bash
npm run dev
```
Buka browser Anda dan akses: [http://localhost:3000](http://localhost:3000)

### 4. Build untuk Lingkungan Produksi
```bash
npm run build
npm run start
```

---

## Tautan / Link Deploy Website
- **Live Website**: [https://riverse.vercel.app](https://riverse.vercel.app)
- **Repository GitHub**: [https://github.com/riverse-id/frontend](https://github.com/riverse-id/frontend)

---

## Lisensi & Hak Cipta
© 2026 **Tim My Team Gueh — Universitas Amikom Yogyakarta**. Seluruh Hak Cipta Dilindungi Undang-Undang.  
Dikembangkan untuk mendukung pelestarian ekosistem sungai dan digitalisasi pengawasan lingkungan hidup di Indonesia.
