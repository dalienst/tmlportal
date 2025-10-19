"use client";

import ManagerNavbar from "@/components/managers/Navbar";
import React from "react";

function ManagerLayout({ children }) {
  return (
    <div>
      <ManagerNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default ManagerLayout;
