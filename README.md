# RIVERSE — Smart River Monitoring & GIS Reporting Platform

## Instansi
Universitas Amikom Yogyakarta

## Anggota Tim
- Ketua       : Muhammad Firdaus Chuzaeni
  - Anggota 1: Nisa Athifah As Sodri
  - Anggota 2: Wasima Juhaina

## Deskripsi Karya

### 1. Latar Belakang Pemilihan Masalah
Sungai merupakan urat nadi ekosistem dan sumber air baku vital bagi kehidupan masyarakat. Namun, berdasarkan data Kementerian Lingkungan Hidup (KLH), sebesar **70,7% dari 4.482 lokasi pemantauan sungai di Indonesia saat ini berstatus tercemar**, didominasi oleh limbah domestik, sampah plastik anorganik, dan pembuangan limbah industri ilegal. 

Meskipun penetrasi perangkat pintar dan literasi digital masyarakat perkotaan maupun pedesaan telah tinggi, partisipasi aktif warga dalam pengawasan lingkungan masih sangat rendah. Hal ini dipicu oleh kegagalan sistem pelaporan konvensional (*interface & workflow failure*):
- **Birokrasi Rumit & Membingungkan**: Prosedur aduan mengharuskan registrasi panjang dan formulir berbelit.
- **Ketiadaan Konfirmasi Spasial**: Laporan tidak terpetakan secara geografis (*non-geotagged*), memicu penumpukan aduan duplikat di titik yang sama.
- **Sistem Pelaporan Satu Arah (*Black-Box Reporting*)**: Pelapor tidak pernah mengetahui apakah laporannya sedang diproses atau sudah selesai, menghilangkan kepercayaan publik terhadap instansi pemerintah.

### 2. Tujuan Utama Pembuatan Sistem
**RIVERSE** dikembangkan sebagai platform Sistem Informasi Geografis (SIG/GIS) partisipatif (*crowdsourced*) yang bertujuan untuk:
1. **Memotong Friksi Pelaporan Warga**: Menghadirkan antarmuka pelaporan cepat (*frictionless report* < 90 detik) berbasis titik GPS dan alur sungai GeoJSON presisi tinggi tanpa registrasi yang membebani.
2. **Validasi Cerdas & Anti-Spam Berbasis Lokasi**: Mengimplementasikan algoritma **Smart Geofencing (<500m)** dan **Community Upvote** untuk mencegah redundansi laporan dan memfilter data palsu secara otomatis.
3. **Sentralisasi Komando Dinas Lingkungan Hidup (DLH)**: Menyediakan *dashboard command center* terintegrasi bagi petugas DLH untuk memantau *density heatmap*, mengalokasikan armada kebersihan, memantau *live stream* CCTV aliran sungai, hingga mengunggah bukti transparansi *Before vs After*.
4. **Membangun Akuntabilitas Siklus Tertutup (*Closed-Loop Accountability*)**: Menjamin transparansi status laporan dari tahap *Pending* ➔ *Terverifikasi* ➔ *Diproses* ➔ *Selesai* secara real-time.

### 3. Manfaat yang Dihadirkan bagi Masyarakat & Lingkungan
- **Bagi Masyarakat Umum**:
  - Memberikan kanal partisipasi digital yang mudah diakses, inklusif, dan transparan dalam menjaga kebersihan lingkungan tempat tinggal.
  - Memberikan kepastian tindak lanjut dengan bukti visual nyata (*interactive before-after comparison slider*).
  - Membangun solidaritas warga sekitar melalui mekanisme dukungan aduan (*community upvoting*).
- **Bagi Pemerintah & Dinas Lingkungan Hidup (DLH)**:
  - Menghemat waktu dan efisiensi alokasi anggaran penanganan lapangan berkat data spasial dan koordinat titik pencemaran yang presisi.
  - Memudahkan evaluasi kebijakan dan kinerja armada melalui fitur rekapitulasi data dan ekspor laporan terstruktur (`.xlsx`).
- **Bagi Ekosistem & Pembangunan Berkelanjutan (SDGs)**:
  - **SDG 6 (Clean Water and Sanitation)**: Melindungi kelestarian sumber daya air tawar dan sanitasi lingkungan dari limbah beracun.
  - **SDG 13 (Climate Action)**: Mendorong aksi mitigasi pencemaran lingkungan berbasis keterlibatan komunitas lokal.
  - **SDG 14 (Life Below Water)**: Mencegah sampah darat dan mikroplastik mengalir ke muara serta merusak biota perairan.

### 4. Alasan Mendasar Pemilihan Subtema Humanity OS
Subtema **Humanity OS** dipilih karena RIVERSE berakar pada filosofi bahwa **teknologi harus memanusiakan manusia, menjembatani empati sosial, dan memberdayakan kepedulian warga menjadi aksi nyata penyelamatan bumi**.

Melalui integrasi *Human-Centered Design (HCD)*, RIVERSE mengadopsi prinsip:
1. **Empati & Inklusivitas Universal**: RIVERSE menerapkan standar aksesibilitas **WCAG 2.1 AA** secara menyeluruh (fitur pembaca teks ramah disleksia, mode kontras tinggi, penyesuaian ukuran font, dan *reduce motion*) agar seluruh kalangan, termasuk penyandang disabilitas dan lansia, dapat berpartisipasi setara.
2. **Teknologi Sebagai Jembatan Kolaborasi Sipil-Pemerintah**: Menghilangkan sekat birokrasi antara warga dan petugas dinas, mengubah relasi pasif menjadi kemitraan gotong royong digital yang harmonis demi masa depan air bersih Indonesia.

---

## Tautan / Link Deploy Website
- **URL Website Aktif (Live Demo)** : [https://riverse.vercel.app](https://riverse.vercel.app)
- **Repository GitHub** : [https://github.com/riverse-id/frontend](https://github.com/riverse-id/frontend)

---

## Fitur Inovasi Unggulan

| Fitur Utama | Deskripsi & Nilai Tambah | Impact bagi Pengguna / DLH |
| :--- | :--- | :--- |
| **Geotagging & Peta GIS Interaktif** | Pemetaan titik pencemaran spasial secara *real-time* menggunakan Leaflet.js & PostGIS. | Memudahkan pemantauan visual persebaran sampah dari hulu ke hilir secara akurat. |
| **Smart Geofencing (<500m)** | Algoritma pemindaian lokasi otomatis untuk mendeteksi laporan ganda dalam radius 500 meter. | Mencegah redundansi data & penumpukan pin laporan ganda di lokasi yang sama. |
| **Community Upvote** | Fitur dukungan publik untuk aduan warga di wilayah sekitarnya. | Menentukan skala prioritas aduan yang otomatis diteruskan ke Dashboard DLH. |
| **Workflow & Visual Before-After** | Tracking status penanganan berjenjang disertai penggeser foto interaktif *Before vs After*. | Menjamin transparansi, akuntabilitas, dan kepuasan visual bagi pelapor. |
| **Live CCTV Monitoring** | Pemantauan streaming kamera pengawas titik rawan banjir dan penumpukan limbah di bantaran sungai. | Deteksi dini aktivitas pembuangan sampah liar secara preventif. |
| **Aksesibilitas WCAG 2.1 AA** | Panel kendali inklusivitas lengkap (Dyslexia Font, Kontras Tinggi, Skala Abu-Abu, Pembesar Teks). | Memberikan kenyamanan akses setara bagi seluruh lapisan masyarakat. |

---

## Panduan Penggunaan Platform RIVERSE

### A. Modul Warga (Masyarakat Umum)
1. **Tata Cara Melaporkan Pencemaran Sungai**:
   - Akses landing page, klik tombol **Buat Laporan Sekarang**.
   - Tentukan lokasi pencemaran pada **Peta GIS Interaktif** atau gunakan deteksi GPS otomatis.
   - Klik **Lapor Titik Ini** pada pop-up alur sungai.
   - Isi formulir (kategori pencemaran, patokan lokasi, deskripsi kejadian, dan foto bukti).
   - Klik **Kirim Laporan** untuk mempublikasikan aduan ke sistem GIS.
2. **Tata Cara Mendukung (Upvote) Laporan Warga Lain**:
   - Buka bagian **Dukung & Pantau Laporan Warga**.
   - Pilih laporan yang ingin diverifikasi.
   - Klik tombol **Dukung (+1 Vote)** untuk menaikkan prioritas penanganan ke antrean DLH.

### B. Modul Administrator & Petugas (Dinas Lingkungan Hidup)
1. **Akses Portal Komando**:
   - Klik **Masuk** pada navbar, masukkan kredensial resmi (NIP/ID Petugas & Password).
2. **Fitur Dashboard DLH**:
   - **Statistik & Hotspot GIS**: Ringkasan persentase penyelesaian laporan dan peta densitas sebaran aduan.
   - **Manajemen & Verifikasi Aduan**: Verifikasi bukti lapangan, alokasikan petugas, dan perbarui status pengerjaan.
   - **Penyelesaian & Upload Before-After**: Dokumentasikan hasil pembersihan dengan foto *After* untuk verifikasi warga.
   - **Live CCTV & Audit Log**: Monitoring CCTV berkala serta pemantauan rekam jejak aktivitas dinas yang akuntabel.
   - **Ekspor Data**: Unduh rekapitulasi data laporan dan performa petugas dalam format spreadsheet (`.xlsx`).

---

## Tech Stack & Arsitektur

- **Frontend Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling & Design System**: Tailwind CSS v4 + Custom Design Tokens (Ocean & River GIS Palette)
- **GIS & Pemetaan Spasial**: Leaflet.js + React-Leaflet + GeoJSON Polylines + Custom SVG Status Pins
- **Animasi & Interaktivitas**: Framer Motion + 3D Tilt Cards + Canvas Particle System
- **Ekspor Data**: XLSX (SheetJS)
- **Standar Aksesibilitas**: Web Content Accessibility Guidelines (WCAG) 2.1 Level AA

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
├── FLOW.md                           # Diagram alur end-to-end sistem
├── LIST-CCTV.md                      # Daftar titik kamera CCTV monitoring sungai
├── package.json
└── README.md
```

---

## Panduan Memulai (Getting Started)

### Prasyarat
- **Node.js**: `v18.x` atau lebih baru
- **Package Manager**: `npm`, `yarn`, atau `pnpm`

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

## Lisensi & Hak Cipta
© 2026 **Tim My Team Gueh — Universitas Amikom Yogyakarta**. Seluruh Hak Cipta Dilindungi Undang-Undang.  
Dikembangkan untuk mendukung pelestarian ekosistem sungai dan digitalisasi pengawasan lingkungan hidup di Indonesia.
