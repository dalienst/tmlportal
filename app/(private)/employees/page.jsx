"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import React from "react";

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

  if (isLoadingAccount || isLoadingCreditNotes || isLoadingApprovalRequest) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-destructive">
          Hello {account?.name || "User"}
        </h2>
      </section>


      <section id="summary" className="mb-6"></section>
    </div>
  );
}

export default EmployeeDashboard;
