"use client";

import { getFeedbackForm, getFeedbackForms, getPublicFeedbackFormDetails } from "@/services/feedbackforms";
import { useQuery } from "@tanstack/react-query";

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
