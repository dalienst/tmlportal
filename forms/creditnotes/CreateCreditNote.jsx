"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createCreditNote } from "@/services/creditnotes";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchRevenueCenters } from "@/hooks/revenuecenters/actions";
import { X } from "lucide-react";


function CreateCreditNote({ closeModal, refetch, managers }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

  // Fetch current logged-in user to exclude them from approvers
  const { data: currentUser } = useFetchAccount();
  const { data: revenueCenters } = useFetchRevenueCenters();

  // Filter out the current user from the list of possible approvers and only include GM and Finance
  const availableApprovers = managers?.filter(
    (manager) =>
      (manager.is_gm || manager.is_finance) &&
      manager.email !== currentUser?.email,
  );

  return (
    <Formik
      initialValues={{
        customer_name: "",
        customer_address: "",
        customer_email: "",
        transaction_date: "",
        check_number: "",
        amount: "",
        uploaded_attachments: [], // many files
        revenuecenter: "",
        cashier_name: "",
        reason: "",
        approvers: [],
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          const formData = new FormData();

          if (values.uploaded_attachments && values.uploaded_attachments.length > 0) {
            values.uploaded_attachments.forEach((file) => {
              formData.append("uploaded_attachments", file);
            });
          }

          formData.append("customer_name", values.customer_name);
          formData.append("customer_address", values.customer_address);
          formData.append("customer_email", values.customer_email);
          formData.append("transaction_date", values.transaction_date);
          formData.append("check_number", values.check_number);
          formData.append("amount", values.amount);
          formData.append("reason", values.reason);
          formData.append("revenuecenter", values.revenuecenter);
          formData.append("cashier_name", values.cashier_name);

          values.approvers.forEach((approver) => {
            formData.append("approvers", approver);
          });

          await createCreditNote(formData, token);
          toast.success("Credit note created successfully!");
          closeModal();
          refetch();
        } catch (error) {
          toast.error("Something went wrong!");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="w-full container p-4 mx-auto space-y-6">

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Field
                  as={Input}
                  type="text"
                  name="customer_name"
                  placeholder="Customer Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer_address">Customer Address</Label>
                <Field
                  as={Input}
                  type="text"
                  name="customer_address"
                  placeholder="Customer Address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer_email">Customer Email</Label>
                <Field
                  as={Input}
                  type="email"
                  name="customer_email"
                  placeholder="Customer Email"
                />
              </div>
            </div>
          </div>

          <div className="border-t"></div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="transaction_date">Transaction Date</Label>
                <Field
                  as={Input}
                  type="date"
                  name="transaction_date"
                  className="block"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="check_number">Check Number</Label>
                <Field
                  as={Input}
                  type="text"
                  name="check_number"
                  placeholder="Check Number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Field
                  as={Input}
                  type="number"
                  name="amount"
                  placeholder="Amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attachments">Attachments</Label>
                <Input
                  type="file"
                  multiple
                  id="attachments"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    setFieldValue("uploaded_attachments", [...values.uploaded_attachments, ...newFiles]);
                    e.target.value = ""; // Reset input to allow re-selecting same files
                  }}
                  className="file:text-foreground"
                />

                {values.uploaded_attachments.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {values.uploaded_attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-200">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-[10px] font-medium truncate">{file.name}</span>
                          <span className="text-[8px] text-muted-foreground whitespace-nowrap">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            const newFiles = values.uploaded_attachments.filter((_, i) => i !== index);
                            setFieldValue("uploaded_attachments", newFiles);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground">
                  {values.uploaded_attachments.length > 0 ? `${values.uploaded_attachments.length} files selected` : "Select one or more files"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="revenuecenter">Revenue Center</Label>
                <Field
                  as="select"
                  name="revenuecenter"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Revenue Center</option>
                  {revenueCenters?.map((center) => (
                    <option key={center?.id} value={center?.name}>
                      {center?.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cashier_name">Cashier Name</Label>
                <Field
                  as={Input}
                  type="text"
                  name="cashier_name"
                  placeholder="Cashier Name"
                />
              </div>
            </div>

            <div className="grid gap-2 pt-2">
              <Label htmlFor="reason">Reason</Label>
              <Field
                as={Textarea}
                name="reason"
                placeholder="Credit Note Reason"
                rows={4}
              />
            </div>
          </div>

          <div className="grid gap-2 pt-2">
            <Label htmlFor="approvers">Approvers</Label>
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
                      {manager.name || manager.email}{" "}
                      <span className="text-[10px] text-muted-foreground uppercase">
                        ({manager.is_gm ? "General Manager" : "Finance"})
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No available approvers found.
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Select at least one approver. You cannot select yourself.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || values.approvers.length === 0}>
              {loading ? "Creating..." : "Create Credit Note"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCreditNote;
