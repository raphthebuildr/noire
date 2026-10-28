"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

const initialState: AuthState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label htmlFor="login-email" className="label mb-2 block text-[10px]">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 w-full border border-line bg-canvas px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="login-password" className="label text-[10px]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] text-muted underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 w-full border border-line bg-canvas px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink"
          placeholder="Your password"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="label flex h-12 w-full items-center justify-center gap-2 bg-ink px-6 text-[11px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in" : "Sign in"}
        <ArrowRightIcon className="h-4 w-4" />
      </button>

      <p
        aria-live="polite"
        className={cn(
          "min-h-[20px] text-sm",
          state.error ? "text-oxblood" : "text-muted",
        )}
      >
        {state.error}
      </p>
    </form>
  );
}
