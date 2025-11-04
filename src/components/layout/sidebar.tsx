"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowUpDown,
  Target,
  Bell,
  Settings,
  CreditCard,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transações",
    href: "/dashboard/transactions",
    icon: ArrowUpDown,
  },
  {
    name: "Metas",
    href: "/dashboard/goals",
    icon: Target,
  },
  {
    name: "Alertas",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    name: "Categorias",
    href: "/dashboard/categories",
    icon: CreditCard,
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-4">
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                  💰
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  FinanceDash
                </span>
              </Link>
            )}
            {isCollapsed && (
              <Link
                href="/dashboard"
                className="flex items-center justify-center w-full"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                  💰
                </div>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 w-full transition-colors",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              <svg
                className={cn(
                  "h-5 w-5 transition-transform",
                  isCollapsed && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              {!isCollapsed && <span>Recolher</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
