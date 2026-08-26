import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function GallerySection() {
  const supabase = await createClient();
  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);
  
  const images = gallery || [];

  return (
    <section className="py-24 bg-offwhite text-navy">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">The Arena</h2>
            <p className="text-navy/70 text-lg">Moments from past competitions.</p>
          </div>
          <Link href="/gallery" className="group mt-4 md:mt-0 font-bold uppercase tracking-wider text-red hover:text-navy transition-colors flex items-center gap-2">
            View Gallery
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="aspect-square bg-navy/5 border-2 border-navy/10 flex flex-col items-center justify-center relative overflow-hidden group hover:border-red transition-colors cursor-pointer">
              <img src={img.image} alt={img.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold uppercase tracking-widest text-sm bg-red/90 px-4 py-2">View</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
