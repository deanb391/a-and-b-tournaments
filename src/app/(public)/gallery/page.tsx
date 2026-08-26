import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  const galleryItems = gallery || [];

  const images = galleryItems.map((item, index) => {
    let size = "small";
    if (index % 5 === 0) size = "large";
    else if (index % 3 === 0) size = "medium";

    return {
      src: item.image,
      alt: item.name,
      size
    };
  });

  return (
    <div className="bg-navy min-h-screen text-offwhite pb-24">
      {/* Header */}
      <section className="pt-20 pb-16 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
          THE <span className="text-red">ARENA</span> IN PICTURES
        </h1>
        <p className="text-xl md:text-2xl text-offwhite/70 font-medium max-w-2xl mx-auto">
          Highlights, victories, and unforgettable moments from past tournaments.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4">
        {/* CSS Grid for Masonry-like Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-6">
          {images.map((img, i) => {
            // Determine span based on predefined 'size' for a dynamic look
            let spanClass = "col-span-1 row-span-1";
            if (img.size === "large") spanClass = "md:col-span-2 md:row-span-2";
            if (img.size === "medium") spanClass = "col-span-1 md:row-span-2";

            return (
              <div 
                key={i} 
                className={`${spanClass} relative group border-4 border-navy bg-navy/50 overflow-hidden shadow-[8px_8px_0px_#E63946]`}
              >
                <Image 
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Red Overlay on Hover */}
                <div className="absolute inset-0 bg-red/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="font-pixel text-white text-sm md:text-base tracking-widest uppercase text-center px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.alt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
