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

    const status = error.response?.status;

    if (status === 401 || status === 403) {

      const token = localStorage.getItem("token");

      // Only trigger logout if the user was actually logged in with a token
      if (token) {

        // Clear localStorage immediately so ProtectedRoute won't allow re-entry
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Dispatch a custom event so AuthContext can update React state
        // and navigate to /login cleanly without a full page reload
        window.dispatchEvent(new CustomEvent("auth:token-expired"));

      }

    }

    return Promise.reject(error);

  }

);

export default api;