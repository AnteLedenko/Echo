import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const SavedListings = () => {
  const [savedListings, setSavedListings] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axiosInstance.get("listings/saved/", {
          params: { page: currentPage },
        });
        setSavedListings(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 12));
      } catch (err) {
        console.error("Failed to fetch saved listings", err);
        setError("You must be logged in to view saved listings.");
      }
    };

    fetchSaved();
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
        Saved Listings
      </h2>

      {error && <p className="text-center text-red-500">{error}</p>}

      {!error && savedListings.length === 0 ? (
        <p className="text-center text-gray-500">No saved listings yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
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

                <h3 className="text-lg font-semibold text-purple-700">{listing.title}</h3>
                <p className="text-purple-700 font-bold">€{listing.price}</p>

                <Link
                  to={`/listings/${listing.id}`}
                  className="inline-block mt-3 text-sm text-white bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  View Listing
                </Link>
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

export default SavedListings;
