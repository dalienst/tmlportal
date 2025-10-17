import EmployeeNavbar from "@/components/employees/Navbar";
import React from "react";

function EmployeeLayout({ children }) {
  return (
    <div>
      <EmployeeNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default EmployeeLayout;
