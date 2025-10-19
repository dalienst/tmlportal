"use client";

import FinanceNavbar from "@/components/finance/Navbar";
import React from "react";

function FinanceLayout({ children }) {
  return (
    <div>
      <FinanceNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default FinanceLayout;
