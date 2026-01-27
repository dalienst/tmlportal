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
import { CheckCircle2, XCircle, Clock, FileText, Check } from "lucide-react";
import { resolveCreditNote } from "@/services/creditnotes";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";

function EmployeeCreditNotesTable({ creditNotes, isIT, isManager, refetch }) {
  const axios = useAxiosAuth();
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    check_number: "",
    cashier_name: "",
    customer_name: "",
    transaction_date: "",
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
      check_number: "",
      cashier_name: "",
      customer_name: "",
      transaction_date: "",
    });
    setCurrentPage(1); // Reset to first page
  };

  // Filter credit notes
  const filteredCreditNotes = creditNotes?.filter((creditNote) => {
    return (
      (!filters.status || creditNote.status === filters.status) &&
      (!filters.check_number ||
        creditNote.check_number
          .toLowerCase()
          .includes(filters.check_number.toLowerCase())) &&
      (!filters.cashier_name ||
        creditNote.cashier_name
          .toLowerCase()
          .includes(filters.cashier_name.toLowerCase())) &&
      (!filters.customer_name ||
        creditNote.customer_name
          .toLowerCase()
          .includes(filters.customer_name.toLowerCase())) &&
      (!filters.transaction_date ||
        new Date(creditNote.transaction_date).toLocaleDateString() ===
          new Date(filters.transaction_date).toLocaleDateString())
    );
  });

  // Pagination logic
  const totalItems = filteredCreditNotes?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCreditNotes = filteredCreditNotes?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleResolve = async () => {
    if (!selectedCreditNote) return;
    setIsResolving(true);
    try {
      await resolveCreditNote(selectedCreditNote.reference, axios);
      if (refetch) await refetch();
      setSelectedCreditNote(null);
    } catch (error) {
      console.error("Failed to resolve credit note:", error);
    } finally {
      setIsResolving(false);
    }
  };

  const getStatusBadge = (status) => {
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
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Credit Notes</h3>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-background rounded-lg border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <Label htmlFor="check_number">Check Number</Label>
            <Input
              id="check_number"
              name="check_number"
              value={filters.check_number}
              onChange={handleFilterChange}
              placeholder="Filter by Check #"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cashier_name">Cashier Name</Label>
            <Input
              id="cashier_name"
              name="cashier_name"
              value={filters.cashier_name}
              onChange={handleFilterChange}
              placeholder="Filter by Cashier"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={filters.customer_name}
              onChange={handleFilterChange}
              placeholder="Filter by Customer"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transaction_date">Date</Label>
            <Input
              id="transaction_date"
              name="transaction_date"
              type="date"
              value={filters.transaction_date}
              onChange={handleFilterChange}
              className="h-9"
            />
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
              <TableHead>Check Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCreditNotes?.length > 0 ? (
              paginatedCreditNotes.map((creditNote) => (
                <TableRow key={creditNote.identity}>
                  <TableCell className="font-medium">
                    {creditNote.check_number}
                  </TableCell>
                  <TableCell>{creditNote.customer_name}</TableCell>
                  <TableCell>
                    {creditNote.currency}{" "}
                    {parseFloat(creditNote.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(creditNote.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCreditNote(creditNote)}
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
                  No credit notes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {paginatedCreditNotes?.length > 0 && (
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
      {selectedCreditNote && (
        <Dialog
          open={!!selectedCreditNote}
          onOpenChange={() => setSelectedCreditNote(null)}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Credit Note Details
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
                    {selectedCreditNote.reference || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">
                    Status
                  </span>
                  {getStatusBadge(selectedCreditNote.status)}
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground border-b pb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="col-span-2 font-medium">
                        {selectedCreditNote.customer_name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="col-span-2">
                        {selectedCreditNote.customer_email || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="col-span-2">
                        {selectedCreditNote.customer_address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground border-b pb-2">
                    Transaction Details
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="col-span-2 font-bold text-lg">
                        {selectedCreditNote.currency}{" "}
                        {parseFloat(selectedCreditNote.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Check #:</span>
                      <span className="col-span-2">
                        {selectedCreditNote.check_number}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Cashier:</span>
                      <span className="col-span-2">
                        {selectedCreditNote.cashier_name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Rev. Ctr:</span>
                      <span className="col-span-2">
                        {selectedCreditNote.revenuecenter}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Sections */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground border-b pb-2">
                  Additional Info
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">
                      Transaction Date
                    </span>
                    <span>
                      {new Date(
                        selectedCreditNote.transaction_date,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">
                      Created At
                    </span>
                    <span>
                      {new Date(selectedCreditNote.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-muted-foreground block mb-1">
                    Reason
                  </span>
                  <div className="p-3 bg-muted/30 rounded-md text-sm italic">
                    {selectedCreditNote.reason || "No reason provided."}
                  </div>
                </div>
              </div>

              {selectedCreditNote.attachment && (
                <div className="flex justify-end pt-2">
                  <Button asChild variant="outline" className="gap-2">
                    <a
                      href={selectedCreditNote.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4" />
                      View Attachment
                    </a>
                  </Button>
                </div>
              )}

              {(isIT || isManager) &&
                selectedCreditNote.status === "Approved" && (
                  <div className="flex justify-end pt-4 border-t gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCreditNote(null)}
                      disabled={isResolving}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white gap-2"
                      onClick={handleResolve}
                      disabled={isResolving}
                    >
                      {isResolving ? (
                        "Resolving..."
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Mark as Resolved
                        </>
                      )}
                    </Button>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default EmployeeCreditNotesTable;
