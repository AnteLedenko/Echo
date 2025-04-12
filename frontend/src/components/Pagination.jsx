import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Don't render pagination if there's only one page
    if (totalPages <= 1) return null;

    const maxPageButtons = 5;

    // Calculate start and end range for page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    // Adjust if endPage exceeds total
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    // Generate page numbers to display
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-400 disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded ${
            page === currentPage
              ? "bg-purple-700 text-white"
              : "bg-purple-700 text-white hover:bg-purple-400"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-400 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

