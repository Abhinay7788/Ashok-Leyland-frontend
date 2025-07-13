import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/forms.css";
import "./styles/table.css";
import "./styles/login.css";
import "./styles/variables.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LeadFormPage from "./pages/LeadFormPage";
import EstimateBillPage from "./pages/EstimateBillForm";

import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 🟢 Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/lead-form"
          element={
            <PrivateRoute>
              <LeadFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/estimate-bill"
          element={
            <PrivateRoute>
              <EstimateBillPage />
            </PrivateRoute>
          }
        />

        {/* ❌ Catch-all 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;