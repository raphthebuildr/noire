"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProfileState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _previous: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();

  if (!user || !supabase) {
    return { error: "You need to be signed in." };
  }

  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "Enter your full name.").max(120),
      phone: z.string().trim().max(40).optional(),
    })
    .safeParse({
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: "We could not update your details. Please try again." };
  }

  await supabase.auth.updateUser({
    data: { full_name: parsed.data.fullName },
  });

  revalidatePath("/account");
  revalidatePath("/account/settings");

  return { success: "Your details have been updated." };
}
