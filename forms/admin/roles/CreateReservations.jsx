"use client";
import React from "react";
import StaffForm from "../StaffForm";
import { createReservations } from "@/services/accounts";

export default function CreateReservations({ refetch, closeModal }) {
  return <StaffForm roleLabel="Reservations" apiAction={createReservations} refetch={refetch} closeModal={closeModal} />;
}
