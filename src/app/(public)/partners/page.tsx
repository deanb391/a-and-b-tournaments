import { Mail } from "lucide-react";
import Image from "next/image";
import SpiderEffect from "@/components/SpiderEffect";
import { createClient } from "@/lib/supabase/server";

interface Sponsor {
  id: string;
  name: string;
  image: string;
  short_description?: string;
  tier?: string;
}

const tierConfig: Record<string, { label: string; border: string; size: string; textSize: string }> = {
  platinum: { label: "Platinum Sponsor", border: "border-yellow-400/50",  size: "w-40 h-40", textSize: "text-2xl" },
  gold:     { label: "Gold Sponsor",     border: "border-yellow-600/40",  size: "w-28 h-28", textSize: "text-xl"  },
  silver:   { label: "Silver Partner",   border: "border-gray-400/40",    size: "w-20 h-20", textSize: "text-lg"  },
  bronze:   { label: "Bronze Partner",   border: "border-orange-700/30",  size: "w-16 h-16", textSize: "text-base"},
};

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: false });

  const allSponsors: Sponsor[] = sponsors || [];

  // Group by tier (fallback: first 2 = platinum, rest = gold)
  const grouped = {
    platinum: allSponsors.filter((s) => s.tier === "platinum" || (!s.tier && allSponsors.indexOf(s) < 2)),
    gold:     allSponsors.filter((s) => s.tier === "gold"     || (!s.tier && allSponsors.indexOf(s) >= 2 && allSponsors.indexOf(s) < 5)),
    silver:   allSponsors.filter((s) => s.tier === "silver"),
    bronze:   allSponsors.filter((s) => s.tier === "bronze"),
  };

  return (
    <div className="bg-offwhite min-h-screen pb-24">
      {/* Header */}
      <section className="relative bg-navy pt-20 pb-20 border-b-4 border-red text-center px-5 overflow-hidden">
        <SpiderEffect />
        <div className="relative z-10 animate-fade-up">
          <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-3">Our Supporters</p>
          <h1 className="text-5xl md:text-7xl font-black text-offwhite uppercase tracking-tight mb-4">
            Backed By The <span className="text-red">Best</span>
          </h1>
          <p className="text-xl text-offwhite/55 font-medium max-w-2xl mx-auto">
            The brands that power our tournaments and support our athletes.
          </p>
        </div>
      </section>

      {/* Tier sections */}
      {(["platinum", "gold", "silver", "bronze"] as const).map((tier) => {
        const group = grouped[tier];
        if (!group.length) return null;
        const cfg = tierConfig[tier];
        return (
          <section key={tier} className="py-16 border-b border-navy/8">
            <div className="container mx-auto px-5">
              <h2 className="text-center font-black uppercase tracking-widest text-navy/30 text-xs mb-10">
                {cfg.label}s
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {group.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className={`bg-white border-2 ${cfg.border} p-8 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(10,25,47,0.08)] hover:-translate-y-2 transition-transform rounded-sm`}
                    style={{ minWidth: 200 }}
                  >
                    <div className={`relative ${cfg.size} rounded-full overflow-hidden border-2 ${cfg.border} mb-4`}>
                      <Image src={sponsor.image} alt={sponsor.name} fill className="object-cover" />
                    </div>
                    <h3 className={`font-black uppercase text-navy ${cfg.textSize}`}>{sponsor.name}</h3>
                    {sponsor.short_description && (
                      <p className="text-navy/50 font-medium text-sm mt-1">{sponsor.short_description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-24 bg-navy text-center">
        <div className="container mx-auto px-5 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-offwhite tracking-tight mb-5">
            Partner With Us
          </h2>
          <p className="text-lg text-offwhite/55 font-medium mb-10 leading-relaxed">
            Reach a highly engaged campus audience. We offer premium placement and activation at all our live events and digital platforms.
          </p>
          <a
            href="mailto:partners@abtournaments.com"
            className="inline-flex items-center gap-3 bg-red text-offwhite font-black uppercase tracking-widest px-10 py-5 text-base rounded-sm hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(230,57,70,0.4)] transition-all"
          >
            <Mail size={20} />
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}
