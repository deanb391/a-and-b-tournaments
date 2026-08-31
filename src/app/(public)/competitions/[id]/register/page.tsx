"use client";

import { useState, use, useRef, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const competitionId = unwrappedParams.id;
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationId, setRegistrationId] = useState("");

  const [formData, setFormData] = useState({
    team_name:     "",
    email:         "",
    phone:         "",
    school:        "",
    players_count: "1",
  });

  const [otpCode, setOtpCode] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);
  const isVerifying = useRef(false);

  // Auto-focus first input when step changes
  useEffect(() => {
    firstInputRef.current?.focus();
  }, [step]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await apiClient.registrations.create({
        competition_id: competitionId,
        ...formData,
      });
      setRegistrationId(response.registrationId);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying.current) return;
    isVerifying.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiClient.registrations.verify(registrationId, otpCode);
      if (response.paymentRequired && response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
        return;
      }
      if (response.whatsapp_link) setWhatsappLink(response.whatsapp_link);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code");
      isVerifying.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-offwhite min-h-screen py-28">
      <div className="container mx-auto px-5 max-w-xl">

        {/* Back link */}
        {step !== "success" && (
          <div className="mb-6">
            <Link
              href={`/competitions/${competitionId}`}
              className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-navy/50 hover:text-red transition-colors px-4 py-2 border border-navy/10 rounded-sm bg-white hover:border-red/30"
            >
              <ArrowLeft size={16} />
              Back to Arena
            </Link>
          </div>
        )}

        {/* Card */}
        <div className="bg-white border border-navy/10 shadow-[0_16px_48px_rgba(10,25,47,0.10)] rounded-sm overflow-hidden animate-fade-up">

          {/* Step indicator (not on success) */}
          {step !== "success" && (
            <div className="px-8 pt-8 pb-2">
              <StepIndicator currentStep={step} />
            </div>
          )}

          <div className="px-8 pb-10 pt-2">

            {/* ── STEP 1: Form ── */}
            {step === "form" && (
              <>
                <div className="mb-8 pb-6 border-b border-navy/8">
                  <h1 className="text-3xl font-black uppercase tracking-tight text-navy mb-1">
                    Tournament Registration
                  </h1>
                  <p className="text-navy/50 text-sm font-medium">
                    Enter your team details to secure your spot.
                  </p>
                </div>

                {error && (
                  <div className="bg-red/8 border-l-4 border-red text-red p-4 mb-6 font-bold text-sm rounded-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <FormField label="Team / Individual Name">
                    <input
                      ref={firstInputRef}
                      type="text"
                      required
                      value={formData.team_name}
                      onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                      className="input-field"
                      placeholder="e.g. The Spartans"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Email Address">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </FormField>
                    <FormField label="Phone Number">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field"
                        placeholder="08012345678"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="School / Organization">
                      <input
                        type="text"
                        required
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        className="input-field"
                        placeholder="e.g. University of Lagos"
                      />
                    </FormField>
                    <FormField label="Number of Players">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        required
                        value={formData.players_count}
                        onChange={(e) => setFormData({ ...formData, players_count: e.target.value })}
                        className="input-field"
                      />
                    </FormField>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 font-black uppercase tracking-widest text-base bg-navy text-offwhite rounded-sm flex items-center justify-center gap-2 mt-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,25,47,0.25)] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing...</>
                    ) : (
                      "Continue to Verification →"
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === "otp" && (
              <div className="text-center py-4">
                <h1 className="text-3xl font-black uppercase tracking-tight text-navy mb-3">
                  Verify Your Email
                </h1>
                <p className="text-navy/55 font-medium mb-8 text-sm leading-relaxed">
                  We sent a 6-digit code to <strong className="text-navy">{formData.email}</strong>.
                  <br />Enter it below to complete your registration.
                </p>

                {error && (
                  <div className="bg-red/8 border-l-4 border-red text-red p-4 mb-6 font-bold text-sm text-left rounded-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="max-w-[200px] mx-auto">
                  <input
                    ref={firstInputRef as any}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    placeholder="------"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-offwhite border-2 border-navy text-center text-3xl tracking-[0.4em] sm:tracking-[0.5em] px-3 py-5 font-black text-navy focus:outline-none focus:border-red transition-colors rounded-sm mb-5"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || otpCode.length !== 6}
                    className="w-full py-4 font-black uppercase tracking-widest text-sm rounded-sm flex items-center justify-center gap-2 transition-all bg-red text-offwhite hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(230,57,70,0.4)] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                    ) : (
                      "Verify & Complete"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ── STEP 3: Success ── */}
            {step === "success" && (
              <div className="text-center py-8 flex flex-col items-center">
                {/* Animated success icon */}
                <div className="relative mb-8">
                  <span className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping" />
                  <div className="relative w-24 h-24 bg-[#25D366]/15 rounded-full flex items-center justify-center text-[#25D366]">
                    <CheckCircle2 size={52} />
                  </div>
                </div>

                <h1 className="text-3xl font-black uppercase tracking-tight text-navy mb-3">
                  You're In! 🎉
                </h1>
                <p className="text-navy/55 font-medium mb-8 text-base max-w-sm leading-relaxed">
                  Your registration is confirmed. Check your inbox for your official tournament ticket.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white font-black uppercase tracking-wider px-6 py-3.5 rounded-sm text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all"
                    >
                      Join WhatsApp Group
                    </a>
                  )}
                  <Link
                    href="/competitions"
                    className="bg-navy text-offwhite font-black uppercase tracking-wider px-6 py-3.5 rounded-sm text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,25,47,0.25)] transition-all"
                  >
                    Browse More Arenas
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
