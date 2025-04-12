import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../utils/axiosInstance";


const PublicProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;
    // Fetch user by ID
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const res = await axiosInstance.get(`users/profile/${userId}/`);
            setUser(res.data);
        } catch (err) {
            setError("Could not load user profile.");
        }
        };

    fetchUser();
  }, [userId]);

  // Error state
  if (error) return <Layout><p className="text-center text-red-500 mt-10">{error}</p></Layout>;
  // Loading state
  if (!user) return <Layout><p className="text-center mt-10">Loading user profile...</p></Layout>;

  // Public profile UI
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
            <div className="w-24 h-24 rounded-full bg-purple-500 text-white mb-4 flex items-center justify-center text-2xl font-bold">
              {user.first_name?.[0] || "?"}
            </div>
          )}

          <h2 className="text-xl font-bold text-purple-700 mb-1">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-sm text-gray-600 mb-1">{user.email}</p>
          <p className="text-sm text-gray-500">
            Joined on {new Date(user.date_joined).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PublicProfile;
