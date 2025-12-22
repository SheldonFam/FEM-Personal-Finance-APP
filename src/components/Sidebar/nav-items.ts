import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
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
