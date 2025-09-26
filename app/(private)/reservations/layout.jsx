import ReservationsNavbar from "@/components/reservations/Navbar";
import React from "react";

function ReservationsLayout({ children }) {
  return (
    <div>
      <ReservationsNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default ReservationsLayout;
