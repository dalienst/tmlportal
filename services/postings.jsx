"use client";

import { apiActions, apiMultipartActions } from "@/tools/api";

export const createPosting = async (formData, token) => {
  await apiMultipartActions?.post("/api/v1/postings/", formData, token);
};

export const getPostings = async (token) => {
  const response = await apiActions?.get("/api/v1/postings/", token);
  return response?.data?.results || [];
};

export const getPosting = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/postings/${reference}/`,
    token
  );
  return response?.data || {};
};

export const updatePosting = async (reference, formData, token) => {
  await apiMultipartActions?.patch(
    `/api/v1/postings/${reference}/`,
    formData,
    token
  );
};

export const resolvePosting = async (reference, values, token) => {
  await apiActions?.patch(`/api/v1/postings/${reference}/`, values, token);
};
