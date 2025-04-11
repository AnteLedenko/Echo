import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axiosInstance.post("/users/password-reset-confirm/", {
        uid,
        token,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed. Link may be invalid or expired.");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Set New Password</h2>

        {success ? (
          <p className="text-green-600 text-center">
          Password reset successful!{" "}
          <Link to="/auth/login" className="underline text-purple-700 hover:text-purple-900">
            Go to login
          </Link>
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              className="w-full px-4 py-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ResetPassword;
