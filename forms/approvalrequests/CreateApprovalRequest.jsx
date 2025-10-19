"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createApprovalRequest } from "@/services/approvalrequests";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateApprovalRequest({ isOpen, onClose, creditNotes, managers }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Approval Request
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            request_type: "",
            title: "",
            description: "",
            attachment: null,
            approvers: [],
            credit_note: "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              const formData = new FormData();
              formData.append("request_type", values.request_type);
              formData.append("title", values.title);
              formData.append("description", values.description);
              if (values.attachment) {
                formData.append("attachment", values.attachment);
              }
              // Send each approver email individually
              values.approvers.forEach((email) => {
                formData.append("approvers", email);
              });
              formData.append("credit_note", values.credit_note);

              await createApprovalRequest(formData, token);
              toast.success("Approval Request Created");
              setLoading(false);
              onClose();
            } catch (error) {
              toast.error("Failed to create approval request");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <label
                  htmlFor="request_type"
                  className="block text-base font-medium"
                >
                  Request Type
                </label>
                <Field
                  as="select"
                  name="request_type"
                  className="w-full border border-gray-300 rounded p-2 block"
                >
                  <option value="">Select Request Type</option>
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
                </Field>
              </div>

              {values.request_type === "Credit Note" && (
                <div className="space-y-4">
                  <label
                    htmlFor="credit_note"
                    className="block text-base font-medium"
                  >
                    Credit Note
                  </label>
                  <Field
                    as="select"
                    name="credit_note"
                    className="w-full border border-gray-300 rounded p-2 block"
                  >
                    <option value="">Select Credit Note</option>
                    {creditNotes?.map((creditNote) => (
                      <option
                        key={creditNote.reference}
                        value={creditNote.identity}
                      >
                        {creditNote.check_number} - {creditNote.customer_name} -{" "}
                        {creditNote.amount} - {creditNote.status}
                      </option>
                    ))}
                  </Field>
                </div>
              )}

              <div className="space-y-4">
                <label htmlFor="title" className="block text-base font-medium">
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="w-full border border-gray-300 rounded p-2 block"
                  placeholder="Enter Title"
                />
              </div>

              {values.request_type !== "Credit Note" && (
                <div className="space-y-4">
                  <label
                    htmlFor="description"
                    className="block text-base font-medium"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="w-full border border-gray-300 rounded p-2 block"
                    placeholder="Enter Description"
                  />
                </div>
              )}

              <div className="space-y-4">
                <label
                  htmlFor="attachment"
                  className="block text-base font-medium"
                >
                  Attachment
                </label>
                <input
                  type="file"
                  name="attachment"
                  id="attachment"
                  onChange={(e) =>
                    setFieldValue("attachment", e.target.files[0])
                  }
                  className="mt-1 block w-full border-gray-600 border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                />
              </div>

              <div className="space-y-4">
                <label
                  htmlFor="approvers"
                  className="block text-base font-medium"
                >
                  Approvers
                </label>
                <Field
                  as="select"
                  name="approvers"
                  multiple
                  className="w-full border border-gray-300 rounded p-2 block"
                >
                  <option value="">Select Approvers</option>
                  {managers?.map((manager) => (
                    <option key={manager?.email} value={manager?.email}>
                      {manager?.name}
                    </option>
                  ))}
                </Field>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>

                <button
                  type="button"
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateApprovalRequest;
