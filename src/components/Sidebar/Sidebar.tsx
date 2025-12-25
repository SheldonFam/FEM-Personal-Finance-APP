"use client";

import { usePathname } from "next/navigation";
import { useSidebarState } from "@/hooks/useSidebarState";
import type { NavItem } from "@/components/Sidebar/types";
import { SidebarDesktop } from "@/components/Sidebar/SidebarDesktop";
import { SidebarMobile } from "@/components/Sidebar/SidebarMobile";
import { useCallback } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mounted, toggle } = useSidebarState();

  const isActive = useCallback(
    (item: NavItem): boolean => {
      return pathname === item.href;
    },
    [pathname]
  );

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <>
        {/* Desktop Sidebar Skeleton */}
        <aside
          className="hidden md:flex flex-col justify-between bg-[#201F24] text-zinc-300 rounded-r-2xl w-[88px]"
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
