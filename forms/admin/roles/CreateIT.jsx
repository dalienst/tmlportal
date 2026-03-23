"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createIT } from "@/services/accounts";

export default function CreateIT({ refetch, closeModal }) {
  return <StaffForm roleLabel="IT Staff" apiAction={createIT} refetch={refetch} closeModal={closeModal} />;
}
