"use client";

import { apiActions, apiMultipartActions } from "@/tools/api";

export const createCreditNote = async (formData, token) => {
  await apiMultipartActions?.post("/api/v1/creditnotes/", formData, token);
};

export const getCreditNotes = async (token) => {
  const response = await apiActions?.get("/api/v1/creditnotes/", token);
  return response?.data?.results || [];
};

export const getCreditNote = async (reference, token) => {
  const response = await apiActions?.get(`/api/v1/creditnotes/${reference}/`, token);
  return response?.data || {};
};

export const updateCreditNote = async (reference, formData, token) => {
  await apiMultipartActions?.patch(
    `/api/v1/creditnotes/${reference}/`,
    formData,
    token
  );
};
