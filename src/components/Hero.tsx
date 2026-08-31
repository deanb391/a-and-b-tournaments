import Link from "next/link";
import { Bug, ArrowRight, ChevronDown } from "lucide-react";
import SpiderEffect from "./SpiderEffect";

const stats = [
  { value: "20+",  label: "Events Hosted" },
  { value: "500+", label: "Competitors"   },
  { value: "5",    label: "Campuses"      },
  { value: "100%", label: "Free to Join"  },
];

export default function Hero() {
  return (
    <section className="relative bg-navy text-offwhite min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <SpiderEffect />

      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[130%] bg-red rounded-full blur-[160px] opacity-[0.15]" />
        <div className="absolute top-[50%] -left-[20%] w-[45%] h-[90%] bg-red rounded-full blur-[120px] opacity-[0.07]" />

        {/* Checkerboard accents */}
        <div className="absolute right-8 bottom-16 opacity-25 flex flex-wrap w-40 h-40">
          {[...Array(64)].map((_, i) => (
            <div key={i} className={`w-5 h-5 ${(Math.floor(i / 8) + i) % 2 === 0 ? "bg-red" : "bg-transparent"}`} />
          ))}
        </div>
        <div className="absolute left-8 top-24 opacity-10 flex flex-wrap w-24 h-24">
          {[...Array(36)].map((_, i) => (
            <div key={i} className={`w-4 h-4 ${(Math.floor(i / 6) + i) % 2 === 0 ? "bg-offwhite" : "bg-transparent"}`} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-5 relative z-10 flex flex-col items-center text-center pt-8 pb-20">
        {/* Badge pill */}
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 bg-red/10 border border-red/30 rounded-full text-red text-xs font-bold tracking-[0.15em] mb-8">
          <Bug size={13} />
          <span>WELCOME TO THE ARENA</span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-up-1 font-pixel text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-offwhite mb-4 uppercase leading-tight">
          A&amp;B <br className="sm:hidden" />
          <span className="text-red">Tournaments</span>
        </h1>

        {/* Tagline */}
        <p className="animate-fade-up-2 text-2xl sm:text-3xl md:text-4xl font-black text-offwhite uppercase tracking-tight mb-5">
          Let's Compete.
        </p>

        {/* Description */}
        <p className="animate-fade-up-2 text-offwhite/60 max-w-xl mx-auto text-base sm:text-lg mb-10 leading-relaxed">
          Discover competitions, represent your school, and make your mark.
          The ultimate platform for campus tournaments and events.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-3 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/competitions"
            className="group inline-flex items-center justify-center gap-2 bg-red text-white px-8 py-4 font-bold uppercase tracking-wider rounded-sm transition-all hover:shadow-[0_0_28px_rgba(230,57,70,0.5)] hover:-translate-y-1"
          >
            Explore Competitions
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center bg-transparent border-2 border-offwhite/20 text-offwhite/80 px-8 py-4 font-bold uppercase tracking-wider rounded-sm hover:border-offwhite/40 hover:text-offwhite transition-all"
          >
            About A&amp;B
          </Link>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-up-4 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-sm overflow-hidden w-full max-w-2xl">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-navy/80 backdrop-blur px-4 py-4 text-center">
              <div className="text-2xl font-black text-red">{stat.value}</div>
              <div className="text-[11px] font-bold text-offwhite/50 uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll chevron */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-offwhite/30">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
