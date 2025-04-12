import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";


const Login = () => {
  const navigate = useNavigate();
  // Local state for form inputs, success/error messages
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // If user is already logged in, redirect to profile page
  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/auth/profile");
    }
  }, [navigate]);

  // Update form state on input change
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Authenticate user and store tokens
      const { data } = await axiosInstance.post("users/login/", formData);
  
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
        
      // Fetch and store user ID
      const profileRes = await axiosInstance.get("users/profile/");
      localStorage.setItem("user_id", profileRes.data.id);

      setSuccess("Login successful!");
      setTimeout(() => navigate("/auth/profile"), 800);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Login failed. Check your email and password.";
      setError(msg);
    }
  };
  

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-purple-700">Login</h2>

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-3">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-4 py-2 border rounded-md"/>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full px-4 py-2 border rounded-md"/>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
            Login
          </button>
        </form>
        <div className="flex justify-between text-sm text-purple-700 mt-4">
          <p>
            Don't have an account?{" "}
            <Link to="/auth/register" className="underline hover:text-purple-900">Register</Link>
          </p>
          <Link to="/auth/forgot-password" className="underline hover:text-purple-900">Forgot password?</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
