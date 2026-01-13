"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchApprovalSteps } from "@/hooks/approvalsteps/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchPostings } from "@/hooks/postings/actions";
import React, { useState } from "react";
import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import PostingsTable from "@/components/postings/PostingsTable";
import ApprovalStepsTable from "@/components/approvalsteps/ApprovalStepsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MessageSquare,
  FileText,
  CheckSquare,
  ListChecks,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function GeneralManager() {
  const { isLoading: isLoadingAccount, data: account } = useFetchAccount();
  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();

  const { isLoading: isLoadingCreditNotes, data: creditNotes } =
    useFetchCreditNotes();

  const { isLoading: isLoadingApprovalSteps, data: approvalSteps } =
    useFetchApprovalSteps();

  const {
    isLoading: isLoadingPostings,
    data: postings,
    refetch: refetchPostings,
  } = useFetchPostings();

  const userPendingSteps = approvalSteps?.filter(
    (step) => step.approver === account?.email && step.status === "Pending"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 bg-gray-50/50 min-h-screen">
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {isLoadingAccount ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Welcome back, ${account?.name || "General Manager"}`
            )}
          </h2>
          <p className="text-muted-foreground mt-1">
            Oversee centers, feedback, and approvals.
          </p>
        </div>
        <div>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow"
            onClick={() => setIsModalOpen(true)}
          >
            Create Center
          </button>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
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
            <CardTitle className="text-sm font-medium">Total Centers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingCenters ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                centers?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Active operational centers
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="steps">Approvals</TabsTrigger>
          <TabsTrigger value="credit-notes">Credit Notes</TabsTrigger>
          <TabsTrigger value="centers">Centers</TabsTrigger>
          <TabsTrigger value="postings">Postings</TabsTrigger>
          {/* <TabsTrigger value="requests">Requests</TabsTrigger> */}
        </TabsList>

        <TabsContent value="steps" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Steps</CardTitle>
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

        <TabsContent value="postings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Postings</CardTitle>
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

        <TabsContent value="credit-notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCreditNotes ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <EmployeeCreditNotesTable creditNotes={creditNotes} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Centers Management</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCenters ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : centers?.length > 0 ? (
                <CentersTable centers={centers} role="gm" />
              ) : (
                <div className="p-4 text-center text-muted-foreground bg-muted rounded-md">
                  No centers available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Requests</CardTitle>
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
        </TabsContent> */}
      </Tabs>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto relative border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
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
