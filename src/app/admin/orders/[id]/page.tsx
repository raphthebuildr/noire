import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import { updateOrderStatusAction } from "@/lib/actions/admin";
import { formatDate, formatPrice } from "@/lib/format";
import { orderStatusLabels } from "@/lib/order-status";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Order detail",
};

type Params = Promise<{ id: string }>;

type OrderDetail = {
  id: string;
  order_number: string;
  email: string;
  status: string;
  payment_status: string;
  currency: string;
  subtotal_cents: number;
  shipping_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  coupon_code: string | null;
  shipping_method: string;
  shipping_address: Record<string, string> | null;
  customer_note: string | null;
  paystack_reference: string | null;
  paid_at: string | null;
  created_at: string;
  order_items: {
    id: string;
    product_name: string;
    variant_label: string;
    sku: string | null;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
    image_url: string | null;
  }[];
  order_events: {
    id: string;
    type: string;
    message: string | null;
    created_at: string;
  }[];
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Params;
}) {
  const admin = createAdminClient();

  if (!admin) {
    return <AdminNotConfigured />;
  }

  const { id } = await params;
  const { data } = await admin
    .from("orders")
    .select(
      "id, order_number, email, status, payment_status, currency, subtotal_cents, shipping_cents, discount_cents, tax_cents, total_cents, coupon_code, shipping_method, shipping_address, customer_note, paystack_reference, paid_at, created_at, order_items(id, product_name, variant_label, sku, quantity, unit_price_cents, line_total_cents, image_url), order_events(id, type, message, created_at)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const order = data as OrderDetail;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-muted hover:text-ink"
          >
            ← Orders
          </Link>
          <h1 className="mt-2 font-serif text-[34px] leading-none">
            {order.order_number}
          </h1>
          <p className="mt-2 text-xs text-muted">
            Placed {formatDate(order.created_at)} · {order.email}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="border border-line bg-paper">
            <h2 className="border-b border-line px-5 py-3 font-serif text-[22px]">
              Items
            </h2>
            <ul className="divide-y divide-line px-5">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
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
                    <p className="font-serif text-[19px]">{item.product_name}</p>
                    <p className="mt-1 text-[11px] text-muted">
                      {item.variant_label} · {item.sku ?? "No SKU"} · Qty{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{formatPrice(item.line_total_cents / 100)}</p>
                    <p className="text-[11px] text-muted">
                      {formatPrice(item.unit_price_cents / 100)} each
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-line bg-paper">
            <h2 className="border-b border-line px-5 py-3 font-serif text-[22px]">
              Timeline
            </h2>
            {order.order_events.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted">No events recorded.</p>
            ) : (
              <ul className="divide-y divide-line px-5">
                {order.order_events.map((event) => (
                  <li key={event.id} className="py-3 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="capitalize">{event.type.replaceAll("_", " ")}</p>
                      <p className="text-[11px] text-muted">
                        {formatDate(event.created_at)}
                      </p>
                    </div>
                    {event.message ? (
                      <p className="mt-1 text-xs text-muted">{event.message}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-line bg-paper p-5">
            <h2 className="font-serif text-[22px]">Update status</h2>
            <form action={updateOrderStatusAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="h-11 w-full border border-line bg-canvas px-3 text-sm outline-none focus:border-ink"
              >
                {Object.entries(orderStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="label w-full bg-ink px-4 py-3 text-[10px] text-canvas"
              >
                Save status
              </button>
            </form>
          </section>

          <section className="border border-line bg-paper p-5 text-sm">
            <h2 className="font-serif text-[22px]">Payment</h2>
            <dl className="mt-4 space-y-2.5">
              <Row label="Status" value={order.payment_status} />
              <Row label="Reference" value={order.paystack_reference ?? "—"} />
              <Row label="Method" value={order.shipping_method} />
              <Row
                label="Paid"
                value={order.paid_at ? formatDate(order.paid_at) : "—"}
              />
              {order.coupon_code ? (
                <Row label="Coupon" value={order.coupon_code} />
              ) : null}
            </dl>
          </section>

          <section className="border border-line bg-paper p-5 text-sm">
            <h2 className="font-serif text-[22px]">Totals</h2>
            <dl className="mt-4 space-y-2.5">
              <Row
                label="Subtotal"
                value={formatPrice(order.subtotal_cents / 100)}
              />
              {order.discount_cents > 0 ? (
                <Row
                  label="Discount"
                  value={`−${formatPrice(order.discount_cents / 100)}`}
                />
              ) : null}
              <Row
                label="Shipping"
                value={
                  order.shipping_cents === 0
                    ? "Complimentary"
                    : formatPrice(order.shipping_cents / 100)
                }
              />
              <Row label="Tax" value={formatPrice(order.tax_cents / 100)} />
              <div className="flex justify-between border-t border-line pt-3">
                <dt>Total</dt>
                <dd className="text-lg">
                  {formatPrice(order.total_cents / 100)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="border border-line bg-paper p-5 text-sm">
            <h2 className="font-serif text-[22px]">Shipping address</h2>
            {order.shipping_address ? (
              <address className="mt-3 not-italic leading-relaxed text-muted">
                {order.shipping_address.firstName}{" "}
                {order.shipping_address.lastName}
                <br />
                {order.shipping_address.line1}
                {order.shipping_address.line2 ? (
                  <>
                    <br />
                    {order.shipping_address.line2}
                  </>
                ) : null}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postalCode}
                <br />
                {order.shipping_address.country}
                {order.shipping_address.phone ? (
                  <>
                    <br />
                    {order.shipping_address.phone}
                  </>
                ) : null}
              </address>
            ) : (
              <p className="mt-3 text-muted">No address provided.</p>
            )}
          </section>

          {order.customer_note ? (
            <section className="border border-line bg-paper p-5 text-sm">
              <h2 className="font-serif text-[22px]">Customer note</h2>
              <p className="mt-3 leading-relaxed text-muted">
                {order.customer_note}
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right capitalize">{value}</dd>
    </div>
  );
}
