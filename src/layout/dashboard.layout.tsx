import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar: static width, scroll if overflow */}
        <AppSidebar className="w-56 shrink-0 border-r h-full overflow-y-auto" />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header fixed height */}
          <Header />

          {/* Main content scrollable */}
          <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
            <div className="">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
