"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createFeedbackForm } from "@/services/feedbackforms";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function CreateFeedbackForm({ refetch, closeModal, center }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <Formik
      initialValues={{
        logo: null,
        center: center?.name,
        title: "",
        description: "",
        is_accomodation: false,
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          const formData = new FormData();
          if (values?.logo) formData.append("logo", values?.logo);
          formData.append("center", values?.center);
          formData.append("title", values?.title);
          formData.append("description", values?.description);
          formData.append("is_accomodation", values?.is_accomodation);
          await createFeedbackForm(formData, axios);
          toast.success("Feedback form created successfully!");
          refetch();
          closeModal();
        } catch (error) {
          toast.error("Error creating feedback form");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="center">Center</Label>
              <Input
                id="center"
                name="center"
                type="text"
                value={values.center}
                disabled
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Form Logo</Label>
              <Input
                type="file"
                id="logo"
                name="logo"
                onChange={(e) => setFieldValue("logo", e.target.files?.[0])}
                className="cursor-pointer file:cursor-pointer text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Field
                as={Input}
                id="title"
                name="title"
                placeholder="Enter form title (e.g. Guest Satisfaction)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Field
                as={Textarea}
                id="description"
                name="description"
                placeholder="Briefly describe the purpose of this form..."
                className="min-h-[100px] resize-none"
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Field
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                id="is_accomodation"
                name="is_accomodation"
                type="checkbox"
              />
              <Label
                htmlFor="is_accomodation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Is Accommodation Form
              </Label>
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
                {loading ? "Creating..." : "Create Form"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateFeedbackForm;
