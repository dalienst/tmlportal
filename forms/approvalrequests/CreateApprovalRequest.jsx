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
import { cn } from "@/lib/utils";

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
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Type */}
              <div className="grid gap-2">
                <Label htmlFor="request_type" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Request Type</Label>
                <Field
                  as="select"
                  name="request_type"
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all font-medium"
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

              {/* Title */}
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Title</Label>
                <Field
                  as={Input}
                  type="text"
                  name="title"
                  placeholder="Enter a clear title"
                  className="h-11 rounded-xl bg-background/50 font-medium"
                />
              </div>
            </div>

            {/* Credit Note Selection */}
            {values.request_type === "Credit Note" && (
              <div className="grid gap-2">
                <Label htmlFor="credit_note" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Credit Note</Label>
                <Field
                  as="select"
                  name="credit_note"
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all font-medium"
                >
                  <option value="">Select Credit Note</option>
                  {creditNotes?.map((creditNote) => (
                    <option
                      key={creditNote.identity}
                      value={creditNote.identity}
                    >
                      {creditNote.check_number} - {creditNote.customer_name} - {creditNote.amount} {creditNote.currency} ({creditNote.status})
                    </option>
                  ))}
                </Field>
              </div>
            )}

            {/* Description */}
            {values.request_type !== "Credit Note" && (
              <div className="grid gap-2">
                <Label htmlFor="description" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
                <Field
                  as={Textarea}
                  name="description"
                  placeholder="Provide details about this request..."
                  className="min-h-[120px] rounded-xl bg-background/50 font-medium"
                />
              </div>
            )}

            {/* Attachment */}
            <div className="grid gap-2">
              <Label htmlFor="attachment" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Attachment (Optional)</Label>
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors bg-background/30">
                <Input
                  type="file"
                  id="attachment"
                  className="cursor-pointer file:bg-primary file:text-primary-foreground file:rounded-lg file:border-0 file:px-4 file:py-1 file:mr-4 file:hover:bg-primary/90 transition-all"
                  onChange={(e) => setFieldValue("attachment", e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Approvers */}
            <div className="grid gap-2">
              <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Select Approvers <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                {availableApprovers && availableApprovers.length > 0 ? (
                  availableApprovers.map((manager) => (
                    <div
                      key={manager.email}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer group",
                        values.approvers.includes(manager.email)
                          ? "bg-primary/5 border-primary ring-2 ring-primary/10"
                          : "bg-background/50 border-border hover:border-primary/50"
                      )}
                    >
                      <Field
                        type="checkbox"
                        name="approvers"
                        value={manager.email}
                        id={`approver-${manager.email}`}
                        className="h-5 w-5 rounded-lg border-muted-foreground/30 text-primary focus:ring-primary/50 transition-all cursor-pointer"
                      />
                      <label
                        htmlFor={`approver-${manager.email}`}
                        className="flex flex-col cursor-pointer select-none min-w-0"
                      >
                        <span className="text-sm font-bold text-foreground truncate">{manager.name || "Unnamed Manager"}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{manager.email}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-sm text-muted-foreground">No available approvers found.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || values.approvers.length === 0}
                className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
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