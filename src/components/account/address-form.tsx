"use client";

import { useActionState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  saveAddressAction,
  type AddressState,
} from "@/lib/actions/addresses";
import { cn } from "@/lib/cn";

const initialState: AddressState = {};

const fieldClass =
  "h-11 w-full border border-line bg-canvas px-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";

export type EditableAddress = {
  id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
};

export function AddressForm({ address }: { address?: EditableAddress }) {
  const [state, formAction, pending] = useActionState(
    saveAddressAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {address ? <input type="hidden" name="id" value={address.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="First name"
          name="firstName"
          autoComplete="given-name"
          defaultValue={address?.first_name}
          required
        />
        <Field
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          defaultValue={address?.last_name}
          required
        />
      </div>

      <Field
        label="Address line 1"
        name="line1"
        autoComplete="address-line1"
        defaultValue={address?.line1}
        required
      />
      <Field
        label="Address line 2"
        name="line2"
        autoComplete="address-line2"
        defaultValue={address?.line2 ?? undefined}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="City"
          name="city"
          autoComplete="address-level2"
          defaultValue={address?.city}
          required
        />
        <Field
          label="State"
          name="state"
          autoComplete="address-level1"
          defaultValue={address?.state}
          required
        />
        <Field
          label="Postal code"
          name="postalCode"
          autoComplete="postal-code"
          defaultValue={address?.postal_code}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label mb-2 block text-[10px]" htmlFor="address-country">
            Country
          </label>
          <select
            id="address-country"
            name="country"
            defaultValue={address?.country ?? "US"}
            className={fieldClass}
          >
            <option value="US">United States</option>
          </select>
        </div>
        <Field
          label="Phone"
          name="phone"
          autoComplete="tel"
          defaultValue={address?.phone ?? undefined}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Label"
          name="label"
          defaultValue={address?.label ?? undefined}
          placeholder="Home, studio…"
        />
        <label className="flex items-center gap-2 pt-6 text-sm text-muted">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={address?.is_default ?? false}
            className="h-4 w-4 accent-ink"
          />
          Set as default address
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="label inline-flex h-11 items-center justify-center gap-2 bg-ink px-6 text-[10px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving" : address ? "Update address" : "Save address"}
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

function Field({
  label,
  name,
  autoComplete,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label mb-2 block text-[10px]" htmlFor={`address-${name}`}>
        {label}
      </label>
      <input
        id={`address-${name}`}
        name={name}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={fieldClass}
      />
    </div>
  );
}
