import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
        const res = await axios.post("http://127.0.0.1:8000/api/users/token/refresh/", {
          refresh: localStorage.getItem("refresh"),
        });

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
