"use client";

import React, { useState, useEffect } from "react";
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
  FileCheck,
  ArrowLeft,
  PlusCircle
} from "lucide-react";
import dynamic from "next/dynamic";
import { useToast } from "../components/ToastProvider";
import { INITIAL_OFFICERS, MOCK_REPORTS, MOCK_AUDIT_LOGS, INITIAL_SYSTEM_CONFIG, getStoredReports, saveStoredReports } from "../../lib/store";
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

  // Sync reports with local store
  useEffect(() => {
    setReports(getStoredReports());
    const handleUpdate = () => setReports(getStoredReports());
    window.addEventListener("riverse_reports_updated", handleUpdate);
    return () => window.removeEventListener("riverse_reports_updated", handleUpdate);
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

  // Add Officer Form State
  const [showAddOfficerModal, setShowAddOfficerModal] = useState<boolean>(false);
  const [newOfficerName, setNewOfficerName] = useState<string>("");
  const [newOfficerNip, setNewOfficerNip] = useState<string>("");
  const [newOfficerRole, setNewOfficerRole] = useState<OfficerRole>("petugas_lapangan");
  const [newOfficerRegion, setNewOfficerRegion] = useState<string>("Jakarta Selatan");
  const [newOfficerPhone, setNewOfficerPhone] = useState<string>("");
  const [newOfficerEmail, setNewOfficerEmail] = useState<string>("");

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

  // Render Login View if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans">
        {/* Top & Bottom Gradient Fades for Seamless Transition */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        
        {/* Ambient GIS River Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0284C7]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Navbar Header: Back button on top-left */}
        <header className="relative z-20 p-6 sm:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200/90 text-xs font-bold text-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
            <span>Kembali ke Beranda</span>
          </Link>
        </header>

        {/* Main Login Card */}
        <main className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[36px] sm:rounded-[40px] p-8 sm:p-10 shadow-2xl shadow-slate-200/80 relative">
            
            {/* Big RIVERSE Logo & Brand Header inside Card */}
            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <Image
                src="/assets/logo-new.png"
                alt="RIVERSE Logo"
                width={80}
                height={80}
                className="h-16 sm:h-20 w-auto object-contain mb-3"
                priority
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Portal Dinas & Komando RIVERSE
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
                Masukkan NIP atau ID Petugas untuk mengakses Dashboard Penanganan Sungai Dinas Lingkungan Hidup.
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
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
        </main>

        <footer className="relative z-20 p-6 text-center text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} RIVERSE Platform Monitoring & Pelaporan Sungai — Sistem Informasi Geografis Terintegrasi
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row selection:bg-[#0284C7] selection:text-white">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col flex-shrink-0 z-30 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/assets/logo-new.png"
              alt="RIVERSE Logo"
              width={44}
              height={44}
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#0F172A] leading-none">
                RIVERSE
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">PORTAL DINAS DLH</span>
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
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun Dinas</span>
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
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
          
          {/* ============================================================ */}
          {/* VIEW 1: DASHBOARD UTAMA (HOME)                               */}
          {/* ============================================================ */}
          {activeNav === "dashboard" && (
            <>
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
                      Perlu Perhatian Segera
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
                    onClick={() => setActiveNav("laporan")}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Tinjau Semua Laporan Terverifikasi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* FITUR BARU: PUSAT PINTASAN MENU & PENJELASAN MODAL/FUNGSI */}
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      Pusat Pintasan Menu & Modul Penanganan Sungai
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Pilih pintasan menu di bawah ini untuk mengakses modul kerja atau memahami fungsi masing-masing menu.
                    </p>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 self-start sm:self-auto">
                    5 Modul Operasional Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Shortcut 1: Peta Density GIS */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/50 to-white border border-sky-100 flex flex-col justify-between space-y-3 hover:border-sky-300 transition-all hover:shadow-md group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-md shadow-[#0284C7]/20 group-hover:scale-105 transition-transform">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold text-[#0284C7] bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                          Peta Interactive
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">1. Peta Density GIS</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        <strong>Fungsi & Kegunaan:</strong> Memantau sebaran spasial lokasi pencemaran sungai secara real-time berbasis peta Leaflet interaktif, mendeteksi kluster titik panas (hotspot), dan menganalisis tingkat kepadatan sampah per segmen wilayah sungai.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav("peta")}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-[#0284C7] text-[#0284C7] hover:text-white font-extrabold text-xs border border-sky-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Buka Modul Peta GIS</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shortcut 2: Manajemen Laporan */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-100 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all hover:shadow-md group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {reports.length} Tiket Laporan
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">2. Manajemen Laporan</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        <strong>Fungsi & Kegunaan:</strong> Mengelola antrean tiket laporan warga, melakukan verifikasi lapang, disposisi penugasan ke tim armada DLH, mengunggah foto bukti pembersihan (after clean), serta persetujuan/penolakan tiket.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav("laporan")}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-600 text-emerald-700 hover:text-white font-extrabold text-xs border border-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Buka Manajemen Laporan</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shortcut 3: Tim & Beban Kerja */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/50 to-white border border-purple-100 flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all hover:shadow-md group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200">
                          {officers.length} Petugas DLH
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">3. Tim & Beban Kerja</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        <strong>Fungsi & Kegunaan:</strong> Memantau beban kerja (active workload) seluruh petugas lapangan dan Koordinator Wilayah DLH, membagikan penugasan secara adil, serta mendaftarkan petugas armada baru.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav("petugas")}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-purple-600 text-purple-700 hover:text-white font-extrabold text-xs border border-purple-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Buka Kelola Tim & Beban Kerja</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shortcut 4: Audit Log Aktivitas */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 to-white border border-amber-100 flex flex-col justify-between space-y-3 hover:border-amber-300 transition-all hover:shadow-md group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
                          <History className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-700 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
                          {auditLogs.length} Log Aktivitas
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">4. Audit Log Aktivitas</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        <strong>Fungsi & Kegunaan:</strong> Mengawasi riwayat audit trail perubahan status tiket secara transparan, melacak actor/petugas yang mengubah status, waktu eksekusi, serta catatan tindakan dinas secara akuntabel.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav("audit")}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-amber-600 text-amber-700 hover:text-white font-extrabold text-xs border border-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Buka Audit Log Transparan</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shortcut 5: Konfigurasi Radius & Threshold */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/50 to-white border border-rose-100 flex flex-col justify-between space-y-3 hover:border-rose-300 transition-all hover:shadow-md group md:col-span-2 lg:col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                          <Sliders className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold text-rose-700 bg-white px-2.5 py-0.5 rounded-full border border-rose-200">
                          Geofence: {systemConfig.geofencingRadiusMeters}m | Vote: {systemConfig.globalThreshold}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">5. Konfigurasi Sistem (Smart Geofencing & Vote Escalation)</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        <strong>Fungsi & Kegunaan:</strong> Mengatur batas radius pencocokan otomatis duplikat laporan warga (Smart Geofencing Radius 500 meter), mengubah ambang batas vote eskalasi verifikasi, serta mengaktifkan mode otomatisasi sistem dinas.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowConfigModal(true)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Buka Panel Konfigurasi Radius & Vote</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* MIDDLE: PETA SPASIAL GIS DENSITY HEATMAP */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
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

              {/* RECENT REPORTS OVERVIEW */}
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Ringkasan Antrean Laporan Spasial Terkini
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Menampilkan antrean laporan warga teratas berdasarkan Urgency Score.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNav("laporan")}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
                  >
                    <span>Buka Manajemen Laporan Lengkap</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

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
                      {reports.slice(0, 5).map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-extrabold text-[#0284C7]">
                            {report.ticketNo}
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
                            {report.status === "pending" && <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">Pending 🟠</span>}
                            {report.status === "terverifikasi" && <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">Terverifikasi 🔴</span>}
                            {report.status === "diproses" && <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[11px]">Diproses 🔵</span>}
                            {report.status === "selesai" && <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">Selesai 🟢</span>}
                            {report.status === "ditolak" && <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 text-[11px]">Ditolak ⚪</span>}
                          </td>
                          <td className="py-4 px-4 text-right">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* VIEW 2: PETA DENSITY GIS PAGE                                */}
          {/* ============================================================ */}
          {activeNav === "peta" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
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
              <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 shadow-xs">
                <RiverGISMap />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 3: MANAJEMEN LAPORAN PAGE                               */}
          {/* ============================================================ */}
          {activeNav === "laporan" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    Modul Manajemen & Penanganan Tiket Laporan Spasial
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Kelola antrean tiket warga, disposisi penugasan ke petugas lapangan, serta pembaruan status closed-loop.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor Rekap Laporan</span>
                </button>
              </div>

              {/* Full Table Component */}
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs space-y-6">
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
                              {report.status === "pending" && <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">Pending 🟠</span>}
                              {report.status === "terverifikasi" && <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">Terverifikasi 🔴</span>}
                              {report.status === "diproses" && <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[11px]">Diproses 🔵</span>}
                              {report.status === "selesai" && <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">Selesai 🟢</span>}
                              {report.status === "ditolak" && <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 text-[11px]">Ditolak ⚪</span>}
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
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 4: TIM & BEBAN KERJA PAGE                               */}
          {/* ============================================================ */}
          {activeNav === "petugas" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    Manajemen Tim Armada Lapangan & Beban Kerja DLH
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Pantau daftar petugas aktif, wilayah penugasan, kapasitas penanganan tiket, dan beban kerja armada pembersih sungai.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddOfficerModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Petugas Lapangan</span>
                </button>
              </div>

              {/* Officers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {officers.map((officer) => (
                  <div key={officer.id} className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="space-y-3.5">
                      {/* Avatar & Officer Name */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-purple-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0 font-mono tracking-wider">
                          {getInitials(officer.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-sm text-slate-900 leading-snug truncate" title={officer.name}>{officer.name}</h3>
                          <span className="text-[11px] font-semibold text-slate-400 block font-mono">NIP: {officer.nip}</span>
                        </div>
                      </div>

                      {/* Role Badge Pill */}
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 text-[10px] font-extrabold uppercase tracking-wide">
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
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 5: AUDIT LOG AKTIVITAS PAGE                            */}
          {/* ============================================================ */}
          {activeNav === "audit" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
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
              <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
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
                      {auditLogs.map((log) => (
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
              </div>
            </div>
          )}

        </div>
      </main>

      {/* OFFICER ACTION MODAL */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-800">
            
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Peran Penugasan</label>
                <select
                  value={newOfficerRole}
                  onChange={(e) => setNewOfficerRole(e.target.value as OfficerRole)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="Contoh: 0812-3456-7890"
                  value={newOfficerPhone}
                  onChange={(e) => setNewOfficerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-purple-500"
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
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
