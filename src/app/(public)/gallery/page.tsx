"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SpiderEffect from "@/components/SpiderEffect";
import { X, ZoomIn } from "lucide-react";

interface GalleryItem { id: string; image: string; name: string; }

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setItems(d.gallery || d || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Close lightbox with Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="bg-navy min-h-screen text-offwhite pb-24">
      {/* Header */}
      <section className="relative pt-20 pb-16 text-center px-5 overflow-hidden border-b-4 border-red">
        <SpiderEffect />
        <div className="relative z-10 animate-fade-up">
          <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-3">Highlights</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
            The Arena <span className="text-red">In Pictures</span>
          </h1>
          <p className="text-lg text-offwhite/50 max-w-2xl mx-auto">
            Victories, moments, and memories from past tournaments.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="container mx-auto px-5 pt-12">
        {isLoading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[220px] md:auto-rows-[260px] gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton rounded-sm" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-offwhite/30 font-bold">
            No gallery items yet.
          </div>
        ) : (
          /* Grid — 2 cols on mobile, masonry-like on desktop */
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[240px] gap-4">
            {items.map((item, i) => {
              // Span pattern for desktop masonry feel (every 5th spans 2 cols + rows)
              let spanClass = "";
              if (i % 7 === 0) spanClass = "md:col-span-2 md:row-span-2";
              else if (i % 4 === 0) spanClass = "md:row-span-2";

              return (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className={`${spanClass} relative group overflow-hidden rounded-sm border-2 border-white/5 hover:border-red/50 transition-all focus:outline-none focus:ring-2 focus:ring-red`}
                >
                  <Image
                    src={item.image}
                    alt={item.name || "Gallery image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur p-3 rounded-full">
                      <ZoomIn size={24} className="text-white" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[90] bg-navy/95 backdrop-blur-md flex items-center justify-center p-5"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.image}
              alt={lightbox.name || "Gallery image"}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {lightbox.name && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-bold text-sm uppercase tracking-widest">
              {lightbox.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
