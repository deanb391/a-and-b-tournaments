"use client";

import Link from "next/link";
import { XCircle, RefreshCcw, Bug } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

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
          <div className="w-24 h-24 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red">
            <XCircle size={52} />
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-red mb-3">
            Payment Failed
          </h1>
          <p className="text-navy/55 font-medium mb-8 text-base leading-relaxed">
            We couldn't process your entry fee. No charges were made to your account.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.back()}
              className="bg-red text-offwhite font-black uppercase tracking-wider px-8 py-4 w-full flex items-center justify-center gap-2 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(230,57,70,0.4)] transition-all"
            >
              <RefreshCcw size={18} />
              Try Again
            </button>
            <Link
              href="/"
              className="bg-transparent text-navy font-black uppercase tracking-wider px-8 py-4 w-full flex items-center justify-center rounded-sm hover:bg-navy/5 transition-all border border-navy/15"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
