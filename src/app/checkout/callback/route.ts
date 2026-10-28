import { NextResponse } from "next/server";
import { verifyPaystackReference } from "@/lib/checkout";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference =
    url.searchParams.get("reference") ?? url.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(
      new URL("/checkout/failure?reason=missing-reference", url.origin),
    );
  }

  const result = await verifyPaystackReference(reference);

  if (!result.ok) {
    const failure = new URL("/checkout/failure", url.origin);
    failure.searchParams.set("reference", reference);
    failure.searchParams.set("message", result.message);
    return NextResponse.redirect(failure);
  }

  const success = new URL("/checkout/success", url.origin);
  success.searchParams.set("reference", reference);
  if (result.paidOutOfStock) {
    success.searchParams.set("stock", "1");
  }

  return NextResponse.redirect(success);
}
