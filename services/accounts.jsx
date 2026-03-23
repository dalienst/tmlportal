"use client";

import { apiActions } from "@/tools/api";

export const getUser = async (userId, axios) => {
  const response = await apiActions?.get(`/api/v1/auth/${userId}/`, axios);
  return response?.data || {};
};

export const updateProfile = async (userId, formData, axios) => {
  await apiActions?.patch(`/api/v1/auth/${userId}/`, formData, axios);
};

export const getUsers = async (axios) => {
  const response = await apiActions?.get("/api/v1/auth/", axios);
  return response?.data?.results || [];
};

export const getManagers = async (axios) => {
  const response = await apiActions?.get("/api/v1/auth/managers/list/", axios);
  return response?.data?.results || [];
};

// Password
export const forgotPassword = async (values) => {
  // user enters their email
  await apiActions?.post("/api/v1/auth/password/forgot/", values);
};

export const resetPassword = async (values) => {
  // user enters their email, code, and new password
  await apiActions?.post("/api/v1/auth/password/reset/", values);
};

// Admin activities
// Values
// email
// username
// name
// password

export const createManager = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/manager/", values);
};

export const createEmployee = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/employee/", values);
};

export const createGM = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/gm/", values);
};

export const createFinance = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/finance/", values);
};

export const createIT = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/it/", values);
};

export const createAuditor = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/auditor/", values);
};

export const createReservations = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/reservations/", values);
};

export const createAdmin = async (values) => {
  await apiActions?.post("/api/v1/auth/signup/admin/", values);
};
