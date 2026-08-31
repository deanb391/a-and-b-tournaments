"use client";

import { useEffect, useState, use } from "react";
import {
  ArrowLeft, CheckCircle2, XCircle, Mail, Phone,
  MapPin, Users, Calendar, Ticket, Banknote, Clock,
} from "lucide-react";
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
    return (
      <div className="space-y-6 animate-pulse max-w-5xl">
        <div className="skeleton h-8 w-48 rounded-sm" />
        <div className="skeleton h-32 w-full rounded-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="skeleton h-64 rounded-sm" />
          <div className="skeleton h-64 rounded-sm" />
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="max-w-4xl">
        <div className="bg-red/8 border-l-4 border-red text-red p-4 mb-6 font-bold text-sm rounded-sm">
          {error || "Registration not found"}
        </div>
        <Link
          href="/admin/registrations"
          className="inline-flex items-center gap-2 bg-navy text-offwhite font-black uppercase tracking-wider px-5 py-2.5 rounded-sm text-sm hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(10,25,47,0.25)] transition-all"
        >
          <ArrowLeft size={16} /> Back to Registrations
        </Link>
      </div>
    );
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "success":
        return <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full"><CheckCircle2 size={10} /> Success</span>;
      case "failed":
        return <span className="inline-flex items-center gap-1 bg-red/8 text-red px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full"><XCircle size={10} /> Failed</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-up" style={{ marginBottom: 70 }}>
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/registrations"
          className="p-2 border border-navy/15 rounded-sm hover:bg-navy hover:text-offwhite hover:border-navy transition-all text-navy/50"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-navy">Registration Details</h1>
          <p className="text-navy/40 font-medium text-xs mt-0.5">Team and enrollment information.</p>
        </div>
      </div>

      {/* Hero strip */}
      <div className="bg-navy rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{registration.team_name}</h2>
          <p className="text-white/45 text-sm font-medium">
            Registered for: <span className="text-white font-bold">{registration.competitions?.title}</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {registration.is_verified ? (
            <span className="inline-flex items-center gap-1.5 bg-green-400/20 text-green-300 px-3 py-1.5 font-bold text-xs uppercase tracking-wider rounded-full">
              <CheckCircle2 size={12} /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-red/20 text-red-300 px-3 py-1.5 font-bold text-xs uppercase tracking-wider rounded-full">
              <XCircle size={12} /> Unverified
            </span>
          )}
          {registration.enrolled && (
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wider rounded-full">
              <Ticket size={12} /> Enrolled
            </span>
          )}
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Contact + Team Info */}
        <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.06)] p-6 space-y-5">
          <h3 className="font-black text-sm uppercase tracking-wider text-navy border-b border-navy/8 pb-3">Contact & Team Info</h3>

          {[
            { icon: <Mail size={16} />, label: "Email", value: registration.email },
            { icon: <Phone size={16} />, label: "Phone", value: registration.phone },
            { icon: <MapPin size={16} />, label: "School", value: registration.school },
            { icon: <Users size={16} />, label: "Players", value: `${registration.players_count} player${registration.players_count !== 1 ? "s" : ""}` },
            { icon: <Calendar size={16} />, label: "Registered", value: new Date(registration.created_at).toLocaleString() },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <div className="bg-navy/5 p-1.5 rounded-sm text-red shrink-0 mt-0.5">{row.icon}</div>
              <div>
                <p className="text-[10px] font-bold text-navy/35 uppercase tracking-[0.12em]">{row.label}</p>
                <p className="font-bold text-navy text-sm mt-0.5 break-all">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Ticket + Payments */}
        <div className="space-y-5">
          {/* Ticket card */}
          <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.06)] p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-navy border-b border-navy/8 pb-3 mb-4">Ticket</h3>
            <div className="flex items-start gap-3">
              <div className="bg-navy/5 p-1.5 rounded-sm text-red shrink-0"><Ticket size={16} /></div>
              <div>
                <p className="text-[10px] font-bold text-navy/35 uppercase tracking-[0.12em]">Ticket Number</p>
                {registration.ticket_number ? (
                  <code className="inline-block bg-navy/5 border border-navy/10 px-3 py-1.5 font-mono font-bold text-red text-sm rounded-sm mt-1">
                    {registration.ticket_number}
                  </code>
                ) : (
                  <p className="text-navy/35 font-bold text-sm mt-1">No ticket generated yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Payments card */}
          <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.06)] p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-navy border-b border-navy/8 pb-3 mb-4">
              Payments
            </h3>
            {registration.payments && registration.payments.length > 0 ? (
              <div className="space-y-3">
                {registration.payments.map((payment: any) => (
                  <div key={payment.reference} className="bg-navy/[0.02] border border-navy/8 p-4 rounded-sm">
                    <div className="flex justify-between items-center mb-2">
                      <code className="font-mono text-xs font-bold text-navy">{payment.reference}</code>
                      {getPaymentBadge(payment.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-navy">₦{(payment.amount || 0).toLocaleString()}</span>
                      <span className="text-navy/35 text-xs">{new Date(payment.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="bg-navy/5 p-1.5 rounded-sm text-navy/30 shrink-0"><Banknote size={16} /></div>
                <p className="text-navy/35 font-bold text-sm">No payments — free tournament</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
