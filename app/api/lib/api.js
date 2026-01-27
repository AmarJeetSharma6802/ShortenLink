import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, 
});


api.interceptors.request.use((config) => {
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/refresh-token"); 
        return api(originalRequest); 
      } catch (refreshError) {
        console.error("Refresh token expired, please login again.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
