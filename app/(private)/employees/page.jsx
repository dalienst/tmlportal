"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCreditNote from "@/forms/creditnotes/CreateCreditNote";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import React, { useState } from "react";

function EmployeeDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  const {
    isLoading: isLoadingCreditNotes,
    data: creditNotes,
    refetch: refetchCreditNotes,
  } = useFetchCreditNotes();

  const {
    isLoading: isLoadingApprovalRequest,
    data: approvalRequest,
    refetch: refetchApprovalRequest,
  } = useFetchApprovalRequests();

  const [creditNoteModal, setCreditNoteModal] = useState(false);

  if (isLoadingAccount || isLoadingCreditNotes || isLoadingApprovalRequest) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <section className="mb-6 flex md:items-center flex-col md:flex-row gap-2 justify-between">
        <h2 className="text-2xl font-bold text-destructive">
          Hello {account?.name || "User"}
        </h2>

        <section className="flex gap-4">
          <button
            className="bg-accent text-accent-foreground p-1 rounded"
            onClick={() => setCreditNoteModal(true)}
          >
            Credit Note
          </button>
          <button>Request</button>
        </section>
      </section>

      <section id="summary" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg shadow-md bg-white border border-border">
            <h6 className="text-xl font-semibold text-black">Credit Notes</h6>
            <p className="text-lg font-semibold text-black">
              {creditNotes?.length}
            </p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-white border border-border">
            <h6 className="text-xl font-semibold text-black">
              Approval Requests
            </h6>
            <p className="text-lg font-semibold text-black">
              {approvalRequest?.length}
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      {creditNoteModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4">
            <button
              className="absolute top-2 right-2 text-black hover:text-primary"
              onClick={() => setCreditNoteModal(false)}
            >
              ✕
            </button>
            <CreateCreditNote
              refetch={refetchCreditNotes}
              closeModal={() => setCreditNoteModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
