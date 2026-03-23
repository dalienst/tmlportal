"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createManager } from "@/services/accounts";

export default function CreateManager({ refetch, closeModal }) {
  return <StaffForm roleLabel="Manager" apiAction={createManager} refetch={refetch} closeModal={closeModal} />;
}
