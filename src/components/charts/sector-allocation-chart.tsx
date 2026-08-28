"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#c8912a", "#22a878", "#3c4d6c", "#d94c5f", "#8b9ab3", "#e4ad3a", "#178a63"];

export function SectorAllocationChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="48%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${(value / 1_000_000).toFixed(1)}M`, "Invested"]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e4e9f2",
            fontSize: 12,
            boxShadow: "0 4px 24px -4px rgba(15,20,32,0.12)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "#5b6d8c" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
