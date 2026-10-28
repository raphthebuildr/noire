import type { Metadata } from "next";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import { formatDate } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Customers",
};

type Customer = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
};

export default async function AdminCustomersPage() {
  const admin = createAdminClient();

  if (!admin) {
    return <AdminNotConfigured />;
  }

  const { data } = await admin
    .from("profiles")
    .select("id, email, full_name, phone, role, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const customers = (data as Customer[] | null) ?? [];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Admin</span>
          <h1 className="mt-2 font-serif text-[34px] leading-none">Customers</h1>
        </div>
        <p className="text-xs text-muted">{customers.length} accounts</p>
      </header>

      {customers.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No customers yet.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.1em] text-muted">
                <th className="py-3 pr-4 font-normal">Name</th>
                <th className="py-3 pr-4 font-normal">Email</th>
                <th className="py-3 pr-4 font-normal">Phone</th>
                <th className="py-3 pr-4 font-normal">Role</th>
                <th className="py-3 text-right font-normal">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-line">
                  <td className="py-3 pr-4">
                    {customer.full_name || "—"}
                  </td>
                  <td className="py-3 pr-4 text-muted">{customer.email}</td>
                  <td className="py-3 pr-4 text-muted">
                    {customer.phone || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        customer.role === "admin"
                          ? "border border-ink px-2 py-1 text-[9px] uppercase tracking-[0.08em]"
                          : "text-muted"
                      }
                    >
                      {customer.role}
                    </span>
                  </td>
                  <td className="py-3 text-right text-muted">
                    {formatDate(customer.created_at)}
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
