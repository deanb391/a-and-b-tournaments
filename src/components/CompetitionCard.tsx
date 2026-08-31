import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export interface Competition {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  location: string;
  status: string;
  image: string;
  whatsapp_link?: string;
  entry_fee?: number;
}

interface CompetitionCardProps {
  competition: Competition;
  index?: number;
}

export default function CompetitionCard({ competition, index = 0 }: CompetitionCardProps) {
  const isFree = !competition.entry_fee || competition.entry_fee === 0;
  const isOpen = competition.status === "REGISTRATION OPEN";

  return (
    <div
      className="group bg-white border-2 border-navy/10 hover:border-navy/30 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(10,25,47,0.15)] transition-all duration-300 relative h-full flex flex-col rounded-sm overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
    >
      {/* Registration open indicator strip */}
      {isOpen && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red z-10" />
      )}

      {/* Image */}
      <div className="h-52 relative overflow-hidden shrink-0 bg-navy/10">
        {competition.image ? (
          <Image
            src={competition.image}
            alt={competition.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy/60" />
        )}
        {/* Bottom gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

        {/* Category + Fee badges overlaid on image */}
        <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
          <span className="bg-navy/90 backdrop-blur-sm text-offwhite text-xs font-bold px-2.5 py-1 uppercase tracking-wider rounded-sm">
            {competition.category}
          </span>
          <span className={`text-xs font-black px-2.5 py-1 uppercase tracking-wider rounded-sm ${
            isFree
              ? "bg-red text-white"
              : "bg-offwhite/90 text-navy"
          }`}>
            {isFree ? "FREE" : `₦${competition.entry_fee?.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-full ${
            isOpen
              ? "bg-red/10 text-red"
              : competition.status === "COMPLETED"
              ? "bg-navy/5 text-navy/40"
              : "bg-navy/5 text-navy/50"
          }`}>
            {competition.status}
          </span>
        </div>

        <h3 className="text-lg font-black uppercase text-navy mb-1 leading-tight line-clamp-2">
          {competition.title}
        </h3>
        <p className="text-navy/55 text-sm font-medium mb-4 flex-1 line-clamp-2">
          {competition.subtitle}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 mb-5 text-navy">
          <div className="flex items-center gap-2 text-xs font-medium text-navy/60">
            <Calendar size={13} className="text-red shrink-0" />
            <span className="truncate">{competition.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-navy/60">
            <MapPin size={13} className="text-red shrink-0" />
            <span className="truncate">{competition.location}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/competitions/${competition.id}`}
          className="group/btn flex items-center justify-between w-full bg-navy text-offwhite px-4 py-3 font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-red transition-colors mt-auto"
        >
          <span>View Competition</span>
          <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
