"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { createPosting } from "@/services/postings";

export default function CreatePosting({ closeModal, refetch, managers }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

  // Fetch current logged-in user to exclude them from approvers
  const { data: currentUser } = useFetchAccount();

  // Filter out the current user from the list of possible approvers
  const availableApprovers = managers?.filter(
    (manager) => manager.email !== currentUser?.email
  );
  return (
    <Formik
      initialValues={{
        title: "",
        posting_type: "", //Choices are: Double, Triple, Quadruple, Pentuple
        check_file: null,
        journal_file: null,
        approvers: [],
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          const formData = new FormData();
          if (values?.check_file)
            formData.append("check_file", values?.check_file);
          if (values?.journal_file)
            formData.append("journal_file", values?.journal_file);
          formData.append("title", values?.title);
          formData.append("posting_type", values?.posting_type);
          values.approvers.forEach((approver) => {
            formData.append("approvers", approver);
          });
          await createPosting(formData, token);
          toast.success("Posting created successfully");
          closeModal();
          refetch();
        } catch (error) {
          toast.error("Failed to create posting");
        } finally {
          setLoading(false);
        }
      }}
    ></Formik>
  );
}
