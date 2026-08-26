"use client";

import { useEffect, useState } from "react";
import CompetitionCard, { Competition } from "@/components/CompetitionCard";
import { Search, RefreshCw, Plus } from "lucide-react";
import SpiderEffect from "@/components/SpiderEffect";
import { apiClient } from "@/lib/api/client";

export default function CompetitionsPage() {
  const filters = [
    "All", "Esports", "Football", "Basketball", "Chess", "STEM", "Debate", "Music", "Robotics", "Creative"
  ];

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  const fetchCompetitions = async (offset = 0) => {
    try {
      const data = await apiClient.competitions.get(LIMIT, offset);
      if (offset === 0) {
        setCompetitions(data);
      } else {
        setCompetitions(prev => [...prev, ...data]);
      }

      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Failed to fetch competitions:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchCompetitions(0);
  }, []);

  const handleLoadMore = () => {
    setIsFetchingMore(true);
    fetchCompetitions(competitions.length);
  };

  return (
    <div className="bg-offwhite min-h-screen pb-24">
      {/* Header */}
      <section className="relative bg-navy pt-16 pb-24 border-b-4 border-red overflow-hidden">
        <SpiderEffect />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-offwhite uppercase tracking-tight mb-4">
            FIND YOUR <span className="text-red">ARENA</span>
          </h1>
          <p className="text-xl text-offwhite/80 max-w-2xl mx-auto">
            Discover upcoming competitions and find where you belong.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white border-4 border-navy p-4 mb-12 shadow-[8px_8px_0px_#0A192F]">
          
          {/* Search (Optional enhancement) */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" size={20} />
            <input 
              type="text" 
              placeholder="Search competitions..." 
              className="w-full bg-offwhite border-2 border-navy/20 pl-12 pr-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button 
                key={filter}
                className={`shrink-0 px-6 py-2 font-bold uppercase tracking-wider text-sm transition-colors border-2 ${
                  filter === 'All' 
                    ? 'bg-navy text-offwhite border-navy' 
                    : 'bg-transparent text-navy/60 border-navy/20 hover:border-navy hover:text-navy'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && competitions.length === 0 ? (
            <div className="col-span-full text-center py-12 font-bold text-navy/50">
              Loading competitions...
            </div>
          ) : competitions.length === 0 ? (
            <div className="col-span-full text-center py-12 font-bold text-navy/50">
              No competitions found.
            </div>
          ) : (
            competitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && !isLoading && competitions.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="bg-navy text-offwhite font-black uppercase tracking-widest px-8 py-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#FF3366] transition-all border-2 border-navy disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isFetchingMore ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  LOADING...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  LOAD MORE ARENAS
                </>
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
