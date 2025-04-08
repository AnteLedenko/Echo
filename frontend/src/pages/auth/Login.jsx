import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/auth/profile");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const profileRes = await axios.get("http://127.0.0.1:8000/api/users/profile/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

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
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
