"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { updateFeedbackForm } from "@/services/feedbackforms";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

function UpdateFeedbackForm({ refetch, closeModal, center, feedbackForm }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <Formik
      initialValues={{
        logo: null,
        center: feedbackForm?.center,
        title: feedbackForm?.title || "",
        description: feedbackForm?.description || "",
        is_accomodation: feedbackForm?.is_accomodation || false,
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
          await updateFeedbackForm(
            formData,
            axios,
            feedbackForm?.form_identity
          );
          toast.success("Feedback form updated successfully!");
          refetch();
          closeModal();
        } catch (error) {
          toast.error("Error creating feedback form");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="w-full max-w-md p-6 bg-card border border-border rounded-lg shadow-md">
          <Image
            className="mx-auto mb-4"
            src="/logo.png"
            alt="Tamarind Logo"
            width={100}
            height={100}
          />
          <h2 className="mb-6 text-2xl font-bold text-center text-black">
            Update Feedback Form
          </h2>
          <div className="mb-4">
            <label className="block text-black mb-2">Center</label>
            <Field
              className="w-full px-3 py-2 border border-border rounded-lg text-black bg-muted focus:ring-2 focus:ring-primary"
              id="center"
              name="center"
              type="text"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="logo" className="block text-black mb-2">
              Form Logo
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={(e) => setFieldValue("logo", e.target.files[0])}
              className="block w-full text-sm text-black border border-border rounded-lg cursor-pointer bg-muted focus:outline-none py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Title</label>
            <Field
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary text-black"
              id="title"
              name="title"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Description</label>
            <Field
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary text-black"
              id="description"
              name="description"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2 flex items-center">
              Is Accommodation Form
            </label>
            <div className="flex items-center">
              <Field
                className="h-5 w-5 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                id="is_accomodation"
                name="is_accomodation"
                type="checkbox"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4 md:flex-row md:gap-4">
            <button
              type="submit"
              className={`w-full bg-accent text-accent-foreground py-2 rounded-lg hover:bg-opacity-90 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="w-full bg-accent text-accent-foreground py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UpdateFeedbackForm;
