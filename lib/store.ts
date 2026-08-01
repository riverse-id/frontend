import { Report, Officer, AuditLog, SystemConfig, ReportStatus, ReportCategory } from "./types";

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
];

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
];

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
];

const STORAGE_KEY = "riverse_reports_db_v1";

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
