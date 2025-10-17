"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createCreditNote } from "@/services/creditnotes";
import { Form, Formik } from "formik";
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
        reason: "",
        attachment: null,
        revenue_center: "",
        cashier_name: "",
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
        <Form>
          <section>
            <h2 className="text-2xl font-bold text-destructive">
              Create Credit Note
            </h2>
          </section>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCreditNote;
