import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Reads the env vars if they exist.
 * These must be present in production, but during a local/preview
 * build we fall back to `null` so the app doesn’t crash.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

if (!supabase) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars are missing – add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
  )
}
