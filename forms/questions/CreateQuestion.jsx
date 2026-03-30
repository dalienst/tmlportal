"use client";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createQuestion } from "@/services/questions";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CreateQuestion({ feedbackForm, closeModal, refetch }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

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
          refetch();
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
                <Select
                  name="type"
                  onValueChange={(value) => setFieldValue("type", value)}
                  defaultValue={values.type}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RATING">Rating (Stars)</SelectItem>
                    <SelectItem value="TEXT">Text Response</SelectItem>
                    <SelectItem value="YES_NO">Yes/No Toggle</SelectItem>
                  </SelectContent>
                </Select>
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
