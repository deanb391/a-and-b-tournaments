"use client";

import Link from "next/link";
import { CheckCircle2, Ticket } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const whatsappLink = searchParams.get("whatsapp_link");

  return (
    <div className="bg-offwhite min-h-screen py-32 flex flex-col items-center justify-center p-4">
      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] max-w-lg w-full p-8 md:p-12 text-center">
        <div className="w-24 h-24 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-8 text-[#25D366]">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tight text-navy mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-navy/70 font-medium mb-8 text-lg">
          Your spot in the arena is secured. We've sent your official tournament ticket to your email address.
        </p>

        <div className="bg-offwhite border-2 border-navy/10 p-6 flex items-center justify-center gap-4 mb-8">
          <Ticket size={32} className="text-red" />
          <span className="font-black text-navy uppercase tracking-widest">Check Your Inbox</span>
        </div>

        <div className="flex flex-col gap-4">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-black uppercase tracking-widest px-8 py-4 w-full block hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F] transition-all border-2 border-[#25D366]"
            >
              JOIN WHATSAPP GROUP
            </a>
          )}

          <Link
            href="/competitions"
            className="bg-navy text-offwhite font-black uppercase tracking-widest px-8 py-4 w-full block hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F] transition-all border-2 border-navy"
          >
            BROWSE MORE ARENAS
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-offwhite flex items-center justify-center font-bold text-navy text-xl">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
