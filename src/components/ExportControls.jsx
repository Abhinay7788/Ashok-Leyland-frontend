import { useState } from "react";

export default function ExportControls({ onFilter }) {
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleExport = () => {
    onFilter({ type, from, to });
  };

  return (
    <div className="export-controls">
      <select onChange={e => setType(e.target.value)} value={type}>
        <option value="">All Types</option>
        <option value="bus">Bus</option>
        <option value="truck">Truck</option>
      </select>
      <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
      <input type="date" value={to} onChange={e => setTo(e.target.value)} />
      <button onClick={handleExport}>Export Excel</button>
    </div>
  );
}