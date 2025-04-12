import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../utils/axiosInstance";
import Map from "../../components/Map";

// Swiper for image slider
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ListingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // State to hold listing data and error state
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  const isAuthenticated = !!localStorage.getItem("access");
  const senderId = localStorage.getItem("user_id");

  // Fetch listing by ID
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axiosInstance.get(`listings/${id}/`);
        setListing(res.data);
      } catch (err) {
        console.error("Failed to load listing", err);
        setError("Could not load listing.");
      }
    };

    fetchListing();
  }, [id]);

  // Handle sending initial message to the seller and start chat
  const handleMessageClick = async (receiverId) => {
    try {
      const res = await axiosInstance.post("chat/send/", {
        recipient_id: receiverId,
        listing_id: listing.id, 
        content: "👋 Hello! I'm interested in your listing.",
      });

      console.log("Chat started:", res.data); 
      navigate(`/chat/${res.data.chat_id}`);
    } catch (err) {
      console.error("Failed to start chat:", err.response?.data || err.message);
    }
  };

  // Toggle saved state
  const handleToggleSave = async () => {
    try {
      const res = await axiosInstance.post(`listings/${listing.id}/toggle-save/`);
      setListing((prev) => ({
        ...prev,
        is_saved: res.data.saved,
      }));
    } catch (err) {
      alert("Could not update saved status.");
    }
  };

  // Loading and error states
  if (error) return <Layout><p className="text-center text-red-500 mt-6">{error}</p></Layout>;
  if (!listing) return <Layout><p className="text-center mt-6">Loading listing...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6 mt-6">
        <h2 className="text-3xl font-bold text-purple-700">{listing.title}</h2>

      {/* Image Gallery */}
      {listing.images.length > 0 ? (
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="w-full max-h-[500px] rounded">
            {listing.images.map((img) => (
              <SwiperSlide key={img.id}>
                <img
                  src={`${CLOUDINARY_BASE}/${img.image}`}
                  alt="Listing"
                  className="w-full max-h-[500px] object-contain rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">No images available.</p>
        )}

        {/* Listing Details */}
        <div className="space-y-2 text-gray-700 text-lg">
          <p><strong>Price:</strong> €{listing.price}</p>
          <p><strong>City:</strong> {listing.city}</p>
          <p><strong>Address:</strong> {listing.address}, {listing.county} {listing.postal_code}</p>
          <p><strong>Description:</strong> {listing.description}</p>
          <p className="text-sm text-gray-500">
            Listed by{" "}
            <Link
              to={`/auth/profile/${listing.user_id}`}
              className="font-medium text-gray-700 hover:underline"
            >
              {listing.user_first_name} {listing.user_last_name}
            </Link>
          </p>
        </div>

        {/* Google Map */}
        {listing.latitude && listing.longitude && (
          <div className="mt-4 h-64 w-full rounded overflow-hidden">
            <Map lat={listing.latitude} lng={listing.longitude} />
          </div>
        )}

        {/* Buttons for users save, message */}
        {isAuthenticated && !listing.is_owner && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleToggleSave}
            className={`px-4 py-2 rounded transition text-white ${
              listing.is_saved ? "bg-yellow-500 hover:bg-yellow-600" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {listing.is_saved ? "★ Saved" : "☆ Save"}
          </button>

          <button
            onClick={() => handleMessageClick(listing.user_id)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
          >
            💬 Message Seller
          </button>
        </div>
        )}

        {/* Buttons for owner (edit, delete) */}
        {listing.is_owner && (
        <div className="flex gap-4 mt-6">
          <Link
            to={`/listings/${listing.id}/update`}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Edit
          </Link>
          <Link
            to={`/listings/${listing.id}/delete`}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Delete
          </Link>
        </div>
        )}
      </div>
    </Layout>
  );
};

export default ListingDetail;
