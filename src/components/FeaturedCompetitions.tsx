"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompetitionCard, { Competition } from "./CompetitionCard";
import { apiClient } from "@/lib/api/client";

export default function FeaturedCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await apiClient.competitions.get(3, 0); // Fetch top 3 latest
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
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-navy pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">Featured Arenas</h2>
            <p className="text-navy/70 text-lg">The biggest upcoming tournaments.</p>
          </div>
          <Link href="/competitions" className="group mt-4 md:mt-0 font-bold uppercase tracking-wider text-red hover:text-navy transition-colors flex items-center gap-2">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 text-center py-12 font-bold text-navy/50">
              Loading featured competitions...
            </div>
          ) : competitions.length > 0 ? (
            competitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 font-bold text-navy/50">
              No featured competitions available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
