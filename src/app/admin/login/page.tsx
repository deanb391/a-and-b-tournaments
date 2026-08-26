"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { apiClient } from "@/lib/api/client";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      {/* Abstract background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red rounded-full blur-[150px] opacity-20"></div>
      </div>

      <div className="bg-white border-4 border-red shadow-[8px_8px_0px_#E63946] p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase text-navy tracking-tight mb-2">Admin Portal</h1>
          <p className="text-navy/60 font-bold uppercase tracking-widest text-sm font-pixel">Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-pixel text-navy">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Lock size={20} className="text-navy/50" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-offwhite border-2 border-navy/20 pl-12 pr-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red/10 border-l-4 border-red text-red p-3 text-sm font-bold">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 font-black uppercase tracking-widest text-lg transition-all border-2 border-navy mt-4 flex items-center justify-center ${
              isSubmitting 
                ? 'bg-navy/80 text-white cursor-not-allowed' 
                : 'bg-navy text-offwhite hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F]'
            }`}
          >
            {isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN ADMIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
