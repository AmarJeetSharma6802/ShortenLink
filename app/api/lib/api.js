import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // cookies bhejne ke liye
});

// ✅ Request Interceptor
api.interceptors.request.use((config) => {
  return config;
});

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar token expire ho gaya (401) aur refresh ka try nahi kiya abhi
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/refresh-token"); // new token milega
        return api(originalRequest); // same request dubara bhej do
      } catch (refreshError) {
        console.error("Refresh token expired, please login again.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
