import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // ✅ cookie send/receive
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh token call
        await axios.post("http://localhost:3000/api/Controllers/refresh-token", {}, { withCredentials: true });

        return api(originalRequest); 
      } catch (err) {
        console.error("Refresh failed", err);
        window.location.href = "/fronted/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
