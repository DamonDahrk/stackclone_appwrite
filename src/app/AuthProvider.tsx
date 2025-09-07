"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/Auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { verifySession, hydrated } = useAuthStore();

  useEffect(() => {
    const loggedOut = localStorage.getItem("loggedOut");
    if (!hydrated && !loggedOut) {
      verifySession();
    }
  }, [hydrated, verifySession]);

  // Optional loading state until hydration
  if (!hydrated) {
    return <div className="h-screen flex items-center justify-center">Loading…</div>;
  }

  return <>{children}</>;
}
