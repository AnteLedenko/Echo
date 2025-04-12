import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Attempt server-side logout
        await axiosInstance.post("users/logout/");
      } catch (err) {
        // If server fails to handle logout, still proceed client-side
        console.warn("Server-side logout failed:", err.response || err);
      }

      // Clear tokens from localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Redirect to login page
      navigate("/auth/login");
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="text-center mt-10 text-gray-600">
      Logging out...
    </div>
  );
};

export default Logout;
