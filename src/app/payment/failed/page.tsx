"use client";

import Link from "next/link";
import { XCircle, RefreshCcw } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="bg-offwhite min-h-screen py-32 flex flex-col items-center justify-center p-4">
      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] max-w-lg w-full p-8 md:p-12 text-center">
        <div className="w-24 h-24 bg-red/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red">
          <XCircle size={48} />
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tight text-red mb-4">
          Payment Failed
        </h1>
        
        <p className="text-navy/70 font-medium mb-8 text-lg">
          We couldn't process your tournament entry fee. No charges were made.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/competitions"
            className="bg-red text-offwhite font-black uppercase tracking-widest px-8 py-4 w-full block hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F] transition-all border-2 border-red flex items-center justify-center gap-2"
          >
            <RefreshCcw size={20} />
            TRY AGAIN
          </Link>

          <Link
            href="/"
            className="bg-transparent text-navy font-black uppercase tracking-widest px-8 py-4 w-full block hover:bg-navy/5 transition-all border-2 border-navy"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
