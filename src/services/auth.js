// src/services/auth.js
export const login = (token) => localStorage.setItem("token", token);
export const logout = () => localStorage.removeItem("token");
export const isAuthenticated = () => !!localStorage.getItem("token");
