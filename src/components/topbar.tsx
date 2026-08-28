"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { initials } from "@/lib/format";
import { roleLabels } from "@/lib/labels";

export function Topbar({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    colorTag: string;
    title?: string;
  };
}) {
  const name = user.name ?? user.email ?? "Team member";
  const email = user.email ?? "";
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink-100 bg-white px-6">
      <div className="flex items-center gap-2 text-sm text-ink-400">
        <span className="hidden font-medium text-ink-700 sm:inline">Firm OS</span>
      </div>

      <div className="relative flex items-center gap-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 hover:bg-ink-50"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: user.colorTag }}
          >
            {initials(name)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight text-ink-800">
              {name}
            </span>
            <span className="block text-xs leading-tight text-ink-400">
              {user.title ?? roleLabels[user.role]}
            </span>
          </span>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-12 z-20 w-56 rounded-xl2 border border-ink-100 bg-white p-2 shadow-panel">
              <div className="border-b border-ink-50 px-3 py-2">
                <p className="text-sm font-medium text-ink-800">{name}</p>
                <p className="truncate text-xs text-ink-400">{email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
