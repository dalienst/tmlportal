"use client";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createQuestion } from "@/services/questions";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

function CreateQuestion({ feedbackForm, closeModal, refetch }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();
  const queryClient = useQueryClient();

  return (
    <Formik
      initialValues={{
        feedback_form: feedbackForm?.form_identity,
        text: "",
        type: "",
        order: 0,
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          await createQuestion(values, axios);
          toast.success("Question created successfully!");

          // Explicitly invalidate and refetch to ensure UI updates
          await queryClient.invalidateQueries({
            queryKey: ["feedbackforms", feedbackForm?.form_identity],
          });

          if (refetch) refetch();
          closeModal();
        } catch (error) {
          toast.error("Error creating question");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Question Text</Label>
              <Field
                as={Input}
                type="text"
                id="text"
                name="text"
                placeholder="Enter the question text"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={values.type}
                  onChange={(e) => setFieldValue("type", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="RATING">Rating (Stars)</option>
                  <option value="TEXT">Text Response</option>
                  <option value="YES_NO">Yes/No Toggle</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Field
                  as={Input}
                  type="number"
                  id="order"
                  name="order"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/2"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-1/2"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Question"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateQuestion;
