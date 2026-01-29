"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";

import type { SidebarDesktopProps } from "./types";
import { SidebarNavItem } from "@/components/Sidebar/SidebarNavItem";
import { NAV_ITEMS } from "@/components/Sidebar/nav-items";
import { Button } from "@/components/ui/Button";
import { logout } from "@/services/auth.service";
import { cn } from "@/lib/utils";

export function SidebarDesktop({
  collapsed,
  toggle,
  isActive,
}: SidebarDesktopProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <aside
      className={`hidden md:flex flex-col justify-between bg-[#201F24] text-zinc-300 rounded-r-2xl transition-all duration-300 ${
        collapsed ? "w-[88px]" : "w-[300px]"
      }`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className={`pt-10 pb-8 ${collapsed ? "flex justify-center" : "px-8"}`}
      >
        <div className={`flex items-center ${collapsed ? "" : "h-6"}`}>
          {collapsed ? (
            <Image
              src="/assets/images/logo-small.svg"
              alt="Finance"
              width={14}
              height={22}
              priority
            />
          ) : (
            <Image
              src="/assets/images/logo-large.svg"
              alt="Finance"
              width={122}
              height={22}
              priority
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={collapsed ? "flex-1 flex flex-col px-4" : "flex-1 pr-6"}
        aria-label="Dashboard navigation"
      >
        <ul
          className={collapsed ? "flex flex-col gap-4" : "flex flex-col gap-1"}
        >
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              active={isActive(item)}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div
        className={cn(
          "border-t border-zinc-700 pb-6",
          collapsed ? "pt-4 px-4" : "py-4 px-8"
        )}
      >
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="ghost"
          className={cn(
            "flex items-center transition-colors group cursor-pointer hover:bg-transparent",
            collapsed
              ? "justify-center w-full rounded-r-lg"
              : "gap-4 w-full rounded-r-lg justify-start",
            "text-[#B3B3B3] hover:text-[#F2F2F2]"
          )}
          aria-label="Logout"
        >
          <LogOut
            className="flex-shrink-0 transition-all opacity-80 group-hover:opacity-100 group-hover:brightness-[2.5] w-6 h-6"
            strokeWidth={2.5}
            aria-hidden="true"
          />
          {!collapsed && (
            <span className="font-bold text-base whitespace-nowrap">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </Button>
      </div>

      {/* Minimize Button */}
      <div className={cn("pb-10", collapsed ? "px-4" : "px-8")}>
        <Button
          onClick={toggle}
          variant="ghost"
          className={cn(
            "flex items-center transition-colors group cursor-pointer hover:bg-transparent",
            collapsed
              ? "justify-center w-full rounded-r-lg"
              : "gap-4 w-full rounded-r-lg justify-start pl-0",
            "text-[#B3B3B3] hover:text-[#F2F2F2]"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <Image
            src="/assets/images/icon-minimize-menu.svg"
            alt=""
            width={24}
            height={24}
            className={cn(
              "flex-shrink-0 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:brightness-[2.5]",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && (
            <span className="font-bold text-base whitespace-nowrap">
              Minimize Menu
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
