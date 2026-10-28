import "server-only";

import { randomBytes } from "node:crypto";
import {
  CURRENCY,
  getNgnPerUsd,
  getPaystackConfig,
  PAYMENT_CURRENCY,
  siteUrl,
} from "@/lib/env";
import { getProductBySlug, getVariant, getVariantSku } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";

export type CheckoutItemInput = {
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
};

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type CheckoutInput = {
  items: CheckoutItemInput[];
  email: string;
  address: CheckoutAddress;
  shippingMethod: "standard" | "express";
  couponCode?: string;
  note?: string;
};

export type ResolvedItem = {
  productSlug: string;
  productName: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  imageUrl: string;
};

export type ResolvedCheckout = {
  items: ResolvedItem[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  paymentAmountSubunits: number;
  couponCode: string | null;
  shippingMethod: "standard" | "express";
};

export class CheckoutError extends Error {}

const DEMO_COUPONS: Record<
  string,
  { type: "percentage" | "fixed"; value: number; minSubtotalCents: number }
> = {
  NOIRE10: { type: "percentage", value: 10, minSubtotalCents: 0 },
};

export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;
export const STANDARD_SHIPPING_CENTS = 800;
export const EXPRESS_SHIPPING_CENTS = 1800;

function toPaymentSubunits(usdCents: number) {
  const rate = getNgnPerUsd();

  if (!rate) {
    throw new CheckoutError("The NGN conversion rate is not configured.");
  }

  return Math.round((usdCents / 100) * rate * 100);
}

async function findCoupon(code: string) {
  const admin = createAdminClient();

  if (admin) {
    const { data, error } = await admin
      .from("coupons")
      .select(
        "type, discount_value, min_subtotal_cents, is_active, starts_at, expires_at, max_redemptions, times_redeemed",
      )
      .eq("code", code)
      .maybeSingle();

    if (!error) {
      if (!data?.is_active) return null;

      const now = Date.now();

      if (data.starts_at && new Date(data.starts_at).getTime() > now) {
        return null;
      }

      if (data.expires_at && new Date(data.expires_at).getTime() < now) {
        return null;
      }

      if (
        data.max_redemptions !== null &&
        data.times_redeemed >= data.max_redemptions
      ) {
        return null;
      }

      return {
        type: data.type as "percentage" | "fixed",
        value: data.discount_value as number,
        minSubtotalCents: data.min_subtotal_cents as number,
      };
    }
  }

  return DEMO_COUPONS[code] ?? null;
}

export async function resolveCheckout(
  input: CheckoutInput,
): Promise<ResolvedCheckout> {
  if (input.items.length === 0) {
    throw new CheckoutError("Your bag is empty.");
  }

  const merged = new Map<string, CheckoutItemInput>();

  for (const item of input.items) {
    const key = `${item.productSlug}--${item.color}--${item.size}`;
    const existing = merged.get(key);
    merged.set(key, {
      ...item,
      quantity: (existing?.quantity ?? 0) + item.quantity,
    });
  }

  const items: ResolvedItem[] = [];
  let subtotalCents = 0;

  for (const item of merged.values()) {
    const product = getProductBySlug(item.productSlug);

    if (!product) {
      throw new CheckoutError("One of the pieces is no longer available.");
    }

    const variant = getVariant(product, item.color, item.size);

    if (!variant) {
      throw new CheckoutError(
        `${product.name} is not available in that colour and size.`,
      );
    }

    if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
      throw new CheckoutError("Quantities must be whole numbers.");
    }

    if (variant.stock < item.quantity) {
      throw new CheckoutError(
        `Only ${variant.stock} of ${product.name} / ${variant.color} / ${variant.size} remain.`,
      );
    }

    const unitPriceCents = Math.round(product.price * 100);
    const lineTotalCents = unitPriceCents * item.quantity;
    subtotalCents += lineTotalCents;

    items.push({
      productSlug: product.slug,
      productName: product.name,
      color: variant.color,
      size: variant.size,
      sku: getVariantSku(product, variant.color, variant.size),
      quantity: item.quantity,
      unitPriceCents,
      lineTotalCents,
      imageUrl:
        product.colors.find((colour) => colour.name === variant.color)?.image ??
        product.gallery[0]?.src ??
        "",
    });
  }

  const shippingCents =
    input.shippingMethod === "express"
      ? EXPRESS_SHIPPING_CENTS
      : subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
        ? 0
        : STANDARD_SHIPPING_CENTS;

  let couponCode: string | null = null;
  let discountCents = 0;

  if (input.couponCode?.trim()) {
    const code = input.couponCode.trim().toUpperCase();
    const coupon = await findCoupon(code);

    if (!coupon) {
      throw new CheckoutError("That coupon code is not valid.");
    }

    if (subtotalCents < coupon.minSubtotalCents) {
      throw new CheckoutError("Your order does not meet the coupon minimum.");
    }

    couponCode = code;
    discountCents =
      coupon.type === "percentage"
        ? Math.round((subtotalCents * coupon.value) / 100)
        : coupon.value;
    discountCents = Math.min(discountCents, subtotalCents);
  }

  const taxCents = 0;
  const totalCents = Math.max(
    0,
    subtotalCents - discountCents + shippingCents + taxCents,
  );

  return {
    items,
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents,
    paymentAmountSubunits: toPaymentSubunits(totalCents),
    couponCode,
    shippingMethod: input.shippingMethod,
  };
}

function generateOrderNumber() {
  const date = new Date();
  const stamp = [
    String(date.getUTCFullYear()).slice(2),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("");
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `NOIRE-${stamp}-${suffix}`;
}

export async function createPendingOrder({
  input,
  resolved,
  userId,
}: {
  input: CheckoutInput;
  resolved: ResolvedCheckout;
  userId: string | null;
}) {
  const admin = createAdminClient();

  if (!admin) {
    throw new CheckoutError("Checkout is not configured yet.");
  }

  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: userId,
      email: input.email,
      status: "pending",
      payment_status: "pending",
      currency: CURRENCY,
      payment_currency: PAYMENT_CURRENCY,
      payment_amount_subunits: resolved.paymentAmountSubunits,
      subtotal_cents: resolved.subtotalCents,
      shipping_cents: resolved.shippingCents,
      discount_cents: resolved.discountCents,
      tax_cents: resolved.taxCents,
      total_cents: resolved.totalCents,
      coupon_code: resolved.couponCode,
      shipping_method: resolved.shippingMethod,
      shipping_address: input.address,
      billing_address: input.address,
      customer_note: input.note || null,
      paystack_reference: orderNumber,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    throw new CheckoutError("We could not create your order. Please try again.");
  }

  const { data: variants } = await admin
    .from("product_variants")
    .select("id, product_id, sku")
    .in(
      "sku",
      resolved.items.map((item) => item.sku),
    );

  const variantsBySku = new Map(
    (variants ?? []).map((variant) => [variant.sku as string, variant]),
  );

  const { error: itemsError } = await admin.from("order_items").insert(
    resolved.items.map((item) => {
      const variant = variantsBySku.get(item.sku);

      return {
        order_id: order.id,
        product_id: variant?.product_id ?? null,
        variant_id: variant?.id ?? null,
        product_name: item.productName,
        variant_label: `${item.color} / ${item.size}`,
        sku: item.sku,
        unit_price_cents: item.unitPriceCents,
        quantity: item.quantity,
        line_total_cents: item.lineTotalCents,
        image_url: item.imageUrl,
      };
    }),
  );

  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    throw new CheckoutError("We could not create your order. Please try again.");
  }

  await admin.from("order_events").insert({
    order_id: order.id,
    type: "order_created",
    message: "Order created and awaiting payment.",
  });

  return { id: order.id as string, orderNumber: order.order_number as string };
}

export async function initializePaystack({
  email,
  amountSubunits,
  reference,
  orderId,
  orderNumber,
}: {
  email: string;
  amountSubunits: number;
  reference: string;
  orderId: string;
  orderNumber: string;
}) {
  const config = getPaystackConfig();

  if (!config) {
    throw new CheckoutError("Payments are not configured yet.");
  }

  if (amountSubunits < 200) {
    throw new CheckoutError("Order total is below Paystack's minimum.");
  }

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountSubunits,
        currency: PAYMENT_CURRENCY,
        reference,
        callback_url: `${siteUrl}/checkout/callback`,
        metadata: {
          order_id: orderId,
          order_number: orderNumber,
          custom_fields: [
            {
              display_name: "Order",
              variable_name: "order_number",
              value: orderNumber,
            },
          ],
        },
      }),
      cache: "no-store",
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | {
        status?: boolean;
        message?: string;
        data?: {
          authorization_url?: string;
          access_code?: string;
          reference?: string;
        };
      }
    | null;

  if (!response.ok || !payload?.status || !payload.data) {
    throw new CheckoutError(
      payload?.message ??
        "Paystack could not start this payment. Check that NGN is enabled.",
    );
  }

  const admin = createAdminClient();

  if (admin) {
    await admin
      .from("orders")
      .update({
        paystack_access_code: payload.data.access_code ?? null,
      })
      .eq("id", orderId);
  }

  return {
    authorizationUrl: payload.data.authorization_url ?? "",
    accessCode: payload.data.access_code ?? "",
    reference: payload.data.reference ?? reference,
    publicKey: config.publicKey,
  };
}

export async function verifyPaystackReference(reference: string) {
  const config = getPaystackConfig();
  const admin = createAdminClient();

  if (!config || !admin) {
    return {
      ok: false as const,
      message: "Payments are not configured yet.",
    };
  }

  const { data: order } = await admin
    .from("orders")
    .select(
      "id, order_number, total_cents, payment_amount_subunits, payment_status",
    )
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (!order) {
    return { ok: false as const, message: "Order not found." };
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
      },
      cache: "no-store",
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | {
        status?: boolean;
        message?: string;
        data?: {
          status?: string;
          amount?: number;
          currency?: string;
          reference?: string;
        };
      }
    | null;

  if (!response.ok || !payload?.status || !payload.data) {
    return {
      ok: false as const,
      message: payload?.message ?? "Could not verify the payment.",
    };
  }

  if (payload.data.status !== "success") {
    if (payload.data.status === "failed") {
      await admin.rpc("finalize_order", {
        p_reference: reference,
        p_paid: false,
      });
    }

    return {
      ok: false as const,
      message:
        payload.data.status === "failed"
          ? "The payment was not successful."
          : "The payment is still being confirmed.",
    };
  }

  if (
    payload.data.amount !== order.payment_amount_subunits ||
    (payload.data.currency && payload.data.currency !== PAYMENT_CURRENCY)
  ) {
    return {
      ok: false as const,
      message: "The payment amount did not match the order total.",
    };
  }

  const { data: result, error } = await admin.rpc("finalize_order", {
    p_reference: reference,
    p_paid: true,
  });

  if (error) {
    return { ok: false as const, message: "Could not finalize the order." };
  }

  const finalized = result as {
    ok?: boolean;
    order_number?: string;
    paid_out_of_stock?: boolean;
    reason?: string;
  } | null;

  if (!finalized?.ok) {
    return {
      ok: false as const,
      message: "Could not finalize the order.",
    };
  }

  return {
    ok: true as const,
    orderNumber: finalized.order_number ?? order.order_number,
    paidOutOfStock: finalized.paid_out_of_stock ?? false,
  };
}
