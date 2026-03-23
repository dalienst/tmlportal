"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { updateProfile } from "@/services/accounts";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { cn } from "@/lib/utils";

const UpdateProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export default function UpdateProfile({ user, refetch, onClose }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <Formik
      initialValues={{ name: user?.name || "" }}
      validationSchema={UpdateProfileSchema}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          await updateProfile(user?.id, values, axios);
          toast.success("Profile updated successfully");
          if (refetch) refetch();
          onClose();
        } catch (error) {
          toast.error("Failed to update profile");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="w-full container p-4 mx-auto space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Field
              as={Input}
              name="name"
              placeholder="Your full name"
            />
            {errors.name && touched.name && (
              <div className="text-destructive text-xs">
                {errors.name}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
