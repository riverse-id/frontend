"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
  ExternalLink
} from "lucide-react";
import dynamic from "next/dynamic";

const RiverGISMap = dynamic(() => import("../components/RiverGISMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-400 font-medium text-xs">
      Memuat Peta Spasial GIS Dinas...
    </div>
  ),
});

interface DinasReportItem {
  id: string;
  ticketNo: string;
  riverName: string;
  category: "sampah" | "limbah-cair" | "bau-warna" | "tanggul";
  categoryLabel: string;
  locationDetail: string;
  lat: number;
  lng: number;
  urgencyScore: number;
  upvotes: number;
  status: "terverifikasi" | "diproses" | "selesai";
  timeAgo: string;
  reporter: string;
  beforeImage: string;
  afterImage?: string;
  officerNote?: string;
  assignedTeam?: string;
}

const INITIAL_DINAS_REPORTS: DinasReportItem[] = [
  {
    id: "rpt-101",
    ticketNo: "DLH-2026-0891",
    riverName: "Kali Ciliwung - Segmen Manggarai",
    category: "limbah-cair",
    categoryLabel: "Limbah Cair Industri",
    locationDetail: "Dekat Pintu Air Manggarai, RT 05/03",
    lat: -6.235,
    lng: 106.854,
    urgencyScore: 142,
    upvotes: 120,
    status: "terverifikasi",
    timeAgo: "15 menit yang lalu",
    reporter: "Budi Santoso",
    beforeImage: "/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg",
  },
  {
    id: "rpt-102",
    ticketNo: "DLH-2026-0885",
    riverName: "Kali Cipinang - Segmen Jatinegara",
    category: "sampah",
    categoryLabel: "Tumpukan Sampah Plastik",
    locationDetail: "Bantaran sungai samping jembatan penyeberangan",
    lat: -6.229,
    lng: 106.876,
    urgencyScore: 210,
    upvotes: 190,
    status: "diproses",
    timeAgo: "45 menit yang lalu",
    reporter: "Siti Rahma",
    beforeImage: "/assets/sungai/20200812-Sungai-Ciliwung-1_ratio-16x9.jpg",
    assignedTeam: "Tim Pasukan Oranye Jatinegara (Armada 04)",
  },
  {
    id: "rpt-103",
    ticketNo: "DLH-2026-0870",
    riverName: "Kali Bekasi - Segmen Bendung Bekasi",
    category: "bau-warna",
    categoryLabel: "Busa & Air Berbau",
    locationDetail: "Hilir Bendung Bekasi, Jalan Mayor Oking",
    lat: -6.23,
    lng: 107.002,
    urgencyScore: 178,
    upvotes: 155,
    status: "terverifikasi",
    timeAgo: "1 jam yang lalu",
    reporter: "Ahmad Hidayat",
    beforeImage: "/assets/sungai/Mengerikan! Ini Penampakan Pencemaran Sungai di Jakarta.jpeg",
  },
  {
    id: "rpt-104",
    ticketNo: "DLH-2026-0842",
    riverName: "Kali Sunter - Segmen Kelapa Gading",
    category: "sampah",
    categoryLabel: "Penyumbatan Sampah Rumah Tangga",
    locationDetail: "Polder Danau Sunter Selatan",
    lat: -6.14,
    lng: 106.872,
    urgencyScore: 95,
    upvotes: 80,
    status: "selesai",
    timeAgo: "Kemarin 16:30 WIB",
    reporter: "Dewi Lestari",
    beforeImage: "/assets/sungai/sungai ciliwung bening.jpg",
    afterImage: "/assets/sungai/sungai ciliwung bening.jpg",
    officerNote: "Telah diangkut 3.2 ton sampah plastik menggunakan 2 unit truk sampah DLH.",
    assignedTeam: "Tim Polder Sunter (Armada 02)",
  },
  {
    id: "rpt-105",
    ticketNo: "DLH-2026-0830",
    riverName: "Cakung Drain - Segmen Jakarta Timur",
    category: "limbah-cair",
    categoryLabel: "Endapan Lumpur & Limbah",
    locationDetail: "Kawasan Industri Pulogadung Hilir",
    lat: -6.18,
    lng: 106.936,
    urgencyScore: 87,
    upvotes: 75,
    status: "diproses",
    timeAgo: "2 jam yang lalu",
    reporter: "Rian Kurniawan",
    beforeImage: "/assets/sungai/Pencemaran Teluk Jakarta oleh Paracetamol.jpg",
    assignedTeam: "Tim Pengerukan Drenase Jaktim",
  },
];

export default function DinasDashboard() {
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [reports, setReports] = useState<DinasReportItem[]>(INITIAL_DINAS_REPORTS);
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<DinasReportItem | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);

  // Officer Action Modal States
  const [updateStatus, setUpdateStatus] = useState<"diproses" | "selesai">("diproses");
  const [assignedTeamInput, setAssignedTeamInput] = useState<string>("");
  const [officerNoteInput, setOfficerNoteInput] = useState<string>("");
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter Reports
  const filteredReports = reports.filter((item) => {
    const matchesTab = activeTab === "semua" || item.status === activeTab;
    const matchesSearch =
      item.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.riverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenActionModal = (report: DinasReportItem) => {
    setSelectedReport(report);
    setUpdateStatus(report.status === "selesai" ? "selesai" : "diproses");
    setAssignedTeamInput(report.assignedTeam || "Tim Pasukan Oranye Segmen Ciliwung (Armada 01)");
    setOfficerNoteInput(report.officerNote || "");
    setAfterImagePreview(report.afterImage || null);
    setShowActionModal(true);
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setIsSaving(true);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((item) =>
          item.id === selectedReport.id
            ? {
                ...item,
                status: updateStatus,
                assignedTeam: assignedTeamInput,
                officerNote: officerNoteInput || "Tindakan pembersihan telah dilaksanakan sesuai SOP DLH.",
                afterImage: afterImagePreview || item.beforeImage,
              }
            : item
        )
      );
      setIsSaving(false);
      setShowActionModal(false);
      setSelectedReport(null);
    }, 700);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row selection:bg-[#0284C7] selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. LEFT SIDEBAR NAVIGATION                                   */}
      {/* ============================================================ */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col flex-shrink-0 z-30 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        {/* Brand Logo & Title */}
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

        {/* Sidebar Menu Items */}
        <div className="p-4 flex-1 space-y-6">
          <div>
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menu Utama Dinas
            </span>
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
                { id: "peta", label: "Peta Spasial GIS", icon: MapPin },
                { id: "laporan", label: "Laporan Prioritas", icon: FileText },
                { id: "armada", label: "Armada & Tim", icon: Truck },
                { id: "riwayat", label: "Riwayat Penanganan", icon: History },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
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

          <div>
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Panduan SOP
            </span>
            <a
              href="/WORKFLOW_DINAS.md"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all border border-slate-200/80"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                <span>Dokumen SOP (.md)</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Sidebar Footer (Logout) */}
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

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT AREA                                         */}
      {/* ============================================================ */}
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
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari laporan atau tiket..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-100 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
              />
            </div>

            {/* Notification Bell */}
            <button className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center relative transition-all cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-2.5 right-2.5 border-2 border-white" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0284C7] to-sky-400 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                BW
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">Ir. Bambang Wijaya, M.T.</span>
                <span className="text-[10px] text-slate-400 font-bold">Kabid Pengawasan DLH</span>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY CONTAINER */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* ============================================================ */}
          {/* TOP SECTION: HERO BLUE CARD + OFFICER CARD                   */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT HERO GRADIENT CARD (Span 2) */}
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
                  Monitoring spasial laporan pencemaran warga, koordinasi tim armada sampah lapangan, dan penutupan tiket tertutup (closed-loop governance).
                </p>
              </div>

              {/* Progress & Stat Counters Grid inside Hero Card */}
              <div className="mt-8 pt-6 border-t border-white/15">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-sky-200">Target Resolution Rate Pembersihan</span>
                  <span className="text-emerald-300 font-mono">95.3% Terpenuhi</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-300 rounded-full w-[95.3%]" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                    <span className="block text-[10px] text-sky-200 font-bold uppercase">Total Laporan</span>
                    <span className="text-lg font-extrabold text-white mt-0.5 block">1.284</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-center">
                    <span className="block text-[10px] text-rose-200 font-bold uppercase">Terverifikasi</span>
                    <span className="text-lg font-extrabold text-rose-300 mt-0.5 block">42</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-center">
                    <span className="block text-[10px] text-sky-200 font-bold uppercase">Diproses</span>
                    <span className="text-lg font-extrabold text-sky-300 mt-0.5 block">18</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-center">
                    <span className="block text-[10px] text-emerald-200 font-bold uppercase">Selesai</span>
                    <span className="text-lg font-extrabold text-emerald-300 mt-0.5 block">1.224</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT OFFICER IN-CHARGE CARD (Span 1) */}
            <div className="bg-white p-7 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col items-center justify-between text-center">
              <div className="w-full flex flex-col items-center">
                <span className="text-[11px] font-extrabold text-[#0284C7] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-100 mb-4">
                  Penanggung Jawab Tugas
                </span>

                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0284C7] to-sky-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-3 border-4 border-white">
                  BW
                </div>

                <h3 className="text-base font-extrabold text-slate-900">Ir. Bambang Wijaya, M.T.</h3>
                <span className="text-xs text-slate-500 font-medium">Kabid Pengawasan Lingkungan</span>
                <span className="font-mono text-[10px] text-slate-400 font-bold mt-0.5">NIP. 19880412 201402 1 003</span>

                <div className="w-full mt-6 space-y-2 text-xs text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2 text-slate-400"><Mail className="w-3.5 h-3.5" /> Email:</span>
                    <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[130px]">bambang@dlh.go.id</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2 text-slate-400"><Phone className="w-3.5 h-3.5" /> Kontak:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">+62 812-3456-7890</span>
                  </div>
                </div>
              </div>

              <div className="w-full pt-4 border-t border-slate-100 mt-4">
                <span className="text-[11px] text-slate-500 font-semibold flex items-center justify-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
                  Dinas Lingkungan Hidup DKI Jakarta
                </span>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* MIDDLE CARD: PETA MONITORING GIS SPASIAL                     */}
          {/* ============================================================ */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0284C7]" />
                  Peta GIS Pemantauan Sungai & Heatmap Spasial
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tinjau lokasi spasial laporan warga dan tentukan posisi pengiriman armada pembersihan.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed GIS active
              </span>
            </div>

            <RiverGISMap />
          </div>

          {/* ============================================================ */}
          {/* BOTTOM CARD: TABLE PRIORITAS LAPORAN WARGA                   */}
          {/* ============================================================ */}
          <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Daftar Antrean & Prioritas Penanganan Laporan
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Urutan laporan otomatis disusun berdasarkan Urgency Score ($W = U + \alpha \times S$).
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none">
                {[
                  { id: "semua", label: "Semua" },
                  { id: "terverifikasi", label: "Terverifikasi 🔴" },
                  { id: "diproses", label: "Diproses 🔵" },
                  { id: "selesai", label: "Selesai 🟢" },
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

            {/* Clean Light Table */}
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
                        
                        {/* Ticket No */}
                        <td className="py-4 px-4 font-mono font-extrabold text-[#0284C7]">
                          {report.ticketNo}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                            {report.timeAgo}
                          </span>
                        </td>

                        {/* River & Location */}
                        <td className="py-4 px-4 max-w-xs">
                          <span className="block font-bold text-slate-900 truncate">{report.riverName}</span>
                          <span className="block text-[11px] text-slate-500 truncate mt-0.5">{report.locationDetail}</span>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-semibold">
                            {report.categoryLabel}
                          </span>
                        </td>

                        {/* Urgency Score */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex flex-col items-center justify-center px-3 py-1 rounded-xl bg-amber-50 border border-amber-200">
                            <span className="font-extrabold text-sm text-amber-700">{report.urgencyScore}</span>
                            <span className="text-[9px] text-amber-600 font-semibold">{report.upvotes} Upvotes</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
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
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Selesai 🟢
                            </span>
                          )}
                        </td>

                        {/* Action Button */}
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleOpenActionModal(report)}
                            className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs transition-all shadow-md shadow-[#0284C7]/20 flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <span>Tindak Lanjuti</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
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

      {/* ============================================================ */}
      {/* OFFICER ACTION MODAL                                         */}
      {/* ============================================================ */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-800">
            
            {/* Modal Header */}
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

            {/* Modal Form */}
            <form onSubmit={handleSaveAction} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Context Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Pelapor Warga: <strong className="text-slate-900">{selectedReport.reporter}</strong></span>
                  <span>Urgency Score: <strong className="text-amber-600">{selectedReport.urgencyScore} Poin</strong></span>
                </div>
                <div className="text-slate-600">
                  <span>Patokan Lokasi: </span>
                  <span className="font-semibold text-slate-900">{selectedReport.locationDetail}</span>
                </div>
              </div>

              {/* Status Update */}
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

              {/* Assigned Team */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Tim Lapangan & Armada Sampah Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={assignedTeamInput}
                  onChange={(e) => setAssignedTeamInput(e.target.value)}
                  placeholder="Contoh: Tim Pasukan Oranye Ciliwung (Armada Truk 04)"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all outline-none"
                />
              </div>

              {/* Before vs After Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Bukti Dokumentasi Pembersihan (Before vs After)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold mb-1">Foto Kondisi Awal (Before)</span>
                    <div className="h-32 rounded-2xl overflow-hidden border border-slate-200 relative">
                      <img src={selectedReport.beforeImage} alt="Before" className="w-full h-full object-cover" />
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
                            onChange={handleImageUpload}
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

              {/* Officer Note */}
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

              {/* Submit */}
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

    </div>
  );
}
