// src/pages/DashboardPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DashboardChart from "../components/DashboardChart";
import FilterPanel from "../components/FilterPanel";
import LeadTable from "../components/LeadTable";

const DashboardPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    scoreMin: "",
    scoreMax: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch all leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/lead/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(response.data || []);
      setError("");
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      setError("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Filter logic
  const applyFilters = useCallback(() => {
    const { type, status, scoreMin, scoreMax, startDate, endDate } = filters;
    let result = [...leads];

    if (type !== "All") {
      result = result.filter(
        (lead) =>
          (lead.type || lead.category || "").toLowerCase() === type.toLowerCase()
      );
    }

    if (status !== "All") {
      result = result.filter((lead) => lead.status === status);
    }

    if (scoreMin) {
      result = result.filter((lead) => (lead.leadScore ?? 0) >= parseInt(scoreMin));
    }

    if (scoreMax) {
      result = result.filter((lead) => (lead.leadScore ?? 0) <= parseInt(scoreMax));
    }

    if (startDate) {
      result = result.filter(
        (lead) => new Date(lead.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      result = result.filter(
        (lead) => new Date(lead.createdAt) <= new Date(endDate + "T23:59:59")
      );
    }

    setFilteredLeads(result);
  }, [filters, leads]);

  // ✅ Resend email
  const handleResendEmail = async (id) => {
    try {
      await axios.post(`/api/lead/resend/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("📧 Email resent successfully!");
    } catch (err) {
      console.error("Resend email error:", err);
      alert("Failed to resend email.");
    }
  };

  // ✅ Delete lead
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await axios.delete(`/api/lead/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Lead deleted successfully!");
      fetchLeads();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete lead.");
    }
  };

  // ✅ Download Excel with filters
  const handleExcelDownload = async () => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(
        `/api/lead/download/excel?${queryParams.toString()}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "leads.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("❌ Error downloading Excel:", err);
      alert("Failed to download Excel file.");
    }
  };

  // ✅ Hooks
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // ✅ Render
  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <div className="container py-4">
        <h2 className="mb-4">📊 Ashok Leyland CRM Dashboard</h2>

        {loading && <p>⏳ Loading leads...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onDownload={handleExcelDownload}
            />

            <DashboardChart leads={filteredLeads} />

            <LeadTable
              leads={filteredLeads}
              fetchLeads={fetchLeads}
              resendEmail={handleResendEmail}
              deleteLead={handleDelete}
            />

            {filteredLeads.length === 0 && (
              <p className="text-muted">No leads match your filters.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;