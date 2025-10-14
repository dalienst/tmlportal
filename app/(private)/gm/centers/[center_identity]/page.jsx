"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateFeedbackForm from "@/forms/feedbackforms/CreateFeedbackForm";
import { useFetchCenter } from "@/hooks/centers/actions";
import Link from "next/link";
import React, { use, useState } from "react";

function CenterDetail({ params }) {
  const { center_identity } = use(params);

  const {
    isLoading: isLoadingCenter,
    data: center,
    refetch: refetchCenter,
  } = useFetchCenter(center_identity);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingCenter) {
    return <LoadingSpinner />;
  }

  return (
    <section
      id="center"
      className="container mx-auto p-4 bg-background min-h-screen"
    >
      <div className="mb-3 mt-3">
        <h2 className="text-2xl font-bold text-black">
          {center?.name} Overview
        </h2>
      </div>
      <div className="mb-6 p-4 rounded-lg shadow-md bg-card border border-border mt-3">
        <div className="mb-4 flex justify-between items-center border-b border-border pb-4">
          <h6 className="text-xl font-semibold text-black">Feedback Forms</h6>
          <button
            className="bg-accent text-accent-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Create Form
          </button>
        </div>

        {center?.feedback_forms?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border rounded-lg border-border">
              <thead>
                <tr className="bg-muted text-black font-semibold text-sm">
                  <th className="px-2 py-2 text-left min-w-[120px] border-b border-border">
                    Title
                  </th>
                  <th className="px-2 py-2 text-left min-w-[150px] border-b border-border">
                    Description
                  </th>
                  <th className="px-2 py-2 text-left min-w-[80px] border-b border-border">
                    Questions
                  </th>
                  <th className="px-2 py-2 text-left min-w-[80px] border-b border-border">
                    Submissions
                  </th>
                  <th className="px-2 py-2 text-left min-w-[100px] border-b border-border">
                    Accommodation
                  </th>
                  <th className="px-2 py-2 text-left min-w-[80px] border-b border-border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {center?.feedback_forms?.map((feedbackForm, index) => (
                  <tr
                    key={feedbackForm?.reference}
                    className="bg-card hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-2 py-2 border-t border-border text-black text-sm">
                      {feedbackForm?.title}
                    </td>
                    <td className="px-2 py-2 border-t border-border text-black text-sm">
                      {feedbackForm?.description}
                    </td>
                    <td className="px-2 py-2 border-t border-border text-black text-sm">
                      {feedbackForm?.questions?.length}
                    </td>
                    <td className="px-2 py-2 border-t border-border text-black text-sm">
                      {feedbackForm?.form_submissions?.length}
                    </td>
                    <td className="px-2 py-2 border-t border-border text-black text-sm">
                      {feedbackForm?.is_accomodation ? "Yes" : "No"}
                    </td>
                    <td className="px-2 py-2 border-t border-border text-sm">
                      <Link
                        href={`/gm/centers/${center_identity}/${feedbackForm?.form_identity}`}
                        className="text-primary hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-black bg-muted">
            No feedback forms available for this center
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-black hover:text-primary"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <CreateFeedbackForm
              refetch={refetchCenter}
              closeModal={() => setIsModalOpen(false)}
              center={center}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default CenterDetail;
