"use client";

import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import ApprovalStepsTable from "@/components/approvalsteps/ApprovalStepsTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchAccount, useFetchManagers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchApprovalSteps } from "@/hooks/approvalsteps/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import React, { useState } from "react";

function Manager() {
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
    isLoading: isLoadingApprovalSteps,
    data: approvalSteps,
    refetch: refetchApprovalSteps,
  } = useFetchApprovalSteps();

  const {
    isLoading: isLoadingManagers,
    data: managers,
    refetch: refetchManagers,
  } = useFetchManagers();

  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [approvalRequestModal, setApprovalRequestModal] = useState(false);

  if (
    isLoadingAccount ||
    isLoadingCreditNotes ||
    isLoadingApprovalRequest ||
    isLoadingManagers ||
    isLoadingApprovalSteps
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-200">
      <section className="mb-6 flex md:items-center flex-col md:flex-row gap-2 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Hello {account?.name || "User"}
          </h2>
          <p>Welcome to the Manager Dashboard</p>
        </div>

        <div>
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
        </div>
      </section>

      <section id="summary" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="p-4 rounded-lg shadow-md bg-white border border-border">
            <h6 className="text-xl font-semibold text-black">Approval Steps</h6>
            <p className="text-lg font-semibold text-black">
              {approvalSteps?.length}
            </p>
          </div>
        </div>
      </section>

      <section id="approval-requests" className="mb-6">
        <Card>
          <CardContent>
            <EmployeeApprovalRequestTable approvalRequests={approvalRequests} />
          </CardContent>
        </Card>
      </section>

      <section id="credit-notes" className="mb-6">
        <Card>
          <CardContent>
            <EmployeeCreditNotesTable creditNotes={creditNotes} />
          </CardContent>
        </Card>
      </section>

      <section id="approval-steps" className="mb-6">
        <Card>
          <CardContent>
            <ApprovalStepsTable
              approvalSteps={approvalSteps}
              account={account}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Manager;
