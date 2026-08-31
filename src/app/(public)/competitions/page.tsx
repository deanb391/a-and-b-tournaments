"use client";

import { useEffect, useState, useMemo } from "react";
import CompetitionCard, { Competition } from "@/components/CompetitionCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, RefreshCw, Plus, Swords } from "lucide-react";
import SpiderEffect from "@/components/SpiderEffect";
import { apiClient } from "@/lib/api/client";

const FILTERS = ["All", "Esports", "Football", "Basketball", "Chess", "STEM", "Debate", "Music", "Robotics", "Creative"];
const LIMIT = 30;

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchCompetitions = async (offset = 0) => {
    try {
      const data = await apiClient.competitions.get(LIMIT, offset);
      if (offset === 0) {
        setCompetitions(data);
      } else {
        setCompetitions(prev => [...prev, ...data]);
      }
      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.error("Failed to fetch competitions:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => { fetchCompetitions(0); }, []);

  const handleLoadMore = () => {
    setIsFetchingMore(true);
    fetchCompetitions(competitions.length);
  };

  // Client-side filter + search
  const filtered = useMemo(() => {
    return competitions.filter((c) => {
      const matchesFilter = activeFilter === "All" || c.category?.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [competitions, activeFilter, search]);

  return (
    <div className="bg-offwhite min-h-screen pb-24">
      {/* Header */}
      <section className="relative bg-navy pt-20 pb-28 border-b-4 border-red overflow-hidden">
        <SpiderEffect />
        <div className="container mx-auto px-5 text-center relative z-10 animate-fade-up">
          <p className="text-red font-bold text-xs uppercase tracking-[0.2em] mb-3">All Tournaments</p>
          <h1 className="text-5xl md:text-7xl font-black text-offwhite uppercase tracking-tight mb-4">
            Find Your <span className="text-red">Arena</span>
          </h1>
          <p className="text-lg text-offwhite/60 max-w-xl mx-auto">
            Discover upcoming competitions and find where you belong.
          </p>
        </div>
      </section>

      {/* Search + Filter bar */}
      <section className="container mx-auto px-5 -mt-7 relative z-10">
        <div className="bg-white border-2 border-navy/10 shadow-[0_8px_32px_rgba(10,25,47,0.10)] rounded-sm p-4 mb-10">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search competitions..."
              className="w-full bg-offwhite/60 border border-navy/10 rounded-sm pl-11 pr-4 py-3 text-sm font-medium text-navy placeholder:text-navy/30 focus:outline-none focus:border-red transition-colors"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-4 py-1.5 font-bold uppercase tracking-wider text-xs rounded-full transition-all ${
                  activeFilter === filter
                    ? "bg-navy text-offwhite shadow-[0_2px_8px_rgba(10,25,47,0.3)]"
                    : "bg-navy/5 text-navy/50 hover:bg-navy/10 hover:text-navy"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm font-bold text-navy/40 uppercase tracking-wider mb-6">
            {filtered.length} {filtered.length === 1 ? "Arena" : "Arenas"} found
            {activeFilter !== "All" && ` in ${activeFilter}`}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <Swords size={48} className="text-navy/15 mb-4" />
              <p className="text-navy/40 font-bold text-lg">No arenas found</p>
              <p className="text-navy/30 text-sm mt-1">Try a different filter or search term</p>
              <button
                onClick={() => { setSearch(""); setActiveFilter("All"); }}
                className="mt-4 text-red font-bold text-sm uppercase tracking-wider hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((comp, i) => (
              <CompetitionCard key={comp.id} competition={comp} index={i} />
            ))
          )}
        </div>

        {/* Load more */}
        {hasMore && !isLoading && filtered.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="bg-navy text-offwhite font-black uppercase tracking-widest px-8 py-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(10,25,47,0.25)] transition-all rounded-sm disabled:opacity-60"
            >
              {isFetchingMore ? (
                <><RefreshCw size={18} className="animate-spin" />Loading...</>
              ) : (
                <><Plus size={18} />Load More Arenas</>
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
