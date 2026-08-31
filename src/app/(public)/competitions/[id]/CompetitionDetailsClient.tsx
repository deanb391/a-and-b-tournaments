"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MapPin, Ticket, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
      <div className="min-h-screen bg-offwhite pt-24 pb-16">
        <div className="container mx-auto px-5 max-w-5xl animate-pulse space-y-6">
          <div className="skeleton h-6 w-32 rounded-sm" />
          <div className="skeleton h-[400px] w-full rounded-sm" />
          <div className="skeleton h-10 w-1/2 rounded-sm" />
          <div className="skeleton h-5 w-3/4 rounded-sm" />
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-offwhite p-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold rounded-sm">
            {error || "Arena not found"}
          </div>
          <Link
            href="/competitions"
            className="inline-flex items-center gap-2 bg-navy text-offwhite font-black uppercase tracking-widest px-6 py-3 rounded-sm hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(10,25,47,0.25)] transition-all"
          >
            <ArrowLeft size={18} />
            Back to Arenas
          </Link>
        </div>
      </div>
    );
  }

  const isRegistrationOpen = competition.status === "REGISTRATION OPEN";
  const isFree = !competition.entry_fee || competition.entry_fee === 0;

  return (
    <div className="bg-offwhite min-h-screen pb-24 pt-20">
      <div className="container mx-auto px-5 max-w-5xl">

        {/* Back link */}
        <div className="mb-8 animate-fade-up">
          <Link
            href="/competitions"
            className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-navy/50 hover:text-red transition-colors px-4 py-2 border border-navy/10 rounded-sm bg-white hover:border-red/30"
          >
            <ArrowLeft size={16} />
            Back to Arenas
          </Link>
        </div>

        {/* Hero card */}
        <div className="bg-white border border-navy/10 shadow-[0_16px_48px_rgba(10,25,47,0.12)] overflow-hidden rounded-sm animate-fade-up-1">

          {/* Hero image */}
          <div className="h-72 sm:h-[400px] w-full bg-navy relative">
            {competition.image && (
              <Image
                src={competition.image}
                alt={competition.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 960px"
                priority
              />
            )}
            {/* Gradient — much stronger on mobile for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 sm:via-navy/30 to-transparent" />

            {/* Overlaid badges and title */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-red text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-sm">
                  {competition.category}
                </span>
                <span className={`px-3 py-1 font-black text-xs uppercase tracking-widest rounded-sm ${
                  isRegistrationOpen
                    ? "bg-offwhite text-navy"
                    : competition.status === "COMPLETED"
                    ? "bg-white/20 text-white/70"
                    : "bg-white/20 text-white"
                }`}>
                  {competition.status}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight mb-2">
                {competition.title}
              </h1>
              {competition.subtitle && (
                <p className="text-offwhite/70 text-base sm:text-lg font-medium">
                  {competition.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-10">

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <InfoBlock icon={<Calendar size={20} />} label="Tournament Date" value={competition.date} />
              <InfoBlock icon={<MapPin size={20} />} label="Location" value={competition.location} />
              <InfoBlock
                icon={<Ticket size={20} />}
                label="Entry Fee"
                value={isFree ? "FREE" : `₦${competition.entry_fee?.toLocaleString()}`}
                valueClass={isFree ? "text-red" : undefined}
              />
            </div>

            {/* Description (if available) */}
            {(competition as any).description && (
              <div className="mb-10 pb-10 border-b border-navy/8">
                <h2 className="text-lg font-black uppercase tracking-wider text-navy mb-3">About This Tournament</h2>
                <p className="text-navy/65 leading-relaxed text-base">
                  {(competition as any).description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col items-center text-center pt-4">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-navy mb-3">
                Ready to compete?
              </h3>
              <p className="text-navy/55 text-base mb-8 max-w-xl">
                {isRegistrationOpen
                  ? "Secure your spot now. Spaces are limited — don't miss out on the arena."
                  : "Registration is currently closed. Check back soon or explore other arenas."}
              </p>

              {isRegistrationOpen ? (
                <Link
                  href={`/competitions/${id}/register`}
                  className="group inline-flex items-center gap-3 bg-red text-white font-black uppercase tracking-widest px-10 py-5 text-lg rounded-sm hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(230,57,70,0.4)] transition-all w-full sm:w-auto justify-center"
                >
                  <Users size={22} />
                  Register Now
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-3 bg-navy/8 text-navy/35 font-black uppercase tracking-widest px-10 py-5 text-lg rounded-sm border border-navy/15 cursor-not-allowed w-full sm:w-auto justify-center"
                >
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value, valueClass }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-offwhite/60 border border-navy/8 p-4 rounded-sm">
      <div className="bg-navy p-2 text-offwhite rounded-sm shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`font-black text-navy text-base ${valueClass ?? ""}`}>{value}</p>
      </div>
    </div>
  );
}
