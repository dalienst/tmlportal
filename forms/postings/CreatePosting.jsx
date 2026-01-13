"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
        posting_type: "", // Choices: Double, Triple, Quadruple, Pentuple
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
          console.error(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="w-full max-w-4xl mx-auto space-y-6">
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Create Posting
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details to create a new posting.
            </p>
          </section>

          {/* Posting Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Posting Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Field
                  as={Input}
                  type="text"
                  name="title"
                  placeholder="Posting Title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="posting_type">Posting Type</Label>
                <Field
                  as="select"
                  name="posting_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Type</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Quadruple">Quadruple</option>
                  <option value="Pentuple">Pentuple</option>
                </Field>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="check_file">Check File</Label>
                <Input
                  type="file"
                  name="check_file"
                  id="check_file"
                  onChange={(e) =>
                    setFieldValue("check_file", e.target.files[0])
                  }
                  className="file:text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="journal_file">Journal File</Label>
                <Input
                  type="file"
                  name="journal_file"
                  id="journal_file"
                  onChange={(e) =>
                    setFieldValue("journal_file", e.target.files[0])
                  }
                  className="file:text-foreground"
                />
              </div>
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
              {loading ? "Creating..." : "Create Posting"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
