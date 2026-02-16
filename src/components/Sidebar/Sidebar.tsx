"use client";

import { usePathname } from "next/navigation";
import { useSidebarState } from "@/hooks/useSidebarState";
import type { NavItem } from "@/components/Sidebar/types";
import { SidebarDesktop } from "@/components/Sidebar/SidebarDesktop";
import { SidebarMobile } from "@/components/Sidebar/SidebarMobile";
import { useCallback, useState } from "react";
import { getInitialSidebarState } from "@/lib/sidebarState";

export default function Sidebar() {
  const pathname = usePathname();

  // Use lazy initializer to read localStorage once on mount (SSR-safe)
  const [initialCollapsed] = useState(getInitialSidebarState);

  const { collapsed, toggle } = useSidebarState(initialCollapsed);

  const isActive = useCallback(
    (item: NavItem): boolean => {
      return pathname === item.href;
    },
    [pathname]
  );

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
