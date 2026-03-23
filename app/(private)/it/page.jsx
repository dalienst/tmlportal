"use client";

import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import ApprovalStepsTable from "@/components/approvalsteps/ApprovalStepsTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchAccount, useFetchManagers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchApprovalSteps } from "@/hooks/approvalsteps/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import { useFetchPostings } from "@/hooks/postings/actions";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckSquare, ListChecks } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CreateCreditNote from "@/forms/creditnotes/CreateCreditNote";
import CreateApprovalRequest from "@/forms/approvalrequests/CreateApprovalRequest";
import PostingsTable from "@/components/postings/PostingsTable";
import Modal from "@/components/general/Modal";
import UpdateProfile from "@/forms/accounts/UpdateProfile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, ChevronDown, UserPen, Send } from "lucide-react";

function IT() {
  const { isLoading: isLoadingAccount, data: account, refetch: refetchAccount } = useFetchAccount();

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

  const { isLoading: isLoadingApprovalSteps, data: approvalSteps } =
    useFetchApprovalSteps();

  const {
    isLoading: isLoadingPostings,
    data: postings,
    refetch: refetchPostings,
  } = useFetchPostings();

  const userPendingSteps = approvalSteps?.filter(
    (step) => step.approver === account?.email && step.status === "Pending",
  );

  const { isLoading: isLoadingManagers, data: managers } = useFetchManagers();

  const [approvalRequestModal, setApprovalRequestModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50/50">
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-none">
            {isLoadingAccount ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Hello, ${account?.name || "Manager"}`
            )}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your approval requests and credit notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 shadow-lg shadow-primary/20 cursor-pointer group whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                Quick Actions
                <ChevronDown className="ml-2 h-4 w-4 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 shadow-2xl border-primary/10" align="end" sideOffset={8}>
              <div className="space-y-1">
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-bold rounded-xl hover:bg-primary/5 transition-all text-left group"
                  onClick={() => setProfileModal(true)}
                >
                  <UserPen className="mr-3 h-4 w-4 text-primary" />
                  Update Profile
                </button>

                <div className="h-px bg-border my-1 mx-2" />

                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setApprovalRequestModal(true)}
                >
                  <Send className="mr-3 h-4 w-4 text-primary opacity-70 group-hover:opacity-100" />
                  New Request
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingApprovalRequest ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                approvalRequests?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total active approval requests to be processed
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Notes</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
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
              Total credit notes processed
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
            <TabsTrigger value="steps" className="min-w-[100px]">
              My Approvals
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Credit Notes */}
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
                <div className="overflow-x-auto -mx-6 px-6">
                  <EmployeeCreditNotesTable
                    creditNotes={creditNotes}
                    isIT={account?.is_it}
                    isManager={account?.is_manager}
                    refetch={refetchCreditNotes}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Postings */}
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

        {/* Requests */}
        <TabsContent value="requests" className="mt-4">
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
                <div className="overflow-x-auto -mx-6 px-6">
                  <EmployeeApprovalRequestTable
                    approvalRequests={approvalRequests}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Approvals */}
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
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
        title="Update Profile"
      >
        <UpdateProfile 
          user={account} 
          refetch={refetchAccount} 
          onClose={() => setProfileModal(false)} 
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

export default IT;
