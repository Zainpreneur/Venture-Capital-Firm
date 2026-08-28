"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deals", label: "Deals" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/funds", label: "Funds" },
  { href: "/investors", label: "LPs" },
  { href: "/contacts", label: "Contacts" },
  { href: "/tasks", label: "Tasks" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-ink-100 bg-white px-3 py-2 lg:hidden">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
              active ? "bg-ink-900 text-white" : "text-ink-500 hover:bg-ink-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
