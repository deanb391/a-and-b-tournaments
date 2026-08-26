export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "DISCOVER",
      desc: "Find a competition that fits your skills and interests.",
    },
    {
      num: "02",
      title: "REGISTER",
      desc: "Enter your details and verify your student status.",
    },
    {
      num: "03",
      title: "COMPETE",
      desc: "Show up, represent your school, and make your mark.",
    },
  ];

  return (
    <section className="py-24 bg-red text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">How It Works</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Three simple steps to enter the arena.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 bg-white/30 -z-0"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-navy border-4 border-white flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="font-pixel text-2xl text-white">{step.num}</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-wider mb-3">{step.title}</h3>
              <p className="text-white/90 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
