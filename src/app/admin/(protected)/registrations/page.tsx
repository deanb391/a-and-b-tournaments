"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

interface Registration {
  id: string;
  created_at: string;
  team_name: string;
  email: string;
  is_verified: boolean;
  competition_id: string;
  competitions: {
    title: string;
    category: string;
  };
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const LIMIT = 15;

  const fetchRegistrations = async (offset = 0, query = "") => {
    try {
      const data = await apiClient.registrations.get(LIMIT, offset, undefined, query);
      if (offset === 0) {
        setRegistrations(data);
      } else {
        setRegistrations(prev => [...prev, ...data]);
      }

      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      fetchRegistrations(0, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    setIsFetchingMore(true);
    fetchRegistrations(registrations.length, searchQuery);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-navy">Registrations</h1>
          <p className="text-navy/60 font-bold">Manage tournament sign-ups.</p>
        </div>
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
          placeholder="Search registrations by team name or email..."
          className="flex-1 px-4 py-3 bg-transparent text-navy font-bold focus:outline-none placeholder:text-navy/30"
        />
      </div>

      <div className="bg-white border-4 border-navy shadow-[6px_6px_0px_#0A192F]">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-4 border-navy bg-navy/5">
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Date</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Name / Team</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Competition</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && registrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-navy font-bold">
                    Loading registrations...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-navy/50 font-bold">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr 
                    key={reg.id} 
                    className="border-b-2 border-navy/10 hover:bg-navy/5 transition-colors"
                  >
                    <td className="p-4 text-sm text-navy/70 font-medium whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/registrations/${reg.id}`} className="font-black text-navy hover:text-red transition-colors block">
                        {reg.team_name}
                      </Link>
                      <span className="text-xs text-navy/60">{reg.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-navy block">{reg.competitions?.title || 'Unknown'}</span>
                      <span className="text-xs text-navy/60 font-bold uppercase tracking-wider">{reg.competitions?.category || 'Unknown'}</span>
                    </td>
                    <td className="p-4">
                      {reg.is_verified ? (
                        <span className="inline-flex items-center gap-1 bg-[#25D366]/10 text-[#25D366] px-3 py-1 font-bold text-xs uppercase tracking-wider border-2 border-[#25D366]/20">
                          <CheckCircle2 size={14} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red/10 text-red px-3 py-1 font-bold text-xs uppercase tracking-wider border-2 border-red/20">
                          <XCircle size={14} /> Unverified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMore && !isLoading && registrations.length > 0 && (
          <div className="p-4 border-t-4 border-navy bg-navy/5 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="flex items-center gap-2 font-bold uppercase tracking-wider text-navy hover:text-red transition-colors"
            >
              {isFetchingMore ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {isFetchingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
