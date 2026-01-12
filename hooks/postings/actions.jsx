"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostings, getPosting } from "@/services/postings";
import useAxiosAuth from "../general/useAxiosAuth";

export function useFetchPostings() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["postings"],
    queryFn: () => getPostings(token),
    enabled: !!token,
  });
}

export function useFetchPosting(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["posting", reference],
    queryFn: () => getPosting(reference, token),
    enabled: !!reference,
  });
}
