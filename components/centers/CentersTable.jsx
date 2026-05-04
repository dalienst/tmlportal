import Link from "next/link";
import React, { useState } from "react";
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from "../ui/table";

function CentersTable({ centers, role }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
        <Table className="w-full table-auto border rounded-lg border-border">
          <TableHeader>
            <TableRow className="bg-muted text-black font-semibold text-sm">
              <TableHead className="border-b border-border px-4 py-2 text-left">
                Name
              </TableHead>
              <TableHead className="border-b border-border px-4 py-2 text-left">
                Phone
              </TableHead>
              <TableHead className="border-b border-border px-4 py-2 text-left">
                Location
              </TableHead>
              <TableHead className="border-b border-border px-4 py-2 text-left">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCenters.length > 0 ? (
              currentCenters.map((center) => (
                <TableRow
                  key={center.reference}
                  className="bg-card hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="border-b border-border px-4 py-2 text-black">
                    {center?.name}
                  </TableCell>
                  <TableCell className="border-b border-border px-4 py-2 text-black">
                    {center?.contact}
                  </TableCell>
                  <TableCell className="border-b border-border px-4 py-2 text-black">
                    {center?.location}
                  </TableCell>
                  <TableCell className="border-b border-border px-4 py-2">
                    <Link
                      href={`/${role}/centers/${center?.center_identity}`}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan="4"
                  className="border-b border-border px-4 py-2 text-center text-black bg-card"
                >
                  No centers available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
