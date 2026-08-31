"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, RefreshCw, Search, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const LIMIT = 10;

  const fetchCompetitions = async (offset = 0, query = "") => {
    try {
      const data = await apiClient.competitions.get(LIMIT, offset, query);
      if (offset === 0) {
        setCompetitions(data);
      } else {
        setCompetitions((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.error("Failed to fetch competitions:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
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
    try {
      await apiClient.competitions.delete(id);
      setCompetitions((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete competition:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up" style={{ marginBottom: 70 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" >
        <div>
          <h1 className="text-3xl font-black uppercase text-navy tracking-tight">Competitions</h1>
          <p className="text-navy/45 font-medium text-sm mt-1">Manage tournament listings.</p>
        </div>
        <Link
          href="/admin/competitions/create"
          className="bg-red text-offwhite font-black uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(230,57,70,0.35)] transition-all rounded-sm text-sm shrink-0"
        >
          <Plus size={18} />
          Create New
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex bg-white border border-navy/12 rounded-sm shadow-sm overflow-hidden">
        <div className="px-4 flex items-center justify-center text-navy/30 border-r border-navy/10">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search competitions by title..."
          className="flex-1 px-4 py-3 bg-transparent text-navy font-medium text-sm focus:outline-none placeholder:text-navy/25"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b border-navy/8 bg-navy/[0.02]">
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Image</th>
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Title</th>
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em] hidden sm:table-cell">Category</th>
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Status</th>
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && competitions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-navy/35 font-bold text-sm">
                    Loading competitions...
                  </td>
                </tr>
              ) : competitions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-navy/30 font-bold text-sm">
                    No competitions found. Create one!
                  </td>
                </tr>
              ) : (
                competitions.map((comp) => (
                  <>
                    <tr
                      key={comp.id}
                      className={`border-b border-navy/[0.05] transition-colors group ${deletingId === comp.id
                        ? "bg-red/5"
                        : "hover:bg-navy/[0.02]"
                        }`}
                    >
                      <td className="p-0 w-20">
                        <Link href={`/admin/competitions/${comp.id}`} className="block px-5 py-3 w-full h-full">
                          <div className="w-14 h-10 bg-navy/8 overflow-hidden relative rounded-sm border border-navy/10">
                            {comp.image && (
                              <Image src={comp.image} alt={comp.title} fill className="object-cover" />
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="p-0">
                        <Link href={`/admin/competitions/${comp.id}`} className="flex items-center px-5 py-3 font-bold text-navy text-sm w-full h-full">
                          {comp.title}
                        </Link>
                      </td>
                      <td className="p-0 hidden sm:table-cell">
                        <Link href={`/admin/competitions/${comp.id}`} className="flex items-center px-5 py-3 font-medium text-navy/55 text-xs w-full h-full">
                          {comp.category}
                        </Link>
                      </td>
                      <td className="p-0">
                        <Link href={`/admin/competitions/${comp.id}`} className="flex items-center px-5 py-3 w-full h-full">
                          <span className={`px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full ${comp.status === "REGISTRATION OPEN"
                            ? "bg-green-50 text-green-600"
                            : comp.status === "COMPLETED"
                              ? "bg-navy/5 text-navy/40"
                              : "bg-red/8 text-red"
                            }`}>
                            {comp.status}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/competitions/${comp.id}/edit`}
                            className="p-1.5 text-navy/40 hover:text-navy border border-navy/10 rounded-sm hover:border-navy/30 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingId(comp.id);
                            }}
                            className="p-1.5 text-navy/40 hover:text-red border border-navy/10 rounded-sm hover:border-red/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline delete confirmation row */}
                    {deletingId === comp.id && (
                      <tr key={`${comp.id}-confirm`} className="bg-red/5 border-b border-red/10">
                        <td colSpan={5} className="px-5 py-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <AlertTriangle size={16} className="text-red shrink-0" />
                            <p className="text-red font-bold text-sm flex-1">
                              Delete <span className="underline">{comp.title}</span>? This cannot be undone.
                            </p>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleDelete(comp.id)}
                                className="bg-red text-white font-black uppercase text-xs tracking-wider px-4 py-2 rounded-sm hover:bg-red/90 transition-colors"
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="bg-white border border-navy/15 text-navy/60 font-black uppercase text-xs tracking-wider px-4 py-2 rounded-sm hover:border-navy/30 transition-colors flex items-center gap-1"
                              >
                                <X size={12} /> Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMore && !isLoading && competitions.length > 0 && (
          <div className="px-5 py-3 border-t border-navy/8 bg-navy/[0.01] flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-navy/50 hover:text-red transition-colors"
            >
              {isFetchingMore ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
              {isFetchingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
