import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  tab?: string | null;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "/assets/images/icon-nav-overview.svg",
    tab: null,
  },
  {
    label: "Transactions",
    href: "/dashboard?tab=transactions",
    icon: "/assets/images/icon-nav-transactions.svg",
    tab: "transactions",
  },
  {
    label: "Budgets",
    href: "/dashboard?tab=budgets",
    icon: "/assets/images/icon-nav-budgets.svg",
    tab: "budgets",
  },
  {
    label: "Pots",
    href: "/dashboard?tab=pots",
    icon: "/assets/images/icon-nav-pots.svg",
    tab: "pots",
  },
  {
    label: "Recurring bills",
    href: "/dashboard?tab=bills",
    icon: "/assets/images/icon-nav-recurring-bills.svg",
    tab: "bills",
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("sidebar-collapsed");
    if (stored) {
      setCollapsed(stored === "1");
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
    } catch (error) {
      console.error("Failed to save sidebar state:", error);
    }
  };

  const currentTab = searchParams.get("tab");

  const isActiveItem = (item: NavItem) => {
    if (pathname !== "/dashboard") return false;
    if (item.tab === null) return currentTab === null;
    return currentTab === item.tab;
  };

  // Shared nav items renderer
  const renderNavItems = (isMobile: boolean) => (
    <ul
      className={
        isMobile ? "flex items-center justify-around" : "flex flex-col gap-1"
      }
    >
      {NAV_ITEMS.map((item) => {
        const isActive = isActiveItem(item);

        if (isMobile) {
          // Mobile layout: icon + label below
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive ? "text-[#277C78]" : "text-[#B3B3B3]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className={isActive ? "opacity-100" : "opacity-80"}
                />
                <span className="text-xs font-bold leading-none">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        }

        // Desktop layout: icon + label side by side
        return (
          <li key={item.label}>
            <Link
              href={item.href}
              className={`relative flex items-center gap-4 rounded-r-xl py-4 transition-colors ${
                collapsed ? "px-6 justify-center" : "px-8"
              } ${
                isActive
                  ? "bg-[#F8F4F0] text-[#201F24]"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#277C78] rounded-r"
                  aria-hidden="true"
                />
              )}

              <Image
                src={item.icon}
                alt=""
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
        <div className={`${collapsed ? "px-6" : "px-8"} pt-10 pb-8`}>
          <div className="flex items-center h-6">
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
        <nav className="flex-1 px-6" aria-label="Dashboard navigation">
          {renderNavItems(false)}
        </nav>

        {/* Minimize Button */}
        <div className="px-6 pb-10">
          <button
            onClick={toggleCollapsed}
            className={`flex items-center gap-4 rounded-r-xl py-4 text-[#B3B3B3] hover:text-white transition-colors ${
              collapsed ? "px-6 justify-center" : "px-8"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <Image
              src="/assets/images/icon-minimize-menu.svg"
              alt=""
              width={24}
              height={24}
              className={`flex-shrink-0 transition-transform duration-300 ${
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
