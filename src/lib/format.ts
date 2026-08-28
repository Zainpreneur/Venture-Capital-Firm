// Compact currency formatting is done by hand rather than via
// Intl.NumberFormat's `notation: "compact"` — that option renders
// inconsistently between Node's ICU build and browser engines (e.g. "$3.0M"
// vs "$3M" for the same input), which causes React hydration mismatches
// since these values are formatted identically on the server and client.
export function formatUsd(value: number | null | undefined, opts?: { compact?: boolean }) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  if (opts?.compact) {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    let divisor = 1;
    let suffix = "";
    if (abs >= 1_000_000_000) {
      divisor = 1_000_000_000;
      suffix = "B";
    } else if (abs >= 1_000_000) {
      divisor = 1_000_000;
      suffix = "M";
    } else if (abs >= 1_000) {
      divisor = 1_000;
      suffix = "K";
    }
    if (!suffix) {
      return `${sign}$${abs.toFixed(0)}`;
    }
    let digits = (abs / divisor).toFixed(1);
    if (digits.endsWith(".0")) digits = digits.slice(0, -2);
    return `${sign}$${digits}${suffix}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function timeAgo(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
}
