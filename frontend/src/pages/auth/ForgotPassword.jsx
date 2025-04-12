import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";


const ForgotPassword = () => {
    // State for form input, success state, and error message
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    // Handle form submission and send reset request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

    try {
      await axiosInstance.post("/users/password-reset/", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.email || "Something went wrong.");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Reset Your Password</h2>

        {sent ? (
          <p className="text-green-600 text-center">Reset link sent! Check your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required className="w-full px-4 py-2 border rounded"/>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
