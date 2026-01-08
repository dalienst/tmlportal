"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Mail, Waves, ChevronRight, Loader2, KeyRound } from "lucide-react";
import { forgotPassword } from "@/services/accounts";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success("Recovery code sent! Check your email.");
      // Small delay for toast visibility
      setTimeout(() => {
        router.push("/reset-password");
      }, 1500);
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to send recovery code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden selection:bg-accent/30">
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[#0f172a]">
        <div className="absolute -inset-[10%] opacity-40">
          <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-primary/40 blur-[130px] animate-mesh" />
          <div
            className="absolute bottom-[20%] right-[10%] w-[45%] h-[45%] rounded-full bg-accent/30 blur-[110px] animate-mesh"
            style={{ animationDelay: "-7s" }}
          />
          <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-[140px] animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[440px] z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Logo/Brand Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4 shadow-2xl">
            <KeyRound className="text-accent" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Access Recovery
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Identity Confirmation Required
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="glass-dark p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Forgot Passphrase?
          </h2>
          <p className="text-white/40 text-sm text-center mb-8 leading-relaxed">
            Enter your registered boutique email address and we'll transmit a
            secure recovery code to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-white/60 ml-1 uppercase tracking-wider"
              >
                Work Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  placeholder="name@tamarind.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                  size={20}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-white text-[#0f172a] py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 overflow-hidden shadow-xl shadow-white/5"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Request Code</span>
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>

          <div className="mt-8 text-center text-white/40 text-[10px] uppercase tracking-[0.2em]">
            Secure Verification Protocol
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-white/40 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
