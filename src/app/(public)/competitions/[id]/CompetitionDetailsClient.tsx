"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MapPin, Users, Ticket } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { Competition } from "@/components/CompetitionCard";

export default function CompetitionDetailsClient({ id }: { id: string }) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center">
        <div className="p-8 text-navy font-bold text-xl uppercase tracking-widest animate-pulse">
          Loading Arena Details...
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-offwhite p-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold">
            {error || "Arena not found"}
          </div>
          <Link 
            href="/competitions"
            className="bg-navy text-offwhite font-black uppercase tracking-widest px-6 py-3 inline-block hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0A192F] transition-all border-2 border-navy"
          >
            Back to Arenas
          </Link>
        </div>
      </div>
    );
  }

  const isRegistrationOpen = competition.status === 'REGISTRATION OPEN';

  return (
    <div className="bg-offwhite min-h-screen pb-24 pt-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link 
            href="/competitions"
            className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-navy hover:text-red transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Arenas
          </Link>
        </div>

        <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] overflow-hidden">
          {/* Header Image */}
          <div className="h-80 md:h-[400px] w-full bg-navy/10 relative border-b-4 border-navy">
            {competition.image && (
              <img 
                src={competition.image} 
                alt={competition.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-red text-white text-sm font-black uppercase tracking-widest px-4 py-1.5 border-2 border-white">
                  {competition.category}
                </span>
                <span className={`px-4 py-1.5 font-black text-sm uppercase tracking-widest border-2 border-white ${
                  isRegistrationOpen ? 'bg-[#25D366] text-navy' 
                  : competition.status === 'COMPLETED' ? 'bg-navy text-white' 
                  : 'bg-white text-navy'
                }`}>
                  {competition.status}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-2">
                {competition.title}
              </h1>
              <p className="text-xl md:text-2xl text-offwhite/90 font-medium">
                {competition.subtitle || "The ultimate showdown"}
              </p>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex items-start gap-4 bg-offwhite p-6 border-2 border-navy/10">
                <div className="bg-navy p-3 text-offwhite shrink-0">
                  <Calendar size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy/50 uppercase tracking-widest mb-1">Tournament Date</p>
                  <p className="font-black text-navy text-xl">{competition.date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-offwhite p-6 border-2 border-navy/10">
                <div className="bg-navy p-3 text-offwhite shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy/50 uppercase tracking-widest mb-1">Location</p>
                  <p className="font-black text-navy text-xl">{competition.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-offwhite p-6 border-2 border-navy/10 md:col-span-2">
                <div className="bg-navy p-3 text-offwhite shrink-0">
                  <Ticket size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy/50 uppercase tracking-widest mb-1">Entry Fee</p>
                  <p className="font-black text-navy text-xl">
                    {!competition.entry_fee || competition.entry_fee === 0 ? (
                      <span className="text-red">FREE</span>
                    ) : (
                      `₦${competition.entry_fee.toLocaleString()}`
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t-4 border-navy/10 pt-12 flex flex-col items-center text-center">
              <h3 className="text-3xl font-black uppercase tracking-tight text-navy mb-4">
                Ready to compete?
              </h3>
              <p className="text-lg text-navy/70 mb-8 max-w-2xl">
                {isRegistrationOpen 
                  ? "Gather your team or register solo. Spaces are limited, secure your spot now in the arena."
                  : "Registration is currently closed for this tournament. Check back later or explore other arenas."}
              </p>
              
              {isRegistrationOpen ? (
                <Link
                  href={`/competitions/${id}/register`}
                  className="bg-red text-offwhite font-black uppercase tracking-widest px-12 py-5 text-xl flex items-center gap-3 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#0A192F] transition-all border-2 border-red w-full md:w-auto justify-center"
                >
                  <Users size={24} />
                  REGISTER NOW
                </Link>
              ) : (
                <button
                  disabled
                  className="bg-navy/10 text-navy/50 font-black uppercase tracking-widest px-12 py-5 text-xl flex items-center gap-3 border-2 border-navy/20 cursor-not-allowed w-full md:w-auto justify-center"
                >
                  REGISTRATION CLOSED
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
