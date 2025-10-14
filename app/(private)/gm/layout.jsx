import GMNavbar from "@/components/gm/Navbar";
import React from "react";

function GMLayout({ children }) {
  return (
    <div>
      <GMNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default GMLayout;
