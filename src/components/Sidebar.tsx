"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// Types
type TabValue = "transactions" | "budgets" | "pots" | "bills";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  tab: TabValue | null;
};

// Constants
const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: "sidebar-collapsed",
} as const;

const COLORS = {
  primary: "#277C78",
  sidebarBg: "#201F24",
  sidebarActiveBg: "#F8F4F0",
  sidebarActiveText: "#201F24",
  sidebarInactiveText: "#B3B3B3",
} as const;

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "/assets/images/icon-nav-overview.svg",
    tab: null,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: "/assets/images/icon-nav-transactions.svg",
    tab: "transactions",
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: "/assets/images/icon-nav-budgets.svg",
    tab: null,
  },
  {
    label: "Pots",
    href: "/pots",
    icon: "/assets/images/icon-nav-pots.svg",
    tab: null,
  },
  {
    label: "Recurring bills",
    href: "/recurring-bills",
    icon: "/assets/images/icon-nav-recurring-bills.svg",
    tab: null,
  },
];

// Custom Hook for Sidebar State
function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    if (stored) {
      setCollapsed(stored === "1");
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SIDEBAR_COLLAPSED,
        next ? "1" : "0"
      );
    } catch (error) {
      console.error("Failed to save sidebar state:", error);
    }
  };

  return { collapsed, mounted, toggleCollapsed };
}

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { collapsed, mounted, toggleCollapsed } = useSidebarState();

  const currentTab = searchParams.get("tab") as TabValue | null;

  const isActiveItem = (item: NavItem) => {
    // Direct route match (e.g., /dashboard/transactions)
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

  // Shared nav items renderer
  const renderNavItems = (isMobile: boolean) => (
    <ul
      className={
        isMobile
          ? "flex items-center justify-around"
          : collapsed
          ? "flex flex-col gap-4"
          : "flex flex-col gap-1"
      }
    >
      {NAV_ITEMS.map((item) => {
        const isActive = isActiveItem(item);

        if (isMobile) {
          // Mobile layout: icon + label below (label shows on tablet, hidden on mobile)
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#201F24] ${
                  isActive
                    ? "text-[#277C78]"
                    : "text-[#B3B3B3] hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={isActive ? "opacity-100" : "opacity-80"}
                />
                <span className="hidden sm:block text-xs font-bold leading-none">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        }

        // Desktop layout: icon + label side by side OR icon only when collapsed
        return (
          <li key={item.label}>
            <Link
              href={item.href}
              className={`relative flex items-center rounded-r-xl transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 ${
                collapsed ? "p-4 justify-between" : "py-4 px-8 gap-4"
              } ${
                isActive
                  ? "bg-[#F8F4F0] text-[#201F24]"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              {isActive && !collapsed && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#277C78] rounded-r"
                  aria-hidden="true"
                />
              )}

              <Image
                src={item.icon}
                alt={collapsed ? item.label : ""}
                width={24}
                height={24}
                className={`flex-shrink-0 ${
                  isActive ? "opacity-100" : "opacity-80"
                }`}
              />

              {!collapsed && (
                <span className="font-bold text-base whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
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

        {/* Desktop Navigation */}
        <nav
          className={collapsed ? "flex-1 flex flex-col px-4" : "flex-1 px-6"}
          aria-label="Dashboard navigation"
        >
          {renderNavItems(false)}
        </nav>

        {/* Minimize Button */}
        <div className={collapsed ? "pb-10 flex justify-center" : "px-6 pb-10"}>
          <button
            onClick={toggleCollapsed}
            className={`flex items-center rounded-r-xl py-4 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 ${
              collapsed ? "p-4 justify-center" : "px-8 gap-4"
            } text-[#B3B3B3] hover:text-white hover:bg-white/5`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <Image
              src="/assets/images/icon-minimize-menu.svg"
              alt=""
              width={24}
              height={24}
              className={`flex-shrink-0 transition-transform duration-300 opacity-80 hover:opacity-100 ${
                collapsed ? "rotate-180" : ""
              }`}
            />

            {!collapsed && (
              <span className="font-bold text-base whitespace-nowrap">
                Minimize Menu
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#201F24] border-t border-zinc-800 z-50"
        aria-label="Mobile navigation"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="px-4 py-2">{renderNavItems(true)}</div>
      </nav>
    </>
  );
}
