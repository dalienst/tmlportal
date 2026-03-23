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

export const createRevenueCenter = async (data, token) => {
  const response = await apiActions.post(
    `/api/v1/revenuecenters/`,
    data,
    token,
  );
  return response.data || {};
};

export const updateRevenueCenter = async (name, data, token) => {
  const response = await apiActions.put(
    `/api/v1/revenuecenters/${name}/`,
    data,
    token,
  );
  return response.data || {};
};
