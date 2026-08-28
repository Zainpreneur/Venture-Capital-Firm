"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatUsd } from "@/lib/format";

export function MetricHistoryChart({
  data,
}: {
  data: { period: string; arr: number | null; revenue: number | null }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e9f2" vertical={false} />
        <XAxis dataKey="period" tick={{ fill: "#5b6d8c", fontSize: 11 }} axisLine={{ stroke: "#e4e9f2" }} tickLine={false} />
        <YAxis
          tick={{ fill: "#5b6d8c", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatUsd(v, { compact: true })}
        />
        <Tooltip
          formatter={(value: number) => formatUsd(value)}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e4e9f2",
            fontSize: 12,
            boxShadow: "0 4px 24px -4px rgba(15,20,32,0.12)",
          }}
        />
        <Line type="monotone" dataKey="arr" name="ARR" stroke="#c8912a" strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3c4d6c" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
