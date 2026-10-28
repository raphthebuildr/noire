"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const orderStatuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "paid_out_of_stock",
] as const;

async function requireAdminClient() {
  const user = await getAdminUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const admin = createAdminClient();

  if (!admin) {
    throw new Error("Supabase admin credentials are not configured.");
  }

  return admin;
}

export async function updateOrderStatusAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(orderStatuses).parse(formData.get("status"));

  const { error } = await admin
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await admin.from("order_events").insert({
    order_id: id,
    type: "status_updated",
    message: `Order status changed to ${status}.`,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${id}`);
}

export async function updateReviewStatusAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["pending", "approved", "rejected"]).parse(
    formData.get("status"),
  );

  const { error } = await admin
    .from("reviews")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/products");
}

export async function updateMessageStatusAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["new", "read", "replied"]).parse(
    formData.get("status"),
  );

  const { error } = await admin
    .from("contact_messages")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
}

const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .transform((value) => value.toUpperCase()),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive(),
  minSubtotal: z.coerce.number().min(0).default(0),
  isActive: z.coerce.boolean().default(false),
});

export async function saveCouponAction(formData: FormData) {
  const admin = await requireAdminClient();
  const parsed = couponSchema.parse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    minSubtotal: formData.get("minSubtotal") || 0,
    isActive: formData.get("isActive") === "on",
  });

  const discountValue =
    parsed.type === "percentage"
      ? Math.round(parsed.value)
      : Math.round(parsed.value * 100);

  const { error } = await admin.from("coupons").upsert(
    {
      code: parsed.code,
      type: parsed.type,
      discount_value: discountValue,
      min_subtotal_cents: Math.round(parsed.minSubtotal * 100),
      is_active: parsed.isActive,
    },
    { onConflict: "code" },
  );

  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
}

export async function toggleCouponAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = z.string().uuid().parse(formData.get("id"));
  const isActive = formData.get("isActive") === "true";

  const { error } = await admin
    .from("coupons")
    .update({ is_active: !isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
}

export async function deleteCouponAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = z.string().uuid().parse(formData.get("id"));

  const { error } = await admin.from("coupons").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
}
