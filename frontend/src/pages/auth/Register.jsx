import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password1: "",
    password2: "",
    profile_picture: null,
  });

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) navigate("/auth/profile");
  }, [navigate]);

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
      const res = await axiosInstance.post("users/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    
      if (res.status === 201) {
        const loginRes = await axiosInstance.post("users/login/", {
          email: formData.email,
          password: formData.password1,
        });
      
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      
        localStorage.setItem("access", loginRes.data.access);
        localStorage.setItem("refresh", loginRes.data.refresh);
         
        console.log(" Register - access token:", loginRes.data.access);
        console.log(" Register - refresh token:", loginRes.data.refresh);
      
        const profileRes = await axiosInstance.get("users/profile/");
        localStorage.setItem("user_id", profileRes.data.id);
        localStorage.setItem("user_id", profileRes.data.id);

        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/auth/profile"), 1500);
      }
      
    } catch (err) {
      console.error("Registration failed:", err.response || err);
      const message =
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password1?.[0] ||
        "Registration failed. Please check the form.";
      setError(message);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-purple-700">Register</h2>

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-3">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded"/>
          <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required className="w-full px-4 py-2 border rounded"/>
          <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required className="w-full px-4 py-2 border rounded"/>
          <input name="password1" type="password" placeholder="Password" value={formData.password1} onChange={handleChange} required className="w-full px-4 py-2 border rounded"/>
          <input name="password2" type="password" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} required className="w-full px-4 py-2 border rounded"/>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Picture</label>
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
            Register
          </button>
        </form>
        <p className="text-sm text-purple-700 text-center mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline hover:text-purple-900">Login</Link>
        </p>
      </div>
    </Layout>
  );
};

export default Register;
