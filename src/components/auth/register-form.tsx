"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
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
          Full name
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
          Email
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
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label
          htmlFor="register-confirm"
          className="label mb-2 block text-[10px]"
        >
          Confirm password
        </label>
        <input
          id="register-confirm"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
          placeholder="Repeat your password"
        />
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
