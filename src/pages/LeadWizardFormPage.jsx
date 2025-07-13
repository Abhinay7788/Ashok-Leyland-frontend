import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function LeadWizardFormPage() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("bus");
  const [form, setForm] = useState({});
  const [location, setLocation] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
    });
  }, []);

  useEffect(() => {
    const fetchSuggestion = async () => {
      const body = {
        type,
        location,
      };

      if (type === "bus" && form.schoolName) {
        body.schoolName = form.schoolName;
        body.strength = form.strength;
      }

      if (type === "truck" && form.businessName) {
        body.businessName = form.businessName;
        body.goodsType = form.goodsType;
      }

      try {
        const res = await api.post("/llm/suggest", body);
        setForm((prev) => ({
          ...prev,
          route: prev.route || res.data.route,
          seats: prev.seats || res.data.seats,
          modelSuggested: res.data.model,
        }));
      } catch (err) {
        console.error("LLM suggest failed", err);
      }
    };

    fetchSuggestion();
  }, [form.schoolName, form.businessName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/upload", formData);
      setForm((prev) => ({ ...prev, brochureFile: res.data.filename }));
    } catch (err) {
      alert("Upload failed");
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const isEmpty = (field) => !form[field] || form[field].trim() === "";

    const step1Fields = ["schoolName", "vehicleInChargePhone", "email"];
    const step2Fields = ["numBuses", "route", "mileage"];
    const truckFields = ["businessName", "phone", "email", "truckCount"];

    const fieldsToValidate =
      type === "truck"
        ? truckFields
        : step === 2
        ? step1Fields
        : step === 3
        ? step2Fields
        : [];

    fieldsToValidate.forEach((field) => {
      if (isEmpty(field)) newErrors[field] = "Required";
    });

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    const phoneField = type === "bus" ? "vehicleInChargePhone" : "phone";
    if (form[phoneField] && form[phoneField].length < 10) {
      newErrors[phoneField] = "Enter a valid 10-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      await api.post("/lead", {
        type,
        formData: form,
        location,
      });
      alert("Lead submitted successfully");
      setForm({});
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  const handleAcceptSuggestion = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div>
          <label>Vehicle Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="bus">🚍 Bus</option>
            <option value="truck">🚚 Truck</option>
          </select>
        </div>
      );
    }

    if (type === "bus") {
      if (step === 2) {
        return (
          <>
            <label>School Name</label>
            <input name="schoolName" value={form.schoolName || ""} onChange={handleChange} />
            {errors.schoolName && <p className="error">{errors.schoolName}</p>}

            <label>Phone</label>
            <input name="vehicleInChargePhone" value={form.vehicleInChargePhone || ""} onChange={handleChange} />
            {errors.vehicleInChargePhone && <p className="error">{errors.vehicleInChargePhone}</p>}

            <label>Email</label>
            <input name="email" value={form.email || ""} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </>
        );
      }

      if (step === 3) {
        return (
          <>
            <label>Number of Buses</label>
            <input name="numBuses" value={form.numBuses || ""} onChange={handleChange} />
            {errors.numBuses && <p className="error">{errors.numBuses}</p>}

            <label>Route</label>
            <input name="route" value={form.route || ""} onChange={handleChange} />
            {errors.route && <p className="error">{errors.route}</p>}
            {form.route && form.modelSuggested && (
              <button type="button" onClick={() => handleAcceptSuggestion("route", form.route)}>Accept Route Suggestion</button>
            )}

            <label>Mileage</label>
            <input name="mileage" value={form.mileage || ""} onChange={handleChange} />
            {errors.mileage && <p className="error">{errors.mileage}</p>}

            {form.modelSuggested && (
              <p style={{ fontSize: "0.8rem", color: "gray" }}>
                Suggested Model: {form.modelSuggested}
              </p>
            )}
            {form.modelSuggested && (
              <button
                type="button"
                onClick={() => handleAcceptSuggestion("vehicleModel", form.modelSuggested)}
              >
                Accept Model Suggestion
              </button>
            )}

            <label>Attach Brochure (PDF/JPG)</label>
            <input type="file" onChange={handleFileUpload} />
          </>
        );
      }
    }

    if (type === "truck" && step === 2) {
      return (
        <>
          <label>Business Name</label>
          <input name="businessName" value={form.businessName || ""} onChange={handleChange} />
          {errors.businessName && <p className="error">{errors.businessName}</p>}

          <label>Phone</label>
          <input name="phone" value={form.phone || ""} onChange={handleChange} />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label>Email</label>
          <input name="email" value={form.email || ""} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Truck Count</label>
          <input name="truckCount" value={form.truckCount || ""} onChange={handleChange} />
          {errors.truckCount && <p className="error">{errors.truckCount}</p>}

          {form.modelSuggested && (
            <div>
              <p style={{ fontSize: "0.8rem", color: "gray" }}>
                Suggested Truck Model: {form.modelSuggested}
              </p>
              <button
                type="button"
                onClick={() => handleAcceptSuggestion("vehicleModel", form.modelSuggested)}
              >
                Accept Truck Model Suggestion
              </button>
            </div>
          )}

          <label>Attach Brochure (PDF/JPG)</label>
          <input type="file" onChange={handleFileUpload} />
        </>
      );
    }

    return null;
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Lead Capture Wizard</h2>
      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div style={{ marginTop: "20px" }}>
          {step > 1 && (
            <button type="button" onClick={handleBack}>
              ⬅ Back
            </button>
          )}
          {step < (type === "bus" ? 3 : 2) ? (
            <button type="button" onClick={handleNext}>
              Next ➡
            </button>
          ) : (
            <button type="submit">Submit ✅</button>
          )}
        </div>
      </form>
    </div>
  );
}
