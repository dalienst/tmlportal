"use client";

import { getFeedbackForm, getFeedbackForms, getPublicFeedbackFormDetails, getFeedbackReportsSummary } from "@/services/feedbackforms";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";

export function useFetchFeedbackForms() {
  return useQuery({
    queryKey: ["feedbackforms"],
    queryFn: () => getFeedbackForms(),
  });
}

export function useFetchFeedbackForm(form_identity, params = {}) {
  return useQuery({
    queryKey: ["feedbackforms", form_identity, params],
    queryFn: () => getFeedbackForm(form_identity, params),
    enabled: !!form_identity,
  });
}

export function useFetchPublicFeedbackFormDetails(form_identity) {
  return useQuery({
    queryKey: ["feedbackforms", form_identity],
    queryFn: () => getPublicFeedbackFormDetails(form_identity),
    enabled: !!form_identity,
  });
}

export function useFetchFeedbackReportsSummary(params = {}) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["feedbackforms-summary", params],
    queryFn: () => getFeedbackReportsSummary(params, axios),
    enabled: !!axios,
  });
}
