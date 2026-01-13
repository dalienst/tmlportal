import GMNavbar from "@/components/gm/Navbar";
import React from "react";

function GeneralManagerLayout({ children }) {
  return (
    <div>
      <GMNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default GeneralManagerLayout;
