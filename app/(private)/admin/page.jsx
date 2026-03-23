"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import CreateUser from "@/forms/admin/CreateUser";
import UsersTable from "@/components/admin/UsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchAccount, useFetchUsers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import { useFetchApprovalSteps } from "@/hooks/approvalsteps/actions";
import { useFetchCreditNotes } from "@/hooks/creditnotes/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import React, { useState } from "react";
import EmployeeApprovalRequestTable from "@/components/approvalrequests/EmployeeApprovalRequestTable";
import EmployeeCreditNotesTable from "@/components/creditnotes/EmployeeCreditNotesTable";
import ApprovalStepsTable from "@/components/approvalsteps/ApprovalStepsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MessageSquare,
  FileText,
  CheckSquare,
  ListChecks,
  Users,
  UserPlus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function AdminDashboard() {
  const { isLoading: isLoadingAccount, data: account } = useFetchAccount();
  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();
  const { isLoading: isLoadingFeedbackForms, data: feedbackForms } =
    useFetchFeedbackForms();

  const { isLoading: isLoadingCreditNotes, data: creditNotes } =
    useFetchCreditNotes();

  const { isLoading: isLoadingApprovalRequest, data: approvalRequests } =
    useFetchApprovalRequests();

  const { isLoading: isLoadingApprovalSteps, data: approvalSteps } =
    useFetchApprovalSteps();

  const {
    isLoading: isLoadingUsers,
    data: users,
    refetch: refetchUsers,
  } = useFetchUsers();

  const userPendingSteps = approvalSteps?.filter(
    (step) => step.approver === account?.email && step.status === "Pending",
  );

  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {isLoadingAccount ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Welcome back, ${account?.name || "Admin"}`
            )}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Oversee staff, centers, feedback, and approvals.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:w-auto">
          <button
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border shadow-sm"
            onClick={() => setIsCenterModalOpen(true)}
          >
            Create Center
          </button>
          <button
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow"
            onClick={() => setIsUserModalOpen(true)}
          >
            Add Staff Member
          </button>
        </div>
      </section>

      <section className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingUsers ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                users?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total registered staff
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feedback Forms
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingFeedbackForms ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                feedbackForms?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer feedback entries
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="users" className="w-full">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="flex w-max sm:grid sm:w-full sm:grid-cols-5 lg:w-[750px]">
            <TabsTrigger value="users" className="min-w-[100px]">
              Users
            </TabsTrigger>
            <TabsTrigger value="centers" className="min-w-[100px]">
              Centers
            </TabsTrigger>
            <TabsTrigger value="requests" className="min-w-[100px]">
              Requests
            </TabsTrigger>
            <TabsTrigger value="credit-notes" className="min-w-[100px]">
              Credit Notes
            </TabsTrigger>
            <TabsTrigger value="steps" className="min-w-[100px]">
              Approvals
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <UsersTable users={users} refetch={refetchUsers} />
                </div>
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
                <div className="overflow-x-auto -mx-6 px-6">
                  <CentersTable centers={centers} role="admin" />
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground bg-muted rounded-md">
                  No centers available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
                  <EmployeeCreditNotesTable creditNotes={creditNotes} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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

      {isCenterModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto relative border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsCenterModalOpen(false)}
            >
              ✕
            </button>
            <CreateCenter
              refetch={refetchCenters}
              closeModal={() => setIsCenterModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto relative border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsUserModalOpen(false)}
            >
              ✕
            </button>
            <CreateUser
              refetch={refetchUsers}
              closeModal={() => setIsUserModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}


export default AdminDashboard;

