"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function ApprovalStepsTable({ approvalSteps, account }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const itemsPerPage = 5;
  const router = useRouter();

  // Get unique request types for the filter dropdown
  const requestTypes = [
    ...new Set(
      approvalSteps
        ?.map((step) => step.request_info?.request_type)
        .filter(Boolean)
    ),
  ];

  // Filter approval steps for those requiring manager's action AND the selected request type
  const pendingSteps = approvalSteps?.filter((step) => {
    const isPendingForUser =
      step.approver === account?.email && step.status === "Pending";
    const matchesType =
      !filterType || step.request_info?.request_type === filterType;
    return isPendingForUser && matchesType;
  });

  // Pagination logic
  const totalItems = pendingSteps?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSteps = pendingSteps?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-black">
          Pending Approval Steps
        </h3>

        {/* Filter Section */}
        <div className="flex items-center gap-2">
          <Label htmlFor="request_type" className="shrink-0">
            Filter Type:
          </Label>
          <select
            id="request_type"
            value={filterType}
            onChange={handleFilterChange}
            className="flex h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Types</option>
            {requestTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      {paginatedSteps?.length > 0 ? (
        <>
        <div className="overflow-x-auto">
          <Table className="bg-white shadow-md rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Approval Request</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Step Order</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSteps.map((step) => (
                <TableRow key={step.reference}>
                  <TableCell>{step.request_info?.title || "N/A"}</TableCell>
                  <TableCell>
                    {step.request_info?.request_type || "N/A"}
                  </TableCell>
                  <TableCell>{step.step_order}</TableCell>
                  <TableCell>
                    {new Date(step.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="text-blue-600"
                      onClick={() =>
                        router.push(
                          `/approvalrequests/${step.approval_request}`
                        )
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} pending steps
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
        <p className="text-gray-600">No pending approval steps available.</p>
      )}
    </div>
  );
}

export default ApprovalStepsTable;
