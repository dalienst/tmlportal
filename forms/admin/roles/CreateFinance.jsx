"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createFinance } from "@/services/accounts";

export default function CreateFinance({ refetch, closeModal }) {
  return <StaffForm roleLabel="Finance" apiAction={createFinance} refetch={refetch} closeModal={closeModal} />;
}
