"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Trophy, Users, LogOut, Menu, X, Settings, Banknote, Bug,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard",      href: "/admin/dashboard",      icon: <LayoutDashboard size={18} /> },
  { name: "Competitions",   href: "/admin/competitions",   icon: <Trophy size={18} />          },
  { name: "Registrations",  href: "/admin/registrations",  icon: <Users size={18} />           },
  { name: "Payments",       href: "/admin/payments",       icon: <Banknote size={18} />        },
  { name: "Customisations", href: "/admin/customisations", icon: <Settings size={18} />        },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-offwhite overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-navy/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-navy flex flex-col border-r border-red/20 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-white/8 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-red p-1 rounded-sm">
              <Bug size={16} className="text-white" />
            </div>
            <div>
              <p className="font-pixel text-sm text-red leading-none">A&B</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-2 pt-1 pb-0.5 mt-4 mb-1">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] px-3">Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-bold text-sm transition-all ${
                  isActive
                    ? "bg-red/15 text-white border-l-2 border-red"
                    : "text-white/45 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                }`}
              >
                <span className={isActive ? "text-red" : "text-white/30"}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/8 shrink-0">
          <button
            onClick={async () => {
              try {
                const { apiClient } = await import("@/lib/api/client");
                await apiClient.auth.logout();
                window.location.href = "/admin/login";
              } catch (err) {
                console.error(err);
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-bold text-sm text-white/40 hover:bg-red/10 hover:text-red transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-navy text-white h-14 flex items-center px-4 border-b border-red/20 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white/60 hover:text-white transition-colors">
            <Menu size={22} />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <Bug size={15} className="text-red" />
            <span className="font-pixel text-xs text-red">A&B Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
