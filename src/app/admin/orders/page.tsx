import type { Metadata } from "next";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import { formatDate, formatPrice } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Orders",
};

const filters = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const validStatuses = new Set(filters.map((filter) => filter.value));

type SearchParams = Promise<{ status?: string | string[] }>;

type OrderRow = {
  id: string;
  order_number: string;
  email: string;
  total_cents: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const admin = createAdminClient();

  if (!admin) {
    return <AdminNotConfigured />;
  }

  const params = await searchParams;
  const rawStatus = Array.isArray(params.status)
    ? params.status[0]
    : params.status;
  const status = rawStatus && validStatuses.has(rawStatus) ? rawStatus : "";

  let query = admin
    .from("orders")
    .select(
      "id, order_number, email, total_cents, status, payment_status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) {
    query = query.eq("status", status);
  }

  const { data } = await query;
  const orders = (data as OrderRow[] | null) ?? [];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Admin</span>
          <h1 className="mt-2 font-serif text-[34px] leading-none">Orders</h1>
        </div>
        <p className="text-xs text-muted">{orders.length} shown</p>
      </header>

      <div className="mt-5 flex flex-wrap gap-1">
        {filters.map((filter) => {
          const active = status === filter.value;
          const href = filter.value
            ? `/admin/orders?status=${filter.value}`
            : "/admin/orders";

          return (
            <Link
              key={filter.value || "all"}
              href={href}
              className={
                active
                  ? "label border border-ink bg-ink px-3 py-2 text-[9px] text-canvas"
                  : "label border border-line px-3 py-2 text-[9px] text-muted hover:border-ink hover:text-ink"
              }
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">No orders found.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.1em] text-muted">
                <th className="py-3 pr-4 font-normal">Order</th>
                <th className="py-3 pr-4 font-normal">Customer</th>
                <th className="py-3 pr-4 font-normal">Date</th>
                <th className="py-3 pr-4 font-normal">Payment</th>
                <th className="py-3 pr-4 font-normal">Status</th>
                <th className="py-3 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-line">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="max-w-[220px] truncate py-3 pr-4 text-muted">
                    {order.email}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="py-3 pr-4 capitalize text-muted">
                    {order.payment_status}
                  </td>
                  <td className="py-3 pr-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 text-right">
                    {formatPrice(order.total_cents / 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
