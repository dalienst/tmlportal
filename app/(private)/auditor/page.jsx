"use client";

import React, { useState } from "react";
import {
  CreditCard,
  FileText,
  Plus,
  FilePlus,
  ListChecks,
  ChevronDown,
  Send,
  MoreVertical,
} from "lucide-react";

import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import PostingsTable from "@/components/postings/PostingsTable";
import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import ApprovalStepsTable from "@/components/approvalsteps/ApprovalStepsTable";
import Modal from "@/components/general/Modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50/50">
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-none">
            {isLoadingAccount ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Hello, ${account?.name || "User"}`
            )}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back to your auditor dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 font-bold group">
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                Quick Actions
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end" sideOffset={8}>
              <div className="space-y-1">
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setCreditNoteModal(true)}
                >
                  <CreditCard className="mr-3 h-4 w-4 text-primary opacity-70 group-hover:opacity-100" />
                  New Credit Note
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setPostingModal(true)}
                >
                  <FilePlus className="mr-3 h-4 w-4 text-emerald-600 opacity-70 group-hover:opacity-100" />
                  New Posting
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setApprovalRequestModal(true)}
                >
                  <Send className="mr-3 h-4 w-4 text-blue-600 opacity-70 group-hover:opacity-100" />
                  New Request
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Card className="sm:col-span-2 lg:col-span-1">
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
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="flex w-max sm:grid sm:w-full sm:grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="credit-notes" className="min-w-[100px]">
              Credit Notes
            </TabsTrigger>
            <TabsTrigger value="postings" className="min-w-[100px]">
              Postings
            </TabsTrigger>
            <TabsTrigger value="requests" className="min-w-[100px]">
              Requests
            </TabsTrigger>
            <TabsTrigger value="approvals" className="min-w-[100px]">
              Approvals
            </TabsTrigger>
          </TabsList>
        </div>

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
                <div className="overflow-x-auto -mx-6 px-6">
                  <EmployeeCreditNotesTable
                    creditNotes={creditNotes}
                    isManager={true}
                    refetch={refetchCreditNotes}
                  />
                </div>
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
                <div className="overflow-x-auto -mx-6 px-6">
                  <PostingsTable
                    postings={postings}
                    refetch={refetchPostings}
                  />
                </div>
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
                <div className="overflow-x-auto -mx-6 px-6">
                  <EmployeeApprovalRequestTable
                    approvalRequests={approvalRequests}
                  />
                </div>
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
                <div className="overflow-x-auto -mx-6 px-6">
                  <ApprovalStepsTable
                    approvalSteps={approvalSteps}
                    account={account}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={creditNoteModal}
        onClose={() => setCreditNoteModal(false)}
        title="Create Credit Note"
        className="max-w-4xl"
      >
        <CreateCreditNote
          revenueCenters={revenueCenters}
          managers={managers}
          refetch={refetchCreditNotes}
          closeModal={() => setCreditNoteModal(false)}
        />
      </Modal>

      <Modal
        isOpen={postingModal}
        onClose={() => setPostingModal(false)}
        title="Create Posting"
        className="max-w-4xl"
      >
        <CreatePosting
          managers={managers}
          refetch={refetchPostings}
          closeModal={() => setPostingModal(false)}
        />
      </Modal>

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
