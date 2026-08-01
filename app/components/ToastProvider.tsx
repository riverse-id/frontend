"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type?: "success" | "info" | "error";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "info" | "error", duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type, duration };

    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container in bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-[calc(100vw-3rem)]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto p-4 rounded-2xl bg-white border border-slate-200/90 text-slate-900 shadow-2xl flex items-start gap-3.5 overflow-hidden relative"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                  toast.type === "error"
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : toast.type === "info"
                    ? "bg-sky-50 border-sky-200 text-[#0284C7]"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600"
                }`}
              >
                {toast.type === "error" ? (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                ) : toast.type === "info" ? (
                  <Info className="w-5 h-5 text-[#0284C7]" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>

              <div className="flex-1 pr-1">
                <span className="text-xs font-semibold text-slate-800 leading-relaxed block">
                  {toast.message}
                </span>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                title="Tutup Notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
