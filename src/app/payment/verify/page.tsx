"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  
  // Prevent double-execution in React Strict Mode
  const isVerifying = useRef(false);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No transaction reference found.");
      return;
    }

    if (isVerifying.current) return;
    isVerifying.current = true;

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage("Payment verified successfully! Your ticket has been generated.");
          
          setTimeout(() => {
            if (data.whatsapp_link) {
              router.push(`/payment/success?whatsapp_link=${encodeURIComponent(data.whatsapp_link)}`);
            } else {
              router.push("/payment/success");
            }
          }, 2000);
        } else {
          setStatus("failed");
          setMessage(data.error || "Payment verification failed.");
          setTimeout(() => {
            router.push("/payment/failed");
          }, 3000);
        }
      } catch (err: any) {
        setStatus("failed");
        setMessage("A network error occurred while verifying your payment.");
        setTimeout(() => {
          router.push("/payment/failed");
        }, 3000);
      }
    };

    verifyPayment();
  }, [reference, router]);

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] max-w-md w-full p-8 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 size={48} className="text-navy animate-spin mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-navy mb-2">
              Processing
            </h2>
            <p className="text-navy/70 font-medium">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle2 size={48} className="text-[#25D366] mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-navy mb-2">
              Success!
            </h2>
            <p className="text-navy/70 font-medium">{message}</p>
            <p className="text-sm mt-4 text-navy/50">Redirecting...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center">
            <XCircle size={48} className="text-red mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-red mb-2">
              Verification Failed
            </h2>
            <p className="text-navy/70 font-medium mb-6">{message}</p>
            <p className="text-sm mt-4 text-navy/50">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div className="bg-offwhite min-h-screen py-32 flex flex-col items-center justify-center p-4 font-bold text-navy text-xl">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
