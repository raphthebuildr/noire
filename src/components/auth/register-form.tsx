"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/ui/icons";
import { registerAction, type AuthState } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

const initialState: AuthState = {};

const fieldClass =
  "h-12 w-full border border-line bg-canvas px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (state.success) {
    return (
      <div>
        <p className="text-sm leading-relaxed text-muted">{state.success}</p>
        <Link
          href="/login"
          className="label mt-6 inline-flex h-12 items-center justify-center gap-2 bg-ink px-6 text-[11px] text-canvas transition-opacity hover:opacity-90"
        >
          Go to sign in
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="register-name" className="label mb-2 block text-[10px]">
          Full name <span aria-hidden="true">*</span>
        </label>
        <input
          id="register-name"
          name="fullName"
          required
          autoComplete="name"
          className={fieldClass}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="label mb-2 block text-[10px]">
          Email address <span aria-hidden="true">*</span>
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="label mb-2 block text-[10px]"
        >
          Password <span aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            className={`${fieldClass} pr-12`}
            placeholder="At least 8 characters"
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
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Use at least 8 characters, including a number.
        </p>
      </div>

      <div>
        <label
          htmlFor="register-confirm"
          className="label mb-2 block text-[10px]"
        >
          Confirm password <span aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <input
            id="register-confirm"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            className={`${fieldClass} pr-12`}
            placeholder="Repeat your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((visible) => !visible)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            {showConfirm ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="label flex h-12 w-full items-center justify-center gap-2 bg-ink px-6 text-[11px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating account" : "Create account"}
        <ArrowRightIcon className="h-4 w-4" />
      </button>

      <p className="text-[11px] leading-relaxed text-muted">
        By creating an account you agree to our{" "}
        <Link href="/policies#terms" className="underline underline-offset-2">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/policies#privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>

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
