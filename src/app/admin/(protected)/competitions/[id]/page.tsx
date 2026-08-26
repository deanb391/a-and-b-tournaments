"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Trophy, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
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
    return <div className="p-8 text-navy font-bold text-xl">Loading competition details...</div>;
  }

  if (error || !competition) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold">
          {error || "Competition not found"}
        </div>
        <Link 
          href="/admin/competitions"
          className="bg-navy text-offwhite font-black uppercase tracking-widest px-6 py-3 inline-block"
        >
          Back to Competitions
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/competitions"
            className="p-2 border-2 border-navy hover:bg-navy hover:text-offwhite transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-navy">Competition Details</h1>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link
            href={`/admin/competitions/${id}/edit`}
            className="bg-offwhite text-navy font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0A192F] transition-all border-2 border-navy"
          >
            <Edit2 size={20} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red text-offwhite font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0A192F] transition-all border-2 border-red"
          >
            <Trash2 size={20} />
            Delete
          </button>
        </div>
      </div>

      {/* Competition Details */}
      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] overflow-hidden">
        <div className="h-64 w-full bg-navy/10 relative border-b-4 border-navy">
          {competition.image && (
            <img 
              src={competition.image} 
              alt={competition.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent flex flex-col justify-end p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-red text-white text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-white">
                {competition.category}
              </span>
              <span className={`px-3 py-1 font-black text-xs uppercase tracking-widest border-2 border-white ${
                competition.status === 'REGISTRATION OPEN' ? 'bg-[#25D366] text-navy' 
                : competition.status === 'COMPLETED' ? 'bg-navy text-white' 
                : 'bg-white text-navy'
              }`}>
                {competition.status}
              </span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">
              {competition.title}
            </h2>
          </div>
        </div>
        
        <div className="p-8">
          <p className="text-xl text-navy/80 font-bold mb-8">
            {competition.subtitle || "No subtitle provided."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-offwhite p-4 border-2 border-navy/10">
              <div className="bg-navy p-3 text-offwhite">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest">Date</p>
                <p className="font-black text-navy text-lg">{competition.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-offwhite p-4 border-2 border-navy/10">
              <div className="bg-navy p-3 text-offwhite">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest">Location</p>
                <p className="font-black text-navy text-lg">{competition.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations Section */}
      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] p-8 mt-12">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-navy/10">
          <Trophy size={32} className="text-red" />
          <h3 className="text-3xl font-black uppercase tracking-tight text-navy">Registrations</h3>
        </div>
        
        <div className="bg-white border-4 border-navy">
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-4 border-navy bg-navy/5">
                  <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Date</th>
                  <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Name / Team</th>
                  <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingRegs && registrations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-navy font-bold">
                      Loading registrations...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-navy/50 font-bold">
                      No registrations for this competition yet.
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

          {hasMore && !isLoadingRegs && registrations.length > 0 && (
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
    </div>
  );
}
