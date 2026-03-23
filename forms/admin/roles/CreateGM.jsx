"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createGM } from "@/services/accounts";

export default function CreateGM({ refetch, closeModal }) {
  return <StaffForm roleLabel="General Manager" apiAction={createGM} refetch={refetch} closeModal={closeModal} />;
}
