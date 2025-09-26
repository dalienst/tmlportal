"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { useFetchCenters } from "@/hooks/centers/actions";
import React, { useState } from "react";

function Centers() {
  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingCenters) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 bg-background min-h-screen">
      <section className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">
            Centers Overview
          </h2>
          <p className="text-2xl font-bold text-foreground">
            {centers?.length} Centers
          </p>
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
            <CentersTable centers={centers} role="reservations" />
          ) : (
            <div className="p-4 text-center text-foreground bg-muted">
              No centers available
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
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

export default Centers;
