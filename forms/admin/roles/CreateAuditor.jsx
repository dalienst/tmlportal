"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createAuditor } from "@/services/accounts";

export default function CreateAuditor({ refetch, closeModal }) {
  return <StaffForm roleLabel="Auditor" apiAction={createAuditor} refetch={refetch} closeModal={closeModal} />;
}
