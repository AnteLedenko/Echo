import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../utils/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("You're not logged in. Please login to view your profile.");
        return;
      }

      try {
        const res = await axiosInstance.get("users/profile/");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please login again.");
      }
    };

    fetchProfile();
  }, []);

  if (error)
    return (
      <Layout>
        <div className="text-red-500 text-center mt-10">{error}</div>
        <div className="text-center mt-4">
          <Link to="/auth/login" className="text-purple-600 underline">
            Go to Login
          </Link>
        </div>
      </Layout>
    );

  if (!user)
    return (
      <Layout>
        <div className="text-center mt-10 text-gray-600">Loading profile...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start min-h-screen pt-24 px-4 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col items-center border">
          {user.profile_picture ? (
            <img
              src={`${CLOUDINARY_BASE}/${user.profile_picture}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          <h2 className="text-xl font-bold text-purple-700 mb-1">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-sm text-gray-600 mb-1">{user.email}</p>
          <p className="text-sm text-gray-500 mb-2">
            Joined on {new Date(user.date_joined).toLocaleDateString()}
          </p>

          <Link
            to="/reset-password"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition mb-1"
            >
            Reset Password
          </Link>
          <Link
            to="/auth/profile/update"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Edit Profile
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-3 border">
          <Link
            to="/listings/create"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center"
          >
            ➕ Create New Listing
          </Link>
          <Link
            to="/listings/my"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center"
          >
            📂 My Listings
          </Link>
          <Link
            to="/listings/saved"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center"
          >
            ⭐ Saved Listings
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

