import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [toggleStatus, setToggleStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;
  const isLoggedIn = !!localStorage.getItem("access");

  useEffect(() => {
    axiosInstance.get("/", { params: { page: currentPage } })
      .then((res) => {
        setListings(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 12)); 
        const initialStatus = {};
        res.data.results.forEach((listing) => {
          initialStatus[listing.id] = listing.is_saved;
        });
        setToggleStatus(initialStatus);
      })
      .catch((err) => console.error("Failed to fetch listings", err));
  }, [currentPage]);

  const handleToggleSave = async (id) => {
    try {
      await axiosInstance.post(`listings/${id}/toggle-save/`);
      setToggleStatus((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (err) {
      console.error("Toggle save failed:", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };  

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Latest Listings
      </h2>

      {listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings available yet.</p>
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

              <h3 className="text-lg text-purple-700 font-semibold">{listing.title}</h3>
              <p className="text-purple-700 font-bold">€{listing.price}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Link
                  to={`/listings/${listing.id}`}
                  className="bg-purple-600 text-white text-sm px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  View Listing
                </Link>

                {isLoggedIn && !listing.is_owner && (
                  <button
                    onClick={() => handleToggleSave(listing.id)}
                    className={`text-sm px-4 py-2 rounded transition ${
                      toggleStatus[listing.id]
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {toggleStatus[listing.id] ? "★ Saved" : "☆ Save"}
                  </button>
                )}
              </div>
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

export default Home;

