"use client";
import { apiActions } from "@/tools/api";

export const createQuestion = async (values, axios) => {
  await apiActions?.post("/api/v1/questions/", values, axios);
};

export const updateQuestion = async (values, axios, question_identity) => {
  await apiActions?.patch(
    `/api/v1/questions/${question_identity}/`,
    values,
    axios
  );
};
