"use client";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createQuestion } from "@/services/questions";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

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
      {({ setFieldValue }) => (
        <Form className="w-full max-w-md p-6 bg-card border border-border rounded-lg shadow-md">
          <Image
            className="mx-auto mb-4"
            src="/logo.png"
            alt="Tamarind Logo"
            width={100}
            height={100}
          />
          <h2 className="mb-6 text-2xl font-bold text-center text-foreground">
            Create Question
          </h2>
          <div className="mb-4 hidden">
            <label
              htmlFor="feedbackForm"
              className="block text-foreground mb-2"
            >
              Feedback Form
            </label>
            <Field
              type="text"
              id="feedbackForm"
              name="feedbackForm"
              className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-muted focus:ring-2 focus:ring-primary"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="text" className="block text-foreground mb-2">
              Question Text
            </label>
            <Field
              type="text"
              id="text"
              name="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-foreground mb-2">
              Type
            </label>
            <Field
              as="select"
              id="type"
              name="type"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="">Select Type</option>
              <option value="RATING">Rating</option>
              <option value="TEXT">Text</option>
              <option value="YES_NO">Yes/No</option>
            </Field>
          </div>
          <div className="mb-4">
            <label htmlFor="order" className="block text-foreground mb-2">
              Order
            </label>
            <Field
              type="number"
              id="order"
              name="order"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              min="0"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-accent text-accent-foreground py-2 rounded-lg hover:bg-opacity-90 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Question"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateQuestion;
