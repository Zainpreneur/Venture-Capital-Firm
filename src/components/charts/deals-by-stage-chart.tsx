"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DealsByStageChart({ data }: { data: { stage: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e9f2" vertical={false} />
        <XAxis
          dataKey="stage"
          tick={{ fill: "#5b6d8c", fontSize: 11 }}
          axisLine={{ stroke: "#e4e9f2" }}
          tickLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fill: "#5b6d8c", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "#f4f6fa" }}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e4e9f2",
            fontSize: 12,
            boxShadow: "0 4px 24px -4px rgba(15,20,32,0.12)",
          }}
        />
        <Bar dataKey="count" name="Deals" fill="#c8912a" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}
