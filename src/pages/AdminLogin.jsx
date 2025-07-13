import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input placeholder="Username" onChange={e => setCredentials({ ...credentials, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}