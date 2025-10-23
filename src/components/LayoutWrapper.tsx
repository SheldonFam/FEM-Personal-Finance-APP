"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Sidebar";

const AUTH_ROUTES = ["/", "/login", "/signup"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[var(--primary-light)]">{children}</div>
    );
  }

  // FIX: Remove outer div, apply flex directly to the wrapper
  return (
    <div className="flex min-h-screen bg-[var(--primary-light)]">
      <Navigation />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
