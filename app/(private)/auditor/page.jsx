"use client";

import React, { useState } from "react";
import { CreditCard, FileText, Plus, FilePlus, ListChecks } from "lucide-react";

import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import PostingsTable from "@/components/postings/PostingsTable";
import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import ApprovalStepsTable from "@/components/approvalsteps/ApprovalStepsTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateApprovalRequest from "@/forms/approvalrequests/CreateApprovalRequest";
import CreateCreditNote from "@/forms/creditnotes/CreateCreditNote";

import CreatePosting from "@/forms/postings/CreatePosting";
import { useFetchAccount, useFetchManagers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import { useFetchPostings } from "@/hooks/postings/actions";
import { useFetchApprovalSteps } from "@/hooks/approvalsteps/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchRevenueCenters } from "@/hooks/revenuecenters/actions";

function AuditorDashboard() {
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

  const { isLoading: isLoadingApprovalSteps, data: approvalSteps } =
    useFetchApprovalSteps();

  const userPendingSteps = approvalSteps?.filter(
    (step) => step.approver === account?.email && step.status === "Pending",
  );

  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [postingModal, setPostingModal] = useState(false);
  const [approvalRequestModal, setApprovalRequestModal] = useState(false);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {isLoadingAccount ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Hello, ${account?.name || "User"}`
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back to your auditor dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setCreditNoteModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Credit Note
          </Button>
          <Button onClick={() => setPostingModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Posting
          </Button>
          <Button
            onClick={() => setApprovalRequestModal(true)}
            variant="secondary"
            className="gap-2"
          >
            <FilePlus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Actions</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingApprovalSteps ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                userPendingSteps?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Steps requiring your attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingCreditNotes ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                creditNotes?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recorded in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingPostings ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                postings?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total recorded postings
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="credit-notes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="credit-notes">Credit Notes</TabsTrigger>
          <TabsTrigger value="postings">Postings</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="credit-notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Notes</CardTitle>
              <CardDescription>
                A list of all credit notes generated by you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCreditNotes ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <EmployeeCreditNotesTable
                  creditNotes={creditNotes}
                  isManager={true}
                  refetch={refetchCreditNotes}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="postings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Postings</CardTitle>
              <CardDescription>A list of all postings.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPostings ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <PostingsTable postings={postings} refetch={refetchPostings} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Requests</CardTitle>
              <CardDescription>
                Requests that require your attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingApprovalRequest ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <EmployeeApprovalRequestTable
                  approvalRequests={approvalRequests}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Steps</CardTitle>
              <CardDescription>Steps requiring your approval.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingApprovalSteps ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <ApprovalStepsTable
                  approvalSteps={approvalSteps}
                  account={account}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

export default AuditorDashboard;
