import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Order details",
  description: "View your NOIRÉ order.",
};

type Address = {
  firstName?: string;
  lastName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  variant_label: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  image_url: string | null;
};

type OrderEvent = {
  id: string;
  type: string;
  message: string | null;
  created_at: string;
};

type Order = {
  id: string;
  order_number: string;
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
  shipping_address: Address;
  billing_address: Address | null;
  customer_note: string | null;
  created_at: string;
  paid_at: string | null;
  order_items: OrderItem[];
  order_events: OrderEvent[];
};

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();

  if (!supabase || !user) {
    notFound();
  }

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), order_events(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const order = data as Order;
  const address = order.shipping_address;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <Link
            href="/account/orders"
            className="text-xs text-muted hover:text-ink"
          >
            ← Back to orders
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-[32px] leading-none">
              {order.order_number}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-xs text-muted">
            Placed {formatDate(order.created_at)}
            {order.paid_at ? ` · Paid ${formatDate(order.paid_at)}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="label text-[10px] text-muted">Total</p>
          <p className="mt-1 text-lg">
            {formatPrice(order.total_cents / 100)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h3 className="label text-[10px] text-muted">Pieces</h3>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <span className="relative block h-[96px] w-[76px] shrink-0 overflow-hidden bg-surface">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      fill
                      sizes="76px"
                      className="image-cover"
                    />
                  ) : null}
                </span>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="font-serif text-[20px] leading-snug">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {item.variant_label} · Qty {item.quantity}
                  </p>
                  <p className="mt-2 text-sm">
                    {formatPrice(item.line_total_cents / 100)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="label text-[10px] text-muted">Shipping address</h3>
              <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
                {address.firstName} {address.lastName}
                <br />
                {address.line1}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
              </address>
            </div>
            <div>
              <h3 className="label text-[10px] text-muted">Delivery</h3>
              <p className="mt-3 text-sm capitalize text-muted">
                {order.shipping_method} shipping
              </p>
              <p className="mt-1 text-sm text-muted">
                {order.shipping_cents === 0
                  ? "Complimentary"
                  : formatPrice(order.shipping_cents / 100)}
              </p>
              {order.customer_note ? (
                <>
                  <h3 className="label mt-5 text-[10px] text-muted">Note</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {order.customer_note}
                  </p>
                </>
              ) : null}
            </div>
          </div>

          {order.order_events.length > 0 ? (
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="label text-[10px] text-muted">Order timeline</h3>
              <ul className="mt-3 space-y-2">
                {order.order_events.map((event) => (
                  <li
                    key={event.id}
                    className="flex justify-between gap-4 text-xs text-muted"
                  >
                    <span>{event.message ?? event.type}</span>
                    <span className="shrink-0">
                      {formatDate(event.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="h-fit border border-line bg-paper p-6">
          <h3 className="label text-[10px]">Summary</h3>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal_cents / 100)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>
                {order.shipping_cents === 0
                  ? "Complimentary"
                  : formatPrice(order.shipping_cents / 100)}
              </dd>
            </div>
            {order.discount_cents > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted">
                  Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}
                </dt>
                <dd>−{formatPrice(order.discount_cents / 100)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">Tax</dt>
              <dd>{formatPrice(order.tax_cents / 100)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt>Total</dt>
              <dd>{formatPrice(order.total_cents / 100)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs capitalize text-muted">
            Payment: {order.payment_status}
          </p>
        </aside>
      </div>
    </div>
  );
}
