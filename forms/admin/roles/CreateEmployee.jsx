"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createEmployee } from "@/services/accounts";

export default function CreateEmployee({ refetch, closeModal }) {
  return <StaffForm roleLabel="Employee" apiAction={createEmployee} refetch={refetch} closeModal={closeModal} />;
}
