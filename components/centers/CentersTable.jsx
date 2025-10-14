import Link from "next/link";
import React, { useState } from "react";

function CentersTable({ centers, role }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastCenter = currentPage * itemsPerPage;
  const indexOfFirstCenter = indexOfLastCenter - itemsPerPage;
  const currentCenters = Array.isArray(centers)
    ? centers.slice(indexOfFirstCenter, indexOfLastCenter)
    : [];
  const totalPages = Math.ceil((centers?.length || 0) / itemsPerPage);

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
                Phone
              </th>
              <th className="border-b border-border px-4 py-2 text-left">
                Location
              </th>
              <th className="border-b border-border px-4 py-2 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCenters.length > 0 ? (
              currentCenters.map((center) => (
                <tr
                  key={center.reference}
                  className="bg-card hover:bg-muted/50 transition-colors"
                >
                  <td className="border-b border-border px-4 py-2 text-black">
                    {center?.name}
                  </td>
                  <td className="border-b border-border px-4 py-2 text-black">
                    {center?.contact}
                  </td>
                  <td className="border-b border-border px-4 py-2 text-black">
                    {center?.location}
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    <Link
                      href={`/${role}/centers/${center?.center_identity}`}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border-b border-border px-4 py-2 text-center text-black bg-card"
                >
                  No centers available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {currentCenters.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-opacity-90 transition-colors"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-black"
                } hover:bg-opacity-80 transition-colors`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-opacity-90 transition-colors"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default CentersTable;
