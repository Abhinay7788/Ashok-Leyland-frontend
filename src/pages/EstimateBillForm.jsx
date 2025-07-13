// EstimateBillForm.jsx
"use client";
import { useState, useEffect } from "react";
import { generateEstimatePDF } from "../services/estimateApi";
import "../styles/estimateBill.css";

export default function EstimateBillForm() {
  const [form, setForm] = useState({
    irnNo: "", ackNo: "", invoiceNo: "", date: "",
    model: "", variant: "", vehicleColor: "",
    chassisNo: "", engineNo: "", panNo: "", hypothecatedTo: "",
    buyer: { name: "", address: "", gstin: "", phone: "", stateCode: "" },
    consignor: { name: "", address: "", gstin: "", phone: "", stateCode: "" },
    items: [{ particular: "", hsn: "", gst: "", qty: "", rate: "", per: "", amount: "" }],
    amountWords: "", declaration: "", signatory: ""
  });

  const [taxSummary, setTaxSummary] = useState([]);

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setForm(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.items];
    updated[index][name] = value;
    setForm(prev => ({ ...prev, items: updated }));
  };

  const addRow = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, {
        particular: "", hsn: "", gst: "", qty: "", rate: "", per: "", amount: ""
      }]
    }));
  };

  const convertToWords = (amount) => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const n = ("000000000" + amount).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
    if (!n) return "";
    let str = "";
    str += n[1] !== "00" ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
    str += n[2] !== "00" ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
    str += n[3] !== "00" ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
    str += n[4] !== "000" ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Rupees" : "";
    return str.trim() + " Only";
  };

  useEffect(() => {
    const updatedItems = form.items.map(item => {
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const gst = parseFloat(item.gst) || 0;
      const base = qty * rate;
      const tax = (base * gst) / 100;
      return { ...item, amount: (base + tax).toFixed(2) };
    });

    const summary = {};
    updatedItems.forEach(item => {
      const hsn = item.hsn || "N/A";
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const base = qty * rate;
      const gst = parseFloat(item.gst) || 0;
      const halfGst = gst / 2;
      const cgstAmt = (base * halfGst) / 100;
      const sgstAmt = (base * halfGst) / 100;

      if (!summary[hsn]) {
        summary[hsn] = {
          hsn,
          taxable: 0,
          cgst: halfGst.toFixed(2),
          cgstAmt: 0,
          sgst: halfGst.toFixed(2),
          sgstAmt: 0,
          totalTax: 0,
        };
      }

      summary[hsn].taxable += base;
      summary[hsn].cgstAmt += cgstAmt;
      summary[hsn].sgstAmt += sgstAmt;
      summary[hsn].totalTax += cgstAmt + sgstAmt;
    });

    const summaryList = Object.values(summary).map(row => ({
      ...row,
      taxable: row.taxable.toFixed(2),
      cgstAmt: row.cgstAmt.toFixed(2),
      sgstAmt: row.sgstAmt.toFixed(2),
      totalTax: row.totalTax.toFixed(2),
    }));

    const grandTotal = updatedItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    setForm(prev => ({
      ...prev,
      items: updatedItems,
      amountWords: convertToWords(grandTotal.toFixed(0))
    }));

    setTaxSummary(summaryList);
  }, [form.items]);

  return (
    <div className="estimate-bill-form">
      <h2>Invoice Generator - Lakshmi Motors (Ashok Leyland)</h2>

      <h3>Invoice Details</h3>
      {["irnNo", "ackNo", "invoiceNo", "date"].map(field => (
        <input
          key={field}
          type={field === "date" ? "date" : "text"}
          placeholder={field}
          value={form[field]}
          onChange={e => handleChange(e, null, field)}
        />
      ))}

      <h3>Vehicle Details</h3>
      {["model", "variant", "vehicleColor", "chassisNo", "engineNo", "panNo", "hypothecatedTo"].map(field => (
        <input
          key={field}
          placeholder={field}
          value={form[field]}
          onChange={e => handleChange(e, null, field)}
        />
      ))}

      <h3>Buyer (Bill To)</h3>
      {Object.entries(form.buyer).map(([key, val]) => (
        <input
          key={key}
          placeholder={key}
          value={val}
          onChange={e => handleChange(e, "buyer", key)}
        />
      ))}

      <h3>Consignor (Ship To)</h3>
      {Object.entries(form.consignor).map(([key, val]) => (
        <input
          key={key}
          placeholder={key}
          value={val}
          onChange={e => handleChange(e, "consignor", key)}
        />
      ))}

      <h3>Invoice Items</h3>
      {form.items.map((item, idx) => (
        <div key={idx} className="table-row">
          {Object.entries(item).map(([key, val]) => (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={val}
              onChange={e => handleItemChange(idx, e)}
              readOnly={key === "amount"}
            />
          ))}
        </div>
      ))}
      <button className="add-row-btn" onClick={addRow}>+ Add Row</button>

      <h3>Tax Summary</h3>
      {taxSummary.map((row, idx) => (
        <div key={idx} className="tax-summary-row">
          {["hsn", "taxable", "cgst", "cgstAmt", "sgst", "sgstAmt", "totalTax"].map(key => (
            <input key={key} placeholder={key} value={row[key]} readOnly />
          ))}
        </div>
      ))}

      <h3>Footer</h3>
      {["amountWords", "declaration", "signatory"].map(field => (
        <input
          key={field}
          placeholder={field}
          value={form[field]}
          onChange={e => handleChange(e, null, field)}
        />
      ))}

      <button className="download-btn" onClick={() => generateEstimatePDF({ ...form, taxSummary })}>
        Download PDF
      </button>
    </div>
  );
}