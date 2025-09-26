"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createCenter } from "@/services/centers";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateCenter({ refetch, closeModal }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <Formik
      initialValues={{
        logo: null,
        name: "",
        description: "",
        location: "",
        contact: "",
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          const formData = new FormData();
          if (values?.logo) formData.append("logo", values?.logo);
          formData.append("name", values?.name);
          formData.append("description", values?.description);
          formData.append("location", values?.location);
          formData.append("contact", values?.contact);
          await createCenter(formData, axios);
          toast.success("Center created successfully!");
          refetch();
          closeModal();
        } catch (error) {
          toast.error("Something went wrong!");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="w-full max-w-md p-4 bg-card border border-border rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
          <Image
            className="mx-auto mb-3"
            src="/logo.png"
            alt="Tamarind Logo"
            width={100}
            height={100}
          />
          <h2 className="mb-4 text-xl font-bold text-center text-foreground">
            Create Center
          </h2>
          <div className="mb-3">
            <label
              htmlFor="logo"
              className="block text-foreground text-sm mb-1"
            >
              Center Logo
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={(e) => setFieldValue("logo", e.target.files[0])}
              className="block w-full text-sm text-foreground border border-border rounded-lg cursor-pointer bg-muted focus:outline-none py-1 px-2"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="name"
              className="block text-foreground text-sm mb-1"
            >
              Center Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="w-full px-2 py-1 border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm"
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="contact"
              className="block text-foreground text-sm mb-1"
            >
              Contact
            </label>
            <Field
              type="text"
              id="contact"
              name="contact"
              className="w-full px-2 py-1 border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm"
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="location"
              className="block text-foreground text-sm mb-1"
            >
              Location
            </label>
            <Field
              type="text"
              id="location"
              name="location"
              className="w-full px-2 py-1 border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm"
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="description"
              className="block text-foreground text-sm mb-1"
            >
              Description
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className="w-full px-2 py-1 border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm h-20 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-primary text-primary-foreground py-1.5 rounded-lg hover:bg-opacity-90 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Center"}
          </button>

          <button
            type="button"
            className="w-full mt-2 bg-secondary text-secondary-foreground py-1.5 rounded-lg hover:bg-opacity-90 transition-colors"
            onClick={closeModal}
          >
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCenter;
