"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { 
  createAdmin, 
  createAuditor, 
  createEmployee, 
  createFinance, 
  createGM, 
  createIT, 
  createManager, 
  createReservations 
} from "@/services/accounts";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CreateUser({ refetch, closeModal }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  const roleConfigs = {
    manager: { label: "Manager", action: createManager },
    employee: { label: "Employee", action: createEmployee },
    gm: { label: "General Manager", action: createGM },
    finance: { label: "Finance", action: createFinance },
    it: { label: "IT", action: createIT },
    auditor: { label: "Auditor", action: createAuditor },
    reservations: { label: "Reservations", action: createReservations },
    admin: { label: "Admin", action: createAdmin },
  };

  return (
    <Formik
      initialValues={{
        name: "",
        username: "",
        email: "",
        password: "",
        role: "employee",
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          const { role, ...payload } = values;
          const apiAction = roleConfigs[role]?.action;
          
          if (!apiAction) {
            throw new Error("Invalid role selected");
          }

          await apiAction(payload, axios);
          toast.success(`${roleConfigs[role].label} created successfully!`);
          if (refetch) refetch();
          closeModal();
        } catch (error) {
          console.error("Create user error:", error);
          toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
               <Image
                src="/logo.png"
                alt="Tamarind Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create New User
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new staff member to the platform
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select
                value={values.role}
                onValueChange={(val) => setFieldValue("role", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                className="flex-1 hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                   <span className="flex items-center gap-2">
                     <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                     Processing...
                   </span>
                ) : (
                  "Create Staff Member"
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateUser;
