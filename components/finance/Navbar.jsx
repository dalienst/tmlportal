"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid } from "lucide-react";

function FinanceNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/finance", icon: LayoutGrid },
  ];

  return (
    <Navbar 
      brand="TML | Finance" 
      subtitle="Finance Operations" 
      navItems={navItems} 
      homeHref="/finance"
      logoutCallback="/"
    />
  );
}

export default FinanceNavbar;
