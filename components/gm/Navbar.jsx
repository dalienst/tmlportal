"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid, Building2 } from "lucide-react";

function GMNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/gm", icon: LayoutGrid },
    { label: "Centers", href: "/gm/centers", icon: Building2 },
  ];

  return (
    <Navbar 
      brand="TML | GM" 
      subtitle="General Manager Portal" 
      navItems={navItems} 
      homeHref="/gm"
      logoutCallback="/"
    />
  );
}

export default GMNavbar;
