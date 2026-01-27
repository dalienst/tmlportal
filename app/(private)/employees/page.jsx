"use client";

import React, { useState } from "react";
import { CreditCard, FileText, Plus, FilePlus } from "lucide-react";

import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import PostingsTable from "@/components/postings/PostingsTable";
import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateApprovalRequest from "@/forms/approvalrequests/CreateApprovalRequest";
import CreateCreditNote from "@/forms/creditnotes/CreateCreditNote";
import CreatePosting from "@/forms/postings/CreatePosting";

import { useFetchAccount, useFetchManagers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import { useFetchPostings } from "@/hooks/postings/actions";
import { useFetchRevenueCenters } from "@/hooks/revenuecenters/actions";

function EmployeeDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  const {
    isLoading: isLoadingRevenueCenters,
    data: revenueCenters,
    refetch: refetchRevenueCenters,
  } = useFetchRevenueCenters();

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

  const {
    isLoading: isLoadingPostings,
    data: postings,
    refetch: refetchPostings,
  } = useFetchPostings();

  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [postingModal, setPostingModal] = useState(false);
  const [approvalRequestModal, setApprovalRequestModal] = useState(false);

  if (
    isLoadingAccount ||
    isLoadingCreditNotes ||
    isLoadingApprovalRequest ||
    isLoadingManagers ||
    isLoadingPostings
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-muted/30 space-y-8">
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Hello, {account?.name || "User"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Welcome to your employee dashboard.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            onClick={() => setCreditNoteModal(true)}
            className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            New Credit Note
          </Button>
          <Button
            onClick={() => setPostingModal(true)}
            className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            New Posting
          </Button>
          <Button
            onClick={() => setApprovalRequestModal(true)}
            variant="secondary"
            className="w-full sm:w-auto gap-2 text-xs sm:text-sm"
          >
            <FilePlus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </section>

      <section id="summary" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Credit Notes
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditNotes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total created by you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Approval Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {approvalRequests?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending or approved requests
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="space-y-6">
        <section id="credit-notes">
          <Card>
            <CardHeader>
              <CardTitle>Credit Notes</CardTitle>
              <CardDescription>
                A list of credit notes you have generated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <EmployeeCreditNotesTable creditNotes={creditNotes} />
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="postings">
          <Card>
            <CardHeader>
              <CardTitle>Postings</CardTitle>
              <CardDescription>
                A list of postings you have generated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <PostingsTable postings={postings} refetch={refetchPostings} />
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="approval-requests">
          <Card>
            <CardHeader>
              <CardTitle>Approval Requests</CardTitle>
              <CardDescription>
                Track the status of your requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <EmployeeApprovalRequestTable
                  approvalRequests={approvalRequests}
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Manual Modal Implementation */}
      {creditNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-background rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
              onClick={() => setCreditNoteModal(false)}
            >
              ✕
            </button>
            <div className="p-6">
              <CreateCreditNote
                revenueCenters={revenueCenters}
                managers={managers}
                refetch={refetchCreditNotes}
                closeModal={() => setCreditNoteModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {postingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-background rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
              onClick={() => setPostingModal(false)}
            >
              ✕
            </button>
            <div className="p-6">
              <CreatePosting
                managers={managers}
                refetch={refetchPostings}
                closeModal={() => setPostingModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      <CreateApprovalRequest
        isOpen={approvalRequestModal}
        onClose={() => setApprovalRequestModal(false)}
        creditNotes={creditNotes}
        managers={managers}
        refetch={refetchApprovalRequest}
      />
    </div>
  );
}

export default EmployeeDashboard;
