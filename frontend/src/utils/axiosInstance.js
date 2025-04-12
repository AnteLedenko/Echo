import axios from "axios";

// Create an Axios instance with the backend base URL from env
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Attach access token to every request if available

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(" Axios attached token:", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access token by attempting to refresh it
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/users/token/refresh/`,
            { refresh: localStorage.getItem("refresh") },
            { headers: { "Content-Type": "application/json" } }
        );          

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        
        // Retry the original request with new access token
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
