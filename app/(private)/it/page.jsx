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
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckSquare, ListChecks } from "lucide-react";
import CreateCreditNote from "@/forms/creditnotes/CreateCreditNote";
import CreateApprovalRequest from "@/forms/approvalrequests/CreateApprovalRequest";

function IT() {
  const { isLoading: isLoadingAccount, data: account } = useFetchAccount();

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

  const { isLoading: isLoadingManagers, data: managers } = useFetchManagers();

  const [approvalRequestModal, setApprovalRequestModal] = useState(false);

  if (
    isLoadingAccount ||
    isLoadingCreditNotes ||
    isLoadingApprovalRequest ||
    isLoadingManagers ||
    isLoadingApprovalSteps
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {account?.name || "Manager"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your approval requests and credit notes.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow"
            onClick={() => setApprovalRequestModal(true)}
          >
            New Request
          </button>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {approvalRequests?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total active approval requests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Notes</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditNotes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total credit notes processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Actions</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {approvalSteps?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Steps requiring your attention
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="credit-notes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="credit-notes">Credit Notes</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="steps">My Approvals</TabsTrigger>
        </TabsList>

        {/* Credit Notes */}
        <TabsContent value="credit-notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeCreditNotesTable
                creditNotes={creditNotes}
                isIT={account?.is_it}
                refetch={refetchCreditNotes}
              />
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
              <EmployeeApprovalRequestTable
                approvalRequests={approvalRequests}
              />
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
              <ApprovalStepsTable
                approvalSteps={approvalSteps}
                account={account}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
