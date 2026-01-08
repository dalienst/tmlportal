"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Lock,
  Mail,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  Fingerprint,
} from "lucide-react";
import { resetPassword } from "@/services/accounts";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    new_password: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(formData);
      toast.success("Password reset successful! You can now sign in.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Invalid code or reset failed"
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
            <ShieldCheck className="text-accent" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Identity Reset
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Authorized Access Re-routing
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="glass-dark p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <h2 className="text-xl font-semibold text-white mb-8 text-center">
            Reset Passphrase
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all backdrop-blur-sm text-sm"
                  required
                />
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                  size={18}
                />
              </div>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <label
                htmlFor="code"
                className="text-xs font-medium text-white/60 ml-1 uppercase tracking-wider"
              >
                Recovery Code
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="code"
                  placeholder="X-XXXX-X"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all backdrop-blur-sm text-sm tracking-[0.2em] font-mono"
                  required
                />
                <Fingerprint
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                  size={18}
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="new_password"
                className="text-xs font-medium text-white/60 ml-1 uppercase tracking-wider"
              >
                New Passphrase
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new_password"
                  placeholder="••••••••"
                  value={formData.new_password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all backdrop-blur-sm text-sm"
                  required
                />
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                  size={18}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-white text-[#0f172a] py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 overflow-hidden shadow-xl shadow-white/5 mt-4"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Reset</span>
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
            Credential Override Complete
          </div>
        </div>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-white/40 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            Abort and Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
