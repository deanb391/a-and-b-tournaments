"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Bug, Shield, Trophy, Users } from "lucide-react";
import { apiClient } from "@/lib/api/client";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await apiClient.auth.loginAdmin(password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-navy relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background glow */}
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-red rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-red rounded-full blur-[100px] opacity-10" />

        {/* Checkerboard accent */}
        <div className="absolute bottom-8 right-8 opacity-20 flex flex-wrap w-32 h-32">
          {[...Array(64)].map((_, i) => (
            <div key={i} className={`w-4 h-4 ${(Math.floor(i / 8) + i) % 2 === 0 ? "bg-red" : "bg-transparent"}`} />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="bg-red p-3 rounded-sm">
              <Bug size={32} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-pixel text-3xl text-red leading-none">A&B</p>
              <p className="text-offwhite/50 font-bold text-xs uppercase tracking-[0.2em]">Tournaments</p>
            </div>
          </div>

          <h1 className="text-4xl font-black uppercase text-offwhite tracking-tight mb-4">
            Admin Portal
          </h1>
          <p className="text-offwhite/45 font-medium text-base max-w-xs mx-auto mb-12">
            Manage competitions, registrations, payments, and more.
          </p>

          {/* Feature list */}
          <div className="space-y-4 text-left max-w-xs mx-auto">
            {[
              { icon: <Shield size={16} />, text: "Secure access control" },
              { icon: <Trophy size={16} />, text: "Competition management" },
              { icon: <Users size={16} />,  text: "Registration tracking"  },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-offwhite/45">
                <div className="text-red shrink-0">{f.icon}</div>
                <span className="text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-offwhite p-6">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="bg-navy p-1.5 rounded-sm">
              <Bug size={20} className="text-red" />
            </div>
            <span className="font-pixel text-base text-navy leading-none">A&B</span>
          </div>

          <h2 className="text-3xl font-black uppercase text-navy tracking-tight mb-1">Sign In</h2>
          <p className="text-navy/45 font-medium text-sm mb-8">Enter your admin password to continue.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock size={16} className="text-navy/35" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-navy/35 hover:text-navy transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red/8 border-l-4 border-red text-red p-3 text-sm font-bold rounded-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 font-black uppercase tracking-widest text-sm bg-navy text-offwhite rounded-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,25,47,0.25)] disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              {isSubmitting ? "Authenticating..." : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
