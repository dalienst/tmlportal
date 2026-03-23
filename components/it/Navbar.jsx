"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid } from "lucide-react";

function ITNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/it", icon: LayoutGrid },
  ];

  return (
    <Navbar 
      brand="TML | IT" 
      subtitle="Systems Administration" 
      navItems={navItems} 
      homeHref="/it"
      logoutCallback="/"
    />
  );
}

export default ITNavbar;
