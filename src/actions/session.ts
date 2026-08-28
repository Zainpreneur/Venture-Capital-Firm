import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");
  return session.user;
}

function num(v: FormDataEntryValue | null): number | undefined {
  if (v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function str(v: FormDataEntryValue | null): string | undefined {
  if (v === null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

function date(v: FormDataEntryValue | null): Date | undefined {
  const s = str(v);
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export const parse = { num, str, date };
