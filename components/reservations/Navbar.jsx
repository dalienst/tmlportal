"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid, BarChart3 } from "lucide-react";

function ReservationsNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/reservations", icon: LayoutGrid },
    { label: "Reports", href: "/reports", icon: BarChart3 },
  ];

  return (
    <Navbar 
      brand="TML | Reservations" 
      subtitle="Booking & Scheduling" 
      navItems={navItems} 
      homeHref="/reservations"
      logoutCallback="/"
    />
  );
}

export default ReservationsNavbar;
