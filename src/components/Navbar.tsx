"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bug, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/competitions", label: "Competitions" },
  { href: "/about",        label: "About"        },
  { href: "/gallery",      label: "Gallery"       },
  { href: "/partners",     label: "Partners"      },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-red/20 bg-navy/95 backdrop-blur-md">
        <div className="container mx-auto px-5 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-red text-offwhite p-1.5 rounded-sm group-hover:bg-red/85 transition-colors">
              <Bug size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel text-base leading-none tracking-tighter text-red">A&B</span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-offwhite/70 uppercase">Tournaments</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-offwhite/70">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors hover:text-offwhite ${
                    isActive ? "text-offwhite" : ""
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Compete CTA */}
            <Link
              href="/competitions"
              className="hidden md:inline-flex items-center bg-red text-white px-5 py-2 font-bold uppercase tracking-wider text-sm rounded-sm border-2 border-transparent transition-all hover:shadow-[0_0_20px_rgba(230,57,70,0.45)] hover:-translate-y-0.5"
            >
              Compete
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-offwhite hover:text-red transition-colors p-2 -mr-2"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Side Drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-navy/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-navy border-r-4 border-red flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsDrawerOpen(false)}>
            <div className="bg-red text-offwhite p-1 rounded-sm">
              <Bug size={18} />
            </div>
            <span className="font-pixel text-sm text-red leading-none">A&B</span>
          </Link>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-offwhite/60 hover:text-offwhite transition-colors p-1"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`flex items-center gap-3 px-4 py-3.5 font-bold uppercase tracking-wider text-sm rounded-sm transition-all ${
                  isActive
                    ? "bg-red/15 text-white border-l-4 border-red pl-3"
                    : "text-offwhite/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent pl-3"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer CTA */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <Link
            href="/competitions"
            onClick={() => setIsDrawerOpen(false)}
            className="w-full bg-red text-white font-black uppercase tracking-widest px-6 py-3.5 text-sm rounded-sm flex items-center justify-center hover:bg-red/90 transition-colors"
          >
            Let's Compete →
          </Link>
        </div>
      </aside>
    </>
  );
}
