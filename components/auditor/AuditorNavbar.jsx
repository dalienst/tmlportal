"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid } from "lucide-react";

function AuditorNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/auditor", icon: LayoutGrid },
  ];

  return (
    <Navbar 
      brand="TML | Auditor" 
      subtitle="Audit & Compliance" 
      navItems={navItems} 
      homeHref="/auditor"
      logoutCallback="/"
    />
  );
}

export default AuditorNavbar;
