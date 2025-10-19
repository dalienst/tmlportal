"use client";

import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import CreateApprovalRequest from "@/forms/approvalrequests/CreateApprovalRequest";
import CreateCreditNote from "@/forms/creditnotes/CreateCreditNote";
import { useFetchAccount, useFetchManagers } from "@/hooks/accounts/actions";
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
    data: approvalRequests,
    refetch: refetchApprovalRequest,
  } = useFetchApprovalRequests();

  const {
    isLoading: isLoadingManagers,
    data: managers,
    refetch: refetchManagers,
  } = useFetchManagers();

  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [approvalRequestModal, setApprovalRequestModal] = useState(false);

  if (isLoadingAccount || isLoadingCreditNotes || isLoadingApprovalRequest) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-200">
      <section className="mb-6 flex md:items-center flex-col md:flex-row gap-2 justify-between">
        <h2 className="text-2xl font-bold text-destructive">
          Hello {account?.name || "User"}
        </h2>

        <section className="flex gap-4">
          <button
            className="bg-accent text-accent-foreground p-2 rounded shadow-md"
            onClick={() => setCreditNoteModal(true)}
          >
            Credit Note
          </button>
          <button
            className="bg-green-600 text-white p-2 rounded shadow-md"
            onClick={() => setApprovalRequestModal(true)}
          >
            Request
          </button>
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
              {approvalRequests?.length}
            </p>
          </div>
        </div>
      </section>

      <section id="credit-notes" className="mb-6">
        <Card>
          <CardContent>
            <EmployeeCreditNotesTable creditNotes={creditNotes} />
          </CardContent>
        </Card>
      </section>

      <section id="approval-requests" className="mb-6">
        <Card>
          <CardContent>
            <EmployeeApprovalRequestTable approvalRequests={approvalRequests} />
          </CardContent>
        </Card>
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

      <CreateApprovalRequest
        isOpen={approvalRequestModal}
        onClose={() => setApprovalRequestModal(false)}
        creditNotes={creditNotes}
        managers={managers}
      />
    </div>
  );
}

export default EmployeeDashboard;
