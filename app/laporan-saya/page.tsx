"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ThumbsUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MapPin,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Layers
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReportDetailModal from "../components/ReportDetailModal";
import { MOCK_REPORTS } from "../../lib/store";
import { Report } from "../../lib/types";

export default function LaporanSayaPage() {
  const [activeTab, setActiveTab] = useState<"dibuat" | "didukung">("dibuat");
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filter My Created Reports vs My Voted Reports
  const myCreatedReports = reports.filter((r) => r.reporterName === "Budi Santoso");
  const myVotedReports = reports.filter((r) => r.upvotes > 70);

  const displayedReports = activeTab === "dibuat" ? myCreatedReports : myVotedReports;

  // Pagination (configurable per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const totalPages = Math.ceil(displayedReports.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const pagedReports = displayedReports.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleVote = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              upvotes: r.upvotes + 1,
              urgencyScore: r.urgencyScore + 1,
            }
          : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col selection:bg-[#0284C7] selection:text-white">
      <Navbar />

      {/* Hero Banner Header */}
      <section className="pt-28 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <Link
              href="/#beranda"
              className="inline-flex items-center gap-2 text-xs text-sky-400 font-bold hover:text-sky-300 transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Riwayat Laporan Saya & Dukungan
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Pantau status penanganan laporan pencemaran sungai yang Anda buat atau dukung secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 px-5 rounded-2xl border border-slate-700/80 backdrop-blur-md self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-[#0284C7]/20 text-[#38BDF8] flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-white text-xs">Budi Santoso</span>
              <span className="block text-emerald-400 text-[10px] font-semibold">Warga Terverifikasi (SSO)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-6">
        
        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => {
              setActiveTab("dibuat");
              setCurrentPage(1);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "dibuat"
                ? "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laporan Dibuat ({myCreatedReports.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("didukung");
              setCurrentPage(1);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "didukung"
                ? "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Laporan Didukung ({myVotedReports.length})</span>
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedReports.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 p-8">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-sm text-slate-600">Belum Ada Laporan</p>
              <p className="text-xs text-slate-400 mt-1">Anda belum membuat atau mendukung laporan pada kategori ini.</p>
              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs"
              >
                Buat Laporan Baru Sekarang
              </Link>
            </div>
          ) : (
            pagedReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 relative overflow-hidden bg-slate-100">
                    <img
                      src={report.beforeImages[0]}
                      alt={report.riverName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[10px] font-bold text-[#0284C7] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-sky-100 shadow-xs">
                        {report.ticketNo}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {report.status === "pending" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[10px] shadow-sm">
                          Pending
                        </span>
                      )}
                      {report.status === "terverifikasi" && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] shadow-sm">
                          Terverifikasi
                        </span>
                      )}
                      {report.status === "diproses" && (
                        <span className="px-2.5 py-1 rounded-full bg-sky-600 text-white font-bold text-[10px] shadow-sm">
                          Diproses
                        </span>
                      )}
                      {report.status === "selesai" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] shadow-sm">
                          Selesai
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100 inline-block">
                      {report.categoryLabel}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{report.riverName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {report.locationDetail}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 pt-1 font-medium">"{report.description}"</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {report.upvotes} Vote
                    </span>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {displayedReports.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 flex-wrap">
              <span>
                Menampilkan{" "}
                <strong className="text-slate-800">
                  {displayedReports.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
                  {Math.min(safePage * pageSize, displayedReports.length)}
                </strong>{" "}
                dari <strong className="text-slate-800">{displayedReports.length}</strong> data
              </span>
              <label className="flex items-center gap-1.5">
                <span className="hidden sm:inline text-slate-400">Tampilkan:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer outline-none focus:border-[#0284C7]"
                >
                  {[3, 6, 9, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} / hal.
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    safePage === pageNum
                      ? "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Public Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onVote={handleVote}
        />
      )}

      <Footer />
    </div>
  );
}
