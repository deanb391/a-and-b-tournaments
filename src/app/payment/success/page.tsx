"use client";

import Link from "next/link";
import { CheckCircle2, Ticket, Bug } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const whatsappLink = searchParams.get("whatsapp_link");

  return (
    <div className="bg-offwhite min-h-screen flex flex-col">
      {/* Brand header strip */}
      <div className="bg-navy border-b border-red/20 h-14 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-red text-offwhite p-1 rounded-sm">
            <Bug size={18} />
          </div>
          <span className="font-pixel text-sm text-red leading-none">A&B</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-5 py-16">
        <div className="bg-white border border-navy/10 shadow-[0_16px_48px_rgba(10,25,47,0.12)] max-w-md w-full p-8 sm:p-12 text-center rounded-sm animate-fade-up">
          {/* Animated check */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <span className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping" />
            <div className="relative w-24 h-24 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366]">
              <CheckCircle2 size={52} />
            </div>
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-navy mb-3">
            Payment Successful!
          </h1>
          <p className="text-navy/55 font-medium mb-8 text-base leading-relaxed">
            Your spot in the arena is secured. Your official tournament ticket has been sent to your email.
          </p>

          {/* Check inbox hint */}
          <div className="bg-offwhite/80 border border-navy/8 rounded-sm p-4 flex items-center gap-3 mb-8 text-left">
            <div className="bg-red/10 p-2 rounded-sm shrink-0">
              <Ticket size={20} className="text-red" />
            </div>
            <div>
              <p className="font-black text-navy text-sm uppercase tracking-wider">Check Your Inbox</p>
              <p className="text-navy/45 text-xs mt-0.5">Your ticket will arrive within a few minutes</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-black uppercase tracking-wider px-8 py-4 w-full flex items-center justify-center rounded-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all"
              >
                Join WhatsApp Group
              </a>
            )}
            <Link
              href="/competitions"
              className="bg-navy text-offwhite font-black uppercase tracking-wider px-8 py-4 w-full flex items-center justify-center rounded-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,25,47,0.2)] transition-all"
            >
              Browse More Arenas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-offwhite flex items-center justify-center font-bold text-navy">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
