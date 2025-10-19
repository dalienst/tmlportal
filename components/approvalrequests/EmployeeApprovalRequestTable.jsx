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
import React, { useState } from "react";

function EmployeeApprovalRequestTable({ approvalRequests }) {
  const [selectedApprovalRequest, setSelectedApprovalRequest] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    title: "",
    request_type: "",
    created_at: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      request_type: "",
      created_at: "",
    });
    setCurrentPage(1); // Reset to first page
  };

  // Filter approval requests
  const filteredApprovalRequests = approvalRequests?.filter((request) => {
    return (
      (!filters.status || request.status === filters.status) &&
      (!filters.title ||
        request.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.request_type ||
        request.request_type === filters.request_type) &&
      (!filters.created_at ||
        new Date(request.created_at).toLocaleDateString() ===
          new Date(filters.created_at).toLocaleDateString())
    );
  });

  // Pagination logic
  const totalItems = filteredApprovalRequests?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredApprovalRequests?.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-black mb-4">
        Approval Requests
      </h3>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Enter Title"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="request_type" className="text-sm font-medium">
              Request Type
            </Label>
            <select
              id="request_type"
              name="request_type"
              value={filters.request_type}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            >
              <option value="">All Request Types</option>
              <option value="LPO">Local Purchase Order (LPO)</option>
              <option value="Credit Note">Credit Note</option>
              <option value="Debit Note">Debit Note</option>
              <option value="Invoice">Invoice</option>
              <option value="Quotation">Quotation</option>
              <option value="Payment">Payment</option>
              <option value="Expense">Expense</option>
              <option value="Leave">Leave</option>
              <option value="Role">Role Change</option>
              <option value="Specials">Specials</option>
            </select>
          </div>
          <div>
            <Label htmlFor="created_at" className="text-sm font-medium">
              Created At
            </Label>
            <Input
              id="created_at"
              name="created_at"
              type="date"
              value={filters.created_at}
              onChange={handleFilterChange}
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            variant="sm"
            onClick={resetFilters}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Table Section */}
      {paginatedRequests?.length > 0 ? (
        <>
          <Table className="bg-white shadow-md rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow key={request.identity}>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.request_type}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="text-blue-600"
                      onClick={() => setSelectedApprovalRequest(request)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} requests
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No approval requests available.</p>
      )}

      {/* Details Dialog */}
      {selectedApprovalRequest && (
        <Dialog
          open={!!selectedApprovalRequest}
          onOpenChange={() => setSelectedApprovalRequest(null)}
        >
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Approval Request Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Title:</span>{" "}
                {selectedApprovalRequest.title}
              </div>
              <div>
                <span className="font-semibold">Request Type:</span>{" "}
                {selectedApprovalRequest.request_type}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedApprovalRequest.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedApprovalRequest.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedApprovalRequest.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Description:</span>{" "}
                {selectedApprovalRequest.description || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Created By:</span>{" "}
                {selectedApprovalRequest.created_by}
              </div>
              <div>
                <span className="font-semibold">Approvers:</span>{" "}
                {selectedApprovalRequest.approvers.length > 0
                  ? selectedApprovalRequest.approvers.join(", ")
                  : "None"}
              </div>
              <div>
                <span className="font-semibold">Credit Note:</span>{" "}
                {selectedApprovalRequest.credit_note || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Steps:</span>{" "}
                {selectedApprovalRequest.steps
                  ? `${selectedApprovalRequest.steps.length} step(s)`
                  : "N/A"}
              </div>
              {selectedApprovalRequest.attachment && (
                <div>
                  <span className="font-semibold">Attachment:</span>{" "}
                  <a
                    href={selectedApprovalRequest.attachment}
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
                {new Date(selectedApprovalRequest.created_at).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Updated At:</span>{" "}
                {new Date(selectedApprovalRequest.updated_at).toLocaleString()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default EmployeeApprovalRequestTable;
