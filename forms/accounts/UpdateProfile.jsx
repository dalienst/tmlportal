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
        <Form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
            <Field
              as={Input}
              name="name"
              placeholder="Your full name"
              className={cn(
                "h-12 rounded-xl bg-background border-muted-foreground/20 focus:ring-primary/20 transition-all",
                errors.name && touched.name && "border-destructive focus:ring-destructive/20"
              )}
            />
            {errors.name && touched.name && (
                <div className="text-destructive text-[10px] font-bold uppercase tracking-tight ml-1 leading-none pt-1 animate-in fade-in slide-in-from-top-1">
                    {errors.name}
                </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t uppercase tracking-widest text-[10px] font-black">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl px-6 h-12 hover:bg-muted font-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20 font-black"
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
