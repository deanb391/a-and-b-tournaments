"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Trophy, CheckCircle2, XCircle, RefreshCw, Users, Info } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { Competition } from "@/components/CompetitionCard";

interface Registration {
  id: string;
  created_at: string;
  team_name: string;
  email: string;
  is_verified: boolean;
}

export default function CompetitionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoadingRegs, setIsLoadingRegs] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  const fetchRegistrations = async (offset = 0) => {
    try {
      const data = await apiClient.registrations.get(LIMIT, offset, id);
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
      setIsLoadingRegs(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const comp = await apiClient.competitions.getById(id);
        setCompetition(comp);
      } catch (err: any) {
        setError(err.message || "Failed to load competition");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompetition();
    fetchRegistrations(0);
  }, [id]);

  const handleLoadMore = () => {
    setIsFetchingMore(true);
    fetchRegistrations(registrations.length);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this competition?")) return;
    try {
      await apiClient.competitions.delete(id);
      router.push("/admin/competitions");
    } catch (error) {
      console.error("Failed to delete competition:", error);
      alert("Failed to delete competition");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse" style={{ marginBottom: 70 }}>
        <div className="skeleton h-10 w-48 rounded-sm" />
        <div className="skeleton h-[400px] w-full rounded-sm" />
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red/8 border-l-4 border-red text-red p-4 mb-6 font-bold text-sm rounded-sm">
          {error || "Competition not found"}
        </div>
        <Link
          href="/admin/competitions"
          className="inline-flex items-center gap-2 bg-navy text-offwhite font-black uppercase tracking-wider px-5 py-2.5 rounded-sm text-sm hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(10,25,47,0.25)] transition-all"
        >
          <ArrowLeft size={16} /> Back to Competitions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up" style={{ marginBottom: 70 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/competitions"
            className="p-2 border border-navy/15 rounded-sm hover:bg-navy hover:text-offwhite transition-all text-navy/50"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-navy">Competition Details</h1>
            <p className="text-navy/40 font-medium text-xs mt-0.5">Manage tournament and participants.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/competitions/${id}/edit`}
            className="bg-white text-navy font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm border border-navy/10 flex items-center gap-2 hover:bg-navy/5 transition-all shadow-[0_2px_8px_rgba(10,25,47,0.04)]"
          >
            <Edit2 size={14} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red/5 text-red font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-red hover:text-white transition-all shadow-[0_2px_8px_rgba(10,25,47,0.04)]"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {/* Competition Details */}
      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] overflow-hidden">
        <div className="h-64 w-full bg-navy/5 relative border-b border-navy/10">
          {competition.image && (
            <img
              src={competition.image}
              alt={competition.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm">
                {competition.category}
              </span>
              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                  competition.status === 'REGISTRATION OPEN' ? 'bg-green-500/20 text-green-300'
                  : competition.status === 'COMPLETED' ? 'bg-white/10 text-white/50'
                  : 'bg-white/20 text-white'
                }`}>
                {competition.status}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
              {competition.title}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-3 mb-8 pb-8 border-b border-navy/8">
            <Info className="text-navy/30 shrink-0 mt-0.5" size={20} />
            <p className="text-navy/70 font-medium leading-relaxed">
              {competition.subtitle || "No subtitle provided."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-navy/[0.02] p-4 rounded-sm border border-navy/5">
              <div className="bg-navy/5 text-navy p-3 rounded-full">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Date</p>
                <p className="font-bold text-navy text-sm mt-0.5">{competition.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-navy/[0.02] p-4 rounded-sm border border-navy/5">
              <div className="bg-navy/5 text-navy p-3 rounded-full">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Location</p>
                <p className="font-bold text-navy text-sm mt-0.5">{competition.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations Section */}
      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-navy/8">
          <div className="bg-red/10 p-2 rounded-full text-red">
            <Users size={18} />
          </div>
          <h3 className="text-lg font-black uppercase tracking-wide text-navy">Registrations</h3>
        </div>

        <div className="overflow-x-auto rounded-sm border border-navy/10">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-navy/5 border-b border-navy/10">
                <th className="p-4 font-bold text-navy/55 uppercase tracking-wider text-[10px]">Date</th>
                <th className="p-4 font-bold text-navy/55 uppercase tracking-wider text-[10px]">Name / Team</th>
                <th className="p-4 font-bold text-navy/55 uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingRegs && registrations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-navy/40 font-bold text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={24} className="animate-spin text-navy/20" />
                      Loading registrations...
                    </div>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center">
                    <Users size={32} className="mx-auto text-navy/20 mb-3" />
                    <p className="text-navy/50 font-bold text-sm">No registrations yet.</p>
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="border-b border-navy/5 hover:bg-navy/[0.02] transition-colors group"
                  >
                    <td className="p-0 text-xs text-navy/60 font-medium whitespace-nowrap">
                      <Link href={`/admin/registrations/${reg.id}`} className="flex items-center px-4 py-4 w-full h-full">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link href={`/admin/registrations/${reg.id}`} className="flex flex-col justify-center px-4 py-4 w-full h-full">
                        <span className="font-bold text-navy block text-sm">
                          {reg.team_name}
                        </span>
                        <span className="text-xs text-navy/45 font-medium">{reg.email}</span>
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link href={`/admin/registrations/${reg.id}`} className="flex items-center px-4 py-4 w-full h-full">
                        {reg.is_verified ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red/8 text-red px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full">
                            <XCircle size={10} /> Unverified
                          </span>
                        )}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMore && !isLoadingRegs && registrations.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-navy/50 hover:text-navy transition-colors px-4 py-2 rounded-full hover:bg-navy/5"
            >
              <RefreshCw size={14} className={isFetchingMore ? "animate-spin" : ""} />
              {isFetchingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
