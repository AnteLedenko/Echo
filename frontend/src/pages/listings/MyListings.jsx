import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MyListings = () => {
  const [listings, setListings] = useState([]); // Listings owned by the current user
  const [error, setError] = useState(""); // Error message
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  // Fetch listings for the current user
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await axiosInstance.get("listings/my/", {
          params: { page: currentPage },
        });
        setListings(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 12));
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError("You must be logged in to view your listings.");
      }
    };

    fetchMyListings();
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        My Listings
      </h2>

      {/* Show error if API call fails */}
      {error && <p className="text-center text-red-500">{error}</p>}
 
      {/* Empty listings fallback */}
      {!error && listings.length === 0 ? (
        <p className="text-center text-gray-500">You have no listings yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white p-4 rounded shadow">
                <div className="h-48 bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
                  {listing.images.length > 0 ? (
                    <img
                      src={`${CLOUDINARY_BASE}/${listing.images[0].image}`}
                      alt={listing.title}
                      className="object-cover w-full h-full rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-purple-700">
                  {listing.title}
                </h3>
                <p className="font-bold text-purple-600">€{listing.price}</p>
 
                {/* Listing actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                        to={`/listings/${listing.id}`}
                        className="text-white bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 text-sm"
                    >
                        View
                    </Link>
                    <Link
                        to={`/listings/${listing.id}/update`}
                        className="text-white bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 text-sm"
                    >
                        Edit
                    </Link>
                    <Link
                        to={`/listings/${listing.id}/delete`}
                        className="text-white bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 text-sm"
                    >
                        Delete
                    </Link>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Layout>
  );
};

export default MyListings;
