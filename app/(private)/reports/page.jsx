"use client";

import { useSession } from "next-auth/react";
import React, { useState, useMemo } from "react";
import { useFetchFeedbackReportsSummary } from "@/hooks/feedbackforms/actions";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, LayoutDashboard, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReportsSummaryPage() {
  const { data: session } = useSession();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const portalHref = useMemo(() => {
    if (session?.user?.is_admin) return "/admin";
    if (session?.user?.is_gm) return "/gm";
    if (session?.user?.is_finance) return "/finance";
    if (session?.user?.is_reservations) return "/reservations";
    if (session?.user?.is_manager) return "/managers";
    if (session?.user?.is_employee) return "/employees";
    if (session?.user?.is_auditor) return "/auditor";
    if (session?.user?.is_it) return "/it";
    return "/";
  }, [session]);

  // Helper to get month options (last 12 months)
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "long", year: "numeric" });
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      options.push({ label, value });
    }
    return options;
  }, []);

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    if (value) {
      const [year, month] = value.split("-").map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };

      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(lastDay));
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const { data: summaryData, isLoading } = useFetchFeedbackReportsSummary({
    start_date: startDate,
    end_date: endDate
  });

  const reports = summaryData?.results || [];
  const aggregates = summaryData?.aggregates || {};

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6">
        <Link 
          href={portalHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            Centralized Reports Dashboard
          </h1>
          <p className="text-sm text-[#666] mt-1 uppercase tracking-widest font-semibold">
            Group Performance Overview
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-[#eee] shadow-sm">
          <span className="text-xs font-bold text-[#666] uppercase tracking-wider pl-2">Filter Period:</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => handleMonthChange(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-bold text-[#1a1a1a] cursor-pointer focus:ring-0 h-9 px-2"
          >
            <option value="">Current Month</option>
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Group Aggregates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="border-none shadow-sm bg-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Group Score</p>
            <div className="flex items-end gap-2">
                <span className="text-4xl font-mono font-bold leading-none">{aggregates.average_rating || "0.0"}</span>
                <span className="text-sm opacity-80 mb-1">/ 10</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#eee] shadow-sm bg-white">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Total Feedbacks</p>
            <p className="text-4xl font-mono font-bold text-[#1a1a1a] leading-none">{aggregates.total_submissions || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-[#eee] shadow-sm bg-white">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Overall Satisfaction</p>
            <p className="text-4xl font-mono font-bold text-green-600 leading-none">{aggregates.satisfaction_pct || 0}%</p>
          </CardContent>
        </Card>
        <Card className="border-[#eee] shadow-sm bg-white">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Active Centers</p>
            <p className="text-4xl font-mono font-bold text-[#1a1a1a] leading-none">{aggregates.center_count || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reports.map((report) => (
          <Card key={report.form_identity} className="border-[#eee] shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden group">
            <CardHeader className="pb-3 border-b border-[#f9f9f9]">
              <div className="flex justify-between items-start">
                <div className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                  {report.center}
                </div>
                {report.is_published ? (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-[#999] uppercase">Draft</span>
                )}
              </div>
              <CardTitle className="text-lg font-bold text-[#1a1a1a] group-hover:text-blue-600 transition-colors">
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Avg Rating</p>
                  <p className="text-3xl font-mono font-bold text-[#1a1a1a]">
                    {report.average_rating ? report.average_rating.toFixed(1) : "0.0"}
                    <span className="text-xs text-[#999] font-sans ml-1">/ 10</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Submissions</p>
                  <p className="text-3xl font-mono font-bold text-[#1a1a1a]">
                    {report.total_submissions}
                  </p>
                </div>
              </div>

              {/* Mini Sentiment Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Satisfaction Split</span>
                  <span className="text-[10px] font-mono font-bold text-green-600">{report.yes_percentage}% YES</span>
                </div>
                <div className="h-1.5 w-full bg-[#f0f0f0] rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${report.yes_percentage}%` }}
                  ></div>
                  <div 
                    className="h-full bg-red-400" 
                    style={{ width: `${report.no_percentage}%` }}
                  ></div>
                </div>
              </div>

              <Link href={`/reports/${report.form_identity}`}>
                <Button className="w-full bg-[#f9fafb] hover:bg-blue-50 text-[#1a1a1a] hover:text-blue-700 border border-[#eee] hover:border-blue-200 transition-all font-bold text-xs uppercase tracking-widest py-5 h-auto">
                  Analyze Detailed Data
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-[#ccc] rounded-xl">
          <FileText className="w-12 h-12 text-[#ccc] mb-4" />
          <h3 className="text-lg font-bold text-[#666]">No active reports found</h3>
          <p className="text-sm text-[#999]">Try selecting a different filter period or check your published forms.</p>
        </div>
      )}
    </div>
  );
}
