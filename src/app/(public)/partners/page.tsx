import Link from "next/link";
import { Mail } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: false });

  const allSponsors = sponsors || [];
  
  // For demonstration, use the first 2 as Title Sponsors
  const titleSponsors = allSponsors.slice(0, 2).map(s => ({
    name: s.name,
    img: s.image,
    desc: s.short_description
  }));

  const partners = allSponsors.slice(2).map(s => ({
    name: s.name,
    img: s.image
  }));

  return (
    <div className="bg-offwhite min-h-screen pb-24">
      {/* Header */}
      <section className="bg-navy pt-20 pb-16 border-b-4 border-red text-center px-4 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute -top-[50%] -left-[10%] w-[40%] h-[200%] bg-red rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[150%] bg-red rounded-full blur-[100px] opacity-10"></div>
        
        <h1 className="text-5xl md:text-7xl font-black text-offwhite uppercase tracking-tight mb-4 relative z-10">
          BACKED BY THE <span className="text-red">BEST</span>
        </h1>
        <p className="text-xl md:text-2xl text-offwhite/70 font-medium max-w-2xl mx-auto relative z-10">
          The brands that power our tournaments and support our athletes.
        </p>
      </section>

      {/* Title Sponsors */}
      <section className="py-20 border-b-4 border-navy">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-pixel text-red mb-10 text-center">Title Sponsors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {titleSponsors.map((sponsor, i) => (
              <div key={i} className="bg-white border-4 border-navy p-10 flex flex-col items-center text-center shadow-[8px_8px_0px_#0A192F] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#E63946] transition-all duration-300">
                <div className="w-32 h-32 relative mb-6 rounded-full overflow-hidden border-4 border-navy">
                  <Image src={sponsor.img} alt={sponsor.name} fill className="object-cover" />
                </div>
                <h3 className="text-3xl font-black uppercase text-navy mb-2">{sponsor.name}</h3>
                <p className="text-navy/60 font-bold uppercase tracking-widest">{sponsor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting Partners */}
      <section className="py-20 bg-navy/5 border-b-4 border-navy">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-pixel text-red mb-10 text-center">Supporting Partners</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {partners.map((partner, i) => (
              <div key={i} className="bg-white border-4 border-navy p-6 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#0A192F]">
                <div className="w-24 h-24 relative mb-4 rounded-full overflow-hidden border-2 border-navy">
                  <Image src={partner.img} alt={partner.name} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-black uppercase text-navy">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-24 bg-navy text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-offwhite tracking-tight mb-6">
            Partner With Us
          </h2>
          <p className="text-lg text-offwhite/80 font-medium mb-10 leading-relaxed">
            Want to reach a highly engaged, energetic campus audience? We offer premium placement and activation opportunities at all our live events and digital platforms.
          </p>
          <a 
            href="mailto:partners@abtournaments.com"
            className="inline-flex items-center gap-3 bg-red text-offwhite font-black uppercase tracking-widest px-10 py-5 text-lg hover:-translate-y-1 hover:shadow-[8px_8px_0px_#F1FAEE] transition-all border-4 border-red"
          >
            <Mail size={24} />
            GET IN TOUCH
          </a>
        </div>
      </section>

    </div>
  );
}
