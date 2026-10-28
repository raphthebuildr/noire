import type { Metadata } from "next";
import {
  CheckoutForm,
  type SavedAddress,
} from "@/components/commerce/checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your NOIRÉ order securely with Paystack.",
};

type SearchParams = Promise<{ coupon?: string | string[] }>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const coupon = Array.isArray(params.coupon)
    ? params.coupon[0]
    : params.coupon;
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  let defaultAddress: SavedAddress | null = null;

  if (supabase && user) {
    const { data } = await supabase
      .from("addresses")
      .select(
        "first_name, last_name, line1, line2, city, state, postal_code, country, phone",
      )
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle();

    defaultAddress = data;
  }

  return (
    <CheckoutForm
      defaultEmail={user?.email}
      defaultAddress={defaultAddress}
      defaultCoupon={coupon}
    />
  );
}
