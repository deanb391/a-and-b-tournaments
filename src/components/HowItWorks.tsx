import { Search, UserCheck, Trophy } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <Search size={28} />,
    title: "Discover",
    desc: "Find a competition that fits your skills and interests.",
  },
  {
    num: "02",
    icon: <UserCheck size={28} />,
    title: "Register",
    desc: "Enter your details, verify your email, and you're in.",
  },
  {
    num: "03",
    icon: <Trophy size={28} />,
    title: "Compete",
    desc: "Show up, represent your school, and make your mark.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-red text-white relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="text-center mb-16">
          <p className="text-white/50 font-bold text-xs uppercase tracking-[0.2em] mb-3">Simple Process</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">How It Works</h2>
          <p className="text-white/65 text-base max-w-xl mx-auto">Three simple steps to enter the arena.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              {/* Connector (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-white/20 z-0" />
              )}

              {/* Circle */}
              <div className="relative z-10 w-20 h-20 bg-navy rounded-full border-4 border-white/20 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-white/40 transition-all duration-300">
                <div className="text-white">{step.icon}</div>
                <span className="absolute -top-2 -right-2 bg-white text-red text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="text-xl font-black uppercase tracking-wider mb-2">{step.title}</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
