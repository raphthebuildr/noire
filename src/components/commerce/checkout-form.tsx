"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/commerce/cart-provider";
import { ArrowRightIcon, LockIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export type SavedAddress = {
  first_name: string;
  last_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
};

const fieldClass =
  "h-11 w-full border border-line bg-canvas px-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";

const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING = 8;
const EXPRESS_SHIPPING = 18;

export function CheckoutForm({
  defaultEmail,
  defaultAddress,
}: {
  defaultEmail?: string;
  defaultAddress?: SavedAddress | null;
}) {
  const { lines, hydrated, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) {
    return (
      <div className="page-shell py-20">
        <div className="h-[420px] animate-pulse bg-surface" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="page-shell flex min-h-[58vh] flex-col items-center justify-center py-20 text-center">
        <span className="eyebrow text-muted">Checkout</span>
        <h1 className="mt-4 font-serif text-[44px] leading-none sm:text-[56px]">
          Your bag is empty.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          Add a piece before heading to checkout.
        </p>
        <Link
          href="/shop"
          className="label mt-8 inline-flex items-center gap-2 bg-ink px-7 py-4 text-[11px] text-canvas"
        >
          Shop all pieces
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const shipping =
    shippingMethod === "express"
      ? EXPRESS_SHIPPING
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING;
  const normalizedCoupon = couponCode.trim().toUpperCase();
  const discount =
    normalizedCoupon === "NOIRE10"
      ? Math.round(subtotal * 0.1 * 100) / 100
      : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  async function verifyPayment(reference: string) {
    const response = await fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });
    const data = (await response.json()) as {
      message?: string;
      orderNumber?: string;
      paidOutOfStock?: boolean;
    };

    if (!response.ok) {
      throw new Error(data.message ?? "We could not confirm the payment.");
    }

    clearCart();
    router.push(
      `/checkout/success?reference=${encodeURIComponent(reference)}${
        data.paidOutOfStock ? "&stock=1" : ""
      }`,
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      items: lines.map((line) => ({
        productSlug: line.productSlug,
        color: line.color,
        size: line.size,
        quantity: line.quantity,
      })),
      email: String(formData.get("email") ?? ""),
      address: {
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        line1: String(formData.get("line1") ?? ""),
        line2: String(formData.get("line2") ?? ""),
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
        country: String(formData.get("country") ?? "US"),
        phone: String(formData.get("phone") ?? ""),
      },
      shippingMethod,
      couponCode: couponCode.trim() || undefined,
      note: String(formData.get("note") ?? ""),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        message?: string;
        reference?: string;
        accessCode?: string;
        authorizationUrl?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Checkout failed. Please try again.");
      }

      if (!data.accessCode && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      if (!data.accessCode) {
        throw new Error("Paystack did not return a payment session.");
      }

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.resumeTransaction(data.accessCode, {
        onSuccess: async (transaction) => {
          try {
            await verifyPayment(transaction.reference || data.reference || "");
          } catch (verificationError) {
            setSubmitting(false);
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : "We could not confirm the payment.",
            );
          }
        },
        onCancel: () => {
          setSubmitting(false);
          setError("Payment was cancelled. Your bag is still saved.");
        },
        onError: (paystackError) => {
          setSubmitting(false);
          setError(paystackError.message || "Paystack could not load.");
        },
      });
    } catch (checkoutError) {
      setSubmitting(false);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed. Please try again.",
      );
    }
  }

  return (
    <div className="page-shell py-10 lg:py-16">
      <header className="border-b border-line pb-6">
        <span className="eyebrow text-muted">Checkout</span>
        <h1 className="mt-2 font-serif text-[42px] leading-none sm:text-[54px]">
          Complete your order.
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] xl:gap-16"
      >
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center border border-ink text-[10px]">
                1
              </span>
              <h2 className="font-serif text-[26px]">Contact</h2>
            </div>
            <div className="mt-5">
              <label htmlFor="checkout-email" className="label mb-2 block text-[10px]">
                Email
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={defaultEmail}
                className={fieldClass}
                placeholder="you@example.com"
              />
              <p className="mt-2 text-[11px] text-muted">
                Order confirmation and tracking are sent here.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center border border-ink text-[10px]">
                2
              </span>
              <h2 className="font-serif text-[26px]">Delivery address</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="First name"
                  name="firstName"
                  autoComplete="given-name"
                  defaultValue={defaultAddress?.first_name}
                  required
                />
                <Field
                  label="Last name"
                  name="lastName"
                  autoComplete="family-name"
                  defaultValue={defaultAddress?.last_name}
                  required
                />
              </div>
              <Field
                label="Address line 1"
                name="line1"
                autoComplete="address-line1"
                defaultValue={defaultAddress?.line1}
                required
              />
              <Field
                label="Address line 2"
                name="line2"
                autoComplete="address-line2"
                defaultValue={defaultAddress?.line2 ?? undefined}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  defaultValue={defaultAddress?.city}
                  required
                />
                <Field
                  label="State"
                  name="state"
                  autoComplete="address-level1"
                  defaultValue={defaultAddress?.state}
                  required
                />
                <Field
                  label="Postal code"
                  name="postalCode"
                  autoComplete="postal-code"
                  defaultValue={defaultAddress?.postal_code}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-country"
                    className="label mb-2 block text-[10px]"
                  >
                    Country
                  </label>
                  <select
                    id="checkout-country"
                    name="country"
                    defaultValue={defaultAddress?.country ?? "US"}
                    className={fieldClass}
                  >
                    <option value="US">United States</option>
                  </select>
                </div>
                <Field
                  label="Phone"
                  name="phone"
                  autoComplete="tel"
                  defaultValue={defaultAddress?.phone ?? undefined}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center border border-ink text-[10px]">
                3
              </span>
              <h2 className="font-serif text-[26px]">Delivery method</h2>
            </div>

            <div className="mt-5 space-y-2">
              <label className="flex cursor-pointer items-center justify-between gap-4 border border-line p-4 transition-colors has-[:checked]:border-ink">
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="h-4 w-4 accent-ink"
                  />
                  <span>
                    <span className="block text-sm">Standard delivery</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      3–5 business days
                    </span>
                  </span>
                </span>
                <span className="text-sm">
                  {subtotal >= FREE_SHIPPING_THRESHOLD
                    ? "Complimentary"
                    : formatPrice(STANDARD_SHIPPING)}
                </span>
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 border border-line p-4 transition-colors has-[:checked]:border-ink">
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className="h-4 w-4 accent-ink"
                  />
                  <span>
                    <span className="block text-sm">Express delivery</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      1–2 business days
                    </span>
                  </span>
                </span>
                <span className="text-sm">{formatPrice(EXPRESS_SHIPPING)}</span>
              </label>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center border border-ink text-[10px]">
                4
              </span>
              <h2 className="font-serif text-[26px]">Payment</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3 border border-line bg-paper p-4">
                <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-sm">Secure payment via Paystack</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    You will be redirected to Paystack to complete payment. Card
                    details are never stored by NOIRÉ.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-coupon"
                    className="label mb-2 block text-[10px]"
                  >
                    Coupon code
                  </label>
                  <input
                    id="checkout-coupon"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    className={fieldClass}
                    placeholder="NOIRE10"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-note"
                    className="label mb-2 block text-[10px]"
                  >
                    Order note
                  </label>
                  <input
                    id="checkout-note"
                    name="note"
                    className={fieldClass}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit border border-line bg-paper p-6 lg:sticky lg:top-28">
          <h2 className="label text-[11px]">Your order</h2>

          <ul className="mt-4 divide-y divide-line border-t border-line">
            {lines.map((line) => (
              <li key={line.variantId} className="flex gap-3 py-3">
                <span className="relative block h-16 w-12 shrink-0 overflow-hidden bg-surface">
                  <Image
                    src={line.image}
                    alt={line.productName}
                    fill
                    sizes="48px"
                    className="image-cover"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[17px] leading-snug">
                    {line.productName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {line.color} / {line.size} · Qty {line.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>
                {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
              </dd>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted">Discount</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-line pt-3">
              <dt>Total</dt>
              <dd className="text-lg">{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting}
            className="label mt-6 flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-[11px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Starting payment" : "Pay with Paystack"}
            <ArrowRightIcon className="h-4 w-4" />
          </button>

          <p
            aria-live="polite"
            className={cn(
              "mt-3 min-h-[20px] text-xs leading-relaxed",
              error ? "text-oxblood" : "text-muted",
            )}
          >
            {error}
          </p>

          <p className="mt-2 text-center text-[10px] text-muted">
            Tax is $0 for this concept store.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  autoComplete,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  autoComplete?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`checkout-${name}`} className="label mb-2 block text-[10px]">
        {label}
      </label>
      <input
        id={`checkout-${name}`}
        name={name}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        className={fieldClass}
      />
    </div>
  );
}
