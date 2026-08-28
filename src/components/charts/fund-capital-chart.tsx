"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function FundCapitalChart({
  data,
}: {
  data: { name: string; committed: number; called: number; distributed: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e9f2" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#5b6d8c", fontSize: 11 }} axisLine={{ stroke: "#e4e9f2" }} tickLine={false} />
        <YAxis
          tick={{ fill: "#5b6d8c", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
        />
        <Tooltip
          formatter={(value: number) => `$${(value / 1_000_000).toFixed(1)}M`}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e4e9f2",
            fontSize: 12,
            boxShadow: "0 4px 24px -4px rgba(15,20,32,0.12)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
        <Bar dataKey="committed" name="Committed" fill="#c1cadb" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="called" name="Called" fill="#3c4d6c" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="distributed" name="Distributed" fill="#22a878" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
