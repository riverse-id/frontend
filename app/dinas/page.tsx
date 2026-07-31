"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Truck,
  History,
  LogOut,
  Search,
  Bell,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  X,
  Camera,
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
  ThumbsUp,
  FileCheck
} from "lucide-react";
import dynamic from "next/dynamic";
import { INITIAL_OFFICERS, MOCK_REPORTS, MOCK_AUDIT_LOGS, INITIAL_SYSTEM_CONFIG } from "../../lib/store";
import { Report, Officer, AuditLog, SystemConfig, OfficerRole, ReportStatus } from "../../lib/types";

const RiverGISMap = dynamic(() => import("../components/RiverGISMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-400 font-medium text-xs">
      Memuat Peta Spasial GIS Dinas...
    </div>
  ),
});

export default function DinasDashboard() {
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);

  // Role Management State
  const [currentRole, setCurrentRole] = useState<OfficerRole>("super_admin");

  // Filters & Search
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("semua");

  // Modals
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);

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

      setReports((prev) =>
        prev.map((item) =>
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
        )
      );

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
    }, 700);
  };

  // Handle Reject Report (Fitur B.3)
  const handleSaveReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !rejectionReasonInput) return;

    setIsSaving(true);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((item) =>
          item.id === selectedReport.id
            ? {
                ...item,
                status: "ditolak",
                rejectionReason: rejectionReasonInput,
                timeline: [
                  ...item.timeline,
                  {
                    status: "ditolak",
                    label: "Laporan Ditolak / Tidak Valid",
                    timestamp: new Date().toLocaleString("id-ID"),
                    actor: "Administrator DLH",
                    note: rejectionReasonInput,
                  },
                ],
              }
            : item
        )
      );

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row selection:bg-[#0284C7] selection:text-white">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col flex-shrink-0 z-30 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0284C7] to-sky-600 p-0.5 shadow-md flex items-center justify-center">
              <Image
                src="/assets/logo.png"
                alt="RIVERSE Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                RIVER<span className="text-[#0284C7]">SE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Portal Dinas DLH</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Links */}
        <div className="p-4 flex-1 space-y-6">
          <div>
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menu Utama Dinas
            </span>
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
                { id: "peta", label: "Peta Density GIS", icon: MapPin },
                { id: "laporan", label: "Manajemen Laporan", icon: FileText },
                { id: "petugas", label: "Tim & Beban Kerja", icon: Users },
                { id: "audit", label: "Audit Log Aktivitas", icon: History },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id);
                      if (item.id === "audit") setShowAuditModal(true);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0284C7] text-white shadow-lg shadow-[#0284C7]/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Fitur B.4 Config Modal Trigger */}
          <div>
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Konfigurasi Sistem
            </span>
            <button
              onClick={() => setShowConfigModal(true)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100/80 transition-all border border-slate-200 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-[#0284C7]" />
                <span>Set Threshold & Radius</span>
              </span>
              <span className="font-mono text-[10px] text-[#0284C7] font-bold">{systemConfig.globalThreshold} Vote</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Pengawasan & Penanganan Sungai
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Dinas Lingkungan Hidup (DLH) Provinsi DKI Jakarta
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher Selector (Fitur B.1) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as OfficerRole)}
                className="bg-white text-xs font-extrabold text-[#0284C7] px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="super_admin">Super Admin</option>
                <option value="korwil">Koordinator Wilayah</option>
                <option value="petugas_lapangan">Petugas Lapangan</option>
              </select>
            </div>

            {/* Export PDF/Excel Button (Fitur B.5) */}
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Ekspor Rekap</span>
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0284C7] to-sky-400 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                BW
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">Ir. Bambang Wijaya, M.T.</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{currentRole.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY CONTAINER */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* TOP HERO & PERLU PERHATIAN SEGERA WIDGET */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* HERO GRADIENT CARD */}
            <div className="lg:col-span-2 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0F172A] text-white p-7 sm:p-8 rounded-[32px] shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-sky-200 text-[11px] font-bold uppercase tracking-wider mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Proses Penanganan Real-Time
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Pengawasan & Pembersihan Sungai Jabodetabek
                </h2>
                <p className="text-xs sm:text-sm text-sky-100/90 mt-2 max-w-xl leading-relaxed font-medium">
                  Monitoring spasial laporan pencemaran warga, koordinasi tim armada sampah lapangan, dan penutupan tiket tertutup.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-sky-200">KPI Response Time DLH (Rata-rata Waktu Selesai)</span>
                  <span className="text-emerald-300 font-mono">4.2 Jam / Laporan</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-300 rounded-full w-[88%]" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                    <span className="block text-[10px] text-sky-200 font-bold uppercase">Total Laporan</span>
                    <span className="text-lg font-extrabold text-white mt-0.5 block">{reports.length}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-center">
                    <span className="block text-[10px] text-rose-200 font-bold uppercase">Terverifikasi</span>
                    <span className="text-lg font-extrabold text-rose-300 mt-0.5 block">
                      {reports.filter((r) => r.status === "terverifikasi").length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-center">
                    <span className="block text-[10px] text-sky-200 font-bold uppercase">Diproses</span>
                    <span className="text-lg font-extrabold text-sky-300 mt-0.5 block">
                      {reports.filter((r) => r.status === "diproses").length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-center">
                    <span className="block text-[10px] text-emerald-200 font-bold uppercase">Selesai</span>
                    <span className="text-lg font-extrabold text-emerald-300 mt-0.5 block">
                      {reports.filter((r) => r.status === "selesai").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* WIDGET PERLU PERHATIAN SEGERA (Fitur B.2) */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block mb-3">
                  ⚠️ Perlu Perhatian Segera
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Laporan Prioritas Tertinggi</h3>
                <p className="text-xs text-slate-500 font-medium">Laporan dengan Urgency Score tertinggi yang menunggu penanganan dinas.</p>

                <div className="space-y-3 mt-4">
                  {urgentReports.map((urgent) => (
                    <div key={urgent.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-[#0284C7]">{urgent.ticketNo}</span>
                        <span className="font-bold text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {urgent.urgencyScore} Poin
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 truncate">{urgent.riverName}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{urgent.locationDetail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab("terverifikasi")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Tinjau Semua Laporan Terverifikasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* MIDDLE: PETA SPASIAL GIS DENSITY HEATMAP */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0284C7]" />
                  Peta Spasial GIS Density & Clustering Marker
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Visualisasi sebaran titik laporan pencemaran (Oranye: Pending, Merah: Terverifikasi, Biru: Diproses, Hijau: Selesai).
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live GIS Feed Active
              </span>
            </div>

            <RiverGISMap />
          </div>

          {/* BOTTOM: TABLE MANAJEMEN LAPORAN & OFFICER ACTIONS */}
          <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Manajemen Laporan Pencemaran Sungai
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Urutan antrean laporan disusun berdasarkan Urgency Score ($W = U + \alpha \times S$).
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none">
                {[
                  { id: "semua", label: "Semua" },
                  { id: "terverifikasi", label: "Terverifikasi 🔴" },
                  { id: "diproses", label: "Diproses 🔵" },
                  { id: "selesai", label: "Selesai 🟢" },
                  { id: "ditolak", label: "Ditolak ⚪" },
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
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
                    filteredReports.map((report) => (
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
                          {report.status === "pending" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                              Pending 🟠
                            </span>
                          )}
                          {report.status === "terverifikasi" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              Terverifikasi 🔴
                            </span>
                          )}
                          {report.status === "diproses" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-spin" />
                              Diproses 🔵
                            </span>
                          )}
                          {report.status === "selesai" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Selesai 🟢
                            </span>
                          )}
                          {report.status === "ditolak" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-bold">
                              Ditolak ⚪
                            </span>
                          )}
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
                              className="px-3 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                            >
                              Tindak Lanjuti
                            </button>

                            {/* Fitur B.3 Reject Button */}
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

          </div>

        </div>
      </main>

      {/* OFFICER ACTION MODAL */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-800">
            
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#0284C7] flex items-center justify-center">
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
                  <span>Pelapor Warga: <strong className="text-slate-900">{selectedReport.reporterName}</strong></span>
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
                    <span>Dalam Pembersihan 🔵</span>
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
                    <span>Selesai Clean (Closed-Loop) 🟢</span>
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
                      <img src={selectedReport.beforeImages[0]} alt="Before" className="w-full h-full object-cover" />
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
                          <img src={afterImagePreview} alt="After Preview" className="w-full h-full object-cover" />
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
                Mengubah status laporan menjadi <strong>Ditolak ⚪</strong>. Berikan alasan resmi penolakan yang akan dicatat di audit log.
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

      {/* AUDIT LOG MODAL (Fitur B.1 Audit Trail) */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 text-slate-800 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-[#0284C7]" />
                Audit Trail Log Aktivitas Petugas DLH
              </h3>
              <button onClick={() => setShowAuditModal(false)} className="w-7 h-7 rounded-full bg-slate-100">
                <X className="w-4 h-4 mx-auto text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{log.details}</p>
                  <div className="text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-200/60">
                    Oleh: {log.actorName} ({log.actorRole}) | Tiket: <span className="font-mono text-[#0284C7]">{log.ticketNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
