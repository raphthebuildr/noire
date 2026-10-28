import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account",
  description: "Your NOIRÉ account.",
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
  total_cents: number;
  created_at: string;
  order_items: OrderItem[];
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  let orders: Order[] = [];

  if (supabase && user) {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, order_number, status, total_cents, created_at, order_items(product_name, variant_label, quantity, image_url)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    orders = (data as Order[] | null) ?? [];
  }

  const name =
    (user?.user_metadata?.full_name as string | undefined)?.trim() || "there";

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border border-line p-5">
          <p className="label text-[10px] text-muted">Profile</p>
          <p className="mt-2 truncate text-sm">{name}</p>
          <p className="mt-1 truncate text-xs text-muted">{user?.email}</p>
          <Link
            href="/account/settings"
            className="mt-4 inline-block text-xs underline underline-offset-4"
          >
            Edit details
          </Link>
        </div>
        <div className="border border-line p-5">
          <p className="label text-[10px] text-muted">Orders</p>
          <p className="mt-2 font-serif text-[30px] leading-none">
            {orders.length}
          </p>
          <Link
            href="/account/orders"
            className="mt-4 inline-block text-xs underline underline-offset-4"
          >
            View all orders
          </Link>
        </div>
        <div className="border border-line p-5">
          <p className="label text-[10px] text-muted">Delivery</p>
          <p className="mt-2 text-sm">Standard · 3–5 days</p>
          <p className="mt-1 text-xs text-muted">Complimentary over $150</p>
          <Link
            href="/account/addresses"
            className="mt-4 inline-block text-xs underline underline-offset-4"
          >
            Manage addresses
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="font-serif text-[28px] leading-none">Recent orders</h2>
          {orders.length > 0 ? (
            <Link
              href="/account/orders"
              className="text-xs text-muted hover:text-ink"
            >
              View all
            </Link>
          ) : null}
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 border border-line px-6 py-12 text-center">
            <p className="font-serif text-[26px]">No orders yet.</p>
            <p className="mt-2 text-sm text-muted">
              Your first piece is waiting.
            </p>
            <Link
              href="/shop"
              className="label mt-5 inline-flex items-center gap-2 bg-ink px-5 py-3 text-[10px] text-canvas"
            >
              Shop all pieces
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((order) => (
              <li key={order.id} className="py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {order.order_number}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-xs text-muted">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {order.order_items.slice(0, 3).map((item, index) =>
                        item.image_url ? (
                          <span
                            key={`${item.product_name}-${index}`}
                            className="relative block h-12 w-10 overflow-hidden border-2 border-paper bg-surface"
                          >
                            <Image
                              src={item.image_url}
                              alt={item.product_name}
                              fill
                              sizes="40px"
                              className="image-cover"
                            />
                          </span>
                        ) : null,
                      )}
                    </div>
                    <div>
                      <p className="text-sm">
                        {order.order_items[0]?.product_name ?? "Order"}
                        {order.order_items.length > 1
                          ? ` + ${order.order_items.length - 1} more`
                          : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {order.order_items.reduce(
                          (count, item) => count + item.quantity,
                          0,
                        )}{" "}
                        items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-sm">
                      {formatPrice(order.total_cents / 100)}
                    </span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-xs underline underline-offset-4"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
