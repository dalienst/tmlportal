"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createAdmin } from "@/services/accounts";

export default function CreateAdmin({ refetch, closeModal }) {
  return <StaffForm roleLabel="Admin" apiAction={createAdmin} refetch={refetch} closeModal={closeModal} />;
}
