import ReportNavbar from "@/components/reports/ReportNavbar";
import React from "react";

function ReportLayout({ children }) {
  return (
    <div>
      <ReportNavbar />
      <div>{children}</div>
    </div>
  );
}

export default ReportLayout;
