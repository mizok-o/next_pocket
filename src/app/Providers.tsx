"use client";

import { ToastProvider } from "@/context/ToastContext";
import { SessionProvider } from "next-auth/react";
import type React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
