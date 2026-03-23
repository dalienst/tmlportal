"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid } from "lucide-react";

function ManagerNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/managers", icon: LayoutGrid },
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
