import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceConfig } from "@/lib/env";

export function createAdminClient() {
  const config = getSupabaseServiceConfig();
  if (!config) return null;

  return createClient(config.url, config.secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
