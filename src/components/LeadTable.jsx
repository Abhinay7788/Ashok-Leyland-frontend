// src/components/LeadTable.jsx
import React from "react";
import { saveAs } from "file-saver";
import axios from "axios";

const LeadTable = ({ leads, fetchLeads = () => {}, resendEmail, deleteLead }) => {
  const token = localStorage.getItem("token");

  const handleResendEmail = async (id) => {
    try {
      await axios.post(`/api/lead/resend/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("📧 Email resent successfully");
    } catch (error) {
      console.error("Email resend error:", error);
      alert("Failed to resend email");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await axios.delete(`/api/lead/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("❌ Lead deleted");
      fetchLeads();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete lead");
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get("/api/lead/downloadExcel", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "AshokLeads.xlsx");
    } catch (err) {
      console.error("Excel download error:", err);
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <button onClick={downloadExcel} className="btn btn-success btn-sm">
          📥 Download Excel
        </button>
      </div>

      <table className="table table-bordered table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>School</th>
            <th>College</th>
            <th>In-Charge</th>
            <th>Phone</th>
            <th>Mileage</th>
            <th>Email</th>
            <th>Route / Goods</th>
            <th>Requirement</th>
            <th>Strength</th>
            <th>Financier</th>
            <th>Model</th>
            <th>Weakness</th>
            <th>Seats / Trucks</th>
            <th>Buses</th>
            <th>Score</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const inCharge =
              lead.vehicleInCharge || lead.contactPerson || lead.vehicleInChargeName || "-";
            const phone = lead.phone || lead.vehicleInChargePhone || "-";
            const isBus = lead.type === "bus";
            const routeOrGoods = isBus ? lead.route : lead.goodsType;
            const seatOrTruck = isBus ? lead.busSeats : lead.truckCount;

            return (
              <tr key={lead._id}>
                <td>{lead.schoolName || "-"}</td>
                <td>{lead.collegeName || "-"}</td>
                <td>{inCharge}</td>
                <td>{phone}</td>
                <td>{lead.mileage || "-"}</td>
                <td>{lead.email || "-"}</td>
                <td>{routeOrGoods || "-"}</td>
                <td>{lead.requirement || lead.additionalRequirement || "-"}</td>
                <td>{lead.schoolStrength || "-"}</td>
                <td>{lead.financierDetails || "-"}</td>
                <td>{lead.existingVehicleModel || "-"}</td>
                <td>{lead.existingVehicleWeakness || "-"}</td>
                <td>{seatOrTruck || "-"}</td>
                <td>{lead.numberOfBuses || lead.truckCount || "-"}</td>
                <td>{lead.leadScore ?? 50}</td>
                <td>{(lead.type || lead.category || "-").toUpperCase()}</td>
                <td>{lead.status || "New"}</td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      title="Resend Email"
                      onClick={() =>
                        resendEmail
                          ? resendEmail(lead._id)
                          : handleResendEmail(lead._id)
                      }
                    >
                      📧
                    </button>
                    <a
                      className="btn btn-sm btn-outline-success"
                      title="Send WhatsApp"
                      href={`https://wa.me/${phone}?text=Hello%20from%20Ashok%20Leyland`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🟢
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete Lead"
                      onClick={() =>
                        deleteLead
                          ? deleteLead(lead._id)
                          : handleDelete(lead._id)
                      }
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;