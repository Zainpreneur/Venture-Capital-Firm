"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/deals", label: "Deal Pipeline", icon: DealsIcon },
  { href: "/portfolio", label: "Portfolio", icon: PortfolioIcon },
  { href: "/funds", label: "Funds", icon: FundsIcon },
  { href: "/investors", label: "Limited Partners", icon: InvestorsIcon },
  { href: "/contacts", label: "Contacts", icon: ContactsIcon },
  { href: "/tasks", label: "Tasks", icon: TasksIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-800/60 bg-ink-950 px-4 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400 font-display text-base font-bold text-ink-950">
          M
        </span>
        <span className="font-display text-[15px] font-semibold leading-tight text-white">
          Meridian Peak
          <span className="block text-[11px] font-sans font-normal tracking-wide text-ink-400">
            VENTURES
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-ink-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-gold-400" : "text-ink-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-xl2 bg-white/5 p-4 text-xs text-ink-300">
        <p className="font-medium text-ink-100">Fund III — Active</p>
        <p className="mt-1 text-ink-400">Investing period through 2027</p>
      </div>
    </aside>
  );
}

function iconProps(className?: string) {
  return {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function DealsIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  );
}
function PortfolioIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function FundsIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}
function InvestorsIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 20c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" />
      <path d="M16 4.5c1.66 0 3 1.46 3 3.25S17.66 11 16 11" />
      <path d="M15.5 13.75c2.9.53 5 2.98 5 6.25" />
    </svg>
  );
}
function ContactsIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M7 17c0-2 2-3.5 5-3.5s5 1.5 5 3.5" />
    </svg>
  );
}
function TasksIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M9 11l2 2 4-4" />
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
    </svg>
  );
}
