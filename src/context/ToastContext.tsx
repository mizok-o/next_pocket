"use client";

import { SimpleToast } from "@/components/SimpleToast";
import { type ReactNode, createContext, useContext, useState } from "react";

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showSuccess = (message: string) => {
    setToast({ type: "success", message });
  };

  const showError = (message: string) => {
    setToast({ type: "error", message });
  };

  const showInfo = (message: string) => {
    setToast({ type: "info", message });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      {toast && (
        <SimpleToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
