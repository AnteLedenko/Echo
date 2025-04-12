import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";

const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const CategoryListings = () => {
  const { slug } = useParams(); // Get category slug from URL
  const [listings, setListings] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toggleStatus, setToggleStatus] = useState({});
  const isLoggedIn = !!localStorage.getItem("access");

  // Fetch listings by category when slug or page changes
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axiosInstance.get(`categories/${slug}/`, {params: { page: currentPage },});
        setListings(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 12));

        // Initialize toggle save status map
        const initialStatus = {};
        res.data.results.forEach((listing) => {
        initialStatus[listing.id] = listing.is_saved;
        });
        setToggleStatus(initialStatus);

        // Set display name for category
        if (res.data.results.length > 0) {
          setCategoryName(`${res.data.results[0].category_name_display}`);
        } else {
          setCategoryName(slug.replace(/_/g, " "));
        }
      } catch (err) {
        setError("Could not fetch listings for this category.");
      }
    };

    fetchListings();
  }, [slug, currentPage]);

  // Toggle save/unsave listing
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

  // Update page number
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };  

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
        {categoryName || "Category"} Listings
      </h2>

      {error && <p className="text-center text-red-500">{error}</p>}

      {listings.length === 0 && !error ? (
        <p className="text-center text-gray-500">No listings in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-4 rounded shadow">
                <div className="h-48 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
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
                <p className="font-bold text-purple-600">€{listing.price}</p>

                {/* Actions: View + Save */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                        to={`/listings/${listing.id}`}
                        className="text-sm text-white bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
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

export default CategoryListings;
