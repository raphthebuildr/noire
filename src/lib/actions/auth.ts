"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { siteUrl } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: string;
};

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.");

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export async function loginAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = z
    .object({
      email: emailSchema,
      password: z.string().min(1, "Enter your password."),
    })
    .safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: "Authentication is not configured yet." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Email or password is incorrect." };
  }

  redirect(safeNext(formData.get("next")));
}

export async function registerAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "Enter your full name."),
      email: emailSchema,
      password: z
        .string()
        .min(8, "Use at least 8 characters.")
        .max(72, "Use 72 characters or fewer."),
      confirmPassword: z.string(),
    })
    .safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: "Authentication is not configured yet." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect("/account");
  }

  return {
    success:
      "Check your inbox to confirm your email. Once confirmed, you can sign in.",
  };
}

export async function forgotPasswordAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: "Authentication is not configured yet." };
  }

  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  return {
    success:
      "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function resetPasswordAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = z
    .object({
      password: z
        .string()
        .min(8, "Use at least 8 characters.")
        .max(72, "Use 72 characters or fewer."),
      confirmPassword: z.string(),
    })
    .safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: "Authentication is not configured yet." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Your reset link may have expired. Request a new one." };
  }

  redirect("/account");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
