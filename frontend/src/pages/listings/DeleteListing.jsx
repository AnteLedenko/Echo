import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../utils/axiosInstance";

const DeleteListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isOwner, setIsOwner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const res = await axiosInstance.get(`listings/${id}/`);
        if (!res.data.is_owner) {
          setIsOwner(false);
          setError("You are not authorized to delete this listing.");
        }
      } catch (err) {
        console.error("Ownership check failed:", err);
        setError("Failed to verify ownership. Please make sure you're logged in.");
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`listings/${id}/delete/`);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-600">Loading...</div>
      </Layout>
    );
  }

  if (!isOwner) {
    return (
      <Layout>
        <div className="text-center mt-20 text-red-600 font-semibold text-lg">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white shadow-md p-6 mt-10 rounded">
        <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Delete Listing</h2>
        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to delete this listing? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteListing;
