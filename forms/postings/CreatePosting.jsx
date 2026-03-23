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
        uploaded_attachments: [],
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

          formData.append("title", values.title);
          formData.append("posting_type", values.posting_type);

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
      {({ values, setFieldValue }) => (
        <Form className="w-full container p-4 mx-auto space-y-6">

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
            <div className="grid gap-2">
              <Label htmlFor="uploaded_attachments">Attachments</Label>
              <Input
                type="file"
                multiple
                name="uploaded_attachments"
                id="uploaded_attachments"
                onChange={(e) =>
                  setFieldValue("uploaded_attachments", Array.from(e.target.files))
                }
                className="file:text-foreground"
              />
              <p className="text-[10px] text-muted-foreground italic">
                {values.uploaded_attachments.length > 0 ? `${values.uploaded_attachments.length} files selected` : "Upload attachments"}
              </p>
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
            <Button type="submit" disabled={loading || values.approvers.length === 0}>
              {loading ? "Creating..." : "Create Posting"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
