"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateQuestion from "@/forms/questions/CreateQuestion";
import UpdateQuestion from "@/forms/questions/UpdateQuestion";
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
  Settings2,
} from "lucide-react";
import Modal from "@/components/general/Modal";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [isUpdateQuestionModalOpen, setIsUpdateQuestionModalOpen] =
    useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const itemsPerPage = 20;

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
    <div id="feedback-form" className="container mx-auto px-4 py-2 min-h-screen">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/gm/centers/${center_identity}`}>
            <ArrowLeft className="h-4 w-4" /> Back to Center
          </Link>
        </Button>
      </div>

      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="space-y-1">
            <span className="text-sm text-primary">
              {feedbackForm?.center}
            </span>
            <h2 className="text-xl font-medium text-gray-900 leading-none">
              {feedbackForm?.title} Overview
            </h2>
          </div>
          {/* buttons */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="h-4 w-4" /> Manage Form
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="grid gap-1">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="ghost"
                  className="justify-start gap-2 h-9"
                  size="sm"
                >
                  <Plus className="h-4 w-4 text-primary" /> Add Question
                </Button>
                <Button
                  onClick={() => setIsUpdateModalOpen(true)}
                  variant="ghost"
                  className="justify-start gap-2 h-9"
                  size="sm"
                >
                  <Edit className="h-4 w-4 text-primary" /> Update Form
                </Button>
                {feedbackForm?.questions?.length > 0 && (
                  <Button asChild variant="ghost" className="justify-start gap-2 h-9" size="sm">
                    <Link
                      href={`/feedback/${feedbackForm?.form_identity}`}
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4 text-primary" /> Public Link
                    </Link>
                  </Button>
                )}
                <Button asChild variant="ghost" className="justify-start gap-2 h-9" size="sm">
                  <Link
                    href={`/reports/${feedbackForm?.form_identity}`}
                    target="_blank"
                  >
                    <FileText className="h-4 w-4 text-primary" /> Generate Report
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {/* end of buttons */}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900">
                {feedbackForm?.total_submissions || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl flex items-center gap-2">
                <StarRating rating={feedbackForm?.average_rating || 0} />
                <span className="text-sm text-muted-foreground font-normal">
                  ({feedbackForm?.average_rating || 0})
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900">
                {feedbackForm?.questions?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* end of top section */}

      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="bg-white p-1 rounded shadow-sm border border-border w-max">
          <TabsTrigger
            value="responses"
            className="px-6 rounded text-sm  data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Responses
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="px-6 rounded text-sm  data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>Detailed Feedback</CardTitle>
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
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                  >
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
                  <div className="rounded border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted ring-1 ring-border">
                          <TableHead className="w-[50px] text-center">
                            #
                          </TableHead>
                          <TableHead>Guest Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedFeedbacks.map((feedback, index) => {
                          const displayIndex =
                            (currentPage - 1) * itemsPerPage + index + 1;
                          const isExpanded = expandedRows.has(
                            feedback.reference
                          );
                          return (
                            <React.Fragment key={feedback.reference}>
                              <TableRow
                                className={
                                  isExpanded
                                    ? "bg-muted/50"
                                    : "hover:bg-muted/30 transition-colors"
                                }
                              >
                                <TableCell className="text-center font-medium">
                                  {displayIndex}
                                </TableCell>
                                <TableCell className="font-semibold text-gray-900">
                                  {feedback.guest_name}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    feedback.created_at
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleRow(feedback.reference)}
                                    className="hover:bg-primary/10 hover:text-primary"
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
                                <TableRow className="bg-muted/20">
                                  <TableCell colSpan={4}>
                                    <div className="p-6 grid gap-6 bg-white rounded border shadow-inner">
                                      <h4 className=" text-gray-900 border-b pb-2">
                                        Full Review Details
                                      </h4>
                                      <div className="grid gap-6 sm:grid-cols-2">
                                        {feedback.responses.map((resp) => (
                                          <div
                                            key={resp.reference}
                                            className="p-4 rounded bg-gray-50 border border-gray-100 flex flex-col gap-2"
                                          >
                                            <div className=" text-sm text-gray-700">
                                              {resp.actual_question.text}
                                            </div>
                                            <div className="text-sm">
                                              {resp.rating !== null ? (
                                                <div className="flex items-center gap-2">
                                                  <StarRating
                                                    rating={resp.rating}
                                                    size={16}
                                                  />
                                                  <span className=" text-primary">
                                                    ({resp.rating})
                                                  </span>
                                                </div>
                                              ) : resp.text !== null ? (
                                                <span className="italic text-gray-600">
                                                  "{resp.text}"
                                                </span>
                                              ) : resp.yes_no !== null ? (
                                                <span
                                                  className={`px-3 py-1 rounded text-xs  ${resp.yes_no
                                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                    : "bg-red-100 text-red-700 border border-red-200"
                                                    }`}
                                                >
                                                  {resp.yes_no ? "Yes" : "No"}
                                                </span>
                                              ) : (
                                                "N/A"
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
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
                    <div className="text-sm text-muted-foreground font-medium">
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
                <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded border-2 border-dashed flex flex-col items-center gap-4">
                  <FileText className="h-10 w-10 opacity-20" />
                  No guest reviews found for this form yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Structure & Questions</CardTitle>
              <div className="text-sm text-muted-foreground">
                This is how the questions appear on the public feedback form.
              </div>
            </CardHeader>
            <CardContent>
              {feedbackForm?.questions?.length > 0 ? (
                <div className="rounded border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted ring-1 ring-border">
                        <TableHead className="w-[50px] text-center">
                          Order
                        </TableHead>
                        <TableHead>Question Text</TableHead>
                        <TableHead>Response Type</TableHead>
                        <TableHead>Identity</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbackForm.questions
                        .sort((a, b) => a.order - b.order)
                        .map((question) => (
                          <TableRow
                            key={question.reference}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="text-center  text-primary">
                              #{question.order}
                            </TableCell>
                            <TableCell className="font-semibold text-gray-900">
                              {question.text}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded text-xs  border border-border bg-white text-gray-700">
                                {question.type}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {question.identity}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuestion(question);
                                  setIsUpdateQuestionModalOpen(true);
                                }}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded border-2 border-dashed flex flex-col items-center gap-4">
                  <Plus className="h-10 w-10 opacity-20" />
                  No questions established for this form.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Question"
      >
        <CreateQuestion
          feedbackForm={feedbackForm}
          refetch={refetchFeedbackForm}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Feedback Form"
      >
        <UpdateFeedbackForm
          refetch={refetchFeedbackForm}
          closeModal={() => setIsUpdateModalOpen(false)}
          center={feedbackForm?.center}
          feedbackForm={feedbackForm}
        />
      </Modal>

      <Modal
        isOpen={isUpdateQuestionModalOpen}
        onClose={() => {
          setIsUpdateQuestionModalOpen(false);
          setSelectedQuestion(null);
        }}
        title="Update Question"
      >
        <UpdateQuestion
          question={selectedQuestion}
          feedbackForm={feedbackForm}
          refetch={refetchFeedbackForm}
          closeModal={() => {
            setIsUpdateQuestionModalOpen(false);
            setSelectedQuestion(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default FeedbackFormDetail;
