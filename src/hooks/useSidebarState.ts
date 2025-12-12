"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebar-collapsed";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCollapsed(stored === "1");
    }
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch (error) {
      console.error("Failed to save sidebar state:", error);
    }
  };

  return { collapsed, mounted, toggle };
}
