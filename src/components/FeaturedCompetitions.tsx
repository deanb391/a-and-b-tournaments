"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompetitionCard, { Competition } from "./CompetitionCard";
import SkeletonCard from "./SkeletonCard";
import { apiClient } from "@/lib/api/client";
import { ArrowRight } from "lucide-react";

export default function FeaturedCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await apiClient.competitions.get(3, 0);
        setCompetitions(data);
      } catch (error) {
        console.error("Failed to fetch featured competitions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  return (
    <section className="py-24 bg-offwhite text-navy relative">
      <div className="container mx-auto px-5">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-4">
          <div>
            <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-2">On The Stage</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-navy">
              Featured Arenas
            </h2>
            <p className="text-navy/50 text-base mt-2">The biggest upcoming tournaments.</p>
          </div>
          <Link
            href="/competitions"
            className="group inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-navy/50 hover:text-red transition-colors shrink-0"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : competitions.length > 0
            ? competitions.map((comp, i) => (
                <CompetitionCard key={comp.id} competition={comp} index={i} />
              ))
            : (
              <div className="col-span-3 text-center py-16 text-navy/40 font-bold">
                No featured competitions right now. Check back soon!
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
