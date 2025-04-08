import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await axiosInstance.get("listings/my/");
        setListings(res.data);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError("You must be logged in to view your listings.");
      }
    };

    fetchMyListings();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        My Listings
      </h2>

      {error && <p className="text-center text-red-500">{error}</p>}

      {!error && listings.length === 0 ? (
        <p className="text-center text-gray-500">You have no listings yet.</p>
      ) : (
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
              <p className="text-sm text-gray-500 mb-2">{listing.city}</p>
              <p className="font-bold text-purple-600">€{listing.price}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Link
                  to={`/listings/${listing.id}/update`}
                  className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </Link>
                <Link
                  to={`/listings/${listing.id}/delete`}
                  className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </Link>
                <Link
                  to={`/listings/${listing.id}`}
                  className="text-white bg-gray-500 px-3 py-1 rounded hover:bg-gray-600 text-sm"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyListings;
