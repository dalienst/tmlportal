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
import Modal from "@/components/general/Modal";
import UpdateProfile from "@/forms/accounts/UpdateProfile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, UserPen, Send } from "lucide-react";

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
  const [profileModal, setProfileModal] = useState(false);

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
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50/50 space-y-8">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-none">
            {isLoadingAccount ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Hello, ${account?.name || "User"}`
            )}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome to your employee dashboard.
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
            <PopoverContent className="w-64 p-2 shadow-2xl border-primary/10" align="end" sideOffset={8}>
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
                  onClick={() => setCreditNoteModal(true)}
                >
                  <CreditCard className="mr-3 h-4 w-4 text-primary opacity-70 group-hover:opacity-100" />
                  New Credit Note
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setPostingModal(true)}
                >
                  <Plus className="mr-3 h-4 w-4 text-emerald-600 opacity-70 group-hover:opacity-100" />
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

export default EmployeeDashboard;
