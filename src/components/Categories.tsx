import { Gamepad2, Dumbbell, BrainCircuit, Rocket, Palette, MonitorPlay } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Esports",    icon: <Gamepad2 size={28} />,   href: "/competitions?filter=Esports"    },
  { name: "Football",   icon: <Dumbbell size={28} />,   href: "/competitions?filter=Football"   },
  { name: "Basketball", icon: <MonitorPlay size={28} />, href: "/competitions?filter=Basketball" },
  { name: "Chess",      icon: <BrainCircuit size={28} />, href: "/competitions?filter=Chess"   },
  { name: "STEM",       icon: <Rocket size={28} />,     href: "/competitions?filter=STEM"       },
  { name: "Creative",   icon: <Palette size={28} />,    href: "/competitions?filter=Creative"   },
];

export default function Categories() {
  return (
    <section className="py-20 bg-navy text-offwhite border-t border-red/10">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-3">Browse By Sport</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Discover Your Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group border border-white/8 hover:border-red bg-white/[0.03] hover:bg-red/10 p-6 flex flex-col items-center justify-center gap-3 transition-all rounded-sm"
            >
              <div className="text-red group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <span className="font-bold uppercase tracking-wider text-xs text-offwhite/60 group-hover:text-offwhite transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
