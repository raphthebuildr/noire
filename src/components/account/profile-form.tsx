"use client";

import { useActionState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { updateProfileAction, type ProfileState } from "@/lib/actions/profile";
import { cn } from "@/lib/cn";

const initialState: ProfileState = {};
const fieldClass =
  "h-11 w-full border border-line bg-canvas px-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="profile-name" className="label mb-2 block text-[10px]">
          Full name
        </label>
        <input
          id="profile-name"
          name="fullName"
          defaultValue={fullName}
          autoComplete="name"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="profile-email" className="label mb-2 block text-[10px]">
          Email
        </label>
        <input
          id="profile-email"
          value={email}
          readOnly
          disabled
          className={cn(fieldClass, "cursor-not-allowed text-muted")}
        />
        <p className="mt-1.5 text-[11px] text-muted">
          Email changes are handled by support for now.
        </p>
      </div>

      <div>
        <label htmlFor="profile-phone" className="label mb-2 block text-[10px]">
          Phone
        </label>
        <input
          id="profile-phone"
          name="phone"
          defaultValue={phone}
          autoComplete="tel"
          className={fieldClass}
          placeholder="Optional"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="label inline-flex h-11 items-center justify-center gap-2 bg-ink px-6 text-[10px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving" : "Save changes"}
        <ArrowRightIcon className="h-3.5 w-3.5" />
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
