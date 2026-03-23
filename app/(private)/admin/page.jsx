"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import CreateUser from "@/forms/admin/CreateUser";
import UsersTable from "@/components/admin/UsersTable";
import Modal from "@/components/general/Modal";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Building2,
  MessageSquare,
  FileText,
  CheckSquare,
  ListChecks,
  Users,
  UserPlus,
  Plus,
  ChevronDown,
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
      <section className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 shadow-lg shadow-primary/20 cursor-pointer group">
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Quick Actions
                <ChevronDown className="ml-2 h-4 w-4 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 shadow-2xl border-border/40 backdrop-blur-xl" align="end" sideOffset={8}>
              <div className="grid gap-1">
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setIsCenterModalOpen(true)}
                >
                  <Building2 className="mr-3 h-4 w-4 text-primary opacity-70 group-hover:opacity-100" />
                  Create Center
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setIsUserModalOpen(true)}
                >
                  <UserPlus className="mr-3 h-4 w-4 text-emerald-600 opacity-70 group-hover:opacity-100" />
                  Add Staff Member
                </button>
              </div>
            </PopoverContent>
          </Popover>
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

      <Modal
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        title="Create New Center"
        className="max-w-md sm:max-w-lg"
      >
        <CreateCenter
          refetch={refetchCenters}
          closeModal={() => setIsCenterModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Create New User"
        className="max-w-md sm:max-w-lg"
      >
        <CreateUser
          refetch={refetchUsers}
          closeModal={() => setIsUserModalOpen(false)}
        />
      </Modal>
    </div>
  );
}


export default AdminDashboard;

