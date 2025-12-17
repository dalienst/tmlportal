"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createCenter } from "@/services/centers";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
          console.log(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="w-full max-w-md p-6 bg-card border border-border rounded-lg shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <Image
              className="mb-3 object-contain"
              src="/logo.png"
              alt="Tamarind Logo"
              width={80}
              height={80}
            />
            <h2 className="text-2xl font-bold text-center text-foreground">
              Create Center
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Add a new operational center/branch
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Center Logo</Label>
              <Input
                type="file"
                id="logo"
                name="logo"
                onChange={(e) => setFieldValue("logo", e.target.files?.[0])}
                className="cursor-pointer file:cursor-pointer text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Center Name</Label>
              <Field
                as={Input}
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Tamarind Nairobi"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Field
                  as={Input}
                  type="text"
                  id="contact"
                  name="contact"
                  placeholder="Phone or Email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Field
                  as={Input}
                  type="text"
                  id="location"
                  name="location"
                  placeholder="City, Street"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Field
                as={Textarea}
                id="description"
                name="description"
                placeholder="Brief description of the center..."
                className="min-h-[100px] resize-none"
                required
              />
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
                {loading ? "Creating..." : "Create Center"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCenter;
