import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { verifyPaystackReference } from "@/lib/checkout";
import { getPaystackConfig } from "@/lib/env";

export async function POST(request: Request) {
  const config = getPaystackConfig();

  if (!config) {
    return NextResponse.json(
      { message: "Payments are not configured." },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", config.secretKey)
    .update(rawBody)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
  }

  const payload = (() => {
    try {
      return JSON.parse(rawBody) as {
        event?: string;
        data?: { reference?: string; status?: string };
      };
    } catch {
      return null;
    }
  })();

  if (
    payload &&
    (payload.event === "charge.success" ||
      payload.event === "charge.failed") &&
    payload.data?.reference
  ) {
    await verifyPaystackReference(payload.data.reference);
  }

  return NextResponse.json({ received: true });
}
