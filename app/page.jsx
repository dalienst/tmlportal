"use client";

import Link from "next/link";
import React from "react";
import {
  BarChart3,
  Settings2,
  Workflow,
  ChevronRight,
  Waves,
  Palmtree,
  Anchor,
} from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] selection:bg-primary/30">
      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Modern Mesh Gradient Background */}
        <div className="absolute inset-0 bg-[#0f172a] overflow-hidden">
          <div className="absolute -inset-[10%] opacity-50">
            <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px] animate-mesh" />
            <div
              className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-accent/20 blur-[100px] animate-mesh"
              style={{ animationDelay: "-5s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] animate-pulse" />
          </div>
        </div>

        {/* Floating Coastal Elements (Subtle) */}
        <div className="absolute top-20 left-[10%] text-white/5 rotate-12 animate-bounce-slow">
          <Palmtree size={120} />
        </div>
        <div
          className="absolute bottom-20 right-[5%] text-white/5 -rotate-12 animate-bounce-slow"
          style={{ animationDelay: "-3s" }}
        >
          <Anchor size={100} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Waves size={16} className="text-accent" />
            <span>Coastal Excellence in Hospitality</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Tamarind Mombasa <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-primary">
              Staff Portal
            </span>
          </h1>

          <p className="mt-8 text-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Precision engineering for hospitality operations. Streamline
            workflows, analyze feedback, and manage approvals with the next
            generation of staff tools.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto overflow-hidden bg-white text-[#0f172a] px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                <span className="relative z-10">Access Dashboard</span>
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 px-8 py-4 rounded-full text-lg font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all border border-white/10 backdrop-blur-sm">
              View Guide
            </button>
          </div>
        </div>

        {/* Coastal Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none" />
      </header>

      {/* Features Section */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4">
              Empowering Excellence
            </h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 />}
              title="Feedback Intelligence"
              description="Transform guest feedback into actionable insights. Real-time analysis with advanced sentiment tracking."
              delay="0"
            />
            <FeatureCard
              icon={<Workflow />}
              title="Fluid Workflows"
              description="Eliminate bottlenecks with sequential and parallel approval chains designed for efficiency."
              delay="200"
            />
            <FeatureCard
              icon={<Settings2 />}
              title="Operational Control"
              description="Comprehensive toolkit for daily management, from center operations to credit note oversight."
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center">
                <Waves size={24} className="text-accent" />
              </div>
              <div>
                <p className="font-bold text-[#0f172a]">Tamarind Mombasa</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Hospitality Group
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Tamarind Mombasa. All rights
              reserved.
            </div>

            <div className="flex gap-6 text-sm">
              <a
                href="mailto:info@tamarind.co.ke"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                Support
              </a>
              <span className="text-gray-200">|</span>
              <a
                href="#"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <div
      className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-accent/30 shadow-sm hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-accent/10 flex items-center justify-center text-[#0f172a] group-hover:text-accent transition-colors mb-6">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 className="text-xl font-bold text-[#0f172a] mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default LandingPage;
