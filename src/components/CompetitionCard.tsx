import Link from "next/link";
import { Calendar, MapPin, Trophy } from "lucide-react";

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
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const isFree = !competition.entry_fee || competition.entry_fee === 0;

  return (
    <div className="group border-4 border-navy bg-white hover:-translate-y-2 transition-transform duration-300 relative h-full flex flex-col">
      <div className="absolute inset-0 bg-red translate-x-3 translate-y-3 -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
      
      <div className="h-48 flex items-center justify-center relative overflow-hidden border-b-4 border-navy shrink-0 bg-navy">
        <img src={competition.image} alt={competition.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
          <div className="flex gap-2">
            <span className="inline-block bg-navy text-offwhite text-xs font-bold px-2 py-1 uppercase tracking-wider">
              {competition.category}
            </span>
            <span className={`inline-block text-xs font-bold px-2 py-1 uppercase tracking-wider ${isFree ? 'bg-red text-white' : 'bg-navy/10 text-navy'}`}>
              {isFree ? 'FREE' : `₦${competition.entry_fee?.toLocaleString()}`}
            </span>
          </div>
          <span className={`text-xs font-bold px-2 py-1 uppercase tracking-wider border-2 ${competition.status === 'REGISTRATION OPEN' ? 'border-red text-red' : 'border-navy/30 text-navy/50'}`}>
            {competition.status}
          </span>
        </div>
        
        <h3 className="text-2xl font-black uppercase mb-1 text-navy">{competition.title}</h3>
        <p className="text-navy/70 font-medium mb-6 flex-1">{competition.subtitle}</p>
        
        <div className="space-y-2 mb-8 text-navy">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar size={16} className="text-red" />
            <span>{competition.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin size={16} className="text-red" />
            <span>{competition.location}</span>
          </div>
        </div>
        
        <Link 
          href={`/competitions/${competition.id}`} 
          className="block w-full text-center bg-navy text-offwhite py-3 font-bold uppercase tracking-wider hover:bg-red transition-colors mt-auto"
        >
          View Competition
        </Link>
      </div>
    </div>
  );
}
