"use client";

import Link from 'next/link';
import React from 'react'

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-primary/20 to-background py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-[var(--font-heading)] text-foreground animate-fade-in">
            Welcome to the Tamarind Mombasa Staff Portal
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your daily operations, from analyzing guest feedback to
            managing approval workflows, all in one place.
          </p>
          <Link href="/login">
            <button className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform duration-200">
              Log In to Get Started
            </button>
          </Link>
        </div>
        {/* Decorative Coastal Element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-accent/10 animate-pulse-slow" />
      </header>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-[var(--font-heading)] font-bold text-foreground text-center mb-12">
            Empowering Staff Operations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-foreground">
                Feedback Analysis
              </h3>
              <p className="mt-2 text-muted-foreground">
                Review and analyze guest feedback to enhance service quality and
                guest satisfaction.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-foreground">
                Approval Workflows
              </h3>
              <p className="mt-2 text-muted-foreground">
                Manage requests and approvals efficiently with streamlined
                workflows.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-foreground">
                Daily Operations
              </h3>
              <p className="mt-2 text-muted-foreground">
                Access tools to handle daily tasks, schedules, and operational
                insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sidebar-foreground text-sm">
            &copy; {new Date().getFullYear()} Tamarind Mombasa. All rights
            reserved.
          </p>
          <p className="mt-2 text-sidebar-foreground text-sm">
            Contact:{" "}
            <a
              href="mailto:info@tamarind.co.ke"
              className="text-secondary hover:underline"
            >
              info@tamarind.co.ke
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage