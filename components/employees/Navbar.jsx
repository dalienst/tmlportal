"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid } from "lucide-react";

function EmployeeNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/employees", icon: LayoutGrid },
  ];

  return (
    <Navbar 
      brand="TML | Staff" 
      subtitle="Employee Portal" 
      navItems={navItems} 
      homeHref="/employees"
      logoutCallback="/"
    />
  );
}

export default EmployeeNavbar;
