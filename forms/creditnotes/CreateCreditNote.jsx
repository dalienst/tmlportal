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
        attachment: null,
        revenuecenter: "",
        cashier_name: "",
        reason: "",
        approvers: [],
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          const formData = new FormData();
          if (values?.attachment)
            formData.append("attachment", values?.attachment);
          formData.append("customer_name", values?.customer_name);
          formData.append("customer_address", values?.customer_address);
          formData.append("customer_email", values?.customer_email);
          formData.append("transaction_date", values?.transaction_date);
          formData.append("check_number", values?.check_number);
          formData.append("amount", values?.amount);
          formData.append("reason", values?.reason);
          formData.append("revenuecenter", values?.revenuecenter);
          formData.append("cashier_name", values?.cashier_name);
          values.approvers.forEach((approver) => {
            formData.append("approvers", approver);
          });

          await createCreditNote(formData, token);
          toast.success("Credit note created successfully!");
          closeModal();
          refetch();
        } catch (error) {
          toast.error("Something went wrong!");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="w-full max-w-4xl mx-auto space-y-6">
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Create Credit Note
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details to create a new credit note.
            </p>
          </section>

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
                <Label htmlFor="attachment">Attachment</Label>
                <Input
                  type="file"
                  name="attachment"
                  id="attachment"
                  onChange={(e) =>
                    setFieldValue("attachment", e.target.files[0])
                  }
                  className="file:text-foreground"
                />
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
                      {manager.email === currentUser?.email && "(You)"}
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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Credit Note"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCreditNote;
