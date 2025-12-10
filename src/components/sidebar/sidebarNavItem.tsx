"use client";

import Link from "next/link";
import Image from "next/image";
import type { SidebarNavItemProps } from "./types";

export function SidebarNavItem({
  item,
  active,
  collapsed,
  isMobile = false,
}: SidebarNavItemProps) {
  const baseClasses = isMobile
    ? "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors"
    : collapsed
    ? "flex items-center justify-center w-full rounded-r-lg py-4 transition-colors"
    : "flex items-center gap-4 w-full rounded-r-lg py-4 px-8 transition-colors";

  const activeClasses = active
    ? "bg-white text-[#201F24] border-l-4 border-[#277C78]"
    : "text-[#B3B3B3] hover:text-white hover:bg-white/5";

  const labelClasses = isMobile
    ? "text-[10px] font-bold"
    : collapsed
    ? "sr-only"
    : "font-bold text-base";

  return (
    <li className={isMobile ? "" : "w-full"}>
      <Link
        href={item.href}
        className={`${baseClasses} ${activeClasses} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20`}
        aria-current={active ? "page" : undefined}
      >
        <Image
          src={item.icon}
          alt=""
          width={isMobile ? 20 : 24}
          height={isMobile ? 20 : 24}
          className={`flex-shrink-0 ${active ? "brightness-0" : "opacity-80"}`}
        />
        <span className={labelClasses}>{item.label}</span>
      </Link>
    </li>
  );
}
