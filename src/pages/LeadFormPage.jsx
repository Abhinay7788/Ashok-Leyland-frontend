import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeadFormPage = () => {
  const navigate = useNavigate();

  /* ---------------- state ---------------- */
  const [formData, setFormData] = useState({
    type: "bus",
    leadScore: 50,
    location: "",
    /* contact */
    vehicleInCharge: "",
    phone: "",
    email: "",
    businessName: "",
    /* bus specific */
    schoolName: "",
    collegeName: "",
    mileage: "",
    route: "",
    busSeats: "",
    numberOfBuses: "",
    schoolStrength: "",
    financierDetails: "",
    existingVehicleModel: "",
    existingVehicleStrength: "",
    existingVehicleWeakness: "",
    challenges: "",
    /* truck specific */
    truckCount: "",
    goodsType: "",
    requirement: "",
  });

  /* ---------------- handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized. Please log in again.");

    try {
      /* ---- send to backend ---- */
      await axios.post("${process.env.REACT_APP_API_URL}/api/lead", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      /* ---- WhatsApp message ---- */
      const name = formData.contactPerson || "there";
      const brochureUrl =
        formData.type === "bus"
          ? "https://yourdomain.com/brochures/mitra.pdf"
          : "https://yourdomain.com/brochures/truck.pdf";

      const message =
        formData.type === "bus"
          ? `🚌 MiTR School Bus Inquiry Received

Hello ${name},

We are delighted to introduce the *MiTR School Bus* from *Ashok Leyland*, a trusted name in commercial vehicles across India.

✅ Ergonomic seating  
✅ Superior visibility  
✅ Fuel efficiency  
✅ Easy maintenance  

MiTR is already used in schools nationwide. We'd be pleased to arrange a demo at your convenience.

Warm regards,  
Bhagavathi Rao  
Ashok Leyland / Lakshmi Motors  
📞 9492113571  
📎 Brochure: ${brochureUrl}`
          : `🚚 Ashok Leyland Truck Inquiry Received

Hello ${name},

We're proud to introduce the Ashok Leyland range of trucks.

✅ Powerful engines  
✅ Trusted by fleets like Patanjali  
✅ Easy to maintain  
✅ Built for Indian roads  

Warm regards,  
Bhagavathi Rao  
Ashok Leyland / Lakshmi Motors  
📞 9492113571  
📎 Brochure: ${brochureUrl}`;

      if (formData.phone) {
        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/${formData.phone}?text=${encodedMsg}`, "_blank");
      }

      alert("✅ Lead submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Submission failed. Please try again.");
    }
  };

  /* ---------------- render ---------------- */
  const {
    type,
    leadScore,
    location,
    vehicleInCharge,
    phone,
    email,
    businessName,
    /* bus */
    schoolName,
    collegeName,
    mileage,
    route,
    busSeats,
    numberOfBuses,
    schoolStrength,
    financierDetails,
    existingVehicleModel,
    existingVehicleStrength,
    existingVehicleWeakness,
    challenges,
    /* truck */
    truckCount,
    goodsType,
    requirement,
  } = formData;

  return (
    <div className="container mt-4">
      <h2>Ashok Leyland Lead Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="type"
            value={type}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="bus">🚍 Bus</option>
            <option value="truck">🚚 Truck</option>
          </select>
        </div>

        {/* Common fields */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Lead Score</label>
            <input
              type="number"
              name="leadScore"
              className="form-control"
              value={leadScore}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={location}
              onChange={handleChange}
            />
          </div>
           <div className="col-md-6 mb-3">
              <label>Vehicle In-Charge</label>
              <input
                type="text"
                name="vehicleInCharge"
                className="form-control"
                value={vehicleInCharge}
                onChange={handleChange}
              />
            </div>

          
          <div className="col-md-6 mb-3">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Business Name</label>
            <input
              type="text"
              name="businessName"
              className="form-control"
              value={businessName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Bus section */}
        {type === "bus" && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>School Name</label>
              <input
                type="text"
                name="schoolName"
                className="form-control"
                value={schoolName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>College Name</label>
              <input
                type="text"
                name="collegeName"
                className="form-control"
                value={collegeName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Mileage</label>
              <input
                type="text"
                name="mileage"
                className="form-control"
                value={mileage}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Route</label>
              <input
                type="text"
                name="route"
                className="form-control"
                value={route}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Bus Seats</label>
              <input
                type="number"
                name="busSeats"
                className="form-control"
                value={busSeats}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Number of Buses</label>
              <input
                type="number"
                name="numberOfBuses"
                className="form-control"
                value={numberOfBuses}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>School Strength</label>
              <input
                type="number"
                name="schoolStrength"
                className="form-control"
                value={schoolStrength}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Financier Details</label>
              <input
                type="text"
                name="financierDetails"
                className="form-control"
                value={financierDetails}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Existing Vehicle Model</label>
              <input
                type="text"
                name="existingVehicleModel"
                className="form-control"
                value={existingVehicleModel}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Existing Vehicle Strength</label>
              <input
                type="text"
                name="existingVehicleStrength"
                className="form-control"
                value={existingVehicleStrength}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Existing Vehicle Weakness</label>
              <input
                type="text"
                name="existingVehicleWeakness"
                className="form-control"
                value={existingVehicleWeakness}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Challenges</label>
              <input
                type="text"
                name="challenges"
                className="form-control"
                value={challenges}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Truck section */}
        {type === "truck" && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Truck Count</label>
              <input
                type="number"
                name="truckCount"
                className="form-control"
                value={truckCount}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Goods Type</label>
              <input
                type="text"
                name="goodsType"
                className="form-control"
                value={goodsType}
                onChange={handleChange}
              />
            </div>
             <div className="col-md-6 mb-3">
              <label>Requirement</label>
              <input
                type="text"
                name="requirement"
                className="form-control"
                value={requirement}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* submit */}
        <button type="submit" className="btn btn-primary mt-3">
          🚀 Submit Lead
        </button>
      </form>
    </div>
  );
};

export default LeadFormPage;
