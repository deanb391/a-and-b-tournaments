"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Users, LogOut, Menu, X, Settings, Banknote } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Competitions", href: "/admin/competitions", icon: <Trophy size={20} /> },
    { name: "Registrations", href: "/admin/registrations", icon: <Users size={20} /> },
    { name: "Payments", href: "/admin/payments", icon: <Banknote size={20} /> },
    { name: "Customisations", href: "/admin/customisations", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-offwhite overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-navy text-offwhite border-r-4 border-red transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b-2 border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-pixel text-lg text-white">A&B</h1>
            <p className="text-red font-bold text-sm tracking-widest">ADMIN PORTAL</p>
          </div>
          <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wider transition-all border-l-4 ${
                  isActive 
                    ? "bg-white/10 border-red text-white" 
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-white/10">
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
            className="w-full flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wider text-red hover:bg-red/10 transition-colors text-left"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar (Mobile only) */}
        <header className="lg:hidden bg-navy text-white h-16 flex items-center px-4 border-b-4 border-red shrink-0">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="ml-4 font-pixel text-sm text-red">A&B ADMIN</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
