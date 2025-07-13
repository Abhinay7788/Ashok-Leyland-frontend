// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://vercel-backend-1l0u.onrender.com/api", // Render backend base URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
