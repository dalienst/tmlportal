"use client";

import { signIn, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      toast.success("Login successful! Redirecting...");
      if (session?.user?.is_admin) router.push("/admin");
      else if (session?.user?.is_gm) router.push("/gm");
      else if (session?.user?.is_finance) router.push("/finance");
      else if (session?.user?.is_reservations) router.push("/reservations");
      else if (session?.user?.is_manager) router.push("/manager");
      else if (session?.user?.is_employee) router.push("/employees");
      else router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-0">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Tamarind Mombasa Logo"
            width={150}
            height={50}
          />
        </div>
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Staff Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
