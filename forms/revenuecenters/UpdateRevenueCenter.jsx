"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { updateRevenueCenter } from "@/services/revenuecenters";
import { getManagers } from "@/services/accounts";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function UpdateRevenueCenter({ closeModal, refetch, revenueCenter }) {
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const token = useAxiosAuth();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await getManagers(token);
        setManagers(data);
      } catch (error) {
        console.error("Failed to fetch managers:", error);
      }
    };
    fetchManagers();
  }, [token]);

  return (
    <Formik
      initialValues={{
        name: revenueCenter?.name || "",
        manager: revenueCenter?.manager || "",
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          // The API might expect the old name or identity in the URL
          // Based on services/revenuecenters.jsx: updateRevenueCenter(name, data, token)
          await updateRevenueCenter(revenueCenter?.name, values, token);
          toast.success("Revenue center updated successfully!");
          closeModal();
          refetch();
        } catch (error) {
          toast.error("Failed to update revenue center");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ values }) => (
        <Form className="w-full container p-4 mx-auto space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Revenue Center Name</Label>
            <Field
              as={Input}
              type="text"
              name="name"
              placeholder="e.g. Finance Center"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="manager">Assigned Manager</Label>
            <Field
              as="select"
              name="manager"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a Manager</option>
              {managers?.map((manager) => (
                <option key={manager?.email} value={manager?.email}>
                  {manager?.name} ({manager?.email})
                </option>
              ))}
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Revenue Center"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UpdateRevenueCenter;