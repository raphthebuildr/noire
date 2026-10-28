import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClearCartOnMount } from "@/components/commerce/clear-cart-on-mount";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Thank you for your NOIRÉ order.",
};

type SearchParams = Promise<{
  reference?: string | string[];
  stock?: string | string[];
}>;

type OrderRow = {
  order_number: string;
  email: string;
  total_cents: number;
  subtotal_cents: number;
  shipping_cents: number;
  discount_cents: number;
  status: string;
  payment_status: string;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  } | null;
  order_items:
    | {
        product_name: string;
        variant_label: string | null;
        quantity: number;
        line_total_cents: number;
        image_url: string | null;
      }[]
    | null;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const reference = Array.isArray(params.reference)
    ? params.reference[0]
    : params.reference;
  const paidOutOfStock = params.stock === "1";
  const admin = createAdminClient();
  let order: OrderRow | null = null;

  if (admin && reference) {
    const { data } = await admin
      .from("orders")
      .select(
        "order_number, email, total_cents, subtotal_cents, shipping_cents, discount_cents, status, payment_status, shipping_address, order_items(product_name, variant_label, quantity, line_total_cents, image_url)",
      )
      .eq("paystack_reference", reference)
      .maybeSingle();

    order = (data as OrderRow | null) ?? null;
  }

  return (
    <div className="page-shell py-12 lg:py-20">
      <ClearCartOnMount />

      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-muted">Order confirmed</span>
        <h1 className="mt-4 font-serif text-[46px] leading-[0.95] sm:text-[64px]">
          Thank you.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted">
          Your payment has been received and your order is confirmed. A
          confirmation will be sent to{" "}
          <span className="text-ink">{order?.email ?? "your email"}</span>.
        </p>

        {order ? (
          <p className="label mt-6 inline-block border border-line px-4 py-2 text-[10px]">
            {order.order_number}
          </p>
        ) : null}

        {paidOutOfStock ? (
          <p className="mx-auto mt-6 max-w-lg border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-xs leading-relaxed text-oxblood">
            One or more pieces sold out while payment was processing. Our team
            will contact you about a replacement or refund.
          </p>
        ) : null}
      </div>

      {order ? (
        <div className="mx-auto mt-12 max-w-2xl border border-line bg-paper">
          <ul className="divide-y divide-line px-5 sm:px-6">
            {(order.order_items ?? []).map((item, index) => (
              <li
                key={`${item.product_name}-${index}`}
                className="flex items-center gap-4 py-4"
              >
                {item.image_url ? (
                  <span className="relative block h-20 w-16 shrink-0 overflow-hidden bg-surface">
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      fill
                      sizes="64px"
                      className="image-cover"
                    />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[19px] leading-snug">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {item.variant_label} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(item.line_total_cents / 100)}</p>
              </li>
            ))}
          </ul>

          <dl className="space-y-2.5 border-t border-line px-5 py-4 text-sm sm:px-6">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal_cents / 100)}</dd>
            </div>
            {order.discount_cents > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted">Discount</dt>
                <dd>−{formatPrice(order.discount_cents / 100)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>
                {order.shipping_cents === 0
                  ? "Complimentary"
                  : formatPrice(order.shipping_cents / 100)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt>Total paid</dt>
              <dd className="text-lg">{formatPrice(order.total_cents / 100)}</dd>
            </div>
          </dl>

          {order.shipping_address ? (
            <div className="border-t border-line px-5 py-4 text-sm sm:px-6">
              <p className="label text-[10px] text-muted">Shipping to</p>
              <address className="mt-2 not-italic leading-relaxed text-muted">
                {order.shipping_address.firstName}{" "}
                {order.shipping_address.lastName}
                <br />
                {order.shipping_address.line1}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postalCode}
              </address>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/shop"
          className="label inline-flex items-center gap-2 bg-ink px-7 py-4 text-[11px] text-canvas"
        >
          Continue shopping
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <Link
          href="/account/orders"
          className="label border border-ink px-7 py-4 text-[11px]"
        >
          View orders
        </Link>
      </div>
    </div>
  );
}
