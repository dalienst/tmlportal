"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateQuestion from "@/forms/questions/CreateQuestion";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { useFetchFeedbacksByFeedbackForm } from "@/hooks/feedbacks/actions";
import Link from "next/link";
import React, { use, useState, useMemo } from "react";
import StarRating from "@/components/general/StarRating";
import UpdateFeedbackForm from "@/forms/feedbackforms/UpdateFeedbackForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function FeedbackFormDetail({ params }) {
  const { form_identity, center_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const {
    isLoading: isLoadingFeedbacks,
    data: allFeedbacks,
    refetch: refetchFeedbacks,
  } = useFetchFeedbacksByFeedbackForm(form_identity);

  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const filterFeedbacks = useMemo(() => {
    if (!allFeedbacks) return [];
    const createdAtDate = (feedback) =>
      new Date(feedback.created_at).toISOString().split("T")[0];
    if (specificDate) {
      return allFeedbacks.filter(
        (feedback) => createdAtDate(feedback) === specificDate
      );
    } else if (startDate && endDate) {
      return allFeedbacks.filter((feedback) => {
        const date = createdAtDate(feedback);
        return date >= startDate && date <= endDate;
      });
    }
    return allFeedbacks; // Default to all feedbacks if no filter
  }, [allFeedbacks, specificDate, startDate, endDate]);

  const paginateFeedbacks = (feedbacks, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return feedbacks.slice(startIndex, endIndex);
  };

  const paginatedFeedbacks = paginateFeedbacks(
    filterFeedbacks,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil((filterFeedbacks?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const toggleRow = (reference) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(reference)) {
      newExpandedRows.delete(reference);
    } else {
      newExpandedRows.add(reference);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleClearFilters = () => {
    setSpecificDate("");
    setStartDate("");
    setEndDate("");
  };

  if (isLoadingFeedbackForm || isLoadingFeedbacks) {
    return <LoadingSpinner />;
  }

  return (
    <div
      id="feedback-form"
      className="container mx-auto p-6 bg-gray-50/50 min-h-screen"
    >
      <div className="mb-6">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/gm/centers/${center_identity}`}>
            <ArrowLeft className="h-4 w-4" /> Back to Center
          </Link>
        </Button>
      </div>
      {/* top section */}
      <div className="mb-2">
        <span className="text-sm text-muted-foreground uppercase font-semibold">
          {feedbackForm?.center}
        </span>
      </div>

      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {feedbackForm?.title} Reviews
            </h2>
          </div>
          {/* buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" /> Add Question
            </Button>
            {feedbackForm?.questions?.length > 0 && (
              <Button asChild variant="secondary" size="sm">
                <Link
                  href={`/feedback/${feedbackForm?.form_identity}`}
                  target="_blank"
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" /> Public Link
                </Link>
              </Button>
            )}
            <Button
              onClick={() => setIsUpdateModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit className="h-4 w-4" /> Update
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link
                href={`/reports/${feedbackForm?.form_identity}`}
                target="_blank"
                className="gap-2"
              >
                <FileText className="h-4 w-4" /> Generate Report
              </Link>
            </Button>
          </div>
          {/* end of buttons */}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbackForm?.total_submissions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <StarRating rating={feedbackForm?.average_rating || 0} />
                <span className="text-sm text-muted-foreground font-normal">
                  ({feedbackForm?.average_rating || 0})
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbackForm?.questions?.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* end of top section */}

      {/* lower section */}
      <section className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle>Responses</CardTitle>
              <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Specific Date:</Label>
                  <Input
                    type="date"
                    value={specificDate}
                    onChange={(e) => {
                      setSpecificDate(e.target.value);
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="w-[150px]"
                    disabled={startDate || endDate}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Start:</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setSpecificDate("");
                    }}
                    className="w-[150px]"
                    disabled={specificDate}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">End:</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setSpecificDate("");
                    }}
                    className="w-[150px]"
                    disabled={specificDate}
                  />
                </div>
                <Button onClick={handleClearFilters} variant="ghost" size="sm">
                  Clear
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {filterFeedbacks.length} records found
            </div>
          </CardHeader>
          <CardContent>
            {filterFeedbacks?.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] text-center">
                          #
                        </TableHead>
                        <TableHead>Guest Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedFeedbacks.map((feedback, index) => {
                        const displayIndex =
                          (currentPage - 1) * itemsPerPage + index + 1;
                        const isExpanded = expandedRows.has(feedback.reference);
                        return (
                          <React.Fragment key={feedback.reference}>
                            <TableRow
                              className={isExpanded ? "bg-muted/50" : ""}
                            >
                              <TableCell className="text-center font-medium">
                                {displayIndex}
                              </TableCell>
                              <TableCell>{feedback.guest_name}</TableCell>
                              <TableCell>
                                {new Date(
                                  feedback.created_at
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRow(feedback.reference)}
                                >
                                  {isExpanded ? (
                                    <>
                                      Hide{" "}
                                      <ChevronUp className="ml-1 h-4 w-4" />
                                    </>
                                  ) : (
                                    <>
                                      View{" "}
                                      <ChevronDown className="ml-1 h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow className="bg-muted/50">
                                <TableCell colSpan={4}>
                                  <div className="p-4 grid gap-4 bg-background rounded-md border">
                                    <h4 className="font-semibold mb-2">
                                      Detailed Responses
                                    </h4>
                                    <ul className="space-y-4">
                                      {feedback.responses.map((resp) => (
                                        <li
                                          key={resp.reference}
                                          className="border-b pb-2 last:border-0 last:pb-0"
                                        >
                                          <div className="font-medium text-sm text-foreground">
                                            {resp.actual_question.text}
                                          </div>
                                          <div className="mt-1 text-sm text-muted-foreground">
                                            {resp.rating !== null ? (
                                              <div className="flex items-center gap-1">
                                                <StarRating
                                                  rating={resp.rating}
                                                  size={14}
                                                />{" "}
                                                ({resp.rating})
                                              </div>
                                            ) : resp.text !== null ? (
                                              resp.text
                                            ) : resp.yes_no !== null ? (
                                              resp.yes_no ? (
                                                "Yes"
                                              ) : (
                                                "No"
                                              )
                                            ) : (
                                              "N/A"
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-muted/50 rounded-md border border-dashed">
                No responses available
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto relative border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <CreateQuestion
              feedbackForm={feedbackForm}
              refetch={refetchFeedbackForm}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto relative border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              ✕
            </button>
            <UpdateFeedbackForm
              refetch={refetchFeedbackForm}
              closeModal={() => setIsUpdateModalOpen(false)}
              center={feedbackForm?.center}
              feedbackForm={feedbackForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackFormDetail;
