"use client";

import { revenueCenters } from "@/data/revenueCenters";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createCreditNote } from "@/services/creditnotes";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateCreditNote({ closeModal, refetch }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

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
        revenue_center: "",
        cashier_name: "",
        reason: "",
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
          formData.append("revenue_center", values?.revenue_center);
          formData.append("cashier_name", values?.cashier_name);
          await createCreditNote(formData, token);
          toast.success("Credit note created successfully!");
          closeModal();
          refetch();
        } catch (error) {
          toast.error("Something went wrong!");
          console.log(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="w-full max-w-4xl mx-auto p-4">
          <section className="mb-3">
            <h2 className="text-3xl font-bold text-destructive">
              Create Credit Note
            </h2>
          </section>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-destructive mb-3">
              Customer Details
            </h3>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label
                  htmlFor="customer_name"
                  className="block text-black text-sm mb-1"
                >
                  Customer Name
                </label>
                <Field
                  type="text"
                  name="customer_name"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <label
                  htmlFor="customer_address"
                  className="block text-black text-sm mb-1"
                >
                  Customer Address
                </label>
                <Field
                  type="text"
                  name="customer_address"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                  placeholder="Customer Address"
                />
              </div>
              <div>
                <label
                  htmlFor="customer_email"
                  className="block text-black text-sm mb-1"
                >
                  Customer Email
                </label>
                <Field
                  type="email"
                  name="customer_email"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                  placeholder="Customer Email"
                />
              </div>
            </section>
          </div>

          {/* Transaction Details */}
          <div>
            <h3 className="text-xl font-bold text-destructive mb-3">
              Transaction Details
            </h3>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label
                  htmlFor="transaction_date"
                  className="block text-black text-sm mb-1"
                >
                  Transaction Date
                </label>
                <Field
                  type="date"
                  name="transaction_date"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                  placeholder="Transaction Date"
                />
              </div>
              <div>
                <label
                  htmlFor="check_number"
                  className="block text-black text-sm mb-1"
                >
                  Check Number
                </label>
                <Field
                  type="text"
                  name="check_number"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                  placeholder="Check Number"
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-black text-sm mb-1"
                >
                  Amount
                </label>
                <Field
                  type="number"
                  name="amount"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                  placeholder="Amount"
                />
              </div>
              <div>
                <label
                  htmlFor="attachment"
                  className="block text-black text-sm mb-1"
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
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="revenue_center"
                  className="block text-black text-sm mb-1"
                >
                  Revenue Center
                </label>
                <Field
                  as="select"
                  name="revenue_center"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                >
                  <option value="">Select Revenue Center</option>
                  {revenueCenters?.map((center) => (
                    <option key={center?.id} value={center?.name}>
                      {center?.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label
                  htmlFor="cashier_name"
                  className="block text-black text-sm mb-1"
                >
                  Cashier Name
                </label>
                <Field
                  type="text"
                  name="cashier_name"
                  className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                  placeholder="Cashier Name"
                />
              </div>
            </section>
            <div>
              <label htmlFor="reason" className="block text-black text-sm mb-1">
                Reason
              </label>
              <Field
                as="textarea"
                name="reason"
                className="px-2 py-1 border border-border rounded w-full focus:ring-2 focus:ring-primary text-black text-sm"
                placeholder="Credit Note Reason"
                rows="4"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-destructive text-white rounded hover:bg-destructive-hover mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
            >
              Create Credit Note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCreditNote;
