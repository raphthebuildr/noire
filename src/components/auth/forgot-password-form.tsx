"use client";

import { useActionState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  forgotPasswordAction,
  type AuthState,
} from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

const initialState: AuthState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="forgot-email" className="label mb-2 block text-[10px]">
          Email
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 w-full border border-line bg-canvas px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="label flex h-12 w-full items-center justify-center gap-2 bg-ink px-6 text-[11px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Sending link" : "Send reset link"}
        <ArrowRightIcon className="h-4 w-4" />
      </button>

      <p
        aria-live="polite"
        className={cn(
          "min-h-[20px] text-sm",
          state.error ? "text-oxblood" : "text-muted",
        )}
      >
        {state.error ?? state.success}
      </p>
    </form>
  );
}
