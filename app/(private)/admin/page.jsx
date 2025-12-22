"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchAccount } from "@/hooks/accounts/actions";
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
import { Building2, MessageSquare, FileText, CheckSquare, ListChecks } from "lucide-react";

function AdminDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
  } = useFetchAccount();
  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();
  const {
    isLoading: isLoadingFeedbackForms,
    data: feedbackForms,
  } = useFetchFeedbackForms();

  const {
    isLoading: isLoadingCreditNotes,
    data: creditNotes,
  } = useFetchCreditNotes();

  const {
    isLoading: isLoadingApprovalRequest,
    data: approvalRequests,
  } = useFetchApprovalRequests();

  const {
    isLoading: isLoadingApprovalSteps,
    data: approvalSteps,
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
    <div className="container mx-auto p-6 bg-gray-50/50 min-h-screen">
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {account?.name || "Admin"}
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

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Centers
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{centers?.length || 0}</div>
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
            <div className="text-2xl font-bold">{feedbackForms?.length || 0}</div>
             <p className="text-xs text-muted-foreground">
              Customer feedback entries
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Actions
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalSteps?.length || 0}</div>
             <p className="text-xs text-muted-foreground">
              Steps requiring your attention
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="centers" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="centers">Centers</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="credit-notes">Credit Notes</TabsTrigger>
          <TabsTrigger value="steps">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="centers" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Centers Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {centers?.length > 0 ? (
                        <CentersTable centers={centers} role="admin" />
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
                    <EmployeeApprovalRequestTable approvalRequests={approvalRequests} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="credit-notes" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Credit Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmployeeCreditNotesTable creditNotes={creditNotes} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="steps" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Approval Steps</CardTitle>
                </CardHeader>
                <CardContent>
                    <ApprovalStepsTable
                    approvalSteps={approvalSteps}
                    account={account}
                    />
                </CardContent>
            </Card>
        </TabsContent>
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

export default AdminDashboard;
