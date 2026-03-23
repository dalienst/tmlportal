"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { Field, Form, Formik, ErrorMessage } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import * as Yup from "yup";
import { PasswordSchema } from "@/validations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: PasswordSchema,
});

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
      validationSchema={validationSchema}
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
      {({ errors, touched }) => (
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
                className={cn("bg-muted/30", errors.name && touched.name && "border-destructive")}
              />
              <ErrorMessage name="name" component="p" className="text-xs text-destructive font-medium" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Field
                as={Input}
                type="text"
                id="username"
                name="username"
                placeholder="e.g. johndoe"
                className={cn("bg-muted/30", errors.username && touched.username && "border-destructive")}
              />
              <ErrorMessage name="username" component="p" className="text-xs text-destructive font-medium" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Field
                as={Input}
                type="email"
                id="email"
                name="email"
                placeholder="e.g. john@tamarind.co.ke"
                className={cn("bg-muted/30", errors.email && touched.email && "border-destructive")}
              />
              <ErrorMessage name="email" component="p" className="text-xs text-destructive font-medium" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Field
                as={Input}
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className={cn("bg-muted/30", errors.password && touched.password && "border-destructive")}
              />
              <ErrorMessage name="password" component="p" className="text-xs text-destructive font-medium max-w-[300px]" />
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
