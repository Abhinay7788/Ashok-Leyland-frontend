import axios from "axios";

const BASE_URL = "https://vercel-backend-1l0u.onrender.com/api/estimatebill";

export const generateEstimatePDF = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/pdf`, data, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  } catch (err) {
    console.error("Failed to generate estimate PDF:", err);
    alert("PDF generation failed. Please try again.");
  }
};
