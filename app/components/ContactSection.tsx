"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Headphones,
  ShieldCheck,
  MessageSquare,
  Building2,
  Sparkles,
} from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    emailOrPhone: "",
    category: "Kerjasama Institusi",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("kontak@riverse.id");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API network call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        emailOrPhone: "",
        category: "Kerjasama Institusi",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <section
      id="kontak"
      className="relative scroll-mt-24 bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:32px_32px] py-20 lg:py-28 overflow-hidden"
    >
      {/* Top & Bottom Gradient Fades for Seamless Section Transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#0284C7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Hubungi Tim RIVERSE & <br className="hidden sm:block" />
            <span className="text-[#0284C7]">Layanan Pengaduan Darurat Sungai</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Punya pertanyaan seputar integrasi sistem GIS, pengawasan dinas, atau ingin menjalin kerjasama jaringan komunitas sungai? Tim kami siap merespon pesan Anda.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* LEFT COLUMN: Contact Cards & Emergency Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Emergency Callout Card */}
            <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0284C7] via-[#0284C7] to-[#0F172A] text-white shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/80 border border-rose-400/50 text-white text-[10px] font-extrabold uppercase tracking-wider w-max mb-4 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Layanan Darurat DLH 24/7
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Pencemaran Limbah B3 / Darurat Sungai?
              </h3>
              <p className="text-xs text-sky-100/90 leading-relaxed mb-6 font-medium">
                Untuk kejadian pencemaran industri mendesak atau tumpahan limbah berbahaya, hubungi saluran siaga Dinas Lingkungan Hidup langsung.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="tel:112"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-white text-[#0284C7] font-extrabold text-sm shadow-md hover:bg-sky-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Phone className="w-4 h-4 text-[#0284C7]" />
                  <span>Call Center 112</span>
                </a>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white font-bold text-sm hover:bg-white/25 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>WhatsApp DLH</span>
                </a>
              </div>
            </div>

            {/* Combined Card: Office Address, Official Email & System Status */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 space-y-5">
              {/* Office Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0F172A]">Kantor Riverse</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                    Universitas Amikom Yogyakarta, Jl. Ring Road Utara, Condongcatur, Depok, Sleman, DIY Yogyakarta 55281.
                  </p>
                </div>
              </div>

              {/* Official Email */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center group-hover:bg-[#0284C7] group-hover:text-white transition-colors flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Resmi</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#0F172A]">kontak@riverse.id</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-[#0284C7]/10 hover:text-[#0284C7] transition-all flex items-center gap-1.5 text-xs font-semibold"
                  title="Salin Email"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold hidden sm:inline">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Office Phone */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center group-hover:bg-[#0284C7] group-hover:text-white transition-colors flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telepon Kantor</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#0F172A]">(0274) 884201</span>
                  </div>
                </div>
                <a
                  href="tel:+62274884201"
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-[#0284C7]/10 hover:text-[#0284C7] transition-all flex items-center gap-1.5 text-xs font-semibold"
                  title="Panggil Nomor Kantor"
                >
                  <span>Panggil</span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-10 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 relative">
            <h3 className="text-2xl font-extrabold text-[#0F172A] mb-2">
              Kirim Pesan atau Pertanyaan
            </h3>
            <p className="text-xs text-slate-600 mb-8 font-medium">
              Isi formulir di bawah ini. Tim teknis dan operasional kami akan membalas pesan Anda dalam kurun waktu 1x24 jam.
            </p>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-extrabold text-emerald-900">
                  Pesan Anda Berhasil Terkirim!
                </h4>
                <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto font-medium">
                  Terima kasih telah menghubungi RIVERSE. Tim kami telah menerima pesan Anda dan akan merespon melalui email atau telepon yang disematkan.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Email/Phone Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Email / Nomor WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.emailOrPhone}
                      onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                      placeholder="email@domain.com / 0812xxx"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Kategori Pesan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all"
                  >
                    <option value="Kerjasama Institusi">Kerjasama Institusi / Dinas DLH</option>
                    <option value="Pertanyaan Warga">Pertanyaan Laporan Warga</option>
                    <option value="Komunitas Peduli Sungai">Kolaborasi Komunitas Peduli Sungai</option>
                    <option value="Media & Press">Media & Publikasi</option>
                    <option value="Masukan Sistem GIS">Masukan Teknis Sistem GIS</option>
                  </select>
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Subjek Pesan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Subjek atau pokok bahasan singkat"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Isi Pesan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pesan, pertanyaan, atau detail pengaduan Anda secara jelas..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#0284C7] text-white font-bold text-sm shadow-lg shadow-[#0284C7]/30 hover:bg-[#0284C7]/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Mengirim Pesan...</span>
                  ) : (
                    <>
                      <span>Kirim Pesan Sekarang</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
