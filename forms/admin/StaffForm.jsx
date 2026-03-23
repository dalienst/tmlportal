"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function StaffForm({ roleLabel, apiAction, refetch, closeModal }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <Formik
      initialValues={{
        name: "",
        username: "",
        email: "",
        password: "",
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          await apiAction(values, axios);
          toast.success(`${roleLabel} created successfully!`);
          if (refetch) refetch();
          closeModal();
        } catch (error) {
          console.error(`Create ${roleLabel} error:`, error);
          toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
          setLoading(false);
        }
      }}
    >
      {() => (
        <Form className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Field
                as={Input}
                type="text"
                id="name"
                name="name"
                placeholder="e.g. John Doe"
                required
                className="bg-muted/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Field
                as={Input}
                type="text"
                id="username"
                name="username"
                placeholder="e.g. johndoe"
                required
                className="bg-muted/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Field
                as={Input}
                type="email"
                id="email"
                name="email"
                placeholder="e.g. john@tamarind.co.ke"
                required
                className="bg-muted/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Field
                as={Input}
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className="bg-muted/30"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Staff member will be able to reset this later.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 hover:bg-destructive/10 hover:text-destructive transition-colors text-sm"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 shadow-md shadow-primary/20 text-sm font-bold"
                disabled={loading}
              >
                {loading ? (
                   <span className="flex items-center gap-2">
                     <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                     Processing...
                   </span>
                ) : (
                  `Create ${roleLabel}`
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default StaffForm;
