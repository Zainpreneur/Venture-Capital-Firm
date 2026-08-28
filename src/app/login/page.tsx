import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl2 bg-gold-400 font-display text-xl font-bold text-ink-950">
            M
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Meridian Peak Ventures</h1>
          <p className="mt-1 text-sm text-ink-300">Firm operating platform</p>
        </div>
        <div className="card p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-ink-400">
          Deal flow · Portfolio · Funds · LP relations
        </p>
      </div>
    </div>
  );
}
