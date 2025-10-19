"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

function EmployeeCreditNotesTable({ creditNotes }) {
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-black mb-4">Credit Notes</h3>
      {creditNotes?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-medium text-gray-700">
                  Reference
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">
                  Customer Name
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">
                  Amount
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {creditNotes.map((creditNote) => (
                <tr
                  key={creditNote.identity}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-900">
                    {creditNote.reference}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {creditNote.customer_name}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {creditNote.currency}{" "}
                    {parseFloat(creditNote.amount).toFixed(2)}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
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
                  </td>
                  <td className="p-3 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedCreditNote(creditNote)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
