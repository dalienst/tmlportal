"use client";

import ITNavbar from "@/components/it/Navbar";
import React from "react";

function ITLayout({ children }) {
  return (
    <div>
      <ITNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default ITLayout;
