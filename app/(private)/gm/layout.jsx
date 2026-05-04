import GMNavbar from "@/components/gm/Navbar";
import React from "react";

function GMLayout({ children }) {
  return (
    <div>
      <GMNavbar />
      <div>{children}</div>
    </div>
  );
}

export default GMLayout;
