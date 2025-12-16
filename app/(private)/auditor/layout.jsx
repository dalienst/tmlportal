"use client";

import AuditorNavbar from "@/components/auditor/AuditorNavbar";
import React from "react";

function AuditorLayout({ children }) {
  return (
    <div>
      <AuditorNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default AuditorLayout;
