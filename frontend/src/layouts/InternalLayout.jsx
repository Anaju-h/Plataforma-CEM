import { Outlet } from "react-router-dom";

import { InternalHeader } from "../components/internal/InternalHeader";
import { InternalSidebar } from "../components/internal/InternalSidebar";

export function InternalLayout() {
  return (
    <div className="min-h-screen bg-[#edf2f5]">
      <InternalSidebar />

      <div className="lg:pl-[280px]">
        <InternalHeader />

        <main className="px-5 py-6 sm:px-7 lg:px-9 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}