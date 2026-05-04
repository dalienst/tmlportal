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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

function ReportGenerator({ params }) {
  const { form_identity } = use(params);
  const router = useRouter()

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
  // Refs for summary page charts
  const summaryPieChartRef = useRef(null);
  // Refs for overview lists
  const overviewBarChartRefs = useRef({});

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
    // doc.setFillColor(245, 245, 245);
    // doc.rect(10, 30, 190, 260, "F");

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

  const downloadGraphAsPng = async (ref, filename) => {
    if (ref.current) {
      try {
        const canvas = await html2canvas(ref.current, {
          useCORS: true,
          scale: 2, // Higher resolution
          backgroundColor: "#ffffff",
        });
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error downloading graph:", error);
      }
    }
  };

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {feedbackForm?.title} Report
          </h2>
          <p className="text-muted-foreground mt-1">
            Analyze feedback submissions and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={downloadPDF} className="gap-2">
            <FileText className="h-4 w-4" /> Download Report
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="summary">Summary Report</option>
                  <option value="question-specific">
                    Question-Specific Report
                  </option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Specific Date</Label>
              <Input
                type="date"
                value={specificDate}
                onChange={(e) => {
                  setSpecificDate(e.target.value);
                  setStartDate("");
                  setEndDate("");
                }}
                disabled={startDate || endDate}
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSpecificDate("");
                }}
                disabled={specificDate}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSpecificDate("");
                }}
                disabled={specificDate}
              />
            </div>
            {reportType === "question-specific" && (
              <div className="space-y-2">
                <Label>Question</Label>
                <div className="relative">
                  <select
                    value={selectedQuestion}
                    onChange={(e) => setSelectedQuestion(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Questions</option>
                    {feedbackForm?.questions.map((q) => (
                      <option key={q.identity} value={q.identity}>
                        {q.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="flex items-end lg:col-span-1">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-right">
            {filterResponses.length} responses found
          </p>
        </CardContent>
      </Card>

      {reportType === "summary" && summaryReport && (
        <div className="space-y-8">
          <h3 className="text-2xl font-bold tracking-tight">Summary Report</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Overview Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          Total Submissions
                        </TableCell>
                        <TableCell className="text-right">
                          {summaryReport.totalSubmissions}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Average Rating
                        </TableCell>
                        <TableCell className="text-right">
                          {summaryReport.averageRating.toFixed(1)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Yes Percentage
                        </TableCell>
                        <TableCell className="text-right">
                          {summaryReport.yesPercentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          No Percentage
                        </TableCell>
                        <TableCell className="text-right">
                          {summaryReport.noPercentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Rating Responses
                        </TableCell>
                        <TableCell className="text-right">
                          {summaryReport.ratingCount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Yes/No Responses
                        </TableCell>
                        <TableCell className="text-right">
                          {summaryReport.yesNoCount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Yes/No Distribution</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    downloadGraphAsPng(
                      summaryPieChartRef,
                      "summary_yes_no_distribution"
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]" ref={summaryPieChartRef}>
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
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {summaryReport.texts && summaryReport.texts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Comment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryReport.texts
                        .slice((summaryTextPage - 1) * 10, summaryTextPage * 10)
                        .map((text, index) => (
                          <TableRow key={index}>
                            <TableCell>{text}</TableCell>
                          </TableRow>
                        ))}
                      {summaryReport.texts.length === 0 && (
                        <TableRow>
                          <TableCell className="text-muted-foreground text-center">
                            No comments found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {summaryReport.texts.length > 10 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSummaryTextPage(summaryTextPage - 1)}
                      disabled={summaryTextPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">Page {summaryTextPage}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSummaryTextPage(summaryTextPage + 1)}
                      disabled={
                        summaryTextPage * 10 >= summaryReport.texts.length
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {reportType === "question-specific" && (
        <div className="space-y-8">
          {!selectedQuestion && defaultQuestionReport && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight">
                Overview by Question
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {Object.entries(defaultQuestionReport).map(
                  ([id, stats], index) => {
                    const question = feedbackForm.questions.find(
                      (q) => q.identity === id
                    );
                    if (!question) return null;

                    const ratingData = Array.from({ length: 5 }, (_, i) => {
                      const rating = i + 1;
                      return {
                        rating: rating.toString(),
                        count:
                          stats.ratings?.filter((r) => Math.floor(r) === rating)
                            .length || 0,
                      };
                    });
                    const textResponses =
                      stats.type === "TEXT" ? stats.texts.slice(0, 10) : [];

                    return (
                      <Card key={id} className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-lg font-semibold">
                            {question.text}
                          </CardTitle>
                          {(stats.type === "YES_NO" ||
                            stats.type === "RATING") && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  // Use ref callback or store refs in object
                                  // For simplicity using unique ID selector here as refs in loop are tricky
                                  const el = document.getElementById(
                                    `chart-container-${id}`
                                  );
                                  if (el) {
                                    html2canvas(el, {
                                      useCORS: true,
                                      scale: 2,
                                      backgroundColor: "#ffffff",
                                    }).then((canvas) => {
                                      const link = document.createElement("a");
                                      link.download = `chart_${id}.png`;
                                      link.href = canvas.toDataURL("image/png");
                                      link.click();
                                    });
                                  }
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                          {stats.type === "RATING" && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <span className="font-medium">
                                  Average Rating
                                </span>
                                <span className="text-2xl font-bold">
                                  {stats.average.toFixed(1)}
                                </span>
                              </div>
                              <div
                                className="h-[250px]"
                                id={`chart-container-${id}`}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={ratingData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rating" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                      type="monotone"
                                      dataKey="count"
                                      stroke="#3490dc"
                                      strokeWidth={2}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}
                          {stats.type === "YES_NO" && (
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="w-full md:w-1/3 space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                      Yes
                                    </span>
                                    <span className="font-bold">
                                      {stats.yesPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                      No
                                    </span>
                                    <span className="font-bold">
                                      {stats.noPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="w-full md:w-2/3 h-[250px]"
                                id={`chart-container-${id}`}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={[
                                      {
                                        name: "Yes",
                                        value: stats.yesPercentage,
                                      },
                                      { name: "No", value: stats.noPercentage },
                                    ]}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                      dataKey="value"
                                      fill="#3490dc"
                                      radius={[4, 4, 0, 0]}
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}
                          {stats.type === "TEXT" && (
                            <div className="space-y-2">
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Latest Comments</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {textResponses.map((text, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="text-sm">
                                          {text}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    {textResponses.length === 0 && (
                                      <TableRow>
                                        <TableCell className="text-muted-foreground text-center">
                                          No comments
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                              {stats.texts.length > 10 && (
                                <div className="flex items-center justify-end space-x-2 pt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setAllQuestionsPage(allQuestionsPage - 1)
                                    }
                                    disabled={allQuestionsPage === 1}
                                  >
                                    Prev
                                  </Button>
                                  <span className="text-xs">
                                    Page {allQuestionsPage}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setAllQuestionsPage(allQuestionsPage + 1)
                                    }
                                    disabled={
                                      allQuestionsPage * 10 >=
                                      stats.texts.length
                                    }
                                  >
                                    Next
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {selectedQuestion && questionReport && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight">
                Report for:{" "}
                {
                  feedbackForm.questions.find(
                    (q) => q.identity === selectedQuestion
                  )?.text
                }
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {(questionReport.yesPercentage !== undefined ||
                  questionReport.averageRating !== undefined) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableBody>
                              {questionReport.averageRating !== undefined && (
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Average Rating
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {questionReport.averageRating.toFixed(1)}
                                  </TableCell>
                                </TableRow>
                              )}
                              {questionReport.yesPercentage !== undefined && (
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Yes Percentage
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {questionReport.yesPercentage.toFixed(1)}%
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {questionReport.yesPercentage !== undefined && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Distribution Chart</CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          downloadGraphAsPng(
                            pieChartRef,
                            "question_distribution"
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]" ref={pieChartRef}>
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
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {questionReport.ratings && (
                  <Card className="col-span-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Rating Distribution</CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          downloadGraphAsPng(barChartRef, "rating_distribution")
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]" ref={barChartRef}>
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
                            <Bar
                              dataKey="value"
                              fill="#3490dc"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {questionReport.texts && (
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Comment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {questionReport.texts
                          .slice(
                            (specificTextPage - 1) * 10,
                            specificTextPage * 10
                          )
                          .map((text, index) => (
                            <TableRow key={index}>
                              <TableCell>{text}</TableCell>
                            </TableRow>
                          ))}
                        {questionReport.texts.length === 0 && (
                          <TableRow>
                            <TableCell className="text-muted-foreground text-center">
                              No comments
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {questionReport.texts.length > 10 && (
                      <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSpecificTextPage(specificTextPage - 1)
                          }
                          disabled={specificTextPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">Page {specificTextPage}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSpecificTextPage(specificTextPage + 1)
                          }
                          disabled={
                            specificTextPage * 10 >= questionReport.texts.length
                          }
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportGenerator;
