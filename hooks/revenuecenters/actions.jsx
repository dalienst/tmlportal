"use client";

import { getRevenueCenter, getRevenueCenters } from "@/services/revenuecenters";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../general/useAxiosAuth";

export function useFetchRevenueCenters() {
  const token = useAxiosAuth();
  return useQuery({
    queryKey: ["revenuecenters"],
    queryFn: () => getRevenueCenters(token),
  });
}

export function useFetchRevenueCenter(name) {
  const token = useAxiosAuth();
  return useQuery({
    queryKey: ["revenuecenter", name],
    queryFn: () => getRevenueCenter(name, token),
  });
}
