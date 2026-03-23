import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

function RevenueCentersTable({ revenueCenters, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(revenueCenters)
    ? revenueCenters.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil((revenueCenters?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border rounded-lg border-border">
          <thead>
            <tr className="bg-muted text-black font-semibold text-sm">
              <th className="border-b border-border px-4 py-2 text-left">
                Name
              </th>
              <th className="border-b border-border px-4 py-2 text-left">
                Manager
              </th>
              <th className="border-b border-border px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((center) => (
                <tr
                  key={center.name}
                  className="bg-card hover:bg-muted/50 transition-colors"
                >
                  <td className="border-b border-border px-4 py-3 text-black font-medium">
                    {center?.name}
                  </td>
                  <td className="border-b border-border px-4 py-3 text-black">
                    {center?.manager}
                  </td>
                  <td className="border-b border-border px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(center)}
                      className="inline-flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border-b border-border px-4 py-10 text-center text-muted-foreground bg-card"
                >
                  No revenue centers available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {currentItems.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex gap-2 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}

export default RevenueCentersTable;
