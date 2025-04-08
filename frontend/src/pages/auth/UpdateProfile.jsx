import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../utils/axiosInstance";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    profile_picture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("users/profile/");
        const { first_name, last_name, profile_picture } = res.data;

        setFormData({ first_name, last_name, profile_picture: null });

        if (profile_picture) {
          setImagePreview(`${CLOUDINARY_BASE}/${profile_picture}`);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("You're not logged in or session expired.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      const res = await axiosInstance.put("users/profile/update/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        setSuccess("Profile updated!");
        setTimeout(() => navigate("/auth/profile"), 1000);
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Something went wrong while updating.");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-purple-700">
          Update Profile
        </h2>

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-3">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required className="w-full px-4 py-2 border rounded"/>
          <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required className="w-full px-4 py-2 border rounded"/>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Profile Picture:</label>
            <input name="profile_picture" type="file" accept="image/*" onChange={handleChange} className="w-full text-sm"/>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded-full object-cover border"
              />
            )}
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProfileUpdate;
