"use client";

import { useActionState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  resetPasswordAction,
  type AuthState,
} from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

const initialState: AuthState = {};
const fieldClass =
  "h-12 w-full border border-line bg-canvas px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="reset-password" className="label mb-2 block text-[10px]">
          New password
        </label>
        <input
          id="reset-password"
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
        <label htmlFor="reset-confirm" className="label mb-2 block text-[10px]">
          Confirm new password
        </label>
        <input
          id="reset-confirm"
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
        {pending ? "Updating password" : "Update password"}
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
