"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import Link from "next/link";
import React, { use, useState, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function ReportGenerator({ params }) {
  const { form_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const [reportType, setReportType] = useState("summary");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allQuestionsPage, setAllQuestionsPage] = useState(1);
  const [specificTextPage, setSpecificTextPage] = useState(1);
  const [summaryTextPage, setSummaryTextPage] = useState(1);

  const handleClearFilters = () => {
    setSpecificDate("");
    setStartDate("");
    setEndDate("");
    setSelectedQuestion("");
    setAllQuestionsPage(1);
    setSpecificTextPage(1);
    setSummaryTextPage(1);
  };

  const createdAtDate = (response) =>
    new Date(response.created_at).toISOString().split("T")[0];

  const filterResponses = useMemo(() => {
    if (!feedbackForm?.form_submissions) return [];
    let filtered = feedbackForm.form_submissions.flatMap(
      (submission) => submission.responses
    );
    if (specificDate) {
      filtered = filtered.filter(
        (response) => createdAtDate(response) === specificDate
      );
    } else if (startDate && endDate) {
      filtered = filtered.filter((response) => {
        const date = createdAtDate(response);
        return date >= startDate && date <= endDate;
      });
    }
    if (reportType === "question-specific" && selectedQuestion) {
      filtered = filtered.filter(
        (response) => response.question === selectedQuestion
      );
    }
    return filtered;
  }, [
    feedbackForm,
    specificDate,
    startDate,
    endDate,
    reportType,
    selectedQuestion,
  ]);

  const generateSummaryReport = () => {
    const totalSubmissions = feedbackForm?.total_submissions || 0;
    const ratings = filterResponses
      .filter((r) => r.rating !== null)
      .map((r) => r.rating);
    const yesNo = filterResponses
      .filter((r) => r.yes_no !== null)
      .map((r) => r.yes_no);
    const texts = filterResponses
      .filter((r) => r.text)
      .map((r) => r.text)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    const yesCount = yesNo.filter((v) => v).length;
    const noCount = yesNo.filter((v) => !v).length;
    const yesPercentage =
      yesNo.length > 0 ? (yesCount / yesNo.length) * 100 : 0;
    const noPercentage = yesNo.length > 0 ? (noCount / yesNo.length) * 100 : 0;

    return {
      totalSubmissions,
      averageRating,
      yesPercentage,
      noPercentage,
      ratingCount: ratings.length,
      yesNoCount: yesNo.length,
      texts,
    };
  };

  const generateDefaultQuestionReport = () => {
    const questionStats = {};
    feedbackForm?.questions.forEach((question) => {
      if (question.type === "RATING") {
        const ratings = filterResponses
          .filter((r) => r.question === question.identity && r.rating !== null)
          .map((r) => r.rating);
        questionStats[question.identity] = {
          type: "RATING",
          average:
            ratings.length > 0
              ? ratings.reduce((a, b) => a + b, 0) / ratings.length
              : 0,
          ratings: ratings,
        };
      } else if (question.type === "YES_NO") {
        const yesNo = filterResponses
          .filter((r) => r.question === question.identity && r.yes_no !== null)
          .map((r) => r.yes_no);
        const yesCount = yesNo.filter((v) => v).length;
        const noCount = yesNo.filter((v) => !v).length;
        const yesPercentage =
          yesNo.length > 0 ? (yesCount / yesNo.length) * 100 : 0;
        const noPercentage =
          yesNo.length > 0 ? (noCount / yesNo.length) * 100 : 0;
        questionStats[question.identity] = {
          type: "YES_NO",
          yesPercentage,
          noPercentage,
        };
      } else if (question.type === "TEXT") {
        const texts = filterResponses
          .filter((r) => r.question === question.identity && r.text)
          .map((r) => r.text)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        questionStats[question.identity] = {
          type: "TEXT",
          texts,
        };
      }
    });
    return questionStats;
  };

  const generateQuestionReport = () => {
    const question = feedbackForm?.questions.find(
      (q) => q.identity === selectedQuestion
    );
    if (!question) return null;

    const responses = filterResponses;
    if (question.type === "RATING") {
      const ratings = responses
        .filter((r) => r.question === selectedQuestion && r.rating !== null)
        .map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      return { averageRating, ratings };
    } else if (question.type === "YES_NO") {
      const yesNo = responses
        .filter((r) => r.question === selectedQuestion && r.yes_no !== null)
        .map((r) => r.yes_no);
      const yesCount = yesNo.filter((v) => v).length;
      const noCount = yesNo.filter((v) => !v).length;
      const yesPercentage =
        yesNo.length > 0 ? (yesCount / yesNo.length) * 100 : 0;
      const noPercentage =
        yesNo.length > 0 ? (noCount / yesNo.length) * 100 : 0;
      return { yesPercentage, noPercentage };
    } else if (question.type === "TEXT") {
      const texts = responses
        .filter((r) => r.question === selectedQuestion)
        .map((r) => r.text)
        .filter((t) => t)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { texts };
    }
    return null;
  };

  const summaryReport =
    reportType === "summary" ? generateSummaryReport() : null;
  const defaultQuestionReport =
    reportType === "question-specific" && !selectedQuestion
      ? generateDefaultQuestionReport()
      : null;
  const questionReport =
    reportType === "question-specific" && selectedQuestion
      ? generateQuestionReport()
      : null;

  const COLORS = ["#3490dc", "#e3342f"];
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  const downloadPDF = async () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 128);
    doc.text(`Feedback Report: ${feedbackForm?.title}`, 105, 20, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(245, 245, 245);
    doc.rect(10, 30, 190, 260, "F");

    let yOffset = 40;
    if (reportType === "summary" && summaryReport) {
      autoTable(doc, {
        startY: yOffset,
        head: [["Metric", "Value"]],
        body: [
          ["Total Submissions", summaryReport.totalSubmissions],
          ["Average Rating", `${summaryReport.averageRating.toFixed(1)}`],
          ["Yes Percentage", `${summaryReport.yesPercentage.toFixed(1)}%`],
          ["No Percentage", `${summaryReport.noPercentage.toFixed(1)}%`],
          ["Rating Responses", summaryReport.ratingCount],
          ["Yes/No Responses", summaryReport.yesNoCount],
        ],
        theme: "grid",
        styles: { cellPadding: 2, fontSize: 10, halign: "left" },
        headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
      });
      yOffset = doc.lastAutoTable.finalY + 10;
      if (summaryReport.texts && summaryReport.texts.length > 0) {
        autoTable(doc, {
          startY: yOffset,
          head: [["Comments"]],
          body: summaryReport.texts.map((text) => [text]),
          theme: "grid",
          styles: { cellPadding: 2, fontSize: 10, halign: "left" },
          headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      }
    } else if (reportType === "question-specific") {
      if (!selectedQuestion && defaultQuestionReport) {
        doc.text("Ratings for All Questions", 20, (yOffset += 10));
        const body = feedbackForm.questions
          .filter((q) => defaultQuestionReport[q.identity]?.type === "RATING")
          .map((q) => [
            q.text,
            defaultQuestionReport[q.identity]?.average?.toFixed(1) || "N/A",
          ]);
        autoTable(doc, {
          startY: yOffset,
          head: [["Question", "Average Rating"]],
          body: body,
          theme: "grid",
          styles: { cellPadding: 2, fontSize: 10, halign: "left" },
          headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      } else if (questionReport) {
        const questionText = feedbackForm.questions.find(
          (q) => q.identity === selectedQuestion
        )?.text;
        doc.text(`Report for: ${questionText}`, 20, (yOffset += 10));
        let body = [];
        if (questionReport.averageRating !== undefined) {
          body.push([
            "Average Rating",
            `${questionReport.averageRating.toFixed(1)}`,
          ]);
        }
        if (questionReport.yesPercentage !== undefined) {
          body.push([
            "Yes Percentage",
            `${questionReport.yesPercentage.toFixed(1)}%`,
          ]);
        }
        if (questionReport.texts && questionReport.texts.length > 0) {
          body.push(["Comments", ""]);
          questionReport.texts.forEach((text, index) => {
            body.push([`Comment ${index + 1}`, text]);
          });
        } else {
          body.push(["No Data", ""]);
        }
        autoTable(doc, {
          startY: yOffset,
          head: [["Metric", "Value"]],
          body: body,
          theme: "grid",
          styles: { cellPadding: 2, fontSize: 10, halign: "left" },
          headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
        });
        yOffset = doc.lastAutoTable.finalY + 10;

        if (questionReport.yesPercentage !== undefined && pieChartRef.current) {
          const pieCanvas = await html2canvas(pieChartRef.current, {
            useCORS: true,
            scale: 2,
          });
          const imgData = pieCanvas.toDataURL("image/png");
          const imgWidth = 190;
          const imgHeight = (pieCanvas.height * imgWidth) / pieCanvas.width;
          if (imgData.length > 100) {
            doc.addPage();
            doc.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
            yOffset = imgHeight + 30;
          }
        }
        if (questionReport.ratings && barChartRef.current) {
          const barCanvas = await html2canvas(barChartRef.current, {
            useCORS: true,
            scale: 2,
          });
          const imgData = barCanvas.toDataURL("image/png");
          const imgWidth = 190;
          const imgHeight = (barCanvas.height * imgWidth) / barCanvas.width;
          if (imgData.length > 100) {
            doc.addPage();
            doc.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
            yOffset = imgHeight + 30;
          }
        }
      }
    }

    doc.save(`report_${form_identity}.pdf`);
  };

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-6 px-4 bg-background">
      <div className="w-full max-w-4xl p-6 bg-white border border-border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Report for {feedbackForm?.title}
        </h2>
        <div className="mb-6 p-4 bg-card border border-border rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4 mb-4 items-end">
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-foreground mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-muted"
              >
                <option value="summary">Summary Report</option>
                <option value="question-specific">
                  Question-Specific Report
                </option>
              </select>
            </div>
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-foreground mb-1">
                Specific Date
              </label>
              <input
                type="date"
                value={specificDate}
                onChange={(e) => {
                  setSpecificDate(e.target.value);
                  setStartDate("");
                  setEndDate("");
                }}
                className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-muted"
                disabled={startDate || endDate}
              />
            </div>
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-foreground mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSpecificDate("");
                }}
                className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-muted"
                disabled={specificDate}
              />
            </div>
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-foreground mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSpecificDate("");
                }}
                className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-muted"
                disabled={specificDate}
              />
            </div>
            {reportType === "question-specific" && (
              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Question
                </label>
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-muted"
                >
                  <option value="">All Questions</option>
                  {feedbackForm?.questions.map((q) => (
                    <option key={q.identity} value={q.identity}>
                      {q.text}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="w-full lg:w-auto">
              <button
                onClick={handleClearFilters}
                className="w-full bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {filterResponses.length} responses found
          </p>
        </div>
        <div className="mb-6">
          {reportType === "summary" && summaryReport && (
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Summary Report
              </h3>
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left text-foreground">
                      Metric
                    </th>
                    <th className="border border-border p-2 text-left text-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2 text-foreground">
                      Total Submissions
                    </td>
                    <td className="border border-border p-2 text-foreground">
                      {summaryReport.totalSubmissions}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-foreground">
                      Average Rating
                    </td>
                    <td className="border border-border p-2 text-foreground">
                      {summaryReport.averageRating.toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-foreground">
                      Yes Percentage
                    </td>
                    <td className="border border-border p-2 text-foreground">
                      {summaryReport.yesPercentage.toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-foreground">
                      No Percentage
                    </td>
                    <td className="border border-border p-2 text-foreground">
                      {summaryReport.noPercentage.toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-foreground">
                      Rating Responses
                    </td>
                    <td className="border border-border p-2 text-foreground">
                      {summaryReport.ratingCount}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-foreground">
                      Yes/No Responses
                    </td>
                    <td className="border border-border p-2 text-foreground">
                      {summaryReport.yesNoCount}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 h-64">
                <h4 className="text-lg font-medium text-foreground mb-2">
                  Yes/No Distribution
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Yes", value: summaryReport.yesPercentage },
                        { name: "No", value: summaryReport.noPercentage },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {summaryReport.texts && summaryReport.texts.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-foreground mb-2">
                    Comments
                  </h4>
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left text-foreground">
                          Comment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryReport.texts
                        .slice((summaryTextPage - 1) * 10, summaryTextPage * 10)
                        .map((text, index) => (
                          <tr key={index}>
                            <td className="border border-border p-2 text-foreground">
                              {text}
                            </td>
                          </tr>
                        ))}
                      {summaryReport.texts.length === 0 && (
                        <tr>
                          <td
                            className="border border-border p-2 text-foreground"
                            colSpan="2"
                          >
                            No Data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {summaryReport.texts.length > 10 && (
                    <div className="mt-2">
                      <button
                        onClick={() => setSummaryTextPage(summaryTextPage + 1)}
                        disabled={
                          summaryTextPage * 10 >= summaryReport.texts.length
                        }
                        className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm disabled:opacity-50"
                      >
                        Next Page
                      </button>
                      <button
                        onClick={() => setSummaryTextPage(summaryTextPage - 1)}
                        disabled={summaryTextPage === 1}
                        className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm ml-2 disabled:opacity-50"
                      >
                        Previous Page
                      </button>
                      <span className="ml-2 text-sm text-muted-foreground">
                        Page {summaryTextPage}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {reportType === "question-specific" && (
            <div>
              {!selectedQuestion && defaultQuestionReport && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Overview by Question
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(defaultQuestionReport).map(
                      ([id, stats], index) => {
                        const question = feedbackForm.questions.find(
                          (q) => q.identity === id
                        );
                        const ratingData = Array.from({ length: 5 }, (_, i) => {
                          const rating = i + 1;
                          return {
                            rating: rating.toString(),
                            count:
                              stats.ratings?.filter(
                                (r) => Math.floor(r) === rating
                              ).length || 0,
                          };
                        });
                        const textResponses =
                          stats.type === "TEXT" ? stats.texts.slice(0, 10) : [];
                        return (
                          <div
                            key={id}
                            className={`mb-6 ${
                              stats.type === "RATING" ? "" : "col-span-full"
                            }`}
                          >
                            <h4 className="text-lg font-medium text-foreground mb-2">
                              {question?.text}
                            </h4>
                            {stats.type === "RATING" && (
                              <table className="w-full border-collapse border border-border">
                                <thead>
                                  <tr className="bg-muted">
                                    <th className="border border-border p-2 text-left text-foreground">
                                      Metric
                                    </th>
                                    <th className="border border-border p-2 text-left text-foreground">
                                      Value
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="border border-border p-2 text-foreground">
                                      Average Rating
                                    </td>
                                    <td className="border border-border p-2 text-foreground">
                                      {stats.average.toFixed(1)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                            {stats.type === "YES_NO" && (
                              <div className="flex flex-col lg:flex-row gap-4">
                                <table className="w-full lg:w-1/2 border-collapse border border-border">
                                  <thead>
                                    <tr className="bg-muted">
                                      <th className="border border-border p-2 text-left text-foreground">
                                        Metric
                                      </th>
                                      <th className="border border-border p-2 text-left text-foreground">
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border border-border p-2 text-foreground">
                                        Yes Percentage
                                      </td>
                                      <td className="border border-border p-2 text-foreground">
                                        {stats.yesPercentage.toFixed(1)}%
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border border-border p-2 text-foreground">
                                        No Percentage
                                      </td>
                                      <td className="border border-border p-2 text-foreground">
                                        {stats.noPercentage.toFixed(1)}%
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="w-full lg:w-1/2 h-64 mt-4 lg:mt-0">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={[
                                        {
                                          name: "Yes",
                                          value: stats.yesPercentage,
                                        },
                                        {
                                          name: "No",
                                          value: stats.noPercentage,
                                        },
                                      ]}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Bar dataKey="value" fill="#3490dc" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            )}
                            {stats.type === "TEXT" && (
                              <table className="w-full border-collapse border border-border">
                                <thead>
                                  <tr className="bg-muted">
                                    <th className="border border-border p-2 text-left text-foreground">
                                      Comment
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {textResponses.map((text, index) => (
                                    <tr key={index}>
                                      <td className="border border-border p-2 text-foreground">
                                        {text}
                                      </td>
                                    </tr>
                                  ))}
                                  {textResponses.length === 0 && (
                                    <tr>
                                      <td
                                        className="border border-border p-2 text-foreground"
                                        colSpan="2"
                                      >
                                        No Data
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            )}
                            {stats.type === "TEXT" &&
                              stats.texts.length > 10 && (
                                <div className="mt-2">
                                  <button
                                    onClick={() =>
                                      setAllQuestionsPage(allQuestionsPage + 1)
                                    }
                                    disabled={
                                      allQuestionsPage * 10 >=
                                      stats.texts.length
                                    }
                                    className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm disabled:opacity-50"
                                  >
                                    Next Page
                                  </button>
                                  <button
                                    onClick={() =>
                                      setAllQuestionsPage(allQuestionsPage - 1)
                                    }
                                    disabled={allQuestionsPage === 1}
                                    className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm ml-2 disabled:opacity-50"
                                  >
                                    Previous Page
                                  </button>
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    Page {allQuestionsPage}
                                  </span>
                                </div>
                              )}
                            {stats.type === "RATING" && (
                              <div className="mt-6 h-64">
                                <h5 className="text-md font-medium text-foreground mb-2">
                                  Rating Trend
                                </h5>
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={ratingData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rating" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                      type="monotone"
                                      dataKey="count"
                                      stroke="#3490dc"
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
              {selectedQuestion && questionReport && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Report for{" "}
                    {
                      feedbackForm.questions.find(
                        (q) => q.identity === selectedQuestion
                      )?.text
                    }
                  </h3>
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left text-foreground">
                          Metric
                        </th>
                        <th className="border border-border p-2 text-left text-foreground">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionReport.averageRating !== undefined && (
                        <tr>
                          <td className="border border-border p-2 text-foreground">
                            Average Rating
                          </td>
                          <td className="border border-border p-2 text-foreground">
                            {questionReport.averageRating.toFixed(1)}
                          </td>
                        </tr>
                      )}
                      {questionReport.yesPercentage !== undefined && (
                        <tr>
                          <td className="border border-border p-2 text-foreground">
                            Yes Percentage
                          </td>
                          <td className="border border-border p-2 text-foreground">
                            {questionReport.yesPercentage.toFixed(1)}%
                          </td>
                        </tr>
                      )}
                      {questionReport.texts &&
                        questionReport.texts
                          .slice(
                            (specificTextPage - 1) * 10,
                            specificTextPage * 10
                          )
                          .map((text, index) => (
                            <tr key={index}>
                              <td className="border border-border p-2 text-foreground">
                                Comment{" "}
                                {index + 1 + (specificTextPage - 1) * 10}
                              </td>
                              <td className="border border-border p-2 text-foreground">
                                {text}
                              </td>
                            </tr>
                          ))}
                      {questionReport.texts &&
                        questionReport.texts.length === 0 && (
                          <tr>
                            <td
                              className="border border-border p-2 text-foreground"
                              colSpan="2"
                            >
                              No Data
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                  {questionReport.texts && questionReport.texts.length > 10 && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setSpecificTextPage(specificTextPage + 1)
                        }
                        disabled={
                          specificTextPage * 10 >= questionReport.texts.length
                        }
                        className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm disabled:opacity-50"
                      >
                        Next Page
                      </button>
                      <button
                        onClick={() =>
                          setSpecificTextPage(specificTextPage - 1)
                        }
                        disabled={specificTextPage === 1}
                        className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm ml-2 disabled:opacity-50"
                      >
                        Previous Page
                      </button>
                      <span className="ml-2 text-sm text-muted-foreground">
                        Page {specificTextPage}
                      </span>
                    </div>
                  )}
                  <div className="mt-6">
                    {questionReport.ratings && (
                      <div ref={barChartRef}>
                        <h4 className="text-lg font-medium text-foreground mb-2">
                          Rating Distribution
                        </h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={Array.from({ length: 5 }, (_, i) => {
                                const rating = i + 1;
                                return {
                                  name: rating.toString(),
                                  value: questionReport.ratings.filter(
                                    (r) => Math.floor(r) === rating
                                  ).length,
                                };
                              })}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="value" fill="#3490dc" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                    {questionReport.yesPercentage !== undefined && (
                      <div ref={pieChartRef}>
                        <h4 className="text-lg font-medium text-foreground mb-2">
                          Yes/No Distribution
                        </h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  {
                                    name: "Yes",
                                    value: questionReport.yesPercentage,
                                  },
                                  {
                                    name: "No",
                                    value: 100 - questionReport.yesPercentage,
                                  },
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                              >
                                {COLORS.map((color, index) => (
                                  <Cell key={`cell-${index}`} fill={color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
          <button>
          <Link
            href={`/feedback/${form_identity}`}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Back to Form
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportGenerator;