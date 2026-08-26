import Link from "next/link";
import { Bug, ArrowRight } from "lucide-react";
import SpiderEffect from "./SpiderEffect";

export default function Hero() {
  return (
    <section className="relative bg-navy text-offwhite min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <SpiderEffect />
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[140%] bg-red rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-[40%] -left-[20%] w-[50%] h-[100%] bg-red rounded-full blur-[120px] opacity-10"></div>
        
        {/* Checkerboard pattern */}
        <div className="absolute right-10 bottom-10 opacity-30 flex flex-wrap w-48 h-48">
          {[...Array(64)].map((_, i) => (
            <div key={i} className={`w-6 h-6 ${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-red' : 'bg-transparent'}`}></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red/10 border border-red/30 rounded-full text-red text-sm font-bold tracking-widest mb-8">
          <Bug size={16} />
          <span>WELCOME TO THE ARENA</span>
        </div>
        
        <h1 className="font-pixel text-4xl md:text-6xl lg:text-7xl text-offwhite mb-6 uppercase leading-tight">
          A&B <br /> <span className="text-red">Tournaments</span>
        </h1>
        
        <p className="text-3xl md:text-5xl font-black text-offwhite uppercase tracking-tight mb-8">
          Let's Compete.
        </p>
        
        <p className="text-offwhite/70 max-w-2xl mx-auto text-lg mb-12">
          Discover competitions, represent your school, and make your mark. 
          The ultimate platform for campus tournaments and events.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/competitions" 
            className="group inline-flex items-center justify-center gap-2 bg-red text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-red/90 transition-all rounded-sm"
          >
            Explore Competitions
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/about" 
            className="inline-flex items-center justify-center bg-transparent border-2 border-offwhite/20 text-offwhite px-8 py-4 font-bold uppercase tracking-wider hover:bg-offwhite/10 transition-colors rounded-sm"
          >
            About A&B
          </Link>
        </div>
      </div>
    </section>
  );
}
