"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, CheckCircle2, XCircle, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

interface Registration {
  id: string;
  created_at: string;
  team_name: string;
  email: string;
  is_verified: boolean;
  enrolled: boolean;
  competition_id: string;
  competitions: { title: string; category: string };
}

export default function AdminRegistrationsPage() {
  const router = useRouter();
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
        setRegistrations((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === LIMIT);
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="space-y-6 animate-fade-up" style={{ marginBottom: 70 }}>
      <div>
        <h1 className="text-3xl font-black uppercase text-navy tracking-tight">Registrations</h1>
        <p className="text-navy/45 font-medium text-sm mt-1">Manage tournament sign-ups.</p>
      </div>

      {/* Search */}
      <div className="flex bg-white border border-navy/12 rounded-sm shadow-sm overflow-hidden">
        <div className="px-4 flex items-center justify-center text-navy/30 border-r border-navy/10">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by team name or email..."
          className="flex-1 px-4 py-3 bg-transparent text-navy font-medium text-sm focus:outline-none placeholder:text-navy/25"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-navy/8 bg-navy/[0.02]">
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Date</th>
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Name / Team</th>
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em] hidden md:table-cell">Competition</th>
                <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && registrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-navy/35 font-bold text-sm">Loading registrations...</td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-navy/30 font-bold text-sm">No registrations found.</td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="border-b border-navy/[0.05] hover:bg-navy/[0.02] transition-colors group"
                  >
                    <td className="p-0">
                      <Link href={`/admin/registrations/${reg.id}`} className="flex items-center px-5 py-4 text-xs text-navy/45 font-medium whitespace-nowrap w-full h-full">
                        {formatDate(reg.created_at)}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link href={`/admin/registrations/${reg.id}`} className="flex flex-col justify-center px-5 py-4 w-full h-full">
                        <span className="font-bold text-navy text-sm block">{reg.team_name}</span>
                        <span className="text-xs text-navy/40">{reg.email}</span>
                      </Link>
                    </td>
                    <td className="p-0 hidden md:table-cell">
                      <Link href={`/admin/registrations/${reg.id}`} className="flex flex-col justify-center px-5 py-4 w-full h-full">
                        <span className="font-bold text-navy text-sm block">{reg.competitions?.title || "Unknown"}</span>
                        <span className="text-xs text-navy/40 font-bold uppercase tracking-wider">{reg.competitions?.category || ""}</span>
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link href={`/admin/registrations/${reg.id}`} className="flex flex-col justify-center gap-1.5 px-5 py-4 w-full h-full">
                        {reg.is_verified ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full w-fit">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red/8 text-red px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full w-fit">
                            <XCircle size={10} /> Unverified
                          </span>
                        )}
                        {reg.enrolled ? (
                          <span className="inline-flex items-center gap-1 bg-navy/8 text-navy px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full w-fit">
                            <Ticket size={10} /> Enrolled
                          </span>
                        ) : null}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMore && !isLoading && registrations.length > 0 && (
          <div className="px-5 py-3 border-t border-navy/8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-navy/50 hover:text-red transition-colors"
            >
              {isFetchingMore ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {isFetchingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
