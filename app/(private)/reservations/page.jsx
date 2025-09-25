"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import React, { useState } from "react";

function Reservations() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();
  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();
  const {
    isLoading: isLoadingFeedbackForms,
    data: feedbackForms,
    refetch: refetchFeedbackForms,
  } = useFetchFeedbackForms();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  if (isLoadingAccount || isLoadingCenters || isLoadingFeedbackForms) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 bg-background min-h-screen">
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Hello {account?.name || "User"}
        </h2>
      </section>

      <section id="summary" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-bold text-foreground">Information</h4>
            <p className="text-muted-foreground">{account?.name}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-bold text-2xl text-foreground">
              {centers?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Total Centers</h4>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-bold text-2xl text-foreground">
              {feedbackForms?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Feedback Forms</h4>
          </div>
        </div>
      </section>

      <section className="mb-6 py-4">
        <div className="p-4 rounded-lg shadow-md bg-white border border-border">
          <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border pb-4">
            <h6 className="text-xl font-semibold text-foreground">Centers</h6>
            <button
              className="bg-accent text-accent-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              Create Center
            </button>
          </div>

          {centers?.length > 0 ? (
            <CentersTable centers={centers} />
          ) : (
            <div className="p-4 text-center text-foreground bg-muted">
              No centers available
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-foreground hover:text-primary"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <CreateCenter
              refetch={refetchCenters}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservations;
