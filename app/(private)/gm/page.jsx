"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchAccount, useFetchManagers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchApprovalSteps } from "@/hooks/approvalsteps/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import React, { useState } from "react";
import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import ApprovalStepsTable from "@/components/approvalsteps/ApprovalStepsTable";

function GeneralManager() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (
    isLoadingAccount ||
    isLoadingCenters ||
    isLoadingFeedbackForms ||
    isLoadingCreditNotes ||
    isLoadingApprovalRequest ||
    isLoadingApprovalSteps
  ) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto p-4 bg-background min-h-screen">
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-black">
          Hello {account?.name || "User"}
        </h2>
      </section>

      <section id="summary" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-bold text-black">Information</h4>
            <p className="text-muted-foreground">{account?.name}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-bold text-2xl text-black">
              {centers?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Total Centers</h4>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-bold text-2xl text-black">
              {feedbackForms?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Feedback Forms</h4>
          </div>
        </div>
      </section>

      <section className="mb-6 py-4">
        <div className="p-4 rounded-lg shadow-md bg-white border border-border">
          <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border pb-4">
            <h6 className="text-xl font-semibold text-black">Centers</h6>
            <button
              className="bg-accent text-accent-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              Create Center
            </button>
          </div>

          {centers?.length > 0 ? (
            <CentersTable centers={centers} role="gm" />
          ) : (
            <div className="p-4 text-center text-black bg-muted">
              No centers available
            </div>
          )}
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

export default GeneralManager;
