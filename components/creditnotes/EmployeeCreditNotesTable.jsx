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

function EmployeeCreditNotesTable({ creditNotes }) {
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
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

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-black mb-4">Credit Notes</h3>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <Label htmlFor="check_number" className="text-sm font-medium">
              Check Number
            </Label>
            <Input
              id="check_number"
              name="check_number"
              value={filters.check_number}
              onChange={handleFilterChange}
              placeholder="Enter Check Number"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cashier_name" className="text-sm font-medium">
              Cashier Name
            </Label>
            <Input
              id="cashier_name"
              name="cashier_name"
              value={filters.cashier_name}
              onChange={handleFilterChange}
              placeholder="Enter Cashier Name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="customer_name" className="text-sm font-medium">
              Customer Name
            </Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={filters.customer_name}
              onChange={handleFilterChange}
              placeholder="Enter Customer Name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="transaction_date" className="text-sm font-medium">
              Transaction Date
            </Label>
            <Input
              id="transaction_date"
              name="transaction_date"
              type="date"
              value={filters.transaction_date}
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
      {paginatedCreditNotes?.length > 0 ? (
        <>
          <Table className="bg-white shadow-md rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Check Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCreditNotes.map((creditNote) => (
                <TableRow key={creditNote.identity}>
                  <TableCell>{creditNote.check_number}</TableCell>
                  <TableCell>{creditNote.customer_name}</TableCell>
                  <TableCell>
                    {creditNote.currency}{" "}
                    {parseFloat(creditNote.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        creditNote.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : creditNote.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {creditNote.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="text-blue-600"
                      onClick={() => setSelectedCreditNote(creditNote)}
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
              {totalItems} credit notes
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
                variant="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No credit notes available.</p>
      )}

      {/* Details Dialog */}
      {selectedCreditNote && (
        <Dialog
          open={!!selectedCreditNote}
          onOpenChange={() => setSelectedCreditNote(null)}
        >
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Credit Note Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Identity:</span>{" "}
                {selectedCreditNote.identity}
              </div>
              <div>
                <span className="font-semibold">Reference:</span>{" "}
                {selectedCreditNote.reference}
              </div>
              <div>
                <span className="font-semibold">Customer Name:</span>{" "}
                {selectedCreditNote.customer_name}
              </div>
              <div>
                <span className="font-semibold">Customer Email:</span>{" "}
                {selectedCreditNote.customer_email || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Customer Address:</span>{" "}
                {selectedCreditNote.customer_address || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Customer Phone:</span>{" "}
                {selectedCreditNote.customer_phone || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Amount:</span>{" "}
                {selectedCreditNote.currency}{" "}
                {parseFloat(selectedCreditNote.amount).toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedCreditNote.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedCreditNote.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedCreditNote.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Reason:</span>{" "}
                {selectedCreditNote.reason}
              </div>
              <div>
                <span className="font-semibold">Cashier Name:</span>{" "}
                {selectedCreditNote.cashier_name}
              </div>
              <div>
                <span className="font-semibold">Check Number:</span>{" "}
                {selectedCreditNote.check_number}
              </div>
              <div>
                <span className="font-semibold">Revenue Center:</span>{" "}
                {selectedCreditNote.revenue_center}
              </div>
              <div>
                <span className="font-semibold">Transaction Date:</span>{" "}
                {new Date(
                  selectedCreditNote.transaction_date
                ).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedCreditNote.created_at).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Updated At:</span>{" "}
                {new Date(selectedCreditNote.updated_at).toLocaleString()}
              </div>
              {selectedCreditNote.attachment && (
                <div>
                  <span className="font-semibold">Attachment:</span>{" "}
                  <a
                    href={selectedCreditNote.attachment}
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
    </div>
  );
}

export default EmployeeCreditNotesTable;
