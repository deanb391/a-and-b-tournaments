import SpiderEffect from "@/components/SpiderEffect";
import Link from "next/link";
import { Users, Target, Zap } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    { name: "Alex Mercer", role: "Founder & Director" },
    { name: "Sarah Chen", role: "Head of Operations" },
    { name: "Marcus Johnson", role: "Esports Lead" },
    { name: "Elena Rodriguez", role: "Community Manager" },
  ];

  return (
    <div className="bg-offwhite min-h-screen pb-24">
      {/* Header */}
      <section className="relative bg-navy pt-20 pb-28 border-b-4 border-red overflow-hidden">
        <SpiderEffect />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-offwhite uppercase tracking-tight mb-4">
            WHO WE <span className="text-red">ARE</span>
          </h1>
          <p className="text-xl md:text-2xl text-offwhite/80 font-medium max-w-2xl mx-auto">
            The driving force behind the most competitive campus tournaments.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-b-4 border-navy">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black uppercase text-navy mb-6">Our Mission</h2>
              <p className="text-lg text-navy/80 font-medium mb-6 leading-relaxed">
                A&B Tournaments was born out of a simple idea: campus competitions shouldn't feel amateur. We believe that whether you're playing EA FC in a dorm or competing in a 5v5 football final, the experience should be electrifying, premium, and unforgettable.
              </p>
              <p className="text-lg text-navy/80 font-medium leading-relaxed">
                We provide the platform, the organization, and the arena. You provide the talent. Together, we are elevating collegiate esports and physical sports to the next level.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border-4 border-navy p-6 shadow-[8px_8px_0px_#0A192F]">
                <Target size={40} className="text-red mb-4" />
                <h3 className="font-pixel text-lg text-navy mb-2">COMPETITION</h3>
                <p className="text-navy/70 font-medium">Fostering intense, fair, and highly rewarding competitive environments.</p>
              </div>
              <div className="bg-white border-4 border-navy p-6 shadow-[8px_8px_0px_#0A192F] sm:translate-y-8">
                <Users size={40} className="text-red mb-4" />
                <h3 className="font-pixel text-lg text-navy mb-2">COMMUNITY</h3>
                <p className="text-navy/70 font-medium">Building a network of passionate players and fans across campus.</p>
              </div>
              <div className="bg-white border-4 border-navy p-6 shadow-[8px_8px_0px_#0A192F]">
                <Zap size={40} className="text-red mb-4" />
                <h3 className="font-pixel text-lg text-navy mb-2">EXCELLENCE</h3>
                <p className="text-navy/70 font-medium">Delivering premium production value and flawless organization.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 border-b-4 border-navy bg-navy/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase text-navy mb-4">The A&B Team</h2>
            <p className="text-xl text-navy/70 font-medium max-w-2xl mx-auto">
              Meet the organizers working behind the scenes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] group overflow-hidden">
                <div className="aspect-square bg-navy/10 relative">
                  {/* Generic Silhouette Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <Users size={120} className="text-navy" />
                  </div>
                </div>
                <div className="p-6 border-t-4 border-navy bg-white relative z-10">
                  <h3 className="font-black text-xl text-navy uppercase">{member.name}</h3>
                  <p className="font-pixel text-xs text-red mt-2 leading-relaxed">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-red text-offwhite text-center border-t-4 border-navy">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Ready to Compete?</h2>
          <p className="text-xl font-medium mb-10 max-w-2xl mx-auto">
            Stop reading about us. It's time to make your own history in the arena.
          </p>
          <Link 
            href="/competitions"
            className="inline-block bg-navy text-offwhite font-black uppercase tracking-widest px-12 py-5 text-lg hover:-translate-y-1 hover:shadow-[8px_8px_0px_#F1FAEE] transition-all border-4 border-navy"
          >
            VIEW COMPETITIONS
          </Link>
        </div>
      </section>
    </div>
  );
}
