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
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  File,
} from "lucide-react";

export default function ApprovalRequestDetail() {
  const { approval_identity } = useParams();
  const router = useRouter();
  const [creditNoteModal, setCreditNoteModal] = useState(false);
  const [postingModal, setPostingModal] = useState(false);
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
    router.push("/managers");
    return null;
  }

  const request = approvalRequest;

  // Can current user act on this step?
  const canActOnStep = (step) => {
    return step.approver === account.email && step.status === "Pending";
  };

  // Helper for status badge colors
  const getStatusBadgeVariant = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success"; // Assuming you have a success variant or use default/custom styles
      case "REJECTED":
        return "destructive";
      case "PENDING":
        return "warning"; // Assuming warning variant exists, else default/secondary
      default:
        return "secondary";
    }
  };

  // Custom badge styling if variants aren't fully set up in codebase
  const renderStatusBadge = (status) => {
    let styles = "bg-gray-100 text-gray-800 hover:bg-gray-200";
    if (status === "APPROVED" || status === "Approved")
      styles =
        "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
    if (status === "REJECTED" || status === "Rejected")
      styles = "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
    if (status === "PENDING" || status === "Pending")
      styles =
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200";

    return (
      <Badge
        className={`text-xs px-2.5 py-0.5 border ${styles}`}
        variant="outline"
      >
        {status}
      </Badge>
    );
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
    <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
      {/* Header */}
      <section className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 pl-0 hover:bg-transparent hover:text-primary gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
              {request.title}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              Request ID: {approval_identity} • Created by {request.created_by}
            </p>
          </div>
          <div>{renderStatusBadge(request.status)}</div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Request Type
                  </Label>
                  <div className="font-medium">{request.request_type}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Created At
                  </Label>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(request.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Description
                </Label>
                <p className="text-sm leading-relaxed text-gray-700 bg-muted/30 p-3 rounded-md border min-h-[80px]">
                  {request.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                {request.attachment && (
                  <Button variant="outline" size="sm" asChild className="gap-2">
                    <a
                      href={request.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-3 w-3" /> View Attachment
                    </a>
                  </Button>
                )}
                {request.credit_note && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCreditNoteModal(true)}
                    className="gap-2"
                  >
                    <AlertCircle className="h-3 w-3" /> View Credit Note
                  </Button>
                )}
                {request.posting && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPostingModal(true)}
                    className="gap-2"
                  >
                    <File className="h-3 w-3" /> View Posting
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approval Process</CardTitle>
              <CardDescription>
                Track the progress of this request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {request.steps?.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Approver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {request.steps.map((step) => {
                        const canAct = canActOnStep(step);
                        return (
                          <TableRow key={step.reference}>
                            <TableCell className="font-medium text-muted-foreground">
                              {step.step_order}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{step.approver}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {renderStatusBadge(step.status)}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                              {step.comments || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              {canAct ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="h-8"
                                    onClick={() =>
                                      handleStepAction(
                                        step.reference,
                                        "Approved"
                                      )
                                    }
                                    disabled={loadingStep === step.reference}
                                  >
                                    {loadingStep === step.reference
                                      ? "..."
                                      : "Approve"}
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                    onClick={() =>
                                      openCommentModal(
                                        "Reviewed",
                                        step.reference
                                      )
                                    }
                                    disabled={loadingStep === step.reference}
                                  >
                                    Review
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8"
                                    onClick={() =>
                                      openCommentModal(
                                        "Rejected",
                                        step.reference
                                      )
                                    }
                                    disabled={loadingStep === step.reference}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs italic">
                                  {step.status === "Pending"
                                    ? "Waiting"
                                    : "Completed"}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mb-2 opacity-50" />
                  <p>No approval steps found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Steps</span>
                <span className="text-sm">{request.steps?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground text-right">
                  {new Date(request.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="pt-4 border-t">
                <Label className="mb-2 block text-xs">Approvers List</Label>
                <div className="flex flex-wrap gap-1">
                  {request.approvers?.map((email) => (
                    <Badge
                      key={email}
                      variant="outline"
                      className="font-normal text-xs bg-muted/50"
                    >
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {request.credit_note_details && (
            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Credit Note Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-blue-900">
                  {request.credit_note_details.currency}{" "}
                  {parseFloat(
                    request.credit_note_details.amount || "0"
                  ).toLocaleString()}
                </div>
                <p className="text-xs text-blue-700">
                  {request.credit_note_details.customer_name}
                </p>
                <Button
                  size="sm"
                  variant="link"
                  className="px-0 text-blue-600 h-auto"
                  onClick={() => setCreditNoteModal(true)}
                >
                  View Full Details &rarr;
                </Button>
              </CardContent>
            </Card>
          )}

          {request.posting_details && (
            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <File className="h-4 w-4" /> Posting Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-bold text-blue-900">
                  {request.posting_details.title}
                </div>
                <p className="text-xs text-blue-700">
                  {request.posting_details.posting_type}
                </p>
                <Button
                  size="sm"
                  variant="link"
                  className="px-0 text-blue-600 h-auto"
                  onClick={() => setPostingModal(true)}
                >
                  View Full Details &rarr;
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Credit Note Modal */}
      {request.credit_note && request.credit_note_details && (
        <Dialog open={creditNoteModal} onOpenChange={setCreditNoteModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Credit Note Details</DialogTitle>
              <CardDescription>
                Transaction ID: {request.credit_note_details.identity}
              </CardDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              <div className="col-span-2 md:col-span-1 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Customer
                  </Label>
                  <div className="font-medium">
                    {request.credit_note_details.customer_name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {request.credit_note_details.customer_email}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Check Number
                  </Label>
                  <div className="font-medium">
                    {request.credit_note_details.check_number || "N/A"}
                  </div>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Amount
                  </Label>
                  <div className="font-bold text-lg">
                    {request.credit_note_details.currency}{" "}
                    {parseFloat(request.credit_note_details.amount).toFixed(2)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <div>
                    {renderStatusBadge(request.credit_note_details.status)}
                  </div>
                </div>
              </div>

              <div className="col-span-2 pt-4 border-t grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Revenue Center
                  </Label>
                  <div>{request.credit_note_details.revenue_center}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Cashier
                  </Label>
                  <div>{request.credit_note_details.cashier_name}</div>
                </div>
              </div>
            </div>
            {request.credit_note_details.attachment && (
              <DialogFooter className="sm:justify-start">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={request.credit_note_details.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Original Receipt /
                    File
                  </a>
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Posting Modal */}
      {request.posting && request.posting_details && (
        <Dialog open={postingModal} onOpenChange={setPostingModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Posting Details</DialogTitle>
              <CardDescription>
                Reference: {request.posting_details.reference}
              </CardDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              <div className="col-span-2 md:col-span-1 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <div className="font-medium">
                    {request.posting_details.title}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <div className="font-medium">
                    {request.posting_details.posting_type}
                  </div>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <div>{renderStatusBadge(request.posting_details.status)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Created At
                  </Label>
                  <div>
                    {new Date(
                      request.posting_details.created_at
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-start gap-2">
              {request.posting_details.check_file && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={request.posting_details.check_file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <File className="mr-2 h-4 w-4" /> Check File
                  </a>
                </Button>
              )}
              {request.posting_details.journal_file && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={request.posting_details.journal_file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <File className="mr-2 h-4 w-4" /> Journal File
                  </a>
                </Button>
              )}
            </DialogFooter>
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
              {commentModal.action === "Reviewed" ? "Review" : "Reject"} Request
            </DialogTitle>
            <CardDescription>
              Please provide a reason or comment for this action.
            </CardDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                value={comment}
                autoFocus
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your comment here..."
              />
            </div>
          </div>
          <DialogFooter>
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
                ? "Processing..."
                : `Confirm ${commentModal.action}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
