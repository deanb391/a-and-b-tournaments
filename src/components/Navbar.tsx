"use client";

import { useState } from "react";
import Link from "next/link";
import { Bug, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red/20 bg-navy/90 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-red text-offwhite p-1.5 rounded-sm group-hover:bg-red/90 transition-colors">
            <Bug size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-pixel text-lg leading-none tracking-tighter text-red">A&B</span>
            <span className="text-[10px] font-bold tracking-widest text-offwhite/80 uppercase">Tournaments</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/competitions" className="hover:text-red transition-colors">Competitions</Link>
          <Link href="/about" className="hover:text-red transition-colors">About</Link>
          <Link href="/gallery" className="hover:text-red transition-colors">Gallery</Link>
          <Link href="/partners" className="hover:text-red transition-colors">Partners</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/competitions" 
            className="hidden md:inline-flex bg-red text-white px-6 py-2 font-bold uppercase tracking-wider hover:bg-red/90 transition-colors rounded-sm border-2 border-transparent hover:border-offwhite/20"
          >
            Compete
          </Link>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden text-offwhite hover:text-red transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-navy border-b border-red/20 shadow-xl flex flex-col py-4 px-4 gap-4">
          <Link 
            href="/competitions" 
            className="text-offwhite font-bold uppercase tracking-wider hover:text-red transition-colors py-2 border-b border-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Competitions
          </Link>
          <Link 
            href="/about" 
            className="text-offwhite font-bold uppercase tracking-wider hover:text-red transition-colors py-2 border-b border-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/gallery" 
            className="text-offwhite font-bold uppercase tracking-wider hover:text-red transition-colors py-2 border-b border-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link 
            href="/partners" 
            className="text-offwhite font-bold uppercase tracking-wider hover:text-red transition-colors py-2 border-b border-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Partners
          </Link>
          <Link 
            href="/competitions" 
            className="mt-2 text-center bg-red text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-red/90 transition-colors rounded-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Compete
          </Link>
        </div>
      )}
    </header>
  );
}
