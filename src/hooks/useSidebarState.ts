"use client";

import { useState, useTransition } from "react";
import { logger } from "@/lib/logger";

const STORAGE_KEY = "sidebar-collapsed";

/**
 * SSR-safe sidebar state hook
 *
 * Uses optimistic updates with useTransition for smooth interactions
 * Reads initial state from localStorage on mount (client-side only)
 *
 * @param initialCollapsed - Server-provided initial state (from cookie)
 */
export function useSidebarState(initialCollapsed: boolean = true) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(() => {
      const next = !collapsed;
      setCollapsed(next);

      // Persist to localStorage
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch (error) {
        logger.error("Failed to save sidebar state:", error);
      }
    });
  };

  return { collapsed, isPending, toggle };
}
