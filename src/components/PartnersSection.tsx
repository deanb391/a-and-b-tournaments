import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PartnersSection() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: false });

  const partners = sponsors || [];

  return (
    <section className="py-20 bg-navy text-offwhite border-t-4 border-red">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-offwhite/50 mb-8">Trusted By Our Partners</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
          {partners.map((partner) => (
            <a key={partner.id} href={partner.link} target="_blank" rel="noreferrer" className="text-xl font-black uppercase tracking-widest text-offwhite/40 hover:text-offwhite transition-colors cursor-pointer flex flex-col items-center gap-2">
              <div className="w-24 h-12 relative overflow-hidden flex items-center justify-center">
                <img src={partner.image} alt={partner.name} className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <span className="text-xs">{partner.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
