import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/env";

export async function createServerSupabaseClient(
  options: { remember?: boolean } = {},
) {
  const config = getSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
            cookieStore.set(name, value, {
              ...cookieOptions,
              ...(options.remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
            });
          });
        } catch {
          return;
        }
      },
    },
  });
}
