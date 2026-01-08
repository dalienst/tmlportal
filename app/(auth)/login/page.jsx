"use client";

import { signIn, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Waves,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    const session = await getSession();

    if (response?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful!");
      if (session?.user?.is_admin) router.push("/admin");
      else if (session?.user?.is_gm) router.push("/gm");
      else if (session?.user?.is_finance) router.push("/finance");
      else if (session?.user?.is_reservations) router.push("/reservations");
      else if (session?.user?.is_manager) router.push("/managers");
      else if (session?.user?.is_employee) router.push("/employees");
      else if (session?.user?.is_auditor) router.push("/auditor");
      else if (session?.user?.is_it) router.push("/it");
      else router.push("/");
    }
    setLoading(false);
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
            <Waves className="text-accent" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Staff Portal
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Connect to Tamarind Operations
          </p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="glass-dark p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <h2 className="text-xl font-semibold text-white mb-8 text-center">
            Identity Verification
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-medium text-white/60 ml-1 uppercase tracking-wider"
              >
                Passphrase/Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                  size={20}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end pr-1">
                <Link
                  href="/forgot-password"
                  className="text-[10px] text-white/40 hover:text-accent transition-colors uppercase tracking-[0.1em]"
                >
                  Lost Access / Forgot Passphrase?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-white text-[#0f172a] py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 overflow-hidden shadow-xl shadow-white/5"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
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

          {/* Additional Info */}
          <div className="mt-8 text-center text-white/40 text-[10px] uppercase tracking-[0.2em]">
            Secure Access Channel | Tamarind Group IT
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-white/40 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            Return to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
