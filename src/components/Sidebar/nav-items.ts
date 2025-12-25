import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "/assets/images/icon-nav-overview.svg",
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: "/assets/images/icon-nav-transactions.svg",
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: "/assets/images/icon-nav-budgets.svg",
  },
  {
    label: "Pots",
    href: "/pots",
    icon: "/assets/images/icon-nav-pots.svg",
  },
  {
    label: "Recurring bills",
    href: "/recurring-bills",
    icon: "/assets/images/icon-nav-recurring-bills.svg",
  },
];
