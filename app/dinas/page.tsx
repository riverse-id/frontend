"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Truck,
  History,
  LogOut,
  LogIn,
  Lock,
  Search,
  Bell,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  X,
  Camera,
  Video,
  Play,
  Mail,
  Phone,
  ArrowUpRight,
  TrendingUp,
  Filter,
  Sparkles,
  Zap,
  Building2,
  ExternalLink,
  Sliders,
  Users,
  Download,
  Ban,
  Clock,
  Crosshair,
  ThumbsUp,
  Trash2,
  FileCheck,
  ArrowLeft,
  PlusCircle,
  Menu
} from "lucide-react";
import dynamic from "next/dynamic";
import { useToast } from "../components/ToastProvider";
import CctvPlayerModal from "../components/CctvPlayerModal";
import { exportRowsToExcel } from "../../lib/exportExcel";
import { INITIAL_OFFICERS, MOCK_REPORTS, MOCK_AUDIT_LOGS, INITIAL_SYSTEM_CONFIG, getStoredReports, saveStoredReports, getStoredCctv, addCctvPoint, removeCctvPoint, CctvPoint, CctvStatus } from "../../lib/store";
import { Report, Officer, AuditLog, SystemConfig, OfficerRole, ReportStatus } from "../../lib/types";

const RiverGISMap = dynamic(() => import("../components/RiverGISMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-400 font-medium text-xs">
      Memuat Peta Spasial GIS Dinas...
    </div>
  ),
});

const getInitials = (name: string): string => {
  const clean = name
    .replace(/^(Ir\.|Drs\.|Dr\.|H\.|Hj\.|Prof\.)\s+/gi, "")
    .replace(/,\s*(M\.T\.|S\.T\.|S\.E\.|S\.Kom\.|M\.Kom\.|S\.Pd\.|M\.Si\.)$/gi, "");
  const parts = clean.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function SemiCircleGauge({ value = 72 }: { value?: number }) {
  const radius = 56;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex flex-col items-center justify-center my-1">
      <svg className="w-44 h-24 overflow-visible" viewBox="0 0 140 75">
        {/* Background Track */}
        <path
          d="M 14 70 A 56 56 0 0 1 126 70"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <path
          d="M 14 70 A 56 56 0 0 1 126 70"
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="60%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function MiniBarChart({ color = "sky", heights = [35, 65, 45, 90, 70] }: { color?: "sky" | "red" | "emerald" | "amber"; heights?: number[] }) {
  const colorMap = {
    sky: "bg-[#0284C7]",
    red: "bg-rose-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };
  return (
    <div className="flex items-end gap-1 h-7 shrink-0">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full ${colorMap[color]} transition-all`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function usePaging(total: number, initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const changePage = (p: number) => setPage(Math.max(1, Math.min(p, pageCount)));
  const changePageSize = (s: number) => {
    setPageSize(s);
    setPage(1);
  };
  return {
    page: safePage,
    pageCount,
    pageSize,
    total,
    start: (safePage - 1) * pageSize,
    end: safePage * pageSize,
    changePage,
    changePageSize,
  };
}

function PaginationControls({
  paging,
}: {
  paging: ReturnType<typeof usePaging>;
}) {
  const { page, pageCount, pageSize, total, changePage, changePageSize } = paging;
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const pageNumbers: (number | "…")[] = [];
  if (pageCount <= 5) {
    for (let i = 1; i <= pageCount; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (page > 3) pageNumbers.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) pageNumbers.push(i);
    if (page < pageCount - 2) pageNumbers.push("…");
    pageNumbers.push(pageCount);
  }

  const navBtn =
    "px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
      <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 flex-wrap">
        <span>
          Menampilkan{" "}
          <strong className="text-slate-800">{startItem}–{endItem}</strong> dari{" "}
          <strong className="text-slate-800">{total}</strong> data
        </span>
        <label className="flex items-center gap-1.5">
          <span className="hidden sm:inline text-slate-400">Tampilkan:</span>
          <select
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
            title="Jumlah data per halaman"
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / hal.
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
          className={`${navBtn} flex items-center gap-1`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>
        {pageNumbers.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-xs text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                p === page
                  ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => changePage(page + 1)}
          disabled={page === pageCount}
          className={`${navBtn} flex items-center gap-1`}
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function DinasDashboard() {
  const { showToast } = useToast();
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nipInput, setNipInput] = useState<string>("19880512 201201 1 004");
  const [passwordInput, setPasswordInput] = useState<string>("••••••••");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nipInput.trim() || !passwordInput.trim()) {
      setLoginError("Silakan masukkan NIP / ID Petugas dan kata sandi.");
      return;
    }
    setIsAuthenticating(true);
    setLoginError(null);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsLoggedIn(true);
      showToast("Akses Petugas Dinas DLH berhasil dikonfirmasi!", "success");
    }, 500);
  };

  const handleQuickAdminFill = () => {
    setNipInput("19880512 201201 1 004");
    setPasswordInput("••••••••");
    setCurrentRole("super_admin");
    setLoginError(null);
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsLoggedIn(true);
      showToast("Login Petugas Dinas DLH Berhasil!", "success");
    }, 600);
  };

  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [reports, setReports] = useState<Report[]>([]);
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [cctvPoints, setCctvPoints] = useState<CctvPoint[]>(() => getStoredCctv());

  // Sync reports with local store
  useEffect(() => {
    setReports(getStoredReports());
    const handleUpdate = () => setReports(getStoredReports());
    window.addEventListener("riverse_reports_updated", handleUpdate);
    return () => window.removeEventListener("riverse_reports_updated", handleUpdate);
  }, []);

  // Sync CCTV points with shared store
  useEffect(() => {
    const handleUpdate = () => setCctvPoints(getStoredCctv());
    window.addEventListener("riverse_cctv_updated", handleUpdate);
    return () => window.removeEventListener("riverse_cctv_updated", handleUpdate);
  }, []);

  const updateAndSaveReports = (newReports: Report[]) => {
    setReports(newReports);
    saveStoredReports(newReports);
  };

  // Role Management State
  const [currentRole, setCurrentRole] = useState<OfficerRole>("super_admin");

  // Filters & Search
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("semua");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Action Form Inputs
  const [updateStatus, setUpdateStatus] = useState<ReportStatus>("diproses");
  const [assignedOfficerId, setAssignedOfficerId] = useState<string>("off-3");
  const [officerNoteInput, setOfficerNoteInput] = useState<string>("");
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Config Form Inputs
  const [configThreshold, setConfigThreshold] = useState<number>(systemConfig.globalThreshold);
  const [configRadius, setConfigRadius] = useState<number>(systemConfig.geofencingRadiusMeters);

  // Add Officer Form State
  const [showAddOfficerModal, setShowAddOfficerModal] = useState<boolean>(false);
  const [newOfficerName, setNewOfficerName] = useState<string>("");
  const [newOfficerNip, setNewOfficerNip] = useState<string>("");
  const [newOfficerRole, setNewOfficerRole] = useState<OfficerRole>("petugas_lapangan");
  const [newOfficerRegion, setNewOfficerRegion] = useState<string>("Jakarta Selatan");
  const [newOfficerPhone, setNewOfficerPhone] = useState<string>("");
  const [newOfficerEmail, setNewOfficerEmail] = useState<string>("");

  // CCTV Form State
  const [showAddCctvModal, setShowAddCctvModal] = useState<boolean>(false);
  const [playingCctv, setPlayingCctv] = useState<CctvPoint | null>(null);
  const [newCctvName, setNewCctvName] = useState<string>("");
  const [newCctvRiver, setNewCctvRiver] = useState<string>("Kali Ciliwung");
  const [newCctvLocation, setNewCctvLocation] = useState<string>("");
  const [newCctvLat, setNewCctvLat] = useState<string>("");
  const [newCctvLng, setNewCctvLng] = useState<string>("");
  const [newCctvStatus, setNewCctvStatus] = useState<CctvStatus>("aktif");
  const [newCctvStreamUrl, setNewCctvStreamUrl] = useState<string>("");

  const handleCctvMapSelect = (location: { lat: number; lng: number; riverName: string }) => {
    setNewCctvLat(String(location.lat));
    setNewCctvLng(String(location.lng));
    setNewCctvLocation(location.riverName);
    showToast(`Titik CCTV dipilih dari peta: ${location.riverName}`, "info");
  };

  const handleAddCctvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(newCctvLat);
    const lng = parseFloat(newCctvLng);
    if (!newCctvName.trim() || isNaN(lat) || isNaN(lng)) {
      showToast("Lengkapi nama titik CCTV dan koordinat (klik peta untuk memilih lokasi).", "error");
      return;
    }

    addCctvPoint({
      name: newCctvName.trim(),
      riverName: newCctvRiver,
      locationDetail: newCctvLocation.trim() || "Bantaran Sungai",
      lat,
      lng,
      status: newCctvStatus,
      streamUrl: newCctvStreamUrl.trim() || undefined,
    });

    setShowAddCctvModal(false);
    setNewCctvName("");
    setNewCctvLocation("");
    setNewCctvLat("");
    setNewCctvLng("");
    setNewCctvStatus("aktif");
    setNewCctvStreamUrl("");
    showToast("Titik CCTV baru berhasil ditambahkan ke peta GIS!", "success");
  };

  const handleRemoveCctv = (id: string) => {
    removeCctvPoint(id);
    showToast("Titik CCTV berhasil dihapus dari monitoring.", "info");
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerNip) return;

    const newOfficer: Officer = {
      id: `off-${Date.now()}`,
      name: newOfficerName,
      nip: newOfficerNip,
      role: newOfficerRole,
      roleLabel:
        newOfficerRole === "super_admin"
          ? "Super Admin DLH"
          : newOfficerRole === "korwil"
          ? "Koordinator Wilayah"
          : "Petugas Lapangan",
      region: newOfficerRegion,
      phone: newOfficerPhone || "0812-9988-7766",
      email: newOfficerEmail || `${newOfficerName.toLowerCase().replace(/\s+/g, ".")}@dlh.jakarta.go.id`,
      activeWorkload: 0,
      completedTasks: 0,
    };

    setOfficers((prev) => [newOfficer, ...prev]);
    setShowAddOfficerModal(false);
    setNewOfficerName("");
    setNewOfficerNip("");
    setNewOfficerPhone("");
    setNewOfficerEmail("");
  };

  // Filtered Reports Queue
  const filteredReports = reports.filter((item) => {
    const matchesTab = activeTab === "semua" || item.status === activeTab;
    const matchesRegion = selectedRegion === "semua" || item.region === selectedRegion;
    const matchesSearch =
      item.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.riverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesRegion && matchesSearch;
  });

  // Urgent Priority Queue Widget Reports (Top 3 highest urgency score)
  const urgentReports = [...reports]
    .filter((r) => r.status === "terverifikasi" || r.status === "pending")
    .sort((a, b) => b.urgencyScore - a.urgencyScore)
    .slice(0, 3);

  // Derived dashboard statistics (RIVERSE features)
  const statusCounts = {
    pending: reports.filter((r) => r.status === "pending").length,
    terverifikasi: reports.filter((r) => r.status === "terverifikasi").length,
    diproses: reports.filter((r) => r.status === "diproses").length,
    selesai: reports.filter((r) => r.status === "selesai").length,
    ditolak: reports.filter((r) => r.status === "ditolak").length,
  };
  const totalUrgency = reports.reduce((sum, r) => sum + (r.urgencyScore || 0), 0);
  const totalUpvotes = reports.reduce((sum, r) => sum + (r.upvotes || 0), 0);
  const completionPct =
    reports.length > 0 ? Math.round((statusCounts.selesai / reports.length) * 100) : 0;
  const regionDist = Object.entries(
    reports.reduce<Record<string, number>>((acc, r) => {
      const region = r.region || "DKI Jakarta & Sekitar";
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const topUrgentReport = [...reports].sort((a, b) => b.urgencyScore - a.urgencyScore)[0];

  // Pagination state for each list
  const dashboardPaging = usePaging(reports.length, 10);
  const laporanPaging = usePaging(filteredReports.length, 10);
  const petugasPaging = usePaging(officers.length, 10);
  const auditPaging = usePaging(auditLogs.length, 10);

  // Handle Save Action Update (Status Diproses/Selesai)
  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setIsSaving(true);
    setTimeout(() => {
      const assignedOff = officers.find((o) => o.id === assignedOfficerId);
      const newTimelineStep = {
        status: updateStatus,
        label: updateStatus === "selesai" ? "Closed-Loop Selesai Pembersihan" : "Sedang Diproses Tim Lapangan",
        timestamp: new Date().toLocaleString("id-ID"),
        actor: assignedOff ? assignedOff.name : "Petugas DLH",
      };

      const updatedList = reports.map((item) =>
        item.id === selectedReport.id
          ? {
              ...item,
              status: updateStatus,
              assignedOfficerId: assignedOfficerId,
              assignedOfficerName: assignedOff?.name,
              officerNote: officerNoteInput || "Tindakan pembersihan telah dilaksanakan sesuai SOP DLH.",
              afterImage: afterImagePreview || item.beforeImages[0],
              timeline: [...item.timeline, newTimelineStep],
              updatedAt: new Date().toISOString(),
            }
          : item
      );

      updateAndSaveReports(updatedList);

      // Audit Log
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString("id-ID"),
          ticketNo: selectedReport.ticketNo,
          actorName: assignedOff ? assignedOff.name : "Petugas DLH",
          actorRole: currentRole,
          action: `Update Status (${updateStatus.toUpperCase()})`,
          details: officerNoteInput || "Memperbarui status penanganan laporan.",
        },
        ...prev,
      ]);

      setIsSaving(false);
      setShowActionModal(false);
      setSelectedReport(null);
      showToast("Status penanganan laporan berhasil diperbarui!", "success");
    }, 700);
  };

  // Handle Reject Report (Fitur B.3)
  const handleSaveReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !rejectionReasonInput) return;

    setIsSaving(true);
    setTimeout(() => {
      const updatedList = reports.map((item) =>
        item.id === selectedReport.id
          ? {
              ...item,
              status: "ditolak" as ReportStatus,
              rejectionReason: rejectionReasonInput,
              timeline: [
                ...item.timeline,
                {
                  status: "ditolak" as ReportStatus,
                  label: "Laporan Ditolak / Tidak Valid",
                  timestamp: new Date().toLocaleString("id-ID"),
                  actor: "Petugas DLH",
                  note: rejectionReasonInput,
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : item
      );

      updateAndSaveReports(updatedList);

      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString("id-ID"),
          ticketNo: selectedReport.ticketNo,
          actorName: "Administrator DLH",
          actorRole: currentRole,
          action: "Tolak Laporan (REJECT)",
          details: `Alasan: ${rejectionReasonInput}`,
        },
        ...prev,
      ]);

      setIsSaving(false);
      setShowRejectModal(false);
      setSelectedReport(null);
      setRejectionReasonInput("");
    }, 700);
  };

  // Handle Config Save
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemConfig({
      globalThreshold: configThreshold,
      geofencingRadiusMeters: configRadius,
      autoEscalationEnabled: true,
    });
    setShowConfigModal(false);
  };

  // Export Data to Excel/PDF Simulation
  const handleExportData = () => {
    setExportMessage("Mengunduh Laporan Rekapitulasi Spasial DLH (PDF & Excel)...");
    setTimeout(() => {
      setExportMessage(null);
      alert("Berkas PDF & Excel Rekapitulasi Laporan DLH berhasil diunduh ke perangkat Anda.");
    }, 1500);
  };

  const REPORT_STATUS_LABEL: Record<string, string> = {
    pending: "Pending 🟠",
    terverifikasi: "Terverifikasi 🔴",
    diproses: "Diproses 🔵",
    selesai: "Selesai 🟢",
    ditolak: "Ditolak ⚪",
  };

  const handleExportOfficers = () => {
    if (officers.length === 0) return;
    exportRowsToExcel({
      fileName: `RIVERSE_Tim_Petugas_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: "Tim Petugas DLH",
      columns: [
        { header: "Nama Petugas", accessor: (o: Officer) => o.name },
        { header: "NIP", accessor: (o: Officer) => o.nip },
        { header: "Peran", accessor: (o: Officer) => o.roleLabel },
        { header: "Wilayah Tugas", accessor: (o: Officer) => o.region },
        { header: "Telepon / WA", accessor: (o: Officer) => o.phone },
        { header: "Email", accessor: (o: Officer) => o.email },
        { header: "Beban Kerja Aktif", accessor: (o: Officer) => o.activeWorkload },
        { header: "Tugas Selesai", accessor: (o: Officer) => o.completedTasks },
      ],
      rows: officers,
    });
    showToast(`${officers.length} data petugas berhasil diekspor ke Excel!`, "success");
  };

  const handleExportReports = () => {
    if (filteredReports.length === 0) return;
    exportRowsToExcel({
      fileName: `RIVERSE_Manajemen_Laporan_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: "Manajemen Laporan",
      columns: [
        { header: "No. Tiket", accessor: (r: Report) => r.ticketNo },
        {
          header: "Tanggal Dibuat",
          accessor: (r: Report) => new Date(r.createdAt).toLocaleDateString("id-ID"),
        },
        { header: "Sungai / Segmen", accessor: (r: Report) => r.riverName },
        { header: "Lokasi", accessor: (r: Report) => r.locationDetail },
        { header: "Wilayah", accessor: (r: Report) => r.region },
        { header: "Kategori", accessor: (r: Report) => r.categoryLabel },
        {
          header: "Status",
          accessor: (r: Report) => REPORT_STATUS_LABEL[r.status] || r.status,
        },
        { header: "Urgency Score", accessor: (r: Report) => r.urgencyScore },
        { header: "Upvotes", accessor: (r: Report) => r.upvotes },
        {
          header: "Pelapor",
          accessor: (r: Report) => (r.isAnonymous ? "Anonim" : r.reporterName),
        },
      ],
      rows: filteredReports,
    });
    showToast(`${filteredReports.length} laporan berhasil diekspor ke Excel!`, "success");
  };

  // Render Login View if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans">
        {/* Top & Bottom Gradient Fades */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

        {/* Ambient Blue River Glows */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-[#0284C7]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Navbar Header: Back button on top-left */}
        <header className="relative z-20 p-6 sm:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200/90 text-xs font-bold text-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
            <span>Kembali ke Beranda</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistem Dinas Aktif
          </span>
        </header>

        {/* Main Login Card */}
        <main className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md overflow-hidden bg-white border border-slate-200/90 rounded-[36px] shadow-2xl shadow-slate-200/80">
            {/* Brand Header Band */}
            <div className="relative bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#0F172A] px-8 py-8 text-center overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
              <Image
                src="/assets/logo-putih.png"
                alt="RIVERSE Logo"
                width={80}
                height={80}
                className="h-16 w-auto object-contain mb-3 mx-auto drop-shadow-lg"
                priority
              />
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Portal Dinas & Komando RIVERSE
              </h1>
              <p className="text-xs text-sky-100/90 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Akses Dashboard Penanganan Sungai Dinas Lingkungan Hidup.
              </p>
            </div>

            <div className="p-8 sm:p-10">
              {loginError && (
                <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1.5 uppercase tracking-wider">
                    NIP / ID Petugas
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={nipInput}
                      onChange={(e) => setNipInput(e.target.value)}
                      placeholder="Masukkan NIP / ID"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#0284C7] focus:bg-white focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#0284C7] focus:bg-white focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-extrabold text-xs shadow-lg shadow-[#0284C7]/25 hover:bg-[#0369A1] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Akses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk</span>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Preset Quick Link */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleQuickAdminFill}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] hover:underline transition-all cursor-pointer"
                >
                  <span>Gunakan Akun Demo Admin DLH</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-20 p-6 text-center text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} RIVERSE Platform Monitoring & Pelaporan Sungai — Sistem Informasi Geografis Terintegrasi
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-800 font-sans flex flex-col lg:flex-row selection:bg-[#0284C7] selection:text-white relative p-0 lg:p-3.5 gap-0 lg:gap-3.5">
      
      {/* Dark Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 1. LEFT SIDEBAR NAVIGATION (Modern Dark Sleek Drawer matching image) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 ${isSidebarCollapsed ? "lg:w-[76px]" : "lg:w-60"} bg-[#0F172A] text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-3.5 lg:z-30 lg:h-[calc(100vh-28px)] lg:overflow-y-auto ${isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
        
        {/* Brand Header */}
        <div className={`p-5 sm:p-6 border-b border-white/10 flex items-center justify-between ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <Link href="/" className="flex items-center gap-3 group" title="RIVERSE">
            <Image
              src="/assets/logo-putih.png"
              alt="RIVERSE Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
              priority
            />
            <div className={`flex flex-col ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              <span className="font-extrabold text-base tracking-tight text-white leading-none">
                RIVERSE
              </span>
              <span className="text-[9px] text-sky-400 font-bold uppercase tracking-widest mt-1">DLH MONITORING</span>
            </div>
          </Link>

          {/* Close Sidebar Button on Mobile */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Tutup Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Links & Navigation Section */}
        <div className="p-4 flex-1 space-y-6 overflow-y-auto">
          <div>
            <span className={`block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2.5 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              MENU UTAMA
            </span>
            <nav className="space-y-1.5">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "peta", label: "Peta Density GIS", icon: MapPin },
                { id: "petugas", label: "Tim & Beban Kerja", icon: Users },
                { id: "laporan", label: "Manajemen Laporan", icon: FileText },
                { id: "cctv", label: "CCTV Monitoring", icon: Camera },
                { id: "audit", label: "Audit Log Aktivitas", icon: History },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
                      isActive
                        ? "bg-slate-800/90 text-white shadow-md border border-white/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                    <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* System Configuration Trigger */}
          <div>
            <span className={`block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2.5 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              SISTEM
            </span>
            <button
              onClick={() => {
                setShowConfigModal(true);
                setIsMobileSidebarOpen(false);
              }}
              title={isSidebarCollapsed ? "Radius & Ambang Vote" : undefined}
              className={`w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all p-3 cursor-pointer ${isSidebarCollapsed ? "lg:flex lg:justify-center lg:px-0" : ""}`}
            >
              <div className={`flex items-center justify-between gap-2 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                <span className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                  <Sliders className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Radius & Ambang Vote</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
              <div className={`mt-2.5 flex items-center gap-2 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-sky-300 bg-white/10 px-2 py-0.5 rounded-md">
                  <Crosshair className="w-3 h-3" />
                  {systemConfig.geofencingRadiusMeters}m
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-sky-300 bg-white/10 px-2 py-0.5 rounded-md">
                  <ThumbsUp className="w-3 h-3" />
                  {systemConfig.globalThreshold} Vote
                </span>
              </div>
              {isSidebarCollapsed && (
                <span className="hidden lg:block">
                  <Sliders className="w-5 h-5 text-sky-400" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer: User Profile & Actions */}
        <div className={`relative border-t border-white/10 ${isSidebarCollapsed ? "p-3 space-y-2.5" : "p-4 space-y-3"}`}>
          {/* Floating Small Profile Card right above profile button */}
          {showProfileModal && (
            <>
              {/* Click outside to close */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileModal(false)}
              />

              {/* Compact Floating Profile Popover */}
              <div
                className={`absolute bottom-full mb-2.5 z-50 animate-slideUp bg-[#1E293B] border border-white/15 shadow-2xl rounded-2xl p-4 text-white text-left ${
                  isSidebarCollapsed ? "left-2 w-64" : "left-3 right-3"
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0284C7] to-sky-400 text-white font-extrabold flex items-center justify-center text-xs shadow-md shrink-0">
                      BW
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate leading-tight">Ir. Bambang Wijaya, M.T.</h4>
                      <p className="text-[10px] text-sky-400 font-mono truncate">Super Admin DLH</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Tutup"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px] text-slate-300">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">NIP:</span>
                    <span className="font-mono text-slate-200 font-bold">19880512 201201 1 004</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Instansi:</span>
                    <span className="text-slate-200 font-medium">Dinas Lingkungan Hidup</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Tingkat Akses:</span>
                    <span className="text-[#38BDF8] font-bold">Level 1 (Super Admin)</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold">Aktif</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* User Profile Avatar & Name (Clickable) */}
          <button
            type="button"
            onClick={() => setShowProfileModal(!showProfileModal)}
            className={`w-full flex items-center gap-3 transition-all text-left cursor-pointer group ${
              isSidebarCollapsed
                ? "justify-center p-0 bg-transparent border-0 hover:scale-105"
                : "p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15"
            }`}
            title="Lihat Detail Profil Dinas"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284C7] to-sky-400 text-white font-extrabold flex items-center justify-center text-xs shadow-md group-hover:ring-2 group-hover:ring-sky-400/50 transition-all">
                BW
              </div>
            </div>
            <div className={`flex flex-col min-w-0 flex-1 text-left ${isSidebarCollapsed ? "hidden" : ""}`}>
              <span className="text-xs font-bold text-white truncate leading-tight group-hover:text-sky-300 transition-colors">
                Ir. Bambang Wijaya, M.T.
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate">Super Admin DLH</span>
            </div>
          </button>

          <div className={`grid gap-2 ${isSidebarCollapsed ? "grid-cols-1" : "grid-cols-2"}`}>
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 transition-all"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span className={isSidebarCollapsed ? "hidden" : ""}>Beranda</span>
            </Link>
            <button
              onClick={() => setIsLoggedIn(false)}
              title={isSidebarCollapsed ? "Keluar" : undefined}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className={isSidebarCollapsed ? "hidden" : ""}>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Bento Rounded White/Light Canvas matching image) */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] rounded-none lg:rounded-[32px] border border-slate-200/80 shadow-2xl overflow-hidden min-h-screen lg:min-h-[calc(100vh-28px)]">
        
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-200/80 px-5 sm:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-[#0284C7] hover:bg-slate-200 transition-all cursor-pointer"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeNav === "dashboard" && "Dashboard"}
                {activeNav === "peta" && "Peta Density GIS"}
                {activeNav === "laporan" && "Manajemen Laporan"}
                {activeNav === "cctv" && "CCTV Monitoring"}
                {activeNav === "petugas" && "Tim & Beban Kerja"}
                {activeNav === "audit" && "Audit Log Aktivitas"}
              </h1>
            </div>

            {/* Sidebar Collapse Toggle (Desktop) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-[#0284C7] hover:bg-slate-200 transition-all cursor-pointer"
              aria-label={isSidebarCollapsed ? "Perluas Sidebar" : "Minimalkan Sidebar"}
              title={isSidebarCollapsed ? "Perluas Sidebar" : "Minimalkan Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Avatar in Header (Clickable) */}
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0284C7] to-sky-400 text-white font-extrabold flex items-center justify-center text-xs shadow-sm ring-2 ring-white hover:ring-[#0284C7] hover:scale-105 transition-all cursor-pointer"
              title="Lihat Detail Profil Dinas"
            >
              BW
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY CONTAINER */}
        <div className="p-4 sm:p-7 space-y-6 max-w-7xl w-full mx-auto overflow-y-auto">
          
          {/* ============================================================ */}
          {/* VIEW 1: DASHBOARD UTAMA (BENTO GRID MATCHING REFERENCE IMAGE)*/}
          {/* ============================================================ */}
          {activeNav === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* TOP ROW: 3 COMPACT KPI METRIC CARDS WITH MICRO BAR CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                
                {/* Metric 1: Total Laporan Aktif */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-400">Total Laporan Aktif</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{reports.length}</span>
                      <span className="text-xs font-semibold text-slate-500">Tiket</span>
                    </div>
                    <span className="block text-[10px] font-medium text-emerald-600 mt-1">
                      &#8593; {statusCounts.diproses} dalam penanganan tim
                    </span>
                  </div>
                  <MiniBarChart color="sky" heights={[30, 55, 45, 90, 70]} />
                </div>

                {/* Metric 2: Laporan Terverifikasi */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-400">Terverifikasi</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-red-600 tracking-tight">{statusCounts.terverifikasi}</span>
                      <span className="text-xs font-semibold text-slate-500">antrean DLH</span>
                    </div>
                    <span className="block text-[10px] font-medium text-red-500 mt-1">
                      &#8593; {statusCounts.pending} masih pending
                    </span>
                  </div>
                  <MiniBarChart color="red" heights={[60, 35, 75, 45, 80]} />
                </div>

                {/* Metric 3: Closed-Loop Selesai */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-400">Closed-Loop Selesai</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 tracking-tight">{statusCounts.selesai}</span>
                      <span className="text-xs font-semibold text-slate-500">tiket tertutup</span>
                    </div>
                    <span className="block text-[10px] font-medium text-emerald-600 mt-1">
                      &#8593; {completionPct}% tingkat penyelesaian
                    </span>
                  </div>
                  <MiniBarChart color="emerald" heights={[40, 65, 80, 55, 95]} />
                </div>

              </div>

              {/* MIDDLE ROW: 3 MAIN BENTO WIDGETS (GAUGE, RENEWABLE, SOURCES USAGE) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* WIDGET 1 (Col 1-3): Tingkat Penyelesaian Penanganan (Semi-circle Gauge) */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between items-center text-center">
                  <div className="w-full">
                    <span className="block text-xs font-extrabold text-slate-800">Tingkat Penyelesaian</span>
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight my-2">
                      {completionPct}%
                    </div>
                  </div>

                  <div className="py-2">
                    <SemiCircleGauge value={completionPct} />
                  </div>

                  <div className="w-full pt-2">
                    <span className="block text-[11px] font-medium text-slate-400">
                      {statusCounts.selesai} dari {reports.length} tiket ditutup closed-loop
                    </span>
                  </div>
                </div>

                {/* WIDGET 2 (Col 4-6): Distribusi Status Laporan */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="block text-xs font-extrabold text-slate-800">Distribusi Status Laporan</span>
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-4">
                      {reports.length}
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Pending
                        </span>
                        <span className="font-bold text-slate-800">{statusCounts.pending}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Terverifikasi
                        </span>
                        <span className="font-bold text-slate-800">{statusCounts.terverifikasi}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                          Diproses
                        </span>
                        <span className="font-bold text-slate-800">{statusCounts.diproses}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Selesai (Closed-Loop)
                        </span>
                        <span className="font-bold text-slate-800">{statusCounts.selesai}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveNav("laporan")}
                    className="w-full mt-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Lihat Semua Laporan
                  </button>
                </div>

                {/* WIDGET 3 (Col 7-12): Sebaran Laporan per Wilayah */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-800">Sebaran Laporan per Wilayah</h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 max-w-xs">
                          Distribusi tiket pencemaran berdasarkan wilayah administrasi sungai.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 items-center">
                      <div className="space-y-2">
                        {regionDist.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 font-medium text-slate-600 min-w-0">
                              <span className={`w-2 h-2 rounded-full ${["bg-emerald-500", "bg-teal-500", "bg-sky-500", "bg-amber-500", "bg-indigo-500", "bg-rose-500"][idx % 6]}`} />
                              <span className="truncate">{item.region}</span>
                            </span>
                            <span className="font-bold text-slate-800 ml-2">{item.count}</span>
                          </div>
                        ))}
                      </div>

                      {/* Mini GIS Hotspot Visual Card */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between h-36 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0284C7]/20 rounded-full blur-xl pointer-events-none" />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-300">Hotspot Utama</span>
                          <span className="text-sm font-extrabold text-sky-300">
                            {topUrgentReport ? topUrgentReport.urgencyScore : 0} Poin
                          </span>
                        </div>
                        <div className="mt-auto">
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Urgensi Tertinggi</span>
                          <span className="block text-[11px] font-bold text-white truncate mt-0.5">
                            {topUrgentReport ? topUrgentReport.riverName : "Belum Ada Laporan"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM ROW: 3 BENTO WIDGETS (CLIMATE INDEX, WATER LEVEL, COMMUNITY BANNER) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Bottom Widget 1 (Col 1-4): Total Bobot Urgensi (Dark Pill Card) */}
                <div className="lg:col-span-4 bg-gradient-to-br from-[#0F172A] to-slate-900 text-white rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#0284C7]/40 flex items-center justify-center shrink-0 text-center font-extrabold text-base text-sky-300">
                    {totalUrgency}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-white">Total Bobot Urgensi</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Akumulasi urgency score seluruh tiket penanganan
                    </p>
                  </div>
                </div>

                {/* Bottom Widget 2 (Col 5-7): Petugas DLH Aktif (Light Pill Card) */}
                <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full border-4 border-emerald-500/40 flex items-center justify-center shrink-0 text-center font-extrabold text-xs text-slate-900">
                    {officers.length}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900">Petugas DLH Aktif</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Tim armada terdaftar siap turun lapangan
                    </p>
                  </div>
                </div>

                {/* Bottom Widget 3 (Col 8-12): Komunitas RIVERSE Banner */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#0F172A] text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden flex flex-col justify-between gap-4">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sky-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      RIVERSE
                    </span>
                    <button
                      onClick={() => setActiveNav("laporan")}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Buka Manajemen Laporan"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white tracking-tight">
                      Warga melapor, DLH bertindak
                    </h3>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white/40 flex items-center justify-center text-[10px] font-bold">B</div>
                        <div className="w-7 h-7 rounded-full bg-sky-400 border-2 border-white/40 flex items-center justify-center text-[10px] font-bold">S</div>
                        <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-white/40 flex items-center justify-center text-[10px] font-bold">D</div>
                      </div>
                      <span className="text-xs font-semibold text-sky-100">
                        {totalUpvotes.toLocaleString("id-ID")}+ dukungan warga
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* GIS MAP VIEW EMBEDDED IN DASHBOARD */}
              <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0284C7]" />
                      Peta Spasial GIS Density & Hotspot Sungai
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Visualisasi sebaran titik laporan pencemaran secara interaktif.
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live GIS Active
                  </span>
                </div>

                <RiverGISMap />
              </div>

              {/* RECENT REPORTS TABLE */}
              <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0284C7]" />
                      Ringkasan Antrean Laporan Spasial Terkini
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Menampilkan antrean laporan warga teratas berdasarkan Urgency Score.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNav("laporan")}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
                  >
                    <span>Buka Semua Laporan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 text-[10px]">
                        <th className="py-3 px-4">No. Tiket</th>
                        <th className="py-3 px-4">Segmen Sungai & Lokasi</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4 text-center">Urgency Score</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi Dinas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {reports.slice(dashboardPaging.start, dashboardPaging.end).map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-extrabold text-[#0284C7]">
                            {report.ticketNo}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <span className="block font-bold text-slate-900 truncate">{report.riverName}</span>
                            <span className="block text-[11px] text-slate-500 truncate mt-0.5">{report.locationDetail}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-[10px] font-semibold">
                              {report.categoryLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex flex-col items-center justify-center px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200">
                              <span className="font-extrabold text-xs text-amber-700">{report.urgencyScore}</span>
                              <span className="text-[8px] text-amber-600 font-semibold">{report.upvotes} Upvotes</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {report.status === "pending" && <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">Pending</span>}
                            {report.status === "terverifikasi" && <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200 text-[10px]">Terverifikasi</span>}
                            {report.status === "diproses" && <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[10px]">Diproses</span>}
                            {report.status === "selesai" && <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">Selesai</span>}
                            {report.status === "ditolak" && <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 text-[10px]">Ditolak</span>}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setUpdateStatus(report.status === "selesai" ? "selesai" : "diproses");
                                setAssignedOfficerId(report.assignedOfficerId || "off-3");
                                setOfficerNoteInput(report.officerNote || "");
                                setAfterImagePreview(report.afterImage || null);
                                setShowActionModal(true);
                              }}
                              className="px-3 py-1 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                            >
                              Tindak Lanjuti
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <PaginationControls paging={dashboardPaging} />
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 2: PETA DENSITY GIS PAGE                                */}
          {/* ============================================================ */}
          {activeNav === "peta" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0284C7]" />
                    Peta Spasial GIS Density & Hotspot Pencemaran Sungai
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Visualisasi sebaran koordinat titik laporan pencemaran di seluruh segmen wilayah sungai Jabodetabek.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    GIS Live Server Feed Active
                  </span>
                </div>
              </div>

              {/* Full Interactive Map Container */}
              <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-sm">
                <RiverGISMap />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 3: MANAJEMEN LAPORAN PAGE                               */}
          {/* ============================================================ */}
          {activeNav === "laporan" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0284C7]" />
                    Modul Manajemen & Penanganan Tiket Laporan Spasial
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Kelola antrean tiket warga, disposisi penugasan ke petugas lapangan, serta pembaruan status closed-loop.
                  </p>
                </div>
                <button
                  onClick={handleExportReports}
                  className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor Rekap Laporan (Excel)</span>
                </button>
              </div>

              {/* Full Table Component */}
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">Daftar Antrean Tiket Spasial</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                      {filteredReports.length} Tiket
                    </span>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none">
                    {[
                      { id: "semua", label: "Semua" },
                      { id: "terverifikasi", label: "Terverifikasi" },
                      { id: "diproses", label: "Diproses" },
                      { id: "selesai", label: "Selesai" },
                      { id: "ditolak", label: "Ditolak" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          activeTab === tab.id
                            ? "bg-[#0284C7] text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 text-[11px]">
                        <th className="py-3.5 px-4">No. Tiket</th>
                        <th className="py-3.5 px-4">Segmen Sungai & Lokasi</th>
                        <th className="py-3.5 px-4">Kategori Pencemaran</th>
                        <th className="py-3.5 px-4 text-center">Urgency Score</th>
                        <th className="py-3.5 px-4">Status Penanganan</th>
                        <th className="py-3.5 px-4 text-right">Aksi Dinas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                            Tidak ada laporan yang sesuai dengan filter.
                          </td>
                        </tr>
                      ) : (
                        filteredReports.slice(laporanPaging.start, laporanPaging.end).map((report) => (
                          <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-mono font-extrabold text-[#0284C7]">
                              {report.ticketNo}
                              <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                                {new Date(report.createdAt).toLocaleDateString("id-ID")}
                              </span>
                            </td>
                            <td className="py-4 px-4 max-w-xs">
                              <span className="block font-bold text-slate-900 truncate">{report.riverName}</span>
                              <span className="block text-[11px] text-slate-500 truncate mt-0.5">{report.locationDetail}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-semibold">
                                {report.categoryLabel}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex flex-col items-center justify-center px-3 py-1 rounded-xl bg-amber-50 border border-amber-200">
                                <span className="font-extrabold text-sm text-amber-700">{report.urgencyScore}</span>
                                <span className="text-[9px] text-amber-600 font-semibold">{report.upvotes} Upvotes</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {report.status === "pending" && <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">Pending</span>}
                              {report.status === "terverifikasi" && <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold border border-red-200 text-[11px]">Terverifikasi</span>}
                              {report.status === "diproses" && <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[11px]">Diproses</span>}
                              {report.status === "selesai" && <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">Selesai</span>}
                              {report.status === "ditolak" && <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 text-[11px]">Ditolak</span>}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setUpdateStatus(report.status === "selesai" ? "selesai" : "diproses");
                                    setAssignedOfficerId(report.assignedOfficerId || "off-3");
                                    setOfficerNoteInput(report.officerNote || "");
                                    setAfterImagePreview(report.afterImage || null);
                                    setShowActionModal(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                                >
                                  Tindak Lanjuti
                                </button>
                                {report.status !== "selesai" && report.status !== "ditolak" && (
                                  <button
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setShowRejectModal(true);
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                                    title="Tolak Laporan"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <PaginationControls paging={laporanPaging} />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 4: TIM & BEBAN KERJA PAGE                               */}
          {/* ============================================================ */}
          {activeNav === "petugas" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0284C7]" />
                    Manajemen Tim Armada Lapangan & Beban Kerja DLH
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Pantau daftar petugas aktif, wilayah penugasan, kapasitas penanganan tiket, dan beban kerja armada pembersih sungai.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleExportOfficers}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 font-extrabold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Ekspor Excel</span>
                  </button>
                  <button
                    onClick={() => setShowAddOfficerModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambah Petugas Lapangan</span>
                  </button>
                </div>
              </div>

              {/* Officers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {officers.slice(petugasPaging.start, petugasPaging.end).map((officer) => (
                  <div key={officer.id} className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="space-y-3.5">
                      {/* Avatar & Officer Name */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-sky-400 text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0 font-mono tracking-wider">
                          {getInitials(officer.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-sm text-slate-900 leading-snug truncate" title={officer.name}>{officer.name}</h3>
                          <span className="text-[11px] font-semibold text-slate-400 block font-mono">NIP: {officer.nip}</span>
                        </div>
                      </div>

                      {/* Role Badge Pill */}
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200/80 text-[10px] font-extrabold uppercase tracking-wide">
                          {officer.roleLabel}
                        </span>
                      </div>

                      {/* Details Info */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2 font-medium text-slate-600">
                        <div className="flex justify-between items-center gap-2">
                          <span className="shrink-0 text-slate-500">Wilayah Tugas:</span>
                          <strong className="text-slate-800 font-bold truncate text-right">{officer.region}</strong>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="shrink-0 text-slate-500">Telepon/WA:</span>
                          <strong className="text-slate-800 font-mono font-bold">{officer.phone}</strong>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="shrink-0 text-slate-500">Email Resmi:</span>
                          <strong className="text-slate-800 font-mono text-[11px] truncate max-w-[160px]">{officer.email}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Workload & Performance */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Beban Kerja Aktif</span>
                        <span className="font-mono font-extrabold text-rose-600 text-sm">{officer.activeWorkload} Tiket</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tugas Selesai</span>
                        <span className="font-mono font-extrabold text-emerald-600 text-sm">{officer.completedTasks} Tiket</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls Card */}
              <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/80 shadow-xs">
                <PaginationControls paging={petugasPaging} />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 5: AUDIT LOG AKTIVITAS PAGE                            */}
          {/* ============================================================ */}
          {activeNav === "audit" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-[#0284C7]" />
                    Audit Log Aktivitas & Log Mutasi Tiket Transparan
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Rekam jejak transparan seluruh aksi pengubahan status tiket, disposisi petugas, dan catatan dinas untuk akuntabilitas publik.
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold self-start sm:self-auto">
                  {auditLogs.length} Entri Log Terekam
                </span>
              </div>

              {/* Audit Log Table Container */}
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 text-[11px]">
                        <th className="py-3.5 px-4">Waktu</th>
                        <th className="py-3.5 px-4">No. Tiket</th>
                        <th className="py-3.5 px-4">Aktor / Petugas</th>
                        <th className="py-3.5 px-4">Peran</th>
                        <th className="py-3.5 px-4">Aksi Dinas</th>
                        <th className="py-3.5 px-4">Detail Perubahan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {auditLogs.slice(auditPaging.start, auditPaging.end).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                          <td className="py-4 px-4 font-mono font-extrabold text-[#0284C7] whitespace-nowrap">{log.ticketNo}</td>
                          <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">{log.actorName}</td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-extrabold uppercase whitespace-nowrap">
                              {log.actorRole.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-extrabold text-slate-900 whitespace-nowrap">{log.action}</td>
                          <td className="py-4 px-4 text-slate-600 max-w-sm leading-relaxed">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <PaginationControls paging={auditPaging} />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 6: CCTV MONITORING PAGE                                 */}
          {/* ============================================================ */}
          {activeNav === "cctv" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Manajemen CCTV Monitoring Sungai
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Pantau titik CCTV live di sepanjang alur sungai dan daftarkan titik kamera baru pada peta GIS.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCctvModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Titik CCTV</span>
                </button>
              </div>

              {/* Peta GIS dengan layer CCTV */}
              <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-sm">
                <RiverGISMap
                  onSelectLocation={handleCctvMapSelect}
                  actionLabel="Gunakan Titik Ini"
                />
              </div>

              {/* Daftar Titik CCTV */}
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Daftar Titik CCTV Terdaftar
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {cctvPoints.length} titik kamera memantau alur sungai secara real-time.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {cctvPoints.filter((c) => c.status === "aktif").length} Kamera Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cctvPoints.map((cam) => {
                    const camStatus =
                      cam.status === "aktif"
                        ? { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                        : cam.status === "perbaikan"
                        ? { label: "Perbaikan", cls: "bg-amber-50 text-amber-700 border-amber-200" }
                        : { label: "Offline", cls: "bg-slate-100 text-slate-600 border-slate-300" };
                    return (
                      <div
                        key={cam.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-xs text-slate-900 truncate">{cam.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5">{cam.riverName}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold whitespace-nowrap ${camStatus.cls}`}>
                            {camStatus.label}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{cam.locationDetail}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                            <Crosshair className="w-3.5 h-3.5 shrink-0" />
                            {cam.lat.toFixed(4)}, {cam.lng.toFixed(4)}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setPlayingCctv(cam)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Putar Live
                          </button>
                          <button
                            onClick={() => handleRemoveCctv(cam.id)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all cursor-pointer"
                            title="Hapus Titik CCTV"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* OFFICER ACTION MODAL */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-800">
            
            <div className="p-6 bg-gradient-to-r from-sky-50 via-white to-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-md shadow-sky-200 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Tindak Lanjut Lapangan DLH</h3>
                    <span className="font-mono text-xs font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {selectedReport.ticketNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedReport.riverName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowActionModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAction} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-slate-600">
                  <span>
                    Pelapor Warga:{" "}
                    <strong className="text-slate-900">
                      {selectedReport.isAnonymous ? "Warga Anonim (Privasi Terjaga 🕵️)" : selectedReport.reporterName}
                    </strong>
                  </span>
                  <span>Urgency Score: <strong className="text-amber-600">{selectedReport.urgencyScore} Poin</strong></span>
                </div>
                <div className="text-slate-600">
                  <span>Patokan Lokasi: </span>
                  <span className="font-semibold text-slate-900">{selectedReport.locationDetail}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
                  Update Status Penanganan Lapangan <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUpdateStatus("diproses")}
                    className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      updateStatus === "diproses"
                        ? "bg-sky-50 border-[#0284C7] text-[#0284C7] ring-2 ring-[#0284C7]/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${updateStatus === "diproses" ? "animate-spin" : ""}`} />
                    <span>Dalam Pembersihan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpdateStatus("selesai")}
                    className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      updateStatus === "selesai"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Selesai Clean (Closed-Loop)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Petugas Lapangan Penanggung Jawab
                </label>
                <select
                  value={assignedOfficerId}
                  onChange={(e) => setAssignedOfficerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all outline-none"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.roleLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Bukti Dokumentasi Pembersihan (Before vs After)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold mb-1">Foto Kondisi Awal (Before)</span>
                    <div className="h-32 rounded-2xl overflow-hidden border border-slate-200 relative">
                      <img
                        src={selectedReport.beforeImages[0]}
                        alt="Before"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg";
                        }}
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold">
                        Before (Warga)
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] text-[#0284C7] font-semibold mb-1">Foto Setelah Bersih (After)</span>
                    <div className="h-32 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50/60 flex flex-col items-center justify-center relative cursor-pointer hover:border-[#0284C7] hover:bg-sky-50/30 transition-all">
                      {afterImagePreview ? (
                        <>
                          <img
                            src={afterImagePreview}
                            alt="After Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/sungai/thumb-citarum-563x353.jpg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setAfterImagePreview(null)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setAfterImagePreview(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Camera className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-[11px] font-bold text-[#0284C7]">Unggah Foto After</span>
                          <span className="text-[9px] text-slate-400">Bukti Pembersihan Lapangan</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Catatan Resmi Penanganan Dinas
                </label>
                <textarea
                  rows={3}
                  value={officerNoteInput}
                  onChange={(e) => setOfficerNoteInput(e.target.value)}
                  placeholder="Tuliskan catatan hasil pembersihan (misal: Telah diangkut 2 ton sampah plastik, kondisi sungai kembali lancar...)"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs shadow-xl shadow-[#0284C7]/25 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan Update Status...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Simpan & Publikasikan Update Status</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* REJECT REPORT MODAL (Fitur B.3) */}
      {showRejectModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto p-6 space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Tolak Laporan Warga</h3>
                  <span className="font-mono text-xs font-bold text-[#0284C7]">{selectedReport.ticketNo}</span>
                </div>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReject} className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed font-medium">
                Mengubah status laporan menjadi <strong>Ditolak</strong>. Berikan alasan resmi penolakan yang akan dicatat di audit log.
              </p>

              <div>
                <label className="block font-bold text-slate-900 mb-1.5 uppercase">Alasan Penolakan Resmi <span className="text-rose-500">*</span></label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="Contoh: Laporan duplikat, foto bukti tidak relevan, atau lokasi berada di luar wilayah cakupan..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md"
                >
                  Konfirmasi Penolakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIG MODAL (Fitur B.4) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 text-slate-800 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0284C7]" />
                Konfigurasi Threshold & Geofencing
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="w-7 h-7 rounded-full bg-slate-100">
                <X className="w-4 h-4 mx-auto text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Threshold Vote Global (Auto-Eskalasi)</span>
                  <span className="text-[#0284C7] font-mono">{configThreshold} Vote</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={configThreshold}
                  onChange={(e) => setConfigThreshold(Number(e.target.value))}
                  className="w-full accent-[#0284C7] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Radius Geofencing Cluster (Meter)</span>
                  <span className="text-[#0284C7] font-mono">{configRadius} Meter</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={configRadius}
                  onChange={(e) => setConfigRadius(Number(e.target.value))}
                  className="w-full accent-[#0284C7] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0284C7] text-white font-bold"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL TAMBAH PETUGAS LAPANGAN */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Tambah Petugas Armada DLH</h3>
                <p className="text-xs text-slate-500 font-medium">Registrasi anggota tim baru penugasan wilayah sungai</p>
              </div>
              <button
                onClick={() => setShowAddOfficerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddOfficer} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Nama Lengkap Petugas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Subagja, S.T."
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">NIP / ID Petugas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 19850412 201001 1 009"
                  value={newOfficerNip}
                  onChange={(e) => setNewOfficerNip(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Peran Penugasan</label>
                <select
                  value={newOfficerRole}
                  onChange={(e) => setNewOfficerRole(e.target.value as OfficerRole)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10"
                >
                  <option value="petugas_lapangan">Petugas Lapangan</option>
                  <option value="korwil">Koordinator Wilayah (Korwil)</option>
                  <option value="super_admin">Super Admin DLH</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Wilayah Penugasan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jakarta Selatan / Sungai Ciliwung"
                  value={newOfficerRegion}
                  onChange={(e) => setNewOfficerRegion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="Contoh: 0812-3456-7890"
                  value={newOfficerPhone}
                  onChange={(e) => setNewOfficerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs transition-colors shadow-md shadow-sky-600/20 cursor-pointer"
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH TITIK CCTV */}
      {showAddCctvModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Tambah Titik CCTV
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Klik titik pada peta GIS untuk mengisi koordinat lokasi kamera.
                </p>
              </div>
              <button
                onClick={() => setShowAddCctvModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCctvSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Nama Titik CCTV <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: CCTV Jembatan Polor"
                  value={newCctvName}
                  onChange={(e) => setNewCctvName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Sungai / Segmen</label>
                <select
                  value={newCctvRiver}
                  onChange={(e) => setNewCctvRiver(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#0284C7]"
                >
                  {[
                    "Kali Ciliwung",
                    "Kali Pesanggrahan",
                    "Kali Cisadane",
                    "Kali Angke",
                    "Kali Sunter",
                    "Kali Bekasi",
                    "Banjir Kanal Barat",
                    "Banjir Kanal Timur",
                  ].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Lokasi Detail</label>
                <input
                  type="text"
                  placeholder="Contoh: Jembatan Polor, Kota Tangerang Selatan"
                  value={newCctvLocation}
                  onChange={(e) => setNewCctvLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Latitude <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="-6.3006"
                    value={newCctvLat}
                    onChange={(e) => setNewCctvLat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Longitude <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="106.7400"
                    value={newCctvLng}
                    onChange={(e) => setNewCctvLng(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Status Kamera</label>
                <select
                  value={newCctvStatus}
                  onChange={(e) => setNewCctvStatus(e.target.value as CctvStatus)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="aktif">Aktif</option>
                  <option value="perbaikan">Perbaikan</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">URL Stream Live</label>
                <input
                  type="url"
                  placeholder="https://cctv.dpuprkotang.info/stream.html?src=..."
                  value={newCctvStreamUrl}
                  onChange={(e) => setNewCctvStreamUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCctvModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs transition-colors shadow-md shadow-sky-600/20 cursor-pointer"
                >
                  Simpan Titik CCTV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CCTV Live Player Modal */}
      <CctvPlayerModal cctv={playingCctv} onClose={() => setPlayingCctv(null)} />

    </div>
  );
}
