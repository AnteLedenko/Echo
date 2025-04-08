import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axiosInstance.post("users/logout/");
      } catch (err) {
        console.warn("Server-side logout failed:", err.response || err);
      }

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

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
