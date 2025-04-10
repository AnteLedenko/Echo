import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";

const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const CategoryListings = () => {
  const { slug } = useParams();
  const [listings, setListings] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axiosInstance.get(`categories/${slug}/`, {params: { page: currentPage },});
        setListings(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 12)); 

        if (res.data.results.length > 0) {
          setCategoryName(`${res.data.results[0].category_name_display}`);
        } else {
          setCategoryName(slug.replace(/_/g, " "));
        }
      } catch (err) {
        console.error("Failed to load category listings:", err);
        setError("Could not fetch listings for this category.");
      }
    };

    fetchListings();
  }, [slug, currentPage]);

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
              <p className="text-sm text-gray-500">{listing.city}</p>
              <p className="font-bold text-purple-600">€{listing.price}</p>

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

export default CategoryListings;
