"use client";

import React from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid } from "lucide-react";

function ReservationsNavbar() {
  const navItems = [
    { label: "Dashboard", href: "/reservations", icon: LayoutGrid },
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
