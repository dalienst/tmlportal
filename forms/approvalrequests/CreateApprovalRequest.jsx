"use client";

import Modal from "@/components/general/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createApprovalRequest } from "@/services/approvalrequests";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useFetchAccount } from "@/hooks/accounts/actions";

function CreateApprovalRequest({ isOpen, onClose, creditNotes, managers, refetch }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();
  const { data: currentUser } = useFetchAccount();

  const availableApprovers = managers?.filter(
    (manager) => manager.email !== currentUser?.email
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Approval Request"
      className="max-w-3xl"
    >
      <Formik
        initialValues={{
          request_type: "",
          title: "",
          description: "",
          uploaded_attachments: [],
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
            
            if (values.uploaded_attachments && values.uploaded_attachments.length > 0) {
              values.uploaded_attachments.forEach((file) => {
                formData.append("uploaded_attachments", file);
              });
            }

            values.approvers.forEach((email) => {
              formData.append("approvers", email);
            });
            formData.append("credit_note", values.credit_note || "");

            await createApprovalRequest(formData, token);
            toast.success("Approval Request Created");
            onClose();
            if (refetch) refetch();
          } catch (error) {
            toast.error("Failed to create approval request");
            console.error(error);
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="w-full container p-4 mx-auto space-y-6">
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Create Approval Request
              </h2>
              <p className="text-muted-foreground text-sm">
                Fill in the details to create a new approval request.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Type */}
              <div className="grid gap-2">
                <Label htmlFor="request_type">Request Type</Label>
                <Field
                  as="select"
                  name="request_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Type</option>
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

              {/* Title */}
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Field
                  as={Input}
                  type="text"
                  name="title"
                  placeholder="Enter a clear title"
                />
              </div>
            </div>

            {/* Credit Note Selection */}
            {values.request_type === "Credit Note" && (
              <div className="grid gap-2">
                <Label htmlFor="credit_note">Credit Note Reference</Label>
                <Field
                  as="select"
                  name="credit_note"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Credit Note</option>
                  {creditNotes?.map((creditNote) => (
                    <option
                      key={creditNote.identity}
                      value={creditNote.identity}
                    >
                      {creditNote.check_number} - {creditNote.customer_name} - {creditNote.amount} {creditNote.currency}
                    </option>
                  ))}
                </Field>
              </div>
            )}

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Field
                as={Textarea}
                name="description"
                placeholder="Provide details about this request..."
                rows={4}
              />
            </div>

            {/* Attachments */}
            <div className="grid gap-2">
              <Label htmlFor="uploaded_attachments">Attachments (Optional)</Label>
              <Input
                type="file"
                multiple
                id="uploaded_attachments"
                onChange={(e) => setFieldValue("uploaded_attachments", Array.from(e.target.files))}
                className="file:text-foreground"
              />
              <p className="text-[10px] text-muted-foreground italic">
                {values.uploaded_attachments.length > 0 ? `${values.uploaded_attachments.length} files selected` : "Select one or more files"}
              </p>
            </div>

            {/* Approvers */}
            <div className="grid gap-2">
              <Label htmlFor="approvers">Select Approvers</Label>
              <div className="max-h-60 overflow-y-auto rounded-md border border-input bg-background p-4">
                {availableApprovers && availableApprovers.length > 0 ? (
                  availableApprovers.map((manager) => (
                    <div
                      key={manager.email}
                      className="flex items-center space-x-3 py-2"
                    >
                      <Field
                        type="checkbox"
                        name="approvers"
                        value={manager.email}
                        id={`approver-${manager.email}`}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor={`approver-${manager.email}`}
                        className="text-sm font-medium leading-none cursor-pointer select-none"
                      >
                        {manager.name || manager.email}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No available approvers found.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || values.approvers.length === 0}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default CreateApprovalRequest;
