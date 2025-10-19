"use client";

import {
  getApprovalRequest,
  getApprovalRequests,
} from "@/services/approvalrequests";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../general/useAxiosAuth";

export function useFetchApprovalRequests() {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["approvalRequests"],
    queryFn: () => getApprovalRequests(axios),
  });
}

export function useFetchApprovalRequest(identity) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["approvalRequest", identity],
    queryFn: () => getApprovalRequest( identity, axios),
    enabled: !!identity,
  });
}
