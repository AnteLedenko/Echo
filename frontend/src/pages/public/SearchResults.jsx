import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";

const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        const res = await axiosInstance.get("/search/", {params: { query, page: currentPage },});
        setResults(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 12));
      } catch (err) {
        console.error("Search failed:", err);
        setError("Something went wrong while searching.");
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
        Search Results for: <span className="italic">{query}</span>
      </h2>

      {error && <p className="text-center text-red-500">{error}</p>}

      {!error && results.length === 0 ? (
        <p className="text-center text-gray-600">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((listing) => (
            <div key={listing.id} className="bg-white p-4 rounded shadow">
              <div className="h-48 bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
                {listing.images?.length > 0 ? (
                  <img
                    src={`${CLOUDINARY_BASE}/${listing.images[0].image}`}
                    alt={listing.title}
                    className="object-cover w-full h-full rounded"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              <h3 className="text-lg text-purple-700 font-semibold">{listing.title}</h3>
              <p className="text-purple-700 font-bold">€{listing.price}</p>
              <p className="text-sm text-gray-500">{listing.city}</p>
              <Link
                to={`/listings/${listing.id}`}
                className="inline-block mt-3 text-sm text-white bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                View Listing
              </Link>
            </div>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
};

export default SearchResults;
