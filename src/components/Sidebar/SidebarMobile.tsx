"use client";

import { NAV_ITEMS } from "./nav-items";
import { SidebarNavItem } from "./SidebarNavItem";
import type { SidebarMobileProps } from "./types";

export function SidebarMobile({ isActive }: SidebarMobileProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[#201F24] border-t border-zinc-800 z-50 h-[52px] sm:h-[74px]"
      aria-label="Mobile navigation"
    >
      <ul className="flex justify-around items-center h-full px-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            active={isActive(item)}
            collapsed={false}
            isMobile={true}
          />
        ))}
      </ul>
    </nav>
  );
}
