"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchApprovalRequest } from "@/hooks/approvalrequests/actions";
import { updateApprovalStep } from "@/services/approvalsteps";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";

export default function ApprovalRequestDetail() {
  const { approval_identity } = useParams();
  const router = useRouter();
  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [commentModal, setCommentModal] = useState({
    open: false,
    action: null,
    stepReference: null,
  });
  const [comment, setComment] = useState("");
  const [loadingStep, setLoadingStep] = useState(null);
  const token = useAxiosAuth();

  const {
    isLoading: isLoadingApprovalRequest,
    data: approvalRequest,
    refetch: refetchApprovalRequest,
    error: approvalRequestError,
  } = useFetchApprovalRequest(approval_identity);

  const {
    isLoading: isLoadingAccount,
    data: account,
    error: accountError,
  } = useFetchAccount();

  // Loading
  if (isLoadingApprovalRequest || isLoadingAccount) {
    return <LoadingSpinner />;
  }

  // Error
  if (approvalRequestError || accountError || !approvalRequest) {
    toast.error("Failed to load approval request or account details");
    router.push("/manager");
    return null;
  }

  const request = approvalRequest;

  // Can current user act on this step?
  const canActOnStep = (step) => {
    return step.approver === account.email && step.status === "Pending";
  };

  // Handle action
  const handleStepAction = async (stepReference, status, comments = null) => {
    setLoadingStep(stepReference);
    try {
      await updateApprovalStep(stepReference, { status, comments }, token);
      toast.success(`Step ${status.toLowerCase()} successfully`);
      await refetchApprovalRequest();
      setCommentModal({ open: false, action: null, stepReference: null });
      setComment("");
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} step`);
      console.error(`Error ${status.toLowerCase()} step:`, error);
    } finally {
      setLoadingStep(null);
    }
  };

  const openCommentModal = (action, stepReference) => {
    setCommentModal({ open: true, action, stepReference });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      {/* Header */}
      <section className="mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <button
          onClick={() => router.back()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          Approval Request Details
        </h1>
      </section>

      {/* Request Info */}
      <Card className="mb-6 shadow-lg">
        <CardContent className="p-6 space-y-4 text-gray-800">
          <div>
            <strong>Title:</strong> {request.title}
          </div>
          <div>
            <strong>Request Type:</strong> {request.request_type}
          </div>
          <div>
            <strong>Description:</strong> {request.description || "N/A"}
          </div>

          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                request.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : request.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : request.status === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {request.status}
            </span>
          </div>

          <div>
            <strong>Created By:</strong> {request.created_by}
          </div>

          <div>
            <strong>Approvers:</strong>{" "}
            {request.approvers?.length > 0
              ? request.approvers.join(", ")
              : "None"}
          </div>

          {request.credit_note && (
            <div className="flex items-center gap-2">
              <strong>Credit Note:</strong> {request.credit_note}{" "}
              <Button
                variant="link"
                className="text-blue-600 p-0 h-auto font-normal"
                onClick={() => setCreditNoteModal(true)}
              >
                View Details
              </Button>
            </div>
          )}

          <div>
            <strong>Steps:</strong> {request.steps?.length || 0} step(s)
          </div>

          {request.attachment && (
            <div>
              <strong>Attachment:</strong>{" "}
              <a
                href={request.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Attachment
              </a>
            </div>
          )}

          <div>
            <strong>Created At:</strong>{" "}
            {new Date(request.created_at).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(request.updated_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Approval Steps Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Approval Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {request.steps?.length > 0 ? (
            <Table className="bg-white rounded-lg shadow">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {request.steps.map((step) => {
                  const canAct = canActOnStep(step);
                  return (
                    <TableRow key={step.reference} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {step.step_order}
                      </TableCell>
                      <TableCell>{step.approver}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            step.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : step.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : step.status === "Reviewed"
                              ? "bg-blue-100 text-blue-800"
                              : step.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {step.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {step.comments || "—"}
                      </TableCell>
                      <TableCell>
                        {new Date(step.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {canAct ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStepAction(step.reference, "Approved")
                              }
                              disabled={loadingStep === step.reference}
                            >
                              {loadingStep === step.reference
                                ? "Approving…"
                                : "Approve"}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openCommentModal("Reviewed", step.reference)
                              }
                              disabled={loadingStep === step.reference}
                            >
                              {loadingStep === step.reference
                                ? "Reviewing…"
                                : "Review"}
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                openCommentModal("Rejected", step.reference)
                              }
                              disabled={loadingStep === step.reference}
                            >
                              {loadingStep === step.reference
                                ? "Rejecting…"
                                : "Reject"}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No action
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-600 py-8">
              No approval steps found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Credit Note Modal */}
      {request.credit_note && request.credit_note_details && (
        <Dialog open={creditNoteModal} onOpenChange={setCreditNoteModal}>
          <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Credit Note Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Identity:</strong>{" "}
                {request.credit_note_details.identity}
              </div>
              <div>
                <strong>Check #:</strong>{" "}
                {request.credit_note_details.check_number || "N/A"}
              </div>
              <div>
                <strong>Customer:</strong>{" "}
                {request.credit_note_details.customer_name}
              </div>
              <div>
                <strong>Email:</strong>{" "}
                {request.credit_note_details.customer_email}
              </div>
              <div>
                <strong>Phone:</strong>{" "}
                {request.credit_note_details.customer_phone}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {request.credit_note_details.customer_address}
              </div>
              <div>
                <strong>Amount:</strong> {request.credit_note_details.currency}{" "}
                {parseFloat(request.credit_note_details.amount || "0").toFixed(
                  2
                )}
              </div>
              <div>
                <strong>Status:</strong> {request.credit_note_details.status}
              </div>
              <div>
                <strong>Cashier:</strong>{" "}
                {request.credit_note_details.cashier_name}
              </div>
              <div>
                <strong>Revenue Center:</strong>{" "}
                {request.credit_note_details.revenue_center}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(
                  request.credit_note_details.transaction_date
                ).toLocaleDateString()}
              </div>
              {request.credit_note_details.attachment && (
                <div>
                  <strong>Attachment:</strong>{" "}
                  <a
                    href={request.credit_note_details.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                </div>
              )}
              <div className="text-xs text-gray-500 pt-4 border-t">
                Created:{" "}
                {new Date(
                  request.credit_note_details.created_at
                ).toLocaleString()}
                <br />
                Updated:{" "}
                {new Date(
                  request.credit_note_details.updated_at
                ).toLocaleString()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Comment Modal */}
      <Dialog
        open={commentModal.open}
        onOpenChange={(open) =>
          !open &&
          setCommentModal({ open: false, action: null, stepReference: null })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {commentModal.action === "Reviewed" ? "Review" : "Reject"} Step
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment (required)</Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setCommentModal({
                    open: false,
                    action: null,
                    stepReference: null,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                variant={
                  commentModal.action === "Reviewed" ? "default" : "destructive"
                }
                onClick={() => {
                  if (commentModal.stepReference && commentModal.action) {
                    handleStepAction(
                      commentModal.stepReference,
                      commentModal.action,
                      comment
                    );
                  }
                }}
                disabled={
                  loadingStep === commentModal.stepReference || !comment.trim()
                }
              >
                {loadingStep === commentModal.stepReference
                  ? `${commentModal.action}…`
                  : commentModal.action}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
