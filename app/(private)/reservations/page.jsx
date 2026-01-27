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

  if (isLoadingAccount || isLoadingCenters || isLoadingFeedbackForms) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 bg-background min-h-screen">
      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-black text-center sm:text-left">
          Hello {account?.name || "User"}
        </h2>
      </section>

      <section id="summary" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-bold text-black">Information</h4>
            <p className="text-muted-foreground truncate">{account?.name}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-bold text-2xl text-black">
              {centers?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Total Centers</h4>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md sm:col-span-2 md:col-span-1">
            <p className="font-bold text-2xl text-black">
              {feedbackForms?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Feedback Forms</h4>
          </div>
        </div>
      </section>

      <section className="mb-6 py-4">
        <div className="p-4 rounded-lg shadow-md bg-white border border-border overflow-hidden">
          <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4">
            <h6 className="text-xl font-semibold text-black">Centers</h6>
            <button
              className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Create Center
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            {centers?.length > 0 ? (
              <CentersTable centers={centers} role="reservations" />
            ) : (
              <div className="p-4 text-center text-black bg-muted rounded-md">
                No centers available
              </div>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-black hover:text-primary"
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
