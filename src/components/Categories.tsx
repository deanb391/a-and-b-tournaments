import { Gamepad2, Users, MonitorPlay, BrainCircuit, Rocket, Palette } from "lucide-react";

export default function Categories() {
  const categories = [
    { name: "Esports", icon: <Gamepad2 size={32} /> },
    { name: "Football", icon: <Users size={32} /> },
    { name: "Basketball", icon: <Users size={32} /> },
    { name: "Chess", icon: <BrainCircuit size={32} /> },
    { name: "STEM", icon: <Rocket size={32} /> },
    { name: "Creative", icon: <Palette size={32} /> },
  ];

  return (
    <section className="py-20 bg-navy text-offwhite border-t border-red/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black uppercase tracking-tight text-center mb-12">Discover Your Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="group border border-offwhite/10 hover:border-red bg-navy hover:bg-red/10 p-6 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer rounded-sm"
            >
              <div className="text-red group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="font-bold uppercase tracking-wider text-sm">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
