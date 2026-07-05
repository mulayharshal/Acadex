import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ================= Request Interceptor =================

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

// ================= Response Interceptor =================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      const token = localStorage.getItem("token");

      // Only logout if the user was actually logged in
      if (token) {

        localStorage.removeItem("token");

        // Remove any other stored user data if present
        localStorage.removeItem("user");

        alert("Your session has expired. Please login again.");

        window.location.replace("/login");

      }

    }

    return Promise.reject(error);

  }

);

export default api;