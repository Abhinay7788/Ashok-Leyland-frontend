import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DashboardChart({ leads }) {
  const busCount = leads.filter((l) => l.category === "Bus").length;
  const truckCount = leads.filter((l) => l.category === "Truck").length;

  const data = [
    { name: "Bus", count: busCount },
    { name: "Truck", count: truckCount },
  ];

  return (
    <div style={{ width: "100%", height: 300, marginBottom: 30 }}>
      <h3 style={{ marginBottom: 10 }}>Leads Overview</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3f51b5" barSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
