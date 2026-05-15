"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid, BarChart3 } from "lucide-react";

function ManagerNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/managers", icon: LayoutGrid },
    { label: "Reports", href: "/reports", icon: BarChart3 },
  ];

  return (
    <Navbar 
      brand="TML | Manager" 
      subtitle="Branch Management" 
      navItems={navItems} 
      homeHref="/managers"
      logoutCallback="/"
    />
  );
}

export default ManagerNavbar;
