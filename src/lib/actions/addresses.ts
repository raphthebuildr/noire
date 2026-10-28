"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AddressState = {
  error?: string;
  success?: string;
};

const addressSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  label: z.string().trim().max(60).optional(),
  firstName: z.string().trim().min(1, "Enter a first name.").max(80),
  lastName: z.string().trim().min(1, "Enter a last name.").max(80),
  line1: z.string().trim().min(3, "Enter a street address.").max(160),
  line2: z.string().trim().max(160).optional(),
  city: z.string().trim().min(1, "Enter a city.").max(100),
  state: z.string().trim().min(1, "Enter a state.").max(100),
  postalCode: z.string().trim().min(3, "Enter a postal code.").max(20),
  country: z.string().trim().min(2).max(2).default("US"),
  phone: z.string().trim().max(40).optional(),
  isDefault: z.boolean().default(false),
});

export async function saveAddressAction(
  _previous: AddressState,
  formData: FormData,
): Promise<AddressState> {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();

  if (!user || !supabase) {
    return { error: "You need to be signed in to save an address." };
  }

  const parsed = addressSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    label: String(formData.get("label") ?? ""),
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    line1: String(formData.get("line1") ?? ""),
    line2: String(formData.get("line2") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
    country: String(formData.get("country") ?? "US"),
    phone: String(formData.get("phone") ?? ""),
    isDefault: formData.get("isDefault") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the address." };
  }

  const values = {
    user_id: user.id,
    label: parsed.data.label || null,
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    city: parsed.data.city,
    state: parsed.data.state,
    postal_code: parsed.data.postalCode,
    country: parsed.data.country.toUpperCase(),
    phone: parsed.data.phone || null,
    is_default: parsed.data.isDefault,
  };

  if (values.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);
  }

  const result = parsed.data.id
    ? await supabase
        .from("addresses")
        .update(values)
        .eq("id", parsed.data.id)
        .eq("user_id", user.id)
    : await supabase.from("addresses").insert(values);

  if (result.error) {
    return { error: "We could not save that address. Please try again." };
  }

  revalidatePath("/account/addresses");
  return { success: "Address saved." };
}

export async function deleteAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id") ?? "");

  if (!user || !supabase || !id) return;

  await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/account/addresses");
}

export async function setDefaultAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id") ?? "");

  if (!user || !supabase || !id) return;

  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id)
    .eq("is_default", true);

  await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/account/addresses");
}
