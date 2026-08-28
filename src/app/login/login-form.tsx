"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const DEMO_ACCOUNTS = [
  { email: "avery.kwan@meridianpeak.vc", role: "Managing Partner" },
  { email: "noah.feldman@meridianpeak.vc", role: "Associate" },
  { email: "priya.subramaniam@meridianpeak.vc", role: "Analyst" },
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("avery.kwan@meridianpeak.vc");
  const [password, setPassword] = useState("meridian2024");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(params.get("callbackUrl") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@meridianpeak.vc"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-gold w-full">
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <div className="rounded-lg border border-ink-100 bg-ink-50/60 p-3 text-xs text-ink-500">
        <p className="mb-1.5 font-medium text-ink-600">Demo accounts (password: meridian2024)</p>
        <ul className="space-y-1">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.email} className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="text-left text-ink-600 underline decoration-ink-200 underline-offset-2 hover:text-gold-600"
                onClick={() => setEmail(a.email)}
              >
                {a.email}
              </button>
              <span className="shrink-0 text-ink-400">{a.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
