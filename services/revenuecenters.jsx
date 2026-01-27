"use client";

import { apiActions } from "@/tools/api";

export const getRevenueCenters = async (token) => {
  const response = await apiActions.get(`/api/v1/revenuecenters/`, token);
  return response.data.results || [];
};

export const getRevenueCenter = async (name, token) => {
  const response = await apiActions.get(
    `/api/v1/revenuecenters/${name}/`,
    token,
  );
  return response.data || {};
};
