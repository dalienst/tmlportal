"use client";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Check,
  File,
} from "lucide-react";
import { resolvePosting } from "@/services/postings";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";

function PostingsTable({ postings, refetch }) {
  const axios = useAxiosAuth();
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    title: "",
    posting_type: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "",
      title: "",
      posting_type: "",
    });
    setCurrentPage(1); // Reset to first page
  };

  // Filter postings
  const filteredPostings = postings?.filter((posting) => {
    return (
      (!filters.status || posting.status === filters.status) &&
      (!filters.title ||
        posting.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.posting_type || posting.posting_type === filters.posting_type)
    );
  });

  // Pagination logic
  const totalItems = filteredPostings?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPostings = filteredPostings?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [resolveReason, setResolveReason] = useState("");
  const [showResolveInput, setShowResolveInput] = useState(false);

  // ... (keeping existing filters/pagination logic)

  const handleResolve = async () => {
    if (!selectedPosting) return;

    // If input not shown yet, show it
    if (!showResolveInput) {
      setShowResolveInput(true);
      return;
    }

    if (!resolveReason.trim()) {
      // You might want to show an error toast here
      return;
    }

    setIsResolving(true);
    try {
      // values should be status: Resolved and reason
      await resolvePosting(
        selectedPosting.reference,
        { status: "Resolved", reason: resolveReason },
        axios,
      );
      if (refetch) await refetch();
      setSelectedPosting(null);
      setResolveReason("");
      setShowResolveInput(false);
    } catch (error) {
      console.error("Failed to resolve posting:", error);
    } finally {
      setIsResolving(false);
    }
  };

  const closeDialog = () => {
    setSelectedPosting(null);
    setResolveReason("");
    setShowResolveInput(false);
  };

  const getStatusBadge = (status) => {
    // ... (existing badge logic)
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "Resolved":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "Pending":
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* ... (existing UI code up to Dialog) ... */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Postings</h3>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-background rounded-lg border shadow-sm space-y-4">
        {/* ... (existing filter inputs) ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Filter by Title"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="posting_type">Type</Label>
            <select
              id="posting_type"
              name="posting_type"
              value={filters.posting_type}
              onChange={handleFilterChange}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Types</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Quadruple">Quadruple</option>
              <option value="Pentuple">Pentuple</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPostings?.length > 0 ? (
              paginatedPostings.map((posting) => (
                <TableRow
                  key={posting.identity || posting.reference || Math.random()}
                >
                  <TableCell className="font-medium">{posting.title}</TableCell>
                  <TableCell>{posting.posting_type}</TableCell>
                  <TableCell>
                    {new Date(posting.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(posting.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPosting(posting)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No postings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {paginatedPostings?.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    className="w-8 p-0"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      {selectedPosting && (
        <Dialog open={!!selectedPosting} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Posting Details
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Header Status Section */}
              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Reference
                  </span>
                  <p className="font-mono text-sm">
                    {selectedPosting.reference || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">
                    Status
                  </span>
                  {getStatusBadge(selectedPosting.status)}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground border-b pb-2">
                  Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Title</span>
                    <span className="font-medium">{selectedPosting.title}</span>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="font-medium">
                      {selectedPosting.posting_type}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-sm text-muted-foreground">
                      Created At
                    </span>
                    <span className="font-medium">
                      {new Date(selectedPosting.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedPosting.reason && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground border-b pb-2">
                    Resolution Reason
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedPosting.reason}
                  </p>
                </div>
              )}

              {/* Approval Details Section */}
              {selectedPosting.posting_requests &&
                selectedPosting.posting_requests.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-foreground border-b pb-2">
                      Approval Details
                    </h4>
                    {selectedPosting.posting_requests.map((request, index) => (
                      <div
                        key={index}
                        className="bg-muted/20 p-4 rounded-lg border space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-sm">
                              {request.title}
                            </h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              {request.description}
                            </p>
                          </div>
                          <Badge
                            variant={
                              request.status === "APPROVED"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              request.status === "APPROVED"
                                ? "bg-green-600"
                                : ""
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <h6 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Approvers
                          </h6>
                          <div className="space-y-2">
                            {request.approvers.map((approverEmail, idx) => {
                              const step = request.steps?.find(
                                (s) => s.approver === approverEmail,
                              );
                              const status = step ? step.status : "Pending";

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-sm p-2 bg-background rounded border"
                                >
                                  <div className="flex items-center gap-2">
                                    {status === "Approved" ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : status === "Rejected" ? (
                                      <XCircle className="w-4 h-4 text-red-500" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-yellow-500" />
                                    )}
                                    <span className="font-mono text-xs">
                                      {approverEmail}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <Badge
                                      variant="outline"
                                      className={
                                        status === "Approved"
                                          ? "text-green-600 border-green-200 bg-green-50"
                                          : status === "Rejected"
                                            ? "text-red-600 border-red-200 bg-red-50"
                                            : "text-yellow-600 border-yellow-200 bg-yellow-50"
                                      }
                                    >
                                      {status}
                                    </Badge>
                                    {step && step.updated_at && (
                                      <span className="text-[10px] text-muted-foreground mt-1">
                                        {new Date(
                                          step.updated_at,
                                        ).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Attachments */}
              {selectedPosting.attachments &&
                selectedPosting.attachments.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-semibold text-foreground border-b pb-2">
                      Attachments
                    </h4>
                    <div className="flex flex-wrap gap-3 pt-2">
                      {selectedPosting.attachments.map((attachment, idx) => (
                        <Button
                          key={attachment.id || idx}
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <a
                            href={attachment.file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <File className="h-4 w-4" />
                            File {idx + 1}
                            {attachment.reference && (
                              <span className="text-[10px] opacity-70 ml-1 font-mono">
                                ({attachment.reference})
                              </span>
                            )}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

              {(!selectedPosting.attachments ||
                selectedPosting.attachments.length === 0) && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold text-foreground border-b pb-2">
                    Attachments
                  </h4>
                  <p className="text-sm text-muted-foreground pt-2">
                    No attachments.
                  </p>
                </div>
              )}

              {/* Action Buttons for Resolving */}
              {selectedPosting.status === "Approved" && (
                <div className="pt-4 border-t space-y-4">
                  {showResolveInput ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="reason">Resolution Reason</Label>
                        <textarea
                          id="reason"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Please enter the reason for resolving this posting..."
                          value={resolveReason}
                          onChange={(e) => setResolveReason(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowResolveInput(false);
                            setResolveReason("");
                          }}
                          disabled={isResolving}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white gap-2"
                          onClick={handleResolve}
                          disabled={isResolving || !resolveReason.trim()}
                        >
                          {isResolving ? "Resolving..." : "Confirm Resolution"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={closeDialog}
                        disabled={isResolving}
                      >
                        Close
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        onClick={handleResolve}
                        disabled={isResolving}
                      >
                        <Check className="h-4 w-4" />
                        Mark as Resolved
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default PostingsTable;
