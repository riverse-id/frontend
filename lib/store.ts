import { Report, Officer, AuditLog, SystemConfig, ReportStatus, ReportCategory, StatusTimeline } from "./types";

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  globalThreshold: 50,
  geofencingRadiusMeters: 500,
  autoEscalationEnabled: true,
};

export const INITIAL_OFFICERS: Officer[] = [
  {
    id: "off-1",
    name: "Ir. Bambang Wijaya, M.T.",
    nip: "19880412 201402 1 003",
    role: "super_admin",
    roleLabel: "Super Admin DLH",
    region: "Seluruh Jabodetabek",
    phone: "+62 812-3456-7890",
    email: "bambang.wijaya@dlh.jakarta.go.id",
    activeWorkload: 4,
    completedTasks: 142,
  },
  {
    id: "off-2",
    name: "Drs. Heru Prasetyo",
    nip: "19790315 200801 1 007",
    role: "korwil",
    roleLabel: "Koordinator Wilayah Jakarta Selatan",
    region: "Jakarta Selatan (Ciliwung Hilir)",
    phone: "+62 813-9876-5432",
    email: "heru.prasetyo@dlh.jakarta.go.id",
    activeWorkload: 6,
    completedTasks: 98,
  },
  {
    id: "off-3",
    name: "Suryadi Pasukan Oranye",
    nip: "19920721 201903 1 012",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Pasukan Oranye",
    region: "Manggarai - Kampung Melayu",
    phone: "+62 857-1122-3344",
    email: "suryadi.lapangan@dlh.jakarta.go.id",
    activeWorkload: 2,
    completedTasks: 76,
  },
  {
    id: "off-4",
    name: "Ahmad Subagja, S.T.",
    nip: "19850412 201001 1 009",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Armada Ciliwung",
    region: "Kalibata - Tebet (Ciliwung)",
    phone: "+62 821-2233-4455",
    email: "ahmad.subagja@dlh.jakarta.go.id",
    activeWorkload: 3,
    completedTasks: 61,
  },
  {
    id: "off-5",
    name: "Dewi Anggraini, S.T.",
    nip: "19881203 201103 2 004",
    role: "korwil",
    roleLabel: "Koordinator Wilayah Jakarta Timur",
    region: "Jakarta Timur (Cipinang - Sunter)",
    phone: "+62 812-8877-6655",
    email: "dewi.anggraini@dlh.jakarta.go.id",
    activeWorkload: 5,
    completedTasks: 88,
  },
  {
    id: "off-6",
    name: "Rudi Hartono",
    nip: "19910114 201403 1 011",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Pasukan Oranye",
    region: "Sunter - Kelapa Gading",
    phone: "+62 856-3344-2211",
    email: "rudi.hartono@dlh.jakarta.go.id",
    activeWorkload: 1,
    completedTasks: 53,
  },
  {
    id: "off-7",
    name: "Ratna Dewi Kusuma, S.Si.",
    nip: "19870622 201012 2 008",
    role: "korwil",
    roleLabel: "Koordinator Wilayah Jakarta Utara",
    region: "Jakarta Utara (BKB - Marunda)",
    phone: "+62 813-5566-7788",
    email: "ratna.dewi@dlh.jakarta.go.id",
    activeWorkload: 4,
    completedTasks: 97,
  },
  {
    id: "off-8",
    name: "Bambang Setiawan",
    nip: "19950930 202006 1 014",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Armada Ciliwung",
    region: "Depok - Jagakarsa (Ciliwung Hulu)",
    phone: "+62 823-4455-6677",
    email: "bambang.setiawan@dlh.jakarta.go.id",
    activeWorkload: 2,
    completedTasks: 34,
  },
  {
    id: "off-9",
    name: "Sari Puspita, S.E.",
    nip: "19920318 201603 2 010",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Monitoring",
    region: "Bekasi - Bantargebang",
    phone: "+62 838-9911-2233",
    email: "sari.puspita@dlh.jakarta.go.id",
    activeWorkload: 0,
    completedTasks: 41,
  },
  {
    id: "off-10",
    name: "Hendra Gunawan",
    nip: "19841107 200904 1 006",
    role: "korwil",
    roleLabel: "Koordinator Wilayah Jakarta Barat",
    region: "Jakarta Barat (Angke - Mookervart)",
    phone: "+62 811-6677-8899",
    email: "hendra.gunawan@dlh.jakarta.go.id",
    activeWorkload: 6,
    completedTasks: 109,
  },
  {
    id: "off-11",
    name: "Lilis Marlina, A.Md.",
    nip: "19940626 201703 2 012",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Pasukan Oranye",
    region: "Cengkareng - Kalideres",
    phone: "+62 852-7788-9900",
    email: "lilis.marlina@dlh.jakarta.go.id",
    activeWorkload: 2,
    completedTasks: 47,
  },
  {
    id: "off-12",
    name: "Taufik Hidayat, S.T.",
    nip: "19881219 201101 1 013",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Armada Cisadane",
    region: "Kota Tangerang - Serpong",
    phone: "+62 822-1122-3344",
    email: "taufik.hidayat@dlh.jakarta.go.id",
    activeWorkload: 3,
    completedTasks: 58,
  },
  {
    id: "off-13",
    name: "Nina Marliana",
    nip: "19951105 202110 2 015",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Monitoring",
    region: "Pesanggrahan - Kebayoran",
    phone: "+62 895-2233-4455",
    email: "nina.marliana@dlh.jakarta.go.id",
    activeWorkload: 1,
    completedTasks: 29,
  },
  {
    id: "off-14",
    name: "Yusuf Maulana, S.Kom.",
    nip: "19890213 201108 1 016",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Data Spasial",
    region: "Jatinegara - Cipinang",
    phone: "+62 817-5566-7788",
    email: "yusuf.maulana@dlh.jakarta.go.id",
    activeWorkload: 2,
    completedTasks: 63,
  },
  {
    id: "off-15",
    name: "Fitri Handayani",
    nip: "19930827 201605 2 017",
    role: "petugas_lapangan",
    roleLabel: "Petugas Lapangan Pasukan Oranye",
    region: "Tanjung Priok - Marunda",
    phone: "+62 899-3344-5566",
    email: "fitri.handayani@dlh.jakarta.go.id",
    activeWorkload: 4,
    completedTasks: 71,
  },
];

const IMAGE_POOL = [
  "/assets/sungai/026016200_1633163690-20211002-Pencemaran_Teluk_Jakarta_oleh_Paracetamol-1.jpg",
  "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg",
  "/assets/sungai/antarafoto-bantaran-sungai-penuh-sampah-230624-adm-1.jpg",
  "/assets/sungai/pencemaran-teluk-jakarta-9r95-dom.jpg",
  "/assets/sungai/_ (1).jpeg",
  "/assets/sungai/Potret Lautan Sampah di Teluk Jakarta.jpeg",
  "/assets/sungai/5d58fc880697c.jpg",
  "/assets/sungai/5d8be82dc4958.jpg",
];

const RIVER_POOL = [
  "Kali Ciliwung - Segmen Manggarai",
  "Kali Ciliwung - Segmen Kalibata",
  "Kali Ciliwung - Segmen Depok Hulu",
  "Kali Pesanggrahan - Segmen Bintaro",
  "Kali Pesanggrahan - Segmen Kebon Jeruk",
  "Kali Cisadane - Segmen Kota Tangerang",
  "Kali Cisadane - Segmen Serpong",
  "Kali Angke - Segmen Cengkareng",
  "Kali Sunter - Segmen Kelapa Gading",
  "Kali Cipinang - Segmen Jatinegara",
  "Kali Krukut - Segmen Tanah Abang",
  "Kali Bekasi - Segmen Bendung Bekasi",
  "Kali Mookervart - Segmen Kalideres",
  "Banjir Kanal Barat - Segmen Manggarai",
  "Banjir Kanal Timur - Segmen Cipinang",
];

const LOCATION_POOL = [
  "Dekat Pintu Air Manggarai RT 05/03",
  "Bantaran Jembatan Kalibata",
  "Belakang Pabrik tekstil Jl. Raya Depok",
  "Jembatan penyeberangan Bintaro",
  "Samping Kompleks Kebon Jeruk",
  "Bendung Cisadane Kota Tangerang",
  "Bantaran Serpong segmen jembatan",
  "Jembatan Cengkareng RT 02/07",
  "Polder Danau Sunter Selatan",
  "Bantaran Jatinegara samping pasar",
  "Jembatan Tanah Abang RT 01/04",
  "Hilir Bendung Bekasi Jl. Mayor Oking",
  "Perbatasan Kalideres - Tangerang",
  "Sluice gate BKB Manggarai",
  "Bantaran BKT Cipinang Muara",
];

const REPORTER_POOL = [
  "Budi Santoso",
  "Siti Rahma",
  "Ahmad Hidayat",
  "Dewi Lestari",
  "Rian Kurniawan",
  "Putri Ayu",
  "Andi Saputra",
  "Maya Sari",
  "Fajar Nugroho",
  "Intan Permatasari",
  "Rizky Ramadhan",
  "Nadia Kusuma",
  "Doni Pratama",
  "Laila Fitriani",
  "Bayu Setiawan",
  "Ratna Dewi",
];

const REGION_POOL = [
  "Jakarta Selatan",
  "Jakarta Timur",
  "Jakarta Utara",
  "Jakarta Barat",
  "Jakarta Pusat",
  "Kota Bekasi",
  "Kota Tangerang",
  "Kota Depok",
];

const CATEGORY_POOL = [
  { id: "sampah", label: "Tumpukan Sampah Plastik", desc: "Penumpukan sampah plastik rumah tangga dan kayu bekas yang menyumbat aliran air." },
  { id: "limbah-cair", label: "Limbah Cair Industri", desc: "Air sungai berubah warna keruh kehitaman dan mengeluarkan cairan berbusa pekat." },
  { id: "bau-warna", label: "Busa & Air Berbau", desc: "Tumpukan busa putih tebal dan bau asam menyengat tercium hingga jarak jauh." },
  { id: "tanggul", label: "Kerusakan Tanggul & Longsor", desc: "Tanah longsor dan erosi bantaran akibat debit air deras setelah hujan." },
];

const OFFICER_ACTORS = [
  "Ir. Bambang Wijaya, M.T.",
  "Drs. Heru Prasetyo",
  "Suryadi Pasukan Oranye",
  "Ahmad Subagja, S.T.",
  "Dewi Anggraini, S.T.",
  "Rudi Hartono",
  "Ratna Dewi Kusuma, S.Si.",
];

const STATUS_SEQ: ReportStatus[] = [
  "pending",
  "terverifikasi",
  "diproses",
  "selesai",
  "terverifikasi",
  "selesai",
  "pending",
  "diproses",
  "ditolak",
  "terverifikasi",
];

function buildGeneratedReports(): Report[] {
  const DAY = 86400000;
  const BASE = Date.UTC(2026, 6, 25, 8, 0);
  const list: Report[] = [];

  for (let i = 0; i < 44; i++) {
    const river = RIVER_POOL[i % RIVER_POOL.length];
    const cat = CATEGORY_POOL[i % CATEGORY_POOL.length];
    const status = STATUS_SEQ[i % STATUS_SEQ.length];
    const reporter = REPORTER_POOL[i % REPORTER_POOL.length];
    const region = REGION_POOL[(i * 3) % REGION_POOL.length];
    const isAnon = i % 5 === 0;
    const upvotes = ((i * 17) % 58) + 6;
    const urgency = upvotes * 2 + ((i * 7) % 22);
    const createdMs = BASE - ((i * 13) % 24) * DAY - ((i * 5) % 9) * 3600000;
    const created = new Date(createdMs).toISOString();
    const ticketNo = `DLH-2026-${String(7000 - i * 11)}`;
    const officer = OFFICER_ACTORS[i % OFFICER_ACTORS.length];

    const timeline: StatusTimeline[] = [
      {
        status: "pending",
        label: "Laporan Dibuat Warga",
        timestamp: new Date(createdMs).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
        actor: isAnon ? "Warga Anonim" : reporter,
      },
    ];
    if (status === "terverifikasi" || status === "diproses" || status === "selesai" || status === "ditolak") {
      timeline.push({
        status: "terverifikasi",
        label: "Mencapai Threshold (Diteruskan ke DLH)",
        timestamp: new Date(createdMs + 2 * 3600000).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
        actor: "Sistem Otomatis",
      });
    }
    if (status === "diproses" || status === "selesai") {
      timeline.push({
        status: "diproses",
        label: "Tim Lapangan Didisposisikan",
        timestamp: new Date(createdMs + 5 * 3600000).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
        actor: officer,
      });
    }
    if (status === "selesai") {
      timeline.push({
        status: "selesai",
        label: "Closed-Loop Selesai Pembersihan",
        timestamp: new Date(createdMs + 10 * 3600000).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
        actor: officer,
      });
    }
    if (status === "ditolak") {
      timeline.push({
        status: "ditolak",
        label: "Laporan Ditolak / Tidak Valid",
        timestamp: new Date(createdMs + 3 * 3600000).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
        actor: "Administrator DLH",
      });
    }

    list.push({
      id: `rpt-gen-${i + 200}`,
      ticketNo,
      riverName: river,
      region,
      category: cat.id as ReportCategory,
      categoryLabel: cat.label,
      locationDetail: LOCATION_POOL[i % LOCATION_POOL.length],
      lat: -6.1 - (i % 5) * 0.05,
      lng: 106.6 + (i % 8) * 0.04,
      description: cat.desc,
      reporterName: isAnon ? "Warga Anonim" : reporter,
      isAnonymous: isAnon,
      upvotes,
      voteThreshold: 50,
      urgencyScore: urgency,
      status,
      createdAt: created,
      updatedAt: new Date(createdMs + (status === "selesai" ? 10 : 3) * 3600000).toISOString(),
      beforeImages: [IMAGE_POOL[i % IMAGE_POOL.length]],
      afterImage:
        status === "selesai"
          ? "/assets/sungai/thumb-citarum-563x353.jpg"
          : undefined,
      officerNote:
        status === "selesai"
          ? "Telah diangkut sampah menggunakan armada DLH. Kondisi aliran kembali normal sesuai SOP."
          : undefined,
      assignedOfficerId: status === "diproses" || status === "selesai" ? `off-${(i % 12) + 3}` : undefined,
      assignedOfficerName: status === "diproses" || status === "selesai" ? officer : undefined,
      subReports:
        i % 7 === 0
          ? [
              {
                id: `sub-gen-${i}`,
                reporterName: REPORTER_POOL[(i + 3) % REPORTER_POOL.length],
                category: cat.id as ReportCategory,
                categoryLabel: cat.label,
                description: "Foto tambahan dari warga lain memperkuat bukti pencemaran di lokasi.",
                images: [IMAGE_POOL[(i + 2) % IMAGE_POOL.length]],
                createdAt: new Date(createdMs + 3600000).toISOString(),
                lat: -6.1 - (i % 5) * 0.05,
                lng: 106.6 + (i % 8) * 0.04,
              },
            ]
          : [],
      timeline,
    });
  }

  return list;
}

export const MOCK_REPORTS: Report[] = [
  {
    id: "rpt-101",
    ticketNo: "DLH-2026-0891",
    riverName: "Kali Ciliwung - Segmen Manggarai",
    region: "Jakarta Selatan",
    category: "limbah-cair",
    categoryLabel: "Limbah Cair Industri",
    locationDetail: "Dekat Pintu Air Manggarai RT 05/03",
    lat: -6.235,
    lng: 106.854,
    description: "Air sungai berubah warna menjadi keruh kehitaman dan mengeluarkan cairan berbusa pekat sejak pukul 07:00 WIB.",
    reporterName: "Budi Santoso",
    isAnonymous: false,
    upvotes: 64,
    voteThreshold: 50,
    urgencyScore: 142,
    status: "terverifikasi",
    createdAt: "2026-07-31T08:15:00Z",
    updatedAt: "2026-07-31T09:00:00Z",
    beforeImages: ["/assets/sungai/026016200_1633163690-20211002-Pencemaran_Teluk_Jakarta_oleh_Paracetamol-1.jpg"],
    subReports: [
      {
        id: "sub-101-a",
        reporterName: "Dedi Susanto",
        category: "bau-warna",
        categoryLabel: "Bau Menyengat",
        description: "Bau menyengat tercium hingga radius 300m dari bantaran sungai.",
        images: ["/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg"],
        createdAt: "2026-07-31T08:30:00Z",
        lat: -6.2352,
        lng: 106.8543,
      },
    ],
    timeline: [
      { status: "pending", label: "Laporan Dibuat Warga", timestamp: "2026-07-31 08:15", actor: "Budi Santoso" },
      { status: "terverifikasi", label: "Mencapai Threshold (Diteruskan ke DLH)", timestamp: "2026-07-31 09:00", actor: "Sistem Otomatis" },
    ],
  },
  {
    id: "rpt-102",
    ticketNo: "DLH-2026-0885",
    riverName: "Kali Cipinang - Segmen Jatinegara",
    region: "Jakarta Timur",
    category: "sampah",
    categoryLabel: "Tumpukan Sampah Plastik",
    locationDetail: "Bantaran sungai samping jembatan penyeberangan Jatinegara",
    lat: -6.229,
    lng: 106.876,
    description: "Penumpukan kantong sampah plastik rumah tangga dan kayu bekas yang menyumbat aliran air.",
    reporterName: "Siti Rahma",
    isAnonymous: false,
    upvotes: 95,
    voteThreshold: 50,
    urgencyScore: 210,
    status: "diproses",
    createdAt: "2026-07-31T07:30:00Z",
    updatedAt: "2026-07-31T10:15:00Z",
    assignedOfficerId: "off-3",
    assignedOfficerName: "Suryadi Pasukan Oranye",
    beforeImages: ["/assets/sungai/antarafoto-bantaran-sungai-penuh-sampah-230624-adm-1.jpg"],
    subReports: [],
    timeline: [
      { status: "pending", label: "Laporan Dibuat Warga", timestamp: "2026-07-31 07:30", actor: "Siti Rahma" },
      { status: "terverifikasi", label: "Terverifikasi Warga", timestamp: "2026-07-31 08:45", actor: "Sistem Otomatis" },
      { status: "diproses", label: "Tim Lapangan Didispensasikan", timestamp: "2026-07-31 10:15", actor: "Drs. Heru Prasetyo" },
    ],
  },
  {
    id: "rpt-103",
    ticketNo: "DLH-2026-0870",
    riverName: "Kali Bekasi - Segmen Bendung Bekasi",
    region: "Kota Bekasi",
    category: "bau-warna",
    categoryLabel: "Busa & Air Berbau",
    locationDetail: "Hilir Bendung Bekasi Jalan Mayor Oking",
    lat: -6.23,
    lng: 107.002,
    description: "Tumpukan busa putih tebal membumbung di atas air sungai dan menimbulkan bau asam menyengat.",
    reporterName: "Ahmad Hidayat",
    isAnonymous: true,
    upvotes: 78,
    voteThreshold: 50,
    urgencyScore: 178,
    status: "terverifikasi",
    createdAt: "2026-07-31T06:45:00Z",
    updatedAt: "2026-07-31T08:00:00Z",
    beforeImages: ["/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg"],
    subReports: [],
    timeline: [
      { status: "pending", label: "Laporan Dibuat Warga", timestamp: "2026-07-31 06:45", actor: "Warga Anonim" },
      { status: "terverifikasi", label: "Terverifikasi Threshold", timestamp: "2026-07-31 08:00", actor: "Sistem Otomatis" },
    ],
  },
  {
    id: "rpt-104",
    ticketNo: "DLH-2026-0842",
    riverName: "Kali Sunter - Segmen Kelapa Gading",
    region: "Jakarta Utara",
    category: "sampah",
    categoryLabel: "Penyumbatan Sampah Rumah Tangga",
    locationDetail: "Polder Danau Sunter Selatan",
    lat: -6.14,
    lng: 106.872,
    description: "Eceng gondok dan sampah botol plastik menutupi permukaan air polder.",
    reporterName: "Dewi Lestari",
    isAnonymous: false,
    upvotes: 42,
    voteThreshold: 50,
    urgencyScore: 95,
    status: "selesai",
    createdAt: "2026-07-30T10:00:00Z",
    updatedAt: "2026-07-30T16:30:00Z",
    assignedOfficerId: "off-3",
    assignedOfficerName: "Suryadi Pasukan Oranye",
    beforeImages: ["/assets/sungai/Potret Lautan Sampah di Teluk Jakarta.jpeg"],
    afterImage: "/assets/sungai/thumb-citarum-563x353.jpg",
    officerNote: "Telah diangkut 3.2 ton sampah plastik menggunakan 2 unit truk sampah DLH. Air mengalir lancar.",
    subReports: [],
    timeline: [
      { status: "pending", label: "Laporan Dibuat Warga", timestamp: "2026-07-30 10:00", actor: "Dewi Lestari" },
      { status: "terverifikasi", label: "Terverifikasi Manual Korwil", timestamp: "2026-07-30 11:20", actor: "Ir. Bambang Wijaya" },
      { status: "diproses", label: "Pembersihan Lapangan", timestamp: "2026-07-30 13:00", actor: "Suryadi Pasukan Oranye" },
      { status: "selesai", label: "Closed-Loop Selesai Clean", timestamp: "2026-07-30 16:30", actor: "Suryadi Pasukan Oranye" },
    ],
  },
  {
    id: "rpt-105",
    ticketNo: "DLH-2026-0811",
    riverName: "Kali Pesanggrahan - Segmen Kebayoran",
    region: "Jakarta Selatan",
    category: "tanggul",
    categoryLabel: "Kerusakan Tanggul & Longsor",
    locationDetail: "Bantaran Kali Pesanggrahan RT 02/08",
    lat: -6.26,
    lng: 106.77,
    description: "Laporan tanah longsor akibat erosi debit air deras setelah hujan deras kemarin malam.",
    reporterName: "Rian Kurniawan",
    isAnonymous: false,
    upvotes: 12,
    voteThreshold: 50,
    urgencyScore: 28,
    status: "pending",
    createdAt: "2026-07-31T09:10:00Z",
    updatedAt: "2026-07-31T09:10:00Z",
    beforeImages: ["/assets/sungai/5d58fc880697c.jpg"],
    subReports: [],
    timeline: [
      { status: "pending", label: "Laporan Dibuat (Mengumpulkan Vote)", timestamp: "2026-07-31 09:10", actor: "Rian Kurniawan" },
    ],
  },
  ...buildGeneratedReports(),
];

const LOG_ACTIONS = [
  { action: "Disposisi Tim Lapangan", details: "Menugaskan petugas armada ke lokasi titik GIS laporan." },
  { action: "Update Status (DIPROSES)", details: "Petugas mulai melakukan penanganan pembersihan di lapangan." },
  { action: "Update Status (SELESAI)", details: "Closed-loop selesai, dokumentasi Before vs After diunggah." },
  { action: "Eskalasi Threshold", details: "Vote mencapai threshold. Status otomatis menjadi Terverifikasi 🔴." },
  { action: "Tolak Laporan (REJECT)", details: "Laporan ditolak karena duplikat / foto tidak relevan." },
  { action: "Unggah Bukti After", details: "Dokumentasi foto pembersihan diunggah ke tiket." },
];

function buildGeneratedAuditLogs(): AuditLog[] {
  const DAY = 86400000;
  const BASE = Date.UTC(2026, 6, 25, 9, 0);
  const logs: AuditLog[] = [];

  for (let i = 0; i < 26; i++) {
    const action = LOG_ACTIONS[i % LOG_ACTIONS.length];
    const actor = OFFICER_ACTORS[(i * 2) % OFFICER_ACTORS.length];
    const actorRole =
      actor === "Ir. Bambang Wijaya, M.T."
        ? "Super Admin"
        : actor.startsWith("Drs.")
        ? "Koordinator Wilayah"
        : actor === "Sistem Spasial Auto"
        ? "Automated System"
        : "Petugas Lapangan";
    const stamp = new Date(BASE - ((i * 7) % 20) * DAY - ((i * 11) % 24) * 3600000 - (i * 31) % 60);

    logs.push({
      id: `log-gen-${i + 100}`,
      timestamp: stamp.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      ticketNo: `DLH-2026-${String(7000 - ((i * 11) % 44) * 11)}`,
      actorName: actor,
      actorRole,
      action: action.action,
      details: action.details,
    });
  }

  return logs;
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2026-07-31 10:15:04",
    ticketNo: "DLH-2026-0885",
    actorName: "Drs. Heru Prasetyo",
    actorRole: "Koordinator Wilayah",
    action: "Disposisi Tim Lapangan",
    details: "Menugaskan Suryadi Pasukan Oranye (Armada Truk 04) ke Kali Cipinang.",
  },
  {
    id: "log-2",
    timestamp: "2026-07-31 09:00:12",
    ticketNo: "DLH-2026-0891",
    actorName: "Sistem Spasial Auto",
    actorRole: "Automated System",
    action: "Eskalasi Threshold",
    details: "Vote mencapai 64/50 (+142 Urgency Score). Status otomatis menjadi Terverifikasi 🔴.",
  },
  ...buildGeneratedAuditLogs(),
];

const STORAGE_KEY = "riverse_reports_db_v2";

const fixImagePath = (path: string | undefined, defaultPath: string): string => {
  if (
    !path ||
    path.startsWith("blob:") ||
    path.includes("sungai ciliwung bening") ||
    path.includes("Pencemaran Teluk Jakarta oleh Paracetamol.jpg") ||
    path.includes("20200812")
  ) {
    return defaultPath;
  }
  return path;
};

export function getStoredReports(): Report[] {
  if (typeof window === "undefined") return MOCK_REPORTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sanitized = parsed.map((r: Report) => ({
          ...r,
          beforeImages: (r.beforeImages || []).map((img) =>
            fixImagePath(img, "/assets/sungai/026016200_1633163690-20211002-Pencemaran_Teluk_Jakarta_oleh_Paracetamol-1.jpg")
          ),
          afterImage: r.afterImage
            ? fixImagePath(r.afterImage, "/assets/sungai/thumb-citarum-563x353.jpg")
            : undefined,
          subReports: (r.subReports || []).map((sub) => ({
            ...sub,
            images: (sub.images || []).map((img) =>
              fixImagePath(img, "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg")
            ),
          })),
        }));
        return sanitized;
      }
    }
  } catch (e) {
    console.error("Failed to read stored reports:", e);
  }
  return MOCK_REPORTS;
}

export function saveStoredReports(reports: Report[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new Event("riverse_reports_updated"));
  } catch (e) {
    console.error("Failed to save reports:", e);
  }
}

export interface CreateReportInput {
  category: ReportCategory;
  categoryLabel: string;
  riverName: string;
  locationDetail: string;
  description: string;
  reporterName: string;
  isAnonymous: boolean;
  lat: number;
  lng: number;
  image?: string;
  radiusMetersThreshold?: number;
}

export interface SubmissionResult {
  isAggregated: boolean;
  ticketNo: string;
  report: Report;
  aggregatedDistanceMeters?: number;
  message: string;
}

/**
 * Calculate distance in meters between two lat/lng coordinates (Haversine Formula)
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Submit a Citizen Report with Smart Geofencing Duplicate Aggregation (Radius <= 500m)
 */
export function submitCitizenReport(input: CreateReportInput): SubmissionResult {
  const currentReports = getStoredReports();
  const radiusLimit = input.radiusMetersThreshold || 500;

  // Find active report within 500 meters radius
  let nearbyIndex = -1;
  let minDistance = Infinity;

  currentReports.forEach((r, idx) => {
    if (r.status === "selesai" || r.status === "ditolak") return;
    const distance = calculateDistanceMeters(input.lat, input.lng, r.lat, r.lng);
    if (distance <= radiusLimit && distance < minDistance) {
      minDistance = distance;
      nearbyIndex = idx;
    }
  });

  const nowFormatted = new Date().toISOString().replace("T", " ").substring(0, 16);
  const reporterDisplayName = input.isAnonymous ? "Warga Anonim" : input.reporterName.trim() || "Warga Komunitas";

  if (nearbyIndex !== -1) {
    // -------------------------------------------------------------
    // DUPLICATE GEOFENCE AGGREGATION DETECTED (Radius <= 500m)
    // -------------------------------------------------------------
    const existing = currentReports[nearbyIndex];
    const distMeters = minDistance;

    const newSubReport = {
      id: `sub-${Date.now()}`,
      reporterName: reporterDisplayName,
      category: input.category,
      categoryLabel: input.categoryLabel,
      description: input.description,
      images: input.image ? [input.image] : ["/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg"],
      createdAt: new Date().toISOString(),
      lat: input.lat,
      lng: input.lng,
    };

    const updatedBeforeImages = [...existing.beforeImages];
    if (input.image && !updatedBeforeImages.includes(input.image)) {
      updatedBeforeImages.push(input.image);
    }

    const updatedUpvotes = existing.upvotes + 1;
    const updatedUrgency = existing.urgencyScore + 15;
    const shouldVerify = updatedUpvotes >= existing.voteThreshold && existing.status === "pending";

    const updatedReport: Report = {
      ...existing,
      upvotes: updatedUpvotes,
      urgencyScore: updatedUrgency,
      status: shouldVerify ? "terverifikasi" : existing.status,
      beforeImages: updatedBeforeImages,
      subReports: [newSubReport, ...(existing.subReports || [])],
      updatedAt: new Date().toISOString(),
      timeline: [
        ...existing.timeline,
        {
          status: shouldVerify ? "terverifikasi" : existing.status,
          label: `Sub-Laporan Komunitas Digabungkan (Radius ${distMeters}m)`,
          timestamp: nowFormatted,
          actor: reporterDisplayName,
          note: input.description,
        },
      ],
    };

    currentReports[nearbyIndex] = updatedReport;
    saveStoredReports(currentReports);

    return {
      isAggregated: true,
      ticketNo: existing.ticketNo,
      report: updatedReport,
      aggregatedDistanceMeters: distMeters,
      message: `Smart Geofencing Radius (${distMeters}m <= 500m): Laporan Anda otomatis digabungkan dengan Tiket Laporan terdekat #${existing.ticketNo}. Bukti foto & jumlah dukungan warga bertambah!`,
    };
  } else {
    // -------------------------------------------------------------
    // NEW REPORT TICKET CREATION (Distance > 500m)
    // -------------------------------------------------------------
    const newTicketNo = `DLH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport: Report = {
      id: `rpt-${Date.now()}`,
      ticketNo: newTicketNo,
      riverName: input.riverName,
      region: "DKI Jakarta & Sekitar",
      category: input.category,
      categoryLabel: input.categoryLabel,
      locationDetail: input.locationDetail || "Bantaran Sungai",
      lat: input.lat,
      lng: input.lng,
      description: input.description,
      reporterName: reporterDisplayName,
      isAnonymous: input.isAnonymous,
      upvotes: 1,
      voteThreshold: 50,
      urgencyScore: 10,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      beforeImages: input.image ? [input.image] : ["/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg"],
      subReports: [],
      timeline: [
        {
          status: "pending",
          label: "Laporan Dibuat Warga (Mengumpulkan Vote)",
          timestamp: nowFormatted,
          actor: reporterDisplayName,
        },
      ],
    };

    const newReportsList = [newReport, ...currentReports];
    saveStoredReports(newReportsList);

    return {
      isAggregated: false,
      ticketNo: newTicketNo,
      report: newReport,
      message: `Laporan baru berhasil terdaftar di peta spasial RIVERSE dengan nomor tiket ${newTicketNo}.`,
    };
  }
}

/**
 * Vote on a report (+1 upvote)
 */
export function voteReport(reportId: string): Report | null {
  const currentReports = getStoredReports();
  const index = currentReports.findIndex((r) => r.id === reportId);
  if (index === -1) return null;

  const r = currentReports[index];
  const newUpvotes = r.upvotes + 1;
  const newUrgency = r.urgencyScore + 2;
  const shouldVerify = newUpvotes >= r.voteThreshold && r.status === "pending";
  const nowFormatted = new Date().toISOString().replace("T", " ").substring(0, 16);

  const updated: Report = {
    ...r,
    upvotes: newUpvotes,
    urgencyScore: newUrgency,
    status: shouldVerify ? "terverifikasi" : r.status,
    updatedAt: new Date().toISOString(),
    timeline: shouldVerify
      ? [
          ...r.timeline,
          {
            status: "terverifikasi",
            label: "Mencapai Threshold (Auto Verifikasi DLH)",
            timestamp: nowFormatted,
            actor: "Sistem Otomatis Spasial",
          },
        ]
      : r.timeline,
  };

  currentReports[index] = updated;
  saveStoredReports(currentReports);
  return updated;
}

// =====================================================================
// CCTV MONITORING POINTS (GIS Layer)
// =====================================================================

export type CctvStatus = "aktif" | "offline" | "perbaikan";

export interface CctvPoint {
  id: string;
  name: string;
  riverName: string;
  locationDetail: string;
  lat: number;
  lng: number;
  status: CctvStatus;
  streamUrl?: string;
  createdAt: string;
}

// Data titik CCTV dari LIST-CCTV.md (DPUPR Kota Tangsel Streams)
export const INITIAL_CCTV: CctvPoint[] = [
  {
    id: "cctv-001",
    name: "CCTV Jembatan Polor",
    riverName: "Kali Pesanggrahan",
    locationDetail: "Jembatan Polor, Kota Tangerang Selatan",
    lat: -6.3006,
    lng: 106.74,
    status: "aktif",
    streamUrl: "https://cctv.dpuprkotang.info/stream.html?src=Jembatan%20Polor&embed=true",
    createdAt: "2026-07-01T08:00:00Z",
  },
  {
    id: "cctv-002",
    name: "CCTV Cipulir Estate",
    riverName: "Kali Pesanggrahan",
    locationDetail: "Cipulir Estate, Jakarta Selatan",
    lat: -6.284,
    lng: 106.751,
    status: "aktif",
    streamUrl: "https://cctv.dpuprkotang.info/stream.html?src=Cipulir%20Estate&embed=true",
    createdAt: "2026-07-03T09:30:00Z",
  },
  {
    id: "cctv-003",
    name: "CCTV Pintu 3 Paninggilan",
    riverName: "Kali Cisadane",
    locationDetail: "Pintu 3 Paninggilan Utara, Kota Tangerang",
    lat: -6.178,
    lng: 106.65,
    status: "aktif",
    streamUrl: "https://cctv.dpuprkotang.info/stream.html?src=Pintu%203%20Paninggilan&embed=true",
    createdAt: "2026-07-05T10:15:00Z",
  },
  {
    id: "cctv-004",
    name: "CCTV Alamanda",
    riverName: "Kali Cisadane",
    locationDetail: "Kawasan Alamanda, Serpong / BSD",
    lat: -6.291,
    lng: 106.668,
    status: "aktif",
    streamUrl: "https://cctv.dpuprkotang.info/stream.html?src=Alamanda&embed=true",
    createdAt: "2026-07-06T13:45:00Z",
  },
];

const CCTV_KEY = "riverse_cctv_db_v1";

export function getStoredCctv(): CctvPoint[] {
  if (typeof window === "undefined") return INITIAL_CCTV;
  try {
    const data = localStorage.getItem(CCTV_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read stored CCTV:", e);
  }
  return INITIAL_CCTV;
}

export function saveStoredCctv(list: CctvPoint[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CCTV_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("riverse_cctv_updated"));
  } catch (e) {
    console.error("Failed to save CCTV:", e);
  }
}

export function addCctvPoint(input: Omit<CctvPoint, "id" | "createdAt">): CctvPoint {
  const newPoint: CctvPoint = {
    ...input,
    id: `cctv-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveStoredCctv([newPoint, ...getStoredCctv()]);
  return newPoint;
}

export function removeCctvPoint(id: string): void {
  saveStoredCctv(getStoredCctv().filter((c) => c.id !== id));
}
