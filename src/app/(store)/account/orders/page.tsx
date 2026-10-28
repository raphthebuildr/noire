import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Orders",
  description: "Your NOIRÉ order history.",
};

type OrderItem = {
  product_name: string;
  variant_label: string;
  quantity: number;
  image_url: string | null;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_cents: number;
  created_at: string;
  order_items: OrderItem[];
};

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  let orders: Order[] = [];

  if (supabase && user) {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, order_number, status, payment_status, total_cents, created_at, order_items(product_name, variant_label, quantity, image_url)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    orders = (data as Order[] | null) ?? [];
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Account</span>
          <h2 className="mt-2 font-serif text-[32px] leading-none">Orders</h2>
        </div>
        <span className="text-xs text-muted">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 border border-line px-6 py-14 text-center">
          <p className="font-serif text-[28px]">No orders yet.</p>
          <p className="mt-2 text-sm text-muted">
            When you place an order, it will appear here.
          </p>
          <Link
            href="/shop"
            className="label mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[10px] text-canvas"
          >
            Shop all pieces
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {orders.map((order) => (
            <li key={order.id} className="py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {order.order_number}
                    </Link>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Placed {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{formatPrice(order.total_cents / 100)}</p>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="mt-1 inline-block text-xs underline underline-offset-4"
                  >
                    View details
                  </Link>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {order.order_items.map((item, index) => (
                  <div
                    key={`${order.id}-${item.product_name}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <span className="relative block h-16 w-12 overflow-hidden bg-surface">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          sizes="48px"
                          className="image-cover"
                        />
                      ) : null}
                    </span>
                    <div>
                      <p className="text-sm">{item.product_name}</p>
                      <p className="text-xs text-muted">
                        {item.variant_label} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
