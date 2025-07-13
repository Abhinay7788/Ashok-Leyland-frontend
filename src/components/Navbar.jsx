import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Logout</Link>
      <Link to="/lead-form">Add Lead</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/estimate-bill">Estimate Bill</Link>


    </nav>
  );
}