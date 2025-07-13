import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("${process.env.REACT_APP_API_URL}/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Login
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default LoginPage;
