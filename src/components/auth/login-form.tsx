"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/ui/icons";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

const initialState: AuthState = {};

const fieldClass =
  "h-12 w-full border border-line bg-canvas px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label htmlFor="login-email" className="label mb-2 block text-[10px]">
          Email address <span aria-hidden="true">*</span>
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="login-password" className="label text-[10px]">
            Password <span aria-hidden="true">*</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] text-muted underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className={`${fieldClass} pr-12`}
            placeholder="Your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-xs text-muted">
        <input
          type="checkbox"
          name="remember"
          className="h-3.5 w-3.5 accent-ink"
        />
        Remember this device
      </label>

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
