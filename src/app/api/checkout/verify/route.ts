import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPaystackReference } from "@/lib/checkout";

const schema = z.object({
  reference: z.string().trim().min(3).max(120),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "A valid payment reference is required." },
      { status: 400 },
    );
  }

  const result = await verifyPaystackReference(parsed.data.reference);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({
    orderNumber: result.orderNumber,
    paidOutOfStock: result.paidOutOfStock,
  });
}
