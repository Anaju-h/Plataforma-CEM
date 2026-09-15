import { useState } from "react";
import { Outlet } from "react-router-dom";

import { InternalHeader } from "../components/internal/InternalHeader";
import { InternalSidebar } from "../components/internal/InternalSidebar";

export function InternalLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#e5eef3]">
      <InternalSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      <div className="min-h-screen lg:pl-[316px]">
        <InternalHeader
          onOpenSidebar={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-7 lg:pb-12">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}