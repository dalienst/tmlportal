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
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function ApprovalStepsTable({ approvalSteps, account }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  // Filter approval steps for those requiring manager's action
  const pendingSteps = approvalSteps?.filter(
    (step) => step.approver === account?.email && step.status === "Pending"
  );

  // Pagination logic
  const totalItems = pendingSteps?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSteps = pendingSteps?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-black mb-4">
        Pending Approval Steps
      </h3>

      {/* Table Section */}
      {paginatedSteps?.length > 0 ? (
        <>
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

          {/* Pagination Controls */}
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
