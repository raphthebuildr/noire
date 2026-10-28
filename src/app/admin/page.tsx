import Link from "next/link";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { formatDate, formatPrice } from "@/lib/format";
import { products } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";

type RecentOrder = {
  id: string;
  order_number: string;
  email: string;
  total_cents: number;
  status: string;
  created_at: string;
};

export default async function AdminDashboardPage() {
  const admin = createAdminClient();

  if (!admin) {
    return (
      <div className="border border-line bg-paper p-8">
        <h1 className="font-serif text-[32px]">Admin is not configured.</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Add the Supabase secret key to{" "}
          <code className="bg-surface px-1.5 py-0.5 text-xs">
            .env.local
          </code>{" "}
          and apply the migrations to activate the admin area.
        </p>
      </div>
    );
  }

  const [
    ordersResult,
    paidOrdersResult,
    customersResult,
    reviewsResult,
    messagesResult,
    recentOrdersResult,
  ] = await Promise.all([
    admin.from("orders").select("id", { count: "exact", head: true }),
    admin
      .from("orders")
      .select("total_cents")
      .eq("payment_status", "paid")
      .limit(5000),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "customer"),
    admin
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    admin
      .from("orders")
      .select("id, order_number, email, total_cents, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const revenueCents = (paidOrdersResult.data ?? []).reduce(
    (sum, order) => sum + order.total_cents,
    0,
  );
  const recentOrders = (recentOrdersResult.data as RecentOrder[] | null) ?? [];
  const lowStock = products
    .flatMap((product) =>
      product.colors.flatMap((color) =>
        product.sizes.map((size) => ({
          product: product.name,
          variant: `${color.name} / ${size}`,
          stock: product.stock[color.name]?.[size] ?? 0,
        })),
      ),
    )
    .filter((item) => item.stock <= 2)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const stats = [
    { label: "Orders", value: String(ordersResult.count ?? 0), href: "/admin/orders" },
    {
      label: "Revenue",
      value: formatPrice(revenueCents / 100),
      href: "/admin/orders",
    },
    {
      label: "Customers",
      value: String(customersResult.count ?? 0),
      href: "/admin/customers",
    },
    {
      label: "Pending reviews",
      value: String(reviewsResult.count ?? 0),
      href: "/admin/reviews",
    },
    {
      label: "New messages",
      value: String(messagesResult.count ?? 0),
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <span className="eyebrow text-muted">Admin</span>
        <h1 className="mt-2 font-serif text-[38px] leading-none sm:text-[46px]">
          Store overview.
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-paper p-5 transition-colors hover:bg-surface"
          >
            <p className="label text-[9px] text-muted">{stat.label}</p>
            <p className="mt-3 font-serif text-[30px] leading-none">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <section>
          <div className="flex items-end justify-between border-b border-line pb-3">
            <h2 className="font-serif text-[26px]">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-muted hover:text-ink">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="py-10 text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[10px] uppercase tracking-[0.1em] text-muted">
                    <th className="py-3 pr-4 font-normal">Order</th>
                    <th className="py-3 pr-4 font-normal">Customer</th>
                    <th className="py-3 pr-4 font-normal">Date</th>
                    <th className="py-3 pr-4 font-normal">Status</th>
                    <th className="py-3 text-right font-normal">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-line">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="max-w-[180px] truncate py-3 pr-4 text-muted">
                        {order.email}
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {formatDate(order.created_at)}
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
        </section>

        <aside className="space-y-6">
          <div className="border border-line bg-paper p-5">
            <h2 className="font-serif text-[24px]">Low stock</h2>
            {lowStock.length === 0 ? (
              <p className="mt-3 text-sm text-muted">All sizes are stocked.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {lowStock.map((item) => (
                  <li
                    key={`${item.product}-${item.variant}`}
                    className="flex items-start justify-between gap-3 py-2.5 text-xs"
                  >
                    <span>
                      <span className="block text-sm">{item.product}</span>
                      <span className="text-muted">{item.variant}</span>
                    </span>
                    <span
                      className={
                        item.stock === 0 ? "text-oxblood" : "text-muted"
                      }
                    >
                      {item.stock === 0 ? "Sold out" : `${item.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
              Catalog stock is managed in{" "}
              <code className="bg-surface px-1">src/lib/catalog.ts</code>.
            </p>
          </div>

          <div className="border border-line bg-paper p-5">
            <h2 className="font-serif text-[24px]">Quick links</h2>
            <div className="mt-3 grid gap-2 text-sm">
              <Link href="/admin/orders?status=paid" className="text-muted hover:text-ink">
                Paid orders needing fulfilment
              </Link>
              <Link href="/admin/reviews" className="text-muted hover:text-ink">
                Moderate pending reviews
              </Link>
              <Link href="/admin/messages" className="text-muted hover:text-ink">
                Read new enquiries
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
