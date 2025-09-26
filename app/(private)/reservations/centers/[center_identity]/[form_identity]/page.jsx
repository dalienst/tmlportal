"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateQuestion from "@/forms/questions/CreateQuestion";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { useFetchFeedbacksByFeedbackForm } from "@/hooks/feedbacks/actions";
import Link from "next/link";
import React, { use, useState, useMemo } from "react";
import StarRating from "@/components/general/StarRating";
import UpdateFeedbackForm from "@/forms/feedbackforms/UpdateFeedbackForm";

function FeedbackFormDetail({ params }) {
  const { form_identity } = use(params);

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
      className="container mx-auto p-4 bg-background min-h-screen"
    >
      {/* top section */}
      <h6 className="text-sm text-muted-foreground uppercase mb-2">
        {feedbackForm?.center}
      </h6>
      <section className="mb-6">
        <div className="mb-3 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {feedbackForm?.title} Reviews
            </h2>
          </div>
          {/* buttons */}
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              className="bg-accent text-accent-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              Add Question
            </button>
            {feedbackForm?.questions?.length > 0 && (
              <Link
                href={`/feedback/${feedbackForm?.form_identity}`}
                target="_blank"
                className="bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Public Link
              </Link>
            )}
            <button
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              Update
            </button>
            <Link
              href={`/reports/${feedbackForm?.form_identity}`}
              target="_blank"
              className="bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Generate Report
            </Link>
          </div>
          {/* end of buttons */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-card p-4 rounded-lg shadow-md border border-border">
          <div className="md:border-r border-border">
            <p className="font-semibold text-foreground">Total Reviews</p>
            <h3 className="text-2xl font-bold text-foreground">
              {feedbackForm?.total_submissions}
            </h3>
          </div>
          <div className="md:border-r border-border">
            <p className="font-semibold text-foreground">Average Rating</p>
            <h3 className="text-2xl font-bold text-foreground">
              <StarRating rating={feedbackForm?.average_rating || 0} />
            </h3>
          </div>
          <div>
            <p className="font-semibold text-foreground">Total Questions</p>
            <h3 className="text-2xl font-bold text-foreground">
              {feedbackForm?.questions?.length}
            </h3>
          </div>
        </div>
      </section>
      {/* end of top section */}

      {/* lower section */}
      <section className="mb-6">
        <div className="p-4 rounded-lg shadow-md bg-card border border-border">
          <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border pb-4">
            <h6 className="text-xl font-semibold text-foreground">Responses</h6>
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="mr-2 text-foreground">Specific Date:</label>
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => {
                    setSpecificDate(e.target.value);
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="border border-border px-2 py-1 rounded-lg focus:ring-2 focus:ring-primary text-foreground bg-muted"
                  disabled={startDate || endDate}
                />
              </div>
              <div>
                <label className="mr-2 text-foreground">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSpecificDate("");
                  }}
                  className="border border-border px-2 py-1 rounded-lg focus:ring-2 focus:ring-primary text-foreground bg-muted"
                  disabled={specificDate}
                />
              </div>
              <div>
                <label className="mr-2 text-foreground">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSpecificDate("");
                  }}
                  className="border border-border px-2 py-1 rounded-lg focus:ring-2 focus:ring-primary text-foreground bg-muted"
                  disabled={specificDate}
                />
              </div>
              <button
                onClick={handleClearFilters}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="mb-4 text-sm text-muted-foreground">
            {filterFeedbacks.length} records found
          </div>
          {filterFeedbacks?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border rounded-lg border-border">
                <thead>
                  <tr className="bg-muted text-foreground font-semibold text-base">
                    <th className="px-2 py-2 text-left min-w-[2px] border-b border-border">
                      #
                    </th>
                    <th className="px-2 py-2 text-left min-w-[120px] border-b border-border">
                      Guest Name
                    </th>
                    <th className="px-2 py-2 text-left min-w-[80px] border-b border-border">
                      Date
                    </th>
                    <th className="px-2 py-2 text-left min-w-[120px] border-b border-border">
                      Responses
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFeedbacks.map((feedback, index) => {
                    const displayIndex =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <React.Fragment key={feedback.reference}>
                        <tr className="bg-card hover:bg-muted/50 transition-colors">
                          <td className="px-2 py-2 border-t border-border text-base text-center text-foreground">
                            {displayIndex}
                          </td>
                          <td className="px-2 py-2 border-t border-border text-base text-foreground">
                            {feedback.guest_name}
                          </td>
                          <td className="px-2 py-2 border-t border-border text-base text-foreground">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 border-t border-border text-base">
                            <button
                              onClick={() => toggleRow(feedback.reference)}
                              className="text-accent hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(feedback.reference) && (
                          <tr className="bg-card">
                            <td
                              colSpan="4"
                              className="px-2 py-2 border-t border-border"
                            >
                              <ul className="text-foreground">
                                {feedback.responses.map((resp) => (
                                  <li key={resp.reference} className="mb-2">
                                    <div className="font-semibold italic">
                                      {resp.actual_question.text}:
                                    </div>
                                    <div>
                                      {resp.rating !== null
                                        ? resp.rating
                                        : resp.text !== null
                                        ? resp.text
                                        : resp.yes_no !== null
                                        ? resp.yes_no
                                          ? "Yes"
                                          : "No"
                                        : "N/A"}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-foreground bg-muted">
              No responses available
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-foreground hover:text-primary"
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-foreground hover:text-primary"
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
