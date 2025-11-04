"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      // Mobile: toggle open/close
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      // Desktop: toggle collapsed/expanded
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
