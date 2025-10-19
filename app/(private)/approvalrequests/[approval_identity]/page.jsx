"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchApprovalRequest } from "@/hooks/approvalrequests/actions";
import { updateApprovalStep } from "@/services/approvalsteps";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

function ApprovalRequestDetail() {
  const { approval_identity } = useParams();
  const router = useRouter();
  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [commentModal, setCommentModal] = useState({ open: false, action: null, stepReference: null });
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

  if (isLoadingApprovalRequest || isLoadingAccount) return <LoadingSpinner />;

  if (approvalRequestError || accountError || !approvalRequest) {
    toast.error("Failed to load approval request or account details");
    router.push("/manager");
    return null;
  }

  // Determine if the current user is the final approver
  const maxStepOrder = Math.max(...approvalRequest.steps.map(step => step.step_order));
  const isFinalApprover = approvalRequest.steps.some(
    step => step.approver === account.email && step.step_order === maxStepOrder
  );

  // Check if all prior steps are completed (Approved or Rejected)
  const arePriorStepsCompleted = () => {
    if (!isFinalApprover) return true; // Non-final approvers can act anytime
    return approvalRequest.steps
      .filter(step => step.step_order < maxStepOrder)
      .every(step => step.status === "Approved" || step.status === "Rejected");
  };

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
    <div className="container mx-auto p-4 min-h-screen bg-gray-200">
      <section className="mb-6 flex md:items-center flex-col md:flex-row gap-2">
        <button
          className="bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
        <br />
        <h2 className="text-2xl font-bold text-black">
          Approval Request Details
        </h2>
      </section>
      <Card className="mb-6">
        <CardContent className="space-y-4 text-black">
          <div>
            <span className="font-semibold">Title:</span>{" "}
            {approvalRequest?.title}
          </div>
          <div>
            <span className="font-semibold">Request Type:</span>{" "}
            {approvalRequest?.request_type}
          </div>
          <div>
            <span className="font-semibold">Description:</span>{" "}
            {approvalRequest?.description || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                approvalRequest?.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : approvalRequest?.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {approvalRequest?.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Created By:</span>{" "}
            {approvalRequest?.created_by}
          </div>
          <div>
            <span className="font-semibold">Approvers:</span>{" "}
            {approvalRequest?.approvers.length > 0
              ? approvalRequest?.approvers.join(", ")
              : "None"}
          </div>
          {approvalRequest?.credit_note && (
            <div>
              <span className="font-semibold">Credit Note:</span>{" "}
              {approvalRequest?.credit_note}{" "}
              <Button
                variant="link"
                className="text-blue-600"
                onClick={() => setCreditNoteModal(true)}
              >
                View Details
              </Button>
            </div>
          )}
          <div>
            <span className="font-semibold">Steps:</span>{" "}
            {approvalRequest?.steps
              ? `${approvalRequest?.steps.length} step(s)`
              : "N/A"}
          </div>
          {approvalRequest?.attachment && (
            <div>
              <span className="font-semibold">Attachment:</span>{" "}
              <a
                href={approvalRequest?.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Attachment
              </a>
            </div>
          )}
          <div>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(approvalRequest?.created_at).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(approvalRequest?.updated_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Approval Steps Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Approval Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvalRequest?.steps?.length > 0 ? (
            <Table className="bg-white shadow-md rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Step Order</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalRequest?.steps.map((step) => (
                  <TableRow key={step.reference}>
                    <TableCell>{step.step_order}</TableCell>
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
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {step.status}
                      </span>
                    </TableCell>
                    <TableCell>{step.comments || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(step.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {step.approver === account.email &&
                      step.status === "Pending" &&
                      (!isFinalApprover || arePriorStepsCompleted()) ? (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            onClick={() => handleStepAction(step.reference, "Approved")}
                            disabled={loadingStep === step.reference}
                          >
                            {loadingStep === step.reference && commentModal.action === "Approved"
                              ? "Approving..."
                              : "Approve"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => openCommentModal("Reviewed", step.reference)}
                            disabled={loadingStep === step.reference}
                          >
                            {loadingStep === step.reference && commentModal.action === "Reviewed"
                              ? "Reviewing..."
                              : "Review"}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => openCommentModal("Rejected", step.reference)}
                            disabled={loadingStep === step.reference}
                          >
                            {loadingStep === step.reference && commentModal.action === "Rejected"
                              ? "Rejecting..."
                              : "Reject"}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {isFinalApprover && step.approver === account.email && step.status === "Pending" && !arePriorStepsCompleted()
                            ? "Waiting for prior steps"
                            : "No action"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600">No approval steps available.</p>
          )}
        </CardContent>
      </Card>

      {/* Credit Note Modal */}
      {approvalRequest?.credit_note && (
        <Dialog open={creditNoteModal} onOpenChange={setCreditNoteModal}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Credit Note Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Identity:</span>{" "}
                {approvalRequest?.credit_note_details?.identity || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Check Number:</span>{" "}
                {approvalRequest?.credit_note_details?.check_number || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Customer Name:</span>{" "}
                {approvalRequest?.credit_note_details?.customer_name || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Customer Email:</span>{" "}
                {approvalRequest?.credit_note_details?.customer_email || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Customer Address:</span>{" "}
                {approvalRequest?.credit_note_details?.customer_address || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Customer Phone:</span>{" "}
                {approvalRequest?.credit_note_details?.customer_phone || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Amount:</span>{" "}
                {approvalRequest?.credit_note_details?.currency}{" "}
                {approvalRequest?.credit_note_details?.amount
                  ? parseFloat(approvalRequest?.credit_note_details.amount).toFixed(2)
                  : "N/A"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    approvalRequest?.credit_note_details?.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : approvalRequest?.credit_note_details?.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {approvalRequest?.credit_note_details?.status || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-semibold">Cashier Name:</span>{" "}
                {approvalRequest?.credit_note_details?.cashier_name || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Revenue Center:</span>{" "}
                {approvalRequest?.credit_note_details?.revenue_center || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Transaction Date:</span>{" "}
                {approvalRequest?.credit_note_details?.transaction_date
                  ? new Date(approvalRequest?.credit_note_details.transaction_date).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {approvalRequest?.credit_note_details?.created_at
                  ? new Date(approvalRequest?.credit_note_details.created_at).toLocaleString()
                  : "N/A"}
              </div>
              <div>
                <span className="font-semibold">Updated At:</span>{" "}
                {approvalRequest?.credit_note_details?.updated_at
                  ? new Date(approvalRequest?.credit_note_details.updated_at).toLocaleString()
                  : "N/A"}
              </div>
              {approvalRequest?.credit_note_details?.attachment && (
                <div>
                  <span className="font-semibold">Attachment:</span>{" "}
                  <a
                    href={approvalRequest?.credit_note_details.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Attachment
                  </a>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Comment Modal for Review/Reject */}
      <Dialog open={commentModal.open} onOpenChange={() => setCommentModal({ open: false, action: null, stepReference: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{commentModal.action} Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCommentModal({ open: false, action: null, stepReference: null })}
              >
                Cancel
              </Button>
              <Button
                variant={commentModal.action === "Reviewed" ? "default" : "destructive"}
                onClick={() => handleStepAction(commentModal.stepReference, commentModal.action, comment)}
                disabled={loadingStep === commentModal.stepReference}
              >
                {loadingStep === commentModal.stepReference
                  ? `${commentModal.action}...`
                  : commentModal.action}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApprovalRequestDetail;