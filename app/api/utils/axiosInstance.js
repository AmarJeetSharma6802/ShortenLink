import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // cookies bhejne ke liye
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/Controllers/refresh-token");
        sessionStorage.setItem("accessToken", data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
