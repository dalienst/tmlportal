"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createApprovalRequest } from "@/services/approvalrequests";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateApprovalRequest({ isOpen, onClose, creditNotes, managers, refetch }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
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
              if (refetch) refetch();
            } catch (error) {
              toast.error("Failed to create approval request");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="request_type">Request Type</Label>
                <Field
                  as="select"
                  name="request_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="grid gap-2">
                  <Label htmlFor="credit_note">Credit Note</Label>
                  <Field
                    as="select"
                    name="credit_note"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Field
                  as={Input}
                  type="text"
                  name="title"
                  placeholder="Enter Title"
                />
              </div>

              {values.request_type !== "Credit Note" && (
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Field
                    as={Textarea}
                    name="description"
                    placeholder="Enter Description"
                    className="min-h-[100px]"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="attachment">Attachment</Label>
                <Input
                  type="file"
                  name="attachment"
                  id="attachment"
                  onChange={(e) =>
                    setFieldValue("attachment", e.target.files[0])
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="approvers">Approvers</Label>
                <Field
                  as="select"
                  name="approvers"
                  multiple
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Approvers</option>
                  {managers?.map((manager) => (
                    <option key={manager?.email} value={manager?.email}>
                      {manager?.name}
                    </option>
                  ))}
                </Field>
                <p className="text-xs text-muted-foreground">
                  Hold Ctrl (Cmd) to select multiple approvers.
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                 <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateApprovalRequest;
