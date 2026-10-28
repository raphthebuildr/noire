import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  CheckoutError,
  createPendingOrder,
  initializePaystack,
  resolveCheckout,
} from "@/lib/checkout";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1),
        color: z.string().min(1),
        size: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(30),
  email: z.string().trim().toLowerCase().email(),
  address: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    line1: z.string().trim().min(3).max(160),
    line2: z.string().trim().max(160).optional(),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().min(3).max(20),
    country: z.string().trim().length(2).default("US"),
    phone: z.string().trim().max(40).optional(),
  }),
  shippingMethod: z.enum(["standard", "express"]),
  couponCode: z.string().trim().max(40).optional(),
  note: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message ??
          "Check your details and try again.",
      },
      { status: 400 },
    );
  }

  try {
    const user = await getCurrentUser();
    const resolved = await resolveCheckout({
      items: parsed.data.items,
      email: parsed.data.email,
      address: parsed.data.address,
      shippingMethod: parsed.data.shippingMethod,
      couponCode: parsed.data.couponCode,
      note: parsed.data.note,
    });

    const order = await createPendingOrder({
      input: {
        items: parsed.data.items,
        email: parsed.data.email,
        address: parsed.data.address,
        shippingMethod: parsed.data.shippingMethod,
        couponCode: parsed.data.couponCode,
        note: parsed.data.note,
      },
      resolved,
      userId: user?.id ?? null,
    });

    try {
      const payment = await initializePaystack({
        email: parsed.data.email,
        amountSubunits: resolved.paymentAmountSubunits,
        reference: order.orderNumber,
        orderId: order.id,
        orderNumber: order.orderNumber,
      });

      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        ...payment,
      });
    } catch (error) {
      const admin = createAdminClient();

      if (admin) {
        await admin
          .from("orders")
          .update({ status: "cancelled", payment_status: "failed" })
          .eq("id", order.id);

        await admin.from("order_events").insert({
          order_id: order.id,
          type: "payment_initialization_failed",
          message:
            error instanceof CheckoutError
              ? error.message
              : "Payment could not be initialized.",
        });
      }

      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof CheckoutError
            ? error.message
            : "Checkout failed. Please try again.",
      },
      { status: error instanceof CheckoutError ? 400 : 500 },
    );
  }
}
