import "server-only";

import { connection } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  await connection();
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}

export function isAdminUser(user: {
  app_metadata?: Record<string, unknown>;
} | null) {
  return user?.app_metadata?.role === "admin";
}

export async function getAdminUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (isAdminUser(user)) return user;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data?.role === "admin" ? user : null;
}
