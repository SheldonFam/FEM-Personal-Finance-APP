/**
 * Utility for managing sidebar state in an SSR-safe way
 *
 * This module provides functions to read the sidebar state from localStorage
 * on the client side, ensuring no hydration mismatches occur.
 */

import { logger } from "@/lib/logger";

const STORAGE_KEY = "sidebar-collapsed";

/**
 * Gets the initial sidebar collapsed state from localStorage (client-side only)
 *
 * This function is safe to call during render, but will only return
 * a value on the client side after hydration.
 *
 * @returns The collapsed state from localStorage, or the default value
 */
export function getInitialSidebarState(): boolean {
  // Check if we're on the client
  if (typeof window === "undefined") {
    return true; // Default for SSR
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "1";
  } catch (error) {
    logger.error("Failed to read sidebar state:", error);
    return true;
  }
}

/**
 * Saves the sidebar state to localStorage
 *
 * @param collapsed - Whether the sidebar is collapsed
 */
export function saveSidebarState(collapsed: boolean): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch (error) {
    logger.error("Failed to save sidebar state:", error);
  }
}
