import SpiderEffect from "@/components/SpiderEffect";
import Link from "next/link";
import { Target, Users, Zap, ArrowRight } from "lucide-react";

const teamMembers = [
  { name: "Alex Mercer",      role: "Founder & Director",  color: "bg-red"    },
  { name: "Sarah Chen",       role: "Head of Operations",  color: "bg-navy"   },
  { name: "Marcus Johnson",   role: "Esports Lead",        color: "bg-red/80" },
  { name: "Elena Rodriguez",  role: "Community Manager",   color: "bg-navy/70"},
];

const values = [
  { icon: <Target size={32} />,  title: "Competition", desc: "Fostering intense, fair, and highly rewarding competitive environments." },
  { icon: <Users size={32} />,   title: "Community",   desc: "Building a network of passionate players and fans across campus."      },
  { icon: <Zap size={32} />,     title: "Excellence",  desc: "Delivering premium production value and flawless organization."         },
];

function InitialsAvatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`${color} w-full aspect-square flex items-center justify-center`}>
      <span className="text-white font-black text-5xl md:text-6xl tracking-tight">{initials}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-offwhite min-h-screen pb-24">
      {/* Header */}
      <section className="relative bg-navy pt-20 pb-28 border-b-4 border-red overflow-hidden">
        <SpiderEffect />
        <div className="container mx-auto px-5 text-center relative z-10 animate-fade-up">
          <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-3">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-black text-offwhite uppercase tracking-tight mb-4">
            Who We <span className="text-red">Are</span>
          </h1>
          <p className="text-xl md:text-2xl text-offwhite/60 font-medium max-w-2xl mx-auto">
            The driving force behind the most competitive campus tournaments.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-b border-navy/8">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-3">Our Purpose</p>
              <h2 className="text-4xl font-black uppercase text-navy mb-6">Our Mission</h2>
              <p className="text-base text-navy/65 font-medium mb-5 leading-relaxed border-l-4 border-red pl-5">
                A&B Tournaments was born out of a simple idea: campus competitions shouldn't feel amateur. 
                We believe that whether you're playing EA FC in a dorm or competing in a 5v5 football final, 
                the experience should be electrifying, premium, and unforgettable.
              </p>
              <p className="text-base text-navy/65 font-medium leading-relaxed border-l-4 border-navy/20 pl-5">
                We provide the platform, the organization, and the arena. You provide the talent. 
                Together, we are elevating collegiate esports and physical sports to the next level.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((v, i) => (
                <div
                  key={v.title}
                  className={`bg-white border border-navy/10 p-6 shadow-[0_8px_24px_rgba(10,25,47,0.08)] rounded-sm hover:-translate-y-1 transition-transform animate-fade-up-${Math.min(i + 1, 4)} ${
                    i === 2 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="text-red mb-3">{v.icon}</div>
                  <h3 className="font-black text-lg text-navy uppercase mb-2">{v.title}</h3>
                  <p className="text-navy/55 text-sm font-medium leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-b border-navy/8">
        <div className="container mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-3">The People</p>
            <h2 className="text-4xl font-black uppercase text-navy mb-3">The A&B Team</h2>
            <p className="text-lg text-navy/50 font-medium max-w-xl mx-auto">
              Meet the organizers working behind the scenes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={member.name}
                className={`bg-white border border-navy/10 shadow-[0_8px_24px_rgba(10,25,47,0.08)] overflow-hidden rounded-sm hover:-translate-y-2 transition-transform animate-fade-up-${Math.min(i + 1, 4)}`}
              >
                <InitialsAvatar name={member.name} color={member.color} />
                <div className="p-4 border-t border-navy/8">
                  <h3 className="font-black text-base text-navy uppercase leading-tight">{member.name}</h3>
                  <p className="text-red text-xs font-bold mt-1 tracking-wide">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy text-offwhite text-center">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-5">
            Ready to Compete?
          </h2>
          <p className="text-xl text-offwhite/55 font-medium mb-10 max-w-2xl mx-auto">
            Stop reading about us. It's time to make your own history in the arena.
          </p>
          <Link
            href="/competitions"
            className="inline-flex items-center gap-2 bg-red text-white font-black uppercase tracking-widest px-10 py-5 text-base rounded-sm hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(230,57,70,0.4)] transition-all"
          >
            View Competitions
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
