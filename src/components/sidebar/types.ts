export type NavItem = {
  label: string;
  href: string;
  icon: string;
  tab?: string | null;
};

export type SidebarDesktopProps = {
  collapsed: boolean;
  toggle: () => void;
  isActive: (item: NavItem) => boolean;
};

export type SidebarMobileProps = {
  isActive: (item: NavItem) => boolean;
};

export type SidebarNavItemProps = {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  isMobile?: boolean;
};


