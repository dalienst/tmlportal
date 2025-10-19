"use client";

import { useParams } from "next/navigation";
import React from "react";

function ApprovalRequestDetail() {
  const { identity } = useParams();
  return <div>ApprovalRequestDetail</div>;
}

export default ApprovalRequestDetail;
