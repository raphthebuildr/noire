import type { Metadata } from "next";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import {
  deleteCouponAction,
  saveCouponAction,
  toggleCouponAction,
} from "@/lib/actions/admin";
import { formatPrice } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Coupons",
};

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  discount_value: number;
  min_subtotal_cents: number;
  max_redemptions: number | null;
  times_redeemed: number;
  is_active: boolean;
  created_at: string;
};

const fieldClass =
  "h-11 w-full border border-line bg-canvas px-3 text-sm outline-none focus:border-ink";

export default async function AdminCouponsPage() {
  const admin = createAdminClient();

  if (!admin) {
    return <AdminNotConfigured />;
  }

  const { data } = await admin
    .from("coupons")
    .select(
      "id, code, type, discount_value, min_subtotal_cents, max_redemptions, times_redeemed, is_active, created_at",
    )
    .order("created_at", { ascending: false });

  const coupons = (data as Coupon[] | null) ?? [];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Admin</span>
          <h1 className="mt-2 font-serif text-[34px] leading-none">Coupons</h1>
        </div>
        <p className="text-xs text-muted">{coupons.length} codes</p>
      </header>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div>
          {coupons.length === 0 ? (
            <p className="py-10 text-sm text-muted">No coupons yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[10px] uppercase tracking-[0.1em] text-muted">
                    <th className="py-3 pr-4 font-normal">Code</th>
                    <th className="py-3 pr-4 font-normal">Discount</th>
                    <th className="py-3 pr-4 font-normal">Minimum</th>
                    <th className="py-3 pr-4 font-normal">Used</th>
                    <th className="py-3 pr-4 font-normal">Status</th>
                    <th className="py-3 text-right font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-line">
                      <td className="py-3 pr-4 font-medium">{coupon.code}</td>
                      <td className="py-3 pr-4">
                        {coupon.type === "percentage"
                          ? `${coupon.discount_value}%`
                          : formatPrice(coupon.discount_value / 100)}
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {coupon.min_subtotal_cents === 0
                          ? "None"
                          : formatPrice(coupon.min_subtotal_cents / 100)}
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {coupon.times_redeemed}
                        {coupon.max_redemptions
                          ? ` / ${coupon.max_redemptions}`
                          : ""}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            coupon.is_active
                              ? "text-ink"
                              : "text-muted line-through"
                          }
                        >
                          {coupon.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-3 text-xs">
                          <form action={toggleCouponAction}>
                            <input type="hidden" name="id" value={coupon.id} />
                            <input
                              type="hidden"
                              name="isActive"
                              value={String(coupon.is_active)}
                            />
                            <button
                              type="submit"
                              className="text-muted underline-offset-4 hover:text-ink hover:underline"
                            >
                              {coupon.is_active ? "Disable" : "Enable"}
                            </button>
                          </form>
                          <form action={deleteCouponAction}>
                            <input type="hidden" name="id" value={coupon.id} />
                            <button
                              type="submit"
                              className="text-muted hover:text-oxblood"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="h-fit border border-line bg-paper p-5">
          <h2 className="font-serif text-[24px]">Create or update</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Entering an existing code updates that coupon.
          </p>
          <form action={saveCouponAction} className="mt-5 space-y-4">
            <div>
              <label htmlFor="coupon-code" className="label mb-2 block text-[10px]">
                Code
              </label>
              <input
                id="coupon-code"
                name="code"
                required
                className={fieldClass}
                placeholder="NOIRE10"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="coupon-type"
                  className="label mb-2 block text-[10px]"
                >
                  Type
                </label>
                <select
                  id="coupon-type"
                  name="type"
                  className={fieldClass}
                  defaultValue="percentage"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="coupon-value"
                  className="label mb-2 block text-[10px]"
                >
                  Value
                </label>
                <input
                  id="coupon-value"
                  name="value"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  className={fieldClass}
                  placeholder="10"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="coupon-minimum"
                className="label mb-2 block text-[10px]"
              >
                Minimum subtotal (USD)
              </label>
              <input
                id="coupon-minimum"
                name="minSubtotal"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className={fieldClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked
                className="h-4 w-4 accent-ink"
              />
              Active
            </label>
            <button
              type="submit"
              className="label w-full bg-ink px-4 py-3 text-[10px] text-canvas"
            >
              Save coupon
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
