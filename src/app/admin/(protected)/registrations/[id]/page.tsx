"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Mail, Phone, MapPin, Users, Calendar, Ticket, Banknote } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function AdminRegistrationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [registration, setRegistration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const reg = await apiClient.registrations.getById(id);
        setRegistration(reg);
      } catch (err: any) {
        setError(err.message || "Failed to load registration");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistration();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-navy font-bold text-xl">Loading registration details...</div>;
  }

  if (error || !registration) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold">
          {error || "Registration not found"}
        </div>
        <Link 
          href="/admin/registrations"
          className="bg-navy text-offwhite font-black uppercase tracking-widest px-6 py-3 inline-block"
        >
          Back to Registrations
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/registrations"
          className="p-2 border-2 border-navy hover:bg-navy hover:text-offwhite transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-navy">Registration Details</h1>
          <p className="text-navy/60 font-bold">View team and contact information.</p>
        </div>
      </div>

      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] overflow-hidden">
        <div className="bg-navy p-8 flex justify-between items-start text-white">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{registration.team_name}</h2>
            <p className="text-white/70 font-bold text-sm tracking-widest uppercase">
              Registered for: <span className="text-white">{registration.competitions?.title}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 font-bold px-4 py-2 border-2 border-white/20">
            {registration.is_verified ? (
              <>
                <CheckCircle2 className="text-[#25D366]" size={20} />
                <span className="text-white">VERIFIED</span>
              </>
            ) : (
              <>
                <XCircle className="text-red" size={20} />
                <span className="text-white">UNVERIFIED</span>
              </>
            )}
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-black text-xl uppercase tracking-wider text-navy border-b-2 border-navy/10 pb-2">Contact Info</h3>
            
            <div className="flex items-start gap-4">
              <Mail className="text-red shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">Email Address</p>
                <p className="font-bold text-navy text-lg break-all">{registration.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="text-red shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="font-bold text-navy text-lg">{registration.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-black text-xl uppercase tracking-wider text-navy border-b-2 border-navy/10 pb-2">Team Details</h3>
            
            <div className="flex items-start gap-4">
              <MapPin className="text-navy shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">School / Organization</p>
                <p className="font-bold text-navy text-lg">{registration.school}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Users className="text-navy shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">Number of Players</p>
                <p className="font-bold text-navy text-lg">{registration.players_count} players</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="text-navy shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">Registration Date</p>
                <p className="font-bold text-navy text-lg">{new Date(registration.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Ticketing Section */}
        <div className="p-8 border-t-4 border-navy/10 bg-offwhite">
          <h3 className="font-black text-xl uppercase tracking-wider text-navy border-b-2 border-navy/10 pb-2 mb-6">Enrollment & Payment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Ticket className="text-red shrink-0" size={24} />
                <div>
                  <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">Ticket Number</p>
                  {registration.ticket_number ? (
                    <div className="inline-block bg-white border-2 border-navy px-3 py-1 font-mono font-bold text-red">
                      {registration.ticket_number}
                    </div>
                  ) : (
                    <p className="font-bold text-navy/40">Not Issued</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-navy shrink-0" size={24} />
                <div>
                  <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">Enrollment Status</p>
                  <p className="font-bold text-navy text-lg">
                    {registration.enrolled ? "Officially Enrolled" : "Pending Enrollment"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Banknote className="text-navy shrink-0" size={24} />
                <div>
                  <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">Payment Records</p>
                  {registration.payments && registration.payments.length > 0 ? (
                    <div className="space-y-4 mt-2">
                      {registration.payments.map((payment: any) => (
                        <div key={payment.reference} className="bg-white border-2 border-navy p-3 text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono font-bold text-navy">{payment.reference}</span>
                            <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                              payment.status === 'success' ? 'bg-[#25D366]/20 text-[#25D366]' : 
                              payment.status === 'failed' ? 'bg-red/20 text-red' : 'bg-yellow-500/20 text-yellow-600'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-red">₦{payment.amount.toLocaleString()}</span>
                            <span className="text-navy/50 text-xs">{new Date(payment.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-bold text-navy/40">No payments found (Free Tournament)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
