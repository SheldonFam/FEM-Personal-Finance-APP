"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useSidebarState } from "@/hooks/useSidebarState";

import type { NavItem } from "./types";
import { SidebarDesktop } from "./sidebarDesktop";
import { SidebarMobile } from "./sidebarMobile";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { collapsed, mounted, toggle } = useSidebarState();

  const currentTab = searchParams.get("tab");

  const isActive = (item: NavItem): boolean => {
    // Direct route match
    if (pathname === item.href) return true;

    // For dashboard root, check if we're at /dashboard with no tab
    if (
      pathname === "/dashboard" &&
      item.href === "/dashboard" &&
      currentTab === null
    ) {
      return true;
    }

    // For query param based tabs
    if (
      pathname === "/dashboard" &&
      item.tab !== null &&
      currentTab === item.tab
    ) {
      return true;
    }

    return false;
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <>
        {/* Desktop Sidebar Skeleton */}
        <aside
          className="hidden md:flex flex-col justify-between bg-[#201F24] text-zinc-300 rounded-r-2xl w-[300px]"
          aria-label="Main navigation"
        />
        {/* Mobile Navigation Skeleton */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 bg-[#201F24] border-t border-zinc-800 z-50 h-[72px]"
          aria-label="Mobile navigation"
        />
      </>
    );
  }

  return (
    <>
      <SidebarDesktop
        collapsed={collapsed}
        toggle={toggle}
        isActive={isActive}
      />
      <SidebarMobile isActive={isActive} />
    </>
  );
}
