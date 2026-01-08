"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";

const AUTH_ROUTES = ["/", "/login", "/signup", "/forgot-password"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);
  const [mounted, setMounted] = useState(false);
  const [skeletonCollapsed, setSkeletonCollapsed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    setSkeletonCollapsed(stored === null ? true : stored === "true");
    setMounted(true);
  }, []);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[var(--primary-light)]">{children}</div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--primary-light)]">
      <Suspense
        fallback={
          mounted ? (
            <div
              className={`hidden md:block bg-[#201F24] rounded-r-2xl transition-all duration-300 ${
                skeletonCollapsed ? "w-[88px]" : "w-[300px]"
              }`}
            >
              <div className="animate-pulse p-4">
                <div className="h-8 bg-gray-700 rounded mb-6"></div>
                <div className="space-y-2">
                  <div className="h-12 bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block w-[88px] bg-[#201F24] rounded-r-2xl" />
          )
        }
      >
        <Sidebar />
      </Suspense>
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
