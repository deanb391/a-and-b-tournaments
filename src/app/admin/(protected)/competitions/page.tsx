"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { Competition } from "@/components/CompetitionCard";

import { useRouter } from "next/navigation";

export default function CompetitionsPage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const LIMIT = 10;

  const fetchCompetitions = async (offset = 0, query = "") => {
    try {
      const data = await apiClient.competitions.get(LIMIT, offset, query);
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
    // Debounce search
    const timer = setTimeout(() => {
      setIsLoading(true);
      fetchCompetitions(0, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    setIsFetchingMore(true);
    fetchCompetitions(competitions.length, searchQuery);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this competition?")) return;

    try {
      await apiClient.competitions.delete(id);
      setCompetitions(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete competition:", error);
      alert("Failed to delete competition");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-navy">Competitions</h1>
          <p className="text-navy/60 font-bold">Manage tournament listings.</p>
        </div>
        <Link
          href="/admin/competitions/create"
          className="bg-red text-offwhite font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0A192F] transition-all border-2 border-red"
        >
          <Plus size={20} />
          Create New
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex bg-white border-4 border-navy shadow-[4px_4px_0px_#0A192F] focus-within:shadow-[6px_6px_0px_#0A192F] transition-shadow">
        <div className="px-4 py-3 flex items-center justify-center text-navy bg-navy/5 border-r-4 border-navy">
          <Search size={24} />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search competitions by title..."
          className="flex-1 px-4 py-3 bg-transparent text-navy font-bold focus:outline-none placeholder:text-navy/30"
        />
      </div>

      <div className="bg-white border-4 border-navy shadow-[6px_6px_0px_#0A192F]">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-4 border-navy bg-navy/5">
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Image</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Title</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Category</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Status</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && competitions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-navy font-bold">
                    Loading competitions...
                  </td>
                </tr>
              ) : competitions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-navy/50 font-bold">
                    No competitions found. Create one!
                  </td>
                </tr>
              ) : (
                competitions.map((comp) => (
                  <tr 
                    key={comp.id} 
                    onClick={() => router.push(`/admin/competitions/${comp.id}`)}
                    className="border-b-2 border-navy/10 hover:bg-navy/5 transition-colors cursor-pointer"
                  >
                    <td className="p-4 w-24">
                      <div className="w-16 h-12 bg-navy/10 overflow-hidden relative border-2 border-navy">
                        <img src={comp.image} alt={comp.title} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-black text-navy">{comp.title}</td>
                    <td className="p-4 font-bold text-navy/70 text-sm">{comp.category}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${comp.status === 'REGISTRATION OPEN' ? 'bg-[#25D366]/20 text-[#128C7E]'
                        : comp.status === 'COMPLETED' ? 'bg-navy/10 text-navy/50'
                          : 'bg-red/10 text-red'
                        }`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/competitions/${comp.id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-navy hover:text-red transition-colors bg-offwhite border-2 border-navy/20 inline-block"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(comp.id);
                        }}
                        className="p-2 text-navy hover:text-red transition-colors bg-offwhite border-2 border-navy/20 inline-block"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMore && !isLoading && competitions.length > 0 && (
          <div className="p-4 border-t-4 border-navy bg-navy/5 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="flex items-center gap-2 font-bold uppercase tracking-wider text-navy hover:text-red transition-colors"
            >
              {isFetchingMore ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {isFetchingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
