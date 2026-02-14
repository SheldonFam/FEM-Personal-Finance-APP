"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { SidebarNavItem } from "./SidebarNavItem";
import type { SidebarMobileProps } from "./types";
import { Button } from "@/components/ui/Button";
import { logout } from "@/services/auth.service";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

export function SidebarMobile({ isActive }: SidebarMobileProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      logger.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

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

        {/* Logout Icon */}
        <li className="flex items-center">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="ghost"
            className={cn(
              "flex-col gap-1 py-2 px-3 rounded-t-lg transition-colors group hover:bg-transparent",
              "text-[#B3B3B3] hover:text-[#F2F2F2]"
            )}
            aria-label="Logout"
          >
            <LogOut
              className="flex-shrink-0 transition-all opacity-80 group-hover:opacity-100 group-hover:brightness-[2.5] w-5 h-5"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold hidden sm:block">
              {isLoggingOut ? "..." : "Logout"}
            </span>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
