"use client";

import Link from "next/link";
import Image from "next/image";
import type { SidebarNavItemProps } from "./types";
import { cn } from "@/lib/utils";

export function SidebarNavItem({
  item,
  active,
  collapsed,
  isMobile = false,
}: SidebarNavItemProps) {
  const linkClasses = cn(
    // Base
    "flex items-center transition-colors group cursor-pointer",

    // Layout variants
    isMobile && "flex-col justify-center gap-1 py-2 px-3 rounded-t-lg",
    !isMobile && collapsed && "justify-center w-full rounded-r-lg py-4",
    !isMobile && !collapsed && "gap-4 w-full rounded-r-lg py-4 px-8",

    // State
    active &&
      `bg-white text-finance-navy border-finance-green ${
        isMobile ? "border-b-4" : "border-l-4"
      }`,
    !active && "text-finance-grey-300 hover:text-finance-grey-100"
  );

  const iconClasses = cn(
    "flex-shrink-0 transition-opacity motion-reduce:transition-none",
    !active && "opacity-80 group-hover:opacity-100 group-hover:brightness-[2.5]"
  );

  const labelClasses = cn(
    "font-bold",
    isMobile && "hidden sm:block",
    !isMobile && collapsed && "sr-only",
    !isMobile && !collapsed && "text-base"
  );
  return (
    <li className={isMobile ? "" : "w-full"}>
      <Link
        href={item.href}
        className={linkClasses}
        aria-current={active ? "page" : undefined}
      >
        <Image
          src={item.icon}
          alt=""
          width={isMobile ? 20 : 24}
          height={isMobile ? 20 : 24}
          className={iconClasses}
          aria-hidden="true"
          style={
            active
              ? {
                  filter:
                    "brightness(0) saturate(100%) invert(28%) sepia(68%) saturate(1070%) hue-rotate(142deg) brightness(93%) contrast(88%)",
                }
              : undefined
          }
        />
        <span className={labelClasses}>{item.label}</span>
      </Link>
    </li>
  );
}
