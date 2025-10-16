"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../general/useAxiosAuth";
import { getCreditNote, getCreditNotes } from "@/services/creditnotes";

export function useFetchCreditNotes() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["creditnotes"],
    queryFn: () => getCreditNotes(token),
  });
}

export function useFetchCreditNote(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["creditnote", reference],
    queryFn: () => getCreditNote(reference, token),
    enabled: !!reference,
  });
}
