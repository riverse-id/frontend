"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  TrendingUp,
  FileText,
  Camera,
  Trash2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  Download,
  Building2,
  PhoneCall,
  User
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dynamic from "next/dynamic";

const RiverGISMap = dynamic(() => import("../components/RiverGISMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center text-slate-400 font-medium text-xs">
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
  const [reports, setReports] = useState<DinasReportItem[]>(INITIAL_DINAS_REPORTS);
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<DinasReportItem | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);

  // Modal Action Form States
  const [updateStatus, setUpdateStatus] = useState<"diproses" | "selesai">("diproses");
  const [assignedTeamInput, setAssignedTeamInput] = useState<string>("");
  const [officerNoteInput, setOfficerNoteInput] = useState<string>("");
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter Reports based on tab & search query
  const filteredReports = reports.filter((item) => {
    const matchesTab = activeTab === "semua" || item.status === activeTab;
    const matchesSearch =
      item.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.riverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Open Action Modal
  const handleOpenActionModal = (report: DinasReportItem) => {
    setSelectedReport(report);
    setUpdateStatus(report.status === "selesai" ? "selesai" : "diproses");
    setAssignedTeamInput(report.assignedTeam || "Tim Pasukan Oranye Segmen Ciliwung (Armada 01)");
    setOfficerNoteInput(report.officerNote || "");
    setAfterImagePreview(report.afterImage || null);
    setShowActionModal(true);
  };

  // Submit Officer Action Update
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
    }, 800);
  };

  // Handle Image Upload Simulation
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#0284C7] selection:text-white">
      {/* Floating Glassmorphism Navbar */}
      <Navbar />

      {/* ============================================================ */}
      {/* DINAS HEADER DASHBOARD BANNER                                */}
      {/* ============================================================ */}
      <section className="pt-28 sm:pt-32 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284C7] to-sky-600 p-0.5 shadow-xl shadow-sky-900/30 flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-[#38BDF8]">
                <Building2 className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Portal Dinas Lingkungan Hidup (DLH)
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Monitoring GIS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Sistem Tata Kelola Penanganan Limbah Sungai & Penindakan Laporan Warga Spasial
              </p>
            </div>
          </div>

          {/* Officer Credential Badge */}
          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 p-3 px-4 rounded-2xl backdrop-blur-md self-start md:self-auto shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="block font-bold text-white">Ir. Bambang Wijaya, M.T.</span>
              <span className="block text-slate-400 font-mono text-[10px]">NIP. 19880412 201402 1 003 (Kabid DLH)</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* STAT CARDS METRICS SECTION                                    */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-800/90 border border-slate-700/70 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Laporan Masuk</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">1.284</h3>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% minggu ini
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-[#38BDF8] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/70 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Prioritas Terverifikasi</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">42</h3>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">
                Urgency Score ≥ 10
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/70 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Sedang Diproses</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1">18</h3>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">
                Tim Lapangan Active
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/70 p-5 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Penanganan Selesai</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">1.224</h3>
              <span className="text-[11px] text-emerald-400/90 font-semibold block mt-1">
                95.3% Resolution Rate
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* GIS MONITORING MAP SECTION FOR OFFICERS                     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#38BDF8]" />
                Peta Pemantauan Spasial Dinas & Heatmap Prioritas
              </h2>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Visualisasi alur sungai & titik laporan warga untuk disposisi armada pembersihan secara presisi.
              </p>
            </div>
            <Link
              href="/WORKFLOW_DINAS.md"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Lihat SOP Workflow Dinas (.md)</span>
            </Link>
          </div>

          <RiverGISMap />
        </div>
      </section>

      {/* ============================================================ */}
      {/* REPORT QUEUE TABLE & OFFICER ACTIONS                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          
          {/* Controls Bar: Search & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl overflow-x-auto scrollbar-none">
              {[
                { id: "semua", label: "Semua Laporan" },
                { id: "terverifikasi", label: "Prioritas Terverifikasi 🔴" },
                { id: "diproses", label: "Sedang Diproses 🔵" },
                { id: "selesai", label: "Closed-Loop Selesai 🟢" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#0284C7] text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No Tiket / Sungai / Kategori..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>

          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700/80 text-[11px]">
                  <th className="py-3.5 px-4">No. Tiket</th>
                  <th className="py-3.5 px-4">Segmen Sungai & Lokasi</th>
                  <th className="py-3.5 px-4">Kategori Pencemaran</th>
                  <th className="py-3.5 px-4 text-center">Urgency Score</th>
                  <th className="py-3.5 px-4">Status Penanganan</th>
                  <th className="py-3.5 px-4 text-right">Aksi Dinas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                      Tidak ada laporan yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-700/40 transition-colors">
                      
                      {/* Ticket No */}
                      <td className="py-4 px-4 font-mono font-extrabold text-sky-400">
                        {report.ticketNo}
                        <span className="block text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                          {report.timeAgo}
                        </span>
                      </td>

                      {/* River & Location */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="block font-bold text-white truncate">{report.riverName}</span>
                        <span className="block text-[11px] text-slate-400 truncate mt-0.5">{report.locationDetail}</span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-semibold">
                          {report.categoryLabel}
                        </span>
                      </td>

                      {/* Urgency Score */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center justify-center px-3 py-1 rounded-xl bg-slate-900 border border-slate-700">
                          <span className="font-extrabold text-sm text-amber-400">{report.urgencyScore}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{report.upvotes} Upvotes</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {report.status === "terverifikasi" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                            Terverifikasi 🔴
                          </span>
                        )}
                        {report.status === "diproses" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-spin" />
                            Diproses 🔵
                          </span>
                        )}
                        {report.status === "selesai" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Selesai 🟢
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenActionModal(report)}
                          className="px-3.5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ml-auto cursor-pointer"
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
      </section>

      {/* ============================================================ */}
      {/* INTERACTIVE OFFICER ACTION MODAL                              */}
      {/* ============================================================ */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-100">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">Tindak Lanjut Lapangan DLH</h3>
                    <span className="font-mono text-xs font-bold text-sky-400">{selectedReport.ticketNo}</span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedReport.riverName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowActionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveAction} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Report Context Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Pelapor Warga: <strong className="text-white">{selectedReport.reporter}</strong></span>
                  <span>Urgency Score: <strong className="text-amber-400">{selectedReport.urgencyScore} Poin</strong></span>
                </div>
                <div className="text-slate-300">
                  <span>Patokan Lokasi: </span>
                  <span className="font-semibold text-white">{selectedReport.locationDetail}</span>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-extrabold text-white mb-2 uppercase tracking-wider">
                  Update Status Penanganan Lapangan <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUpdateStatus("diproses")}
                    className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      updateStatus === "diproses"
                        ? "bg-sky-500/20 border-sky-400 text-sky-300 ring-2 ring-sky-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
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
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Selesai Clean (Closed-Loop) 🟢</span>
                  </button>
                </div>
              </div>

              {/* Assigned Team */}
              <div>
                <label className="block text-xs font-extrabold text-white mb-1.5 uppercase tracking-wider">
                  Tim Lapangan & Armada Sampah Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={assignedTeamInput}
                  onChange={(e) => setAssignedTeamInput(e.target.value)}
                  placeholder="Contoh: Tim Pasukan Oranye Ciliwung (Armada Truk 04)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              {/* Before vs After Photo Evidence */}
              <div>
                <label className="block text-xs font-extrabold text-white mb-1.5 uppercase tracking-wider">
                  Bukti Dokumentasi Pembersihan (Before vs After)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {/* Before */}
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold mb-1">Foto Kondisi Awal (Before)</span>
                    <div className="h-32 rounded-xl overflow-hidden border border-slate-800 relative">
                      <img src={selectedReport.beforeImage} alt="Before" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-rose-900/90 text-rose-200 text-[10px] font-bold">
                        Before (Laporan Warga)
                      </span>
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <span className="block text-[10px] text-sky-400 font-semibold mb-1">Foto Setelah Bersih (After)</span>
                    <div className="h-32 rounded-xl overflow-hidden border-2 border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center relative cursor-pointer hover:border-sky-400 transition-colors">
                      {afterImagePreview ? (
                        <>
                          <img src={afterImagePreview} alt="After Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setAfterImagePreview(null)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-rose-400 hover:text-white"
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
                          <span className="text-[11px] font-bold text-sky-400">Unggah Foto After</span>
                          <span className="text-[9px] text-slate-500">Bukti Hasil Pembersihan</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Officer Resolution Notes */}
              <div>
                <label className="block text-xs font-extrabold text-white mb-1.5 uppercase tracking-wider">
                  Catatan Resmi Penanganan Dinas
                </label>
                <textarea
                  rows={3}
                  value={officerNoteInput}
                  onChange={(e) => setOfficerNoteInput(e.target.value)}
                  placeholder="Tuliskan catatan hasil pembersihan (misal: Telah diangkut 2 ton sampah plastik, kondisi sungai kembali lancar...)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] resize-none"
                />
              </div>

              {/* Submit Officer Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-extrabold text-xs shadow-xl shadow-sky-900/30 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan Update Status Dinas...</span>
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

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
