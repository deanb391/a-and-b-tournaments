"use client";

import { useState, use } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const competitionId = unwrappedParams.id;
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationId, setRegistrationId] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    team_name: "",
    email: "",
    phone: "",
    school: "",
    players_count: "1"
  });

  const [otpCode, setOtpCode] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiClient.registrations.create({
        competition_id: competitionId,
        ...formData
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
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiClient.registrations.verify(registrationId, otpCode);
      if (response.whatsapp_link) {
        setWhatsappLink(response.whatsapp_link);
      }
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-offwhite min-h-screen py-32">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Link 
            href={`/competitions/${competitionId}`}
            className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-navy hover:text-red transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Arena
          </Link>
        </div>

        <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] p-8 md:p-12">
          
          {step === "form" && (
            <>
              <div className="mb-8 border-b-4 border-navy/10 pb-6">
                <h1 className="text-4xl font-black uppercase tracking-tight text-navy mb-2">
                  Tournament Registration
                </h1>
                <p className="text-navy/70 font-medium">
                  Enter your team details to secure your spot.
                </p>
              </div>

              {error && (
                <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-pixel text-navy">Team / Individual Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.team_name}
                    onChange={(e) => setFormData({...formData, team_name: e.target.value})}
                    className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-pixel text-navy">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-pixel text-navy">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-pixel text-navy">School / Organization</label>
                    <input 
                      type="text" 
                      required
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-pixel text-navy">Number of Players</label>
                    <input 
                      type="number" 
                      min="1"
                      max="20"
                      required
                      value={formData.players_count}
                      onChange={(e) => setFormData({...formData, players_count: e.target.value})}
                      className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 font-black uppercase tracking-widest text-lg transition-all border-2 border-navy flex items-center justify-center mt-8 ${
                    isSubmitting 
                      ? 'bg-navy/80 text-white cursor-not-allowed' 
                      : 'bg-navy text-offwhite hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F]'
                  }`}
                >
                  {isSubmitting ? 'PROCESSING...' : 'CONTINUE TO VERIFICATION'}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <div className="text-center py-8">
              <h1 className="text-3xl font-black uppercase tracking-tight text-navy mb-4">
                Verify Your Email
              </h1>
              <p className="text-navy/70 font-medium mb-8">
                We've sent a 6-digit verification code to <strong className="text-navy">{formData.email}</strong>. 
                Enter it below to complete your registration.
              </p>

              {error && (
                <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold text-left">
                  {error}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="max-w-xs mx-auto">
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-offwhite border-4 border-navy text-center text-4xl tracking-[0.5em] px-4 py-6 font-black text-navy focus:outline-none focus:border-red transition-colors mb-6"
                />

                <button 
                  type="submit"
                  disabled={isSubmitting || otpCode.length !== 6}
                  className={`w-full py-4 font-black uppercase tracking-widest transition-all border-2 border-navy flex items-center justify-center ${
                    isSubmitting || otpCode.length !== 6
                      ? 'bg-navy/50 text-white/50 cursor-not-allowed' 
                      : 'bg-red text-offwhite hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F]'
                  }`}
                >
                  {isSubmitting ? 'VERIFYING...' : 'VERIFY & COMPLETE'}
                </button>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#25D366]/20 rounded-full flex items-center justify-center mb-6 text-[#25D366]">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-navy mb-4">
                Registration Verified!
              </h1>
              <p className="text-navy/70 font-medium mb-8 text-lg max-w-md">
                Your spot is secured. We'll send further instructions and tournament updates to your email.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white font-black uppercase tracking-widest px-8 py-4 inline-block hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F] transition-all border-2 border-[#25D366]"
                  >
                    JOIN WHATSAPP GROUP
                  </a>
                )}
                
                <Link
                  href="/competitions"
                  className="bg-navy text-offwhite font-black uppercase tracking-widest px-8 py-4 inline-block hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F] transition-all border-2 border-navy"
                >
                  BROWSE MORE ARENAS
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
